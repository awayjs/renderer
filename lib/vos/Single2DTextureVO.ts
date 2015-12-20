import AssetEvent					= require("awayjs-core/lib/events/AssetEvent");
import IAssetClass					= require("awayjs-core/lib/library/IAssetClass");
import Sampler2D					= require("awayjs-core/lib/image/Sampler2D");

import MappingMode					= require("awayjs-display/lib/textures/MappingMode");
import Single2DTexture				= require("awayjs-display/lib/textures/Single2DTexture");

import RenderableBase				= require("awayjs-renderergl/lib/renderables/RenderableBase");
import ShaderBase					= require("awayjs-renderergl/lib/shaders/ShaderBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
import ShaderRegisterData			= require("awayjs-renderergl/lib/shaders/ShaderRegisterData");
import ShaderRegisterElement		= require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");
import TextureVOBase				= require("awayjs-renderergl/lib/vos/TextureVOBase");

/**
 *
 * @class away.pool.Single2DTextureVO
 */
class Single2DTextureVO extends TextureVOBase
{
	/**
	 *
	 */
	public static assetClass:IAssetClass = Single2DTexture;

	private _single2DTexture:Single2DTexture;
	private _textureIndex:number;
	private _imageIndex:number;
	private _samplerIndex:number;

	constructor(single2DTexture:Single2DTexture, shader:ShaderBase)
	{
		super(single2DTexture, shader);

		this._single2DTexture = single2DTexture;
	}

	public onClear(event:AssetEvent)
	{
		super.onClear(event);

		this._single2DTexture = null;
	}

	/**
	 *
	 * @param shader
	 * @param regCache
	 * @param targetReg The register in which to store the sampled colour.
	 * @param uvReg The uv coordinate vector with which to sample the texture map.
	 * @returns {string}
	 * @private
	 */
	public _iGetFragmentCode(targetReg:ShaderRegisterElement, regCache:ShaderRegisterCache, sharedReg:ShaderRegisterData, inputReg:ShaderRegisterElement):string
	{
		var code:string = "";
		var wrap:string = (this._shader.repeatTextures? "wrap":"clamp");
		var format:string = this.getFormatString(this._single2DTexture.image2D);
		var filter:string = (this._shader.useSmoothTextures)? (this._shader.useMipmapping? "linear,miplinear" : "linear") : (this._shader.useMipmapping? "nearest,mipnearest" : "nearest");

		var temp:ShaderRegisterElement;

		//modify depending on mapping mode
		if (this._single2DTexture.mappingMode == MappingMode.RADIAL_GRADIENT) {

		}

		//handles texture atlasing
		if (this._shader.useImageRect) {
			var samplerReg:ShaderRegisterElement = regCache.getFreeFragmentConstant();
			this._samplerIndex = samplerReg.index*4;
			temp = regCache.getFreeFragmentVectorTemp();

			code += "mul " + temp + ", " + inputReg + ", " + samplerReg + ".xy\n";
			code += "add " + temp + ", " + temp + ", " + samplerReg + ".zw\n";
		} else {
			temp = inputReg;
		}

		var textureReg:ShaderRegisterElement = this.getTextureReg(this._single2DTexture.image2D, regCache, sharedReg);
		this._textureIndex = textureReg.index;
		this._imageIndex = this._shader.getImageIndex(this._single2DTexture.image2D);
		this._samplerIndex = this._shader.getSamplerIndex(this._single2DTexture, 0);
		code += "tex " + targetReg + ", " + temp + ", " + textureReg + " <2d," + filter + "," + format + wrap + ">\n";

		return code;
	}

	public _setRenderState(renderable:RenderableBase)
	{
		var sampler:Sampler2D = <Sampler2D> renderable.samplers[this._samplerIndex];

		renderable.images[this._imageIndex].activate(this._textureIndex, sampler.repeat || this._shader.repeatTextures, sampler.smooth || this._shader.useSmoothTextures, sampler.mipmap || this._shader.useMipmapping);

		if (this._shader.useImageRect) {
			var index:number = this._samplerIndex;
			var data:Float32Array = this._shader.fragmentConstantData;
			data[index] = sampler.imageRect.width/this._single2DTexture.image2D.width;
			data[index + 1] = sampler.imageRect.height/this._single2DTexture.image2D.height;
			data[index + 2] = sampler.imageRect.x/this._single2DTexture.image2D.width;
			data[index + 3] = sampler.imageRect.y/this._single2DTexture.image2D.height;
		}
	}
}

export = Single2DTextureVO;