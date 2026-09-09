import { IAssetClass } from '@awayjs/core';
import { BitmapImage2D, IContextGL } from '@awayjs/stage';
import { INode, PickGroup } from '@awayjs/view';
import { RenderGroup } from './RenderGroup';
import { DepthRenderer } from './DepthRenderer';
import { DistanceRenderer } from './DistanceRenderer';
import { RendererBase } from './RendererBase';
import { DrawCallBatcher } from './utils/DrawCallBatcher';
import { Settings } from './Settings';
import { _IRender_MaterialClass } from './base/_IRender_MaterialClass';
import { CacheRenderer } from './CacheRenderer';

/**
 * The DefaultRenderer class provides the default rendering method. It renders the scene graph objects using the
 * materials assigned to them.
 *
 * @class away.render.DefaultRenderer
 */
export class DefaultRenderer extends RendererBase {
	public static assetType: string = '[renderer DefaultRenderer]';

	private _requireDepthRender: boolean;

	private _distanceRenderer: DistanceRenderer;
	private _depthRenderer: DepthRenderer;

	public _depthRender: BitmapImage2D;

	public get antiAlias(): number {
		return this.stage.antiAlias;
	}

	public set antiAlias(value: number) {
		this.stage.antiAlias = value;
	}

	/**
	 *
	 */
	public get depthPrepass(): boolean {
		return this._depthPrepass;
	}

	public set depthPrepass(value: boolean) {
		this._depthPrepass = value;
	}

	/**
	 * Creates a new DefaultRenderer object.
	 */
	constructor() {
		super();

		this._traverserGroup = RenderGroup.getInstance(CacheRenderer);
		this._maskGroup = RenderGroup.getInstance(DefaultRenderer);
	}

	public init(node: INode, pool: RenderGroup): void {
		super.init(node, pool);

		this._depthRenderer = RenderGroup
			.getInstance(DepthRenderer)
			.getRenderer(node);

		this._distanceRenderer = RenderGroup
			.getInstance(DistanceRenderer)
			.getRenderer(node);
	}

	/**
	 *
	 */
	public enterNode(node: INode): boolean {
		const enter: boolean = super.enterNode(node);

		if (enter && node.boundsVisible)
			this.applyEntity(node.getBoundsPrimitive(PickGroup.getInstance()));

		return enter;
	}

	public render(
		enableDepthAndStencil: boolean = true,
		surfaceSelector: number = 0,
		mipmapSelector: number = 0,
		maskConfig: number = 0): void {

		if (!this.stage.recoverFromDisposal()) {//if context has Disposed by the OS,don't render at this frame
			return;
		}

		if (this._requireDepthRender)
			this._renderSceneDepthToTexture();

		if (this._depthPrepass)
			this._renderDepthPrepass();

		//this._view.target = null;
		const _rt0 = (typeof performance !== 'undefined') ? performance.now() : 0;
		super.render(enableDepthAndStencil, surfaceSelector, mipmapSelector, maskConfig);
		const _rt1 = (typeof performance !== 'undefined') ? performance.now() : 0;

		if (!maskConfig) {
			this.view.present();
			let _finishMs = 0;
			const gProbe: any = <any> (typeof self !== 'undefined' ? self : globalThis);
			if (gProbe.__AWAY_PERF_FINISH__) {
				const _ft0 = performance.now();
				try { (<any> this.stage).context._gl.finish(); } catch (e) { /* ignore */ }
				_finishMs = performance.now() - _ft0;
			}
			const _rt2 = (typeof performance !== 'undefined') ? performance.now() : 0;
			// Expose renderer composition counters for the perf harness.
			const g: any = <any> (typeof self !== 'undefined' ? self : globalThis);
			g.__AWAY_RENDER_SETTINGS__ = Settings;
			const s = RendererBase._perfStats;
			const prev = g.__AWAY_PERF__ || {};
			g.__AWAY_PERF__ = { opaque: s.opaque, blended: s.blended, materialRuns: s.materialRuns,
				maskSwitches: s.maskSwitches, cacheRenders: s.cacheRenders, draws: s.draws,
				batchDraws: DrawCallBatcher.batchDraws, batchMerged: DrawCallBatcher.mergedDrawables,
				msTraverse: +s.msTraverse.toFixed(3), msDraw: +s.msDraw.toFixed(3),
				msPresent: +(_rt2 - _rt1).toFixed(3),
				msGpuFinish: +_finishMs.toFixed(3),
				msRender: +(_rt2 - _rt0).toFixed(3),
				msAvm: prev.msAvm, msMouse: prev.msMouse, msFrame: prev.msFrame };
			s.opaque = s.blended = s.materialRuns = s.maskSwitches = s.cacheRenders = s.draws = 0;
			s.batchDraws = s.batchMerged = 0;
			s.msTraverse = s.msDraw = 0;
			DrawCallBatcher.batchDraws = 0;
			DrawCallBatcher.mergedDrawables = 0;
			DrawCallBatcher.skippedSingles = 0;
		}
	}

	public onClear(): void {
		super.onClear();

		if (this._pRttBufferManager) {
			this._pRttBufferManager.dispose();
			this._pRttBufferManager = null;
		}

		this._depthRenderer.onClear();
		this._distanceRenderer.onClear();
		this._depthRenderer = null;
		this._distanceRenderer = null;

		this._depthRender = null;
	}

	/**
	 *
	 */
	private _renderDepthPrepass(): void {
		this._depthRenderer.disableColor = true;

		this._depthRenderer.view.projection = this.view.projection;
		this._depthRenderer.view.target = null;
		this._depthRenderer.render();

		this._depthRenderer.disableColor = false;
	}

	/**
	 *
	 */
	private _renderSceneDepthToTexture(): void {
		if (this._depthTextureDirty || !this._depthRender)
			this.initDepthTexture(<IContextGL> this.stage.context);

		this._depthRenderer.render();
	}

	/**
	 *
	 */
	private initDepthTexture(context: IContextGL): void {
		this._depthTextureDirty = false;

		if (this._depthRender)
			this._depthRender.dispose();

		this._depthRender = new BitmapImage2D(
			this._pRttBufferManager.textureWidth,
			this._pRttBufferManager.textureHeight);

		this._depthRenderer.view.target = this._depthRender;
		this._depthRenderer.view.projection = this.view.projection;
	}

	public static registerMaterial(renderMaterialClass: _IRender_MaterialClass, materialClass: IAssetClass): void {
		RenderGroup.getInstance(DefaultRenderer).registerMaterial(renderMaterialClass, materialClass);
	}
}