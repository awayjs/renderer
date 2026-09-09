import { Matrix, Matrix3D, ColorTransform } from '@awayjs/core';
import {
	Stage,
	Float2Attributes,
	Float3Attributes,
	Short3Attributes,
	ContextGLDrawMode,
	ContextGLProgramType,
} from '@awayjs/stage';
import { TriangleElements, _Stage_TriangleElements } from '../elements/TriangleElements';
import { _Render_RenderableBase } from '../base/_Render_RenderableBase';
import { ShaderBase } from '../base/ShaderBase';
import { IRenderContainer } from '../base/IRenderContainer';
import { Settings } from '../Settings';

/**
 * Order-preserving vertex-buffer merge for consecutive TriangleElements that share
 * an already-activated material pass. Bakes renderSceneTransform into positions and
 * uvMatrix into UVs so per-drawable shader constants do not force a draw break.
 *
 * SWF-safety: caller must only merge within an existing display-list material run
 * (never reorder blended draws). ColorTransform must match across the segment.
 */
export class DrawCallBatcher {
	private static _identityScene: Matrix3D = (() => {
		const m = new Matrix3D();
		m.identity();
		return m;
	})();

	private _pos: Float32Array = new Float32Array(3 * 4096);
	private _uv: Float32Array = new Float32Array(2 * 4096);
	private _idx: Uint16Array = new Uint16Array(4096);
	private _vertCount: number = 0;
	private _idxCount: number = 0;
	private _elements: TriangleElements;
	private _host: _Render_RenderableBase = null;
	private _ct: ColorTransform = null;
	private _view: Matrix3D = null;
	private _mergedDrawables: number = 0;

	public static mergedDrawables: number = 0;
	public static batchDraws: number = 0;
	public static skippedSingles: number = 0;

	constructor() {
		this._elements = new TriangleElements();
		this._elements.autoDeriveNormals = false;
		this._elements.autoDeriveTangents = false;
		this._elements.setPositions(new Float3Attributes(0));
		this._elements.setUVs(new Float2Attributes(0));
		this._elements.setIndices(new Short3Attributes(0));
	}

	public canAccept(r: _Render_RenderableBase): boolean {
		if (!Settings.ALLOW_DRAWCALL_BATCHING)
			return false;

		try {
			const se = r.stageElements;
			if (!(se instanceof _Stage_TriangleElements))
				return false;

			const node = r.entity.node;
			if (node && (<IRenderContainer> node.container).animator)
				return false;

			const elems = se.triangleElements;
			if (!elems || elems.numVertices <= 0)
				return false;

			if (elems.jointIndices)
				return false;

			return true;
		} catch (_e) {
			return false;
		}
	}

	public sameColorTransform(a: ColorTransform, b: ColorTransform): boolean {
		if (a === b)
			return true;
		if (!a || !b)
			return !a && !b;
		const ar = a._rawData;
		const br = b._rawData;
		for (let i = 0; i < 8; i++) {
			if (ar[i] !== br[i])
				return false;
		}
		return true;
	}

	public begin(host: _Render_RenderableBase, viewMatrix: Matrix3D): void {
		this._host = host;
		this._ct = host.entity.colorTransform;
		this._view = viewMatrix;
		this._vertCount = 0;
		this._idxCount = 0;
		this._mergedDrawables = 0;
	}

	public get active(): boolean {
		return this._host != null;
	}

	public get count(): number {
		return this._mergedDrawables;
	}

