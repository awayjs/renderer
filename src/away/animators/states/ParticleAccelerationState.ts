///<reference path="../../_definitions.ts"/>

module away.animators
{
	import IRenderable						= away.base.IRenderable;
	import Camera3D							= away.cameras.Camera3D;
	import ContextGLVertexBufferFormat		= away.gl.ContextGLVertexBufferFormat
	import Vector3D							= away.geom.Vector3D;
	import StageGL							= away.base.StageGL;

	/**
	 * ...
	 */
	export class ParticleAccelerationState extends ParticleStateBase
	{
		private _particleAccelerationNode:ParticleAccelerationNode;
		private _acceleration:Vector3D;
		private _halfAcceleration:Vector3D;
		
		/**
		 * Defines the acceleration vector of the state, used when in global mode.
		 */
		public get acceleration():Vector3D
		{
			return this._acceleration;
		}
		
		public set acceleration(value:Vector3D)
		{
			this._acceleration.x = value.x;
			this._acceleration.y = value.y;
			this._acceleration.z = value.z;

			this.updateAccelerationData();
		}
		
		constructor(animator:ParticleAnimator, particleAccelerationNode:ParticleAccelerationNode)
		{
			super(animator, particleAccelerationNode);

			this._particleAccelerationNode = particleAccelerationNode;
			this._acceleration = this._particleAccelerationNode._acceleration;

			this.updateAccelerationData();
		}
		
		/**
		 * @inheritDoc
		 */
		public setRenderState(stageGL:StageGL, renderable:IRenderable, animationSubGeometry:AnimationSubGeometry, animationRegisterCache:AnimationRegisterCache, camera:Camera3D)
		{
			var index:number /*int*/ = animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleAccelerationNode.ACCELERATION_INDEX);
			
			if (this._particleAccelerationNode.mode == ParticlePropertiesMode.LOCAL_STATIC)
				animationSubGeometry.activateVertexBuffer(index, this._particleAccelerationNode._iDataOffset, stageGL, ContextGLVertexBufferFormat.FLOAT_3);
			else
				animationRegisterCache.setVertexConst(index, this._halfAcceleration.x, this._halfAcceleration.y, this._halfAcceleration.z);
		}
		
		private updateAccelerationData()
		{
			if (this._particleAccelerationNode.mode == ParticlePropertiesMode.GLOBAL)
				this._halfAcceleration = new Vector3D(this._acceleration.x/2, this._acceleration.y/2, this._acceleration.z/2);
		}
	}

}
