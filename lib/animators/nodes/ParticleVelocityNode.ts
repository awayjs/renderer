import {Vector3D}							from "@awayjs/core/lib/geom/Vector3D";

import {AnimatorBase}						from "../../animators/AnimatorBase";
import {ParticleAnimationSet}				from "../../animators/ParticleAnimationSet";
import {AnimationRegisterData}			from "../../animators/data/AnimationRegisterData";
import {ParticleProperties}				from "../../animators/data/ParticleProperties";
import {ParticlePropertiesMode}			from "../../animators/data/ParticlePropertiesMode";
import {ParticleNodeBase}					from "../../animators/nodes/ParticleNodeBase";
import {ParticleVelocityState}			from "../../animators/states/ParticleVelocityState";
import {ShaderBase}						from "../../shaders/ShaderBase";
import {ShaderRegisterCache}				from "../../shaders/ShaderRegisterCache";
import {ShaderRegisterElement}			from "../../shaders/ShaderRegisterElement";

/**
 * A particle animation node used to set the starting velocity of a particle.
 */
export class ParticleVelocityNode extends ParticleNodeBase
{
	/** @private */
	public _iVelocity:Vector3D;

	/**
	 * Reference for velocity node properties on a single particle (when in local property mode).
	 * Expects a <code>Vector3D</code> object representing the direction of movement on the particle.
	 */
	public static VELOCITY_VECTOR3D:string = "VelocityVector3D";

	/**
	 * Creates a new <code>ParticleVelocityNode</code>
	 *
	 * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
	 * @param    [optional] velocity        Defines the default velocity vector of the node, used when in global mode.
	 */
	constructor(mode:number, velocity:Vector3D = null)
	{
		super("ParticleVelocity", mode, 3);

		this._pStateClass = ParticleVelocityState;

		this._iVelocity = velocity || new Vector3D();
	}

	/**
	 * @inheritDoc
	 */
	public getAGALVertexCode(shader:ShaderBase, animationSet:ParticleAnimationSet, registerCache:ShaderRegisterCache, animationRegisterData:AnimationRegisterData):string
	{
		var velocityValue:ShaderRegisterElement = (this._pMode == ParticlePropertiesMode.GLOBAL)? registerCache.getFreeVertexConstant() : registerCache.getFreeVertexAttribute();
		animationRegisterData.setRegisterIndex(this, ParticleVelocityState.VELOCITY_INDEX, velocityValue.index);

		var distance:ShaderRegisterElement = registerCache.getFreeVertexVectorTemp();
		var code:string = "";
		code += "mul " + distance + "," + animationRegisterData.vertexTime + "," + velocityValue + "\n";
		code += "add " + animationRegisterData.positionTarget + ".xyz," + distance + "," + animationRegisterData.positionTarget + ".xyz\n";

		if (animationSet.needVelocity)
			code += "add " + animationRegisterData.velocityTarget + ".xyz," + velocityValue + ".xyz," + animationRegisterData.velocityTarget + ".xyz\n";

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public getAnimationState(animator:AnimatorBase):ParticleVelocityState
	{
		return <ParticleVelocityState> animator.getAnimationState(this);
	}

	/**
	 * @inheritDoc
	 */
	public _iGeneratePropertyOfOneParticle(param:ParticleProperties):void
	{
		var _tempVelocity:Vector3D = param[ParticleVelocityNode.VELOCITY_VECTOR3D];
		if (!_tempVelocity)
			throw new Error("there is no " + ParticleVelocityNode.VELOCITY_VECTOR3D + " in param!");

		this._pOneData[0] = _tempVelocity.x;
		this._pOneData[1] = _tempVelocity.y;
		this._pOneData[2] = _tempVelocity.z;
	}
}