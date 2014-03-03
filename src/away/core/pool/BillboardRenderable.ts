///<reference path="../../_definitions.ts"/>

/**
 * @module away.pool
 */
module away.pool
{
	/**
	 * @class away.pool.RenderableListItem
	 */
	export class BillboardRenderable extends RenderableBase
	{
		// TODO: Replace with CompactSubGeometry
		private static _geometry:away.base.SubGeometry;

		constructor(pool:RenderablePool, billboard:away.entities.Billboard)
		{
			super(pool, billboard, billboard, null, null);

			if (!BillboardRenderable._geometry) {
				BillboardRenderable._geometry = new away.base.SubGeometry();
				BillboardRenderable._geometry.updateVertexData(Array<number>(0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0));
				BillboardRenderable._geometry.updateUVData(Array<number>(0, 0, 1, 0, 1, 1, 0, 1));
				BillboardRenderable._geometry.updateIndexData(Array<number>(0, 1, 2, 0, 2, 3));
				BillboardRenderable._geometry.updateVertexTangentData(Array<number>(1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0));
				BillboardRenderable._geometry.updateVertexNormalData(Array<number>(0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1));
			}

			this.subGeometry = BillboardRenderable._geometry;
		}
	}
}