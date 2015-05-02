import BlendMode					= require("awayjs-core/lib/data/BlendMode");

import Skybox						= require("awayjs-display/lib/entities/Skybox");
import BasicMaterial				= require("awayjs-display/lib/materials/BasicMaterial");

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
	private _screenPass:SkyboxPass;

	constructor(pool:RenderObjectPool, skybox:Skybox, renderableClass:IRenderableClass, stage:Stage)
	{
		super(pool, skybox, renderableClass, stage);

		this._screenPass = new SkyboxPass(this, skybox, renderableClass, this._stage);

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