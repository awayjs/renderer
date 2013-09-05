/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

///<reference path="../../../src/away/_definitions.ts" />

module demos.aircraft
{
    export class AircraftDemo
    {
		
        private _view								: away.containers.View3D;
        private _timer								: away.utils.RequestAnimationFrame;
		
		//{ sea
		private _seaGeom							: away.primitives.PlaneGeometry;
		private _seaMesh							: away.entities.Mesh;		
		private _seaNormalTexture					: away.textures.HTMLImageElementTexture;
		private _seaInitialized						: boolean = false;
		//}
		
		//{ f14
		private _f14Geom								: away.containers.ObjectContainer3D;
		private _f14Meshes							: Array<away.entities.Mesh> = new Array<away.entities.Mesh>();
		
		private _f14StoresDiffuseTexture			: away.textures.HTMLImageElementTexture;
		private _f14StoresNormalTexture				: away.textures.HTMLImageElementTexture;
		private _f14StoresSpecularTexture			: away.textures.HTMLImageElementTexture;
		
		private _f14Wing1DiffuseTexture				: away.textures.HTMLImageElementTexture;
		private _f14Wing1NormalTexture				: away.textures.HTMLImageElementTexture;
		private _f14Wing1SpecularTexture			: away.textures.HTMLImageElementTexture;
		
		private _f14Wing2DiffuseTexture				: away.textures.HTMLImageElementTexture;
		private _f14Wing2NormalTexture				: away.textures.HTMLImageElementTexture;
		private _f14Wing2SpecularTexture			: away.textures.HTMLImageElementTexture;
		
		private _f14CanopyDiffuseTexture			: away.textures.HTMLImageElementTexture;
		private _f14CanopySpecularTexture			: away.textures.HTMLImageElementTexture;
		
		private _f14BurnerDiffuseTexture			: away.textures.HTMLImageElementTexture;
		private _f14EngineDiffuseTexture			: away.textures.HTMLImageElementTexture;
		
		private _f14FuselageDiffuseTexture			: away.textures.HTMLImageElementTexture;
		private _f14FuselageNormalTexture			: away.textures.HTMLImageElementTexture;
		private _f14FuselageSpecularTexture			: away.textures.HTMLImageElementTexture;
		
		private _f14FuselageLowerDiffuseTexture		: away.textures.HTMLImageElementTexture;
		private _f14FuselageLowerNormalTexture		: away.textures.HTMLImageElementTexture;
		private _f14FuselageLowerSpecularTexture	: away.textures.HTMLImageElementTexture;
		
		private _f14IntakesDiffuseTexture			: away.textures.HTMLImageElementTexture;
		private _f14IntakesNormalTexture			: away.textures.HTMLImageElementTexture;
		private _f14IntakesSpecularTexture			: away.textures.HTMLImageElementTexture;
		
		private _f14InteriorDiffuseTexture			: away.textures.HTMLImageElementTexture;
		private _f14LandingGearDiffuseTexture		: away.textures.HTMLImageElementTexture;
		
		private _f14TailLeftDiffuseTexture			: away.textures.HTMLImageElementTexture;
		private _f14TailLeftNormalTexture			: away.textures.HTMLImageElementTexture;
		private _f14TailLeftSpecularTexture			: away.textures.HTMLImageElementTexture;
		
		private _f14TailRightDiffuseTexture			: away.textures.HTMLImageElementTexture;
		private _f14TailRightNormalTexture			: away.textures.HTMLImageElementTexture;
		private _f14TailRightSpecularTexture		: away.textures.HTMLImageElementTexture;
		
		private _f14TaileronLeftDiffuseTexture		: away.textures.HTMLImageElementTexture;
		private _f14TaileronLeftNormalTexture		: away.textures.HTMLImageElementTexture;
		private _f14TaileronLeftSpecularTexture		: away.textures.HTMLImageElementTexture;
		
		private _f14TaileronRightDiffuseTexture		: away.textures.HTMLImageElementTexture;
		private _f14TaileronRightNormalTexture		: away.textures.HTMLImageElementTexture;
		private _f14TaileronRightSpecularTexture	: away.textures.HTMLImageElementTexture;
		
		private _f14PilotDiffuseTexture				: away.textures.HTMLImageElementTexture;
		private _f14SeatDiffuseTexture				: away.textures.HTMLImageElementTexture;
		
		private _f14Initialized						: boolean = false;
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
            this._view.camera.z				= -50;
			this._view.camera.y				= 600;
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
							var mesh: away.entities.Mesh = <away.entities.Mesh> away.library.AssetLibrary.getAsset( asset.name );
							
							this._f14Meshes.push( mesh ); // can we just getChildAt or getByResource name in this._f14Geom?
							this._f14Geom.addChild( mesh );
						}
						this.initF14();
					break;
			}
        }
		
		private initF14():void
		{
			if( this._f14Geom && !this._f14Initialized && this._seaNormalTexture ) // TEMP remove _seaNormalTexture dependency
			{
				var f14Material: away.materials.TextureMaterial = new away.materials.TextureMaterial( this._seaNormalTexture, true, true, false ); // will be the cubemap
				f14Material.lightPicker = this._lightPicker;
				
				for( var i: number = 0; i < this._f14Meshes.length; ++i )
                {
                    this._f14Meshes[ i ].material = f14Material;
                }
				this._view.scene.addChild( this._f14Geom );
				
				this._f14Initialized = true;
			}
		}
		
		private initSea():void
		{
			if( this._seaNormalTexture && !this._seaInitialized ) // will check for all dependencies e.g. cubemap
			{
				var seaMaterial: away.materials.TextureMaterial = new away.materials.TextureMaterial( this._seaNormalTexture, true, true, false ); // will be the cubemap
				//var waterMethod:away.materials.SimpleWaterNormalMethod = new away.materials.SimpleWaterNormalMethod( seaNormalTexture, seaNormalTexture );
				//var fresnelMethod:away.materials.FresnelSpecularMethod = new away.materials.FresnelSpecularMethod();
				//fresnelMethod.normalReflectance = .3;
				
				seaMaterial.alphaBlending = true;
				seaMaterial.lightPicker = this._lightPicker;
				seaMaterial.repeat = true;
				//waterMaterial.normalMethod = waterMethod;
				//waterMaterial.addMethod( new away.materials.EnvMapMethod( cubeTexture ) );
				//waterMaterial.specularMethod = fresnelMethod;
				seaMaterial.gloss = 100;
				seaMaterial.specular = 1;
				
				this._seaGeom = new away.primitives.PlaneGeometry( 50000, 50000, 1, 1, true, false );
				this._seaGeom.scaleUV( 100, 100 );
				this._seaMesh = new away.entities.Mesh( this._seaGeom, seaMaterial );
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
