import IAssetClass					= require("awayjs-core/lib/library/IAssetClass");

import ContextGLDrawMode			= require("awayjs-stagegl/lib/base/ContextGLDrawMode");
import Stage						= require("awayjs-stagegl/lib/base/Stage");

import TriangleSubGeometry			= require("awayjs-display/lib/base/TriangleSubGeometry");

import ShaderBase					= require("awayjs-renderergl/lib/shaders/ShaderBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
import ShaderRegisterElement		= require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");
import SubGeometryVOPool			= require("awayjs-renderergl/lib/vos/SubGeometryVOPool");
import SubGeometryVOBase			= require("awayjs-renderergl/lib/vos/SubGeometryVOBase");

/**
 *
 * @class away.pool.TriangleSubGeometryVO
 */
class TriangleSubGeometryVO extends SubGeometryVOBase
{
	/**
	 *
	 */
	public static assetClass:IAssetClass = TriangleSubGeometry;

	private _triangleSubGeometry:TriangleSubGeometry;

	constructor(pool:SubGeometryVOPool, triangleSubGeometry:TriangleSubGeometry)
	{
		super(pool, triangleSubGeometry);

		this._triangleSubGeometry = triangleSubGeometry;

		this.invalidateVertices(this._triangleSubGeometry.positions);
		this.invalidateVertices(this._triangleSubGeometry.normals);
		this.invalidateVertices(this._triangleSubGeometry.tangents);
		this.invalidateVertices(this._triangleSubGeometry.uvs);
		this.invalidateVertices(this._triangleSubGeometry.secondaryUVs);
		this.invalidateVertices(this._triangleSubGeometry.jointIndices);
		this.invalidateVertices(this._triangleSubGeometry.jointWeights);
	}

	public _render(shader:ShaderBase, stage:Stage)
	{
		if (shader.uvBufferIndex >= 0)
			this.activateVertexBufferVO(shader.uvBufferIndex, this._triangleSubGeometry.uvs, stage);

		if (shader.secondaryUVBufferIndex >= 0)
			this.activateVertexBufferVO(shader.secondaryUVBufferIndex, this._triangleSubGeometry.secondaryUVs, stage);

		if (shader.normalBufferIndex >= 0)
			this.activateVertexBufferVO(shader.normalBufferIndex, this._triangleSubGeometry.normals, stage);

		if (shader.tangentBufferIndex >= 0)
			this.activateVertexBufferVO(shader.tangentBufferIndex, this._triangleSubGeometry.tangents, stage);

		if (shader.jointIndexIndex >= 0)
			this.activateVertexBufferVO(shader.jointIndexIndex, this._triangleSubGeometry.jointIndices, stage);

		if (shader.jointWeightIndex >= 0)
			this.activateVertexBufferVO(shader.jointIndexIndex, this._triangleSubGeometry.jointWeights, stage);

		this.activateVertexBufferVO(0, this._triangleSubGeometry.positions, stage);


		super._render(shader, stage);
	}

	public _drawElements(firstIndex:number, numIndices:number, stage:Stage)
	{
		this.getIndexBufferVO(stage).draw(ContextGLDrawMode.TRIANGLES, 0, numIndices);
	}

	public _drawArrays(firstVertex:number, numVertices:number, stage:Stage)
	{
		stage.context.drawVertices(ContextGLDrawMode.TRIANGLES, firstVertex, numVertices);
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
		return new TriangleSubGeometryVO(this._pool, this._triangleSubGeometry);
	}
}

export = TriangleSubGeometryVO;