import Matrix3D							from "awayjs-core/lib/geom/Matrix3D";

import Camera							from "awayjs-display/lib/display/Camera";

import Stage							from "awayjs-stagegl/lib/base/Stage";

import ParticleAnimator					from "awayjs-renderergl/lib/animators/ParticleAnimator";
import AnimationRegisterCache			from "awayjs-renderergl/lib/animators/data/AnimationRegisterCache";
import AnimationElements				from "awayjs-renderergl/lib/animators/data/AnimationElements";
import ParticleNodeBase					from "awayjs-renderergl/lib/animators/nodes/ParticleNodeBase";
import ParticleStateBase				from "awayjs-renderergl/lib/animators/states/ParticleStateBase";
import GL_RenderableBase				from "awayjs-renderergl/lib/animators/../renderables/GL_RenderableBase";

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

	public setRenderState(stage:Stage, renderable:GL_RenderableBase, animationElements:AnimationElements, animationRegisterCache:AnimationRegisterCache, camera:Camera)
	{
		if (animationRegisterCache.hasBillboard) {
			this._matrix.copyFrom(renderable.sourceEntity.sceneTransform);
			this._matrix.append(camera.inverseSceneTransform);
			animationRegisterCache.setVertexConstFromMatrix(animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleRotateToHeadingState.MATRIX_INDEX), this._matrix);
		}
	}

}

export default ParticleRotateToHeadingState;