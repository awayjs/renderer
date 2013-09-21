///<reference path="../../../src/away/_definitions.ts" />
///<reference path="../loaders/parsers/JSONTextureParser.ts" />

//------------------------------------------------------------------------------------------------
// Web / PHP Storm arguments string
//------------------------------------------------------------------------------------------------
// --sourcemap $ProjectFileDir$/tests/away/library/AssetLibraryTest.ts --target ES5 --comments --out $ProjectFileDir$/tests/away/library/AssetLibraryTest.js
//------------------------------------------------------------------------------------------------

module tests {

    export class AssetLibraryTest //extends away.events.EventDispatcher
    {

        private height : number = 0;

        private token   : away.loaders.AssetLoaderToken;
        private view    : away.containers.View3D;
        private raf     : away.utils.RequestAnimationFrame;
        private mesh    : away.entities.Mesh;

        constructor()
        {


            away.Debug.LOG_PI_ERRORS    = false;
            away.Debug.THROW_ERRORS     = false;


            this.view                  = new away.containers.View3D( );
            this.raf                    = new away.utils.RequestAnimationFrame( this.render , this );



            //away.library.AssetLibrary.enableParser( loaders.JSONTextureParser) ;
            away.library.AssetLibrary.enableParser( away.loaders.OBJParser ) ;

            this.token = away.library.AssetLibrary.load(new away.net.URLRequest('../../assets/t800.obj') );
            this.token.addEventListener( away.events.LoaderEvent.RESOURCE_COMPLETE , this.onResourceComplete , this );
            this.token.addEventListener(away.events.AssetEvent.ASSET_COMPLETE , this.onAssetComplete, this );

        }

        private render()
        {

            console.log( 'render');
            //*
            if( this.mesh )
            {
                this.mesh.rotationY += 1;
            }

            this.view.render();
            //*/
        }

        public onAssetComplete ( e : away.events.AssetEvent )
        {

            console.log( '------------------------------------------------------------------------------');
            console.log( 'away.events.AssetEvent.ASSET_COMPLETE' , e.asset.name , away.library.AssetLibrary.getAsset(e.asset.name) );
            console.log( '------------------------------------------------------------------------------');



            /*
            this.mesh = <away.entities.Mesh> away.library.AssetLibrary.getAsset(e.asset.name);

            this.view.scene.addChild( this.mesh );

            //this.render();

            document.onmousedown = () => this.render();
              */
            //this.raf.start();

            /*
            var htmlImageElementTexture : away.textures.HTMLImageElementTexture = <away.textures.HTMLImageElementTexture> away.library.AssetLibrary.getAsset(e.asset.name);

            document.body.appendChild( htmlImageElementTexture.htmlImageElement );

            htmlImageElementTexture.htmlImageElement.style.position = 'absolute';
            htmlImageElementTexture.htmlImageElement.style.top = this.height + 'px';


            this.height += ( htmlImageElementTexture.htmlImageElement.height + 10 ) ;
            */

        }
        public onResourceComplete ( e : away.events.LoaderEvent )
        {

            var loader : away.loaders.AssetLoader = <away.loaders.AssetLoader> e.target;

            console.log( '------------------------------------------------------------------------------');
            console.log( 'away.events.LoaderEvent.RESOURCE_COMPLETE' , e  );
            console.log( '------------------------------------------------------------------------------');

            console.log( away.library.AssetLibrary.getAsset( 'Mesh_g0' ) ) ;

            this.mesh = <away.entities.Mesh> away.library.AssetLibrary.getAsset( 'Mesh_g0' );
            this.mesh.rotationX = 180;
            this.mesh.y = 400;
            this.mesh.scale( 4 );

            this.view.scene.addChild( this.mesh );

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

var GL = null;//: WebGLRenderingContext;
var test

window.onload = function ()
{

    test = new tests.AssetLibraryTest();

    var canvas : HTMLCanvasElement = document.createElement('canvas');
    GL = canvas.getContext("experimental-webgl");

}

