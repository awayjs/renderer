import Matrix3D						= require("awayjs-core/lib/geom/Matrix3D");
import AbstractMethodError			= require("awayjs-core/lib/errors/AbstractMethodError");

import IRenderableOwner				= require("awayjs-display/lib/base/IRenderableOwner");
import IRenderObjectOwner			= require("awayjs-display/lib/base/IRenderObjectOwner");
import SubGeometryBase				= require("awayjs-core/lib/data/SubGeometryBase");
import TriangleSubGeometry			= require("awayjs-core/lib/data/TriangleSubGeometry");
import IRenderable					= require("awayjs-display/lib/pool/IRenderable");
import IEntity						= require("awayjs-display/lib/entities/IEntity");
import Camera						= require("awayjs-display/lib/entities/Camera");
import RenderableOwnerEvent			= require("awayjs-display/lib/events/RenderableOwnerEvent");
import SubGeometryEvent				= require("awayjs-core/lib/events/SubGeometryEvent");
import IRenderer					= require("awayjs-display/lib/render/IRenderer");
import MaterialBase					= require("awayjs-display/lib/materials/MaterialBase");

import IndexData					= require("awayjs-stagegl/lib/pool/IndexData");
import IndexDataPool				= require("awayjs-stagegl/lib/pool/IndexDataPool");
import VertexData					= require("awayjs-stagegl/lib/pool/VertexData");
import VertexDataPool				= require("awayjs-stagegl/lib/pool/VertexDataPool");
import Stage						= require("awayjs-stagegl/lib/base/Stage");

import ShaderObjectBase				= require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
import ShaderRegisterData			= require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
import RenderablePoolBase			= require("awayjs-renderergl/lib/pool/RenderablePoolBase");
import RenderObjectBase				= require("awayjs-renderergl/lib/compilation/RenderObjectBase");
import RenderPassBase				= require("awayjs-renderergl/lib/passes/RenderPassBase");

/**
 * @class RenderableListItem
 */
class RenderableBase implements IRenderable
{

	private _onIndicesUpdatedDelegate:(event:SubGeometryEvent) => void;
	private _onVerticesUpdatedDelegate:(event:SubGeometryEvent) => void;
	private _onRenderObjectOwnerUpdatedDelegate:(event:RenderableOwnerEvent) => void;

	private _subGeometry:SubGeometryBase;
	private _geometryDirty:boolean = true;
	private _indexData:IndexData;
	private _indexDataDirty:boolean = true;
	private _vertexData:Object = new Object();
	public _pVertexDataDirty:Object = new Object();
	private _vertexOffset:Object = new Object();

	public _level:number;
	private _indexOffset:number;
	private _overflow:RenderableBase;
	private _numTriangles:number;
	private _concatenateArrays:boolean;

	public JOINT_INDEX_FORMAT:string;
	public JOINT_WEIGHT_FORMAT:string;

	/**
	 *
	 */
	public _pool:RenderablePoolBase;

	public _stage:Stage;

	/**
	 *
	 */
	public get overflow():RenderableBase
	{
		if (this._indexDataDirty)
			this._updateIndexData();

		return this._overflow;
	}

	/**
	 *
	 */
	public get numTriangles():number
	{
		return this._numTriangles;
	}

	/**
	 *
	 */
	public next:RenderableBase;

	public id:number;

	/**
	 *
	 */
	public renderObjectId:number;

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
	public renderObjectOwner:IRenderObjectOwner;

	/**
	 *
	 */
	public renderObject:RenderObjectBase;

	/**
	 *
	 */
	public getIndexData():IndexData
	{
		if (this._indexDataDirty)
			this._updateIndexData();

		return this._indexData;
	}

	/**
	 *
	 */
	public getVertexData(dataType:string):VertexData
	{
		if (this._indexDataDirty)
			this._updateIndexData();

		if (this._pVertexDataDirty[dataType])
			this._updateVertexData(dataType);

		return this._vertexData[this._concatenateArrays? TriangleSubGeometry.VERTEX_DATA : dataType]
	}

	/**
	 *
	 */
	public getVertexOffset(dataType:string):number
	{
		if (this._indexDataDirty)
			this._updateIndexData();

		if (this._pVertexDataDirty[dataType])
			this._updateVertexData(dataType);

		return this._vertexOffset[dataType];
	}

	/**
	 *
	 * @param sourceEntity
	 * @param renderableOwner
	 * @param subGeometry
	 * @param animationSubGeometry
	 */
	constructor(pool:RenderablePoolBase, sourceEntity:IEntity, renderableOwner:IRenderableOwner, renderObjectOwner:IRenderObjectOwner, stage:Stage, level:number = 0, indexOffset:number = 0)
	{
		this._onIndicesUpdatedDelegate = (event:SubGeometryEvent) => this._onIndicesUpdated(event);
		this._onVerticesUpdatedDelegate = (event:SubGeometryEvent) => this._onVerticesUpdated(event);
		this._onRenderObjectOwnerUpdatedDelegate = (event:RenderableOwnerEvent) => this._onRenderObjectOwnerUpdated(event);

		//store a reference to the pool for later disposal
		this._pool = pool;
		this._stage = stage;

		//reference to level of overflow
		this._level = level;

		//reference to the offset on indices (if this is an overflow renderable)
		this._indexOffset = indexOffset;

		this.sourceEntity = sourceEntity;

		this.renderableOwner = renderableOwner;

		this.renderableOwner.addEventListener(RenderableOwnerEvent.RENDER_OBJECT_OWNER_UPDATED, this._onRenderObjectOwnerUpdatedDelegate)

		this.renderObjectOwner = renderObjectOwner;
	}

