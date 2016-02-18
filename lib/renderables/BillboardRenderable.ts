import AttributesBuffer				= require("awayjs-core/lib/attributes/AttributesBuffer");
import AssetEvent					= require("awayjs-core/lib/events/AssetEvent");
import Matrix3D						= require("awayjs-core/lib/geom/Matrix3D");
import Matrix3DUtils				= require("awayjs-core/lib/geom/Matrix3DUtils");
import Rectangle					= require("awayjs-core/lib/geom/Rectangle");

import IRenderOwner					= require("awayjs-display/lib/base/IRenderOwner");
import ElementsBase				= require("awayjs-display/lib/graphics/ElementsBase");
import TriangleElements			= require("awayjs-display/lib/graphics/TriangleElements");
import Billboard					= require("awayjs-display/lib/entities/Billboard");
import MaterialBase					= require("awayjs-display/lib/materials/MaterialBase");
import DefaultMaterialManager		= require("awayjs-display/lib/managers/DefaultMaterialManager");
import Camera						= require("awayjs-display/lib/entities/Camera");
import TextureBase					= require("awayjs-display/lib/textures/TextureBase");

import Stage						= require("awayjs-stagegl/lib/base/Stage");
import IContextGL					= require("awayjs-stagegl/lib/base/IContextGL");
import ContextGLProgramType			= require("awayjs-stagegl/lib/base/ContextGLProgramType");

import RendererBase					= require("awayjs-renderergl/lib/RendererBase");
import ShaderBase					= require("awayjs-renderergl/lib/shaders/ShaderBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
import ShaderRegisterData			= require("awayjs-renderergl/lib/shaders/ShaderRegisterData");
import ShaderRegisterElement		= require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");
import PassBase						= require("awayjs-renderergl/lib/render/passes/PassBase");
import RenderableBase				= require("awayjs-renderergl/lib/renderables/RenderableBase");

/**
 * @class away.pool.RenderableListItem
 */
class BillboardRenderable extends RenderableBase
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
		super(billboard, billboard, renderer);

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
			id = ((this.renderableOwner.style? this.renderableOwner.style.getSamplerAt(texture) || texture.getSamplerAt(0) : texture.getSamplerAt(0)) || DefaultMaterialManager.getDefaultSampler()).id;

		this._id = id;

		var elements:TriangleElements = BillboardRenderable._samplerElements[id];

		var width:number = this._billboard.billboardWidth;
		var height:number = this._billboard.billboardHeight;
		var billboardRect:Rectangle = this._billboard.billboardRect;

		if (!elements) {
			elements = BillboardRenderable._samplerElements[id] = new TriangleElements(new AttributesBuffer(11, 4));
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

	public _pGetRenderOwner():IRenderOwner
	{
		return this._billboard.material;
	}

}

export = BillboardRenderable;