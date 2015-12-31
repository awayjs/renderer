import AssetEvent					= require("awayjs-core/lib/events/AssetEvent");

import ContextGLDrawMode			= require("awayjs-stagegl/lib/base/ContextGLDrawMode");
import Stage						= require("awayjs-stagegl/lib/base/Stage");

import CurveSubGeometry				= require("awayjs-display/lib/base/CurveSubGeometry");
import SubGeometryEvent				= require("awayjs-display/lib/events/SubGeometryEvent");

import ShaderBase					= require("awayjs-renderergl/lib/shaders/ShaderBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
import ShaderRegisterElement		= require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");
import SubGeometryVOBase			= require("awayjs-renderergl/lib/vos/SubGeometryVOBase");

/**
 *
 * @class away.pool.CurveSubGeometryVO
 */
class CurveSubGeometryVO extends SubGeometryVOBase
{
	private _curveSubGeometry:CurveSubGeometry;

	constructor(curveSubGeometry:CurveSubGeometry, stage:Stage)
	{
		super(curveSubGeometry, stage);

		this._curveSubGeometry = curveSubGeometry;
	}

	public onClear(event:AssetEvent)
	{
		super.onClear(event);

		this._onClearVertices(new SubGeometryEvent(SubGeometryEvent.CLEAR_VERTICES, this._curveSubGeometry.positions));
		this._onClearVertices(new SubGeometryEvent(SubGeometryEvent.CLEAR_VERTICES, this._curveSubGeometry.curves));
		this._onClearVertices(new SubGeometryEvent(SubGeometryEvent.CLEAR_VERTICES, this._curveSubGeometry.uvs));

		this._curveSubGeometry = null;
	}

	public _render(shader:ShaderBase)
	{
		if (shader.uvBufferIndex >= 0)
			this.activateVertexBufferVO(shader.uvBufferIndex, this._curveSubGeometry.uvs);

		this.activateVertexBufferVO(0, this._curveSubGeometry.positions);
		this.activateVertexBufferVO(1, this._curveSubGeometry.curves);

		super._render(shader);
	}

	public _drawElements(firstIndex:number, numIndices:number)
	{
		this.getIndexBufferVO().draw(ContextGLDrawMode.TRIANGLES, firstIndex, numIndices);
	}

	public _drawArrays(firstVertex:number, numVertices:number)
	{
		this._stage.context.drawVertices(ContextGLDrawMode.TRIANGLES, firstVertex, numVertices);
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
		return new CurveSubGeometryVO(this._curveSubGeometry, this._stage);
	}
}

export = CurveSubGeometryVO;