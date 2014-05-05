///<reference path="../../_definitions.ts"/>

/**
 * @module away.base
 */
module away.pool
{
	/**
	 *
	 */
	export class IndexDataPool
	{
		private static _pool:Object = new Object();

		constructor()
		{
		}

		public static getItem(subGeometry:away.base.SubGeometryBase, level:number, indexOffset:number):away.pool.IndexData
		{
			var subGeometryData:Array<IndexData> = <Array<IndexData>> (IndexDataPool._pool[subGeometry.id] || (IndexDataPool._pool[subGeometry.id] = new Array<IndexData>()));

			var indexData:IndexData = subGeometryData[level] || (subGeometryData[level] = new IndexData(level));
			indexData.updateData(indexOffset, subGeometry.indices, subGeometry.numVertices);

			return indexData;
		}

		public static disposeItem(id:number, level:number)
		{
			var subGeometryData:Array<IndexData> = <Array<IndexData>> this._pool[id];

			subGeometryData[level].dispose();
			subGeometryData[level] = null;
		}

		public disposeData(id:number)
		{
			var subGeometryData:Array<IndexData> = <Array<IndexData>> IndexDataPool._pool[id];

			var len:number = subGeometryData.length;
			for (var i:number = 0; i < len; i++) {
				subGeometryData[i].dispose();
				subGeometryData[i] = null;
			}

			IndexDataPool._pool[id] = null;
		}
	}
}