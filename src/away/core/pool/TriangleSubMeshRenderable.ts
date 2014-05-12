///<reference path="../../_definitions.ts"/>

/**
 * @module away.pool
 */
module away.pool
{
	import TriangleSubGeometry					= away.base.TriangleSubGeometry;
	import TriangleSubMesh						= away.base.TriangleSubMesh;
	
	/**
	 * @class away.pool.TriangleSubMeshRenderable
	 */
	export class TriangleSubMeshRenderable extends RenderableBase
	{
		/**
		 *
		 */
		public static id:string = "trianglesubmesh";

		/**
		 *
		 */
		public subMesh:TriangleSubMesh;


		/**
		 * //TODO
		 *
		 * @param pool
		 * @param subMesh
		 * @param level
		 * @param indexOffset
		 */
		constructor(pool:RenderablePool, subMesh:TriangleSubMesh, level:number = 0, indexOffset:number = 0)
		{
			super(pool, subMesh.parentMesh, subMesh, level, indexOffset);

			this.subMesh = subMesh;
		}

		/**
		 *
		 * @returns {away.base.SubGeometryBase}
		 * @protected
		 */
		public _pGetSubGeometry():TriangleSubGeometry
		{
			var subGeometry:TriangleSubGeometry;

			if (this.subMesh.animator)
				subGeometry = <TriangleSubGeometry> this.subMesh.animator.getRenderableSubGeometry(this, this.subMesh.subGeometry);
			else
				subGeometry = this.subMesh.subGeometry;

			this._pVertexDataDirty[TriangleSubGeometry.POSITION_DATA] = true;

			if (subGeometry.vertexNormals)
				this._pVertexDataDirty[TriangleSubGeometry.NORMAL_DATA] = true;

			if (subGeometry.vertexTangents)
				this._pVertexDataDirty[TriangleSubGeometry.TANGENT_DATA] = true;

			if (subGeometry.uvs)
				this._pVertexDataDirty[TriangleSubGeometry.UV_DATA] = true;

			if (subGeometry.secondaryUVs)
				this._pVertexDataDirty[TriangleSubGeometry.SECONDARY_UV_DATA] = true;

			if (subGeometry.jointIndices)
				this._pVertexDataDirty[TriangleSubGeometry.JOINT_INDEX_DATA] = true;

			if (subGeometry.jointWeights)
				this._pVertexDataDirty[TriangleSubGeometry.JOINT_WEIGHT_DATA] = true;

			switch(subGeometry.jointsPerVertex) {
				case 1:
					this.JOINT_INDEX_FORMAT = this.JOINT_WEIGHT_FORMAT = away.stagegl.ContextGLVertexBufferFormat.FLOAT_1;
					break;
				case 2:
					this.JOINT_INDEX_FORMAT = this.JOINT_WEIGHT_FORMAT = away.stagegl.ContextGLVertexBufferFormat.FLOAT_2;
					break;
				case 3:
					this.JOINT_INDEX_FORMAT = this.JOINT_WEIGHT_FORMAT = away.stagegl.ContextGLVertexBufferFormat.FLOAT_3;
					break;
				case 4:
					this.JOINT_INDEX_FORMAT = this.JOINT_WEIGHT_FORMAT = away.stagegl.ContextGLVertexBufferFormat.FLOAT_4;
					break;
				default:
			}

			return subGeometry;
		}

		/**
		 * //TODO
		 *
		 * @param pool
		 * @param materialOwner
		 * @param level
		 * @param indexOffset
		 * @returns {away.pool.TriangleSubMeshRenderable}
		 * @protected
		 */
		public _pGetOverflowRenderable(pool:RenderablePool, materialOwner:away.base.IMaterialOwner, level:number, indexOffset:number):RenderableBase
		{
			return new TriangleSubMeshRenderable(pool, <away.base.TriangleSubMesh> materialOwner, level, indexOffset);
		}
	}
}