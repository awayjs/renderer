///<reference path="../../_definitions.ts"/>

/**
 * @module away.pool
 */
module away.pool
{
	import LineSubGeometry				= away.base.LineSubGeometry;
	import SubGeometryEvent				= away.events.SubGeometryEvent;
	
	/**
	 * @class away.pool.LineSubMeshRenderable
	 */
	export class LineSubMeshRenderable extends RenderableBase
	{
		/**
		 *
		 */
		public static id:string = "linesubmesh";

		/**
		 *
		 */
		public subMesh:away.base.LineSubMesh;

		/**
		 * //TODO
		 *
		 * @param pool
		 * @param subMesh
		 * @param level
		 * @param dataOffset
		 */
		constructor(pool:RenderablePool, subMesh:away.base.LineSubMesh, level:number = 0, indexOffset:number = 0)
		{
			super(pool, subMesh.parentMesh, subMesh, level, indexOffset);

			this.subMesh = subMesh;
		}

		/**
		 * //TODO
		 *
		 * @returns {base.LineSubGeometry}
		 * @protected
		 */
		public _pGetSubGeometry():LineSubGeometry
		{
			var subGeometry:LineSubGeometry = this.subMesh.subGeometry;

			this._pVertexDataDirty[LineSubGeometry.START_POSITION_DATA] = true;
			this._pVertexDataDirty[LineSubGeometry.END_POSITION_DATA] = true;

			if (subGeometry.thickness)
				this._pVertexDataDirty[LineSubGeometry.THICKNESS_DATA] = true;

			if (subGeometry.startColors)
				this._pVertexDataDirty[LineSubGeometry.COLOR_DATA] = true;

			return subGeometry;
		}

		/**
		 * //TODO
		 *
		 * @param pool
		 * @param materialOwner
		 * @param level
		 * @param indexOffset
		 * @returns {away.pool.LineSubMeshRenderable}
		 * @private
		 */
		public _pGetOverflowRenderable(pool:RenderablePool, materialOwner:away.base.IMaterialOwner, level:number, indexOffset:number):RenderableBase
		{
			return new LineSubMeshRenderable(pool, <away.base.LineSubMesh> materialOwner, level, indexOffset);
		}
	}
}