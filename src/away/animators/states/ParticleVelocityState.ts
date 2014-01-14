///<reference path="../../_definitions.ts"/>

module away.animators
{
	import IRenderable						= away.base.IRenderable;
	import Camera3D							= away.cameras.Camera3D;
	import ContextGLVertexBufferFormat		= away.displayGL.ContextGLVertexBufferFormat
	import Vector3D							= away.geom.Vector3D;
	import StageGLProxy						= away.managers.StageGLProxy;
	
	/**
	 * ...
	 */
	export class ParticleVelocityState extends ParticleStateBase
	{
		private _particleVelocityNode:ParticleVelocityNode;
		private _velocity:Vector3D;
		
		/**
		 * Defines the default velocity vector of the state, used when in global mode.
		 */
		public get velocity():Vector3D
		{
			return this._velocity;
		}
		
		public set velocity(value:Vector3D)
		{
			this._velocity = value;
		}
		
		/**
		 *
		 */
		public getVelocities():Array<Vector3D>
		{
			return this._pDynamicProperties;
		}
		
		public setVelocities(value:Array<Vector3D>)
		{
			this._pDynamicProperties = value;

			this._pDynamicPropertiesDirty = new Object();
		}
		
		constructor(animator:ParticleAnimator, particleVelocityNode:ParticleVelocityNode)
		{
			super(animator, particleVelocityNode);

			this._particleVelocityNode = particleVelocityNode;
			this._velocity = this._particleVelocityNode._iVelocity;
		}
		
		public setRenderState(stageGLProxy:StageGLProxy, renderable:IRenderable, animationSubGeometry:AnimationSubGeometry, animationRegisterCache:AnimationRegisterCache, camera:Camera3D)
		{
			if (this._particleVelocityNode.mode == ParticlePropertiesMode.LOCAL_DYNAMIC && !this._pDynamicPropertiesDirty[animationSubGeometry._iUniqueId])
				this._pUpdateDynamicProperties(animationSubGeometry);
			
			var index:number /*int*/ = animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleVelocityNode.VELOCITY_INDEX);
			
			if (this._particleVelocityNode.mode == ParticlePropertiesMode.GLOBAL)
				animationRegisterCache.setVertexConst(index, this._velocity.x, this._velocity.y, this._velocity.z);
			else
				animationSubGeometry.activateVertexBuffer(index, this._particleVelocityNode._iDataOffset, stageGLProxy, ContextGLVertexBufferFormat.FLOAT_3);
		}
	}
}
