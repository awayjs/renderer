import {IAssetClass, IAbstractionPool, AbstractMethodError} from "@awayjs/core";

import {Stage, ShaderRegisterCache, ShaderRegisterData} from "@awayjs/stage";

import {IMaterial} from "./IMaterial";
import {_IRender_MaterialClass} from "./_IRender_MaterialClass";
import {_Render_MaterialBase} from "./_Render_MaterialBase";
import {ShaderBase} from "./ShaderBase";

import {RenderGroup} from "../RenderGroup";

/**
 * @class away.pool.MaterialPoolBase
 */
export class _Render_ElementsBase implements IAbstractionPool
{
	private _stage:Stage;
	private _abstractionPool:Object = new Object();
	private _renderMaterialClassPool:Object;
    private _renderGroup:RenderGroup;

	public get stage():Stage
	{
		return this._stage;
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
	constructor(stage:Stage, renderMaterialClassPool:Object, renderGroup:RenderGroup)
	{
		this._stage = stage;
		this._renderMaterialClassPool = renderMaterialClassPool;
		this._renderGroup = renderGroup;
	}

	/**
	 * //TODO
	 *
	 * @param elementsOwner
	 * @returns IElements
	 */
	public getAbstraction(material:IMaterial):_Render_MaterialBase
	{
		return (this._abstractionPool[material.id] || (this._abstractionPool[material.id] = new (<_IRender_MaterialClass> this._renderMaterialClassPool[material.assetType])(material, this)));
	}

	/**
	 * //TODO
	 *
	 * @param elementsOwner
	 */
	public clearAbstraction(material:IMaterial):void
	{
		delete this._abstractionPool[material.id];
	}

    public _includeDependencies(shader:ShaderBase):void
    {
    }

    public _getVertexCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
    {
        return "";
    }

    public _getFragmentCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
    {
        return "";
    }
}