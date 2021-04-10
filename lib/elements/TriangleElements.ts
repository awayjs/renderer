import { Box, Sphere, Matrix3D, Vector3D, Point, Rectangle } from '@awayjs/core';

import { View, PickingCollision, ContainerNode } from '@awayjs/view';

import {
	AttributesBuffer,
	AttributesView,
	Float4Attributes,
	Float3Attributes,
	Float2Attributes,
	Short3Attributes,
} from '@awayjs/stage';

import { IMaterial } from '../base/IMaterial';
import { ElementsUtils } from '../utils/ElementsUtils';
import { TriangleElementsUtils } from '../utils/TriangleElementsUtils';
import { ConvexHullUtils } from '../utils/ConvexHullUtils';

import { ElementsBase, THullImplId } from './ElementsBase';

/**
 * @class away.base.TriangleElements
 */
export class TriangleElements extends ElementsBase {
	private static isIE: boolean=!!navigator.userAgent.match(/Trident/g) || !!navigator.userAgent.match(/MSIE/g);

	public static assetType: string = '[asset TriangleElements]';

	private _faceNormalsDirty: boolean = true;
	private _faceTangentsDirty: boolean = true;

	private _positions: AttributesView;
	private _normals: Float3Attributes;
	private _tangents: Float3Attributes;
	private _uvs: AttributesView;
	private _jointIndices: AttributesView;
	private _jointWeights: AttributesView;

	private _jointsPerVertex: number;

	private _faceNormals: Float4Attributes;
	private _faceTangents: Float3Attributes;

	//used for hittesting geometry
	public hitTestCache: Object = new Object();

	public get assetType(): string {
		return TriangleElements.assetType;
	}

	/**
	 *
	 */
	public get jointsPerVertex(): number {
		return this._jointsPerVertex;
	}

	public set jointsPerVertex(value: number) {
		if (this._jointsPerVertex == value)
			return;

		this._jointsPerVertex = value;

		if (this._jointIndices)
			this._jointIndices.dimensions = this._jointsPerVertex;

		if (this._jointWeights)
			this._jointWeights.dimensions = this._jointsPerVertex;
	}

	/**
	 *
	 */
	public get positions(): AttributesView {
		if (!this._positions)
			this.setPositions(new Float3Attributes(this._concatenatedBuffer));

		return this._positions;
	}

	/**
	 *
	 */
	public get normals(): Float3Attributes {
		if (!this._normals || this._verticesDirty[this._normals.id])
			this.setNormals(this._normals);

		return this._normals;
	}

	/**
	 *
	 */
	public get tangents(): Float3Attributes {
		if (!this._tangents || this._verticesDirty[this._tangents.id])
			this.setTangents(this._tangents);

		return this._tangents;
	}

	/**
	 * The raw data of the face normals, in the same order as the faces are listed in the index list.
	 */
	public get faceNormals(): Float4Attributes {
		if (this._faceNormalsDirty)
			this.updateFaceNormals();

		return this._faceNormals;
	}

	/**
	 * The raw data of the face tangets, in the same order as the faces are listed in the index list.
	 */
	public get faceTangents(): Float3Attributes {
		if (this._faceTangentsDirty)
			this.updateFaceTangents();

		return this._faceTangents;
	}

	/**
	 *
	 */
	public get uvs(): AttributesView {
		if (!this._uvs && TriangleElements.isIE) {
			const attributesView2: AttributesView = new AttributesView(Float32Array, 2);
			attributesView2.set(this._positions.get(this._positions.count));
			const attributesBuffer2: AttributesBuffer = attributesView2.attributesBuffer;
			this._uvs = new Float2Attributes(attributesBuffer2);
			attributesView2.dispose();
		}

		return this._uvs;
	}

	/**
	 *
	 */
	public get jointIndices(): AttributesView {
		return this._jointIndices;
	}

	/**
	 *
	 */
	public get jointWeights(): AttributesView {
		return this._jointWeights;
	}

