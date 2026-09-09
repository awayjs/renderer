import { Matrix, Matrix3D, ColorTransform } from '@awayjs/core';
import {
	Stage,
	Float2Attributes,
	Float3Attributes,
	Short3Attributes,
	ContextGLDrawMode,
	ContextGLProgramType,
	ContextGLCompareMode,
} from '@awayjs/stage';
import { TriangleElements, _Stage_TriangleElements } from '../elements/TriangleElements';
import { _Render_RenderableBase } from '../base/_Render_RenderableBase';
import { ShaderBase } from '../base/ShaderBase';
import { IRenderContainer } from '../base/IRenderContainer';
import { Settings } from '../Settings';

interface CachedBatch {
	key: string;
	elements: TriangleElements;
	vertCount: number;
	idxCount: number;
	lastUsed: number;
	pos: Float32Array;
	uv: Float32Array;
	idx: Uint16Array;
}

/**
 * Order-preserving vertex-buffer merge for consecutive TriangleElements that share
 * an already-activated material pass.
 *
 * Bake strategy (AGAL-safe):
 *   - Bake renderSceneTransform (+ depthOrder) into positions (world / scene space).
 *   - Bake uvMatrix into UVs; null host uvMatrix so shader applies identity.
 *   - Upload view.viewMatrix3D with AGAL transpose (TriangleElements.draw).
 *   - Do NOT CPU-bake the full MVP into Float3 — that drops clip.w and breaks
 *     perspective divide (empty Diggy). Flash append convention makes
 *     View*(Scene*p) match Scene.append(View) used by the non-batched path.
 *
 * Persistent dynamic VBO: signature-keyed cache of TriangleElements so unchanged
 * material-run segments skip CPU bake + AttributesBuffer invalidate/upload.
 *
 * SWF-safety: caller merges only within an existing display-list material run
 * (never reorder blended). ColorTransform must match across the segment.
 */
export class DrawCallBatcher {
	private static _identityScene: Matrix3D = (() => {
		const m = new Matrix3D();
		m.identity();
		return m;
	})();

	private static readonly CACHE_MAX = 64;

	private _pos: Float32Array = new Float32Array(3 * 4096);
	private _uv: Float32Array = new Float32Array(2 * 4096);
	private _idx: Uint16Array = new Uint16Array(4096);
	private _vertCount: number = 0;
	private _idxCount: number = 0;
	private _host: _Render_RenderableBase = null;
	private _ct: ColorTransform = null;
	private _view: Matrix3D = null;
	private _mergedDrawables: number = 0;

	private _pending: _Render_RenderableBase[] = [];
	private _pendingVert: number = 0;
	private _pendingIdx: number = 0;

	private _sig: number = 2166136261;
	private _sig2: number = 2166136261;
	private _cache: Map<string, CachedBatch> = new Map();
	private _scratch: TriangleElements = null;
	private _frameStamp: number = 0;

	public static mergedDrawables: number = 0;
	public static batchDraws: number = 0;
	public static skippedSingles: number = 0;
	public static cacheHits: number = 0;
	public static cacheMisses: number = 0;
	public static staticSkips: number = 0;
	public static staticMissReason: number = 0; // 0 ok,1 len,2 view,3 ref,4 scene,5 extra,6 images,7 novalid
	public static staticPrefixEnd: number = 0;

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

			if (elems.getCustomAtributes && elems.getCustomAtributes('curves'))
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

