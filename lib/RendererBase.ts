import {
	Matrix3D,
	Plane3D,
	Vector3D,
	AbstractionBase,
	IAsset,
	Box,
	Rectangle,
	IAbstraction,
	IAbstractionPool,
} from '@awayjs/core';

import {
	BitmapImage2D,
	ContextGLBlendFactor,
	ContextGLCompareMode,
	ContextGLStencilAction,
	ContextGLTriangleFace,
	IContextGL,
	Stage,
	StageEvent,
	ContextGLClearMask,
	RTTBufferManager,
	Image2D,
	ImageSampler,
	BlendMode,
	isNativeBlend,
	Settings as StageSettings
} from '@awayjs/stage';

import {
	View,
	ViewEvent,
	IPartitionTraverser,
	IEntityTraverser,
	INode,
	ContainerNode,
	BoundsPicker,
	PickGroup,
	PickEntity,
} from '@awayjs/view';

import { _Render_MaterialBase } from './base/_Render_MaterialBase';
import { _Render_RenderableBase } from './base/_Render_RenderableBase';
import { RenderEntity } from './base/RenderEntity';
import { IMapper } from './base/IMapper';
import { RenderGroup } from './RenderGroup';

import { IRenderEntitySorter } from './sort/IRenderEntitySorter';
import { RenderableMergeSort } from './sort/RenderableMergeSort';
import { _Render_Renderer, CacheRenderer } from './CacheRenderer';
import { _Render_ElementsBase } from './base/_Render_ElementsBase';
import { Style } from './base/Style';
import { StyleEvent } from './events/StyleEvent';
import { IRenderable } from './base/IRenderable';
import { AbstractionSet } from '@awayjs/core/dist/lib/base/AbstractionSet';
import { Settings } from './Settings';
import { DrawCallBatcher } from './utils/DrawCallBatcher';
import { ShaderBase } from './base/ShaderBase';

/**
 * RendererBase forms an abstract base class for classes that are used in the rendering pipeline to render the
 * contents of a partition
 *
 * @class away.render.RendererBase
 */
export class RendererBase extends AbstractionBase implements IPartitionTraverser, IEntityTraverser, IAbstractionPool {
	private static _store: IAbstraction[] = [];
	public static _collectionMark = 0;
	/** Lightweight per-frame counters (reset each DefaultRenderer present). */
	public static _perfStats = {
		opaque: 0,
		blended: 0,
		materialRuns: 0,
		maskSwitches: 0,
		cacheRenders: 0,
		draws: 0,
		batchDraws: 0,
		batchMerged: 0,
		/** Last-frame wall ms for scene-graph traverse (JS). */
		msTraverse: 0,
		/** Last-frame wall ms for executeRender / GL submit path. */
		msDraw: 0,
	};

	public readonly abstractions: AbstractionSet;

	public _renderObjects: Record<number, _Render_Renderer> = {};

	protected _renderMatrix: Matrix3D = new Matrix3D();
	protected _parentNode: ContainerNode;
	private _boundsPicker: BoundsPicker;
	private _boundsScale: number = 1;
	private _parentPosition: Vector3D;
	private _maskConfig: number;
	private _maskId: number;
	private _activeMasksDirty: boolean;
	private _activeMaskOwners: ContainerNode[];
	protected _paddedBounds: Rectangle = new Rectangle();
	private _bounds: Box = new Box();
	protected _style: Style;
	protected _boundsDirty: boolean = true;
	private _mappers: Array<IMapper> = new Array<IMapper>();
	private _elementsPools: Record<string, _Render_ElementsBase> = {};

	protected _context: IContextGL;

	public _cameraTransform: Matrix3D;
	private _cameraForward: Vector3D = new Vector3D();

	public _pRttBufferManager: RTTBufferManager;

	protected _depthTextureDirty: boolean = true;
	protected _depthPrepass: boolean = false;

	private _snapshotBitmapImage2D: BitmapImage2D;
	private _snapshotRequired: boolean;

	private _onInvalidateProperties: (event: StyleEvent) => void;
	private _onContextUpdateDelegate: (event: StageEvent) => void;
	protected _onSizeInvalidateDelegate: (event: ViewEvent | StageEvent) => void;

	public _pNumElements: number = 0;

	protected _opaqueRenderables: _Render_RenderableBase[] = [];
	protected _blendedRenderables: _Render_RenderableBase[] = [];
	public _disableColor: boolean = false;
	public _disableClear: boolean = false;
	public _renderBlended: boolean = true;
	private _cullPlanes: Array<Plane3D>;
	private _customCullPlanes: Array<Plane3D>;
	private _numCullPlanes: number = 0;
	protected _traverserGroup: RenderGroup;
	protected _maskGroup: RenderGroup;
	private _pickEntity: PickEntity;
	private _renderEntity: RenderEntity;
	private _nextDepthOrder: number = 0;
	private _drawBatcher: DrawCallBatcher = new DrawCallBatcher();

	/** Opaque-list static replay (E16): skip tryAdd/merge when fingerprint matches. */
	private _opaqueStaticOps: Array<any> = [];
	private _opaqueStaticValid: boolean = false;
	private _opaqueFpLen: number = -1;
	private _opaqueFpIds: Int32Array = new Int32Array(0);
	private _opaqueFpScene: Float32Array = new Float32Array(0);
	private _opaqueFpView: Float32Array = new Float32Array(16);
	private _opaqueFpExtra: Float32Array = new Float32Array(0); // depthOrder + uv6 + ct8 per item
	private _opaqueFpImages: any[] = [];
	private _recordingOpaqueStatic: boolean = false;


	/**
	 *
	 */
	public get cullPlanes(): Array<Plane3D> {
		return this._customCullPlanes;
	}

	public set cullPlanes(value: Array<Plane3D>) {
		this._customCullPlanes = value;
	}

	public get renderBlended(): boolean {
		return this._renderBlended;
	}

	public set renderBlended(value: boolean) {
		this._renderBlended = value;
	}

	public get disableColor(): boolean {
		return this._disableColor;
	}

	public set disableColor(value: boolean) {
		if (this._disableColor == value)
			return;

		this._disableColor = value;

		this._invalid = true;
	}

	public get disableClear(): boolean {
		return this._disableClear;
	}

	public set disableClear(value: boolean) {
		if (this._disableClear == value)
			return;

		this._disableClear = value;

		this._invalid = true;
	}

	/**
	 *
	 */
	public get numElements(): number {
		return this._pNumElements;
	}

	public get context(): IContextGL {
		return this._context;
	}

	public getPaddedBounds(): Rectangle {
		if (this._boundsDirty)
			this._updateBounds();

		return this._paddedBounds;
	}

