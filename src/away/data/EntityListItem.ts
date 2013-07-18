/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

///<reference path="../_definitions.ts"/>

module away.data
{
	export class EntityListItem
	{
		
		public entity:away.entities.Entity;
		public next:away.data.EntityListItem;
		
		constructor()
		{
			
		}
	}
}