import { Matrix3D, Vector3D, Box, Sphere, Rectangle } from '@awayjs/core';

import { AttributesView, Short2Attributes } from '@awayjs/stage';

import { HitTestCache } from './HitTestCache';
import { LineElements } from '../elements/LineElements';

export class LineElementsUtils {
	//TODO - generate this dyanamically based on num tris

	public static hitTest(x: number, y: number, z: number, thickness: number, box: Box, lineElements: LineElements, count: number, offset: number = 0): boolean {
		const positionAttributes: AttributesView = lineElements.positions;

		const posStride: number = positionAttributes.stride;

		let positions: ArrayBufferView = positionAttributes.get(count, offset);

		let indices: Uint16Array;

		let len: number;
		if (lineElements.indices) {
			indices = lineElements.indices.get(count, offset);
			positions = positionAttributes.get(positionAttributes.count);
			len = count * lineElements.indices.dimensions;
		} else {
			positions = positionAttributes.get(count, offset);
			len = count;
		}

		let id0: number;
		let id1: number;

		let ax: number;
		let ay: number;
		let bx: number;
		let by: number;

		const hitTestCache: HitTestCache = lineElements.hitTestCache[offset] || (lineElements.hitTestCache[offset] = new HitTestCache());
		const index: number = hitTestCache.lastCollisionIndex;

		if (index != -1 && index < len) {
			precheck: {
				if (indices) {
					id0 = indices[index] * posStride;
					id1 = indices[index + 1] * posStride;
				} else {
					id0 = index * posStride;
					id1 = (index + 1) * posStride;
				}

				ax = positions[id0];
				ay = positions[id0 + 1];
				bx = positions[id1];
				by = positions[id1 + 1];

				//from a to p
				var dx: number = ax - x;
				var dy: number = ay - y;

				//edge normal (a-b)
				var nx: number = by - ay;
				var ny: number = -(bx - ax);
				var D: number = Math.sqrt(nx * nx + ny * ny);

				//TODO: should strictly speaking be an elliptical calculation, use circle to approx temp
				if (Math.abs((dx * nx) + (dy * ny)) > thickness * D)
					break precheck;

				//edge vector
				var dot: number = (dx * ny) - (dy * nx);

				if (dot > D * D || dot < 0)
					break precheck;

				return true;
			}
		}

		//hard coded min vertex count to bother using a grid for
		if (len > 150) {
			const cells: Array<Array<number>> = hitTestCache.cells;
			const divisions: number = cells.length ? hitTestCache.divisions : (hitTestCache.divisions = Math.min(Math.ceil(Math.sqrt(len)), 32));
			const conversionX: number = divisions / box.width;
			const conversionY: number = divisions / box.height;
			const minx: number = box.x;
			const miny: number = box.y;

			if (!cells.length) { //build grid

				//now we have bounds start creating grid cells and filling
				cells.length = divisions * divisions;

				for (var k: number = 0; k < len; k += 3) {
					if (indices) {
						id0 = indices[k] * posStride;
						id1 = indices[k + 1] * posStride;
					} else {
						id0 = k * posStride;
						id1 = (k + 1) * posStride;
					}

					ax = positions[id0];
					ay = positions[id0 + 1];
					bx = positions[id1];
					by = positions[id1 + 1];

					//subtractions to push into positive space
					const min_index_x: number = Math.floor((Math.min(ax, bx) - minx) * conversionX);
					const min_index_y: number = Math.floor((Math.min(ay, by) - miny) * conversionY);

					const max_index_x: number = Math.floor((Math.max(ax, bx) - minx) * conversionX);
					const max_index_y: number = Math.floor((Math.max(ay, by) - miny) * conversionY);

					for (let i: number = min_index_x; i <= max_index_x; i++) {
						for (let j: number = min_index_y; j <= max_index_y; j++) {
							const c: number = i + j * divisions;
							var nodes: Array<number> = cells[c] || (cells[c] = new Array<number>());

							//push in the triangle ids
							nodes.push(k);
						}
					}
				}
			}

			const index_x: number = Math.floor((x - minx) * conversionX);
			const index_y: number = Math.floor((y - miny) * conversionY);
			var nodes: Array<number> = cells[index_x + index_y * divisions];

			if (nodes == null) {
				hitTestCache.lastCollisionIndex = -1;
				return false;
			}

			const nodeCount: number = nodes.length;
			for (let n: number = 0; n < nodeCount; n++) {
				var k: number = nodes[n];

				if (indices) {
					id0 = indices[k] * posStride;
					id1 = indices[k + 1] * posStride;
				} else {
					id0 = k * posStride;
					id1 = (k + 1) * posStride;
				}

				ax = positions[id0];
				ay = positions[id0 + 1];
				bx = positions[id1];
				by = positions[id1 + 1];

				//from a to p
				var dx: number = ax - x;
				var dy: number = ay - y;

				//edge normal (a-b)
				var nx: number = by - ay;
				var ny: number = -(bx - ax);
				var D: number = Math.sqrt(nx * nx + ny * ny);

				//TODO: should strictly speaking be an elliptical calculation, use circle to approx temp
				if (Math.abs((dx * nx) + (dy * ny)) > thickness * D)
					continue;

				//edge vector
				var dot: number = (dx * ny) - (dy * nx);

				if (dot > D * D || dot < 0)
					continue;

				hitTestCache.lastCollisionIndex = k;
				return true;
			}
			hitTestCache.lastCollisionIndex = -1;
			return false;
		}

		//brute force
		for (var k: number = 0; k < len; k += 6) {
			if (indices) {
				id0 = indices[k] * posStride;
				id1 = indices[k + 1] * posStride;
			} else {
				id0 = k * posStride;
				id1 = (k + 1) * posStride;
			}

			ax = positions[id0];
			ay = positions[id0 + 1];
			bx = positions[id1];
			by = positions[id1 + 1];

			//from a to p
			var dx: number = ax - x;
			var dy: number = ay - y;

			//edge normal (a-b)
			var nx: number = by - ay;
			var ny: number = -(bx - ax);
			var D: number = Math.sqrt(nx * nx + ny * ny);

			//TODO: should strictly speaking be an elliptical calculation, use circle to approx temp
			if (Math.abs((dx * nx) + (dy * ny)) > thickness * D)
				continue;

			//edge vector
			var dot: number = (dx * ny) - (dy * nx);

			if (dot > D * D || dot < 0)
				continue;

			hitTestCache.lastCollisionIndex = k;
			return true;
		}
		hitTestCache.lastCollisionIndex = -1;
		return false;
	}

