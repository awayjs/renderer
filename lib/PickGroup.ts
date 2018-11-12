import {IAbstractionPool} from "@awayjs/core";

import {Viewport} from "@awayjs/stage";

import {IEntity} from "./base/IEntity";
import { PickEntity } from './base/PickEntity';
import { RaycastPicker } from './pick/RaycastPicker';
import { PartitionBase } from './partition/PartitionBase';
import { BoundsPicker } from './pick/BoundsPicker';
import { TabPicker } from './pick/TabPicker';

/**
 * @class away.pool.PickGroup
 */
export class PickGroup implements IAbstractionPool
{
	private static _instancePool:Object = new Object();
	private _viewport:Viewport;
	private _entityPool:Object = new Object();
	private _raycastPickerPool:RaycastPickerPool;
	private _boundsPickerPool:BoundsPickerPool;
	private _tabPickerPool:TabPickerPool;

	/**
	 * //TODO
	 *
	 * @param materialClassGL
	 */
	constructor(viewport:Viewport)
	{
		this._viewport = viewport;
		this._raycastPickerPool = new RaycastPickerPool(this);
		this._boundsPickerPool = new BoundsPickerPool(this);
		this._tabPickerPool = new TabPickerPool(this);
	}

	public static getInstance(viewport:Viewport):PickGroup
	{
		return this._instancePool[viewport.id] || (this._instancePool[viewport.id] = new PickGroup(viewport));

	}

	public getAbstraction(entity:IEntity):PickEntity
	{
		return this._entityPool[entity.id] || (this._entityPool[entity.id] = new PickEntity(this._viewport, entity, this));
	}

	/**
	 *
	 * @param entity
	 */
	public clearAbstraction(entity:IEntity):void
	{
		delete this._entityPool[entity.id];
	}

	public getRaycastPicker(partition:PartitionBase):RaycastPicker
	{
		return this._raycastPickerPool.getAbstraction(partition);
	}

	public getBoundsPicker(partition:PartitionBase):BoundsPicker
	{
		return this._boundsPickerPool.getAbstraction(partition);
	}
	
	public getTabPicker(partition:PartitionBase):TabPicker
	{
		return this._tabPickerPool.getAbstraction(partition);
	}
}

class RaycastPickerPool implements IAbstractionPool
{
	private _abstractionPool:Object = new Object();
	private _pickGroup:PickGroup;

	constructor(pickGroup:PickGroup)
	{
		this._pickGroup = pickGroup;
	}

	/**
	 * //TODO
	 *
	 * @param entity
	 * @returns EntityNode
	 */
	public getAbstraction(partition:PartitionBase):RaycastPicker
	{
		return (this._abstractionPool[partition.id] || (this._abstractionPool[partition.id] = new RaycastPicker(partition, this._pickGroup)));
	}

	/**
	 *
	 * @param entity
	 */
	public clearAbstraction(partition:PartitionBase):void
	{
		delete this._abstractionPool[partition.id];
	}
}


class BoundsPickerPool implements IAbstractionPool
{
	private _abstractionPool:Object = new Object();
	private _pickGroup:PickGroup;

	constructor(pickGroup:PickGroup)
	{
		this._pickGroup = pickGroup;
	}

	/**
	 * //TODO
	 *
	 * @param entity
	 * @returns EntityNode
	 */
	public getAbstraction(partition:PartitionBase):BoundsPicker
	{
		return (this._abstractionPool[partition.id] || (this._abstractionPool[partition.id] = new BoundsPicker(partition, this._pickGroup)));
	}

	/**
	 *
	 * @param entity
	 */
	public clearAbstraction(partition:PartitionBase):void
	{
		delete this._abstractionPool[partition.id];
	}
}


class TabPickerPool implements IAbstractionPool
{
	private _abstractionPool:Object = new Object();
	private _pickGroup:PickGroup;

	constructor(pickGroup:PickGroup)
	{
		this._pickGroup = pickGroup;
	}

	/**
	 * //TODO
	 *
	 * @param entity
	 * @returns EntityNode
	 */
	public getAbstraction(partition:PartitionBase):TabPicker
	{
		return (this._abstractionPool[partition.id] || (this._abstractionPool[partition.id] = new TabPicker(partition, this._pickGroup)));
	}

	/**
	 *
	 * @param entity
	 */
	public clearAbstraction(partition:PartitionBase):void
	{
		delete this._abstractionPool[partition.id];
	}
}