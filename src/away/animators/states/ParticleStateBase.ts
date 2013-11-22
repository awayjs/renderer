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
	export class ParticleStateBase extends AnimationStateBase
	{
		private _particleNode:ParticleNodeBase;
		
		public _pDynamicProperties:Array<Vector3D> = new Array<Vector3D>();
		public _pDynamicPropertiesDirty:Object = new Object();
		
		public _pNeedUpdateTime:boolean;
		
		constructor(animator:ParticleAnimator, particleNode:ParticleNodeBase, needUpdateTime:boolean = false)
		{
			super(animator, particleNode);
			
			this._particleNode = particleNode;
			this._pNeedUpdateTime = needUpdateTime;
		}
		
		public get needUpdateTime():boolean
		{
			return this._pNeedUpdateTime;
		}
		
		public setRenderState(stage3DProxy:Stage3DProxy, renderable:IRenderable, animationSubGeometry:AnimationSubGeometry, animationRegisterCache:AnimationRegisterCache, camera:Camera3D)
		{
		
		}
		
		public _pUpdateDynamicProperties(animationSubGeometry:AnimationSubGeometry)
		{
			this._pDynamicPropertiesDirty[animationSubGeometry._iUniqueId] = true;
			
			var animationParticles:Array<ParticleAnimationData> = animationSubGeometry.animationParticles;
			var vertexData:Array<number> = animationSubGeometry.vertexData;
			var totalLenOfOneVertex:number /*uint*/ = animationSubGeometry.totalLenOfOneVertex;
			var dataLength:number /*uint*/ = this._particleNode.dataLength;
			var dataOffset:number /*uint*/ = this._particleNode._iDataOffset;
			var vertexLength:number /*uint*/;
			//			var particleOffset:number /*uint*/;
			var startingOffset:number /*uint*/;
			var vertexOffset:number /*uint*/;
			var data:Vector3D;
			var animationParticle:ParticleAnimationData;
			
			//			var numParticles:number /*uint*/ = _positions.length/dataLength;
			var numParticles:number /*uint*/ = this._pDynamicProperties.length;
			var i:number /*uint*/ = 0;
			var j:number /*uint*/ = 0;
			var k:number /*uint*/ = 0;
			
			//loop through all particles
			while (i < numParticles) {
				//loop through each particle data for the current particle
				while (j < numParticles && (animationParticle = animationParticles[j]).index == i) {
					data = this._pDynamicProperties[i];
					vertexLength = animationParticle.numVertices*totalLenOfOneVertex;
					startingOffset = animationParticle.startVertexIndex*totalLenOfOneVertex + dataOffset;
					//loop through each vertex in the particle data
					for (k = 0; k < vertexLength; k += totalLenOfOneVertex) {
						vertexOffset = startingOffset + k;
						//						particleOffset = i * dataLength;
						//loop through all vertex data for the current particle data
						for (k = 0; k < vertexLength; k += totalLenOfOneVertex) {
							vertexOffset = startingOffset + k;
							vertexData[vertexOffset++] = data.x;
							vertexData[vertexOffset++] = data.y;
							vertexData[vertexOffset++] = data.z;
							
							if (dataLength == 4)
								vertexData[vertexOffset++] = data.w;
						}
							//loop through each value in the particle vertex
							//						switch(dataLength) {
							//							case 4:
							//								vertexData[vertexOffset++] = _positions[particleOffset++];
							//							case 3:
							//								vertexData[vertexOffset++] = _positions[particleOffset++];
							//							case 2:
							//								vertexData[vertexOffset++] = _positions[particleOffset++];
							//							case 1:
							//								vertexData[vertexOffset++] = _positions[particleOffset++];
							//						}
					}
					j++;
				}
				i++;
			}
			
			animationSubGeometry.invalidateBuffer();
		}
	
	}

}
