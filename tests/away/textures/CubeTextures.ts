///<reference path="../../../build/Away3D.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />

module tests.textures
{
	export class CubeTextures
	{
		private _appTime			: number = 0;
		private _lightPicker		: away.materials.StaticLightPicker;
		private _view				: away.containers.View;
		private _timer              : away.utils.RequestAnimationFrame;
		private _skyboxCubeTexture  : away.textures.ImageCubeTexture;

        private _torus              : away.primitives.TorusGeometry;
        private _torusMesh          : away.entities.Mesh;
        private _cubeMaterial       : away.materials.SkyboxMaterial;

        private _skybox             : away.entities.Skybox;



		constructor()
		{
			away.Debug.LOG_PI_ERRORS    = false;
			away.Debug.THROW_ERRORS     = false;

			this.initView();
			this.initLights();
			this.initAnimation();
			this.initParsers();
			this.loadAssets();

			window.onresize = () => this.resize();
            document.onmousedown = (event) => this.render( 0 );
		}

		private loadAssets():void
		{
			this.loadAsset( 'assets/CubeTextureTest.cube' );
		}

		private loadAsset( path: string ):void
		{
			var token:away.net.AssetLoaderToken = away.library.AssetLibrary.load( new away.net.URLRequest( path ) );
			token.addEventListener( away.events.LoaderEvent.RESOURCE_COMPLETE, away.utils.Delegate.create(this, this.onResourceComplete) );
		}

		private initParsers():void
		{
			away.library.AssetLibrary.enableParser( away.parsers.CubeTextureParser );
		}

		private initAnimation():void
		{
			//this._timer = new away.utils.RequestAnimationFrame( this.render, this );
		}

		private initView():void
		{
			this._view						= new away.containers.View(new away.render.DefaultRenderer());
			this._view.camera.z				= -500;
			this._view.camera.y				= 250;
			this._view.camera.rotationX		= 20;
			this._view.camera.projection.near		= 0.5;
			this._view.camera.projection.far		= 14000;
			this._view.backgroundColor		= 0x2c2c32;
			this.resize();
		}

		private initLights():void
		{
			var light:away.lights.DirectionalLight = new away.lights.DirectionalLight();
			light.color						= 0x974523;
			light.direction					= new away.geom.Vector3D( -300, -300, -5000 );
			light.ambient					= 1;
			light.ambientColor				= 0x7196ac;
			light.diffuse					= 1.2;
			light.specular					= 1.1;
			this._view.scene.addChild( light );

			this._lightPicker = new away.materials.StaticLightPicker( [light] );
		}

		public onResourceComplete ( e: away.events.LoaderEvent )
		{
			var loader			: away.net.AssetLoader   	= <away.net.AssetLoader> e.target;

			switch( e.url )
			{
                case 'assets/CubeTextureTest.cube':
					this._skyboxCubeTexture = <away.textures.ImageCubeTexture> loader.baseDependency.assets[ 0 ];

                    this._torus = new away.primitives.TorusGeometry();

                    this._cubeMaterial = new away.materials.SkyboxMaterial( this._skyboxCubeTexture );
                    this._torusMesh = new away.entities.Mesh( this._torus, this._cubeMaterial );

                    this._view.scene.addChild( this._torusMesh );


                    this._skybox = new away.entities.Skybox( this._skyboxCubeTexture );
                    this._view.scene.addChild( this._skybox );

					break;
			}

            this._timer = new away.utils.RequestAnimationFrame( this.render, this );
            this._timer.start();
		}

		private render( dt: number ) //animate based on dt for firefox
		{
			this._appTime += dt;
            this._view.camera.rotationY += 0.01 * dt;
			this._view.render();
		}

		public resize()
		{
			this._view.y         = 0;
			this._view.x         = 0;
			this._view.width     = window.innerWidth;
			this._view.height    = window.innerHeight;
		}

	}
}
