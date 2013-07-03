///<reference path="Event.ts" />

module away.events
{	
	export class IOErrorEvent extends away.events.Event
	{
		
		//public static INITIALIZE_SUCCESS: string = "initializeSuccess";
		//public static INITIALIZE_FAILED: string = "initializeFailed";

        public static IO_ERROR: string = "IOErrorEvent_IO_ERROR";

		
		constructor( type : string )
		{
			super(type);

		}
	}
}