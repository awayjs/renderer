import { IAssetClass, IAbstractionPool, AssetEvent, AbstractionBase, IAsset, IAbstraction, WeakAssetSet } from '@awayjs/core';

import { Stage } from '@awayjs/stage';

import { _IRender_RenderableClass } from './_IRender_RenderableClass';

import { ContainerNode } from '@awayjs/view';
import { RenderableEvent } from '../events/RenderableEvent';
import { RendererBase } from '../RendererBase';
import { _Render_RenderableBase } from './_Render_RenderableBase';

/**
 * @class away.pool.RenderEntity
 */
export class RenderEntity extends AbstractionBase implements IAbstractionPool {
	private static _store: Record<string,  IAbstraction[]> = {};
	private static _renderRenderableClassPool: Object = new Object();

	private _onInvalidateElementsDelegate: (event: RenderableEvent) => void;
	private _onInvalidateMaterialDelegate: (event: RenderableEvent) => void;
	private _onInvalidateStyleDelegate: (event: RenderableEvent) => void;

	private _renderables: WeakAssetSet;

	/**
	 *
	 * @returns {RenderGroup}
	 */
	public stage: Stage;

	/**
     *
     * @returns {ContainerNode}
     */
	public get node(): ContainerNode {
		return <ContainerNode> this._asset;
	}

	/**
     *
     * @returns {RendererBase}
     */
	public get renderer(): RendererBase {
		return <RendererBase> this._pool;
	}

	constructor() {
		super();

		this._onInvalidateElementsDelegate = (event: RenderableEvent) => this._onInvalidateElements(event);
		this._onInvalidateMaterialDelegate = (event: RenderableEvent) => this._onInvalidateMaterial(event);
		this._onInvalidateStyleDelegate = (event: RenderableEvent) => this._onInvalidateStyle(event);
	}

	/**
	 * //TODO
	 *
	 * @param materialClassGL
	 */
	public init(node: ContainerNode, renderer: RendererBase): void {
		super.init(node, renderer);

		this.stage = renderer.stage;

		this._renderables = new WeakAssetSet('_Render_RenderableBase');

		(<RendererBase> this._pool).addRenderEntity(this);

		(<ContainerNode> this._asset).container.addEventListener(RenderableEvent.INVALIDATE_ELEMENTS, this._onInvalidateElementsDelegate);
		(<ContainerNode> this._asset).container.addEventListener(RenderableEvent.INVALIDATE_MATERIAL, this._onInvalidateMaterialDelegate);
		(<ContainerNode> this._asset).container.addEventListener(RenderableEvent.INVALIDATE_STYLE, this._onInvalidateStyleDelegate);
	}

	public onClear(event: AssetEvent): void {
		(<ContainerNode> this._asset).container.removeEventListener(RenderableEvent.INVALIDATE_ELEMENTS, this._onInvalidateElementsDelegate);
		(<ContainerNode> this._asset).container.removeEventListener(RenderableEvent.INVALIDATE_MATERIAL, this._onInvalidateMaterialDelegate);
		(<ContainerNode> this._asset).container.removeEventListener(RenderableEvent.INVALIDATE_STYLE, this._onInvalidateStyleDelegate);

		this._renderables.forEach((renderable: _Render_RenderableBase) => renderable.onClear(event));

		(<RendererBase> this._pool).removeRenderEntity(this);

		this._renderables = null;

		super.onClear(event);
	}

	public onInvalidate(event: AssetEvent): void {
		super.onInvalidate(event);
	}

	public addRenderable(renderable: _Render_RenderableBase): void {
		this._renderables.add(renderable);
	}

	public removeRenderable(renderable: _Render_RenderableBase): void {
		this._renderables.remove(renderable);
	}

	private _onInvalidateElements(event: RenderableEvent): void {
		// for (const key in this._abstractionPool)
		// 	(this._abstractionPool[key] as _Render_RenderableBase)._onInvalidateElements();
	}

	private _onInvalidateMaterial(event: RenderableEvent): void {
		// for (const key in this._abstractionPool)
		// 	(this._abstractionPool[key] as _Render_RenderableBase)._onInvalidateMaterial();
	}

	private _onInvalidateStyle(event: RenderableEvent): void {
		// for (const key in this._abstractionPool)
		// 	(this._abstractionPool[key] as _Render_RenderableBase)._onInvalidateStyle();
	}

	public requestAbstraction(asset: IAsset): IAbstraction {
		const store = RenderEntity._store[asset.assetType];
		return store.length ? store.pop() : new RenderEntity._renderRenderableClassPool[asset.assetType]();
	}

	public storeAbstraction(abstraction: IAbstraction): void {
		RenderEntity._store[abstraction.asset.assetType].push(abstraction);
	}

	/**
	 *
	 * @param imageObjectClass
	 */
	public static registerRenderable(renderStateClass: _IRender_RenderableClass, assetClass: IAssetClass): void {
		RenderEntity._renderRenderableClassPool[assetClass.assetType] = renderStateClass;
		RenderEntity._store[assetClass.assetType] = [];
	}
}