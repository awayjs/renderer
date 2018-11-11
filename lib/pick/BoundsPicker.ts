import {Vector3D, Matrix3D, Box, Sphere, AbstractionBase, AssetBase, AssetEvent, Plane3D, Point} from "@awayjs/core";

import {IEntity} from "../base/IEntity";
import {PartitionBase} from "../partition/PartitionBase";
import {ITraverser} from "../partition/ITraverser";
import {INode} from "../partition/INode";

import {PickingCollision} from "./PickingCollision";
import { IPickable } from '../base/IPickable';
import { PickEntity } from '../base/PickEntity';
import { PickGroup } from '../PickGroup';
import { IPicker } from './IPicker';
import { BoundingVolumePool } from '../bounds/BoundingVolumePool';
import { BoundingVolumeType } from '../bounds/BoundingVolumeType';
import { BoundingVolumeBase } from '../bounds/BoundingVolumeBase';
import { BoundingBox } from '../bounds/BoundingBox';
import { BoundingSphere } from '../bounds/BoundingSphere';
import { IBoundsPicker } from './IBoundsPicker';
import { BoundsPickerEvent } from '../events/BoundsPickerEvent';

/**
 * Picks a 3d object from a view or scene by 3D raycast calculations.
 * Performs an initial coarse boundary calculation to return a subset of entities whose bounding volumes intersect with the specified ray,
 * then triggers an optional picking collider on individual renderable objects to further determine the precise values of the picking ray collision.
 *
 * @class away.pick.RaycastPicker
 */
export class BoundsPicker extends AbstractionBase implements ITraverser, IBoundsPicker
{
	protected _partition:PartitionBase;
	protected _entity:IEntity;

	private _boundingVolumePools:Object = new Object();


	public get partition():PartitionBase
	{
		return this._partition;
	}

    /**
     *
     * @returns {IEntity}
     */
    public get entity():IEntity
    {
        return this._entity;
	}

	private _pickGroup:PickGroup;

	private _boundsPickers:IBoundsPicker[] = [];

	
	/**
	 * Indicates the width of the display object, in pixels. The width is
	 * calculated based on the bounds of the content of the display object. When
	 * you set the <code>width</code> property, the <code>scaleX</code> property
	 * is adjusted accordingly, as shown in the following code:
	 *
	 * <p>Except for TextField and Video objects, a display object with no
	 * content(such as an empty sprite) has a width of 0, even if you try to set
	 * <code>width</code> to a different value.</p>
	 */
	public get width():number
	{
		var box:Box = this.getBoxBounds();

		if (box == null)
			return 0;

		// if (this._entity._registrationMatrix3D)
		// 	return box.width*this._entity.scaleX*this._entity._registrationMatrix3D._rawData[0];

		return box.width*this._entity.transform.scale.x;
	}

	public set width(val:number)
	{
		var box:Box = this.getBoxBounds();

		//return if box is empty ie setting width for no content is impossible
		if (box == null || box.width == 0)
			return;

		//this._updateAbsoluteDimension();

		this._entity.transform.scaleTo(val/box.width, this._entity.transform.scale.y, this._entity.transform.scale.z);
	}

	
	/**
	 * Indicates the height of the display object, in pixels. The height is
	 * calculated based on the bounds of the content of the display object. When
	 * you set the <code>height</code> property, the <code>scaleY</code> property
	 * is adjusted accordingly, as shown in the following code:
	 *
	 * <p>Except for TextField and Video objects, a display object with no
	 * content (such as an empty sprite) has a height of 0, even if you try to
	 * set <code>height</code> to a different value.</p>
	 */
	public get height():number
	{
		var box:Box = this.getBoxBounds();

		if (box == null)
			return 0;

		// if (this._entity._registrationMatrix3D)
		// 	return box.height*this._entity.scaleY*this._entity._registrationMatrix3D._rawData[5];

		return box.height*this._entity.transform.scale.y;
	}

	public set height(val:number)
	{
		var box:Box = this.getBoxBounds();

		//return if box is empty ie setting height for no content is impossible
		if (box == null || box.height == 0)
			return;

		//this._updateAbsoluteDimension();

		this._entity.transform.scaleTo(this._entity.transform.scale.x, val/box.height, this._entity.transform.scale.z);
	}
	
