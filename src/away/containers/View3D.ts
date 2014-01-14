///<reference path="../_definitions.ts" />

module away.containers
{
	export class View3D
	{

		/*
		 *************************************************************************************************************************
		 * Development Notes
		 *************************************************************************************************************************
		 *
		 * ShareContext     - this is not being used at the moment integration with other frameworks is not yet implemented or tested
		 *                    and ( _localPos / _globalPos ) position of viewport are the same for the moment
		 *
		 * Background
		 *                  - this is currently not being included in our tests and is currently disabled
		 *
		 **************************************************************************************************************************
		 */

		// Static
		private static sStage:away.display.Stage; // View3D's share the same stage

		// Public
		public stage:away.display.Stage;

		// Protected
		public _pScene:away.containers.Scene3D;
		public _pCamera:away.cameras.Camera3D;
		public _pEntityCollector:away.traverse.EntityCollector;
		public _pFilter3DRenderer:away.render.Filter3DRenderer;
		public _pRequireDepthRender:boolean;
		public _pDepthRender:away.displayGL.Texture;
		public _pStageGLProxy:away.managers.StageGLProxy;
		public _pBackBufferInvalid:boolean = true;
		public _pRttBufferManager:away.managers.RTTBufferManager;

		public _pShareContext:boolean = false;
		public _pScissorRect:away.geom.Rectangle;
		public _pRenderer:away.render.RendererBase;

		// Private
		private _aspectRatio:number;
		private _width:number = 0;
		private _height:number = 0;

		private _localPos:away.geom.Point = new away.geom.Point();
		private _globalPos:away.geom.Point = new away.geom.Point();
		private _globalPosDirty:boolean;
		private _time:number = 0;
		private _deltaTime:number = 0;
		private _backgroundColor:number = 0x000000;
		private _backgroundAlpha:number = 1;
		private _depthRenderer:away.render.DepthRenderer;
		private _addedToStage:boolean;
		private _forceSoftware:boolean;
		private _depthTextureInvalid:boolean = true;

		private _antiAlias:number = 0;
		private _scissorRectDirty:boolean = true;
		private _viewportDirty:boolean = true;
		private _depthPrepass:boolean = false;
		private _profile:string;
		private _layeredView:boolean = false;

		/*
		 ***********************************************************************
		 * Disabled / Not yet implemented
		 ***********************************************************************
		 *
		 * private _background:away.textures.Texture2DBase;
		 *
		 * public _pMouse3DManager:away.managers.Mouse3DManager;
		 * public _pTouch3DManager:away.managers.Touch3DManager;
		 *
		 */
		constructor(scene:Scene3D = null, camera:away.cameras.Camera3D = null, renderer:away.render.RendererBase = null, forceSoftware:boolean = false, profile:string = "baseline")
		{


			if (View3D.sStage == null) {
				View3D.sStage = new away.display.Stage();
			}

			this._profile = profile;
			this._pScene = scene || new Scene3D();
			this._pScene.addEventListener(away.events.Scene3DEvent.PARTITION_CHANGED, this.onScenePartitionChanged, this);
			this._pCamera = camera || new away.cameras.Camera3D();
			this._pRenderer = renderer || new away.render.DefaultRenderer();
			this._depthRenderer = new away.render.DepthRenderer();
			this._forceSoftware = forceSoftware;
			this._pEntityCollector = this._pRenderer.iCreateEntityCollector();
			this._pEntityCollector.camera = this._pCamera;
			this._pScissorRect = new away.geom.Rectangle();
			this._pCamera.addEventListener(away.events.CameraEvent.LENS_CHANGED, this.onLensChanged, this);
			this._pCamera.partition = this._pScene.partition;
			this.stage = View3D.sStage;

			this.onAddedToStage();

		}

		/**
		 *
		 * @param e
		 */
		private onScenePartitionChanged(e:away.events.Scene3DEvent)
		{
			if (this._pCamera) {
				this._pCamera.partition = this.scene.partition;
			}
		}

		/**
		 *
		 * @returns {away.managers.StageGLProxy}
		 */
		public get stageGLProxy():away.managers.StageGLProxy
		{
			return this._pStageGLProxy;
		}

