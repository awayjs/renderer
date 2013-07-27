/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

///<reference path="../_definitions.ts"/>

module away.data
{
	export class EntityListItemPool
	{
		
		private _pool:away.data.EntityListItem[];
		private _index:number = 0;
		private _poolSize:number = 0;
		
		constructor()
		{
			this._pool = [];
		}
		
		public getItem():away.data.EntityListItem
		{
			var item:away.data.EntityListItem;
			if( this._index == this._poolSize )
			{
				item = new away.data.EntityListItem();
				this._pool[this._index++] = item;
				++this._poolSize;
			}
			else
			{
				item = this._pool[this._index++];
			}
			return item;
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