import {TraverserBase} from "./TraverserBase";
import {IContainerNode} from "./IContainerNode";

import {EntityNode} from "./EntityNode";
import { INode } from './INode';
import { PartitionBase } from './PartitionBase';
import { IEntity } from '../base/IEntity';
import { EntityContainerNodePool, SceneGraphPartition } from './SceneGraphPartition';

/**
 * Maintains scenegraph heirarchy when collecting nodes
 */
export class EntityContainerNode extends EntityNode implements IContainerNode
{
	public isEntityContainerNode:boolean = true;

	private _numNodes:number = 0;
	private _pChildNodes:Array<EntityNode> = new Array<EntityNode>();
	private _childDepths:Array<number> = new Array<number>();
	private _numMasks:number = 0;
	private _childMasks:Array<EntityNode> = new Array<EntityNode>();
	private _partition:SceneGraphPartition;

	constructor(entity:IEntity, pool:EntityContainerNodePool)
	{
		super(entity, pool);

		this._partition = pool.partition;
	}
	/**
	 *
	 * @param traverser
	 */
	public acceptTraverser(traverser:TraverserBase):void
	{
		if (this._partition.root == this._entity)
			this._partition.updateEntities();
		
		//containers nodes are for ordering only, no need to check enterNode or debugVisible
		if (this.numEntities == 0)
			return;

		var i:number;
		for (i = this._numNodes - 1; i >= 0; i--)
			this._pChildNodes[i].acceptTraverser(traverser);

		for (i = this._numMasks - 1; i >= 0; i--)
			this._childMasks[i].acceptTraverser(traverser);
	}

	/**
	 *
	 * @param node
	 * @internal
	 */
	public iAddNode(node:EntityNode):void
	{
		node.parent = this;

		if (node._entity.maskMode) {
			this._childMasks.push(node);
			this._numMasks++;
		} else {
			var depth:number = (this._entity != node._entity) ? node._entity._depthID : -16384;
			var len:number = this._childDepths.length;
			var index:number = len;

			while (index--)
				if (this._childDepths[index] < depth)
					break;

			index++;

			if (index < len) {
				this._pChildNodes.splice(index, 0, node);
				this._childDepths.splice(index, 0, depth);
			} else {
				this._pChildNodes.push(node);
				this._childDepths.push(depth);
			}
			this._numNodes++;
		}

		this._updateNumEntities(this, node.isEntityContainerNode? (<EntityContainerNode> node).numEntities : 1);
	}

	/**
	 *
	 * @param node
	 * @internal
	 */
	public iRemoveNode(node:EntityNode):void
	{
		if (node._entity.maskMode) {
			this._childMasks.splice(this._childMasks.indexOf(node), 1);
			this._numMasks--;
		} else {
			var index:number = this._pChildNodes.indexOf(node);

			this._pChildNodes.splice(index, 1);
			this._childDepths.splice(index, 1);
			this._numNodes--;
		}

		this._updateNumEntities(this, -node.numEntities)
	}

	private _updateNumEntities(node:INode, incr:number):void
	{
		do {
			node.numEntities += incr;
		} while ((node = node.parent) != null);
	}
}
export default EntityContainerNode;