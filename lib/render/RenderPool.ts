import IAssetClass					= require("awayjs-core/lib/library/IAssetClass");

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
class RenderPool
{
	private static _classPool:Object = new Object();
	
	private _pool:Object = new Object();
	private _renderableClass:IRenderableClass;
	private _stage:Stage;
	private _renderClass:IRenderClass;
	
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
	public getItem(renderOwner:IRenderOwner):RenderBase
	{
		return (this._pool[renderOwner.id] || (this._pool[renderOwner.id] = renderOwner._iAddRender(new (this._renderClass || RenderPool.getClass(renderOwner))(this, renderOwner, this._renderableClass, this._stage))))
	}

	/**
	 * //TODO
	 *
	 * @param renderableOwner
	 */
	public disposeItem(renderOwner:IRenderOwner)
	{
		renderOwner._iRemoveRender(this._pool[renderOwner.id]);

		delete this._pool[renderOwner.id];
	}
	
	/**
	 *
	 * @param imageObjectClass
	 */
	public static registerClass(renderClass:IRenderClass, assetClass:IAssetClass)
	{
		RenderPool._classPool[assetClass.assetType] = renderClass;
	}

	/**
	 *
	 * @param subGeometry
	 */
	public static getClass(renderOwner:IRenderOwner):IRenderClass
	{
		return RenderPool._classPool[renderOwner.assetType];
	}
	

	private static main = RenderPool.addDefaults();

	private static addDefaults()
	{
		RenderPool.registerClass(BasicMaterialRender, BasicMaterial);
		RenderPool.registerClass(SkyboxRender, Skybox);
	}
}

export = RenderPool;