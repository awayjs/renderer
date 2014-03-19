///<reference path="../../../build/Away3D.next.d.ts" />

module tests.entities
{
	import View						= away.containers.View;
	import Billboard				= away.entities.Billboard;
	import Vector3D					= away.geom.Vector3D;
	import AssetLibrary				= away.library.AssetLibrary;
	import TextureMaterial			= away.materials.TextureMaterial;
	import ImageTexture				= away.textures.ImageTexture;
	import URLLoader				= away.net.URLLoader;
	import URLRequest				= away.net.URLRequest;
	import Delegate					= away.utils.Delegate;
	import RequestAnimationFrame	= away.utils.RequestAnimationFrame;

	export class LayoutTest
	{
		private _view:View;
		private _projection:away.projections.PerspectiveProjection;
		private _timer:away.utils.RequestAnimationFrame;
		private _hoverControl:away.controllers.HoverController;

		private _move:boolean = false;
		private _lastPanAngle:number;
		private _lastTiltAngle:number;
		private _lastMouseX:number;
		private _lastMouseY:number;

		private _imageTexture:ImageTexture;
		private _bitmapMaterial:TextureMaterial;
		private _billboards:Array<Billboard> = new Array<Billboard>();

		constructor()
		{
			//load an image
			AssetLibrary.load(new URLRequest('assets/256x256.png') );

			//listen for a resource complete event
			AssetLibrary.addEventListener(away.events.LoaderEvent.RESOURCE_COMPLETE , Delegate.create(this, this.onResourceComplete));
		}

		/**
		 * Listener for resource complete event
		 *
		 * @param event
		 */
		onResourceComplete(event:away.events.LoaderEvent)
		{
			//get the image texture
			this._imageTexture = <ImageTexture> event.assets[0];

			//create the view
			this._view = new away.containers.View(new away.render.DefaultRenderer());

			this._projection = <away.projections.PerspectiveProjection> this._view.camera.projection;


			this._projection.coordinateSystem = away.projections.CoordinateSystem.RIGHT_HANDED;
			this._projection.focalLength = 1000;
			this._projection.preserveFocalLength = true;
			this._projection.originX = 0;
			this._projection.originY = 0;

			//create a bitmap material
			this._bitmapMaterial = new away.materials.TextureMaterial(this._imageTexture);

			var billboard:Billboard;
			var numHBillboards:number = 2;
			var numVBillboards:number = 2;
			for (var i:number = 0; i < numHBillboards; i++) {
				for (var j:number = 0; j < numVBillboards; j++) {
					billboard = new Billboard(this._bitmapMaterial);
					//billboard.width = 50;
					//billboard.height = 50;
					//billboard.pivot = new Vector3D(billboard.billboardWidth/2, billboard.billboardHeight/2, 0);
					billboard.x = j*300;
					billboard.y = i*300;
					billboard.z = 0;
					billboard.addEventListener(away.events.MouseEvent.MOUSE_MOVE, this.onMouseEvent)
					//billboard.orientationMode = away.base.OrientationMode.CAMERA_PLANE;
					//billboard.alignmentMode = away.base.AlignmentMode.PIVOT_POINT;
					this._billboards.push(billboard);
					//add billboard to the scene
					this._view.scene.addChild(billboard);
				}
			}

			this._hoverControl = new away.controllers.HoverController(this._view.camera, null, 180, 0, 1000);

			document.onmousedown = (event:MouseEvent) => this.onMouseDownHandler(event);
			document.onmouseup = (event:MouseEvent) => this.onMouseUpHandler(event);
			document.onmousemove = (event:MouseEvent) => this.onMouseMove(event);

			window.onresize  = (event:UIEvent) => this.onResize(event);

			//trigger an initial resize for the view
			this.onResize(null);

			//setup the RAF for a render listener
			this._timer = new away.utils.RequestAnimationFrame(this.render, this);
			this._timer.start();
		}

		private onMouseEvent(event:away.events.MouseEvent)
		{
			console.log(event);
		}

		private onResize(event:UIEvent)
		{
			this._view.x = 0;
			this._view.y = 0;
			this._view.width = window.innerWidth;
			this._view.height = window.innerHeight;
		}

		private render(dt:number)
		{
			for (var i:number = 0; i < this._billboards.length; i++) {
				//this._billboards[i].rotationZ +=2;
			}

			this._view.render();

		}

		private onMouseUpHandler(event:MouseEvent)
		{
			this._move = false;
		}

		private onMouseMove(event:MouseEvent)
		{
			if (this._move) {
				this._hoverControl.panAngle = 0.3*(event.clientX - this._lastMouseX) + this._lastPanAngle;
				this._hoverControl.tiltAngle = -0.3*(event.clientY - this._lastMouseY) + this._lastTiltAngle;
			}
		}

		private onMouseDownHandler(event:MouseEvent)
		{
			this._lastPanAngle = this._hoverControl.panAngle;
			this._lastTiltAngle = this._hoverControl.tiltAngle;
			this._lastMouseX = event.clientX;
			this._lastMouseY = event.clientY;
			this._move = true;
		}
	}
}