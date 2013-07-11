///<reference path="../../errors/Error.ts" />
///<reference path="ConflictStrategyBase.ts" />
///<reference path="../assets/IAsset.ts" />

module away.library
{
	//import away3d.library.assets.IAsset;
	
	export class ErrorConflictStrategy extends away.library.ConflictStrategyBase
	{
		constructor()
		{
			super();
		}
		
		public resolveConflict( changedAsset : away.library.IAsset, oldAsset : away.library.IAsset, assetsDictionary : Object , precedence : string )
		{
			throw new away.errors.Error('Asset name collision while AssetLibrary.namingStrategy set to AssetLibrary.THROW_ERROR. Asset path: ' + changedAsset.assetFullPath );
		}
		
		public create():away.library.ConflictStrategyBase
		{
			return new ErrorConflictStrategy();
		}
	}
}