	/**
	 * Atlas solids / shared bitmap materials put the real Image on Style.
	 * Host pass binds only host images — refuse merge across different atlases/bitmaps.
	 */
	public sameImages(a: _Render_RenderableBase, b: _Render_RenderableBase): boolean {
		const ai = a.images;
		const bi = b.images;
		const n = ai.length;
		if (n !== bi.length)
			return false;
		for (let i = 0; i < n; i++) {
			if (ai[i] !== bi[i])
				return false;
		}
		const as = a.samplers;
		const bs = b.samplers;
		if (as.length !== bs.length)
			return false;
		for (let i = 0; i < as.length; i++) {
			if (as[i] !== bs[i])
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
		this._pending.length = 0;
		this._pendingVert = 0;
		this._pendingIdx = 0;
		this._sig = 2166136261;
		this._sig2 = 2166136261;
		this._frameStamp++;
	}

	public get active(): boolean {
		return this._host != null;
	}

	public get count(): number {
		return this._mergedDrawables;
	}

	private _mixU32: Uint32Array = new Uint32Array(1);
	private _mixF32: Float32Array = new Float32Array(this._mixU32.buffer);

	private _mix(n: number): void {
		this._sig = Math.imul(this._sig ^ (n | 0), 16777619);
		this._sig2 = Math.imul(this._sig2 ^ (n | 0), 2246822519) + 0x9e3779b9 | 0;
	}

	/** Bit-exact float32 mix — quantized hashes collided and served wrong VBs (missing Diggy logo). */
	private _mixFloat(f: number): void {
		this._mixF32[0] = f;
		this._mix(this._mixU32[0]);
	}

	private _newElements(): TriangleElements {
		const elements = new TriangleElements();
		elements.isDynamic = true;
		elements.autoDeriveNormals = false;
		elements.autoDeriveTangents = false;
		elements.setPositions(new Float3Attributes(0));
		elements.setUVs(new Float2Attributes(0));
		elements.setIndices(new Short3Attributes(0));
		return elements;
	}

	public tryAdd(r: _Render_RenderableBase): boolean {
		if (!this._host)
			return false;

		if (!this.sameColorTransform(this._ct, r.entity.colorTransform))
			return false;

		if (!this.sameImages(this._host, r))
			return false;

		const se = <_Stage_TriangleElements> r.stageElements;
		const elems = se.triangleElements;
		const nVerts = elems.numVertices;
		const indices = elems.indices;
		const nIdx = indices ? elems.numElements * 3 : nVerts;

		if (this._pendingVert + nVerts > 65535)
			return false;

		const sceneRaw = r.entity.renderSceneTransform._rawData;
		this._mix(elems.id | 0);
		this._mix(nVerts);
		this._mix(nIdx);
		for (let k = 0; k < 16; k++)
			this._mixFloat(sceneRaw[k]);
		if (Settings.ENCODE_DEPTH_ORDER && (r as any).depthOrder != null)
			this._mix(((r as any).depthOrder * Settings.DEPTH_ORDER_EPS * 10000) | 0);
		const uvMatrix: Matrix = r.uvMatrix;
		if (uvMatrix) {
			const ur = uvMatrix.rawData;
			for (let k = 0; k < 6; k++)
				this._mixFloat(ur[k]);
		} else {
			this._mix(0);
		}

		this._pending.push(r);
		this._pendingVert += nVerts;
		this._pendingIdx += nIdx;
		this._mergedDrawables++;
		return true;
	}

	private _bakePending(): void {
		this._ensureCapacity(this._pendingVert, this._pendingIdx);
		this._vertCount = 0;
		this._idxCount = 0;

		const scene = Matrix3D.CALCULATION_MATRIX;
		const n = this._pending.length;

		for (let p = 0; p < n; p++) {
			const r = this._pending[p];
			const se = <_Stage_TriangleElements> r.stageElements;
			const elems = se.triangleElements;
			const nVerts = elems.numVertices;
			const indices = elems.indices;
			const nIdx = indices ? elems.numElements * 3 : nVerts;

			const posView = elems.positions;
			const posData = <Float32Array> posView.get(nVerts);
			const posDim = posView.dimensions;
			const uvView = elems.uvs;
			const uvData = uvView ? <Float32Array> uvView.get(nVerts) : null;
			const uvDim = uvView ? uvView.dimensions : 0;

			// World bake only — leave view/projection on GPU so AGAL m44 produces correct clip.w.
			// (Full MVP CPU bake drops w into Float3 and breaks perspective divide.)
			scene.copyFrom(r.entity.renderSceneTransform);
			if (Settings.ENCODE_DEPTH_ORDER && (r as any).depthOrder != null)
				scene._rawData[14] -= (r as any).depthOrder * Settings.DEPTH_ORDER_EPS;

			const m = scene._rawData;
			const m0 = m[0], m1 = m[1], m2 = m[2];
			const m4 = m[4], m5 = m[5], m6 = m[6];
			const m8 = m[8], m9 = m[9], m10 = m[10];
			const m12 = m[12], m13 = m[13], m14 = m[14];

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
				posOut[o + 2] = m2 * px + m6 * py + m10 * pz + m14;

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
		}
	}

	private _cacheKey(): string {
		return this._sig + ':' + this._sig2 + ':' + this._pendingVert + ':' + this._pendingIdx;
	}

	private _evictIfNeeded(): void {
		if (this._cache.size < DrawCallBatcher.CACHE_MAX)
			return;
		let oldestKey = '';
		let oldestStamp = this._frameStamp + 1;
		this._cache.forEach((entry, key) => {
			if (entry.lastUsed < oldestStamp) {
				oldestStamp = entry.lastUsed;
				oldestKey = key;
			}
		});
		if (oldestKey)
			this._cache.delete(oldestKey);
	}

	public flush(stage: Stage, shader: ShaderBase): void {
		if (!this._host || this._mergedDrawables === 0) {
			this._host = null;
			return;
		}

		if (this._mergedDrawables < Settings.DRAWCALL_BATCH_MIN) {
			DrawCallBatcher.skippedSingles += this._mergedDrawables;
			this.lastSubmitted = null;
			this.lastSingle = this._host;
			this._host.draw();
			this._clear();
			return;
		}

		const key = this._cacheKey();
		let cached = Settings.DRAWCALL_BATCH_CACHE ? this._cache.get(key) : null;
		let elements: TriangleElements;
		let drawIdxCount: number;

		if (cached) {
			cached.lastUsed = this._frameStamp;
			DrawCallBatcher.cacheHits++;
			elements = cached.elements;
			drawIdxCount = cached.idxCount;
			// Keep GPU buffers resident — do not invalidate on hit (SwiftShader msDraw regress).
		} else {
			this._bakePending();
			if (Settings.DRAWCALL_BATCH_CACHE) {
				this._evictIfNeeded();
				const pos = this._pos.slice(0, this._vertCount * 3);
				const uv = this._uv.slice(0, this._vertCount * 2);
				const idx = this._idx.slice(0, this._idxCount);
				cached = {
					key: key,
					elements: this._newElements(),
					vertCount: this._vertCount,
					idxCount: this._idxCount,
					lastUsed: this._frameStamp,
					pos: pos,
					uv: uv,
					idx: idx,
				};
				cached.elements.setPositions(pos);
				cached.elements.setUVs(uv);
				cached.elements.setIndices(idx);
				this._cache.set(key, cached);
				elements = cached.elements;
				drawIdxCount = cached.idxCount;
			} else {
				// Scratch path: one reusable dynamic elements (no Map growth).
				if (!this._scratch)
					this._scratch = this._newElements();
				this._scratch.setPositions(this._pos.subarray(0, this._vertCount * 3));
				this._scratch.setUVs(this._uv.subarray(0, this._vertCount * 2));
				this._scratch.setIndices(this._idx.subarray(0, this._idxCount));
				elements = this._scratch;
				drawIdxCount = this._idxCount;
			}
			DrawCallBatcher.cacheMisses++;
		}

		const merged = this._mergedDrawables;
		const host = this._host;
		const view = this._view;
		this.submitMergedDraw(stage, shader, host, elements, drawIdxCount, view);
		this.lastSubmitted = {
			host: host,
			elements: elements,
			idxCount: drawIdxCount,
			view: view,
			merged: merged,
		};
		this.lastSingle = null;
		DrawCallBatcher.mergedDrawables += merged;
		DrawCallBatcher.batchDraws++;

		this._clear();
	}

	/**
	 * Issue a previously-merged (or static-replay) TriangleElements draw with
	 * identity scene + baked UVs. Used by flush and opaque-list static replay.
	 */
	public submitMergedDraw(
		stage: Stage,
		shader: ShaderBase,
		host: _Render_RenderableBase,
		elements: TriangleElements,
		drawIdxCount: number,
		view: Matrix3D
	): void {
		const stageElems = <_Stage_TriangleElements> stage.abstractions.getAbstraction(elements);

		const entity = host.entity;
		const savedXform = entity.renderSceneTransform;
		entity.renderSceneTransform = DrawCallBatcher._identityScene;

		const savedUv = (host as any)._uvMatrix;
		const savedStyleDirty = (host as any)._styleDirty;
		(host as any)._uvMatrix = null;
		(host as any)._styleDirty = false;

		const pass = host.renderMaterial._activePass;
		pass._setRenderState(host);

		shader.activeElements = stageElems;
		stageElems._setRenderState(host, shader);

		if (shader.sceneMatrixIndex >= 0) {
			shader.sceneMatrix.copyFrom(DrawCallBatcher._identityScene, true);
			shader.viewMatrix.copyFrom(view, true);
		} else {
			shader.viewMatrix.copyFrom(view, true);
		}

		const modern = (shader as any).supportModernAPI;
		if (!modern) {
			const context = stage.context;
			context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, shader.vertexConstantData);
			context.setProgramConstantsFromArray(ContextGLProgramType.FRAGMENT, shader.fragmentConstantData);
		} else if ((shader as any).syncUniforms) {
			(shader as any).syncUniforms();
		}

		const ctx = stage.context;
		let restoredDepth = false;
		if (Settings.DRAWCALL_BATCH_DISABLE_DEPTH) {
			ctx.setDepthTest(false, ContextGLCompareMode.LESS_EQUAL);
			restoredDepth = true;
		}

		stageElems.getIndexBufferGL().draw(ContextGLDrawMode.TRIANGLES, 0, drawIdxCount);

		if (restoredDepth)
			ctx.setDepthTest(true, ContextGLCompareMode.LESS_EQUAL);

		if ((stageElems as any)._vao)
			(stageElems as any)._vao.unbind();

		entity.renderSceneTransform = savedXform;
		(host as any)._uvMatrix = savedUv;
		(host as any)._styleDirty = savedStyleDirty;
	}

	/** Last flush's merged payload — for static opaque replay recording. */
	public lastSubmitted: {
		host: _Render_RenderableBase;
		elements: TriangleElements;
		idxCount: number;
		view: Matrix3D;
		merged: number;
	} = null;

	/** When flush fell back to a single draw (below DRAWCALL_BATCH_MIN). */
	public lastSingle: _Render_RenderableBase = null;

	private _clear(): void {
		this._host = null;
		this._vertCount = 0;
		this._idxCount = 0;
		this._mergedDrawables = 0;
		this._pending.length = 0;
		this._pendingVert = 0;
		this._pendingIdx = 0;
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
