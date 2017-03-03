import {Matrix3D, Vector3D} from "@awayjs/core";

import {Camera} from "@awayjs/scene";

import {Stage, ContextGLVertexBufferFormat} from "@awayjs/stage";

import {GL_RenderableBase} from "../../renderables/GL_RenderableBase";
import {ShaderBase} from "../../shaders/ShaderBase";

import {AnimationRegisterData} from "../data/AnimationRegisterData";
import {AnimationElements} from "../data/AnimationElements";
import {ParticlePropertiesMode} from "../data/ParticlePropertiesMode";
import {ParticleRotateToPositionNode} from "../nodes/ParticleRotateToPositionNode";

import {ParticleAnimator} from "../ParticleAnimator";
import {ParticleAnimationSet} from "../ParticleAnimationSet";

import {ParticleStateBase} from "./ParticleStateBase";

/**
 * ...
 */
export class ParticleRotateToPositionState extends ParticleStateBase
{
	/** @private */
	public static MATRIX_INDEX:number = 0;
	/** @private */
	public static POSITION_INDEX:number = 1;

	private _particleRotateToPositionNode:ParticleRotateToPositionNode;
	private _position:Vector3D;
	private _matrix:Matrix3D = new Matrix3D();
	private _offset:Vector3D;

	/**
	 * Defines the position of the point the particle will rotate to face when in global mode. Defaults to 0,0,0.
	 */
	public get position():Vector3D
	{
		return this._position;
	}

	public set position(value:Vector3D)
	{
		this._position = value;
	}

	constructor(animator:ParticleAnimator, particleRotateToPositionNode:ParticleRotateToPositionNode)
	{
		super(animator, particleRotateToPositionNode);

		this._particleRotateToPositionNode = particleRotateToPositionNode;
		this._position = this._particleRotateToPositionNode._iPosition;
	}

	public setRenderState(shader:ShaderBase, renderable:GL_RenderableBase, animationElements:AnimationElements, animationRegisterData:AnimationRegisterData, camera:Camera, stage:Stage):void
	{
		var index:number = animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleRotateToPositionState.POSITION_INDEX);

		if ((<ParticleAnimationSet> this._pParticleAnimator.animationSet).hasBillboard) {
			this._matrix.copyFrom(renderable.sourceEntity.transform.concatenatedMatrix3D);
			this._matrix.append(camera.transform.inverseConcatenatedMatrix3D);
			shader.setVertexConstFromMatrix(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleRotateToPositionState.MATRIX_INDEX), this._matrix);
		}

		if (this._particleRotateToPositionNode.mode == ParticlePropertiesMode.GLOBAL) {
			this._offset = renderable.sourceEntity.transform.inverseConcatenatedMatrix3D.transformVector(this._position);
			shader.setVertexConst(index, this._offset.x, this._offset.y, this._offset.z);
		} else
			animationElements.activateVertexBuffer(index, this._particleRotateToPositionNode._iDataOffset, stage, ContextGLVertexBufferFormat.FLOAT_3);

	}

}