import {AssetEvent}					from "@awayjs/core/lib/events/AssetEvent";
import {Matrix3DUtils}				from "@awayjs/core/lib/geom/Matrix3DUtils";
import {Matrix3D}						from "@awayjs/core/lib/geom/Matrix3D";

import {ContextGLDrawMode}			from "@awayjs/stage/lib/base/ContextGLDrawMode";
import {ContextGLProgramType}			from "@awayjs/stage/lib/base/ContextGLProgramType";
import {IContextGL}					from "@awayjs/stage/lib/base/IContextGL";
import {Stage}						from "@awayjs/stage/lib/base/Stage";

import {Camera}						from "@awayjs/display/lib/display/Camera";
import {TriangleElements}				from "@awayjs/display/lib/graphics/TriangleElements";

import {GL_ElementsBase}				from "../elements/GL_ElementsBase";
import {IElementsClassGL}				from "../elements/IElementsClassGL";
import {GL_RenderableBase}			from "../renderables/GL_RenderableBase";
import {ShaderBase}					from "../shaders/ShaderBase";
import {ShaderRegisterCache}			from "../shaders/ShaderRegisterCache";
import {ShaderRegisterData}			from "../shaders/ShaderRegisterData";
import {ShaderRegisterElement}		from "../shaders/ShaderRegisterElement";

/**
 *
 * @class away.pool.GL_TriangleElements
 */
export class GL_TriangleElements extends GL_ElementsBase
{
	public static elementsType:string = "[elements Triangle]";

	public get elementsType():string
	{
		return GL_TriangleElements.elementsType;
	}
	
	public get elementsClass():IElementsClassGL
	{
		return GL_TriangleElements;
	}
	
	public static _iIncludeDependencies(shader:ShaderBase):void
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

	constructor(triangleElements:TriangleElements, stage:Stage)
	{
		super(triangleElements, stage);

		this._triangleElements = triangleElements;
	}

	public onClear(event:AssetEvent):void
	{
		super.onClear(event);

		this._triangleElements = null;
	}

	public _setRenderState(renderable:GL_RenderableBase, shader:ShaderBase, camera:Camera, viewProjection:Matrix3D):void
	{
		super._setRenderState(renderable, shader, camera, viewProjection);

		//set buffers
		//TODO: find a better way to update a concatenated buffer when autoderiving
		if (shader.normalIndex >= 0 && this._triangleElements.autoDeriveNormals)
			this._triangleElements.normals;

		if (shader.tangentIndex >= 0 && this._triangleElements.autoDeriveTangents)
			this._triangleElements.tangents;

		if (shader.curvesIndex >= 0)
			this.activateVertexBufferVO(shader.curvesIndex, this._triangleElements.getCustomAtributes("curves"));

		if (shader.uvIndex >= 0)
			this.activateVertexBufferVO(shader.uvIndex, this._triangleElements.uvs || this._triangleElements.positions);

		if (shader.secondaryUVIndex >= 0)
			this.activateVertexBufferVO(shader.secondaryUVIndex, this._triangleElements.getCustomAtributes("secondaryUVs") || this._triangleElements.uvs || this._triangleElements.positions);

		if (shader.normalIndex >= 0)
			this.activateVertexBufferVO(shader.normalIndex, this._triangleElements.normals);

		if (shader.tangentIndex >= 0)
			this.activateVertexBufferVO(shader.tangentIndex, this._triangleElements.tangents);

		if (shader.jointIndexIndex >= 0)
			this.activateVertexBufferVO(shader.jointIndexIndex, this._triangleElements.jointIndices);

		if (shader.jointWeightIndex >= 0)
			this.activateVertexBufferVO(shader.jointIndexIndex, this._triangleElements.jointWeights);

		this.activateVertexBufferVO(0, this._triangleElements.positions);
	}

	public draw(renderable:GL_RenderableBase, shader:ShaderBase, camera:Camera, viewProjection:Matrix3D, count:number, offset:number):void
	{
		//set constants
		if (shader.sceneMatrixIndex >= 0) {
			renderable.renderSceneTransform.copyRawDataTo(shader.vertexConstantData, shader.sceneMatrixIndex, true);
			viewProjection.copyRawDataTo(shader.vertexConstantData, shader.viewMatrixIndex, true);
		} else {
			var matrix3D:Matrix3D = Matrix3DUtils.CALCULATION_MATRIX;

			matrix3D.copyFrom(renderable.renderSceneTransform);
			matrix3D.append(viewProjection);

			matrix3D.copyRawDataTo(shader.vertexConstantData, shader.viewMatrixIndex, true);
		}

		var context:IContextGL = this._stage.context;
		context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, shader.vertexConstantData);
		context.setProgramConstantsFromArray(ContextGLProgramType.FRAGMENT, shader.fragmentConstantData);

		if (this._indices)
			this.getIndexBufferGL().draw(ContextGLDrawMode.TRIANGLES, 0, this.numIndices);
		else
			this._stage.context.drawVertices(ContextGLDrawMode.TRIANGLES, offset, count || this.numVertices);
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
		return new GL_TriangleElements(this._triangleElements, this._stage);
	}
}