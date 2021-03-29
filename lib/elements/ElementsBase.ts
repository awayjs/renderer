import { AbstractMethodError, Box, Sphere, Matrix3D, Vector3D, AssetBase } from '@awayjs/core';

import { AttributesBuffer, AttributesView, Float3Attributes, Short3Attributes } from '@awayjs/stage';

import { View, PickingCollision, ContainerNode } from '@awayjs/view';
import { ElementsEvent } from '../events/ElementsEvent';
import { IElements } from '../base/IElements';


import { IHullImpl } from '../utils/ConvexHullUtils';
import { IMaterial } from '../base/IMaterial';

export type THullImplId = IHullImpl & {offset: number, count: number};

/**
 * @class away.base.TriangleElements
 */
export class ElementsBase extends AssetBase implements IElements {
	public isDynamic: boolean = false;

	private _indices: Short3Attributes;
	private _customAttributesNames: Array<string> = new Array<string>();
	private _customAttributes: Object = new Object();

	protected _useCondensedIndices: boolean;
	protected _condensedIndexLookUp: Array<number>;
	protected _autoDeriveNormals: boolean = true;
	protected _autoDeriveTangents: boolean = true;
	protected _convexHull: THullImplId;
	protected _boundsRequests: number = 0;

	public _numElements: number = 0;
	public _numVertices: number = 0;
	public _concatenatedBuffer: AttributesBuffer;

	private _invalidateIndices: ElementsEvent;

	public _verticesDirty: Object = new Object();
	public _invalidateVertices: Object = new Object();

	public usages: number = 0;

	public get concatenatedBuffer(): AttributesBuffer {
		return this._concatenatedBuffer;
	}

	/**
	 * The raw index data that define the faces.
	 */
	public get indices(): Short3Attributes {
		return this._indices;
	}

	/**
	 *
	 */
	public getCustomAtributesNames(): Array<string> {
		return this._customAttributesNames;
	}

	/**
	 *
	 */
	public getCustomAtributes(name: string): AttributesView {
		return this._customAttributes[name];
	}

	/**
	 * The total amount of triangles in the TriangleElements.
	 */
	public get numElements(): number {
		return this._numElements;
	}

	public get numVertices(): number {
		return this._numVertices;
	}

	public get condensedIndexLookUp(): Array<number> {
		return this._condensedIndexLookUp;
	}

	/**
     * True if the vertex normals should be derived from the geometry, false if the vertex normals are set
     * explicitly.
     */
	public get autoDeriveNormals(): boolean {
		return this._autoDeriveNormals;
	}

	public set autoDeriveNormals(value: boolean) {
		if (this._autoDeriveNormals == value)
			return;

		this._autoDeriveNormals = value;
	}

	/**
     * True if the vertex tangents should be derived from the geometry, false if the vertex normals are set
     * explicitly.
     */
	public get autoDeriveTangents(): boolean {
		return this._autoDeriveTangents;
	}

	public set autoDeriveTangents(value: boolean) {
		if (this._autoDeriveTangents == value)
			return;

		this._autoDeriveTangents = value;
	}

	/**
     * Offers the option of enabling GPU accelerated animation on skeletons larger than 32 joints
     * by condensing the number of joint index values required per sprite. Only applicable to
     * skeleton animations that utilise more than one sprite object. Defaults to false.
     */
	public get useCondensedIndices(): boolean {
		return this._useCondensedIndices;
	}

	public set useCondensedIndices(value: boolean) {
		if (this._useCondensedIndices == value)
			return;

		this._useCondensedIndices = value;
	}

	/**
	 *
	 */
	constructor(concatenatedBuffer: AttributesBuffer = null) {
		super();

		this._concatenatedBuffer = concatenatedBuffer;
	}

	public copyTo(elements: ElementsBase): void {
		if (this.indices)
			elements.setIndices(this.indices.clone());

		for (const name in this._customAttributes)
			elements.setCustomAttributes(name, this.getCustomAtributes(name).clone());
	}

	/**
	 *
	 */
	public dispose(): void {
		this.clear();

		this._boundsRequests = 0;

		if (this._convexHull) {
			this._convexHull.dispose();
			this._convexHull = null;
		}

		if (this._indices) {
			this._indices.dispose();
			this._indices = null;
		}

		for (const name in this._customAttributes) {
			this._customAttributes[name].dispose();
			delete this._customAttributes;
		}
	}

