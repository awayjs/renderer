import {EventBase} from "@awayjs/core";

import { IBoundsPicker } from '../pick/IBoundsPicker';

export class BoundsPickerEvent extends EventBase
{
	private _boundsPicker:IBoundsPicker;


	/**
	 *
	 */
	public static INVALIDATE_BOUNDS:string = "invalidateBounds";

	public get boundsPicker():IBoundsPicker
	{
		return this._boundsPicker;
	}

	constructor(type:string, boundsPicker:IBoundsPicker)
	{
		super(type);

		this._boundsPicker = boundsPicker;
	}

	/**
	 * Clones the event.
	 * @return An exact duplicate of the current object.
	 */
	public clone():BoundsPickerEvent
	{
		return new BoundsPickerEvent(this.type, this._boundsPicker);
	}
}