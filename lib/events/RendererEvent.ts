import {EventBase}				from "@awayjs/core/lib/events/EventBase";

export class RendererEvent extends EventBase
{
	public static VIEWPORT_UPDATED:string = "viewportUpdated";
	public static SCISSOR_UPDATED:string = "scissorUpdated";

	constructor(type:string)
	{
		super(type);
	}
}