	public prepareScale9(bounds: Rectangle, grid: Rectangle, clone: boolean): TriangleElements {
		return TriangleElementsUtils.prepareScale9(this, bounds, grid, clone);
	}

	public updateScale9(scaleX: number, scaleY: number) {
		if (!this.scale9Indices) {
			return;
		}

		TriangleElementsUtils.updateScale9(
			this,
			this.originalScale9Bounds,
			scaleX,
			scaleY,
			false,
			false
		);
	}

	public getBoxBounds(
		view: View, entity: ContainerNode = null,
		strokeFlag: boolean = true, matrix3D: Matrix3D = null,
		cache: Box = null, target: Box = null,
		count: number = 0, offset: number = 0): Box {

		count = count || this._numElements || this._numVertices;

		this._boundsRequests++;

		if (
			Settings.ENABLE_CONVEX_BOUNDS
			&& this._boundsRequests > Settings.CONVEX_MIN_REQUIEST_FOR_BUILD
			&& count > Settings.POINTS_COUNT_FOR_CONVEX
			&& !this.isDynamic // diable for dynamic elements, beacause a reconstructed every frame
		) {
			if (
				!this._convexHull
				|| this._convexHull.count !== count// drop hull data, invalid
				|| this._convexHull.offset !==  offset // drop hull data, invalid
			) {
				this._convexHull = <THullImplId> ConvexHullUtils.fromAttribute(
					this.positions,
					this.indices,
					1, // step every index
					count,
					offset
				);

				if (this._convexHull) {
					this._convexHull.offset = offset;
					this._convexHull.count = count;

					console.debug(
						'[Triangle] Build convex for:', this.id,
						'vertex / hull', (count / this._convexHull.points.length) | 0);
				}
			}

			// Crashable??
			// Maybe, i don't know, falling back to utils
			if (this._convexHull) {
				return ConvexHullUtils.createBox(this._convexHull, matrix3D, target, cache);
			}
		}

		return TriangleElementsUtils.getBoxBounds(
			this.positions,
			this.indices,
			matrix3D,
			cache,
			target,
			count,
			offset);
	}

	public getSphereBounds(
		view: View, center: Vector3D,
		matrix3D: Matrix3D = null, strokeFlag: boolean = true,
		cache: Sphere = null, target: Sphere = null,
		count: number = 0, offset: number = 0): Sphere {

		return TriangleElementsUtils.getSphereBounds(
			this.positions,
			center,
			matrix3D,
			cache,
			target,
			count || this._numVertices,
			offset);
	}

	public hitTestPoint(
		view: View, entity: ContainerNode,
		x: number, y: number, z: number,
		box: Box, count: number = 0,
		offset: number = 0, idx_count: number = 0,
		idx_offset: number = 0): boolean {

		return TriangleElementsUtils.hitTest(
			x, y, 0,
			box,
			this,
			count || this._numElements || this._numVertices,
			offset);
	}

	/**
	 *
	 */
	public setPositions(array: Array<number>, offset?: number);
	public setPositions(arrayBufferView: ArrayBufferView, offset?: number);
	public setPositions(attributesView: AttributesView, offset?: number);
	public setPositions(values: any, offset: number = 0): void {
		if (values == this._positions)
			return;

		if (values instanceof AttributesView) {
			this.clearVertices(this._positions);
			this._positions = <AttributesView> values;
		} else if (values) {
			if (!this._positions)
				this._positions = new Float3Attributes(this._concatenatedBuffer);

			this._positions.set(values, offset);
		} else {
			this.clearVertices(this._positions);
			this._positions = new Float3Attributes(this._concatenatedBuffer); //positions cannot be null
		}

		this._numVertices = this._positions.count;

		if (this._autoDeriveNormals)
			this.invalidateVertices(this._normals);

		if (this._autoDeriveTangents)
			this.invalidateVertices(this._tangents);

		this.invalidateVertices(this._positions);

		this._verticesDirty[this._positions.id] = false;

		// drop hull, positions is should be reconstructed
		this._convexHull = null;
	}

