import AbstractMethodError			= require("awayjs-core/lib/errors/AbstractMethodError");
import AssetEvent					= require("awayjs-core/lib/events/AssetEvent");
import Matrix3D						= require("awayjs-core/lib/geom/Matrix3D");
import ImageBase					= require("awayjs-core/lib/image/ImageBase");
import SamplerBase					= require("awayjs-core/lib/image/SamplerBase");
import AbstractionBase				= require("awayjs-core/lib/library/AbstractionBase");

import IRenderer					= require("awayjs-display/lib/IRenderer");
import IRenderableOwner				= require("awayjs-display/lib/base/IRenderableOwner");
import IRenderOwner					= require("awayjs-display/lib/base/IRenderOwner");
import ElementsBase					= require("awayjs-display/lib/graphics/ElementsBase");
import TriangleElements				= require("awayjs-display/lib/graphics/TriangleElements");
import IEntity						= require("awayjs-display/lib/entities/IEntity");
import Camera						= require("awayjs-display/lib/entities/Camera");
import RenderableOwnerEvent			= require("awayjs-display/lib/events/RenderableOwnerEvent");
import DefaultMaterialManager		= require("awayjs-display/lib/managers/DefaultMaterialManager");
import TextureBase					= require("awayjs-display/lib/textures/TextureBase");

import Stage						= require("awayjs-stagegl/lib/base/Stage");
import GL_ImageBase					= require("awayjs-stagegl/lib/image/GL_ImageBase");
import GL_SamplerBase				= require("awayjs-stagegl/lib/image/GL_SamplerBase");

import RendererBase					= require("awayjs-renderergl/lib/RendererBase");
import ShaderBase					= require("awayjs-renderergl/lib/shaders/ShaderBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
import ShaderRegisterData			= require("awayjs-renderergl/lib/shaders/ShaderRegisterData");
import RenderBase					= require("awayjs-renderergl/lib/render/RenderBase");
import IPass						= require("awayjs-renderergl/lib/render/passes/IPass");
import GL_ElementsBase				= require("awayjs-renderergl/lib/elements/GL_ElementsBase");
import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");

/**
 * @class RenderableListItem
 */
class RenderableBase extends AbstractionBase
{
	private _onRenderOwnerUpdatedDelegate:(event:RenderableOwnerEvent) => void;
	private _onInvalidateElementsDelegate:(event:RenderableOwnerEvent) => void;

	public _elements:ElementsBase;
	public _render:RenderBase;
	private _elementsDirty:boolean = true;
	private _renderOwnerDirty:boolean = true;

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
	public next:RenderableBase;

	public id:number;

	/**
	 *
	 */
	public renderId:number;

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
	public renderableOwner:IRenderableOwner;

	public images:Array<GL_ImageBase> = new Array<GL_ImageBase>();

	public samplers:Array<GL_SamplerBase> = new Array<GL_SamplerBase>();

	public get elements():ElementsBase
	{
		if (this._elementsDirty)
			this._updateElements();

		return this._elements;
	}

	public get render():RenderBase
	{
		if (this._renderOwnerDirty)
			this._updateRenderOwner();

		return this._render;
	}


	/**
	 *
	 * @param renderableOwner
	 * @param sourceEntity
	 * @param renderOwner
	 * @param renderer
	 */
	constructor(renderableOwner:IRenderableOwner, sourceEntity:IEntity, renderer:RendererBase)
	{
		super(renderableOwner, renderer);

		this._onRenderOwnerUpdatedDelegate = (event:RenderableOwnerEvent) => this._onRenderOwnerUpdated(event);
		this._onInvalidateElementsDelegate = (event:RenderableOwnerEvent) => this.onInvalidateElements(event);

		//store a reference to the pool for later disposal
		this._renderer = renderer;
		this._stage = renderer.stage;

		this.sourceEntity = sourceEntity;

		this.renderableOwner = renderableOwner;

		this.renderableOwner.addEventListener(RenderableOwnerEvent.INVALIDATE_RENDER_OWNER, this._onRenderOwnerUpdatedDelegate);
		this.renderableOwner.addEventListener(RenderableOwnerEvent.INVALIDATE_ELEMENTS, this._onInvalidateElementsDelegate);
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

		this.renderableOwner.removeEventListener(RenderableOwnerEvent.INVALIDATE_RENDER_OWNER, this._onRenderOwnerUpdatedDelegate);
		this.renderableOwner = null;

		this._render.usages--;

		if (!this._render.usages)
			this._render.onClear(new AssetEvent(AssetEvent.CLEAR, this._render.renderOwner));

		this._render = null;
		this._elements = null;
	}

	public onInvalidateElements(event:RenderableOwnerEvent)
	{
		this._elementsDirty = true;
	}

	private _onRenderOwnerUpdated(event:RenderableOwnerEvent)
	{
		this._renderOwnerDirty = true;
	}

	public _pGetElements():ElementsBase
	{
		throw new AbstractMethodError();
	}

	public _pGetRenderOwner():IRenderOwner
	{
		throw new AbstractMethodError();
	}

	/**
	 * Sets the render state for the pass that is independent of the rendered object. This needs to be called before
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

		pass.shader._elementsPool.getAbstraction((this.renderableOwner.animator)? (<AnimatorBase> this.renderableOwner.animator).getRenderableElements(this, this._elements) : this._elements)._iRender(this.sourceEntity, camera, viewProjection);
	}

	public _setRenderState(pass:IPass, camera:Camera, viewProjection:Matrix3D)
	{
		pass._iRender(this, camera, viewProjection);
	}

	/**
	 * Clears the render state for the pass. This needs to be called before activating another pass.
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

	private _updateRenderOwner()
	{
		var renderOwner:IRenderOwner = this._pGetRenderOwner() || DefaultMaterialManager.getDefaultMaterial(this.renderableOwner);

		var render:RenderBase = <RenderBase> this._renderer.getRenderPool(this.elements).getAbstraction(renderOwner);

		if (this._render != render) {

			if (this._render) {
				this._render.usages--;

				//dispose current render object
				if (!this._render.usages)
					this._render.onClear(new AssetEvent(AssetEvent.CLEAR, this._render.renderOwner));
			}

			this._render = render;

			this._render.usages++;
		}

		//create a cache of image & sampler objects for the renderable
		var numImages:number = render.numImages;

		this.images.length = numImages;
		this.samplers.length = numImages;

		var numTextures:number = renderOwner.getNumTextures();
		var texture:TextureBase;
		var numImages:number;
		var image:ImageBase;
		var sampler:SamplerBase;
		var index:number;

		for (var i:number = 0; i < numTextures; i++) {
			texture = renderOwner.getTextureAt(i);
			numImages = texture.getNumImages();
			for (var j:number = 0; j < numImages; j++) {
				index = render.getImageIndex(texture, j);
				image =  this.renderableOwner.style? this.renderableOwner.style.getImageAt(texture, j) : null;
				this.images[index] = image? <GL_ImageBase> this._stage.getAbstraction(image) : null;
				sampler = this.renderableOwner.style? this.renderableOwner.style.getSamplerAt(texture, j) : null;
				this.samplers[index] = sampler? <GL_SamplerBase> this._stage.getAbstraction(sampler) : null;
			}
		}

		this._renderOwnerDirty = false;
	}
}

export = RenderableBase;