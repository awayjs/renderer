///<reference path="../src/away/loaders/AssetLoader.ts"/>
///<reference path="ts/JSONTextureParser.ts"/>

//<reference path="../src/away/library/assets/IAsset.ts"/>

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

        private alJson          : away.loaders.AssetLoader;
        private alImage         : away.loaders.AssetLoader;
        private alErrorImage    : away.loaders.AssetLoader;

        constructor()
        {

            //---------------------------------------------------------------------------------------------------------------------
            // Enable Custom Parser ( JSON file format with multiple texture dependencies )
            away.loaders.AssetLoader.enableParser( loaders.JSONTextureParser );

            var token : away.loaders.AssetLoaderToken;
            var urlRq : away.net.URLRequest;

            //---------------------------------------------------------------------------------------------------------------------
            // LOAD A SINGLE IMAGE

            this.alImage  = new away.loaders.AssetLoader();
            urlRq         = new away.net.URLRequest('URLLoaderTestData/1024x1024.png');
            token         = this.alImage .load( urlRq );

            token.addEventListener( away.events.AssetEvent.ASSET_COMPLETE, this.onAssetComplete , this );
            token.addEventListener( away.events.AssetEvent.TEXTURE_SIZE_ERROR, this.onTextureSizeError , this );

            //---------------------------------------------------------------------------------------------------------------------
            // LOAD A SINGLE IMAGE - With wrong dimensions

            this.alErrorImage    = new away.loaders.AssetLoader();
            urlRq                = new away.net.URLRequest('URLLoaderTestData/2.png');
            token                = this.alErrorImage.load( urlRq );

            token.addEventListener( away.events.AssetEvent.ASSET_COMPLETE, this.onAssetComplete , this );
            token.addEventListener( away.events.AssetEvent.TEXTURE_SIZE_ERROR, this.onTextureSizeError , this );

            //---------------------------------------------------------------------------------------------------------------------
            // LOAD WITH A JSON PARSER

            this.alJson    = new away.loaders.AssetLoader();
            urlRq          = new away.net.URLRequest('URLLoaderTestData/JSNParserTest.json');
            token          = this.alJson.load( urlRq );

            token.addEventListener( away.events.AssetEvent.ASSET_COMPLETE, this.onAssetComplete , this );
            token.addEventListener( away.events.AssetEvent.TEXTURE_SIZE_ERROR, this.onTextureSizeError , this );
            token.addEventListener( away.events.ParserEvent.PARSE_COMPLETE, this.onParseComplete , this );

            token.addEventListener( away.events.LoaderEvent.DEPENDENCY_COMPLETE, this.onDependencyComplete , this );

        }

        public onDependencyComplete ( e : away.events.LoaderEvent ) : void
        {

            console.log( '--------------------------------------------------------------------------------');
            console.log( 'AssetLoaderTest.onDependencyComplete' , e );
            console.log( '--------------------------------------------------------------------------------');

        }

        public onParseComplete ( e : away.events.ParserEvent ) : void
        {

            console.log( '--------------------------------------------------------------------------------');
            console.log( 'AssetLoaderTest.onParseComplete' , e );
            console.log( '--------------------------------------------------------------------------------');
        }

        public onTextureSizeError ( e : away.events.AssetEvent ) : void
        {

            var assetLoader : away.loaders.AssetLoader = <away.loaders.AssetLoader> e.target;

            console.log( '--------------------------------------------------------------------------------');
            console.log( 'AssetLoaderTest.onTextureSizeError' , assetLoader.baseDependency._iLoader.url , e );
            console.log( '--------------------------------------------------------------------------------');

        }

        public onAssetComplete ( e : away.events.AssetEvent ) : void
        {

            var assetLoader : away.loaders.AssetLoader = <away.loaders.AssetLoader> e.target;

            console.log( '--------------------------------------------------------------------------------');
            console.log( 'AssetLoaderTest.onAssetComplete', assetLoader.baseDependency._iLoader.url , e );
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

