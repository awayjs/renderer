/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

///<reference path="../../../src/away/_definitions.ts" />

module demos.aircraft
{
    export class AircraftDemo
    {

        private maxStates                           : number = 2;

        private cameraIncrement                     : number = 0;
        private rollIncrement                       : number = 0 ;
        private loopIncrement                       : number = 0 ;
        private state                               : number = 0;

        private waterMethod : away.materials.SimpleWaterNormalMethod

        private _view								: away.containers.View3D;
        private _timer								: away.utils.RequestAnimationFrame;
		
		//{ sea
		private _seaGeom							: away.primitives.PlaneGeometry;
		private _seaMesh							: away.entities.Mesh;		
		private _seaNormalTexture					: away.textures.HTMLImageElementTexture;
		private _seaInitialized						: boolean = false;
        private _seaMaterial : away.materials.TextureMaterial;

		//}
		
		//{ f14
		private _f14Geom							: away.containers.ObjectContainer3D;

		private _f14Initialized						: boolean = false;
		//}
		
		//{ skybox
		private _skyPositiveX						: away.textures.HTMLImageElementTexture;
		private _skyNegativeX						: away.textures.HTMLImageElementTexture;
		private _skyPositiveY						: away.textures.HTMLImageElementTexture;
		private _skyNegativeY						: away.textures.HTMLImageElementTexture;
		private _skyPositiveZ						: away.textures.HTMLImageElementTexture;
		private _skyNegativeZ						: away.textures.HTMLImageElementTexture;

        private skyboxCubeTexture                         : away.textures.HTMLImageElementCubeTexture;
		
		private _skyboxInitialized					: boolean = false;
		//}
		
		
		private _lightPicker						: away.materials.StaticLightPicker;
		private _appTime							: number = 0;
		
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
		
		private initParsers():void
		{
			away.library.AssetLibrary.enableParser( away.loaders.OBJParser );
		}
		
		private loadAssets():void
		{
			this.loadAsset( 'assets/sea_normals.jpg' );
			this.loadAsset( 'assets/f14d.obj' );
			
			this.loadAsset( 'assets/sky_negX.jpg' );
			this.loadAsset( 'assets/sky_posX.jpg' );
			this.loadAsset( 'assets/sky_negY.jpg' );
			this.loadAsset( 'assets/sky_posY.jpg' );
			this.loadAsset( 'assets/sky_negZ.jpg' );
			this.loadAsset( 'assets/sky_posZ.jpg' );
		}
		
		private loadAsset( path: string ):void
		{
			var token:away.loaders.AssetLoaderToken = away.library.AssetLibrary.load( new away.net.URLRequest( path ) );
            token.addEventListener( away.events.LoaderEvent.RESOURCE_COMPLETE, this.onResourceComplete, this );
		}
		
		private initAnimation():void
		{
			this._timer = new away.utils.RequestAnimationFrame( this.render, this );
		}
		
