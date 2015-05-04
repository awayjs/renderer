import Stage						= require("awayjs-stagegl/lib/base/Stage");

import TextureBase					= require("awayjs-display/lib/textures/TextureBase");

import ITextureVOClass			= require("awayjs-renderergl/lib/vos/ITextureVOClass");
import TextureVOBase					= require("awayjs-renderergl/lib/vos/TextureVOBase");
import Single2DTextureVO		= require("awayjs-renderergl/lib/vos/Single2DTextureVO");
import SingleCubeTextureVO		= require("awayjs-renderergl/lib/vos/SingleCubeTextureVO");

/**
 * @class away.pool.TextureVOPool
 */
class TextureVOPool
{
	private static classPool:Object = new Object();

	public static _pools:Object = new Object();

	public _stage:Stage;
	private _pool:Object = new Object();

	/**
	 * //TODO
	 *
	 * @param textureDataClass
	 */
	constructor(stage:Stage)
	{
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
		return (this._pool[texture.id] || (this._pool[texture.id] = texture._iAddTextureVO(new (TextureVOPool.getClass(texture))(this, texture, this._stage))));
	}

	/**
	 * //TODO
	 *
	 * @param materialOwner
	 */
	public disposeItem(texture:TextureBase)
	{
		texture._iRemoveTextureVO(this._pool[texture.id]);

		this._pool[texture.id] = null;
	}

	public dispose()
	{
		for (var id in this._pool)
			this._pool[id].dispose();

		TextureVOPool.disposePool(this._stage);
	}

	/**
	 * //TODO
	 *
	 * @param renderableClass
	 * @returns RenderPool
	 */
	public static getPool(stage:Stage):TextureVOPool
	{
		return (TextureVOPool._pools[stage.stageIndex] || (TextureVOPool._pools[stage.stageIndex] = new TextureVOPool(stage)));
	}

	/**
	 * //TODO
	 *
	 * @param renderableClass
	 */
	public static disposePool(stage:Stage)
	{
		TextureVOPool._pools[stage.stageIndex] = undefined;
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