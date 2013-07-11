///<reference path="../assets/IAsset.ts" />
///<reference path="ConflictStrategyBase.ts" />

module away.library
{
	//import away3d.library.assets.IAsset;
	
	export class IgnoreConflictStrategy extends away.library.ConflictStrategyBase
	{
		constructor()
		{
			super();
		}
		
		public resolveConflict( changedAsset : away.library.IAsset, oldAsset : away.library.IAsset , assetsDictionary : Object , precedence : string )
		{
			// Do nothing, ignore the fact that there is a conflict.
			return;
		}
		
		public create() : away.library.ConflictStrategyBase
		{
			return new away.library.IgnoreConflictStrategy();
		}
	}
}
