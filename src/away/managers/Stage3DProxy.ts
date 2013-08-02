
///<reference path="../_definitions.ts"/>

module away.managers
{
	//import away3d.arcane;
	//import away3d.debug.Debug;
	//import away3d.events.Stage3DEvent;
	
	//import flash.display.Shape;
	//import flash.display.Stage3D;
	//import flash.display3D.Context3D;
	//import flash.display3D.Context3DClearMask;
	//import flash.display3D.Context3DRenderMode;
	//import flash.display3D.Program3D;
	//import flash.display3D.textures.TextureBase;
	//import flash.events.Event;
	//import flash.events.EventDispatcher;
	//import flash.geom.Rectangle;
	
	//use namespace arcane;
	
	//[Event(name="enterFrame", type="flash.events.Event")]
	//[Event(name="exitFrame", type="flash.events.Event")]
	
	/**
	 * Stage3DProxy provides a proxy class to manage a single Stage3D instance as well as handling the creation and
	 * attachment of the Context3D (and in turn the back buffer) is uses. Stage3DProxy should never be created directly,
	 * but requested through Stage3DManager.
	 *
	 * @see away3d.core.managers.Stage3DProxy
	 *
	 * todo: consider moving all creation methods (createVertexBuffer etc) in here, so that disposal can occur here
	 * along with the context, instead of scattered throughout the framework
	 */
	export class Stage3DProxy extends away.events.EventDispatcher
	{
		//private static _frameEventDriver:Shape = new Shape(); // TODO: add frame driver / request animation frame
		
		public _iContext3D:away.display3D.Context3D;
		public _iStage3DIndex:number = -1;
		
		private _usesSoftwareRendering:boolean;
		private _profile:string;
		private _stage3D:away.display.Stage3D;
		private _activeProgram3D:away.display3D.Program3D;
		private _stage3DManager:away.managers.Stage3DManager;
		private _backBufferWidth:number;
		private _backBufferHeight:number;
		private _antiAlias:number;
		private _enableDepthAndStencil:boolean;
		private _contextRequested:boolean;
		//private var _activeVertexBuffers : Vector.<VertexBuffer3D> = new Vector.<VertexBuffer3D>(8, true);
		//private var _activeTextures : Vector.<TextureBase> = new Vector.<TextureBase>(8, true);
		private _renderTarget:away.display3D.TextureBase;
		private _renderSurfaceSelector:number;
		private _scissorRect:away.geom.Rectangle;
		private _color:number;
		private _backBufferDirty:boolean;
		private _viewPort:away.geom.Rectangle;
		private _enterFrame:away.events.Event;
		private _exitFrame:away.events.Event;
		private _viewportUpdated:away.events.Stage3DEvent;
		private _viewportDirty:boolean;
		private _bufferClear:boolean;
		private _mouse3DManager:away.managers.Mouse3DManager;
		//private _touch3DManager:Touch3DManager; //TODO: imeplement dependency Touch3DManager
		
		private notifyViewportUpdated()
		{
			if (this._viewportDirty)
            {

                return;

            }

			this._viewportDirty = true;

            // TODO - reinstate optimisation after testing
			//if (!this.hasEventListener(away.events.Stage3DEvent.VIEWPORT_UPDATED))
				//return;
			
			//TODO: investigate bug causing coercion error
			//if (!_viewportUpdated)
			this._viewportUpdated = new away.events.Stage3DEvent(away.events.Stage3DEvent.VIEWPORT_UPDATED);
			this.dispatchEvent(this._viewportUpdated);
		}
		
