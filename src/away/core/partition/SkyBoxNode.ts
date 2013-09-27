///<reference path="../../_definitions.ts"/>
module away.partition
{

	/**
	 * SkyBoxNode is a space partitioning leaf node that contains a SkyBox object.
	 */
	export class SkyBoxNode extends away.partition.EntityNode
	{
		private _skyBox:away.primitives.SkyBox;
		
		/**
		 * Creates a new SkyBoxNode object.
		 * @param skyBox The SkyBox to be contained in the node.
		 */
		constructor(skyBox:away.primitives.SkyBox)
		{
			super( <away.entities.Entity > skyBox );
			this._skyBox = skyBox;
		}
		
		/**
		 * @inheritDoc
		 */
		public acceptTraverser(traverser:away.traverse.PartitionTraverser)
		{
			if (traverser.enterNode(this))
            {
				super.acceptTraverser(traverser);
				traverser.applySkyBox( <away.base.IRenderable> this._skyBox);
			}
		}
		
		public isInFrustum(planes:away.math.Plane3D[], numPlanes:number):boolean
		{

			planes = planes;
			numPlanes = numPlanes;

			return true;
		}
	}
}