	public getBounds(): Box {
		if (this._boundsDirty)
			this._updateBounds();

		return this._bounds;
	}

	public getBoundsScale(): number {
		if (this._boundsDirty)
			this._updateBounds();

		return this._boundsScale;
	}

	public getParentPosition(): Vector3D {
		if (this._boundsDirty)
			this._updateBounds();

		return this._parentPosition;
	}

	/**
	 *
	 */
	public get style(): Style {
		if (this._boundsDirty)
			this._updateBounds();

		return this._style;
	}

	public set style(value: Style) {
		if (this._style == value)
			return;

		if (this._style)
			this._style.removeEventListener(StyleEvent.INVALIDATE_PROPERTIES, this._onInvalidateProperties);

		this._style = value;

		if (this._style)
			this._style.addEventListener(StyleEvent.INVALIDATE_PROPERTIES, this._onInvalidateProperties);

		this._onInvalidateStyle();
	}

	public parentRenderer: RendererBase;

	/**
	 *
	 */
	public renderableSorter: IRenderEntitySorter = new RenderableMergeSort();

	public get node(): ContainerNode {
		return <ContainerNode> this._asset;
	}

	public get group(): RenderGroup {
		return <RenderGroup> this._pool;
	}

	public view: View;

	public stage: Stage;

	public get blendMode(): string {
		const containerBlend = <string> this.node.container.blendMode;

		// native blends
		if (isNativeBlend(containerBlend))
			return containerBlend;

		return BlendMode.LAYER;
	}

	public get useNonNativeBlend(): boolean {
		return StageSettings.USE_NON_NATIVE_BLEND
				&& (<ContainerNode> this._asset).container.blendMode
				&& (<ContainerNode> this._asset).container.blendMode !== BlendMode.NORMAL
				&& this.blendMode == BlendMode.LAYER;
	}

	constructor() {
		super();

		this.abstractions = new AbstractionSet(this);
		this._onInvalidateProperties = (_event: StyleEvent) => this._onInvalidateStyle();
		this._onSizeInvalidateDelegate = (event: ViewEvent | StageEvent) => this.onSizeInvalidate(event);
		this._onContextUpdateDelegate = (event: StageEvent) => this.onContextUpdate(event);
	}

	/**
	 * Creates a new RendererBase object.
	 */
	public init(node: INode, group: RenderGroup): void {
		super.init(node, group);

		this._parentNode = node.parent;

		this.style = new Style();
		this.view = node.view;
		this.stage = this.view.stage;

		this.stage.addEventListener(StageEvent.CONTEXT_CREATED, this._onContextUpdateDelegate);
		this.stage.addEventListener(StageEvent.CONTEXT_RECREATED, this._onContextUpdateDelegate);
		this.view.addEventListener(ViewEvent.INVALIDATE_SIZE, this._onSizeInvalidateDelegate);

		this._boundsPicker = PickGroup.getInstance().getBoundsPicker(this.node);

		if (this.stage.context)
			this._context = <IContextGL> this.stage.context;
	}

	public onClear(): void {
		this.clear();

		super.onClear();

		this.stage.removeEventListener(StageEvent.CONTEXT_CREATED, this._onContextUpdateDelegate);
		this.stage.removeEventListener(StageEvent.CONTEXT_RECREATED, this._onContextUpdateDelegate);
		this.view.removeEventListener(ViewEvent.INVALIDATE_SIZE, this._onSizeInvalidateDelegate);

		this.parentRenderer = null;

		this._parentNode = null;
		this.view = null;
		this.stage = null;
		this.style = null;

		this._boundsPicker = null;
		this._activeMasksDirty = false;
		this._activeMaskOwners = null;
		this._renderEntity = null;

		this.abstractions.forEach((entity: RenderEntity) => entity.onClear());

		this.resetHead();

		for (const key in  this._elementsPools) {
			this._elementsPools[key].clear();
			delete this._elementsPools[key];
		}

		this._boundsDirty = true;

		this._disableColor = false;
		this._disableClear = false;
		this._renderBlended = true;
	}

	public onInvalidate(): void {
		super.onInvalidate();

		this._boundsDirty = true;
	}

	public update(node: INode): void {
		//update mappers
		const len: number = this._mappers.length;
		for (let i: number = 0; i < len; i++)
			this._mappers[i].update(node);
	}

	public _addMapper(mapper: IMapper) {
		if (this._mappers.indexOf(mapper) != -1)
			return;

		this._mappers.push(mapper);
	}

	public _removeMapper(mapper: IMapper) {
		const index: number = this._mappers.indexOf(mapper);

		if (index != -1)
			this._mappers.splice(index, 1);
	}

	public getRenderElements(elements: IAsset): _Render_ElementsBase {

		return this._elementsPools[elements.assetType]
			|| (this._elementsPools[elements.assetType] = new (RenderGroup.getRenderElementsClass(elements))(this));
	}

	public requestAbstraction(asset: IAsset): IAbstraction {
		return RendererBase._store.length ? RendererBase._store.pop() : new RenderEntity();
	}

	public storeAbstraction(abstraction: IAbstraction): void {
		RendererBase._store.push(abstraction);
	}

	/**
	 * Renders the potentially visible geometry to the back buffer or texture.
	 * @param target An option target texture to render to.
	 * @param surfaceSelector The index of a CubeTexture's face to render to.
	 * @param additionalClearMask Additional clear mask information, in case extra clear channels are to be omitted.
	 */
	public render(
		enableDepthAndStencil: boolean = true, surfaceSelector: number = 0,
		mipmapSelector: number = 0, maskConfig: number = 0): void {

		//TODO refactor setTarget so that rendertextures are created before this check
		// if (!this._stage || !this._context)
		// 	return;
		this._maskConfig = maskConfig;

		//check for mask rendering
		if (this._maskConfig) {
			this._disableClear = true;
			this._disableColor = true;
		}

		this.update(<ContainerNode> this._asset);

		// invalidate mipmaps (if target exists) to regenerate if required
		if (this.view.target)
			this.view.target.invalidateMipmaps();

		// this._pRttViewProjectionMatrix.copyFrom(projection.viewMatrix3D);
		// this._pRttViewProjectionMatrix.appendScale(this.textureRatioX, this.textureRatioY, 1);

		/*
		 if (_backgroundImageRenderer)
		 _backgroundImageRenderer.render();
		 */

		const _t0 = (typeof performance !== 'undefined') ? performance.now() : 0;
		if (!StageSettings.USE_NON_NATIVE_BLEND || this._invalid)
			this.traverse();
		const _t1 = (typeof performance !== 'undefined') ? performance.now() : 0;

		this.executeRender(enableDepthAndStencil, surfaceSelector, mipmapSelector);
		const _t2 = (typeof performance !== 'undefined') ? performance.now() : 0;
		// Accumulate only for the root (non-mask) path; DefaultRenderer resets/exports.
		if (!this._maskConfig) {
			RendererBase._perfStats.msTraverse += (_t1 - _t0);
			RendererBase._perfStats.msDraw += (_t2 - _t1);
		}

		//line required for correct rendering when using away3d with starling.
		//DO NOT REMOVE UNLESS STARLING INTEGRATION IS RETESTED!
		//this._context.setDepthTest(false, ContextGLCompareMode.LESS_EQUAL); //oopsie

		if (!this.view.shareContext || this.view.target) {
			if (this._snapshotRequired && this._snapshotBitmapImage2D) {
				this._context.drawToBitmapImage2D(this._snapshotBitmapImage2D);
				this._snapshotRequired = false;
			}
		}
	}

