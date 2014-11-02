import Vector3D						= require("awayjs-core/lib/geom/Vector3D");
import AssetLibrary					= require("awayjs-core/lib/library/AssetLibrary");
import IAsset						= require("awayjs-core/lib/library/IAsset");
import URLLoader					= require("awayjs-core/lib/net/URLLoader");
import URLRequest					= require("awayjs-core/lib/net/URLRequest");
import LoaderEvent					= require("awayjs-core/lib/events/LoaderEvent");
import Texture2DBase				= require("awayjs-core/lib/textures/Texture2DBase");
import RequestAnimationFrame		= require("awayjs-core/lib/utils/RequestAnimationFrame");

import View							= require("awayjs-display/lib/containers/View");
import HoverController				= require("awayjs-display/lib/controllers/HoverController");
import AlignmentMode				= require("awayjs-display/lib/base/AlignmentMode");
import OrientationMode				= require("awayjs-display/lib/base/OrientationMode");
import Billboard					= require("awayjs-display/lib/entities/Billboard");
import Mesh							= require("awayjs-display/lib/entities/Mesh");

import DefaultRenderer				= require("awayjs-renderergl/lib/render/DefaultRenderer");
import TriangleMethodMaterial		= require("awayjs-renderergl/lib/materials/TriangleMethodMaterial");

class BillboardTest
{
	//engine variables
	private _view:View;
	private _cameraController:HoverController;

	//navigation variables
	private _timer:RequestAnimationFrame;
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
		this._view = new View(new DefaultRenderer());

		//setup the camera for optimal shadow rendering
		this._view.camera.projection.far = 2100;

		//setup controller to be used on the camera
		this._cameraController = new HoverController(this._view.camera, null, 45, 20, 1000, 10);
	}

	/**
	 * Initialise the listeners
	 */
	private initListeners():void
	{
		document.onmousedown = (event:MouseEvent) => this.onMouseDown(event);
		document.onmouseup = (event:MouseEvent) => this.onMouseUp(event);
		document.onmousemove = (event:MouseEvent) => this.onMouseMove(event);

		window.onresize  = (event:UIEvent) => this.onResize(event);

		this.onResize();

		this._timer = new RequestAnimationFrame(this.onEnterFrame, this);
		this._timer.start();
	}

	/**
	 * start loading our texture
	 */
	private loadTexture():void
	{
		AssetLibrary.addEventListener(LoaderEvent.RESOURCE_COMPLETE, (event:LoaderEvent) => this.onResourceComplete(event));
		AssetLibrary.load(new URLRequest("assets/130909wall_big.png"));
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
	private onResourceComplete(event:LoaderEvent)
	{
		var assets:Array<IAsset> = event.assets;
		var length:number = assets.length;

		for (var c:number = 0; c < length; c ++) {
			var asset:IAsset = assets[c];

			switch(event.url) {

				case "assets/130909wall_big.png":

					var material:TriangleMethodMaterial = new TriangleMethodMaterial();
						material.texture = <Texture2DBase> AssetLibrary.getAsset(asset.name);

					var s:Billboard;
						s = new Billboard(material);
						s.pivot = new Vector3D(150, 150, 0);
						s.width = 300;
						s.height = 300;
						//s.rotationX = 45;
					s.orientationMode = OrientationMode.CAMERA_PLANE;
					s.alignmentMode = AlignmentMode.PIVOT_POINT;

					this._view.scene.addChild(s);

					for (var c:number = 0; c < 100; c ++) {
						var size:number = this.getRandom(5 , 50);
						s = new Billboard(material);
						s.pivot = new Vector3D(size/2, size/2, 0);
						s.width = size;
						s.height = size;
						s.orientationMode = OrientationMode.CAMERA_PLANE;
						s.alignmentMode = AlignmentMode.PIVOT_POINT;
							s.x =  this.getRandom(-400 , 400);
							s.y =  this.getRandom(-400 , 400);
							s.z =  this.getRandom(-400 , 400);
						this._view.scene.addChild(s);
					}

					this._timer.start();
					break;
			}
		}
	}

	/**
	 * Mouse down listener for navigation
	 */
	private onMouseDown(event:MouseEvent):void
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
	private onMouseUp(event:MouseEvent):void
	{
		this._move = false;
	}

	/**
	 *
	 * @param event
	 */
	private onMouseMove(event:MouseEvent)
	{
		if (this._move) {
			this._cameraController.panAngle = 0.3*(event.clientX - this._lastMouseX) + this._lastPanAngle;
			this._cameraController.tiltAngle = 0.3*(event.clientY - this._lastMouseY) + this._lastTiltAngle;
		}
	}

	/**
	 * stage listener for resize events
	 */
	private onResize(event:UIEvent = null):void
	{
		this._view.y = 0;
		this._view.x = 0;
		this._view.width = window.innerWidth;
		this._view.height = window.innerHeight;
	}

	/**
	 * Util function - getRandom Number
	 */
	private getRandom(min:number, max:number):number
	{
		return Math.random()*(max - min) + min;
	}
}