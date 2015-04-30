import SamplerCube					= require("awayjs-core/lib/data/SamplerCube");

import Stage						= require("awayjs-stagegl/lib/base/Stage");

import ShaderObjectBase				= require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
import ShaderRegisterElement		= require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
import SamplerObjectBase			= require("awayjs-renderergl/lib/pool/SamplerObjectBase");

/**
 *
 * @class away.pool.BitmapObject
 */
class SamplerCubeObject extends SamplerObjectBase
{
	public samplerCube:SamplerCube;

	constructor(stage:Stage)
	{
		super(stage);
	}

	public initProperties(samplerCube:SamplerCube, regCache:ShaderRegisterCache)
	{
		this.samplerCube = samplerCube;

		this.samplerReg = regCache.getFreeTextureReg();

		this.samplerIndex = this.samplerReg.index;
	}

	public getFragmentCode(shaderObject:ShaderObjectBase, targetReg:ShaderRegisterElement, regCache:ShaderRegisterCache, inputReg:ShaderRegisterElement):string
	{
		var filter:string;
		var format:string = this.getFormatString(this.samplerCube);
		var filter:string = (shaderObject.useSmoothTextures)? (shaderObject.useMipmapping? "linear,miplinear" : "linear") : (shaderObject.useMipmapping? "nearest,mipnearest" : "nearest");

		return "tex " + targetReg + ", " + inputReg + ", " + this.samplerReg + " <cube," + format + filter + ">\n";
	}

	public activate(shaderObject:ShaderObjectBase)
	{
		this._stage.getImageObject(this.samplerCube.imageCube).activate(this.samplerIndex, false, this.samplerCube.smooth || shaderObject.useSmoothTextures, this.samplerCube.mipmap || shaderObject.useMipmapping);
	}
}

export = SamplerCubeObject;