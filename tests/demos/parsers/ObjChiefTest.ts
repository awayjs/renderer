///<reference path="../../../src/away/_definitions.ts" />

//------------------------------------------------------------------------------------------------
// Web / PHP Storm arguments string
//------------------------------------------------------------------------------------------------
// --sourcemap $ProjectFileDir$/tests/away/library/AssetLibraryTest.ts --target ES5 --comments --out $ProjectFileDir$/tests/away/library/AssetLibraryTest.js
//------------------------------------------------------------------------------------------------

module demos.parsers
{

    export class ObjChiefTest//extends away.events.EventDispatcher
    {

        private height : number = 0;

        private token   : away.loaders.AssetLoaderToken;
        private view    : away.containers.View3D;
        private raf     : away.utils.RequestAnimationFrame;
        private mesh    : away.entities.Mesh;
        private meshes  : Array<away.entities.Mesh> = new Array<away.entities.Mesh>();
        private mat     : away.materials.TextureMaterial;

        private terrainMaterial : away.materials.TextureMaterial;

        private multiMat: away.materials.TextureMultiPassMaterial;
        private light   : away.lights.DirectionalLight;
        private t800M   : away.entities.Mesh;

        private spartan : away.containers.ObjectContainer3D = new away.containers.ObjectContainer3D();
        private terrain : away.entities.Mesh;

        constructor()
        {

            away.Debug.LOG_PI_ERRORS    = false;
            away.Debug.THROW_ERRORS     = false;

            this.view                  = new away.containers.View3D( );
            this.view.camera.z          = -50;
            this.view.camera.y          = 20;
            this.view.camera.lens.near  = 0.1;
            this.view.backgroundColor   = 0x0E0E10;

            //this.view.backgroundColor   = 0xFF0000;
            this.raf                    = new away.utils.RequestAnimationFrame( this.render , this );

            this.light                  = new away.lights.DirectionalLight();
            this.light.color            = 0x683019;
            this.light.direction        = new away.geom.Vector3D( 1 , 0 ,0 );
            this.light.ambient          = 0.3;//0.05;//.4;
            this.light.ambientColor     = 0x4F6877;//313D51;
            this.light.diffuse          = 1;
            this.light.specular         = 1;
            //this.light.x                = 800;
            //this.light.y                = 800;

            this.spartan.scale(.25 );
            this.spartan.y = 0;

            this.view.scene.addChild( this.light );

            away.library.AssetLibrary.enableParser( away.loaders.OBJParser ) ;

            this.token = away.library.AssetLibrary.load(new away.net.URLRequest('Halo_3_SPARTAN4.obj') );
            this.token.addEventListener( away.events.LoaderEvent.RESOURCE_COMPLETE , this.onResourceComplete , this );
            this.token.addEventListener(away.events.AssetEvent.ASSET_COMPLETE , this.onAssetComplete, this );

            this.token = away.library.AssetLibrary.load(new away.net.URLRequest('terrain.obj') );
            this.token.addEventListener( away.events.LoaderEvent.RESOURCE_COMPLETE , this.onResourceComplete , this );
            this.token.addEventListener(away.events.AssetEvent.ASSET_COMPLETE , this.onAssetComplete, this );


            //*
            this.token = away.library.AssetLibrary.load(new away.net.URLRequest('masterchief_base.png') );
            this.token.addEventListener( away.events.LoaderEvent.RESOURCE_COMPLETE , this.onResourceComplete , this );
            this.token.addEventListener(away.events.AssetEvent.ASSET_COMPLETE , this.onAssetComplete, this );

            this.token = away.library.AssetLibrary.load(new away.net.URLRequest('RockyDesert.jpg' ) );
            this.token.addEventListener( away.events.LoaderEvent.RESOURCE_COMPLETE , this.onResourceComplete , this );
            this.token.addEventListener(away.events.AssetEvent.ASSET_COMPLETE , this.onAssetComplete, this );
            // */
            window.onresize = () => this.resize();

        }


        private t : number = 0;

        private render()
        {
            if ( this.terrain)
                this.terrain.rotationY += 0.4;

            this.spartan.rotationY += 0.4;
            this.view.render();
        }

        public onAssetComplete ( e : away.events.AssetEvent )
        {

        }

        private spartanFlag     : boolean = false;
        private terrainObjFlag  : boolean = false;

        public onResourceComplete ( e : away.events.LoaderEvent )
        {

            var loader  : away.loaders.AssetLoader   = <away.loaders.AssetLoader> e.target;
            var l       : number                     = loader.baseDependency.assets.length//dependencies.length;


            console.log( '------------------------------------------------------------------------------');
            console.log( 'away.events.LoaderEvent.RESOURCE_COMPLETE' , e , l , loader );
            console.log( '------------------------------------------------------------------------------');


            //*
            var loader  : away.loaders.AssetLoader   = <away.loaders.AssetLoader> e.target;
            var l       : number                     = loader.baseDependency.assets.length//dependencies.length;

            for ( var c : number = 0 ; c < l ; c ++ )
            {

                var d : away.library.IAsset = loader.baseDependency.assets[c];

                console.log( d.name , e.url );

                switch (d.assetType)
                {

                    case away.library.AssetType.MESH:


                        if (e.url =='Halo_3_SPARTAN4.obj')
                        {

                            var mesh : away.entities.Mesh = <away.entities.Mesh> away.library.AssetLibrary.getAsset( d.name );

                            this.spartan.addChild( mesh );
                            this.raf.start();
                            this.spartanFlag = true;


                            this.meshes.push( mesh );



                        }

                        if (e.url =='terrain.obj')
                        {

                            this.terrainObjFlag = true;
                            this.terrain = <away.entities.Mesh> away.library.AssetLibrary.getAsset( d.name );
                            this.terrain.y = 98;
                            this.view.scene.addChild( this.terrain );

                        }


                        break;


                    case away.library.AssetType.TEXTURE :

                        if (e.url == 'masterchief_base.png' )
                        {

                            var lightPicker:away.materials.StaticLightPicker    = new away.materials.StaticLightPicker( [this.light] );
                            var tx  : away.textures.HTMLImageElementTexture     = <away.textures.HTMLImageElementTexture> away.library.AssetLibrary.getAsset( d.name );

                            this.mat                                            = new away.materials.TextureMaterial( tx, true, true, false );
                            this.mat.lightPicker                                = lightPicker;


                        }

                        if (e.url == 'RockyDesert.jpg')
                        {

                            var lp:away.materials.StaticLightPicker    = new away.materials.StaticLightPicker( [this.light] );
                            var txT  : away.textures.HTMLImageElementTexture    = <away.textures.HTMLImageElementTexture> away.library.AssetLibrary.getAsset( d.name );

                            this.terrainMaterial                                = new away.materials.TextureMaterial( txT, true, true, false );
                            this.terrainMaterial.lightPicker                    = lp;

                        }

                        break;

                }

            }

            if ( this.terrainObjFlag && this.terrainMaterial )
            {
                this.terrain.material = this.terrainMaterial;
                this.terrain.geometry.scaleUV( 20 , 20 );


            }

            if ( this.mat && this.spartanFlag )
            {
                for ( var c : number = 0 ; c < this.meshes.length ; c++ )
                {
                    this.meshes[c].material = this.mat;
                }
            }

            this.view.scene.addChild( this.spartan );
            this.resize();

        }

        public resize()
        {
            this.view.y         = 0;
            this.view.x         = 0;

            this.view.width     = window.innerWidth;
            this.view.height    = window.innerHeight;
        }

    }

}
