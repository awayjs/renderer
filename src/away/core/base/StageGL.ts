///<reference path="../../_definitions.ts"/>

module away.base
{
	/**
	 * StageGL provides a proxy class to handle the creation and attachment of the ContextGL
	 * (and in turn the back buffer) it uses. StageGL should never be created directly,
	 * but requested through StageGLManager.
	 *
	 * @see away.managers.StageGLManager
	 *
	 * todo: consider moving all creation methods (createVertexBuffer etc) in here, so that disposal can occur here
	 * along with the context, instead of scattered throughout the framework
	 */
	export class StageGL extends away.events.EventDispatcher implements IStage
	{
		private _texturePool:away.pool.TextureDataPool;

		private _contextGL:away.gl.ContextGL;
		private _canvas:HTMLCanvasElement;
		private _width:number;
		private _height:number;
		private _x:number = 0;
		private _y:number = 0;

		//private static _frameEventDriver:Shape = new Shape(); // TODO: add frame driver / request animation frame

		public _iStageGLIndex:number = -1;

		private _usesSoftwareRendering:boolean;
		private _profile:string;
		private _activeProgram:away.gl.Program;
		private _stageGLManager:away.managers.StageGLManager;
		private _antiAlias:number = 0;
		private _enableDepthAndStencil:boolean;
		private _contextRequested:boolean;

		//private var _activeVertexBuffers : Vector.<VertexBuffer> = new Vector.<VertexBuffer>(8, true);
		//private var _activeTextures : Vector.<TextureBase> = new Vector.<TextureBase>(8, true);
		private _renderTarget:away.textures.TextureProxyBase = null;
		private _renderSurfaceSelector:number = 0;
		private _scissorRect:away.geom.Rectangle;
		private _color:number;
		private _backBufferDirty:boolean;
		private _viewPort:away.geom.Rectangle;
		private _enterFrame:away.events.Event;
		private _exitFrame:away.events.Event;
		private _viewportUpdated:away.events.StageGLEvent;
		private _viewportDirty:boolean;
		private _bufferClear:boolean;
		//private _mouse3DManager:away.managers.Mouse3DManager;
		//private _touch3DManager:Touch3DManager; //TODO: imeplement dependency Touch3DManager

		private _initialised:boolean = false;

		constructor(canvas:HTMLCanvasElement, stageGLIndex:number, stageGLManager:away.managers.StageGLManager, forceSoftware:boolean = false, profile:string = "baseline")
		{
			super();

			this._texturePool = new away.pool.TextureDataPool(this);

			this._canvas = canvas;

			this._iStageGLIndex = stageGLIndex;

			this._stageGLManager = stageGLManager;

			this._viewPort = new away.geom.Rectangle();

			this._enableDepthAndStencil = true;

			away.utils.CSS.setCanvasX(this._canvas, 0);
			away.utils.CSS.setCanvasY(this._canvas, 0);

			this.visible = true;
		}

		/**
		 * Requests a ContextGL object to attach to the managed gl canvas.
		 */
		public requestContext(aglslContext:boolean = false, forceSoftware:boolean = false, profile:string = "baseline")
		{
			// If forcing software, we can be certain that the
			// returned ContextGL will be running software mode.
			// If not, we can't be sure and should stick to the
			// old value (will likely be same if re-requesting.)

			if (this._usesSoftwareRendering != null)
				this._usesSoftwareRendering = forceSoftware;

			this._profile = profile;

			try {
				if (aglslContext)
					this._contextGL = new away.gl.AGLSLContextGL(this._canvas);
				else
					this._contextGL = new away.gl.ContextGL(this._canvas);

			} catch (e) {
				this.dispatchEvent(new away.events.Event(away.events.Event.ERROR));
			}

			if (this._contextGL) {
				// Only configure back buffer if width and height have been set,
				// which they may not have been if View.render() has yet to be
				// invoked for the first time.
				if (this._width && this._height)
					this._contextGL.configureBackBuffer(this._width, this._height, this._antiAlias, this._enableDepthAndStencil);

				// Dispatch the appropriate event depending on whether context was
				// created for the first time or recreated after a device loss.
				this.dispatchEvent(new away.events.StageGLEvent(this._initialised? away.events.StageGLEvent.CONTEXTGL_RECREATED : away.events.StageGLEvent.CONTEXTGL_CREATED));

				this._initialised = true;
			}
		}

