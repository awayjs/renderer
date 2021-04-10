import { Matrix3D, Vector3D, Box, Sphere, Rectangle } from '@awayjs/core';
import { AttributesView, Short2Attributes } from '@awayjs/stage';
import { TriangleElements } from '../elements/TriangleElements';
import { GeneratorUtils, MeshView } from './GeneratorUtils';
import { HitTestCache } from './HitTestCache';

export class TriangleElementsUtils {
	//TODO - generate this dyanamically based on num tris

	public static hitTest(
		x: number,
		y: number,
		_z: number,
		box: Box,
		triangleElements: TriangleElements,
		count: number,
		offset: number = 0,
	): boolean {
		const positionAttributes: AttributesView = triangleElements.positions;
		const curveAttributes: AttributesView = triangleElements.getCustomAtributes('curves');

		const posStride: number = positionAttributes.stride;
		const curveStride: number = curveAttributes ? curveAttributes.stride : null;

		let positions: ArrayBufferView = positionAttributes.get(count, offset);
		let curves: ArrayBufferView = curveAttributes ? curveAttributes.get(count, offset) : null;

		let indices: Uint16Array;
		let len: number;
		if (triangleElements.indices) {
			indices = triangleElements.indices.get(count, offset);
			positions = positionAttributes.get(positionAttributes.count);
			curves = curveAttributes ? curveAttributes.get(curveAttributes.count) : null;
			len = count * triangleElements.indices.dimensions;
		} else {
			positions = positionAttributes.get(count, offset);
			curves = curveAttributes ? curveAttributes.get(count, offset) : null;
			len = count;
		}
		let id0: number;
		let id1: number;
		let id2: number;

		let ax: number;
		let ay: number;
		let bx: number;
		let by: number;
		let cx: number;
		let cy: number;

		const hitTestCache: HitTestCache =
			triangleElements.hitTestCache[offset] || (triangleElements.hitTestCache[offset] = new HitTestCache());
		const index: number = hitTestCache.lastCollisionIndex;

		if (index != -1 && index < len) {
			precheck: {
				if (indices) {
					id0 = indices[index + 2];
					id1 = indices[index + 1];
					id2 = indices[index];
				} else {
					id0 = index + 2;
					id1 = index + 1;
					id2 = index;
				}

				ax = positions[id0 * posStride];
				ay = positions[id0 * posStride + 1];
				bx = positions[id1 * posStride];
				by = positions[id1 * posStride + 1];
				cx = positions[id2 * posStride];
				cy = positions[id2 * posStride + 1];

				//from a to p
				let dx = ax - x;
				let dy = ay - y;

				//edge normal (a-b)
				let nx = by - ay;
				let ny = -(bx - ax);

				let dot = dx * nx + dy * ny;

				if (dot > 0) break precheck;

				dx = bx - x;
				dy = by - y;
				nx = cy - by;
				ny = -(cx - bx);

				dot = dx * nx + dy * ny;

				if (dot > 0) break precheck;

				dx = cx - x;
				dy = cy - y;
				nx = ay - cy;
				ny = -(ax - cx);

				dot = dx * nx + dy * ny;

				if (dot > 0) break precheck;

				if (curves) {
					//check if not solid
					if (curves[id0 * curveStride + 2] != -128) {
						const v0x = bx - ax;
						const v0y = by - ay;
						const v1x = cx - ax;
						const v1y = cy - ay;
						const v2x = x - ax;
						const v2y = y - ay;

						const den = v0x * v1y - v1x * v0y;
						const v = (v2x * v1y - v1x * v2y) / den;
						const w = (v0x * v2y - v2x * v0y) / den;
						//var u:number = 1 - v - w;	//commented out as inlined away

						//here be dragons
						const uu = 0.5 * v + w;
						const vv = w;
						const d = uu * uu - vv;
						const az = curves[id0 * curveStride];

						if (d > 0 && az == -128) {
							break precheck;
						} else if (d < 0 && az == 127) {
							break precheck;
						}
					}
				}

				return true;
			}
		}

		//hard coded min vertex count to bother using a grid for
		if (len > 150) {
			const cells: Array<Array<number>> = hitTestCache.cells;
			const divisions: number = cells.length
				? hitTestCache.divisions
				: (hitTestCache.divisions = Math.min(Math.ceil(Math.sqrt(len)), 32));
			const conversionX: number = divisions / box.width;
			const conversionY: number = divisions / box.height;
			const minx: number = box.x;
			const miny: number = box.y;

			if (!cells.length) {
				//build grid

				//now we have bounds start creating grid cells and filling
				cells.length = divisions * divisions;

				for (let k = 0; k < len; k += 3) {
					if (indices) {
						id0 = indices[k + 2];
						id1 = indices[k + 1];
						id2 = indices[k];
					} else {
						id0 = k + 2;
						id1 = k + 1;
						id2 = k;
					}

					ax = positions[id0 * posStride];
					ay = positions[id0 * posStride + 1];
					bx = positions[id1 * posStride];
					by = positions[id1 * posStride + 1];
					cx = positions[id2 * posStride];
					cy = positions[id2 * posStride + 1];

					//subtractions to push into positive space
					const min_index_x: number = Math.floor((Math.min(ax, bx, cx) - minx) * conversionX);
					const min_index_y: number = Math.floor((Math.min(ay, by, cy) - miny) * conversionY);

					const max_index_x: number = Math.floor((Math.max(ax, bx, cx) - minx) * conversionX);
					const max_index_y: number = Math.floor((Math.max(ay, by, cy) - miny) * conversionY);

					for (let i: number = min_index_x; i <= max_index_x; i++) {
						for (let j: number = min_index_y; j <= max_index_y; j++) {
							const c: number = i + j * divisions;
							const nodes: Array<number> = cells[c] || (cells[c] = new Array<number>());

							//push in the triangle ids
							nodes.push(k);
						}
					}
				}
			}

			const index_x: number = Math.floor((x - minx) * conversionX);
			const index_y: number = Math.floor((y - miny) * conversionY);
			const nodes: Array<number> = cells[index_x + index_y * divisions];

			if (nodes == null) {
				hitTestCache.lastCollisionIndex = -1;
				return false;
			}

			const nodeCount = nodes.length;
			for (let n = 0; n < nodeCount; n++) {
				const k = nodes[n];

				if (indices) {
					id2 = indices[k];
				} else {
					id2 = k;
				}

				if (id2 == index) continue;

				if (indices) {
					id0 = indices[k + 2];
					id1 = indices[k + 1];
				} else {
					id0 = k + 2;
					id1 = k + 1;
				}

				ax = positions[id0 * posStride];
				ay = positions[id0 * posStride + 1];
				bx = positions[id1 * posStride];
				by = positions[id1 * posStride + 1];
				cx = positions[id2 * posStride];
				cy = positions[id2 * posStride + 1];

				//from a to p
				let dx = ax - x;
				let dy = ay - y;

				//edge normal (a-b)
				let nx = by - ay;
				let ny = -(bx - ax);
				let dot = dx * nx + dy * ny;

				if (dot > 0) continue;

				dx = bx - x;
				dy = by - y;
				nx = cy - by;
				ny = -(cx - bx);

				dot = dx * nx + dy * ny;

				if (dot > 0) continue;

				dx = cx - x;
				dy = cy - y;
				nx = ay - cy;
				ny = -(ax - cx);

				dot = dx * nx + dy * ny;

				if (dot > 0) continue;

				if (curves) {
					//check if not solid
					if (curves[id0 * curveStride + 2] != -128) {
						const v0x = bx - ax;
						const v0y = by - ay;
						const v1x = cx - ax;
						const v1y = cy - ay;
						const v2x = x - ax;
						const v2y = y - ay;

						const den = v0x * v1y - v1x * v0y;
						const  v = (v2x * v1y - v1x * v2y) / den;
						const w = (v0x * v2y - v2x * v0y) / den;
						//var u:number = 1 - v - w;	//commented out as inlined away

						//here be dragons
						const uu = 0.5 * v + w;
						const vv = w;

						const d = uu * uu - vv;

						const az = curves[id0 * curveStride];

						if (d > 0 && az == -128) {
							continue;
						} else if (d < 0 && az == 127) {
							continue;
						}
					}
				}
				hitTestCache.lastCollisionIndex = k;
				return true;
			}
			hitTestCache.lastCollisionIndex = -1;
			return false;
		}

		//brute force
		for (let k = 0; k < len; k += 3) {
			if (indices) {
				id2 = indices[k];
			} else {
				id2 = k;
			}

			if (id2 == index) continue;

			if (indices) {
				id0 = indices[k + 2];
				id1 = indices[k + 1];
			} else {
				id0 = k + 2;
				id1 = k + 1;
			}

			ax = positions[id0 * posStride];
			ay = positions[id0 * posStride + 1];
			bx = positions[id1 * posStride];
			by = positions[id1 * posStride + 1];
			cx = positions[id2 * posStride];
			cy = positions[id2 * posStride + 1];

			//from a to p
			let dx = ax - x;
			let dy = ay - y;

			//edge normal (a-b)
			let nx = by - ay;
			let ny = -(bx - ax);

			let dot = dx * nx + dy * ny;

			if (dot > 0) continue;

			dx = bx - x;
			dy = by - y;
			nx = cy - by;
			ny = -(cx - bx);

			dot = dx * nx + dy * ny;

			if (dot > 0) continue;

			dx = cx - x;
			dy = cy - y;
			nx = ay - cy;
			ny = -(ax - cx);

			dot = dx * nx + dy * ny;

			if (dot > 0) continue;

			if (curves) {
				//check if not solid
				if (curves[id0 * curveStride + 2] != -128) {
					const v0x = bx - ax;
					const v0y = by - ay;
					const v1x = cx - ax;
					const v1y = cy - ay;
					const v2x = x - ax;
					const v2y = y - ay;

					const den = v0x * v1y - v1x * v0y;
					const v = (v2x * v1y - v1x * v2y) / den;
					const w = (v0x * v2y - v2x * v0y) / den;
					//var u:number = 1 - v - w;	//commented out as inlined away

					//here be dragons
					const uu = 0.5 * v + w;
					const vv = w;
					const d = uu * uu - vv;
					const az = curves[id0 * curveStride];

					if (d > 0 && az == -128) {
						continue;
					} else if (d < 0 && az == 127) {
						continue;
					}
				}
			}
			hitTestCache.lastCollisionIndex = k;
			return true;
		}
		hitTestCache.lastCollisionIndex = -1;
		return false;
	}

