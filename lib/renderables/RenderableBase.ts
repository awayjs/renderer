import AbstractMethodError			= require("awayjs-core/lib/errors/AbstractMethodError");
import AssetEvent					= require("awayjs-core/lib/events/AssetEvent");
import Matrix3D						= require("awayjs-core/lib/geom/Matrix3D");
import SamplerBase					= require("awayjs-core/lib/image/SamplerBase");
import AbstractionBase				= require("awayjs-core/lib/library/AbstractionBase");

import IRenderer					= require("awayjs-display/lib/IRenderer");
import IRenderableOwner				= require("awayjs-display/lib/base/IRenderableOwner");
import IRenderOwner					= require("awayjs-display/lib/base/IRenderOwner");
import SubGeometryBase				= require("awayjs-display/lib/base/SubGeometryBase");
import TriangleSubGeometry			= require("awayjs-display/lib/base/TriangleSubGeometry");
import IEntity						= require("awayjs-display/lib/entities/IEntity");
import Camera						= require("awayjs-display/lib/entities/Camera");
import RenderableOwnerEvent			= require("awayjs-display/lib/events/RenderableOwnerEvent");
import MaterialBase					= require("awayjs-display/lib/materials/MaterialBase");
import DefaultMaterialManager		= require("awayjs-display/lib/managers/DefaultMaterialManager");


import Stage						= require("awayjs-stagegl/lib/base/Stage");
import GL_ImageBase					= require("awayjs-stagegl/lib/image/GL_ImageBase");

import RendererBase					= require("awayjs-renderergl/lib/RendererBase");
import ShaderBase					= require("awayjs-renderergl/lib/shaders/ShaderBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
import ShaderRegisterData			= require("awayjs-renderergl/lib/shaders/ShaderRegisterData");
import RenderBase					= require("awayjs-renderergl/lib/render/RenderBase");
import IPass						= require("awayjs-renderergl/lib/render/passes/IPass");
import SubGeometryVOBase			= require("awayjs-renderergl/lib/vos/SubGeometryVOBase");

/**
 * @class RenderableListItem
 */
class RenderableBase extends AbstractionBase
{
	private _onRenderOwnerUpdatedDelegate:(event:RenderableOwnerEvent) => void;
	private _onInvalidateGeometryDelegate:(event:RenderableOwnerEvent) => void;

	public _subGeometry:SubGeometryBase;
	public _subGeometryVO:SubGeometryVOBase;
	public _render:RenderBase;
	private _geometryDirty:boolean = true;
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

	public samplers:Array<SamplerBase> = new Array<SamplerBase>();

	public get subGeometryVO():SubGeometryVOBase
	{
		if (this._geometryDirty)
			this._updateGeometry();

		return this._subGeometryVO;
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
	constructor(renderableOwner:IRenderableOwner, sourceEntity:IEntity, renderOwner:IRenderOwner, renderer:RendererBase)
	{
		super(renderableOwner, renderer);

		this._onRenderOwnerUpdatedDelegate = (event:RenderableOwnerEvent) => this._onRenderOwnerUpdated(event);
		this._onInvalidateGeometryDelegate = (event:RenderableOwnerEvent) => this.onInvalidateGeometry(event);

		//store a reference to the pool for later disposal
		this._renderer = renderer;
		this._stage = renderer.stage;

		this.sourceEntity = sourceEntity;

		this.renderableOwner = renderableOwner;

		this.renderableOwner.addEventListener(RenderableOwnerEvent.INVALIDATE_RENDER_OWNER, this._onRenderOwnerUpdatedDelegate);
		this.renderableOwner.addEventListener(RenderableOwnerEvent.INVALIDATE_GEOMETRY, this._onInvalidateGeometryDelegate);
	}

	public onClear(event:AssetEvent)
	{
		super.onClear(event);

		this.next = null;
		this.masksConfig = null;
		this.renderSceneTransform = null;

		this._renderer.clearAbstraction(this.renderableOwner);
		this._renderer = null;
		this._stage = null;
		this.sourceEntity = null;

		this.renderableOwner.removeEventListener(RenderableOwnerEvent.INVALIDATE_RENDER_OWNER, this._onRenderOwnerUpdatedDelegate);
		this.renderableOwner = null;

		this._render.usages--;

		if (!this._render.usages)
			this._render.onClear(new AssetEvent(AssetEvent.CLEAR, this._render.renderOwner));

		this._render = null;

		if (this._subGeometryVO) {
			this._subGeometryVO.usages--;

			if (!this._subGeometryVO.usages)
				this._subGeometryVO.onClear(new AssetEvent(AssetEvent.CLEAR, this._subGeometry));

			this._subGeometryVO = null;
		}
	}

	public onInvalidateGeometry(event:RenderableOwnerEvent)
	{
		this._geometryDirty = true;
	}

	private _onRenderOwnerUpdated(event:RenderableOwnerEvent)
	{
		this._geometryDirty = true;
	}

	public _pGetSubGeometry():SubGeometryBase
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

		if (this._geometryDirty)
			this._updateGeometry();

		this._subGeometryVO._iRender(pass.shader);
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
	private _updateGeometry()
	{
		if (this._subGeometryVO) {
			this._subGeometryVO.usages--;

			if (!this._subGeometryVO.usages)
				this._subGeometryVO.onClear(new AssetEvent(AssetEvent.CLEAR, this._subGeometry));
		}

		this._subGeometry = this._pGetSubGeometry();
		this._subGeometryVO = <SubGeometryVOBase> this._stage.getAbstraction(this._subGeometry);
		this._subGeometryVO.usages++;

		this._geometryDirty = false;
	}

	private _updateRenderOwner()
	{
		var renderOwner:IRenderOwner = this._pGetRenderOwner() || DefaultMaterialManager.getDefaultMaterial(this.renderableOwner);

		var render:RenderBase = this._renderer.getRenderPool(this.renderableOwner).getAbstraction(renderOwner);

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

		//create a cache of image objects for the renderable
		var numImages:number = renderOwner.getNumImages();

		this.images.length = numImages;
		for (var i:number = 0; i < numImages; i++)
			this.images[i] = <GL_ImageBase> this._stage.getAbstraction(this.renderableOwner.getImageAt(i) || renderOwner.getImageAt(i));

		//create a cache of sampler objects for the renderable
		var numSamplers:number = renderOwner.getNumSamplers();

		this.samplers.length = numSamplers;
		for (var i:number = 0; i < numSamplers; i++)
			this.samplers[i] = this.renderableOwner.getSamplerAt(i) || renderOwner.getSamplerAt(i);
	}
}

export = RenderableBase;