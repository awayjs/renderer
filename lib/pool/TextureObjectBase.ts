import AbstractMethodError			= require("awayjs-core/lib/errors/AbstractMethodError");

import Stage						= require("awayjs-stagegl/lib/base/Stage");

import ITextureObject				= require("awayjs-display/lib/pool/ITextureObject");
import TextureBase					= require("awayjs-display/lib/textures/TextureBase");

import ShaderObjectBase				= require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
import ShaderRegisterElement		= require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
import TextureObjectPool			= require("awayjs-renderergl/lib/pool/TextureObjectPool");

/**
 *
 * @class away.pool.TextureObjectBaseBase
 */
class TextureObjectBase implements ITextureObject
{
	private _pool:TextureObjectPool;
	private _texture:TextureBase;

	public _stage:Stage;

	public invalid:boolean;

	constructor(pool:TextureObjectPool, texture:TextureBase, stage:Stage)
	{
		this._pool = pool;
		this._texture = texture;
		this._stage = stage;
	}

	public _iInitRegisters(shaderObject:ShaderObjectBase, regCache:ShaderRegisterCache)
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

	public _iGetFragmentCode(shaderObject:ShaderObjectBase, targetReg:ShaderRegisterElement, regCache:ShaderRegisterCache, inputReg:ShaderRegisterElement = null):string
	{
		throw new AbstractMethodError();
	}

	public activate(shaderObject:ShaderObjectBase)
	{
		throw new AbstractMethodError();
	}
}

export = TextureObjectBase;