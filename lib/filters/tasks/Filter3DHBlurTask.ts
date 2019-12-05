import {ProjectionBase} from "@awayjs/core";

import {ContextGLProgramType, Stage, Image2D, ShaderRegisterElement} from "@awayjs/stage";

import {Filter3DTaskBase} from "./Filter3DTaskBase";

export class Filter3DHBlurTask extends Filter3DTaskBase
{
	private static MAX_AUTO_SAMPLES:number = 15;
	private _amount:number;
	private _data:Float32Array;
	private _stepSize:number = 1;
	private _realStepSize:number;
	private _blurIndex:number;

	/**
	 * Creates a new Filter3DHDepthOfFFieldTask
	 * @param amount The maximum amount of blur to apply in pixels at the most out-of-focus areas
	 * @param stepSize The distance between samples. Set to -1 to autodetect with acceptable quality.
	 */
	constructor(amount:number, stepSize:number = -1)
	{
		super();
		this._amount = amount;
		this._data = new Float32Array([0, 0, 0, 1]);
		this.stepSize = stepSize;
	}

	public get amount():number
	{
		return this._amount;
	}

	public set amount(value:number)
	{
		if (this._amount == value)
			return;

		this._amount = value;

		this.invalidateProgram();
		this.updateBlurData();
		this.calculateStepSize();
	}

	public get stepSize():number
	{
		return this._stepSize;
	}

	public set stepSize(value:number)
	{
		if (this._stepSize == value)
			return;

		this._stepSize = value;
		this.calculateStepSize();
		this.invalidateProgram();
		this.updateBlurData();
	}

	public getFragmentCode():string
	{
		var temp1:ShaderRegisterElement = this._registerCache.getFreeFragmentVectorTemp();
		this._registerCache.addFragmentTempUsages(temp1, 1);
		var temp2:ShaderRegisterElement = this._registerCache.getFreeFragmentVectorTemp();
		this._registerCache.addFragmentTempUsages(temp2, 1);
		var temp3:ShaderRegisterElement = this._registerCache.getFreeFragmentVectorTemp();
		this._registerCache.addFragmentTempUsages(temp3, 1);


		var inputTexture:ShaderRegisterElement = this._registerCache.getFreeTextureReg();
		this._inputTextureIndex = inputTexture.index;

				
		var blur:ShaderRegisterElement = this._registerCache.getFreeFragmentConstant();
		this._blurIndex = blur.index*4;

		var code:string;
		var numSamples:number = 1;

		code = "mov " + temp1 + ", " + this._uvVarying + "\n" +
			"sub " + temp1 + ".x, " + this._uvVarying + ".x, " + blur + ".x\n";

		code += "tex " + temp2 + ", " + temp1 + ", " + inputTexture + " <2d,linear,clamp>\n";

		for (var x:number = this._realStepSize; x <= this._amount; x += this._realStepSize) {
			code += "add " + temp1 + ".x, " + temp1 + ".x, " + blur + ".y\n" +
				"tex " + temp3 + ", " + temp1 + ", " + inputTexture + " <2d,linear,clamp>\n" +
				"add " + temp2 + ", " + temp2 + ", " + temp3 + "\n";
			++numSamples;
		}

		code += "mul oc, " + temp2 + ", " + blur + ".z\n";

		this._data[2] = 1/numSamples;

		return code;
	}

	public activate(stage:Stage, projection:ProjectionBase, depthTexture:Image2D):void
	{
		stage.context.setProgramConstantsFromArray(ContextGLProgramType.FRAGMENT, this._data);
	}

	public updateTextures(stage:Stage):void
	{
		super.updateTextures(stage);

		this.updateBlurData();
	}

	private updateBlurData():void
	{
		// todo: must be normalized using view size ratio instead of texture
		var invW:number = 1/this._textureWidth;

		this._data[0] = this._amount*.5*invW;
		this._data[1] = this._realStepSize*invW;
	}

	private calculateStepSize():void
	{
		this._realStepSize = this._stepSize > 0? this._stepSize : this._amount > Filter3DHBlurTask.MAX_AUTO_SAMPLES? this._amount/Filter3DHBlurTask.MAX_AUTO_SAMPLES : 1;
	}
}