	/**
	 * Updates the vertex normals based on the geometry.
	 */
	public setNormals(array: Array<number>, offset?: number);
	public setNormals(float32Array: Float32Array, offset?: number);
	public setNormals(float3Attributes: Float3Attributes, offset?: number);
	public setNormals(values: any, offset: number = 0): void {
		if (!this._autoDeriveNormals) {
			if (values == this._normals)
				return;

			if (values instanceof Float3Attributes) {
				this.clearVertices(this._normals);
				this._normals = <Float3Attributes> values;
			} else if (values) {
				if (!this._normals)
					this._normals = new Float3Attributes(this._concatenatedBuffer);

				this._normals.set(values, offset);
			} else if (this._normals) {
				this.clearVertices(this._normals);
				this._normals = null;
				return;
			}
		} else {
			this._normals = ElementsUtils.generateNormals(
				this.indices,
				this.faceNormals,
				this._normals,
				this._concatenatedBuffer);
		}

		this.invalidateVertices(this._normals);

		this._verticesDirty[this._normals.id] = false;
	}

	/**
	 * Updates the vertex tangents based on the geometry.
	 */
	public setTangents(array: Array<number>, offset?: number);
	public setTangents(float32Array: Float32Array, offset?: number);
	public setTangents(float3Attributes: Float3Attributes, offset?: number);
	public setTangents(values: any, offset: number = 0): void {
		if (!this._autoDeriveTangents) {
			if (values == this._tangents)
				return;

			if (values instanceof Float3Attributes) {
				this.clearVertices(this._tangents);
				this._tangents = values;
			} else if (values) {
				if (!this._tangents)
					this._tangents = new Float3Attributes(this._concatenatedBuffer);

				this._tangents.set(values, offset);
			} else if (this._tangents) {
				this.clearVertices(this._tangents);
				this._tangents = null;
				return;
			}
		} else {
			this._tangents = ElementsUtils.generateTangents(
				this.indices,
				this.faceTangents,
				this.faceNormals,
				this._tangents,
				this._concatenatedBuffer);
		}

		this.invalidateVertices(this._tangents);

		this._verticesDirty[this._tangents.id] = false;
	}

	/**
	 * Updates the uvs based on the geometry.
	 */
	public setUVs(array: Array<number>, offset?: number);
	public setUVs(arrayBufferView: ArrayBufferView, offset?: number);
	public setUVs(attributesView: AttributesView, offset?: number);
	public setUVs(values: any, offset: number = 0): void {
		if (values == this._uvs)
			return;

		if (values instanceof AttributesView) {
			this.clearVertices(this._uvs);
			this._uvs = values;
		} else if (values) {
			if (!this._uvs)
				this._uvs = new Float2Attributes(this._concatenatedBuffer);

			this._uvs.set(values, offset);
		} else if (this._uvs) {
			this.clearVertices(this._uvs);
			this._uvs = null;
			return;
		}

		this.invalidateVertices(this._uvs);

		this._verticesDirty[this._uvs.id] = false;
	}

	/**
	 * Updates the joint indices
	 */
	public setJointIndices(array: Array<number>, offset?: number);
	public setJointIndices(float32Array: Float32Array, offset?: number);
	public setJointIndices(attributesView: AttributesView, offset?: number);
	public setJointIndices(values: any, offset: number = 0): void {
		if (values == this._jointIndices)
			return;

		if (values instanceof AttributesView) {
			this.clearVertices(this._jointIndices);
			this._jointIndices = values;
		} else if (values) {
			if (!this._jointIndices)
				this._jointIndices = new AttributesView(Float32Array, this._jointsPerVertex, this._concatenatedBuffer);

			if (this._useCondensedIndices) {
				let i: number = 0;
				let oldIndex: number;
				let newIndex: number = 0;
				const dic: Object = new Object();

				this._condensedIndexLookUp = new Array<number>();

				while (i < values.length) {
					oldIndex = values[i];

					// if we encounter a new index, assign it a new condensed index
					if (dic[oldIndex] == undefined) {
						dic[oldIndex] = newIndex;
						this._condensedIndexLookUp[newIndex++] = oldIndex;
					}

					//reset value to dictionary lookup
					values[i++] = dic[oldIndex];
				}
			}

			this._jointIndices.set(values, offset);

		} else if (this._jointIndices) {
			this.clearVertices(this._jointIndices);
			this._jointIndices = null;
			return;
		}

		this.invalidateVertices(this._jointIndices);

		this._verticesDirty[this._jointIndices.id] = false;
	}

