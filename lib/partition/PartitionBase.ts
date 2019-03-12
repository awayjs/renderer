import {IAssetClass, IAbstractionPool, ProjectionEvent, AssetBase, AssetEvent} from "@awayjs/core";

import {IEntity} from "../base/IEntity";

import {ITraverser} from "./ITraverser";
import {IContainerNode} from "./IContainerNode";
import {IEntityNodeClass} from "./IEntityNodeClass";
import {EntityNode} from "./EntityNode";
import { INode } from './INode';
import { Viewport, ViewportEvent } from '@awayjs/stage';

/**
 * @class away.partition.Partition
 */
export class PartitionBase extends AssetBase implements IAbstractionPool
{
	private static _abstractionClassPool:Object = new Object();

	private _invalid:boolean;
	private _children:Array<PartitionBase> = new Array<PartitionBase>();
	private _abstractionPool:Object = new Object();
	private _updateQueue:Object = {};

	private _scene:IEntity;
	protected _root:IEntity;
	protected _rootNode:IContainerNode;
	protected _parent:PartitionBase;

	public get parent():PartitionBase
	{
		return this._parent;
	}

	public get root():IEntity
	{
		return this._root;
	}

	public get scene():IEntity
	{
		return this._scene;
	}
	
	constructor(root:IEntity, isScene:boolean = false)
	{
		super();

		this._root = root;
		this._root.addEventListener(AssetEvent.CLEAR, (event:AssetEvent) => this._onRootClear(event))

		if (isScene)
			this._scene = root;
	}

	public addChild(child:PartitionBase):PartitionBase
	{
		if (child && child.parent)
			child.parent.removeChildInternal(child);

		this._children.push(child);

		child._setParent(this);

		return child;
	}

	public removeChild(child:PartitionBase):PartitionBase
	{
		this.removeChildInternal(child);

		child._setParent(null);

		return child;
	}

	
	public removeChildInternal(child:PartitionBase):PartitionBase
	{
		return this._children.splice(this._children.indexOf(child), 1)[0];
	}



	public getAbstraction(entity:IEntity):EntityNode
	{
		return (this._abstractionPool[entity.id] || (this._abstractionPool[entity.id] = new (<IEntityNodeClass> PartitionBase._abstractionClassPool[entity.assetType])(entity, this)));
	}

	public getPartition(entity:IEntity):PartitionBase
	{
		return null;
	}

	/**
	 *
	 * @param image
	 */
	public clearAbstraction(entity:IEntity):void
	{
		delete this._abstractionPool[entity.id];
	}

	public traverse(traverser:ITraverser):void
	{
		this._invalid = false;

		this._rootNode.acceptTraverser(traverser);
	}

	public invalidateEntity(entity:IEntity):void
	{
		if (!this._invalid)
			this.invalidate();

		this._updateQueue[entity.id] = entity;
	}

	public updateEntity(entity:IEntity):void
	{
		//TODO: remove reliance on viewport
		//required for controllers with autoUpdate set to true and queued events
		entity._iInternalUpdate();

		this.updateNode(this.getAbstraction(entity));
	}

	public updateNode(node:INode):void
	{
		var targetNode:IContainerNode = this.findParentForNode(node);

		if (targetNode && node.parent != targetNode) {
			if (node.parent)
				node.parent.iRemoveNode(node);
			targetNode.iAddNode(node);
		}
	}

	public clearEntity(entity:IEntity):void
	{
		if (!this._invalid)
			this.invalidate();

		delete this._updateQueue[entity.id];

		this.clearNode(this.getAbstraction(entity));
	}

	public clearNode(node:INode)
	{
		if (node.parent) {
			node.parent.iRemoveNode(node);
			node.parent = null;
		}
	}

	/**
	 *
	 * @param entity
	 * @returns {away.partition.NodeBase}
	 */
	public findParentForNode(node:INode):IContainerNode
	{
		return this._rootNode;
	}

	public updateEntities():void
	{
		for (var key in this._updateQueue)
			this.updateEntity(this._updateQueue[key]);

		//clear updateQueue
		this._updateQueue = {};
	}

	public invalidate():void
	{
		this._invalid = true;

		super.invalidate();

		if (this._parent)
			this._parent.invalidate();
	}

	public dispose():void
	{
		for (var key in this._abstractionPool)
			this._abstractionPool[key].onClear(null);
	}

	public _setParent(parent:PartitionBase):void
	{
		if (this._parent) {
			this._parent.clearNode(this._rootNode);
			this._parent.invalidate();
		}
		
		this._parent = parent;

		if (parent) {
			parent.updateNode(this._rootNode);
			parent.invalidate();
		}

		this._setScene(parent? parent.scene : null);
	}

	public _setScene(scene:IEntity):void
	{
		if (this._scene == scene)
			return;

		this._scene = scene;

		var len:number = this._children.length;
		for (var i:number = 0; i < len; ++i)
			this._children[i]._setScene(scene);
	}

	public _onRootClear(event:AssetEvent):void
	{
		this.clear();

		this._abstractionPool
	}

	/**
	 *
	 * @param imageObjectClass
	 */
	public static registerAbstraction(entityNodeClass:IEntityNodeClass, assetClass:IAssetClass):void
	{
		PartitionBase._abstractionClassPool[assetClass.assetType] = entityNodeClass;
	}
}