import Vector3D							= require("awayjs-core/lib/geom/Vector3D");

import Camera							= require("awayjs-display/lib/display/Camera");

import Stage							= require("awayjs-stagegl/lib/base/Stage");

import ParticleAnimator					= require("awayjs-renderergl/lib/animators/ParticleAnimator");
import AnimationRegisterCache			= require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
import AnimationElements				= require("awayjs-renderergl/lib/animators/data/AnimationElements");
import ParticleAnimationData			= require("awayjs-renderergl/lib/animators/data/ParticleAnimationData");
import ParticleNodeBase					= require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
import AnimationStateBase				= require("awayjs-renderergl/lib/animators/states/AnimationStateBase");
import GL_RenderableBase				= require("awayjs-renderergl/lib/renderables/GL_RenderableBase");

/**
 * ...
 */
class ParticleStateBase extends AnimationStateBase
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

	public setRenderState(stage:Stage, renderable:GL_RenderableBase, animationElements:AnimationElements, animationRegisterCache:AnimationRegisterCache, camera:Camera)
	{

	}

	public _pUpdateDynamicProperties(animationElements:AnimationElements)
	{
		this._pDynamicPropertiesDirty[animationElements._iUniqueId] = true;

		var animationParticles:Array<ParticleAnimationData> = animationElements.animationParticles;
		var vertexData:Array<number> = animationElements.vertexData;
		var totalLenOfOneVertex:number /*uint*/ = animationElements.totalLenOfOneVertex;
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

		animationElements.invalidateBuffer();
	}

}

export = ParticleStateBase;