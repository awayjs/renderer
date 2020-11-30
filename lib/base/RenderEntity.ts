import { IAssetClass, IAbstractionPool, AssetEvent, AbstractionBase, IAsset, IAbstractionClass } from '@awayjs/core';

import { Stage } from '@awayjs/stage';

import { IRenderEntity } from './IRenderEntity';
import { _IRender_RenderableClass } from './_IRender_RenderableClass';
import { _Render_RenderableBase } from './_Render_RenderableBase';

import { RenderGroup } from '../RenderGroup';
import { ITraversable } from '@awayjs/view';
import { RenderableEvent } from '../events/RenderableEvent';

/**
 * @class away.pool.RenderEntity
 */
export class RenderEntity extends AbstractionBase implements IAbstractionPool {
	private static _renderRenderableClassPool: Object = new Object();

	private _onInvalidateElementsDelegate: (event: RenderableEvent) => void;
	private _onInvalidateMaterialDelegate: (event: RenderableEvent) => void;
	private _onInvalidateStyleDelegate: (event: RenderableEvent) => void;

	private _abstractionPool: Object = new Object();
	private _stage: Stage;
	private _entity: IRenderEntity;
	private _renderGroup: RenderGroup;

	/**
	 *
	 * @returns {RenderGroup}
	 */
	public get stage(): Stage {
		return this._stage;
	}

	/**
     *
     * @returns {IRenderEntity}
     */
	public get entity(): IRenderEntity {
		return this._asset as IRenderEntity;
	}

	/**
     *
     * @returns {IRenderEntity}
     */
	public get renderGroup(): RenderGroup {
		return this._renderGroup;
	}

	public readonly id: number;

	/**
	 * //TODO
	 *
	 * @param materialClassGL
	 */
	constructor(entity: IRenderEntity, renderGroup: RenderGroup) {
		super(entity, renderGroup);

		this._stage = renderGroup.stage;
		this._renderGroup = renderGroup;

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

		//clear all renderables associated with this render entity
		for (const key in this._abstractionPool)
			(this._abstractionPool[key] as _Render_RenderableBase).onClear(null);

		super.onClear(event);
	}

	private _onInvalidateElements(event: RenderableEvent): void {
		for (const key in this._abstractionPool)
			(this._abstractionPool[key] as _Render_RenderableBase)._onInvalidateElements();
	}

	private _onInvalidateMaterial(event: RenderableEvent): void {
		for (const key in this._abstractionPool)
			(this._abstractionPool[key] as _Render_RenderableBase)._onInvalidateMaterial();
	}

	private _onInvalidateStyle(event: RenderableEvent): void {
		for (const key in this._abstractionPool)
			(this._abstractionPool[key] as _Render_RenderableBase)._onInvalidateStyle();
	}

	/**
	 * //TODO
	 *
	 * @param renderable
	 * @returns IRenderState
	 */
	public getAbstraction(renderable: ITraversable): _Render_RenderableBase {
		let base = this._abstractionPool[renderable.id];

		/**
		 * @todo Remove me for preveting leaks
		 */
		if (!base) {
			base =
				this._abstractionPool[renderable.id] =
					new (<_IRender_RenderableClass> RenderEntity._renderRenderableClassPool[renderable.assetType])
					(
						renderable,
						this
					);
		}

		return  base;
	}

	/**
	 *
	 * @param renderable
	 */
	public clearAbstraction(renderable: ITraversable): void {
		delete this._abstractionPool[renderable.id];
	}

	public requestAbstraction(asset: IAsset): IAbstractionClass {
		return null;
	}

	/**
	 *
	 * @param imageObjectClass
	 */
	public static registerRenderable(renderStateClass: _IRender_RenderableClass, assetClass: IAssetClass): void {
		RenderEntity._renderRenderableClassPool[assetClass.assetType] = renderStateClass;
	}
}