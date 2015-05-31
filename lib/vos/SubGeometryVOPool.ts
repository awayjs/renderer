import Stage						= require("awayjs-stagegl/lib/base/Stage");

import SubGeometryBase				= require("awayjs-core/lib/data/SubGeometryBase");

import ISubGeometryVOClass			= require("awayjs-renderergl/lib/vos/ISubGeometryVOClass");
import SubGeometryVOBase			= require("awayjs-renderergl/lib/vos/SubGeometryVOBase");
import TriangleSubGeometryVO		= require("awayjs-renderergl/lib/vos/TriangleSubGeometryVO");
import LineSubGeometryVO			= require("awayjs-renderergl/lib/vos/LineSubGeometryVO");
import CurveSubGeometryVO			= require("awayjs-renderergl/lib/vos/CurveSubGeometryVO");

/**
 * @class away.pool.SubGeometryVOPool
 */
class SubGeometryVOPool
{
	private static classPool:Object = new Object();

	public static _pool:SubGeometryVOPool;

	private _pool:Object = new Object();

	/**
	 * //TODO
	 *
	 * @param subGeometryDataClass
	 */
	constructor()
	{
	}

	/**
	 * //TODO
	 *
	 * @param materialOwner
	 * @returns ISubGeometry
	 */
	public getItem(subGeometry:SubGeometryBase):SubGeometryVOBase
	{
		return (this._pool[subGeometry.id] || (this._pool[subGeometry.id] = subGeometry._iAddSubGeometryVO(new (SubGeometryVOPool.getClass(subGeometry))(this, subGeometry))));
	}

	/**
	 * //TODO
	 *
	 * @param materialOwner
	 */
	public disposeItem(subGeometry:SubGeometryBase)
	{
		subGeometry._iRemoveSubGeometryVO(this._pool[subGeometry.id]);

		this._pool[subGeometry.id] = null;
	}

	/**
	 * //TODO
	 *
	 * @param renderableClass
	 * @returns RenderPool
	 */
	public static getPool():SubGeometryVOPool
	{
		return (SubGeometryVOPool._pool || (SubGeometryVOPool._pool = new SubGeometryVOPool()));
	}

	/**
	 *
	 * @param subMeshClass
	 */
	public static registerClass(subGeometryVOClass:ISubGeometryVOClass)
	{
		SubGeometryVOPool.classPool[subGeometryVOClass.assetClass.assetType] = subGeometryVOClass;
	}

	/**
	 *
	 * @param subGeometry
	 */
	public static getClass(subGeometry:SubGeometryBase):ISubGeometryVOClass
	{
		return SubGeometryVOPool.classPool[subGeometry.assetType];
	}

	private static main = SubGeometryVOPool.addDefaults();

	private static addDefaults()
	{
		SubGeometryVOPool.registerClass(CurveSubGeometryVO);
		SubGeometryVOPool.registerClass(LineSubGeometryVO);
		SubGeometryVOPool.registerClass(TriangleSubGeometryVO);
	}
}

export = SubGeometryVOPool;