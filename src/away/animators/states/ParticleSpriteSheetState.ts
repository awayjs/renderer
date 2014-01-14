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
	export class ParticleSpriteSheetState extends ParticleStateBase
	{
		private _particleSpriteSheetNode:ParticleSpriteSheetNode;
		private _usesCycle:boolean;
		private _usesPhase:boolean;
		private _totalFrames:number /*int*/;
		private _numColumns:number /*int*/;
		private _numRows:number /*int*/;
		private _cycleDuration:number;
		private _cyclePhase:number;
		private _spriteSheetData:Array<number>;
		
		/**
		 * Defines the cycle phase, when in global mode. Defaults to zero.
		 */
		public get cyclePhase():number
		{
			return this._cyclePhase;
		}
		
		public set cyclePhase(value:number)
		{
			this._cyclePhase = value;

			this.updateSpriteSheetData();
		}
		
		/**
		 * Defines the cycle duration in seconds, when in global mode. Defaults to 1.
		 */
		public get cycleDuration():number
		{
			return this._cycleDuration;
		}
		
		public set cycleDuration(value:number)
		{
			this._cycleDuration = value;

			this.updateSpriteSheetData();
		}
		
		constructor(animator:ParticleAnimator, particleSpriteSheetNode:ParticleSpriteSheetNode)
		{
			super(animator, particleSpriteSheetNode);
			
			this._particleSpriteSheetNode = particleSpriteSheetNode;
			
			this._usesCycle = this._particleSpriteSheetNode._iUsesCycle;
			this._usesPhase = this._particleSpriteSheetNode._iUsesCycle;
			this._totalFrames = this._particleSpriteSheetNode._iTotalFrames;
			this._numColumns = this._particleSpriteSheetNode._iNumColumns;
			this._numRows = this._particleSpriteSheetNode._iNumRows;
			this._cycleDuration = this._particleSpriteSheetNode._iCycleDuration;
			this._cyclePhase = this._particleSpriteSheetNode._iCyclePhase;
			
			this.updateSpriteSheetData();
		}
		
		public setRenderState(stageGLProxy:StageGLProxy, renderable:IRenderable, animationSubGeometry:AnimationSubGeometry, animationRegisterCache:AnimationRegisterCache, camera:Camera3D)
		{
			if (animationRegisterCache.needUVAnimation) {
				animationRegisterCache.setVertexConst(animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleSpriteSheetNode.UV_INDEX_0), this._spriteSheetData[0], this._spriteSheetData[1], this._spriteSheetData[2], this._spriteSheetData[3]);
				if (this._usesCycle) {
					var index:number /*int*/ = animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleSpriteSheetNode.UV_INDEX_1);
					if (this._particleSpriteSheetNode.mode == ParticlePropertiesMode.LOCAL_STATIC) {
						if (this._usesPhase)
							animationSubGeometry.activateVertexBuffer(index, this._particleSpriteSheetNode._iDataOffset, stageGLProxy, ContextGLVertexBufferFormat.FLOAT_3);
						else
							animationSubGeometry.activateVertexBuffer(index, this._particleSpriteSheetNode._iDataOffset, stageGLProxy, ContextGLVertexBufferFormat.FLOAT_2);
					} else
						animationRegisterCache.setVertexConst(index, this._spriteSheetData[4], this._spriteSheetData[5]);
				}
			}
		}
		
		private updateSpriteSheetData()
		{
			this._spriteSheetData = new Array<number>(8);
			
			var uTotal:number = this._totalFrames/this._numColumns;
			
			this._spriteSheetData[0] = uTotal;
			this._spriteSheetData[1] = 1/this._numColumns;
			this._spriteSheetData[2] = 1/this._numRows;
			
			if (this._usesCycle) {
				if (this._cycleDuration <= 0)
					throw(new Error("the cycle duration must be greater than zero"));
				this._spriteSheetData[4] = uTotal/this._cycleDuration;
				this._spriteSheetData[5] = this._cycleDuration;
				if (this._usesPhase)
					this._spriteSheetData[6] = this._cyclePhase;
			}
		}
	}
}
