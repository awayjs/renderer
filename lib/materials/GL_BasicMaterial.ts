import {AssetEvent}					from "@awayjs/core/lib/events/AssetEvent";

import {BlendMode}					from "@awayjs/graphics/lib/image/BlendMode";
import {BasicMaterial}				from "@awayjs/graphics/lib/materials/BasicMaterial";

import {BasicMaterialPass}			from "../materials/passes/BasicMaterialPass";
import {IElementsClassGL}				from "../elements/IElementsClassGL";
import {GL_MaterialBase}				from "../materials/GL_MaterialBase";
import {MaterialPool}					from "../materials/MaterialPool";

/**
 * RenderMaterialObject forms an abstract base class for the default shaded materials provided by Stage,
 * using material methods to define their appearance.
 */
export class GL_BasicMaterial extends GL_MaterialBase
{
	private _basicMaterial:BasicMaterial;
	private _pass:BasicMaterialPass;


	constructor(material:BasicMaterial, elementsClass:IElementsClassGL, renderPool:MaterialPool)
	{
		super(material, elementsClass, renderPool);

		this._basicMaterial = material;

		this._pAddPass(this._pass = new BasicMaterialPass(this, material, elementsClass, this._stage));
	}

	public onClear(event:AssetEvent):void
	{
		super.onClear(event);

		this._basicMaterial = null;
	}

	/**
	 * @inheritDoc
	 */
	public _pUpdateRender():void
	{
		super._pUpdateRender();

		this._pRequiresBlending = (this._basicMaterial.blendMode != BlendMode.NORMAL || this._basicMaterial.alphaBlending || (this._basicMaterial.colorTransform && this._basicMaterial.colorTransform.alphaMultiplier < 1));
		this._pass.preserveAlpha = this._basicMaterial.preserveAlpha;//this._pRequiresBlending;
		this._pass.shader.setBlendMode((this._basicMaterial.blendMode == BlendMode.NORMAL && this._pRequiresBlending)? BlendMode.LAYER : this._basicMaterial.blendMode);
		//this._pass.forceSeparateMVP = false;
	}
}