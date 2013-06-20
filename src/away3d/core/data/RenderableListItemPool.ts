/// <reference path="RenderableListItem.ts" />
module away3d.core.data
{
	export class RenderableListItemPool
	{
		private _pool : away3d.core.data.RenderableListItem[];
		private _index : number;//int
		private _poolSize : number;//int

		constructor()
		{
			this._pool = new Array<away3d.core.data.RenderableListItem>();
		}

		public getItem() : RenderableListItem
		{
			if (this._index == this._poolSize) {
				var item : RenderableListItem = new RenderableListItem();
                this._pool[this._index++] = item;
				++this._poolSize;
				return item;
			}
			else return this._pool[this._index++];
		}

		public freeAll() : void
		{
            this._index = 0;
		}

		public dispose() : void
		{
            this._pool.length = 0;
		}
	}
}