	public static getBoxBounds(positionAttributes: AttributesView, indexAttributes: Short2Attributes, matrix3D: Matrix3D, thicknessScale: Vector3D, cache: Box, target: Box, count: number, offset: number = 0): Box {
		let positions: ArrayBufferView;
		const posDim: number = positionAttributes.dimensions;
		const posStride: number = positionAttributes.stride;

		let minX: number = 0, minY: number = 0, minZ: number = 0;
		let maxX: number = 0, maxY: number = 0, maxZ: number = 0;

		let indices: Uint16Array;
		let len: number;
		if (indexAttributes) {
			len = count * indexAttributes.dimensions;
			indices = indexAttributes.get(count, offset);
			positions = positionAttributes.get(positionAttributes.count);
		} else {
			len = count;
			positions = positionAttributes.get(count, offset);
		}

		if (len == 0)
			return target;

		var i: number = 0;
		let index: number;
		let pos1: number, pos2: number, pos3: number, rawData: Float32Array;

		if (matrix3D)
			rawData = matrix3D._rawData;

		for (var i: number = 0; i < len; i += 3) {
			index = (indices) ? indices[i] * posStride : i * posStride;

			if (matrix3D) {
				if (posDim == 6) {
					pos1 = positions[index] * rawData[0] + positions[index + 1] * rawData[4] + positions[index + 2] * rawData[8] + rawData[12];
					pos2 = positions[index] * rawData[1] + positions[index + 1] * rawData[5] + positions[index + 2] * rawData[9] + rawData[13];
					pos3 = positions[index] * rawData[2] + positions[index + 1] * rawData[6] + positions[index + 2] * rawData[10] + rawData[14];
				} else {
					pos1 = positions[index] * rawData[0] + positions[index + 1] * rawData[4] + rawData[12];
					pos2 = positions[index] * rawData[1] + positions[index + 1] * rawData[5] + rawData[13];
				}
			} else {
				pos1 = positions[index];
				pos2 = positions[index + 1];
				pos3 = (posDim == 6) ? positions[index + 2] : 0;
			}

			if (i == 0) {
				maxX = minX = pos1;
				maxY = minY = pos2;
				maxZ = minZ = (posDim == 6) ? pos3 : 0;
			} else {
				if (pos1 < minX)
					minX = pos1;
				else if (pos1 > maxX)
					maxX = pos1;

				if (pos2 < minY)
					minY = pos2;
				else if (pos2 > maxY)
					maxY = pos2;

				if (posDim == 6) {
					if (pos3 < minZ)
						minZ = pos3;
					else if (pos3 > maxZ)
						maxZ = pos3;
				}
			}
		}

		const box: Box = new Box(minX, minY);
		box.right = maxX;
		box.bottom = maxY;

		this.mergeThinkness(box, thicknessScale, matrix3D);

		return box.union(target, target || cache);
	}

