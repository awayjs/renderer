///<reference path="../_definitions.ts"/>

/**
 * @module away.events
 */
module away.events
{
	export class ProgressEvent extends away.events.Event
	{

		public static PROGRESS:string = "ProgressEvent_progress";

		public bytesLoaded:number;
		public bytesTotal:number;

		constructor(type:string)
		{
			super(type);

		}
	}
}