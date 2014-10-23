import Vector3D							= require("awayjs-core/lib/geom/Vector3D");

import Camera							= require("awayjs-display/lib/entities/Camera");

import AnimationRegisterCache			= require("awayjs-stagegl/lib/animators/data/AnimationRegisterCache");
import Stage							= require("awayjs-stagegl/lib/base/Stage");
import RenderableBase					= require("awayjs-stagegl/lib/pool/RenderableBase");
import ContextGLVertexBufferFormat		= require("awayjs-stagegl/lib/base/ContextGLVertexBufferFormat");

import ParticleAnimator					= require("awayjs-renderergl/lib/animators/ParticleAnimator");
import AnimationSubGeometry				= require("awayjs-renderergl/lib/animators/data/AnimationSubGeometry");
import ParticlePropertiesMode			= require("awayjs-renderergl/lib/animators/data/ParticlePropertiesMode");
import ParticleVelocityNode				= require("awayjs-renderergl/lib/animators/nodes/ParticleVelocityNode");
import ParticleStateBase				= require("awayjs-renderergl/lib/animators/states/ParticleStateBase");

/**
 * ...
 */
class ParticleVelocityState extends ParticleStateBase
{
	/** @private */
	public static VELOCITY_INDEX:number /*int*/ = 0;

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

	public setRenderState(stage:Stage, renderable:RenderableBase, animationSubGeometry:AnimationSubGeometry, animationRegisterCache:AnimationRegisterCache, camera:Camera)
	{
		if (this._particleVelocityNode.mode == ParticlePropertiesMode.LOCAL_DYNAMIC && !this._pDynamicPropertiesDirty[animationSubGeometry._iUniqueId])
			this._pUpdateDynamicProperties(animationSubGeometry);

		var index:number /*int*/ = animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleVelocityState.VELOCITY_INDEX);

		if (this._particleVelocityNode.mode == ParticlePropertiesMode.GLOBAL)
			animationRegisterCache.setVertexConst(index, this._velocity.x, this._velocity.y, this._velocity.z);
		else
			animationSubGeometry.activateVertexBuffer(index, this._particleVelocityNode._iDataOffset, stage, ContextGLVertexBufferFormat.FLOAT_3);
	}
}

export = ParticleVelocityState;