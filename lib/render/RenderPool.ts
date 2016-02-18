import IAssetClass					= require("awayjs-core/lib/library/IAssetClass");
import IAbstractionPool				= require("awayjs-core/lib/library/IAbstractionPool");

import Stage						= require("awayjs-stagegl/lib/base/Stage");

import IRenderOwner					= require("awayjs-display/lib/base/IRenderOwner");
import BasicMaterial				= require("awayjs-display/lib/materials/BasicMaterial");
import Skybox						= require("awayjs-display/lib/entities/Skybox");

import IElementsClassGL				= require("awayjs-renderergl/lib/elements/IElementsClassGL");
import BasicMaterialRender			= require("awayjs-renderergl/lib/render/BasicMaterialRender");
import IRenderClass					= require("awayjs-renderergl/lib/render/IRenderClass");
import RenderBase					= require("awayjs-renderergl/lib/render/RenderBase");
import SkyboxRender					= require("awayjs-renderergl/lib/render/SkyboxRender");

/**
 * @class away.pool.RenderPool
 */
class RenderPool implements IAbstractionPool
{
	private static _abstractionClassPool:Object = new Object();

	private _abstractionPool:Object = new Object();
	private _elementsClass:IElementsClassGL;
	private _stage:Stage;
	private _renderClass:IRenderClass;

	get stage():Stage
	{
		return this._stage;
	}

	/**
	 * //TODO
	 *
	 * @param renderClass
	 */
	constructor(elementsClass:IElementsClassGL, stage:Stage, renderClass:IRenderClass = null)
	{
		this._elementsClass = elementsClass;
		this._stage = stage;
		this._renderClass = renderClass;
	}

	/**
	 * //TODO
	 *
	 * @param elementsOwner
	 * @returns IElements
	 */
	public getAbstraction(renderOwner:IRenderOwner):RenderBase
	{
		return (this._abstractionPool[renderOwner.id] || (this._abstractionPool[renderOwner.id] = new (<IRenderClass> this._renderClass || RenderPool._abstractionClassPool[renderOwner.assetType])(renderOwner, this._elementsClass, this)));
	}

	/**
	 * //TODO
	 *
	 * @param elementsOwner
	 */
	public clearAbstraction(renderOwner:IRenderOwner)
	{
		delete this._abstractionPool[renderOwner.id];
	}

	/**
	 *
	 * @param imageObjectClass
	 */
	public static registerAbstraction(renderClass:IRenderClass, assetClass:IAssetClass)
	{
		RenderPool._abstractionClassPool[assetClass.assetType] = renderClass;
	}
}

export = RenderPool;