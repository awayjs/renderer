import {Matrix3D, ProjectionBase} from "@awayjs/core";

import {Stage, GL_RenderableBase, ShaderBase, AnimationRegisterData} from "@awayjs/stage";

import {AnimationElements} from "../data/AnimationElements";
import {ParticleRotateToHeadingNode} from "../nodes/ParticleRotateToHeadingNode";

import {ParticleAnimator} from "../ParticleAnimator";
import {ParticleAnimationSet} from "../ParticleAnimationSet";

import {ParticleStateBase} from "./ParticleStateBase";
/**
 * ...
 */
export class ParticleRotateToHeadingState extends ParticleStateBase
{
	/** @private */
	public static MATRIX_INDEX:number = 0;

	private _matrix:Matrix3D = new Matrix3D();

	constructor(animator:ParticleAnimator, particleNode:ParticleRotateToHeadingNode)
	{
		super(animator, particleNode);
	}

	public setRenderState(shader:ShaderBase, renderable:GL_RenderableBase, animationElements:AnimationElements, animationRegisterData:AnimationRegisterData, projection:ProjectionBase, stage:Stage):void
	{
		if ((<ParticleAnimationSet> this._pParticleAnimator.animationSet).hasBillboard) {
			this._matrix.copyFrom(renderable.sourceEntity.transform.concatenatedMatrix3D);
			this._matrix.append(projection.transform.inverseConcatenatedMatrix3D);
			shader.setVertexConstFromMatrix(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleRotateToHeadingState.MATRIX_INDEX), this._matrix);
		}
	}

}