
import { Stage, Short3Attributes, AttributesView, _Stage_AttributesBuffer } from '@awayjs/stage';
import { AbstractionBase, AbstractMethodError } from '@awayjs/core';
import { ElementsEvent } from '../events/ElementsEvent';
import { ElementsUtils } from '../utils/ElementsUtils';
import { IElements } from './IElements';
import { _Render_RenderableBase } from './_Render_RenderableBase';
import { IShaderBase } from './IShaderBase';

/**
 *
 * @class away.pool._Stage_ElementsBaseBase
 */
export class _Stage_ElementsBase extends AbstractionBase {
	public usages: number = 0;
	private _onInvalidateIndicesDelegate: (event: ElementsEvent) => void;
	private _onClearIndicesDelegate: (event: ElementsEvent) => void;
	private _onInvalidateVerticesDelegate: (event: ElementsEvent) => void;
	private _onClearVerticesDelegate: (event: ElementsEvent) => void;
	private _overflow: _Stage_ElementsBase;
	public _indices: _Stage_AttributesBuffer;
	private _indicesUpdated: boolean;
	private _vertices: Record<number, _Stage_AttributesBuffer> = {};
	private _verticesUpdated: Record<number, boolean> = {};

	public _indexMappings: number[] = [];

	private _numIndices: number = 0;

	private _numVertices: number;

	public get elements(): IElements {
		return this._useWeak ? (<WeakRef<IElements>> this._asset).deref() : <IElements> this._asset;
	}

	/**
	 *
	 */
	public get numIndices(): number {
		return this._numIndices;
	}

	/**
	 *
	 */
	public get numVertices(): number {
		return this._numVertices;
	}

	constructor() {
		super();

		this._onInvalidateIndicesDelegate = (event: ElementsEvent) => this._onInvalidateIndices(event);
		this._onClearIndicesDelegate = (event: ElementsEvent) => this._onClearIndices(event);
		this._onInvalidateVerticesDelegate = (event: ElementsEvent) => this._onInvalidateVertices(event);
		this._onClearVerticesDelegate = (event: ElementsEvent) => this._onClearVertices(event);
	}

	public init(elements: IElements, stage: Stage): void {
		super.init(elements, stage, true);

		elements.addEventListener(ElementsEvent.CLEAR_INDICES, this._onClearIndicesDelegate);
		elements.addEventListener(ElementsEvent.INVALIDATE_INDICES, this._onInvalidateIndicesDelegate);

		elements.addEventListener(ElementsEvent.CLEAR_VERTICES, this._onClearVerticesDelegate);
		elements.addEventListener(ElementsEvent.INVALIDATE_VERTICES, this._onInvalidateVerticesDelegate);
	}

	/**
	 *
	 */
	public getIndexMappings(): number[] {
		if (!this._indicesUpdated)
			this._updateIndices();

		return this._indexMappings;
	}

	/**
	 *
	 */
	public getIndexBufferGL(): _Stage_AttributesBuffer {
		if (!this._indicesUpdated)
			this._updateIndices();

		return this._indices;
	}

	/**
	 *
	 */
	public getVertexBufferGL(attributesView: AttributesView): _Stage_AttributesBuffer {
		//first check if indices need updating which may affect vertices
		if (!this._indicesUpdated)
			this._updateIndices();

		const bufferId: number = attributesView.attributesBuffer.id;

		if (!this._verticesUpdated[bufferId])
			this._updateVertices(attributesView);

		return this._vertices[bufferId];
	}

	/**
	 *
	 */
	public activateVertexBufferVO(
		index: number, attributesView: AttributesView,
		dimensions: number = 0, offset: number = 0): void {

		this.getVertexBufferGL(attributesView)
			.activate(
				index,
				attributesView.size,
				dimensions || attributesView.dimensions,
				attributesView.offset + offset,
				attributesView.unsigned);
	}

