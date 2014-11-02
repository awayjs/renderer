import Matrix3D						= require("awayjs-core/lib/geom/Matrix3D");
import AbstractMethodError			= require("awayjs-core/lib/errors/AbstractMethodError");

import IMaterialOwner				= require("awayjs-display/lib/base/IMaterialOwner");
import SubGeometryBase				= require("awayjs-display/lib/base/SubGeometryBase");
import TriangleSubGeometry			= require("awayjs-display/lib/base/TriangleSubGeometry");
import IRenderable					= require("awayjs-display/lib/pool/IRenderable");
import RenderablePool				= require("awayjs-display/lib/pool/RenderablePool");
import IEntity						= require("awayjs-display/lib/entities/IEntity");
import SubGeometryEvent				= require("awayjs-display/lib/events/SubGeometryEvent");

import IndexData					= require("awayjs-stagegl/lib/pool/IndexData");
import IndexDataPool				= require("awayjs-stagegl/lib/pool/IndexDataPool");
import VertexData					= require("awayjs-stagegl/lib/pool/VertexData");
import VertexDataPool				= require("awayjs-stagegl/lib/pool/VertexDataPool");

import StageGLMaterialBase			= require("awayjs-renderergl/lib/materials/StageGLMaterialBase");

/**
 * @class RenderableListItem
 */
class RenderableBase implements IRenderable
{
	private _onIndicesUpdatedDelegate:(event:SubGeometryEvent) => void;
	private _onVerticesUpdatedDelegate:(event:SubGeometryEvent) => void;

	private _subGeometry:SubGeometryBase;
	private _geometryDirty:boolean = true;
	private _indexData:IndexData;
	private _indexDataDirty:boolean = true;
	private _vertexData:Object = new Object();
	public _pVertexDataDirty:Object = new Object();
	private _vertexOffset:Object = new Object();

	private _level:number;
	private _indexOffset:number;
	private _overflow:RenderableBase;
	private _numTriangles:number;
	private _concatenateArrays:boolean;


	public JOINT_INDEX_FORMAT:string;
	public JOINT_WEIGHT_FORMAT:string;

	/**
	 *
	 */
	public _pool:RenderablePool;

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

	/**
	 *
	 */
	public materialId:number;

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
	public materialOwner:IMaterialOwner;

	/**
	 *
	 */
	public material:StageGLMaterialBase;

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
	 * @param materialOwner
	 * @param subGeometry
	 * @param animationSubGeometry
	 */
	constructor(pool:RenderablePool, sourceEntity:IEntity, materialOwner:IMaterialOwner, level:number = 0, indexOffset:number = 0)
	{
		this._onIndicesUpdatedDelegate = (event:SubGeometryEvent) => this._onIndicesUpdated(event);
		this._onVerticesUpdatedDelegate = (event:SubGeometryEvent) => this._onVerticesUpdated(event);

		//store a reference to the pool for later disposal
		this._pool = pool;

		//reference to level of overflow
		this._level = level;

		//reference to the offset on indices (if this is an overflow renderable)
		this._indexOffset = indexOffset;

		this.sourceEntity = sourceEntity;
		this.materialOwner = materialOwner;
	}

	public dispose()
	{
		this._pool.disposeItem(this.materialOwner);

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
				this._overflow = this._pGetOverflowRenderable(this._pool, this.materialOwner, indexOffset, this._level + 1);

			this._overflow._iFillIndexData(indexOffset);
		} else if (this._overflow) {
			this._overflow.dispose();
			this._overflow = null;
		}
	}

	public _pGetOverflowRenderable(pool:RenderablePool, materialOwner:IMaterialOwner, level:number, indexOffset:number):RenderableBase
	{
		throw new AbstractMethodError();
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
}

export = RenderableBase;