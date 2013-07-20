///<reference path="../../_definitions.ts"/>
module away.animators
{

	/**
	 * Provides an abstract base class for nodes in an animation blend tree.
	 */
	export class AnimationNodeBase extends away.library.NamedAssetBase implements away.library.IAsset
	{
		private _stateClass;
		
		public get stateClass()
		{
			return this._stateClass;
		}
		
		/**
		 * Creates a new <code>AnimationNodeBase</code> object.
		 */
		constructor()
		{

            super();

		}
		
		/**
		 * @inheritDoc
		 */
		public dispose()
		{
		}
		
		/**
		 * @inheritDoc
		 */
		public get assetType():string
		{
			return away.library.AssetType.ANIMATION_NODE;
		}
	}
}
