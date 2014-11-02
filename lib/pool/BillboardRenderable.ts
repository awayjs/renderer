import SubGeometryBase				= require("awayjs-display/lib/base/SubGeometryBase");
import TriangleSubGeometry			= require("awayjs-display/lib/base/TriangleSubGeometry");
import RenderablePool				= require("awayjs-display/lib/pool/RenderablePool");
import Billboard					= require("awayjs-display/lib/entities/Billboard");
import MaterialBase					= require("awayjs-display/lib/materials/MaterialBase");

import RenderableBase				= require("awayjs-renderergl/lib/pool/RenderableBase");

/**
 * @class away.pool.RenderableListItem
 */
class BillboardRenderable extends RenderableBase
{
	private static _materialGeometry:Object = new Object();

	/**
	 *
	 */
	public static id:string = "billboard";

	/**
	 *
	 */
	private _billboard:Billboard;

	/**
	 * //TODO
	 *
	 * @param pool
	 * @param billboard
	 */
	constructor(pool:RenderablePool, billboard:Billboard)
	{
		super(pool, billboard, billboard);

		this._billboard = billboard;
	}

	/**
	 * //TODO
	 *
	 * @returns {away.base.TriangleSubGeometry}
	 */
	public _pGetSubGeometry():SubGeometryBase
	{
		var material:MaterialBase = this._billboard.material;

		var geometry:TriangleSubGeometry = BillboardRenderable._materialGeometry[material.id];

		if (!geometry) {
			geometry = BillboardRenderable._materialGeometry[material.id] = new TriangleSubGeometry(true);
			geometry.autoDeriveNormals = false;
			geometry.autoDeriveTangents = false;
			geometry.updateIndices(Array<number>(0, 1, 2, 0, 2, 3));
			geometry.updatePositions(Array<number>(0, material.height, 0, material.width, material.height, 0, material.width, 0, 0, 0, 0, 0));
			geometry.updateVertexNormals(Array<number>(1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0));
			geometry.updateVertexTangents(Array<number>(0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1));
			geometry.updateUVs(Array<number>(0, 0, 1, 0, 1, 1, 0, 1));
		} else {
			geometry.updatePositions(Array<number>(0, material.height, 0, material.width, material.height, 0, material.width, 0, 0, 0, 0, 0));
		}

		this._pVertexDataDirty[TriangleSubGeometry.POSITION_DATA] = true;
		this._pVertexDataDirty[TriangleSubGeometry.NORMAL_DATA] = true;
		this._pVertexDataDirty[TriangleSubGeometry.TANGENT_DATA] = true;
		this._pVertexDataDirty[TriangleSubGeometry.UV_DATA] = true;

		return geometry;
	}
}

export = BillboardRenderable;