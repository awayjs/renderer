import Matrix3D						= require("awayjs-core/lib/geom/Matrix3D");
import Matrix3DUtils				= require("awayjs-core/lib/geom/Matrix3DUtils");

import SubGeometryBase				= require("awayjs-display/lib/base/SubGeometryBase");
import TriangleSubGeometry			= require("awayjs-display/lib/base/TriangleSubGeometry");
import Billboard					= require("awayjs-display/lib/entities/Billboard");
import MaterialBase					= require("awayjs-display/lib/materials/MaterialBase");
import Camera						= require("awayjs-display/lib/entities/Camera");

import Stage						= require("awayjs-stagegl/lib/base/Stage");
import IContextGL					= require("awayjs-stagegl/lib/base/IContextGL");
import ContextGLProgramType			= require("awayjs-stagegl/lib/base/ContextGLProgramType");

import ShaderObjectBase				= require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
import ShaderRegisterData			= require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
import ShaderRegisterElement		= require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
import RenderableBase				= require("awayjs-renderergl/lib/pool/RenderableBase");
import RenderablePoolBase			= require("awayjs-renderergl/lib/pool/RenderablePoolBase");
import RenderPassBase				= require("awayjs-renderergl/lib/passes/RenderPassBase");

/**
 * @class away.pool.RenderableListItem
 */
class BillboardRenderable extends RenderableBase
{
	private static _materialGeometry:Object = new Object();

	/**
	 *
	 */
	public static id:string = "billboard";

	public static vertexAttributesOffset:number = 1;

	/**
	 *
	 */
	private _billboard:Billboard;

	/**
	 * //TODO
	 *
	 * @param pool
	 * @param billboard
	 */
	constructor(pool:RenderablePoolBase, billboard:Billboard, stage:Stage)
	{
		super(pool, billboard, billboard, billboard.material, stage);

		this._billboard = billboard;
	}

	/**
	 * //TODO
	 *
	 * @returns {away.base.TriangleSubGeometry}
	 */
	public _pGetSubGeometry():SubGeometryBase
	{
		var material:MaterialBase = this._billboard.material;

		var geometry:TriangleSubGeometry = BillboardRenderable._materialGeometry[material.id];

		if (!geometry) {
			geometry = BillboardRenderable._materialGeometry[material.id] = new TriangleSubGeometry(true);
			geometry.autoDeriveNormals = false;
			geometry.autoDeriveTangents = false;
			geometry.updateIndices(Array<number>(0, 1, 2, 0, 2, 3));
			geometry.updatePositions(Array<number>(0, material.height, 0, material.width, material.height, 0, material.width, 0, 0, 0, 0, 0));
			geometry.updateVertexNormals(Array<number>(1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0));
			geometry.updateVertexTangents(Array<number>(0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1));
			geometry.updateUVs(Array<number>(0, 0, 1, 0, 1, 1, 0, 1));
		} else {
			geometry.updatePositions(Array<number>(0, material.height, 0, material.width, material.height, 0, material.width, 0, 0, 0, 0, 0));
		}

		this._pVertexDataDirty[TriangleSubGeometry.POSITION_DATA] = true;
		this._pVertexDataDirty[TriangleSubGeometry.NORMAL_DATA] = true;
		this._pVertexDataDirty[TriangleSubGeometry.TANGENT_DATA] = true;
		this._pVertexDataDirty[TriangleSubGeometry.UV_DATA] = true;

		return geometry;
	}

	public static _iIncludeDependencies(shaderObject:ShaderObjectBase)
	{

	}

	public static _iGetVertexCode(shaderObject:ShaderObjectBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";

		//get the projection coordinates
		var position:ShaderRegisterElement = (shaderObject.globalPosDependencies > 0)? sharedRegisters.globalPositionVertex : sharedRegisters.localPosition;

		//reserving vertex constants for projection matrix
		var viewMatrixReg:ShaderRegisterElement = registerCache.getFreeVertexConstant();
		registerCache.getFreeVertexConstant();
		registerCache.getFreeVertexConstant();
		registerCache.getFreeVertexConstant();
		shaderObject.viewMatrixIndex = viewMatrixReg.index*4;

		if (shaderObject.projectionDependencies > 0) {
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

	public _iActivate(pass:RenderPassBase, camera:Camera)
	{
		super._iActivate(pass, camera);

		//buffer the same for all materials, so can set here
		this._stage.activateBuffer(0, this.getVertexData(TriangleSubGeometry.POSITION_DATA), this.getVertexOffset(TriangleSubGeometry.POSITION_DATA), TriangleSubGeometry.POSITION_FORMAT);
	}

	/**
	 * @inheritDoc
	 */
	public _iRender(pass:RenderPassBase, camera:Camera, viewProjection:Matrix3D)
	{
		super._iRender(pass, camera, viewProjection);

		var shader:ShaderObjectBase = pass.shader;

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

		this._stage.context.drawTriangles(this._stage.getIndexBuffer(this.getIndexData()), 0, this.numTriangles);
	}
}

export = BillboardRenderable;