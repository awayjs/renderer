import {AssetEvent}					from "@awayjs/core/lib/events/AssetEvent";

import {Shape}						from "@awayjs/graphics/lib/base/Shape";
import {DefaultMaterialManager}		from "@awayjs/graphics/lib/managers/DefaultMaterialManager";

import {RendererBase}					from "../RendererBase";
import {AnimatorBase}					from "../animators/AnimatorBase";
import {GL_ElementsBase}				from "../elements/GL_ElementsBase";
import {GL_RenderableBase}			from "../renderables/GL_RenderableBase";
import {GL_MaterialBase}				from "../materials/GL_MaterialBase";

/**
 * @class away.pool.GL_ShapeRenderable
 */
export class GL_ShapeRenderable extends GL_RenderableBase
{
	/**
	 *
	 */
	public shape:Shape;


	/**
	 * //TODO
	 *
	 * @param pool
	 * @param shape
	 * @param level
	 * @param indexOffset
	 */
	constructor(shape:Shape, renderer:RendererBase)
	{
		super(shape, renderer);

		this.shape = shape;
	}

	public onClear(event:AssetEvent):void
	{
		super.onClear(event);

		this.shape = null;
	}

	/**
	 *
	 * @returns {ElementsBase}
	 * @protected
	 */
	public _pGetElements():GL_ElementsBase
	{
		this._offset = this.shape.offset;
		this._count = this.shape.count;

		
		return <GL_ElementsBase> this._stage.getAbstraction((this.renderable.animator)? (<AnimatorBase> this.renderable.animator).getRenderableElements(this, this.shape.elements) : this.shape.elements);
	}


	public _pGetMaterial():GL_MaterialBase
	{
		return this._renderer.getMaterialPool(this.elementsGL).getAbstraction(this.shape.material || DefaultMaterialManager.getDefaultMaterial(this.renderable));
	}
}