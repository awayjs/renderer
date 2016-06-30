import {Matrix3D}							from "@awayjs/core/lib/geom/Matrix3D";
import {Vector3D}							from "@awayjs/core/lib/geom/Vector3D";

import {Camera}							from "@awayjs/display/lib/display/Camera";

import {Stage}							from "@awayjs/stage/lib/base/Stage";
import {ContextGLVertexBufferFormat}		from "@awayjs/stage/lib/base/ContextGLVertexBufferFormat";

import {ParticleAnimator}					from "../../animators/ParticleAnimator";
import {ParticleAnimationSet}				from "../../animators/ParticleAnimationSet";
import {AnimationRegisterData}			from "../../animators/data/AnimationRegisterData";
import {AnimationElements}				from "../../animators/data/AnimationElements";
import {ParticlePropertiesMode}			from "../../animators/data/ParticlePropertiesMode";
import {ParticleRotateToPositionNode}		from "../../animators/nodes/ParticleRotateToPositionNode";
import {ParticleStateBase}				from "../../animators/states/ParticleStateBase";
import {GL_RenderableBase}				from "../../renderables/GL_RenderableBase";
import {ShaderBase}						from "../../shaders/ShaderBase";

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
			this._matrix.copyFrom(renderable.sourceEntity.sceneTransform);
			this._matrix.append(camera.inverseSceneTransform);
			shader.setVertexConstFromMatrix(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleRotateToPositionState.MATRIX_INDEX), this._matrix);
		}

		if (this._particleRotateToPositionNode.mode == ParticlePropertiesMode.GLOBAL) {
			this._offset = renderable.sourceEntity.inverseSceneTransform.transformVector(this._position);
			shader.setVertexConst(index, this._offset.x, this._offset.y, this._offset.z);
		} else
			animationElements.activateVertexBuffer(index, this._particleRotateToPositionNode._iDataOffset, stage, ContextGLVertexBufferFormat.FLOAT_3);

	}

}