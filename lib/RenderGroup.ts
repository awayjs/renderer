import { IAssetClass, IAsset, IAbstractionPool, EventDispatcher, AbstractionBase, IAbstractionClass } from '@awayjs/core';

import { Stage, StageEvent } from '@awayjs/stage';

import { IRenderEntity } from './base/IRenderEntity';
import { RenderEntity } from './base/RenderEntity';
import { _IRender_ElementsClass } from './base/_IRender_ElementsClass';
import { _Render_ElementsBase } from './base/_Render_ElementsBase';
import { RendererBase } from './RendererBase';
import { PartitionBase, View, ViewEvent, PickGroup } from '@awayjs/view';
import { DefaultRenderer } from './DefaultRenderer';
import { _IRender_MaterialClass } from './base/_IRender_MaterialClass';
import { IMaterialClass } from './base/IMaterialClass';
import { DepthRenderer } from './DepthRenderer';
import { DistanceRenderer } from './DistanceRenderer';
import { IMapper } from './base/IMapper';

export interface IRendererPool extends IAbstractionPool
{
	readonly renderGroup: RenderGroup;
	readonly materialClassPool: Object;
}

class DefaultRendererPool implements IRendererPool {
	public static _materialClassPool: Object = new Object();

	public readonly renderGroup: RenderGroup;

	public get materialClassPool(): Object {
		return DefaultRendererPool._materialClassPool;
	}

	public readonly id: number;

	constructor(renderGroup: RenderGroup) {
		this.id = AbstractionBase.ID_COUNT++;
		this.renderGroup = renderGroup;
	}

	public requestAbstraction(asset: IAsset): IAbstractionClass {
		return DefaultRenderer;
	}

	/**
     *
     * @param imageObjectClass
     */
	public static registerMaterial(renderMaterialClass: _IRender_MaterialClass, materialClass: IMaterialClass): void {
		DefaultRendererPool._materialClassPool[materialClass.assetType] = renderMaterialClass;
	}
}

class DepthRendererPool implements IRendererPool {
	public static _materialClassPool: Object = new Object();

	public readonly renderGroup: RenderGroup;

	public get materialClassPool(): Object {
		return DepthRendererPool._materialClassPool;
	}

	public readonly id: number;

	constructor(renderGroup: RenderGroup) {
		this.id = AbstractionBase.ID_COUNT++;
		this.renderGroup = renderGroup;
	}

	public requestAbstraction(asset: IAsset): IAbstractionClass {
		return DepthRenderer;
	}

	/**
     *
     * @param imageObjectClass
     */
	public static registerMaterial(renderMaterialClass: _IRender_MaterialClass, materialClass: IMaterialClass): void {
		DepthRendererPool._materialClassPool[materialClass.assetType] = renderMaterialClass;
	}
}

class DistanceRendererPool implements IRendererPool {
	public static _materialClassPool: Object = new Object();

	public readonly renderGroup: RenderGroup;

	public get materialClassPool(): Object {
		return DistanceRendererPool._materialClassPool;
	}

	public readonly id: number;

	constructor(renderGroup: RenderGroup) {
		this.id = AbstractionBase.ID_COUNT++;
		this.renderGroup = renderGroup;
	}

	public requestAbstraction(asset: IAsset): IAbstractionClass {
		return DistanceRenderer;
	}

	/**
     *
     * @param imageObjectClass
     */
	public static registerMaterial(renderMaterialClass: _IRender_MaterialClass, materialClass: IMaterialClass): void {
		DistanceRendererPool._materialClassPool[materialClass.assetType] = renderMaterialClass;
	}
}

export enum RendererType
	{
	DEFAULT,

	DEPTH,

	DISTANCE
}

/**
 * @class away.pool.RenderGroup
 */
export class RenderGroup extends EventDispatcher implements IAbstractionPool {
	private static _rendererPool: Object = {
		[RendererType.DEFAULT]:DefaultRendererPool,
		[RendererType.DEPTH]:DepthRendererPool,
		[RendererType.DISTANCE]:DistanceRendererPool,
	}

	private static _defaultInstancePool: Object = new Object();
	private static _depthInstancePool: Object = new Object();
	private static _distanceInstancePool: Object = new Object();

	private static _instancePool: Object = {
		[RendererType.DEFAULT]:RenderGroup._defaultInstancePool,
		[RendererType.DEPTH]:RenderGroup._depthInstancePool,
		[RendererType.DISTANCE]:RenderGroup._distanceInstancePool,
	}

	private static _renderElementsClassPool: Object = new Object();

	public static clearAllInstances(): void {
		for (const key in this._instancePool) {
			(this._instancePool[key] as RenderGroup).clearAll();
			delete this._instancePool[key];
		}
	}

	public static getInstance(view: View, rendererType: RendererType): RenderGroup {
		const group = this._instancePool[rendererType][view.id];

		/**
		 * @todo Remove me for prevent leaks
		 */
		return this._instancePool[rendererType][view.id] || (this._instancePool[rendererType][view.id] = new RenderGroup(view, rendererType));
	}

