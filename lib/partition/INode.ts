import {Plane3D, Vector3D} from "@awayjs/core";

import {IContainerNode} from "./IContainerNode";

import {TraverserBase} from "./TraverserBase";
import { IEntity } from '../base/IEntity';

/**
 * IDisplayObjectNode is an interface for the constructable class definition EntityNode that is used to
 * create node objects in the partition pipeline that represent the contents of a Entity
 *
 * @class away.pool.IDisplayObjectNode
 */
export interface INode
{
	//bounds:BoundingVolumeBase;

	boundsVisible:boolean;

	boundsPrimitive:IEntity;
	
	numEntities:number;

	parent:IContainerNode;

	_collectionMark:number;

	isMask():boolean;

	isInFrustum(planes:Array<Plane3D>, numPlanes:number):boolean;
	
	isRenderable():boolean;
	
	isIntersectingRay(rayPosition:Vector3D, rayDirection:Vector3D):boolean;

	acceptTraverser(traverser:TraverserBase);

	isCastingShadow():boolean;
	
	renderBounds(traverser:TraverserBase);
}