import {IAssetClass, IAsset} from "@awayjs/core";

import {Stage} from "@awayjs/stage";

import {IRenderEntity} from "./base/IRenderEntity";
import {RenderEntity} from "./base/RenderEntity";
import {_IRender_ElementsClass} from "./base/_IRender_ElementsClass";
import {_Render_ElementsBase} from "./base/_Render_ElementsBase";
import { RendererBase } from './RendererBase';

/**
 * @class away.pool.RenderGroup
 */
export class RenderGroup
{
	private static _renderElementsClassPool:Object = new Object();

	private _stage:Stage;
	private _renderMaterialClassPool:Object;
    private _renderer:RendererBase;
	private _materialPools:Object = new Object();
	private _entityGroups:Object = new Object();

	public get stage():Stage
	{
		return this._stage;
	}

	public get renderer():RendererBase
	{
		return this._renderer;
	}

	/**
	 * //TODO
	 *
	 * @param materialClassGL
	 */
	constructor(stage:Stage, renderMaterialClassPool:Object, renderer:RendererBase)
	{
		this._stage = stage;
		this._renderMaterialClassPool = renderMaterialClassPool;
		this._renderer = renderer;
	}

	public getRenderElements(elements:IAsset):_Render_ElementsBase
	{
		return this._materialPools[elements.assetType] || (this._materialPools[elements.assetType] = new (<_IRender_ElementsClass> RenderGroup._renderElementsClassPool[elements.assetType])(this._stage, this._renderMaterialClassPool, this));
	}

	public getRenderEntity(entity:IRenderEntity):RenderEntity
	{
		return this._entityGroups[entity.id] || (this._entityGroups[entity.id] = new RenderEntity(this._stage, entity, this));
	}

    /**
     *
     * @param imageObjectClass
     */
    public static registerElements(renderElementsClass:_IRender_ElementsClass, elementsClass:IAssetClass):void
    {
        RenderGroup._renderElementsClassPool[elementsClass.assetType] = renderElementsClass;
    }
}