import {AssetEvent, Plane3D, Vector3D} from "@awayjs/core";


import {IEntity} from "../base/IEntity";
import {EntityEvent} from "../events/EntityEvent";
import {BoundingVolumeType} from "../bounds/BoundingVolumeType";

import {TraverserBase} from "./TraverserBase";
import {EntityNode} from "./EntityNode";
import {PartitionBase} from "./PartitionBase";
import { PickingCollision } from '../pick/PickingCollision';

/**
 * @class away.partition.RenderableContainerNode
 */
export class RenderableContainerNode extends EntityNode
{
	public numEntities:number = 1;

	private _partition:PartitionBase;
	private _maskPosition:Vector3D = new Vector3D();


	constructor(entity:IEntity, partition:PartitionBase)
	{
		super(entity, partition);

		this._partition = partition;
	}

	public onClear(event:AssetEvent):void
	{
		super.onClear(event);

		this._partition = null;
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
		if (!this._entity._iIsVisible() || !this.isIntersectingMasks(globalRayPosition, globalRayDirection, this._entity._iAssignedMasks()))
			return false;

		var pickingCollision:PickingCollision = this._entity._iPickingCollision;
		pickingCollision.rayPosition = this._entity.transform.inverseConcatenatedMatrix3D.transformVector(globalRayPosition);
		pickingCollision.rayDirection = this._entity.transform.inverseConcatenatedMatrix3D.deltaTransformVector(globalRayDirection);

		if (!pickingCollision.normal)
			pickingCollision.normal = new Vector3D();

		var rayEntryDistance:number = this._entity.getBoundingVolume(null, this._entity.defaultBoundingVolume).rayIntersection(pickingCollision.rayPosition, pickingCollision.rayDirection, pickingCollision.normal);

		if (rayEntryDistance < 0)
			return false;

		pickingCollision.rayEntryDistance = rayEntryDistance;
		pickingCollision.globalRayPosition = globalRayPosition;
		pickingCollision.globalRayDirection = globalRayDirection;
		pickingCollision.rayOriginIsInsideBounds = rayEntryDistance == 0;

		return true;
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
	public acceptTraverser(traverser:TraverserBase):void
	{
		if (traverser.enterNode(this))
			traverser.applyEntity(this._entity);
	}

	public _onInvalidateBounds(event:EntityEvent):void
	{
		this._partition.invalidateEntity(this._entity);
	}

	private isIntersectingMasks(globalRayPosition:Vector3D, globalRayDirection:Vector3D, masks:Array<Array<IEntity>>):boolean
	{
		//horrible hack for 2d masks
		if (masks != null) {
			this._maskPosition.x = globalRayPosition.x + globalRayDirection.x*1000;
			this._maskPosition.y = globalRayPosition.y + globalRayDirection.y*1000;
			var numLayers:number = masks.length;
			var children:Array<IEntity>;
			var numChildren:number;
			var layerHit:boolean;
			for (var i:number = 0; i < numLayers; i++) {
				children = masks[i];
				numChildren = children.length;
				layerHit = false;
				for (var j:number = 0; j < numChildren; j++) {
					// todo: figure out why a mask can be null here!
					if (children[j] && children[j].hitTestPoint(this._maskPosition.x, this._maskPosition.y, true, true)) {
						layerHit = true;
						break;
					}
				}

				if (!layerHit)
					return false;
			}
		}

		return true;
	}
}