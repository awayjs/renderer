import { IAbstractionPool, IAbstractionClass } from '@awayjs/core';

import { IEntity } from '../base/IEntity';
import { BoundingVolumeBase } from './BoundingVolumeBase';
import { BoundingVolumeType } from './BoundingVolumeType';
import { BoundingBox } from './BoundingBox';
import { BoundingSphere } from './BoundingSphere';
import { NullBounds } from './NullBounds';
import { BoundsPicker } from '../pick/BoundsPicker';
import { IBoundsPicker } from '../pick/IBoundsPicker';

export class BoundingVolumePool implements IAbstractionPool
{
	private static _strokeDict:Object = {
		[BoundingVolumeType.BOX] : false,
		[BoundingVolumeType.BOX_FAST] : false,
		[BoundingVolumeType.BOX_BOUNDS] : true,
		[BoundingVolumeType.BOX_BOUNDS_FAST] : true,
		[BoundingVolumeType.SPHERE] : false,
		[BoundingVolumeType.SPHERE_FAST] : false,
		[BoundingVolumeType.SPHERE_BOUNDS] : true,
		[BoundingVolumeType.SPHERE_FAST] : true,
		[BoundingVolumeType.NULL] : false
	}

	private static _fastDict:Object = {
		[BoundingVolumeType.BOX] : false,
		[BoundingVolumeType.BOX_FAST] : true,
		[BoundingVolumeType.BOX_BOUNDS] : false,
		[BoundingVolumeType.BOX_BOUNDS_FAST] : true,
		[BoundingVolumeType.SPHERE] : false,
		[BoundingVolumeType.SPHERE_FAST] : true,
		[BoundingVolumeType.SPHERE_BOUNDS] : false,
		[BoundingVolumeType.SPHERE_FAST] : true,
		[BoundingVolumeType.NULL] : false
	}
	
	private static _boundsDict:Object = {
		[BoundingVolumeType.BOX] : BoundingBox,
		[BoundingVolumeType.BOX_FAST] : BoundingBox,
		[BoundingVolumeType.BOX_BOUNDS] : BoundingBox,
		[BoundingVolumeType.BOX_BOUNDS_FAST] : BoundingBox,
		[BoundingVolumeType.SPHERE] : BoundingSphere,
		[BoundingVolumeType.SPHERE_FAST] : BoundingSphere,
		[BoundingVolumeType.SPHERE_BOUNDS] : BoundingSphere,
		[BoundingVolumeType.SPHERE_FAST] : BoundingSphere,
		[BoundingVolumeType.NULL] : NullBounds
	}

	private _boundingVolumePool:Object = new Object();
	private _picker:IBoundsPicker;
	private _strokeFlag:boolean;
	private _fastFlag:boolean;
	private _boundingVolumeClass:IAbstractionClass;

	public get picker():IBoundsPicker
	{
		return this._picker;
	}

	public get strokeFlag():boolean
	{
		return this._strokeFlag;
	}
	
	public get fastFlag():boolean
	{
		return this._fastFlag;
	}

	constructor(picker:IBoundsPicker, boundingVolumeType:BoundingVolumeType)
	{
		this._picker = picker;
		this._strokeFlag = BoundingVolumePool._strokeDict[boundingVolumeType];
		this._fastFlag = BoundingVolumePool._fastDict[boundingVolumeType];
		this._boundingVolumeClass = BoundingVolumePool._boundsDict[boundingVolumeType];
	}

	public getAbstraction(entity:IEntity):BoundingVolumeBase
	{
		var id:number = entity? entity.id : -1;
		return (this._boundingVolumePool[id] || (this._boundingVolumePool[id] = new (<IAbstractionClass> this._boundingVolumeClass)(entity, this)));
	}

	public clearAbstraction(entity:IEntity):void
	{
		delete this._boundingVolumePool[entity? entity.id : -1];
	}

	public dispose():void
	{
		for (var key in this._boundingVolumePool)
			this._boundingVolumePool[key].onClear(null);
	}
}