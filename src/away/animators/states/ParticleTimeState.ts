///<reference path="../../_definitions.ts"/>

module away.animators
{
	import RenderableBase					= away.pool.RenderableBase;
	import Camera							= away.entities.Camera;
	import ContextGLVertexBufferFormat		= away.stagegl.ContextGLVertexBufferFormat
	import Vector3D							= away.geom.Vector3D;
	import Stage							= away.base.Stage;
	
	/**
	 * ...
	 */
	export class ParticleTimeState extends ParticleStateBase
	{
		private _particleTimeNode:ParticleTimeNode;
		
		constructor(animator:ParticleAnimator, particleTimeNode:ParticleTimeNode)
		{
			super(animator, particleTimeNode, true);
			
			this._particleTimeNode = particleTimeNode;
		}
		
		public setRenderState(stage:Stage, renderable:RenderableBase, animationSubGeometry:AnimationSubGeometry, animationRegisterCache:AnimationRegisterCache, camera:Camera)
		{
			animationSubGeometry.activateVertexBuffer(animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleTimeNode.TIME_STREAM_INDEX), this._particleTimeNode._iDataOffset, stage, ContextGLVertexBufferFormat.FLOAT_4);
			
			var particleTime:number = this._pTime/1000;
			animationRegisterCache.setVertexConst(animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleTimeNode.TIME_CONSTANT_INDEX), particleTime, particleTime, particleTime, particleTime);
		}
	
	}

}