	public static getBoxBounds(
		positionAttributes: AttributesView,
		indexAttributes: Short2Attributes,
		matrix3D: Matrix3D,
		cache: Box,
		target: Box,
		count: number,
		offset: number = 0,
	): Box {
		let positions: ArrayBufferView;
		const posDim: number = positionAttributes.dimensions;
		const posStride: number = positionAttributes.stride;

		let minX: number = 0,
			minY: number = 0,
			minZ: number = 0;
		let maxX: number = 0,
			maxY: number = 0,
			maxZ: number = 0;

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

		if (len == 0) return target;

		let i: number = 0;
		let index: number;
		let pos1: number, pos2: number, pos3: number, rawData: Float32Array;

		if (matrix3D) rawData = matrix3D._rawData;

		if (target == null) {
			target = cache || new Box();
			index = indices ? indices[i] * posStride : i * posStride;
			if (matrix3D) {
				if (posDim == 3) {
					pos1 =
						positions[index] * rawData[0] +
						positions[index + 1] * rawData[4] +
						positions[index + 2] * rawData[8] +
						rawData[12];
					pos2 =
						positions[index] * rawData[1] +
						positions[index + 1] * rawData[5] +
						positions[index + 2] * rawData[9] +
						rawData[13];
					pos3 =
						positions[index] * rawData[2] +
						positions[index + 1] * rawData[6] +
						positions[index + 2] * rawData[10] +
						rawData[14];
				} else {
					pos1 = positions[index] * rawData[0] + positions[index + 1] * rawData[4] + rawData[12];
					pos2 = positions[index] * rawData[1] + positions[index + 1] * rawData[5] + rawData[13];
				}
			} else {
				pos1 = positions[index];
				pos2 = positions[index + 1];
				pos3 = posDim == 3 ? positions[index + 2] : 0;
			}

			maxX = minX = pos1;
			maxY = minY = pos2;
			maxZ = minZ = posDim == 3 ? pos3 : 0;
			i++;
		} else {
			maxX = (minX = target.x) + target.width;
			maxY = (minY = target.y) + target.height;
			maxZ = (minZ = target.z) + target.depth;
		}

		for (; i < len; i++) {
			index = indices ? indices[i] * posStride : i * posStride;

			if (matrix3D) {
				if (posDim == 3) {
					pos1 =
						positions[index] * rawData[0] +
						positions[index + 1] * rawData[4] +
						positions[index + 2] * rawData[8] +
						rawData[12];
					pos2 =
						positions[index] * rawData[1] +
						positions[index + 1] * rawData[5] +
						positions[index + 2] * rawData[9] +
						rawData[13];
					pos3 =
						positions[index] * rawData[2] +
						positions[index + 1] * rawData[6] +
						positions[index + 2] * rawData[10] +
						rawData[14];
				} else {
					pos1 = positions[index] * rawData[0] + positions[index + 1] * rawData[4] + rawData[12];
					pos2 = positions[index] * rawData[1] + positions[index + 1] * rawData[5] + rawData[13];
				}
			} else {
				pos1 = positions[index];
				pos2 = positions[index + 1];
				pos3 = posDim == 3 ? positions[index + 2] : 0;
			}

			if (pos1 < minX) minX = pos1;
			else if (pos1 > maxX) maxX = pos1;

			if (pos2 < minY) minY = pos2;
			else if (pos2 > maxY) maxY = pos2;

			if (posDim == 3) {
				if (pos3 < minZ) minZ = pos3;
				else if (pos3 > maxZ) maxZ = pos3;
			}
		}

		target.width = maxX - (target.x = minX);
		target.height = maxY - (target.y = minY);
		target.depth = maxZ - (target.z = minZ);

		return target;
	}

