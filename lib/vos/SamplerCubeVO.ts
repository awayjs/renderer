import SamplerCube					= require("awayjs-core/lib/data/SamplerCube");

import Stage						= require("awayjs-stagegl/lib/base/Stage");
import ImageCubeObject				= require("awayjs-stagegl/lib/pool/ImageCubeObject");

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
	private _imageObject:ImageCubeObject;
	private _samplerCube:SamplerCube;

	constructor(stage:Stage, samplerCube:SamplerCube)
	{
		super(stage);

		this._samplerCube = samplerCube;
		this._imageObject = this._stage.getImageObject(this._samplerCube.imageCube);
		this._imageObject.usages++;
	}


	public dispose()
	{
		super.dispose();

		this._samplerCube = null

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
	}

	public getFragmentCode(shader:ShaderBase, targetReg:ShaderRegisterElement, regCache:ShaderRegisterCache, inputReg:ShaderRegisterElement):string
	{
		var filter:string;
		var format:string = this.getFormatString(this._samplerCube);
		var filter:string = (shader.useSmoothTextures)? (shader.useMipmapping? "linear,miplinear" : "linear") : (shader.useMipmapping? "nearest,mipnearest" : "nearest");

		return "tex " + targetReg + ", " + inputReg + ", " + this.samplerReg + " <cube," + format + filter + ">\n";
	}

	public activate(shader:ShaderBase)
	{
		this._imageObject.activate(this.samplerIndex, false, this._samplerCube.smooth || shader.useSmoothTextures, this._samplerCube.mipmap || shader.useMipmapping);
	}
}

export = SamplerCubeVO;