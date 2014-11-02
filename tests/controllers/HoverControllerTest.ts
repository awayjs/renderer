import RequestAnimationFrame		= require("awayjs-core/lib/utils/RequestAnimationFrame");
import LoaderEvent					= require("awayjs-core/lib/events/LoaderEvent");

import View							= require("awayjs-display/lib/containers/View");
import HoverController				= require("awayjs-display/lib/controllers/HoverController");
import Mesh							= require("awayjs-display/lib/entities/Mesh");
import PrimitiveCubePrefab			= require("awayjs-display/lib/prefabs/PrimitiveCubePrefab");

import DefaultRenderer				= require("awayjs-renderergl/lib/render/DefaultRenderer");

class HoverControllerTest
{

	private _view:View;
	private _timer:RequestAnimationFrame;
	private _hoverControl:HoverController;

	private _move:boolean = false;
	private _lastPanAngle:number;
	private _lastTiltAngle:number;
	private _lastMouseX:number;
	private _lastMouseY:number;
	private _cube:PrimitiveCubePrefab;
	private _mesh:Mesh;

	constructor()
	{
		this._view = new View(new DefaultRenderer());

		this._cube = new PrimitiveCubePrefab(400, 400, 400);
		this._cube.geometryType = "lineSubGeometry";
		this._mesh = <Mesh> this._cube.getNewObject();
		this._view.scene.addChild(this._mesh);

		this._hoverControl = new HoverController(this._view.camera, this._mesh, 150, 10);

		window.onresize  = (event:UIEvent) => this.onResize(event);

		document.onmousedown = (event:MouseEvent) => this.onMouseDown(event);
		document.onmouseup = (event:MouseEvent) => this.onMouseUp(event);
		document.onmousemove = (event:MouseEvent) => this.onMouseMove(event);


		this.onResize();

		this._timer = new RequestAnimationFrame(this.render , this);
		this._timer.start();
	}

	private onResize(event:UIEvent = null)
	{
		this._view.y = 0;
		this._view.x = 0;
		this._view.width = window.innerWidth;
		this._view.height = window.innerHeight;
	}

	private render(dt:number)
	{
		this._view.render();
	}

	private onMouseUp(event:MouseEvent)
	{
		this._move = false;
	}

	private onMouseMove(event:MouseEvent)
	{
		if (this._move) {
			this._hoverControl.panAngle = 0.3*(event.clientX - this._lastMouseX) + this._lastPanAngle;
			this._hoverControl.tiltAngle = 0.3*(event.clientY - this._lastMouseY) + this._lastTiltAngle;
		}
	}

	private onMouseDown(event:MouseEvent)
	{
		this._lastPanAngle = this._hoverControl.panAngle;
		this._lastTiltAngle = this._hoverControl.tiltAngle;
		this._lastMouseX = event.clientX;
		this._lastMouseY = event.clientY;
		this._move = true;
	}
}