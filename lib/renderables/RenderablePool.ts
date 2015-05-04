import IRenderableOwner				= require("awayjs-display/lib/base/IRenderableOwner");
import LineSubMesh					= require("awayjs-display/lib/base/LineSubMesh");
import TriangleSubMesh				= require("awayjs-display/lib/base/TriangleSubMesh");
import CurveSubMesh			    	= require("awayjs-display/lib/base/CurveSubMesh");
import Billboard					= require("awayjs-display/lib/entities/Billboard");
import LineSegment					= require("awayjs-display/lib/entities/LineSegment");
import Skybox						= require("awayjs-display/lib/entities/Skybox");

import Stage						= require("awayjs-stagegl/lib/base/Stage");

import RendererBase					= require("awayjs-renderergl/lib/RendererBase");
import IRenderClass					= require("awayjs-renderergl/lib/render/IRenderClass");
import RenderPool					= require("awayjs-renderergl/lib/render/RenderPool");
import BillboardRenderable			= require("awayjs-renderergl/lib/renderables/BillboardRenderable");
import IRenderableClass				= require("awayjs-renderergl/lib/renderables/IRenderableClass");
import LineSegmentRenderable		= require("awayjs-renderergl/lib/renderables/LineSegmentRenderable");
import LineSubMeshRenderable		= require("awayjs-renderergl/lib/renderables/LineSubMeshRenderable");
import CurveSubMeshRenderable	    = require("awayjs-renderergl/lib/renderables/CurveSubMeshRenderable");
import RenderableBase				= require("awayjs-renderergl/lib/renderables/RenderableBase");
import SkyboxRenderable			    = require("awayjs-renderergl/lib/renderables/SkyboxRenderable");
import TriangleSubMeshRenderable	= require("awayjs-renderergl/lib/renderables/TriangleSubMeshRenderable");

/**
 * RenderablePool forms an abstract base class for classes that are used in the rendering pipeline to render the
 * contents of a partition
 *
 * @class away.render.RenderablePool
 */
class RenderablePool
{
	private static _classPool:Object = new Object();

	private _stage:Stage;
	private _pool:Object = new Object();

	private _objectPools:Object = new Object();
	
	/**
	 * Creates a new RenderablePool object.
	 *
	 * @param stage
	 * @param renderClass
	 */
	constructor(stage:Stage, renderClass:IRenderClass = null)
	{
		this._stage = stage;

		for (var i in RenderablePool._classPool)
			this._objectPools[i] = new RenderPool(RenderablePool._classPool[i], this._stage, renderClass);
	}

	/**
	 * //TODO
	 *
	 * @param renderableOwner
	 * @returns IRenderable
	 */
	public getItem(renderableOwner:IRenderableOwner):RenderableBase
	{
		return this._pool[renderableOwner.id] || (this._pool[renderableOwner.id] = renderableOwner._iAddRenderable(new (RenderablePool.getClass(renderableOwner))(this, renderableOwner, this._stage)));
	}

	/**
	 *
	 * @param image
	 */
	public disposeItem(renderableOwner:IRenderableOwner)
	{
		renderableOwner._iRemoveRenderable(this._pool[renderableOwner.id]);

		this._pool[renderableOwner.id] = null;
	}

	/**
	 * //TODO
	 *
	 * @param renderableClass
	 * @returns RenderPool
	 */
	public getRenderPool(renderableOwner:IRenderableOwner):RenderPool
	{
		return this._objectPools[renderableOwner.assetType];
	}

	/**
	 *
	 * @param imageObjectClass
	 */
	public static registerClass(renderableClass:IRenderableClass)
	{
		RenderablePool._classPool[renderableClass.assetClass.assetType] = renderableClass;
	}

	/**
	 *
	 * @param subGeometry
	 */
	public static getClass(renderableOwner:IRenderableOwner):IRenderableClass
	{
		return RenderablePool._classPool[renderableOwner.assetType];
	}

	/**
	 * Disposes the resources used by the RenderablePool.
	 */
	public dispose()
	{
		for (var id in this._pool)
			this._pool[id].dispose();

		this._pool = null;
	}


	private static main = RenderablePool.addDefaults();

	private static addDefaults()
	{
		RenderablePool.registerClass(BillboardRenderable);
		RenderablePool.registerClass(LineSegmentRenderable);
		RenderablePool.registerClass(LineSubMeshRenderable);
		RenderablePool.registerClass(TriangleSubMeshRenderable);
		RenderablePool.registerClass(CurveSubMeshRenderable);
		RenderablePool.registerClass(SkyboxRenderable);
	}
}

export = RenderablePool;