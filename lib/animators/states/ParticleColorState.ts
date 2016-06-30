import {ColorTransform}					from "@awayjs/core/lib/geom/ColorTransform";
import {Vector3D}							from "@awayjs/core/lib/geom/Vector3D";

import {Camera}							from "@awayjs/display/lib/display/Camera";

import {Stage}							from "@awayjs/stage/lib/base/Stage";
import {ContextGLVertexBufferFormat}		from "@awayjs/stage/lib/base/ContextGLVertexBufferFormat";

import {ParticleAnimator}					from "../../animators/ParticleAnimator";
import {AnimationRegisterData}			from "../../animators/data/AnimationRegisterData";
import {AnimationElements}				from "../../animators/data/AnimationElements";
import {ParticlePropertiesMode}			from "../../animators/data/ParticlePropertiesMode";
import {ParticleColorNode}				from "../../animators/nodes/ParticleColorNode";
import {ParticleStateBase}				from "../../animators/states/ParticleStateBase";
import {GL_RenderableBase}				from "../../renderables/GL_RenderableBase";
import {ShaderBase}						from "../../shaders/ShaderBase";

/**
 * ...
 * @author ...
 */
export class ParticleColorState extends ParticleStateBase
{
	/** @private */
	public static START_MULTIPLIER_INDEX:number = 0;

	/** @private */
	public static DELTA_MULTIPLIER_INDEX:number = 1;

	/** @private */
	public static START_OFFSET_INDEX:number = 2;

	/** @private */
	public static DELTA_OFFSET_INDEX:number = 3;

	/** @private */
	public static CYCLE_INDEX:number = 4;

	private _particleColorNode:ParticleColorNode;
	private _usesMultiplier:boolean;
	private _usesOffset:boolean;
	private _usesCycle:boolean;
	private _usesPhase:boolean;
	private _startColor:ColorTransform;
	private _endColor:ColorTransform;
	private _cycleDuration:number;
	private _cyclePhase:number;
	private _cycleData:Vector3D;
	private _startMultiplierData:Vector3D;
	private _deltaMultiplierData:Vector3D;
	private _startOffsetData:Vector3D;
	private _deltaOffsetData:Vector3D;

	/**
	 * Defines the start color transform of the state, when in global mode.
	 */
	public get startColor():ColorTransform
	{
		return this._startColor;
	}

	public set startColor(value:ColorTransform)
	{
		this._startColor = value;

		this.updateColorData();
	}

	/**
	 * Defines the end color transform of the state, when in global mode.
	 */
	public get endColor():ColorTransform
	{
		return this._endColor;
	}

	public set endColor(value:ColorTransform)
	{
		this._endColor = value;

		this.updateColorData();
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

		this.updateColorData();
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

		this.updateColorData();
	}

	constructor(animator:ParticleAnimator, particleColorNode:ParticleColorNode)
	{
		super(animator, particleColorNode);

		this._particleColorNode = particleColorNode;
		this._usesMultiplier = this._particleColorNode._iUsesMultiplier;
		this._usesOffset = this._particleColorNode._iUsesOffset;
		this._usesCycle = this._particleColorNode._iUsesCycle;
		this._usesPhase = this._particleColorNode._iUsesPhase;
		this._startColor = this._particleColorNode._iStartColor;
		this._endColor = this._particleColorNode._iEndColor;
		this._cycleDuration = this._particleColorNode._iCycleDuration;
		this._cyclePhase = this._particleColorNode._iCyclePhase;

		this.updateColorData();
	}

