import {Vector3D}							from "@awayjs/core/lib/geom/Vector3D";

import {AnimatorBase}						from "../../animators/AnimatorBase";
import {ParticleAnimationSet}				from "../../animators/ParticleAnimationSet";
import {AnimationRegisterData}			from "../../animators/data/AnimationRegisterData";
import {ParticleProperties}				from "../../animators/data/ParticleProperties";
import {ParticlePropertiesMode}			from "../../animators/data/ParticlePropertiesMode";
import {ParticleNodeBase}					from "../../animators/nodes/ParticleNodeBase";
import {ParticleRotateToPositionState}	from "../../animators/states/ParticleRotateToPositionState";
import {ShaderBase}						from "../../shaders/ShaderBase";
import {ShaderRegisterCache}				from "../../shaders/ShaderRegisterCache";
import {ShaderRegisterElement}			from "../../shaders/ShaderRegisterElement";

/**
 * A particle animation node used to control the rotation of a particle to face to a position
 */
export class ParticleRotateToPositionNode extends ParticleNodeBase
{
	/** @private */
	public _iPosition:Vector3D;

	/**
	 * Reference for the position the particle will rotate to face for a single particle (when in local property mode).
	 * Expects a <code>Vector3D</code> object representing the position that the particle must face.
	 */
	public static POSITION_VECTOR3D:string = "RotateToPositionVector3D";

	/**
	 * Creates a new <code>ParticleRotateToPositionNode</code>
	 */
	constructor(mode:number, position:Vector3D = null)
	{
		super("ParticleRotateToPosition", mode, 3, 3);

		this._pStateClass = ParticleRotateToPositionState;

		this._iPosition = position || new Vector3D();
	}

