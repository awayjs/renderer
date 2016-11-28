import {EventBase} from "@awayjs/core";

import {RTTBufferManager} from "../managers/RTTBufferManager";

export class RTTEvent extends EventBase
{
	/**
	 *
	 */
	public static RESIZE:string = "rttManagerResize";

	private _rttManager:RTTBufferManager;

	/**
	 *
	 */
	public get rttManager():RTTBufferManager
	{
		return this._rttManager;
	}

	constructor(type:string, rttManager:RTTBufferManager)
	{
		super(type);

		this._rttManager = rttManager;
	}

	/**
	 *
	 */
	public clone():RTTEvent
	{
		return new RTTEvent(this.type, this._rttManager);
	}
}