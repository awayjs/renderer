import {Vector3D}							from "@awayjs/core/lib/geom/Vector3D";

import {AnimatorBase}						from "../../animators/AnimatorBase";
import {ParticleAnimationSet}				from "../../animators/ParticleAnimationSet";
import {AnimationRegisterData}			from "../../animators/data/AnimationRegisterData";
import {ParticleProperties}				from "../../animators/data/ParticleProperties";
import {ParticlePropertiesMode}			from "../../animators/data/ParticlePropertiesMode";
import {ParticleNodeBase}					from "../../animators/nodes/ParticleNodeBase";
import {ParticleAccelerationState}		from "../../animators/states/ParticleAccelerationState";
import {ShaderBase}						from "../../shaders/ShaderBase";
import {ShaderRegisterCache}				from "../../shaders/ShaderRegisterCache";
import {ShaderRegisterElement}			from "../../shaders/ShaderRegisterElement";

/**
 * A particle animation node used to apply a constant acceleration vector to the motion of a particle.
 */
export class ParticleAccelerationNode extends ParticleNodeBase
{
	/** @private */
	public _acceleration:Vector3D;

	/**
	 * Reference for acceleration node properties on a single particle (when in local property mode).
	 * Expects a <code>Vector3D</code> object representing the direction of acceleration on the particle.
	 */
	public static ACCELERATION_VECTOR3D:string = "AccelerationVector3D";

	/**
	 * Creates a new <code>ParticleAccelerationNode</code>
	 *
	 * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
	 * @param    [optional] acceleration    Defines the default acceleration vector of the node, used when in global mode.
	 */
	constructor(mode:number, acceleration:Vector3D = null)
	{
		super("ParticleAcceleration", mode, 3);

		this._pStateClass = ParticleAccelerationState;

		this._acceleration = acceleration || new Vector3D();
	}

	/**
	 * @inheritDoc
	 */
	public getAGALVertexCode(shader:ShaderBase, animationSet:ParticleAnimationSet, registerCache:ShaderRegisterCache, animationRegisterData:AnimationRegisterData):string
	{
		var accelerationValue:ShaderRegisterElement = (this._pMode == ParticlePropertiesMode.GLOBAL)? registerCache.getFreeVertexConstant() : registerCache.getFreeVertexAttribute();
		animationRegisterData.setRegisterIndex(this, ParticleAccelerationState.ACCELERATION_INDEX, accelerationValue.index);

		var temp:ShaderRegisterElement = registerCache.getFreeVertexVectorTemp();
		registerCache.addVertexTempUsages(temp, 1);

		var code:string = "mul " + temp + "," + animationRegisterData.vertexTime + "," + accelerationValue + "\n";

		if (animationSet.needVelocity) {
			var temp2:ShaderRegisterElement = registerCache.getFreeVertexVectorTemp();
			code += "mul " + temp2 + "," + temp + "," + animationRegisterData.vertexTwoConst + "\n";
			code += "add " + animationRegisterData.velocityTarget + ".xyz," + temp2 + ".xyz," + animationRegisterData.velocityTarget + ".xyz\n";
		}
		registerCache.removeVertexTempUsage(temp);

		code += "mul " + temp + "," + temp + "," + animationRegisterData.vertexTime + "\n";
		code += "add " + animationRegisterData.positionTarget + ".xyz," + temp + "," + animationRegisterData.positionTarget + ".xyz\n";
		return code;
	}

	/**
	 * @inheritDoc
	 */
	public getAnimationState(animator:AnimatorBase):ParticleAccelerationState
	{
		return <ParticleAccelerationState> animator.getAnimationState(this);
	}

	/**
	 * @inheritDoc
	 */
	public _iGeneratePropertyOfOneParticle(param:ParticleProperties):void
	{
		var tempAcceleration:Vector3D = param[ParticleAccelerationNode.ACCELERATION_VECTOR3D];
		if (!tempAcceleration)
			throw new Error("there is no " + ParticleAccelerationNode.ACCELERATION_VECTOR3D + " in param!");

		this._pOneData[0] = tempAcceleration.x/2;
		this._pOneData[1] = tempAcceleration.y/2;
		this._pOneData[2] = tempAcceleration.z/2;
	}
}