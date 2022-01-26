import {
	IAssetClass,
	IAsset,
	IAbstractionPool,
	EventDispatcher,
	AbstractionBase,
	IAbstractionClass,
	AbstractMethodError
} from '@awayjs/core';

import { Stage, StageEvent } from '@awayjs/stage';

import { RenderEntity } from './base/RenderEntity';
import { _IRender_ElementsClass } from './base/_IRender_ElementsClass';
import { _Render_ElementsBase } from './base/_Render_ElementsBase';
import { RendererBase } from './RendererBase';
import { PartitionBase, View, ViewEvent, PickGroup } from '@awayjs/view';
import { _IRender_MaterialClass } from './base/_IRender_MaterialClass';
import { IMapper } from './base/IMapper';
import { IRendererClass } from './base/IRendererClass';

export class RenderGroup implements IAbstractionPool {
	public static _renderGroupPool: Record<string, RenderGroup> = {};

	private static _renderElementsClassPool: Record<string, _IRender_ElementsClass> = {};

	public readonly rendererClass: IRendererClass;

	public readonly materialClassPool: Record<string, _IRender_MaterialClass> = {};

	public readonly id: number;

	constructor(rendererClass: IRendererClass) {
		this.id = AbstractionBase.ID_COUNT++;
		this.rendererClass = rendererClass;
	}

	public requestAbstraction(asset: IAsset): IRendererClass {
		return this.rendererClass;
	}

	public getRenderer(partition: PartitionBase): RendererBase {
		return partition.getAbstraction<RendererBase>(this);
	}

	public static getInstance(rendererClass: IRendererClass) {
		return RenderGroup._renderGroupPool[rendererClass.assetType]
				|| (RenderGroup._renderGroupPool[rendererClass.assetType] = new RenderGroup(rendererClass));
	}

	/**
     *
     * @param imageObjectClass
     */
	public static registerElements(renderElementsClass: _IRender_ElementsClass, elementsClass: IAssetClass): void {
		RenderGroup._renderElementsClassPool[elementsClass.assetType] = renderElementsClass;
	}

	public static getRenderElements(elementsClass: IAssetClass): _IRender_ElementsClass {
		return RenderGroup._renderElementsClassPool[elementsClass.assetType];
	}
}

// /**
//  * @class away.pool.RenderGroup
//  */
// export class RenderGroup extends EventDispatcher implements IAbstractionPool {

// 	private static _renderElementsClassPool: Record<string, _IRender_ElementsClass> = {};

// 	// public static clearAllInstances(): void {
// 	// 	for (const key in this._instancePool) {
// 	// 		this._instancePool[key].clearAll();
// 	// 		delete this._instancePool[key];
// 	// 	}
// 	// }

// 	public static getInstance(view: View,  rendererClass: IRendererClass): RenderGroup {
// 		return rendererClass.renderGroupPool[view.id]
// 				|| (rendererClass.renderGroupPool[view.id] = new RenderGroup(view, rendererClass));
// 	}

// 	public static clearInstance(view: View, rendererClass: IRendererClass): void {
// 		const renderGroup: RenderGroup = rendererClass.renderGroupPool[view.id];

// 		if (renderGroup) {
// 			renderGroup.clearAll();

// 			delete rendererClass.renderGroupPool[view.id];
// 		}
// 	}

// 	private _onContextUpdateDelegate: (event: StageEvent) => void;
// 	private _onSizeInvalidateDelegate: (event: ViewEvent) => void;

// 	private _invalid: boolean;
// 	private _mappers: Array<IMapper> = new Array<IMapper>();
// 	public readonly view: View;

// 	public readonly stage: Stage;
// 	public readonly pickGroup: PickGroup;
// 	private _materialClassPool: Record<string, _IRender_MaterialClass>;
// 	private _elementsPools: Record<string, _Render_ElementsBase> = {};
// 	private _rendererPool: RendererPool;

