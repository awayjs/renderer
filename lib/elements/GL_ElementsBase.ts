import Short3Attributes				= require("awayjs-core/lib/attributes/Short3Attributes");
import AttributesView				= require("awayjs-core/lib/attributes/AttributesView");
import AttributesBuffer				= require("awayjs-core/lib/attributes/AttributesBuffer");
import AbstractionBase				= require("awayjs-core/lib/library/AbstractionBase");
import IAbstractionPool 			= require("awayjs-core/lib/library/IAbstractionPool");
import AbstractMethodError			= require("awayjs-core/lib/errors/AbstractMethodError");
import AssetEvent					= require("awayjs-core/lib/events/AssetEvent");
import Matrix3D						= require("awayjs-core/lib/geom/Matrix3D");

import Stage						= require("awayjs-stagegl/lib/base/Stage");
import GL_AttributesBuffer			= require("awayjs-stagegl/lib/attributes/GL_AttributesBuffer");

import Camera						= require("awayjs-display/lib/display/Camera");
import ElementsBase					= require("awayjs-display/lib/graphics/ElementsBase");
import ElementsEvent				= require("awayjs-display/lib/events/ElementsEvent");
import ElementsUtils				= require("awayjs-display/lib/utils/ElementsUtils");

import ElementsPool					= require("awayjs-renderergl/lib/elements/ElementsPool");
import ShaderBase					= require("awayjs-renderergl/lib/shaders/ShaderBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
import ShaderRegisterElement		= require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");
import GL_RenderableBase			= require("awayjs-renderergl/lib/renderables/GL_RenderableBase");

/**
 *
 * @class away.pool.GL_ElementsBaseBase
 */
class GL_ElementsBase extends AbstractionBase
{
	public usages:number = 0;
	private _elements:ElementsBase;
	public _shader:ShaderBase;
	public _stage:Stage;
	private _onInvalidateIndicesDelegate:(event:ElementsEvent) => void;
	private _onClearIndicesDelegate:(event:ElementsEvent) => void;
	private _onInvalidateVerticesDelegate:(event:ElementsEvent) => void;
	private _onClearVerticesDelegate:(event:ElementsEvent) => void;
	private _overflow:GL_ElementsBase;
	private _indices:GL_AttributesBuffer;
	private _indicesUpdated:boolean;
	private _vertices:Object = new Object();
	private _verticesUpdated:Object = new Object();

	public _indexMappings:Array<number> = Array<number>();
	
	private _numIndices:number = 0;

	private _numVertices:number;

	public get elements()
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

	constructor(elements:ElementsBase, shader:ShaderBase, pool:IAbstractionPool)
	{
		super(elements, pool);
		
		this._elements = elements;
		this._shader = shader;
		this._stage = shader._stage;

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
		this.getVertexBufferVO(attributesView).activate(index, attributesView.size, dimensions || attributesView.dimensions, attributesView.offset + offset, attributesView.unsigned);
	}

	/**
	 *
	 */
	public onClear(event:AssetEvent)
	{
		super.onClear(event);

		this._elements.removeEventListener(ElementsEvent.CLEAR_INDICES, this._onClearIndicesDelegate);
		this._elements.removeEventListener(ElementsEvent.INVALIDATE_INDICES, this._onInvalidateIndicesDelegate);

		this._elements.removeEventListener(ElementsEvent.CLEAR_VERTICES, this._onClearVerticesDelegate);
		this._elements.removeEventListener(ElementsEvent.INVALIDATE_VERTICES, this._onInvalidateVerticesDelegate);

		this._onClearIndices(new ElementsEvent(ElementsEvent.CLEAR_INDICES, this._elements.indices));

		var names:Array<string> = this._elements.getCustomAtributesNames();
		var len:number = names.length;
		for (var i:number = 0; i <len; i++)
			this._onClearVertices(new ElementsEvent(ElementsEvent.CLEAR_VERTICES, this._elements.getCustomAtributes(names[i])));

		this._elements = null;

		if (this._overflow) {
			this._overflow.onClear(event);
			this._overflow = null;
		}
	}

	public _iRender(renderable:GL_RenderableBase, camera:Camera, viewProjection:Matrix3D)
	{
		if (!this._verticesUpdated)
			this._updateIndices();

		this._render(renderable, camera, viewProjection);

		if (this._overflow)
			this._overflow._iRender(renderable, camera, viewProjection);
	}

	public _render(renderable:GL_RenderableBase, camera:Camera, viewProjection:Matrix3D)
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
	private _updateVertices(attributesView:AttributesView)
	{
		this._numVertices = attributesView.count;

		var bufferId:number = attributesView.buffer.id;

		this._vertices[bufferId] = <GL_AttributesBuffer> this._stage.getAbstraction(ElementsUtils.getSubVertices(attributesView.buffer, this._indexMappings));

		this._verticesUpdated[bufferId] = true;
	}

	/**
	 * //TODO
	 *
	 * @param event
	 * @private
	 */
	public _onInvalidateIndices(event:ElementsEvent)
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
	public _onClearIndices(event:ElementsEvent)
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
	public _onInvalidateVertices(event:ElementsEvent)
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
	public _onClearVertices(event:ElementsEvent)
	{
		if (!event.attributesView)
			return;

		var bufferId:number = event.attributesView.buffer.id;

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

export = GL_ElementsBase;