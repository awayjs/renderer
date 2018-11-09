import {AbstractionBase, Plane3D, Vector3D, IAbstractionPool, AssetEvent} from "@awayjs/core";

import {IEntity} from "../base/IEntity";

import {ITraverser} from "./ITraverser";
import {INode} from "./INode";
import { IContainerNode } from './IContainerNode';
import { PartitionBase } from './PartitionBase';
import { PickGroup } from '../PickGroup';

/**
 * @class away.partition.EntityNode
 */
export class EntityNode extends AbstractionBase implements INode
{
	public _iUpdateQueueNext:EntityNode;
	
	public _entity:IEntity;

	public _collectionMark:number;// = 0;

	public parent:IContainerNode;

	public get pickObject():IEntity
	{
		return this._entity.pickObject;
	}

	public get boundsVisible():boolean
	{
		return this._entity.boundsVisible;
	}

	public getBoundsPrimitive(pickGroup:PickGroup):IEntity
	{
		return this._entity.getBoundsPrimitive(pickGroup);
	}

	constructor(entity:IEntity, partition:PartitionBase)
	{
		super(entity, partition);

		this._entity = entity;
	}
	
	/**
	 *
	 * @returns {boolean}
	 */
	public isCastingShadow():boolean
	{
		return this._entity.castsShadows;
	}

	/**
	 *
	 * @returns {boolean}
	 */
	public isMask():boolean
	{
		return this._entity.maskMode;
	}

	public onClear(event:AssetEvent):void
	{
		super.onClear(event);

		this._entity = null;
	}

	/**
	 *
	 * @param planes
	 * @param numPlanes
	 * @returns {boolean}
	 */

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

	public isVisible():boolean
	{
		return this._entity._iIsVisible();
	}

	/**
	 * @inheritDoc
	 */
	public isIntersectingRay(rootEntity:IEntity, globalRayPosition:Vector3D, globalRayDirection:Vector3D, pickGroup:PickGroup):boolean
	{
		return pickGroup.getAbstraction(this._entity)._isIntersectingRayInternal(rootEntity, globalRayPosition, globalRayDirection);
		// if (!this._entity._iIsVisible() || !this.isIntersectingMasks(globalRayPosition, globalRayDirection, this._entity._iAssignedMasks()))
		// 	return false;

		// var pickingCollision:PickingCollision = this._entity._iPickingCollision;
		// pickingCollision.rayPosition = this._entity.transform.inverseConcatenatedMatrix3D.transformVector(globalRayPosition);
		// pickingCollision.rayDirection = this._entity.transform.inverseConcatenatedMatrix3D.deltaTransformVector(globalRayDirection);

		// if (!pickingCollision.normal)
		// 	pickingCollision.normal = new Vector3D();

		// var rayEntryDistance:number = pickGroup.getAbstraction(this._entity).getBoundingVolume(null, this._entity.defaultBoundingVolume).rayIntersection(pickingCollision.rayPosition, pickingCollision.rayDirection, pickingCollision.normal);

		// if (rayEntryDistance < 0)
		// 	return false;

		// pickingCollision.rayEntryDistance = rayEntryDistance;
		// pickingCollision.globalRayPosition = globalRayPosition;
		// pickingCollision.globalRayDirection = globalRayDirection;
		// pickingCollision.rayOriginIsInsideBounds = rayEntryDistance == 0;

		// return true;
	}

	/**
	 *
	 * @returns {boolean}
	 */
	public isRenderable():boolean
	{
		return this._entity._iAssignedColorTransform()._isRenderable();
	}
	
	/**
	 * @inheritDoc
	 */
	public acceptTraverser(traverser:ITraverser):void
	{
		if (traverser.enterNode(this))
			traverser.applyEntity(this._entity);
	}
}