		private initView():void
		{
			this._view						= new away.containers.View3D();
            this._view.camera.z				= -500;
			this._view.camera.y				= 250;
			this._view.camera.rotationX		= 20;
            this._view.camera.lens.near		= 0.5;
			this._view.camera.lens.far		= 14000;
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

        private render( dt: number ) //animate based on dt for firefox
        {


            if ( this._f14Geom )
            {

                this.rollIncrement += 0.02;


                switch ( this.state )
                {

                    case 0 :

                        this._f14Geom.rotationZ = Math.sin( this.rollIncrement ) * 25;

                        break;
                    case 1 :


                        this.loopIncrement += 0.05;

                        this._f14Geom.z += Math.cos( this.loopIncrement ) * 20
                        this._f14Geom.y += Math.sin( this.loopIncrement ) * 20;
                        this._f14Geom.rotationX += -1 * ( ( Math.PI / 180 ) * Math.atan2( this._f14Geom.z , this._f14Geom.y ) ) ;//* 20;
                        this._f14Geom.rotationZ = Math.sin( this.rollIncrement ) * 25;

                        if ( this.loopIncrement > ( Math.PI * 2 ) )
                        {

                            this.loopIncrement = 0;
                            this.state = 0;
                        }

                        break;



                }


            }

            if ( this._f14Geom )
                this._view.camera.lookAt( this._f14Geom.position );

            if ( this._view.camera )
            {

                this.cameraIncrement += 0.01;

                this._view.camera.x = Math.cos( this.cameraIncrement ) * 400;
                this._view.camera.z = Math.sin( this.cameraIncrement ) * 400;

            }

            if ( this._f14Geom )
                this._view.camera.lookAt( this._f14Geom.position );

            if ( this._seaMaterial )
            {


                this._seaMesh.subMeshes[0].offsetV -= 0.04;


                         /*
                this.waterMethod.water1OffsetX += .001;
                this.waterMethod.water1OffsetY += .1;
                this.waterMethod.water2OffsetX += .0007;
                this.waterMethod.water2OffsetY += .6;
                           */

                //this._seaMaterial
            }

			this._appTime += dt;
            this._view.render();
        }
		
        public onResourceComplete ( e: away.events.LoaderEvent )
        {
			console.log( "Loaded asset: " + e.url );
			
			var loader			: away.loaders.AssetLoader   	= <away.loaders.AssetLoader> e.target;
			var numAssets		: number 						= loader.baseDependency.assets.length;
			var i				: number						= 0;
			
			switch( e.url )
			{
				case "assets/sea_normals.jpg":
						this._seaNormalTexture = <away.textures.HTMLImageElementTexture> loader.baseDependency.assets[ 0 ];
						this.initSea();
						this.initF14(); // TODO remove this mock call which enforces a temporary f14 texture allocation
					break;
				case 'assets/f14d.obj':
						this._f14Geom = new away.containers.ObjectContainer3D();
						for( i = 0; i < numAssets; ++i )
						{
							var asset: away.library.IAsset = loader.baseDependency.assets[ i ];
                            switch ( asset.assetType )
                            {
                                case away.library.AssetType.MESH:
                                    var mesh : away.entities.Mesh = <away.entities.Mesh> asset;
                                   // this._f14Meshes.push( mesh ); // can we just getChildAt or getByResource name in this._f14Geom?
                                    this._f14Geom.addChild( mesh );
                                    break;
                                case away.library.AssetType.GEOMETRY:
                                    break;
                                case away.library.AssetType.MATERIAL:
                                    break;
                            }
						}
						this.initF14();
					break;
				case 'assets/sky_negX.jpg':
						this._skyNegativeX = <away.textures.HTMLImageElementTexture> loader.baseDependency.assets[ 0 ];
						this.initSkybox();
					break;
				case 'assets/sky_posX.jpg':
						this._skyPositiveX = <away.textures.HTMLImageElementTexture> loader.baseDependency.assets[ 0 ];
						this.initSkybox();
					break;
				case 'assets/sky_negY.jpg':
						this._skyNegativeY = <away.textures.HTMLImageElementTexture> loader.baseDependency.assets[ 0 ];
						this.initSkybox();
					break;
				case 'assets/sky_posY.jpg':
						this._skyPositiveY = <away.textures.HTMLImageElementTexture> loader.baseDependency.assets[ 0 ];
						this.initSkybox();
					break;
				case 'assets/sky_negZ.jpg':
						this._skyNegativeZ = <away.textures.HTMLImageElementTexture> loader.baseDependency.assets[ 0 ];
						this.initSkybox();
					break;
				case 'assets/sky_posZ.jpg':
						this._skyPositiveZ = <away.textures.HTMLImageElementTexture> loader.baseDependency.assets[ 0 ];
						this.initSkybox();
					break;
			}

            this.initSea();

        }
		
		private initSkybox():void
		{
			if( !this._skyboxInitialized &&
				 this._skyNegativeX &&
				 this._skyPositiveX &&
				 this._skyNegativeY &&
				 this._skyPositiveY &&
				 this._skyNegativeZ &&
				 this._skyPositiveZ )
			{

                this.skyboxCubeTexture = new away.textures.HTMLImageElementCubeTexture(   this._skyPositiveX.htmlImageElement, this._skyNegativeX.htmlImageElement,
                                                                                    this._skyNegativeY.htmlImageElement, this._skyPositiveY.htmlImageElement,
                                                                                    this._skyNegativeZ.htmlImageElement, this._skyPositiveZ.htmlImageElement);
				this._skyboxInitialized = true;
				console.log( "lets build a skybox!" );
			}
		}
		
		private initF14():void
		{
			if( this._f14Geom && !this._f14Initialized && this._seaNormalTexture ) // TEMP remove _seaNormalTexture dependency
			{
				this._f14Initialized = true;
    			
				var f14Material: away.materials.TextureMaterial = new away.materials.TextureMaterial( this._seaNormalTexture, true, true, false ); // will be the cubemap
				    f14Material.lightPicker = this._lightPicker;
				this._view.scene.addChild( this._f14Geom );
                this._f14Geom.scale( 20 );
                this._f14Geom.rotationX = 90;
                this._f14Geom.y = 200;
                this._view.camera.lookAt( this._f14Geom.position );


                document.onmousedown = () => this.onMouseDown();

			}
		}



        private onMouseDown()
        {

            this.state ++;

            if ( this.state >= this.maxStates )
                this.state = 0;


        }



        private initSea():void
		{
			if( this._seaNormalTexture && !this._seaInitialized && this._skyboxInitialized) // will check for all dependencies e.g. cubemap
			{
				this._seaMaterial                                       = new away.materials.TextureMaterial( this._seaNormalTexture, true, true, false ); // will be the cubemap
				this.waterMethod                                        = new away.materials.SimpleWaterNormalMethod( this._seaNormalTexture, this._seaNormalTexture );
				var fresnelMethod:away.materials.FresnelSpecularMethod  = new away.materials.FresnelSpecularMethod();
				    fresnelMethod.normalReflectance                     = .3;

                this._seaMaterial.alphaBlending   = true;
                this._seaMaterial.lightPicker     = this._lightPicker;
                this._seaMaterial.repeat          = true;

                this._seaMaterial.animateUVs = true;

                this._seaMaterial.normalMethod = this.waterMethod ;
                //this._seaMaterial.addMethod( new away.materials.EnvMapMethod( this.skyboxCubeTexture ) );
                //this._seaMaterial.specularMethod = fresnelMethod;

                this._seaMaterial.gloss = 100;
                this._seaMaterial.specular = 1;
				
				this._seaGeom = new away.primitives.PlaneGeometry( 50000, 50000, 1, 1, true, false );
				this._seaGeom.scaleUV( 100, 100 );
				this._seaMesh = new away.entities.Mesh( this._seaGeom, this._seaMaterial );
				this._view.scene.addChild( this._seaMesh );
				
				this._seaInitialized = true;
				this._timer.start(); // will be moved to complete handler (why does this not work when the display list is empty?)
			}
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
