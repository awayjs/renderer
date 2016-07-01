import {Camera}							from "@awayjs/display/lib/display/Camera";

import {Stage}							from "@awayjs/stage/lib/base/Stage";
import {ContextGLVertexBufferFormat}		from "@awayjs/stage/lib/base/ContextGLVertexBufferFormat";

import {ParticleAnimator}					from "../../animators/ParticleAnimator";
import {AnimationRegisterData}			from "../../animators/data/AnimationRegisterData";
import {AnimationElements}				from "../../animators/data/AnimationElements";
import {ParticleTimeNode}					from "../../animators/nodes/ParticleTimeNode";
import {ParticleStateBase}				from "../../animators/states/ParticleStateBase";
import {GL_RenderableBase}				from "../../renderables/GL_RenderableBase";
import {ShaderBase}						from "../../shaders/ShaderBase";

/**
 * ...
 */
export class ParticleTimeState extends ParticleStateBase
{
	/** @private */
	public static TIME_STREAM_INDEX:number = 0;

	/** @private */
	public static TIME_CONSTANT_INDEX:number = 1;

	private _particleTimeNode:ParticleTimeNode;

	constructor(animator:ParticleAnimator, particleTimeNode:ParticleTimeNode)
	{
		super(animator, particleTimeNode, true);

		this._particleTimeNode = particleTimeNode;
	}

	public setRenderState(shader:ShaderBase, renderable:GL_RenderableBase, animationElements:AnimationElements, animationRegisterData:AnimationRegisterData, camera:Camera, stage:Stage):void
	{
		animationElements.activateVertexBuffer(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleTimeState.TIME_STREAM_INDEX), this._particleTimeNode._iDataOffset, stage, ContextGLVertexBufferFormat.FLOAT_4);

		var particleTime:number = this._pTime/1000;
		shader.setVertexConst(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleTimeState.TIME_CONSTANT_INDEX), particleTime, particleTime, particleTime, particleTime);
	}

}