	public setRenderState(shader:ShaderBase, renderable:GL_RenderableBase, animationElements:AnimationElements, animationRegisterData:AnimationRegisterData, camera:Camera, stage:Stage):void
	{
		if (shader.usesFragmentAnimation) {
			var dataOffset:number = this._particleColorNode._iDataOffset;
			var index:number;
			if (this._usesCycle)
				shader.setVertexConst(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleColorState.CYCLE_INDEX), this._cycleData.x, this._cycleData.y, this._cycleData.z, this._cycleData.w);

			if (this._usesMultiplier) {
				if (this._particleColorNode.mode == ParticlePropertiesMode.LOCAL_STATIC) {
					animationElements.activateVertexBuffer(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleColorState.START_MULTIPLIER_INDEX), dataOffset, stage, ContextGLVertexBufferFormat.FLOAT_4);
					dataOffset += 4;
					animationElements.activateVertexBuffer(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleColorState.DELTA_MULTIPLIER_INDEX), dataOffset, stage, ContextGLVertexBufferFormat.FLOAT_4);
					dataOffset += 4;
				} else {
					shader.setVertexConst(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleColorState.START_MULTIPLIER_INDEX), this._startMultiplierData.x, this._startMultiplierData.y, this._startMultiplierData.z, this._startMultiplierData.w);
					shader.setVertexConst(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleColorState.DELTA_MULTIPLIER_INDEX), this._deltaMultiplierData.x, this._deltaMultiplierData.y, this._deltaMultiplierData.z, this._deltaMultiplierData.w);
				}
			}
			if (this._usesOffset) {
				if (this._particleColorNode.mode == ParticlePropertiesMode.LOCAL_STATIC) {
					animationElements.activateVertexBuffer(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleColorState.START_OFFSET_INDEX), dataOffset, stage, ContextGLVertexBufferFormat.FLOAT_4);
					dataOffset += 4;
					animationElements.activateVertexBuffer(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleColorState.DELTA_OFFSET_INDEX), dataOffset, stage, ContextGLVertexBufferFormat.FLOAT_4);
				} else {
					shader.setVertexConst(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleColorState.START_OFFSET_INDEX), this._startOffsetData.x, this._startOffsetData.y, this._startOffsetData.z, this._startOffsetData.w);
					shader.setVertexConst(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleColorState.DELTA_OFFSET_INDEX), this._deltaOffsetData.x, this._deltaOffsetData.y, this._deltaOffsetData.z, this._deltaOffsetData.w);
				}
			}
		}
	}

	private updateColorData():void
	{
		if (this._usesCycle) {
			if (this._cycleDuration <= 0)
				throw(new Error("the cycle duration must be greater than zero"));
			this._cycleData = new Vector3D(Math.PI*2/this._cycleDuration, this._cyclePhase*Math.PI/180, 0, 0);
		}
		if (this._particleColorNode.mode == ParticlePropertiesMode.GLOBAL) {
			if (this._usesCycle) {
				if (this._usesMultiplier) {
					this._startMultiplierData = new Vector3D((this._startColor.redMultiplier + this._endColor.redMultiplier)/2, (this._startColor.greenMultiplier + this._endColor.greenMultiplier)/2, (this._startColor.blueMultiplier + this._endColor.blueMultiplier)/2, (this._startColor.alphaMultiplier + this._endColor.alphaMultiplier)/2);
					this._deltaMultiplierData = new Vector3D((this._endColor.redMultiplier - this._startColor.redMultiplier)/2, (this._endColor.greenMultiplier - this._startColor.greenMultiplier)/2, (this._endColor.blueMultiplier - this._startColor.blueMultiplier)/2, (this._endColor.alphaMultiplier - this._startColor.alphaMultiplier)/2);
				}

				if (this._usesOffset) {
					this._startOffsetData = new Vector3D((this._startColor.redOffset + this._endColor.redOffset)/(255*2), (this._startColor.greenOffset + this._endColor.greenOffset)/(255*2), (this._startColor.blueOffset + this._endColor.blueOffset)/(255*2), (this._startColor.alphaOffset + this._endColor.alphaOffset)/(255*2));
					this._deltaOffsetData = new Vector3D((this._endColor.redOffset - this._startColor.redOffset)/(255*2), (this._endColor.greenOffset - this._startColor.greenOffset)/(255*2), (this._endColor.blueOffset - this._startColor.blueOffset)/(255*2), (this._endColor.alphaOffset - this._startColor.alphaOffset)/(255*2));
				}
			} else {
				if (this._usesMultiplier) {
					this._startMultiplierData = new Vector3D(this._startColor.redMultiplier, this._startColor.greenMultiplier, this._startColor.blueMultiplier, this._startColor.alphaMultiplier);
					this._deltaMultiplierData = new Vector3D((this._endColor.redMultiplier - this._startColor.redMultiplier), (this._endColor.greenMultiplier - this._startColor.greenMultiplier), (this._endColor.blueMultiplier - this._startColor.blueMultiplier), (this._endColor.alphaMultiplier - this._startColor.alphaMultiplier));
				}

				if (this._usesOffset) {
					this._startOffsetData = new Vector3D(this._startColor.redOffset/255, this._startColor.greenOffset/255, this._startColor.blueOffset/255, this._startColor.alphaOffset/255);
					this._deltaOffsetData = new Vector3D((this._endColor.redOffset - this._startColor.redOffset)/255, (this._endColor.greenOffset - this._startColor.greenOffset)/255, (this._endColor.blueOffset - this._startColor.blueOffset )/255, (this._endColor.alphaOffset - this._startColor.alphaOffset)/255);
				}
			}
		}
	}
}