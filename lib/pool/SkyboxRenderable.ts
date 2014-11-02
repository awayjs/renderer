import TriangleSubGeometry			= require("awayjs-display/lib/base/TriangleSubGeometry");
import RenderablePool				= require("awayjs-display/lib/pool/RenderablePool");
import Skybox						= require("awayjs-display/lib/entities/Skybox");

import RenderableBase				= require("awayjs-renderergl/lib/pool/RenderableBase");

/**
 * @class away.pool.SkyboxRenderable
 */
class SkyboxRenderable extends RenderableBase
{
	/**
	 *
	 */
	public static id:string = "skybox";

	/**
	 *
	 */
	private static _geometry:TriangleSubGeometry;

	/**
	 * //TODO
	 *
	 * @param pool
	 * @param skybox
	 */
	constructor(pool:RenderablePool, skybox:Skybox)
	{
		super(pool, skybox, skybox);
	}

	/**
	 * //TODO
	 *
	 * @returns {away.base.TriangleSubGeometry}
	 * @private
	 */
	public _pGetSubGeometry():TriangleSubGeometry
	{
		var geometry:TriangleSubGeometry = SkyboxRenderable._geometry;

		if (!geometry) {
			geometry = SkyboxRenderable._geometry = new TriangleSubGeometry(true);
			geometry.autoDeriveNormals = false;
			geometry.autoDeriveTangents = false;
			geometry.updateIndices(Array<number>(0, 1, 2, 2, 3, 0, 6, 5, 4, 4, 7, 6, 2, 6, 7, 7, 3, 2, 4, 5, 1, 1, 0, 4, 4, 0, 3, 3, 7, 4, 2, 1, 5, 5, 6, 2));
			geometry.updatePositions(Array<number>(-1, 1, -1, 1, 1, -1, 1, 1, 1, -1, 1, 1, -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1));
		}

		this._pVertexDataDirty[TriangleSubGeometry.POSITION_DATA] = true;

		return geometry;
	}
}

export = SkyboxRenderable;