	public static mergeThinkness(target: Box, thicknessScale: Vector3D, matrix3D: Matrix3D): Box {
		const rawData = matrix3D?._rawData;

		const thicknessX = matrix3D
			? thicknessScale.x * rawData[0] + thicknessScale.y * rawData[4]
			: thicknessScale.x;
		const thicknessY = matrix3D
			? thicknessScale.x * rawData[1] + thicknessScale.y * rawData[5]
			: thicknessScale.y;

		target.x -= thicknessX;
		target.y -= thicknessY;
		target.right += thicknessX;
		target.bottom += thicknessY;

		return target;
	}

	public static getSphereBounds(positionAttributes: AttributesView, center: Vector3D, matrix3D: Matrix3D, cache: Sphere, output: Sphere, count: number, offset: number = 0): Sphere {
		const positions: ArrayBufferView = positionAttributes.get(count, offset);
		const posDim: number = positionAttributes.dimensions;
		const posStride: number = positionAttributes.stride;

		let maxRadiusSquared: number = 0;
		let radiusSquared: number;
		const len = count * posStride;
		let distanceX: number;
		let distanceY: number;
		let distanceZ: number;

		for (let i: number = 0; i < len; i += posStride) {
			distanceX = positions[i] - center.x;
			distanceY = positions[i + 1] - center.y;
			distanceZ = (posDim == 6) ? positions[i + 2] - center.z : -center.z;
			radiusSquared = distanceX * distanceX + distanceY * distanceY + distanceZ * distanceZ;

			if (maxRadiusSquared < radiusSquared)
				maxRadiusSquared = radiusSquared;
		}

		if (output == null)
			output = new Sphere();

		output.x = center.x;
		output.y = center.y;
		output.z = center.z;
		output.radius = Math.sqrt(maxRadiusSquared);

		return output;
	}

