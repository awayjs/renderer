/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

module away.containers
{
	export class View3D
	{
		/*
		private _width:number;
		private _height:number;
		private _localPos:away.geom.Point;
		private _globalPos:away.geom.Point;
		private _globalPosDirty:boolean;
		
		public  _pScene:away.Scene3D;
		public _pCamera:away.cameras.Camera3D;
		public _pEntityCollector:away.travers.EntityCollector;
		public _pAspectRation:number;
		
		private _time:number = 0;
		private _deltaTime:number = 0;
		private _backgroundColor:number = 0x000000;
		private _backgroundAlpha:number = 1;
		
		public _pMouse3DManager:away.managers.Mouse3DManager;
		public _pTouch3DManager:away.managers.Touch3DManager;
		
		public _pRenderer:away.render.RendererBase;
		private _depthRenderer:away.render.DepthRenderer;
		private _addedToStage:boolean;
		
		private _forceSoftware:boolean;
		
		public _pFilter3DRenderer:away.render.Filter3DRenderer;
		public _pRequireDepthRender:boolean;
		public _pDepthRender:away.display3D.Texture;
		private _depthTextureInvalid:boolean = true;
		
		private _hitField:away.display.Sprite;
		public _pParentIsStage:boolean;
		
		private _background:away.textures.Texture2DBase;
		public _pStage3DProxy:away.managers.Stage3DProxy;
		public _pBackBufferInvalid:boolean = true;
		private _antiAlias:number;
		
		public _pRttBufferManager:away.managers.RTTBufferManager;
		
		private _rightClickMenuEnabled:boolean = true;
		private _sourceURL:string;
		private _menu0:away.ui.ContextMenuItem;
		private _menu1:away.ui.ContextMenuItem;
		private _viewContextMenu:away.ui.ContextMenu;
		public _pShareContext:boolean = false;
		public _pScissorRect:away.geom.Rectangle;
		private _scissorRectDirty:boolean = true;
		private _viewportDirty:boolean = true;
		
		private _depthPrepass:boolean;
		private _profile:string;
		private _layeredView:boolean = false;
		*/
		
		constructor( scene:Scene3D = null
					/*,
					 camera:away.cameras.Camera3D,
					 renderer:away.render.RendererBase,
					 forceSoftware:boolean = false,
					 profile: string = "basline"
					 */
					)
		{
			// TODO link to displaylist
			
			this._profile = profile;
			this._scene = scene || new Scene3D();
			/*
			this._scene.addEventListener( away.events.Scene3DEvent.PARTITION_CHANGED, this.onScenePartitionChanged, this );
			this._camera = camera || new away.cameras.Camera3D();
			this._renderer = renderer || new away.render.DefaultRenderer();
			this._depthRenderer = new away.render.DepthRenderer();
			this._forceSoftware = forceSoftware;
			
			this._pEntityCollector = _renderer.createEntityCollector();
			this._pEntityCollector.camera = this._camera;
			
			this._pScissorRect = new away.geom.Rectangle();
			
			this.initHitField();
			
			this._pMouse3DManager = new away.managers.Mouse3DManager();
			this._pMouse3DManager.enableMouseListeners( this );
			
			this._pTouch3DManager = new away.managers.Touch3DManager();
			this._pTouch3DManager.view = this;
			this._pTouch3DManager.enableTouchListeners( this );
			
			this.addEventListener( away.events.Event.ADDED_TO_STAGE, this.onAddedToStage, this );
			this.addEventListener( away.events.Event.ADDED, this.onAdded, this );
			
			this._camera.addEventListener( away.events.CameraEvent.LENS_CHANGED, this.onLensChanged, this );
			
			this._camera.partition = this._scene.partition;
			
			this.initRightClickMenu();
			*/
		}
		
