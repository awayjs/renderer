import Image2D						= require("awayjs-core/lib/data/Image2D");

import Camera						= require("awayjs-display/lib/entities/Camera");

import ContextGLProgramType			= require("awayjs-stagegl/lib/base/ContextGLProgramType");
import IContextGL					= require("awayjs-stagegl/lib/base/IContextGL");
import Stage						= require("awayjs-stagegl/lib/base/Stage");

import Filter3DTaskBase				= require("awayjs-renderergl/lib/filters/tasks/Filter3DTaskBase");


class Filter3DCompositeTask extends Filter3DTaskBase
{
	private _data:Float32Array;
	private _overlayTexture:Image2D;
	private _blendMode:string;
	
	constructor(blendMode:string, exposure:number = 1)
	{
		super();
		this._data = new Float32Array([exposure, 0.5, 2.0, -1 ]);
		this._blendMode = blendMode;
	}
	
	public get overlayTexture():Image2D
	{
		return this._overlayTexture;
	}
	
	public set overlayTexture(value:Image2D)
	{
		this._overlayTexture = value;
	}
	
	public get exposure():number
	{
		return this._data[0];
	}
	
	public set exposure(value:number)
	{
		this._data[0] = value;
	}
	
	public getFragmentCode():string
	{

		var code:string;
		var op:string;
		code = "tex ft0, v0, fs0 <2d,linear,clamp>\n" +
			"tex ft1, v0, fs1 <2d,linear,clamp>\n" +
			"mul ft1, ft1, fc0.xxx\n" +
			"add ft1, ft1, fc0.xxx\n";
		switch (this._blendMode) {
			case "multiply":
				code += "mul oc, ft0, ft1\n";
				break;
			case "add":
				code += "add oc, ft0, ft1\n";
				break;
			case "subtract":
				code += "sub oc, ft0, ft1\n";
				break;
			case "overlay":
				code += "sge ft2, ft0, fc0.yyy\n"; // t2 = (blend >= 0.5)? 1 : 0
				code += "sub ft0, ft2, ft0\n"; // base = (1 : 0 - base)
				code += "sub ft1, ft1, ft2\n"; // blend = (blend - 1 : 0)
				code += "mul ft1, ft1, ft0\n"; // blend = blend * base
				code += "sub ft3, ft2, fc0.yyy\n"; // t3 = (blend >= 0.5)? 0.5 : -0.5
				code += "div ft1, ft1, ft3\n"; // blend = blend / ( 0.5 : -0.5)
				code += "add oc, ft1, ft2\n";
				break;
			case "normal":
				// for debugging purposes
				code += "mov oc, ft0\n";
				break;
			default:
				throw new Error("Unknown blend mode");
		}
		return code;
	}
	
	public activate(stage:Stage, camera3D:Camera, depthTexture:Image2D)
	{
		var context:IContextGL = stage.context;
		context.setProgramConstantsFromArray(ContextGLProgramType.FRAGMENT, 0, this._data, 1);
		stage.getImageObject(this._overlayTexture).activate(1, false, true, false);
	}
	
	public deactivate(stage:Stage)
	{
		stage.context.setTextureAt(1, null);
	}
}

export = Filter3DCompositeTask;