	public static prepareSlice9 (
		elem: LineElements,
		bounds: Rectangle,
		offsets: Rectangle,
		copy: boolean
	): LineElements {

		const target = copy ? elem.clone() : elem;

		const shapeBounds = LineElementsUtils.getBoxBounds (
			elem.positions,
			elem.indices,
			null,
			new Vector3D(),
			null,
			null,
			elem._numElements || elem._numVertices
		);

		const sliceX = [
			-Infinity,
			offsets.x,
			offsets.right,
			Infinity
		];

		const sliceY = [
			-Infinity,
			offsets.y,
			offsets.bottom,
			Infinity
		];

		const chunkX = {
			from: 0, to: 0
		};

		const chunkY = {
			from: 0, to: 0
		};

		for (let i = 1; i < 3; i++) {
			if (shapeBounds.x > sliceX[i]) {
				chunkX.from = chunkX.to = i;
			}

			if (shapeBounds.y > sliceY[i]) {
				chunkY.from = chunkY.to = i;
			}
		}

		for (let i = 0; i < 3; i++) {
			if (shapeBounds.right >= sliceX[i] && i >= chunkX.from) {
				chunkX.to = i;
			}

			if (shapeBounds.bottom >= sliceY[i] && i >= chunkY.from) {
				chunkY.to = i;
			}
		}

		target.slice9offsets = offsets;
		target.originalSlice9Size = bounds;
		const indices = target.slice9Indices = Array.from({ length: 9 }, (_) => 0);

		const stack = this.restoreLineSegments (target);

		// shape already in valid region
		// not require run slicer for this case
		if (chunkX.from === chunkX.to && chunkY.from === chunkY.to) {

			const buff = new Float32Array(stack.length * 3);

			for (let i = 0; i < stack.length; i++) {
				buff[i * 3 + 0] = stack[i].x;
				buff[i * 3 + 1] = stack[i].y;
				buff[i * 3 + 2] = 0;
			}

			target.initialSlice9Positions = buff;
			target.slice9Indices[chunkY.from * 3 + chunkX.from] = target._numElements || target._numVertices;

			return target;
		}

		const posByChunks: number[][] = [];
		let count = 0;

		while (stack.length) {
			const b = stack.pop();
			const a = stack.pop();

			let cX = 0;
			let cY = 0;

			let breakAll = false;

			for (let y = chunkY.from; y <= chunkY.to; y++) {
				const day = sliceY[y + 1] - a.y;
				const dby = sliceY[y + 1] - b.y;

				// slicer is crossed, emit point
				if (day * dby < 0) {
					const alpha = day / (day - dby);
					const c = new Vector3D(a.x + alpha * (b.x - a.x), a.y + alpha * (b.y - a.y), 0, 0);

					// push new segs;
					stack.push(c, b, a, c);
					// drop process
					breakAll = true;
					break;
				}

				if ((a.y + b.y) * 0.5 > sliceY[y] && (a.y + b.y) * 0.5 <= sliceY[y + 1]) {
					cY = y;
				}

				for (let x = chunkX.from; x <= chunkX.to; x++) {
					const dax = sliceX[x + 1] - a.x;
					const dbx = sliceX[x + 1] - b.x;

					// slicer is crossed, emit point
					if (dax * dbx < 0) {
						const alpha = dax / (dax - dbx);
						const c = new Vector3D(a.x + alpha * (b.x - a.x), a.y + alpha * (b.y - a.y), 0, 0);

						// push new segs;
						stack.push(c, b, a, c);
						// drop process
						breakAll = true;
						break;
					}

					if ((a.x + b.x) * 0.5 > sliceX[x] && (a.x + b.x) * 0.5 <= sliceX[x + 1]) {
						cX = x;
					}
				}

				if (breakAll) break;
			}

			if (!breakAll) {
				if (!posByChunks[cX + cY * 3]) {
					posByChunks[cX + cY * 3] = [];
				}

				posByChunks[cX + cY * 3].push(a.x, a.y, 0, b.x, b.y, 0);
				count += 2;
			}
		}

		const posBuff = new Float32Array(count * 3);
		const thinBuff = new Float32Array(count);

		// fill by same thinkness
		thinBuff.fill(target.thickness.get(1)[0]);

		let nextIndices = 0;

		for (let i = 0; i < 9; i++) {
			if (!posByChunks[i]) {
				continue;
			}

			posBuff.set(posByChunks[i], nextIndices * 3);
			nextIndices += posByChunks[i].length / 3;
			indices[i] = nextIndices;
		}

		target.initialSlice9Positions = posBuff;

		target.setPositions(posBuff);
		target.setThickness(thinBuff);

		target.invalidate();

		return target;
	}

	private static restoreLineSegments(elem: LineElements): Vector3D[] {
		const positionAttributes = elem.positions;
		const indexAttributes = elem.indices;
		const count = elem._numElements || elem._numVertices;

		const posDim = positionAttributes.dimensions;
		const posStride = positionAttributes.stride;

		let indices: Uint16Array;
		let positions: Float32Array;
		let len: number;

		if (indexAttributes) {
			len = count * indexAttributes.dimensions;
			indices = indexAttributes.get(count, 0);
			positions = <any> positionAttributes.get(positionAttributes.count);
		} else {
			len = count;
			positions = <any> positionAttributes.get(count, 0);
		}

		const out: Vector3D[] = [];

		for (let i = 0; i < len; i += 6) {
			let index = indices ? indices[i] * posStride : i * posStride;

			out.push(new Vector3D(
				positions[index],
				positions[index + 1],
				posDim === 6 ?  positions[index + 2] : 0,
				0,
			));

			index += (posDim == 6) ? 3 : 2;
			out.push(new Vector3D(
				positions[index],
				positions[index + 1],
				posDim === 6 ?  positions[index + 2] : 0,
				0,
			));
		}

		return out;
	}

