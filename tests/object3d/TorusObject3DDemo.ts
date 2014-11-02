import URLLoader					= require("awayjs-core/lib/net/URLLoader");
import URLLoaderDataFormat			= require("awayjs-core/lib/net/URLLoaderDataFormat");
import URLRequest					= require("awayjs-core/lib/net/URLRequest");
import AwayEvent					= require("awayjs-core/lib/events/Event");
import ParserUtils					= require("awayjs-core/lib/parsers/ParserUtils");
import PerspectiveProjection		= require("awayjs-core/lib/projections/PerspectiveProjection");
import ImageTexture					= require("awayjs-core/lib/textures/ImageTexture");
import RequestAnimationFrame		= require("awayjs-core/lib/utils/RequestAnimationFrame");
import Debug						= require("awayjs-core/lib/utils/Debug");

import View							= require("awayjs-display/lib/containers/View");
import Mesh							= require("awayjs-display/lib/entities/Mesh");
import PointLight					= require("awayjs-display/lib/entities/PointLight");
import StaticLightPicker			= require("awayjs-display/lib/materials/lightpickers/StaticLightPicker");
import PrimitiveTorusPrefab			= require("awayjs-display/lib/prefabs/PrimitiveTorusPrefab");

import DefaultRenderer				= require("awayjs-renderergl/lib/render/DefaultRenderer");
import TriangleMethodMaterial		= require("awayjs-renderergl/lib/materials/TriangleMethodMaterial");

class TorusObject3DDemo
{
	private view:View;
	private torus:PrimitiveTorusPrefab;

	private light:PointLight;
	private raf:RequestAnimationFrame;
	private meshes:Array<Mesh>;

	private t:number = 0;
	private tPos:number = 0;
	private radius:number = 1000;
	private follow:boolean = true;

	private pointLight:PointLight;
	private lightPicker:StaticLightPicker;

	private _image:HTMLImageElement;

	constructor()
	{
		Debug.THROW_ERRORS = false;
		Debug.LOG_PI_ERRORS = false;

		this.meshes = new Array<Mesh>();
		this.light = new PointLight();
		this.view = new View(new DefaultRenderer());
		this.pointLight = new PointLight();
		this.lightPicker = new StaticLightPicker([this.pointLight]);

		this.view.scene.addChild(this.pointLight);

		var perspectiveLens:PerspectiveProjection = <PerspectiveProjection> this.view.camera.projection;
		perspectiveLens.fieldOfView = 75;

		this.view.camera.z = 0;
		this.view.backgroundColor = 0x000000;
		this.view.backgroundAlpha = 1;
		this.torus = new PrimitiveTorusPrefab(150, 50, 32, 32, false);

		var l:number = 10;
		//var radius:number = 1000;

		for (var c : number = 0; c < l ; c++) {

			var t : number=Math.PI * 2 * c / l;

			var mesh:Mesh = <Mesh> this.torus.getNewObject();
			mesh.x = Math.cos(t)*this.radius;
			mesh.y = 0;
			mesh.z = Math.sin(t)*this.radius;

			this.view.scene.addChild(mesh);
			this.meshes.push(mesh);

		}

		this.view.scene.addChild(this.light);

		this.raf = new RequestAnimationFrame(this.tick, this);
		this.raf.start();
		this.onResize();

		document.onmousedown = (event:MouseEvent) => this.followObject(event);

		window.onresize = (event:UIEvent) => this.onResize(event);

		this.loadResources();
	}

	private loadResources()
	{
		var urlRequest:URLRequest = new URLRequest("assets/custom_uv_horizontal.png");
		var urlLoader:URLLoader = new URLLoader();
		urlLoader.dataFormat = URLLoaderDataFormat.BLOB;
		urlLoader.addEventListener(AwayEvent.COMPLETE, (event:AwayEvent) => this.imageCompleteHandler(event));
		urlLoader.load(urlRequest);
	}

	private imageCompleteHandler(event:AwayEvent)
	{
		var urlLoader:URLLoader = <URLLoader> event.target;

		this._image = ParserUtils.blobToImage(urlLoader.data);
		this._image.onload = (event:Event) => this.onImageLoadComplete(event);

	}

	private onImageLoadComplete(event:Event)
	{
		var matTx: TriangleMethodMaterial = new TriangleMethodMaterial(new ImageTexture(this._image, false), true, true, false);
		matTx.lightPicker =  this.lightPicker;

		for (var c:number = 0; c < this.meshes.length; c ++)
			this.meshes[c].material = matTx;
	}

	private tick(dt:number)
	{
		this.tPos += .02;

		for (var c:number = 0 ; c < this.meshes.length ; c ++) {
			var objPos:number=Math.PI*2*c/this.meshes.length;

			this.t += .005;
			var s:number = 1.2 + Math.sin(this.t + objPos);

			this.meshes[c].rotationY += 2*(c/this.meshes.length);
			this.meshes[c].rotationX += 2*(c/this.meshes.length);
			this.meshes[c].rotationZ += 2*(c/this.meshes.length);
			this.meshes[c].scaleX = this.meshes[c].scaleY = this.meshes[c].scaleZ = s;
			this.meshes[c].x = Math.cos(objPos + this.tPos)*this.radius;
			this.meshes[c].y = Math.sin(this.t)*500;
			this.meshes[c].z = Math.sin(objPos + this.tPos)*this.radius;
		}

		//this.view.camera.y = Math.sin( this.tPos ) * 1500;

		if (this.follow)
			this.view.camera.lookAt(this.meshes[0].transform.position);

		this.view.camera.y = Math.sin(this.tPos) * 1500;

		this.view.render();
	}

	public onResize(event:UIEvent = null)
	{
		this.view.y = 0;
		this.view.x = 0;

		this.view.width = window.innerWidth;
		this.view.height = window.innerHeight;
	}

	public followObject(e)
	{
		this.follow = !this.follow;
	}
}