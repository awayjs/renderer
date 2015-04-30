import IAssetClass					= require("awayjs-core/lib/library/IAssetClass");

import Stage						= require("awayjs-stagegl/lib/base/Stage");

import SingleCubeTexture			= require("awayjs-display/lib/textures/SingleCubeTexture");

import ShaderObjectBase				= require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
import ShaderRegisterElement		= require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
import TextureObjectPool			= require("awayjs-renderergl/lib/pool/TextureObjectPool");
import TextureObjectBase			= require("awayjs-renderergl/lib/pool/TextureObjectBase");
import SamplerCubeObject			= require("awayjs-renderergl/lib/pool/SamplerCubeObject");

/**
 *
 * @class away.pool.TextureDataBase
 */
class SingleCubeTextureObject extends TextureObjectBase
{
	/**
	 *
	 */
	public static assetClass:IAssetClass = SingleCubeTexture;


	private _singleCubeTexture:SingleCubeTexture;

	private _samplerCubeObject:SamplerCubeObject;

	constructor(pool:TextureObjectPool, singleCubeTexture:SingleCubeTexture, stage:Stage)
	{
		super(pool, singleCubeTexture, stage);

		this._singleCubeTexture = singleCubeTexture;

		this._samplerCubeObject = new SamplerCubeObject(stage);
	}

	public _iIncludeDependencies(shaderObject:ShaderObjectBase, includeInput:boolean = true)
	{
		if (includeInput)
			shaderObject.usesLocalPosFragment = true;
	}

	public _iInitRegisters(shaderObject:ShaderObjectBase, regCache:ShaderRegisterCache)
	{
		this._samplerCubeObject.initProperties(this._singleCubeTexture.samplerCube, regCache);
	}

	/**
	 *
	 * @param shaderObject
	 * @param regCache
	 * @param targetReg The register in which to store the sampled colour.
	 * @param uvReg The direction vector with which to sample the cube map.
	 * @returns {string}
	 * @private
	 */
	public _iGetFragmentCode(shaderObject:ShaderObjectBase, targetReg:ShaderRegisterElement, regCache:ShaderRegisterCache, inputReg:ShaderRegisterElement):string
	{
		return this._samplerCubeObject.getFragmentCode(shaderObject, targetReg, regCache, inputReg);
	}

	public activate(shaderObject:ShaderObjectBase)
	{
		this._samplerCubeObject.activate(shaderObject);
	}
}

export = SingleCubeTextureObject;