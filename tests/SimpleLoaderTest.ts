///<reference path="../src/away/events/Event.ts" />
///<reference path="../src/away/events/IOErrorEvent.ts" />
///<reference path="../src/away/events/HTTPStatusEvent.ts" />
///<reference path="../src/away/net/URLLoader.ts" />
///<reference path="../src/away/net/URLRequest.ts" />
///<reference path="../src/away/net/URLVariables.ts" />
///<reference path="../src/away/net/URLRequestMethod.ts" />
///<reference path="../src/away/library/assets/IAsset.ts"/>
///<reference path="../src/away/loaders/parsers/ParserBase.ts"/>

module tests {


    export class SimpleLoaderTest //extends away.events.EventDispatcher
    {

        private iAssetTest : tests.IAssetTest = new tests.IAssetTest();
        private parserBase : away.loaders.ParserBase;
        constructor()
        {

            this.parserBase = new away.loaders.ParserBase();
            //------------------------------------------------------------------------------------------
            // IAsset - Interface Test;
            //------------------------------------------------------------------------------------------

            this.iAssetTest.name    = 'Karim Beyrouti';
            this.iAssetTest.id      = '555555+';
            this.iAssetTest.dispose();

            var iTest : away.library.IAsset = this.iAssetTest;

                console.log( iTest.name );
                console.log( iTest.id );


        }


    }

    // Test implmentatoin for IAsset
    export class IAssetTest implements away.library.IAsset{

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