		/**
		 *
		 * @param stageGLProxy
		 */
		public set stageGLProxy(stageGLProxy:away.managers.StageGLProxy)
		{

			if (this._pStageGLProxy) {
				this._pStageGLProxy.removeEventListener(away.events.StageGLEvent.VIEWPORT_UPDATED, this.onViewportUpdated, this);
			}

			this._pStageGLProxy = stageGLProxy;
			this._pStageGLProxy.addEventListener(away.events.StageGLEvent.VIEWPORT_UPDATED, this.onViewportUpdated, this);
			this._pRenderer.iStageGLProxy = this._depthRenderer.iStageGLProxy = this._pStageGLProxy;
			this._globalPosDirty = true;
			this._pBackBufferInvalid = true;

		}

		/**
		 *
		 * @returns {boolean}
		 */
		public get layeredView():boolean
		{
			return this._layeredView;
		}

		/**
		 *
		 * @param value
		 */
		public set layeredView(value:boolean)
		{
			this._layeredView = value;
		}

		/**
		 *
		 * @returns {*}
		 */
		public get filters3d():Array<away.filters.Filter3DBase>
		{
			return this._pFilter3DRenderer? this._pFilter3DRenderer.filters : null;
		}

		/**
		 *
		 * @param value
		 */
		public set filters3d(value:Array<away.filters.Filter3DBase>)
		{
			if (value && value.length == 0)
				value = null;

			if (this._pFilter3DRenderer && !value) {
				this._pFilter3DRenderer.dispose();
				this._pFilter3DRenderer = null;
			} else if (!this._pFilter3DRenderer && value) {
				this._pFilter3DRenderer = new away.render.Filter3DRenderer(this._pStageGLProxy);
				this._pFilter3DRenderer.filters = value;
			}

			if (this._pFilter3DRenderer) {
				this._pFilter3DRenderer.filters = value;
				this._pRequireDepthRender = this._pFilter3DRenderer.requireDepthRender;
			} else {
				this._pRequireDepthRender = false;

				if (this._pDepthRender) {
					this._pDepthRender.dispose();
					this._pDepthRender = null;
				}
			}
		}

		/**
		 *
		 * @returns {away.render.RendererBase}
		 */
		public get renderer():away.render.RendererBase
		{
			return this._pRenderer;
		}

		/**
		 *
		 * @param value
		 */
		public set renderer(value:away.render.RendererBase)
		{
			this._pRenderer.iDispose();
			this._pRenderer = value;

			this._pEntityCollector = this._pRenderer.iCreateEntityCollector();
			this._pEntityCollector.camera = this._pCamera;
			this._pRenderer.iStageGLProxy = this._pStageGLProxy;
			this._pRenderer.antiAlias = this._antiAlias;
			this._pRenderer.iBackgroundR = ((this._backgroundColor >> 16) & 0xff)/0xff;
			this._pRenderer.iBackgroundG = ((this._backgroundColor >> 8) & 0xff)/0xff;
			this._pRenderer.iBackgroundB = (this._backgroundColor & 0xff)/0xff;
			this._pRenderer.iBackgroundAlpha = this._backgroundAlpha;
			this._pRenderer.iViewWidth = this._width;
			this._pRenderer.iViewHeight = this._height;

			this._pBackBufferInvalid = true;

		}

		/**
		 *
		 * @returns {number}
		 */
		public get backgroundColor():number
		{
			return this._backgroundColor;
		}

		/**
		 *
		 * @param value
		 */
		public set backgroundColor(value:number)
		{
			this._backgroundColor = value;
			this._pRenderer.iBackgroundR = ((value >> 16) & 0xff)/0xff;
			this._pRenderer.iBackgroundG = ((value >> 8) & 0xff)/0xff;
			this._pRenderer.iBackgroundB = (value & 0xff)/0xff;
		}

		/**
		 *
		 * @returns {number}
		 */
		public get backgroundAlpha():number
		{
			return this._backgroundAlpha;
		}

		/**
		 *
		 * @param value
		 */
		public set backgroundAlpha(value:number)
		{
			if (value > 1) {
				value = 1;
			} else if (value < 0) {
				value = 0;
			}

			this._pRenderer.iBackgroundAlpha = value;
			this._backgroundAlpha = value;
		}

		/**
		 *
		 * @returns {away.cameras.Camera3D}
		 */
		public get camera():away.cameras.Camera3D
		{
			return this._pCamera;
		}

