import BlendMode					from "awayjs-core/lib/image/BlendMode";
import Vector3D						from "awayjs-core/lib/geom/Vector3D";
import URLLoader					from "awayjs-core/lib/net/URLLoader";
import URLLoaderDataFormat			from "awayjs-core/lib/net/URLLoaderDataFormat";
import URLRequest					from "awayjs-core/lib/net/URLRequest";
import URLLoaderEvent				from "awayjs-core/lib/events/URLLoaderEvent";
import ParserUtils					from "awayjs-core/lib/parsers/ParserUtils";
import PerspectiveProjection		from "awayjs-core/lib/projections/PerspectiveProjection";
import RequestAnimationFrame		from "awayjs-core/lib/utils/RequestAnimationFrame";
import Debug						from "awayjs-core/lib/utils/Debug";

import View							from "awayjs-display/lib/View";
import Sprite						from "awayjs-display/lib/display/Sprite";
import ElementsType					from "awayjs-display/lib/graphics/ElementsType";
import BasicMaterial				from "awayjs-display/lib/materials/BasicMaterial";
import PrimitiveCubePrefab			from "awayjs-display/lib/prefabs/PrimitiveCubePrefab";
import PrimitiveTorusPrefab			from "awayjs-display/lib/prefabs/PrimitiveTorusPrefab";
import Single2DTexture				from "awayjs-display/lib/textures/Single2DTexture";

import DefaultRenderer				from "awayjs-renderergl/lib/DefaultRenderer";

class TorusVortex
{
	private _view:View;
	private _mesh:Sprite;
	private _mesh2:Sprite;

	private _raf:RequestAnimationFrame;
	private _image:HTMLImageElement;
	private _cameraAxis:Vector3D;

	constructor()
	{
		Debug.THROW_ERRORS = false;

		this._view = new View(new DefaultRenderer());

		this._view.backgroundColor = 0x000000;
		this._view.camera.x = 130;
		this._view.camera.y = 0;
		this._view.camera.z = 0;
		this._cameraAxis = new Vector3D(0, 0, 1);

		this._view.camera.projection = new PerspectiveProjection(120);
		this._view.camera.projection.near = 0.1;

		this.loadResources();
	}

	private loadResources()
	{
		var urlRequest:URLRequest = new URLRequest( "assets/130909wall_big.png" );
		var urlLoader:URLLoader = new URLLoader();
		urlLoader.dataFormat = URLLoaderDataFormat.BLOB;
		urlLoader.addEventListener(URLLoaderEvent.LOAD_COMPLETE, (event:URLLoaderEvent) => this.imageCompleteHandler(event));
		urlLoader.load(urlRequest);
	}

	private imageCompleteHandler(event:URLLoaderEvent)
	{
		var imageLoader:URLLoader = <URLLoader> event.target;
		this._image = ParserUtils.blobToImage(imageLoader.data);
		this._image.onload = (event) => this.onLoadComplete(event);
	}

	private onLoadComplete(event)
	{
		var matTx:BasicMaterial = new BasicMaterial(ParserUtils.imageToBitmapImage2D(this._image));

		matTx.blendMode = BlendMode.ADD;
		matTx.bothSides = true;

		var cube:PrimitiveCubePrefab = new PrimitiveCubePrefab(matTx, ElementsType.TRIANGLE, 20.0, 20.0, 20.0);
		var torus:PrimitiveTorusPrefab = new PrimitiveTorusPrefab(matTx, ElementsType.TRIANGLE, 150, 80, 32, 16, true);

		this._mesh = <Sprite> torus.getNewObject();
		this._mesh2 = <Sprite> cube.getNewObject();
		this._mesh2.x = 130;
		this._mesh2.z = 40;

		this._view.scene.addChild(this._mesh);
		this._view.scene.addChild(this._mesh2);

		this._raf = new RequestAnimationFrame(this.render, this);
		this._raf.start();

		window.onresize = (event:UIEvent) => this.onResize(event);

		this.onResize();
	}

	public render(dt:number = null):void
	{

		this._view.camera.transform.rotate(this._cameraAxis, 1);
		this._mesh.rotationY += 1;
		this._mesh2.rotationX += 0.4;
		this._mesh2.rotationY += 0.4;
		this._view.render();
	}

	public onResize(event:UIEvent = null)
	{
		this._view.y = 0;
		this._view.x = 0;

		this._view.width = window.innerWidth;
		this._view.height = window.innerHeight;
	}
}