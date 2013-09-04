/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

///<reference path="../../../src/away/_definitions.ts" />

module demos.aircraft
{
    export class AircraftDemo
    {
        private _view    : away.containers.View3D;
        private _raf     : away.utils.RequestAnimationFrame;
		
		private _seaGeom					: away.primitives.PlaneGeometry;
		private _seaMesh					: away.entities.Mesh;		
		private _seaNormalTexture			: away.textures.HTMLImageElementTexture;
		private _seaInitialized				: boolean = false;
		
		private _lightPicker				: away.materials.StaticLightPicker;
		private _appTime					: number = 0;
		
        constructor()
        {
            away.Debug.LOG_PI_ERRORS    = false;
            away.Debug.THROW_ERRORS     = false;
			
            this.initView();
            this.initLights();
			this.initAnimation();
			this.loadAssets();
			
            //away.library.AssetLibrary.enableParser( away.loaders.OBJParser ) ;
			
            window.onresize = () => this.resize();
        }
		
		private loadAssets():void
		{
			var token: away.loaders.AssetLoaderToken;
			
            token = away.library.AssetLibrary.load( new away.net.URLRequest( 'sea_normals.jpg' ) );
            token.addEventListener( away.events.LoaderEvent.RESOURCE_COMPLETE, this.onResourceComplete, this );
			
			
		}
		
		private initAnimation():void
		{
			this._raf = new away.utils.RequestAnimationFrame( this.render, this );
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
			var loader  : away.loaders.AssetLoader   = <away.loaders.AssetLoader> e.target;
			
			switch( e.url )
			{
				case "sea_normals.jpg":
						this._seaNormalTexture = <away.textures.HTMLImageElementTexture> loader.baseDependency.assets[ 0 ];
						this.initSea();
					break;
			}
			
            this.resize();
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
				this._raf.start(); // will be moved to complete handler (why does this not work if nothing in the display list?)
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
