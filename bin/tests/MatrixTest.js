///<reference path="../../../../lib/Away3D.next.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var parsers;
(function (parsers) {
    /**
    * ImageParser provides a "parser" for natively supported image types (jpg, png). While it simply loads bytes into
    * a loader object, it wraps it in a BitmapDataResource so resource management can happen consistently without
    * exception cases.
    */
    var JSONTextureParser = (function (_super) {
        __extends(JSONTextureParser, _super);
        //private var _loader           : Loader;
        /**
        * Creates a new ImageParser object.
        * @param uri The url or id of the data or file to be parsed.
        * @param extra The holder for extra contextual data that the parser might need.
        */
        function JSONTextureParser() {
            _super.call(this, away.loaders.ParserDataFormat.PLAIN_TEXT, away.loaders.ParserLoaderType.URL_LOADER);
            //private var _byteData         : ByteArray;
            this.STATE_PARSE_DATA = 0;
            this.STATE_LOAD_IMAGES = 1;
            this.STATE_COMPLETE = 2;
            this._state = -1;
            this._dependencyCount = 0;

            this._loadedTextures = new Array();
            this._state = this.STATE_PARSE_DATA;
        }
        JSONTextureParser.supportsType = /**
        * Indicates whether or not a given file extension is supported by the parser.
        * @param extension The file extension of a potential file to be parsed.
        * @return Whether or not the given file type is supported.
        */
        function (extension) {
            extension = extension.toLowerCase();
            return extension == "json";
        };

        JSONTextureParser.supportsData = /**
        * Tests whether a data block can be parsed by the parser.
        * @param data The data block to potentially be parsed.
        * @return Whether or not the given data is supported.
        */
        function (data) {
            try  {
                var obj = JSON.parse(data);

                if (obj) {
                    return true;
                }

                return false;
            } catch (e) {
                return false;
            }

            return false;
        };

        /**
        * @inheritDoc
        */
        JSONTextureParser.prototype._iResolveDependency = function (resourceDependency) {
            var resource = resourceDependency.assets[0];

            this._pFinalizeAsset(resource, resourceDependency._iLoader.url);

            this._loadedTextures.push(resource);

            //console.log( 'JSONTextureParser._iResolveDependency' , resourceDependency );
            //console.log( 'JSONTextureParser._iResolveDependency resource: ' , resource );
            this._dependencyCount--;

            if (this._dependencyCount == 0) {
                this._state = this.STATE_COMPLETE;
            }
        };

        /**
        * @inheritDoc
        */
        JSONTextureParser.prototype._iResolveDependencyFailure = function (resourceDependency) {
            //console.log( '-----------------------------------------------------------');
            //console.log( 'JSONTextureParser._iResolveDependencyFailure', 'x' , resourceDependency );
            this._dependencyCount--;

            if (this._dependencyCount == 0) {
                this._state = this.STATE_COMPLETE;
                //console.log( 'JSONTextureParser._iResolveDependencyFailure.complete' );
            }
            /*
            
            
            if (_dependencyCount == 0)
            _parseState = DAEParserState.PARSE_MATERIALS;
            */
        };

        JSONTextureParser.prototype.parseJson = function () {
            if (JSONTextureParser.supportsData(this.data)) {
                try  {
                    var json = JSON.parse(this.data);
                    var data = json.data;

                    var rec;
                    var rq;

                    for (var c = 0; c < data.length; c++) {
                        rec = data[c];

                        var uri = rec.image;
                        var id = rec.id;

                        rq = new away.net.URLRequest(uri);

                        //console.log( 'JSONTextureParser.parseJson' , id , uri  );
                        //console.log( 'JSONTextureParser.parseJson' , id , uri  );
                        this._pAddDependency('JSON_ID_' + id, rq, false, null, true);
                    }

                    this._dependencyCount = data.length;
                    this._state = this.STATE_LOAD_IMAGES;

                    this._pPauseAndRetrieveDependencies();
                } catch (e) {
                    this._state = this.STATE_COMPLETE;
                }
            }
        };

        /**
        * @inheritDoc
        */
        JSONTextureParser.prototype._pProceedParsing = function () {
            console.log('JSONTextureParser._pProceedParsing', this._state);

            switch (this._state) {
                case this.STATE_PARSE_DATA:
                    this.parseJson();
                    return away.loaders.ParserBase.MORE_TO_PARSE;

                    break;

                case this.STATE_LOAD_IMAGES:
                    break;

                case this.STATE_COMPLETE:
                    //console.log( 'JSONTextureParser._pProceedParsing: WE ARE DONE' ); // YAY;
                    return away.loaders.ParserBase.PARSING_DONE;

                    break;
            }
            //return away.loaders.ParserBase.MORE_TO_PARSE;
            /*
            var asset : away.textures.Texture2DBase;
            
            if ( this.data instanceof HTMLImageElement )
            {
            
            asset = <away.textures.Texture2DBase> new away.textures.HTMLImageElementTexture( <HTMLImageElement> this.data );
            
            if ( away.utils.TextureUtils.isHTMLImageElementValid( <HTMLImageElement> this.data ) )
            {
            
            
            this._pFinalizeAsset( <away.library.IAsset> asset , this._iFileName );
            
            
            }
            else
            {
            
            this.dispatchEvent( new away.events.AssetEvent( away.events.AssetEvent.TEXTURE_SIZE_ERROR , <away.library.IAsset> asset ) );
            
            }
            
            return away.loaders.ParserBase.PARSING_DONE;
            
            }
            
            return away.loaders.ParserBase.PARSING_DONE;
            */
        };
        return JSONTextureParser;
    })(away.loaders.ParserBase);
    parsers.JSONTextureParser = JSONTextureParser;
})(parsers || (parsers = {}));
var tests;
(function (tests) {
    ///<reference path="../loaders/parsers/JSONTextureParser.ts" />
    ///<reference path="../../../build/Away3D.next.d.ts" />
    //<reference path="../../../src/Away3D.ts" />
    (function (geom) {
        var MatrixTest = (function () {
            function MatrixTest() {
                this.ma = new away.geom.Matrix(10, 11, 12, 13, 14, 15);
                this.mb = new away.geom.Matrix(0, 1, 2, 3, 4, 5);
                this.ma.concat(this.mb);
                console.log(this.ma);
            }
            return MatrixTest;
        })();
        geom.MatrixTest = MatrixTest;
    })(tests.geom || (tests.geom = {}));
    var geom = tests.geom;
})(tests || (tests = {}));
//# sourceMappingURL=MatrixTest.js.map
