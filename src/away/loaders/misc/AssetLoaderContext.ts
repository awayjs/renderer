module away.loaders
{

	export class AssetLoaderContext
	{
		public static UNDEFINED:number = 0;
		public static SINGLEPASS_MATERIALS:number = 1;
		public static MULTIPASS_MATERIALS:number = 2;

		private _includeDependencies:boolean;
		private _dependencyBaseUrl:string;
		private _embeddedDataByUrl:Object;
		private _remappedUrls:Object;
		private _materialMode:number;

		private _overrideAbsPath:boolean;
		private _overrideFullUrls:boolean;

		/**
		 * AssetLoaderContext provides configuration for the AssetLoader load() and parse() operations.
		 * Use it to configure how (and if) dependencies are loaded, or to map dependency URLs to
		 * embedded data.
		 *
		 * @see away3d.loading.AssetLoader
		 */
			constructor(includeDependencies:boolean = true, dependencyBaseUrl:string = null)
		{
			this._includeDependencies = includeDependencies;
			this._dependencyBaseUrl = dependencyBaseUrl || '';
			this._embeddedDataByUrl = {};
			this._remappedUrls = {};
			this._materialMode = AssetLoaderContext.UNDEFINED;
		}

		/**
		 * Defines whether dependencies (all files except the one at the URL given to the load() or
		 * parseData() operations) should be automatically loaded. Defaults to true.
		 */
		public get includeDependencies():boolean
		{
			return this._includeDependencies;
		}

		public set includeDependencies(val:boolean)
		{
			this._includeDependencies = val;
		}

		/**
		 * MaterialMode defines, if the Parser should create SinglePass or MultiPass Materials
		 * Options:
		 * 0 (Default / undefined) - All Parsers will create SinglePassMaterials, but the AWD2.1parser will create Materials as they are defined in the file
		 * 1 (Force SinglePass) - All Parsers create SinglePassMaterials
		 * 2 (Force MultiPass) - All Parsers will create MultiPassMaterials
		 *
		 */
		public get materialMode():number
		{
			return this._materialMode;
		}

		public set materialMode(materialMode:number)
		{
			this._materialMode = materialMode;
		}

		/**
		 * A base URL that will be prepended to all relative dependency URLs found in a loaded resource.
		 * Absolute paths will not be affected by the value of this property.
		 */
		public get dependencyBaseUrl():string
		{
			return this._dependencyBaseUrl;
		}

		public set dependencyBaseUrl(val:string)
		{
			this._dependencyBaseUrl = val;
		}

		/**
		 * Defines whether absolute paths (defined as paths that begin with a "/") should be overridden
		 * with the dependencyBaseUrl defined in this context. If this is true, and the base path is
		 * "base", /path/to/asset.jpg will be resolved as base/path/to/asset.jpg.
		 */
		public get overrideAbsolutePaths():boolean
		{
			return this._overrideAbsPath;
		}

		public set overrideAbsolutePaths(val:boolean)
		{
			this._overrideAbsPath = val;
		}

		/**
		 * Defines whether "full" URLs (defined as a URL that includes a scheme, e.g. http://) should be
		 * overridden with the dependencyBaseUrl defined in this context. If this is true, and the base
		 * path is "base", http://example.com/path/to/asset.jpg will be resolved as base/path/to/asset.jpg.
		 */
		public get overrideFullURLs():boolean
		{
			return this._overrideFullUrls;
		}

		public set overrideFullURLs(val:boolean)
		{
			this._overrideFullUrls = val;
		}

		/**
		 * Map a URL to another URL, so that files that are referred to by the original URL will instead
		 * be loaded from the new URL. Use this when your file structure does not match the one that is
		 * expected by the loaded file.
		 *
		 * @param originalUrl The original URL which is referenced in the loaded resource.
		 * @param newUrl The URL from which Away3D should load the resource instead.
		 *
		 * @see mapUrlToData()
		 */
		public mapUrl(originalUrl:string, newUrl:string)
		{
			this._remappedUrls[originalUrl] = newUrl;
		}

		/**
		 * Map a URL to embedded data, so that instead of trying to load a dependency from the URL at
		 * which it's referenced, the dependency data will be retrieved straight from the memory instead.
		 *
		 * @param originalUrl The original URL which is referenced in the loaded resource.
		 * @param data The embedded data. Can be ByteArray or a class which can be used to create a bytearray.
		 */
		public mapUrlToData(originalUrl:string, data:any)
		{
			this._embeddedDataByUrl[originalUrl] = data;
		}

		/**
		 * @private
		 * Defines whether embedded data has been mapped to a particular URL.
		 */
		public _iHasDataForUrl(url:string):boolean
		{
			return this._embeddedDataByUrl.hasOwnProperty(url);
		}

		/**
		 * @private
		 * Returns embedded data for a particular URL.
		 */
		public _iGetDataForUrl(url:string):any
		{
			return this._embeddedDataByUrl[url];
		}

		/**
		 * @private
		 * Defines whether a replacement URL has been mapped to a particular URL.
		 */
		public _iHasMappingForUrl(url:string):boolean
		{
			return this._remappedUrls.hasOwnProperty(url);
		}

		/**
		 * @private
		 * Returns new (replacement) URL for a particular original URL.
		 */
		public _iGetRemappedUrl(originalUrl:string):string
		{
			return this._remappedUrls[originalUrl];
		}
	}
}
