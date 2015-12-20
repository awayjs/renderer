import AssetEvent					= require("awayjs-core/lib/events/AssetEvent");
import IAssetClass					= require("awayjs-core/lib/library/IAssetClass");

import ContextGLDrawMode			= require("awayjs-stagegl/lib/base/ContextGLDrawMode");
import Stage						= require("awayjs-stagegl/lib/base/Stage");

import LineSubGeometry				= require("awayjs-display/lib/base/LineSubGeometry");
import SubGeometryEvent				= require("awayjs-display/lib/events/SubGeometryEvent");

import ShaderBase					= require("awayjs-renderergl/lib/shaders/ShaderBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
import ShaderRegisterElement		= require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");
import SubGeometryVOBase			= require("awayjs-renderergl/lib/vos/SubGeometryVOBase");

/**
 *
 * @class away.pool.LineSubGeometryVO
 */
class LineSubGeometryVO extends SubGeometryVOBase
{
	/**
	 *
	 */
	public static assetClass:IAssetClass = LineSubGeometry;

	private _lineSubGeometry:LineSubGeometry;

	constructor(lineSubGeometry:LineSubGeometry, stage:Stage)
	{
		super(lineSubGeometry, stage);

		this._lineSubGeometry = lineSubGeometry;
	}

	public onClear(event:AssetEvent)
	{
		super.onClear(event);

		this._onClearVertices(new SubGeometryEvent(SubGeometryEvent.CLEAR_VERTICES, this._lineSubGeometry.positions));
		this._onClearVertices(new SubGeometryEvent(SubGeometryEvent.CLEAR_VERTICES, this._lineSubGeometry.thickness));
		this._onClearVertices(new SubGeometryEvent(SubGeometryEvent.CLEAR_VERTICES, this._lineSubGeometry.colors));

		this._lineSubGeometry = null;
	}

	public _render(shader:ShaderBase)
	{
		if (shader.colorBufferIndex >= 0)
			this.activateVertexBufferVO(shader.colorBufferIndex, this._lineSubGeometry.colors);

		this.activateVertexBufferVO(0, this._lineSubGeometry.positions, 3);
		this.activateVertexBufferVO(1, this._lineSubGeometry.positions, 3, 12);
		this.activateVertexBufferVO(2, this._lineSubGeometry.thickness);

		super._render(shader);
	}

	public _drawElements(firstIndex:number, numIndices:number)
	{
		this.getIndexBufferVO().draw(ContextGLDrawMode.TRIANGLES, 0, numIndices);
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
	 * @returns {away.pool.LineSubMeshRenderable}
	 * @protected
	 */
	public _pGetOverflowSubGeometry():SubGeometryVOBase
	{
		return new LineSubGeometryVO(this._lineSubGeometry, this._stage);
	}
}

export = LineSubGeometryVO;