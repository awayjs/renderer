import {Image2D}						from "@awayjs/core/lib/image/Image2D";

import {Camera}						from "@awayjs/display/lib/display/Camera";

import {ContextGLProgramType}			from "@awayjs/stage/lib/base/ContextGLProgramType";
import {Stage}						from "@awayjs/stage/lib/base/Stage";

import {Filter3DTaskBase}				from "../../filters/tasks/Filter3DTaskBase";

export class Filter3DVBlurTask extends Filter3DTaskBase
{
	private static MAX_AUTO_SAMPLES:number = 15;
	private _amount:number;
	private _data:Float32Array;
	private _stepSize:number = 1;
	private _realStepSize:number;
	
	/**
	 *
	 * @param amount
	 * @param stepSize The distance between samples. Set to -1 to autodetect with acceptable quality.
	 */
	constructor(amount:number, stepSize:number = -1)
	{
		super();
		this._amount = amount;
		this._data =  new Float32Array([0, 0, 0, 1]);
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
		var code:string;
		var numSamples:number = 1;

		code = "mov ft0, v0	\n" +
			"sub ft0.y, v0.y, fc0.x\n";

		code += "tex ft1, ft0, fs0 <2d,linear,clamp>\n";

		for (var x:number = this._realStepSize; x <= this._amount; x += this._realStepSize) {
			code += "add ft0.y, ft0.y, fc0.y\n";
			code += "tex ft2, ft0, fs0 <2d,linear,clamp>\n" +
				"add ft1, ft1, ft2\n";
			++numSamples;
		}

		code += "mul oc, ft1, fc0.z\n";

		this._data[2] = 1/numSamples;

		return code;
	}

	public activate(stage:Stage, camera3D:Camera, depthTexture:Image2D):void
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
		var invH:number = 1/this._textureHeight;

		this._data[0] = this._amount*.5*invH;
		this._data[1] = this._realStepSize*invH;
	}

	private calculateStepSize():void
	{
		this._realStepSize = this._stepSize > 0? this._stepSize : this._amount > Filter3DVBlurTask.MAX_AUTO_SAMPLES? this._amount/Filter3DVBlurTask.MAX_AUTO_SAMPLES : 1;
	}
}