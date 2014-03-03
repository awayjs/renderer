///<reference path="../../_definitions.ts"/>

/**
 * @module away.pool
 */
module away.pool
{
	/**
	 * @class away.pool.RenderableListItem
	 */
	export class SegmentSetRenderable extends RenderableBase
	{
		constructor(pool:RenderablePool, segmentSet:away.entities.SegmentSet)
		{
			super(pool, segmentSet, segmentSet, segmentSet.subGeometry, null);
		}
	}
}