	/**
	 * Updates the joint weights.
	 */
	public setJointWeights(array: Array<number>, offset?: number);
	public setJointWeights(float32Array: Float32Array, offset?: number);
	public setJointWeights(attributesView: AttributesView, offset?: number);
	public setJointWeights(values: any, offset: number = 0): void {
		if (values == this._jointWeights)
			return;

		if (values instanceof AttributesView) {
			this.clearVertices(this._jointWeights);
			this._jointWeights = values;
		} else if (values) {
			if (!this._jointWeights)
				this._jointWeights = new AttributesView(Float32Array, this._jointsPerVertex, this._concatenatedBuffer);

			this._jointWeights.set(values, offset);

		} else if (this._jointWeights) {
			this.clearVertices(this._jointWeights);
			this._jointWeights = null;
			return;
		}

		this.invalidateVertices(this._jointWeights);

		this._verticesDirty[this._jointWeights.id] = false;
	}

	/**
	 *
	 */
	public dispose(): void {
		super.dispose();

		if (this._positions) {
			this._positions.dispose();
			this._positions = null;
		}

		if (this._normals) {
			this._normals.dispose();
			this._normals = null;
		}

		if (this._tangents) {
			this._tangents.dispose();
			this._tangents = null;
		}

		if (this._uvs) {
			this._uvs.dispose();
			this._uvs = null;
		}

		if (this._jointIndices) {
			this._jointIndices.dispose();
			this._jointIndices = null;
		}

		if (this._jointWeights) {
			this._jointWeights.dispose();
			this._jointWeights = null;
		}

		if (this._faceNormals) {
			this._faceNormals.dispose();
			this._faceNormals = null;
		}

		if (this._faceTangents) {
			this._faceTangents.dispose();
			this._faceTangents = null;
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
		super.setIndices(values, offset);

		this._faceNormalsDirty = true;
		this._faceTangentsDirty = true;

		if (this._autoDeriveNormals)
			this.invalidateVertices(this._normals);

		if (this._autoDeriveTangents)
			this.invalidateVertices(this._tangents);
	}

	public copyTo(elements: TriangleElements): void {
		super.copyTo(elements);

		//temp disable auto derives
		const autoDeriveNormals: boolean = this._autoDeriveNormals;
		const autoDeriveTangents: boolean = this._autoDeriveTangents;
		elements.autoDeriveNormals = this._autoDeriveNormals = false;
		elements.autoDeriveTangents = this._autoDeriveTangents = false;

		elements.setPositions(this.positions.clone());

		if (this.normals)
			elements.setNormals(this.normals.clone());

		if (this.tangents)
			elements.setTangents(this.tangents.clone());

		if (this.uvs)
			elements.setUVs(this.uvs.clone());

		elements.jointsPerVertex = this._jointsPerVertex;

		if (this.jointIndices)
			elements.setJointIndices(this.jointIndices.clone());

		if (this.jointWeights)
			elements.setJointWeights(this.jointWeights.clone());

		//return auto derives to cloned values
		elements.autoDeriveNormals = this._autoDeriveNormals = autoDeriveNormals;
		elements.autoDeriveTangents = this._autoDeriveTangents = autoDeriveTangents;

		if (this.scale9Indices) {
			elements.originalScale9Bounds = this.originalScale9Bounds;
			elements.scale9Grid = this.scale9Grid;
			elements.scale9Indices = this.scale9Indices;
			elements.initialScale9Positions = this.initialScale9Positions;
		}
	}

	/**
	 * Clones the current object
	 * @return An exact duplicate of the current object.
	 */
	public clone(): TriangleElements {
		const clone: TriangleElements = new TriangleElements(
			this._concatenatedBuffer ? this._concatenatedBuffer.clone() : null);

		this.copyTo(clone);

		return clone;
	}

	public scaleUV(scaleU: number = 1, scaleV: number = 1, count: number = 0, offset: number = 0): void {
		if (this.uvs) // only scale if uvs exist
			ElementsUtils.scale(scaleU, scaleV, 0, this.uvs, count || this._numVertices, offset);
	}

	/**
	 * Scales the geometry.
	 * @param scale The amount by which to scale.
	 */
	public scale(scale: number, count: number = 0, offset: number = 0): void {
		ElementsUtils.scale(scale, scale, scale, this.positions, count || this._numVertices, offset);
	}

	public applyTransformation(transform: Matrix3D, count: number = 0, offset: number = 0): void {
		ElementsUtils.applyTransformation(
			transform, this.positions, this.normals, this.tangents, count || this._numVertices, offset);
	}

	/**
	 * Updates the tangents for each face.
	 */
	private updateFaceTangents(): void {
		this._faceTangents = ElementsUtils.generateFaceTangents(
			this.indices, this.positions, this.uvs || this.positions, this._faceTangents, this.numElements);

		this._faceTangentsDirty = false;
	}

	/**
	 * Updates the normals for each face.
	 */
	private updateFaceNormals(): void {
		this._faceNormals = ElementsUtils.generateFaceNormals(
			this.indices, this.positions, this._faceNormals, this.numElements);

		this._faceNormalsDirty = false;
	}

	public testCollision(
		view: View, collision: PickingCollision,
		box: Box, closestFlag: boolean,
		material: IMaterial, count: number,
		offset: number = 0): boolean {

		const rayPosition: Vector3D = collision.rayPosition;
		const rayDirection: Vector3D = collision.rayDirection;

		let t: number;
		let i0: number, i1: number, i2: number;
		let rx: number, ry: number, rz: number;
		let nx: number, ny: number, nz: number;
		let cx: number, cy: number, cz: number;
		let coeff: number, u: number, v: number, w: number;
		let p0x: number, p0y: number, p0z: number;
		let p1x: number, p1y: number, p1z: number;
		let p2x: number, p2y: number, p2z: number;
		let s0x: number, s0y: number, s0z: number;
		let s1x: number, s1y: number, s1z: number;
		let nl: number, nDotV: number, D: number, disToPlane: number;
		let Q1Q2: number, Q1Q1: number, Q2Q2: number, RQ1: number, RQ2: number;
		let collisionTriangleIndex: number = -1;
		const bothSides: boolean = material.bothSides;

		const positions: ArrayBufferView = this.positions.get(count, offset);
		const posDim: number = this.positions.dimensions;
		const posStride: number = this.positions.stride;

		let indices: Uint16Array;
		if (this.indices) {
			indices = this.indices.get(this.numElements);
			count = indices.length;
		}

		for (let index: number = 0; index < count; index += 3) { // sweep all triangles
			// evaluate triangle indices
			if (indices) {
				i0 = indices[index] * posStride;
				i1 = indices[index + 1] * posStride;
				i2 = indices[index + 2] * posStride;
			} else {
				i0 = index * posStride;
				i1 = (index + 1) * posStride;
				i2 = (index + 2) * posStride;
			}

			// evaluate triangle positions
			p0x = positions[i0];
			p1x = positions[i1];
			p2x = positions[i2];
			s0x = p1x - p0x; // s0 = p1 - p0
			s1x = p2x - p0x; // s1 = p2 - p0

			p0y = positions[i0 + 1];
			p1y = positions[i1 + 1];
			p2y = positions[i2 + 1];
			s0y = p1y - p0y;
			s1y = p2y - p0y;

			if (posDim == 3) {
				p0z = positions[i0 + 2];
				p1z = positions[i1 + 2];
				p2z = positions[i2 + 2];
				s0z = p1z - p0z;
				s1z = p2z - p0z;

				// evaluate sides and triangle normal
				nx = s0y * s1z - s0z * s1y; // n = s0 x s1
				ny = s0z * s1x - s0x * s1z;
				nz = s0x * s1y - s0y * s1x;
				nl = 1 / Math.sqrt(nx * nx + ny * ny + nz * nz); // normalize n
				nx *= nl;
				ny *= nl;
				nz *= nl;
			} else { //2d hittest
				p0z = 0;
				p1z = 0;
				s0z = 0;
				s1z = 0;
				nx = 0;
				ny = 0;
				nz = ((s0x * s1y - s0y * s1x) > 0) ? 1 : -1;
			}

			// -- plane intersection test --
			nDotV = nx * rayDirection.x + ny * +rayDirection.y + nz * rayDirection.z; // rayDirection . normal
			if ((!bothSides && nDotV < 0.0) || (bothSides && nDotV != 0.0)) { // an intersection must exist
				// find collision t
				D = -(nx * p0x + ny * p0y + nz * p0z);
				disToPlane = -(nx * rayPosition.x + ny * rayPosition.y + nz * rayPosition.z + D);
				t = disToPlane / nDotV;
				// find collision point
				cx = rayPosition.x + t * rayDirection.x;
				cy = rayPosition.y + t * rayDirection.y;
				cz = rayPosition.z + t * rayDirection.z;
				// collision point inside triangle? ( using barycentric coordinates )
				Q1Q2 = s0x * s1x + s0y * s1y + s0z * s1z;
				Q1Q1 = s0x * s0x + s0y * s0y + s0z * s0z;
				Q2Q2 = s1x * s1x + s1y * s1y + s1z * s1z;
				rx = cx - p0x;
				ry = cy - p0y;
				rz = cz - p0z;
				RQ1 = rx * s0x + ry * s0y + rz * s0z;
				RQ2 = rx * s1x + ry * s1y + rz * s1z;
				coeff = 1 / (Q1Q1 * Q2Q2 - Q1Q2 * Q1Q2);
				if (!isFinite(coeff))
					continue;
				v = coeff * (Q2Q2 * RQ1 - Q1Q2 * RQ2);
				w = coeff * (-Q1Q2 * RQ1 + Q1Q1 * RQ2);
				if (v < 0)
					continue;
				if (w < 0)
					continue;
				u = 1 - v - w;
				if (!(u < 0) && t > 0 && t < collision.rayEntryDistance) { // all tests passed
					collisionTriangleIndex = index / 3;
					collision.rayEntryDistance = t;

					collision.position = collision.position || new Vector3D();
					collision.position.setTo(cx, cy, cz);

					collision.normal = collision.normal || new Vector3D();
					collision.normal.setTo(nx, ny, nz);

					if (this.uvs) { //uv calculations
						const uvs: ArrayBufferView = this.uvs.get(this.numVertices);
						const uvStride: number = this.uvs.stride;

						let uIndex: number = indices ? indices[index] * uvStride : index * uvStride;
						const uv0: Vector3D = new Vector3D(uvs[uIndex], uvs[uIndex + 1]);
						uIndex = indices ? indices[index + 1] * uvStride : (index + 1) * uvStride;
						const uv1: Vector3D = new Vector3D(uvs[uIndex], uvs[uIndex + 1]);
						uIndex = indices ? indices[index + 2] * uvStride : (index + 2) * uvStride;
						const uv2: Vector3D = new Vector3D(uvs[uIndex], uvs[uIndex + 1]);
						collision.uv = new Point(u * uv0.x + v * uv1.x + w * uv2.x, u * uv0.y + v * uv1.y + w * uv2.y);
					}
					collision.elementIndex = collisionTriangleIndex;

					// if not looking for best hit, first found will do...
					if (!closestFlag)
						return true;
				}
			}
		}

		if (collisionTriangleIndex >= 0)
			return true;

		return false;
	}
}

import { AssetEvent } from '@awayjs/core';

import {
	Stage,
	ContextGLDrawMode,
	ContextGLProgramType,
	IContextGL,
	ShaderRegisterCache,
	ShaderRegisterData,
	ShaderRegisterElement,
	IVao
} from '@awayjs/stage';

import { RenderGroup } from '../RenderGroup';
import { _Stage_ElementsBase } from '../base/_Stage_ElementsBase';
import { Settings } from '../Settings';
import { ElementsEvent } from '../events/ElementsEvent';
import { _Render_RenderableBase } from '../base/_Render_RenderableBase';
import { ShaderBase } from '../base/ShaderBase';
import { _Render_ElementsBase } from '../base/_Render_ElementsBase';

/**
 *
 * @class away.pool._Stage_TriangleElements
 */
export class _Stage_TriangleElements extends _Stage_ElementsBase {
	private _triangleElements: TriangleElements;
	private _vao: IVao;
	private _vaoIsInvalid: boolean = true;

