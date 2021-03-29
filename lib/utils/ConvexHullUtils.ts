import { Box, Matrix3D } from '@awayjs/core';
import { AttributesView, Short2Attributes } from '@awayjs/stage';

const FIXED_BASE = 1000;

export type TPoint = [ number, number ];
export type TEdge = { a: number, b: number, angle: number };

export interface IHullData {
	middle: TPoint;
	points: Array<TPoint>;
	edges: Array<TEdge>;
}

export interface IHullImpl extends IHullData {
	fetchEdge (angle: number): TEdge;
	fetchPoint (index: number): TPoint;
	dispose(): void;
}

const PI = Math.PI;
const PI2 = PI * 2;
const PI_2 = PI / 2;

export class ConvexHull implements IHullImpl {
	middle: TPoint;
	points: TPoint[];
	edges: TEdge[];
	ranges: Array<{ from: number, to: number}> = null;

	constructor (obj: IHullData) {
		this.edges = obj.edges;
		this.points = obj.points;
		this.middle = obj.middle;

		this._constructRanges();
	}

	private _constructRanges() {
		const edges = this.edges;
		const r = this.ranges = [];

		let range = 0;

		this.ranges[range] = { from: 0, to :0 };

		for (let i = 0; i < edges.length; i++) {

			if (edges[i].angle > (range + 1) * PI_2) {
				r[range].to = i - 1;
				r[++range] = { from: i, to: 0 };
			}
		}

		r[range].to = edges.length - 1;
	}

	public fetchEdge (angle: number): TEdge {
		let a = angle;

		while (a < 0) a += PI2;
		while (a >= PI2) a -= PI2;

		const edges = this.edges;
		let from = 0;
		let to = edges.length - 1;

		if (this.ranges) {
			let range = 3;

			if (a < PI2) {
				range = 0;
			} else if (a < PI) {
				range = 1;
			} else if (a < PI + PI_2) {
				range = 2;
			}

			from = this.ranges[range].from;
			to = this.ranges[range].to;
		}

		let minEdge = this.edges[from];

		for (let i = from + 1; i <= to; i++) {
			if (edges[i].angle > a) {
				return minEdge;
			}
			minEdge = edges[i];
		}

		return minEdge;
	}

	public fetchPoint (index: number) {
		if (index < 0) index += this.points.length;
		return this.points[index % this.points.length];
	}

	dispose() {
		this.edges = null;
		this.points = null;
		this.ranges = null;
		this.middle = null;
	}
}

export class ConvexHullUtils {

	private static ccw (p1: TPoint, p2: TPoint, p3: TPoint): number {
		return (p2[0] - p1[0]) * (p3[1] - p1[1])
			- (p2[1] - p1[1]) * (p3[0] - p1[0]);
	}

	private static cmpPoints (a: TPoint, b: TPoint): number {
		return (a[0] < b[0] || (Math.abs(a[0] - b[0]) === 0 && a[1] < b[1])) ? 1 : -1;
	}

	private static cmpEdges (a: TEdge, b: TEdge): number {
		return a.angle - b.angle;
	}

	public static EPS = 1.0 / FIXED_BASE;

	public static nearest(x0: number, y0: number, x1: number, y1: number) {
		let dx = (x0 - x1);
		(dx < 0) && (dx = -dx);

		let dy = (y0 - y1);
		(dy < 0) && (dy = -dy);

		return (dx + dy) < this.EPS;
	}

