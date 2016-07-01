import {ColorTransform}					from "@awayjs/core/lib/geom/ColorTransform";

import {ParticleAnimationSet}				from "../../animators/ParticleAnimationSet";
import {AnimationRegisterData}			from "../../animators/data/AnimationRegisterData";
import {ColorSegmentPoint}				from "../../animators/data/ColorSegmentPoint";
import {ParticlePropertiesMode}			from "../../animators/data/ParticlePropertiesMode";
import {ParticleNodeBase}					from "../../animators/nodes/ParticleNodeBase";
import {ParticleSegmentedColorState}		from "../../animators/states/ParticleSegmentedColorState";
import {ShaderBase}						from "../../shaders/ShaderBase";
import {ShaderRegisterCache}				from "../../shaders/ShaderRegisterCache";
import {ShaderRegisterElement}			from "../../shaders/ShaderRegisterElement";

/**
 *
 */
export class ParticleSegmentedColorNode extends ParticleNodeBase
{
	/** @private */
	public _iUsesMultiplier:boolean;
	/** @private */
	public _iUsesOffset:boolean;
	/** @private */
	public _iStartColor:ColorTransform;
	/** @private */
	public _iEndColor:ColorTransform;
	/** @private */
	public _iNumSegmentPoint:number;
	/** @private */
	public _iSegmentPoints:Array<ColorSegmentPoint>;

	constructor(usesMultiplier:boolean, usesOffset:boolean, numSegmentPoint:number, startColor:ColorTransform, endColor:ColorTransform, segmentPoints:Array<ColorSegmentPoint>)
	{
		//because of the stage3d register limitation, it only support the global mode
		super("ParticleSegmentedColor", ParticlePropertiesMode.GLOBAL, 0, ParticleAnimationSet.COLOR_PRIORITY);

		this._pStateClass = ParticleSegmentedColorState;

		if (numSegmentPoint > 4)
			throw(new Error("the numSegmentPoint must be less or equal 4"));
		this._iUsesMultiplier = usesMultiplier;
		this._iUsesOffset = usesOffset;
		this._iNumSegmentPoint = numSegmentPoint;
		this._iStartColor = startColor;
		this._iEndColor = endColor;
		this._iSegmentPoints = segmentPoints;
	}

	/**
	 * @inheritDoc
	 */
	public _iProcessAnimationSetting(particleAnimationSet:ParticleAnimationSet):void
	{
		if (this._iUsesMultiplier)
			particleAnimationSet.hasColorMulNode = true;
		if (this._iUsesOffset)
			particleAnimationSet.hasColorAddNode = true;
	}

