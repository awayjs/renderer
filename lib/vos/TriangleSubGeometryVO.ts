import AssetEvent					= require("awayjs-core/lib/events/AssetEvent");

import ContextGLDrawMode			= require("awayjs-stagegl/lib/base/ContextGLDrawMode");
import Stage						= require("awayjs-stagegl/lib/base/Stage");

import TriangleSubGeometry			= require("awayjs-display/lib/base/TriangleSubGeometry");

import SubGeometryEvent				= require("awayjs-display/lib/events/SubGeometryEvent");

import ShaderBase					= require("awayjs-renderergl/lib/shaders/ShaderBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
import ShaderRegisterElement		= require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");
import SubGeometryVOBase			= require("awayjs-renderergl/lib/vos/SubGeometryVOBase");

/**
 *
 * @class away.pool.TriangleSubGeometryVO
 */
class TriangleSubGeometryVO extends SubGeometryVOBase
{
	private _triangleSubGeometry:TriangleSubGeometry;

	constructor(triangleSubGeometry:TriangleSubGeometry, stage:Stage)
	{
		super(triangleSubGeometry, stage);

		this._triangleSubGeometry = triangleSubGeometry;
	}

	public onClear(event:AssetEvent)
	{
		super.onClear(event);

		this._onClearVertices(new SubGeometryEvent(SubGeometryEvent.CLEAR_VERTICES, this._triangleSubGeometry.positions));
		this._onClearVertices(new SubGeometryEvent(SubGeometryEvent.CLEAR_VERTICES, this._triangleSubGeometry.normals));
		this._onClearVertices(new SubGeometryEvent(SubGeometryEvent.CLEAR_VERTICES, this._triangleSubGeometry.tangents));
		this._onClearVertices(new SubGeometryEvent(SubGeometryEvent.CLEAR_VERTICES, this._triangleSubGeometry.uvs));
		this._onClearVertices(new SubGeometryEvent(SubGeometryEvent.CLEAR_VERTICES, this._triangleSubGeometry.secondaryUVs));
		this._onClearVertices(new SubGeometryEvent(SubGeometryEvent.CLEAR_VERTICES, this._triangleSubGeometry.jointIndices));
		this._onClearVertices(new SubGeometryEvent(SubGeometryEvent.CLEAR_VERTICES, this._triangleSubGeometry.jointWeights));

		this._triangleSubGeometry = null;
	}

	public _render(shader:ShaderBase)
	{
		//TODO: find a better way to update a concatenated buffer when autoderiving
		if (shader.normalBufferIndex >= 0 && this._triangleSubGeometry.autoDeriveNormals)
			this._triangleSubGeometry.normals;

		if (shader.tangentBufferIndex >= 0 && this._triangleSubGeometry.autoDeriveTangents)
			this._triangleSubGeometry.tangents;

		if (shader.uvBufferIndex >= 0)
			this.activateVertexBufferVO(shader.uvBufferIndex, this._triangleSubGeometry.uvs);

		if (shader.secondaryUVBufferIndex >= 0)
			this.activateVertexBufferVO(shader.secondaryUVBufferIndex, this._triangleSubGeometry.secondaryUVs);

		if (shader.normalBufferIndex >= 0)
			this.activateVertexBufferVO(shader.normalBufferIndex, this._triangleSubGeometry.normals);

		if (shader.tangentBufferIndex >= 0)
			this.activateVertexBufferVO(shader.tangentBufferIndex, this._triangleSubGeometry.tangents);

		if (shader.jointIndexIndex >= 0)
			this.activateVertexBufferVO(shader.jointIndexIndex, this._triangleSubGeometry.jointIndices);

		if (shader.jointWeightIndex >= 0)
			this.activateVertexBufferVO(shader.jointIndexIndex, this._triangleSubGeometry.jointWeights);

		this.activateVertexBufferVO(0, this._triangleSubGeometry.positions);


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
	 * @returns {away.pool.TriangleSubMeshRenderable}
	 * @protected
	 */
	public _pGetOverflowSubGeometry():SubGeometryVOBase
	{
		return new TriangleSubGeometryVO(this._triangleSubGeometry, this._stage);
	}
}

export = TriangleSubGeometryVO;