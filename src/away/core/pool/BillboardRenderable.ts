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

		public static id:string = "billboard";

		private _billboard:away.entities.Billboard;

		constructor(pool:RenderablePool, billboard:away.entities.Billboard)
		{
			super(pool, billboard, billboard, null, null);

			this._billboard = billboard;

			this.subGeometry = this.getGeometry(billboard.material);
		}

		/**
		 *
		 */
		public _iUpdate()
		{
			var material:away.materials.IMaterial = this._billboard.material;

			this.getGeometry(material).updateVertexData(Array<number>(0, material.height, 0, material.width, material.height, 0, material.width, 0, 0, 0, 0, 0));
		}

		private getGeometry(material:away.materials.IMaterial):away.base.SubGeometry
		{
			var geometry:away.base.SubGeometry = BillboardRenderable._materialGeometry[material.id];

			if (!geometry) {
				geometry = BillboardRenderable._materialGeometry[material.id] = new away.base.SubGeometry();
				geometry.updateVertexData(Array<number>(0, material.height, 0, material.width, material.height, 0, material.width, 0, 0, 0, 0, 0));
				geometry.updateUVData(Array<number>(0, 0, 1, 0, 1, 1, 0, 1));
				geometry.updateIndexData(Array<number>(0, 1, 2, 0, 2, 3));
				geometry.updateVertexTangentData(Array<number>(1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0));
				geometry.updateVertexNormalData(Array<number>(0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1));
			}

			return geometry;
		}
	}
}