import MaterialData					= require("awayjs-renderergl/lib/pool/MaterialData");
import MaterialGLBase				= require("awayjs-renderergl/lib/materials/MaterialGLBase");

/**
 * @class away.pool.MaterialDataPool
 */
class MaterialDataPool
{
	private _pool:Object = new Object();

	/**
	 * //TODO
	 *
	 * @param textureDataClass
	 */
	constructor()
	{
	}

	/**
	 * //TODO
	 *
	 * @param materialOwner
	 * @returns ITexture
	 */
	public getItem(material:MaterialGLBase):MaterialData
	{
		return (this._pool[material.id] || (this._pool[material.id] = material._iAddMaterialData(new MaterialData(this, material))))
	}

	/**
	 * //TODO
	 *
	 * @param materialOwner
	 */
	public disposeItem(material:MaterialGLBase)
	{
		material._iRemoveMaterialData(this._pool[material.id]);

		this._pool[material.id] = null;
	}
}

export = MaterialDataPool;