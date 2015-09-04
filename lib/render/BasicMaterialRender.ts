import BlendMode					= require("awayjs-core/lib/data/BlendMode");

import IRenderOwner					= require("awayjs-display/lib/base/IRenderOwner");
import BasicMaterial				= require("awayjs-display/lib/materials/BasicMaterial");

import Stage						= require("awayjs-stagegl/lib/base/Stage");

import BasicMaterialPass			= require("awayjs-renderergl/lib/render/passes/BasicMaterialPass");
import IRenderableClass				= require("awayjs-renderergl/lib/renderables/IRenderableClass");
import RenderBase					= require("awayjs-renderergl/lib/render/RenderBase");
import RenderPool					= require("awayjs-renderergl/lib/render/RenderPool");

/**
 * RenderMaterialObject forms an abstract base class for the default shaded materials provided by Stage,
 * using material methods to define their appearance.
 */
class BasicMaterialRender extends RenderBase
{
	private _material:BasicMaterial;
	private _pass:BasicMaterialPass;


	constructor(pool:RenderPool, material:BasicMaterial, renderableClass:IRenderableClass, stage:Stage)
	{
		super(pool, material, renderableClass, stage);

		this._material = material;

		this._pAddPass(this._pass = new BasicMaterialPass(this, material, renderableClass, this._stage));
	}

	public dispose()
	{
		super.dispose();

		this._material = null;
	}

	/**
	 * @inheritDoc
	 */
	public _pUpdateRender()
	{
		super._pUpdateRender();

		this._pRequiresBlending = (this._material.blendMode != BlendMode.NORMAL || this._material.alphaBlending || (this._material.colorTransform && this._material.colorTransform.alphaMultiplier < 1));
		this._pass.preserveAlpha = this._material.preserveAlpha;//this._pRequiresBlending;
		this._pass.shader.setBlendMode((this._renderOwner.blendMode == BlendMode.NORMAL && this._pRequiresBlending)? BlendMode.LAYER : this._material.blendMode);
		//this._pass.forceSeparateMVP = false;
	}
}

export = BasicMaterialRender;