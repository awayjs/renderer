///<reference path="ParserBase.ts" />
///<reference path="ParserDataFormat.ts" />
///<reference path="ParserLoaderType.ts" />
///<reference path="../../net/IMGLoader.ts" />
///<reference path="../../textures/HTMLImageElementTexture.ts" />
///<reference path="../../textures/Texture2DBase.ts" />

module away.loaders
{

	/**
	 * ImageParser provides a "parser" for natively supported image types (jpg, png). While it simply loads bytes into
	 * a loader object, it wraps it in a BitmapDataResource so resource management can happen consistently without
	 * exception cases.
	 */
	export class ImageParser extends away.loaders.ParserBase
	{
		//private var _byteData         : ByteArray;
		private _startedParsing         : boolean;
		private _doneParsing            : boolean;
		//private var _loader           : Loader;

		/**
		 * Creates a new ImageParser object.
		 * @param uri The url or id of the data or file to be parsed.
		 * @param extra The holder for extra contextual data that the parser might need.
		 */
		constructor()
		{

			super( away.loaders.ParserDataFormat.IMAGE , away.loaders.ParserLoaderType.IMG_LOADER );

		}

		/**
		 * Indicates whether or not a given file extension is supported by the parser.
		 * @param extension The file extension of a potential file to be parsed.
		 * @return Whether or not the given file type is supported.
		 */

		public static supportsType(extension : string) : boolean
		{

			extension = extension.toLowerCase();
			return extension == "jpg" || extension == "jpeg" || extension == "png" || extension == "gif" ;//|| extension == "bmp";//|| extension == "atf";

		}

		/**
		 * Tests whether a data block can be parsed by the parser.
		 * @param data The data block to potentially be parsed.
		 * @return Whether or not the given data is supported.
		 */
		public static supportsData(data : any) : boolean
		{

            if ( data  instanceof HTMLImageElement )
            {

                return true;
            }

            return false;

		}

		/**
		 * @inheritDoc
		 */
		public _pProceedParsing() : boolean
		{

            var asset : away.textures.Texture2DBase;

            if ( this.data  instanceof HTMLImageElement )
            {

                asset = <away.textures.Texture2DBase> new away.textures.HTMLImageElementTexture( <HTMLImageElement> this.data );

                this._pFinalizeAsset( <away.library.IAsset> asset , this._iFileName );

                return away.loaders.ParserBase.PARSING_DONE;

            }

            return away.loaders.ParserBase.PARSING_DONE;

		}

	}
}