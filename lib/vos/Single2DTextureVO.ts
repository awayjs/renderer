import AssetEvent					= require("awayjs-core/lib/events/AssetEvent");
import Image2D						= require("awayjs-core/lib/image/Image2D");

import GL_Image2D					= require("awayjs-stagegl/lib/image/GL_Image2D");
import GL_Sampler2D					= require("awayjs-stagegl/lib/image/GL_Sampler2D");

import MappingMode					= require("awayjs-display/lib/textures/MappingMode");
import Single2DTexture				= require("awayjs-display/lib/textures/Single2DTexture");

import RenderBase					= require("awayjs-renderergl/lib/render/RenderBase");
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
		var wrap:string = "wrap";
		var format:string = "";//this.getFormatString(this._single2DTexture.image2D);
		var filter:string = "linear,miplinear";

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

		this._imageIndex = this._shader.getImageIndex(this._single2DTexture, 0);

		var textureReg:ShaderRegisterElement = this.getTextureReg(this._imageIndex, regCache, sharedReg);
		this._textureIndex = textureReg.index;

		code += "tex " + targetReg + ", " + temp + ", " + textureReg + " <2d," + filter + "," + format + wrap + ">\n";

		return code;
	}

	public activate(render:RenderBase)
	{
		var sampler:GL_Sampler2D = <GL_Sampler2D> render.samplers[this._imageIndex];
		sampler.activate(this._textureIndex);

		var image:GL_Image2D = render.images[this._imageIndex];
		image.activate(this._textureIndex, sampler._sampler.mipmap);

		if (this._shader.useImageRect) {
			var index:number = this._samplerIndex;
			var data:Float32Array = this._shader.fragmentConstantData;
			if (!sampler._sampler.imageRect) {
				data[index] = 1;
				data[index + 1] = 1;
				data[index + 2] = 0;
				data[index + 3] = 0;
			} else {
				var renderImage:Image2D = <Image2D> image._asset;
				data[index] = sampler._sampler.imageRect.width/renderImage.width;
				data[index + 1] = sampler._sampler.imageRect.height/renderImage.height;
				data[index + 2] = sampler._sampler.imageRect.x/renderImage.width;
				data[index + 3] = sampler._sampler.imageRect.y/renderImage.height;

			}
		}
	}


	public _setRenderState(renderable:RenderableBase)
	{
		var sampler:GL_Sampler2D = <GL_Sampler2D> renderable.samplers[this._imageIndex];

		if (sampler)
			sampler.activate(this._textureIndex);

		var image:GL_Image2D = renderable.images[this._imageIndex];

		if (image)
			image.activate(this._textureIndex, sampler._sampler.mipmap);

		if (this._shader.useImageRect && sampler) {
			var index:number = this._samplerIndex;
			var data:Float32Array = this._shader.fragmentConstantData;
			if (!sampler._sampler.imageRect) {
				data[index] = 1;
				data[index + 1] = 1;
				data[index + 2] = 0;
				data[index + 3] = 0;
			} else {
				var renderableImage:Image2D = <Image2D> (image? image._asset : renderable.render.images[this._imageIndex]._asset);
				data[index] = sampler._sampler.imageRect.width/renderableImage.width;
				data[index + 1] = sampler._sampler.imageRect.height/renderableImage.height;
				data[index + 2] = sampler._sampler.imageRect.x/renderableImage.width;
				data[index + 3] = sampler._sampler.imageRect.y/renderableImage.height;

			}
		}
	}
}

export = Single2DTextureVO;