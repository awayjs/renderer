import IAssetClass					= require("awayjs-core/lib/library/IAssetClass");

import IRenderObjectOwner			= require("awayjs-display/lib/base/IRenderObjectOwner");
import BasicMaterial				= require("awayjs-display/lib/materials/BasicMaterial");

import Stage						= require("awayjs-stagegl/lib/base/Stage");

import RenderObjectPool				= require("awayjs-renderergl/lib/compilation/RenderObjectPool");
import RenderObjectBase				= require("awayjs-renderergl/lib/compilation/RenderObjectBase");
import IRenderableClass				= require("awayjs-renderergl/lib/pool/IRenderableClass");
import DistancePass					= require("awayjs-renderergl/lib/passes/DistancePass");

/**
 * DistanceRenderObject is a pass that writes distance values to a depth map as a 32-bit value exploded over the 4 texture channels.
 * This is used to render omnidirectional shadow maps.
 */
class DistanceRenderObject extends RenderObjectBase
{
	//TODO: create debug distance material
	public static assetClass:IAssetClass = BasicMaterial;

	/**
	 * Creates a new DistanceRenderObject object.
	 *
	 * @param material The material to which this pass belongs.
	 */
	constructor(pool:RenderObjectPool, renderObjectOwner:IRenderObjectOwner, renderableClass:IRenderableClass, stage:Stage)
	{
		super(pool, renderObjectOwner, renderableClass, stage);

		this._pAddScreenPass(new DistancePass(this, renderObjectOwner, renderableClass, this._stage));
	}
}

export = DistanceRenderObject;