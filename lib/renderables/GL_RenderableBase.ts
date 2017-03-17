import {AbstractMethodError, AssetEvent, Matrix, Matrix3D, AbstractionBase, ProjectionBase} from "@awayjs/core";

import {ImageBase, SamplerBase, IRenderable, IEntity, IMaterial, Style, RenderableEvent, TextureBase} from "@awayjs/graphics";

import {Stage, GL_ImageBase, GL_SamplerBase} from "@awayjs/stage";

import {GL_ElementsBase} from "../elements/GL_ElementsBase";
import {GL_MaterialBase} from "../materials/GL_MaterialBase";
import {IPass} from "../materials/passes/IPass";

import {RendererBase} from "../RendererBase";

import {RenderablePool} from "./RenderablePool";

/**
 * @class RenderableListItem
 */
export class GL_RenderableBase extends AbstractionBase
{
	private _onInvalidateMaterialDelegate:(event:RenderableEvent) => void;
	private _onInvalidateElementsDelegate:(event:RenderableEvent) => void;

	public _count:number = 0;
	public _offset:number = 0;
	
	private _elementsGL:GL_ElementsBase;
	private _materialGL:GL_MaterialBase;
	private _elementsDirty:boolean = true;
	private _materialDirty:boolean = true;

	public JOINT_INDEX_FORMAT:string;
	public JOINT_WEIGHT_FORMAT:string;

	/**
	 *
	 */
	public _renderer:RendererBase;

	public _stage:Stage;

	/**
	 *
	 */
	public next:GL_RenderableBase;

	public id:number;

	/**
	 *
	 */
	public materialID:number;

	/**
	 *
	 */
	public renderOrderId:number;

	/**
	 *
	 */
	public zIndex:number;

	/**
	 *
	 */
	public maskId:number;

	/**
	 *
	 */
	public masksConfig:Array<Array<number>>;

	/**
	 *
	 */
	public cascaded:boolean;

	/**
	 *
	 */
	public renderSceneTransform:Matrix3D;

	/**
	 *
	 */
	public sourceEntity:IEntity;

	/**
	 *
	 */
	public renderable:IRenderable;

	public uvMatrix:Matrix;
	
	public images:Array<GL_ImageBase> = new Array<GL_ImageBase>();

	public samplers:Array<GL_SamplerBase> = new Array<GL_SamplerBase>();

	public get elementsGL():GL_ElementsBase
	{
		if (this._elementsDirty)
			this._updateElements();

		return this._elementsGL;
	}

	public get materialGL():GL_MaterialBase
	{
		if (this._materialDirty)
			this._updateMaterial();

		return this._materialGL;
	}


	/**
	 *
	 * @param renderable
	 * @param sourceEntity
	 * @param surface
	 * @param renderer
	 */
	constructor(renderable:IRenderable, entity:IEntity, renderer:RendererBase, pool:RenderablePool)
	{
		super(renderable, pool);

		this._onInvalidateMaterialDelegate = (event:RenderableEvent) => this._onInvalidateMaterial(event);
		this._onInvalidateElementsDelegate = (event:RenderableEvent) => this.onInvalidateElements(event);

		//store references
		this.sourceEntity = entity;
		this._renderer = renderer;
		this._stage = renderer.stage;

		this.renderable = renderable;

		this.renderable.addEventListener(RenderableEvent.INVALIDATE_MATERIAL, this._onInvalidateMaterialDelegate);
		this.renderable.addEventListener(RenderableEvent.INVALIDATE_ELEMENTS, this._onInvalidateElementsDelegate);
	}

	public onClear(event:AssetEvent):void
	{
		super.onClear(event);

		this.next = null;
		this.masksConfig = null;
		this.renderSceneTransform = null;

		this.sourceEntity = null;
		this._renderer = null;
		this._stage = null;

		this.renderable.removeEventListener(RenderableEvent.INVALIDATE_MATERIAL, this._onInvalidateMaterialDelegate);
		this.renderable.removeEventListener(RenderableEvent.INVALIDATE_ELEMENTS, this._onInvalidateElementsDelegate);
		this.renderable = null;

		this._materialGL.usages--;

		if (!this._materialGL.usages)
			this._materialGL.onClear(new AssetEvent(AssetEvent.CLEAR, this._materialGL.material));

		this._materialGL = null;
		this._elementsGL = null;
	}

	public onInvalidateElements(event:RenderableEvent):void
	{
		this._elementsDirty = true;
	}

	private _onInvalidateMaterial(event:RenderableEvent):void
	{
		this._materialDirty = true;
	}

	public _pGetElements():GL_ElementsBase
	{
		throw new AbstractMethodError();
	}

	public _pGetMaterial():GL_MaterialBase
	{
		throw new AbstractMethodError();
	}

	/**
	 * Renders an object to the current render target.
	 *
	 * @private
	 */
	public _iRender(pass:IPass, projection:ProjectionBase):void
	{
		this._setRenderState(pass, projection);

		this._elementsGL.draw(this, pass.shader, projection, this._count, this._offset)
	}

	public _setRenderState(pass:IPass, projection:ProjectionBase):void
	{
		if (this._elementsDirty)
			this._updateElements();

		pass._setRenderState(this, projection);
		
		if (pass.shader.activeElements != this._elementsGL) {
			pass.shader.activeElements = this._elementsGL;
			this._elementsGL._setRenderState(this, pass.shader, projection);
		}
	}

	/**
	 * //TODO
	 *
	 * @private
	 */
	private _updateElements():void
	{
		this._elementsGL = this._pGetElements();

		this._elementsDirty = false;
	}

	private _updateMaterial():void
	{
		var materialGL:GL_MaterialBase = this._pGetMaterial();

		if (this._materialGL != materialGL) {

			if (this._materialGL) {
				this._materialGL.usages--;

				//dispose current materialGL object
				if (!this._materialGL.usages)
					this._materialGL.onClear(new AssetEvent(AssetEvent.CLEAR, this._materialGL.material));
			}

			this._materialGL = materialGL;

			this._materialGL.usages++;
		}

		//create a cache of image & sampler objects for the renderable
		var numImages:number = materialGL.numImages;
		var style:Style = this.renderable.style || this.sourceEntity.style;
		var material:IMaterial = this._materialGL.material;

		this.images.length = numImages;
		this.samplers.length = numImages;
		this.uvMatrix = style? style.uvMatrix : material.style? material.style.uvMatrix : null;

		var numTextures:number = this._materialGL.material.getNumTextures();
		var texture:TextureBase;
		var numImages:number;
		var image:ImageBase;
		var sampler:SamplerBase;
		var index:number;

		for (var i:number = 0; i < numTextures; i++) {
			texture = material.getTextureAt(i);
			numImages = texture.getNumImages();
			for (var j:number = 0; j < numImages; j++) {
				index = materialGL.getImageIndex(texture, j);
				image =  style? style.getImageAt(texture, j) : null;
				this.images[index] = image? <GL_ImageBase> this._stage.getAbstraction(image) : null;
				sampler = style? style.getSamplerAt(texture, j) : null;
				this.samplers[index] = sampler? <GL_SamplerBase> this._stage.getAbstraction(sampler) : null;
			}
		}

		this._materialDirty = false;
	}
}