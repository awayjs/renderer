///<reference path="../../../build/Away3D.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />

module tests.entities {

	export class BillboardTest //extends away.events.EventDispatcher
	{
		//engine variables
		private _view:away.containers.View;
		private _cameraController:away.controllers.HoverController;

		//navigation variables
		private _timer:away.utils.RequestAnimationFrame;
		private _time:number = 0;
		private _move:boolean = false;
		private _lastPanAngle:number;
		private _lastTiltAngle:number;
		private _lastMouseX:number;
		private _lastMouseY:number;

		/**
		 * Constructor
		 */
		constructor()
		{
			this.init();
		}

		/**
		 * Global initialise function
		 */
		private init():void
		{
			this.initEngine();
			this.initListeners();
			this.loadTexture();
		}

		/**
		 * Initialise the engine
		 */
		private initEngine():void
		{
			this._view = new away.containers.View(new away.render.DefaultRenderer());

			//setup the camera for optimal shadow rendering
			this._view.camera.projection.far = 2100;

			//setup controller to be used on the camera
			this._cameraController = new away.controllers.HoverController(this._view.camera, null, 45, 20, 1000, 10);
		}

		/**
		 * Initialise the listeners
		 */
		private initListeners():void
		{
			window.onresize = (event) => this.onResize(event);
			document.onmousedown = (event) => this.onMouseDown(event);
			document.onmouseup = (event) => this.onMouseUp(event);
			document.onmousemove = (event) => this.onMouseMove(event);

			this.onResize();

			this._timer = new away.utils.RequestAnimationFrame(this.onEnterFrame, this);
			this._timer.start();

		}

		/**
		 * start loading our texture
		 */
		private loadTexture() : void
		{
			away.library.AssetLibrary.addEventListener(away.events.LoaderEvent.RESOURCE_COMPLETE, away.utils.Delegate.create(this, this.onResourceComplete));
			away.library.AssetLibrary.load(new away.net.URLRequest("assets/130909wall_big.png"));
		}

		/**
		 * Navigation and render loop
		 */
		private onEnterFrame(dt:number):void
		{
			this._time += dt;

			this._view.render();

		}

		/**
		 * Listener function for resource complete event on asset library
		 */
		private onResourceComplete (event:away.events.LoaderEvent)
		{
			var assets:away.library.IAsset[] = event.assets;
			var length:number = assets.length;

			for ( var c : number = 0 ; c < length ; c ++ )
			{
				var asset:away.library.IAsset = assets[c];
				switch (event.url)
				{

					case "assets/130909wall_big.png" :

						var material : away.materials.TextureMaterial = new away.materials.TextureMaterial();
							material.texture = <away.textures.Texture2DBase> away.library.AssetLibrary.getAsset(asset.name);

						var s : away.entities.Billboard;
							s           = new away.entities.Billboard(material , 300 , 300 );
							s.rotationX = 45;
						s.orientationMode = away.base.OrientationMode.CAMERA_PLANE;
						s.alignmentMode = away.base.AlignmentMode.PIVOT_POINT;

						this._view.scene.addChild( s );

						for ( var c : number = 0 ; c < 100 ; c ++ )
						{
							var size : number = this.getRandom( 5 , 50 );
							s = new away.entities.Billboard( material, size , size );
							s.orientationMode = away.base.OrientationMode.CAMERA_PLANE;
							s.alignmentMode = away.base.AlignmentMode.PIVOT_POINT;
								s.x =  this.getRandom( -400 , 400 );
								s.y =  this.getRandom( -400 , 400 );
								s.z =  this.getRandom( -400 , 400 );
							this._view.scene.addChild( s );
						}

						this._timer.start();
						break;
				}
			}
		}

		/**
		 * Mouse down listener for navigation
		 */
		private onMouseDown(event):void
		{
			this._lastPanAngle = this._cameraController.panAngle;
			this._lastTiltAngle = this._cameraController.tiltAngle;
			this._lastMouseX = event.clientX;
			this._lastMouseY = event.clientY;
			this._move = true;
		}

		/**
		 * Mouse up listener for navigation
		 */
		private onMouseUp(event):void
		{
			this._move = false;
		}
		private onMouseMove(event)
		{
			if (this._move) {
				this._cameraController.panAngle = 0.3*(event.clientX - this._lastMouseX) + this._lastPanAngle;
				this._cameraController.tiltAngle = 0.3*(event.clientY - this._lastMouseY) + this._lastTiltAngle;
			}
		}

		/**
		 * stage listener for resize events
		 */
		private onResize(event = null):void
		{
			this._view.y         = 0;
			this._view.x         = 0;
			this._view.width     = window.innerWidth;
			this._view.height    = window.innerHeight;
		}

		/**
		 * Util function - getRandom Number
		 */
		private getRandom(min : number , max : number )  : number
		{
			return Math.random() * (max - min) + min;
		}
	}

}
