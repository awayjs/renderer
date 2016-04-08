import Camera							from "awayjs-display/lib/display/Camera";

import Stage							from "awayjs-stagegl/lib/base/Stage";
import ContextGLVertexBufferFormat		from "awayjs-stagegl/lib/base/ContextGLVertexBufferFormat";

import ParticleAnimator					from "awayjs-renderergl/lib/animators/ParticleAnimator";
import AnimationRegisterCache			from "awayjs-renderergl/lib/animators/data/AnimationRegisterCache";
import AnimationElements				from "awayjs-renderergl/lib/animators/data/AnimationElements";
import ParticleTimeNode					from "awayjs-renderergl/lib/animators/nodes/ParticleTimeNode";
import ParticleStateBase				from "awayjs-renderergl/lib/animators/states/ParticleStateBase";
import GL_RenderableBase				from "awayjs-renderergl/lib/animators/../renderables/GL_RenderableBase";

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

export default ParticleTimeState;