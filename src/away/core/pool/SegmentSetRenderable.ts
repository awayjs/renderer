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
		constructor(segmentSet:away.entities.SegmentSet)
		{
			super(segmentSet, segmentSet, segmentSet.subGeometry, null);
		}
	}
}