	public resetHead(): void {
		// Reuse arrays to avoid per-frame GC (owned only by this renderer)
		this._blendedRenderables.length = 0;
		this._opaqueRenderables.length = 0;
	}

	public traverse(): void {
		this.resetHead();

		this._invalid = false;
		this._pNumElements = 0;
		this._activeMaskOwners = null;

		this._cameraTransform = this.view.projection.transform.matrix3D;
		this._cameraForward = this.view.projection.transform.forwardVector;
		this._cullPlanes = this._customCullPlanes ? this._customCullPlanes : this.node.getRoot(true).view.projection.viewFrustumPlanes;
		this._numCullPlanes = this._cullPlanes ? this._cullPlanes.length : 0;
		this._maskId = (<ContainerNode> this._asset).getMaskId();

		RendererBase._collectionMark++;

		this._nextDepthOrder = 0;
		(<ContainerNode> this._asset).acceptTraverser(this);

		// Opaque material sort needs depth to stay Flash-correct. VB-merge batches
		// draw with depth test off (painter order inside the VB), so keep display-list
		// order whenever batching is on. Blended is never sorted.
		if (Settings.ALLOW_OPAQUE_MATERIAL_SORT
			&& !Settings.ALLOW_DRAWCALL_BATCHING
			&& this._opaqueRenderables.length > 1)
			this._sortOpaqueRenderablesArray(this._opaqueRenderables);
	}

	public _iRenderCascades(
		enableDepthAndStencil: boolean = true, surfaceSelector: number = 0): void {
		// this._stage.setRenderTarget(target, true, 0);
		// this._context.clear(1, 1, 1, 1, 1, 0);

		// this._context.setBlendFactors(ContextGLBlendFactor.ONE, ContextGLBlendFactor.ZERO);
		// this._context.setDepthTest(true, ContextGLCompareMode.LESS);

		// var head:_Render_RenderableBase = this._pOpaqueRenderableHead;

		// var first:boolean = true;

		// //TODO cascades must have separate collectors, rather than separate draw commands
		// for (var i:number = numCascades - 1; i >= 0; --i) {
		// 	//this._stage.scissorRect = scissorRects[i];
		// 	//this.drawCascadeRenderables(head, cameras[i], first? null : cameras[i].frustumPlanes);
		// 	first = false;
		// }

		// line required for correct rendering when using away3d with starling.
		// DO NOT REMOVE UNLESS STARLING INTEGRATION IS RETESTED!
		// this._context.setDepthTest(false, ContextGLCompareMode.LESS_EQUAL);
	}

	/**
	 * Renders the potentially visible geometry to the back buffer or texture. Only executed if everything is set up.
	 *
	 * @param target An option target texture to render to.
	 * @param surfaceSelector The index of a CubeTexture's face to render to.
	 * @param additionalClearMask Additional clear mask information, in case extra clear channels are to be omitted.
	 */
	public executeRender(
		enableDepthAndStencil: boolean = true, surfaceSelector: number = 0, mipmapSelector: number = 0): void {

		//initialise blend mode
		this._context.setBlendFactors(ContextGLBlendFactor.ONE, ContextGLBlendFactor.ZERO);

		//initialise depth test
		this._context.setDepthTest(true, ContextGLCompareMode.LESS_EQUAL);

		//initialise color mask
		if (this._disableColor)
			this._context.setColorMask(false, false, false, false);
		else
			this._context.setColorMask(true, true, true, true);

		//TODO: allow sharedContexts for image targets
		this.view.clear(
			!this._depthPrepass && !this._disableClear,
			enableDepthAndStencil,
			surfaceSelector,
			mipmapSelector,
			(!this.view.shareContext || this.view.target)
				? ContextGLClearMask.ALL
				: ContextGLClearMask.DEPTH);

		//initialise stencil
		if (this._maskConfig)
			this._context.enableStencil();
		else
			this._context.disableStencil();

		this.drawRenderables(this._opaqueRenderables, true);

		if (this._renderBlended)
			this.drawRenderables(this._blendedRenderables, false);
	}

	/*
	 * Will draw the renderer's output on next render to the provided bitmap data.
	 * */
	public queueSnapshot(bmd: BitmapImage2D): void {
		this._snapshotRequired = true;
		this._snapshotBitmapImage2D = bmd;
	}

	//private drawCascadeRenderables(renderRenderable:_Render_RenderableBase, camera:Camera, cullPlanes:Array<Plane3D>)
	//{
	//	var renderRenderable2:_Render_RenderableBase;
	//	var render:_Render_MaterialBase;
	//	var pass:IPass;
	//
	//	while (renderRenderable) {
	//		renderRenderable2 = renderRenderable;
	//		render = renderRenderable.render;
	//		pass = render.passes[0] //assuming only one pass per material
	//
	//		this.activatePass(renderRenderable, pass, camera);
	//
	//		do {
	//			// if completely in front, it will fall in a different cascade
	//			// do not use near and far planes
	//			if (!cullPlanes || renderRenderable2.node.worldBounds.isInFrustum(cullPlanes, 4)) {
	//				renderRenderable2._iRender(pass, camera, this._pRttViewProjectionMatrix);
	//			} else {
	//				renderRenderable2.cascaded = true;
	//			}
	//
	//			renderRenderable2 = renderRenderable2.next;
	//
	//		} while (renderRenderable2 && renderRenderable2.render == render && !renderRenderable2.cascaded);
	//
	//		this.deactivatePass(renderRenderable, pass);
	//
	//		renderRenderable = renderRenderable2;
	//	}
	//}

