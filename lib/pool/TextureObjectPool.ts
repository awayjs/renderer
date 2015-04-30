import Stage						= require("awayjs-stagegl/lib/base/Stage");

import TextureBase					= require("awayjs-display/lib/textures/TextureBase");

import ITextureObjectClass			= require("awayjs-renderergl/lib/pool/ITextureObjectClass");
import TextureObjectBase			= require("awayjs-renderergl/lib/pool/TextureObjectBase");
import Single2DTextureObject		= require("awayjs-renderergl/lib/pool/Single2DTextureObject");
import SingleCubeTextureObject		= require("awayjs-renderergl/lib/pool/SingleCubeTextureObject");

/**
 * @class away.pool.TextureObjectPool
 */
class TextureObjectPool
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
	public getItem(texture:TextureBase):TextureObjectBase
	{
		return (this._pool[texture.id] || (this._pool[texture.id] = texture._iAddTextureObject(new (TextureObjectPool.getClass(texture))(this, texture, this._stage))));
	}

	/**
	 * //TODO
	 *
	 * @param materialOwner
	 */
	public disposeItem(texture:TextureBase)
	{
		texture._iRemoveTextureObject(this._pool[texture.id]);

		this._pool[texture.id] = null;
	}

	public dispose()
	{
		for (var id in this._pool)
			this._pool[id].dispose();

		TextureObjectPool.disposePool(this._stage);
	}

	/**
	 * //TODO
	 *
	 * @param renderableClass
	 * @returns RenderablePoolBase
	 */
	public static getPool(stage:Stage):TextureObjectPool
	{
		return (TextureObjectPool._pools[stage.stageIndex] || (TextureObjectPool._pools[stage.stageIndex] = new TextureObjectPool(stage)));
	}

	/**
	 * //TODO
	 *
	 * @param renderableClass
	 */
	public static disposePool(stage:Stage)
	{
		TextureObjectPool._pools[stage.stageIndex] = undefined;
	}

	/**
	 *
	 * @param subMeshClass
	 */
	public static registerClass(textureObjectClass:ITextureObjectClass)
	{
		TextureObjectPool.classPool[textureObjectClass.assetClass.assetType] = textureObjectClass;
	}

	/**
	 *
	 * @param subGeometry
	 */
	public static getClass(texture:TextureBase):ITextureObjectClass
	{
		return TextureObjectPool.classPool[texture.assetType];
	}

	private static main = TextureObjectPool.addDefaults();

	private static addDefaults()
	{
		TextureObjectPool.registerClass(Single2DTextureObject);
		TextureObjectPool.registerClass(SingleCubeTextureObject);
	}
}

export = TextureObjectPool;