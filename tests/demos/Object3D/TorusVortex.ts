///<reference path="../../../build/stagegl-renderer.next.d.ts" />

module demos.object3d
{
	import BlendMode					= away.base.BlendMode;
	import Scene						= away.containers.Scene;
	import View							= away.containers.View;
	import Mesh							= away.entities.Mesh;
	import Vector3D						= away.geom.Vector3D;
	import TriangleMaterial				= away.materials.TriangleMaterial;
	import URLLoader					= away.net.URLLoader;
	import URLLoaderDataFormat			= away.net.URLLoaderDataFormat;
	import URLRequest					= away.net.URLRequest;
	import ParserUtils					= away.parsers.ParserUtils;
	import PrimitiveTorusPrefab			= away.prefabs.PrimitiveTorusPrefab;
	import PrimitiveCubePrefab			= away.prefabs.PrimitiveCubePrefab;
	import PerspectiveProjection		= away.projections.PerspectiveProjection;
	import DefaultRenderer				= away.render.DefaultRenderer;
	import ImageTexture					= away.textures.ImageTexture;
	import RequestAnimationFrame		= away.utils.RequestAnimationFrame;

	export class TorusVortex
	{
		private _view:View;

		private _cube:PrimitiveCubePrefab;
		private _torus:PrimitiveTorusPrefab;
		private _mesh:Mesh;
		private _mesh2:Mesh;
		
		private _raf:RequestAnimationFrame;
		private _image:HTMLImageElement;
		private _cameraAxis:away.geom.Vector3D;
		
		constructor()
		{
			away.Debug.THROW_ERRORS = false;
			
			this._view = new View(new DefaultRenderer(false, away.stagegl.ContextGLProfile.BASELINE, away.stagegl.ContextGLMode.FLASH));
			
			this._view.backgroundColor = 0x000000;
			this._view.camera.x = 130;
			this._view.camera.y = 0;
			this._view.camera.z = 0;
			this._cameraAxis = new Vector3D(0, 0, 1);

			this._view.camera.projection = new PerspectiveProjection(120);
			this._view.camera.projection.near = 0.1;

			this._cube = new PrimitiveCubePrefab(20.0, 20.0, 20.0);
			this._torus = new PrimitiveTorusPrefab(150, 80, 32, 16, true);
			
			this.loadResources();
		}
		
		private loadResources()
		{
			var urlRequest:URLRequest = new URLRequest( "assets/130909wall_big.png" );
			var urlLoader:URLLoader = new URLLoader();
			urlLoader.dataFormat = URLLoaderDataFormat.BLOB;
			urlLoader.addEventListener(away.events.Event.COMPLETE, (event:away.events.Event) => this.imageCompleteHandler(event));
			urlLoader.load(urlRequest);
		}
		
		private imageCompleteHandler(event:away.events.Event)
		{
			var imageLoader:URLLoader = <URLLoader> event.target;
			this._image = ParserUtils.blobToImage(imageLoader.data);
			this._image.onload = (event) => this.onLoadComplete(event);
		}

		private onLoadComplete(event)
		{
			var matTx:TriangleMaterial = new TriangleMaterial(new ImageTexture(this._image, false), true, true, false);

            matTx.blendMode = BlendMode.ADD;
			matTx.bothSides = true;

			this._torus.material = matTx;
			this._cube.material = matTx;

			this._mesh = <Mesh> this._torus.getNewObject();
			this._mesh2 = <Mesh> this._cube.getNewObject();
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

            this._view.camera.rotate(this._cameraAxis, 1);
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
}
