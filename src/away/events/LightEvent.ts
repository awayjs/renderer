///<reference path="../_definitions.ts" />

/**
 * @module away.events
 */
module away.events
{
	export class LightEvent extends away.events.Event
	{

		public static CASTS_SHADOW_CHANGE:string = "castsShadowChange";

		constructor(type:string)
		{
			super(type);
		}

		//@override
		public clone():away.events.Event
		{
			return new away.events.LightEvent(this.type);
		}
	}
}