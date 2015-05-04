import IAssetClass					= require("awayjs-core/lib/library/IAssetClass");

import Stage						= require("awayjs-stagegl/lib/base/Stage");

import SingleCubeTexture			= require("awayjs-display/lib/textures/SingleCubeTexture");

import ShaderBase					= require("awayjs-renderergl/lib/shaders/ShaderBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
import ShaderRegisterElement		= require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");
import TextureVOPool				= require("awayjs-renderergl/lib/vos/TextureVOPool");
import TextureVOBase					= require("awayjs-renderergl/lib/vos/TextureVOBase");
import SamplerCubeVO			= require("awayjs-renderergl/lib/vos/SamplerCubeVO");

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

	private _samplerCubeVO:SamplerCubeVO;

	constructor(pool:TextureVOPool, singleCubeTexture:SingleCubeTexture, stage:Stage)
	{
		super(pool, singleCubeTexture, stage);

		this._singleCubeTexture = singleCubeTexture;

		this._samplerCubeVO = new SamplerCubeVO(stage);
	}

	public _iIncludeDependencies(shader:ShaderBase, includeInput:boolean = true)
	{
		if (includeInput)
			shader.usesLocalPosFragment = true;
	}

	public _iInitRegisters(shader:ShaderBase, regCache:ShaderRegisterCache)
	{
		this._samplerCubeVO.initProperties(this._singleCubeTexture.samplerCube, regCache);
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
	public _iGetFragmentCode(shader:ShaderBase, targetReg:ShaderRegisterElement, regCache:ShaderRegisterCache, inputReg:ShaderRegisterElement):string
	{
		return this._samplerCubeVO.getFragmentCode(shader, targetReg, regCache, inputReg);
	}

	public activate(shader:ShaderBase)
	{
		this._samplerCubeVO.activate(shader);
	}
}

export = SingleCubeTextureVO;