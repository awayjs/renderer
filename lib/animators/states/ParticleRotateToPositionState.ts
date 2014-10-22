import Matrix3D							= require("awayjs-core/lib/core/geom/Matrix3D");
import Vector3D							= require("awayjs-core/lib/core/geom/Vector3D");
import Camera							= require("awayjs-core/lib/entities/Camera");

import AnimationRegisterCache			= require("awayjs-stagegl/lib/animators/data/AnimationRegisterCache");
import Stage							= require("awayjs-stagegl/lib/core/base/Stage");
import RenderableBase					= require("awayjs-stagegl/lib/core/pool/RenderableBase");
import ContextGLVertexBufferFormat		= require("awayjs-stagegl/lib/core/stagegl/ContextGLVertexBufferFormat");

import ParticleAnimator					= require("awayjs-renderergl/lib/animators/ParticleAnimator");
import AnimationSubGeometry				= require("awayjs-renderergl/lib/animators/data/AnimationSubGeometry");
import ParticlePropertiesMode			= require("awayjs-renderergl/lib/animators/data/ParticlePropertiesMode");
import ParticleRotateToPositionNode		= require("awayjs-renderergl/lib/animators/nodes/ParticleRotateToPositionNode");
import ParticleStateBase				= require("awayjs-renderergl/lib/animators/states/ParticleStateBase");

/**
 * ...
 */
class ParticleRotateToPositionState extends ParticleStateBase
{
	/** @private */
	public static MATRIX_INDEX:number /*int*/ = 0;
	/** @private */
	public static POSITION_INDEX:number /*int*/ = 1;

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

	public setRenderState(stage:Stage, renderable:RenderableBase, animationSubGeometry:AnimationSubGeometry, animationRegisterCache:AnimationRegisterCache, camera:Camera)
	{
		var index:number /*int*/ = animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleRotateToPositionState.POSITION_INDEX);

		if (animationRegisterCache.hasBillboard) {
			this._matrix.copyFrom(renderable.sourceEntity.sceneTransform);
			this._matrix.append(camera.inverseSceneTransform);
			animationRegisterCache.setVertexConstFromMatrix(animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleRotateToPositionState.MATRIX_INDEX), this._matrix);
		}

		if (this._particleRotateToPositionNode.mode == ParticlePropertiesMode.GLOBAL) {
			this._offset = renderable.sourceEntity.inverseSceneTransform.transformVector(this._position);
			animationRegisterCache.setVertexConst(index, this._offset.x, this._offset.y, this._offset.z);
		} else
			animationSubGeometry.activateVertexBuffer(index, this._particleRotateToPositionNode._iDataOffset, stage, ContextGLVertexBufferFormat.FLOAT_3);

	}

}

export = ParticleRotateToPositionState;