		/**
		 * Set camera that's used to render the scene for this viewport
		 */
		public set camera(camera:away.cameras.Camera3D)
		{
			this._pCamera.removeEventListener(away.events.CameraEvent.LENS_CHANGED, this.onLensChanged, this);
			this._pCamera = camera;

			this._pEntityCollector.camera = this._pCamera;

			if (this._pScene) {
				this._pCamera.partition = this._pScene.partition;
			}

			this._pCamera.addEventListener(away.events.CameraEvent.LENS_CHANGED, this.onLensChanged, this);
			this._scissorRectDirty = true;
			this._viewportDirty = true;

		}

		/**
		 *
		 * @returns {away.containers.Scene3D}
		 */
		public get scene():away.containers.Scene3D
		{
			return this._pScene;
		}

		/**
		 * Set the scene that's used to render for this viewport
		 */
		public set scene(scene:away.containers.Scene3D)
		{
			this._pScene.removeEventListener(away.events.Scene3DEvent.PARTITION_CHANGED, this.onScenePartitionChanged, this);
			this._pScene = scene;
			this._pScene.addEventListener(away.events.Scene3DEvent.PARTITION_CHANGED, this.onScenePartitionChanged, this);

			if (this._pCamera) {
				this._pCamera.partition = this._pScene.partition;
			}

		}

		/**
		 *
		 * @returns {number}
		 */
		public get deltaTime():number
		{
			return this._deltaTime;
		}

		/**
		 *
		 * @returns {number}
		 */
		public get width():number
		{
			return this._width;
		}

		/**
		 *
		 * @param value
		 */
		public set width(value:number)
		{

			if (this._width == value) {
				return;
			}

			if (this._pRttBufferManager) {
				this._pRttBufferManager.viewWidth = value;
			}

			this._width = value;
			this._aspectRatio = this._width/this._height;
			this._pCamera.lens.iAspectRatio = this._aspectRatio;
			this._depthTextureInvalid = true;
			this._pRenderer.iViewWidth = value;
			this._pScissorRect.width = value;
			this._pBackBufferInvalid = true;
			this._scissorRectDirty = true;
		}

		/**
		 *
		 * @returns {number}
		 */
		public get height():number
		{
			return this._height;
		}

		/**
		 *
		 * @param value
		 */
		public set height(value:number)
		{

			if (this._height == value) {
				return;
			}

			if (this._pRttBufferManager) {
				this._pRttBufferManager.viewHeight = value;
			}

			this._height = value;
			this._aspectRatio = this._width/this._height;
			this._pCamera.lens.iAspectRatio = this._aspectRatio;
			this._depthTextureInvalid = true;
			this._pRenderer.iViewHeight = value;
			this._pScissorRect.height = value;
			this._pBackBufferInvalid = true;
			this._scissorRectDirty = true;

		}

		/**
		 *
		 * @param value
		 */
		public set x(value:number)
		{
			if (this.x == value)
				return;

			this._globalPos.x = this._localPos.x = value;
			this._globalPosDirty = true;
		}

		/**
		 *
		 * @param value
		 */
		public set y(value:number)
		{
			if (this.y == value)
				return;

			this._globalPos.y = this._localPos.y = value;
			this._globalPosDirty = true;
		}

		/**
		 *
		 * @returns {number}
		 */
		public get x():number
		{
			return this._localPos.x;
		}

		/**
		 *
		 * @returns {number}
		 */
		public get y():number
		{
			return this._localPos.y;
		}

		/**
		 *
		 * @returns {boolean}
		 */
		public get visible()
		{
			return true;
		}

		/**
		 *
		 * @param v
		 */
		public set visible(v:boolean)
		{

		}

		public get canvas():HTMLCanvasElement
		{

			return this._pStageGLProxy.canvas;

		}

		/**
		 *
		 * @returns {number}
		 */
		public get antiAlias():number
		{
			return this._antiAlias;
		}

		/**
		 *
		 * @param value
		 */
		public set antiAlias(value:number)
		{
			this._antiAlias = value;
			this._pRenderer.antiAlias = value;
			this._pBackBufferInvalid = true;
		}

