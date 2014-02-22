///<reference path="../../_definitions.ts"/>

/**
 * @module away.pool
 */
module away.pool
{
	/**
	 * @class away.pool.SegmentSetRenderablePool
	 */
	export class SegmentSetRenderablePool
	{
		private _pool:Object = new Object();

		public getItem(segmentSet:away.entities.SegmentSet):SegmentSetRenderable
		{
			return <SegmentSetRenderable> (this._pool[segmentSet.id] || (this._pool[segmentSet.id] = new SegmentSetRenderable(segmentSet)))
		}

		public dispose(segmentSet:away.entities.Billboard)
		{
			this._pool[segmentSet.id] = null;
		}

		public disposeAll()
		{
			this._pool = new Object();
		}
	}
}