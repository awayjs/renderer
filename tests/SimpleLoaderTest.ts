//<reference path="../src/away/events/Event.ts" />
//<reference path="../src/away/events/EventDispatcher.ts" />
//<reference path="../src/away/events/IOErrorEvent.ts" />
//<reference path="../src/away/events/HTTPStatusEvent.ts" />
//<reference path="../src/away/net/URLLoader.ts" />
//<reference path="../src/away/net/URLRequest.ts" />
//<reference path="../src/away/net/URLVariables.ts" />
//<reference path="../src/away/net/URLRequestMethod.ts" />
///<reference path="../src/away/library/assets/IAsset.ts"/>
///<reference path="../src/away/loaders/misc/SingleFileLoader.ts"/>
///<reference path="../src/away/loaders/misc/AssetLoaderContext.ts"/>
///<reference path="../src/away/loaders/parsers/ParserBase.ts"/>
///<reference path="../src/away/loaders/parsers/ParserDataFormat.ts"/>
///<reference path="../src/away/loaders/misc/SingleFileImageLoader.ts"/>
///<reference path="../src/away/loaders/misc/SingleFileURLLoader.ts"/>
///<reference path="../src/away/textures/TextureProxyBase.ts"/>
///<reference path="../src/away/display3D/Context3D.ts"/>
///<reference path="../src/away/display/Stage3D.ts"/>

//------------------------------------------------------------------------------------------------
// Web / PHP Storm arguments string
//------------------------------------------------------------------------------------------------
// --sourcemap $ProjectFileDir$/tests/SimpleLoaderTest.ts --target ES5 --comments --out $ProjectFileDir$/tests/SimpleLoaderTest.js
//------------------------------------------------------------------------------------------------


module tests {

    export class SimpleLoaderTest //extends away.events.EventDispatcher
    {

        private assetLoaderContext      : away.loaders.AssetLoaderContext = new away.loaders.AssetLoaderContext();
        private iAssetTest              : tests.IAssetTest = new tests.IAssetTest(); // TEST for interface;

        private parserBase              : away.loaders.ParserBase;              // Test ( for import only );
        private simpleLoader            : away.loaders.SingleFileLoader;        // Test ( for import only );

        private simpleImageLoader       : away.loaders.SingleFileImageLoader;
        private simpleURLLoader         : away.loaders.SingleFileURLLoader;

        private canvas                  : HTMLCanvasElement;

        private stage3D                 : away.display.Stage3D;
        private context3D               : away.display3D.Context3D;

        constructor()
        {

            this.canvas                         = document.createElement( 'canvas');
            this.stage3D                        = new away.display.Stage3D( this.canvas );
            this.stage3D.addEventListener( away.events.Event.CONTEXT3D_CREATE, this.onContext3DCreateHandler, this );
            this.stage3D.requestContext();

            //------------------------------------------------------------------------------------------
            // Simple Loader - instantiated to validate against compiler - needs test implementation ( and a parser )
            //------------------------------------------------------------------------------------------

            var urlRequest : away.net.URLRequest = new away.net.URLRequest( 'URLLoaderTestData/2.png' );

            this.simpleLoader = new away.loaders.SingleFileLoader( 1 );
            this.simpleLoader.load( urlRequest );

            // URL Loader Interface;
            this.simpleURLLoader = new away.loaders.SingleFileURLLoader();
            this.simpleURLLoader.load( urlRequest );
            this.simpleURLLoader.addEventListener( away.events.Event.COMPLETE , this.simpleURLLoaderLoadComplete , this );
            this.simpleURLLoader.addEventListener( away.events.IOErrorEvent.IO_ERROR, this.simpleURLLoaderLoadError , this );

            // Image Loader Interface;
            this.simpleImageLoader = new away.loaders.SingleFileImageLoader();
            this.simpleImageLoader.load( urlRequest );
            this.simpleImageLoader.addEventListener( away.events.Event.COMPLETE , this.simpleImageLoaderLoadComplete , this );
            this.simpleImageLoader.addEventListener( away.events.IOErrorEvent.IO_ERROR , this.simpleImageLoaderLoadError , this );

            //------------------------------------------------------------------------------------------
            // Parser Base - instantiated to validate against compiler
            //------------------------------------------------------------------------------------------

            this.parserBase = new away.loaders.ParserBase( away.loaders.ParserDataFormat.PLAIN_TEXT );

            //------------------------------------------------------------------------------------------
            // IAsset - Interface Test
            //------------------------------------------------------------------------------------------

            this.iAssetTest.name        = 'Karim Beyrouti';
            this.iAssetTest.id          = '555555+';
            this.iAssetTest.dispose();

            var iTest : away.library.IAsset = this.iAssetTest;

            //console.log( 'SimpleLoaderTest.iTest.name:' , iTest.name , ' id:' , iTest.id );

        }

        private onContext3DCreateHandler( e )
        {

            var stage3D: away.display.Stage3D = <away.display.Stage3D> e.target;
            this.context3D = stage3D.context3D;


        }

        private simpleImageLoaderLoadComplete( e )
        {

            //console.log( 'SimpleLoaderTest.simpleImageLoaderLoadComplete');


        }

        private simpleURLLoaderLoadComplete( e )
        {

            //console.log( 'SimpleLoaderTest.simpleURLLoaderLoadComplete');

        }

        private simpleImageLoaderLoadError( e )
        {

            //console.log( 'SimpleLoaderTest.simpleImageLoaderLoadError');


        }

        private simpleURLLoaderLoadError( e )
        {

            //console.log( 'SimpleLoaderTest.simpleURLLoaderLoadError');

        }

    }

    //*
    // Test implmentatoin for IAsset
    export class IAssetTest extends away.events.EventDispatcher implements away.library.IAsset{

        private _name           : string;
        private _id             : string;
        private _assetNamespace : string;
        private _assetType      : string;
        private _assetFullPath  : Array;

        public get id() : string { return this._id;}
        public set id( value : string ) { this._id = value;}
        public get name() : string { return this._name; }
        public set name( value : string ) { this._name = value;}
        public get assetNamespace( ) : string { return this._assetNamespace;}
        public get assetType( ) : string { return this._assetType;}
        public get assetFullPath( ) : Array { return this._assetFullPath;}
        public assetPathEquals(name : string, ns : string) : boolean{ return true; }
        public resetAssetPath(name : string, ns : string , overrideOriginal : boolean ) : void{}
        public dispose() : void{}

    }

}

window.onload = function ()
{

    var test = new tests.SimpleLoaderTest();

}
