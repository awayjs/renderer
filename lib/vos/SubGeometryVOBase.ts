import AttributesView				= require("awayjs-core/lib/attributes/AttributesView");
import AttributesBuffer				= require("awayjs-core/lib/attributes/AttributesBuffer");
import AbstractMethodError			= require("awayjs-core/lib/errors/AbstractMethodError");

import Stage						= require("awayjs-stagegl/lib/base/Stage");
import SubGeometryEvent				= require("awayjs-display/lib/events/SubGeometryEvent");
import SubGeometryUtils				= require("awayjs-display/lib/utils/SubGeometryUtils");
import AttributesBufferVO			= require("awayjs-stagegl/lib/vos/AttributesBufferVO");

import SubGeometryBase				= require("awayjs-display/lib/base/SubGeometryBase");
import ISubGeometryVO				= require("awayjs-display/lib/vos/ISubGeometryVO");

import ShaderBase					= require("awayjs-renderergl/lib/shaders/ShaderBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
import ShaderRegisterElement		= require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");
import SubGeometryVOPool			= require("awayjs-renderergl/lib/vos/SubGeometryVOPool");

/**
 *
 * @class away.pool.SubGeometryVOBaseBase
 */
class SubGeometryVOBase implements ISubGeometryVO
{
	public usages:number = 0;
	public _pool:SubGeometryVOPool;
	private _subGeometry:SubGeometryBase;
	private _onIndicesUpdatedDelegate:(event:SubGeometryEvent) => void;
	private _onIndicesDisposedDelegate:(event:SubGeometryEvent) => void;
	private _onVerticesUpdatedDelegate:(event:SubGeometryEvent) => void;
	private _onVerticesDisposedDelegate:(event:SubGeometryEvent) => void;
	private _overflow:SubGeometryVOBase;
	private _indices:AttributesBuffer;
	private _indexBuffer:AttributesBufferVO;
	private _indicesDirty:boolean;
	private _vertices:Object = new Object();
	private _vertexBuffers:Object = new Object();
	private _verticesDirty:Object = new Object();

	public _indexMappings:Array<number> = Array<number>();
	
	private _numIndices:number;

	private _numVertices:number;

	public invalid:boolean;

	public get subGeometry()
	{
		return this._subGeometry;
	}
	/**
	 *
	 */
	public get numIndices():number
	{
		return this._numIndices;
	}

	constructor(pool:SubGeometryVOPool, subGeometry:SubGeometryBase)
	{
		this._pool = pool;
		this._subGeometry = subGeometry;

		this._onIndicesUpdatedDelegate = (event:SubGeometryEvent) => this._onIndicesUpdated(event);
		this._onIndicesDisposedDelegate = (event:SubGeometryEvent) => this._onIndicesDisposed(event);
		this._onVerticesUpdatedDelegate = (event:SubGeometryEvent) => this._onVerticesUpdated(event);
		this._onVerticesDisposedDelegate = (event:SubGeometryEvent) => this._onVerticesDisposed(event);

		this._subGeometry.addEventListener(SubGeometryEvent.INDICES_DISPOSED, this._onIndicesDisposedDelegate);
		this._subGeometry.addEventListener(SubGeometryEvent.INDICES_UPDATED, this._onIndicesUpdatedDelegate);

		this._subGeometry.addEventListener(SubGeometryEvent.VERTICES_DISPOSED, this._onVerticesDisposedDelegate);
		this._subGeometry.addEventListener(SubGeometryEvent.VERTICES_UPDATED, this._onVerticesUpdatedDelegate);

		this.invalidateIndices();
	}

	/**
	 *
	 */
	public get indexMappings():Array<number>
	{
		if (this._indicesDirty)
			this._updateIndices();

		return this._indexMappings;
	}

	/**
	 *
	 */
	public getIndexBufferVO(stage:Stage):AttributesBufferVO
	{
		if (this._indicesDirty)
			this._updateIndices();

		return (this._indexBuffer = stage.getAttributesBufferVO(this._indices));
	}


	/**
	 *
	 */
	public getVertexBufferVO(attributesView:AttributesView, stage:Stage):AttributesBufferVO
	{
		var bufferId:number = attributesView.buffer.id;
		if (this._indicesDirty)
			this._updateIndices();

		if (this._verticesDirty[bufferId])
			this._updateVertices(attributesView);

		return (this._vertexBuffers[bufferId] = stage.getAttributesBufferVO(this._vertices[bufferId]));
	}
	
	/**
	 *
	 */
	public activateVertexBufferVO(index:number, attributesView:AttributesView, stage:Stage, dimensions:number = 0, offset:number = 0)
	{
		this.getVertexBufferVO(attributesView, stage).activate(index, attributesView.size, dimensions || attributesView.dimensions, attributesView.offset + offset);
	}
	
	/**
	 *
	 */
	public invalidateIndices()
	{
		if (!this._subGeometry.indices)
			return;

		this._indicesDirty = true;
	}

	/**
	 *
	 */
	public disposeIndices()
	{
		if (this._indexBuffer) {
			this._indexBuffer.dispose();
			this._indexBuffer = null;
		}

		this._indices = null;
	}


	/**
	 * //TODO
	 *
	 * @param attributesView
	 */
	public invalidateVertices(attributesView:AttributesView)
	{
		if (!attributesView)
			return;

		var bufferId:number = attributesView.buffer.id;

		this._verticesDirty[bufferId] = true;
	}
	
	/**
	 *
	 */
	public disposeVertices(attributesView:AttributesView)
	{
		if (!attributesView)
			return;

		var bufferId:number = attributesView.buffer.id;

		if (this._vertexBuffers[bufferId]) {
			this._vertexBuffers[bufferId].dispose();
			delete this._vertexBuffers[bufferId];
		}

		this._vertices = null;
	}

	/**
	 *
	 */
	public dispose()
	{
		this._pool.disposeItem(this._subGeometry);
		this._pool = null;

		this._subGeometry.removeEventListener(SubGeometryEvent.INDICES_DISPOSED, this._onIndicesDisposedDelegate);
		this._subGeometry.removeEventListener(SubGeometryEvent.INDICES_UPDATED, this._onIndicesUpdatedDelegate);

		this._subGeometry.removeEventListener(SubGeometryEvent.VERTICES_DISPOSED, this._onVerticesDisposedDelegate);
		this._subGeometry.removeEventListener(SubGeometryEvent.VERTICES_UPDATED, this._onVerticesUpdatedDelegate);

		this._subGeometry = null;

		this.disposeIndices();

		if (this._overflow) {
			this._overflow.dispose();
			this._overflow = null;
		}
	}

	/**
	 *
	 */
	public invalidate()
	{
		this.invalid = true;
	}

	public _iGetFragmentCode(shader:ShaderBase, targetReg:ShaderRegisterElement, regCache:ShaderRegisterCache, inputReg:ShaderRegisterElement = null):string
	{
		throw new AbstractMethodError();
	}

	public _iRender(shader:ShaderBase, stage:Stage)
	{
		if (this._indicesDirty)
			this._updateIndices();

		this._render(shader, stage);

		if (this._overflow)
			this._overflow._iRender(shader, stage);
	}

	public _render(shader:ShaderBase, stage:Stage)
	{
		if (this._indices)
			this._drawElements(0, this._numIndices, stage);
		else
			this._drawArrays(0, this._numVertices, stage);
	}

	public _drawElements(firstIndex:number, numIndices:number, stage:Stage)
	{
		throw new AbstractMethodError();
	}

	public _drawArrays(firstVertex:number, numVertices:number, stage:Stage)
	{
		throw new AbstractMethodError();
	}

	/**
	 * //TODO
	 *
	 * @private
	 */
	public _updateIndices(indexOffset:number = 0)
	{
		this._indices = SubGeometryUtils.getSubIndices(this._subGeometry.indices, this._subGeometry.numVertices, this._indexMappings, indexOffset);

		this._numIndices = this._indices.count*this._subGeometry.indices.dimensions;

		indexOffset += this._numIndices;

		//check if there is more to split
		if (indexOffset < this._subGeometry.indices.count*this._subGeometry.indices.dimensions) {
			if (!this._overflow)
				this._overflow = this._pGetOverflowSubGeometry();

			this._overflow._updateIndices(indexOffset);
		} else if (this._overflow) {
			this._overflow.dispose();
			this._overflow = null;
		}

		this._indicesDirty = false;
		
		//invalidate vertices if index mappings exist
		if (this._indexMappings.length)
			for (var key in this._verticesDirty)
				this._verticesDirty[key] = true;
	}


	/**
	 * //TODO
	 *
	 * @param attributesView
	 * @private
	 */
	private _updateVertices(attributesView:AttributesView)
	{
		this._numVertices = attributesView.count;

		var bufferId:number = attributesView.buffer.id;

		this._vertices[bufferId] = SubGeometryUtils.getSubVertices(attributesView.buffer, this._indexMappings);

		this._verticesDirty[bufferId] = false;
	}

	/**
	 * //TODO
	 *
	 * @param event
	 * @private
	 */
	private _onIndicesUpdated(event:SubGeometryEvent)
	{
		this.invalidateIndices();
	}

	/**
	 * //TODO
	 *
	 * @param event
	 * @private
	 */
	private _onIndicesDisposed(event:SubGeometryEvent)
	{
		this.disposeIndices();
	}

	/**
	 * //TODO
	 *
	 * @param event
	 * @private
	 */
	private _onVerticesUpdated(event:SubGeometryEvent)
	{
		this.invalidateVertices(event.attributesView);
	}
	
	/**
	 * //TODO
	 *
	 * @param event
	 * @private
	 */
	private _onVerticesDisposed(event:SubGeometryEvent)
	{
		this.disposeVertices(event.attributesView);
	}

	/**
	 * //TODO
	 *
	 * @param pool
	 * @param renderableOwner
	 * @param level
	 * @param indexOffset
	 * @returns {away.pool.TriangleSubMeshRenderable}
	 * @protected
	 */
	public _pGetOverflowSubGeometry():SubGeometryVOBase
	{
		throw new AbstractMethodError();
	}
}

export = SubGeometryVOBase;