///<reference path="../../_definitions.ts"/>

/**
 * @module away.partition
 */
module away.partition
{
	/**
	 * @class away.partition.LightNode
	 */
	export class LightNode extends EntityNode
	{

		private _light:away.lights.LightBase;

		constructor(light:away.lights.LightBase)
		{
			super(light);
			this._light = light;
		}

		public get light():away.lights.LightBase
		{
			return this._light;
		}

		//@override
		public acceptTraverser(traverser:away.traverse.PartitionTraverser)
		{
			if (traverser.enterNode(this)) {
				super.acceptTraverser(traverser);
				traverser.applyUnknownLight(this._light);
			}
		}
	}
}