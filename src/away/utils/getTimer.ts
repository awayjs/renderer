///<reference path="../_definitions.ts"/>

module away.utils
{


	//[native(cls="TimerClass", gc="exact", instance="TimerObject", methods="auto")]
	//[Event(name="timerComplete", type="flash.events.TimerEvent")]
	//[Event(name="timer", type="flash.events.TimerEvent")]

	export function getTimer():number
	{

		// number milliseconds of 1970/01/01
		// this different to AS3 implementation which gets the number of milliseconds
		// since instance of Flash player was initialised

		return Date.now();//new Date().getTime();

	}
}
