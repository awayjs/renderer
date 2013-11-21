///<reference path="../_definitions.ts"/>

module away.events
{
	/**
	 * @class away.events.HTTPStatusEvent
	 */
	export class HTTPStatusEvent extends away.events.Event
	{

		public static HTTP_STATUS:string = "HTTPStatusEvent_HTTP_STATUS";

		public status:number;

		constructor(type:string, status:number = null)
		{
			super(type);

			this.status = status;

		}
	}
}