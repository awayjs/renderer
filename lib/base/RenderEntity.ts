import { IAssetClass, IAbstractionPool, AssetEvent, AbstractionBase, IAsset, IAbstractionClass } from '@awayjs/core';

import { Stage } from '@awayjs/stage';

import { _IRender_RenderableClass } from './_IRender_RenderableClass';

import { RenderGroup } from '../RenderGroup';
import { ContainerNode, EntityNode } from '@awayjs/view';
import { RenderableEvent } from '../events/RenderableEvent';

/**
 * @class away.pool.RenderEntity
 */
export class RenderEntity extends AbstractionBase implements IAbstractionPool {
	private static _renderRenderableClassPool: Object = new Object();

	private _onInvalidateElementsDelegate: (event: RenderableEvent) => void;
	private _onInvalidateMaterialDelegate: (event: RenderableEvent) => void;
	private _onInvalidateStyleDelegate: (event: RenderableEvent) => void;

	// private _abstractionPool: Object = new Object();
	private _stage: Stage;

	/**
	 *
	 * @returns {RenderGroup}
	 */
	public get stage(): Stage {
		return this._stage;
	}

	/**
     *
     * @returns {EntityNode}
     */
	public get node(): ContainerNode {
		return (<EntityNode> this._asset).parent;
	}

	public readonly id: number;

	/**
	 * //TODO
	 *
	 * @param materialClassGL
	 */
	constructor(entity: EntityNode, renderGroup: RenderGroup) {
		super(entity, renderGroup);

		this.id = AbstractionBase.ID_COUNT++;
		this._stage = renderGroup.stage;

		this._onInvalidateElementsDelegate = (event: RenderableEvent) => this._onInvalidateElements(event);
		this._onInvalidateMaterialDelegate = (event: RenderableEvent) => this._onInvalidateMaterial(event);
		this._onInvalidateStyleDelegate = (event: RenderableEvent) => this._onInvalidateStyle(event);

		this._asset.addEventListener(RenderableEvent.INVALIDATE_ELEMENTS, this._onInvalidateElementsDelegate);
		this._asset.addEventListener(RenderableEvent.INVALIDATE_MATERIAL, this._onInvalidateMaterialDelegate);
		this._asset.addEventListener(RenderableEvent.INVALIDATE_STYLE, this._onInvalidateStyleDelegate);
	}

	public onClear(event: AssetEvent): void {
		this._asset.removeEventListener(RenderableEvent.INVALIDATE_ELEMENTS, this._onInvalidateElementsDelegate);
		this._asset.removeEventListener(RenderableEvent.INVALIDATE_MATERIAL, this._onInvalidateMaterialDelegate);
		this._asset.removeEventListener(RenderableEvent.INVALIDATE_STYLE, this._onInvalidateStyleDelegate);

		super.onClear(event);
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