	/**
	 *
	 */
	public onClear(): void {
		const elements: IElements = this.elements;

		if (elements) {
			elements.removeEventListener(ElementsEvent.CLEAR_INDICES, this._onClearIndicesDelegate);
			elements.removeEventListener(ElementsEvent.INVALIDATE_INDICES, this._onInvalidateIndicesDelegate);

			elements.removeEventListener(ElementsEvent.CLEAR_VERTICES, this._onClearVerticesDelegate);
			elements.removeEventListener(ElementsEvent.INVALIDATE_VERTICES, this._onInvalidateVerticesDelegate);
		}

		if (this._overflow) {
			this._overflow.onClear();
			this._overflow = null;
		}

		this._indices = null;
		this._indicesUpdated = false;
		this._vertices = {};
		this._verticesUpdated = {};

		super.onClear();
	}

	public _setRenderState(renderable: _Render_RenderableBase, shader: IShaderBase): void {
		if (!this._verticesUpdated)
			this._updateIndices();

		//TODO replace overflow system with something sensible
		//this._render(renderable, camera, viewProjection);
		//
		// if (this._overflow)
		// 	this._overflow._iRender(renderable, camera, viewProjection);
	}

	public draw(renderable: _Render_RenderableBase, shader: IShaderBase, count: number, offset: number): void {
		throw new AbstractMethodError();
	}

	/**
	 * //TODO
	 *
	 * @private
	 */
	public _updateIndices(indexOffset: number = 0): void {
		const elements: IElements = this.elements;

		const indices: Short3Attributes = elements.indices;
		if (indices) {
			const sub = ElementsUtils.getSubIndices(
				indices,
				elements.numVertices,
				this._indexMappings, indexOffset);

			this._indices = (<Stage> this._pool).abstractions.getAbstraction<_Stage_AttributesBuffer>(sub);
			this._numIndices = this._indices.attributesBuffer.count * indices.dimensions;
		} else {
			this._indices = null;
			this._numIndices = 0;
			this._indexMappings.length = 0;
		}

		indexOffset += this._numIndices;

		//check if there is more to split
		if (indices && indexOffset < indices.count * elements.indices.dimensions) {
			if (!this._overflow)
				this._overflow = this._pGetOverflowElements();

			this._overflow._updateIndices(indexOffset);
		} else if (this._overflow) {
			this._overflow.onClear();
			this._overflow = null;
		}

		this._indicesUpdated = true;

		//invalidate vertices if index mappings exist
		if (this._indexMappings.length)
			for (const key in this._verticesUpdated)
				this._verticesUpdated[key] = false;
	}

	/**
	 * //TODO
	 *
	 * @param attributesView
	 * @private
	 */
	private _updateVertices(attributesView: AttributesView): void {
		this._numVertices = this.elements.numVertices;

		const bufferId: number = attributesView.attributesBuffer.id;
		const sub = ElementsUtils.getSubVertices(attributesView.attributesBuffer, this._indexMappings);

		this._vertices[bufferId] = (<Stage> this._pool).abstractions.getAbstraction<_Stage_AttributesBuffer>(sub);
		this._verticesUpdated[bufferId] = true;
	}

	/**
	 * //TODO
	 *
	 * @param event
	 * @private
	 */
	public _onInvalidateIndices(event: ElementsEvent): void {
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
	public _onClearIndices(event: ElementsEvent): void {
		if (!event.attributesView)
			return;

		this._indices.onClear();
		this._indices = null;
	}

	/**
	 * //TODO
	 *
	 * @param event
	 * @private
	 */
	public _onInvalidateVertices(event: ElementsEvent): void {
		if (!event.attributesView)
			return;

		const bufferId: number = event.attributesView.attributesBuffer.id;

		this._verticesUpdated[bufferId] = false;
	}

	/**
	 * //TODO
	 *
	 * @param event
	 * @private
	 */
	public _onClearVertices(event: ElementsEvent): void {
		if (!event.attributesView)
			return;

		const bufferId: number = event.attributesView.attributesBuffer.id;

		if (this._vertices[bufferId]) {
			this._vertices[bufferId].onClear();
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
	public _pGetOverflowElements(): _Stage_ElementsBase {
		throw new AbstractMethodError();
	}
}