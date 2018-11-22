import {Vector3D, AbstractionBase, Plane3D} from "@awayjs/core";

import {IEntity} from "../base/IEntity";
import {PartitionBase} from "../partition/PartitionBase";
import {ITraverser} from "../partition/ITraverser";
import {INode} from "../partition/INode";

import {PickingCollision} from "./PickingCollision";
import { PickEntity } from '../base/PickEntity';
import { PickGroup } from '../PickGroup';

/**
 * Picks a 3d object from a view or scene by 3D raycast calculations.
 * Performs an initial coarse boundary calculation to return a subset of entities whose bounding volumes intersect with the specified ray,
 * then triggers an optional picking collider on individual renderable objects to further determine the precise values of the picking ray collision.
 *
 * @class away.pick.RaycastPicker
 */
export class RaycastPicker extends AbstractionBase implements ITraverser
{
	private _dragEntity:IEntity;
	protected _partition:PartitionBase;
	protected _entity:IEntity;

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

	public shapeFlag:boolean = false;

	public findClosestCollision:boolean = false;
	
	private _pickGroup:PickGroup;

	private _rootEntity:IEntity;
	private _globalRayPosition:Vector3D;
	private _globalRayDirection:Vector3D;
	private _ignoredEntities:Array<IEntity>;

	private _entities:PickEntity[] = [];
	private _pickers:RaycastPicker[] = [];
	private _collectedEntities:PickEntity[] = [];

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

	public traverse():void
	{
		this._entities.length = 0;
		this._pickers.length = 0;
		this._partition.traverse(this);
	}

	public getTraverser(partition:PartitionBase):ITraverser
	{
		if (partition.root._iIsMouseEnabled() || partition.root.isDragEntity()) {
			var traverser:RaycastPicker = this._pickGroup.getRaycastPicker(partition);
		 
			if (traverser._isIntersectingRayInternal(this._rootEntity, this._globalRayPosition, this._globalRayDirection))
				this._pickers.push(traverser);
	
			return traverser;
		}
		
		return this;
	}

	public get dragEntity():IEntity
	{
		return this._dragEntity;
	}

	public set dragEntity(entity:IEntity)
	{
		if (this._dragEntity == entity)
			return;
		
		if (this._dragEntity)
			this._dragEntity._stopDrag();
		
		this._dragEntity = entity;

		if (this._dragEntity)
			this._dragEntity._startDrag();
	}

	/**
	 * Returns true if the current node is at least partly in the frustum. If so, the partition node knows to pass on the traverser to its children.
	 *
	 * @param node The Partition3DNode object to frustum-test.
	 */
	public enterNode(node:INode):boolean
	{
		if (!node.isVisible() || node.isMask())
			return false;

		if (node.pickObject) {
			node.pickObject.partition.traverse(this);
			return false;
		}

		return  node.isIntersectingRay(this._rootEntity, this._globalRayPosition, this._globalRayDirection, this._pickGroup)
	}

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


	/**
	 * @inheritDoc
	 */
	public isIntersectingRay(globalRayPosition:Vector3D, globalRayDirection:Vector3D):boolean
	{
		return this._isIntersectingRayInternal(this._entity, globalRayPosition, globalRayDirection)
	}
	/**
	 * @inheritDoc
	 */
	public _isIntersectingRayInternal(rootEntity:IEntity, globalRayPosition:Vector3D, globalRayDirection:Vector3D):boolean
	{
		this._rootEntity = rootEntity;
		this._globalRayPosition = globalRayPosition;
		this._globalRayDirection = globalRayDirection;

		this.traverse();

		if (!this._entities.length && !this._pickers.length)
			return false;
		// this._pickingCollision.rayPosition = this._entity.transform.inverseConcatenatedMatrix3D.transformVector(globalRayPosition, this._pickingCollision.rayPosition);
		// this._pickingCollision.rayDirection = this._entity.transform.inverseConcatenatedMatrix3D.deltaTransformVector(globalRayDirection, this._pickingCollision.rayDirection);
		// this._pickingCollision.normal = this._pickingCollision.normal || new Vector3D();

		// var rayEntryDistance:number = this._pickGroup.getBoundsPicker(this._partition).getBoundingVolume().rayIntersection(this._pickingCollision.rayPosition, this._pickingCollision.rayDirection, this._pickingCollision.normal);

		// if (rayEntryDistance < 0)
		// 	return false;

		// this._pickingCollision.rayEntryDistance = rayEntryDistance;
		// this._pickingCollision.rayOriginIsInsideBounds = rayEntryDistance == 0;

		return true;
	}

