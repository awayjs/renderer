import Matrix3D						= require("awayjs-core/lib/geom/Matrix3D");
import Matrix3DUtils				= require("awayjs-core/lib/geom/Matrix3DUtils");

import IRenderableOwner				= require("awayjs-display/lib/base/IRenderableOwner");
import CurveSubMesh				    = require("awayjs-display/lib/base/CurveSubMesh");
import CurveSubGeometry		    	= require("awayjs-display/lib/base/CurveSubGeometry");
import Camera						= require("awayjs-display/lib/entities/Camera");

import ContextGLVertexBufferFormat	= require("awayjs-stagegl/lib/base/ContextGLVertexBufferFormat");
import IContextGL					= require("awayjs-stagegl/lib/base/IContextGL");
import ContextWebGL					= require("awayjs-stagegl/lib/base/ContextWebGL");
import Stage						= require("awayjs-stagegl/lib/base/Stage");
import ContextGLProgramType			= require("awayjs-stagegl/lib/base/ContextGLProgramType");

import ShaderObjectBase				= require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
import ShaderRegisterData			= require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
import ShaderRegisterElement		= require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
import RenderableBase				= require("awayjs-renderergl/lib/pool/RenderableBase");
import RenderablePoolBase			= require("awayjs-renderergl/lib/pool/RenderablePoolBase");
import RenderPassBase				= require("awayjs-renderergl/lib/passes/RenderPassBase");

/**
 * @class away.pool.TriangleSubMeshRenderable
 */
class CurveSubMeshRenderable extends RenderableBase
{
	/**
	 *
	 */
	public static id:string = "curvesubmesh";

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
	constructor(pool:RenderablePoolBase, subMesh:CurveSubMesh, stage:Stage, level:number = 0, indexOffset:number = 0)
	{
		super(pool, subMesh.parentMesh, subMesh, subMesh.material, stage, level, indexOffset);

		this.subMesh = subMesh;
	}

	/**
	 *
	 * @returns {SubGeometryBase}
	 * @protected
	 */
	public _pGetSubGeometry():CurveSubGeometry
	{
		var subGeometry:CurveSubGeometry;

		if (this.subMesh.animator)
			subGeometry = <CurveSubGeometry> this.subMesh.animator.getRenderableSubGeometry(this, this.subMesh.subGeometry);
		else
			subGeometry = this.subMesh.subGeometry;

		this._pVertexDataDirty[CurveSubGeometry.POSITION_DATA] = true;

		if (subGeometry.curves)
			this._pVertexDataDirty[CurveSubGeometry.CURVE_DATA] = true;

		if (subGeometry.uvs)
			this._pVertexDataDirty[CurveSubGeometry.UV_DATA] = true;

		return subGeometry;
	}


