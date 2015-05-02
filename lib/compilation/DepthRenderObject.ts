import IAssetClass					= require("awayjs-core/lib/library/IAssetClass");

import IRenderObjectOwner			= require("awayjs-display/lib/base/IRenderObjectOwner");
import BasicMaterial				= require("awayjs-display/lib/materials/BasicMaterial");

import Stage						= require("awayjs-stagegl/lib/base/Stage");

import RenderObjectBase				= require("awayjs-renderergl/lib/compilation/RenderObjectBase");
import RenderObjectPool				= require("awayjs-renderergl/lib/compilation/RenderObjectPool");
import IRenderableClass				= require("awayjs-renderergl/lib/pool/IRenderableClass");
import DepthPass					= require("awayjs-renderergl/lib/passes/DepthPass");

/**
 * DepthRenderObject forms an abstract base class for the default shaded materials provided by Stage,
 * using material methods to define their appearance.
 */
class DepthRenderObject extends RenderObjectBase
{
	//TODO: create debug depth material
	public static assetClass:IAssetClass = BasicMaterial;

	/**
	 *
	 * @param pool
	 * @param renderObjectOwner
	 * @param renderableClass
	 * @param stage
	 */
	constructor(pool:RenderObjectPool, renderObjectOwner:IRenderObjectOwner, renderableClass:IRenderableClass, stage:Stage)
	{
		super(pool, renderObjectOwner, renderableClass, stage);

		this._pAddScreenPass(new DepthPass(this, renderObjectOwner, renderableClass, this._stage));
	}
}

export = DepthRenderObject;