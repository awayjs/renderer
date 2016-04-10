import ColorTransform					from "awayjs-core/lib/geom/ColorTransform";

import Camera							from "awayjs-display/lib/display/Camera";

import Stage							from "awayjs-stagegl/lib/base/Stage";

import ParticleAnimator					from "../../animators/ParticleAnimator";
import AnimationRegisterCache			from "../../animators/data/AnimationRegisterCache";
import AnimationElements				from "../../animators/data/AnimationElements";
import ColorSegmentPoint				from "../../animators/data/ColorSegmentPoint";
import ParticlePropertiesMode			from "../../animators/data/ParticlePropertiesMode";
import ParticleSegmentedColorNode		from "../../animators/nodes/ParticleSegmentedColorNode";
import ParticleStateBase				from "../../animators/states/ParticleStateBase";
import GL_RenderableBase				from "../../animators/../renderables/GL_RenderableBase";

/**
 *
 */
class ParticleSegmentedColorState extends ParticleStateBase
{
	/** @private */
	public static START_MULTIPLIER_INDEX:number /*uint*/ = 0;

	/** @private */
	public static START_OFFSET_INDEX:number /*uint*/ = 1;

	/** @private */
	public static TIME_DATA_INDEX:number /*uint*/ = 2;

	private _usesMultiplier:boolean;
	private _usesOffset:boolean;
	private _startColor:ColorTransform;
	private _endColor:ColorTransform;
	private _segmentPoints:Array<ColorSegmentPoint>;
	private _numSegmentPoint:number /*int*/;

	private _timeLifeData:Array<number>;
	private _multiplierData:Array<number>;
	private _offsetData:Array<number>;

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
	public get numSegmentPoint():number /*int*/
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

