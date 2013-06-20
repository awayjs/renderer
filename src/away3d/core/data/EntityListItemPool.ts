/// <reference path="EntityListItem.ts" />
module away3d.core.data
{
	export class EntityListItemPool
	{
		private _pool : away3d.core.data.EntityListItem[];
		private _index : number;
		private _poolSize : number;

		constructor()
		{
			this._pool = new Array<away3d.core.data.EntityListItem>();
		}

		public getItem() : away3d.core.data.EntityListItem
		{
			var item:away3d.core.data.EntityListItem;

			if (this._index == this._poolSize) {

				item = new EntityListItem();
				this._pool[this._index++] = item;

				++this._poolSize;
			}
			else item = this._pool[this._index++];

			return item;
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
