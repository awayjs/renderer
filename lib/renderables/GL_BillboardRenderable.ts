import {AttributesBuffer}				from "@awayjs/core/lib/attributes/AttributesBuffer";
import {AssetEvent}					from "@awayjs/core/lib/events/AssetEvent";
import {Rectangle}					from "@awayjs/core/lib/geom/Rectangle";

import {TriangleElements}				from "@awayjs/display/lib/graphics/TriangleElements";
import {Billboard}					from "@awayjs/display/lib/display/Billboard";
import {DefaultMaterialManager}		from "@awayjs/display/lib/managers/DefaultMaterialManager";
import {TextureBase}					from "@awayjs/display/lib/textures/TextureBase";

import {RendererBase}					from "../RendererBase";
import {GL_ElementsBase}				from "../elements/GL_ElementsBase";
import {GL_RenderableBase}			from "../renderables/GL_RenderableBase";
import {GL_SurfaceBase}				from "../surfaces/GL_SurfaceBase";

/**
 * @class away.pool.RenderableListItem
 */
export class GL_BillboardRenderable extends GL_RenderableBase
{
	private static _samplerElements:Object = new Object();

	/**
	 *
	 */
	private _billboard:Billboard;

	public _id:number;

	/**
	 * //TODO
	 *
	 * @param pool
	 * @param billboard
	 */
	constructor(billboard:Billboard, renderer:RendererBase)
	{
		super(billboard, renderer);

		this._billboard = billboard;
	}

	public onClear(event:AssetEvent):void
	{
		super.onClear(event);

		this._billboard = null;
	}

	/**
	 * //TODO
	 *
	 * @returns {away.base.TriangleElements}
	 */
	public _pGetElements():GL_ElementsBase
	{
		var texture:TextureBase = this._billboard.material.getTextureAt(0);

		var id:number = -1;

		if (texture)
			id = ((this.renderable.style? this.renderable.style.getSamplerAt(texture) || texture.getSamplerAt(0) : texture.getSamplerAt(0)) || DefaultMaterialManager.getDefaultSampler()).id;

		this._id = id;

		var elements:TriangleElements = GL_BillboardRenderable._samplerElements[id];

		var width:number = this._billboard.billboardWidth;
		var height:number = this._billboard.billboardHeight;
		var billboardRect:Rectangle = this._billboard.billboardRect;

		if (!elements) {
			elements = GL_BillboardRenderable._samplerElements[id] = new TriangleElements(new AttributesBuffer(11, 4));
			elements.autoDeriveNormals = false;
			elements.autoDeriveTangents = false;
			elements.setIndices(Array<number>(0, 1, 2, 0, 2, 3));
			elements.setPositions(Array<number>(-billboardRect.x, -billboardRect.y, 0, width-billboardRect.x, -billboardRect.y, 0, width-billboardRect.x, height-billboardRect.y, 0, -billboardRect.x, height-billboardRect.y, 0));
			elements.setNormals(Array<number>(1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0));
			elements.setTangents(Array<number>(0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1));
			elements.setUVs(Array<number>(0, 0, 1, 0, 1, 1, 0, 1));
		} else {
			elements.setPositions(Array<number>(-billboardRect.x, -billboardRect.y, 0, width-billboardRect.x, -billboardRect.y, 0, width-billboardRect.x, height-billboardRect.y, 0, -billboardRect.x, height-billboardRect.y, 0));
		}

		return <GL_ElementsBase> this._stage.getAbstraction(elements);
	}

	public _pGetSurface():GL_SurfaceBase
	{
		return this._renderer.getSurfacePool(this.elementsGL).getAbstraction(this._billboard.material || DefaultMaterialManager.getDefaultMaterial(this.renderable));
	}

}