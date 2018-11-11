import {IAssetClass, IAbstractionPool, Matrix3D, Box, Vector3D, Sphere, AbstractionBase, Point, AssetEvent} from "@awayjs/core";

import {Viewport} from "@awayjs/stage";

import {IEntity} from "./IEntity";

import { IPickable } from './IPickable';
import { PickGroup } from '../PickGroup';
import { _Pick_PickableBase } from './_Pick_PickableBase';
import { _IPick_PickableClass } from './_IPick_PickableClass';
import { IPicker } from '../pick/IPicker';
import { PickingCollision } from '../pick/PickingCollision';
import { BoundingVolumePool } from '../bounds/BoundingVolumePool';
import { BoundingVolumeBase } from '../bounds/BoundingVolumeBase';
import { BoundingVolumeType } from '../bounds/BoundingVolumeType';
import { IBoundsPicker } from '../pick/IBoundsPicker';
import { BoundsPickerEvent } from '../events/BoundsPickerEvent';

/**
 * @class away.pool.PickEntity
 */
export class PickEntity extends AbstractionBase implements IAbstractionPool, IPicker, IBoundsPicker
{	
	private _boundingVolumePools:Object = new Object();

	private _pickingCollision:PickingCollision;

	private _orientedBoxBounds:Box[] = [];
	private _orientedBoxBoundsDirty:boolean[] = [true, true];
	private _orientedSphereBounds:Sphere[] = [];
	private _orientedSphereBoundsDirty:boolean[] = [true, true];

	private static _pickPickableClassPool:Object = new Object();

	private _pickablePool:Object = new Object();
	private _pickables:_Pick_PickableBase[] = [];
	private _viewport:Viewport;
	private _entity:IEntity;
	private _pickGroup:PickGroup;

    public get pickingCollision():PickingCollision
    {
        return this._pickingCollision;
	}

    /**
     *
     * @returns {IEntity}
     */
    public get viewport():Viewport
    {
        return this._viewport;
	}
	
    /**
     *
     * @returns {IEntity}
     */
    public get entity():IEntity
    {
        return this._entity;
    }

    /**
     *
     * @returns {IEntity}
     */
    public get pickGroup():PickGroup
    {
        return this._pickGroup;
    }

	public shapeFlag:boolean = false;

	/**
	 * //TODO
	 *
	 * @param materialClassGL
	 */
	constructor(viewport:Viewport, entity:IEntity, pickGroup:PickGroup)
	{
		super(entity, pickGroup);

        this._viewport = viewport;
		this._entity = entity;
		this._pickGroup = pickGroup;
		this._pickingCollision = new PickingCollision(this._entity);
	}

	
	public getBoundingVolume(targetCoordinateSpace:IEntity = null, boundingVolumeType:BoundingVolumeType = null):BoundingVolumeBase
	{
		if (boundingVolumeType == null)
			boundingVolumeType = this._entity.defaultBoundingVolume;
			
		var pool:BoundingVolumePool = (this._boundingVolumePools[boundingVolumeType] || (this._boundingVolumePools[boundingVolumeType] = new BoundingVolumePool(this, boundingVolumeType)));
	
		return <BoundingVolumeBase> pool.getAbstraction(targetCoordinateSpace);
	}
	
	/**
	 * Evaluates the display object to see if it overlaps or intersects with the
	 * point specified by the <code>x</code> and <code>y</code> parameters. The
	 * <code>x</code> and <code>y</code> parameters specify a point in the
	 * coordinate space of the Scene, not the display object container that
	 * contains the display object(unless that display object container is the
	 * Scene).
	 *
	 * @param x         The <i>x</i> coordinate to test against this object.
	 * @param y         The <i>y</i> coordinate to test against this object.
	 * @param shapeFlag Whether to check against the actual pixels of the object
	 *                 (<code>true</code>) or the bounding box
	 *                 (<code>false</code>).
	 * @param maskFlag Whether to check against the object when it is used as mask
	 *                 (<code>false</code>).
	 * @return <code>true</code> if the display object overlaps or intersects
	 *         with the specified point; <code>false</code> otherwise.
	 */
	public hitTestPoint(x:number, y:number, shapeFlag:boolean = false):boolean
	{
		return this._hitTestPointInternal(this._entity, x, y, shapeFlag, false);
	}

