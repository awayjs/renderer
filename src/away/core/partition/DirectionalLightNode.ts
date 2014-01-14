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

		private _light:away.lights.DirectionalLight;

		constructor(light:away.lights.DirectionalLight)
		{
			super(light);
			this._light = light;
		}

		public get light():away.lights.DirectionalLight
		{
			return this._light;
		}

		//@override
		public acceptTraverser(traverser:away.traverse.PartitionTraverser)
		{
			if (traverser.enterNode(this)) {
				super.acceptTraverser(traverser);
				traverser.applyDirectionalLight(this._light);
			}
		}

		public isCastingShadow():boolean
		{
			return false;
		}
	}
}