	/**
	 * Indicates the depth of the display object, in pixels. The depth is
	 * calculated based on the bounds of the content of the display object. When
	 * you set the <code>depth</code> property, the <code>scaleZ</code> property
	 * is adjusted accordingly, as shown in the following code:
	 *
	 * <p>Except for TextField and Video objects, a display object with no
	 * content (such as an empty sprite) has a depth of 0, even if you try to
	 * set <code>depth</code> to a different value.</p>
	 */
	public get depth():number
	{
		var box:Box = this.getBoxBounds();

		if (box == null)
			return 0;

		// if (this._entity._registrationMatrix3D)
		// 	return  box.depth*this._entity.scaleZ*this._entity._registrationMatrix3D._rawData[10];

		return box.depth*this._entity.transform.scale.z;
	}

	public set depth(val:number)
	{
		var box:Box = this.getBoxBounds();

		//return if box is empty ie setting depth for no content is impossible
		if (box == null || box.depth == 0)
			return;

		//this._updateAbsoluteDimension();
		
		this._entity.transform.scaleTo(this._entity.transform.scale.x, this._entity.transform.scale.y, val/box.depth);
	}

	/**
	 * Creates a new <code>RaycastPicker</code> object.
	 *
	 * @param findClosestCollision Determines whether the picker searches for the closest bounds collision along the ray,
	 * or simply returns the first collision encountered. Defaults to false.
	 */
	constructor(partition:PartitionBase, pickGroup:PickGroup)
	{
		super(partition, pickGroup);
		
		this._partition = partition;
		this._entity = partition.root;
		this._pickGroup = pickGroup;
	}

	public onInvalidate(event:AssetEvent):void
	{
		super.onInvalidate(event);

		this.dispatchEvent(new BoundsPickerEvent(BoundsPickerEvent.INVALIDATE_BOUNDS, this));
	}

	public traverse():void
	{
		this._boundsPickers.length = 0;
		this._partition.traverse(this);

		this._invalid = false;
	}

	public getTraverser(partition:PartitionBase):ITraverser
	{
		var traverser:BoundsPicker = this._pickGroup.getBoundsPicker(partition);
		 
		if (this._invalid)
			this._boundsPickers.push(traverser);

		return traverser;
	}

	/**
	 * Returns true if the current node is at least partly in the frustum. If so, the partition node knows to pass on the traverser to its children.
	 *
	 * @param node The Partition3DNode object to frustum-test.
	 */
	public enterNode(node:INode):boolean
	{
		return node.isVisible();
	}

	public getBoundingVolume(targetCoordinateSpace:IEntity = null, boundingVolumeType:BoundingVolumeType = null):BoundingVolumeBase
	{
		if (boundingVolumeType == null)
			boundingVolumeType = this._entity.defaultBoundingVolume;
			
		var pool:BoundingVolumePool = (this._boundingVolumePools[boundingVolumeType] || (this._boundingVolumePools[boundingVolumeType] = new BoundingVolumePool(this, boundingVolumeType)));
	
		return <BoundingVolumeBase> pool.getAbstraction(targetCoordinateSpace);
	}
	
	public getBoxBounds(targetCoordinateSpace:IEntity = null, strokeFlag:boolean = false, fastFlag:boolean = false):Box
	{
		return (<BoundingBox> this.getBoundingVolume(targetCoordinateSpace, strokeFlag? (fastFlag? BoundingVolumeType.BOX_BOUNDS_FAST : BoundingVolumeType.BOX_BOUNDS) : (fastFlag? BoundingVolumeType.BOX_FAST : BoundingVolumeType.BOX))).getBox();
	}

	public getSphereBounds(targetCoordinateSpace:IEntity = null, strokeFlag:boolean = false, fastFlag:boolean = false):Sphere
	{
		return (<BoundingSphere> this.getBoundingVolume(targetCoordinateSpace, strokeFlag? (fastFlag? BoundingVolumeType.SPHERE_BOUNDS_FAST : BoundingVolumeType.SPHERE_BOUNDS) : (fastFlag? BoundingVolumeType.SPHERE_FAST :BoundingVolumeType.SPHERE))).getSphere();
	}

