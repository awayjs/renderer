import BlendMode					= require("awayjs-display/lib/base/BlendMode");
import IRenderObjectOwner			= require("awayjs-display/lib/base/IRenderObjectOwner");

import Stage						= require("awayjs-stagegl/lib/base/Stage");

import RenderObjectBase				= require("awayjs-renderergl/lib/compilation/RenderObjectBase");
import RenderObjectPool				= require("awayjs-renderergl/lib/compilation/RenderObjectPool");
import IRenderableClass				= require("awayjs-renderergl/lib/pool/IRenderableClass");
import SkyboxPass					= require("awayjs-renderergl/lib/passes/SkyboxPass");

/**
 * SkyboxRenderObject forms an abstract base class for the default shaded materials provided by Stage,
 * using material methods to define their appearance.
 */
class SkyboxRenderObject extends RenderObjectBase
{
	/**
	 *
	 */
	public static id:string = "skybox";

	private _screenPass:SkyboxPass;

	constructor(pool:RenderObjectPool, renderObjectOwner:IRenderObjectOwner, renderableClass:IRenderableClass, stage:Stage)
	{
		super(pool, renderObjectOwner, renderableClass, stage);

		this._screenPass = new SkyboxPass(this, renderObjectOwner, renderableClass, this._stage);

		this._pAddScreenPass(this._screenPass);
	}

	/**
	 * @inheritDoc
	 */
	public _pUpdateRenderObject()
	{
		super._pUpdateRenderObject();

		this._pRequiresBlending = (this._renderObjectOwner.blendMode != BlendMode.NORMAL);

		this._screenPass.setBlendMode((this._renderObjectOwner.blendMode == BlendMode.NORMAL && this._pRequiresBlending)? BlendMode.LAYER : this._renderObjectOwner.blendMode);
	}
}

export = SkyboxRenderObject;