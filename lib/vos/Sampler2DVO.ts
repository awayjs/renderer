import Sampler2D					= require("awayjs-core/lib/data/Sampler2D");

import Stage						= require("awayjs-stagegl/lib/base/Stage");

import ShaderBase					= require("awayjs-renderergl/lib/shaders/ShaderBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
import ShaderRegisterData			= require("awayjs-renderergl/lib/shaders/ShaderRegisterData");
import ShaderRegisterElement		= require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");
import SamplerVOBase				= require("awayjs-renderergl/lib/vos/SamplerVOBase");

/**
 *
 * @class away.pool.Sampler2DVO
 */
class Sampler2DVO extends SamplerVOBase
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

	public getFragmentCode(shader:ShaderBase, targetReg:ShaderRegisterElement, regCache:ShaderRegisterCache, inputReg:ShaderRegisterElement):string
	{
		var code:string = "";
		var wrap:string = (shader.repeatTextures? "wrap":"clamp");
		var format:string = this.getFormatString(this.sampler2D);
		var filter:string = (shader.useSmoothTextures)? (shader.useMipmapping? "linear,miplinear" : "linear") : (shader.useMipmapping? "nearest,mipnearest" : "nearest");

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

	public activate(shader:ShaderBase)
	{
		this._stage.getImageObject(this.sampler2D.image2D).activate(this.samplerIndex, this.sampler2D.repeat || shader.repeatTextures, this.sampler2D.smooth || shader.useSmoothTextures, this.sampler2D.mipmap || shader.useMipmapping);

		if (this.sampler2D.imageRect) {
			var index:number = this.fragmentIndex;
			var data:Array<number> = shader.fragmentConstantData;
			data[index] = this.sampler2D.scaleX;
			data[index + 1] = this.sampler2D.scaleY;
			data[index + 2] = this.sampler2D.offsetX;
			data[index + 3] = this.sampler2D.offsetY;
		}
	}
}

export = Sampler2DVO;