	/**
	 * @inheritDoc
	 */
	public getAGALVertexCode(shader:ShaderBase, animationSet:ParticleAnimationSet, registerCache:ShaderRegisterCache, animationRegisterData:AnimationRegisterData):string
	{
		var code:string = "";
		if (shader.usesFragmentAnimation) {
			var accMultiplierColor:ShaderRegisterElement;
			//var accOffsetColor:ShaderRegisterElement;
			if (this._iUsesMultiplier) {
				accMultiplierColor = registerCache.getFreeVertexVectorTemp();
				registerCache.addVertexTempUsages(accMultiplierColor, 1);
			}

			var tempColor:ShaderRegisterElement = registerCache.getFreeVertexVectorTemp();
			registerCache.addVertexTempUsages(tempColor, 1);

			var temp:ShaderRegisterElement = registerCache.getFreeVertexVectorTemp();
			var accTime:ShaderRegisterElement = new ShaderRegisterElement(temp.regName, temp.index, 0);
			var tempTime:ShaderRegisterElement = new ShaderRegisterElement(temp.regName, temp.index, 1);

			if (this._iUsesMultiplier)
				registerCache.removeVertexTempUsage(accMultiplierColor);

			registerCache.removeVertexTempUsage(tempColor);

			//for saving all the life values (at most 4)
			var lifeTimeRegister:ShaderRegisterElement = registerCache.getFreeVertexConstant();
			animationRegisterData.setRegisterIndex(this, ParticleSegmentedColorState.TIME_DATA_INDEX, lifeTimeRegister.index);

			var i:number;

			var startMulValue:ShaderRegisterElement;
			var deltaMulValues:Array<ShaderRegisterElement>;
			if (this._iUsesMultiplier) {
				startMulValue = registerCache.getFreeVertexConstant();
				animationRegisterData.setRegisterIndex(this, ParticleSegmentedColorState.START_MULTIPLIER_INDEX, startMulValue.index);
				deltaMulValues = new Array<ShaderRegisterElement>();
				for (i = 0; i < this._iNumSegmentPoint + 1; i++)
					deltaMulValues.push(registerCache.getFreeVertexConstant());
			}

			var startOffsetValue:ShaderRegisterElement;
			var deltaOffsetValues:Array<ShaderRegisterElement>;
			if (this._iUsesOffset) {
				startOffsetValue = registerCache.getFreeVertexConstant();
				animationRegisterData.setRegisterIndex(this, ParticleSegmentedColorState.START_OFFSET_INDEX, startOffsetValue.index);
				deltaOffsetValues = new Array<ShaderRegisterElement>();
				for (i = 0; i < this._iNumSegmentPoint + 1; i++)
					deltaOffsetValues.push(registerCache.getFreeVertexConstant());
			}

			if (this._iUsesMultiplier)
				code += "mov " + accMultiplierColor + "," + startMulValue + "\n";
			if (this._iUsesOffset)
				code += "add " + animationRegisterData.colorAddTarget + "," + animationRegisterData.colorAddTarget + "," + startOffsetValue + "\n";

			for (i = 0; i < this._iNumSegmentPoint; i++) {
				switch (i) {
					case 0:
						code += "min " + tempTime + "," + animationRegisterData.vertexLife + "," + lifeTimeRegister + ".x\n";
						break;
					case 1:
						code += "sub " + accTime + "," + animationRegisterData.vertexLife + "," + lifeTimeRegister + ".x\n";
						code += "max " + tempTime + "," + accTime + "," + animationRegisterData.vertexZeroConst + "\n";
						code += "min " + tempTime + "," + tempTime + "," + lifeTimeRegister + ".y\n";
						break;
					case 2:
						code += "sub " + accTime + "," + accTime + "," + lifeTimeRegister + ".y\n";
						code += "max " + tempTime + "," + accTime + "," + animationRegisterData.vertexZeroConst + "\n";
						code += "min " + tempTime + "," + tempTime + "," + lifeTimeRegister + ".z\n";
						break;
					case 3:
						code += "sub " + accTime + "," + accTime + "," + lifeTimeRegister + ".z\n";
						code += "max " + tempTime + "," + accTime + "," + animationRegisterData.vertexZeroConst + "\n";
						code += "min " + tempTime + "," + tempTime + "," + lifeTimeRegister + ".w\n";
						break;
				}
				if (this._iUsesMultiplier) {
					code += "mul " + tempColor + "," + tempTime + "," + deltaMulValues[i] + "\n";
					code += "add " + accMultiplierColor + "," + accMultiplierColor + "," + tempColor + "\n";
				}
				if (this._iUsesOffset) {
					code += "mul " + tempColor + "," + tempTime + "," + deltaOffsetValues[i] + "\n";
					code += "add " + animationRegisterData.colorAddTarget + "," + animationRegisterData.colorAddTarget + "," + tempColor + "\n";
				}
			}

			//for the last segment:
			if (this._iNumSegmentPoint == 0)
				tempTime = animationRegisterData.vertexLife;
			else {
				switch (this._iNumSegmentPoint) {
					case 1:
						code += "sub " + accTime + "," + animationRegisterData.vertexLife + "," + lifeTimeRegister + ".x\n";
						break;
					case 2:
						code += "sub " + accTime + "," + accTime + "," + lifeTimeRegister + ".y\n";
						break;
					case 3:
						code += "sub " + accTime + "," + accTime + "," + lifeTimeRegister + ".z\n";
						break;
					case 4:
						code += "sub " + accTime + "," + accTime + "," + lifeTimeRegister + ".w\n";
						break;
				}
				code += "max " + tempTime + "," + accTime + "," + animationRegisterData.vertexZeroConst + "\n";
			}
			if (this._iUsesMultiplier) {
				code += "mul " + tempColor + "," + tempTime + "," + deltaMulValues[this._iNumSegmentPoint] + "\n";
				code += "add " + accMultiplierColor + "," + accMultiplierColor + "," + tempColor + "\n";
				code += "mul " + animationRegisterData.colorMulTarget + "," + animationRegisterData.colorMulTarget + "," + accMultiplierColor + "\n";
			}
			if (this._iUsesOffset) {
				code += "mul " + tempColor + "," + tempTime + "," + deltaOffsetValues[this._iNumSegmentPoint] + "\n";
				code += "add " + animationRegisterData.colorAddTarget + "," + animationRegisterData.colorAddTarget + "," + tempColor + "\n";
			}

		}
		return code;
	}

}