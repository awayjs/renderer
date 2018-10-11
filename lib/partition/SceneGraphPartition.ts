import {IAbstractionPool} from "@awayjs/core";

import {IEntity} from "../base/IEntity";

import {IContainerNode} from "./IContainerNode";

import {EntityContainerNode} from "./EntityContainerNode";
import {PartitionBase} from "./PartitionBase";
import {EntityNode} from "./EntityNode";
import { Viewport } from '@awayjs/stage';

/**
 * @class away.partition.Partition
 */
export class SceneGraphPartition extends PartitionBase
{
	private _entityContainerNodePool:EntityContainerNodePool;

	constructor(root:IEntity, viewport:Viewport = null, isScene:boolean = false)
	{
		super(root, viewport, isScene);

		this._entityContainerNodePool = new EntityContainerNodePool(this);

		this._rootNode = this._entityContainerNodePool.getAbstraction(root);
	}

	/**
	 *
	 * @param entity
	 * @returns {away.partition.NodeBase}
	 */
	public findParentForNode(node:EntityNode):IContainerNode
	{
		if (this._root == node._entity && node.isEntityContainerNode)
			return null;

		if (!node.isEntityContainerNode && node._entity.isContainer)
			return this._entityContainerNodePool.getAbstraction(node._entity);

		//null in case of camera
		return node._entity.parent? this._entityContainerNodePool.getAbstraction(node._entity.parent) : null;
	}


	public updateEntity(entity:IEntity):void
	{
		super.updateEntity(entity);

		if(entity.isContainer)
			this.updateNode(this._entityContainerNodePool.getAbstraction(entity));
	}

	public clearEntity(entity:IEntity):void
	{
		super.clearEntity(entity);

		if(entity.isContainer)
			this.clearNode(this._entityContainerNodePool.getAbstraction(entity));
	}
}


/**
 * @class away.pool.EntityContainerNodePool
 */
export class EntityContainerNodePool implements IAbstractionPool
{
	private _abstractionPool:Object = new Object();
	private _partition:SceneGraphPartition;

	/**
	 * 
	 */
	public get partition():SceneGraphPartition
	{
		return this._partition;
	}

	constructor(partition:SceneGraphPartition)
	{
		this._partition = partition;
	}

	/**
	 * //TODO
	 *
	 * @param entity
	 * @returns EntityNode
	 */
	public getAbstraction(entity:IEntity):EntityContainerNode
	{
		return (this._abstractionPool[entity.id] || (this._abstractionPool[entity.id] = new EntityContainerNode(entity, this)));
	}

	/**
	 * //TODO
	 *
	 * @param entity
	 */
	public clearAbstraction(entity:IEntity):void
	{
		delete this._abstractionPool[entity.id];
	}
}