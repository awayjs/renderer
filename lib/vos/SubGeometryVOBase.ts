import AttributesView				= require("awayjs-core/lib/attributes/AttributesView");
import AttributesBuffer				= require("awayjs-core/lib/attributes/AttributesBuffer");
import AbstractionBase				= require("awayjs-core/lib/library/AbstractionBase");
import AbstractMethodError			= require("awayjs-core/lib/errors/AbstractMethodError");
import AssetEvent					= require("awayjs-core/lib/events/AssetEvent");

import Stage						= require("awayjs-stagegl/lib/base/Stage");
import GL_AttributesBuffer			= require("awayjs-stagegl/lib/attributes/GL_AttributesBuffer");

import SubGeometryBase				= require("awayjs-display/lib/base/SubGeometryBase");
import SubGeometryEvent				= require("awayjs-display/lib/events/SubGeometryEvent");
import SubGeometryUtils				= require("awayjs-display/lib/utils/SubGeometryUtils");

import ShaderBase					= require("awayjs-renderergl/lib/shaders/ShaderBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
import ShaderRegisterElement		= require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");
/**
 *
 * @class away.pool.SubGeometryVOBaseBase
 */
class SubGeometryVOBase extends AbstractionBase
{
	public usages:number = 0;
	private _subGeometry:SubGeometryBase;
	public _stage:Stage;
	private _onInvalidateIndicesDelegate:(event:SubGeometryEvent) => void;
	private _onClearIndicesDelegate:(event:SubGeometryEvent) => void;
	private _onInvalidateVerticesDelegate:(event:SubGeometryEvent) => void;
	private _onClearVerticesDelegate:(event:SubGeometryEvent) => void;
	private _overflow:SubGeometryVOBase;
	private _indices:GL_AttributesBuffer;
	private _indicesUpdated:boolean;
	private _vertices:Object = new Object();
	private _verticesUpdated:Object = new Object();

	public _indexMappings:Array<number> = Array<number>();
	
	private _numIndices:number;

	private _numVertices:number;

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

	constructor(subGeometry:SubGeometryBase, stage:Stage)
	{
		super(subGeometry, stage);
		
		this._subGeometry = subGeometry;
		this._stage = stage;

		this._onInvalidateIndicesDelegate = (event:SubGeometryEvent) => this._onInvalidateIndices(event);
		this._onClearIndicesDelegate = (event:SubGeometryEvent) => this._onClearIndices(event);
		this._onInvalidateVerticesDelegate = (event:SubGeometryEvent) => this._onInvalidateVertices(event);
		this._onClearVerticesDelegate = (event:SubGeometryEvent) => this._onClearVertices(event);

		this._subGeometry.addEventListener(SubGeometryEvent.CLEAR_INDICES, this._onClearIndicesDelegate);
		this._subGeometry.addEventListener(SubGeometryEvent.INVALIDATE_INDICES, this._onInvalidateIndicesDelegate);

		this._subGeometry.addEventListener(SubGeometryEvent.CLEAR_VERTICES, this._onClearVerticesDelegate);
		this._subGeometry.addEventListener(SubGeometryEvent.INVALIDATE_VERTICES, this._onInvalidateVerticesDelegate);
	}

	/**
	 *
	 */
	public getIndexMappings():Array<number>
	{
		if (!this._indicesUpdated)
			this._updateIndices();

		return this._indexMappings;
	}

	/**
	 *
	 */
	public getIndexBufferVO():GL_AttributesBuffer
	{
		if (!this._indicesUpdated)
			this._updateIndices();

		return this._indices;
	}


	/**
	 *
	 */
	public getVertexBufferVO(attributesView:AttributesView):GL_AttributesBuffer
	{
		//first check if indices need updating which may affect vertices
		if (!this._indicesUpdated)
			this._updateIndices();

		var bufferId:number = attributesView.buffer.id;

		if (!this._verticesUpdated[bufferId])
			this._updateVertices(attributesView);

		return this._vertices[bufferId];
	}
	
	/**
	 *
	 */
	public activateVertexBufferVO(index:number, attributesView:AttributesView, dimensions:number = 0, offset:number = 0)
	{
		this.getVertexBufferVO(attributesView).activate(index, attributesView.size, dimensions || attributesView.dimensions, attributesView.offset + offset);
	}

	/**
	 *
	 */
	public onClear(event:AssetEvent)
	{
		super.onClear(event);

		this._subGeometry.removeEventListener(SubGeometryEvent.CLEAR_INDICES, this._onClearIndicesDelegate);
		this._subGeometry.removeEventListener(SubGeometryEvent.INVALIDATE_INDICES, this._onInvalidateIndicesDelegate);

		this._subGeometry.removeEventListener(SubGeometryEvent.CLEAR_VERTICES, this._onClearVerticesDelegate);
		this._subGeometry.removeEventListener(SubGeometryEvent.INVALIDATE_VERTICES, this._onInvalidateVerticesDelegate);

		this._onClearIndices(new SubGeometryEvent(SubGeometryEvent.CLEAR_INDICES, this._subGeometry.indices));

		this._subGeometry = null;

		if (this._overflow) {
			this._overflow.onClear(event);
			this._overflow = null;
		}
	}

	public _iGetFragmentCode(shader:ShaderBase, targetReg:ShaderRegisterElement, regCache:ShaderRegisterCache, inputReg:ShaderRegisterElement = null):string
	{
		throw new AbstractMethodError();
	}

	public _iRender(shader:ShaderBase)
	{
		if (!this._verticesUpdated)
			this._updateIndices();

		this._render(shader);

		if (this._overflow)
			this._overflow._iRender(shader);
	}

	public _render(shader:ShaderBase)
	{
		if (this._indices)
			this._drawElements(0, this._numIndices);
		else
			this._drawArrays(0, this._numVertices);
	}

	public _drawElements(firstIndex:number, numIndices:number)
	{
		throw new AbstractMethodError();
	}

	public _drawArrays(firstVertex:number, numVertices:number)
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
		this._indices = <GL_AttributesBuffer> this._pool.getAbstraction(SubGeometryUtils.getSubIndices(this._subGeometry.indices, this._subGeometry.numVertices, this._indexMappings, indexOffset));

		this._numIndices = this._indices._attributesBuffer.count*this._subGeometry.indices.dimensions;

		indexOffset += this._numIndices;

		//check if there is more to split
		if (indexOffset < this._subGeometry.indices.count*this._subGeometry.indices.dimensions) {
			if (!this._overflow)
				this._overflow = this._pGetOverflowSubGeometry();

			this._overflow._updateIndices(indexOffset);
		} else if (this._overflow) {
			this._overflow.onClear(new AssetEvent(AssetEvent.CLEAR, this._subGeometry));
			this._overflow = null;
		}

		this._indicesUpdated = true;

		//invalidate vertices if index mappings exist
		if (this._indexMappings.length)
			for (var key in this._verticesUpdated)
				this._verticesUpdated[key] = false;
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

		this._vertices[bufferId] = <GL_AttributesBuffer> this._pool.getAbstraction(SubGeometryUtils.getSubVertices(attributesView.buffer, this._indexMappings));

		this._verticesUpdated[bufferId] = true;
	}

	/**
	 * //TODO
	 *
	 * @param event
	 * @private
	 */
	public _onInvalidateIndices(event:SubGeometryEvent)
	{
		if (!event.attributesView)
			return;

		this._indicesUpdated = false;
	}

	/**
	 * //TODO
	 *
	 * @param event
	 * @private
	 */
	public _onClearIndices(event:SubGeometryEvent)
	{
		if (!event.attributesView)
			return;

		this._indices.onClear(new AssetEvent(AssetEvent.CLEAR, event.attributesView));
		this._indices = null;
	}

	/**
	 * //TODO
	 *
	 * @param event
	 * @private
	 */
	public _onInvalidateVertices(event:SubGeometryEvent)
	{
		if (!event.attributesView)
			return;

		var bufferId:number = event.attributesView.buffer.id;

		this._verticesUpdated[bufferId] = false;
	}
	
	/**
	 * //TODO
	 *
	 * @param event
	 * @private
	 */
	public _onClearVertices(event:SubGeometryEvent)
	{
		if (!event.attributesView)
			return;

		var bufferId:number = event.attributesView.buffer.id;

		if (this._vertices[bufferId]) {
			this._vertices[bufferId].onClear(new AssetEvent(AssetEvent.CLEAR, event.attributesView));
			delete this._vertices[bufferId];
		}
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