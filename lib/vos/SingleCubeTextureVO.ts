import AssetEvent					= require("awayjs-core/lib/events/AssetEvent");
import SamplerCube					= require("awayjs-core/lib/image/SamplerCube");

import SingleCubeTexture			= require("awayjs-display/lib/textures/SingleCubeTexture");

import RenderableBase				= require("awayjs-renderergl/lib/renderables/RenderableBase");

import ShaderBase					= require("awayjs-renderergl/lib/shaders/ShaderBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
import ShaderRegisterData			= require("awayjs-renderergl/lib/shaders/ShaderRegisterData");
import ShaderRegisterElement		= require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");
import TextureVOBase				= require("awayjs-renderergl/lib/vos/TextureVOBase");

/**
 *
 * @class away.pool.TextureDataBase
 */
class SingleCubeTextureVO extends TextureVOBase
{
	private _singleCubeTexture:SingleCubeTexture;
	private _textureIndex:number;
	private _imageIndex:number;
	private _samplerIndex:number;

	constructor(singleCubeTexture:SingleCubeTexture, shader:ShaderBase)
	{
		super(singleCubeTexture, shader);

		this._singleCubeTexture = singleCubeTexture;
	}


	public onClear(event:AssetEvent)
	{
		super.onClear(event);

		this._singleCubeTexture = null;
	}

	public _iIncludeDependencies(includeInput:boolean = true)
	{
		if (includeInput)
			this._shader.usesLocalPosFragment = true;
	}

	/**
	 *
	 * @param shader
	 * @param regCache
	 * @param targetReg The register in which to store the sampled colour.
	 * @param uvReg The direction vector with which to sample the cube map.
	 * @returns {string}
	 * @private
	 */
	public _iGetFragmentCode(targetReg:ShaderRegisterElement, regCache:ShaderRegisterCache, sharedReg:ShaderRegisterData, inputReg:ShaderRegisterElement):string
	{
		var filter:string;
		var format:string = this.getFormatString(this._singleCubeTexture.imageCube);
		var filter:string = (this._shader.useSmoothTextures)? (this._shader.useMipmapping? "linear,miplinear" : "linear") : (this._shader.useMipmapping? "nearest,mipnearest" : "nearest");

		var textureReg:ShaderRegisterElement = this.getTextureReg(this._singleCubeTexture.imageCube, regCache, sharedReg);
		this._textureIndex = textureReg.index;
		this._imageIndex = this._shader.getImageIndex(this._singleCubeTexture.imageCube);
		this._samplerIndex = this._shader.getSamplerIndex(this._singleCubeTexture, 0);

		return "tex " + targetReg + ", " + inputReg + ", " + textureReg + " <cube," + format + filter + ">\n";
	}

	public _setRenderState(renderable:RenderableBase)
	{
		var sampler:SamplerCube = <SamplerCube> renderable.samplers[this._samplerIndex];

		renderable.images[this._imageIndex].activate(this._textureIndex, false, sampler.smooth || this._shader.useSmoothTextures, sampler.mipmap || this._shader.useMipmapping);
	}
}

export = SingleCubeTextureVO;