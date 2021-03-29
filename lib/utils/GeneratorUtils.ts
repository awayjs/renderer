import { Rectangle, Vector3D,  } from '@awayjs/core';
import { AttributesView } from '@awayjs/stage';

type TGenCallback = (source: PolygonView<any>, result: PolygonView, back: boolean) => void;

export class Vertice3DView  {
	private _data: Float32Array[] = [];

	public get length() {
		return this._data.length;
	}

	public toVec(vect: Vector3D = new Vector3D(), index = 0): Vector3D {
		const s = this._data[index];
		const l = s.length;

		for (let i = 0; i < 4; i++) {
			vect._rawData[i] = i < l ? s[i] : 0;
		}

		return vect;
	}

	public fromVec(vect: Vector3D, index = 0): this {
		const s = this._data[index];
		const l = s.length;

		for (let i = 0; i < l; i++) {
			s[i] = vect._rawData[i];
		}

		return this;
	}

	public setData(data: Float32Array, index: number, clone = false): this {
		this._data[index] = clone ?  data.slice() : data;

		return this;
	}

	public getData(index: number): Float32Array {
		return this._data[index];
	}

	public lerpTo (target: Vertice3DView, alpha: number): this {
		if (alpha === 0) {
			return this;
		}

		if (alpha === 1) {
			return this.copyFrom(target);
		}

		// interpolate all values
		for (let i = 0; i < this._data.length; i++) {
			const to = target._data[i];
			const from = this._data[i];

			for (let k = 0; k < this._data[i].length; k++) {
				from[k] = (1 - alpha) * from[k] + alpha * to[k];
			}
		}

		return this;
	}

	public add (source: Vertice3DView, scale: number = 1): this {
		// interpolate all values
		for (let i = 0; i < this._data.length; i++) {
			const from = source._data[i];
			const to = this._data[i];

			for (let k = 0; k < this._data[i].length; k++) {
				to[k] += from[k] * scale;
			}
		}

		return this;
	}

	public scale (s: number): this {
		// interpolate all values
		for (let i = 0; i < this._data.length; i++) {
			const to = this._data[i];

			for (let k = 0; k < this._data[i].length; k++) {
				to[k] *= s;
			}
		}

		return this;
	}

	public copyFrom (from: Vertice3DView): this {
		const to = this._data;

		for (let i = 0; i < from.length; i++) {
			if (to[i]) {
				to[i].set(from._data[i]);
			} else {
				to[i] = from._data[i].slice();
			}
		}

		return this;
	}

	public clone(): Vertice3DView {
		return new Vertice3DView().copyFrom(this);
	}
}

export class PolygonView<T extends {clone?(): T} = any> {
	public vertices: Array<Vertice3DView> = [];
	public userData: T;

	private _middle: Vertice3DView;

	get middle(): Vertice3DView {
		if (this._middle) return this._middle;

		this._middle = this.vertices[0].clone();

		for (let i = 1; i < this.vertices.length; i++) {
			this._middle.add(this.vertices[i]);
		}

		this._middle.scale(1 / this.vertices.length);
		return this._middle;
	}

	constructor(points?: Vertice3DView[], userData?: T) {
		if (points) {
			this.vertices = points.map((e)=> e.clone());
		}

		if (userData) {
			this.userData = userData;
		}
	}

	public clone(): PolygonView<T> {
		const p = new PolygonView<T>();
		const l = this.vertices.length;

		for (let i = 0; i < l; i++) {
			p.vertices[i] = this.vertices[i].clone();
		}

		if (this.userData) {
			p.userData = this.userData.clone
				? this.userData.clone()
				: Object.assign({}, this.userData);
		}

		return p;
	}

	public add(view: Vertice3DView, clone: boolean = false): this {
		this.vertices.push(clone ? view.clone() : view);

		return this;
	}

	public get length() {
		return this.vertices.length;
	}
}

export class MeshView<T extends {} = never> {
	public poly: PolygonView<T>[] = [];
	public rect: Rectangle = new Rectangle();
	public polySize: number = 3;
	public hasNGones: boolean = false;

	push (p: PolygonView<T>): this {
		this.poly.push(p);
		return this;
	}

