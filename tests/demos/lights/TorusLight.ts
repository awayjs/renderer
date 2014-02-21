///<reference path="../../../build/Away3D.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />

module demos.lights
{
	
	export class TorusLight
	{

		private _scene			: away.containers.Scene;
		private _view			: away.containers.View;
		private _torus       	: away.primitives.TorusGeometry;
		private _mesh  			: away.entities.Mesh;
		private _raf			: away.utils.RequestAnimationFrame;
		private _image			: HTMLImageElement;
		private _light			: away.lights.DirectionalLight;
		
		constructor()
		{

            away.Debug.THROW_ERRORS     = false;
            away.Debug.ENABLE_LOG       = false;
            away.Debug.LOG_PI_ERRORS    = false;

			this._view                  = new away.containers.View( new away.render.DefaultRenderer());
			this._view.backgroundColor  = 0x014C73;
			this._view.camera.projection      = new away.projections.PerspectiveProjection( 60 );
			this._torus                 = new away.primitives.TorusGeometry( 120, 80, 32, 16, false );
			
			this.loadResources();

		}
		
		private loadResources()
		{
			var urlRequest:away.net.URLRequest = new away.net.URLRequest( "dots.png" );

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
            this._view.camera.z = -1000;
			var ts : away.textures.ImageTexture = new away.textures.ImageTexture( this._image, false );
			
			var light:away.lights.DirectionalLight = new away.lights.DirectionalLight();
                light.color         = 0x00ff88;
                light.direction     = new away.geom.Vector3D( 0, 0, 1 );
                light.ambient       = 0.6;
                light.diffuse       = .7;
                light.specular      = 60;

			this._view.scene.addChild( light );
			
			var lightPicker:away.materials.StaticLightPicker = new away.materials.StaticLightPicker( [light] );
			
			var matTx: away.materials.TextureMaterial = new away.materials.TextureMaterial( ts, true, true, false );
			    matTx.lightPicker = lightPicker;

			this._mesh              = new away.entities.Mesh( this._torus, matTx );

			this._view.scene.addChild( this._mesh );

			this._raf = new away.utils.RequestAnimationFrame( this.render , this );
            this._raf.start();



            window.onresize = () => this.resize( );

            this.resize( );

            this.render( 0 );
			
		}


		public render( dt:number = null ):void
		{
            this._mesh.rotationY += 1;
            this._view.render();
		}


        public resize(  )
        {
            this._view.y         = 0;
            this._view.x         = 0;

            this._view.width     = window.innerWidth;
            this._view.height    = window.innerHeight;

        }
		

	}
}