	/**
	 * @inheritDoc
	 */
	public getAGALVertexCode(shader:ShaderBase, animationSet:ParticleAnimationSet, registerCache:ShaderRegisterCache, animationRegisterData:AnimationRegisterData):string
	{
		var positionAttribute:ShaderRegisterElement = (this._pMode == ParticlePropertiesMode.GLOBAL)? registerCache.getFreeVertexConstant() : registerCache.getFreeVertexAttribute();
		animationRegisterData.setRegisterIndex(this, ParticleRotateToPositionState.POSITION_INDEX, positionAttribute.index);

		var code:string = "";
		var len:number = animationRegisterData.rotationRegisters.length;
		var i:number;
		if (animationSet.hasBillboard) {
			var temp1:ShaderRegisterElement = registerCache.getFreeVertexVectorTemp();
			registerCache.addVertexTempUsages(temp1, 1);
			var temp2:ShaderRegisterElement = registerCache.getFreeVertexVectorTemp();
			registerCache.addVertexTempUsages(temp2, 1);
			var temp3:ShaderRegisterElement = registerCache.getFreeVertexVectorTemp();

			var rotationMatrixRegister:ShaderRegisterElement = registerCache.getFreeVertexConstant();
			animationRegisterData.setRegisterIndex(this, ParticleRotateToPositionState.MATRIX_INDEX, rotationMatrixRegister.index);
			registerCache.getFreeVertexConstant();
			registerCache.getFreeVertexConstant();
			registerCache.getFreeVertexConstant();

			registerCache.removeVertexTempUsage(temp1);
			registerCache.removeVertexTempUsage(temp2);

			//process the position
			code += "sub " + temp1 + ".xyz," + positionAttribute + ".xyz," + animationRegisterData.positionTarget + ".xyz\n";
			code += "m33 " + temp1 + ".xyz," + temp1 + ".xyz," + rotationMatrixRegister + "\n";

			code += "mov " + temp3 + "," + animationRegisterData.vertexZeroConst + "\n";
			code += "mov " + temp3 + ".xy," + temp1 + ".xy\n";
			code += "nrm " + temp3 + ".xyz," + temp3 + ".xyz\n";

			//temp3.x=cos,temp3.y=sin
			//only process z axis
			code += "mov " + temp2 + "," + animationRegisterData.vertexZeroConst + "\n";
			code += "mov " + temp2 + ".x," + temp3 + ".y\n";
			code += "mov " + temp2 + ".y," + temp3 + ".x\n";
			code += "mov " + temp1 + "," + animationRegisterData.vertexZeroConst + "\n";
			code += "mov " + temp1 + ".x," + temp3 + ".x\n";
			code += "neg " + temp1 + ".y," + temp3 + ".y\n";
			code += "mov " + temp3 + "," + animationRegisterData.vertexZeroConst + "\n";
			code += "mov " + temp3 + ".z," + animationRegisterData.vertexOneConst + "\n";
			code += "m33 " + animationRegisterData.scaleAndRotateTarget + ".xyz," + animationRegisterData.scaleAndRotateTarget + ".xyz," + temp1 + "\n";
			for (i = 0; i < len; i++)
				code += "m33 " + animationRegisterData.rotationRegisters[i] + ".xyz," + animationRegisterData.rotationRegisters[i] + "," + temp1 + "\n";
		} else {
			var nrmDirection:ShaderRegisterElement = registerCache.getFreeVertexVectorTemp();
			registerCache.addVertexTempUsages(nrmDirection, 1);

			var temp:ShaderRegisterElement = registerCache.getFreeVertexVectorTemp();
			registerCache.addVertexTempUsages(temp, 1);
			var cos:ShaderRegisterElement = new ShaderRegisterElement(temp.regName, temp.index, 0);
			var sin:ShaderRegisterElement = new ShaderRegisterElement(temp.regName, temp.index, 1);
			var o_temp:ShaderRegisterElement = new ShaderRegisterElement(temp.regName, temp.index, 2);
			var tempSingle:ShaderRegisterElement = new ShaderRegisterElement(temp.regName, temp.index, 3);

			var R:ShaderRegisterElement = registerCache.getFreeVertexVectorTemp();
			registerCache.addVertexTempUsages(R, 1);

			registerCache.removeVertexTempUsage(nrmDirection);
			registerCache.removeVertexTempUsage(temp);
			registerCache.removeVertexTempUsage(R);

			code += "sub " + nrmDirection + ".xyz," + positionAttribute + ".xyz," + animationRegisterData.positionTarget + ".xyz\n";
			code += "nrm " + nrmDirection + ".xyz," + nrmDirection + ".xyz\n";

			code += "mov " + sin + "," + nrmDirection + ".y\n";
			code += "mul " + cos + "," + sin + "," + sin + "\n";
			code += "sub " + cos + "," + animationRegisterData.vertexOneConst + "," + cos + "\n";
			code += "sqt " + cos + "," + cos + "\n";

			code += "mul " + R + ".x," + cos + "," + animationRegisterData.scaleAndRotateTarget + ".y\n";
			code += "mul " + R + ".y," + sin + "," + animationRegisterData.scaleAndRotateTarget + ".z\n";
			code += "mul " + R + ".z," + sin + "," + animationRegisterData.scaleAndRotateTarget + ".y\n";
			code += "mul " + R + ".w," + cos + "," + animationRegisterData.scaleAndRotateTarget + ".z\n";

			code += "sub " + animationRegisterData.scaleAndRotateTarget + ".y," + R + ".x," + R + ".y\n";
			code += "add " + animationRegisterData.scaleAndRotateTarget + ".z," + R + ".z," + R + ".w\n";

			code += "abs " + R + ".y," + nrmDirection + ".y\n";
			code += "sge " + R + ".z," + R + ".y," + animationRegisterData.vertexOneConst + "\n";
			code += "mul " + R + ".x," + R + ".y," + nrmDirection + ".y\n";

			//judgu if nrmDirection=(0,1,0);
			code += "mov " + nrmDirection + ".y," + animationRegisterData.vertexZeroConst + "\n";
			code += "dp3 " + sin + "," + nrmDirection + ".xyz," + nrmDirection + ".xyz\n";
			code += "sge " + tempSingle + "," + animationRegisterData.vertexZeroConst + "," + sin + "\n";

			code += "mov " + nrmDirection + ".y," + animationRegisterData.vertexZeroConst + "\n";
			code += "nrm " + nrmDirection + ".xyz," + nrmDirection + ".xyz\n";

			code += "sub " + sin + "," + animationRegisterData.vertexOneConst + "," + tempSingle + "\n";
			code += "mul " + sin + "," + sin + "," + nrmDirection + ".x\n";

			code += "mov " + cos + "," + nrmDirection + ".z\n";
			code += "neg " + cos + "," + cos + "\n";
			code += "sub " + o_temp + "," + animationRegisterData.vertexOneConst + "," + cos + "\n";
			code += "mul " + o_temp + "," + R + ".x," + tempSingle + "\n";
			code += "add " + cos + "," + cos + "," + o_temp + "\n";

			code += "mul " + R + ".x," + cos + "," + animationRegisterData.scaleAndRotateTarget + ".x\n";
			code += "mul " + R + ".y," + sin + "," + animationRegisterData.scaleAndRotateTarget + ".z\n";
			code += "mul " + R + ".z," + sin + "," + animationRegisterData.scaleAndRotateTarget + ".x\n";
			code += "mul " + R + ".w," + cos + "," + animationRegisterData.scaleAndRotateTarget + ".z\n";

			code += "sub " + animationRegisterData.scaleAndRotateTarget + ".x," + R + ".x," + R + ".y\n";
			code += "add " + animationRegisterData.scaleAndRotateTarget + ".z," + R + ".z," + R + ".w\n";

			for (i = 0; i < len; i++) {
				//just repeat the calculate above
				//because of the limited registers, no need to optimise
				code += "sub " + nrmDirection + ".xyz," + positionAttribute + ".xyz," + animationRegisterData.positionTarget + ".xyz\n";
				code += "nrm " + nrmDirection + ".xyz," + nrmDirection + ".xyz\n";
				code += "mov " + sin + "," + nrmDirection + ".y\n";
				code += "mul " + cos + "," + sin + "," + sin + "\n";
				code += "sub " + cos + "," + animationRegisterData.vertexOneConst + "," + cos + "\n";
				code += "sqt " + cos + "," + cos + "\n";
				code += "mul " + R + ".x," + cos + "," + animationRegisterData.rotationRegisters[i] + ".y\n";
				code += "mul " + R + ".y," + sin + "," + animationRegisterData.rotationRegisters[i] + ".z\n";
				code += "mul " + R + ".z," + sin + "," + animationRegisterData.rotationRegisters[i] + ".y\n";
				code += "mul " + R + ".w," + cos + "," + animationRegisterData.rotationRegisters[i] + ".z\n";
				code += "sub " + animationRegisterData.rotationRegisters[i] + ".y," + R + ".x," + R + ".y\n";
				code += "add " + animationRegisterData.rotationRegisters[i] + ".z," + R + ".z," + R + ".w\n";
				code += "abs " + R + ".y," + nrmDirection + ".y\n";
				code += "sge " + R + ".z," + R + ".y," + animationRegisterData.vertexOneConst + "\n";
				code += "mul " + R + ".x," + R + ".y," + nrmDirection + ".y\n";
				code += "mov " + nrmDirection + ".y," + animationRegisterData.vertexZeroConst + "\n";
				code += "dp3 " + sin + "," + nrmDirection + ".xyz," + nrmDirection + ".xyz\n";
				code += "sge " + tempSingle + "," + animationRegisterData.vertexZeroConst + "," + sin + "\n";
				code += "mov " + nrmDirection + ".y," + animationRegisterData.vertexZeroConst + "\n";
				code += "nrm " + nrmDirection + ".xyz," + nrmDirection + ".xyz\n";
				code += "sub " + sin + "," + animationRegisterData.vertexOneConst + "," + tempSingle + "\n";
				code += "mul " + sin + "," + sin + "," + nrmDirection + ".x\n";
				code += "mov " + cos + "," + nrmDirection + ".z\n";
				code += "neg " + cos + "," + cos + "\n";
				code += "sub " + o_temp + "," + animationRegisterData.vertexOneConst + "," + cos + "\n";
				code += "mul " + o_temp + "," + R + ".x," + tempSingle + "\n";
				code += "add " + cos + "," + cos + "," + o_temp + "\n";
				code += "mul " + R + ".x," + cos + "," + animationRegisterData.rotationRegisters[i] + ".x\n";
				code += "mul " + R + ".y," + sin + "," + animationRegisterData.rotationRegisters[i] + ".z\n";
				code += "mul " + R + ".z," + sin + "," + animationRegisterData.rotationRegisters[i] + ".x\n";
				code += "mul " + R + ".w," + cos + "," + animationRegisterData.rotationRegisters[i] + ".z\n";
				code += "sub " + animationRegisterData.rotationRegisters[i] + ".x," + R + ".x," + R + ".y\n";
				code += "add " + animationRegisterData.rotationRegisters[i] + ".z," + R + ".z," + R + ".w\n";
			}
		}
		return code;
	}

	/**
	 * @inheritDoc
	 */
	public getAnimationState(animator:AnimatorBase):ParticleRotateToPositionState
	{
		return <ParticleRotateToPositionState> animator.getAnimationState(this);
	}

	/**
	 * @inheritDoc
	 */
	public _iGeneratePropertyOfOneParticle(param:ParticleProperties):void
	{
		var offset:Vector3D = param[ParticleRotateToPositionNode.POSITION_VECTOR3D];
		if (!offset)
			throw(new Error("there is no " + ParticleRotateToPositionNode.POSITION_VECTOR3D + " in param!"));

		this._pOneData[0] = offset.x;
		this._pOneData[1] = offset.y;
		this._pOneData[2] = offset.z;
	}
}