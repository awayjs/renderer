import { IAssetClass, IAbstractionPool, AbstractionBase, IAsset, WeakAssetSet } from '@awayjs/core';

import { Stage } from '@awayjs/stage';

import { _IRender_RenderableClass } from './_IRender_RenderableClass';

import { ContainerNode } from '@awayjs/view';
import { RendererBase } from '../RendererBase';
import { _Render_RenderableBase } from './_Render_RenderableBase';
import { IRenderContainer } from './IRenderContainer';

/**
 * @class away.pool.RenderEntity
 */
export class RenderEntity extends AbstractionBase implements IAbstractionPool {
	private static _store: Record<string,  _Render_RenderableBase[]> = {};
	private static _renderRenderableClassPool: Record<string,  _IRender_RenderableClass> = {};

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

		(<IRenderContainer> (<ContainerNode> this._asset).container)._renderObjects[renderer.id] = this;
	}

	public onClear(): void {

		this._renderables.forEach((renderable: _Render_RenderableBase) => renderable.onClear());

		(<RendererBase> this._pool).removeRenderEntity(this);

		delete (<IRenderContainer> (<ContainerNode> this._asset).container)._renderObjects[this.renderer.id];

		this._renderables = null;

		super.onClear();
	}

	public onInvalidate(): void {
		super.onInvalidate();
	}

	public addRenderable(renderable: _Render_RenderableBase): void {
		this._renderables.add(renderable);
	}

	public removeRenderable(renderable: _Render_RenderableBase): void {
		this._renderables.remove(renderable);
	}

	public _onInvalidateElements(): void {
		// for (const key in this._abstractionPool)
		// 	(this._abstractionPool[key] as _Render_RenderableBase)._onInvalidateElements();
	}

	public _onInvalidateMaterial(): void {
		// for (const key in this._abstractionPool)
		// 	(this._abstractionPool[key] as _Render_RenderableBase)._onInvalidateMaterial();
	}

	public _onInvalidateStyle(): void {
		// for (const key in this._abstractionPool)
		// 	(this._abstractionPool[key] as _Render_RenderableBase)._onInvalidateStyle();
	}

	public requestAbstraction(asset: IAsset): _Render_RenderableBase {
		const store = RenderEntity._store[asset.assetType];
		return store.length ? store.pop() : new RenderEntity._renderRenderableClassPool[asset.assetType]();
	}

	public storeAbstraction(abstraction: _Render_RenderableBase): void {
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