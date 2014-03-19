///<reference path="../../_definitions.ts"/>

/**
 * @module away.partition
 */
module away.partition
{
	/**
	 * @class away.partition.PointLightNode
	 */
	export class PointLightNode extends EntityNode
	{
		private _pointLight:away.entities.IEntity;

		/**
		 *
		 * @param pointLight
		 */
		constructor(pointLight:away.entities.IEntity)
		{
			super(pointLight);

			this._pointLight = pointLight;
		}

		/**
		 * @inheritDoc
		 */
		public acceptTraverser(traverser:away.traverse.ICollector)
		{
			//do not run frustum checks on lights
			traverser.applyPointLight(this._pointLight);
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