	public static clearInstance(view: View, rendererType: RendererType): void {
		const renderGroup: RenderGroup = this._instancePool[rendererType][view.id];

		if (renderGroup) {
			renderGroup.clearAll();

			delete this._instancePool[rendererType][view.id];
		}
	}

	private _onContextUpdateDelegate: (event: StageEvent) => void;
	private _onSizeInvalidateDelegate: (event: ViewEvent) => void;

	private _invalid: boolean;
	private _mappers: Array<IMapper> = new Array<IMapper>();
	public readonly view: View;
	private _depthRenderGroup: RenderGroup;
	private _distanceRenderGroup: RenderGroup;

	public readonly stage: Stage;
	public readonly pickGroup: PickGroup;
	private _materialClassPool: Object;
	private _materialPools: Object = new Object();
	private _rendererPool: IRendererPool;

	public get depthRenderGroup(): RenderGroup {
		if (this._depthRenderGroup == null)
			this._depthRenderGroup = RenderGroup.getInstance(new View(null, this.stage), RendererType.DEPTH);

		return this._depthRenderGroup;
	}

	public get distanceRenderGroup(): RenderGroup {
		if (this._distanceRenderGroup == null)
			this._distanceRenderGroup = RenderGroup.getInstance(new View(null, this.stage), RendererType.DISTANCE);

		return this._distanceRenderGroup;
	}

	public readonly id: number;

	/**
	 * //TODO
	 *
	 * @param materialClassGL
	 */
	constructor(view: View, rendererType: RendererType) {
		super();

		this.id = AbstractionBase.ID_COUNT++;
		this.view = view;
		this.stage = view.stage;
		this.pickGroup = PickGroup.getInstance(view);
		this._rendererPool = new RenderGroup._rendererPool[rendererType](this);
		this._materialClassPool = this._rendererPool.materialClassPool;

		if (rendererType != RendererType.DEFAULT) //set shadow renderer backgrounds to white
			this.view.backgroundColor = 0xFFFFFF;

		this._onSizeInvalidateDelegate = (event: ViewEvent) => this.onSizeInvalidate(event);
		this._onContextUpdateDelegate = (event: StageEvent) => this.onContextUpdate(event);

		this.stage.addEventListener(StageEvent.CONTEXT_CREATED, this._onContextUpdateDelegate);
		this.stage.addEventListener(StageEvent.CONTEXT_RECREATED, this._onContextUpdateDelegate);
		this.view.addEventListener(ViewEvent.INVALIDATE_SIZE, this._onSizeInvalidateDelegate);
	}

	/**
	 * Clears the resources used by the RenderGroup.
	 */
	public clearAll(): void {
		this.stage.removeEventListener(StageEvent.CONTEXT_CREATED, this._onContextUpdateDelegate);
		this.stage.removeEventListener(StageEvent.CONTEXT_RECREATED, this._onContextUpdateDelegate);
		this.view.removeEventListener(ViewEvent.INVALIDATE_SIZE, this._onSizeInvalidateDelegate);
	}

	public update(partition: PartitionBase): void {
		//update mappers
		const len: number = this._mappers.length;
		for (let i: number = 0; i < len; i++)
			this._mappers[i].update(partition, this);
	}

	public invalidate(): void {
		this._invalid = true;
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

	/**
	 *
	 */
	public onSizeInvalidate(event: ViewEvent): void {
		this.dispatchEvent(event);
	}

	/**
	 * Assign the context once retrieved
	 */
	private onContextUpdate(event: StageEvent): void {
		this.dispatchEvent(event);
	}

	public getRenderElements(elements: IAsset): _Render_ElementsBase {
		let el = this._materialPools[elements.assetType];
		/**
		 * @todo Remove me to prevent leaks
		 */
		if (!el) {
			el =
				this._materialPools[elements.assetType] =
					new (<_IRender_ElementsClass> RenderGroup._renderElementsClassPool[elements.assetType])
					(
						this.stage,
						this._materialClassPool,
						this
					);
		}

		return el;
	}

	public requestAbstraction(asset: IAsset): IAbstractionClass {
		return RenderEntity;
	}

	public getRenderer(partition: PartitionBase): RendererBase {
		return partition.getAbstraction<RendererBase>(this._rendererPool);
	}

	/**
     *
     * @param imageObjectClass
     */
	public static registerElements(renderElementsClass: _IRender_ElementsClass, elementsClass: IAssetClass): void {
		RenderGroup._renderElementsClassPool[elementsClass.assetType] = renderElementsClass;
	}

	public static registerDefaultMaterial(
		renderMaterialClass: _IRender_MaterialClass,
		materialClass: IMaterialClass): void {

		DefaultRendererPool.registerMaterial(renderMaterialClass, materialClass);
	}

	public static registerDepthMaterial(
		renderMaterialClass: _IRender_MaterialClass,
		materialClass: IMaterialClass): void {
		DepthRendererPool.registerMaterial(renderMaterialClass, materialClass);
	}

	public static registerDistanceMaterial(
		renderMaterialClass: _IRender_MaterialClass,
		materialClass: IMaterialClass): void {

		DistanceRendererPool.registerMaterial(renderMaterialClass, materialClass);
	}
}