///<reference path="../_definitions.ts"/>
/**
 * @module away.events
 */
module away.events
{
	//import flash.events.Event;

	export class ShadingMethodEvent extends away.events.Event
	{
		public static SHADER_INVALIDATED:string = "ShaderInvalidated";

		constructor(type:string)
		{

			super(type);

		}
	}
}
