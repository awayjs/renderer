import AbstractMethodError			= require("awayjs-core/lib/errors/AbstractMethodError");

import Stage						= require("awayjs-stagegl/lib/base/Stage");

import ITextureVO					= require("awayjs-display/lib/pool/ITextureVO");
import TextureBase					= require("awayjs-display/lib/textures/TextureBase");

import ShaderBase					= require("awayjs-renderergl/lib/shaders/ShaderBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
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

	public _stage:Stage;

	public invalid:boolean;

	constructor(pool:TextureVOPool, texture:TextureBase, stage:Stage)
	{
		this._pool = pool;
		this._texture = texture;
		this._stage = stage;
	}

	public _iInitRegisters(shader:ShaderBase, regCache:ShaderRegisterCache)
	{

	}

	/**
	 *
	 */
	public dispose()
	{
		this._pool.disposeItem(this._texture);
	}

	/**
	 *
	 */
	public invalidate()
	{
		this.invalid = true;
	}

	public _iGetFragmentCode(shader:ShaderBase, targetReg:ShaderRegisterElement, regCache:ShaderRegisterCache, inputReg:ShaderRegisterElement = null):string
	{
		throw new AbstractMethodError();
	}

	public activate(shader:ShaderBase)
	{
		throw new AbstractMethodError();
	}
}

export = TextureVOBase;