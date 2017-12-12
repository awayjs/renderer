import {IAssetClass, IAsset} from "@awayjs/core";

import {Stage} from "@awayjs/stage";

import {IMaterial} from "./base/IMaterial";
import {IEntity} from "./base/IEntity";
import {IRenderer} from "./base/IRenderer";
import {RenderStatePool} from "./base/RenderStatePool";
import {IMaterialPoolClass} from "./base/IMaterialPoolClass";
import {MaterialStatePool} from "./base/MaterialStatePool";

/**
 * @class away.pool.RenderGroup
 */
export class RenderGroup
{
	private static _materialPoolClassPool:Object = new Object();

	private _stage:Stage;
	private _abstractionClassPool:Object;
    private _renderer:IRenderer;
	private _materialPools:Object = new Object();
	private _RenderStatePools:Object = new Object();

	public get renderer():IRenderer
	{
		return this._renderer;
	}

	/**
	 * //TODO
	 *
	 * @param materialClassGL
	 */
	constructor(stage:Stage, abstractionClassPool:Object, renderer:IRenderer)
	{
		this._stage = stage;
		this._abstractionClassPool = abstractionClassPool;
		this._renderer = renderer;
	}

	public getMaterialStatePool(elements:IAsset):MaterialStatePool
	{
		return this._materialPools[elements.assetType] || (this._materialPools[elements.assetType] = new (<IMaterialPoolClass> RenderGroup._materialPoolClassPool[elements.assetType])(this._stage, this._abstractionClassPool, this));
	}

	public getRenderStatePool(entity:IEntity):RenderStatePool
	{
		return this._RenderStatePools[entity.id] || (this._RenderStatePools[entity.id] = new RenderStatePool(this._stage, entity, this));
	}

    /**
     *
     * @param imageObjectClass
     */
    public static registerMaterialPool(materialPoolClass:IMaterialPoolClass, elementsClass:IAssetClass):void
    {
        RenderGroup._materialPoolClassPool[elementsClass.assetType] = materialPoolClass;
    }
}