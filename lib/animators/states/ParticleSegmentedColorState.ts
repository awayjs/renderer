import {ColorTransform}					from "@awayjs/core/lib/geom/ColorTransform";

import {Camera}							from "@awayjs/display/lib/display/Camera";

import {Stage}							from "@awayjs/stage/lib/base/Stage";

import {ParticleAnimator}					from "../../animators/ParticleAnimator";
import {AnimationRegisterData}			from "../../animators/data/AnimationRegisterData";
import {AnimationElements}				from "../../animators/data/AnimationElements";
import {ColorSegmentPoint}				from "../../animators/data/ColorSegmentPoint";
import {ParticlePropertiesMode}			from "../../animators/data/ParticlePropertiesMode";
import {ParticleSegmentedColorNode}		from "../../animators/nodes/ParticleSegmentedColorNode";
import {ParticleStateBase}				from "../../animators/states/ParticleStateBase";
import {GL_RenderableBase}				from "../../renderables/GL_RenderableBase";
import {ShaderBase}						from "../../shaders/ShaderBase";

/**
 *
 */
export class ParticleSegmentedColorState extends ParticleStateBase
{
	/** @private */
	public static START_MULTIPLIER_INDEX:number = 0;

	/** @private */
	public static START_OFFSET_INDEX:number = 1;

	/** @private */
	public static TIME_DATA_INDEX:number = 2;

	private _usesMultiplier:boolean;
	private _usesOffset:boolean;
	private _startColor:ColorTransform;
	private _endColor:ColorTransform;
	private _segmentPoints:Array<ColorSegmentPoint>;
	private _numSegmentPoint:number;

	private _timeLifeData:Float32Array;
	private _multiplierData:Float32Array;
	private _offsetData:Float32Array;

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
	 * Defines the number of segments.
	 */
	public get numSegmentPoint():number
	{
		return this._numSegmentPoint;
	}

	/**
	 * Defines the key points of color
	 */
	public get segmentPoints():Array<ColorSegmentPoint>
	{
		return this._segmentPoints;
	}

	public set segmentPoints(value:Array<ColorSegmentPoint>)
	{
		this._segmentPoints = value;
		this.updateColorData();
	}

	public get usesMultiplier():boolean
	{
		return this._usesMultiplier;
	}

	public get usesOffset():boolean
	{
		return this._usesOffset;
	}

	constructor(animator:ParticleAnimator, particleSegmentedColorNode:ParticleSegmentedColorNode)
	{
		super(animator, particleSegmentedColorNode);

		this._usesMultiplier = particleSegmentedColorNode._iUsesMultiplier;
		this._usesOffset = particleSegmentedColorNode._iUsesOffset;
		this._startColor = particleSegmentedColorNode._iStartColor;
		this._endColor = particleSegmentedColorNode._iEndColor;
		this._segmentPoints = particleSegmentedColorNode._iSegmentPoints;
		this._numSegmentPoint = particleSegmentedColorNode._iNumSegmentPoint;
		this.updateColorData();
	}

