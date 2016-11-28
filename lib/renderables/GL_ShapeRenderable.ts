import {AssetEvent} from "@awayjs/core";

import {IEntity, Shape, DefaultMaterialManager} from "@awayjs/graphics";

import {AnimatorBase} from "../animators/AnimatorBase";
import {GL_ElementsBase} from "../elements/GL_ElementsBase";
import {GL_MaterialBase} from "../materials/GL_MaterialBase";

import {RendererBase} from "../RendererBase";

import {GL_RenderableBase} from "./GL_RenderableBase";
import {RenderablePool} from "./RenderablePool";

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
	constructor(shape:Shape, entity:IEntity, renderer:RendererBase, pool:RenderablePool)
	{
		super(shape, entity, renderer, pool);

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

		
		return <GL_ElementsBase> this._stage.getAbstraction((this.sourceEntity.animator)? (<AnimatorBase> this.sourceEntity.animator).getRenderableElements(this, this.shape.elements) : this.shape.elements);
	}


	public _pGetMaterial():GL_MaterialBase
	{
		return this._renderer.getMaterialPool(this.elementsGL).getAbstraction(this.shape.material || this.sourceEntity.material || DefaultMaterialManager.getDefaultMaterial(this.renderable));
	}
}