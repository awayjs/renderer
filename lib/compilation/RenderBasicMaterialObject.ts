import BlendMode					= require("awayjs-core/lib/base/BlendMode");
import IRenderObjectOwner			= require("awayjs-display/lib/base/IRenderObjectOwner");
import BasicMaterial				= require("awayjs-display/lib/materials/BasicMaterial");

import Stage						= require("awayjs-stagegl/lib/base/Stage");

import RenderObjectBase				= require("awayjs-renderergl/lib/compilation/RenderObjectBase");
import RenderObjectPool				= require("awayjs-renderergl/lib/compilation/RenderObjectPool");
import IRenderableClass				= require("awayjs-renderergl/lib/pool/IRenderableClass");
import BasicMaterialPass			= require("awayjs-renderergl/lib/passes/BasicMaterialPass");

/**
 * RenderMaterialObject forms an abstract base class for the default shaded materials provided by Stage,
 * using material methods to define their appearance.
 */
class RenderBasicMaterialObject extends RenderObjectBase
{
	/**
	 *
	 */
	public static id:string = "basic";

	private _material:BasicMaterial;
	private _screenPass:BasicMaterialPass;


	constructor(pool:RenderObjectPool, material:BasicMaterial, renderableClass:IRenderableClass, stage:Stage)
	{
		super(pool, material, renderableClass, stage);

		this._material = material;

		this._pAddScreenPass(this._screenPass = new BasicMaterialPass(this, material, renderableClass, this._stage));
	}

	/**
	 * @inheritDoc
	 */
	public _pUpdateRenderObject()
	{
		super._pUpdateRenderObject();

		this._pRequiresBlending = (this._material.blendMode != BlendMode.NORMAL || this._material.alphaBlending || (this._material.colorTransform && this._material.colorTransform.alphaMultiplier < 1));
		this._screenPass.preserveAlpha = this._material.preserveAlpha;//this._pRequiresBlending;
		this._screenPass.setBlendMode((this._renderObjectOwner.blendMode == BlendMode.NORMAL && this._pRequiresBlending)? BlendMode.LAYER : this._material.blendMode);
		//this._screenPass.forceSeparateMVP = false;
	}
}

export = RenderBasicMaterialObject;