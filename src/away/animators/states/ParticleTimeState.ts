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
	export class ParticleTimeState extends ParticleStateBase
	{
		private _particleTimeNode:ParticleTimeNode;
		
		constructor(animator:ParticleAnimator, particleTimeNode:ParticleTimeNode)
		{
			super(animator, particleTimeNode, true);
			
			this._particleTimeNode = particleTimeNode;
		}
		
		public setRenderState(stageGLProxy:StageGLProxy, renderable:IRenderable, animationSubGeometry:AnimationSubGeometry, animationRegisterCache:AnimationRegisterCache, camera:Camera3D)
		{
			animationSubGeometry.activateVertexBuffer(animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleTimeNode.TIME_STREAM_INDEX), this._particleTimeNode._iDataOffset, stageGLProxy, ContextGLVertexBufferFormat.FLOAT_4);
			
			var particleTime:number = this._pTime/1000;
			animationRegisterCache.setVertexConst(animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleTimeNode.TIME_CONSTANT_INDEX), particleTime, particleTime, particleTime, particleTime);
		}
	
	}

}
