import {AssetEvent}					from "@awayjs/core/lib/events/AssetEvent";

import {GL_SamplerCube}				from "@awayjs/stage/lib/image/GL_SamplerCube";

import {SingleCubeTexture}			from "@awayjs/display/lib/textures/SingleCubeTexture";

import {GL_SurfaceBase}				from "../surfaces/GL_SurfaceBase";
import {GL_RenderableBase}			from "../renderables/GL_RenderableBase";
import {ShaderBase}					from "../shaders/ShaderBase";
import {ShaderRegisterCache}			from "../shaders/ShaderRegisterCache";
import {ShaderRegisterData}			from "../shaders/ShaderRegisterData";
import {ShaderRegisterElement}		from "../shaders/ShaderRegisterElement";
import {GL_TextureBase}				from "../textures/GL_TextureBase";

/**
 *
 * @class away.pool.TextureDataBase
 */
export class GL_SingleCubeTexture extends GL_TextureBase
{
	private _singleCubeTexture:SingleCubeTexture;
	private _textureIndex:number;
	private _imageIndex:number;

	constructor(singleCubeTexture:SingleCubeTexture, shader:ShaderBase)
	{
		super(singleCubeTexture, shader);

		this._singleCubeTexture = singleCubeTexture;
	}


	public onClear(event:AssetEvent):void
	{
		super.onClear(event);

		this._singleCubeTexture = null;
	}

	public _iIncludeDependencies(includeInput:boolean = true):void
	{
		if (includeInput)
			this._shader.usesPositionFragment = true;
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
		var format:string = "";//this.getFormatString(this._singleCubeTexture.imageCube);
		var filter:string = "linear,miplinear";

		this._imageIndex = this._shader.getImageIndex(this._singleCubeTexture, 0);

		var textureReg:ShaderRegisterElement = this.getTextureReg(this._imageIndex, regCache, sharedReg);
		this._textureIndex = textureReg.index;

		return "tex " + targetReg + ", " + inputReg + ", " + textureReg + " <cube," + format + filter + ">\n";
	}


	public activate(render:GL_SurfaceBase):void
	{
		var sampler:GL_SamplerCube = <GL_SamplerCube> render.samplers[this._imageIndex];

		if (sampler)
			sampler.activate(this._textureIndex);

		if (render.images[this._imageIndex])
			render.images[this._imageIndex].activate(this._textureIndex, sampler._sampler.mipmap);

	}

	public _setRenderState(renderable:GL_RenderableBase):void
	{
		var sampler:GL_SamplerCube = <GL_SamplerCube> renderable.samplers[this._imageIndex];

		if (sampler)
			sampler.activate(this._textureIndex);

		if (renderable.images[this._imageIndex] && sampler) //TODO: allow image to be re-written without accompanying sampler on the renderable
			renderable.images[this._imageIndex].activate(this._textureIndex, sampler._sampler.mipmap);
	}
}