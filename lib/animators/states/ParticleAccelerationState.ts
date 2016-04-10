import Vector3D							from "awayjs-core/lib/geom/Vector3D";

import Camera							from "awayjs-display/lib/display/Camera";

import Stage							from "awayjs-stagegl/lib/base/Stage";
import ContextGLVertexBufferFormat		from "awayjs-stagegl/lib/base/ContextGLVertexBufferFormat";

import ParticleAnimator					from "../../animators/ParticleAnimator";
import AnimationRegisterCache			from "../../animators/data/AnimationRegisterCache";
import AnimationElements				from "../../animators/data/AnimationElements";
import ParticlePropertiesMode			from "../../animators/data/ParticlePropertiesMode";
import ParticleAccelerationNode			from "../../animators/nodes/ParticleAccelerationNode";
import ParticleStateBase				from "../../animators/states/ParticleStateBase";
import GL_RenderableBase				from "../../animators/../renderables/GL_RenderableBase";

/**
 * ...
 */
class ParticleAccelerationState extends ParticleStateBase
{
	/** @private */
	public static ACCELERATION_INDEX:number /*int*/ = 0;

	private _particleAccelerationNode:ParticleAccelerationNode;
	private _acceleration:Vector3D;
	private _halfAcceleration:Vector3D;
	
	/**
	 * Defines the acceleration vector of the state, used when in global mode.
	 */
	public get acceleration():Vector3D
	{
		return this._acceleration;
	}
	
	public set acceleration(value:Vector3D)
	{
		this._acceleration.x = value.x;
		this._acceleration.y = value.y;
		this._acceleration.z = value.z;

		this.updateAccelerationData();
	}
	
	constructor(animator:ParticleAnimator, particleAccelerationNode:ParticleAccelerationNode)
	{
		super(animator, particleAccelerationNode);

		this._particleAccelerationNode = particleAccelerationNode;
		this._acceleration = this._particleAccelerationNode._acceleration;

		this.updateAccelerationData();
	}
	
	/**
	 * @inheritDoc
	 */
	public setRenderState(stage:Stage, renderable:GL_RenderableBase, animationElements:AnimationElements, animationRegisterCache:AnimationRegisterCache, camera:Camera)
	{
		var index:number /*int*/ = animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleAccelerationState.ACCELERATION_INDEX);
		
		if (this._particleAccelerationNode.mode == ParticlePropertiesMode.LOCAL_STATIC)
			animationElements.activateVertexBuffer(index, this._particleAccelerationNode._iDataOffset, stage, ContextGLVertexBufferFormat.FLOAT_3);
		else
			animationRegisterCache.setVertexConst(index, this._halfAcceleration.x, this._halfAcceleration.y, this._halfAcceleration.z);
	}
	
	private updateAccelerationData()
	{
		if (this._particleAccelerationNode.mode == ParticlePropertiesMode.GLOBAL)
			this._halfAcceleration = new Vector3D(this._acceleration.x/2, this._acceleration.y/2, this._acceleration.z/2);
	}
}

export default ParticleAccelerationState;