		/**
		 *
		 * @returns {number}
		 */
		public get renderedFacesCount():number
		{
			return this._pEntityCollector._pNumTriangles;//numTriangles;
		}

		/**
		 *
		 * @returns {boolean}
		 */
		public get shareContext():boolean
		{
			return this._pShareContext;
		}

		/**
		 *
		 * @param value
		 */
		public set shareContext(value:boolean)
		{
			if (this._pShareContext == value) {
				return;
			}
			this._pShareContext = value;
			this._globalPosDirty = true;
		}

		/**
		 * Updates the backbuffer dimensions.
		 */
		public pUpdateBackBuffer()
		{
			// No reason trying to configure back buffer if there is no context available.
			// Doing this anyway (and relying on _stageGLProxy to cache width/height for
			// context does get available) means usesSoftwareRendering won't be reliable.

			if (this._pStageGLProxy._iContextGL && !this._pShareContext) {

				if (this._width && this._height) {

					this._pStageGLProxy.configureBackBuffer(this._width, this._height, this._antiAlias, true);
					this._pBackBufferInvalid = false;
				}

			}
		}

		/**
		 * Renders the view.
		 */
		public render()
		{

			if (!this._pStageGLProxy.recoverFromDisposal()) //if contextGL has Disposed by the OS,don't render at this frame
			{
				this._pBackBufferInvalid = true;
				return;
			}

			if (this._pBackBufferInvalid)// reset or update render settings
			{
				this.pUpdateBackBuffer();
			}

			if (this._pShareContext && this._layeredView) {
				this._pStageGLProxy.clearDepthBuffer();
			}

			if (this._globalPosDirty) {
				this.pUpdateGlobalPos();
			}

			this.pUpdateTime();
			this.pUpdateViewSizeData();
			this._pEntityCollector.clear();
			this._pScene.traversePartitions(this._pEntityCollector);// collect stuff to render

			// TODO: implement & integrate mouse3DManager
			// update picking
			//_mouse3DManager.updateCollider(this);
			//_touch3DManager.updateCollider();

			if (this._pRequireDepthRender) {
				this.pRenderSceneDepthToTexture(this._pEntityCollector);
			}

			if (this._depthPrepass) {
				this.pRenderDepthPrepass(this._pEntityCollector);
			}

			this._pRenderer.iClearOnRender = !this._depthPrepass;

			if (this._pFilter3DRenderer && this._pStageGLProxy._iContextGL) {

				this._pRenderer.iRender(this._pEntityCollector, this._pFilter3DRenderer.getMainInputTexture(this._pStageGLProxy), this._pRttBufferManager.renderToTextureRect);
				this._pFilter3DRenderer.render(this._pStageGLProxy, this._pCamera, this._pDepthRender);

			} else {
				this._pRenderer.iShareContext = this._pShareContext;

				if (this._pShareContext) {
					this._pRenderer.iRender(this._pEntityCollector, null, this._pScissorRect);
				} else {
					this._pRenderer.iRender(this._pEntityCollector);
				}

			}

			if (!this._pShareContext) {
				this._pStageGLProxy.present();

				// TODO: imeplement mouse3dManager
				// fire collected mouse events
				//_mouse3DManager.fireMouseEvents();
				//_touch3DManager.fireTouchEvents();

			}

			// clean up data for this render
			this._pEntityCollector.cleanUp();

			// register that a view has been rendered
			this._pStageGLProxy.bufferClear = false;

		}

		/**
		 *
		 */
		public pUpdateGlobalPos()
		{

			this._globalPosDirty = false;

			if (!this._pStageGLProxy) {
				return;
			}

			if (this._pShareContext) {

				this._pScissorRect.x = this._globalPos.x - this._pStageGLProxy.x;
				this._pScissorRect.y = this._globalPos.y - this._pStageGLProxy.y;

			} else {

				this._pScissorRect.x = 0;
				this._pScissorRect.y = 0;
				this._pStageGLProxy.x = this._globalPos.x;
				this._pStageGLProxy.y = this._globalPos.y;

			}

			this._scissorRectDirty = true;
		}

		/**
		 *
		 */
		public pUpdateTime():void
		{
			var time:number = away.utils.getTimer();

			if (this._time == 0) {
				this._time = time;
			}

			this._deltaTime = time - this._time;
			this._time = time;

		}

