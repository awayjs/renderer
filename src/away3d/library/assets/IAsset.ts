module away3d.library.assets
{
	//import flash.events.IEventDispatcher;

	export interface IAsset //extends IEventDispatcher
	{
		name() : string;
		name(val : string) : void;
		id() : string;
		id(val : string) : void;
		assetNamespace() : string;
		assetType() : string;
		assetFullPath() : Array;
		
		assetPathEquals(name : string, ns : string) : boolean;
		resetAssetPath(name : string, ns : string, overrideOriginal : boolean ) : void;
		
		/**
		 * Cleans up resources used by this asset.
		*/
		dispose() : void;
	}
}