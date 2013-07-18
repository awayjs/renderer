/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

module away.data
{
	export class RenderableListItemPool
	{
		
		private _pool:away.data.RenderableListItem[];
		private _index:number;
		private _poolSize:number;
		
		constructor()
		{
			this._pool = [];
		}
		
		public getItem():away.data.RenderableListItem
		{
			if( this._index == this._poolSize )
			{
				var item:away.data.RenderableListItem = new away.data.RenderableListItem();
				this._pool[this._index++] = item;
				++this._poolSize;
				return item;
			} else
			{
				return this._pool[_index++];
			}
		}
	}
}