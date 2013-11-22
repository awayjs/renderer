///<reference path="../../_definitions.ts"/>

module away.animators
{
	import IRenderable						= away.base.IRenderable;
	import Camera3D							= away.cameras.Camera3D;
	import Context3DVertexBufferFormat		= away.display3D.Context3DVertexBufferFormat
	import Vector3D							= away.geom.Vector3D;
	import Stage3DProxy						= away.managers.Stage3DProxy;
	
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
		
		public setRenderState(stage3DProxy:Stage3DProxy, renderable:IRenderable, animationSubGeometry:AnimationSubGeometry, animationRegisterCache:AnimationRegisterCache, camera:Camera3D)
		{
			animationSubGeometry.activateVertexBuffer(animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleTimeNode.TIME_STREAM_INDEX), this._particleTimeNode._iDataOffset, stage3DProxy, Context3DVertexBufferFormat.FLOAT_4);
			
			var particleTime:number = this._pTime/1000;
			animationRegisterCache.setVertexConst(animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleTimeNode.TIME_CONSTANT_INDEX), particleTime, particleTime, particleTime, particleTime);
		}
	
	}

}