	constructor(triangleElements: TriangleElements, stage: Stage) {
		super(triangleElements, stage);

		this._triangleElements = triangleElements;
		if (!this._triangleElements.isDynamic
				&& Settings.ALLOW_VAO
				&& stage.context.hasVao) {

			this._vao = stage.context.createVao();
		}

	}

	_onInvalidateIndices(event: ElementsEvent) {
		super._onInvalidateIndices(event);

		this._vaoIsInvalid = true;
		// drop vao every invalidation because buffers can be rebound
		//		if (this._vao) {
		//			this._vao.dispose();
		//			this._vao = null;
		//		}
	}

	_onInvalidateVertices(event: ElementsEvent) {
		super._onInvalidateVertices(event);

		this._vaoIsInvalid = true;
		// drop vao every invalidation because buffers can be rebound
		//		if (this._vao) {
		//			this._vao.dispose();
		//			this._vao = null;
		//		}
	}

	onInvalidate(event: AssetEvent) {
		super.onInvalidate(event);

		this._vaoIsInvalid = true;
		// drop vao every invalidation because buffers can be rebound
		//		if (this._vao) {
		//			this._vao.dispose();
		//			this._vao = null;
		//		}
	}

	public onClear(event: AssetEvent): void {
		super.onClear(event);

		this._triangleElements = null;

		this._vaoIsInvalid = true;

		if (this._vao) {
			this._vao.dispose();
			this._vao = null;
		}
	}

