import IRenderableOwner				= require("awayjs-display/lib/base/IRenderableOwner");
import LineSubMesh					= require("awayjs-display/lib/base/LineSubMesh");
import TriangleSubMesh				= require("awayjs-display/lib/base/TriangleSubMesh");
import CurveSubMesh			    	= require("awayjs-display/lib/base/CurveSubMesh");
import Billboard					= require("awayjs-display/lib/entities/Billboard");
import LineSegment					= require("awayjs-display/lib/entities/LineSegment");
import Skybox						= require("awayjs-display/lib/entities/Skybox");

import Stage						= require("awayjs-stagegl/lib/base/Stage");

import RendererBase					= require("awayjs-renderergl/lib/RendererBase");
import IRenderObjectClass			= require("awayjs-renderergl/lib/compilation/IRenderObjectClass");
import RenderObjectPool				= require("awayjs-renderergl/lib/compilation/RenderObjectPool");
import IRenderableClass				= require("awayjs-renderergl/lib/pool/IRenderableClass");
import RenderableBase				= require("awayjs-renderergl/lib/pool/RenderableBase");
import BillboardRenderable			= require("awayjs-renderergl/lib/pool/BillboardRenderable");
import LineSegmentRenderable		= require("awayjs-renderergl/lib/pool/LineSegmentRenderable");
import LineSubMeshRenderable		= require("awayjs-renderergl/lib/pool/LineSubMeshRenderable");
import TriangleSubMeshRenderable	= require("awayjs-renderergl/lib/pool/TriangleSubMeshRenderable");
import CurveSubMeshRenderable	    = require("awayjs-renderergl/lib/pool/CurveSubMeshRenderable");
import SkyboxRenderable			    = require("awayjs-renderergl/lib/pool/SkyboxRenderable");

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
	 * @param renderObjectClass
	 */
	constructor(stage:Stage, renderObjectClass:IRenderObjectClass = null)
	{
		this._stage = stage;

		for (var i in RenderablePool._classPool)
			this._objectPools[i] = new RenderObjectPool(RenderablePool._classPool[i], this._stage, renderObjectClass);
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
	 * @returns RenderObjectPool
	 */
	public getRenderObjectPool(renderableOwner:IRenderableOwner):RenderObjectPool
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