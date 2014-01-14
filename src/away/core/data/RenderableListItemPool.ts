///<reference path="../../_definitions.ts"/>

/**
 * @module away.data
 */
module away.data
{
	/**
	 * @class away.data.RenderableListItemPool
	 */
	export class RenderableListItemPool
	{

		private _pool:RenderableListItem[];
		private _index:number = 0;
		private _poolSize:number = 0;

		constructor()
		{
			this._pool = [];
		}

		public getItem():RenderableListItem
		{
			if (this._index == this._poolSize) {
				var item:RenderableListItem = new RenderableListItem();
				this._pool[this._index++] = item;
				++this._poolSize;
				return item;
			} else {
				return this._pool[this._index++];
			}
		}

		public freeAll()
		{
			this._index = 0;
		}

		public dispose()
		{
			this._pool.length = 0;
		}
	}
}