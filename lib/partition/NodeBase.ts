import {Plane3D, Vector3D, AbstractMethodError} from "@awayjs/core";

import {IEntity} from "../base/IEntity";

import {TraverserBase} from "./TraverserBase";
import {INode} from "./INode";
import {IContainerNode} from "./IContainerNode";
import { PartitionBase } from './PartitionBase';

/**
 * @class away.partition.NodeBase
 */
export class NodeBase implements IContainerNode
{
	private _entity:IEntity;
	private _partition:PartitionBase;
	protected _childNodes:Array<INode> = new Array<INode>();
	protected _numChildNodes:number = 0;

	protected _debugEntity:IEntity;

	public _collectionMark:number;// = 0;

	public numEntities:number = 0;

	public parent:IContainerNode;

	public get boundsVisible():boolean
	{
		return false;
	}

	public get boundsPrimitive():IEntity
	{
		throw new AbstractMethodError();
	}

	constructor(entity:IEntity, partition:PartitionBase)
	{
		this._entity = entity;
		this._partition = partition;
	}
	/**
	 *
	 * @param planes
	 * @param numPlanes
	 * @returns {boolean}
	 * @internal
	 */
	public isInFrustum(planes:Array<Plane3D>, numPlanes:number):boolean
	{
		return true;
	}

	/**
	 *
	 * @param rayPosition
	 * @param rayDirection
	 * @returns {boolean}
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
	
	/**
	 *
	 * @returns {boolean}
	 */
	public isCastingShadow():boolean
	{
		return true;
	}
	
	public renderBounds(traverser:TraverserBase):void
	{
		//nothing to do here
	}


	/**
	 *
	 * @returns {boolean}
	 */
	public isMask():boolean
	{
		return false;
	}

	public dispose():void
	{
		this.parent = null;
		this._childNodes = null;
	}

	/**
	 *
	 * @param traverser
	 */
	public acceptTraverser(traverser:TraverserBase):void
	{
		// if (traverser.partition != this._partition)
		// 	traverser = traverser.getTraverser()
		if (this._partition.root == this._entity)
			this._partition.updateEntities();
		
		if (this.numEntities == 0)
			return;

		if (traverser.enterNode(this)) {
			for (var i:number = 0; i < this._numChildNodes; i++)
				this._childNodes[i].acceptTraverser(traverser);
		}
	}

	/**
	 *
	 * @param node
	 * @internal
	 */
	public iAddNode(node:INode):void
	{
		node.parent = this;
		this.numEntities += node.numEntities;
		this._childNodes[ this._numChildNodes++ ] = node;

		var numEntities:number = node.numEntities;
		node = this;

		do {
			node.numEntities += numEntities;
		} while ((node = node.parent) != null);
	}

	/**
	 *
	 * @param node
	 * @internal
	 */
	public iRemoveNode(node:INode):void
	{
		var index:number = this._childNodes.indexOf(node);
		this._childNodes[index] = this._childNodes[--this._numChildNodes];
		this._childNodes.pop();

		var numEntities:number = node.numEntities;
		node = this;

		do {
			node.numEntities -= numEntities;
		} while ((node = node.parent) != null);
	}
}