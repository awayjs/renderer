import {ITraverser} from "./ITraverser";

import {EntityNode} from "./EntityNode";
import { INode } from './INode';
import { NodeBase } from './NodeBase';

/**
 * Maintains scenegraph heirarchy when collecting nodes
 */
export class SceneGraphNode extends NodeBase
{
	private _numNodes:number = 0;
	private _pChildNodes:Array<EntityNode> = new Array<EntityNode>();
	private _childDepths:Array<number> = new Array<number>();
	private _numMasks:number = 0;
	private _childMasks:Array<EntityNode> = new Array<EntityNode>();
	/**
	 *
	 * @param traverser
	 */
	public acceptTraverser(traverser:ITraverser):void
	{
		if (this._partition.root == this._entity)
			this._partition.updateEntities();

		//get the sub-traverser for the partition, if different, terminate this traversal
		if (traverser.partition != this._partition && traverser != traverser.getTraverser(this._partition))
			return;

		if (!traverser.enterNode(this))
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
	}

	public isVisible():boolean
	{
		return this._entity._iIsVisible();
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
	}
}