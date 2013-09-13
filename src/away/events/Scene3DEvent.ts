/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

///<reference path="../_definitions.ts"/>

/**
 * @module away.events
 */
module away.events 
{
	
	export class Scene3DEvent extends away.events.Event
	{
		public static ADDED_TO_SCENE:string = "addedToScene";
		public static REMOVED_FROM_SCENE:string = "removedFromScene";
		public static PARTITION_CHANGED:string = "partitionChanged";
		
		public objectContainer3D:away.containers.ObjectContainer3D;
		
		constructor( type:string, objectContainer:away.containers.ObjectContainer3D )
		{
			this.objectContainer3D = objectContainer;
			super( type );
		}
		
		//@override
		public get target():Object
		{
			return this.objectContainer3D;
		}
	}
}