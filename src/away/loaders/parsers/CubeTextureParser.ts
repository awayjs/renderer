///<reference path="../../../../src/away/_definitions.ts" />

module away.loaders
{

	/**
	 * ImageParser provides a "parser" for natively supported image types (jpg, png). While it simply loads bytes into
	 * a loader object, it wraps it in a BitmapDataResource so resource management can happen consistently without
	 * exception cases.
	 */
	export class CubeTextureParser extends away.loaders.ParserBase
	{

        private static posX : string = 'posX';
        private static negX : string = 'negX';
        private static posY : string = 'posY';
        private static negY : string = 'negY';
        private static posZ : string = 'posZ';
        private static negZ : string = 'negZ';

        private STATE_PARSE_DATA        : number = 0;
        private STATE_LOAD_IMAGES       : number = 1;
        private STATE_COMPLETE          : number = 2;

        private _state                  : number = -1;
        private _dependencyCount        : number = 0;
        private _loadedTextures         : away.textures.Texture2DBase[];

        private _imgLoaderDictionary    : Object;
        private _totalImages            : number = 0;
        private _loadedImageCounter     : number = 0;

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
			return extension == "cube";

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
            }
            catch ( e )
            {
                return false;
            }

            return false;
		}

        /**
         * @inheritDoc
         */
        public _iResolveDependency(resourceDependency:away.loaders.ResourceDependency):void
        {

        }

        /**
         * @inheritDoc
         */
        public _iResolveDependencyFailure(resourceDependency:away.loaders.ResourceDependency):void
        {

        }

        private parseJson( ) : void
        {

            if ( CubeTextureParser.supportsData( this.data ) )
            {

                try
                {

                    this._imgLoaderDictionary = new Object();

                    var json        : any = JSON.parse( this.data );
                    var data        : Array = <Array> json.data;
                    var rec         : any;
                    var rq          : away.net.URLRequest;

                    for ( var c : number = 0 ; c < data.length ; c ++ )
                    {

                        rec                 = data[c];

                        var uri : string    = rec.image;
                        var id  : number    = rec.id;

                        rq                  = new away.net.URLRequest( uri );

                        // Note: Not loading dependencies as we want these to be CubeTexture ( loader will automatically convert to Texture2d ) ;
                        var imgLoader : away.net.IMGLoader  = new away.net.IMGLoader();

                            imgLoader.name                  = rec.id;
                            imgLoader.load( rq );
                            imgLoader.addEventListener( away.events.Event.COMPLETE , this.onIMGLoadComplete , this );

                        this._imgLoaderDictionary[ imgLoader.name ] = imgLoader;

                    }

                    if ( data.length != 6 )
                    {
                        this._pDieWithError( 'CubeTextureParser: Error - cube texture should have exactly 6 images');
                        this._state = this.STATE_COMPLETE;

                        return;
                    }


                    if ( ! this.validateCubeData() )
                    {

                        this._pDieWithError(    "CubeTextureParser: JSON data error - cubes require id of:   \n" +
                                                CubeTextureParser.posX + ', ' + CubeTextureParser.negX + ',  \n' +
                                                CubeTextureParser.posY + ', ' + CubeTextureParser.negY + ',  \n' +
                                                CubeTextureParser.posZ + ', ' + CubeTextureParser.negZ ) ;

                        this._state = this.STATE_COMPLETE;

                        return;

                    }

                    this._state = this.STATE_LOAD_IMAGES;

                }
                catch ( e )
                {

                    this._pDieWithError( 'CubeTexturePaser Error parsing JSON');
                    this._state = this.STATE_COMPLETE;

                }


            }

        }

        private createCubeTexture() : void
        {

            var asset : away.textures.HTMLImageElementCubeTexture = new away.textures.HTMLImageElementCubeTexture (

                    this.getHTMLImageElement( CubeTextureParser.posX ) , this.getHTMLImageElement( CubeTextureParser.negX ),
                    this.getHTMLImageElement( CubeTextureParser.posY ) , this.getHTMLImageElement( CubeTextureParser.negY ),
                    this.getHTMLImageElement( CubeTextureParser.posZ ) , this.getHTMLImageElement( CubeTextureParser.negZ )
                );

                asset.name = this._iFileName;

            this._pFinalizeAsset( <away.library.IAsset> asset , this._iFileName );

            this._state = this.STATE_COMPLETE;

        }

        private validateCubeData() : boolean
        {

            return  ( this.getHTMLImageElement( CubeTextureParser.posX ) != null && this.getHTMLImageElement( CubeTextureParser.negX ) != null &&
                      this.getHTMLImageElement( CubeTextureParser.posY ) != null && this.getHTMLImageElement( CubeTextureParser.negY ) != null &&
                      this.getHTMLImageElement( CubeTextureParser.posZ ) != null && this.getHTMLImageElement( CubeTextureParser.negZ ) != null );

        }

        private getHTMLImageElement( name : string ) : HTMLImageElement
        {

            var imgLoader : away.net.IMGLoader = <away.net.IMGLoader> this._imgLoaderDictionary[ name ];

            if ( imgLoader )
            {

                return imgLoader.image;

            }

            return null;

        }

        private onIMGLoadComplete( e : away.events.Event ) : void
        {

            this._loadedImageCounter ++;

            if ( this._loadedImageCounter == 6 )
            {
                this.createCubeTexture();
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

                    return away.loaders.ParserBase.PARSING_DONE;

                    break;

            }

		}

	}
}