	public setRenderState(stage:Stage, renderable:GL_RenderableBase, animationElements:AnimationElements, animationRegisterCache:AnimationRegisterCache, camera:Camera)
	{
		if (animationRegisterCache.needFragmentAnimation) {
			if (this._numSegmentPoint > 0)
				animationRegisterCache.setVertexConst(animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleSegmentedColorState.TIME_DATA_INDEX), this._timeLifeData[0], this._timeLifeData[1], this._timeLifeData[2], this._timeLifeData[3]);
			if (this._usesMultiplier)
				animationRegisterCache.setVertexConstFromArray(animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleSegmentedColorState.START_MULTIPLIER_INDEX), this._multiplierData);
			if (this._usesOffset)
				animationRegisterCache.setVertexConstFromArray(animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleSegmentedColorState.START_OFFSET_INDEX), this._offsetData);
		}
	}

	private updateColorData()
	{
		this._timeLifeData = new Array<number>();
		this._multiplierData = new Array<number>();
		this._offsetData = new Array<number>();
		var i:number /*int*/;
		for (i = 0; i < this._numSegmentPoint; i++) {
			if (i == 0)
				this._timeLifeData.push(this._segmentPoints[i].life);
			else
				this._timeLifeData.push(this._segmentPoints[i].life - this._segmentPoints[i - 1].life);
		}
		if (this._numSegmentPoint == 0)
			this._timeLifeData.push(1);
		else
			this._timeLifeData.push(1 - this._segmentPoints[i - 1].life);

		if (this._usesMultiplier) {
			this._multiplierData.push(this._startColor.redMultiplier, this._startColor.greenMultiplier, this._startColor.blueMultiplier, this._startColor.alphaMultiplier);
			for (i = 0; i < this._numSegmentPoint; i++) {
				if (i == 0)
					this._multiplierData.push((this._segmentPoints[i].color.redMultiplier - this._startColor.redMultiplier)/this._timeLifeData[i], (this._segmentPoints[i].color.greenMultiplier - this._startColor.greenMultiplier)/this._timeLifeData[i], (this._segmentPoints[i].color.blueMultiplier - this._startColor.blueMultiplier)/this._timeLifeData[i], (this._segmentPoints[i].color.alphaMultiplier - this._startColor.alphaMultiplier)/this._timeLifeData[i]);
				else
					this._multiplierData.push((this._segmentPoints[i].color.redMultiplier - this._segmentPoints[i - 1].color.redMultiplier)/this._timeLifeData[i], (this._segmentPoints[i].color.greenMultiplier - this._segmentPoints[i - 1].color.greenMultiplier)/this._timeLifeData[i], (this._segmentPoints[i].color.blueMultiplier - this._segmentPoints[i - 1].color.blueMultiplier)/this._timeLifeData[i], (this._segmentPoints[i].color.alphaMultiplier - this._segmentPoints[i - 1].color.alphaMultiplier)/this._timeLifeData[i]);
			}
			if (this._numSegmentPoint == 0)
				this._multiplierData.push(this._endColor.redMultiplier - this._startColor.redMultiplier, this._endColor.greenMultiplier - this._startColor.greenMultiplier, this._endColor.blueMultiplier - this._startColor.blueMultiplier, this._endColor.alphaMultiplier - this._startColor.alphaMultiplier);
			else
				this._multiplierData.push((this._endColor.redMultiplier - this._segmentPoints[i - 1].color.redMultiplier)/this._timeLifeData[i], (this._endColor.greenMultiplier - this._segmentPoints[i - 1].color.greenMultiplier)/this._timeLifeData[i], (this._endColor.blueMultiplier - this._segmentPoints[i - 1].color.blueMultiplier)/this._timeLifeData[i], (this._endColor.alphaMultiplier - this._segmentPoints[i - 1].color.alphaMultiplier)/this._timeLifeData[i]);
		}

		if (this._usesOffset) {
			this._offsetData.push(this._startColor.redOffset/255, this._startColor.greenOffset/255, this._startColor.blueOffset/255, this._startColor.alphaOffset/255);
			for (i = 0; i < this._numSegmentPoint; i++) {
				if (i == 0)
					this._offsetData.push((this._segmentPoints[i].color.redOffset - this._startColor.redOffset)/this._timeLifeData[i]/255, (this._segmentPoints[i].color.greenOffset - this._startColor.greenOffset)/this._timeLifeData[i]/255, (this._segmentPoints[i].color.blueOffset - this._startColor.blueOffset)/this._timeLifeData[i]/255, (this._segmentPoints[i].color.alphaOffset - this._startColor.alphaOffset)/this._timeLifeData[i]/255);
				else
					this._offsetData.push((this._segmentPoints[i].color.redOffset - this._segmentPoints[i - 1].color.redOffset)/this._timeLifeData[i]/255, (this._segmentPoints[i].color.greenOffset - this._segmentPoints[i - 1].color.greenOffset)/this._timeLifeData[i]/255, (this._segmentPoints[i].color.blueOffset - this._segmentPoints[i - 1].color.blueOffset)/this._timeLifeData[i]/255, (this._segmentPoints[i].color.alphaOffset - this._segmentPoints[i - 1].color.alphaOffset)/this._timeLifeData[i]/255);
			}
			if (this._numSegmentPoint == 0)
				this._offsetData.push((this._endColor.redOffset - this._startColor.redOffset)/255, (this._endColor.greenOffset - this._startColor.greenOffset)/255, (this._endColor.blueOffset - this._startColor.blueOffset)/255, (this._endColor.alphaOffset - this._startColor.alphaOffset)/255);
			else
				this._offsetData.push((this._endColor.redOffset - this._segmentPoints[i - 1].color.redOffset)/this._timeLifeData[i]/255, (this._endColor.greenOffset - this._segmentPoints[i - 1].color.greenOffset)/this._timeLifeData[i]/255, (this._endColor.blueOffset - this._segmentPoints[i - 1].color.blueOffset)/this._timeLifeData[i]/255, (this._endColor.alphaOffset - this._segmentPoints[i - 1].color.alphaOffset)/this._timeLifeData[i]/255);
		}
		//cut off the data
		this._timeLifeData.length = 4;
	}
}

export default ParticleSegmentedColorState;