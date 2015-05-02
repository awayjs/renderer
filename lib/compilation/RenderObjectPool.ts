import IAssetClass					= require("awayjs-core/lib/library/IAssetClass");

import Stage						= require("awayjs-stagegl/lib/base/Stage");

import IRenderObjectOwner			= require("awayjs-display/lib/base/IRenderObjectOwner");
import BasicMaterial				= require("awayjs-display/lib/materials/BasicMaterial");
import Skybox						= require("awayjs-display/lib/entities/Skybox");

import IRenderObjectClass			= require("awayjs-renderergl/lib/compilation/IRenderObjectClass");
import RenderObjectBase				= require("awayjs-renderergl/lib/compilation/RenderObjectBase");
import RenderBasicMaterialObject	= require("awayjs-renderergl/lib/compilation/RenderBasicMaterialObject");
import SkyboxRenderObject			= require("awayjs-renderergl/lib/compilation/SkyboxRenderObject");
import IRenderableClass				= require("awayjs-renderergl/lib/pool/IRenderableClass");
import RenderableBase				= require("awayjs-renderergl/lib/pool/RenderableBase");

/**
 * @class away.pool.RenderObjectPool
 */
class RenderObjectPool
{
	private static _classPool:Object = new Object();
	
	private _pool:Object = new Object();
	private _renderableClass:IRenderableClass;
	private _stage:Stage;
	private _renderObjectClass:IRenderObjectClass;
	
	/**
	 * //TODO
	 *
	 * @param renderObjectClass
	 */
	constructor(renderableClass:IRenderableClass, stage:Stage, renderObjectClass:IRenderObjectClass = null)
	{
		this._renderableClass = renderableClass;
		this._stage = stage;
		this._renderObjectClass = renderObjectClass;
	}

	/**
	 * //TODO
	 *
	 * @param renderableOwner
	 * @returns IRenderable
	 */
	public getItem(renderObjectOwner:IRenderObjectOwner):RenderObjectBase
	{
		return (this._pool[renderObjectOwner.id] || (this._pool[renderObjectOwner.id] = renderObjectOwner._iAddRenderObject(new (this._renderObjectClass || RenderObjectPool.getClass(renderObjectOwner))(this, renderObjectOwner, this._renderableClass, this._stage))))
	}

	/**
	 * //TODO
	 *
	 * @param renderableOwner
	 */
	public disposeItem(renderObjectOwner:IRenderObjectOwner)
	{
		renderObjectOwner._iRemoveRenderObject(this._pool[renderObjectOwner.id]);

		this._pool[renderObjectOwner.id] = null;
	}
	
	/**
	 *
	 * @param imageObjectClass
	 */
	public static registerClass(renderObjectClass:IRenderObjectClass, assetClass:IAssetClass)
	{
		RenderObjectPool._classPool[assetClass.assetType] = renderObjectClass;
	}

	/**
	 *
	 * @param subGeometry
	 */
	public static getClass(renderObjectOwner:IRenderObjectOwner):IRenderObjectClass
	{
		return RenderObjectPool._classPool[renderObjectOwner.assetType];
	}
	

	private static main = RenderObjectPool.addDefaults();

	private static addDefaults()
	{
		RenderObjectPool.registerClass(RenderBasicMaterialObject, BasicMaterial);
		RenderObjectPool.registerClass(SkyboxRenderObject, Skybox);
	}
}

export = RenderObjectPool;