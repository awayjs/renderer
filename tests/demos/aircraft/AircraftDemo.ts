///<reference path="../../../build/Away3D.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />

module demos.aircraft
{
    export class AircraftDemo
    {
        //{ state
        private _maxStates          : number = 2;
        private _cameraIncrement    : number = 0;
        private _rollIncrement      : number = 0;
        private _loopIncrement      : number = 0;
        private _state              : number = 0;
        private _appTime			: number = 0;
        //}
		
        private _lightPicker		: away.materials.StaticLightPicker;
        private _view				: away.containers.View;
        private _timer              : away.utils.RequestAnimationFrame;
		
        //{ sea
        private _seaGeom			: away.primitives.PlaneGeometry;
        private _seaMesh			: away.entities.Mesh;
        private _seaNormalTexture	: away.textures.ImageTexture;
        private _seaInitialized		: boolean = false;
        private _seaMaterial        : away.materials.TextureMaterial;
        //}
		
        //{ f14
        private _f14Geom			: away.containers.DisplayObjectContainer;
        private _f14Initialized		: boolean = false;
        //}
		
        //{ skybox
        private _waterMethod        : away.materials.SimpleWaterNormalMethod
        private _skyboxCubeTexture  : away.textures.ImageCubeTexture;
        private _skyboxInitialized	: boolean = false;
        //}
		
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
        }
		
        private loadAssets():void
        {
            this.loadAsset( 'assets/sea_normals.jpg' );
            this.loadAsset( 'assets/f14d.obj' );
            this.loadAsset( 'assets/CubeTextureTest.cube' );
        }
		
        private loadAsset( path: string ):void
        {
            var token:away.net.AssetLoaderToken = away.library.AssetLibrary.load( new away.net.URLRequest( path ) );
            token.addEventListener( away.events.LoaderEvent.RESOURCE_COMPLETE, away.utils.Delegate.create(this, this.onResourceComplete) );
        }
		
        private initParsers():void
        {
            away.library.AssetLibrary.enableParser( away.parsers.OBJParser );
            away.library.AssetLibrary.enableParser( away.parsers.CubeTextureParser );
        }
		
