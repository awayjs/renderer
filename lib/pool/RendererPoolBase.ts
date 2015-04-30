
import LineSubMesh					= require("awayjs-display/lib/base/LineSubMesh");
import TriangleSubMesh				= require("awayjs-display/lib/base/TriangleSubMesh");
import CurveSubMesh			    	= require("awayjs-display/lib/base/CurveSubMesh");
import IRendererPool				= require("awayjs-display/lib/pool/IRendererPool");
import Billboard					= require("awayjs-display/lib/entities/Billboard");
import LineSegment					= require("awayjs-display/lib/entities/LineSegment");
import Skybox						= require("awayjs-display/lib/entities/Skybox");

import Stage						= require("awayjs-stagegl/lib/base/Stage");

import RendererBase					= require("awayjs-renderergl/lib/RendererBase");
import BillboardRenderable			= require("awayjs-renderergl/lib/pool/BillboardRenderable");
import LineSegmentRenderable		= require("awayjs-renderergl/lib/pool/LineSegmentRenderable");
import LineSubMeshRenderable		= require("awayjs-renderergl/lib/pool/LineSubMeshRenderable");
import TriangleSubMeshRenderable	= require("awayjs-renderergl/lib/pool/TriangleSubMeshRenderable");
import CurveSubMeshRenderable	    = require("awayjs-renderergl/lib/pool/CurveSubMeshRenderable");
import RenderablePoolBase			= require("awayjs-renderergl/lib/pool/RenderablePoolBase");

/**
 * RendererPoolBase forms an abstract base class for classes that are used in the rendering pipeline to render the
 * contents of a partition
 *
 * @class away.render.RendererPoolBase
 */
class RendererPoolBase implements IRendererPool
{
	public _billboardRenderablePool:RenderablePoolBase;
	public _lineSegmentRenderablePool:RenderablePoolBase;
	public _triangleSubMeshRenderablePool:RenderablePoolBase;
	public _lineSubMeshRenderablePool:RenderablePoolBase;
    public _curveSubMeshRenderablePool:RenderablePoolBase;

	public _pStage:Stage;


	private _renderer:RendererBase;
	
	/**
	 * Creates a new RendererPoolBase object.
	 */
	constructor(renderer:RendererBase)
	{
		this._renderer = renderer;
	}

	/**
	 * The Stage that will provide the ContextGL used for rendering.
	 */
	public get stage():Stage
	{
		return this._pStage;
	}

	public set stage(value:Stage)
	{
		if (this._pStage == value)
			return;

		if (this._pStage)
			this.dispose();

		this._pStage = value;

		if (this._pStage)
			this._pUpdatePool();
	}

	public _pUpdatePool()
	{
		this._billboardRenderablePool = RenderablePoolBase.getPool(BillboardRenderable, this._pStage);
		this._lineSegmentRenderablePool = RenderablePoolBase.getPool(LineSegmentRenderable, this._pStage);
		this._triangleSubMeshRenderablePool = RenderablePoolBase.getPool(TriangleSubMeshRenderable, this._pStage);
		this._lineSubMeshRenderablePool = RenderablePoolBase.getPool(LineSubMeshRenderable, this._pStage);
        this._curveSubMeshRenderablePool = RenderablePoolBase.getPool(CurveSubMeshRenderable, this._pStage);
	}

	/**
	 * Disposes the resources used by the RendererPoolBase.
	 */
	public dispose()
	{
		this._billboardRenderablePool.dispose();
		this._billboardRenderablePool = null;

		this._lineSegmentRenderablePool.dispose();
		this._lineSegmentRenderablePool = null;

		this._triangleSubMeshRenderablePool.dispose();
		this._triangleSubMeshRenderablePool = null;

		this._lineSubMeshRenderablePool.dispose();
		this._lineSubMeshRenderablePool = null;

        this._curveSubMeshRenderablePool.dispose();
        this._curveSubMeshRenderablePool = null;
	}

	/**
	 *
	 * @param billboard
	 * @protected
	 */
	public applyBillboard(billboard:Billboard)
	{
		this._renderer.applyRenderable(this._billboardRenderablePool.getItem(billboard));
	}

	/**
	 *
	 * @param lineSubMesh
	 */
	public applyLineSegment(lineSegment:LineSegment)
	{
		this._renderer.applyRenderable(this._lineSegmentRenderablePool.getItem(lineSegment));
	}

	/**
	 *
	 * @param triangleSubMesh
	 */
	public applyTriangleSubMesh(triangleSubMesh:TriangleSubMesh)
	{
		this._renderer.applyRenderable(this._triangleSubMeshRenderablePool.getItem(triangleSubMesh));
	}
    /**
     *
     * @param curveSubMesh
     */
    public applyCurveSubMesh(curveSubMesh:CurveSubMesh)
    {
        this._renderer.applyRenderable(this._curveSubMeshRenderablePool.getItem(curveSubMesh));
    }
	/**
	 *
	 * @param lineSubMesh
	 */
	public applyLineSubMesh(lineSubMesh:LineSubMesh)
	{
		this._renderer.applyRenderable(this._lineSubMeshRenderablePool.getItem(lineSubMesh));
	}
}

export = RendererPoolBase;