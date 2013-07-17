///<reference path="../../../src/away/library/AssetLibraryBundle.ts"/>
///<reference path="../src/away/library/AssetLibrary.ts"/>
///<reference path="ts/JSONTextureParser.ts"/>



//------------------------------------------------------------------------------------------------
// Web / PHP Storm arguments string
//------------------------------------------------------------------------------------------------
// --sourcemap $ProjectFileDir$/tests/AssetLibraryTest.ts --target ES5 --comments --out $ProjectFileDir$/tests/AssetLibraryTest.js
//------------------------------------------------------------------------------------------------


module tests {

    export class AssetLibraryTest //extends away.events.EventDispatcher
    {

        private height : number = 0;

        private token : away.loaders.AssetLoaderToken;
        private alb     : away.library.AssetLibraryBundle
        constructor()
        {

            away.library.AssetLibrary.enableParser( loaders.JSONTextureParser) ;

            //------------------------------------------------------------------------------------------------------------------
            // AssetLibraryBundle - Debug / Test

            //this.alb = away.library.AssetLibraryBundle.getInstance();
            //this.token = this.alb.load( new away.net.URLRequest('URLLoaderTestData/JSNParserTest.json') );
            //this.token.addEventListener( away.events.LoaderEvent.RESOURCE_COMPLETE , this.onResourceComplete , this );

            //------------------------------------------------------------------------------------------------------------------
            // AssetLibrary - Debug / Test

           // away.library.AssetLibrary.addEventListener(away.events.AssetEvent.ASSET_COMPLETE , this.onAssetComplete, this );

            this.token = away.library.AssetLibrary.load(new away.net.URLRequest('URLLoaderTestData/JSNParserTest.json') );
            this.token.addEventListener( away.events.LoaderEvent.RESOURCE_COMPLETE , this.onResourceComplete , this );
            this.token.addEventListener(away.events.AssetEvent.ASSET_COMPLETE , this.onAssetComplete, this );

            this.token = away.library.AssetLibrary.load(new away.net.URLRequest('URLLoaderTestData/1024x1024.png') );
            this.token.addEventListener( away.events.LoaderEvent.RESOURCE_COMPLETE , this.onResourceComplete , this );
            this.token.addEventListener(away.events.AssetEvent.ASSET_COMPLETE , this.onAssetComplete, this );

        }

        public onAssetComplete ( e : away.events.AssetEvent )
        {

            console.log( '------------------------------------------------------------------------------');
            console.log( 'away.events.AssetEvent.ASSET_COMPLETE' , away.library.AssetLibrary.getAsset(e.asset.name) );
            console.log( '------------------------------------------------------------------------------');

            var htmlImageElementTexture : away.textures.HTMLImageElementTexture = <away.textures.HTMLImageElementTexture> away.library.AssetLibrary.getAsset(e.asset.name);

            document.body.appendChild( htmlImageElementTexture.htmlImageElement );

            htmlImageElementTexture.htmlImageElement.style.position = 'absolute';
            htmlImageElementTexture.htmlImageElement.style.top = this.height + 'px';


            this.height += ( htmlImageElementTexture.htmlImageElement.height + 10 ) ;

        }
        public onResourceComplete ( e : away.events.LoaderEvent )
        {

            var loader : away.loaders.AssetLoader = <away.loaders.AssetLoader> e.target;

            console.log( '------------------------------------------------------------------------------');
            console.log( 'away.events.LoaderEvent.RESOURCE_COMPLETE' , e  );
            console.log( '------------------------------------------------------------------------------');

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
