import { IAssetClass, IAbstractionPool, AbstractionBase, IAsset, Matrix3D } from '@awayjs/core';

import { Stage } from '@awayjs/stage';

import { _IRender_RenderableClass } from './_IRender_RenderableClass';

import { ContainerNode, IContainer } from '@awayjs/view';
import { RendererBase } from '../RendererBase';
import { _Render_RenderableBase } from './_Render_RenderableBase';
import { IRenderContainer } from './IRenderContainer';
import { AbstractionSet } from '@awayjs/core/dist/lib/base/AbstractionSet';

/**
 * @class away.pool.RenderEntity
 */
export class RenderEntity extends AbstractionBase implements IAbstractionPool {
	private static _store: Record<string,  _Render_RenderableBase[]> = {};
	private static _renderRenderableClassPool: Record<string,  _IRender_RenderableClass> = {};

	public readonly abstractions: AbstractionSet;

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

	/**
     *
     */
	public zIndex: number;

	/**
     *
     */
	public renderSceneTransform: Matrix3D;

	/**
     *
     */
	public maskOwners: ContainerNode[];

	constructor() {
		super();

		this.abstractions = new AbstractionSet(this);
	}

	/**
	 * //TODO
	 *
	 * @param materialClassGL
	 */
	public init(node: ContainerNode, renderer: RendererBase): void {
		super.init(node, renderer);

		(<IRenderContainer> (<ContainerNode> this._asset).container)._renderObjects[renderer.id] = this;
	}

	public onClear(): void {

		this.abstractions.forEach((renderable: _Render_RenderableBase) => renderable.onClear());

		const container: IRenderContainer = <IRenderContainer> (<ContainerNode> this._asset).container;

		if (container)
			delete container._renderObjects[this.renderer.id];

		this.renderSceneTransform = null;

		this.maskOwners = null;

		super.onClear();
	}

	public onInvalidate(): void {
		super.onInvalidate();
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

	public storeAbstraction(abstraction: _Render_RenderableBase, assetType: string): void {
		RenderEntity._store[assetType].push(abstraction);
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