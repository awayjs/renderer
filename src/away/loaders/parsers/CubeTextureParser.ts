///<reference path="../../../../src/away/_definitions.ts" />

module away.loaders
{

	/**
	 * CubeTextureParser provides a "parser" for natively supported image types (jpg, png). While it simply loads bytes into
	 * a loader object, it wraps it in a BitmapDataResource so resource management can happen consistently without
	 * exception cases.
	 */
	export class CubeTextureParser extends away.loaders.ParserBase
	{

		private static posX:string = 'posX';
		private static negX:string = 'negX';
		private static posY:string = 'posY';
		private static negY:string = 'negY';
		private static posZ:string = 'posZ';
		private static negZ:string = 'negZ';

		private _imgDependencyDictionary:Object;

		/**
		 * Creates a new CubeTextureParser object.
		 * @param uri The url or id of the data or file to be parsed.
		 * @param extra The holder for extra contextual data that the parser might need.
		 */
			constructor()
		{
			super(away.loaders.ParserDataFormat.PLAIN_TEXT, away.loaders.ParserLoaderType.URL_LOADER);
		}

		/**
		 * Indicates whether or not a given file extension is supported by the parser.
		 * @param extension The file extension of a potential file to be parsed.
		 * @return Whether or not the given file type is supported.
		 */

		public static supportsType(extension:string):boolean
		{

			extension = extension.toLowerCase();
			return extension == "cube";

		}

		/**
		 * Tests whether a data block can be parsed by the parser.
		 * @param data The data block to potentially be parsed.
		 * @return Whether or not the given data is supported.
		 */
		public static supportsData(data:any):boolean
		{
			try {
				var obj = JSON.parse(data);

				if (obj) {
					return true;
				}
				return false;
			} catch (e) {
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

		/**
		 * @inheritDoc
		 */
		public _pProceedParsing():boolean
		{
			if (this._imgDependencyDictionary != null) { //all images loaded
				var asset:away.textures.HTMLImageElementCubeTexture = new away.textures.HTMLImageElementCubeTexture(

					this._getHTMLImageElement(CubeTextureParser.posX), this._getHTMLImageElement(CubeTextureParser.negX), this._getHTMLImageElement(CubeTextureParser.posY), this._getHTMLImageElement(CubeTextureParser.negY), this._getHTMLImageElement(CubeTextureParser.posZ), this._getHTMLImageElement(CubeTextureParser.negZ));

				//clear dictionary
				this._imgDependencyDictionary = null;

				asset.name = this._iFileName;

				this._pFinalizeAsset(<away.library.IAsset> asset, this._iFileName);

				return away.loaders.ParserBase.PARSING_DONE;
			}

			try {
				var json:any = JSON.parse(this.data);
				var data:Array = <Array> json.data;
				var rec:any;

				if (data.length != 6) {
					this._pDieWithError('CubeTextureParser: Error - cube texture should have exactly 6 images');
				}

				if (json) {
					this._imgDependencyDictionary = new Object();

					for (var c:number = 0; c < data.length; c++) {
						rec = data[c];
						this._imgDependencyDictionary[rec.id] = this._pAddDependency(rec.id, new away.net.URLRequest(rec.image), true);
					}

					if (!this._validateCubeData()) {

						this._pDieWithError("CubeTextureParser: JSON data error - cubes require id of:   \n" + CubeTextureParser.posX + ', ' + CubeTextureParser.negX + ',  \n' + CubeTextureParser.posY + ', ' + CubeTextureParser.negY + ',  \n' + CubeTextureParser.posZ + ', ' + CubeTextureParser.negZ);

						return away.loaders.ParserBase.PARSING_DONE;

					}

					this._pPauseAndRetrieveDependencies();

					return away.loaders.ParserBase.MORE_TO_PARSE;
				}
			} catch (e) {
				this._pDieWithError('CubeTexturePaser Error parsing JSON');
			}

			return away.loaders.ParserBase.PARSING_DONE;

		}

		private _validateCubeData():boolean
		{
			return  ( this._imgDependencyDictionary[ CubeTextureParser.posX ] != null && this._imgDependencyDictionary[ CubeTextureParser.negX ] != null && this._imgDependencyDictionary[ CubeTextureParser.posY ] != null && this._imgDependencyDictionary[ CubeTextureParser.negY ] != null && this._imgDependencyDictionary[ CubeTextureParser.posZ ] != null && this._imgDependencyDictionary[ CubeTextureParser.negZ ] != null );
		}

		private _getHTMLImageElement(name:string):HTMLImageElement
		{
			var dependency:away.loaders.ResourceDependency = <away.loaders.ResourceDependency> this._imgDependencyDictionary[ name ];

			if (dependency) {
				return <HTMLImageElement> dependency.data;
			}

			return null;
		}

	}
}