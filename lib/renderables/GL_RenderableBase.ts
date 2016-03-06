import AbstractMethodError			= require("awayjs-core/lib/errors/AbstractMethodError");
import AssetEvent					= require("awayjs-core/lib/events/AssetEvent");
import Matrix						= require("awayjs-core/lib/geom/Matrix");
import Matrix3D						= require("awayjs-core/lib/geom/Matrix3D");
import ImageBase					= require("awayjs-core/lib/image/ImageBase");
import SamplerBase					= require("awayjs-core/lib/image/SamplerBase");
import AbstractionBase				= require("awayjs-core/lib/library/AbstractionBase");

import IRenderer					= require("awayjs-display/lib/IRenderer");
import IRenderable					= require("awayjs-display/lib/base/IRenderable");
import ISurface						= require("awayjs-display/lib/base/ISurface");
import ElementsBase					= require("awayjs-display/lib/graphics/ElementsBase");
import TriangleElements				= require("awayjs-display/lib/graphics/TriangleElements");
import IEntity						= require("awayjs-display/lib/display/IEntity");
import Camera						= require("awayjs-display/lib/display/Camera");
import RenderableEvent			= require("awayjs-display/lib/events/RenderableEvent");
import DefaultMaterialManager		= require("awayjs-display/lib/managers/DefaultMaterialManager");
import TextureBase					= require("awayjs-display/lib/textures/TextureBase");

import Stage						= require("awayjs-stagegl/lib/base/Stage");
import GL_ImageBase					= require("awayjs-stagegl/lib/image/GL_ImageBase");
import GL_SamplerBase				= require("awayjs-stagegl/lib/image/GL_SamplerBase");

import RendererBase					= require("awayjs-renderergl/lib/RendererBase");
import ShaderBase					= require("awayjs-renderergl/lib/shaders/ShaderBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
import ShaderRegisterData			= require("awayjs-renderergl/lib/shaders/ShaderRegisterData");
import GL_SurfaceBase				= require("awayjs-renderergl/lib/surfaces/GL_SurfaceBase");
import IPass						= require("awayjs-renderergl/lib/surfaces/passes/IPass");
import GL_ElementsBase				= require("awayjs-renderergl/lib/elements/GL_ElementsBase");
import AnimatorBase					= require("awayjs-renderergl/lib/animators/AnimatorBase");

/**
 * @class RenderableListItem
 */
class GL_RenderableBase extends AbstractionBase
{
	private _onSurfaceUpdatedDelegate:(event:RenderableEvent) => void;
	private _onInvalidateElementsDelegate:(event:RenderableEvent) => void;

	public _elements:ElementsBase;
	public _surfaceGL:GL_SurfaceBase;
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

	public get elements():ElementsBase
	{
		if (this._elementsDirty)
			this._updateElements();

		return this._elements;
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

		this._onSurfaceUpdatedDelegate = (event:RenderableEvent) => this._onSurfaceUpdated(event);
		this._onInvalidateElementsDelegate = (event:RenderableEvent) => this.onInvalidateElements(event);

		//store a reference to the pool for later disposal
		this._renderer = renderer;
		this._stage = renderer.stage;

		this.renderable = renderable;

		this.renderable.addEventListener(RenderableEvent.INVALIDATE_RENDER_OWNER, this._onSurfaceUpdatedDelegate);
		this.renderable.addEventListener(RenderableEvent.INVALIDATE_ELEMENTS, this._onInvalidateElementsDelegate);
	}

	public onClear(event:AssetEvent)
	{
		super.onClear(event);

		this.next = null;
		this.masksConfig = null;
		this.renderSceneTransform = null;

		this._renderer = null;
		this._stage = null;
		this.sourceEntity = null;

		this.renderable.removeEventListener(RenderableEvent.INVALIDATE_RENDER_OWNER, this._onSurfaceUpdatedDelegate);
		this.renderable.removeEventListener(RenderableEvent.INVALIDATE_ELEMENTS, this._onInvalidateElementsDelegate);
		this.renderable = null;

		this._surfaceGL.usages--;

		if (!this._surfaceGL.usages)
			this._surfaceGL.onClear(new AssetEvent(AssetEvent.CLEAR, this._surfaceGL.surface));

		this._surfaceGL = null;
		this._elements = null;
	}

	public onInvalidateElements(event:RenderableEvent)
	{
		this._elementsDirty = true;
	}

	private _onSurfaceUpdated(event:RenderableEvent)
	{
		this._surfaceDirty = true;
	}

	public _pGetElements():ElementsBase
	{
		throw new AbstractMethodError();
	}

	public _pGetSurface():ISurface
	{
		throw new AbstractMethodError();
	}

	/**
	 * Sets the surface state for the pass that is independent of the rendered object. This needs to be called before
	 * calling pass. Before activating a pass, the previously used pass needs to be deactivated.
	 * @param stage The Stage object which is currently used for rendering.
	 * @param camera The camera from which the scene is viewed.
	 * @private
	 */
	public _iActivate(pass:IPass, camera:Camera)
	{
		pass._iActivate(camera);
	}

	/**
	 * Renders an object to the current render target.
	 *
	 * @private
	 */
	public _iRender(pass:IPass, camera:Camera, viewProjection:Matrix3D)
	{
		this._setRenderState(pass, camera, viewProjection);

		if (this._elementsDirty)
			this._updateElements();

		pass.shader._elementsPool.getAbstraction((this.renderable.animator)? (<AnimatorBase> this.renderable.animator).getRenderableElements(this, this._elements) : this._elements)._iRender(this, camera, viewProjection);
	}

	public _setRenderState(pass:IPass, camera:Camera, viewProjection:Matrix3D)
	{
		pass._iRender(this, camera, viewProjection);
	}

	/**
	 * Clears the surface state for the pass. This needs to be called before activating another pass.
	 * @param stage The Stage used for rendering
	 *
	 * @private
	 */
	public _iDeactivate(pass:IPass)
	{
		pass._iDeactivate();
	}

	/**
	 * //TODO
	 *
	 * @private
	 */
	private _updateElements()
	{
		this._elements = this._pGetElements();

		this._elementsDirty = false;
	}

	private _updateSurface()
	{
		var surface:ISurface = this._pGetSurface() || DefaultMaterialManager.getDefaultMaterial(this.renderable);

		var surfaceGL:GL_SurfaceBase = <GL_SurfaceBase> this._renderer.getSurfacePool(this.elements).getAbstraction(surface);

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
		this.uvMatrix = this.renderable.style? this.renderable.style.uvMatrix : surface.style? surface.style.uvMatrix : null;

		var numTextures:number = surface.getNumTextures();
		var texture:TextureBase;
		var numImages:number;
		var image:ImageBase;
		var sampler:SamplerBase;
		var index:number;

		for (var i:number = 0; i < numTextures; i++) {
			texture = surface.getTextureAt(i);
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

export = GL_RenderableBase;