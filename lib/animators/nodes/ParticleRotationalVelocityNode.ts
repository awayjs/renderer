import {Vector3D}							from "@awayjs/core/lib/geom/Vector3D";

import {AnimatorBase}						from "../../animators/AnimatorBase";
import {ParticleAnimationSet}				from "../../animators/ParticleAnimationSet";
import {AnimationRegisterData}			from "../../animators/data/AnimationRegisterData";
import {ParticleProperties}				from "../../animators/data/ParticleProperties";
import {ParticlePropertiesMode}			from "../../animators/data/ParticlePropertiesMode";
import {ParticleNodeBase}					from "../../animators/nodes/ParticleNodeBase";
import {ParticleRotationalVelocityState}	from "../../animators/states/ParticleRotationalVelocityState";
import {ShaderBase}						from "../../shaders/ShaderBase";
import {ShaderRegisterCache}				from "../../shaders/ShaderRegisterCache";
import {ShaderRegisterElement}			from "../../shaders/ShaderRegisterElement";

/**
 * A particle animation node used to set the starting rotational velocity of a particle.
 */
export class ParticleRotationalVelocityNode extends ParticleNodeBase
{
	/** @private */
	public _iRotationalVelocity:Vector3D;

	/**
	 * Reference for rotational velocity node properties on a single particle (when in local property mode).
	 * Expects a <code>Vector3D</code> object representing the rotational velocity around an axis of the particle.
	 */
	public static ROTATIONALVELOCITY_VECTOR3D:string = "RotationalVelocityVector3D";

	/**
	 * Creates a new <code>ParticleRotationalVelocityNode</code>
	 *
	 * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
	 */
	constructor(mode:number, rotationalVelocity:Vector3D = null)
	{
		super("ParticleRotationalVelocity", mode, 4);

		this._pStateClass = ParticleRotationalVelocityState;

		this._iRotationalVelocity = rotationalVelocity || new Vector3D();
	}