	/**
	 * Unroll all n-gone convex polys to 3-gone polygons
	 */
	public normalise(): this {
		if (!this.hasNGones) {
			return;
		}

		const normalised = [];

		for (const p of this.poly) {

			// invalid vertices
			if (p.length < this.polySize) {
				continue;
			}

			if (p.length === this.polySize) {
				normalised.push(p);
				continue;
			}

			for (let i = 1; i < p.length - 1; i++) {
				const n = new PolygonView();
				// shared user data;
				n.userData = p.userData;

				// construct poly in direct order with shared 1 vert (CCW or CW? i don't know ;)
				// fan triangulation
				// we sure that this a convex polygon
				n.add(p.vertices[0].clone());
				n.add(p.vertices[(i) % p.length].clone());
				n.add(p.vertices[(i + 1) % p.length].clone());

				normalised.push(n);
			}
		}

		this.poly = normalised;
		return this;
	}

	/**
	 * Construct buffer from poly data
	 * @param index Index of vertices attribute 0 - pos, 1 - uv etc
	 */
	public toFloatArray(index: number = 0): Float32Array {
		const count = this.poly.length;

		if (this.poly.length === 0) return null;

		// check a dimension for calc a output size
		const test = this.poly[0].vertices[0].getData(index);
		const dim = test.length;

		// polygon should has 3 vertices
		const data = new Float32Array(count * dim * 3);

		for (let i = 0; i < count * 3; i++) {
			const poly = this.poly[i / 3 | 0];
			const vert = poly.vertices[i % 3];

			data.set(vert.getData(index), i * dim);
		}

		return data;
	}

	public static fromAttributes<T> (
		attrs: AttributesView[],
		length: number,
		polySize: number = 0,
		userDataCtor?: { new(): T}): MeshView<T> {

		const mesh = new MeshView<T>();
		mesh.polySize = polySize;

		let poly: PolygonView<T>;

		const views: Float32Array[] = <any>attrs.map((e) => e.get(length, 0));

		for (let i = 0; i < length; i++) {
			if (i % polySize === 0) {
				poly = new PolygonView<T>();
				poly.userData = userDataCtor ? new userDataCtor() : null;
			}

			mesh.poly.push(poly);

			const v = new Vertice3DView();
			poly.add(v);

			for (let k = 0; k < attrs.length; k++) {
				const o = attrs[k].offset;
				const s = attrs[k].stride;
				const d = attrs[k].dimensions;

				v.setData(views[k].slice(o + s * i, o + s * i + d), k);
			}
		}

		return mesh;
	}
}

export class GeneratorUtils {
	private static EPS = 0.0001;

	private static InFront (n: Vector3D, d: number, p: Vector3D): boolean {
		return n.dotProduct(p) - d > this.EPS;
	}

	private static Behind (n: Vector3D, d: number, p: Vector3D): boolean {
		return n.dotProduct(p) - d < -this.EPS;
	}

	private static OnPlane (n: Vector3D, d: number, p: Vector3D): boolean {
		return !this.InFront(n, d, p) && !this.Behind(n, d, p);
	}

	private static Intersect(a: Vertice3DView ,b: Vertice3DView ,d1: number , d2: number): Vertice3DView {
		const alpha = d1 / (d1 - d2);

		return new Vertice3DView().copyFrom(a).lerpTo(b, alpha);
	}

	private static SliceNaive<T> (
		out: MeshView<T>,
		a: Vertice3DView, b: Vertice3DView, c: Vertice3DView,
		d1: number, d2: number, d3: number): MeshView<T> {

		// Calculate the intersection point from a to b
		const ab = this.Intersect(a, b, d1, d2);

		if (d1 < 0.0) {
			// b to c crosses the clipping plane
			if (d3 < 0.0) {
				const bc = this.Intersect(b, c, d2, d3);

				out
					.push(new PolygonView<T>([b, bc, ab]))
					.push(new PolygonView<T>([bc, c, a]))
					.push(new PolygonView<T>([ab, bc, a]));
			// c to a crosses the clipping plane
			} else {
				const ac = this.Intersect(a, c, d1, d3);

				out
					.push(new PolygonView<T>([a, ab, ac]))
					.push(new PolygonView<T>([ab, b, c]))
					.push(new PolygonView<T>([ac, ab, c]));
			}
		} else {
			// c to a crosses the clipping plane
			if (d3 < 0.0) {
				const ac = this.Intersect(a, c, d1, d3);

				out
					.push(new PolygonView<T>([a, ab, ac]))
					.push(new PolygonView<T>([ac, ab, b]))
					.push(new PolygonView<T>([b, c, ac]));
			// b to c crosses the clipping plane
			} else {
				const bc = this.Intersect(b, c, d2, d3);

				out
					.push(new PolygonView<T>([b, bc, ab]))
					.push(new PolygonView<T>([a, ab, bc]))
					.push(new PolygonView<T>([c, a, bc]));
			}
		}

		return out;
	}

