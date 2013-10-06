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
        var ColorUtils = (function () {
            function ColorUtils() {
                /*
                constructor(    inRedMultiplier:number = 1.0,  inGreenMultiplier:number = 1.0, inBlueMultiplier:number = 1.0,  inAlphaMultiplier:number = 1.0,
                inRedOffset:number = 0.0,      inGreenOffset:number = 0.0,     inBlueOffset:number = 0.0,      inAlphaOffset:number = 0.0)
                */
                var ct_RED = new away.geom.ColorTransform(1, 0, 0, 1, 255, 0, 0, 255);

                console.log("ct_RED - ARGB: ", away.utils.ColorUtils.float32ColorToARGB(ct_RED.color));

                var ct_GREEN = new away.geom.ColorTransform(0, 1, 0, 1, 0, 255, 0, 255);

                console.log("ct_GREEN - ARGB: ", away.utils.ColorUtils.float32ColorToARGB(ct_GREEN.color));

                var ct_BLUE = new away.geom.ColorTransform(0, 0, 1, 1, 0, 0, 255, 255);

                console.log("ct_BLUE - ARGB: ", away.utils.ColorUtils.float32ColorToARGB(ct_BLUE.color));

                var ct_RED_a = new away.geom.ColorTransform(.5, 0, 0, 1, 255, 0, 0, 255);

                console.log("ct_RED_a - ARGB: ", away.utils.ColorUtils.float32ColorToARGB(ct_RED_a.color));

                var ct_GREEN_a = new away.geom.ColorTransform(0, .5, 0, 1, 0, 255, 0, 255);

                console.log("ct_GREEN_a - ARGB: ", away.utils.ColorUtils.float32ColorToARGB(ct_GREEN_a.color));

                var ct_BLUE_a = new away.geom.ColorTransform(0, 0, .5, 1, 0, 0, 255, 255);

                console.log("ct_BLUE_a - ARGB: ", away.utils.ColorUtils.float32ColorToARGB(ct_BLUE_a.color));

                console.log('--------------------------------------------------------------------------------');

                ct_RED.color = 0xff0000;
                console.log("SET - ct_RED - ARGB: ", away.utils.ColorUtils.float32ColorToARGB(ct_RED.color));

                ct_GREEN.color = 0x00ff00;
                console.log("SET - ct_GREEN - ARGB: ", away.utils.ColorUtils.float32ColorToARGB(ct_GREEN.color));

                ct_BLUE.color = 0x0000ff;
                console.log("SET - ct_BLUE - ARGB: ", away.utils.ColorUtils.float32ColorToARGB(ct_BLUE.color));
            }
            return ColorUtils;
        })();
        geom.ColorUtils = ColorUtils;
    })(tests.geom || (tests.geom = {}));
    var geom = tests.geom;
})(tests || (tests = {}));
//# sourceMappingURL=ColorUtils.js.map
