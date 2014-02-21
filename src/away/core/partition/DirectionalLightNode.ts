///<reference path="../../_definitions.ts"/>

/**
 * @module away.partition
 */
module away.partition
{
	/**
	 * @class away.partition.DirectionalLightNode
	 */
	export class DirectionalLightNode extends EntityNode
	{
		private _directionalLight:away.entities.IEntity;

		/**
		 *
		 * @param directionalLight
		 */
		constructor(directionalLight:away.entities.IEntity)
		{
			super(directionalLight);

			this._directionalLight = directionalLight;
		}

		/**
		 * @inheritDoc
		 */
		public acceptTraverser(traverser:away.traverse.ICollector)
		{
			//do not run frustum checks on lights
			traverser.applyEntity(this._directionalLight);
		}

		/**
		 *
		 * @returns {boolean}
		 */
		public isCastingShadow():boolean
		{
			return false;
		}
	}
}