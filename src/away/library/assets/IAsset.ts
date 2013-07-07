module away.library
{
	//import flash.events.IEventDispatcher;

	export interface IAsset //extends IEventDispatcher
	{

		name : string;
		id : string;
		assetNamespace : string;
		assetType : string;
		assetFullPath : Array;
		
		assetPathEquals(name : string, ns : string) : boolean;
		resetAssetPath(name : string, ns : string , overrideOriginal : boolean ) : void;
		dispose() : void;

	}
}