	public _setRenderState(renderRenderable: _Render_RenderableBase, shader: ShaderBase): void {

		this._vao && this._vao.bind();

		super._setRenderState(renderRenderable, shader);

		if (!this._vao || this._vaoIsInvalid) {
			//set buffers
			//TODO: find a better way to update a concatenated buffer when autoderiving
			if (shader.normalIndex >= 0 && this._triangleElements.autoDeriveNormals)
				this._triangleElements.normals;

			if (shader.tangentIndex >= 0 && this._triangleElements.autoDeriveTangents)
				this._triangleElements.tangents;

			if (shader.curvesIndex >= 0)
				this.activateVertexBufferVO(shader.curvesIndex, this._triangleElements.getCustomAtributes('curves'));

			if (shader.uvIndex >= 0)
				this.activateVertexBufferVO(
					shader.uvIndex, this._triangleElements.uvs || this._triangleElements.positions);

			if (shader.secondaryUVIndex >= 0) {
				this.activateVertexBufferVO(
					shader.secondaryUVIndex,
					this._triangleElements.getCustomAtributes('secondaryUVs')
							|| this._triangleElements.uvs
							|| this._triangleElements.positions);
			}

			if (shader.normalIndex >= 0)
				this.activateVertexBufferVO(shader.normalIndex, this._triangleElements.normals);

			if (shader.tangentIndex >= 0)
				this.activateVertexBufferVO(shader.tangentIndex, this._triangleElements.tangents);

			if (shader.jointIndexIndex >= 0)
				this.activateVertexBufferVO(shader.jointIndexIndex, this._triangleElements.jointIndices);

			if (shader.jointWeightIndex >= 0)
				this.activateVertexBufferVO(shader.jointIndexIndex, this._triangleElements.jointWeights);

			this.activateVertexBufferVO(0, this._triangleElements.positions);

			this._vaoIsInvalid = false;
		}
	}

