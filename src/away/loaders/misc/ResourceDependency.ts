///<reference path="../../_definitions.ts"/>

module away.loaders
{
	//import away3d.arcane;
	//import away3d.library.assets.IAsset;
	//import away3d.loaders.parsers.ParserBase;

	//import flash.net.URLRequest;

	//use namespace arcane;

	/**
	 * ResourceDependency represents the data required to load, parse and resolve additional files ("dependencies")
	 * required by a parser, used by ResourceLoadSession.
	 *
	 */
	export class ResourceDependency
	{
		private _id:string;
		private _req:away.net.URLRequest;
		private _assets:away.library.IAsset[];//Vector.<IAsset>;
		private _parentParser:away.loaders.ParserBase;
		private _data:any;
		private _retrieveAsRawData:boolean;
		private _suppressAssetEvents:boolean;
		private _dependencies:ResourceDependency[];

		public _iLoader:away.loaders.SingleFileLoader;
		public _iSuccess:boolean;


		constructor(id:string, req:away.net.URLRequest, data:any, parentParser:away.loaders.ParserBase, retrieveAsRawData:boolean = false, suppressAssetEvents:boolean = false)
		{

			this._id = id;
			this._req = req;
			this._parentParser = parentParser;
			this._data = data;
			this._retrieveAsRawData = retrieveAsRawData;
			this._suppressAssetEvents = suppressAssetEvents;

			this._assets = new Array<away.library.IAsset>();//new Vector.<IAsset>();
			this._dependencies = new Array<ResourceDependency>();
		}


		public get id():string
		{
			return this._id;
		}


		public get assets():away.library.IAsset[]//Vector.<IAsset>
		{
			return this._assets;
		}


		public get dependencies():ResourceDependency[]//Vector.<ResourceDependency>
		{
			return this._dependencies;
		}


		public get request():away.net.URLRequest
		{
			return this._req;
		}


		public get retrieveAsRawData():boolean
		{
			return this._retrieveAsRawData;
		}


		public get suppresAssetEvents():boolean
		{
			return this._suppressAssetEvents;
		}


		/**
		 * The data containing the dependency to be parsed, if the resource was already loaded.
		 */
		public get data():any
		{
			return this._data;
		}


		/**
		 * @private
		 * Method to set data after having already created the dependency object, e.g. after load.
		 */
		public _iSetData(data:any):void
		{
			this._data = data;
		}

		/**
		 * The parser which is dependent on this ResourceDependency object.
		 */
		public get parentParser():away.loaders.ParserBase
		{
			return this._parentParser;
		}

		/**
		 * Resolve the dependency when it's loaded with the parent parser. For example, a dependency containing an
		 * ImageResource would be assigned to a Mesh instance as a BitmapMaterial, a scene graph object would be added
		 * to its intended parent. The dependency should be a member of the dependencies property.
		 */
		public resolve():void
		{

			if (this._parentParser) this._parentParser._iResolveDependency(this);
		}

		/**
		 * Resolve a dependency failure. For example, map loading failure from a 3d file
		 */
		public resolveFailure():void
		{
			if (this._parentParser) this._parentParser._iResolveDependencyFailure(this);
		}

		/**
		 * Resolve the dependencies name
		 */
		public resolveName(asset:away.library.IAsset):string
		{
			if (this._parentParser) return this._parentParser._iResolveDependencyName(this, asset);
			return asset.name;
		}

	}
}
