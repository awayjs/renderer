///<reference path="../../_definitions.ts"/>

/**
 * @module away.partition
 */
module away.partition
{
	/**
	 * @class away.partition.LightProbeNode
	 */
	export class LightProbeNode extends EntityNode
	{
		private _lightProbe:away.entities.IEntity;

		/**
		 *
		 * @param lightProbe
		 */
		constructor(lightProbe:away.entities.IEntity)
		{
			super(lightProbe);

			this._lightProbe = lightProbe;
		}

		/**
		 * @inheritDoc
		 */
		public acceptTraverser(traverser:away.traverse.ICollector)
		{
			//do not run frustum checks on lights
			traverser.applyEntity(this._lightProbe);
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