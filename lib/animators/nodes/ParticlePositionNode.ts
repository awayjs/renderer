import {Vector3D}							from "@awayjs/core/lib/geom/Vector3D";

import {AnimatorBase}						from "../../animators/AnimatorBase";
import {ParticleAnimationSet}				from "../../animators/ParticleAnimationSet";
import {AnimationRegisterData}			from "../../animators/data/AnimationRegisterData";
import {ParticleProperties}				from "../../animators/data/ParticleProperties";
import {ParticlePropertiesMode}			from "../../animators/data/ParticlePropertiesMode";
import {ParticleNodeBase}					from "../../animators/nodes/ParticleNodeBase";
import {ParticlePositionState}			from "../../animators/states/ParticlePositionState";
import {ShaderBase}						from "../../shaders/ShaderBase";
import {ShaderRegisterCache}				from "../../shaders/ShaderRegisterCache";
import {ShaderRegisterElement}			from "../../shaders/ShaderRegisterElement";

/**
 * A particle animation node used to set the starting position of a particle.
 */
export class ParticlePositionNode extends ParticleNodeBase
{
	/** @private */
	public _iPosition:Vector3D;

	/**
	 * Reference for position node properties on a single particle (when in local property mode).
	 * Expects a <code>Vector3D</code> object representing position of the particle.
	 */
	public static POSITION_VECTOR3D:string = "PositionVector3D";

	/**
	 * Creates a new <code>ParticlePositionNode</code>
	 *
	 * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
	 * @param    [optional] position        Defines the default position of the particle when in global mode. Defaults to 0,0,0.
	 */
	constructor(mode:number, position:Vector3D = null)
	{
		super("ParticlePosition", mode, 3);

		this._pStateClass = ParticlePositionState;

		this._iPosition = position || new Vector3D();
	}

	/**
	 * @inheritDoc
	 */
	public getAGALVertexCode(shader:ShaderBase, animationSet:ParticleAnimationSet, registerCache:ShaderRegisterCache, animationRegisterData:AnimationRegisterData):string
	{
		var positionAttribute:ShaderRegisterElement = (this._pMode == ParticlePropertiesMode.GLOBAL)? registerCache.getFreeVertexConstant() : registerCache.getFreeVertexAttribute();
		animationRegisterData.setRegisterIndex(this, ParticlePositionState.POSITION_INDEX, positionAttribute.index);

		return "add " + animationRegisterData.positionTarget + ".xyz," + positionAttribute + ".xyz," + animationRegisterData.positionTarget + ".xyz\n";
	}

	/**
	 * @inheritDoc
	 */
	public getAnimationState(animator:AnimatorBase):ParticlePositionState
	{
		return <ParticlePositionState> animator.getAnimationState(this);
	}

	/**
	 * @inheritDoc
	 */
	public _iGeneratePropertyOfOneParticle(param:ParticleProperties):void
	{
		var offset:Vector3D = param[ParticlePositionNode.POSITION_VECTOR3D];
		if (!offset)
			throw(new Error("there is no " + ParticlePositionNode.POSITION_VECTOR3D + " in param!"));

		this._pOneData[0] = offset.x;
		this._pOneData[1] = offset.y;
		this._pOneData[2] = offset.z;
	}
}