	/**
	 * Draw a list of renderables.
	 *
	 * @param renderables The renderables to draw.
	 */
	public drawRenderables(renderRenderables: _Render_RenderableBase[], allowBatchList: boolean = true): void {
		let index: number = 0;
		const len: number = renderRenderables.length;
		if (!len)
			return;

		let renderRenderable: _Render_RenderableBase = renderRenderables[index];

		let renderMaterial: _Render_MaterialBase;
		let numPasses: number;

		let i: number;
		let r: _Render_RenderableBase;
		const batch = this._drawBatcher;
		// Blended must stay 1:1 draws for SWF painter correctness (Diggy logo/PLAY).
		const allowBatch = Settings.ALLOW_DRAWCALL_BATCHING && allowBatchList;
		const viewMatrix = this.view.viewMatrix3D;
		const staticSkip = allowBatch && Settings.DRAWCALL_BATCH_STATIC_SKIP;

		this._recordingOpaqueStatic = false;
		if (staticSkip) {
			if (!this._opaqueStaticValid) {
				DrawCallBatcher.staticMissReason = 7;
				this._recordingOpaqueStatic = true;
				this._opaqueStaticOps.length = 0;
			} else {
				const prefixEnd = this._opaqueStaticPrefixEnd(renderRenderables, viewMatrix);
				DrawCallBatcher.staticPrefixEnd = prefixEnd;
				if (prefixEnd >= len && len === this._opaqueFpLen) {
					this._replayOpaqueStatic(renderRenderables, 0, len);
					DrawCallBatcher.staticSkips++;
					DrawCallBatcher.staticMissReason = 0;
					// Refresh fingerprint (refs/images may churn with same content).
					this._snapshotOpaqueFingerprint(renderRenderables, viewMatrix);
					return;
				}
				if (prefixEnd >= 2) {
					const replayed = this._replayOpaqueStatic(renderRenderables, 0, prefixEnd);
					const resumeAt = DrawCallBatcher.staticPrefixEnd;
					if (replayed > 0) {
						DrawCallBatcher.staticSkips++;
						DrawCallBatcher.staticMissReason = 0;
						// Keep the last full-record ops (Diggy title tail stays dirty).
						// Only normal-draw the dirty suffix; do not trim/re-record.
						index = resumeAt;
						if (index >= len) {
							this._snapshotOpaqueFingerprint(renderRenderables, viewMatrix);
							return;
						}
						renderRenderable = renderRenderables[index];
						this._recordingOpaqueStatic = false;
						this._activeMasksDirty = true;
					} else {
						DrawCallBatcher.staticMissReason = 90 + Math.min(9, this._opaqueStaticOps.length);
						this._recordingOpaqueStatic = true;
						this._opaqueStaticOps.length = 0;
					}
				} else {
					this._recordingOpaqueStatic = true;
					this._opaqueStaticOps.length = 0;
				}
			}
		}

		while (index < len) {
			renderMaterial = renderRenderable.renderMaterial;
			numPasses = renderMaterial ? renderMaterial.numPasses : 1;
			RendererBase._perfStats.materialRuns++;

			if (this._activeMasksDirty || this._checkMaskOwners(renderRenderable.entity.maskOwners)) {
				if (!(this._activeMaskOwners = renderRenderable.entity.maskOwners)) {
					//re-establish stencil settings (if not inside another mask)
					if (!this._maskConfig)
						this._context.disableStencil();
				} else {
					RendererBase._perfStats.maskSwitches++;
					this._renderMasks(this._activeMaskOwners);
				}
				this._activeMasksDirty = false;
				if (this._recordingOpaqueStatic) {
					this._opaqueStaticOps.push({
						kind: 'mask',
						owners: this._activeMaskOwners,
						maskConfig: this._maskConfig,
					});
				}
			}

			//iterate through each shader object
			for (let p: number = 0; p < numPasses; p++) {
				renderMaterial && renderMaterial.activatePass(p);
				const shader: ShaderBase = renderMaterial
					? <ShaderBase> renderMaterial._activePass.shader
					: null;

				if (this._recordingOpaqueStatic && renderMaterial) {
					this._opaqueStaticOps.push({ kind: 'activate', index: index, pass: p });
				}

				i = index;
				r = renderRenderable;
				do {
					if (allowBatch && shader && batch.canAccept(r)) {
						if (!batch.active) {
							batch.begin(r, viewMatrix);
							batch.tryAdd(r);
							if (this._recordingOpaqueStatic)
								(batch as any)._recordHostIndex = i;
						} else if (!batch.tryAdd(r)) {
							batch.flush(this.stage, shader);
							RendererBase._perfStats.draws++;
							this._recordOpaqueFlush(batch, renderMaterial, p);
							batch.begin(r, viewMatrix);
							batch.tryAdd(r);
							if (this._recordingOpaqueStatic)
								(batch as any)._recordHostIndex = i;
						}
					} else {
						if (batch.active) {
							batch.flush(this.stage, shader);
							RendererBase._perfStats.draws++;
							this._recordOpaqueFlush(batch, renderMaterial, p);
						}
						r.draw();
						RendererBase._perfStats.draws++;
						if (this._recordingOpaqueStatic)
							this._opaqueStaticOps.push({ kind: 'single', index: i });
					}

					if (++i == len)
						break;

					r = renderRenderables[i];

				} while (r.renderMaterial == renderMaterial
						&& !(this._activeMasksDirty = this._checkMaskOwners(r.entity.maskOwners)));

				if (batch.active && shader) {
					batch.flush(this.stage, shader);
					RendererBase._perfStats.draws++;
					this._recordOpaqueFlush(batch, renderMaterial, p);
				}

				renderMaterial && renderMaterial.deactivatePass();
				if (this._recordingOpaqueStatic && renderMaterial) {
					this._opaqueStaticOps.push({ kind: 'deactivate', index: index });
				}
			}

			index = i;
			renderRenderable = r;
		}

		if (staticSkip) {
			this._snapshotOpaqueFingerprint(renderRenderables, viewMatrix);
			if (this._recordingOpaqueStatic)
				this._opaqueStaticValid = this._opaqueStaticOps.length > 0;
			else if (this._opaqueStaticOps.length > 0)
				this._opaqueStaticValid = true;
			this._recordingOpaqueStatic = false;
		}
		// Do not clear _opaqueStaticValid on blended draws (allowBatchList=false).
	}

