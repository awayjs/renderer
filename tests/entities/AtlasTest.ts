import BitmapImage2D				= require("awayjs-core/lib/data/BitmapImage2D");
import Sampler2D					= require("awayjs-core/lib/data/Sampler2D");
import Vector3D						= require("awayjs-core/lib/geom/Vector3D");
import AssetLibrary					= require("awayjs-core/lib/library/AssetLibrary");
import IAsset						= require("awayjs-core/lib/library/IAsset");
import URLLoader					= require("awayjs-core/lib/net/URLLoader");
import URLRequest					= require("awayjs-core/lib/net/URLRequest");
import LoaderEvent					= require("awayjs-core/lib/events/LoaderEvent");
import RequestAnimationFrame		= require("awayjs-core/lib/utils/RequestAnimationFrame");

import View							= require("awayjs-display/lib/containers/View");
import HoverController				= require("awayjs-display/lib/controllers/HoverController");
import AlignmentMode				= require("awayjs-display/lib/base/AlignmentMode");
import OrientationMode				= require("awayjs-display/lib/base/OrientationMode");
import Billboard					= require("awayjs-display/lib/entities/Billboard");
import Mesh							= require("awayjs-display/lib/entities/Mesh");
import BasicMaterial				= require("awayjs-display/lib/materials/BasicMaterial");
import Single2DTexture				= require("awayjs-display/lib/textures/Single2DTexture");

import DefaultRenderer				= require("awayjs-renderergl/lib/DefaultRenderer");

class AtlasTest
{
	//engine variables
	private _view:View;
	private _cameraController:HoverController;

	//scene variables
	private _material:BasicMaterial;
	private _samplers:Array<Sampler2D> = new Array<Sampler2D>();

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
		AssetLibrary.load(new URLRequest("assets/atlas.xml"));
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

				case "assets/atlas.xml":

					if (asset.isAsset(BitmapImage2D)) {
						this._material = new BasicMaterial(new Single2DTexture(<BitmapImage2D> asset));
						this._material.alphaBlending = true;
						this._material.imageRect = true;
					} else if (asset.isAsset(Sampler2D)) {
						this._samplers.push(<Sampler2D> asset);
					}
			}
		}

		var len:number = this._samplers.length;
		for (var i:number = 0; i < len; i++) {
			//var size:number = this.getRandom(50 , 500);
			var s:Billboard = new Billboard(this._material);
			s.addSamplerAt(this._samplers[i], this._material.texture);
			s.pivot = new Vector3D(s.width/2, s.height/2, 0);
			//s.width = size;
			//s.height = size;
			s.orientationMode = OrientationMode.CAMERA_PLANE;
			s.alignmentMode = AlignmentMode.PIVOT_POINT;
			s.x =  this.getRandom(-400 , 400);
			s.y =  this.getRandom(-400 , 400);
			s.z =  this.getRandom(-400 , 400);
			this._view.scene.addChild(s);
		}

		this._timer.start();
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