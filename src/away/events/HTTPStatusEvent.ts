///<reference path="Event.ts" />

module away.events
{	
	export class HTTPStatusEvent extends away.events.Event
	{
		
		//public static INITIALIZE_SUCCESS: string = "initializeSuccess";
		//public static INITIALIZE_FAILED: string = "initializeFailed";

        public static HTTP_STATUS: string = "HTTPStatusEvent_HTTP_STATUS";

        public status : number;
		
		constructor(type : string , status : number = null )
		{
			super(type);

            this.status = status;

		}
	}
}