		/**
		 * The width of the gl canvas
		 */
		public set width(val:number)
		{
			if (this._width == val)
				return;

			away.utils.CSS.setCanvasWidth(this._canvas, val);

			this._width = this._viewPort.width = val;

			this._backBufferDirty = true;

			this.notifyViewportUpdated();
		}

		public get width()
		{
			return this._width;
		}

		/**
		 * The height of the gl canvas
		 */
		public set height(val:number)
		{
			if (this._height == val)
				return;

			away.utils.CSS.setCanvasHeight(this._canvas, val);

			this._height = this._viewPort.height = val;

			this._backBufferDirty = true;

			this.notifyViewportUpdated();
		}

		public get height()
		{
			return this._height;
		}

		/**
		 * The x position of the gl canvas
		 */
		public set x(val:number)
		{
			if (this._x == val)
				return;

			away.utils.CSS.setCanvasX(this._canvas, val);

			this._x = this._viewPort.x = val;

			this.notifyViewportUpdated();
		}

		public get x()
		{
			return this._x;
		}

		/**
		 * The y position of the gl canvas
		 */
		public set y(val:number)
		{
			if (this._y == val)
				return;

			away.utils.CSS.setCanvasY(this._canvas, val);

			this._y = this._viewPort.y = val;

			this.notifyViewportUpdated();
		}

		public get y()
		{
			return this._y;
		}

		public set visible(val:boolean)
		{
			away.utils.CSS.setCanvasVisibility(this._canvas, val);
		}

		public get visible()
		{
			return away.utils.CSS.getCanvasVisibility(this._canvas);
		}

		public get canvas():HTMLCanvasElement
		{
			return this._canvas;
		}

		/**
		 * The ContextGL object associated with the given gl canvas object.
		 */
		public get contextGL():away.gl.ContextGL
		{
			return this._contextGL;
		}

		private notifyViewportUpdated()
		{
			if (this._viewportDirty)
				return;

			this._viewportDirty = true;

			//if (!this.hasEventListener(away.events.StageGLEvent.VIEWPORT_UPDATED))
			//return;

			//if (!_viewportUpdated)
			this._viewportUpdated = new away.events.StageGLEvent(away.events.StageGLEvent.VIEWPORT_UPDATED);

			this.dispatchEvent(this._viewportUpdated);
		}

		private notifyEnterFrame()
		{
			//if (!hasEventListener(Event.ENTER_FRAME))
			//return;

			if (!this._enterFrame)
				this._enterFrame = new away.events.Event(away.events.Event.ENTER_FRAME);

			this.dispatchEvent(this._enterFrame);

		}

		private notifyExitFrame()
		{
			//if (!hasEventListener(Event.EXIT_FRAME))
			//return;

			if (!this._exitFrame)
				this._exitFrame = new away.events.Event(away.events.Event.EXIT_FRAME);

			this.dispatchEvent(this._exitFrame);
		}

		public get profile():string
		{
			return this._profile;
		}

		/**
		 * Disposes the StageGL object, freeing the ContextGL attached to the StageGL.
		 */
		public dispose()
		{
			this._stageGLManager.iRemoveStageGL(this);
			this.freeContextGL();
			this._stageGLManager = null;
			this._iStageGLIndex = -1;
		}

