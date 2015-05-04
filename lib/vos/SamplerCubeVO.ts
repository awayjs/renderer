import SamplerCube					= require("awayjs-core/lib/data/SamplerCube");

import Stage						= require("awayjs-stagegl/lib/base/Stage");

import ShaderBase					= require("awayjs-renderergl/lib/shaders/ShaderBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
import ShaderRegisterElement		= require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");
import SamplerVOBase				= require("awayjs-renderergl/lib/vos/SamplerVOBase");

/**
 *
 * @class away.pool.BitmapObject
 */
class SamplerCubeVO extends SamplerVOBase
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

	public getFragmentCode(shader:ShaderBase, targetReg:ShaderRegisterElement, regCache:ShaderRegisterCache, inputReg:ShaderRegisterElement):string
	{
		var filter:string;
		var format:string = this.getFormatString(this.samplerCube);
		var filter:string = (shader.useSmoothTextures)? (shader.useMipmapping? "linear,miplinear" : "linear") : (shader.useMipmapping? "nearest,mipnearest" : "nearest");

		return "tex " + targetReg + ", " + inputReg + ", " + this.samplerReg + " <cube," + format + filter + ">\n";
	}

	public activate(shader:ShaderBase)
	{
		this._stage.getImageObject(this.samplerCube.imageCube).activate(this.samplerIndex, false, this.samplerCube.smooth || shader.useSmoothTextures, this.samplerCube.mipmap || shader.useMipmapping);
	}
}

export = SamplerCubeVO;