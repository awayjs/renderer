/// <reference path="../../events/EventDispatcher.ts" />
/// <reference path="../../events/AssetEvent.ts" />

module away3d.library.assets
{
	//import away3d.arcane;
	//import away3d.events.AssetEvent;

	//import flash.events.EventDispatcher;

	//use namespace arcane;
	
	export class NamedAssetBase extends away3d.events.EventDispatcher
	{
		private var _originalName : string;
		private var _namespace : string;
		private var _name : string;
		private var _id : string;
		private var _full_path : Array;

		public static DEFAULT_NAMESPACE : string = 'default';
		
		constructor(name : string=null)
		{
            super();

			if (name == null)
				name = 'null';
			
			this._name = name;
            this._originalName = name;

            this.updateFullPath();
		}
		
		
		/**
		 * The original name used for this asset in the resource (e.g. file) in which
		 * it was found. This may not be the same as <code>name</code>, which may
		 * have changed due to of a name conflict.
		*/
		public get originalName() : string
		{
			return this._originalName;
		}
		
		public get id() : string
		{
			return this._id;
		}
		public set id(newID : string) : void
		{
            this._id=newID;
		}
		
		public get name() : string
		{
			return this._name;
		}
		public set name(val : string) : void
		{
			var prev : string;
			
			prev = this._name;
            this._name = val;
			if (this._name == null)
                this._name = 'null';

            this.updateFullPath();


			if (this.hasEventListener(away3d.events.AssetEvent.ASSET_RENAME)) {

                dispatchEvent( new away3d.events.AssetEvent( away3d.events.AssetEvent.ASSET_RENAME , IAsset(this) , prev ));

            }

		}
		
		
		public get assetNamespace() : string
		{
			return this._namespace;
		}
		
		
		public get assetFullPath() : Array
		{
			return this._full_path;
		}
		
		
		public assetPathEquals(name : string, ns : string) : boolean
		{
			return (this._name == name && (!ns || this._namespace==ns));
		}
		
		
		public resetAssetPath(name : string, ns : string = null, overrideOriginal : boolean = true) : void
		{
            this._name = name? name : 'null';
            this._namespace = ns? ns: NamedAssetBase.DEFAULT_NAMESPACE;
			if (overrideOriginal)
                this._originalName = this._name;

            this.updateFullPath();
		}
		
		
		private updateFullPath() : void
		{
            this._full_path = [ this._namespace, this._name ];
		}
	}
}