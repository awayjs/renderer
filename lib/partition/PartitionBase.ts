import {IAssetClass, IAbstractionPool, ProjectionEvent} from "@awayjs/core";

import {IEntity} from "../base/IEntity";

import {TraverserBase} from "./TraverserBase";
import {IContainerNode} from "./IContainerNode";
import {IEntityNodeClass} from "./IEntityNodeClass";
import {EntityNode} from "./EntityNode";
import { INode } from './INode';
import { Viewport, ViewportEvent } from '@awayjs/stage';

/**
 * @class away.partition.Partition
 */
export class PartitionBase implements IAbstractionPool
{
	private _onViewMatrix3DChangedDelegate:(event:ViewportEvent) => void;

	private static _abstractionClassPool:Object = new Object();

	private _children:Array<PartitionBase> = new Array<PartitionBase>();
	private _abstractionPool:Object = new Object();
	private _updateQueue:Object = {};

	private _scene:IEntity;
	protected _root:IEntity;
	protected _viewport:Viewport;
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

	public get viewport():Viewport
	{
		return this._viewport;
	}
	
	constructor(root:IEntity, viewport:Viewport = null, isScene:boolean = false)
	{
		this._root = root;
		this._viewport = viewport || new Viewport();

		if (isScene)
			this._scene = root;

		this._root.partition = this;

		this._onViewMatrix3DChangedDelegate = (event:ViewportEvent) => this._onViewMatrix3DChanged(event);
		this._viewport.projection.addEventListener(ViewportEvent.INVALIDATE_VIEW_MATRIX3D, this._onViewMatrix3DChangedDelegate);

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
		return this;
	}

	/**
	 *
	 * @param image
	 */
	public clearAbstraction(entity:IEntity):void
	{
		delete this._abstractionPool[entity.id];
	}

	public traverse(traverser:TraverserBase):void
	{
		this._rootNode.acceptTraverser(traverser);
	}

	public invalidateEntity(entity:IEntity):void
	{
		//use getPartition when sub-partitions are required
		this._updateQueue[entity.id] = entity;
	}

	public updateEntity(entity:IEntity):void
	{
		//TODO: remove reliance on viewport
		//required for controllers with autoUpdate set to true and queued events
		entity._iInternalUpdate(this._viewport);

		if (entity.isEntity)
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
		delete this._updateQueue[entity.id];

		if(entity.isEntity)
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

	public dispose():void
	{
		//remove sub-partitions
	}

	public _setParent(parent:PartitionBase):void
	{
		if (this._parent)
			this._parent.clearNode(this._rootNode);
		
		this._parent = parent;

		if (parent)
			parent.updateNode(this._rootNode);

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

	/**
	 *
	 * @param imageObjectClass
	 */
	public static registerAbstraction(entityNodeClass:IEntityNodeClass, assetClass:IAssetClass):void
	{
		PartitionBase._abstractionClassPool[assetClass.assetType] = entityNodeClass;
	}
	
	//TODO: remove this
	private _onViewMatrix3DChanged(event:ViewportEvent):void
	{
		var entity:IEntity;

		//add all existing entities to the updateQueue
		for (var key in this._abstractionPool) {
			entity = this._abstractionPool[key]._entity;
			this._updateQueue[entity.id] = entity;
		}
	}
}