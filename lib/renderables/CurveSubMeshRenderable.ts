import Matrix3D						= require("awayjs-core/lib/geom/Matrix3D");
import Matrix3DUtils				= require("awayjs-core/lib/geom/Matrix3DUtils");
import IAssetClass					= require("awayjs-core/lib/library/IAssetClass");

import IRenderableOwner				= require("awayjs-display/lib/base/IRenderableOwner");
import CurveSubMesh				    = require("awayjs-display/lib/base/CurveSubMesh");
import CurveSubGeometry		    	= require("awayjs-display/lib/base/CurveSubGeometry");
import Camera						= require("awayjs-display/lib/entities/Camera");

import IContextGL					= require("awayjs-stagegl/lib/base/IContextGL");
import ContextWebGL					= require("awayjs-stagegl/lib/base/ContextWebGL");
import Stage						= require("awayjs-stagegl/lib/base/Stage");
import ContextGLProgramType			= require("awayjs-stagegl/lib/base/ContextGLProgramType");

import ShaderBase					= require("awayjs-renderergl/lib/shaders/ShaderBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
import ShaderRegisterData			= require("awayjs-renderergl/lib/shaders/ShaderRegisterData");
import ShaderRegisterElement		= require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");
import PassBase						= require("awayjs-renderergl/lib/render/passes/PassBase");
import RenderableBase				= require("awayjs-renderergl/lib/renderables/RenderableBase");
import RenderablePool				= require("awayjs-renderergl/lib/renderables/RenderablePool")

/**
 * @class away.pool.TriangleSubMeshRenderable
 */
class CurveSubMeshRenderable extends RenderableBase
{
	public static assetClass:IAssetClass = CurveSubMesh;

	public static vertexAttributesOffset:number = 2;

	/**
	 *
	 */
	public subMesh:CurveSubMesh;


	/**
	 * //TODO
	 *
	 * @param pool
	 * @param subMesh
	 * @param level
	 * @param indexOffset
	 */
	constructor(pool:RenderablePool, subMesh:CurveSubMesh, stage:Stage)
	{
		super(pool, subMesh.parentMesh, subMesh, subMesh.material, stage);

		this.subMesh = subMesh;
	}

	/**
	 *
	 * @returns {SubGeometryBase}
	 * @protected
	 */
	public _pGetSubGeometry():CurveSubGeometry
	{
		return (this.subMesh.animator)? <CurveSubGeometry> this.subMesh.animator.getRenderableSubGeometry(this, this.subMesh.subGeometry) : this.subMesh.subGeometry;
	}


	public static _iIncludeDependencies(shader:ShaderBase)
	{
        shader.usesLocalPosFragment = true;
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
			code += "m44 " + temp + ", " + position + ".xyw, " + viewMatrixReg + "\n" +
			"mov " + sharedRegisters.projectionFragment + ", " + temp + "\n" +
			"mov v2 va1 \n" +
			"mov op, " + temp + "\n";

		} else {
			code += "mov v2 va1 \n";
			code += "m44 op, " + position + ".xyw, " + viewMatrixReg + "\n";
		}
		return code;
	}
    /**
     * @inheritDoc
     */
	public static _iGetFragmentCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var sd:boolean = (<ContextWebGL>shader._stage.context).standardDerivatives;
		var pos:ShaderRegisterElement = sharedRegisters.localPositionVarying;
		var out:ShaderRegisterElement = sharedRegisters.shadedTarget;

		var curve:string = "v2";
		var curvex:string = "v2.x";
		var curvey:string = "v2.y";
		var curvez:string = pos + ".z";


		//get some free registers
		var free:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
		registerCache.addFragmentTempUsages(free, 1);
		var free1:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
		registerCache.addFragmentTempUsages(free1, 1);
		var free2:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
		registerCache.addFragmentTempUsages(free2, 1);

		//distance from curve
		var d:string = free + ".x";
		var dx:string = free + ".y";
		var dy:string = free + ".z";
		var t:string = free + ".w";
		var d2:string = free1 + ".x";
		var fixa:string = free1 + ".y";
		var fixb:string = free1 + ".z";

		var _aa:string = "fc7.z";
		var _0:string = "fc7.x";
		var _1:string = "fc7.y";

		var nl:string = "\n";

		var code:Array<string> =  new Array<string>();

		//distance from curve
		code.push("mul",d, curvex, curvex, nl);
		code.push("sub",d, d, curvey, nl);
		code.push("mul",d, d, curvez, nl);	//flipper

		//kill based on distance from curve
		code.push("kil" ,d, nl);

		var applyAA:boolean = false;
		if(applyAA && sd)
		{

			//derivatives
			code.push("ddx", dx, d, nl);
			code.push("ddy", dy, d, nl);

			//AA
			code.push("mul",dx, dx, dx, nl);
			code.push("mul",dy, dy, dy, nl);
			code.push("add",t, dx, dy, nl);
			code.push("sqt",t, t, nl);

			code.push("mul",t, t, _aa, nl);
			code.push("div",d, d, t, nl);

/*
			//code.push("sge", fixa, curvex, _1, nl);
			code.push("slt", fixb, curvex, _1, nl);
			code.push("sub", fixa, _1, fixb, nl);
			//code.push("sub", fixb, _1, fixa, nl);

			code.push("mul", d, d, fixb, nl);

*/
//			code.push("abs", d, d, nl);
			code.push("max", d, d, _0, nl);
			code.push("min", d, d, _1, nl);
			code.push("mov", out+".w", d, nl);
		}


		code.push("mov", out+".w", _1, nl);
		return code.join(" ");
	}
    private _constants:Array<number> = new Array<number>(0, 1, 1, 0.5);
    /**
     * @inheritDoc
     */
    public _iActivate(pass:PassBase, camera:Camera)
    {
        super._iActivate(pass, camera);

        var context:IContextGL = this._stage.context;

        context.setProgramConstantsFromArray(ContextGLProgramType.FRAGMENT, 7, this._constants, 1);

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

export = CurveSubMeshRenderable;