import AbstractMethodError			= require("awayjs-core/lib/errors/AbstractMethodError");
import AssetEvent					= require("awayjs-core/lib/events/AssetEvent");
import ImageBase					= require("awayjs-core/lib/image/ImageBase");
import SamplerBase					= require("awayjs-core/lib/image/SamplerBase");
import AbstractionBase				= require("awayjs-core/lib/library/AbstractionBase");

import ContextGLTextureFormat		= require("awayjs-stagegl/lib/base/ContextGLTextureFormat");
import Stage						= require("awayjs-stagegl/lib/base/Stage");

import TextureBase					= require("awayjs-display/lib/textures/TextureBase");

import RenderBase					= require("awayjs-renderergl/lib/render/RenderBase");
import RenderableBase				= require("awayjs-renderergl/lib/renderables/RenderableBase");
import ShaderBase					= require("awayjs-renderergl/lib/shaders/ShaderBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
import ShaderRegisterData			= require("awayjs-renderergl/lib/shaders/ShaderRegisterData");
import ShaderRegisterElement		= require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");

/**
 *
 * @class away.pool.TextureVOBaseBase
 */
class TextureVOBase extends AbstractionBase
{
	private _texture:TextureBase;
	public _shader:ShaderBase;
	public _stage:Stage;

	constructor(texture:TextureBase, shader:ShaderBase)
	{
		super(texture, shader);

		this._texture = texture;
		this._shader = shader;
		this._stage = shader._stage;
	}

	/**
	 *
	 */
	public onClear(event:AssetEvent)
	{
		super.onClear(event);

		this._texture = null;
		this._shader = null;
		this._stage = null;
	}

	public _iGetFragmentCode(targetReg:ShaderRegisterElement, regCache:ShaderRegisterCache, sharedReg:ShaderRegisterData, inputReg:ShaderRegisterElement = null):string
	{
		throw new AbstractMethodError();
	}

	public _setRenderState(renderable:RenderableBase)
	{
		//overidden for state logic
	}

	public activate(render:RenderBase)
	{
		//overridden for activation logic
	}

	public getTextureReg(imageIndex:number, regCache:ShaderRegisterCache, sharedReg:ShaderRegisterData):ShaderRegisterElement
	{
		var index:number = this._shader.imageIndices.indexOf(imageIndex); //todo: collapse the index based on duplicate image objects to save registrations

		if (index == -1) {
			var textureReg:ShaderRegisterElement = regCache.getFreeTextureReg();
			sharedReg.textures.push(textureReg);
			this._shader.imageIndices.push(imageIndex);

			return textureReg;
		}

		return sharedReg.textures[index];
	}

	public getFormatString(image:ImageBase):string
	{
		switch (image.format) {
			case ContextGLTextureFormat.COMPRESSED:
				return "dxt1,";
				break;
			case ContextGLTextureFormat.COMPRESSED_ALPHA:
				return "dxt5,";
				break;
			default:
				return "";
		}
	}
}

export = TextureVOBase;