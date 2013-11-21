///<reference path="../../_definitions.ts"/>

module away.sort
{
	export interface IEntitySorter
	{
		sort(collector:away.traverse.EntityCollector);
	}
}