	private _recordOpaqueFlush(batch: DrawCallBatcher, material: _Render_MaterialBase, pass: number): void {
		if (!this._recordingOpaqueStatic)
			return;
		const submitted = batch.lastSubmitted;
		if (submitted) {
			this._opaqueStaticOps.push({
				kind: 'batch',
				pass: pass,
				hostIndex: (batch as any)._recordHostIndex | 0,
				elements: submitted.elements,
				idxCount: submitted.idxCount,
				vertCount: submitted.elements ? (submitted.elements.numVertices | 0) : submitted.idxCount,
				view: submitted.view,
				merged: submitted.merged,
			});
			batch.lastSubmitted = null;
			return;
		}
		if (batch.lastSingle) {
			this._opaqueStaticOps.push({ kind: 'single', index: (batch as any)._recordHostIndex | 0 });
			batch.lastSingle = null;
		}
	}

	/**
	 * Content fingerprint (not object identity): Diggy recreates renderable
	 * abstractions across frames while elems.id + transforms stay stable.
	 * Returns first dirty index (0..len). View mismatch ⇒ 0.
	 */
	private _opaqueStaticPrefixEnd(list: _Render_RenderableBase[], view: Matrix3D): number {
		const len = list.length;
		const prevLen = this._opaqueFpLen;
		if (prevLen <= 0) {
			DrawCallBatcher.staticMissReason = 7;
			return 0;
		}
		const viewRaw = view._rawData;
		const lastView = this._opaqueFpView;
		for (let k = 0; k < 16; k++) {
			if (viewRaw[k] !== lastView[k]) {
				DrawCallBatcher.staticMissReason = 2;
				return 0;
			}
		}
		const limit = len < prevLen ? len : prevLen;
		const ids = this._opaqueFpIds;
		const scenes = this._opaqueFpScene;
		const extra = this._opaqueFpExtra;
		const images = this._opaqueFpImages;
		let imgCursor = 0;
		for (let i = 0; i < limit; i++) {
			const r = list[i];
			let elemsId = -1;
			let nVerts = 0;
			try {
				const se: any = r.stageElements;
				if (se && se.triangleElements) {
					elemsId = se.triangleElements.id | 0;
					nVerts = se.triangleElements.numVertices | 0;
				}
			} catch (_e) {
				DrawCallBatcher.staticMissReason = 31;
				return i;
			}
			const ib = i * 4;
			if (ids[ib] !== elemsId) {
				DrawCallBatcher.staticMissReason = 31;
				return i;
			}
			if (ids[ib + 1] !== nVerts) {
				DrawCallBatcher.staticMissReason = 32;
				return i;
			}
			// Skip materialID/renderOrderId — can churn while mesh content is stable.
			const scene = r.entity.renderSceneTransform._rawData;
			const sb = i * 16;
			for (let k = 0; k < 16; k++) {
				if (scene[k] !== scenes[sb + k]) {
					DrawCallBatcher.staticMissReason = 4;
					return i;
				}
			}
			const eb = i * 15;
			const depth = r.depthOrder != null ? r.depthOrder : -1;
			if (extra[eb] !== depth) {
				DrawCallBatcher.staticMissReason = 5;
				return i;
			}
			const uv = r.uvMatrix;
			if (uv) {
				const ur = uv.rawData;
				for (let k = 0; k < 6; k++) {
					if (extra[eb + 1 + k] !== ur[k]) {
						DrawCallBatcher.staticMissReason = 5;
						return i;
					}
				}
			} else {
				for (let k = 0; k < 6; k++) {
					if (extra[eb + 1 + k] !== 0) {
						DrawCallBatcher.staticMissReason = 5;
						return i;
					}
				}
			}
			const ct = r.entity.colorTransform;
			if (ct) {
				const cr = ct._rawData;
				for (let k = 0; k < 8; k++) {
					if (extra[eb + 7 + k] !== cr[k]) {
						DrawCallBatcher.staticMissReason = 5;
						return i;
					}
				}
			} else {
				for (let k = 0; k < 8; k++) {
					if (extra[eb + 7 + k] !== 0) {
						DrawCallBatcher.staticMissReason = 5;
						return i;
					}
				}
			}
			const imgs = r.images;
			const nImg = imgs.length;
			if (images[imgCursor] !== nImg) {
				DrawCallBatcher.staticMissReason = 6;
				return i;
			}
			imgCursor++;
			for (let k = 0; k < nImg; k++) {
				if (images[imgCursor++] !== imgs[k]) {
					DrawCallBatcher.staticMissReason = 6;
					return i;
				}
			}
		}
		if (len !== prevLen) {
			DrawCallBatcher.staticMissReason = 1;
			return limit;
		}
		return limit;
	}

	private _snapshotOpaqueFingerprint(list: _Render_RenderableBase[], view: Matrix3D): void {
		const len = list.length;
		this._opaqueFpLen = len;
		if (this._opaqueFpIds.length < len * 4)
			this._opaqueFpIds = new Int32Array(len * 4);
		if (this._opaqueFpScene.length < len * 16)
			this._opaqueFpScene = new Float32Array(len * 16);
		if (this._opaqueFpExtra.length < len * 15)
			this._opaqueFpExtra = new Float32Array(len * 15);
		this._opaqueFpView.set(view._rawData);
		this._opaqueFpImages.length = 0;
		const ids = this._opaqueFpIds;
		for (let i = 0; i < len; i++) {
			const r = list[i];
			let elemsId = -1;
			let nVerts = 0;
			try {
				const se: any = r.stageElements;
				if (se && se.triangleElements) {
					elemsId = se.triangleElements.id | 0;
					nVerts = se.triangleElements.numVertices | 0;
				}
			} catch (_e) { /* keep -1 */ }
			const ib = i * 4;
			ids[ib] = elemsId;
			ids[ib + 1] = nVerts;
			ids[ib + 2] = r.materialID | 0;
			ids[ib + 3] = r.renderOrderId | 0;
			this._opaqueFpScene.set(r.entity.renderSceneTransform._rawData, i * 16);
			const eb = i * 15;
			const extra = this._opaqueFpExtra;
			extra[eb] = r.depthOrder != null ? r.depthOrder : -1;
			const uv = r.uvMatrix;
			if (uv) {
				const ur = uv.rawData;
				for (let k = 0; k < 6; k++)
					extra[eb + 1 + k] = ur[k];
			} else {
				for (let k = 0; k < 6; k++)
					extra[eb + 1 + k] = 0;
			}
			const ct = r.entity.colorTransform;
			if (ct) {
				const cr = ct._rawData;
				for (let k = 0; k < 8; k++)
					extra[eb + 7 + k] = cr[k];
			} else {
				for (let k = 0; k < 8; k++)
					extra[eb + 7 + k] = 0;
			}
			const imgs = r.images;
			this._opaqueFpImages.push(imgs.length);
			for (let k = 0; k < imgs.length; k++)
				this._opaqueFpImages.push(imgs[k]);
		}
	}