	/**
	 * @inheritDoc
	 */
	public getAGALVertexCode(shader:ShaderBase, animationSet:ParticleAnimationSet, registerCache:ShaderRegisterCache, animationRegisterData:AnimationRegisterData):string
	{
		var rotationRegister:ShaderRegisterElement = (this._pMode == ParticlePropertiesMode.GLOBAL)? registerCache.getFreeVertexConstant() : registerCache.getFreeVertexAttribute();
		animationRegisterData.setRegisterIndex(this, ParticleRotationalVelocityState.ROTATIONALVELOCITY_INDEX, rotationRegister.index);

		var nrmVel:ShaderRegisterElement = registerCache.getFreeVertexVectorTemp();
		registerCache.addVertexTempUsages(nrmVel, 1);

		var xAxis:ShaderRegisterElement = registerCache.getFreeVertexVectorTemp();
		registerCache.addVertexTempUsages(xAxis, 1);

		var temp:ShaderRegisterElement = registerCache.getFreeVertexVectorTemp();
		registerCache.addVertexTempUsages(temp, 1);
		var Rtemp:ShaderRegisterElement = new ShaderRegisterElement(temp.regName, temp.index);
		var R_rev:ShaderRegisterElement = registerCache.getFreeVertexVectorTemp();
		R_rev = new ShaderRegisterElement(R_rev.regName, R_rev.index);

		var cos:ShaderRegisterElement = new ShaderRegisterElement(Rtemp.regName, Rtemp.index, 3);
		var sin:ShaderRegisterElement = new ShaderRegisterElement(R_rev.regName, R_rev.index, 3);

		registerCache.removeVertexTempUsage(nrmVel);
		registerCache.removeVertexTempUsage(xAxis);
		registerCache.removeVertexTempUsage(temp);

		var code:string = "";
		code += "mov " + nrmVel + ".xyz," + rotationRegister + ".xyz\n";
		code += "mov " + nrmVel + ".w," + animationRegisterData.vertexZeroConst + "\n";

		code += "mul " + cos + "," + animationRegisterData.vertexTime + "," + rotationRegister + ".w\n";

		code += "sin " + sin + "," + cos + "\n";
		code += "cos " + cos + "," + cos + "\n";

		code += "mul " + Rtemp + ".xyz," + sin + "," + nrmVel + ".xyz\n";

		code += "mul " + R_rev + ".xyz," + sin + "," + nrmVel + ".xyz\n";
		code += "neg " + R_rev + ".xyz," + R_rev + ".xyz\n";

		//nrmVel and xAxis are used as temp register
		code += "crs " + nrmVel + ".xyz," + Rtemp + ".xyz," + animationRegisterData.scaleAndRotateTarget + ".xyz\n";

		code += "mul " + xAxis + ".xyz," + cos + "," + animationRegisterData.scaleAndRotateTarget + ".xyz\n";
		code += "add " + nrmVel + ".xyz," + nrmVel + ".xyz," + xAxis + ".xyz\n";
		code += "dp3 " + xAxis + ".w," + Rtemp + ".xyz," + animationRegisterData.scaleAndRotateTarget + ".xyz\n";
		code += "neg " + nrmVel + ".w," + xAxis + ".w\n";

		code += "crs " + Rtemp + ".xyz," + nrmVel + ".xyz," + R_rev + ".xyz\n";

		//use cos as R_rev.w
		code += "mul " + xAxis + ".xyzw," + nrmVel + ".xyzw," + cos + "\n";
		code += "add " + Rtemp + ".xyz," + Rtemp + ".xyz," + xAxis + ".xyz\n";
		code += "mul " + xAxis + ".xyz," + nrmVel + ".w," + R_rev + ".xyz\n";

		code += "add " + animationRegisterData.scaleAndRotateTarget + ".xyz," + Rtemp + ".xyz," + xAxis + ".xyz\n";

		var len:number = animationRegisterData.rotationRegisters.length;
		for (var i:number = 0; i < len; i++) {
			code += "mov " + nrmVel + ".xyz," + rotationRegister + ".xyz\n";
			code += "mov " + nrmVel + ".w," + animationRegisterData.vertexZeroConst + "\n";
			code += "mul " + cos + "," + animationRegisterData.vertexTime + "," + rotationRegister + ".w\n";
			code += "sin " + sin + "," + cos + "\n";
			code += "cos " + cos + "," + cos + "\n";
			code += "mul " + Rtemp + ".xyz," + sin + "," + nrmVel + ".xyz\n";
			code += "mul " + R_rev + ".xyz," + sin + "," + nrmVel + ".xyz\n";
			code += "neg " + R_rev + ".xyz," + R_rev + ".xyz\n";
			code += "crs " + nrmVel + ".xyz," + Rtemp + ".xyz," + animationRegisterData.rotationRegisters[i] + ".xyz\n";
			code += "mul " + xAxis + ".xyz," + cos + "," + animationRegisterData.rotationRegisters[i] + "\n";
			code += "add " + nrmVel + ".xyz," + nrmVel + ".xyz," + xAxis + ".xyz\n";
			code += "dp3 " + xAxis + ".w," + Rtemp + ".xyz," + animationRegisterData.rotationRegisters[i] + "\n";
			code += "neg " + nrmVel + ".w," + xAxis + ".w\n";
			code += "crs " + Rtemp + ".xyz," + nrmVel + ".xyz," + R_rev + ".xyz\n";
			code += "mul " + xAxis + ".xyzw," + nrmVel + ".xyzw," + cos + "\n";
			code += "add " + Rtemp + ".xyz," + Rtemp + ".xyz," + xAxis + ".xyz\n";
			code += "mul " + xAxis + ".xyz," + nrmVel + ".w," + R_rev + ".xyz\n";
			code += "add " + animationRegisterData.rotationRegisters[i] + "," + Rtemp + ".xyz," + xAxis + ".xyz\n";
		}
		return code;
	}

	/**
	 * @inheritDoc
	 */
	public getAnimationState(animator:AnimatorBase):ParticleRotationalVelocityState
	{
		return <ParticleRotationalVelocityState> animator.getAnimationState(this);
	}

	/**
	 * @inheritDoc
	 */
	public _iGeneratePropertyOfOneParticle(param:ParticleProperties):void
	{
		//(Vector3d.x,Vector3d.y,Vector3d.z) is rotation axis,Vector3d.w is cycle duration
		var rotate:Vector3D = param[ParticleRotationalVelocityNode.ROTATIONALVELOCITY_VECTOR3D];
		if (!rotate)
			throw(new Error("there is no " + ParticleRotationalVelocityNode.ROTATIONALVELOCITY_VECTOR3D + " in param!"));

		if (rotate.length <= 0)
			rotate.z = 1; //set the default direction
		else
			rotate.normalize();

		this._pOneData[0] = rotate.x;
		this._pOneData[1] = rotate.y;
		this._pOneData[2] = rotate.z;
		if (rotate.w <= 0)
			throw(new Error("the cycle duration must greater than zero"));
		// it's used as angle/2 in agal
		this._pOneData[3] = Math.PI/rotate.w;
	}
}