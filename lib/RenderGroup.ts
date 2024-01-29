import {
	IAssetClass,
	IAsset,
	IAbstractionPool,
	UUID,
} from '@awayjs/core';

import { _IRender_ElementsClass } from './base/_IRender_ElementsClass';
import { RendererBase } from './RendererBase';
import { PartitionBase } from '@awayjs/view';
import { _IRender_MaterialClass } from './base/_IRender_MaterialClass';
import { IRendererClass } from './base/IRendererClass';

export class RenderGroup implements IAbstractionPool {
	public static _renderGroupPool: Record<string, RenderGroup> = {};

	private static _renderElementsClassPool: Record<string, _IRender_ElementsClass> = {};

	public readonly rendererClass: IRendererClass;

	public readonly materialClassPool: Record<string, _IRender_MaterialClass> = {};

	public readonly id: number;

	constructor(rendererClass: IRendererClass) {
		this.id = UUID.Next();
		this.rendererClass = rendererClass;
	}

	public requestAbstraction(asset: IAsset): IRendererClass {
		return this.rendererClass;
	}

	public getRenderer <T extends RendererBase>(partition: PartitionBase): T {
		return <T> partition.getAbstraction<RendererBase>(this);
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

	public static getRenderElementsClass(asset: IAsset): _IRender_ElementsClass {
		return RenderGroup._renderElementsClassPool[asset.assetType];
	}
}