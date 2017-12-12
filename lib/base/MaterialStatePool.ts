import {IAssetClass, IAbstractionPool, AbstractMethodError} from "@awayjs/core";

import {Stage, ShaderRegisterCache, ShaderRegisterData} from "@awayjs/stage";

import {IMaterial} from "./IMaterial";
import {IMaterialStateClass} from "./IMaterialStateClass";
import {MaterialStateBase} from "./MaterialStateBase";
import {ShaderBase} from "./ShaderBase";

import {RenderGroup} from "../RenderGroup";

/**
 * @class away.pool.MaterialPoolBase
 */
export class MaterialStatePool implements IAbstractionPool
{
	private _stage:Stage;
	private _abstractionPool:Object = new Object();
	private _abstractionClassPool:Object;
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
	constructor(stage:Stage, abstractionClassPool:Object, renderGroup:RenderGroup)
	{
		this._stage = stage;
		this._abstractionClassPool = abstractionClassPool;
		this._renderGroup = renderGroup;
	}

	/**
	 * //TODO
	 *
	 * @param elementsOwner
	 * @returns IElements
	 */
	public getAbstraction(material:IMaterial):MaterialStateBase
	{
		return (this._abstractionPool[material.id] || (this._abstractionPool[material.id] = new (<IMaterialStateClass> this._abstractionClassPool[material.assetType])(material, this)));
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