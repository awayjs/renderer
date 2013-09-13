
///<reference path="../_definitions.ts"/>

/**
 * @module away.events
 */
module away.events
{
	//import flash.events.Event;
	
	export class Stage3DEvent extends Event
	{
		public static CONTEXT3D_CREATED:string = "Context3DCreated";
		public static CONTEXT3D_DISPOSED:string = "Context3DDisposed";
		public static CONTEXT3D_RECREATED:string = "Context3DRecreated";
		public static VIEWPORT_UPDATED:string = "ViewportUpdated";
		
		constructor(type:string )//, bubbles:boolean = false, cancelable:boolean = false)
		{
			super( type );//, bubbles, cancelable);
		}
	}
}