	public dispose()
	{
		this._pool.disposeItem(this.renderableOwner);

		this._indexData.dispose();
		this._indexData = null;

		for (var dataType in this._vertexData) {
			(<VertexData> this._vertexData[dataType]).dispose();
			this._vertexData[dataType] = null;
		}

		if (this._overflow) {
			this._overflow.dispose();
			this._overflow = null;
		}
	}

	public invalidateGeometry()
	{
		this._geometryDirty = true;

		//invalidate indices
		if (this._level == 0)
			this._indexDataDirty = true;

		if (this._overflow)
			this._overflow.invalidateGeometry();
	}

	/**
	 *
	 */
	public invalidateIndexData()
	{
		this._indexDataDirty = true;
	}

	/**
	 * //TODO
	 *
	 * @param dataType
	 */
	public invalidateVertexData(dataType:string)
	{
		this._pVertexDataDirty[dataType] = true;
	}

	public _pGetSubGeometry():SubGeometryBase
	{
		throw new AbstractMethodError();
	}

	public static _iGetVertexCode(shaderObject:ShaderObjectBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return "";
	}

	public static _iGetFragmentCode(shaderObject:ShaderObjectBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return "";
	}

	/**
	 * //TODO
	 *
	 * @param subGeometry
	 * @param offset
	 * @internal
	 */
	public _iFillIndexData(indexOffset:number)
	{
		if (this._geometryDirty)
			this._updateGeometry();

		this._indexData = IndexDataPool.getItem(this._subGeometry, this._level, indexOffset);

		this._numTriangles = this._indexData.data.length/3;

		indexOffset = this._indexData.offset;

		//check if there is more to split
		if (indexOffset < this._subGeometry.indices.length) {
			if (!this._overflow)
				this._overflow = this._pGetOverflowRenderable(indexOffset);

			this._overflow._iFillIndexData(indexOffset);
		} else if (this._overflow) {
			this._overflow.dispose();
			this._overflow = null;
		}
	}

	public _pGetOverflowRenderable(indexOffset:number):RenderableBase
	{
		throw new AbstractMethodError();
	}

	/**
	 * Sets the render state for the pass that is independent of the rendered object. This needs to be called before
	 * calling renderPass. Before activating a pass, the previously used pass needs to be deactivated.
	 * @param stage The Stage object which is currently used for rendering.
	 * @param camera The camera from which the scene is viewed.
	 * @private
	 */
	public _iActivate(pass:RenderPassBase, camera:Camera)
	{
		pass._iActivate(camera);
	}

	/**
	 * Renders an object to the current render target.
	 *
	 * @private
	 */
	public _iRender(pass:RenderPassBase, camera:Camera, viewProjection:Matrix3D)
	{
		pass._iRender(this, camera, viewProjection);
	}

	/**
	 * Clears the render state for the pass. This needs to be called before activating another pass.
	 * @param stage The Stage used for rendering
	 *
	 * @private
	 */
	public _iDeactivate(pass:RenderPassBase)
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
		if (this._subGeometry) {
			if (this._level == 0)
				this._subGeometry.removeEventListener(SubGeometryEvent.INDICES_UPDATED, this._onIndicesUpdatedDelegate);
			this._subGeometry.removeEventListener(SubGeometryEvent.VERTICES_UPDATED, this._onVerticesUpdatedDelegate);
		}

		this._subGeometry = this._pGetSubGeometry();

		this._concatenateArrays = this._subGeometry.concatenateArrays;

		if (this._subGeometry) {
			if (this._level == 0)
				this._subGeometry.addEventListener(SubGeometryEvent.INDICES_UPDATED, this._onIndicesUpdatedDelegate);
			this._subGeometry.addEventListener(SubGeometryEvent.VERTICES_UPDATED, this._onVerticesUpdatedDelegate);
		}

		//dispose
//			if (this._indexData) {
//				this._indexData.dispose(); //TODO where is a good place to dispose?
//				this._indexData = null;
//			}

//			for (var dataType in this._vertexData) {
//				(<VertexData> this._vertexData[dataType]).dispose(); //TODO where is a good place to dispose?
//				this._vertexData[dataType] = null;
//			}

		this._geometryDirty = false;

		//specific vertex data types have to be invalidated in the specific renderable
	}

	/**
	 * //TODO
	 *
	 * @private
	 */
	private _updateIndexData()
	{
		this._iFillIndexData(this._indexOffset);

		this._indexDataDirty = false;
	}

	/**
	 * //TODO
	 *
	 * @param dataType
	 * @private
	 */
	private _updateVertexData(dataType:string)
	{
		this._vertexOffset[dataType] = this._subGeometry.getOffset(dataType);

		if (this._subGeometry.concatenateArrays)
			dataType = SubGeometryBase.VERTEX_DATA;

		this._vertexData[dataType] = VertexDataPool.getItem(this._subGeometry, this.getIndexData(), dataType);

		this._pVertexDataDirty[dataType] = false;
	}

	/**
	 * //TODO
	 *
	 * @param event
	 * @private
	 */
	private _onIndicesUpdated(event:SubGeometryEvent)
	{
		this.invalidateIndexData();
	}

	/**
	 * //TODO
	 *
	 * @param event
	 * @private
	 */
	private _onVerticesUpdated(event:SubGeometryEvent)
	{
		this._concatenateArrays = (<SubGeometryBase> event.target).concatenateArrays;

		this.invalidateVertexData(event.dataType);
	}

	private _onRenderObjectOwnerUpdated(event:RenderableOwnerEvent)
	{
		//TODO flag unused renderObjects for deletion
		this.renderObjectOwner = event.renderObjectOwner;
	}
}

export = RenderableBase;