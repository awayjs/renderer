import IRenderObjectOwner			= require("awayjs-display/lib/base/IRenderObjectOwner");
import IRenderableOwner				= require("awayjs-display/lib/base/IRenderableOwner");
import MaterialBase					= require("awayjs-display/lib/materials/MaterialBase");
import IRenderablePool				= require("awayjs-display/lib/pool/IRenderablePool");
import IRenderObject				= require("awayjs-display/lib/pool/IRenderObject");

import Stage						= require("awayjs-stagegl/lib/base/Stage");

import RendererBase					= require("awayjs-renderergl/lib/base/RendererBase");
import RenderableBase				= require("awayjs-renderergl/lib/pool/RenderableBase");
import IRenderableClass				= require("awayjs-renderergl/lib/pool/IRenderableClass");
import RenderObjectPool				= require("awayjs-renderergl/lib/compilation/RenderObjectPool");
import RenderBasicMaterialObject	= require("awayjs-renderergl/lib/compilation/RenderBasicMaterialObject");
import SkyboxRenderObject			= require("awayjs-renderergl/lib/compilation/SkyboxRenderObject");
import DepthRenderObject			= require("awayjs-renderergl/lib/compilation/DepthRenderObject");
import DistanceRenderObject			= require("awayjs-renderergl/lib/compilation/DistanceRenderObject");
import RenderObjectBase				= require("awayjs-renderergl/lib/compilation/RenderObjectBase");

/**
 * @class away.pool.RenderablePool
 */
class RenderablePool implements IRenderablePool
{
	private static _pools:Object = new Object();

	private _stage:Stage;
	private _renderablePool:Object = new Object();
	private _renderableClass:IRenderableClass;

	private _materialRenderObjectPool:RenderObjectPool;
	private _skyboxRenderObjectPool:RenderObjectPool;
	private _depthRenderObjectPool:RenderObjectPool;
	private _distanceRenderObjectPool:RenderObjectPool;

	/**
	 * //TODO
	 *
	 * @param renderableClass
	 */
	constructor(renderableClass:IRenderableClass, stage:Stage)
	{
		this._renderableClass = renderableClass;
		this._stage = stage;

		this._materialRenderObjectPool = new RenderObjectPool(RenderBasicMaterialObject, this._renderableClass, this._stage);
		this._skyboxRenderObjectPool = new RenderObjectPool(SkyboxRenderObject, this._renderableClass, this._stage);
		this._depthRenderObjectPool = new RenderObjectPool(DepthRenderObject, this._renderableClass, this._stage);
		this._distanceRenderObjectPool = new RenderObjectPool(DistanceRenderObject, this._renderableClass, this._stage);
	}

	/**
	 * //TODO
	 *
	 * @param renderableOwner
	 * @returns IRenderable
	 */
	public getItem(renderableOwner:IRenderableOwner):RenderableBase
	{
		return (this._renderablePool[renderableOwner.id] || (this._renderablePool[renderableOwner.id] = renderableOwner._iAddRenderable(new this._renderableClass(this, renderableOwner, this._stage))))
	}

	/**
	 *
	 * @param material
	 * @param renderable
	 */
	public getMaterialRenderObject(renderObjectOwner:IRenderObjectOwner):RenderObjectBase
	{
		return this._materialRenderObjectPool.getItem(renderObjectOwner);
	}

	/**
	 *
	 * @param material
	 * @param renderable
	 */
	public getSkyboxRenderObject(renderObjectOwner:IRenderObjectOwner):RenderObjectBase
	{
		return this._skyboxRenderObjectPool.getItem(renderObjectOwner);
	}

	/**
	 *
	 * @param material
	 * @param renderable
	 */
	public getDepthRenderObject(renderObjectOwner:IRenderObjectOwner):RenderObjectBase
	{
		return this._depthRenderObjectPool.getItem(renderObjectOwner);
	}

	/**
	 *
	 * @param material
	 * @param renderable
	 */
	public getDistanceRenderObject(renderObjectOwner:IRenderObjectOwner):RenderObjectBase
	{
		return this._distanceRenderObjectPool.getItem(renderObjectOwner);
	}

	/**
	 * //TODO
	 *
	 * @param renderableOwner
	 */
	public disposeItem(renderableOwner:IRenderableOwner)
	{
		renderableOwner._iRemoveRenderable(this._renderablePool[renderableOwner.id]);

		this._renderablePool[renderableOwner.id] = null;
	}

	public dispose()
	{
		for (var id in this._renderablePool)
			this._renderablePool[id].dispose();

		RenderablePool.disposePool(this._renderableClass, this._stage);
	}

	/**
	 * //TODO
	 *
	 * @param renderableClass
	 * @returns RenderablePool
	 */
	public static getPool(renderableClass:IRenderableClass, stage:Stage):RenderablePool
	{
		var pools:Object = (RenderablePool._pools[stage.stageIndex] || (RenderablePool._pools[stage.stageIndex] = new Object()));

		return (pools[renderableClass.id] || (pools[renderableClass.id] = new RenderablePool(renderableClass, stage)));
	}

	/**
	 * //TODO
	 *
	 * @param renderableClass
	 */
	public static disposePool(renderableClass:IRenderableClass, stage:Stage)
	{
		var pools:Object = RenderablePool._pools[stage.stageIndex];

		if (pools == undefined)
			return;

		if (pools[renderableClass.id])
			pools[renderableClass.id] = undefined;
	}
}

export = RenderablePool;