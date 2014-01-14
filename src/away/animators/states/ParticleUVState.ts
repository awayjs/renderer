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
	export class ParticleUVState extends ParticleStateBase
	{
		
		private _particleUVNode:ParticleUVNode;
		
		constructor(animator:ParticleAnimator, particleUVNode:ParticleUVNode)
		{
			super(animator, particleUVNode);
			
			this._particleUVNode = particleUVNode;
		}
		
		public setRenderState(stageGLProxy:StageGLProxy, renderable:IRenderable, animationSubGeometry:AnimationSubGeometry, animationRegisterCache:AnimationRegisterCache, camera:Camera3D)
		{
			if (animationRegisterCache.needUVAnimation) {
				var index:number /*int*/ = animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleUVNode.UV_INDEX);
				var data:Vector3D = this._particleUVNode._iUvData;
				animationRegisterCache.setVertexConst(index, data.x, data.y);
			}
		}
	
	}

}
