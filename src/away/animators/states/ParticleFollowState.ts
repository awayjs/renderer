///<reference path="../../_definitions.ts"/>

module away.animators
{
	import IRenderable						= away.base.IRenderable;
	import Object3D							= away.base.Object3D;
	import Camera3D							= away.cameras.Camera3D;
	import ContextGLVertexBufferFormat		= away.displayGL.ContextGLVertexBufferFormat
	import Vector3D							= away.geom.Vector3D;
	import StageGLProxy						= away.managers.StageGLProxy;
	import MathConsts						= away.geom.MathConsts;
	
	/**
	 * ...
	 */
	export class ParticleFollowState extends ParticleStateBase
	{
		private _particleFollowNode:ParticleFollowNode;
		private _followTarget:Object3D;
		
		private _targetPos:Vector3D = new Vector3D();
		private _targetEuler:Vector3D = new Vector3D();
		private _prePos:Vector3D;
		private _preEuler:Vector3D;
		private _smooth:boolean;

		//temporary vector3D for calculation
		private _temp:Vector3D = new Vector3D();
		
		constructor(animator:ParticleAnimator, particleFollowNode:ParticleFollowNode)
		{
			super(animator, particleFollowNode, true);
			
			this._particleFollowNode = particleFollowNode;
			this._smooth = particleFollowNode._iSmooth;
		}
		
		public get followTarget():Object3D
		{
			return this._followTarget;
		}
		
		public set followTarget(value:Object3D)
		{
			this._followTarget = value;
		}
		
		public get smooth():boolean
		{
			return this._smooth;
		}
		
		public set smooth(value:boolean)
		{
			this._smooth = value;
		}
		
