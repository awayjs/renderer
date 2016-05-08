import Vector3D							from "awayjs-core/lib/geom/Vector3D";

import Camera							from "awayjs-display/lib/display/Camera";

import Stage							from "awayjs-stagegl/lib/base/Stage";
import ContextGLVertexBufferFormat		from "awayjs-stagegl/lib/base/ContextGLVertexBufferFormat";

import ParticleAnimator					from "../../animators/ParticleAnimator";
import AnimationRegisterData			from "../../animators/data/AnimationRegisterData";
import AnimationElements				from "../../animators/data/AnimationElements";
import ParticlePropertiesMode			from "../../animators/data/ParticlePropertiesMode";
import ParticleVelocityNode				from "../../animators/nodes/ParticleVelocityNode";
import ParticleStateBase				from "../../animators/states/ParticleStateBase";
import GL_RenderableBase				from "../../renderables/GL_RenderableBase";
import ShaderBase						from "../../shaders/ShaderBase";

/**
 * ...
 */
class ParticleVelocityState extends ParticleStateBase
{
	/** @private */
	public static VELOCITY_INDEX:number = 0;

	private _particleVelocityNode:ParticleVelocityNode;
	private _velocity:Vector3D;

	/**
	 * Defines the default velocity vector of the state, used when in global mode.
	 */
	public get velocity():Vector3D
	{
		return this._velocity;
	}

	public set velocity(value:Vector3D)
	{
		this._velocity = value;
	}

	/**
	 *
	 */
	public getVelocities():Array<Vector3D>
	{
		return this._pDynamicProperties;
	}

	public setVelocities(value:Array<Vector3D>)
	{
		this._pDynamicProperties = value;

		this._pDynamicPropertiesDirty = new Object();
	}

	constructor(animator:ParticleAnimator, particleVelocityNode:ParticleVelocityNode)
	{
		super(animator, particleVelocityNode);

		this._particleVelocityNode = particleVelocityNode;
		this._velocity = this._particleVelocityNode._iVelocity;
	}

	public setRenderState(shader:ShaderBase, renderable:GL_RenderableBase, animationElements:AnimationElements, animationRegisterData:AnimationRegisterData, camera:Camera, stage:Stage)
	{
		if (this._particleVelocityNode.mode == ParticlePropertiesMode.LOCAL_DYNAMIC && !this._pDynamicPropertiesDirty[animationElements._iUniqueId])
			this._pUpdateDynamicProperties(animationElements);

		var index:number = animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleVelocityState.VELOCITY_INDEX);

		if (this._particleVelocityNode.mode == ParticlePropertiesMode.GLOBAL)
			shader.setVertexConst(index, this._velocity.x, this._velocity.y, this._velocity.z);
		else
			animationElements.activateVertexBuffer(index, this._particleVelocityNode._iDataOffset, stage, ContextGLVertexBufferFormat.FLOAT_3);
	}
}

export default ParticleVelocityState;