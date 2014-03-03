///<reference path="../../_definitions.ts"/>

/**
 * @module away.pool
 */
module away.pool
{
	/**
	 * @class away.pool.SubMeshRenderable
	 */
	export class SubMeshRenderable extends RenderableBase
	{
		public subMesh:away.base.SubMesh;

		constructor(pool:RenderablePool, subMesh:away.base.SubMesh)
		{
			super(pool, subMesh.sourceEntity, subMesh, subMesh.subGeometry, subMesh.animationSubGeometry);

			this.subMesh = subMesh;
		}
	}
}