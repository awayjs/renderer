import MathConsts						= require("awayjs-core/lib/geom/MathConsts");
import Vector3D							= require("awayjs-core/lib/geom/Vector3D");

import DisplayObject					= require("awayjs-display/lib/display/DisplayObject");
import Camera							= require("awayjs-display/lib/display/Camera");

import Stage							= require("awayjs-stagegl/lib/base/Stage");
import ContextGLVertexBufferFormat		= require("awayjs-stagegl/lib/base/ContextGLVertexBufferFormat");

import ParticleAnimator					= require("awayjs-renderergl/lib/animators/ParticleAnimator");
import AnimationRegisterCache			= require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
import AnimationElements				= require("awayjs-renderergl/lib/animators/data/AnimationElements");
import ParticleAnimationData			= require("awayjs-renderergl/lib/animators/data/ParticleAnimationData");
import ParticleFollowNode				= require("awayjs-renderergl/lib/animators/nodes/ParticleFollowNode");
import ParticleStateBase				= require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
import GL_RenderableBase				= require("awayjs-renderergl/lib/renderables/GL_RenderableBase");

/**
 * ...
 */
class ParticleFollowState extends ParticleStateBase
{
	/** @private */
	public static FOLLOW_POSITION_INDEX:number /*uint*/ = 0;

	/** @private */
	public static FOLLOW_ROTATION_INDEX:number /*uint*/ = 1;

	private _particleFollowNode:ParticleFollowNode;
	private _followTarget:DisplayObject;

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

	public get followTarget():DisplayObject
	{
		return this._followTarget;
	}

	public set followTarget(value:DisplayObject)
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
	public setRenderState(stage:Stage, renderable:GL_RenderableBase, animationElements:AnimationElements, animationRegisterCache:AnimationRegisterCache, camera:Camera)
	{
		if (this._followTarget) {
			if (this._particleFollowNode._iUsesPosition) {
				this._targetPos.x = this._followTarget.transform.position.x/renderable.sourceEntity.scaleX;
				this._targetPos.y = this._followTarget.transform.position.y/renderable.sourceEntity.scaleY;
				this._targetPos.z = this._followTarget.transform.position.z/renderable.sourceEntity.scaleZ;
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
		var previousTime:number = animationElements.previousTime;
		var deltaTime:number = currentTime - previousTime;

		var needProcess:boolean = previousTime != currentTime;

		if (this._particleFollowNode._iUsesPosition && this._particleFollowNode._iUsesRotation) {
			if (needProcess)
				this.processPositionAndRotation(currentTime, deltaTime, animationElements);

			animationElements.activateVertexBuffer(animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleFollowState.FOLLOW_POSITION_INDEX), this._particleFollowNode._iDataOffset, stage, ContextGLVertexBufferFormat.FLOAT_3);
			animationElements.activateVertexBuffer(animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleFollowState.FOLLOW_ROTATION_INDEX), this._particleFollowNode._iDataOffset + 3, stage, ContextGLVertexBufferFormat.FLOAT_3);
		} else if (this._particleFollowNode._iUsesPosition) {
			if (needProcess)
				this.processPosition(currentTime, deltaTime, animationElements);

			animationElements.activateVertexBuffer(animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleFollowState.FOLLOW_POSITION_INDEX), this._particleFollowNode._iDataOffset, stage, ContextGLVertexBufferFormat.FLOAT_3);
		} else if (this._particleFollowNode._iUsesRotation) {
			if (needProcess)
				this.precessRotation(currentTime, deltaTime, animationElements);

			animationElements.activateVertexBuffer(animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleFollowState.FOLLOW_ROTATION_INDEX), this._particleFollowNode._iDataOffset, stage, ContextGLVertexBufferFormat.FLOAT_3);
		}

		this._prePos.copyFrom(this._targetPos);
		this._targetEuler.copyFrom(this._targetEuler);
		animationElements.previousTime = currentTime;
	}

	private processPosition(currentTime:number, deltaTime:number, animationElements:AnimationElements)
	{
		var data:Array<ParticleAnimationData> = animationElements.animationParticles;
		var vertexData:Array<number> = animationElements.vertexData;

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
				var inc:number /*int*/ = data[i].startVertexIndex*animationElements.totalLenOfOneVertex + this._particleFollowNode._iDataOffset;

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
			animationElements.invalidateBuffer();

	}

	private precessRotation(currentTime:number, deltaTime:number, animationElements:AnimationElements)
	{
		var data:Array<ParticleAnimationData> = animationElements.animationParticles;
		var vertexData:Array<number> = animationElements.vertexData;

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
				var inc:number /*int*/ = data[i].startVertexIndex*animationElements.totalLenOfOneVertex + this._particleFollowNode._iDataOffset;

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
			animationElements.invalidateBuffer();

	}

	private processPositionAndRotation(currentTime:number, deltaTime:number, animationElements:AnimationElements)
	{
		var data:Array<ParticleAnimationData> = animationElements.animationParticles;
		var vertexData:Array<number> = animationElements.vertexData;

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
				var inc:number /*int*/ = data[i].startVertexIndex*animationElements.totalLenOfOneVertex + this._particleFollowNode._iDataOffset;
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
			animationElements.invalidateBuffer();
	}

}

export = ParticleFollowState;