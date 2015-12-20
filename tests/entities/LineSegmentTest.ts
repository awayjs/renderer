import Vector3D						= require("awayjs-core/lib/geom/Vector3D");
import AssetLibrary					= require("awayjs-core/lib/library/AssetLibrary");
import IAsset						= require("awayjs-core/lib/library/IAsset");
import URLLoader					= require("awayjs-core/lib/net/URLLoader");
import URLRequest					= require("awayjs-core/lib/net/URLRequest");
import RequestAnimationFrame		= require("awayjs-core/lib/utils/RequestAnimationFrame");

import View							= require("awayjs-display/lib/containers/View");
import HoverController				= require("awayjs-display/lib/controllers/HoverController");
import AlignmentMode				= require("awayjs-display/lib/base/AlignmentMode");
import OrientationMode				= require("awayjs-display/lib/base/OrientationMode");
import LineSegment					= require("awayjs-display/lib/entities/LineSegment");
import BasicMaterial				= require("awayjs-display/lib/materials/BasicMaterial");

import DefaultRenderer				= require("awayjs-renderergl/lib/DefaultRenderer");

class LineSegmentTest
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
		this.initObjects();
		this.initListeners();
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

	private initObjects():void
	{
		var material:BasicMaterial = new BasicMaterial(0xFFFFFF);

		var x:number, y:number, z:number, s:LineSegment;

		for (var c:number = 0; c < 100; c ++) {
			x = this.getRandom(-400 , 400);
			y = this.getRandom(-400 , 400);
			z = this.getRandom(-400 , 400);

			s = new LineSegment(material, new Vector3D(0,0,0), new Vector3D(x, y, z), 3);
			this._view.scene.addChild(s);
		}
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
	 * Navigation and render loop
	 */
	private onEnterFrame(dt:number):void
	{
		this._time += dt;

		this._view.render();
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