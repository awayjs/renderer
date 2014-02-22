///<reference path="../../_definitions.ts"/>

/**
 * @module away.pool
 */
module away.pool
{
	/**
	 * @class away.pool.BillboardRenderablePool
	 */
	export class BillboardRenderablePool
	{
		private _pool:Object = new Object();

		public getItem(billboard:away.entities.Billboard):BillboardRenderable
		{
			return <BillboardRenderable> (this._pool[billboard.id] || (this._pool[billboard.id] = new BillboardRenderable(billboard)))
		}

		public dispose(billboard:away.entities.Billboard)
		{
			this._pool[billboard.id] = null;
		}

		public disposeAll()
		{
			this._pool = new Object();
		}
	}
}