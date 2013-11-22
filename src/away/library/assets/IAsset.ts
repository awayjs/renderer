///<reference path="../../_definitions.ts"/>

module away.library
{
	//import flash.events.IEventDispatcher;

	export interface IAsset extends away.events.IEventDispatcher
	{

		name : string;
		id : string;
		assetNamespace : string;
		assetType : string;
		assetFullPath : Array<string>;

		assetPathEquals(name:string, ns:string) : boolean;
		resetAssetPath(name:string, ns:string, overrideOriginal ?:boolean) : void;
		dispose();

	}
}