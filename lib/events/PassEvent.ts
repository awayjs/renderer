import EventBase				= require("awayjs-core/lib/events/EventBase");

import IPass					= require("awayjs-renderergl/lib/render/passes/IPass");

class PassEvent extends EventBase
{
	/**
	 *
	 */
	public static INVALIDATE:string = "invalidatePass";

	private _pass:IPass;

	/**
	 *
	 */
	public get pass():IPass
	{
		return this._pass;
	}

	constructor(type:string, pass:IPass)
	{
		super(type);

		this._pass = pass;
	}

	/**
	 *
	 */
	public clone():PassEvent
	{
		return new PassEvent(this.type, this._pass);
	}
}

export = PassEvent;