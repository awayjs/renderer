import {EventDispatcher} from "@awayjs/core";

import {IEntity} from "./IEntity";
import {IRenderable} from "./IRenderable";
import {INode} from "./INode";

/**
 * Picks a 3d object from a view or scene by 3D raycast calculations.
 * Performs an initial coarse boundary calculation to return a subset of entities whose bounding volumes intersect with the specified ray,
 * then triggers an optional picking collider on individual renderable objects to further determine the precise values of the picking ray collision.
 *
 * @class away.pick.RaycastPicker
 */
export class TraverserBase extends EventDispatcher
{
	public static entityNames:Array<string> = new Array<string>();
	public static renderableNames:Array<string> = new Array<string>();

	public static addEntityName(name:string):string
	{
		TraverserBase.entityNames.push(name);
		
		return name;
	}

	public static addRenderableName(name:string):string
	{
		TraverserBase.renderableNames.push(name);

		return name;
	}
	
	/**
	 * 
	 */
	constructor()
	{
		super();
		
		var i:number;
		
		//setup defaults for all entity functions
		for (i = 0; i < TraverserBase.entityNames.length; i++)
			if (!this[TraverserBase.entityNames[i]])
				this[TraverserBase.entityNames[i]] = this.applyEntity;
		
		//setup defaults for all renderable functions
		for (i = 0; i < TraverserBase.renderableNames.length; i++)
			if (!this[TraverserBase.renderableNames[i]])
				this[TraverserBase.renderableNames[i]] = this.applyRenderable;
	}

	/**
	 * Returns true if the current node is at least partly in the frustum. If so, the partition node knows to pass on the traverser to its children.
	 *
	 * @param node The Partition3DNode object to frustum-test.
	 */
	public enterNode(node:INode):boolean
	{
		return true;
	}
	
	public dispose():void
	{
		//TODO
	}

	/**
	 *
	 * @param entity
	 */
	public applyEntity(entity:IEntity):void
	{
		//do nothing
	}

	/**
	 *
	 * @param entity
	 */
	public applyRenderable(renderable:IRenderable):void
	{
		//do nothing
	}
}