	public static _iIncludeDependencies(shaderObject:ShaderObjectBase)
	{
        shaderObject.localPosDependencies++;
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
    public static _iGetFragmentCode(shaderObject:ShaderObjectBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
    {
		var sd:boolean = (<ContextWebGL>shaderObject._stage.context).standardDerivatives;

		var curve:String = "v2";
		var curveX:String = "v2.x";//sharedRegisters.uvVarying //shaderObject.uvTarget;
		var curveY:String = "v2.y";//sharedRegisters.uvVarying //shaderObject.uvTarget;
		var pos:ShaderRegisterElement = sharedRegisters.localPositionVarying;
		var out:ShaderRegisterElement = sharedRegisters.shadedTarget;//registerCache.fragmentOutputRegister.toString();

		//get some free registers
		var free:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
		registerCache.addFragmentTempUsages(free, 1);
		var free1:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
		registerCache.addFragmentTempUsages(free1, 1);
		var free2:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
		registerCache.addFragmentTempUsages(free2, 1);

		//distance from curve
		var d:String = free + ".x";//registerCache.getFreeFragmentConstant().toString();
		var less:String = free + ".y";//registerCache.getFreeFragmentSingleTemp().toString();
		var half:String = free + ".z";//registerCache.getFreeFragmentSingleTemp().toString();

		var px:String = free + ".xy";
		var pxx:String = free + ".x";
		var pxy:String = free + ".y";
		var py:String = free1 + ".xy";
		var pyx:String = free1 + ".x";
		var pyy:String = free1 + ".y";

		var fx:String = free2 + ".x";
		var fy:String = free2 + ".y";
		var len:String = free2 + ".z";


		var dist:String = "fc7.z";


		var code:string = "";

		//derivatives
		code += "ddx " + px + " " + curve+"\n";
		code += "ddy " + py + " " + curve+"\n";

		code += "mul " + fx + " " + curveX + " " + pxx + "\n";
		code += "mul " + fx + " " + fx + " " + dist + "\n";
		code += "sub " + fx + " " + fx + " " + pxy + "\n";

		code += "mul " + fy + " " + curveY + " " + pyx + "\n";
		code += "mul " + fy + " " + fy + " " + dist + "\n";
		code += "sub " + fy + " " + fy + " " + pyy + "\n";

		//len
		code += "mul " + fx + " " + fx + " " + fx+"\n";
		code += "mul " + fy + " " + fy + " " + fy+"\n";
		code += "add " + len + " " + fx + " " + fy+"\n";
		code += "sqt " + len + " " + len+"\n";


		//distance
		code += "mul " + d + " " + curveX + " " + curveX+"\n";
		code += "sub " + d + " " + d + " " + curveY+"\n";

		//flip
		code += "mul "+ d + " " + d + " " + pos + ".z " + "\n";
		//code += "abs "+ d + " " + d + "\n";

		code += "div " + d + " " + d + " " + len +"\n";
		/*

		//AA
		code += "mul " + dx + " " + dx + " " + dx+"\n";
		code += "mul " + dy + " " + dy + " " + dy+"\n";
		code += "add " + t + " " + dx + " " +  dy+"\n";
		code += "sqt " + t + " " + t+"\n";
		*/

		code += "sub "+ d + " fc7.w " + d + "\n";



		//code += "add " + t + " " + t + " " +  t+"\n";

	//

	//	code += "add " + d + " " + d + " " + " fc7.x\n";

		// code += "mov "+ out + " " + sharedRegisters.uvVarying+"\n";

		// code += "mul "+ d + " " + d + " " + less + "\n";
		//code += "sub "+ d + " " + d + " " + pos + ".z " + "\n";
		/*
		code += "mul "+ d + " " + d + " " + pos + ".z " + "\n";
		code += "mov "+ half + " fc7.x\n";
		code += "slt "+ less + " " + d + " " + half + "\n";
		code += "mul "+ d + " " + d + " " + less + "\n";
		code += "abs "+ d + " " + d + "\n";*/
		//code += "ddx " + d + " " + curve + ".x\n";
		// code += "kil " + less + "\n";
		//  code += "sub "+ less + " " + less + " " + pos + ".z " + "\n";

		code += "mov " + out + ".w " + d + "\n";
		return code;
		/*
        var curve:String = "v2";//sharedRegisters.uvVarying //shaderObject.uvTarget;
        var pos:ShaderRegisterElement = sharedRegisters.localPositionVarying;
        var out:ShaderRegisterElement = sharedRegisters.shadedTarget;//registerCache.fragmentOutputRegister.toString();

        var free:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
        var d:String = free + ".x";//registerCache.getFreeFragmentConstant().toString();
        var less:String = free + ".y";//registerCache.getFreeFragmentSingleTemp().toString();
        var half:String = free + ".z";//registerCache.getFreeFragmentSingleTemp().toString();

        var code:string = "";
        code += "mov " + d + " " + curve + ".x\n";
        code += "mul " + d + " " + d + " " + d+"\n";
        code += "sub " + d + " " + d + " " + curve+".y\n";

             // code += "mov "+ out + " " + sharedRegisters.uvVarying+"\n";

       // code += "mul "+ d + " " + d + " " + less + "\n";
        //code += "sub "+ d + " " + d + " " + pos + ".z " + "\n";
        code += "mul "+ d + " " + d + " " + pos + ".z " + "\n";
        code += "mov "+ half + " fc7.x\n";
        code += "slt "+ less + " " + d + " " + half + "\n";
        code += "mul "+ d + " " + d + " " + less + "\n";
        code += "abs "+ d + " " + d + "\n";
		code += "ddx " + d + " " + curve + ".x\n";
       // code += "kil " + less + "\n";
      //  code += "sub "+ less + " " + less + " " + pos + ".z " + "\n";

        code += "mov " + out + ".w " + less + "\n";
        return code;*/
    }
    private _constants:Array<number> = new Array<number>(0, 1, 2, 0.5);
    /**
     * @inheritDoc
     */
    public _iActivate(pass:RenderPassBase, camera:Camera)
    {
        super._iActivate(pass, camera);

        var context:IContextGL = this._stage.context;

        context.setProgramConstantsFromArray(ContextGLProgramType.FRAGMENT, 7, this._constants, 1);

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

		this._stage.activateBuffer(0, this.getVertexData(CurveSubGeometry.POSITION_DATA), this.getVertexOffset(CurveSubGeometry.POSITION_DATA), CurveSubGeometry.POSITION_FORMAT);
        this._stage.activateBuffer(1, this.getVertexData(CurveSubGeometry.CURVE_DATA), this.getVertexOffset(CurveSubGeometry.CURVE_DATA), CurveSubGeometry.CURVE_FORMAT);

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
		return new CurveSubMeshRenderable(this._pool, <CurveSubMesh> this.renderableOwner, this._stage, this._level + 1, indexOffset);
	}
}

export = CurveSubMeshRenderable;