	public hitTestPoint(x:number, y:number, shapeFlag:boolean = false):boolean
	{
		return this._hitTestPointInternal(this._entity, x, y, shapeFlag, false);
	}

	public _hitTestPointInternal(rootEntity:IEntity, x:number, y:number, shapeFlag:boolean = false, maskFlag:boolean = false):boolean
	{
		if(this._entity.maskId != -1 && (!maskFlag || !shapeFlag))//allow masks for bounds hit tests
			return false;

		if (this._invalid)
			this.traverse();

		//set local tempPoint for later reference
		var tempPoint:Point = new Point(x, y);
		this._entity.globalToLocal(tempPoint, tempPoint);

		//early out for box test
		var box:Box = this.getBoxBounds(null, false, true);

		if(box == null || !box.contains(tempPoint.x, tempPoint.y, 0))
			return false;

		//early out for non-shape tests
		if (!shapeFlag || this._entity.assetType=="[asset TextField]" || this._entity.assetType=="[asset Billboard]")
			return true;

		var numPickers:number = this._boundsPickers.length;
		if (numPickers)
			for (var i:number = 0; i < numPickers; ++i)
				if (this._boundsPickers[i]._hitTestPointInternal(rootEntity, x, y, shapeFlag, maskFlag))
					return true;
	}

	
	/**
	 * Evaluates the bounding box of the display object to see if it overlaps or
	 * intersects with the bounding box of the <code>obj</code> display object.
	 *
	 * @param obj The display object to test against.
	 * @return <code>true</code> if the bounding boxes of the display objects
	 *         intersect; <code>false</code> if not.
	 */
	public hitTestObject(obj:BoundsPicker):boolean
	{
		//TODO: getBoxBounds should be using the root partition root
		var objBox:Box = obj.getBoxBounds(this._entity, true);

		if(objBox == null)
			return false;
		
		var box:Box = this.getBoxBounds(this._entity, true);

		if(box == null)
			return false;

		if (objBox.intersects(box))
			return true;
		
		return false;
	}

	public _getBoxBoundsInternal(parentCoordinateSpace:IEntity = null, strokeFlag:boolean = true, fastFlag:boolean = true, cache:Box = null, target:Box = null):Box
	{
		if (this._invalid)
			this.traverse();
		
		var numPickers:number = this._boundsPickers.length;
		if (numPickers)
			for (var i:number = 0; i < numPickers; ++i)
				target = this._boundsPickers[i]._getBoxBoundsInternal(parentCoordinateSpace, strokeFlag, fastFlag, cache, target);

		return target;
	}

	// private _getBoxBoundsInternal(items:RaycastPicker[] | PickEntity[], targetCoordinateSpace:IEntity = null, strokeFlag:boolean = true, fastFlag:boolean = true, cache:Box = null, target:Box = null):Box
	// {
	// 	var numItems:number = items.length;
	// 	if (fastFlag) {
	// 		var box:Box;
	// 		for (var i:number = 0; i < numItems; ++i) {

	// 			// ignore bounds of childs that are masked
	// 			// todo: this check is only needed for icycle, to get mouseclicks work correct in shop
	// 			//if(this._children[i].masks==null){
					
	// 				box = items[i].getBoxBounds(targetCoordinateSpace || items[i].entity, strokeFlag, fastFlag, box);
					
	// 				if (box != null) {
	// 					if (items[i].entity != this._entity) {
	// 						if (matrix3D)
	// 							m.copyFrom(matrix3D);
	// 						else
	// 							m.identity();

	// 						m.prepend(items[i].entity.transform.matrix3D);
						
	// 						if (items[i].entity._registrationMatrix3D)
	// 							m.prepend(items[i].entity._registrationMatrix3D);
	// 					} else {
	// 						m = matrix3D;
	// 					}

	// 					target = m.transformBox(box).union(target, target || cache);
	// 				}
	// 		//	}
	// 		}
	// 	} else {
	// 		for (var i:number = 0; i < numItems; ++i) {

	// 			// ignore bounds of childs that are masked
	// 			// todo: this check is only needed for icycle, to get mouseclicks work correct in shop
	// 			//if(this._children[i].masks==null){

	// 				if (items[i].entity != this._entity) {
	// 					if (matrix3D)
	// 						m.copyFrom(matrix3D);
	// 					else
	// 						m.identity();