        private initAnimation():void
        {
            this._timer = new away.utils.RequestAnimationFrame( this.render, this );
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
		
		private initializeScene():void
		{
			if( this._skyboxCubeTexture &&
				this._f14Geom &&
				this._seaNormalTexture )
			{
				this.initF14();
				this.initSea();
				this._timer.start();
			}
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
		
        private initF14():void
        {
			this._f14Initialized = true;
			
			var f14Material: away.materials.TextureMaterial = new away.materials.TextureMaterial( this._seaNormalTexture, true, true, false ); // will be the cubemap
			f14Material.lightPicker = this._lightPicker;
			
			this._view.scene.addChild( this._f14Geom );
			this._f14Geom.transform.scale = new away.geom.Vector3D( 20, 20, 20 );
			this._f14Geom.rotationX = 90;
			this._f14Geom.y = 200;
			this._view.camera.lookAt( this._f14Geom.transform.position );
			
			document.onmousedown = () => this.onMouseDown();
        }

        private initSea():void
        {
			this._seaMaterial                                       = new away.materials.TextureMaterial( this._seaNormalTexture, true, true, false ); // will be the cubemap
			this._waterMethod                                       = new away.materials.SimpleWaterNormalMethod( this._seaNormalTexture, this._seaNormalTexture );
			var fresnelMethod:away.materials.FresnelSpecularMethod  = new away.materials.FresnelSpecularMethod();
			fresnelMethod.normalReflectance                         = .3;
			
			this._seaMaterial.alphaBlending   = true;
			this._seaMaterial.lightPicker     = this._lightPicker;
			this._seaMaterial.repeat          = true;
			this._seaMaterial.animateUVs      = true;
			this._seaMaterial.normalMethod    = this._waterMethod ;
			this._seaMaterial.addMethod( new away.materials.EnvMapMethod( this._skyboxCubeTexture ) );
			this._seaMaterial.specularMethod  = fresnelMethod;
			this._seaMaterial.gloss           = 100;
			this._seaMaterial.specular        = 1;
			
			this._seaGeom = new away.primitives.PlaneGeometry( 50000, 50000, 1, 1, true, false );
			this._seaGeom.scaleUV( 100, 100 );
			this._seaMesh = new away.entities.Mesh( this._seaGeom, this._seaMaterial );
            //this._view.scene.addChild( new away.primitives.SkyBox( this._skyboxCubeTexture ));
			this._view.scene.addChild( this._seaMesh );
        }
		
        public onResourceComplete ( e: away.events.LoaderEvent )
        {
            var loader			: away.net.AssetLoader   	= <away.net.AssetLoader> e.target;
            var numAssets		: number 						= loader.baseDependency.assets.length;
            var i				: number						= 0;
			
            switch( e.url )
            {
                case "assets/sea_normals.jpg":
                    this._seaNormalTexture = <away.textures.ImageTexture> loader.baseDependency.assets[ 0 ];
                    break;
                case 'assets/f14d.obj':
                    this._f14Geom = new away.containers.DisplayObjectContainer();
                    for( i = 0; i < numAssets; ++i )
                    {
                        var asset: away.library.IAsset = loader.baseDependency.assets[ i ];
                        switch ( asset.assetType )
                        {
                            case away.library.AssetType.MESH:
                                var mesh : away.entities.Mesh = <away.entities.Mesh> asset;
                                this._f14Geom.addChild( mesh );
                                break;
                            case away.library.AssetType.GEOMETRY:
                                break;
                            case away.library.AssetType.MATERIAL:
                                break;
                        }
                    }
                    break;
                case 'assets/CubeTextureTest.cube':
                    this._skyboxCubeTexture = <away.textures.ImageCubeTexture> loader.baseDependency.assets[ 0 ];
                    break;
            }
			this.initializeScene();
        }
		
        private render( dt: number ) //animate based on dt for firefox
        {
            if ( this._f14Geom )
            {
                this._rollIncrement += 0.02;
				
                switch ( this._state )
                {
                    case 0 :
                        this._f14Geom.rotationZ = Math.sin( this._rollIncrement ) * 25;
                        break;
                    case 1 :
                        this._loopIncrement += 0.05;
                        this._f14Geom.z += Math.cos( this._loopIncrement ) * 20
                        this._f14Geom.y += Math.sin( this._loopIncrement ) * 20;
                        this._f14Geom.rotationX += -1 * ( ( Math.PI / 180 ) * Math.atan2( this._f14Geom.z , this._f14Geom.y ) ) ;//* 20;
                        this._f14Geom.rotationZ = Math.sin( this._rollIncrement ) * 25;
						
                        if ( this._loopIncrement > ( Math.PI * 2 ) )
                        {
                            this._loopIncrement = 0;
                            this._state = 0;
                        }
                        break;
                }
            }
			
            if ( this._f14Geom )
			{
                this._view.camera.lookAt( this._f14Geom.transform.position );
			}
			
            if ( this._view.camera )
            {
                this._cameraIncrement += 0.01;
                this._view.camera.x = Math.cos( this._cameraIncrement ) * 400;
                this._view.camera.z = Math.sin( this._cameraIncrement ) * 400;
            }
			
            if ( this._f14Geom )
			{
                this._view.camera.lookAt( this._f14Geom.transform.position );
			}
			
            if ( this._seaMaterial )
            {
                this._seaMesh.subMeshes[0].uvTransform.offsetV -= 0.04;
				
                /*
                 this.waterMethod.water1OffsetX += .001;
                 this.waterMethod.water1OffsetY += .1;
                 this.waterMethod.water2OffsetX += .0007;
                 this.waterMethod.water2OffsetY += .6;
                 //*/
            }
			
            this._appTime += dt;
            this._view.render();
        }
		
        public resize()
        {
            this._view.y         = 0;
            this._view.x         = 0;
            this._view.width     = window.innerWidth;
            this._view.height    = window.innerHeight;
        }
		
        private onMouseDown()
        {
            this._state++;
            if ( this._state >= this._maxStates )
			{
                this._state = 0;
			}
        }
    }
}
