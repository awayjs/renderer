///<reference path="../../_definitions.ts"/>

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
		private _startedParsing:boolean;
		private _doneParsing:boolean;
		//private var _loader           : Loader;

		/**
		 * Creates a new ImageParser object.
		 * @param uri The url or id of the data or file to be parsed.
		 * @param extra The holder for extra contextual data that the parser might need.
		 */
			constructor()
		{

			super(away.loaders.ParserDataFormat.IMAGE, away.loaders.ParserLoaderType.IMG_LOADER);

		}

		/**
		 * Indicates whether or not a given file extension is supported by the parser.
		 * @param extension The file extension of a potential file to be parsed.
		 * @return Whether or not the given file type is supported.
		 */

		public static supportsType(extension:string):boolean
		{

			extension = extension.toLowerCase();
			return extension == "jpg" || extension == "jpeg" || extension == "png" || extension == "gif";//|| extension == "bmp";//|| extension == "atf";

		}

		/**
		 * Tests whether a data block can be parsed by the parser.
		 * @param data The data block to potentially be parsed.
		 * @return Whether or not the given data is supported.
		 */
		public static supportsData(data:any):boolean
		{

			if (data  instanceof HTMLImageElement)
				return true;

			if (!(data instanceof away.utils.ByteArray))
				return false;

			var ba:away.utils.ByteArray = <away.utils.ByteArray> data;
			ba.position = 0;

			if (ba.readUnsignedShort() == 0xffd8)
				return true; // JPEG, maybe check for "JFIF" as well?

			ba.position = 0;
			if (ba.readShort() == 0x424D)
				return true; // BMP

			ba.position = 1;
			if (ba.readUTFBytes(3) == 'PNG')
				return true;

			ba.position = 0;
			if (ba.readUTFBytes(3) == 'GIF' && ba.readShort() == 0x3839 && ba.readByte() == 0x61)
				return true;

			ba.position = 0;
			if (ba.readUTFBytes(3) == 'ATF')
				return true;

			return false;

		}

		/**
		 * @inheritDoc
		 */
		public _pProceedParsing():boolean
		{

			var asset:away.textures.Texture2DBase;
			var sizeError:boolean = false;

			if (this.data instanceof HTMLImageElement)// Parse HTMLImageElement
			{

				if (away.utils.TextureUtils.isHTMLImageElementValid(<HTMLImageElement> this.data)) {
					asset = <away.textures.Texture2DBase> new away.textures.HTMLImageElementTexture(<HTMLImageElement> this.data, false);
					this._pFinalizeAsset(<away.library.IAsset> asset, this._iFileName);
				} else {
					sizeError = true;
				}

			} else if (this.data instanceof away.utils.ByteArray) // Parse a ByteArray
			{

				var ba:away.utils.ByteArray = this.data
				ba.position = 0;
				var htmlImageElement:HTMLImageElement = away.loaders.ParserUtil.byteArrayToImage(this.data);

				if (away.utils.TextureUtils.isHTMLImageElementValid(htmlImageElement)) {
					asset = <away.textures.Texture2DBase> new away.textures.HTMLImageElementTexture(htmlImageElement, false);
					this._pFinalizeAsset(<away.library.IAsset> asset, this._iFileName);
				} else {
					sizeError = true;
				}

			}

			if (sizeError == true) // Generate new Checkerboard texture material
			{
				asset = <away.textures.Texture2DBase> new away.textures.BitmapTexture(away.materials.DefaultMaterialManager.createCheckeredBitmapData(), false);
				this._pFinalizeAsset(<away.library.IAsset> asset, this._iFileName);
				this.dispatchEvent(new away.events.AssetEvent(away.events.AssetEvent.TEXTURE_SIZE_ERROR, <away.library.IAsset> asset));
			}

			return away.loaders.ParserBase.PARSING_DONE;

		}

	}
}