	// 					m.prepend(items[i].entity.transform.matrix3D);

	// 					if (items[i].entity._registrationMatrix3D)
	// 						m.prepend(items[i].entity._registrationMatrix3D);
	// 				} else {
	// 					m = matrix3D;
	// 				}

	// 				target = items[i].getBoxBounds(m, strokeFlag, fastFlag, cache, target);
	// 		//	}
	// 		}
	// 	}

	// 	return target;
	// }

	public _getSphereBoundsInternal(center:Vector3D = null, parentCoordinateSpace:IEntity = null, strokeFlag:boolean = true, fastFlag:boolean = true, cache:Sphere = null, target:Sphere = null):Sphere
	{
		if (this._invalid)
			this.traverse();

		var box:Box = this._getBoxBoundsInternal(parentCoordinateSpace, strokeFlag, fastFlag);

		if (box == null)
			return;

		if (!center) {
			center = new Vector3D();
			center.x = box.x + box.width/2;
			center.y = box.y + box.height/2;
			center.z = box.z + box.depth/2;
		}
		
		var numPickers:number = this._boundsPickers.length;
		if (numPickers)
			for (var i:number = 0; i < numPickers; ++i)
				target = this._boundsPickers[i]._getSphereBoundsInternal(center, parentCoordinateSpace, strokeFlag, fastFlag, target);

		return target;
	}

	// private _getSphereBoundsInternal(items:RaycastPicker[] | PickEntity[], center:Vector3D, matrix3D:Matrix3D, strokeFlag:boolean, fastFlag:boolean, cache:Sphere, target:Sphere = null):Sphere
	// {
	// 	var numItems:number = items.length;
	// 	var m:Matrix3D = new Matrix3D();
	// 	if (fastFlag) {
	// 		var sphere:Sphere;
	// 		for (var i:number = 0; i < numItems; ++i) {

	// 			// ignore bounds of childs that are masked
	// 			// todo: this check is only needed for icycle, to get mouseclicks work correct in shop
	// 			//if(this._children[i].masks==null){
	// 				if (matrix3D)
	// 					m.copyFrom(matrix3D);
	// 				else
	// 					m.identity();

	// 				sphere = items[i].getSphereBounds(center, null, strokeFlag, fastFlag, sphere);
					
	// 				if (sphere != null) {
	// 					m.prepend(items[i].entity.transform.matrix3D);
						
	// 					if (items[i].entity._registrationMatrix3D)
	// 						m.prepend(items[i].entity._registrationMatrix3D);

	// 					target = m.transformSphere(sphere).union(target, target || cache);
	// 				}
	// 		//	}
	// 		}
	// 	} else {
	// 		for (var i:number = 0; i < numItems; ++i) {

	// 			// ignore bounds of childs that are masked
	// 			// todo: this check is only needed for icycle, to get mouseclicks work correct in shop
	// 			//if(this._children[i].masks==null){
	// 				if (matrix3D)
	// 					m.copyFrom(matrix3D);
	// 				else
	// 					m.identity();
					
	// 				m.prepend(items[i].entity.transform.matrix3D);

	// 				if (items[i].entity._registrationMatrix3D)
	// 					m.prepend(items[i].entity._registrationMatrix3D);

	// 				target = items[i].getSphereBounds(center, m, strokeFlag, fastFlag, cache, target);
	// 		//	}
	// 		}
	// 	}

	// 	return target;
	// }

		/**
	 *
	 * @param planes
	 * @param numPlanes
	 * @returns {boolean}
	 */
	public isInFrustum(planes:Array<Plane3D>, numPlanes:number):boolean
	{
		if (!this._entity._iIsVisible())
			return false;

		return true; // todo: hack for 2d. attention. might break stuff in 3d.
		//return this._bounds.isInFrustum(planes, numPlanes);
	}

	public onClear(event:AssetEvent):void
	{
		super.onClear(event);

		for (var key in this._boundingVolumePools) {
			this._boundingVolumePools[key].dispose();
			delete this._boundingVolumePools[key];
		}
	}

	public dispose():void
	{
		//TODO
	}

	/**
	 *
	 * @param entity
	 */
	public applyEntity(entity:IEntity):void
	{
		this._boundsPickers.push(this._pickGroup.getAbstraction(entity));
	}
}