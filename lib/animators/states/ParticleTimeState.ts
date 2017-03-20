import {ProjectionBase} from "@awayjs/core";

import {Stage, ContextGLVertexBufferFormat, GL_RenderableBase, ShaderBase, AnimationRegisterData} from "@awayjs/stage";

import {AnimationElements} from "../data/AnimationElements";
import {ParticleTimeNode} from "../nodes/ParticleTimeNode";

import {ParticleAnimator} from "../ParticleAnimator";

import {ParticleStateBase} from "./ParticleStateBase";

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

	public setRenderState(shader:ShaderBase, renderable:GL_RenderableBase, animationElements:AnimationElements, animationRegisterData:AnimationRegisterData, projection:ProjectionBase, stage:Stage):void
	{
		animationElements.activateVertexBuffer(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleTimeState.TIME_STREAM_INDEX), this._particleTimeNode._iDataOffset, stage, ContextGLVertexBufferFormat.FLOAT_4);

		var particleTime:number = this._pTime/1000;
		shader.setVertexConst(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleTimeState.TIME_CONSTANT_INDEX), particleTime, particleTime, particleTime, particleTime);
	}

}