	/**
	 * Updates the face indices of the TriangleElements.
	 *
	 * @param indices The face indices to upload.
	 */
	public setIndices(array: Array<number>, offset?: number);
	public setIndices(uint16Array: Uint16Array, offset?: number);
	public setIndices(short3Attributes: Short3Attributes, offset?: number);
	public setIndices(values: any, offset: number = 0): void {
		if (values instanceof Short3Attributes) {
			if (this._indices)
				this.clearIndices();

			this._indices = <Short3Attributes> values;
		} else if (values) {
			if (!this._indices)
				this._indices = new Short3Attributes();

			this._indices.set(values, offset);
		} else if (this._indices) {
			this._indices.dispose();
			this._indices = null;

			this.clearIndices();
		}

		if (this._indices) {
			this._numElements = this._indices.count;

			this.invalidateIndices();
		} else {
			this._numElements = 0;
		}
	}

	/**
	 * Updates custom attributes.
	 */
	public setCustomAttributes(name: string, array: Array<number>, offset?: number);
	public setCustomAttributes(name: string, arrayBufferView: ArrayBufferView, offset?: number);
	public setCustomAttributes(name: string, attributesView: AttributesView, offset?: number);
	public setCustomAttributes(name: string, values: any, offset: number = 0): void {
		if (values == this._customAttributes[name])
			return;

		if (values instanceof AttributesView) {
			this.clearVertices(this._customAttributes[name]);
			this._customAttributes[name] = values;
		} else if (values) {
			if (!this._customAttributes[name]) {
				//default custom atrributes is Float3
				this._customAttributes[name] = new Float3Attributes(this._concatenatedBuffer);
			}

			this._customAttributes[name].set(values, offset);
		} else if (this._customAttributes[name]) {
			this.clearVertices(this._customAttributes[name]);
			this._customAttributesNames.splice(this._customAttributesNames.indexOf(name), 1);
			delete this._customAttributes[name];
			return;
		}

		this.invalidateVertices(this._customAttributes[name]);

		this._verticesDirty[this._customAttributes[name].id] = false;

		if (this._customAttributesNames.indexOf(name) == -1)
			this._customAttributesNames.push(name);
	}

	/**
	 * Clones the current object
	 * @return An exact duplicate of the current object.
	 */
	public clone(): ElementsBase {
		throw new AbstractMethodError();
	}

	public applyTransformation(transform: Matrix3D, count: number = 0, offset: number = 0): void {
		throw new AbstractMethodError();
	}

	/**
	 * Scales the geometry.
	 * @param scale The amount by which to scale.
	 */
	public scale(scale: number, count: number = 0, offset: number = 0): void {
		throw new AbstractMethodError();
	}

	public scaleUV(scaleU: number = 1, scaleV: number = 1, count: number = 0, offset: number = 0): void {
		throw new AbstractMethodError();
	}

	public getBoxBounds(
		view: View,
		entity: ContainerNode = null,
		strokeFlag: boolean = true,
		matrix3D: Matrix3D = null,
		cache: Box = null,
		target: Box = null,
		count: number = 0,
		offset: number = 0): Box {

		throw new AbstractMethodError();
	}

	public getSphereBounds(
		view: View,
		center: Vector3D,
		matrix3D: Matrix3D = null,
		strokeFlag: boolean = true,
		cache: Sphere = null,
		target: Sphere = null,
		count: number = 0,
		offset: number = 0): Sphere {
		throw new AbstractMethodError();
	}

	public hitTestPoint(
		view: View,
		entity: ContainerNode,
		x: number, y: number, z: number,
		box: Box,
		count: number = 0,
		offset: number = 0): boolean {
		throw new AbstractMethodError();
	}

	public invalidateIndices(): void {
		if (!this._invalidateIndices)
			this._invalidateIndices = new ElementsEvent(ElementsEvent.INVALIDATE_INDICES, this._indices);

		this.dispatchEvent(this._invalidateIndices);
	}

	private clearIndices(): void {
		this.dispatchEvent(new ElementsEvent(ElementsEvent.CLEAR_INDICES, this._indices));
	}

	public invalidateVertices(attributesView: AttributesView): void {
		if (!attributesView || this._verticesDirty[attributesView.id])
			return;

		this._verticesDirty[attributesView.id] = true;

		if (!this._invalidateVertices[attributesView.id])
			this._invalidateVertices[attributesView.id] = new ElementsEvent(
				ElementsEvent.INVALIDATE_VERTICES, attributesView);

		this.dispatchEvent(this._invalidateVertices[attributesView.id]);
	}

	public clearVertices(attributesView: AttributesView): void {
		if (!attributesView)
			return;

		attributesView.dispose();

		this.dispatchEvent(new ElementsEvent(ElementsEvent.CLEAR_VERTICES, attributesView));

		this._verticesDirty[attributesView.id] = null;
		this._invalidateVertices[attributesView.id] = null;
	}

	public testCollision(
		view: View,
		collision: PickingCollision,
		box: Box,
		closestFlag: boolean,
		material: IMaterial,
		count: number,
		offset: number = 0): boolean {
		throw new AbstractMethodError();
	}
}