// 	public readonly id: number;

// 	/**
// 	 * //TODO
// 	 *
// 	 * @param materialClassGL
// 	 */
// 	constructor(view: View, rendererClass: IRendererClass) {
// 		super();

// 		this.id = AbstractionBase.ID_COUNT++;
// 		this.view = view;
// 		this.stage = view.stage;
// 		this.pickGroup = PickGroup.getInstance(view);
// 		this._rendererPool = new RendererPool(this, rendererClass);
// 		this._materialClassPool = this._rendererPool.materialClassPool;

// 		this.view.backgroundColor = rendererClass.defaultBackground;

// 		this._onSizeInvalidateDelegate = (event: ViewEvent) => this.onSizeInvalidate(event);
// 		this._onContextUpdateDelegate = (event: StageEvent) => this.onContextUpdate(event);

// 		this.stage.addEventListener(StageEvent.CONTEXT_CREATED, this._onContextUpdateDelegate);
// 		this.stage.addEventListener(StageEvent.CONTEXT_RECREATED, this._onContextUpdateDelegate);
// 		this.view.addEventListener(ViewEvent.INVALIDATE_SIZE, this._onSizeInvalidateDelegate);
// 	}

// 	/**
// 	 * Clears the resources used by the RenderGroup.
// 	 */
// 	public clearAll(): void {
// 		this.stage.removeEventListener(StageEvent.CONTEXT_CREATED, this._onContextUpdateDelegate);
// 		this.stage.removeEventListener(StageEvent.CONTEXT_RECREATED, this._onContextUpdateDelegate);
// 		this.view.removeEventListener(ViewEvent.INVALIDATE_SIZE, this._onSizeInvalidateDelegate);
// 	}

// 	public update(partition: PartitionBase): void {
// 		//update mappers
// 		const len: number = this._mappers.length;
// 		for (let i: number = 0; i < len; i++)
// 			this._mappers[i].update(partition, this);
// 	}

// 	public invalidate(): void {
// 		this._invalid = true;
// 	}

// 	public _addMapper(mapper: IMapper) {
// 		if (this._mappers.indexOf(mapper) != -1)
// 			return;

// 		this._mappers.push(mapper);
// 	}

// 	public _removeMapper(mapper: IMapper) {
// 		const index: number = this._mappers.indexOf(mapper);

// 		if (index != -1)
// 			this._mappers.splice(index, 1);
// 	}

// 	/**
// 	 *
// 	 */
// 	public onSizeInvalidate(event: ViewEvent): void {
// 		this.dispatchEvent(event);
// 	}

// 	/**
// 	 * Assign the context once retrieved
// 	 */
// 	private onContextUpdate(event: StageEvent): void {
// 		this.dispatchEvent(event);
// 	}

// 	public getRenderElements(elements: IAsset): _Render_ElementsBase {
// 		let el = this._elementsPools[elements.assetType];
// 		/**
// 		 * @todo Remove me to prevent leaks
// 		 */
// 		if (!el) {
// 			el =
// 				this._elementsPools[elements.assetType] =
// 					new (RenderGroup._renderElementsClassPool[elements.assetType])
// 					(
// 						this.stage,
// 						this._materialClassPool,
// 						this
// 					);
// 		}

// 		return el;
// 	}

// 	public requestAbstraction(asset: IAsset): IAbstractionClass {
// 		return RenderEntity;
// 	}

// 	public getRenderer<T extends RendererBase> (partition: PartitionBase): T {
// 		return <T> partition.getAbstraction<RendererBase>(this._rendererPool);
// 	}

// 	/**
//      *
//      * @param imageObjectClass
//      */
// 	public static registerElements(renderElementsClass: _IRender_ElementsClass, elementsClass: IAssetClass): void {
// 		RenderGroup._renderElementsClassPool[elementsClass.assetType] = renderElementsClass;
// 	}
//}