		private notifyEnterFrame()
		{
			//if (!hasEventListener(Event.ENTER_FRAME))
				//return;
			
			if (!this._enterFrame)
            {

                this._enterFrame = new away.events.Event(away.events.Event.ENTER_FRAME);

            }

			
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
		
		/**
		 * Creates a Stage3DProxy object. This method should not be called directly. Creation of Stage3DProxy objects should
		 * be handled by Stage3DManager.
		 * @param stage3DIndex The index of the Stage3D to be proxied.
		 * @param stage3D The Stage3D to be proxied.
		 * @param stage3DManager
		 * @param forceSoftware Whether to force software mode even if hardware acceleration is available.
		 */
		constructor(stage3DIndex:number, stage3D:away.display.Stage3D, stage3DManager:away.managers.Stage3DManager, forceSoftware:boolean = false, profile:string = "baseline")
		{

            super();

			this._iStage3DIndex = stage3DIndex;
            this._stage3D = stage3D;

            this._stage3D.x = 0;
            this._stage3D.y = 0;
            this._stage3D.visible = true;
            this._stage3DManager = stage3DManager;
            this._viewPort = new away.geom.Rectangle();
            this._enableDepthAndStencil = true;
			
			// whatever happens, be sure this has highest priority
			this._stage3D.addEventListener(away.events.Event.CONTEXT3D_CREATE, this.onContext3DUpdate, this ) ;//, false, 1000, false);
			this.requestContext( forceSoftware , this.profile);


		}
		
		public get profile():string
		{
			return this._profile;
		}
		
		/**
		 * Disposes the Stage3DProxy object, freeing the Context3D attached to the Stage3D.
		 */
		public dispose()
		{
			this._stage3DManager.iRemoveStage3DProxy(this);
			this._stage3D.removeEventListener(away.events.Event.CONTEXT3D_CREATE, this.onContext3DUpdate , this );
			this.freeContext3D();
            this._stage3D = null;
            this._stage3DManager = null;
            this._iStage3DIndex = -1;
		}
		
		/**
		 * Configures the back buffer associated with the Stage3D object.
		 * @param backBufferWidth The width of the backbuffer.
		 * @param backBufferHeight The height of the backbuffer.
		 * @param antiAlias The amount of anti-aliasing to use.
		 * @param enableDepthAndStencil Indicates whether the back buffer contains a depth and stencil buffer.
		 */
		public configureBackBuffer(backBufferWidth:number, backBufferHeight:number, antiAlias:number, enableDepthAndStencil:boolean)
		{
			var oldWidth:number = this._backBufferWidth;
			var oldHeight:number = this._backBufferHeight;

            this._backBufferWidth = this._viewPort.width = backBufferWidth;
            this._backBufferHeight = this._viewPort.height = backBufferHeight;
			
			if (oldWidth != this._backBufferWidth || oldHeight != this._backBufferHeight)
                this.notifyViewportUpdated();

            this._antiAlias = antiAlias;
            this._enableDepthAndStencil = enableDepthAndStencil;
			
			if (this._iContext3D)
                this._iContext3D.configureBackBuffer(backBufferWidth, backBufferHeight, antiAlias, enableDepthAndStencil);

            this._stage3D.width = backBufferWidth;
            this._stage3D.height = backBufferHeight;

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
		
		public get renderTarget():away.display3D.TextureBase
		{
			return this._renderTarget;
		}
		
		public get renderSurfaceSelector():number
		{
			return this._renderSurfaceSelector;
		}
		
		public setRenderTarget(target:away.display3D.TextureBase, enableDepthAndStencil:boolean = false, surfaceSelector:number = 0)
		{
			if (this._renderTarget == target && surfaceSelector == this._renderSurfaceSelector && this._enableDepthAndStencil == enableDepthAndStencil)
            {

                return;

            }

			this._renderTarget = target;
            this._renderSurfaceSelector = surfaceSelector;
            this._enableDepthAndStencil = enableDepthAndStencil;


            away.Debug.throwPIR( 'Stage3DProxy' , 'setRenderTarget' , 'away.display3D.Context3D: setRenderToTexture , setRenderToBackBuffer');

            /*

			if (target)
            {

                this._iContext3D.setRenderToTexture(target, enableDepthAndStencil, this._antiAlias, surfaceSelector);

            }
			else
            {

                this._iContext3D.setRenderToBackBuffer();

            }

            */
		}
		
		/*
		 * Clear and reset the back buffer when using a shared context
		 */
		public clear()
		{
			if (!this._iContext3D)
				return;
			
			if (this._backBufferDirty) {
				this.configureBackBuffer(this._backBufferWidth, this._backBufferHeight, this._antiAlias, this._enableDepthAndStencil);
                this._backBufferDirty = false;
			}

            this._iContext3D.clear( ( this._color & 0xff000000 ) >>> 24 , // <--------- Zero-fill right shift
                                    ( this._color & 0xff0000 ) >>> 16, // <-------------|
                                    ( this._color & 0xff00 ) >>> 8, // <----------------|
                                      this._color & 0xff ) ;

            /*
            this._iContext3D.clear(
                ((this._color >> 16) & 0xff)/255.0,
                ((this._color >> 8) & 0xff)/255.0,
                (this._color & 0xff)/255.0,
                ((this._color >> 24) & 0xff)/255.0);
			*/

			this._bufferClear = true;
		}
		
		/*
		 * Display the back rendering buffer
		 */
		public present()
		{
			if (!this._iContext3D)
				return;
			
			this._iContext3D.present();
			
			this._activeProgram3D = null;
			
			if (this._mouse3DManager)
                this._mouse3DManager.fireMouseEvents();
		}
		
		/**
		 * Registers an event listener object with an EventDispatcher object so that the listener receives notification of an event. Special case for enterframe and exitframe events - will switch Stage3DProxy into automatic render mode.
		 * You can register event listeners on all nodes in the display list for a specific type of event, phase, and priority.
		 *
		 * @param type The type of event.
		 * @param listener The listener function that processes the event.
		 * @param useCapture Determines whether the listener works in the capture phase or the target and bubbling phases. If useCapture is set to true, the listener processes the event only during the capture phase and not in the target or bubbling phase. If useCapture is false, the listener processes the event only during the target or bubbling phase. To listen for the event in all three phases, call addEventListener twice, once with useCapture set to true, then again with useCapture set to false.
		 * @param priority The priority level of the event listener. The priority is designated by a signed 32-bit integer. The higher the number, the higher the priority. All listeners with priority n are processed before listeners of priority n-1. If two or more listeners share the same priority, they are processed in the order in which they were added. The default priority is 0.
		 * @param useWeakReference Determines whether the reference to the listener is strong or weak. A strong reference (the default) prevents your listener from being garbage-collected. A weak reference does not.
		 */
		//public override function addEventListener(type:string, listener, useCapture:boolean = false, priority:number = 0, useWeakReference:boolean = false)
        public addEventListener ( type : string , listener : Function , target : Object )
		{
			super.addEventListener(type, listener, target ) ;//useCapture, priority, useWeakReference);

            away.Debug.throwPIR( 'Stage3DProxy' , 'addEventListener' ,  'EnterFrame, ExitFrame');

            if ((type == away.events.Event.ENTER_FRAME || type == away.events.Event.EXIT_FRAME) ){//&& ! this._frameEventDriver.hasEventListener(Event.ENTER_FRAME)){

                //_frameEventDriver.addEventListener(Event.ENTER_FRAME, onEnterFrame, useCapture, priority, useWeakReference);
                // TODO - Start RequestAnimationFrame


            }

            /* Original code
            if ((type == Event.ENTER_FRAME || type == Event.EXIT_FRAME) && ! _frameEventDriver.hasEventListener(Event.ENTER_FRAME)){

                _frameEventDriver.addEventListener(Event.ENTER_FRAME, onEnterFrame, useCapture, priority, useWeakReference);


            }
			*/
		}
		
		/**
		 * Removes a listener from the EventDispatcher object. Special case for enterframe and exitframe events - will switch Stage3DProxy out of automatic render mode.
		 * If there is no matching listener registered with the EventDispatcher object, a call to this method has no effect.
		 *
		 * @param type The type of event.
		 * @param listener The listener object to remove.
		 * @param useCapture Specifies whether the listener was registered for the capture phase or the target and bubbling phases. If the listener was registered for both the capture phase and the target and bubbling phases, two calls to removeEventListener() are required to remove both, one call with useCapture() set to true, and another call with useCapture() set to false.
		 */
        public removeEventListener ( type : string , listener : Function , target : Object )
		//public override function removeEventListener(type:string, listener, useCapture:boolean = false)
		{
			super.removeEventListener(type, listener, target);

            away.Debug.throwPIR( 'Stage3DProxy' , 'removeEventListener' ,  'EnterFrame, ExitFrame');

			// Remove the main rendering listener if no EnterFrame listeners remain
			if (    ! this.hasEventListener(away.events.Event.ENTER_FRAME , this.onEnterFrame , this )
                &&  ! this.hasEventListener(away.events.Event.EXIT_FRAME , this.onEnterFrame , this) ) //&& _frameEventDriver.hasEventListener(Event.ENTER_FRAME))
            {

                //_frameEventDriver.removeEventListener(Event.ENTER_FRAME, this.onEnterFrame, this );
                // TODO - Stop RequestAnimationFrame

            }

		}
		
		public get scissorRect():away.geom.Rectangle
		{
			return this._scissorRect;
		}
		
		public set scissorRect(value:away.geom.Rectangle)
		{
			this._scissorRect = value;
			this._iContext3D.setScissorRectangle(this._scissorRect);
		}
		
		/**
		 * The index of the Stage3D which is managed by this instance of Stage3DProxy.
		 */
		public get stage3DIndex():number
		{
			return this._iStage3DIndex;
		}
		
		/**
		 * The base Stage3D object associated with this proxy.
		 */
		public get stage3D():away.display.Stage3D
		{
			return this._stage3D;
		}
		
		/**
		 * The Context3D object associated with the given Stage3D object.
		 */
		public get context3D():away.display3D.Context3D
		{
			return this._iContext3D;
		}
		
		/**
		 * The driver information as reported by the Context3D object (if any)
		 */
        /*
		public get driverInfo():string
		{

            away.Debug.throwPIR( 'Stage3DProxy' , 'driverInfo' ,  'Context3D.driverInfo()');

            return null;

			//return this._iContext3D? this._iContext3D.driverInfo : null;
		}
        */
		/**
		 * Indicates whether the Stage3D managed by this proxy is running in software mode.
		 * Remember to wait for the CONTEXT3D_CREATED event before checking this property,
		 * as only then will it be guaranteed to be accurate.
		 */
		public get usesSoftwareRendering():boolean
		{
			return this._usesSoftwareRendering;
		}
		
		/**
		 * The x position of the Stage3D.
		 */
		public get x():number
		{

            //away.Debug.throwPIR( 'Stage3DProxy' , 'get x' ,  'Stage3D.x');

            //return 0;
			return this._stage3D.x;
		}
		
		public set x(value:number)
		{

            away.Debug.throwPIR( 'Stage3DProxy' , 'set x' ,  'Stage3D.x');

            //*
			if (this._viewPort.x == value)
				return;
			
			this._stage3D.x = this._viewPort.x = value;
			
			this.notifyViewportUpdated();
			//*/
		}
		
		/**
		 * The y position of the Stage3D.
		 */
		public get y():number
		{

			return this._stage3D.y;

		}
		
		public set y(value:number)
		{
            away.Debug.throwPIR( 'Stage3DProxy' , 'set x' ,  'Stage3D.y');
            //*
			if (this._viewPort.y == value)
				return;
			
			this._stage3D.y = this._viewPort.y = value;

            this.notifyViewportUpdated();
			//*/
		}

        /**
         *
         * @returns {HTMLCanvasElement}
         */
        public get canvas () : HTMLCanvasElement
        {

            return this._stage3D.canvas;

        }
		
		/**
		 * The width of the Stage3D.
		 */
		public get width():number
		{
			return this._backBufferWidth;
		}
		
		public set width(width:number)
		{
			if (this._viewPort.width == width)
				return;


            this._stage3D.width = this._backBufferWidth = this._viewPort.width = width;
			this._backBufferDirty = true;
			
			this.notifyViewportUpdated();
		}
		
		/**
		 * The height of the Stage3D.
		 */
		public get height():number
		{
			return this._backBufferHeight;
		}
		
		public set height(height:number)
		{
			if (this._viewPort.height == height)
				return;

            this._stage3D.height = this._backBufferHeight = this._viewPort.height = height;
			this._backBufferDirty = true;
			
			this.notifyViewportUpdated();
		}
		
		/**
		 * The antiAliasing of the Stage3D.
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
		 * A viewPort rectangle equivalent of the Stage3D size and position.
		 */
		public get viewPort():away.geom.Rectangle
		{
			this._viewportDirty = false;
			
			return this._viewPort;
		}
		
		/**
		 * The background color of the Stage3D.
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
		 * The visibility of the Stage3D.
		 */
		public get visible():boolean
		{

            away.Debug.throwPIR( 'Stage3DProxy' , 'get visible' ,  'Stage3D.visible');
            return null;

			//return this._stage3D.visible;
		}
		
		public set visible(value:boolean)
		{

            away.Debug.throwPIR( 'Stage3DProxy' , 'set visible' ,  'Stage3D.visible');
			//this._stage3D.visible = value;
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
		
		/*
		 * Access to fire mouseevents across multiple layered view3D instances
		 */
		public get mouse3DManager():Mouse3DManager
		{
			return this._mouse3DManager;
		}
		
		public set mouse3DManager(value:Mouse3DManager)
		{
			this._mouse3DManager = value;
		}

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
		 * Frees the Context3D associated with this Stage3DProxy.
		 */
		private freeContext3D()
		{
			if (this._iContext3D) {

                away.Debug.throwPIR( 'Stage3DProxy' , 'freeContext3D' ,  'Context3D.dispose()');
				//this._context3D.dispose();
				this.dispatchEvent(new away.events.Stage3DEvent(away.events.Stage3DEvent.CONTEXT3D_DISPOSED));
			}

            this._iContext3D = null;
		}
		
		/*
		 * Called whenever the Context3D is retrieved or lost.
		 * @param event The event dispatched.
		 */
		private onContext3DUpdate(event:Event)
		{
			if (this._stage3D.context3D)
            {

				var hadContext:boolean = (this._iContext3D != null);
				this._iContext3D = this._stage3D.context3D;

                away.Debug.log( 'Stage3DProxy' , 'onContext3DUpdate this._stage3D.context3D: ' , this._stage3D.context3D);
                // todo: implement dependency Context3D.enableErrorChecking, Context3D.driverInfo
                away.Debug.throwPIR( 'Stage3DProxy' , 'onContext3DUpdate' ,  'Context3D.enableErrorChecking');

				//this._iContext3D.enableErrorChecking = Debug.active;
				//this._usesSoftwareRendering = (this._iContext3D.driverInfo.indexOf('Software') == 0);
				
				// Only configure back buffer if width and height have been set,
				// which they may not have been if View3D.render() has yet to be
				// invoked for the first time.
				if (this._backBufferWidth && this._backBufferHeight)
                {

                    this._iContext3D.configureBackBuffer(this._backBufferWidth, this._backBufferHeight, this._antiAlias, this._enableDepthAndStencil);

                }

				
				// Dispatch the appropriate event depending on whether context was
				// created for the first time or recreated after a device loss.
				this.dispatchEvent(new away.events.Stage3DEvent( hadContext ? away.events.Stage3DEvent.CONTEXT3D_RECREATED : away.events.Stage3DEvent.CONTEXT3D_CREATED));
				
			}
            else
            {

                throw new Error("Rendering context lost!");

            }

		}
		
		/**
		 * Requests a Context3D object to attach to the managed Stage3D.
		 */
		private requestContext(forceSoftware:boolean = false, profile:string = "baseline")
		{
			// If forcing software, we can be certain that the
			// returned Context3D will be running software mode.
			// If not, we can't be sure and should stick to the
			// old value (will likely be same if re-requesting.)

            if ( this._usesSoftwareRendering != null )
            {

                this._usesSoftwareRendering = forceSoftware;

            }

			this._profile = profile;

            // Updated to work with current JS <> AS3 Display3D System
            this._stage3D.requestContext();

            // Throw PartialImplementationError to flag this function as changed

            away.Debug.throwPIR( 'Stage3DProxy' , 'requestContext' , 'Context3DRenderMode' );

           // throw new away.errors.PartialImplementationError( 'Context3DRenderMode');


            /*
			// ugly stuff for backward compatibility
			var renderMode:string = forceSoftware? Context3DRenderMode.SOFTWARE : Context3DRenderMode.AUTO;

			if (profile == "baseline")
				this._stage3D.requestContext3D(renderMode);
			else {
				try {
                    this._stage3D["requestContext3D"](renderMode, profile);
				} catch (error:Error) {
					throw "An error occurred creating a context using the given profile. Profiles are not supported for the SDK this was compiled with.";
				}
			}
			
			_contextRequested = true;
			*/

		}
		
		/**
		 * The Enter_Frame handler for processing the proxy.ENTER_FRAME and proxy.EXIT_FRAME event handlers.
		 * Typically the proxy.ENTER_FRAME listener would render the layers for this Stage3D instance.
		 */
		private onEnterFrame(event:Event)
		{
			if (!this._iContext3D )
            {

                return;

            }

			
			// Clear the stage3D instance
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
			if (!this._iContext3D)
            {

                return false;

            }

            away.Debug.throwPIR( 'Stage3DProxy' , 'recoverFromDisposal' , '' );


            /*
            if (this._iContext3D.driverInfo == "Disposed")
            {
				this._iContext3D = null;
				this.dispatchEvent(new away.events.Stage3DEvent(away.events.Stage3DEvent.CONTEXT3D_DISPOSED));
				return false;

			}
            */
			return true;

		}
		
		public clearDepthBuffer()
		{
			if ( ! this._iContext3D )
            {

                return;

            }

            this._iContext3D.clear(0, 0, 0, 1, 1, 0, away.display3D.Context3DClearMask.DEPTH);

		}
	}
}
