///<reference path="../../_definitions.ts"/>

module away.animators
{
	import RenderableBase					= away.pool.RenderableBase;
	import Camera							= away.entities.Camera;
	import Matrix3D							= away.geom.Matrix3D;
	import Stage							= away.base.Stage;
	
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
		
		public setRenderState(stage:Stage, renderable:RenderableBase, animationSubGeometry:AnimationSubGeometry, animationRegisterCache:AnimationRegisterCache, camera:Camera)
		{
			if (animationRegisterCache.hasBillboard) {
				this._matrix.copyFrom(renderable.sourceEntity.sceneTransform);
				this._matrix.append(camera.inverseSceneTransform);
				animationRegisterCache.setVertexConstFromMatrix(animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleRotateToHeadingNode.MATRIX_INDEX), this._matrix);
			}
		}
	
	}

}
