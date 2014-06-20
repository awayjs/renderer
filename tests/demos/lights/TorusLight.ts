///<reference path="../../../build/stagegl-renderer.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />

module demos.lights
{
	import View							= away.containers.View;
	import DirectionalLight				= away.entities.DirectionalLight;
	import Mesh							= away.entities.Mesh;
	import Vector3D						= away.geom.Vector3D;
	import AssetLibrary					= away.library.AssetLibrary;
	import AssetLoader					= away.library.AssetLoader;
	import AssetLoaderToken				= away.library.AssetLoaderToken;
	import AssetType					= away.library.AssetType;
	import IAsset						= away.library.IAsset;
	import StaticLightPicker			= away.materials.StaticLightPicker;
	import TriangleMaterial				= away.materials.TriangleMaterial;
	import URLLoader					= away.net.URLLoader;
	import URLLoaderDataFormat			= away.net.URLLoaderDataFormat;
	import URLRequest					= away.net.URLRequest;
	import ParserUtils					= away.parsers.ParserUtils;
	import PrimitiveTorusPrefab			= away.prefabs.PrimitiveTorusPrefab;
	import PerspectiveProjection		= away.projections.PerspectiveProjection;
	import DefaultRenderer				= away.render.DefaultRenderer;
	import ImageTexture					= away.textures.ImageTexture;
	import RequestAnimationFrame		= away.utils.RequestAnimationFrame;

	export class TorusLight
	{
		private _view:View;
		private _torus:PrimitiveTorusPrefab;
		private _mesh:Mesh;
		private _raf:RequestAnimationFrame;
		private _image:HTMLImageElement;
		
		constructor()
		{
            away.Debug.THROW_ERRORS = false;
            away.Debug.ENABLE_LOG = false;
            away.Debug.LOG_PI_ERRORS = false;

			this._view = new View(new DefaultRenderer());
			this._view.backgroundColor = 0x014C73;
			this._view.camera.projection = new PerspectiveProjection(60);
			this._torus = new PrimitiveTorusPrefab(120, 80, 32, 16, false);
			
			this.loadResources();
		}
		
		private loadResources()
		{
			var urlRequest:URLRequest = new URLRequest("dots.png");

			var urlLoader:URLLoader = new URLLoader();
			urlLoader.dataFormat = URLLoaderDataFormat.BLOB;
			urlLoader.addEventListener(away.events.Event.COMPLETE, (event:away.events.Event) => this.imageCompleteHandler(event));
			urlLoader.load(urlRequest);
		}

		private imageCompleteHandler(event:away.events.Event)
		{
			var imageLoader:URLLoader = <URLLoader> event.target;

			this._image = ParserUtils.blobToImage(imageLoader.data);
			this._image.onload = (event:Event) => this.onLoadComplete(event);
		}

		private onLoadComplete(event:Event)
		{
            this._view.camera.z = -1000;
			var ts:ImageTexture = new ImageTexture(this._image, false);
			
			var light:DirectionalLight = new DirectionalLight();
			light.color = 0x00ff88;
			light.direction = new Vector3D(0, 0, 1);
			light.ambient = 0.6;
			light.diffuse = .7;
			light.specular = 60;

			this._view.scene.addChild(light);
			
			var lightPicker:StaticLightPicker = new StaticLightPicker([light]);
			
			var matTx:TriangleMaterial = new TriangleMaterial(ts, true, true, false);
			matTx.lightPicker = lightPicker;

			this._torus.material = matTx;

			this._mesh = <Mesh> this._torus.getNewObject();

			this._view.scene.addChild(this._mesh);

			this._raf = new RequestAnimationFrame(this.render , this);
            this._raf.start();

            window.onresize = (event:UIEvent) => this.resize(event);

            this.resize();
		}


		public render(dt:number = null):void
		{
            this._mesh.rotationY += 1;
            this._view.render();
		}


        public resize(event:UIEvent = null)
        {
            this._view.y = 0;
            this._view.x = 0;

            this._view.width = window.innerWidth;
            this._view.height = window.innerHeight;
        }
	}
}