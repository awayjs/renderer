///<reference path="../_definitions.ts"/>

/**
 * @module away.events
 */
module away.events
{
	export class TimerEvent extends away.events.Event
	{

		public static TIMER:string = "timer";
		public static TIMER_COMPLETE:string = "timerComplete";

		constructor(type:string)
		{
			super(type);

		}
	}
}