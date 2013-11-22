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
	export class ParticleScaleState extends ParticleStateBase
	{
		private _particleScaleNode:ParticleScaleNode;
		private _usesCycle:boolean;
		private _usesPhase:boolean;
		private _minScale:number;
		private _maxScale:number;
		private _cycleDuration:number;
		private _cyclePhase:number;
		private _scaleData:Vector3D;
		
		/**
		 * Defines the end scale of the state, when in global mode. Defaults to 1.
		 */
		public get minScale():number
		{
			return this._minScale;
		}
		
		public set minScale(value:number)
		{
			this._minScale = value;

			this.updateScaleData();
		}
		
		/**
		 * Defines the end scale of the state, when in global mode. Defaults to 1.
		 */
		public get maxScale():number
		{
			return this._maxScale;
		}
		
		public set maxScale(value:number)
		{
			this._maxScale = value;

			this.updateScaleData();
		}
		
		/**
		 * Defines the duration of the animation in seconds, used as a period independent of particle duration when in global mode. Defaults to 1.
		 */
		public get cycleDuration():number
		{
			return this._cycleDuration;
		}
		
		public set cycleDuration(value:number)
		{
			this._cycleDuration = value;

			this.updateScaleData();
		}
		
		/**
		 * Defines the phase of the cycle in degrees, used as the starting offset of the cycle when in global mode. Defaults to 0.
		 */
		public get cyclePhase():number
		{
			return this._cyclePhase;
		}
		
		public set cyclePhase(value:number)
		{
			this._cyclePhase = value;

			this.updateScaleData();
		}
		
		constructor(animator:ParticleAnimator, particleScaleNode:ParticleScaleNode)
		{
			super(animator, particleScaleNode);

			this._particleScaleNode = particleScaleNode;
			this._usesCycle = this._particleScaleNode._iUsesCycle;
			this._usesPhase = this._particleScaleNode._iUsesPhase;
			this._minScale = this._particleScaleNode._iMinScale;
			this._maxScale = this._particleScaleNode._iMaxScale;
			this._cycleDuration = this._particleScaleNode._iCycleDuration;
			this._cyclePhase = this._particleScaleNode._iCyclePhase;
			
			this.updateScaleData();
		}
		
		public setRenderState(stage3DProxy:Stage3DProxy, renderable:IRenderable, animationSubGeometry:AnimationSubGeometry, animationRegisterCache:AnimationRegisterCache, camera:Camera3D)
		{
			var index:number /*int*/ = animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleScaleNode.SCALE_INDEX);
			
			if (this._particleScaleNode.mode == ParticlePropertiesMode.LOCAL_STATIC) {
				if (this._usesCycle) {
					if (this._usesPhase)
						animationSubGeometry.activateVertexBuffer(index, this._particleScaleNode._iDataOffset, stage3DProxy, Context3DVertexBufferFormat.FLOAT_4);
					else
						animationSubGeometry.activateVertexBuffer(index, this._particleScaleNode._iDataOffset, stage3DProxy, Context3DVertexBufferFormat.FLOAT_3);
				} else
					animationSubGeometry.activateVertexBuffer(index, this._particleScaleNode._iDataOffset, stage3DProxy, Context3DVertexBufferFormat.FLOAT_2);
			} else
				animationRegisterCache.setVertexConst(index, this._scaleData.x, this._scaleData.y, this._scaleData.z, this._scaleData.w);
		}
		
		private updateScaleData()
		{
			if (this._particleScaleNode.mode == ParticlePropertiesMode.GLOBAL) {
				if (this._usesCycle) {
					if (this._cycleDuration <= 0)
						throw(new Error("the cycle duration must be greater than zero"));
					this._scaleData = new Vector3D((this._minScale + this._maxScale)/2, Math.abs(this._minScale - this._maxScale)/2, Math.PI*2/this._cycleDuration, this._cyclePhase*Math.PI/180);
				} else
					this._scaleData = new Vector3D(this._minScale, this._maxScale - this._minScale, 0, 0);
			}
		}
	}
}