		/**
		 * @inheritDoc
		 */
		public setRenderState(stageGLProxy:StageGLProxy, renderable:IRenderable, animationSubGeometry:AnimationSubGeometry, animationRegisterCache:AnimationRegisterCache, camera:Camera3D)
		{	
			if (this._followTarget) {
				if (this._particleFollowNode._iUsesPosition) {
					this._targetPos.x = this._followTarget.position.x/renderable.sourceEntity.scaleX;
					this._targetPos.y = this._followTarget.position.y/renderable.sourceEntity.scaleY;
					this._targetPos.z = this._followTarget.position.z/renderable.sourceEntity.scaleZ;
				}
				if (this._particleFollowNode._iUsesRotation) {
					this._targetEuler.x = this._followTarget.rotationX;
					this._targetEuler.y = this._followTarget.rotationY;
					this._targetEuler.z = this._followTarget.rotationZ;
					this._targetEuler.scaleBy(MathConsts.DEGREES_TO_RADIANS);
				}
			}
			//initialization
			if (!this._prePos)
				this._prePos = this._targetPos.clone();
			if (!this._preEuler)
				this._preEuler = this._targetEuler.clone();
			
			var currentTime:number = this._pTime/1000;
			var previousTime:number = animationSubGeometry.previousTime;
			var deltaTime:number = currentTime - previousTime;
			
			var needProcess:boolean = previousTime != currentTime;
			
			if (this._particleFollowNode._iUsesPosition && this._particleFollowNode._iUsesRotation) {
				if (needProcess)
					this.processPositionAndRotation(currentTime, deltaTime, animationSubGeometry);
				
				animationSubGeometry.activateVertexBuffer(animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleFollowNode.FOLLOW_POSITION_INDEX), this._particleFollowNode._iDataOffset, stageGLProxy, ContextGLVertexBufferFormat.FLOAT_3);
				animationSubGeometry.activateVertexBuffer(animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleFollowNode.FOLLOW_ROTATION_INDEX), this._particleFollowNode._iDataOffset + 3, stageGLProxy, ContextGLVertexBufferFormat.FLOAT_3);
			} else if (this._particleFollowNode._iUsesPosition) {
				if (needProcess)
					this.processPosition(currentTime, deltaTime, animationSubGeometry);
				
				animationSubGeometry.activateVertexBuffer(animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleFollowNode.FOLLOW_POSITION_INDEX), this._particleFollowNode._iDataOffset, stageGLProxy, ContextGLVertexBufferFormat.FLOAT_3);
			} else if (this._particleFollowNode._iUsesRotation) {
				if (needProcess)
					this.precessRotation(currentTime, deltaTime, animationSubGeometry);
				
				animationSubGeometry.activateVertexBuffer(animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleFollowNode.FOLLOW_ROTATION_INDEX), this._particleFollowNode._iDataOffset, stageGLProxy, ContextGLVertexBufferFormat.FLOAT_3);
			}
			
			this._prePos.copyFrom(this._targetPos);
			this._targetEuler.copyFrom(this._targetEuler);
			animationSubGeometry.previousTime = currentTime;
		}
		
		private processPosition(currentTime:number, deltaTime:number, animationSubGeometry:AnimationSubGeometry)
		{
			var data:Array<ParticleAnimationData> = animationSubGeometry.animationParticles;
			var vertexData:Array<number> = animationSubGeometry.vertexData;
			
			var changed:boolean = false;
			var len:number /*uint*/ = data.length;
			var interpolatedPos:Vector3D;
			var posVelocity:Vector3D;
			if (this._smooth) {
				posVelocity = this._prePos.subtract(this._targetPos);
				posVelocity.scaleBy(1/deltaTime);
			} else
				interpolatedPos = this._targetPos;
			for (var i:number /*uint*/ = 0; i < len; i++) {
				var k:number = (currentTime - data[i].startTime)/data[i].totalTime;
				var t:number = (k - Math.floor(k))*data[i].totalTime;
				if (t - deltaTime <= 0) {
					var inc:number /*int*/ = data[i].startVertexIndex*animationSubGeometry.totalLenOfOneVertex + this._particleFollowNode._iDataOffset;
					
					if (this._smooth) {
						this._temp.copyFrom(posVelocity);
						this._temp.scaleBy(t);
						interpolatedPos = this._targetPos.add(this._temp);
					}
					
					if (vertexData[inc] != interpolatedPos.x || vertexData[inc + 1] != interpolatedPos.y || vertexData[inc + 2] != interpolatedPos.z) {
						changed = true;
						for (var j:number /*uint*/ = 0; j < data[i].numVertices; j++) {
							vertexData[inc++] = interpolatedPos.x;
							vertexData[inc++] = interpolatedPos.y;
							vertexData[inc++] = interpolatedPos.z;
						}
					}
				}
			}
			if (changed)
				animationSubGeometry.invalidateBuffer();
		
		}
		
		private precessRotation(currentTime:number, deltaTime:number, animationSubGeometry:AnimationSubGeometry)
		{
			var data:Array<ParticleAnimationData> = animationSubGeometry.animationParticles;
			var vertexData:Array<number> = animationSubGeometry.vertexData;
			
			var changed:boolean = false;
			var len:number /*uint*/ = data.length;
			
			var interpolatedRotation:Vector3D;
			var rotationVelocity:Vector3D;
			
			if (this._smooth) {
				rotationVelocity = this._preEuler.subtract(this._targetEuler);
				rotationVelocity.scaleBy(1/deltaTime);
			} else
				interpolatedRotation = this._targetEuler;
			
			for (var i:number /*uint*/ = 0; i < len; i++) {
				var k:number = (currentTime - data[i].startTime)/data[i].totalTime;
				var t:number = (k - Math.floor(k))*data[i].totalTime;
				if (t - deltaTime <= 0) {
					var inc:number /*int*/ = data[i].startVertexIndex*animationSubGeometry.totalLenOfOneVertex + this._particleFollowNode._iDataOffset;
					
					if (this._smooth) {
						this._temp.copyFrom(rotationVelocity);
						this._temp.scaleBy(t);
						interpolatedRotation = this._targetEuler.add(this._temp);
					}
					
					if (vertexData[inc] != interpolatedRotation.x || vertexData[inc + 1] != interpolatedRotation.y || vertexData[inc + 2] != interpolatedRotation.z) {
						changed = true;
						for (var j:number /*uint*/ = 0; j < data[i].numVertices; j++) {
							vertexData[inc++] = interpolatedRotation.x;
							vertexData[inc++] = interpolatedRotation.y;
							vertexData[inc++] = interpolatedRotation.z;
						}
					}
				}
			}
			if (changed)
				animationSubGeometry.invalidateBuffer();
		
		}
		
		private processPositionAndRotation(currentTime:number, deltaTime:number, animationSubGeometry:AnimationSubGeometry)
		{
			var data:Array<ParticleAnimationData> = animationSubGeometry.animationParticles;
			var vertexData:Array<number> = animationSubGeometry.vertexData;
			
			var changed:boolean = false;
			var len:number /*uint*/ = data.length;
			
			var interpolatedPos:Vector3D;
			var interpolatedRotation:Vector3D;
			
			var posVelocity:Vector3D;
			var rotationVelocity:Vector3D;
			if (this._smooth) {
				posVelocity = this._prePos.subtract(this._targetPos);
				posVelocity.scaleBy(1/deltaTime);
				rotationVelocity = this._preEuler.subtract(this._targetEuler);
				rotationVelocity.scaleBy(1/deltaTime);
			} else {
				interpolatedPos = this._targetPos;
				interpolatedRotation = this._targetEuler;
			}
			
			for (var i:number /*uint*/ = 0; i < len; i++) {
				var k:number = (currentTime - data[i].startTime)/data[i].totalTime;
				var t:number = (k - Math.floor(k))*data[i].totalTime;
				if (t - deltaTime <= 0) {
					var inc:number /*int*/ = data[i].startVertexIndex*animationSubGeometry.totalLenOfOneVertex + this._particleFollowNode._iDataOffset;
					if (this._smooth) {
						this._temp.copyFrom(posVelocity);
						this._temp.scaleBy(t);
						interpolatedPos = this._targetPos.add(this._temp);
						
						this._temp.copyFrom(rotationVelocity);
						this._temp.scaleBy(t);
						interpolatedRotation = this._targetEuler.add(this._temp);
					}
					
					if (vertexData[inc] != interpolatedPos.x || vertexData[inc + 1] != interpolatedPos.y || vertexData[inc + 2] != interpolatedPos.z || vertexData[inc + 3] != interpolatedRotation.x || vertexData[inc + 4] != interpolatedRotation.y || vertexData[inc + 5] != interpolatedRotation.z) {
						changed = true;
						for (var j:number /*uint*/ = 0; j < data[i].numVertices; j++) {
							vertexData[inc++] = interpolatedPos.x;
							vertexData[inc++] = interpolatedPos.y;
							vertexData[inc++] = interpolatedPos.z;
							vertexData[inc++] = interpolatedRotation.x;
							vertexData[inc++] = interpolatedRotation.y;
							vertexData[inc++] = interpolatedRotation.z;
						}
					}
				}
			}
			if (changed)
				animationSubGeometry.invalidateBuffer();
		}
	
	}

}
