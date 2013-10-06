///<reference path="../../../../build/Away3D.next.d.ts" />

module parsers
{

	/**
	 * ImageParser provides a "parser" for natively supported image types (jpg, png). While it simply loads bytes into
	 * a loader object, it wraps it in a BitmapDataResource so resource management can happen consistently without
	 * exception cases.
	 */
	export class JSONTextureParser extends away.loaders.ParserBase
	{
		//private var _byteData         : ByteArray;

        private STATE_PARSE_DATA        : number = 0;
        private STATE_LOAD_IMAGES       : number = 1;
        private STATE_COMPLETE          : number = 2;

        private _state                  : number = -1;
		private _startedParsing         : boolean;
		private _doneParsing            : boolean;
        private _dependencyCount        : number = 0;
        private _loadedTextures         : away.textures.Texture2DBase[];
		//private var _loader           : Loader;

		/**
		 * Creates a new ImageParser object.
		 * @param uri The url or id of the data or file to be parsed.
		 * @param extra The holder for extra contextual data that the parser might need.
		 */
		constructor()
		{

			super( away.loaders.ParserDataFormat.PLAIN_TEXT , away.loaders.ParserLoaderType.URL_LOADER );

            this._loadedTextures = new Array<away.textures.Texture2DBase>();
            this._state = this.STATE_PARSE_DATA;


		}

		/**
		 * Indicates whether or not a given file extension is supported by the parser.
		 * @param extension The file extension of a potential file to be parsed.
		 * @return Whether or not the given file type is supported.
		 */

		public static supportsType(extension : string) : boolean
		{

			extension = extension.toLowerCase();
			return extension == "json";

		}

		/**
		 * Tests whether a data block can be parsed by the parser.
		 * @param data The data block to potentially be parsed.
		 * @return Whether or not the given data is supported.
		 */
		public static supportsData(data : any) : boolean
		{

            try
            {

                var obj = JSON.parse( data  );

                if ( obj )
                {

                    return true;

                }

                return false;


            } catch ( e ) {

                return false;

            }

            return false;

		}

        /**
         * @inheritDoc
         */
        public _iResolveDependency(resourceDependency:away.loaders.ResourceDependency):void
        {

            var resource : away.textures.Texture2DBase = <away.textures.Texture2DBase> resourceDependency.assets[0] ;//as Texture2DBase;

            this._pFinalizeAsset( <away.library.IAsset> resource , resourceDependency._iLoader.url );

            this._loadedTextures.push( resource );

            //console.log( 'JSONTextureParser._iResolveDependency' , resourceDependency );
            //console.log( 'JSONTextureParser._iResolveDependency resource: ' , resource );

            this._dependencyCount--;

            if ( this._dependencyCount == 0)
            {

                this._state = this.STATE_COMPLETE;

            }

        }

        /**
         * @inheritDoc
         */
        public _iResolveDependencyFailure(resourceDependency:away.loaders.ResourceDependency):void
        {
            //console.log( '-----------------------------------------------------------');
            //console.log( 'JSONTextureParser._iResolveDependencyFailure', 'x' , resourceDependency );

            this._dependencyCount--;

            if ( this._dependencyCount == 0)
            {

                this._state = this.STATE_COMPLETE;
                //console.log( 'JSONTextureParser._iResolveDependencyFailure.complete' );

            }
            /*


            if (_dependencyCount == 0)
                _parseState = DAEParserState.PARSE_MATERIALS;
            */
        }

        private parseJson( ) : void
        {

            //console.log( 'JSONTextureParser.parseJson' , typeof this.data );

            if ( JSONTextureParser.supportsData( this.data ) )
            {

                try
                {

                    var json : any = JSON.parse( this.data );
                    var data : Array = <Array> json.data;

                    var rec : any;
                    var rq  : away.net.URLRequest;

                    for ( var c : number = 0 ; c < data.length ; c ++ )
                    {


                        rec                 = data[c];

                        var uri : string    = rec.image;
                        var id  : number    = rec.id;

                        rq                  = new away.net.URLRequest( uri );

                        //console.log( 'JSONTextureParser.parseJson' , id , uri  );
                        //console.log( 'JSONTextureParser.parseJson' , id , uri  );

                        this._pAddDependency( 'JSON_ID_' + id , rq , false , null , true );

                    }

                    this._dependencyCount = data.length;
                    this._state = this.STATE_LOAD_IMAGES;

                    this._pPauseAndRetrieveDependencies();//pauseAndRetrieveDependencies

                } catch ( e ) {

                    this._state = this.STATE_COMPLETE;

                }


            }

        }
		/**
		 * @inheritDoc
		 */
		public _pProceedParsing() : boolean
		{

            console.log( 'JSONTextureParser._pProceedParsing' , this._state );

            switch ( this._state )
            {

                case this.STATE_PARSE_DATA:

                    this.parseJson();
                    return away.loaders.ParserBase.MORE_TO_PARSE;

                    break;

                case this.STATE_LOAD_IMAGES:

                    // Async load image process
                    //return away.loaders.ParserBase.MORE_TO_PARSE;

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
		}

	}
}