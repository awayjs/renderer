import {Image2D}						from "@awayjs/core/lib/image/Image2D";

import {Camera}						from "@awayjs/display/lib/display/Camera";

import {ContextGLProgramType}			from "@awayjs/stage/lib/base/ContextGLProgramType";
import {Stage}						from "@awayjs/stage/lib/base/Stage";

import {Filter3DTaskBase}				from "../../filters/tasks/Filter3DTaskBase";

export class Filter3DFXAATask extends Filter3DTaskBase
{
	private _data:Float32Array;
	//TODO - remove blur variables and create setters/getters for FXAA
	private static MAX_AUTO_SAMPLES:number = 15;
	private _amount:number;
	private _stepSize:number = 1;
	private _realStepSize:number;
	
	/**
	 *
	 * @param amount
	 * @param stepSize The distance between samples. Set to -1 to autodetect with acceptable quality.
	 */
	constructor(amount:number = 1, stepSize:number = -1)
	{
		super();

		this._data =  new Float32Array(20);
		//luma
		this._data.set([0.299, 0.587, 0.114, 0],0);//0.212, 0.716, 0.072
		//helpers
		this._data.set([0.25, 0.5, 0.75, 1], 4);
		//settings (screen x, screen y, ...)
		this._data.set([1/1024, 1/1024, -1, 1], 8);
		//deltas
		this._data.set([1/128, 1/8, 8, 0], 12);
		//deltas
		this._data.set([1.0/3.0 - 0.5, 2.0/3.0 - 0.5, 0.0/3.0 - 0.5, 3.0/3.0 - 0.5], 16);


		this.amount = amount;
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
		var lum:string = "fc0";		//	0.299, 0.587, 0.114
		var _0:string = "fc0.w";

		var _025:string = "fc1.x";
		var _05:string = "fc1.y";
		var _075:string = "fc1.z";
		var _1:string = "fc1.w";

		var pix:string = "fc2.xy";
		var dx:string = "fc2.x"; // 1/1024
		var dy:string = "fc2.y"; // 1/1024

		var mOne:string = "fc2.z"; // -1.0
		var mul:string = "fc2.w"; // 1.0  -- one for now

		var fxaaReduceMin :string = "fc3.x";	//1/128
		var fxaaReduceMul :string = "fc3.y";	//1/8
		var fxaaSpanMax :string = "fc3.z";		//8

		var delta1:string = "fc4.x";	//1.0/3.0 - 0.5
		var delta2:string = "fc4.y";	//2.0/3.0 - 0.5
		var delta3:string = "fc4.z";	//0.0/3.0 - 0.5
		var delta4:string = "fc4.w";	//3.0/3.0 - 0.5

		var uv_in:string = "v0";

		var uv:string = "ft0.xy";
		var uvx:string = "ft0.x";
		var uvy:string = "ft0.y";

		var TL:string = "ft2.x";
		var TR:string = "ft2.y";
		var BL:string = "ft2.z";
		var BR:string = "ft2.w";
		var M:string = "ft3.x";

		var tempf1:string = "ft3.y";
		var tempf2:string = "ft3.z";
		var tempf3:string = "ft3.w";

		var tex:string = "ft1";

		var dir:string = "ft4";
		var dirx:string = "ft4.x";
		var diry:string = "ft4.y";
		var dirxy:string = "ft4.xy";

		var dirReduce:string = "ft5.x";
		var inverseDirAdjustment:string = "ft5.y";

		var result1:string = "ft6";
		var result2:string = "ft7";

		var lumaMin:string = "ft5.x";
		var lumaMax:string = "ft5.y";

		var sample:string = "fs0";


		var temp:string = tex;
		var tempxy:string = temp + ".xy";
		
		var code:Array<string> =  new Array<string>();

		//lumas
		code.push("tex", tex, uv_in, sample, "<2d wrap linear>", "\n");
		code.push("dp3", M, tex, lum, "\n");
		code.push("mov", uv, uv_in, "\n");
		code.push("sub", uv, uv, pix, "\n");
		code.push("tex", tex, uv, sample, "<2d wrap linear>", "\n");
		code.push("dp3", TL, tex, lum, "\n");
		code.push("mov", uv, uv_in, "\n");
		code.push("add", uv, uv, pix, "\n");
		code.push("tex", tex, uv, sample, "<2d wrap linear>", "\n");
		code.push("dp3",  BR, tex, lum, "\n");
		code.push("mov", uv, uv_in, "\n");
		code.push("sub", uvy, uvy, dy, "\n");
		code.push("add", uvx, uvx, dx, "\n");
		code.push("tex", tex, uv, sample, "<2d wrap linear>", "\n");
		code.push("dp3", TR, tex, lum, "\n");
		code.push("mov", uv, uv_in, "\n");
		code.push("add", uvy, uvy, dy, "\n");
		code.push("sub", uvx, uvx, dx, "\n");
		code.push("tex", tex, uv, sample, "<2d wrap linear>", "\n");
		code.push("dp3", BL, tex, lum, "\n");

		//dir
		code.push("add", tempf1, TL, TR, "\n");
		code.push("add", tempf2, BL, BR, "\n");
		code.push("sub", dirx, tempf1, tempf2, "\n");
		code.push("neg", dirx, dirx, "\n");

		code.push("add", tempf1, TL, BL, "\n");
		code.push("add", tempf2, TR, BR, "\n");
		code.push("sub", diry, tempf1, tempf2, "\n");

		code.push("add", tempf1, tempf1, tempf2, "\n");
		code.push("mul", tempf1, tempf1, fxaaReduceMul, "\n");
		code.push("mul", tempf1, tempf1, _025, "\n");
		code.push("max", dirReduce, tempf1, fxaaReduceMin, "\n");

		code.push("abs", tempf1, dirx, "\n");
		code.push("abs", tempf2, diry, "\n");
		code.push("min", tempf1, tempf1, tempf2, "\n");
		code.push("add", tempf1, tempf1, dirReduce, "\n");
		code.push("rcp", inverseDirAdjustment, tempf1, "\n");

		code.push("mul", tempf1, dirx, inverseDirAdjustment, "\n");
		code.push("mov", tempf2, fxaaSpanMax, "\n");
		code.push("neg", tempf2, tempf2, "\n");
		code.push("max", tempf1, tempf1, tempf2, "\n");
		code.push("min", tempf1, fxaaSpanMax, tempf1, "\n");
		code.push("mul", dirx, tempf1, dx, "\n");

		code.push("mul", tempf1, diry, inverseDirAdjustment, "\n");
		code.push("mov", tempf2, fxaaSpanMax, "\n");
		code.push("neg", tempf2, tempf2, "\n");
		code.push("max", tempf1, tempf1, tempf2, "\n");
		code.push("min", tempf1, fxaaSpanMax, tempf1, "\n");
		code.push("mul", diry, tempf1, dy, "\n");


		code.push("mul", tempxy, dirxy, delta1, "\n");
		code.push("add", uv, uv_in, tempxy, "\n");
		code.push("tex", result1, uv, sample, "<2d wrap linear>", "\n");
		code.push("mul", tempxy, dirxy, delta2, "\n");
		code.push("add", uv, uv_in, tempxy, "\n");
		code.push("tex", tex, uv, sample, "<2d wrap linear>", "\n");
		code.push("add", result1, result1, tex, "\n");
		code.push("mul", result1, result1, _05, "\n");

		code.push("mul", tempxy, dirxy, delta3, "\n");
		code.push("add", uv, uv_in, tempxy, "\n");
		code.push("tex", result2, uv, sample, "<2d wrap linear>", "\n");
		code.push("mul", tempxy, dirxy, delta4, "\n");
		code.push("add", uv, uv_in, tempxy, "\n");
		code.push("tex", tex, uv, sample, "<2d wrap linear>", "\n");
		code.push("add", result2, result2, tex, "\n");
		code.push("mul", result2, result2, _025, "\n");
		code.push("mul", tex, result1, _05, "\n");
		code.push("add", result2, result2, tex, "\n");

		code.push("min", tempf1, BL, BR, "\n");
		code.push("min", tempf2, TL, TR, "\n");
		code.push("min", tempf1, tempf1, tempf2, "\n");
		code.push("min", lumaMin, tempf1, M, "\n");

		code.push("max", tempf1, BL, BR, "\n");
		code.push("max", tempf2, TL, TR, "\n");
		code.push("max", tempf1, tempf1, tempf2, "\n");
		code.push("max", lumaMax, tempf1, M, "\n");

		code.push("dp3", tempf1, lum, result2, "\n");

		code.push("slt", tempf2, tempf1, lumaMin, "\n");
		code.push("sge", tempf3, tempf1, lumaMax, "\n");
		code.push("mul", tempf2, tempf2, tempf3, "\n");

		code.push("mul", result1, result1, tempf2, "\n");
		code.push("sub", tempf2, _1, tempf2, "\n");
		code.push("mul", result2, result2, tempf2, "\n");

		code.push("add", "oc", result1, result2, "\n");

		//this._data[2] = 1/numSamples;

		return code.join(" ");
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
		if (this._rttManager) {
			this._data[8] = 1/this._textureWidth;
			this._data[9] = 1/this._textureHeight;
			//this._data[8] = 1/this._rttManager.viewWidth;
			//this._data[9] = 1/this._rttManager.viewHeight;
		}
	}

	private calculateStepSize():void
	{
		this._realStepSize = 1;//this._stepSize > 0? this._stepSize : this._amount > Filter3DVBlurTask.MAX_AUTO_SAMPLES? this._amount/Filter3DVBlurTask.MAX_AUTO_SAMPLES : 1;
	}
}