	// public isIntersectingShape(findClosestCollision:boolean):boolean
	// {
	// 	//recalculates the rayEntryDistance and normal for shapes
	// 	var rayEntryDistance:number = Number.MAX_VALUE;
	// 	for (var i:number = 0; i < this._entities.length; ++i) {
	// 		if (this._entities[i].isIntersectingShape(findClosestCollision) && rayEntryDistance > this._entities[i].pickingCollision.rayEntryDistance) {
	// 			rayEntryDistance = this._entities[i].pickingCollision.rayEntryDistance;
	// 			this._pickingCollision.normal = this._entities[i].pickingCollision.normal;
	// 		}
	// 	}

	// 	if (rayEntryDistance == Number.MAX_VALUE) {
	// 		this._pickingCollision.rayEntryDistance = -1;
	// 		return false;
	// 	}

	// 	this._pickingCollision.rayEntryDistance = rayEntryDistance;

	// 	return true;
	// }

	/**
	 * @inheritDoc
	 */
	public getCollision(rayPosition:Vector3D, rayDirection:Vector3D):PickingCollision
	{
		//early out if no collisions detected
		if (!this.isIntersectingRay(rayPosition, rayDirection))
			return null;

		//collect pickers
		this._collectEntities(this._collectedEntities, this._dragEntity);

		//console.log("entities: ", this._entities)
		var collision:PickingCollision = this._getPickingCollision();

		//discard collected pickers
		this._collectedEntities.length = 0;

		return collision;
	}

	public _collectEntities(collectedEntities:PickEntity[], dragEntity:IEntity):void
	{
		var len:number = this._pickers.length;
		var picker:RaycastPicker;
		for (var i:number = 0; i < len; i++)
			if ((picker = this._pickers[i]).entity != dragEntity)
				picker._collectEntities(collectedEntities, dragEntity);

		//ensures that raycastPicker entities are always added last, for correct 2D picking
		var entity:PickEntity;
		for (var i:number = 0; i < this._entities.length; ++i) {
			(entity = this._entities[i]).pickingCollision.pickerEntity = this._entity;
			collectedEntities.push(entity);
		}
		// //need to re-calculate the rayEntryDistance for only those entities inside the picker
		// this._pickingCollision.rayEntryDistance = Number.MAX_VALUE;
		// for (var i:number = 0; i < this._entities.length; ++i) {
		// 	if (this._pickingCollision.rayEntryDistance > this._entities[i].pickingCollision.rayEntryDistance) {
		// 		this._pickingCollision.rayEntryDistance = this._entities[i].pickingCollision.rayEntryDistance;
		// 		this._pickingCollision.normal = this._entities[i].pickingCollision.normal;
		// 	}
		// }

		// this._pickingCollision.rayOriginIsInsideBounds = this._pickingCollision.rayEntryDistance == 0;
	}

//		public getEntityCollision(position:Vector3D, direction:Vector3D, entities:Array<IEntity>):PickingCollision
//		{
//			this._numRenderables = 0;
//
//			var renderable:IEntity;
//			var l:number = entities.length;
//
//			for (var c:number = 0; c < l; c++) {
//				renderable = entities[c];
//
//				if (renderable.isIntersectingRay(position, direction))
//					this._renderables[this._numRenderables++] = renderable;
//			}
//
//			return this.getPickingCollision(this._raycastCollector);
//		}

