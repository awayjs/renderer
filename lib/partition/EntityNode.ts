import {AbstractionBase, Plane3D, Vector3D, IAbstractionPool, AssetEvent} from "@awayjs/core";

import {IEntity} from "../base/IEntity";
import {EntityEvent} from "../events/EntityEvent";

import {TraverserBase} from "./TraverserBase";
import {INode} from "./INode";
import { IContainerNode } from './IContainerNode';
import { PartitionBase } from './PartitionBase';

/**
 * @class away.partition.EntityNode
 */
export class EntityNode extends AbstractionBase implements INode
{
	public numEntities:number = 0;

	public isEntityContainerNode:boolean = false;

	public _iUpdateQueueNext:EntityNode;

	private _onInvalidateBoundsDelegate:(event:EntityEvent) => void;
	
	public _entity:IEntity;

	public _collectionMark:number;// = 0;

	public parent:IContainerNode;

	public get boundsVisible():boolean
	{
		return this._entity.boundsVisible;
	}

	public get boundsPrimitive():IEntity
	{
		return this._entity.boundsPrimitive;
	}

	constructor(entity:IEntity, pool:IAbstractionPool)
	{
		super(entity, pool);

		this._onInvalidateBoundsDelegate = (event:EntityEvent) => this._onInvalidateBounds(event);

		this._entity = entity;
		this._entity.addEventListener(EntityEvent.INVALIDATE_BOUNDS, this._onInvalidateBoundsDelegate);
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

		this._entity.removeEventListener(EntityEvent.INVALIDATE_BOUNDS, this._onInvalidateBoundsDelegate);
		this._entity = null;
	}

	/**
	 *
	 * @param planes
	 * @param numPlanes
	 * @returns {boolean}
	 */
	public isInFrustum(planes:Array<Plane3D>, numPlanes:number):boolean
	{
		return true;
	}


	/**
	 * @inheritDoc
	 */
	public isIntersectingRay(rayPosition:Vector3D, rayDirection:Vector3D):boolean
	{
		return true;
	}
	
	/**
	 *
	 * @returns {boolean}
	 */
	public isRenderable():boolean
	{
		return true;
	}
	
	public renderBounds(traverser:TraverserBase):void
	{
		//traverser.applyEntity(this._entity.getBoundingVolume(null, BoundingVolumeType.BOX_BOUNDS_FAST).boundsPrimitive);
	}
	

	/**
	 * @inheritDoc
	 */
	public acceptTraverser(traverser:TraverserBase):void
	{
		// do nothing here
	}

	public _onInvalidateBounds(event:EntityEvent):void
	{
		// do nothing here
	}
}