		/**
		 *
		 */
		public pUpdateViewSizeData()
		{
			this._pCamera.lens.iAspectRatio = this._aspectRatio;

			if (this._scissorRectDirty) {
				this._scissorRectDirty = false;
				this._pCamera.lens.iUpdateScissorRect(this._pScissorRect.x, this._pScissorRect.y, this._pScissorRect.width, this._pScissorRect.height);
			}

			if (this._viewportDirty) {
				this._viewportDirty = false;
				this._pCamera.lens.iUpdateViewport(this._pStageGLProxy.viewPort.x, this._pStageGLProxy.viewPort.y, this._pStageGLProxy.viewPort.width, this._pStageGLProxy.viewPort.height);
			}

			if (this._pFilter3DRenderer || this._pRenderer.iRenderToTexture) {
				this._pRenderer.iTextureRatioX = this._pRttBufferManager.textureRatioX;
				this._pRenderer.iTextureRatioY = this._pRttBufferManager.textureRatioY;
			} else {
				this._pRenderer.iTextureRatioX = 1;
				this._pRenderer.iTextureRatioY = 1;
			}
		}

		/**
		 *
		 * @param entityCollector
		 */
		public pRenderDepthPrepass(entityCollector:away.traverse.EntityCollector)
		{
			this._depthRenderer.disableColor = true;

			if (this._pFilter3DRenderer || this._pRenderer.iRenderToTexture) {
				this._depthRenderer.iTextureRatioX = this._pRttBufferManager.textureRatioX;
				this._depthRenderer.iTextureRatioY = this._pRttBufferManager.textureRatioY;
				this._depthRenderer.iRender(entityCollector, this._pFilter3DRenderer.getMainInputTexture(this._pStageGLProxy), this._pRttBufferManager.renderToTextureRect);
			} else {
				this._depthRenderer.iTextureRatioX = 1;
				this._depthRenderer.iTextureRatioY = 1;
				this._depthRenderer.iRender(entityCollector);
			}

			this._depthRenderer.disableColor = false;

		}

		/**
		 *
		 * @param entityCollector
		 */
		public pRenderSceneDepthToTexture(entityCollector:away.traverse.EntityCollector)
		{
			if (this._depthTextureInvalid || !this._pDepthRender) {
				this.initDepthTexture(this._pStageGLProxy._iContextGL);
			}
			this._depthRenderer.iTextureRatioX = this._pRttBufferManager.textureRatioX;
			this._depthRenderer.iTextureRatioY = this._pRttBufferManager.textureRatioY;
			this._depthRenderer.iRender(entityCollector, this._pDepthRender);
		}

		/**
		 *
		 * @param context
		 */
		private initDepthTexture(context:away.displayGL.ContextGL):void
		{
			this._depthTextureInvalid = false;

			if (this._pDepthRender) {
				this._pDepthRender.dispose();
			}
			this._pDepthRender = context.createTexture(this._pRttBufferManager.textureWidth, this._pRttBufferManager.textureHeight, away.displayGL.ContextGLTextureFormat.BGRA, true);
		}

		/**
		 *
		 */
		public dispose()
		{
			this._pStageGLProxy.removeEventListener(away.events.StageGLEvent.VIEWPORT_UPDATED, this.onViewportUpdated, this);

			if (!this.shareContext) {
				this._pStageGLProxy.dispose();
			}

			this._pRenderer.iDispose();

			if (this._pDepthRender) {
				this._pDepthRender.dispose();
			}

			if (this._pRttBufferManager) {
				this._pRttBufferManager.dispose();
			}

			// TODO: imeplement mouse3DManager / touch3DManager
			//this._mouse3DManager.disableMouseListeners(this);
			//this._mouse3DManager.dispose();
			//this._touch3DManager.disableTouchListeners(this);
			//this._touch3DManager.dispose();
			//this._mouse3DManager = null;
			//this._touch3DManager = null;

			this._pRttBufferManager = null;
			this._pDepthRender = null;
			this._depthRenderer = null;
			this._pStageGLProxy = null;
			this._pRenderer = null;
			this._pEntityCollector = null;
		}

		/**
		 *
		 * @returns {away.traverse.EntityCollector}
		 */
		public get iEntityCollector():away.traverse.EntityCollector
		{
			return this._pEntityCollector;
		}

