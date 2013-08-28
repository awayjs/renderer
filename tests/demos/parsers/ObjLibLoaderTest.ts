///<reference path="../../../src/away/_definitions.ts" />

//------------------------------------------------------------------------------------------------
// Web / PHP Storm arguments string
//------------------------------------------------------------------------------------------------
// --sourcemap $ProjectFileDir$/tests/away/library/AssetLibraryTest.ts --target ES5 --comments --out $ProjectFileDir$/tests/away/library/AssetLibraryTest.js
//------------------------------------------------------------------------------------------------

module demos.parsers
{

    export class ObjLibLoaderTest//extends away.events.EventDispatcher
    {

        private height : number = 0;

        private token   : away.loaders.AssetLoaderToken;
        private view    : away.containers.View3D;
        private raf     : away.utils.RequestAnimationFrame;
        private mesh    : away.entities.Mesh;
        private meshes  : Array<away.entities.Mesh> = new Array<away.entities.Mesh>();

        constructor()
        {

            away.Debug.LOG_PI_ERRORS    = false;
            away.Debug.THROW_ERRORS     = false;

            this.view                  = new away.containers.View3D( );
            this.raf                    = new away.utils.RequestAnimationFrame( this.render , this );

            away.library.AssetLibrary.enableParser( away.loaders.OBJParser ) ;

            /*
            this.token = away.library.AssetLibrary.load(new away.net.URLRequest('atomArray.obj') );
            this.token.addEventListener( away.events.LoaderEvent.RESOURCE_COMPLETE , this.onResourceComplete , this );
            this.token.addEventListener(away.events.AssetEvent.ASSET_COMPLETE , this.onAssetComplete, this );
             */
            this.token = away.library.AssetLibrary.load(new away.net.URLRequest('t800.obj') );
            this.token.addEventListener( away.events.LoaderEvent.RESOURCE_COMPLETE , this.onResourceComplete , this );
            this.token.addEventListener(away.events.AssetEvent.ASSET_COMPLETE , this.onAssetComplete, this );

        }

        private render()
        {

            if( this.meshes )
            {
                for ( var c : number = 0 ; c < this.meshes.length ; c++ )
                {
                    this.meshes[c].rotationY += .14;
                }
            }

            this.view.render();

        }

        public onAssetComplete ( e : away.events.AssetEvent )
        {
            console.log( '------------------------------------------------------------------------------');
            console.log( 'away.events.AssetEvent.ASSET_COMPLETE' , e.asset.name , away.library.AssetLibrary.getAsset(e.asset.name) );
            console.log( '------------------------------------------------------------------------------');
        }
        public onResourceComplete ( e : away.events.LoaderEvent )
        {

            var loader  : away.loaders.AssetLoader   = <away.loaders.AssetLoader> e.target;
            var l       : number                     = loader.baseDependency.assets.length//dependencies.length;

            console.log( '------------------------------------------------------------------------------');
            console.log( 'away.events.LoaderEvent.RESOURCE_COMPLETE' , e  );
            console.log( '------------------------------------------------------------------------------');

            for ( var c : number = 0 ; c < l ; c ++ )
            {

                var d : away.library.IAsset = loader.baseDependency.assets[c];

                if ( d.assetType == away.library.AssetType.MESH )
                {

                    var mesh : away.entities.Mesh = <away.entities.Mesh> away.library.AssetLibrary.getAsset( d.name );
                        mesh.y = -400;
                        mesh.scale( 5 );

                    this.view.scene.addChild( mesh );

                    this.meshes.push( mesh );
                }

            }

            document.onmousedown = () => this.render();
            window.onresize = () => this.resize();

            this.raf.start();

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