		/*
		private onScenePartitionChanged( e:away.events.Scene3DEvent )
		{
			if( this._camera )
			{
				this._camera.partition = this.scene.partition;
			}
		}
		
		public get rightClickMenuEnabled():Boolean
		{
			return this._rightClickMenuEnabled;
		}
		
		public set rightClickMenuEnabled( val:boolean )
		{
			this._rightClickMenuEnabled = val;
			this.updateRightClickMenu();
		}
		
		public get stage3DProxy():away.managers.Stage3DProxy
		{
			return this._stage3DProxy;
		}
		
		public set stage3DProxy( stage3DProxy:away.managers.Stage3DProxy )
		{
			if (this._stage3DProxy)
			{
				this._stage3DProxy.removeEventListener(away.events.Stage3DEvent.VIEWPORT_UPDATED, this.onViewportUpdated, this );
			}
			
			this._stage3DProxy = stage3DProxy;
			this._stage3DProxy.addEventListener( away.events.Stage3DEvent.VIEWPORT_UPDATED, this.onViewportUpdated, this );
			this._renderer.stage3DProxy = this._depthRenderer.stage3DProxy = _stage3DProxy;
			this._globalPosDirty = true;
			this._backBufferInvalid = true;
		}
		
		public get forceMouseMove():boolean
		{
			return this._mouse3DManager.forceMouseMove;
		}
		
		public set forceMouseMove( value:boolean )
		{
			this._mouse3DManager.forceMouseMove = value;
			this._touch3DManager.forceTouchMove = value;
		}
		
		public get background():away.textures.Texture2DBase
		{
			return this._background;
		}
		
		public set background( value:away.textures.Texture2DBase )
		{
			this._background = value;
			this._renderer.background = _background;
		}
		
		public get layeredView():boolean
		{
			return this._layeredView;
		}
		
		public set layeredView( value:boolean )
		{
			this._layeredView = value;
		}
		
		private initHitField()
		{
			this._hitField = new away.display.Sprite();
			this._hitField.alpha = 0;
			this._hitField.doubleClickEnabled = true;
			this._hitField.graphics.beginFill( 0x000000 );
			this._hitField.graphics.drawRect( 0, 0, 100, 100 );
			this.addChild( this._hitField );
		}
		
		
		//TODO override public function get filters():Array
		//TODO override public function set filters(value:Array):void
		
		
		public get filters3d():Array
		{
			return this._filter3DRenderer ? this._filter3DRenderer.filters : null;
		}
		
		//TODO public set filters3d( value:Array )
		
		public get renderer():away.render.RendererBase
		{
			return this._renderer;
		}
		
		//TODO public function set renderer(value:RendererBase):void
		
		public get backgroundColor():number
		{
			return this._backgroundColor;
		}
		
		//TODO public function set backgroundColor(value:uint):void
		
		public get backgroundAlpha():number
		{
			return this._backgroundAlpha;
		}
		
		public function set backgroundAlpha(value:Number):void
		{
			if (value > 1)
			{
				value = 1;
			}
			else if (value < 0)
			{
				value = 0;
			}
			
			this._renderer.backgroundAlpha = value;
			this._backgroundAlpha = value;
		}
		
		public get camera():away.cameras.Camera3D
		{
			return this._camera;
		}
		
		//TODO public function set camera(camera:Camera3D):void
		
		public get scene():away.display3D.Scene3D
		{
			return this._scene;
		}
		
		// TODO public function set scene(scene:Scene3D):void
		
		public get deltaTime():number
		{
			return this._deltaTime;
		}
		
		public get width():Number
		{
			return _width;
		}
		
		//TODO override public function set width(value:Number):void
		public get height():number
		{
			return this._height;
		}
		
		//TODO override public function set height(value:Number):void
		//TODO override public function set x(value:Number):void
		//TODO override public function set y(value:Number):void
		//TODO override public function set visible(value:Boolean):void
		
		public get antiAlias():number
		{
			return this._antiAlias;
		}
		
		public set antiAlias( value:number )
		{
			this._antiAlias = value;
			this._renderer.antiAlias = value;
			this._backBufferInvalid = true;
		}
		
		public get renderedFacesCount():number
		{
			return this._entityCollector.numTriangles;
		}
		
		public get shareContext():boolean
		{
			return this._shareContext;
		}
		
		public set shareContext( value:boolean )
		{
			if ( this._shareContext == value)
			{
				return;
			}
			this._shareContext = value;
			this._globalPosDirty = true;
		}
		
		//TODO protected function updateBackBuffer():void
		
		public addSourceURL( url:string )
		{
			this._sourceURL = url;
			this.updateRightClickMenu();
		}
		
		// TODO public function render():void
		// TODO protected function updateGlobalPos():void
		
		public function _pUpdateTime():void
		{
			var time:Number = away.utils.getTimer();
			if ( this._time == 0 )
			{
				this._time = time;
			}
			this._deltaTime = time - this._time;
			this._time = time;
		}
		
		//TODO protected function updateViewSizeData():void
		//TODO protected function renderDepthPrepass(entityCollector:EntityCollector):void
		//TODO protected function renderSceneDepthToTexture(entityCollector:EntityCollector):void
		
		private initDepthTexture( context:away.display3D.Context3D ):void
		{
			this._depthTextureInvalid = false;
			
			if ( this._depthRender)
			{
				this._depthRender.dispose();
			}
			this._depthRender = context.createTexture( this._pRttBufferManager.textureWidth, this._pRttBufferManager.textureHeight, away.display3D.Context3DTextureFormat.BGRA, true );
		}
		
		//TODO public function dispose():void
		
		public project( point3d:away.geom.Vector3D ):away.geom.Vector3D
		{
			var v:away.geom.Vector3D = this._camera.project( point3d );
			v.x = (v.x + 1.0) * this._width/2.0;
			v.y = (v.y + 1.0) * this._height/2.0;
			return v;
		}
		
		public unproject( sX:Number, sY:Number, sZ:Number ):away.geom.Vector3D
		{
			return this._camera.unproject( (sX*2 - this._width)/this._stage3DProxy.width, (sY*2 - this._height)/this._stage3DProxy.height, sZ );
		}
		
		public getRay( sX:Number, sY:Number, sZ:Number ):away.geom.Vector3D
		{
			return this._camera.getRay( (sX*2 - this._width)/this._width, (sY*2 - this._height)/this._height, sZ );
		}
		
		public get mousePicker():away.pick.IPicker
		{
			return this._mouse3DManager.mousePicker;
		}
		
		public set mousePicker( value:away.pick.IPicker )
		{
			this._mouse3DManager.mousePicker = value;
		}
		
		public get touchPicker():away.pick.IPicker
		{
			return this._touch3DManager.touchPicker;
		}
		
		public set touchPicker( value:away.pick.IPicker)
		{
			this._touch3DManager.touchPicker = value;
		}
		
		public get _iEntityCollector():away.traverse.EntityCollector
		{
			return this._entityCollector;
		}
		
		private onLensChanged( event:away.events.CameraEvent )
		{
			this._scissorRectDirty = true;
			this._viewportDirty = true;
		}
		
		// TODO private function onAddedToStage(event:Event):void
		// TODO private function onAdded(event:Event):void
		
		private onViewportUpdated( event:away.events.Stage3DEvent )
		{
			if( this._shareContext) {
				this._scissorRect.x = this._globalPos.x - this._stage3DProxy.x;
				this._scissorRect.y = this._globalPos.y - this._stage3DProxy.y;
				this._scissorRectDirty = true;
			}
			this._viewportDirty = true;
		}
		
		// TODO private function viewSource(e:ContextMenuEvent):void
		
		public get depthPrepass():boolean
		{
			return this._depthPrepass;
		}
		
		public set depthPrepass( value: boolean )
		{
			this._depthPrepass = value;
		}
		
		// TODO private function visitWebsite(e:ContextMenuEvent):void
		// TODO private function initRightClickMenu():void
		// TODO private function updateRightClickMenu():void
		*/
	}
}