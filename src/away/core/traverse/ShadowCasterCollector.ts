///<reference path="../../_definitions.ts"/>

/**
 * @module away.traverse
 */
module away.traverse
{
	/**
	 * @class away.traverse.ShadowCasterCollector
	 */
	export class ShadowCasterCollector extends RenderableCollectorBase
	{
		constructor()
		{
			super();
		}

		/**
		 *
		 */
		public enterNode(node:away.partition.NodeBase):boolean
		{
			var enter:boolean = this.scene._iCollectionMark != node._iCollectionMark && node.isCastingShadow();

			if (!enter) {
				node._iCollectionMark = this.scene._iCollectionMark

				return false;
			}

			return super.enterNode(node);
		}
	}
}