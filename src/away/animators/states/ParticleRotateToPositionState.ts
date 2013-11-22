///<reference path="../../_definitions.ts"/>

module away.animators
{
	import IRenderable						= away.base.IRenderable;
	import Camera3D							= away.cameras.Camera3D;
	import Context3DVertexBufferFormat		= away.display3D.Context3DVertexBufferFormat
	import Vector3D							= away.geom.Vector3D;
	import Matrix3D							= away.geom.Matrix3D;
	import Stage3DProxy						= away.managers.Stage3DProxy;
	
	/**
	 * ...
	 */
	export class ParticleRotateToPositionState extends ParticleStateBase
	{
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
		
		public setRenderState(stage3DProxy:Stage3DProxy, renderable:IRenderable, animationSubGeometry:AnimationSubGeometry, animationRegisterCache:AnimationRegisterCache, camera:Camera3D)
		{
			var index:number /*int*/ = animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleRotateToPositionNode.POSITION_INDEX);
			
			if (animationRegisterCache.hasBillboard) {
				this._matrix.copyFrom(renderable.sceneTransform);
				this._matrix.append(camera.inverseSceneTransform);
				animationRegisterCache.setVertexConstFromMatrix(animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleRotateToPositionNode.MATRIX_INDEX), this._matrix);
			}
			
			if (this._particleRotateToPositionNode.mode == ParticlePropertiesMode.GLOBAL) {
				this._offset = renderable.inverseSceneTransform.transformVector(this._position);
				animationRegisterCache.setVertexConst(index, this._offset.x, this._offset.y, this._offset.z);
			} else
				animationSubGeometry.activateVertexBuffer(index, this._particleRotateToPositionNode._iDataOffset, stage3DProxy, Context3DVertexBufferFormat.FLOAT_3);
		
		}
	
	}

}
