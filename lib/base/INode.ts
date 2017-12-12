import {Plane3D, Vector3D} from "@awayjs/core";

import {IContainerNode} from "./IContainerNode";

import {TraverserBase} from "./TraverserBase";

/**
 * IDisplayObjectNode is an interface for the constructable class definition EntityNode that is used to
 * create node objects in the partition pipeline that represent the contents of a Entity
 *
 * @class away.pool.IDisplayObjectNode
 */
export interface INode
{
	debugVisible:boolean;

	//bounds:BoundingVolumeBase;

	numEntities:number;

	parent:IContainerNode;

	_iCollectionMark:number;

	isInFrustum(planes:Array<Plane3D>, numPlanes:number):boolean;
	
	isRenderable():boolean;

	isMask():boolean;
	
	isIntersectingRay(rayPosition:Vector3D, rayDirection:Vector3D):boolean;

	acceptTraverser(traverser:TraverserBase);

	isCastingShadow():boolean;

	renderBounds(traverser:TraverserBase);
}