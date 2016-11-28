import {Vector3D} from "@awayjs/core";

import {Camera} from "@awayjs/scene";

import {Stage, ContextGLVertexBufferFormat} from "@awayjs/stage";

import {GL_RenderableBase} from "../../renderables/GL_RenderableBase";
import {ShaderBase} from "../../shaders/ShaderBase";

import {AnimationRegisterData} from "../data/AnimationRegisterData";
import {AnimationElements} from "../data/AnimationElements";
import {ParticlePropertiesMode} from "../data/ParticlePropertiesMode";
import {ParticleVelocityNode} from "../nodes/ParticleVelocityNode";

import {ParticleAnimator} from "../ParticleAnimator";

import {ParticleStateBase} from "./ParticleStateBase";

/**
 * ...
 */
export class ParticleVelocityState extends ParticleStateBase
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

	public setVelocities(value:Array<Vector3D>):void
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

	public setRenderState(shader:ShaderBase, renderable:GL_RenderableBase, animationElements:AnimationElements, animationRegisterData:AnimationRegisterData, camera:Camera, stage:Stage):void
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