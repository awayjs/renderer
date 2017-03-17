import {Vector3D} from "@awayjs/core";

import {ProjectionBase} from "@awayjs/core";

import {Stage, ContextGLVertexBufferFormat} from "@awayjs/stage";

import {GL_RenderableBase} from "../../renderables/GL_RenderableBase";
import {ShaderBase} from "../../shaders/ShaderBase";

import {AnimationRegisterData} from "../data/AnimationRegisterData";
import {AnimationElements} from "../data/AnimationElements";
import {ParticlePropertiesMode} from "../data/ParticlePropertiesMode";
import {ParticleAccelerationNode} from "../nodes/ParticleAccelerationNode";

import {ParticleAnimator} from "../ParticleAnimator";

import {ParticleStateBase} from "./ParticleStateBase";

/**
 * ...
 */
export class ParticleAccelerationState extends ParticleStateBase
{
	/** @private */
	public static ACCELERATION_INDEX:number = 0;

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
	public setRenderState(shader:ShaderBase, renderable:GL_RenderableBase, animationElements:AnimationElements, animationRegisterData:AnimationRegisterData, projection:ProjectionBase, stage:Stage):void
	{
		var index:number = animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleAccelerationState.ACCELERATION_INDEX);
		
		if (this._particleAccelerationNode.mode == ParticlePropertiesMode.LOCAL_STATIC)
			animationElements.activateVertexBuffer(index, this._particleAccelerationNode._iDataOffset, stage, ContextGLVertexBufferFormat.FLOAT_3);
		else
			shader.setVertexConst(index, this._halfAcceleration.x, this._halfAcceleration.y, this._halfAcceleration.z);
	}
	
	private updateAccelerationData():void
	{
		if (this._particleAccelerationNode.mode == ParticlePropertiesMode.GLOBAL)
			this._halfAcceleration = new Vector3D(this._acceleration.x/2, this._acceleration.y/2, this._acceleration.z/2);
	}
}