	public static getSphereBounds(
		positionAttributes: AttributesView,
		center: Vector3D,
		_matrix3D: Matrix3D,
		_cache: Sphere,
		output: Sphere,
		count: number,
		offset: number = 0,
	): Sphere {
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
			distanceZ = posDim == 3 ? positions[i + 2] - center.z : -center.z;
			radiusSquared = distanceX * distanceX + distanceY * distanceY + distanceZ * distanceZ;

			if (maxRadiusSquared < radiusSquared) maxRadiusSquared = radiusSquared;
		}

		if (output == null) output = new Sphere();

		output.x = center.x;
		output.y = center.y;
		output.z = center.z;
		output.radius = Math.sqrt(maxRadiusSquared);

		return output;
	}

	public static prepareScale9 (
		elem: TriangleElements,
		bounds: Rectangle,
		grid: Rectangle,
		copy: boolean
	): TriangleElements {

		if (elem._numElements !== 0) {
			throw 'Indices not support yet';
		}

		const target = copy ? elem.clone() : elem;

		const shapeBounds = TriangleElementsUtils.getBoxBounds (
			elem.positions,
			elem.indices,
			null,null, null,
			elem._numElements | elem._numVertices, 0);

		const sliceX = [
			-Infinity,
			grid.x,
			grid.right,
			Infinity
		];

		const sliceY = [
			-Infinity,
			grid.y,
			grid.bottom,
			Infinity
		];

		const chunkX = {
			from: 0, to: 0
		};

		const chunkY = {
			from: 0, to: 0
		};

		for (let i = 1; i < 3; i++) {
			if (shapeBounds.x >= sliceX[i]) {
				chunkX.from = chunkX.to = i;
			}

			if (shapeBounds.y >= sliceY[i]) {
				chunkY.from = chunkY.to = i;
			}
		}

		for (let i = 0; i < 3; i++) {
			if (shapeBounds.right > sliceX[i] && i >= chunkX.from) {
				chunkX.to = i;
			}

			if (shapeBounds.bottom > sliceY[i] && i >= chunkY.from) {
				chunkY.to = i;
			}
		}

		target.scale9Grid = grid;
		target.originalScale9Bounds = bounds;
		const indices = target.scale9Indices = Array.from({ length: 9 }, (_) => 0);

		// shape already in valid region
		// not require run slicer for this case
		if (chunkX.from === chunkX.to && chunkY.from === chunkY.to) {
			target.scale9Indices[chunkY.from * 3 + chunkX.from] = target._numVertices;

			return target;
		}

		// run splitter
		const attrs = [target.positions, target.uvs].filter(e => !!e);

		let mesh = MeshView.fromAttributes<number>(attrs, target._numVertices, 3);

		const vector = new Vector3D(0,0);

		vector.setTo(1, 0, 0, 0);
		// we slice only over 2 offsets
		for (let i = chunkX.from; i < chunkX.to; i++) {
			//mesh = GeneratorUtils.SliceHodgman(mesh, vector, sliceX[i]);
			mesh = GeneratorUtils.SliceAllNaive(mesh, vector, sliceX[i + 1]);
		}

		vector.setTo(0, 1, 0, 0);
		// we slice only over 2 offsets
		for (let i = chunkY.from; i < chunkY.to; i++) {
			// generate errors
			// mesh = GeneratorUtils.SliceHodgman(mesh, vector, sliceY[i]);
			// Naive is more stable, but unoptimal
			mesh = GeneratorUtils.SliceAllNaive(mesh, vector, sliceY[i + 1]);
		}

		mesh.normalise();

		// ordering - determine chunk id
		for (const p of mesh.poly) {
			for (let i = 0; i < 9; i++) {
				// over middle point
				// because all polygons should be inside rect, all their points should too,
				// we can use any points to chek chunk
				// but use middle point to redice slicing errors
				const data = p.middle.getData(0);
				const px = data[0];
				const py = data[1];

				if (
					(px > sliceX[i % 3]) &&
					(px < sliceX[i % 3 + 1]) &&
					(py > sliceY[i / 3 | 0]) &&
					(py < sliceY[(i / 3 | 0) + 1])
				) {
					// slicer can not generate user data
					p.userData = i;
				}
			}
		}

		mesh.poly.sort((a, b) => a.userData  - b.userData);

		for (let i = 0; i < mesh.poly.length; i++) {
			const index = mesh.poly[i].userData;
			indices[index] = i  * 3 + 3;
		}

		// pos
		const pos = mesh.toFloatArray(0);
		target.setPositions(pos);

		if (target.uvs) {
			const uvs = mesh.toFloatArray(1);
			target.setUVs(uvs);
		}

		//throw '[TriangleElementUtils] Not implemented';

		target.invalidate();
		return target;
	}

	public static updateScale9(
		elem: TriangleElements,
		originalRect: Rectangle,
		scaleX: number,
		scaleY: number,
		init: boolean = false,
		copy: boolean = false,
	): TriangleElements {
		// todo: for now this only works for Float2Attributes.

		if (elem.scale9Indices.length !== 9) {
			throw 'ElementUtils: Error - triangleElement does not provide valid slice9Indices!';
		}

		const offsets = elem.scale9Grid;
		const left = offsets.x - originalRect.x;
		const right = originalRect.right - offsets.right;
		const top = offsets.y - originalRect.y;
		const bottom = originalRect.bottom - offsets.bottom;

		const s_len = elem.scale9Indices.length;

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

		let newElem: TriangleElements;
		let positions: ArrayBufferView;

		if (copy) {

			// there are not garaties that a buffer is 2 and not has stride
			// and a element may has UV
			// should working
			newElem = elem.clone();

			newElem.scale9Grid = elem.scale9Grid;
			newElem.initialScale9Positions = elem.initialScale9Positions;
			newElem.scale9Indices = elem.scale9Indices;

			positions = newElem.positions.get(newElem._numVertices);
		} else {
			positions = elem.positions.get(elem._numVertices);
		}

		// todo: i had trouble when just cloning the positions
		//	for now i just create the initialSlice9Positions by iterating the positions

		let initPos: number[];

		if (init || !elem.initialScale9Positions) {
			initPos = [];
			// we store only XY, but buffer can be XYZ
			initPos.length = elem._numVertices * 2;

			let vindex = 0;
			const len = elem.positions.length;

			for (let i = 0; i < len; i += stride) {
				initPos[vindex + 0] = positions[attrOffset + i + 0];
				initPos[vindex + 1] = positions[attrOffset + i + 1];
				vindex += 2;
			}

			elem.initialScale9Positions = initPos;
		} else {
			initPos = <number[]>elem.initialScale9Positions;
		}

		const slice9Indices: number[] = elem.scale9Indices;

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
				let vx = initPos[vindex * 2 + 0] - originalRect.x;
				let vy = initPos[vindex * 2 + 1] - originalRect.y;

				vx = offsetx + vx * scalex;
				vy = offsety + vy * scaley;

				vx /= scaleX;
				vy /= scaleY;

				positions[attrindex + 0] = vx + originalRect.x;
				positions[attrindex + 1] = vy + originalRect.y;

				// we should include a stride, because buffer maybe be contecated
				// or XYZ instead of XY
				attrindex += stride;
				vindex++;
			}
		}

		//console.log("positions",positions);
		if (copy) {
			newElem.positions.invalidate();
			newElem.invalidate();
			return newElem;
		}

		elem.positions.invalidate();
		elem.invalidate();

		return elem;
	}
}
