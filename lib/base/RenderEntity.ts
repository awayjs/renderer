import {IAssetClass, IAbstractionPool} from "@awayjs/core";

import {Stage} from "@awayjs/stage";

import {IRenderEntity} from "./IRenderEntity";
import {_IRender_RenderableClass} from "./_IRender_RenderableClass";
import {_Render_RenderableBase} from "./_Render_RenderableBase";

import {RenderGroup} from "../RenderGroup";
import { ITraversable } from '@awayjs/view';

/**
 * @class away.pool.RenderEntity
 */
export class RenderEntity implements IAbstractionPool
{
	private static _renderRenderableClassPool:Object = new Object();

	private _abstractionPool:Object = new Object();
    private _stage:Stage;
	private _entity:IRenderEntity;
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
     * @returns {IRenderEntity}
     */
    public get entity():IRenderEntity
    {
        return this._entity;
    }

    /**
     *
     * @returns {IRenderEntity}
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
	constructor(stage:Stage, entity:IRenderEntity, renderGroup:RenderGroup)
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
	public getAbstraction(renderable:ITraversable):_Render_RenderableBase
	{
		return this._abstractionPool[renderable.id] || (this._abstractionPool[renderable.id] = new (<_IRender_RenderableClass> RenderEntity._renderRenderableClassPool[renderable.assetType])(renderable, this));
	}
	
	/**
	 *
	 * @param renderable
	 */
	public clearAbstraction(renderable:ITraversable):void
	{
		delete this._abstractionPool[renderable.id];
	}

	/**
	 *
	 * @param imageObjectClass
	 */
	public static registerRenderable(renderStateClass:_IRender_RenderableClass, assetClass:IAssetClass):void
	{
		RenderEntity._renderRenderableClassPool[assetClass.assetType] = renderStateClass;
	}
}