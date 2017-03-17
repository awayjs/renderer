import {Vector3D} from "@awayjs/core";

import {ProjectionBase} from "@awayjs/core";

import {Stage, ContextGLVertexBufferFormat} from "@awayjs/stage";

import {GL_RenderableBase} from "../../renderables/GL_RenderableBase";
import {ShaderBase} from "../../shaders/ShaderBase";

import {AnimationRegisterData} from "../data/AnimationRegisterData";
import {AnimationElements} from "../data/AnimationElements";
import {ParticlePropertiesMode} from "../data/ParticlePropertiesMode";
import {ParticlePositionNode} from "../nodes/ParticlePositionNode";

import {ParticleAnimator} from "../ParticleAnimator";

import {ParticleStateBase} from "./ParticleStateBase";

/**
 * ...
 * @author ...
 */
export class ParticlePositionState extends ParticleStateBase
{
	/** @private */
	public static POSITION_INDEX:number = 0;

	private _particlePositionNode:ParticlePositionNode;
	private _position:Vector3D;

	/**
	 * Defines the position of the particle when in global mode. Defaults to 0,0,0.
	 */
	public get position():Vector3D
	{
		return this._position;
	}

	public set position(value:Vector3D)
	{
		this._position = value;
	}

	/**
	 *
	 */
	public getPositions():Array<Vector3D>
	{
		return this._pDynamicProperties;
	}

	public setPositions(value:Array<Vector3D>):void
	{
		this._pDynamicProperties = value;

		this._pDynamicPropertiesDirty = new Object();
	}

	constructor(animator:ParticleAnimator, particlePositionNode:ParticlePositionNode)
	{
		super(animator, particlePositionNode);

		this._particlePositionNode = particlePositionNode;
		this._position = this._particlePositionNode._iPosition;
	}

	/**
	 * @inheritDoc
	 */
	public setRenderState(shader:ShaderBase, renderable:GL_RenderableBase, animationElements:AnimationElements, animationRegisterData:AnimationRegisterData, projection:ProjectionBase, stage:Stage):void
	{
		if (this._particlePositionNode.mode == ParticlePropertiesMode.LOCAL_DYNAMIC && !this._pDynamicPropertiesDirty[animationElements._iUniqueId])
			this._pUpdateDynamicProperties(animationElements);

		var index:number = animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticlePositionState.POSITION_INDEX);

		if (this._particlePositionNode.mode == ParticlePropertiesMode.GLOBAL)
			shader.setVertexConst(index, this._position.x, this._position.y, this._position.z);
		else
			animationElements.activateVertexBuffer(index, this._particlePositionNode._iDataOffset, stage, ContextGLVertexBufferFormat.FLOAT_3);
	}
}