import Vector3D							= require("awayjs-core/lib/core/geom/Vector3D");

import AnimatorBase						= require("awayjs-stagegl/lib/animators/AnimatorBase");
import AnimationRegisterCache			= require("awayjs-stagegl/lib/animators/data/AnimationRegisterCache");
import ShaderObjectBase					= require("awayjs-stagegl/lib/materials/compilation/ShaderObjectBase");
import ShaderRegisterElement			= require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterElement");

import ParticleProperties				= require("awayjs-renderergl/lib/animators/data/ParticleProperties");
import ParticlePropertiesMode			= require("awayjs-renderergl/lib/animators/data/ParticlePropertiesMode");
import ParticleNodeBase					= require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
import ParticlePositionState			= require("awayjs-renderergl/lib/animators/states/ParticlePositionState");

/**
 * A particle animation node used to set the starting position of a particle.
 */
class ParticlePositionNode extends ParticleNodeBase
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
	constructor(mode:number /*uint*/, position:Vector3D = null)
	{
		super("ParticlePosition", mode, 3);

		this._pStateClass = ParticlePositionState;

		this._iPosition = position || new Vector3D();
	}

	/**
	 * @inheritDoc
	 */
	public getAGALVertexCode(shaderObject:ShaderObjectBase, animationRegisterCache:AnimationRegisterCache):string
	{
		var positionAttribute:ShaderRegisterElement = (this._pMode == ParticlePropertiesMode.GLOBAL)? animationRegisterCache.getFreeVertexConstant() : animationRegisterCache.getFreeVertexAttribute();
		animationRegisterCache.setRegisterIndex(this, ParticlePositionState.POSITION_INDEX, positionAttribute.index);

		return "add " + animationRegisterCache.positionTarget + ".xyz," + positionAttribute + ".xyz," + animationRegisterCache.positionTarget + ".xyz\n";
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
	public _iGeneratePropertyOfOneParticle(param:ParticleProperties)
	{
		var offset:Vector3D = param[ParticlePositionNode.POSITION_VECTOR3D];
		if (!offset)
			throw(new Error("there is no " + ParticlePositionNode.POSITION_VECTOR3D + " in param!"));

		this._pOneData[0] = offset.x;
		this._pOneData[1] = offset.y;
		this._pOneData[2] = offset.z;
	}
}

export = ParticlePositionNode;