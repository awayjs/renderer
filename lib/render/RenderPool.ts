import IAssetClass					= require("awayjs-core/lib/library/IAssetClass");
import IAbstractionPool				= require("awayjs-core/lib/library/IAbstractionPool");

import Stage						= require("awayjs-stagegl/lib/base/Stage");

import IRenderOwner					= require("awayjs-display/lib/base/IRenderOwner");
import BasicMaterial				= require("awayjs-display/lib/materials/BasicMaterial");
import Skybox						= require("awayjs-display/lib/entities/Skybox");

import IRenderableClass				= require("awayjs-renderergl/lib/renderables/IRenderableClass");
import RenderableBase				= require("awayjs-renderergl/lib/renderables/RenderableBase");
import BasicMaterialRender			= require("awayjs-renderergl/lib/render/BasicMaterialRender");
import IRenderClass					= require("awayjs-renderergl/lib/render/IRenderClass");
import RenderBase					= require("awayjs-renderergl/lib/render/RenderBase");
import SkyboxRender					= require("awayjs-renderergl/lib/render/SkyboxRender");

/**
 * @class away.pool.RenderPool
 */
class RenderPool implements IAbstractionPool
{
	private static _abstractionPool:Object = new Object();
	
	private _pool:Object = new Object();
	private _renderableClass:IRenderableClass;
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
	constructor(renderableClass:IRenderableClass, stage:Stage, renderClass:IRenderClass = null)
	{
		this._renderableClass = renderableClass;
		this._stage = stage;
		this._renderClass = renderClass;
	}

	/**
	 * //TODO
	 *
	 * @param renderableOwner
	 * @returns IRenderable
	 */
	public getAbstraction(renderOwner:IRenderOwner):RenderBase
	{
		return (this._pool[renderOwner.id] || (this._pool[renderOwner.id] = new (<IRenderClass> this._renderClass || RenderPool._abstractionPool[renderOwner.assetType])(renderOwner, this._renderableClass, this)));
	}

	/**
	 * //TODO
	 *
	 * @param renderableOwner
	 */
	public clearAbstraction(renderOwner:IRenderOwner)
	{
		delete this._pool[renderOwner.id];
	}
	
	/**
	 *
	 * @param imageObjectClass
	 */
	public static registerAbstraction(renderClass:IRenderClass, assetClass:IAssetClass)
	{
		RenderPool._abstractionPool[assetClass.assetType] = renderClass;
	}

	/**
	 *
	 * @param subGeometry
	 */
	public static getClass(renderOwner:IRenderOwner):IRenderClass
	{
		return RenderPool._abstractionPool[renderOwner.assetType];
	}
}

export = RenderPool;