	public draw(
		renderRenderable: _Render_RenderableBase,
		shader: ShaderBase & { supportModernAPI?: boolean, syncUniforms?: () => void },
		count: number,
		offset: number
	): void {

		const modern = shader.supportModernAPI;

		//set constants
		if (shader.sceneMatrixIndex >= 0) {
			shader.sceneMatrix.copyFrom(renderRenderable.renderSceneTransform, true);
			shader.viewMatrix.copyFrom(shader.view.viewMatrix3D, true);
		} else {
			const matrix3D: Matrix3D = Matrix3D.CALCULATION_MATRIX;
			matrix3D.copyFrom(renderRenderable.renderSceneTransform);
			matrix3D.append(shader.view.viewMatrix3D);
			shader.viewMatrix.copyFrom(matrix3D, true);
		}

		if (!modern) {
			const context: IContextGL = this._stage.context;
			context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, shader.vertexConstantData);
			context.setProgramConstantsFromArray(ContextGLProgramType.FRAGMENT, shader.fragmentConstantData);
		} else {
			shader.syncUniforms();
		}

		if (this._indices) {
			this.getIndexBufferGL().draw(ContextGLDrawMode.TRIANGLES, offset * 3, count * 3 || this.numIndices);
		} else {
			this._stage.context.drawVertices(ContextGLDrawMode.TRIANGLES, offset, count || this.numVertices);
		}

