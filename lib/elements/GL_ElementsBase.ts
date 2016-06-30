import {Short3Attributes}				from "@awayjs/core/lib/attributes/Short3Attributes";
import {AttributesView}				from "@awayjs/core/lib/attributes/AttributesView";
import {AttributesBuffer}				from "@awayjs/core/lib/attributes/AttributesBuffer";
import {AbstractionBase}				from "@awayjs/core/lib/library/AbstractionBase";
import {IAbstractionPool}				from "@awayjs/core/lib/library/IAbstractionPool";
import {AbstractMethodError}			from "@awayjs/core/lib/errors/AbstractMethodError";
import {AssetEvent}					from "@awayjs/core/lib/events/AssetEvent";
import {Matrix3D}						from "@awayjs/core/lib/geom/Matrix3D";

import {Stage}						from "@awayjs/stage/lib/base/Stage";
import {GL_AttributesBuffer}			from "@awayjs/stage/lib/attributes/GL_AttributesBuffer";

import {Camera}						from "@awayjs/display/lib/display/Camera";
import {ElementsBase}					from "@awayjs/display/lib/graphics/ElementsBase";
import {ElementsEvent}				from "@awayjs/display/lib/events/ElementsEvent";
import {ElementsUtils}				from "@awayjs/display/lib/utils/ElementsUtils";

import {IElementsClassGL}				from "../elements/IElementsClassGL";
import {ShaderBase}					from "../shaders/ShaderBase";
import {GL_RenderableBase}			from "../renderables/GL_RenderableBase";

/**
 *
 * @class away.pool.GL_ElementsBaseBase
 */
export class GL_ElementsBase extends AbstractionBase
{
	public usages:number = 0;
	private _elements:ElementsBase;
	public _stage:Stage;
	private _onInvalidateIndicesDelegate:(event:ElementsEvent) => void;
	private _onClearIndicesDelegate:(event:ElementsEvent) => void;
	private _onInvalidateVerticesDelegate:(event:ElementsEvent) => void;
	private _onClearVerticesDelegate:(event:ElementsEvent) => void;
	private _overflow:GL_ElementsBase;
	public _indices:GL_AttributesBuffer;
	private _indicesUpdated:boolean;
	private _vertices:Object = new Object();
	private _verticesUpdated:Object = new Object();

	public _indexMappings:Array<number> = Array<number>();
	
	private _numIndices:number = 0;

	private _numVertices:number;
	
	public get elementsType():string
	{
		throw new AbstractMethodError();
	}
	
	public get elementsClass():IElementsClassGL
	{
		throw new AbstractMethodError();
	}

	public get elements():ElementsBase
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
	
	constructor(elements:ElementsBase, stage:Stage)
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

	public _setRenderState(renderable:GL_RenderableBase, shader:ShaderBase, camera:Camera, viewProjection:Matrix3D):void
	{
		if (!this._verticesUpdated)
			this._updateIndices();

		//TODO replace overflow system with something sensible
		//this._render(renderable, camera, viewProjection);
		//
		// if (this._overflow)
		// 	this._overflow._iRender(renderable, camera, viewProjection);
	}

	public draw(renderable:GL_RenderableBase, shader:ShaderBase, camera:Camera, viewProjection:Matrix3D, count:number, offset:number):void
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
	 * @returns {away.pool.GL_GraphicRenderable}
	 * @protected
	 */
	public _pGetOverflowElements():GL_ElementsBase
	{
		throw new AbstractMethodError();
	}
}