import {Vector3D}							from "@awayjs/core/lib/geom/Vector3D";

import {Camera}							from "@awayjs/display/lib/display/Camera";

import {Stage}							from "@awayjs/stage/lib/base/Stage";

import {ParticleAnimator}					from "../../animators/ParticleAnimator";
import {AnimationRegisterData}			from "../../animators/data/AnimationRegisterData";
import {AnimationElements}				from "../../animators/data/AnimationElements";
import {ParticleAnimationData}			from "../../animators/data/ParticleAnimationData";
import {ParticleNodeBase}					from "../../animators/nodes/ParticleNodeBase";
import {AnimationStateBase}				from "../../animators/states/AnimationStateBase";
import {GL_RenderableBase}				from "../../renderables/GL_RenderableBase";
import {ShaderBase}						from "../../shaders/ShaderBase";

/**
 * ...
 */
export class ParticleStateBase extends AnimationStateBase
{
	private _particleNode:ParticleNodeBase;
	public _pParticleAnimator:ParticleAnimator;
	
	public _pDynamicProperties:Array<Vector3D> = new Array<Vector3D>();
	public _pDynamicPropertiesDirty:Object = new Object();

	public _pNeedUpdateTime:boolean;

	constructor(animator:ParticleAnimator, particleNode:ParticleNodeBase, needUpdateTime:boolean = false)
	{
		super(animator, particleNode);

		this._pParticleAnimator = animator;
		this._particleNode = particleNode;
		this._pNeedUpdateTime = needUpdateTime;
	}

	public get needUpdateTime():boolean
	{
		return this._pNeedUpdateTime;
	}

	public setRenderState(shader:ShaderBase, renderable:GL_RenderableBase, animationElements:AnimationElements, animationRegisterData:AnimationRegisterData, camera:Camera, stage:Stage):void
	{

	}

	public _pUpdateDynamicProperties(animationElements:AnimationElements):void
	{
		this._pDynamicPropertiesDirty[animationElements._iUniqueId] = true;

		var animationParticles:Array<ParticleAnimationData> = animationElements.animationParticles;
		var vertexData:Array<number> = animationElements.vertexData;
		var totalLenOfOneVertex:number = animationElements.totalLenOfOneVertex;
		var dataLength:number = this._particleNode.dataLength;
		var dataOffset:number = this._particleNode._iDataOffset;
		var vertexLength:number;
		//			var particleOffset:number;
		var startingOffset:number;
		var vertexOffset:number;
		var data:Vector3D;
		var animationParticle:ParticleAnimationData;

		//			var numParticles:number = _positions.length/dataLength;
		var numParticles:number = this._pDynamicProperties.length;
		var i:number = 0;
		var j:number = 0;
		var k:number = 0;

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