		/**
		 * Configures the back buffer associated with the StageGL object.
		 * @param backBufferWidth The width of the backbuffer.
		 * @param backBufferHeight The height of the backbuffer.
		 * @param antiAlias The amount of anti-aliasing to use.
		 * @param enableDepthAndStencil Indicates whether the back buffer contains a depth and stencil buffer.
		 */
		public configureBackBuffer(backBufferWidth:number, backBufferHeight:number, antiAlias:number, enableDepthAndStencil:boolean)
		{
			this.width = backBufferWidth;
			this.height = backBufferHeight;

			this._antiAlias = antiAlias;
			this._enableDepthAndStencil = enableDepthAndStencil;

			if (this._contextGL)
				this._contextGL.configureBackBuffer(backBufferWidth, backBufferHeight, antiAlias, enableDepthAndStencil);
		}

		/*
		 * Indicates whether the depth and stencil buffer is used
		 */
		public get enableDepthAndStencil():boolean
		{
			return this._enableDepthAndStencil;
		}

		public set enableDepthAndStencil(enableDepthAndStencil:boolean)
		{
			this._enableDepthAndStencil = enableDepthAndStencil;
			this._backBufferDirty = true;
		}

		public get renderTarget():away.textures.TextureProxyBase
		{
			return this._renderTarget;
		}

		public get renderSurfaceSelector():number
		{
			return this._renderSurfaceSelector;
		}

		public setRenderTarget(target:away.textures.TextureProxyBase, enableDepthAndStencil:boolean = false, surfaceSelector:number = 0)
		{
			if (this._renderTarget === target && surfaceSelector == this._renderSurfaceSelector && this._enableDepthAndStencil == enableDepthAndStencil)
				return;

			this._renderTarget = target;
			this._renderSurfaceSelector = surfaceSelector;
			this._enableDepthAndStencil = enableDepthAndStencil;
			if (target instanceof away.textures.RenderTexture) {
				this._contextGL.setRenderToTexture(this.getRenderTexture(<away.textures.RenderTexture> target), enableDepthAndStencil, this._antiAlias, surfaceSelector);
			} else {
				this._contextGL.setRenderToBackBuffer();
				this.configureBackBuffer(this._width, this._height, this._antiAlias, this._enableDepthAndStencil);
			}
		}

		public getRenderTexture(textureProxy:away.textures.RenderTexture):away.gl.TextureBase
		{
			var textureData:away.pool.TextureData = <away.pool.TextureData> this._texturePool.getItem(textureProxy);

			if (!textureData.texture) {
				textureData.texture = this._contextGL.createTexture(textureProxy.width, textureProxy.height, away.gl.ContextGLTextureFormat.BGRA, true);
				textureData.invalid = true;
			}

			if (textureData.invalid) {
				textureData.invalid = false;
				// fake data, to complete texture for sampling
				(<away.gl.Texture> textureData.texture).generateFromRenderBuffer();
			}

			return textureData.texture;
		}

		/*
		 * Clear and reset the back buffer when using a shared context
		 */
		public clear()
		{
			if (!this._contextGL)
				return;

			if (this._backBufferDirty) {
				this.configureBackBuffer(this._width, this._height, this._antiAlias, this._enableDepthAndStencil);
				this._backBufferDirty = false;
			}

			this._contextGL.clear(( this._color & 0xff000000 ) >>> 24, // <--------- Zero-fill right shift
								  ( this._color & 0xff0000 ) >>> 16, // <-------------|
								  ( this._color & 0xff00 ) >>> 8, // <----------------|
									this._color & 0xff);

			this._bufferClear = true;
		}

		/*
		 * Display the back rendering buffer
		 */
		public present()
		{
			if (!this._contextGL)
				return;

			this._contextGL.present();

			this._activeProgram = null;

			//if (this._mouse3DManager)
			//	this._mouse3DManager.fireMouseEvents();
		}

