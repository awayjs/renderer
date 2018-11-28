import {Plane3D, Vector3D, AbstractMethodError, AbstractionBase, AssetEvent, TransformEvent} from "@awayjs/core";

import {IEntity} from "../base/IEntity";

import { BoundsPickerEvent } from '../events/BoundsPickerEvent';

import { BoundingVolumePool } from './BoundingVolumePool';
import { IBoundsPicker } from '../pick/IBoundsPicker';

export class BoundingVolumeBase extends AbstractionBase
{
	private _onInvalidateBoundsDelegate:(event:BoundsPickerEvent) => void;
	private _onInvalidateMatrix3DDelegate:(event:TransformEvent) => void;

	protected _targetCoordinateSpace:IEntity;
	protected _picker:IBoundsPicker;
	protected _strokeFlag:boolean;
	protected _fastFlag:boolean;
	//protected _boundsPrimitive:Sprite;

	constructor(asset:IEntity, pool:BoundingVolumePool)
	{
		super(asset, pool);

		this._targetCoordinateSpace = asset;
		this._picker = pool.picker;
		this._strokeFlag = pool.strokeFlag;
		this._fastFlag = pool.fastFlag;

		this._onInvalidateBoundsDelegate = (event:BoundsPickerEvent) => this._onInvalidateBounds(event);
		this._onInvalidateMatrix3DDelegate = (event:TransformEvent) => this._onInvalidateMatrix3D(event);

		this._picker.addEventListener(BoundsPickerEvent.INVALIDATE_BOUNDS, this._onInvalidateBoundsDelegate);

		if (this._targetCoordinateSpace) {
			var targetEntity:IEntity = this._picker.entity;
			while (targetEntity && targetEntity != this._targetCoordinateSpace.parent) {
				targetEntity.transform.addEventListener(TransformEvent.INVALIDATE_MATRIX3D, this._onInvalidateMatrix3DDelegate);
				targetEntity = targetEntity.parent;
			}

			if (!targetEntity) //case when targetCoordinateSpace is not part of the same displaylist ancestry
				this._targetCoordinateSpace.transform.addEventListener(TransformEvent.INVALIDATE_CONCATENATED_MATRIX3D, this._onInvalidateMatrix3DDelegate);
		}
	}

	public _onInvalidateBounds(event:BoundsPickerEvent):void
	{
		this._invalid = true;
	}
	
	public _onInvalidateMatrix3D(event:TransformEvent):void
	{
		this._invalid = true;
	}
	
	public onClear(event:AssetEvent):void
	{
		super.onClear(event);

		this._picker.addEventListener(BoundsPickerEvent.INVALIDATE_BOUNDS, this._onInvalidateBoundsDelegate);
		
		if (this._targetCoordinateSpace) {
			var targetEntity:IEntity = this._picker.entity;
			while (targetEntity && targetEntity != this._targetCoordinateSpace.parent) {
				targetEntity.transform.removeEventListener(TransformEvent.INVALIDATE_MATRIX3D, this._onInvalidateMatrix3DDelegate);
				targetEntity = targetEntity.parent;
			}

			if (!targetEntity) //case when targetCoordinateSpace is not part of the same displaylist ancestry
				this._targetCoordinateSpace.transform.removeEventListener(TransformEvent.INVALIDATE_CONCATENATED_MATRIX3D, this._onInvalidateMatrix3DDelegate);
		}
		
		this._targetCoordinateSpace = null;
		this._picker = null;
		//this._boundsPrimitive = null;
	}

	// public get boundsPrimitive():DisplayObject
	// {
	// 	if (this._boundsPrimitive == null) {
	// 		this._boundsPrimitive = this._createBoundsPrimitive();

	// 		this._invalid = true;
	// 	}

	// 	if(this._invalid)
	// 		this._update();

	// 	this._boundsPrimitive.transform.matrix3D = this._boundingEntity.transform.concatenatedMatrix3D;
		
	// 	return this._boundsPrimitive;
	// }

	public nullify():void
	{
		throw new AbstractMethodError();
	}

	public isInFrustum(planes:Array<Plane3D>, numPlanes:number):boolean
	{
		throw new AbstractMethodError();
	}

	public clone():BoundingVolumeBase
	{
		throw new AbstractMethodError();
	}

	public rayIntersection(position:Vector3D, direction:Vector3D, targetNormal:Vector3D):number
	{
		return -1;
	}

	public classifyToPlane(plane:Plane3D):number
	{
		throw new AbstractMethodError();
	}

	public _update():void
	{
		this._invalid = false;
	}

	// public _createBoundsPrimitive():Sprite
	// {
	// 	throw new AbstractMethodError();
	// }
}