import {Vector3D, ProjectionBase} from "@awayjs/core";

import {Stage, ContextGLVertexBufferFormat, GL_RenderableBase, ShaderBase, AnimationRegisterData} from "@awayjs/stage";

import {AnimationElements} from "../data/AnimationElements";
import {ParticlePropertiesMode} from "../data/ParticlePropertiesMode";
import {ParticleBezierCurveNode} from "../nodes/ParticleBezierCurveNode";

import {ParticleAnimator} from "../ParticleAnimator";

import {ParticleStateBase} from "./ParticleStateBase";

/**
 * ...
 */
export class ParticleBezierCurveState extends ParticleStateBase
{
	/** @private */
	public static BEZIER_CONTROL_INDEX:number = 0;

	/** @private */
	public static BEZIER_END_INDEX:number = 1;

	private _particleBezierCurveNode:ParticleBezierCurveNode;
	private _controlPoint:Vector3D;
	private _endPoint:Vector3D;

	/**
	 * Defines the default control point of the node, used when in global mode.
	 */
	public get controlPoint():Vector3D
	{
		return this._controlPoint;
	}

	public set controlPoint(value:Vector3D)
	{
		this._controlPoint = value;
	}

	/**
	 * Defines the default end point of the node, used when in global mode.
	 */
	public get endPoint():Vector3D
	{
		return this._endPoint;
	}

	public set endPoint(value:Vector3D)
	{
		this._endPoint = value;
	}

	constructor(animator:ParticleAnimator, particleBezierCurveNode:ParticleBezierCurveNode)
	{
		super(animator, particleBezierCurveNode);

		this._particleBezierCurveNode = particleBezierCurveNode;
		this._controlPoint = this._particleBezierCurveNode._iControlPoint;
		this._endPoint = this._particleBezierCurveNode._iEndPoint;
	}

	public setRenderState(shader:ShaderBase, renderable:GL_RenderableBase, animationElements:AnimationElements, animationRegisterData:AnimationRegisterData, projection:ProjectionBase, stage:Stage):void
	{
		var controlIndex:number = animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleBezierCurveState.BEZIER_CONTROL_INDEX);
		var endIndex:number = animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleBezierCurveState.BEZIER_END_INDEX);

		if (this._particleBezierCurveNode.mode == ParticlePropertiesMode.LOCAL_STATIC) {
			animationElements.activateVertexBuffer(controlIndex, this._particleBezierCurveNode._iDataOffset, stage, ContextGLVertexBufferFormat.FLOAT_3);
			animationElements.activateVertexBuffer(endIndex, this._particleBezierCurveNode._iDataOffset + 3, stage, ContextGLVertexBufferFormat.FLOAT_3);
		} else {
			shader.setVertexConst(controlIndex, this._controlPoint.x, this._controlPoint.y, this._controlPoint.z);
			shader.setVertexConst(endIndex, this._endPoint.x, this._endPoint.y, this._endPoint.z);
		}
	}
}