		/**
		 * Registers an event listener object with an EventDispatcher object so that the listener receives notification of an event. Special case for enterframe and exitframe events - will switch StageGLProxy into automatic render mode.
		 * You can register event listeners on all nodes in the display list for a specific type of event, phase, and priority.
		 *
		 * @param type The type of event.
		 * @param listener The listener function that processes the event.
		 * @param useCapture Determines whether the listener works in the capture phase or the target and bubbling phases. If useCapture is set to true, the listener processes the event only during the capture phase and not in the target or bubbling phase. If useCapture is false, the listener processes the event only during the target or bubbling phase. To listen for the event in all three phases, call addEventListener twice, once with useCapture set to true, then again with useCapture set to false.
		 * @param priority The priority level of the event listener. The priority is designated by a signed 32-bit integer. The higher the number, the higher the priority. All listeners with priority n are processed before listeners of priority n-1. If two or more listeners share the same priority, they are processed in the order in which they were added. The default priority is 0.
		 * @param useWeakReference Determines whether the reference to the listener is strong or weak. A strong reference (the default) prevents your listener from being garbage-collected. A weak reference does not.
		 */
			//public override function addEventListener(type:string, listener, useCapture:boolean = false, priority:number = 0, useWeakReference:boolean = false)
		public addEventListener(type:string, listener:Function)
		{
			super.addEventListener(type, listener);//useCapture, priority, useWeakReference);

			//away.Debug.throwPIR( 'StageGLProxy' , 'addEventListener' ,  'EnterFrame, ExitFrame');

			//if ((type == away.events.Event.ENTER_FRAME || type == away.events.Event.EXIT_FRAME) ){//&& ! this._frameEventDriver.hasEventListener(Event.ENTER_FRAME)){

			//_frameEventDriver.addEventListener(Event.ENTER_FRAME, onEnterFrame, useCapture, priority, useWeakReference);

			//}

			/* Original code
			 if ((type == Event.ENTER_FRAME || type == Event.EXIT_FRAME) && ! _frameEventDriver.hasEventListener(Event.ENTER_FRAME)){

			 _frameEventDriver.addEventListener(Event.ENTER_FRAME, onEnterFrame, useCapture, priority, useWeakReference);


			 }
			 */
		}

		/**
		 * Removes a listener from the EventDispatcher object. Special case for enterframe and exitframe events - will switch StageGLProxy out of automatic render mode.
		 * If there is no matching listener registered with the EventDispatcher object, a call to this method has no effect.
		 *
		 * @param type The type of event.
		 * @param listener The listener object to remove.
		 * @param useCapture Specifies whether the listener was registered for the capture phase or the target and bubbling phases. If the listener was registered for both the capture phase and the target and bubbling phases, two calls to removeEventListener() are required to remove both, one call with useCapture() set to true, and another call with useCapture() set to false.
		 */
		public removeEventListener(type:string, listener:Function)
			//public override function removeEventListener(type:string, listener, useCapture:boolean = false)
		{
			super.removeEventListener(type, listener);

			//away.Debug.throwPIR( 'StageGLProxy' , 'removeEventListener' ,  'EnterFrame, ExitFrame');

			/*
			 // Remove the main rendering listener if no EnterFrame listeners remain
			 if (    ! this.hasEventListener(away.events.Event.ENTER_FRAME , this.onEnterFrame , this )
			 &&  ! this.hasEventListener(away.events.Event.EXIT_FRAME , this.onEnterFrame , this) ) //&& _frameEventDriver.hasEventListener(Event.ENTER_FRAME))
			 {

			 //_frameEventDriver.removeEventListener(Event.ENTER_FRAME, this.onEnterFrame, this );

			 }
			 */
		}

		public get scissorRect():away.geom.Rectangle
		{
			return this._scissorRect;
		}

		public set scissorRect(value:away.geom.Rectangle)
		{
			this._scissorRect = value;

			this._contextGL.setScissorRectangle(this._scissorRect);
		}

		/**
		 * The index of the StageGL which is managed by this instance of StageGLProxy.
		 */
		public get stageGLIndex():number
		{
			return this._iStageGLIndex;
		}

		/**
		 * Indicates whether the StageGL managed by this proxy is running in software mode.
		 * Remember to wait for the CONTEXTGL_CREATED event before checking this property,
		 * as only then will it be guaranteed to be accurate.
		 */
		public get usesSoftwareRendering():boolean
		{
			return this._usesSoftwareRendering;
		}

