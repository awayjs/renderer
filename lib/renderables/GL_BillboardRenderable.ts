import AttributesBuffer				from "awayjs-core/lib/attributes/AttributesBuffer";
import AssetEvent					from "awayjs-core/lib/events/AssetEvent";
import Rectangle					from "awayjs-core/lib/geom/Rectangle";

import ISurface						from "awayjs-display/lib/base/ISurface";
import ElementsBase					from "awayjs-display/lib/graphics/ElementsBase";
import TriangleElements				from "awayjs-display/lib/graphics/TriangleElements";
import Billboard					from "awayjs-display/lib/display/Billboard";
import DefaultMaterialManager		from "awayjs-display/lib/managers/DefaultMaterialManager";
import TextureBase					from "awayjs-display/lib/textures/TextureBase";

import RendererBase					from "../RendererBase";
import GL_RenderableBase			from "../renderables/GL_RenderableBase";

/**
 * @class away.pool.RenderableListItem
 */
class GL_Billboard extends GL_RenderableBase
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

	public onClear(event:AssetEvent)
	{
		super.onClear(event);

		this._billboard = null;
	}

	/**
	 * //TODO
	 *
	 * @returns {away.base.TriangleElements}
	 */
	public _pGetElements():ElementsBase
	{
		var texture:TextureBase = this._billboard.material.getTextureAt(0);

		var id:number = -1;

		if (texture)
			id = ((this.renderable.style? this.renderable.style.getSamplerAt(texture) || texture.getSamplerAt(0) : texture.getSamplerAt(0)) || DefaultMaterialManager.getDefaultSampler()).id;

		this._id = id;

		var elements:TriangleElements = GL_Billboard._samplerElements[id];

		var width:number = this._billboard.billboardWidth;
		var height:number = this._billboard.billboardHeight;
		var billboardRect:Rectangle = this._billboard.billboardRect;

		if (!elements) {
			elements = GL_Billboard._samplerElements[id] = new TriangleElements(new AttributesBuffer(11, 4));
			elements.autoDeriveNormals = false;
			elements.autoDeriveTangents = false;
			elements.setIndices(Array<number>(0, 1, 2, 0, 2, 3));
			elements.setPositions(Array<number>(-billboardRect.x, height-billboardRect.y, 0, width-billboardRect.x, height-billboardRect.y, 0, width-billboardRect.x, -billboardRect.y, 0, -billboardRect.x, -billboardRect.y, 0));
			elements.setNormals(Array<number>(1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0));
			elements.setTangents(Array<number>(0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1));
			elements.setUVs(Array<number>(0, 0, 1, 0, 1, 1, 0, 1));
		} else {
			elements.setPositions(Array<number>(-billboardRect.x, height-billboardRect.y, 0, width-billboardRect.x, height-billboardRect.y, 0, width-billboardRect.x, -billboardRect.y, 0, -billboardRect.x, -billboardRect.y, 0));
		}

		return elements;
	}

	public _pGetSurface():ISurface
	{
		return this._billboard.material;
	}

}

export default GL_Billboard;