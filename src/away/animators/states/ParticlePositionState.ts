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
	 * @author ...
	 */
	export class ParticlePositionState extends ParticleStateBase
	{
		private _particlePositionNode:ParticlePositionNode;
		private _position:Vector3D;
		
		/**
		 * Defines the position of the particle when in global mode. Defaults to 0,0,0.
		 */
		public get position():Vector3D
		{
			return this._position;
		}
		
		public set position(value:Vector3D)
		{
			this._position = value;
		}
		
		/**
		 *
		 */
		public getPositions():Array<Vector3D>
		{
			return this._pDynamicProperties;
		}
		
		public setPositions(value:Array<Vector3D>)
		{
			this._pDynamicProperties = value;
			
			this._pDynamicPropertiesDirty = new Object();
		}
		
		constructor(animator:ParticleAnimator, particlePositionNode:ParticlePositionNode)
		{
			super(animator, particlePositionNode);
			
			this._particlePositionNode = particlePositionNode;
			this._position = this._particlePositionNode._iPosition;
		}
		
		/**
		 * @inheritDoc
		 */
		public setRenderState(stage:Stage, renderable:RenderableBase, animationSubGeometry:AnimationSubGeometry, animationRegisterCache:AnimationRegisterCache, camera:Camera)
		{
			if (this._particlePositionNode.mode == ParticlePropertiesMode.LOCAL_DYNAMIC && !this._pDynamicPropertiesDirty[animationSubGeometry._iUniqueId])
				this._pUpdateDynamicProperties(animationSubGeometry);
			
			var index:number /*int*/ = animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticlePositionNode.POSITION_INDEX);
			
			if (this._particlePositionNode.mode == ParticlePropertiesMode.GLOBAL)
				animationRegisterCache.setVertexConst(index, this._position.x, this._position.y, this._position.z);
			else
				animationSubGeometry.activateVertexBuffer(index, this._particlePositionNode._iDataOffset, stage, ContextGLVertexBufferFormat.FLOAT_3);
		}
	}
}
