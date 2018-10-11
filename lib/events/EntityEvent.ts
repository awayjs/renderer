import {EventBase} from "@awayjs/core";

import {IEntity} from "../base/IEntity";

export class EntityEvent extends EventBase
{
	private _entity:IEntity;


	/**
	 *
	 */
	public static INVALIDATE_BOUNDS:string = "invalidateBounds";

	public get entity():IEntity
	{
		return this._entity;
	}

	constructor(type:string, entity:IEntity)
	{
		super(type);

		this._entity = entity;
	}

	/**
	 * Clones the event.
	 * @return An exact duplicate of the current object.
	 */
	public clone():EntityEvent
	{
		return new EntityEvent(this.type, this._entity);
	}
}