	// Slices all triangles given a vector of triangles.
	// A new output triangle list is generated. The old
	// list of triangles is discarded.
	// n - The normal of the clipping plane
	// d - Distance of clipping plane from the origin
	// Reference: Exact Bouyancy for Polyhedra by
	//            Erin Catto in Game Programming Gems 6
	public static SliceAllNaive <T>(mesh: MeshView<T>, n: Vector3D,  d: number): MeshView<T> {
		const out = new MeshView<any>();
		out.polySize = mesh.polySize;

		const tmp = new Vector3D();

		for (let i = 0; i < mesh.poly.length; ++i) {
			// Grab a triangle from the global triangle list
			const tri = mesh.poly[i];

			const a = tri.vertices[0];
			const b = tri.vertices[1];
			const c = tri.vertices[2];

			a.toVec(tmp,0);
			// Compute distance of each triangle vertex to the clipping plane
			const d1 = a.toVec(tmp).dotProduct(n) - d;
			const d2 = b.toVec(tmp).dotProduct(n) - d;
			const d3 = c.toVec(tmp).dotProduct(n) - d;

			// a to b crosses the clipping plane
			if (d1 * d2 < 0.0) {
				this.SliceNaive(out, a, b, c, d1, d2, d3);
				// a to c crosses the clipping plane
			} else if (d1 * d3 < 0.0) {
				this.SliceNaive(out, c, a, b, d3, d1, d2);
				// b to c crosses the clipping plane
			} else if (d2 * d3 < 0.0) {
				this.SliceNaive(out, b, c, a, d2, d3, d1);
			} else {
				out.push(tri);
			}
		}

		return out;
	}

	/**
	 * It gen corrupted results, need improve, eXponenta
	 *
	 * Splits a polygon in half along a splitting plane using a clipping algorithm
	 * call Sutherland-Hodgman clipping
	 * Resource: Page 367 of Ericson (Real-Time Collision Detection)
	 */
	public static SutherlandHodgman<T> (
		poly: PolygonView<T>,
		normal: Vector3D,
		d: number,
		out: MeshView<T>, callback?: TGenCallback
	): MeshView<T> {
		const frontPoly = new PolygonView<T>();
		const backPoly = new PolygonView<T>();

		const s = poly.length;
		const verts = poly.vertices;

		const tmpA = new Vector3D();
		const tmpB = new Vector3D();

		if (d < 0) {
			d = -d;
			normal.scaleBy(-1);
		}

		let vA = verts[s - 1];
		let vecA = vA.toVec(tmpA, 0);

		let da = normal.dotProduct(vecA) - d;

		for (let i = 0; i < s; ++i) {
			const vB = verts[i];
			const vecB = vB.toVec(tmpB, 0);
			const db = normal.dotProduct(vecB) - d;

			if (this.InFront(normal, d, vecB)) {
				if (this.Behind(normal, d, vecA)) {
					const itr = this.Intersect(vB, vA, db, da);

					frontPoly.add(itr);
					backPoly.add(itr, true);
				}

				frontPoly.add(vB, true);

			} else if (this.Behind(normal, d, vecB)) {
				if (this.InFront(normal, d, vecA)) {
					const itr = this.Intersect(vA, vB, da, db);

					frontPoly.add(itr, false);
					backPoly.add(itr, true);

				} else if (this.OnPlane(normal, d, vecA)) {
					backPoly.add(vA, true);
				}

				backPoly.add(vB, true);
			} else {
				frontPoly.add(vB, true);

				if (this.OnPlane(normal, d, vecA)) {
					backPoly.add(vB, true);
				}
			}

			vA = vB.clone();
			vecA = vA.toVec(vecA, 0);
			da = db;
		}

		if (frontPoly.length) {
			//if (frontPoly.length < 3) debugger;

			callback && callback(poly, frontPoly, false);

			if (out.polySize !== frontPoly.length) {
				out.hasNGones = true;
			}

			out.poly.push(frontPoly);
		}

		if (backPoly.length) {
			//if (backPoly.length < 3) debugger;

			callback && callback(poly, backPoly, true);

			if (out.polySize !== backPoly.length) {
				out.hasNGones = true;
			}

			out.poly.push(backPoly);
		}

		return out;
	}

	public static SliceHodgman<T>(mesh: MeshView<T>, n: Vector3D, d: number, callback?: TGenCallback): MeshView<T> {
		const out = new MeshView<T>();
		out.polySize = mesh.polySize;

		for (const p of mesh.poly) {
			this.SutherlandHodgman(p, n, d, out, callback);
		}

		return out;
	}
}