	public static updateSlice9(
		elem: LineElements,
		originalRect: Rectangle,
		scaleX: number,
		scaleY: number,
		init: boolean = false,
		copy: boolean = false,
	): LineElements {
		// todo: for now this only works for Float2Attributes.

		if (elem.slice9Indices.length !== 9) {
			throw 'ElementUtils: Error - triangleElement does not provide valid slice9Indices!';
		}

		const offsets = elem.slice9offsets;
		const left = offsets.x - originalRect.x;
		const right = originalRect.right - offsets.right;
		const top = offsets.y - originalRect.y;
		const bottom = originalRect.bottom - offsets.bottom;

		const s_len = elem.slice9Indices.length;

		let innerWidth = originalRect.width * scaleX - (left + right);
		let innerHeight = originalRect.height * scaleY - (top + bottom);

		let cornerScaleX = 1;
		let cornerScaleY = 1;

		// reduce a overflow, when scale to small
		if (innerWidth < 0) {
			innerWidth = 0;

			cornerScaleX = originalRect.width * scaleX / (left + right);
		}

		if (innerHeight < 0) {
			innerHeight = 0;

			cornerScaleY = originalRect.height * scaleY / (top + bottom);
		}

		const innerScaleX = innerWidth / offsets.width;
		const innerScaleY = innerHeight / offsets.height;

		const stride = elem.positions.stride;
		const attrOffset = elem.positions.offset;

		const positions = elem.positions.get(elem._numVertices);

		// todo: i had trouble when just cloning the positions
		//	for now i just create the initialSlice9Positions by iterating the positions

		const initPos = elem.initialSlice9Positions;

		const slice9Indices: number[] = elem.slice9Indices;

		const slice9Offsets_x = [
			0,
			left * cornerScaleX - left * innerScaleX,
			innerWidth - offsets.width * cornerScaleX,
		];

		const slice9Offsets_y = [
			0,
			top * cornerScaleY - top * innerScaleY,
			innerHeight - offsets.height * cornerScaleY,
		];

		// internal buffer iterator
		let attrindex = attrOffset;
		let vindex = 0;

		// iterating over the 9 chunks - keep in mind that we are constructing a 3x3 grid:
		for (let s = 0; s < s_len; s++) {

			const row = s / 3 | 0;
			const col = s % 3;

			// only need to x-scale if this is the middle column
			// if the innerWidth<=0 we can skip this complete column
			const scalex = col === 1 ? innerScaleX : cornerScaleX;

			// only need to y-scale if this is the middle row
			// if the innerHeight<=0 we can skip this complete row
			const scaley = row === 1 ? innerScaleY : cornerScaleY;

			// offsetx is different for each column
			const offsetx = slice9Offsets_x[col];

			// offsety is different for each row
			const offsety = slice9Offsets_y[row];

			// iterate the verts and apply the translation / scale
			// slice9Indices is vertices indeces, is not attribute indices
			while (vindex < slice9Indices[s]) {
				// start point
				const vxs = originalRect.x + (offsetx + (initPos[vindex * 3 + 0] - originalRect.x) * scalex) / scaleX;
				const vys = originalRect.y + (offsety + (initPos[vindex * 3 + 1] - originalRect.y) * scaley) / scaleY;
				// end point
				const vxe = originalRect.x + (offsetx + (initPos[vindex * 3 + 3] - originalRect.x) * scalex) / scaleX;
				const vye = originalRect.y + (offsety + (initPos[vindex * 3 + 4] - originalRect.y) * scaley) / scaleY;

				for (let i = 0; i < 2; i++) {
					// super complex, line has a lot of doubled vertices
					positions[attrindex + 0] = vxs;
					positions[attrindex + 1] = vys;
					positions[attrindex + 2] = 0;
					positions[attrindex + 3] = vxe;
					positions[attrindex + 4] = vye;
					positions[attrindex + 5] = 0;

					attrindex += stride;
					positions[attrindex + 0] = vxe;
					positions[attrindex + 1] = vye;
					positions[attrindex + 2] = 0;
					positions[attrindex + 3] = vxs;
					positions[attrindex + 4] = vys;
					positions[attrindex + 5] = 0;

					attrindex += stride;
				}
				// we should include a stride, because buffer maybe be contecated
				// or XYZ instead of XY

				vindex += 2;
			}
		}

		elem.positions.invalidate();
		elem.invalidate();

		return elem;
	}
}