		/**
		 * The antiAliasing of the StageGL.
		 */
		public get antiAlias():number
		{
			return this._antiAlias;
		}

		public set antiAlias(antiAlias:number)
		{
			this._antiAlias = antiAlias;
			this._backBufferDirty = true;
		}

		/**
		 * A viewPort rectangle equivalent of the StageGL size and position.
		 */
		public get viewPort():away.geom.Rectangle
		{
			this._viewportDirty = false;

			return this._viewPort;
		}

		/**
		 * The background color of the StageGL.
		 */
		public get color():number
		{
			return this._color;
		}

		public set color(color:number)
		{
			this._color = color;
		}

		/**
		 * The freshly cleared state of the backbuffer before any rendering
		 */
		public get bufferClear():boolean
		{
			return this._bufferClear;
		}

		public set bufferClear(newBufferClear:boolean)
		{
			this._bufferClear = newBufferClear;
		}

		/**
		 * Assigns an attribute stream
		 *
		 * @param index The attribute stream index for the vertex shader
		 * @param buffer
		 * @param offset
		 * @param stride
		 * @param format
		 */
		public activateBuffer(index:number, buffer:away.pool.VertexData, offset:number, format:string)
		{
			if (!buffer.stageGLs[this._iStageGLIndex])
				buffer.stageGLs[this._iStageGLIndex] = this;

			if (!buffer.buffers[this._iStageGLIndex]) {
				buffer.buffers[this._iStageGLIndex] = this._contextGL.createVertexBuffer(buffer.data.length/buffer.dataPerVertex, buffer.dataPerVertex);
				buffer.invalid[this._iStageGLIndex] = true;
			}

			if (buffer.invalid[this._iStageGLIndex]) {
				buffer.buffers[this._iStageGLIndex].uploadFromArray(buffer.data, 0, buffer.data.length/buffer.dataPerVertex);
				buffer.invalid[this._iStageGLIndex] = false;
			}

			this._contextGL.setVertexBufferAt(index, buffer.buffers[this._iStageGLIndex], offset, format);
		}

		public disposeVertexData(buffer:away.pool.VertexData)
		{
			buffer.buffers[this._iStageGLIndex].dispose();
			buffer.buffers[this._iStageGLIndex] = null;
		}

		public activateRenderTexture(index:number, textureProxy:away.textures.RenderTexture)
		{
			this._contextGL.setTextureAt(index, this.getRenderTexture(textureProxy));
		}

		public activateTexture(index:number, textureProxy:away.textures.Texture2DBase)
		{
			var textureData:away.pool.TextureData = <away.pool.TextureData> this._texturePool.getItem(textureProxy);

			if (!textureData.texture) {
				textureData.texture = this._contextGL.createTexture(textureProxy.width, textureProxy.height, away.gl.ContextGLTextureFormat.BGRA, true);
				textureData.invalid = true;
			}

			if (textureData.invalid) {
				textureData.invalid = false;
				if (textureProxy.generateMipmaps) {
					var mipmapData:Array<away.base.BitmapData> = textureProxy._iGetMipmapData();
					var len:number = mipmapData.length;
					for (var i:number = 0; i < len; i++)
						(<away.gl.Texture> textureData.texture).uploadFromData(mipmapData[i], i);
				} else {
					(<away.gl.Texture> textureData.texture).uploadFromData(textureProxy._iGetTextureData(), 0);
				}
			}

			this._contextGL.setTextureAt(index, textureData.texture);
		}

		public activateCubeTexture(index:number, textureProxy:away.textures.CubeTextureBase)
		{
			var textureData:away.pool.TextureData = <away.pool.TextureData> this._texturePool.getItem(textureProxy);

			if (!textureData.texture) {
				textureData.texture = this._contextGL.createCubeTexture(textureProxy.size, away.gl.ContextGLTextureFormat.BGRA, false);
				textureData.invalid = true;
			}

			if (textureData.invalid) {
				textureData.invalid = false;
				for (var i:number = 0; i < 6; ++i) {
					if (textureProxy.generateMipmaps) {
						var mipmapData:Array<away.base.BitmapData> = textureProxy._iGetMipmapData(i);
						var len:number = mipmapData.length;
						for (var j:number = 0; j < len; j++)
							(<away.gl.CubeTexture> textureData.texture).uploadFromData(mipmapData[j], i, j);
					} else {
						(<away.gl.CubeTexture> textureData.texture).uploadFromData(textureProxy._iGetTextureData(i), i, 0);
					}
				}
			}

			this._contextGL.setTextureAt(index, textureData.texture);
		}

