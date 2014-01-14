///<reference path="../../_definitions.ts"/>

/**
 * @module away.sort
 */
module away.sort
{
	/**
	 * @interface away.sort.IEntitySorter
	 */
	export interface IEntitySorter
	{
		sort(collector:away.traverse.EntityCollector);
	}
}