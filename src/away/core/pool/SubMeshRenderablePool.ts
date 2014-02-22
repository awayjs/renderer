///<reference path="../../_definitions.ts"/>

/**
 * @module away.pool
 */
module away.pool
{
	/**
	 * @class away.pool.SubMeshRenderablePool
	 */
	export class SubMeshRenderablePool
	{
		private _pool:Object = new Object();

		public getItem(subMesh:away.base.SubMesh):SubMeshRenderable
		{
			return <SubMeshRenderable> (this._pool[subMesh.id] || (this._pool[subMesh.id] = new SubMeshRenderable(subMesh)));
		}

		public dispose(subMesh:away.base.SubMesh)
		{
			this._pool[subMesh.id] = null;
		}

		public disposeAll()
		{
			this._pool = new Object();
		}
	}
}