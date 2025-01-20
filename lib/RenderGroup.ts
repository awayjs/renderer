import {
	IAssetClass,
	IAsset,
	IAbstractionPool,
	UUID,
	IAbstraction,
} from '@awayjs/core';

import { _IRender_ElementsClass } from './base/_IRender_ElementsClass';
import { RendererBase } from './RendererBase';
import { PartitionBase } from '@awayjs/view';
import { _IRender_MaterialClass } from './base/_IRender_MaterialClass';
import { IRendererClass } from './base/IRendererClass';

export class RenderGroup implements IAbstractionPool {
	public static _renderGroupPool: Record<string, RenderGroup> = {};

	private static _renderElementsClassPool: Record<string, _IRender_ElementsClass> = {};

	private _rendererClass: IRendererClass;

	private _store: IAbstraction[] = [];

	public readonly materialStore: Record<string,  IAbstraction[]> = {};

	public readonly materialClassPool: Record<string, _IRender_MaterialClass> = {};

	public readonly id: number;

	constructor(rendererClass: IRendererClass) {
		this.id = UUID.Next();
		this._rendererClass = rendererClass;
	}

	public requestAbstraction(asset: IAsset): IAbstraction {
		return this._store.length ? this._store.pop() : new this._rendererClass();
	}

	public storeAbstraction(abstraction: IAbstraction): void {
			this._store.push(abstraction);
	}

	public getRenderer <T extends RendererBase>(partition: PartitionBase): T {
		return <T> partition.getAbstraction<RendererBase>(this);
	}

	public static getInstance(rendererClass: IRendererClass) {
		return RenderGroup._renderGroupPool[rendererClass.assetType]
				|| (RenderGroup._renderGroupPool[rendererClass.assetType] = new RenderGroup(rendererClass));
	}

	public registerMaterial(renderMaterialClass: _IRender_MaterialClass, materialClass: IAssetClass): void {
		this.materialClassPool[materialClass.assetType] = renderMaterialClass;
		this.materialStore[materialClass.assetType] = [];
	}

	/**
     *
     * @param imageObjectClass
     */
	public static registerElements(renderElementsClass: _IRender_ElementsClass, elementsClass: IAssetClass): void {
		RenderGroup._renderElementsClassPool[elementsClass.assetType] = renderElementsClass;
	}

	public static getRenderElementsClass(asset: IAsset): _IRender_ElementsClass {
		return RenderGroup._renderElementsClassPool[asset.assetType];
	}
}