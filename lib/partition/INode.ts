import {Plane3D, Vector3D} from "@awayjs/core";

import {IContainerNode} from "./IContainerNode";

import {ITraverser} from "./ITraverser";
import { IEntity } from '../base/IEntity';
import { PickGroup } from '../PickGroup';

/**
 * IDisplayObjectNode is an interface for the constructable class definition EntityNode that is used to
 * create node objects in the partition pipeline that represent the contents of a Entity
 *
 * @class away.pool.IDisplayObjectNode
 */
export interface INode
{
	//bounds:BoundingVolumeBase;

	pickObject:IEntity;

	boundsVisible:boolean;

	getBoundsPrimitive(pickGroup:PickGroup):IEntity;

	parent:IContainerNode;

	_collectionMark:number;

	isMask():boolean;

	isInFrustum(planes:Array<Plane3D>, numPlanes:number):boolean;
	
	isRenderable():boolean;

	isVisible():boolean;
	
	isIntersectingRay(rootEntity:IEntity, rayPosition:Vector3D, rayDirection:Vector3D, pickGroup:PickGroup):boolean;

	acceptTraverser(traverser:ITraverser);

	isCastingShadow():boolean;
}