		/**
		 *
		 * @param event
		 */
		private onLensChanged(event:away.events.CameraEvent)
		{
			this._scissorRectDirty = true;
			this._viewportDirty = true;
		}

		/**
		 *
		 * @param event
		 */
		private onViewportUpdated(event:away.events.StageGLEvent)
		{
			if (this._pShareContext) {
				this._pScissorRect.x = this._globalPos.x - this._pStageGLProxy.x;
				this._pScissorRect.y = this._globalPos.y - this._pStageGLProxy.y;
				this._scissorRectDirty = true;
			}
			this._viewportDirty = true;
		}

		/**
		 *
		 * @returns {boolean}
		 */
		public get depthPrepass():boolean
		{
			return this._depthPrepass;
		}

		/**
		 *
		 * @param value
		 */
		public set depthPrepass(value:boolean)
		{
			this._depthPrepass = value;
		}

		/**
		 *
		 */
		private onAddedToStage()
		{

			this._addedToStage = true;

			if (this._pStageGLProxy == null) {

				this._pStageGLProxy = away.managers.StageGLManager.getInstance(this.stage).getFreeStageGLProxy(this._forceSoftware, this._profile);
				this._pStageGLProxy.addEventListener(away.events.StageGLEvent.VIEWPORT_UPDATED, this.onViewportUpdated, this);

			}

			this._globalPosDirty = true;
			this._pRttBufferManager = away.managers.RTTBufferManager.getInstance(this._pStageGLProxy);
			this._pRenderer.iStageGLProxy = this._depthRenderer.iStageGLProxy = this._pStageGLProxy;

			if (this._width == 0) {
				this.width = this.stage.stageWidth;
			} else {
				this._pRttBufferManager.viewWidth = this._width;
			}

			if (this._height == 0) {
				this.height = this.stage.stageHeight;
			} else {
				this._pRttBufferManager.viewHeight = this._height;
			}

		}

		// TODO private function onAddedToStage(event:Event):void
		// TODO private function onAdded(event:Event):void

		public project(point3d:away.geom.Vector3D):away.geom.Vector3D
		{
			var v:away.geom.Vector3D = this._pCamera.project(point3d);
			v.x = (v.x + 1.0)*this._width/2.0;
			v.y = (v.y + 1.0)*this._height/2.0;
			return v;
		}

		public unproject(sX:number, sY:number, sZ:number):away.geom.Vector3D
		{
			return this._pCamera.unproject((sX*2 - this._width)/this._pStageGLProxy.width, (sY*2 - this._height)/this._pStageGLProxy.height, sZ);
		}

		public getRay(sX:number, sY:number, sZ:number):away.geom.Vector3D
		{
			return this._pCamera.getRay((sX*2 - this._width)/this._width, (sY*2 - this._height)/this._height, sZ);
		}

		/* TODO: implement Mouse3DManager
		 public get mousePicker():away.pick.IPicker
		 {
		 return this._mouse3DManager.mousePicker;
		 }
		 */
		/* TODO: implement Mouse3DManager
		 public set mousePicker( value:away.pick.IPicker )
		 {
		 this._mouse3DManager.mousePicker = value;
		 }
		 */
		/* TODO: implement Touch3DManager
		 public get touchPicker():away.pick.IPicker
		 {
		 return this._touch3DManager.touchPicker;
		 }
		 */
		/* TODO: implement Touch3DManager
		 public set touchPicker( value:away.pick.IPicker)
		 {
		 this._touch3DManager.touchPicker = value;
		 }
		 */
		/*TODO: implement Mouse3DManager
		 public get forceMouseMove():boolean
		 {
		 return this._mouse3DManager.forceMouseMove;
		 }
		 */
		/* TODO: implement Mouse3DManager
		 public set forceMouseMove( value:boolean )
		 {
		 this._mouse3DManager.forceMouseMove = value;
		 this._touch3DManager.forceTouchMove = value;
		 }
		 */
		/*TODO: implement Background
		 public get background():away.textures.Texture2DBase
		 {
		 return this._background;
		 }
		 */
		/*TODO: implement Background
		 public set background( value:away.textures.Texture2DBase )
		 {
		 this._background = value;
		 this._renderer.background = _background;
		 }
		 */

	}
}