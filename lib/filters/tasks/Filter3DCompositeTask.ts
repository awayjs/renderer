import Image2D						= require("awayjs-core/lib/image/Image2D");

import Camera						= require("awayjs-display/lib/display/Camera");

import ContextGLProgramType			= require("awayjs-stagegl/lib/base/ContextGLProgramType");
import IContextGL					= require("awayjs-stagegl/lib/base/IContextGL");
import Stage						= require("awayjs-stagegl/lib/base/Stage");
import GL_ImageBase					= require("awayjs-stagegl/lib/image/GL_ImageBase");

import Filter3DTaskBase				= require("awayjs-renderergl/lib/filters/tasks/Filter3DTaskBase");


class Filter3DCompositeTask extends Filter3DTaskBase
{
	private _data:Float32Array;
	private _overlayTexture:Image2D;
	private _overlayWidth:number;
	private _overlayHeight:number;
	private _blendMode:string;
	
	constructor(blendMode:string, exposure:number = 1)
	{
		super();
		this._data = new Float32Array([exposure, 0.5, 2.0, -1, 0.0, 0.0, 0.0, 0.0 ]);
		this._blendMode = blendMode;
	}
	
	public get overlayTexture():Image2D
	{
		return this._overlayTexture;
	}
	
	public set overlayTexture(value:Image2D)
	{
		this._overlayTexture = value;
		this._overlayWidth = this._overlayTexture.width;
		this._overlayHeight = this._overlayTexture.height;
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
			"mul ft1, v0, fc1.zw\n" +
			"add ft1, ft1, fc1.xy\n" +
			"tex ft1, ft1, fs1 <2d,linear,clamp>\n" +
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
		this._data[4] = -0.5*(this._scaledTextureWidth - this._overlayWidth)/this._overlayWidth;
		this._data[5] = -0.5*(this._scaledTextureHeight - this._overlayHeight)/this._overlayHeight;

		this._data[6] = this._scaledTextureWidth/this._overlayWidth;
		this._data[7] = this._scaledTextureHeight/this._overlayHeight;

		var context:IContextGL = stage.context;
		context.setProgramConstantsFromArray(ContextGLProgramType.FRAGMENT, 0, this._data, 2);
		(<GL_ImageBase> stage.getAbstraction(this._overlayTexture)).activate(1, false);
	}
	
	public deactivate(stage:Stage)
	{
		stage.context.setTextureAt(1, null);
	}
}

export = Filter3DCompositeTask;