		this._vao && this._vao.unbind();
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
		return new _Stage_TriangleElements(this._triangleElements, this._stage);
	}
}

/**
 * @class away.pool.LineMaterialPool
 */
export class _Render_TriangleElements extends _Render_ElementsBase {
	public _includeDependencies(shader: ShaderBase): void {
	}

	public _getVertexCode(
		shader: ShaderBase,
		registerCache: ShaderRegisterCache,
		sharedRegisters: ShaderRegisterData): string {

		let code: string = '';

		//get the projection coordinates
		const position: ShaderRegisterElement = (
			(shader.globalPosDependencies > 0)
				? sharedRegisters.globalPositionVertex
				: sharedRegisters.animatedPosition);

		//reserving vertex constants for projection matrix
		const viewMatrixReg: ShaderRegisterElement = registerCache.getFreeVertexConstant();
		registerCache.getFreeVertexConstant();
		registerCache.getFreeVertexConstant();
		registerCache.getFreeVertexConstant();
		shader.viewMatrixIndex = viewMatrixReg.index * 4;

		if (shader.projectionDependencies > 0) {
			sharedRegisters.projectionFragment = registerCache.getFreeVarying();
			const temp: ShaderRegisterElement = registerCache.getFreeVertexVectorTemp();
			code += 'm44 ' + temp + ', ' + position + ', ' + viewMatrixReg + '\n' +
                'mov ' + sharedRegisters.projectionFragment + ', ' + temp + '\n' +
                'mov op, ' + temp + '\n';
		} else {
			code += 'm44 op, ' + position + ', ' + viewMatrixReg + '\n';
		}

		return code;
	}

	public _getFragmentCode(
		shader: ShaderBase,
		registerCache: ShaderRegisterCache,
		sharedRegisters: ShaderRegisterData): string {
		return '';
	}
}

RenderGroup.registerElements(_Render_TriangleElements, TriangleElements);
Stage.registerAbstraction(_Stage_TriangleElements, TriangleElements);
