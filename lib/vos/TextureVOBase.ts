import AbstractMethodError			= require("awayjs-core/lib/errors/AbstractMethodError");
import ImageBase					= require("awayjs-core/lib/data/ImageBase");
import SamplerBase					= require("awayjs-core/lib/data/SamplerBase");

import ContextGLTextureFormat		= require("awayjs-stagegl/lib/base/ContextGLTextureFormat");
import Stage						= require("awayjs-stagegl/lib/base/Stage");
import ImageObjectBase				= require("awayjs-stagegl/lib/pool/ImageObjectBase");

import ITextureVO					= require("awayjs-display/lib/pool/ITextureVO");
import TextureBase					= require("awayjs-display/lib/textures/TextureBase");

import RenderableBase				= require("awayjs-renderergl/lib/renderables/RenderableBase");
import ShaderBase					= require("awayjs-renderergl/lib/shaders/ShaderBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
import ShaderRegisterData			= require("awayjs-renderergl/lib/shaders/ShaderRegisterData");
import ShaderRegisterElement		= require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");
import TextureVOPool				= require("awayjs-renderergl/lib/vos/TextureVOPool");

/**
 *
 * @class away.pool.TextureVOBaseBase
 */
class TextureVOBase implements ITextureVO
{
	private _pool:TextureVOPool;
	private _texture:TextureBase;
	public _shader:ShaderBase;
	public _stage:Stage;

	public invalid:boolean;

	constructor(pool:TextureVOPool, texture:TextureBase, shader:ShaderBase, stage:Stage)
	{
		this._pool = pool;
		this._texture = texture;
		this._shader = shader;
		this._stage = stage;
	}

	/**
	 *
	 */
	public dispose()
	{
		this._pool.disposeItem(this._texture);
		this._pool = null;
		this._texture = null;
		this._shader = null;
		this._stage = null;
	}

	/**
	 *
	 */
	public invalidate()
	{
		this.invalid = true;
	}

	public _iGetFragmentCode(shader:ShaderBase, targetReg:ShaderRegisterElement, regCache:ShaderRegisterCache, sharedReg:ShaderRegisterData, inputReg:ShaderRegisterElement = null):string
	{
		throw new AbstractMethodError();
	}

	public _setRenderState(renderable:RenderableBase, shader:ShaderBase)
	{
		throw new AbstractMethodError();
	}

	public activate(shader:ShaderBase)
	{
		throw new AbstractMethodError();
	}

	public getTextureReg(image:ImageBase, regCache:ShaderRegisterCache, sharedReg:ShaderRegisterData):ShaderRegisterElement
	{
		var imageIndex:number = this._shader.getImageIndex(image);
		var index:number = this._shader.imageIndices.indexOf(imageIndex);

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