	/**
	 * E18: recorded merged VBs must still match current source vert counts.
	 * Fingerprint refreshes every frame (ref/image churn) while ops are kept across
	 * partial skips — Diggy tessellation can change numVertices under the same
	 * elems.id/transform, leaving stale oversized/undersized VBs in replay.
	 */
	private _opaqueStaticOpsMatchSource(list: _Render_RenderableBase[]): boolean {
		const ops = this._opaqueStaticOps;
		const listLen = list.length;
		for (let i = 0; i < ops.length; i++) {
			const op = ops[i];
			if (op.kind !== 'batch')
				continue;
			const host = op.hostIndex | 0;
			const merged = op.merged | 0;
			if (host < 0 || merged <= 0 || host + merged > listLen)
				return false;
			let srcVerts = 0;
			for (let t = host; t < host + merged; t++) {
				try {
					const se: any = list[t].stageElements;
					const el = se && se.triangleElements;
					srcVerts += el ? (el.numVertices | 0) : 0;
				} catch (_e) {
					return false;
				}
			}
			const baked = op.vertCount != null
				? (op.vertCount | 0)
				: (op.elements ? (op.elements.numVertices | 0) : (op.idxCount | 0));
			if (srcVerts !== baked)
				return false;
		}
		return true;
	}

	/**
	 * Replay recorded batch/single ops wholly inside [rangeStart, rangeEnd).
	 * Material runs that span the dirty boundary still replay their clean prefix batches.
	 * Returns { draws, nextIndex } via DrawCallBatcher.staticPrefixEnd (= nextIndex to resume).
	 */
	private _replayOpaqueStatic(list: _Render_RenderableBase[], rangeStart: number, rangeEnd: number): number {
		if (!this._opaqueStaticOpsMatchSource(list)) {
			DrawCallBatcher.staticMissReason = 33; // stale batch vertCount vs source
			this._opaqueStaticValid = false;
			DrawCallBatcher.staticPrefixEnd = 0;
			return 0;
		}
		const ops = this._opaqueStaticOps;
		const batch = this._drawBatcher;
		const n = ops.length;
		let draws = 0;
		let resumeAt = rangeEnd;
		let i = 0;
		while (i < n) {
			const op = ops[i];
			if (op.kind === 'mask') {
				if (rangeStart === 0) {
					if (!(this._activeMaskOwners = op.owners)) {
						if (!this._maskConfig)
							this._context.disableStencil();
					} else {
						RendererBase._perfStats.maskSwitches++;
						this._renderMasks(this._activeMaskOwners);
					}
					this._activeMasksDirty = false;
				}
				i++;
				continue;
			}
			if (op.kind !== 'activate') {
				i++;
				continue;
			}
			// Gather this pass's ops until deactivate.
			let j = i + 1;
			while (j < n && ops[j].kind !== 'deactivate')
				j++;
			if (j >= n)
				break;

			// Collect draw ops fully inside range; stop at first that crosses or lies past.
			const toReplay: Array<any> = [];
			let hitBoundary = false;
			for (let k = i + 1; k < j; k++) {
				const mid = ops[k];
				if (mid.kind === 'batch') {
					const endIdx = mid.hostIndex + (mid.merged | 0) - 1;
					if (endIdx < rangeStart)
						continue;
					if (mid.hostIndex >= rangeEnd) {
						if (mid.hostIndex < resumeAt)
							resumeAt = mid.hostIndex;
						hitBoundary = true;
						break;
					}
					if (endIdx >= rangeEnd) {
						// Spans dirty boundary — resume normal draw at this batch.
						resumeAt = mid.hostIndex;
						hitBoundary = true;
						break;
					}
					toReplay.push(mid);
				} else if (mid.kind === 'single') {
					if (mid.index < rangeStart)
						continue;
					if (mid.index >= rangeEnd) {
						if (mid.index < resumeAt)
							resumeAt = mid.index;
						hitBoundary = true;
						break;
					}
					toReplay.push(mid);
				}
			}

			if (toReplay.length) {
				if (op.pass === 0)
					RendererBase._perfStats.materialRuns++;
				list[op.index].renderMaterial.activatePass(op.pass);
				for (let k = 0; k < toReplay.length; k++) {
					const mid = toReplay[k];
					if (mid.kind === 'batch') {
						const host = list[mid.hostIndex];
						const shader = <ShaderBase> host.renderMaterial._activePass.shader;
						batch.submitMergedDraw(this.stage, shader, host, mid.elements, mid.idxCount, mid.view);
						DrawCallBatcher.mergedDrawables += mid.merged;
						DrawCallBatcher.batchDraws++;
						RendererBase._perfStats.draws++;
						draws++;
					} else {
						list[mid.index].draw();
						RendererBase._perfStats.draws++;
						draws++;
					}
				}
				list[ops[j].index].renderMaterial.deactivatePass();
			}

			if (hitBoundary)
				break;
			i = j + 1;
		}
		DrawCallBatcher.staticPrefixEnd = resumeAt;
		return draws;
	}

	/** Drop recorded cycles that reference indices >= prefixEnd. */
	private _trimOpaqueStaticOps(prefixEnd: number): void {
		const ops = this._opaqueStaticOps;
		const kept: Array<any> = [];
		let i = 0;
		const n = ops.length;
		while (i < n) {
			const op = ops[i];
			if (op.kind === 'mask') {
				kept.push(op);
				i++;
				continue;
			}
			if (op.kind !== 'activate') {
				i++;
				continue;
			}
			let j = i + 1;
			let maxIdx = -1;
			while (j < n && ops[j].kind !== 'deactivate') {
				const mid = ops[j];
				if (mid.kind === 'batch') {
					const endIdx = mid.hostIndex + (mid.merged | 0) - 1;
					if (endIdx > maxIdx) maxIdx = endIdx;
				}
				if (mid.kind === 'single' && mid.index > maxIdx)
					maxIdx = mid.index;
				j++;
			}
			if (j >= n)
				break;
			if (maxIdx < prefixEnd) {
				for (let k = i; k <= j; k++)
					kept.push(ops[k]);
			}
			i = j + 1;
		}
		this._opaqueStaticOps = kept;
	}

	private _sortOpaqueRenderablesArray(arr: _Render_RenderableBase[]): void {
		arr.sort((a, b) => {
			if (a.renderOrderId !== b.renderOrderId)
				return a.renderOrderId - b.renderOrderId;
			if (a.materialID !== b.materialID)
				return a.materialID - b.materialID;
			return a.depthOrder - b.depthOrder;
		});
	}

	/**
	 * Assign the context once retrieved
	 */
	private onContextUpdate(event: StageEvent): void {
		this._context = <IContextGL> this.stage.context;
	}

