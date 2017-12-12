import {IAssetClass, IAbstractionPool} from "@awayjs/core";

import {Stage} from "@awayjs/stage";

import {IEntity} from "./IEntity";
import {IRenderable} from "./IRenderable";
import {IRenderStateClass} from "./IRenderStateClass";
import {RenderStateBase} from "./RenderStateBase";

import {RenderGroup} from "../RenderGroup";

/**
 * @class away.pool.RenderStatePool
 */
export class RenderStatePool implements IAbstractionPool
{
	private static _abstractionClassPool:Object = new Object();

	private _abstractionPool:Object = new Object();
    private _stage:Stage;
	private _entity:IEntity;
	private _renderGroup:RenderGroup;


	/**
	 *
	 * @returns {RenderGroup}
	 */
	public get stage():Stage
	{
		return this._stage;
	}

    /**
     *
     * @returns {IEntity}
     */
    public get entity():IEntity
    {
        return this._entity;
    }

    /**
     *
     * @returns {IEntity}
     */
    public get renderGroup():RenderGroup
    {
        return this._renderGroup;
    }

	/**
	 * //TODO
	 *
	 * @param materialClassGL
	 */
	constructor(stage:Stage, entity:IEntity, renderGroup:RenderGroup)
	{
        this._stage = stage;
		this._entity = entity;
        this._renderGroup = renderGroup;
	}

	/**
	 * //TODO
	 *
	 * @param renderable
	 * @returns IRenderState
	 */
	public getAbstraction(renderable:IRenderable):RenderStateBase
	{
		return this._abstractionPool[renderable.id] || (this._abstractionPool[renderable.id] = new (<IRenderStateClass> RenderStatePool._abstractionClassPool[renderable.assetType])(renderable, this));
	}
	
	/**
	 *
	 * @param renderable
	 */
	public clearAbstraction(renderable:IRenderable):void
	{
		this._abstractionPool[renderable.id] = null;
	}

	/**
	 *
	 * @param imageObjectClass
	 */
	public static registerAbstraction(renderStateClass:IRenderStateClass, assetClass:IAssetClass):void
	{
		RenderStatePool._abstractionClassPool[assetClass.assetType] = renderStateClass;
	}
}