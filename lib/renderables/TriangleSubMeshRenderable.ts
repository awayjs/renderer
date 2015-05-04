import Matrix3D						= require("awayjs-core/lib/geom/Matrix3D");
import Matrix3DUtils				= require("awayjs-core/lib/geom/Matrix3DUtils");
import IAssetClass					= require("awayjs-core/lib/library/IAssetClass");

import IRenderableOwner				= require("awayjs-display/lib/base/IRenderableOwner");
import TriangleSubMesh				= require("awayjs-display/lib/base/TriangleSubMesh");
import TriangleSubGeometry			= require("awayjs-core/lib/data/TriangleSubGeometry");
import Camera						= require("awayjs-display/lib/entities/Camera");

import ContextGLVertexBufferFormat	= require("awayjs-stagegl/lib/base/ContextGLVertexBufferFormat");
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
	constructor(pool:RenderablePool, subMesh:TriangleSubMesh, stage:Stage, level:number = 0, indexOffset:number = 0)
	{
		super(pool, subMesh.parentMesh, subMesh, subMesh.material, stage, level, indexOffset);

		this.subMesh = subMesh;
	}

	/**
	 *
	 * @returns {SubGeometryBase}
	 * @protected
	 */
	public _pGetSubGeometry():TriangleSubGeometry
	{
		var subGeometry:TriangleSubGeometry;

		if (this.subMesh.animator)
			subGeometry = <TriangleSubGeometry> this.subMesh.animator.getRenderableSubGeometry(this, this.subMesh.subGeometry);
		else
			subGeometry = this.subMesh.subGeometry;

		this._pVertexDataDirty[TriangleSubGeometry.POSITION_DATA] = true;

		if (subGeometry.vertexNormals)
			this._pVertexDataDirty[TriangleSubGeometry.NORMAL_DATA] = true;

		if (subGeometry.vertexTangents)
			this._pVertexDataDirty[TriangleSubGeometry.TANGENT_DATA] = true;

		if (subGeometry.uvs)
			this._pVertexDataDirty[TriangleSubGeometry.UV_DATA] = true;

		if (subGeometry.secondaryUVs)
			this._pVertexDataDirty[TriangleSubGeometry.SECONDARY_UV_DATA] = true;

		if (subGeometry.jointIndices)
			this._pVertexDataDirty[TriangleSubGeometry.JOINT_INDEX_DATA] = true;

		if (subGeometry.jointWeights)
			this._pVertexDataDirty[TriangleSubGeometry.JOINT_WEIGHT_DATA] = true;

		switch(subGeometry.jointsPerVertex) {
			case 1:
				this.JOINT_INDEX_FORMAT = this.JOINT_WEIGHT_FORMAT = ContextGLVertexBufferFormat.FLOAT_1;
				break;
			case 2:
				this.JOINT_INDEX_FORMAT = this.JOINT_WEIGHT_FORMAT = ContextGLVertexBufferFormat.FLOAT_2;
				break;
			case 3:
				this.JOINT_INDEX_FORMAT = this.JOINT_WEIGHT_FORMAT = ContextGLVertexBufferFormat.FLOAT_3;
				break;
			case 4:
				this.JOINT_INDEX_FORMAT = this.JOINT_WEIGHT_FORMAT = ContextGLVertexBufferFormat.FLOAT_4;
				break;
			default:
		}

		return subGeometry;
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
	public _iRender(pass:PassBase, camera:Camera, viewProjection:Matrix3D)
	{
		super._iRender(pass, camera, viewProjection);

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

		this._stage.activateBuffer(0, this.getVertexData(TriangleSubGeometry.POSITION_DATA), this.getVertexOffset(TriangleSubGeometry.POSITION_DATA), TriangleSubGeometry.POSITION_FORMAT);
		this._stage.context.drawTriangles(this._stage.getIndexBuffer(this.getIndexData()), 0, this.numTriangles);
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
	public _pGetOverflowRenderable(indexOffset:number):RenderableBase
	{
		return new TriangleSubMeshRenderable(this._pool, <TriangleSubMesh> this.renderableOwner, this._stage, this._level + 1, indexOffset);
	}
}

export = TriangleSubMeshRenderable;