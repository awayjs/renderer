import {AbstractionBase, AbstractMethodError, AssetEvent, Matrix3D, ProjectionBase} from "@awayjs/core";

import {Stage, Short3Attributes, AttributesView, GL_AttributesBuffer} from "@awayjs/stage";

import {ElementsEvent} from "../events/ElementsEvent";
import {ElementsUtils} from "../utils/ElementsUtils";

import {RenderStateBase} from "./RenderStateBase";
import {ShaderBase} from "./ShaderBase";
import {IElements} from "./IElements";

/**
 *
 * @class away.pool.ElementsStateBaseBase
 */
export class ElementsStateBase extends AbstractionBase
{
	public usages:number = 0;
	private _elements:IElements;
	public _stage:Stage;
	private _onInvalidateIndicesDelegate:(event:ElementsEvent) => void;
	private _onClearIndicesDelegate:(event:ElementsEvent) => void;
	private _onInvalidateVerticesDelegate:(event:ElementsEvent) => void;
	private _onClearVerticesDelegate:(event:ElementsEvent) => void;
	private _overflow:ElementsStateBase;
	public _indices:GL_AttributesBuffer;
	private _indicesUpdated:boolean;
	private _vertices:Object = new Object();
	private _verticesUpdated:Object = new Object();

	public _indexMappings:Array<number> = Array<number>();
	
	private _numIndices:number = 0;

	private _numVertices:number;

	public get elements():IElements
	{
		return this._elements;
	}
	
	/**
	 *
	 */
	public get numIndices():number
	{
		return this._numIndices;
	}
	
	/**
	 *
	 */
	public get numVertices():number
	{
		return this._numVertices;
	}
	
	constructor(elements:IElements, stage:Stage)
	{
		super(elements, stage);
		
		this._elements = elements;
		this._stage = stage;

		this._onInvalidateIndicesDelegate = (event:ElementsEvent) => this._onInvalidateIndices(event);
		this._onClearIndicesDelegate = (event:ElementsEvent) => this._onClearIndices(event);
		this._onInvalidateVerticesDelegate = (event:ElementsEvent) => this._onInvalidateVertices(event);
		this._onClearVerticesDelegate = (event:ElementsEvent) => this._onClearVertices(event);

		this._elements.addEventListener(ElementsEvent.CLEAR_INDICES, this._onClearIndicesDelegate);
		this._elements.addEventListener(ElementsEvent.INVALIDATE_INDICES, this._onInvalidateIndicesDelegate);

		this._elements.addEventListener(ElementsEvent.CLEAR_VERTICES, this._onClearVerticesDelegate);
		this._elements.addEventListener(ElementsEvent.INVALIDATE_VERTICES, this._onInvalidateVerticesDelegate);
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
	public getIndexBufferGL():GL_AttributesBuffer
	{
		if (!this._indicesUpdated)
			this._updateIndices();

		return this._indices;
	}


	/**
	 *
	 */
	public getVertexBufferGL(attributesView:AttributesView):GL_AttributesBuffer
	{
		//first check if indices need updating which may affect vertices
		if (!this._indicesUpdated)
			this._updateIndices();

		var bufferId:number = attributesView.attributesBuffer.id;

		if (!this._verticesUpdated[bufferId])
			this._updateVertices(attributesView);

		return this._vertices[bufferId];
	}
	
	/**
	 *
	 */
	public activateVertexBufferVO(index:number, attributesView:AttributesView, dimensions:number = 0, offset:number = 0):void
	{
		this.getVertexBufferGL(attributesView).activate(index, attributesView.size, dimensions || attributesView.dimensions, attributesView.offset + offset, attributesView.unsigned);
	}

	/**
	 *
	 */
	public onClear(event:AssetEvent):void
	{
		super.onClear(event);

		this._elements.removeEventListener(ElementsEvent.CLEAR_INDICES, this._onClearIndicesDelegate);
		this._elements.removeEventListener(ElementsEvent.INVALIDATE_INDICES, this._onInvalidateIndicesDelegate);

		this._elements.removeEventListener(ElementsEvent.CLEAR_VERTICES, this._onClearVerticesDelegate);
		this._elements.removeEventListener(ElementsEvent.INVALIDATE_VERTICES, this._onInvalidateVerticesDelegate);

		this._elements = null;

		if (this._overflow) {
			this._overflow.onClear(event);
			this._overflow = null;
		}
	}

	public _setRenderState(renderable:RenderStateBase, shader:ShaderBase, projection:ProjectionBase):void
	{
		if (!this._verticesUpdated)
			this._updateIndices();

		//TODO replace overflow system with something sensible
		//this._render(renderable, camera, viewProjection);
		//
		// if (this._overflow)
		// 	this._overflow._iRender(renderable, camera, viewProjection);
	}

	public draw(renderable:RenderStateBase, shader:ShaderBase, projection:ProjectionBase, count:number, offset:number):void
	{
		throw new AbstractMethodError();
	}

	/**
	 * //TODO
	 *
	 * @private
	 */
	public _updateIndices(indexOffset:number = 0):void
	{
		var indices:Short3Attributes = this._elements.indices;
		if (indices) {
			this._indices = <GL_AttributesBuffer> this._stage.getAbstraction(ElementsUtils.getSubIndices(indices, this._elements.numVertices, this._indexMappings, indexOffset));
			this._numIndices = this._indices._attributesBuffer.count*indices.dimensions;
		} else {
			this._indices = null;
			this._numIndices = 0;
			this._indexMappings  = Array<number>();
		}

		indexOffset += this._numIndices;

		//check if there is more to split
		if (indices && indexOffset < indices.count*this._elements.indices.dimensions) {
			if (!this._overflow)
				this._overflow = this._pGetOverflowElements();

			this._overflow._updateIndices(indexOffset);
		} else if (this._overflow) {
			this._overflow.onClear(new AssetEvent(AssetEvent.CLEAR, this._elements));
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
	private _updateVertices(attributesView:AttributesView):void
	{
		this._numVertices = this._elements.numVertices;

		var bufferId:number = attributesView.attributesBuffer.id;

		this._vertices[bufferId] = <GL_AttributesBuffer> this._stage.getAbstraction(ElementsUtils.getSubVertices(attributesView.attributesBuffer, this._indexMappings));

		this._verticesUpdated[bufferId] = true;
	}

	/**
	 * //TODO
	 *
	 * @param event
	 * @private
	 */
	public _onInvalidateIndices(event:ElementsEvent):void
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
	public _onClearIndices(event:ElementsEvent):void
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
	public _onInvalidateVertices(event:ElementsEvent):void
	{
		if (!event.attributesView)
			return;

		var bufferId:number = event.attributesView.attributesBuffer.id;

		this._verticesUpdated[bufferId] = false;
	}
	
	/**
	 * //TODO
	 *
	 * @param event
	 * @private
	 */
	public _onClearVertices(event:ElementsEvent):void
	{
		if (!event.attributesView)
			return;

		var bufferId:number = event.attributesView.attributesBuffer.id;

		if (this._vertices[bufferId]) {
			this._vertices[bufferId].onClear(new AssetEvent(AssetEvent.CLEAR, event.attributesView));
			delete this._vertices[bufferId];
			delete this._verticesUpdated[bufferId];
		}
	}

	/**
	 * //TODO
	 *
	 * @param pool
	 * @param renderable
	 * @param level
	 * @param indexOffset
	 * @returns {away.pool.GL_ShapeRenderable}
	 * @protected
	 */
	public _pGetOverflowElements():ElementsStateBase
	{
		throw new AbstractMethodError();
	}
}