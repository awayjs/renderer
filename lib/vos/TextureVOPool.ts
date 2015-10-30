import Stage						= require("awayjs-stagegl/lib/base/Stage");

import TextureBase					= require("awayjs-display/lib/textures/TextureBase");

import ITextureVOClass				= require("awayjs-renderergl/lib/vos/ITextureVOClass");
import TextureVOBase				= require("awayjs-renderergl/lib/vos/TextureVOBase");
import ShaderBase					= require("awayjs-renderergl/lib/shaders/ShaderBase");
import Single2DTextureVO			= require("awayjs-renderergl/lib/vos/Single2DTextureVO");
import SingleCubeTextureVO			= require("awayjs-renderergl/lib/vos/SingleCubeTextureVO");

/**
 * @class away.pool.TextureVOPool
 */
class TextureVOPool
{
	private static classPool:Object = new Object();

	private _shader:ShaderBase;
	private _stage:Stage;
	private _pool:Object = new Object();

	/**
	 * //TODO
	 *
	 * @param textureDataClass
	 */
	constructor(shader:ShaderBase, stage:Stage)
	{
		this._shader = shader;
		this._stage = stage;
	}

	/**
	 * //TODO
	 *
	 * @param materialOwner
	 * @returns ITexture
	 */
	public getItem(texture:TextureBase):TextureVOBase
	{
		return (this._pool[texture.id] || (this._pool[texture.id] = texture._iAddTextureVO(new (TextureVOPool.getClass(texture))(this, texture, this._shader, this._stage))));
	}

	/**
	 * //TODO
	 *
	 * @param materialOwner
	 */
	public disposeItem(texture:TextureBase)
	{
		texture._iRemoveTextureVO(this._pool[texture.id]);

		delete this._pool[texture.id];
	}

	public dispose()
	{
		for (var id in this._pool)
			this._pool[id].dispose();
	}

	/**
	 *
	 * @param subMeshClass
	 */
	public static registerClass(textureVOClass:ITextureVOClass)
	{
		TextureVOPool.classPool[textureVOClass.assetClass.assetType] = textureVOClass;
	}

	/**
	 *
	 * @param subGeometry
	 */
	public static getClass(texture:TextureBase):ITextureVOClass
	{
		return TextureVOPool.classPool[texture.assetType];
	}

	private static main = TextureVOPool.addDefaults();

	private static addDefaults()
	{
		TextureVOPool.registerClass(Single2DTextureVO);
		TextureVOPool.registerClass(SingleCubeTextureVO);
	}
}

export = TextureVOPool;