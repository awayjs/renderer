///<reference path="../../_definitions.ts"/>

module away.animators
{

	/**
	 * Provides an abstract base class for nodes in an animation blend tree.
	 */
	export class AnimationNodeBase extends away.library.NamedAssetBase implements away.library.IAsset
	{
        public static ANIMATIONNODE_ID_COUNT:number = 0;

        /**
         * An id for this animation node, used to identify animations when using animation states.
         *
         * @private
         */
        public _iUniqueId:number;//Arcane

		public _pStateClass:any;
		
		public get stateClass():any
		{
			return this._pStateClass;
		}
		
		/**
		 * Creates a new <code>AnimationNodeBase</code> object.
		 */
		constructor()
		{
            super();

            this._iUniqueId = away.animators.AnimationNodeBase.ANIMATIONNODE_ID_COUNT++;
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
