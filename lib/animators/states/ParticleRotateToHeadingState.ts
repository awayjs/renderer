import Matrix3D							= require("awayjs-core/lib/core/geom/Matrix3D");
import Camera							= require("awayjs-core/lib/entities/Camera");

import AnimationRegisterCache			= require("awayjs-stagegl/lib/animators/data/AnimationRegisterCache");
import Stage							= require("awayjs-stagegl/lib/core/base/Stage");
import RenderableBase					= require("awayjs-stagegl/lib/core/pool/RenderableBase");

import ParticleAnimator					= require("awayjs-renderergl/lib/animators/ParticleAnimator");
import AnimationSubGeometry				= require("awayjs-renderergl/lib/animators/data/AnimationSubGeometry");
import ParticleNodeBase					= require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
import ParticleRotateToHeadingNode		= require("awayjs-renderergl/lib/animators/nodes/ParticleRotateToHeadingNode");
import ParticleStateBase				= require("awayjs-renderergl/lib/animators/states/ParticleStateBase");

/**
 * ...
 */
class ParticleRotateToHeadingState extends ParticleStateBase
{
	/** @private */
	public static MATRIX_INDEX:number /*int*/ = 0;

	private _matrix:Matrix3D = new Matrix3D();

	constructor(animator:ParticleAnimator, particleNode:ParticleNodeBase)
	{
		super(animator, particleNode);
	}

	public setRenderState(stage:Stage, renderable:RenderableBase, animationSubGeometry:AnimationSubGeometry, animationRegisterCache:AnimationRegisterCache, camera:Camera)
	{
		if (animationRegisterCache.hasBillboard) {
			this._matrix.copyFrom(renderable.sourceEntity.sceneTransform);
			this._matrix.append(camera.inverseSceneTransform);
			animationRegisterCache.setVertexConstFromMatrix(animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleRotateToHeadingState.MATRIX_INDEX), this._matrix);
		}
	}

}

export = ParticleRotateToHeadingState;