import IAssetClass					= require("awayjs-core/lib/library/IAssetClass");

import Stage						= require("awayjs-stagegl/lib/base/Stage");

import Single2DTexture				= require("awayjs-display/lib/textures/Single2DTexture");

import ShaderObjectBase				= require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
import ShaderRegisterElement		= require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
import TextureObjectPool			= require("awayjs-renderergl/lib/pool/TextureObjectPool");
import TextureObjectBase			= require("awayjs-renderergl/lib/pool/TextureObjectBase");
import Sampler2DObject				= require("awayjs-renderergl/lib/pool/Sampler2DObject");

/**
 *
 * @class away.pool.Single2DTextureObject
 */
class Single2DTextureObject extends TextureObjectBase
{
	/**
	 *
	 */
	public static assetClass:IAssetClass = Single2DTexture;

	private _single2DTexture:Single2DTexture;

	private _sampler2DObject:Sampler2DObject;

	constructor(pool:TextureObjectPool, single2DTexture:Single2DTexture, stage:Stage)
	{
		super(pool, single2DTexture, stage);

		this._single2DTexture = single2DTexture;

		this._sampler2DObject = new Sampler2DObject(stage);
	}

	public _iInitRegisters(shaderObject:ShaderObjectBase, regCache:ShaderRegisterCache)
	{
		this._sampler2DObject.initProperties(this._single2DTexture.sampler2D, regCache);
	}

	/**
	 *
	 * @param shaderObject
	 * @param regCache
	 * @param targetReg The register in which to store the sampled colour.
	 * @param uvReg The uv coordinate vector with which to sample the texture map.
	 * @returns {string}
	 * @private
	 */
	public _iGetFragmentCode(shaderObject:ShaderObjectBase, targetReg:ShaderRegisterElement, regCache:ShaderRegisterCache, inputReg:ShaderRegisterElement):string
	{
		return this._sampler2DObject.getFragmentCode(shaderObject, targetReg, regCache, inputReg);
	}

	public activate(shaderObject:ShaderObjectBase)
	{
		this._sampler2DObject.activate(shaderObject);
	}
}

export = Single2DTextureObject;