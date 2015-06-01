import IAssetClass					= require("awayjs-core/lib/library/IAssetClass");

import Stage						= require("awayjs-stagegl/lib/base/Stage");

import CurveSubGeometry				= require("awayjs-display/lib/base/CurveSubGeometry");

import ShaderBase					= require("awayjs-renderergl/lib/shaders/ShaderBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
import ShaderRegisterElement		= require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");
import SubGeometryVOPool			= require("awayjs-renderergl/lib/vos/SubGeometryVOPool");
import SubGeometryVOBase			= require("awayjs-renderergl/lib/vos/SubGeometryVOBase");

/**
 *
 * @class away.pool.CurveSubGeometryVO
 */
class CurveSubGeometryVO extends SubGeometryVOBase
{
	/**
	 *
	 */
	public static assetClass:IAssetClass = CurveSubGeometry;

	private _curveSubGeometry:CurveSubGeometry;

	constructor(pool:SubGeometryVOPool, curveSubGeometry:CurveSubGeometry)
	{
		super(pool, curveSubGeometry);

		this._curveSubGeometry = curveSubGeometry;

		this.invalidateVertices(this._curveSubGeometry.positions);
		this.invalidateVertices(this._curveSubGeometry.curves);
		this.invalidateVertices(this._curveSubGeometry.uvs);
	}

	public _render(shader:ShaderBase, stage:Stage)
	{
		if (shader.uvBufferIndex >= 0)
			this.activateVertexBufferVO(shader.uvBufferIndex, this._curveSubGeometry.uvs, stage);

		this.activateVertexBufferVO(0, this._curveSubGeometry.positions, stage);
		this.activateVertexBufferVO(1, this._curveSubGeometry.curves, stage);

		super._render(shader, stage);
	}


	/**
	 * //TODO
	 *
	 * @param pool
	 * @param renderableOwner
	 * @param level
	 * @param indexOffset
	 * @returns {away.pool.CurveSubMeshRenderable}
	 * @protected
	 */
	public _pGetOverflowSubGeometry():SubGeometryVOBase
	{
		return new CurveSubGeometryVO(this._pool, this._curveSubGeometry);
	}
}

export = CurveSubGeometryVO;