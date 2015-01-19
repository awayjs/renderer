import IRenderObjectOwner			= require("awayjs-display/lib/base/IRenderObjectOwner");

import Stage						= require("awayjs-stagegl/lib/base/Stage");

import IRenderObjectClass			= require("awayjs-renderergl/lib/compilation/IRenderObjectClass");
import RenderObjectBase				= require("awayjs-renderergl/lib/compilation/RenderObjectBase");
import IRenderableClass				= require("awayjs-renderergl/lib/pool/IRenderableClass");
import RenderableBase				= require("awayjs-renderergl/lib/pool/RenderableBase");

/**
 * @class away.pool.RenderObjectPool
 */
class RenderObjectPool
{
	private _renderObjectPool:Object = new Object();
	private _renderObjectClass:IRenderObjectClass;
	private _renderableClass:IRenderableClass;
	private _stage:Stage;

	/**
	 * //TODO
	 *
	 * @param renderObjectClass
	 */
	constructor(renderObjectClass:IRenderObjectClass, renderableClass:IRenderableClass, stage:Stage)
	{
		this._renderObjectClass = renderObjectClass;
		this._renderableClass = renderableClass;
		this._stage = stage;
	}

	/**
	 * //TODO
	 *
	 * @param renderableOwner
	 * @returns IRenderable
	 */
	public getItem(renderObjectOwner:IRenderObjectOwner):RenderObjectBase
	{
		return (this._renderObjectPool[renderObjectOwner.id] || (this._renderObjectPool[renderObjectOwner.id] = renderObjectOwner._iAddRenderObject(new this._renderObjectClass(this, renderObjectOwner, this._renderableClass, this._stage))))
	}

	/**
	 * //TODO
	 *
	 * @param renderableOwner
	 */
	public disposeItem(renderObjectOwner:IRenderObjectOwner)
	{
		renderObjectOwner._iRemoveRenderObject(this._renderObjectPool[renderObjectOwner.id]);

		this._renderObjectPool[renderObjectOwner.id] = null;
	}
}

export = RenderObjectPool;