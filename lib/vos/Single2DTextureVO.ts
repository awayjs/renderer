import IAssetClass					= require("awayjs-core/lib/library/IAssetClass");
import Sampler2D					= require("awayjs-core/lib/data/Sampler2D");

import Stage						= require("awayjs-stagegl/lib/base/Stage");

import Single2DTexture				= require("awayjs-display/lib/textures/Single2DTexture");

import RenderableBase				= require("awayjs-renderergl/lib/renderables/RenderableBase");
import ShaderBase					= require("awayjs-renderergl/lib/shaders/ShaderBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
import ShaderRegisterData			= require("awayjs-renderergl/lib/shaders/ShaderRegisterData");
import ShaderRegisterElement		= require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");
import TextureVOPool				= require("awayjs-renderergl/lib/vos/TextureVOPool");
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
	private _samplerIndex:number;
	private _textureIndex:number;


	constructor(pool:TextureVOPool, single2DTexture:Single2DTexture, shader:ShaderBase, stage:Stage)
	{
		super(pool, single2DTexture, shader, stage);

		this._single2DTexture = single2DTexture;
	}

	public dispose()
	{
		super.dispose();

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
	public _iGetFragmentCode(shader:ShaderBase, targetReg:ShaderRegisterElement, regCache:ShaderRegisterCache, sharedReg:ShaderRegisterData, inputReg:ShaderRegisterElement):string
	{
		var code:string = "";
		var wrap:string = (shader.repeatTextures? "wrap":"clamp");
		var format:string = this.getFormatString(this._single2DTexture.image2D);
		var filter:string = (shader.useSmoothTextures)? (shader.useMipmapping? "linear,miplinear" : "linear") : (shader.useMipmapping? "nearest,mipnearest" : "nearest");

		var temp:ShaderRegisterElement;

		//handles texture atlasing
		if (shader.useImageRect) {
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
		code += "tex " + targetReg + ", " + temp + ", " + textureReg + " <2d," + filter + "," + format + wrap + ">\n";

		return code;
	}

	public _setRenderState(renderable:RenderableBase, shader:ShaderBase)
	{
		var sampler:Sampler2D = <Sampler2D> renderable.renderableOwner.getSamplerAt(this._single2DTexture);

		shader.images[this._textureIndex].activate(this._textureIndex, sampler.repeat || shader.repeatTextures, sampler.smooth || shader.useSmoothTextures, sampler.mipmap || shader.useMipmapping);

		if (shader.useImageRect) {
			var index:number = this._samplerIndex;
			var data:Float32Array = shader.fragmentConstantData;
			data[index] = sampler.imageRect.width/this._single2DTexture.image2D.width;
			data[index + 1] = sampler.imageRect.height/this._single2DTexture.image2D.height;
			data[index + 2] = sampler.imageRect.x/this._single2DTexture.image2D.width;
			data[index + 3] = sampler.imageRect.y/this._single2DTexture.image2D.height;
		}
	}

	public activate(shader:ShaderBase)
	{
	}
}

export = Single2DTextureVO;