	public setRenderState(shader:ShaderBase, renderable:GL_RenderableBase, animationElements:AnimationElements, animationRegisterData:AnimationRegisterData, camera:Camera, stage:Stage):void
	{
		if (shader.usesFragmentAnimation) {
			if (this._numSegmentPoint > 0)
				shader.setVertexConst(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleSegmentedColorState.TIME_DATA_INDEX), this._timeLifeData[0], this._timeLifeData[1], this._timeLifeData[2], this._timeLifeData[3]);
			if (this._usesMultiplier)
				shader.setVertexConstFromArray(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleSegmentedColorState.START_MULTIPLIER_INDEX), this._multiplierData);
			if (this._usesOffset)
				shader.setVertexConstFromArray(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleSegmentedColorState.START_OFFSET_INDEX), this._offsetData);
		}
	}

	private updateColorData():void
	{
		this._timeLifeData = new Float32Array(4);
		this._multiplierData = new Float32Array(4*(this._numSegmentPoint + 1));
		this._offsetData = new Float32Array(4*(this._numSegmentPoint + 1));

		//cut off the time data
		var i:number;
		var j:number = 0;
		var count:number = this._numSegmentPoint > 3? 3 : this._numSegmentPoint;
		for (i = 0; i < count; i++) {
			if (i == 0)
				this._timeLifeData[j++] = this._segmentPoints[i].life;
			else
				this._timeLifeData[j++] = this._segmentPoints[i].life - this._segmentPoints[i - 1].life;
		}
		i = count;
		if (this._numSegmentPoint == 0)
			this._timeLifeData[j++] = 1;
		else
			this._timeLifeData[j++] = 1 - this._segmentPoints[i - 1].life;

		if (this._usesMultiplier) {
			j = 0;
			this._multiplierData[j++] = this._startColor.redMultiplier;
			this._multiplierData[j++] = this._startColor.greenMultiplier;
			this._multiplierData[j++] = this._startColor.blueMultiplier;
			this._multiplierData[j++] = this._startColor.alphaMultiplier;
			for (i = 0; i < this._numSegmentPoint; i++) {
				if (i == 0) {
					this._multiplierData[j++] = (this._segmentPoints[i].color.redMultiplier - this._startColor.redMultiplier)/this._timeLifeData[i];
					this._multiplierData[j++] = (this._segmentPoints[i].color.greenMultiplier - this._startColor.greenMultiplier)/this._timeLifeData[i];
					this._multiplierData[j++] = (this._segmentPoints[i].color.blueMultiplier - this._startColor.blueMultiplier)/this._timeLifeData[i];
					this._multiplierData[j++] = (this._segmentPoints[i].color.alphaMultiplier - this._startColor.alphaMultiplier)/this._timeLifeData[i];
				} else {
					this._multiplierData[j++] = (this._segmentPoints[i].color.redMultiplier - this._segmentPoints[i - 1].color.redMultiplier)/this._timeLifeData[i];
					this._multiplierData[j++] = (this._segmentPoints[i].color.greenMultiplier - this._segmentPoints[i - 1].color.greenMultiplier)/this._timeLifeData[i];
					this._multiplierData[j++] = (this._segmentPoints[i].color.blueMultiplier - this._segmentPoints[i - 1].color.blueMultiplier)/this._timeLifeData[i];
					this._multiplierData[j++] = (this._segmentPoints[i].color.alphaMultiplier - this._segmentPoints[i - 1].color.alphaMultiplier)/this._timeLifeData[i];
				}
			}
			i = this._numSegmentPoint;
			if (this._numSegmentPoint == 0) {
				this._multiplierData[j++] = this._endColor.redMultiplier - this._startColor.redMultiplier;
				this._multiplierData[j++] = this._endColor.greenMultiplier - this._startColor.greenMultiplier;
				this._multiplierData[j++] = this._endColor.blueMultiplier - this._startColor.blueMultiplier;
				this._multiplierData[j++] = this._endColor.alphaMultiplier - this._startColor.alphaMultiplier;
			} else {
				this._multiplierData[j++] = (this._endColor.redMultiplier - this._segmentPoints[i - 1].color.redMultiplier)/this._timeLifeData[i];
				this._multiplierData[j++] = (this._endColor.greenMultiplier - this._segmentPoints[i - 1].color.greenMultiplier)/this._timeLifeData[i];
				this._multiplierData[j++] = (this._endColor.blueMultiplier - this._segmentPoints[i - 1].color.blueMultiplier)/this._timeLifeData[i];
				this._multiplierData[j++] = (this._endColor.alphaMultiplier - this._segmentPoints[i - 1].color.alphaMultiplier)/this._timeLifeData[i];
			}
		}

		if (this._usesOffset) {
			j = 0;
			this._offsetData[j++] = this._startColor.redOffset/255;
			this._offsetData[j++] = this._startColor.greenOffset/255;
			this._offsetData[j++] = this._startColor.blueOffset/255;
			this._offsetData[j++] = this._startColor.alphaOffset/255;
			for (i = 0; i < this._numSegmentPoint; i++) {
				if (i == 0) {
					this._offsetData[j++] = (this._segmentPoints[i].color.redOffset - this._startColor.redOffset)/this._timeLifeData[i]/255;
					this._offsetData[j++] = (this._segmentPoints[i].color.greenOffset - this._startColor.greenOffset)/this._timeLifeData[i]/255;
					this._offsetData[j++] = (this._segmentPoints[i].color.blueOffset - this._startColor.blueOffset)/this._timeLifeData[i]/255;
					this._offsetData[j++] = (this._segmentPoints[i].color.alphaOffset - this._startColor.alphaOffset)/this._timeLifeData[i]/255;
				} else {
					this._offsetData[j++] = (this._segmentPoints[i].color.redOffset - this._segmentPoints[i - 1].color.redOffset)/this._timeLifeData[i]/255;
					this._offsetData[j++] = (this._segmentPoints[i].color.greenOffset - this._segmentPoints[i - 1].color.greenOffset)/this._timeLifeData[i]/255;
					this._offsetData[j++] = (this._segmentPoints[i].color.blueOffset - this._segmentPoints[i - 1].color.blueOffset)/this._timeLifeData[i]/255;
					this._offsetData[j++] = (this._segmentPoints[i].color.alphaOffset - this._segmentPoints[i - 1].color.alphaOffset)/this._timeLifeData[i]/255;
				}
			}
			i = this._numSegmentPoint;
			if (this._numSegmentPoint == 0) {
				this._offsetData[j++] = (this._endColor.redOffset - this._startColor.redOffset)/255;
				this._offsetData[j++] = (this._endColor.greenOffset - this._startColor.greenOffset)/255;
				this._offsetData[j++] = (this._endColor.blueOffset - this._startColor.blueOffset)/255;
				this._offsetData[j++] = (this._endColor.alphaOffset - this._startColor.alphaOffset)/255;
			} else {
				this._offsetData[i] = (this._endColor.redOffset - this._segmentPoints[i - 1].color.redOffset)/this._timeLifeData[i]/255;
				this._offsetData[j++] = (this._endColor.greenOffset - this._segmentPoints[i - 1].color.greenOffset)/this._timeLifeData[i]/255;
				this._offsetData[j++] = (this._endColor.blueOffset - this._segmentPoints[i - 1].color.blueOffset)/this._timeLifeData[i]/255;
				this._offsetData[j++] = (this._endColor.alphaOffset - this._segmentPoints[i - 1].color.alphaOffset)/this._timeLifeData[i]/255;
			}
		}
	}
}