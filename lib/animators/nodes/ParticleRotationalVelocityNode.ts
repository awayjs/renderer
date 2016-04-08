import Vector3D							from "awayjs-core/lib/geom/Vector3D";

import AnimatorBase						from "awayjs-renderergl/lib/animators/AnimatorBase";
import AnimationRegisterCache			from "awayjs-renderergl/lib/animators/data/AnimationRegisterCache";
import ParticleProperties				from "awayjs-renderergl/lib/animators/data/ParticleProperties";
import ParticlePropertiesMode			from "awayjs-renderergl/lib/animators/data/ParticlePropertiesMode";
import ParticleNodeBase					from "awayjs-renderergl/lib/animators/nodes/ParticleNodeBase";
import ParticleRotationalVelocityState	from "awayjs-renderergl/lib/animators/states/ParticleRotationalVelocityState";
import ShaderBase						from "awayjs-renderergl/lib/shaders/ShaderBase";
import ShaderRegisterElement			from "awayjs-renderergl/lib/shaders/ShaderRegisterElement";

/**
 * A particle animation node used to set the starting rotational velocity of a particle.
 */
class ParticleRotationalVelocityNode extends ParticleNodeBase
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
	constructor(mode:number /*uint*/, rotationalVelocity:Vector3D = null)
	{
		super("ParticleRotationalVelocity", mode, 4);

		this._pStateClass = ParticleRotationalVelocityState;

		this._iRotationalVelocity = rotationalVelocity || new Vector3D();
	}

	/**
	 * @inheritDoc
	 */
	public getAGALVertexCode(shader:ShaderBase, animationRegisterCache:AnimationRegisterCache):string
	{
		var rotationRegister:ShaderRegisterElement = (this._pMode == ParticlePropertiesMode.GLOBAL)? animationRegisterCache.getFreeVertexConstant() : animationRegisterCache.getFreeVertexAttribute();
		animationRegisterCache.setRegisterIndex(this, ParticleRotationalVelocityState.ROTATIONALVELOCITY_INDEX, rotationRegister.index);

		var nrmVel:ShaderRegisterElement = animationRegisterCache.getFreeVertexVectorTemp();
		animationRegisterCache.addVertexTempUsages(nrmVel, 1);

		var xAxis:ShaderRegisterElement = animationRegisterCache.getFreeVertexVectorTemp();
		animationRegisterCache.addVertexTempUsages(xAxis, 1);

		var temp:ShaderRegisterElement = animationRegisterCache.getFreeVertexVectorTemp();
		animationRegisterCache.addVertexTempUsages(temp, 1);
		var Rtemp:ShaderRegisterElement = new ShaderRegisterElement(temp.regName, temp.index);
		var R_rev:ShaderRegisterElement = animationRegisterCache.getFreeVertexVectorTemp();
		R_rev = new ShaderRegisterElement(R_rev.regName, R_rev.index);

		var cos:ShaderRegisterElement = new ShaderRegisterElement(Rtemp.regName, Rtemp.index, 3);
		var sin:ShaderRegisterElement = new ShaderRegisterElement(R_rev.regName, R_rev.index, 3);

		animationRegisterCache.removeVertexTempUsage(nrmVel);
		animationRegisterCache.removeVertexTempUsage(xAxis);
		animationRegisterCache.removeVertexTempUsage(temp);

		var code:string = "";
		code += "mov " + nrmVel + ".xyz," + rotationRegister + ".xyz\n";
		code += "mov " + nrmVel + ".w," + animationRegisterCache.vertexZeroConst + "\n";

		code += "mul " + cos + "," + animationRegisterCache.vertexTime + "," + rotationRegister + ".w\n";

		code += "sin " + sin + "," + cos + "\n";
		code += "cos " + cos + "," + cos + "\n";

		code += "mul " + Rtemp + ".xyz," + sin + "," + nrmVel + ".xyz\n";

		code += "mul " + R_rev + ".xyz," + sin + "," + nrmVel + ".xyz\n";
		code += "neg " + R_rev + ".xyz," + R_rev + ".xyz\n";

		//nrmVel and xAxis are used as temp register
		code += "crs " + nrmVel + ".xyz," + Rtemp + ".xyz," + animationRegisterCache.scaleAndRotateTarget + ".xyz\n";

		code += "mul " + xAxis + ".xyz," + cos + "," + animationRegisterCache.scaleAndRotateTarget + ".xyz\n";
		code += "add " + nrmVel + ".xyz," + nrmVel + ".xyz," + xAxis + ".xyz\n";
		code += "dp3 " + xAxis + ".w," + Rtemp + ".xyz," + animationRegisterCache.scaleAndRotateTarget + ".xyz\n";
		code += "neg " + nrmVel + ".w," + xAxis + ".w\n";

		code += "crs " + Rtemp + ".xyz," + nrmVel + ".xyz," + R_rev + ".xyz\n";

		//use cos as R_rev.w
		code += "mul " + xAxis + ".xyzw," + nrmVel + ".xyzw," + cos + "\n";
		code += "add " + Rtemp + ".xyz," + Rtemp + ".xyz," + xAxis + ".xyz\n";
		code += "mul " + xAxis + ".xyz," + nrmVel + ".w," + R_rev + ".xyz\n";

		code += "add " + animationRegisterCache.scaleAndRotateTarget + ".xyz," + Rtemp + ".xyz," + xAxis + ".xyz\n";

		var len:number /*int*/ = animationRegisterCache.rotationRegisters.length;
		for (var i:number /*int*/ = 0; i < len; i++) {
			code += "mov " + nrmVel + ".xyz," + rotationRegister + ".xyz\n";
			code += "mov " + nrmVel + ".w," + animationRegisterCache.vertexZeroConst + "\n";
			code += "mul " + cos + "," + animationRegisterCache.vertexTime + "," + rotationRegister + ".w\n";
			code += "sin " + sin + "," + cos + "\n";
			code += "cos " + cos + "," + cos + "\n";
			code += "mul " + Rtemp + ".xyz," + sin + "," + nrmVel + ".xyz\n";
			code += "mul " + R_rev + ".xyz," + sin + "," + nrmVel + ".xyz\n";
			code += "neg " + R_rev + ".xyz," + R_rev + ".xyz\n";
			code += "crs " + nrmVel + ".xyz," + Rtemp + ".xyz," + animationRegisterCache.rotationRegisters[i] + ".xyz\n";
			code += "mul " + xAxis + ".xyz," + cos + "," + animationRegisterCache.rotationRegisters[i] + "\n";
			code += "add " + nrmVel + ".xyz," + nrmVel + ".xyz," + xAxis + ".xyz\n";
			code += "dp3 " + xAxis + ".w," + Rtemp + ".xyz," + animationRegisterCache.rotationRegisters[i] + "\n";
			code += "neg " + nrmVel + ".w," + xAxis + ".w\n";
			code += "crs " + Rtemp + ".xyz," + nrmVel + ".xyz," + R_rev + ".xyz\n";
			code += "mul " + xAxis + ".xyzw," + nrmVel + ".xyzw," + cos + "\n";
			code += "add " + Rtemp + ".xyz," + Rtemp + ".xyz," + xAxis + ".xyz\n";
			code += "mul " + xAxis + ".xyz," + nrmVel + ".w," + R_rev + ".xyz\n";
			code += "add " + animationRegisterCache.rotationRegisters[i] + "," + Rtemp + ".xyz," + xAxis + ".xyz\n";
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
	public _iGeneratePropertyOfOneParticle(param:ParticleProperties)
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

export default ParticleRotationalVelocityNode;