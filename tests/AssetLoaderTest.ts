///<reference path="../src/away/loaders/AssetLoader.ts"/>

//<reference path="../src/away/library/assets/IAsset.ts"/>
//<reference path="../src/away/loaders/misc/SingleFileLoader.ts"/>
//<reference path="../src/away/loaders/misc/AssetLoaderContext.ts"/>
//<reference path="../src/away/loaders/parsers/ParserBase.ts"/>
//<reference path="../src/away/loaders/parsers/ParserDataFormat.ts"/>
//<reference path="../src/away/loaders/misc/SingleFileImageLoader.ts"/>
//<reference path="../src/away/loaders/misc/SingleFileURLLoader.ts"/>
//<reference path="../src/away/textures/TextureProxyBase.ts"/>
//<reference path="../src/away/display3D/Context3D.ts"/>
//<reference path="../src/away/display/Stage3D.ts"/>

//------------------------------------------------------------------------------------------------
// Web / PHP Storm arguments string
//------------------------------------------------------------------------------------------------
// --sourcemap $ProjectFileDir$/tests/AssetLoaderTest.ts --target ES5 --comments --out $ProjectFileDir$/tests/AssetLoaderTest.js
//------------------------------------------------------------------------------------------------


module tests {

    export class AssetLoaderTest //extends away.events.EventDispatcher
    {

        private urlRq       : away.net.URLRequest;
        private token       : away.loaders.AssetLoaderToken;
        private assetLoader : away.loaders.AssetLoader;


        constructor()
        {

            this.urlRq          = new away.net.URLRequest('URLLoaderTestData/2.png');
            this.assetLoader    = new away.loaders.AssetLoader();

            this.token          = this.assetLoader.load( this.urlRq );

            console.log( 'token' , this.token );

            this.token.addEventListener( away.events.Event.COMPLETE , this.onComplete , this );
            this.token.addEventListener( away.events.AssetEvent.ASSET_COMPLETE, this.onAssetComplete , this );

        }

        public onComplete ( e : away.events.Event ) : void
        {

            console.log( 'onComplete' );

        }

        public onAssetComplete ( e : away.events.Event ) : void
        {
            console.log( '--------------------------------------------------------------------------------');
            console.log( 'onAssetComplete' );
            console.log( '--------------------------------------------------------------------------------');

        }
    }


}

var GL = null;//: WebGLRenderingContext;

window.onload = function ()
{

    var test = new tests.AssetLoaderTest();
    var canvas : HTMLCanvasElement = document.createElement('canvas');
    GL = canvas.getContext("experimental-webgl");

}
