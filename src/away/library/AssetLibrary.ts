///<reference path="AssetLibraryBundle.ts"/>
///<reference path="../loaders/misc/SingleFileLoader.ts"/>
///<reference path="../loaders/misc/AssetLoaderContext.ts"/>
///<reference path="../loaders/misc/AssetLoaderToken.ts"/>
///<reference path="../loaders/parsers/ParserBase.ts"/>
///<reference path="naming/ConflictStrategyBase.ts"/>
///<reference path="utils/AssetLibraryIterator.ts"/>
///<reference path="assets/IAsset.ts"/>

module away.library
{

	/**
	 * AssetLibrary enforces a singleton pattern and is not intended to be instanced.
	 * It's purpose is to allow access to the default library bundle through a set of static shortcut methods.
	 * If you are interested in creating multiple library bundles, please use the <code>getBundle()</code> method.
	 */
	export class AssetLibrary
	{
		public static _iInstances:Object = {};
		
		/**
		 * Creates a new <code>AssetLibrary</code> object.
		 *
		 * @param se A singleton enforcer for the AssetLibrary ensuring it cannnot be instanced.
		 */
        //*
		constructor(se:AssetLibrarySingletonEnforcer)
		{
			se = se;
		}
		//*/
		/**
		 * Returns an AssetLibrary bundle instance. If no key is given, returns the default bundle (which is
		 * similar to using the AssetLibraryBundle as a singleton). To keep several separated library bundles,
		 * pass a string key to this method to define which bundle should be returned. This is
		 * referred to as using the AssetLibraryBundle as a multiton.
		 *
		 * @param key Defines which multiton instance should be returned.
		 * @return An instance of the asset library
		 */
		public static getBundle(key:string = 'default'):away.library.AssetLibraryBundle
		{
			return away.library.AssetLibraryBundle.getInstance(key);
		}
		
		/**
		 *
		 */
		public static enableParser(parserClass)
		{
			away.loaders.SingleFileLoader.enableParser(parserClass);
		}
		
		/**
		 *
		 */
		public static enableParsers( parserClasses: Object[] )
		{
            away.loaders.SingleFileLoader.enableParsers(parserClasses);
		}
		
		/**
		 * Short-hand for conflictStrategy property on default asset library bundle.
		 *
		 * @see away3d.library.AssetLibraryBundle.conflictStrategy
		 */
		public static get conflictStrategy():away.library.ConflictStrategyBase
		{
			return away.library.AssetLibrary.getBundle().conflictStrategy;
		}
		
		public static set conflictStrategy(val:away.library.ConflictStrategyBase)
		{
            away.library.AssetLibrary.getBundle().conflictStrategy = val;
		}
		
		/**
		 * Short-hand for conflictPrecedence property on default asset library bundle.
		 *
		 * @see away3d.library.AssetLibraryBundle.conflictPrecedence
		 */
		public static get conflictPrecedence():string
		{
			return away.library.AssetLibrary.getBundle().conflictPrecedence;
		}
		
		public static set conflictPrecedence(val:string)
		{
            away.library.AssetLibrary.getBundle().conflictPrecedence = val;
		}
		
		/**
		 * Short-hand for createIterator() method on default asset library bundle.
		 *
		 * @see away3d.library.AssetLibraryBundle.createIterator()
		 */
		public static createIterator(assetTypeFilter:string = null, namespaceFilter:string = null, filterFunc = null):away.library.AssetLibraryIterator
		{
			return away.library.AssetLibrary.getBundle().createIterator(assetTypeFilter, namespaceFilter, filterFunc);
		}
		
		/**
		 * Short-hand for load() method on default asset library bundle.
		 *
		 * @see away3d.library.AssetLibraryBundle.load()
		 */
		public static load(req:away.net.URLRequest, context:away.loaders.AssetLoaderContext = null, ns:string = null, parser:away.loaders.ParserBase = null):away.loaders.AssetLoaderToken
		{
			return away.library.AssetLibrary.getBundle().load(req, context, ns, parser);
		}
		
