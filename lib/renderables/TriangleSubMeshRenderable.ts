import Matrix3D						= require("awayjs-core/lib/geom/Matrix3D");
import Matrix3DUtils				= require("awayjs-core/lib/geom/Matrix3DUtils");
import IAssetClass					= require("awayjs-core/lib/library/IAssetClass");

import IRenderableOwner				= require("awayjs-display/lib/base/IRenderableOwner");
import TriangleSubMesh				= require("awayjs-display/lib/base/TriangleSubMesh");
import TriangleSubGeometry			= require("awayjs-display/lib/base/TriangleSubGeometry");
import Camera						= require("awayjs-display/lib/entities/Camera");

import IContextGL					= require("awayjs-stagegl/lib/base/IContextGL");
import Stage						= require("awayjs-stagegl/lib/base/Stage");
import ContextGLProgramType			= require("awayjs-stagegl/lib/base/ContextGLProgramType");

import ShaderBase					= require("awayjs-renderergl/lib/shaders/ShaderBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
import ShaderRegisterData			= require("awayjs-renderergl/lib/shaders/ShaderRegisterData");
import ShaderRegisterElement		= require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");
import RenderableBase				= require("awayjs-renderergl/lib/renderables/RenderableBase");
import RenderablePool				= require("awayjs-renderergl/lib/renderables/RenderablePool");
import PassBase						= require("awayjs-renderergl/lib/render/passes/PassBase");

/**
 * @class away.pool.TriangleSubMeshRenderable
 */
class TriangleSubMeshRenderable extends RenderableBase
{
	public static assetClass:IAssetClass = TriangleSubMesh;

	public static vertexAttributesOffset:number = 1;

	/**
	 *
	 */
	public subMesh:TriangleSubMesh;


	/**
	 * //TODO
	 *
	 * @param pool
	 * @param subMesh
	 * @param level
	 * @param indexOffset
	 */
	constructor(pool:RenderablePool, subMesh:TriangleSubMesh, stage:Stage)
	{
		super(pool, subMesh.parentMesh, subMesh, subMesh.material, stage);

		this.subMesh = subMesh;
	}

	/**
	 *
	 * @returns {SubGeometryBase}
	 * @protected
	 */
	public _pGetSubGeometry():TriangleSubGeometry
	{
		return (this.subMesh.animator)? <TriangleSubGeometry> this.subMesh.animator.getRenderableSubGeometry(this, this.subMesh.subGeometry) : this.subMesh.subGeometry;
	}


	public static _iIncludeDependencies(shader:ShaderBase)
	{

	}

	public static _iGetVertexCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";

		//get the projection coordinates
		var position:ShaderRegisterElement = (shader.globalPosDependencies > 0)? sharedRegisters.globalPositionVertex : sharedRegisters.localPosition;

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

	/**
	 * @inheritDoc
	 */
	public _setRenderState(pass:PassBase, camera:Camera, viewProjection:Matrix3D)
	{
		super._setRenderState(pass, camera, viewProjection);

		var shader:ShaderBase = pass.shader;

		if (shader.sceneMatrixIndex >= 0) {
			this.sourceEntity.getRenderSceneTransform(camera).copyRawDataTo(shader.vertexConstantData, shader.sceneMatrixIndex, true);
			viewProjection.copyRawDataTo(shader.vertexConstantData, shader.viewMatrixIndex, true);
		} else {
			var matrix3D:Matrix3D = Matrix3DUtils.CALCULATION_MATRIX;

			matrix3D.copyFrom(this.sourceEntity.getRenderSceneTransform(camera));
			matrix3D.append(viewProjection);

			matrix3D.copyRawDataTo(shader.vertexConstantData, shader.viewMatrixIndex, true);
		}

		var context:IContextGL = this._stage.context;
		context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, 0, shader.vertexConstantData, shader.numUsedVertexConstants);
		context.setProgramConstantsFromArray(ContextGLProgramType.FRAGMENT, 0, shader.fragmentConstantData, shader.numUsedFragmentConstants);
	}
}

export = TriangleSubMeshRenderable;