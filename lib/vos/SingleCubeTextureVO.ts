import IAssetClass					= require("awayjs-core/lib/library/IAssetClass");
import SamplerCube					= require("awayjs-core/lib/data/SamplerCube");

import Stage						= require("awayjs-stagegl/lib/base/Stage");

import SingleCubeTexture			= require("awayjs-display/lib/textures/SingleCubeTexture");

import RenderableBase				= require("awayjs-renderergl/lib/renderables/RenderableBase");

import ShaderBase					= require("awayjs-renderergl/lib/shaders/ShaderBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
import ShaderRegisterData			= require("awayjs-renderergl/lib/shaders/ShaderRegisterData");
import ShaderRegisterElement		= require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");
import TextureVOPool				= require("awayjs-renderergl/lib/vos/TextureVOPool");
import TextureVOBase				= require("awayjs-renderergl/lib/vos/TextureVOBase");

/**
 *
 * @class away.pool.TextureDataBase
 */
class SingleCubeTextureVO extends TextureVOBase
{
	/**
	 *
	 */
	public static assetClass:IAssetClass = SingleCubeTexture;


	private _singleCubeTexture:SingleCubeTexture;
	private _textureIndex:number;

	constructor(pool:TextureVOPool, singleCubeTexture:SingleCubeTexture, shader:ShaderBase, stage:Stage)
	{
		super(pool, singleCubeTexture, shader, stage);

		this._singleCubeTexture = singleCubeTexture;
	}


	public dispose()
	{
		super.dispose();

		this._singleCubeTexture = null;
	}

	public _iIncludeDependencies(shader:ShaderBase, includeInput:boolean = true)
	{
		if (includeInput)
			shader.usesLocalPosFragment = true;
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
	public _iGetFragmentCode(shader:ShaderBase, targetReg:ShaderRegisterElement, regCache:ShaderRegisterCache, sharedReg:ShaderRegisterData, inputReg:ShaderRegisterElement):string
	{
		var filter:string;
		var format:string = this.getFormatString(this._singleCubeTexture.imageCube);
		var filter:string = (shader.useSmoothTextures)? (shader.useMipmapping? "linear,miplinear" : "linear") : (shader.useMipmapping? "nearest,mipnearest" : "nearest");

		var textureReg:ShaderRegisterElement = this.getTextureReg(this._singleCubeTexture.imageCube, regCache, sharedReg);
		this._textureIndex = textureReg.index;

		return "tex " + targetReg + ", " + inputReg + ", " + textureReg + " <cube," + format + filter + ">\n";
	}

	public _setRenderState(renderable:RenderableBase, shader:ShaderBase)
	{
		var sampler:SamplerCube = <SamplerCube> renderable.renderableOwner.getSamplerAt(this._singleCubeTexture);

		shader.images[this._textureIndex].activate(this._textureIndex, false, sampler.smooth || shader.useSmoothTextures, sampler.mipmap || shader.useMipmapping);
	}

	public activate(shader:ShaderBase)
	{

	}
}

export = SingleCubeTextureVO;