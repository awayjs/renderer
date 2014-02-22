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

		constructor(subMesh:away.base.SubMesh)
		{
			super(subMesh.sourceEntity, subMesh, subMesh.subGeometry, subMesh.animationSubGeometry);
			//super(subMesh.sourceEntity, subMesh, subMesh.subGeometry, subMesh.animationSubGeometry);

			this.subMesh = subMesh;
		}
	}
}