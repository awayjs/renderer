import Camera							= require("awayjs-display/lib/display/Camera");

import Stage							= require("awayjs-stagegl/lib/base/Stage");
import ContextGLVertexBufferFormat		= require("awayjs-stagegl/lib/base/ContextGLVertexBufferFormat");

import ParticleAnimator					= require("awayjs-renderergl/lib/animators/ParticleAnimator");
import AnimationRegisterCache			= require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
import AnimationElements				= require("awayjs-renderergl/lib/animators/data/AnimationElements");
import ParticlePropertiesMode			= require("awayjs-renderergl/lib/animators/data/ParticlePropertiesMode");
import ParticleTimeNode					= require("awayjs-renderergl/lib/animators/nodes/ParticleTimeNode");
import ParticleStateBase				= require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
import GL_RenderableBase				= require("awayjs-renderergl/lib/renderables/GL_RenderableBase");

/**
 * ...
 */
class ParticleTimeState extends ParticleStateBase
{
	/** @private */
	public static TIME_STREAM_INDEX:number /*uint*/ = 0;

	/** @private */
	public static TIME_CONSTANT_INDEX:number /*uint*/ = 1;

	private _particleTimeNode:ParticleTimeNode;

	constructor(animator:ParticleAnimator, particleTimeNode:ParticleTimeNode)
	{
		super(animator, particleTimeNode, true);

		this._particleTimeNode = particleTimeNode;
	}

	public setRenderState(stage:Stage, renderable:GL_RenderableBase, animationElements:AnimationElements, animationRegisterCache:AnimationRegisterCache, camera:Camera)
	{
		animationElements.activateVertexBuffer(animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleTimeState.TIME_STREAM_INDEX), this._particleTimeNode._iDataOffset, stage, ContextGLVertexBufferFormat.FLOAT_4);

		var particleTime:number = this._pTime/1000;
		animationRegisterCache.setVertexConst(animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleTimeState.TIME_CONSTANT_INDEX), particleTime, particleTime, particleTime, particleTime);
	}

}

export = ParticleTimeState;