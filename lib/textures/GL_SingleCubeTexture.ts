import AssetEvent					= require("awayjs-core/lib/events/AssetEvent");

import GL_SamplerCube				= require("awayjs-stagegl/lib/image/GL_SamplerCube");

import SingleCubeTexture			= require("awayjs-display/lib/textures/SingleCubeTexture");

import GL_SurfaceBase				= require("awayjs-renderergl/lib/surfaces/GL_SurfaceBase");
import GL_RenderableBase			= require("awayjs-renderergl/lib/renderables/GL_RenderableBase");
import ShaderBase					= require("awayjs-renderergl/lib/shaders/ShaderBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
import ShaderRegisterData			= require("awayjs-renderergl/lib/shaders/ShaderRegisterData");
import ShaderRegisterElement		= require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");
import GL_TextureBase				= require("awayjs-renderergl/lib/textures/GL_TextureBase");

/**
 *
 * @class away.pool.TextureDataBase
 */
class GL_SingleCubeTexture extends GL_TextureBase
{
	private _singleCubeTexture:SingleCubeTexture;
	private _textureIndex:number;
	private _imageIndex:number;

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


	public activate(render:GL_SurfaceBase)
	{
		var sampler:GL_SamplerCube = <GL_SamplerCube> render.samplers[this._imageIndex];

		if (sampler)
			sampler.activate(this._textureIndex);

		if (render.images[this._imageIndex])
			render.images[this._imageIndex].activate(this._textureIndex, sampler._sampler.mipmap);

	}

	public _setRenderState(renderable:GL_RenderableBase)
	{
		var sampler:GL_SamplerCube = <GL_SamplerCube> renderable.samplers[this._imageIndex];

		if (sampler)
			sampler.activate(this._textureIndex);

		if (renderable.images[this._imageIndex] && sampler) //TODO: allow image to be re-written without accompanying sampler on the renderable
			renderable.images[this._imageIndex].activate(this._textureIndex, sampler._sampler.mipmap);
	}
}

export = GL_SingleCubeTexture;