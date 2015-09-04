import Sampler2D					= require("awayjs-core/lib/data/Sampler2D");

import Stage						= require("awayjs-stagegl/lib/base/Stage");
import Image2DObject				= require("awayjs-stagegl/lib/pool/Image2DObject");

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
	private _imageObject:Image2DObject;
	private _sampler2D:Sampler2D;
	private _fragmentReg:ShaderRegisterElement;
	private _fragmentIndex:number;

	constructor(stage:Stage, sampler2D:Sampler2D)
	{
		super(stage);

		this._sampler2D = sampler2D;
		this._imageObject = this._stage.getImageObject(this._sampler2D.image2D);
		this._imageObject.usages++;
	}

	public dispose()
	{
		super.dispose();

		this._sampler2D = null;

		this._imageObject.usages--;

		if (!this._imageObject.usages) {
			this._imageObject.dispose();
			this._imageObject = null;
		}
	}

	public initProperties(regCache:ShaderRegisterCache)
	{
		this.samplerReg = regCache.getFreeTextureReg();
		this.samplerIndex = this.samplerReg.index;

		if (this._sampler2D.imageRect) {
			this._fragmentReg = regCache.getFreeFragmentConstant();
			this._fragmentIndex = this._fragmentReg.index*4;
		}
	}

	public getFragmentCode(shader:ShaderBase, targetReg:ShaderRegisterElement, regCache:ShaderRegisterCache, inputReg:ShaderRegisterElement):string
	{
		var code:string = "";
		var wrap:string = (shader.repeatTextures? "wrap":"clamp");
		var format:string = this.getFormatString(this._sampler2D);
		var filter:string = (shader.useSmoothTextures)? (shader.useMipmapping? "linear,miplinear" : "linear") : (shader.useMipmapping? "nearest,mipnearest" : "nearest");

		var temp:ShaderRegisterElement;

		//handles texture atlasing
		if (this._sampler2D.imageRect) {
			temp = regCache.getFreeFragmentVectorTemp();

			code += "mul " + temp + ", " + inputReg + ", " + this._fragmentReg + ".xy\n";
			code += "add " + temp + ", " + temp + ", " + this._fragmentReg + ".zw\n";
		} else {
			temp = inputReg;
		}

		code += "tex " + targetReg + ", " + temp + ", " + this.samplerReg + " <2d," + filter + "," + format + wrap + ">\n";

		return code;
	}

	public activate(shader:ShaderBase)
	{
		this._imageObject.activate(this.samplerIndex, this._sampler2D.repeat || shader.repeatTextures, this._sampler2D.smooth || shader.useSmoothTextures, this._sampler2D.mipmap || shader.useMipmapping);

		if (this._sampler2D.imageRect) {
			var index:number = this._fragmentIndex;
			var data:Float32Array = shader.fragmentConstantData;
			data[index] = this._sampler2D.scaleX;
			data[index + 1] = this._sampler2D.scaleY;
			data[index + 2] = this._sampler2D.offsetX;
			data[index + 3] = this._sampler2D.offsetY;
		}
	}
}

export = Sampler2DVO;