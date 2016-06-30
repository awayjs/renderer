import {AbstractMethodError}			from "@awayjs/core/lib/errors/AbstractMethodError";
import {AssetEvent}					from "@awayjs/core/lib/events/AssetEvent";
import {ImageBase}					from "@awayjs/core/lib/image/ImageBase";
import {SamplerBase}					from "@awayjs/core/lib/image/SamplerBase";
import {AbstractionBase}				from "@awayjs/core/lib/library/AbstractionBase";

import {ContextGLTextureFormat}		from "@awayjs/stage/lib/base/ContextGLTextureFormat";
import {Stage}						from "@awayjs/stage/lib/base/Stage";

import {TextureBase}					from "@awayjs/display/lib/textures/TextureBase";

import {GL_SurfaceBase}				from "../surfaces/GL_SurfaceBase";
import {GL_RenderableBase}			from "../renderables/GL_RenderableBase";
import {ShaderBase}					from "../shaders/ShaderBase";
import {ShaderRegisterCache}			from "../shaders/ShaderRegisterCache";
import {ShaderRegisterData}			from "../shaders/ShaderRegisterData";
import {ShaderRegisterElement}		from "../shaders/ShaderRegisterElement";

/**
 *
 * @class away.pool.GL_TextureBaseBase
 */
export class GL_TextureBase extends AbstractionBase
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
	public onClear(event:AssetEvent):void
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

	public _setRenderState(renderable:GL_RenderableBase):void
	{
		//overidden for state logic
	}

	public activate(render:GL_SurfaceBase):void
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
			case ContextGLTextureFormat.COMPRESSED_ALPHA:
				return "dxt5,";
			default:
				return "";
		}
	}
}