	public _hitTestPointInternal(rootEntity:IEntity, x:number, y:number, shapeFlag:boolean = false, maskFlag:boolean = false):boolean
	{
		if(this._entity.maskId != -1 && (!maskFlag || !shapeFlag))//allow masks for bounds hit tests
			return false;

		if (this._invalid)
			this._update();

		//set local tempPoint for later reference
		var tempPoint:Point = new Point(x,y);
		this._entity.globalToLocal(tempPoint, tempPoint);

		//early out for box test
		var box:Box = this._getBoxBoundsInternal(this._entity, false, true);

		if(box == null || !box.contains(tempPoint.x, tempPoint.y, 0))
			return false;

		//early out for non-shape tests
		if (!shapeFlag || this._entity.assetType=="[asset TextField]" || this._entity.assetType=="[asset Billboard]")
			return true;

		var len:number = this._pickables.length;
		var shapeHit:boolean = false;
		for (var i:number = 0; i < len; i++) {
			if (this._pickables[i].hitTestPoint(tempPoint.x, tempPoint.y, 0)) {
				shapeHit = true;
				break;
			}
		}

		if (!shapeHit)
			return false;

		//do the mask thang
		var maskOwners:Array<IEntity> = this._entity.maskOwners;
		if (maskOwners) {
			var numOwners:number = maskOwners.length;
			var entity:IEntity;
			var masks:Array<IEntity>;
			var numMasks:number;
			var maskHit:boolean;
			for (var i:number = 0; i < numOwners; i++) {
				entity = maskOwners[i];
				if (!entity.isDescendant(rootEntity))
					continue;

				masks = entity.masks;
				numMasks = masks.length;
				maskHit = false;
				for (var j:number = 0; j < numMasks; j++) {
					entity = masks[j];
					if (!entity.isDescendant(rootEntity))
						continue;

					// todo: figure out why a mask can be null here!
					if (entity && this._pickGroup.getBoundsPicker(entity.partition)._hitTestPointInternal(rootEntity, x, y, shapeFlag, true)) {
						maskHit = true;
						break;
					}
				}

				if (!maskHit)
					return false;
			}
		}

		return true;
	}

	/**
	 * @inheritDoc
	 */
	public isIntersectingRay(globalRayPosition:Vector3D, globalRayDirection:Vector3D):boolean
	{
		return this._isIntersectingRayInternal(this._entity, globalRayPosition, globalRayDirection);
	}
	
	/**
	 * @inheritDoc
	 */
	public _isIntersectingRayInternal(rootEntity:IEntity, globalRayPosition:Vector3D, globalRayDirection:Vector3D):boolean
	{
		this._pickingCollision.rayPosition = this._entity.transform.inverseConcatenatedMatrix3D.transformVector(globalRayPosition, this._pickingCollision.rayPosition);
		this._pickingCollision.rayDirection = this._entity.transform.inverseConcatenatedMatrix3D.deltaTransformVector(globalRayDirection, this._pickingCollision.rayDirection);
		this._pickingCollision.normal = this._pickingCollision.normal || new Vector3D();

		//early out for bounds test
		var rayEntryDistance:number = this.getBoundingVolume().rayIntersection(this._pickingCollision.rayPosition, this._pickingCollision.rayDirection, this._pickingCollision.normal);

		//check masks
		if (rayEntryDistance < 0 || !this._isIntersectingMasks(rootEntity, globalRayPosition, globalRayDirection))
			return false;

		this._pickingCollision.rayEntryDistance = rayEntryDistance;
		this._pickingCollision.globalRayPosition = globalRayPosition;
		this._pickingCollision.globalRayDirection = globalRayDirection;
		this._pickingCollision.rayOriginIsInsideBounds = rayEntryDistance == 0;

		return true;
	}