	/*
	 public get iBackground():Texture2DBase
	 {
	 return this._background;
	 }
	 */

	/*
	 public set iBackground(value:Texture2DBase)
	 {
	 if (this._backgroundImageRenderer && !value) {
	 this._backgroundImageRenderer.dispose();
	 this._backgroundImageRenderer = null;
	 }

	 if (!this._backgroundImageRenderer && value)
	 {

	 this._backgroundImageRenderer = new BackgroundImageRenderer(this._stage);

	 }

	 this._background = value;

	 if (this._backgroundImageRenderer)
	 this._backgroundImageRenderer.texture = value;
	 }
	 */
	/*
	 public get backgroundImageRenderer():BackgroundImageRenderer
	 {
	 return _backgroundImageRenderer;
	 }
	 */

	/**
	 *
	 */
	public onSizeInvalidate(event: ViewEvent | StageEvent): void {
		if (this._pRttBufferManager) {
			this._pRttBufferManager.viewWidth = this.view.width;
			this._pRttBufferManager.viewHeight = this.view.height;
		}

		this._depthTextureDirty = true;

		this.onInvalidate();
	}

	/**
	 *
	 * @param node
	 * @returns {boolean}
	 */
	public enterNode(node: INode): boolean {
		const maskOrFrustrum = (
			this._maskConfig
			|| node.isInFrustum(
				<ContainerNode> this._asset,
				this._cullPlanes,
				this._numCullPlanes,
				PickGroup.getInstance()));

		const enter = node._collectionMark != RendererBase._collectionMark
			&& node.isRenderable()
			&& maskOrFrustrum
			&& node.getMaskId() == this._maskId;

		node._collectionMark = RendererBase._collectionMark;

		return enter;
	}

	public getTraverser(rootNode: ContainerNode): IPartitionTraverser | void {

		if (rootNode.renderToImage) {
			//new node for the container
			const node: ContainerNode = rootNode.getLocalNode();
			const boundsPicker: BoundsPicker = PickGroup.getInstance().getBoundsPicker(rootNode);

			if (!boundsPicker._isInFrustumInternal((<ContainerNode> this._asset).getRoot(true), this._cullPlanes, this._numCullPlanes))
				return;

			const traverser: CacheRenderer = this._traverserGroup.getRenderer<CacheRenderer>(node);

			traverser.renderableSorter = null;
			traverser.parentRenderer = this;
			//if (this._invalid) {
			this._renderEntity = this.abstractions.getAbstraction<RenderEntity>(node);

			// project onto camera's z-axis without Vector3D alloc
			this._renderEntity.zIndex = this._projectZIndex(rootNode.getPosition(), rootNode.container.zOffset);

			//save sceneTransform
			this._renderEntity.renderSceneTransform = rootNode.getRenderMatrix3D(this._cameraTransform);

			//save colorTransform (null for CacheRenderer)
			this._renderEntity.colorTransform = ContainerNode.nullColorTransform;

			//save mask owners
			this._renderEntity.maskOwners = rootNode.getMaskOwners();

			//apply CacheRenderer as renderable
			this.applyTraversable(traverser);

			return traverser;
		}

		return this;
	}

	/**
	 * Project node position onto camera forward without allocating Vector3D
	 * (Vector3D.subtract() returns a new vector every call).
	 */
	private _projectZIndex(nodePos: Vector3D, zOffset: number): number {
		const cam = this._cameraTransform.position;
		const fwd = this._cameraForward;
		return (cam.x - nodePos.x) * fwd.x
			+ (cam.y - nodePos.y) * fwd.y
			+ (cam.z - nodePos.z) * fwd.z
			+ zOffset;
	}

	public applyEntity(node: ContainerNode): void {
		const entity = node.container.getEntity();

		if (entity) {
			this._pickEntity = PickGroup.getInstance().abstractions.getAbstraction<PickEntity>(node);

			if (!this._pickEntity._isInFrustumInternal((<ContainerNode> this._asset).getRoot(true), this._cullPlanes, this._numCullPlanes))
				return;

			this._renderEntity = this.abstractions.getAbstraction<RenderEntity>(node);

			// project onto camera's z-axis without Vector3D alloc
			this._renderEntity.zIndex = this._projectZIndex(node.getPosition(), node.container.zOffset);

			//save sceneTransform
			this._renderEntity.renderSceneTransform = node.getRenderMatrix3D(this._cameraTransform);

			//save colorTransform
			this._renderEntity.colorTransform = node.getColorTransform();

			//save mask owners
			this._renderEntity.maskOwners = node.getMaskOwners();

			//collect renderables
			entity._acceptTraverser(this);
		} else {
			//check if we have a RenderEntity abstraction and if so, clear it!
			this.abstractions.checkAbstraction(node)?.onClear();
			PickGroup.getInstance().abstractions.checkAbstraction(node)?.onClear();
		}
	}

	public applyTraversable(renderable: IRenderable): void {
		const renderRenderable: _Render_RenderableBase = this._renderEntity.abstractions.getAbstraction<_Render_RenderableBase>(renderable);

		//store renderable properties
		renderRenderable.cascaded = false;
		renderRenderable.depthOrder = this._nextDepthOrder++;

		const renderMaterial: _Render_MaterialBase = renderRenderable.renderMaterial;
		renderRenderable.materialID = renderMaterial.materialID;
		renderRenderable.renderOrderId = renderMaterial.renderOrderId;

		// Entity colorTransform alpha < 1 must stay blended even if material is opaque-atlas.
		const ct = this._renderEntity.colorTransform;
		const forceBlend = !!(ct && ct.alphaMultiplier < 1);

		if (renderMaterial.requiresBlending || forceBlend) {
			this._blendedRenderables.push(renderRenderable);
			RendererBase._perfStats.blended++;
		} else {
			this._opaqueRenderables.push(renderRenderable);
			RendererBase._perfStats.opaque++;
		}

		//need to re-trigger stageElements getter in case animator has changed
		this._pNumElements += renderRenderable.stageElements.elements.numElements;
	}

