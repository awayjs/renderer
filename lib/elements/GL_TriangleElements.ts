import IAbstractionPool				from "awayjs-core/lib/library/IAbstractionPool";
import AssetEvent					from "awayjs-core/lib/events/AssetEvent";
import Matrix3DUtils				from "awayjs-core/lib/geom/Matrix3DUtils";
import Matrix3D						from "awayjs-core/lib/geom/Matrix3D";

import ContextGLDrawMode			from "awayjs-stagegl/lib/base/ContextGLDrawMode";
import ContextWebGL					from "awayjs-stagegl/lib/base/ContextWebGL";
import ContextGLProgramType			from "awayjs-stagegl/lib/base/ContextGLProgramType";
import IContextGL					from "awayjs-stagegl/lib/base/IContextGL";
import Stage						from "awayjs-stagegl/lib/base/Stage";

import Camera						from "awayjs-display/lib/display/Camera";
import TriangleElements				from "awayjs-display/lib/graphics/TriangleElements";
import ElementsEvent				from "awayjs-display/lib/events/ElementsEvent";

import ElementsPool					from "awayjs-renderergl/lib/elements/ElementsPool";
import ShaderBase					from "awayjs-renderergl/lib/shaders/ShaderBase";
import ShaderRegisterCache			from "awayjs-renderergl/lib/shaders/ShaderRegisterCache";
import ShaderRegisterElement		from "awayjs-renderergl/lib/shaders/ShaderRegisterElement";
import GL_ElementsBase				from "awayjs-renderergl/lib/elements/GL_ElementsBase";
import ShaderRegisterData			from "awayjs-renderergl/lib/shaders/ShaderRegisterData";
import GL_RenderableBase			from "awayjs-renderergl/lib/renderables/GL_RenderableBase";

/**
 *
 * @class away.pool.GL_TriangleElements
 */
class GL_TriangleElements extends GL_ElementsBase
{
	public static vertexAttributesOffset:number = 1;

	public static _iIncludeDependencies(shader:ShaderBase)
	{
	}

	public static _iGetVertexCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";

		//get the projection coordinates
		var position:ShaderRegisterElement = (shader.globalPosDependencies > 0)? sharedRegisters.globalPositionVertex : sharedRegisters.animatedPosition;

		//reserving vertex constants for projection matrix
		var viewMatrixReg:ShaderRegisterElement = registerCache.getFreeVertexConstant();
		registerCache.getFreeVertexConstant();
		registerCache.getFreeVertexConstant();
		registerCache.getFreeVertexConstant();
		shader.viewMatrixIndex = viewMatrixReg.index*4;

		if (shader.projectionDependencies > 0) {
			sharedRegisters.projectionFragment = registerCache.getFreeVarying();
			var temp:ShaderRegisterElement = registerCache.getFreeVertexVectorTemp();
			code += "m44 " + temp + ", " + position + ", " + viewMatrixReg + "\n" +
				"mov " + sharedRegisters.projectionFragment + ", " + temp + "\n" +
				"mov op, " + temp + "\n";
		} else {
			code += "m44 op, " + position + ", " + viewMatrixReg + "\n";
		}

		return code;
	}

	public static _iGetFragmentCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return "";
	}

	private _triangleElements:TriangleElements;

	constructor(triangleElements:TriangleElements, shader:ShaderBase, pool:IAbstractionPool)
	{
		super(triangleElements, shader, pool);

		this._triangleElements = triangleElements;
	}

	public onClear(event:AssetEvent)
	{
		super.onClear(event);

		this._triangleElements = null;
	}

	public _render(renderable:GL_RenderableBase, camera:Camera, viewProjection:Matrix3D)
	{
		//set buffers
		//TODO: find a better way to update a concatenated buffer when autoderiving
		if (this._shader.normalIndex >= 0 && this._triangleElements.autoDeriveNormals)
			this._triangleElements.normals;

		if (this._shader.tangentIndex >= 0 && this._triangleElements.autoDeriveTangents)
			this._triangleElements.tangents;

		if (this._shader.curvesIndex >= 0)
			this.activateVertexBufferVO(this._shader.curvesIndex, this._triangleElements.getCustomAtributes("curves"));

		if (this._shader.uvIndex >= 0)
			this.activateVertexBufferVO(this._shader.uvIndex, this._triangleElements.uvs || this._triangleElements.positions);

		if (this._shader.secondaryUVIndex >= 0)
			this.activateVertexBufferVO(this._shader.secondaryUVIndex, this._triangleElements.getCustomAtributes("secondaryUVs") || this._triangleElements.uvs || this._triangleElements.positions);

		if (this._shader.normalIndex >= 0)
			this.activateVertexBufferVO(this._shader.normalIndex, this._triangleElements.normals);

		if (this._shader.tangentIndex >= 0)
			this.activateVertexBufferVO(this._shader.tangentIndex, this._triangleElements.tangents);

		if (this._shader.jointIndexIndex >= 0)
			this.activateVertexBufferVO(this._shader.jointIndexIndex, this._triangleElements.jointIndices);

		if (this._shader.jointWeightIndex >= 0)
			this.activateVertexBufferVO(this._shader.jointIndexIndex, this._triangleElements.jointWeights);

		this.activateVertexBufferVO(0, this._triangleElements.positions);

		//set constants
		if (this._shader.sceneMatrixIndex >= 0) {
			renderable.renderSceneTransform.copyRawDataTo(this._shader.vertexConstantData, this._shader.sceneMatrixIndex, true);
			viewProjection.copyRawDataTo(this._shader.vertexConstantData, this._shader.viewMatrixIndex, true);
		} else {
			var matrix3D:Matrix3D = Matrix3DUtils.CALCULATION_MATRIX;

			matrix3D.copyFrom(renderable.renderSceneTransform);
			matrix3D.append(viewProjection);

			matrix3D.copyRawDataTo(this._shader.vertexConstantData, this._shader.viewMatrixIndex, true);
		}

		var context:IContextGL = this._stage.context;
		context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, 0, this._shader.vertexConstantData, this._shader.numUsedVertexConstants);
		context.setProgramConstantsFromArray(ContextGLProgramType.FRAGMENT, 0, this._shader.fragmentConstantData, this._shader.numUsedFragmentConstants);

		super._render(renderable, camera, viewProjection);
	}

	public _drawElements(firstIndex:number, numIndices:number)
	{
		this.getIndexBufferGL().draw(ContextGLDrawMode.TRIANGLES, firstIndex, numIndices);
	}

	public _drawArrays(firstVertex:number, numVertices:number)
	{
		this._stage.context.drawVertices(ContextGLDrawMode.TRIANGLES, firstVertex, numVertices);
	}

	/**
	 * //TODO
	 *
	 * @param pool
	 * @param renderable
	 * @param level
	 * @param indexOffset
	 * @returns {away.pool.GL_GraphicRenderable}
	 * @protected
	 */
	public _pGetOverflowElements():GL_ElementsBase
	{
		return new GL_TriangleElements(this._triangleElements, this._shader, this._pool);
	}
}

export default GL_TriangleElements;