	/**
	 * @description Generate a hull by modified Graham scan, not required sorting by angle
	 * @see https://en.wikibooks.org/wiki/Algorithm_Implementation/Geometry/Convex_hull/Monotone_chain
	 */
	private static generateHull (points: Array<TPoint>): IHullImpl | null {
		const len = points.length;

		// sort by X and Y
		points.sort(this.cmpPoints);

		const p1 = points[0];
		const p2 = points[points.length - 1];

		// stack for selection
		const top: Array<TPoint> = [p1];
		const bottom: Array<TPoint> = [p1];

		let last: TPoint = p1;

		for (let i = 1; i < len; i++) {
			const next = points[i];

			if (this.nearest(last[0], last[1], next[0], next[1])) {
				continue;
			}

			last = next;

			const a = this.ccw(p1, next, p2);

			// pass for TOP part of shape
			if (i === len - 1 || a < 0) {
				while (top.length > 1 && this.ccw(top[top.length - 2], top[top.length - 1], next) >= 0) {
					top.length--;
				}
				top.push(next);
			}

			// pass for BOTTOM part of shape
			if (i === len - 1 || a > 0) {
				while (bottom.length > 1 && this.ccw(bottom[bottom.length - 2], bottom[bottom.length - 1], next) < 0) {
					bottom.length--;
				}
				bottom.push(next);
			}
		}

		if ((bottom.length + top.length) < 5) {
			// invalid hull, drop;
			return null;
		}

		// drop first point, because it same as in top
		bottom.shift();
		// drop last point, because it same as in top
		if (bottom.length > 0)
			bottom.length--;

		// concat in reversed order
		const hull = top.concat(bottom.reverse());
		const edges = new Array<TEdge>(hull.length);

		const hullLen = hull.length;
		const middle: TPoint = [0,0];
		const atan2 = Math.atan2;

		for (let i = 0; i < hullLen; i++) {
			const p0 = hull [i];
			const p1 = hull [(i + 1) % hullLen];
			let angle = atan2(-(p1[1] - p0[1]), p1[0] - p0[0]);

			if (angle < 0) {
				angle += Math.PI * 2;
			}

			edges[i] = {
				a: i,
				b: (i + 1) % hullLen,
				angle
			};

			middle[0] += p0[0];
			middle[1] += p0[1];
		}

		middle[0] /= hullLen;
		middle[1] /= hullLen;

		// sort edges by angle, because 0 is left
		// TODO: fix ordering to avoid a sorting
		// but this is very fast when a data blocked sorted,
		// because ib v8 this used a TimSort
		edges.sort(this.cmpEdges);

		return new ConvexHull({
			points: hull,
			edges,
			middle
		});
	}

	public static fromBuffer (buffer: Float32Array, dimension = 2): IHullImpl | null {
		// we should reconstuct this for [[0,0]] array to simplyfy sorting and math
		const len = buffer.length / dimension | 0;
		const points: Array<[number, number]> = new Array(len);

		for (let i = 0; i < len; i++) {
			// we not support 3D buffer
			points[i] = [buffer[i * dimension], buffer[i * dimension + 1]];
		}

		return this.generateHull(points);
	}

	public static fromAttribute (
		posAttrs: AttributesView,
		indexAttrs: Short2Attributes = null,
		step: number = 1,
		count: number,
		offset: number = 0): IHullImpl | null {

		let indices: Uint16Array;
		let len: number;
		let positions: ArrayBufferView;

		const stride = posAttrs.stride;

		if (indexAttrs) {
			len = count * indexAttrs.dimensions;
			indices = indexAttrs.get(count, offset);
			positions = posAttrs.get(posAttrs.count);
		} else {
			len = count;
			positions = posAttrs.get(count, offset);
		}

		const points: Array<TPoint> = new Array(len / step);

		let p = 0;
		for (let i = 0; i < len; i += step) {
			const index = indices ? indices[i] * stride : i * stride;

			points[p] = [
				positions[index], positions[index + 1]
			];

			p++;
		}

		return this.generateHull(points);
	}

	public static createBox(simpleHull: IHullData, matrix?: Matrix3D, target?: Box, cache?: Box): Box {

		// construct 2D bounds from hull without fast approximation becasue it not tested
		const rawData = matrix?._rawData;
		let minX = Infinity;
		let minY = Infinity;
		let maxX = -Infinity;
		let maxY = -Infinity;

		if (target) {
			minX = target.x;
			minY = target.y;
			maxX = minX + target.width;
			maxY = minY + target.height;
		} else {
			target = cache || new Box();
		}

		for (const p of simpleHull.points) {

			let x = p[0];
			let y = p[1];

			if (rawData) {
				const ox = x;
				const oy = y;

				x = ox * rawData[0] + oy * rawData[4] + rawData[12];
				y = ox * rawData[1] + oy * rawData[5] + rawData[13];
			}

			if (x < minX) minX = x;
			if (x > maxX) maxX = x;

			if (y < minY) minY = y;
			if (y > maxY) maxY = y;
		}

		target.x = minX;
		target.y = minY;
		target.width = maxX - minX;
		target.height = maxY - minY;
		target.z = target.depth = 0;

		return target;
	}
}