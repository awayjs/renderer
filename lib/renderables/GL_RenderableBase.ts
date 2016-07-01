import {AbstractMethodError}			from "@awayjs/core/lib/errors/AbstractMethodError";
import {AssetEvent}					from "@awayjs/core/lib/events/AssetEvent";
import {Matrix}						from "@awayjs/core/lib/geom/Matrix";
import {Matrix3D}						from "@awayjs/core/lib/geom/Matrix3D";
import {ImageBase}					from "@awayjs/core/lib/image/ImageBase";
import {SamplerBase}					from "@awayjs/core/lib/image/SamplerBase";
import {AbstractionBase}				from "@awayjs/core/lib/library/AbstractionBase";

import {IRenderable}					from "@awayjs/display/lib/base/IRenderable";
import {ISurface}						from "@awayjs/display/lib/base/ISurface";
import {ElementsBase}					from "@awayjs/display/lib/graphics/ElementsBase";
import {IEntity}						from "@awayjs/display/lib/display/IEntity";
import {Camera}						from "@awayjs/display/lib/display/Camera";
import {RenderableEvent}				from "@awayjs/display/lib/events/RenderableEvent";
import {DefaultMaterialManager}		from "@awayjs/display/lib/managers/DefaultMaterialManager";
import {TextureBase}					from "@awayjs/display/lib/textures/TextureBase";

import {Stage}						from "@awayjs/stage/lib/base/Stage";
import {GL_ImageBase}					from "@awayjs/stage/lib/image/GL_ImageBase";
import {GL_SamplerBase}				from "@awayjs/stage/lib/image/GL_SamplerBase";

import {RendererBase}					from "../RendererBase";
import {GL_SurfaceBase}				from "../surfaces/GL_SurfaceBase";
import {IPass}						from "../surfaces/passes/IPass";
import {GL_ElementsBase}				from "../elements/GL_ElementsBase";

/**
 * @class RenderableListItem
 */
export class GL_RenderableBase extends AbstractionBase
{
	private _onInvalidateSurfaceDelegate:(event:RenderableEvent) => void;
	private _onInvalidateElementsDelegate:(event:RenderableEvent) => void;

	public _count:number = 0;
	public _offset:number = 0;
	private _elementsGL:GL_ElementsBase;
	private _surfaceGL:GL_SurfaceBase;
	private _elementsDirty:boolean = true;
	private _surfaceDirty:boolean = true;

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
	public surfaceID:number;

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

	public get surfaceGL():GL_SurfaceBase
	{
		if (this._surfaceDirty)
			this._updateSurface();

		return this._surfaceGL;
	}


	/**
	 *
	 * @param renderable
	 * @param sourceEntity
	 * @param surface
	 * @param renderer
	 */
	constructor(renderable:IRenderable, renderer:RendererBase)
	{
		super(renderable, renderer);

		this._onInvalidateSurfaceDelegate = (event:RenderableEvent) => this._onInvalidateSurface(event);
		this._onInvalidateElementsDelegate = (event:RenderableEvent) => this.onInvalidateElements(event);

		//store a reference to the pool for later disposal
		this._renderer = renderer;
		this._stage = renderer.stage;

		this.renderable = renderable;

		this.renderable.addEventListener(RenderableEvent.INVALIDATE_SURFACE, this._onInvalidateSurfaceDelegate);
		this.renderable.addEventListener(RenderableEvent.INVALIDATE_ELEMENTS, this._onInvalidateElementsDelegate);
	}

	public onClear(event:AssetEvent):void
	{
		super.onClear(event);

		this.next = null;
		this.masksConfig = null;
		this.renderSceneTransform = null;

		this._renderer = null;
		this._stage = null;
		this.sourceEntity = null;

		this.renderable.removeEventListener(RenderableEvent.INVALIDATE_SURFACE, this._onInvalidateSurfaceDelegate);
		this.renderable.removeEventListener(RenderableEvent.INVALIDATE_ELEMENTS, this._onInvalidateElementsDelegate);
		this.renderable = null;

		this._surfaceGL.usages--;

		if (!this._surfaceGL.usages)
			this._surfaceGL.onClear(new AssetEvent(AssetEvent.CLEAR, this._surfaceGL.surface));

		this._surfaceGL = null;
		this._elementsGL = null;
	}

	public onInvalidateElements(event:RenderableEvent):void
	{
		this._elementsDirty = true;
	}

	private _onInvalidateSurface(event:RenderableEvent):void
	{
		this._surfaceDirty = true;
	}

	public _pGetElements():GL_ElementsBase
	{
		throw new AbstractMethodError();
	}

	public _pGetSurface():GL_SurfaceBase
	{
		throw new AbstractMethodError();
	}

	/**
	 * Renders an object to the current render target.
	 *
	 * @private
	 */
	public _iRender(pass:IPass, camera:Camera, viewProjection:Matrix3D):void
	{
		this._setRenderState(pass, camera, viewProjection);

		this._elementsGL.draw(this, pass.shader, camera, viewProjection, this._count, this._offset)
	}

	public _setRenderState(pass:IPass, camera:Camera, viewProjection:Matrix3D):void
	{
		if (this._elementsDirty)
			this._updateElements();

		pass._setRenderState(this, camera, viewProjection);
		
		if (pass.shader.activeElements != this._elementsGL) {
			pass.shader.activeElements = this._elementsGL;
			this._elementsGL._setRenderState(this, pass.shader, camera, viewProjection);
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

	private _updateSurface():void
	{
		var surfaceGL:GL_SurfaceBase = this._pGetSurface();

		if (this._surfaceGL != surfaceGL) {

			if (this._surfaceGL) {
				this._surfaceGL.usages--;

				//dispose current surfaceGL object
				if (!this._surfaceGL.usages)
					this._surfaceGL.onClear(new AssetEvent(AssetEvent.CLEAR, this._surfaceGL.surface));
			}

			this._surfaceGL = surfaceGL;

			this._surfaceGL.usages++;
		}

		//create a cache of image & sampler objects for the renderable
		var numImages:number = surfaceGL.numImages;

		this.images.length = numImages;
		this.samplers.length = numImages;
		this.uvMatrix = this.renderable.style? this.renderable.style.uvMatrix : this._surfaceGL.surface.style? this._surfaceGL.surface.style.uvMatrix : null;

		var numTextures:number = this._surfaceGL.surface.getNumTextures();
		var texture:TextureBase;
		var numImages:number;
		var image:ImageBase;
		var sampler:SamplerBase;
		var index:number;

		for (var i:number = 0; i < numTextures; i++) {
			texture = this._surfaceGL.surface.getTextureAt(i);
			numImages = texture.getNumImages();
			for (var j:number = 0; j < numImages; j++) {
				index = surfaceGL.getImageIndex(texture, j);
				image =  this.renderable.style? this.renderable.style.getImageAt(texture, j) : null;
				this.images[index] = image? <GL_ImageBase> this._stage.getAbstraction(image) : null;
				sampler = this.renderable.style? this.renderable.style.getSamplerAt(texture, j) : null;
				this.samplers[index] = sampler? <GL_SamplerBase> this._stage.getAbstraction(sampler) : null;
			}
		}

		this._surfaceDirty = false;
	}
}