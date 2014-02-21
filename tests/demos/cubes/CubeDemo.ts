///<reference path="../../../build/Away3D.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />

module demos.cubes
{
	
	export class CubeDemo
	{
		

		private _scene			: away.containers.Scene;
		private _view			: away.containers.View;

		private _cube      		: away.primitives.CubeGeometry;
		private _torus       	: away.primitives.TorusGeometry;
		private _mesh  			: away.entities.Mesh;
		private _mesh2  		: away.entities.Mesh;
		
		private _raf			:away.utils.RequestAnimationFrame;
		private _image			:HTMLImageElement;
		private _cameraAxis		:away.geom.Vector3D;
		
		constructor()
		{
			
			away.Debug.THROW_ERRORS = false;
			
			this._view              = new away.containers.View( new away.render.DefaultRenderer());
			
			this._view.backgroundColor = 0x000000;
			this._view.camera.x = 130;
			this._view.camera.y = 0;
			this._view.camera.z = 0;
			this._cameraAxis = new away.geom.Vector3D( 0, 0, 1 );

			this._view.camera.projection = new away.projections.PerspectiveProjection( 120 );
			
			this._cube              = new away.primitives.CubeGeometry( 20.0, 20.0, 20.0 );
			this._torus             = new away.primitives.TorusGeometry( 150, 80, 32, 16, true );
			
			this.loadResources();
		}
		
		private loadResources()
		{
			var urlRequest:away.net.URLRequest = new away.net.URLRequest( "assets/130909wall_big.png" );
			var urlLoader:away.net.URLLoader = new away.net.URLLoader();
			urlLoader.dataFormat = away.net.URLLoaderDataFormat.BLOB;
			urlLoader.addEventListener( away.events.Event.COMPLETE, away.utils.Delegate.create(this, this.imageCompleteHandler) );
			urlLoader.load( urlRequest );
		}
		
		private imageCompleteHandler(e)
		{
			var imageLoader:away.net.URLLoader = <away.net.URLLoader> e.target
			this._image = away.parsers.ParserUtils.blobToImage(imageLoader.data);
			this._image.onload = (event) => this.onLoadComplete(event);
		}

		private onLoadComplete(event)
		{
			var ts : away.textures.ImageTexture = new away.textures.ImageTexture( this._image, false );
			
			var matTx: away.materials.TextureMaterial = new away.materials.TextureMaterial( ts, true, true, false );

            matTx.blendMode = away.base.BlendMode.ADD;
			matTx.bothSides = true;
			
			this._mesh              = new away.entities.Mesh( this._torus, matTx );
			this._mesh2              = new away.entities.Mesh( this._cube, matTx );
			this._mesh2.x = 130;
			this._mesh2.z = 40;
			
			this._view.scene.addChild( this._mesh );
			this._view.scene.addChild( this._mesh2 );
			
			this._raf = new away.utils.RequestAnimationFrame( this.render , this );
            this._raf.start();

            window.onresize = () => this.resize( null );

            this.resize( null );
		}
		
		public render( dt:number = null ):void
		{

            this._view.camera.rotate( this._cameraAxis, 1 );
            this._mesh.rotationY += 1;
            this._mesh2.rotationX += 0.4;
            this._mesh2.rotationY += 0.4;
            this._view.render();
		}

        public resize( e )
        {
            this._view.y         = 0;
            this._view.x         = 0;

            this._view.width     = window.innerWidth;
            this._view.height    = window.innerHeight;

        }

	}
}
