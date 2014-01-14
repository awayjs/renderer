///<reference path="../../_definitions.ts"/>

module away.animators
{
	import IRenderable						= away.base.IRenderable;
	import Camera3D							= away.cameras.Camera3D;
	import Matrix3D							= away.geom.Matrix3D;
	import StageGLProxy						= away.managers.StageGLProxy;
	
	/**
	 * ...
	 */
	export class ParticleRotateToHeadingState extends ParticleStateBase
	{
		
		private _matrix:Matrix3D = new Matrix3D();
		
		constructor(animator:ParticleAnimator, particleNode:ParticleNodeBase)
		{
			super(animator, particleNode);
		}
		
		public setRenderState(stageGLProxy:StageGLProxy, renderable:IRenderable, animationSubGeometry:AnimationSubGeometry, animationRegisterCache:AnimationRegisterCache, camera:Camera3D)
		{
			if (animationRegisterCache.hasBillboard) {
				this._matrix.copyFrom(renderable.sceneTransform);
				this._matrix.append(camera.inverseSceneTransform);
				animationRegisterCache.setVertexConstFromMatrix(animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleRotateToHeadingNode.MATRIX_INDEX), this._matrix);
			}
		}
	
	}

}