	public tryAdd(r: _Render_RenderableBase): boolean {
		if (!this._host)
			return false;

		if (!this.sameColorTransform(this._ct, r.entity.colorTransform))
			return false;

		const se = <_Stage_TriangleElements> r.stageElements;
		const elems = se.triangleElements;
		const nVerts = elems.numVertices;
		const indices = elems.indices;
		const nIdx = indices ? elems.numElements * 3 : nVerts;

		if (this._vertCount + nVerts > 65535)
			return false;

		this._ensureCapacity(this._vertCount + nVerts, this._idxCount + nIdx);

		const posView = elems.positions;
		const posData = <Float32Array> posView.get(nVerts);
		const posDim = posView.dimensions;
		const uvView = elems.uvs;
		const uvData = uvView ? <Float32Array> uvView.get(nVerts) : null;
		const uvDim = uvView ? uvView.dimensions : 0;

		// Match TriangleElements.draw when sceneMatrixIndex < 0:
		// viewMatrix_const = renderSceneTransform * view.viewMatrix3D (then transposed on upload).
		// Bake that MVP into positions and draw with identity so constants stay shared.
		const mvp = Matrix3D.CALCULATION_MATRIX;
		mvp.copyFrom(r.entity.renderSceneTransform);
		if (Settings.ENCODE_DEPTH_ORDER && (r as any).depthOrder != null)
			mvp._rawData[14] -= (r as any).depthOrder * Settings.DEPTH_ORDER_EPS;
		mvp.append(this._view);
		const m = mvp._rawData;
		const m0 = m[0], m1 = m[1], m2 = m[2];
		const m4 = m[4], m5 = m[5], m6 = m[6];
		const m8 = m[8], m9 = m[9], m10 = m[10];
		const m12 = m[12], m13 = m[13], m14 = m[14];
		const zBias = 0;

		const uvMatrix: Matrix = r.uvMatrix;
		let ua = 1, ub = 0, uc = 0, ud = 1, utx = 0, uty = 0;
		if (uvMatrix) {
			const ur = uvMatrix.rawData;
			ua = ur[0]; ub = ur[1]; uc = ur[2]; ud = ur[3]; utx = ur[4]; uty = ur[5];
		}

		const base = this._vertCount;
		const posOut = this._pos;
		const uvOut = this._uv;

		for (let i = 0; i < nVerts; i++) {
			const px = posData[i * posDim];
			const py = posData[i * posDim + 1];
			const pz = posDim > 2 ? posData[i * posDim + 2] : 0;

			const o = (base + i) * 3;
			posOut[o] = m0 * px + m4 * py + m8 * pz + m12;
			posOut[o + 1] = m1 * px + m5 * py + m9 * pz + m13;
			posOut[o + 2] = m2 * px + m6 * py + m10 * pz + m14 + zBias;

			let u = 0, v = 0;
			if (uvData) {
				u = uvData[i * uvDim];
				v = uvDim > 1 ? uvData[i * uvDim + 1] : 0;
			} else {
				u = px;
				v = py;
			}

			const uo = (base + i) * 2;
			if (uvMatrix) {
				// Match ShaderBase UV dp4: u' = a*u + c*v + tx, v' = b*u + d*v + ty
				uvOut[uo] = ua * u + uc * v + utx;
				uvOut[uo + 1] = ub * u + ud * v + uty;
			} else {
				uvOut[uo] = u;
				uvOut[uo + 1] = v;
			}
		}

		const idxOut = this._idx;
		if (indices) {
			const idxData = <Uint16Array> indices.get(elems.numElements);
			for (let i = 0; i < nIdx; i++)
				idxOut[this._idxCount + i] = (idxData[i] + base) & 0xffff;
			this._idxCount += nIdx;
		} else {
			for (let i = 0; i < nVerts; i++)
				idxOut[this._idxCount + i] = base + i;
			this._idxCount += nVerts;
		}

		this._vertCount += nVerts;
		this._mergedDrawables++;
		return true;
	}

	public flush(stage: Stage, shader: ShaderBase): void {
		if (!this._host || this._mergedDrawables === 0) {
			this._host = null;
			return;
		}

		if (this._mergedDrawables < Settings.DRAWCALL_BATCH_MIN) {
			DrawCallBatcher.skippedSingles += this._mergedDrawables;
			this._host.draw();
			this._clear();
			return;
		}

		const elems = this._elements;
		elems.setPositions(this._pos.subarray(0, this._vertCount * 3));
		elems.setUVs(this._uv.subarray(0, this._vertCount * 2));
		elems.setIndices(this._idx.subarray(0, this._idxCount));

		const stageElems = <_Stage_TriangleElements> stage.abstractions.getAbstraction(elems);

		const entity = this._host.entity;
		const savedXform = entity.renderSceneTransform;
		entity.renderSceneTransform = DrawCallBatcher._identityScene;

		const savedUv = (this._host as any)._uvMatrix;
		const savedStyleDirty = (this._host as any)._styleDirty;
		(this._host as any)._uvMatrix = null;
		(this._host as any)._styleDirty = false;

		const pass = this._host.renderMaterial._activePass;
		pass._setRenderState(this._host);

		if (shader.activeElements != stageElems) {
			shader.activeElements = stageElems;
			stageElems._setRenderState(this._host, shader);
		}

		// Positions are already in clip space (MVP baked); upload identity matrices.
		if (shader.sceneMatrixIndex >= 0) {
			shader.sceneMatrix.copyFrom(DrawCallBatcher._identityScene, true);
			shader.viewMatrix.copyFrom(DrawCallBatcher._identityScene, true);
		} else {
			shader.viewMatrix.copyFrom(DrawCallBatcher._identityScene, true);
		}

		const modern = (shader as any).supportModernAPI;
		if (!modern) {
			const context = stage.context;
			context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, shader.vertexConstantData);
			context.setProgramConstantsFromArray(ContextGLProgramType.FRAGMENT, shader.fragmentConstantData);
		} else if ((shader as any).syncUniforms) {
			(shader as any).syncUniforms();
		}

		stageElems.getIndexBufferGL().draw(ContextGLDrawMode.TRIANGLES, 0, this._idxCount);

		if ((stageElems as any)._vao)
			(stageElems as any)._vao.unbind();

		entity.renderSceneTransform = savedXform;
		(this._host as any)._uvMatrix = savedUv;
		(this._host as any)._styleDirty = savedStyleDirty;

		DrawCallBatcher.mergedDrawables += this._mergedDrawables;
		DrawCallBatcher.batchDraws++;

		this._clear();
	}

	private _clear(): void {
		this._host = null;
		this._vertCount = 0;
		this._idxCount = 0;
		this._mergedDrawables = 0;
	}

	private _ensureCapacity(verts: number, idxs: number): void {
		if (verts * 3 > this._pos.length) {
			const n = new Float32Array(Math.max(verts * 3, this._pos.length * 2));
			n.set(this._pos);
			this._pos = n;
		}
		if (verts * 2 > this._uv.length) {
			const n = new Float32Array(Math.max(verts * 2, this._uv.length * 2));
			n.set(this._uv);
			this._uv = n;
		}
		if (idxs > this._idx.length) {
			const n = new Uint16Array(Math.max(idxs, this._idx.length * 2));
			n.set(this._idx);
			this._idx = n;
		}
	}
}