	public isIntersectingShape(findClosestCollision:boolean):boolean
	{
		var shapeHit:boolean = false;
		for (var i:number = 0; i < this._pickables.length; i++) {
			if (this._pickables[i].testCollision(this._pickingCollision, findClosestCollision)) {
				if (findClosestCollision)
					return true;
				else
					shapeHit = true;
			}
		}

		return shapeHit;
	}

	public getBoxBounds(targetCoordinateSpace:IEntity = null, strokeFlag:boolean = false, fastFlag:boolean = false):Box
	{
		return this._getBoxBoundsInternal(targetCoordinateSpace? targetCoordinateSpace.parent : this._entity, strokeFlag, fastFlag);
	}

	public _getBoxBoundsInternal(parentCoordinateSpace:IEntity, strokeFlag:boolean = true, fastFlag:boolean = true, cache:Box = null, target:Box = null):Box
	{
		if (this._invalid)
			this._update();
		
		var matrix3D:Matrix3D;

		if (parentCoordinateSpace == this._entity.parent) {
			matrix3D = this._entity.transform.matrix3D;

			//TODO: move _registrationMatrix3D to only affect collectables
			if (this._entity._registrationMatrix3D)
				matrix3D.prepend(this._entity._registrationMatrix3D);
		} else if (parentCoordinateSpace != this._entity) {
			if (parentCoordinateSpace) {
				matrix3D = this._entity.transform.concatenatedMatrix3D.clone();
				matrix3D.append(parentCoordinateSpace.transform.inverseConcatenatedMatrix3D);
			} else {
				matrix3D = this._entity.transform.concatenatedMatrix3D;
			}
		}

		var numPickables:number = this._pickables.length;


		if (numPickables) {
			if (fastFlag) {
				var obb:Box;
				var strokeIndex:number = strokeFlag? 1 : 0;

				//if (this._orientedBoxBoundsDirty[strokeIndex]) {
					this._orientedBoxBoundsDirty[strokeIndex] = false;

					for (var i:number = 0; i < numPickables; i++)
						obb = this._pickables[i].getBoxBounds(null, strokeFlag, this._orientedBoxBounds[strokeIndex], obb);
					
					this._orientedBoxBounds[strokeIndex] = obb;
				// } else {
				// 	obb = this._orientedBoxBounds[strokeIndex];
				// }

				if (obb != null)
					target = (matrix3D)? matrix3D.transformBox(obb).union(target, target || cache) : obb.union(target, target || cache);
			} else {
				for (var i:number = 0; i < numPickables; i++)
					target = this._pickables[i].getBoxBounds(matrix3D, strokeFlag, cache, target);
			}
		}

		return target;
	}

	public getSphereBounds(targetCoordinateSpace:IEntity = null, strokeFlag:boolean = false, fastFlag:boolean = false):Sphere
	{
		return this._getSphereBoundsInternal(null, targetCoordinateSpace? targetCoordinateSpace.parent : this._entity, strokeFlag, fastFlag);
	}

	public _getSphereBoundsInternal(center:Vector3D = null, parentCoordinateSpace:IEntity = null, strokeFlag:boolean = true, fastFlag:boolean = true, cache:Sphere = null, target:Sphere = null):Sphere
	{
		if (this._invalid)
			this._update();
	
		var box:Box = this._getBoxBoundsInternal(parentCoordinateSpace, strokeFlag);

		if (box == null)
			return;

		if (!center) {
			center = new Vector3D();
			center.x = box.x + box.width/2;
			center.y = box.y + box.height/2;
			center.z = box.z + box.depth/2;
		}

		var matrix3D:Matrix3D;

		if (parentCoordinateSpace == this._entity.parent) {
			matrix3D = this._entity.transform.matrix3D;

			//TODO: move _registrationMatrix3D to only affect collectables
			if (this._entity._registrationMatrix3D)
				matrix3D.prepend(this._entity._registrationMatrix3D);
		} else if (parentCoordinateSpace != this._entity) {
			if (parentCoordinateSpace) {
				matrix3D = this._entity.transform.concatenatedMatrix3D.clone();
				matrix3D.append(parentCoordinateSpace.transform.inverseConcatenatedMatrix3D);
			} else {
				matrix3D = this._entity.transform.concatenatedMatrix3D;
			}
		}

		var numPickables:number = this._pickables.length;

		if (numPickables) {
			if (fastFlag) {
				var osb:Sphere;
				var strokeIndex:number = strokeFlag? 1 : 0;

				if (this._orientedSphereBoundsDirty[strokeIndex]) {
					this._orientedSphereBoundsDirty[strokeIndex] = false;

					for (var i:number = 0; i < numPickables; i++)
						osb = this._pickables[i].getSphereBounds(center, null, strokeFlag, this._orientedSphereBounds[strokeIndex], osb);
	
					this._orientedSphereBounds[strokeIndex] = osb;
				} else {
					osb = this._orientedSphereBounds[strokeIndex];
				}

				if (osb != null)
					target = (matrix3D)? matrix3D.transformSphere(osb).union(target, target || cache) : osb.union(target, target || cache);
			} else {
				for (var i:number = 0; i < numPickables; i++)
					target = this._pickables[i].getSphereBounds(center, matrix3D, strokeFlag, cache, target);
			}
		}

		return target;
	}
	
