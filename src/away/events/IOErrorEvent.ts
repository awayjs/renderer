///<reference path="Event.ts" />

module away.events
{	
	export class IOErrorEvent extends away.events.Event
	{

        public static IO_ERROR: string = "IOErrorEvent_IO_ERROR";

		constructor( type : string )
		{
			super(type);

		}
	}
}