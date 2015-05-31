import Matrix3D						= require("awayjs-core/lib/geom/Matrix3D");
import AbstractMethodError			= require("awayjs-core/lib/errors/AbstractMethodError");

import IRenderer					= require("awayjs-display/lib/IRenderer");
import IRenderableOwner				= require("awayjs-display/lib/base/IRenderableOwner");
import IRenderOwner					= require("awayjs-display/lib/base/IRenderOwner");
import SubGeometryBase				= require("awayjs-core/lib/data/SubGeometryBase");
import TriangleSubGeometry			= require("awayjs-core/lib/data/TriangleSubGeometry");
import IRenderable					= require("awayjs-display/lib/pool/IRenderable");
import IEntity						= require("awayjs-display/lib/entities/IEntity");
import Camera						= require("awayjs-display/lib/entities/Camera");
import RenderableOwnerEvent			= require("awayjs-display/lib/events/RenderableOwnerEvent");
import MaterialBase					= require("awayjs-display/lib/materials/MaterialBase");



import Stage						= require("awayjs-stagegl/lib/base/Stage");

import ShaderBase					= require("awayjs-renderergl/lib/shaders/ShaderBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
import ShaderRegisterData			= require("awayjs-renderergl/lib/shaders/ShaderRegisterData");
import RenderablePool				= require("awayjs-renderergl/lib/renderables/RenderablePool");
import RenderBase					= require("awayjs-renderergl/lib/render/RenderBase");
import IPass						= require("awayjs-renderergl/lib/render/passes/IPass");
import SubGeometryVOBase			= require("awayjs-renderergl/lib/vos/SubGeometryVOBase");
import SubGeometryVOPool			= require("awayjs-renderergl/lib/vos/SubGeometryVOPool");
/**
 * @class RenderableListItem
 */
class RenderableBase implements IRenderable
{
	private _onRenderOwnerUpdatedDelegate:(event:RenderableOwnerEvent) => void;

	public _subGeometryVOPool:SubGeometryVOPool;
	public _subGeometryVO:SubGeometryVOBase;
	private _geometryDirty:boolean = true;

	public JOINT_INDEX_FORMAT:string;
	public JOINT_WEIGHT_FORMAT:string;

	/**
	 *
	 */
	public _pool:RenderablePool;

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


	/**
	 *
	 */
	public renderOwner:IRenderOwner;

	/**
	 *
	 */
	public render:RenderBase;


	public get subGeometryVO():SubGeometryVOBase
	{
		if (this._geometryDirty)
			this._updateGeometry();

		return this._subGeometryVO;
	}
	/**
	 *
	 * @param sourceEntity
	 * @param renderableOwner
	 * @param subGeometry
	 * @param animationSubGeometry
	 */
	constructor(pool:RenderablePool, sourceEntity:IEntity, renderableOwner:IRenderableOwner, renderOwner:IRenderOwner, stage:Stage)
	{
		this._onRenderOwnerUpdatedDelegate = (event:RenderableOwnerEvent) => this._onRenderOwnerUpdated(event);

		//store a reference to the pool for later disposal
		this._pool = pool;
		this._stage = stage;

		this._subGeometryVOPool = SubGeometryVOPool.getPool();

		this.sourceEntity = sourceEntity;

		this.renderableOwner = renderableOwner;

		this.renderableOwner.addEventListener(RenderableOwnerEvent.RENDER_OWNER_UPDATED, this._onRenderOwnerUpdatedDelegate)

		this.renderOwner = renderOwner;
	}

	public dispose()
	{
		this._pool.disposeItem(this.renderableOwner);
	}

	public invalidateGeometry()
	{
		this._geometryDirty = true;
	}

	public _pGetSubGeometry():SubGeometryBase
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
		this._setRenderState(pass, camera, viewProjection)

		if (this._geometryDirty)
			this._updateGeometry();

		this._subGeometryVO._iRender(pass.shader, this._stage);
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
		this._subGeometryVO = this._subGeometryVOPool.getItem(this._pGetSubGeometry());

		this._geometryDirty = false;
	}

	private _onRenderOwnerUpdated(event:RenderableOwnerEvent)
	{
		//TODO flag unused renders for deletion
		this.renderOwner = event.renderOwner;
	}
}

export = RenderableBase;