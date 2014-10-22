import Vector3D							= require("awayjs-core/lib/core/geom/Vector3D");
import Camera							= require("awayjs-core/lib/entities/Camera");

import AnimationRegisterCache			= require("awayjs-stagegl/lib/animators/data/AnimationRegisterCache");
import Stage							= require("awayjs-stagegl/lib/core/base/Stage");
import RenderableBase					= require("awayjs-stagegl/lib/core/pool/RenderableBase");
import ContextGLVertexBufferFormat		= require("awayjs-stagegl/lib/core/stagegl/ContextGLVertexBufferFormat");

import ParticleAnimator					= require("awayjs-renderergl/lib/animators/ParticleAnimator");
import AnimationSubGeometry				= require("awayjs-renderergl/lib/animators/data/AnimationSubGeometry");
import ParticlePropertiesMode			= require("awayjs-renderergl/lib/animators/data/ParticlePropertiesMode");
import ParticleAccelerationNode			= require("awayjs-renderergl/lib/animators/nodes/ParticleAccelerationNode");
import ParticleStateBase				= require("awayjs-renderergl/lib/animators/states/ParticleStateBase");

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
	public setRenderState(stage:Stage, renderable:RenderableBase, animationSubGeometry:AnimationSubGeometry, animationRegisterCache:AnimationRegisterCache, camera:Camera)
	{
		var index:number /*int*/ = animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleAccelerationState.ACCELERATION_INDEX);
		
		if (this._particleAccelerationNode.mode == ParticlePropertiesMode.LOCAL_STATIC)
			animationSubGeometry.activateVertexBuffer(index, this._particleAccelerationNode._iDataOffset, stage, ContextGLVertexBufferFormat.FLOAT_3);
		else
			animationRegisterCache.setVertexConst(index, this._halfAcceleration.x, this._halfAcceleration.y, this._halfAcceleration.z);
	}
	
	private updateAccelerationData()
	{
		if (this._particleAccelerationNode.mode == ParticlePropertiesMode.GLOBAL)
			this._halfAcceleration = new Vector3D(this._acceleration.x/2, this._acceleration.y/2, this._acceleration.z/2);
	}
}

export = ParticleAccelerationState;