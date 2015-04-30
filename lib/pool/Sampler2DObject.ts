import Sampler2D					= require("awayjs-core/lib/data/Sampler2D");

import Stage						= require("awayjs-stagegl/lib/base/Stage");

import ShaderObjectBase				= require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
import ShaderRegisterData			= require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
import ShaderRegisterElement		= require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
import SamplerObjectBase			= require("awayjs-renderergl/lib/pool/SamplerObjectBase");

/**
 *
 * @class away.pool.Sampler2DObject
 */
class Sampler2DObject extends SamplerObjectBase
{
	public sampler2D:Sampler2D;

	public fragmentReg:ShaderRegisterElement;

	public fragmentIndex:number;

	constructor(stage:Stage)
	{
		super(stage);
	}


	public initProperties(sampler2D:Sampler2D, regCache:ShaderRegisterCache)
	{
		this.sampler2D = sampler2D;

		this.samplerReg = regCache.getFreeTextureReg();
		this.samplerIndex = this.samplerReg.index;

		if (this.sampler2D.imageRect) {
			this.fragmentReg = regCache.getFreeFragmentConstant();
			this.fragmentIndex = this.fragmentReg.index*4;
		}
	}

	public getFragmentCode(shaderObject:ShaderObjectBase, targetReg:ShaderRegisterElement, regCache:ShaderRegisterCache, inputReg:ShaderRegisterElement):string
	{
		var code:string = "";
		var wrap:string = (shaderObject.repeatTextures? "wrap":"clamp");
		var format:string = this.getFormatString(this.sampler2D);
		var filter:string = (shaderObject.useSmoothTextures)? (shaderObject.useMipmapping? "linear,miplinear" : "linear") : (shaderObject.useMipmapping? "nearest,mipnearest" : "nearest");

		var temp:ShaderRegisterElement;

		//handles texture atlasing
		if (this.sampler2D.imageRect) {
			temp = regCache.getFreeFragmentVectorTemp();

			code += "mul " + temp + ", " + inputReg + ", " + this.fragmentReg + ".xy\n";
			code += "add " + temp + ", " + temp + ", " + this.fragmentReg + ".zw\n";
		} else {
			temp = inputReg;
		}

		code += "tex " + targetReg + ", " + temp + ", " + this.samplerReg + " <2d," + filter + "," + format + wrap + ">\n";

		return code;
	}

	public activate(shaderObject:ShaderObjectBase)
	{
		this._stage.getImageObject(this.sampler2D.image2D).activate(this.samplerIndex, this.sampler2D.repeat || shaderObject.repeatTextures, this.sampler2D.smooth || shaderObject.useSmoothTextures, this.sampler2D.mipmap || shaderObject.useMipmapping);

		if (this.sampler2D.imageRect) {
			var index:number = this.fragmentIndex;
			var data:Array<number> = shaderObject.fragmentConstantData;
			data[index] = this.sampler2D.scaleX;
			data[index + 1] = this.sampler2D.scaleY;
			data[index + 2] = this.sampler2D.offsetX;
			data[index + 3] = this.sampler2D.offsetY;
		}
	}
}

export = Sampler2DObject;