		/**
		 * Short-hand for loadData() method on default asset library bundle.
		 *
		 * @see away3d.library.AssetLibraryBundle.loadData()
		 */
		public static loadData(data: any , context:away.loaders.AssetLoaderContext = null, ns:string = null, parser:away.loaders.ParserBase = null):away.loaders.AssetLoaderToken
		{
			return away.library.AssetLibrary.getBundle().loadData(data, context, ns, parser);
		}
		
		public static stopLoad()
		{
            away.library.AssetLibrary.getBundle().stopAllLoadingSessions();
		}
		
		/**
		 * Short-hand for getAsset() method on default asset library bundle.
		 *
		 * @see away3d.library.AssetLibraryBundle.getAsset()
		 */
		public static getAsset(name:string, ns:string = null):away.library.IAsset
		{
			return away.library.AssetLibrary.getBundle().getAsset(name, ns);
		}
		
		/**
		 * Short-hand for addEventListener() method on default asset library bundle.
		 */
		public static addEventListener( type : string , listener : Function , target : Object  )
		{
            away.library.AssetLibrary.getBundle().addEventListener(type, listener, target );
		}
		
		/**
		 * Short-hand for removeEventListener() method on default asset library bundle.
		 */
		public static removeEventListener(type : string , listener : Function , target : Object  )
		{
            away.library.AssetLibrary.getBundle().removeEventListener(type , listener , target );
		}
		
		/**
		 * Short-hand for hasEventListener() method on default asset library bundle.

		public static hasEventListener(type:string):boolean
		{
			return away.library.AssetLibrary.getBundle().hasEventListener(type);
		}

		public static willTrigger(type:string):boolean
		{
			return getBundle().willTrigger(type);
		}
        */

		/**
		 * Short-hand for addAsset() method on default asset library bundle.
		 *
		 * @see away3d.library.AssetLibraryBundle.addAsset()
		 */
		public static addAsset(asset:IAsset)
		{
			away.library.AssetLibrary.getBundle().addAsset(asset);
		}
		
		/**
		 * Short-hand for removeAsset() method on default asset library bundle.
		 *
		 * @param asset The asset which should be removed from the library.
		 * @param dispose Defines whether the assets should also be disposed.
		 *
		 * @see away3d.library.AssetLibraryBundle.removeAsset()
		 */
		public static removeAsset(asset:IAsset, dispose:boolean = true)
		{
            away.library.AssetLibrary.getBundle().removeAsset(asset, dispose);
		}
		
		/**
		 * Short-hand for removeAssetByName() method on default asset library bundle.
		 *
		 * @param name The name of the asset to be removed.
		 * @param ns The namespace to which the desired asset belongs.
		 * @param dispose Defines whether the assets should also be disposed.
		 *
		 * @see away3d.library.AssetLibraryBundle.removeAssetByName()
		 */
		public static removeAssetByName(name:string, ns:string = null, dispose:boolean = true):IAsset
		{
			return away.library.AssetLibrary.getBundle().removeAssetByName(name, ns, dispose);
		}
		
		/**
		 * Short-hand for removeAllAssets() method on default asset library bundle.
		 *
		 * @param dispose Defines whether the assets should also be disposed.
		 *
		 * @see away3d.library.AssetLibraryBundle.removeAllAssets()
		 */
		public static removeAllAssets(dispose:boolean = true)
		{
            away.library.AssetLibrary.getBundle().removeAllAssets(dispose);
		}
		
		/**
		 * Short-hand for removeNamespaceAssets() method on default asset library bundle.
		 *
		 * @see away3d.library.AssetLibraryBundle.removeNamespaceAssets()
		 */
		public static removeNamespaceAssets(ns:string = null, dispose:boolean = true)
		{
            away.library.AssetLibrary.getBundle().removeNamespaceAssets(ns, dispose);
		}
	}
}

// singleton enforcer
class AssetLibrarySingletonEnforcer
{
}
