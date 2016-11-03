import {AssetEvent}					from "@awayjs/core/lib/events/AssetEvent";

import {Graphic}						from "@awayjs/graphics/lib/Graphic";
import {DefaultMaterialManager}		from "@awayjs/graphics/lib/managers/DefaultMaterialManager";

import {RendererBase}					from "../RendererBase";
import {AnimatorBase}					from "../animators/AnimatorBase";
import {GL_ElementsBase}				from "../elements/GL_ElementsBase";
import {GL_RenderableBase}			from "../renderables/GL_RenderableBase";
import {GL_MaterialBase}				from "../materials/GL_MaterialBase";

/**
 * @class away.pool.GL_GraphicRenderable
 */
export class GL_GraphicRenderable extends GL_RenderableBase
{
	/**
	 *
	 */
	public graphic:Graphic;


	/**
	 * //TODO
	 *
	 * @param pool
	 * @param graphic
	 * @param level
	 * @param indexOffset
	 */
	constructor(graphic:Graphic, renderer:RendererBase)
	{
		super(graphic, renderer);

		this.graphic = graphic;
	}

	public onClear(event:AssetEvent):void
	{
		super.onClear(event);

		this.graphic = null;
	}

	/**
	 *
	 * @returns {ElementsBase}
	 * @protected
	 */
	public _pGetElements():GL_ElementsBase
	{
		this._offset = this.graphic.offset;
		this._count = this.graphic.count;
		this._idx_offset = this.graphic.idx_offset;
		this._idx_count = this.graphic.idx_count;

		
		return <GL_ElementsBase> this._stage.getAbstraction((this.renderable.animator)? (<AnimatorBase> this.renderable.animator).getRenderableElements(this, this.graphic.elements) : this.graphic.elements);
	}


	public _pGetMaterial():GL_MaterialBase
	{
		return this._renderer.getMaterialPool(this.elementsGL).getAbstraction(this.graphic.material || DefaultMaterialManager.getDefaultMaterial(this.renderable));
	}
}