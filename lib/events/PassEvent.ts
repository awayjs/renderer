import {EventBase} from "@awayjs/core";

import {IPass} from "../materials/passes/IPass";

export class PassEvent extends EventBase
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