		/**
		 * Retrieves the VertexBuffer object that contains triangle indices.
		 * @param context The ContextGL for which we request the buffer
		 * @return The VertexBuffer object that contains triangle indices.
		 */
		public getIndexBuffer(buffer:away.pool.IndexData):away.gl.IndexBuffer
		{
			if (!buffer.stageGLs[this._iStageGLIndex])
				buffer.stageGLs[this._iStageGLIndex] = this;

			if (!buffer.buffers[this._iStageGLIndex]) {
				buffer.buffers[this._iStageGLIndex] = this._contextGL.createIndexBuffer(buffer.data.length/3);
				buffer.invalid[this._iStageGLIndex] = true;
			}

			if (buffer.invalid[this._iStageGLIndex]) {
				buffer.buffers[this._iStageGLIndex].uploadFromArray(buffer.data, 0, buffer.data.length/3);
				buffer.invalid[this._iStageGLIndex] = false;
			}

			return buffer.buffers[this._iStageGLIndex];
		}

		public disposeIndexData(buffer:away.pool.IndexData)
		{
			buffer.buffers[this._iStageGLIndex].dispose();
			buffer.buffers[this._iStageGLIndex] = null;
		}

		/*
		 * Access to fire mouseevents across multiple layered view3D instances
		 */
		//		public get mouse3DManager():Mouse3DManager
		//		{
		//			return this._mouse3DManager;
		//		}
		//
		//		public set mouse3DManager(value:Mouse3DManager)
		//		{
		//			this._mouse3DManager = value;
		//		}

		/* TODO: implement dependency Touch3DManager
		 public get touch3DManager():Touch3DManager
		 {
		 return _touch3DManager;
		 }

		 public set touch3DManager(value:Touch3DManager)
		 {
		 _touch3DManager = value;
		 }
		 */

		/**
		 * Frees the ContextGL associated with this StageGLProxy.
		 */
		private freeContextGL()
		{
			if (this._contextGL) {
				this._contextGL.dispose();

				this.dispatchEvent(new away.events.StageGLEvent(away.events.StageGLEvent.CONTEXTGL_DISPOSED));
			}

			this._contextGL = null;

			this._initialised = false;
		}

		/**
		 * The Enter_Frame handler for processing the proxy.ENTER_FRAME and proxy.EXIT_FRAME event handlers.
		 * Typically the proxy.ENTER_FRAME listener would render the layers for this StageGL instance.
		 */
		private onEnterFrame(event:Event)
		{
			if (!this._contextGL)
				return;

			// Clear the stageGL instance
			this.clear();
			//notify the enterframe listeners
			this.notifyEnterFrame();
			// Call the present() to render the frame
			this.present();
			//notify the exitframe listeners
			this.notifyExitFrame();
		}

		public recoverFromDisposal():boolean
		{
			if (!this._contextGL)
				return false;

			//away.Debug.throwPIR( 'StageGLProxy' , 'recoverFromDisposal' , '' );

			/*
			 if (this._iContextGL.driverInfo == "Disposed")
			 {
			 this._iContextGL = null;
			 this.dispatchEvent(new away.events.StageGLEvent(away.events.StageGLEvent.CONTEXTGL_DISPOSED));
			 return false;

			 }
			 */
			return true;

		}

		public clearDepthBuffer()
		{
			if (!this._contextGL)
				return;

			this._contextGL.clear(0, 0, 0, 1, 1, 0, away.gl.ContextGLClearMask.DEPTH);
		}
	}
}