	public setIgnoreList(entities:Array<IEntity>):void
	{
		this._ignoredEntities = entities;
	}
	
	// public getCollider(entity:IEntity):IPickingCollider
	// {
	// 	return this.getPartition(entity).getAbstraction(entity).pickingCollider;
	// }

	// public setCollider(entity:IEntity, collider:IPickingCollider)
	// {
	// 	this.getPartition(entity).getAbstraction(entity).pickingCollider = collider;
	// }

	private isIgnored(entity:IEntity):boolean
	{
		if (this._ignoredEntities) {
			var len:number = this._ignoredEntities.length;
			for (var i:number = 0; i < len; i++)
				if (this._ignoredEntities[i] == entity)
					return true;
		}
		
		return false;
	}

	private sortOnNearT(entity1:PickEntity, entity2:PickEntity):number
	{
		//return entity1._iPickingCollision.rayEntryDistance > entity2._iPickingCollision.rayEntryDistance? 1 : -1;// use this for Icycle;
		return entity1.pickingCollision.rayEntryDistance > entity2.pickingCollision.rayEntryDistance? 1 : entity1.pickingCollision.rayEntryDistance < entity2.pickingCollision.rayEntryDistance?-1 : 0;
	}

	private _getPickingCollision():PickingCollision
	{
		// Sort pickers from closest to furthest to reduce tests.
		this._collectedEntities = this._collectedEntities.sort(this.sortOnNearT); // TODO - test sort filter in JS

		// ---------------------------------------------------------------------
		// Evaluate triangle collisions when needed.
		// Replaces collision data provided by bounds collider with more precise data.
		// ---------------------------------------------------------------------

		var entity:PickEntity;
		var testCollision:PickingCollision;
		var bestCollision:PickingCollision;
		var len:number = this._collectedEntities.length;
		for (var i:number = 0; i < len; i++) {
			entity = this._collectedEntities[i];
			testCollision = entity.pickingCollision;

			if (bestCollision == null || testCollision.rayEntryDistance < bestCollision.rayEntryDistance) {
				if ((this.shapeFlag || entity.shapeFlag)) {
					testCollision.rayEntryDistance = Number.MAX_VALUE;
					// If a collision exists, update the collision data and stop all checks.
					if (entity.isIntersectingShape(this.findClosestCollision))
						bestCollision = testCollision;
				} else if (!testCollision.rayOriginIsInsideBounds) {
					// A bounds collision with no picking collider stops all checks.
					// Note: a bounds collision with a ray origin inside its bounds is ONLY ever used
					// to enable the detection of a corresponsding triangle collision.
					// Therefore, bounds collisions with a ray origin inside its bounds can be ignored
					// if it has been established that there is NO triangle collider to test
					bestCollision = testCollision;
					break;
				}
			} else {
				//if the next rayEntryDistance of testCollision is greater than bestCollision,
				//there won't be a better collision available
				break;
			}
		}

		if (bestCollision)
			this.updatePosition(bestCollision);

		if(this._dragEntity){
			if(this._dragEntity.assetType == "[asset MovieClip]" && this._dragEntity.adapter){
				(<any>this._dragEntity.adapter).setDropTarget(bestCollision?bestCollision.entity:null);
			}
		}

		return bestCollision;
	}

	private updatePosition(pickingCollision:PickingCollision):void
	{
		var collisionPos:Vector3D = pickingCollision.position || (pickingCollision.position = new Vector3D());

		var rayDir:Vector3D = pickingCollision.rayDirection;
		var rayPos:Vector3D = pickingCollision.rayPosition;
		var t:number = pickingCollision.rayEntryDistance;
		collisionPos.x = rayPos.x + t*rayDir.x;
		collisionPos.y = rayPos.y + t*rayDir.y;
		collisionPos.z = rayPos.z + t*rayDir.z;
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
		if (!this.isIgnored(entity)) {
			var pickEntity:PickEntity = this._pickGroup.getAbstraction(entity);
			this._entities.push(pickEntity);
		}
	}
}