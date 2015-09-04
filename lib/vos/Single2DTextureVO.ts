import IAssetClass					= require("awayjs-core/lib/library/IAssetClass");

import Stage						= require("awayjs-stagegl/lib/base/Stage");

import Single2DTexture				= require("awayjs-display/lib/textures/Single2DTexture");

import ShaderBase					= require("awayjs-renderergl/lib/shaders/ShaderBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
import ShaderRegisterElement		= require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");
import TextureVOPool				= require("awayjs-renderergl/lib/vos/TextureVOPool");
import TextureVOBase				= require("awayjs-renderergl/lib/vos/TextureVOBase");
import Sampler2DVO					= require("awayjs-renderergl/lib/vos/Sampler2DVO");

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

	private _sampler2DVO:Sampler2DVO;

	constructor(pool:TextureVOPool, single2DTexture:Single2DTexture, stage:Stage)
	{
		super(pool, single2DTexture, stage);

		this._single2DTexture = single2DTexture;

		this._sampler2DVO = new Sampler2DVO(stage, this._single2DTexture.sampler2D);
	}

	public dispose()
	{
		super.dispose();

		this._single2DTexture = null;

		this._sampler2DVO.dispose();
		this._sampler2DVO = null;
	}

	public _iInitRegisters(shader:ShaderBase, regCache:ShaderRegisterCache)
	{
		this._sampler2DVO.initProperties(regCache);
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
	public _iGetFragmentCode(shader:ShaderBase, targetReg:ShaderRegisterElement, regCache:ShaderRegisterCache, inputReg:ShaderRegisterElement):string
	{
		return this._sampler2DVO.getFragmentCode(shader, targetReg, regCache, inputReg);
	}

	public activate(shader:ShaderBase)
	{
		this._sampler2DVO.activate(shader);
	}
}

export = Single2DTextureVO;