	protected _renderMasks(maskOwners: ContainerNode[]): void {
		//calculate the bit index of maskConfig devided by two
		const halfBitIndex: number = Math.log2(this._maskConfig) >> 1;

		//create a new base and config value for the mask to be rendered
		//maskBase set to next odd significant bit
		const newMaskBase: number = this._maskConfig ? Math.pow(2, (halfBitIndex + 1) << 1) : 1;
		let newMaskConfig: number = newMaskBase;

		if (newMaskConfig > 0xff) {
			console.warn('[RenderBase] Mask bit overflow, maskConfig %d', newMaskConfig);
			return;
		}

		this._context.enableStencil();

		const numLayers: number = maskOwners.length;
		let children: INode[];
		let numChildren: number;
		let first: boolean = true;

		for (let i: number = 0; i < numLayers; ++i) {
			children = maskOwners[i].getMasks();
			numChildren = children.length;

			if (numChildren) {
				this._context.setStencilActions(
					ContextGLTriangleFace.FRONT_AND_BACK,
					(first) ? ContextGLCompareMode.ALWAYS
						: ContextGLCompareMode.EQUAL,
					ContextGLStencilAction.SET,
					ContextGLStencilAction.SET,
					ContextGLStencilAction.KEEP);

				first = false;

				//flips between read odd write even to read even write odd
				this._context.setStencilReferenceValue(
					0xFF,
					newMaskConfig,
					newMaskConfig = (newMaskConfig & newMaskBase) + newMaskBase);

				//clears write mask to zero
				this._context.clear(0, 0, 0, 0, 0, 0, ContextGLClearMask.STENCIL);

				for (let j: number = 0; j < numChildren; ++j)
					this._maskGroup.getRenderer(children[j]).render(true, 0, 0, newMaskConfig);

			}
		}

		if (!first) {
			this._context.setStencilActions(
				ContextGLTriangleFace.FRONT_AND_BACK,
				ContextGLCompareMode.EQUAL,
				ContextGLStencilAction.SET,
				ContextGLStencilAction.SET,
				ContextGLStencilAction.KEEP);
		}

		//reads from mask output, writes to previous mask state
		this._context.setStencilReferenceValue(0xFF, newMaskConfig, this._maskConfig);

		//re-establish color mask settings (if not inside another mask)
		if (!this._disableColor) {
			this._context.setColorMask(true, true, true, true);
		}
	}

	private _checkMaskOwners(maskOwners: ContainerNode[]): boolean {
		if (this._activeMaskOwners == null || maskOwners == null)
			return Boolean(this._activeMaskOwners != maskOwners);

		if (this._activeMaskOwners.length != maskOwners.length)
			return true;

		const numLayers: number = maskOwners.length;
		let numMasks: number;
		let masks: INode[];
		let activeNumMasks: number;
		let activeMasks: INode[];

		for (let i: number = 0; i < numLayers; i++) {
			masks = maskOwners[i].getMasks();
			numMasks = masks.length;
			activeMasks = this._activeMaskOwners[i].getMasks();
			activeNumMasks = activeMasks.length;
			if (activeNumMasks != numMasks)
				return true;

			for (let j: number = 0; j < numMasks; j++) {
				if (activeMasks[j] != masks[j])
					return true;
			}
		}

		return false;
	}

	public _onInvalidateStyle(): void {
		for (const key in this._renderObjects)
			this._renderObjects[key]._onInvalidateStyle();
	}

	protected _updateBounds(): void {
		this._boundsDirty = false;

		const node: ContainerNode = <ContainerNode> this._asset;
		const matrix3D = this._renderMatrix;
		const container = node.container;
		const rootView = node.getRoot().view;
		const pad = this._paddedBounds;

		const scale = this._boundsScale = Math.min(3, rootView.height * this.stage.pixelRatio * rootView.projection.scale / 1000);

		if (this._parentNode) {
			matrix3D.copyFrom(this._parentNode.getMatrix3D());
		} else {
			matrix3D.identity() ;
		}

		if (scale !== 1)
			matrix3D.appendScale(scale, scale, scale);

		const bounds = this._boundsPicker.getBoxBounds(node, true, true);

		if (!bounds) {
			console.error('[CachedRenderer] Bounds invalid, supress calculation', node);
			return;
		}

		if (isNaN(bounds.width) || isNaN(bounds.height)) {
			console.error('[CachedRenderer] Bounds invalid (NaN), supress calculation', node);
			return;
		}

		this._bounds.copyFrom(bounds);

		matrix3D.transformBox(this._bounds, this._bounds);
		matrix3D.invert();

		if (this.useNonNativeBlend) {
			//set to bounds of parent
			const parentBounds = this.parentRenderer.getPaddedBounds();

			pad.setTo(
				parentBounds.x,
				parentBounds.y,
				parentBounds.width,
				parentBounds.height
			);

			this._style.image = <Image2D> this.parentRenderer.style.image;
			this._style.sampler = new ImageSampler(false, false, false);
		} else {
			pad.setTo(
				this._bounds.x,
				this._bounds.y,
				this._bounds.width,
				this._bounds.height
			);

			if (container.filters && container.filters.length > 0) {
				container.filters.forEach((e) => e && (e.imageScale = scale));
				this.stage.filterManager.computeFiltersPadding(pad, container.filters, pad);
			}

			pad.x = (pad.x - 2) | 0;
			pad.y = (pad.y - 2) | 0;
			pad.width = (pad.width + 4) | 0;
			pad.height = (pad.height + 4) | 0;

			let parentBounds;
			let parentPosition;
			if (this._parentNode) {
				parentBounds = this.parentRenderer.getPaddedBounds();
				parentPosition = this.parentRenderer.getParentPosition();
				this._parentPosition = this._parentNode.getMatrix3D().position.clone();
				this._parentPosition.scaleBy(scale);
			} else {
				parentBounds = new Rectangle(0, 0, this.view.width * this.stage.pixelRatio, this.view.height * this.stage.pixelRatio);
				parentPosition = new Vector3D();
				this._parentPosition = new Vector3D();
			}

			if (pad.left < -parentPosition.x)
				pad.left = -parentPosition.x;

			if (pad.top < -parentPosition.y)
				pad.top = -parentPosition.y;

			if (pad.right > parentBounds.right - parentPosition.x)
				pad.right = parentBounds.right - parentPosition.x;

			if (pad.bottom > parentBounds.bottom - parentPosition.y)
				pad.bottom = parentBounds.bottom - parentPosition.y;

			if (pad.width * pad.height == 0) {
				throw new Error('Cannot have image with size 0 * 0');
			}
		}
	}

	public _initRender(target: Image2D) {
		const pad = this._paddedBounds;
		const scale = this._boundsScale;
		const matrix3D = this._renderMatrix;
		const view = this.view;
		const proj = view.projection;

		matrix3D._rawData[14] = -1000;

		// without this we will handle empty image when target is big (scale > +3)
		proj.far = 4000;
		proj.near = 1;
		proj.transform.matrix3D = matrix3D;
		proj.ratio = (target.width / target.height);
		proj.originX = -1 - 2 * pad.x / target.width;
		proj.originY = -1 - 2 * pad.y / target.height;
		proj.scale = scale * 1000 / target.height;

		view.target = target;
	}
}