	public applyPickable(pickable:IPickable):void
	{
		//is the pickable a mask?
		this._pickables.push(this.getAbstraction(pickable));
	}
	
	public onInvalidate(event:AssetEvent):void
	{
		super.onInvalidate(event);

		this._pickables = [];
		this._orientedBoxBoundsDirty[0] = true;
		this._orientedBoxBoundsDirty[1] = true;
		this._orientedSphereBoundsDirty[0] = true;
		this._orientedSphereBoundsDirty[1] = true;

		this.dispatchEvent(new BoundsPickerEvent(BoundsPickerEvent.INVALIDATE_BOUNDS, this));
	}

	public onClear(event:AssetEvent):void
	{
		super.onClear(event);

		for (var key in this._boundingVolumePools) {
			this._boundingVolumePools[key].dispose();
			delete this._boundingVolumePools[key];
		}
	}
	
	/**
	 * //TODO
	 *
	 * @param renderable
	 * @returns IRenderState
	 */
	public getAbstraction(pickable:IPickable):_Pick_PickableBase
	{
		return this._pickablePool[pickable.id] || (this._pickablePool[pickable.id] = new (<_IPick_PickableClass> PickEntity._pickPickableClassPool[pickable.assetType])(pickable, this));
	}
	
	/**
	 *
	 * @param renderable
	 */
	public clearAbstraction(pickable:IPickable):void
	{
		delete this._pickablePool[pickable.id];
		
		this.onInvalidate(null);
	}

	/**
	 *
	 * @param imageObjectClass
	 */
	public static registerPickable(pickClass:_IPick_PickableClass, assetClass:IAssetClass):void
	{
		PickEntity._pickPickableClassPool[assetClass.assetType] = pickClass;
	}

	private _update():void
	{
		this._invalid = false;
		this._entity._applyPickables(this);
	}

	private _isIntersectingMasks(rootEntity:IEntity, globalRayPosition:Vector3D, globalRayDirection:Vector3D):boolean
	{
		//horrible hack for 2d masks
		//do the mask thang
		var maskOwners:Array<IEntity> = this._entity.maskOwners;
		if (maskOwners) {
			var numOwners:number = maskOwners.length;
			var entity:IEntity;
			var masks:Array<IEntity>;
			var numMasks:number;
			var maskHit:boolean;
			for (var i:number = 0; i < numOwners; i++) {
				entity = maskOwners[i];
				if (!entity.isDescendant(rootEntity))
					continue;

				masks = entity.masks;
				numMasks = masks.length;
				maskHit = false;
				for (var j:number = 0; j < numMasks; j++) {
					entity = masks[j];
					if (!entity.isDescendant(rootEntity))
						continue;

					// todo: figure out why a mask can be null here!
					if (entity && this._pickGroup.getRaycastPicker(entity.partition)._isIntersectingRayInternal(rootEntity, globalRayPosition, globalRayDirection)) {
						maskHit = true;
						break;
					}
				}

				if (!maskHit)
					return false;
			}
		}

		return true;
	}
}