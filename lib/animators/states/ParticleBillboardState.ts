import {Matrix3D, Orientation3D, Vector3D, MathConsts, ProjectionBase} from "@awayjs/core";

import {Stage, GL_RenderableBase, ShaderBase, AnimationRegisterData} from "@awayjs/stage";

import {AnimationElements} from "../data/AnimationElements";
import {ParticleBillboardNode} from "../nodes/ParticleBillboardNode";

import {ParticleAnimator} from "../ParticleAnimator";

import {ParticleStateBase} from "./ParticleStateBase";

/**
 * ...
 */
export class ParticleBillboardState extends ParticleStateBase
{
	/** @private */
	public static MATRIX_INDEX:number = 0;

	private _matrix:Matrix3D = new Matrix3D;

	private _billboardAxis:Vector3D;

	/**
	 *
	 */
	constructor(animator:ParticleAnimator, particleNode:ParticleBillboardNode)
	{
		super(animator, particleNode);

		this._billboardAxis = particleNode._iBillboardAxis;
	}

	public setRenderState(shader:ShaderBase, renderable:GL_RenderableBase, animationElements:AnimationElements, animationRegisterData:AnimationRegisterData, projection:ProjectionBase, stage:Stage):void
	{
		var comps:Array<Vector3D>;
		if (this._billboardAxis) {
			var pos:Vector3D = renderable.sourceEntity.transform.concatenatedMatrix3D.position;
			var look:Vector3D = projection.transform.concatenatedMatrix3D.position.subtract(pos);
			var right:Vector3D = look.crossProduct(this._billboardAxis);
			right.normalize();
			look = this.billboardAxis.crossProduct(right);
			look.normalize();

			//create a quick inverse projection matrix
			this._matrix.copyFrom(renderable.sourceEntity.transform.concatenatedMatrix3D);
			comps = this._matrix.decompose(Orientation3D.AXIS_ANGLE);
			this._matrix.copyColumnFrom(0, right);
			this._matrix.copyColumnFrom(1, this.billboardAxis);
			this._matrix.copyColumnFrom(2, look);
			this._matrix.copyColumnFrom(3, pos);
			this._matrix.appendRotation(-comps[1].w*MathConsts.RADIANS_TO_DEGREES, comps[1]);
		} else {
			//create a quick inverse projection matrix
			this._matrix.copyFrom(renderable.sourceEntity.transform.concatenatedMatrix3D);
			this._matrix.append(projection.transform.inverseConcatenatedMatrix3D);

			//decompose using axis angle rotations
			comps = this._matrix.decompose(Orientation3D.AXIS_ANGLE);

			//recreate the matrix with just the rotation data
			this._matrix.identity();
			this._matrix.appendRotation(-comps[1].w*MathConsts.RADIANS_TO_DEGREES, comps[1]);
		}

		//set a new matrix transform constant
		shader.setVertexConstFromMatrix(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleBillboardState.MATRIX_INDEX), this._matrix);
	}

	/**
	 * Defines the billboard axis.
	 */
	public get billboardAxis():Vector3D
	{
		return this.billboardAxis;
	}

	public set billboardAxis(value:Vector3D)
	{
		this.billboardAxis = value? value.clone() : null;
		if (this.billboardAxis)
			this.billboardAxis.normalize();
	}

}