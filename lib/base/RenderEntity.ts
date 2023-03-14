import { IAssetClass, IAbstractionPool, AssetEvent, AbstractionBase, IAsset, IAbstractionClass } from '@awayjs/core';

import { Stage } from '@awayjs/stage';

import { _IRender_RenderableClass } from './_IRender_RenderableClass';

import { ContainerNode, EntityNode } from '@awayjs/view';
import { RenderableEvent } from '../events/RenderableEvent';
import { RendererBase } from '../RendererBase';
import { CacheRenderer } from '../CacheRenderer';
import { _Render_RenderableBase } from './_Render_RenderableBase';

/**
 * @class away.pool.RenderEntity
 */
export class RenderEntity extends AbstractionBase implements IAbstractionPool {
	private static _renderRenderableClassPool: Object = new Object();

	private _onInvalidateElementsDelegate: (event: RenderableEvent) => void;
	private _onInvalidateMaterialDelegate: (event: RenderableEvent) => void;
	private _onInvalidateStyleDelegate: (event: RenderableEvent) => void;

	// private _abstractionPool: Object = new Object();
	private _renderables: _Render_RenderableBase[] = [];

	/**
	 *
	 * @returns {RenderGroup}
	 */
	public readonly stage: Stage;

	/**
     *
     * @returns {EntityNode}
     */
	public readonly node: ContainerNode;

	public readonly id: number;

	/**
	 * //TODO
	 *
	 * @param materialClassGL
	 */
	constructor(entity: EntityNode | CacheRenderer, renderer: RendererBase) {
		super(entity, renderer);

		this.id = AbstractionBase.ID_COUNT++;
		this.node = entity.parent;
		this.stage = renderer.stage;

		this._onInvalidateElementsDelegate = (event: RenderableEvent) => this._onInvalidateElements(event);
		this._onInvalidateMaterialDelegate = (event: RenderableEvent) => this._onInvalidateMaterial(event);
		this._onInvalidateStyleDelegate = (event: RenderableEvent) => this._onInvalidateStyle(event);

		this.node.container.addEventListener(RenderableEvent.INVALIDATE_ELEMENTS, this._onInvalidateElementsDelegate);
		this.node.container.addEventListener(RenderableEvent.INVALIDATE_MATERIAL, this._onInvalidateMaterialDelegate);
		this.node.container.addEventListener(RenderableEvent.INVALIDATE_STYLE, this._onInvalidateStyleDelegate);
	}

	public onClear(event: AssetEvent): void {
		this.node.container.removeEventListener(RenderableEvent.INVALIDATE_ELEMENTS, this._onInvalidateElementsDelegate);
		this.node.container.removeEventListener(RenderableEvent.INVALIDATE_MATERIAL, this._onInvalidateMaterialDelegate);
		this.node.container.removeEventListener(RenderableEvent.INVALIDATE_STYLE, this._onInvalidateStyleDelegate);

		for (let i: number = this._renderables.length  - 1; i >= 0; i--)
			this._renderables[i].onClear(event);

		super.onClear(event);
	}

	public addRenderable(renderable: _Render_RenderableBase): void {
		this._renderables.push(renderable);
	}

	public removeRenderable(renderable: _Render_RenderableBase): void {
		this._renderables.splice(this._renderables.indexOf(renderable), 1);
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

	public requestAbstraction(asset: IAsset): IAbstractionClass {
		return RenderEntity._renderRenderableClassPool[asset.assetType];
	}

	/**
	 *
	 * @param imageObjectClass
	 */
	public static registerRenderable(renderStateClass: _IRender_RenderableClass, assetClass: IAssetClass): void {
		RenderEntity._renderRenderableClassPool[assetClass.assetType] = renderStateClass;
	}
}