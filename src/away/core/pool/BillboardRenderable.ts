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
		private static _materialGeometry:Object = new Object();

		/**
		 *
		 */
		public static id:string = "billboard";

		/**
		 *
		 */
		private _billboard:away.entities.Billboard;

		/**
		 * //TODO
		 *
		 * @param pool
		 * @param billboard
		 */
		constructor(pool:RenderablePool, billboard:away.entities.Billboard)
		{
			super(pool, billboard, billboard);

			this._billboard = billboard;

			this._iFillIndexData(this._pGetSubGeometry(), 0);

			this.invalidateVertexData(away.base.TriangleSubGeometry.POSITION_DATA);
			this.invalidateVertexData(away.base.TriangleSubGeometry.NORMAL_DATA);
			this.invalidateVertexData(away.base.TriangleSubGeometry.TANGENT_DATA);
			this.invalidateVertexData(away.base.TriangleSubGeometry.UV_DATA);
		}

		/**
		 * //TODO
		 *
		 * @returns {away.base.TriangleSubGeometry}
		 */
		public _pGetSubGeometry():away.base.SubGeometryBase
		{
			var material:away.materials.IMaterial = this._billboard.material;

			var geometry:away.base.TriangleSubGeometry = BillboardRenderable._materialGeometry[material.id];

			if (!geometry) {
				geometry = BillboardRenderable._materialGeometry[material.id] = new away.base.TriangleSubGeometry(true);
				geometry.autoDeriveNormals = false;
				geometry.autoDeriveTangents = false;
				geometry.updateIndices(Array<number>(0, 1, 2, 0, 2, 3));
				geometry.updatePositions(Array<number>(0, material.height, 0, material.width, material.height, 0, material.width, 0, 0, 0, 0, 0));
				geometry.updateVertexNormals(Array<number>(1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0));
				geometry.updateVertexTangents(Array<number>(0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1));
				geometry.updateUVs(Array<number>(0, 0, 1, 0, 1, 1, 0, 1));
			} else {
				geometry.updatePositions(Array<number>(0, material.height, 0, material.width, material.height, 0, material.width, 0, 0, 0, 0, 0));
			}



			return geometry;
		}
	}
}