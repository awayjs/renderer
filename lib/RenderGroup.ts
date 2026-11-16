import {
	IAssetClass,
	IAsset,
	IAbstractionPool,
	UUID,
	IAbstraction,
	WeakAssetSet,
	AbstractionBase,
} from '@awayjs/core';

import { _IRender_ElementsClass } from './base/_IRender_ElementsClass';
import { RendererBase } from './RendererBase';
import { INode, View } from '@awayjs/view';
import { _IRender_MaterialClass } from './base/_IRender_MaterialClass';
import { IRendererClass } from './base/IRendererClass';
import { AbstractionSet } from '@awayjs/core/dist/lib/base/AbstractionSet';
import { _Render_MaterialBase } from './base/_Render_MaterialBase';

export class RenderPool extends AbstractionBase implements IAbstractionPool {

	private _store: IAbstraction[] = [];

	public readonly abstractions: AbstractionSet;

	public get view(): View {
		return this._useWeak ? (<WeakRef<View>> this._asset).deref() : <View> this._asset;
	}

	public get group(): RenderGroup {
		return <RenderGroup> this._pool;
	}

	constructor() {
		super();
		this.abstractions = new AbstractionSet(this);
	}

	public init(view: View, renderGroup: RenderGroup) {
		super.init(view, renderGroup, true);
	}

	public requestAbstraction(asset: IAsset): IAbstraction {
		return this._store.length ? this._store.pop() : new (<RenderGroup> this._pool).rendererClass();
	}

	public storeAbstraction(abstraction: IAbstraction): void {
		this._store.push(abstraction);
	}

	public getRenderer <T extends RendererBase>(node: INode): T {
		return <T> this.abstractions.getAbstraction<RendererBase>(node);
	}
}

export class RenderGroup implements IAbstractionPool {
	public static _renderGroupPool: Record<string, RenderGroup> = {};

	private static _renderElementsClassPool: Record<string, _IRender_ElementsClass> = {};

	private _store: IAbstraction[] = [];

	public readonly abstractions: AbstractionSet;

	public readonly rendererClass: IRendererClass;

	public readonly materialStore: Record<string,  _Render_MaterialBase[]> = {};

	public readonly materialClassPool: Record<string, _IRender_MaterialClass> = {};

	public readonly id: number;

	constructor(rendererClass: IRendererClass) {
		this.id = UUID.Next();
		this.abstractions = new AbstractionSet(this);
		this.rendererClass = rendererClass;
	}

	public requestAbstraction(asset: IAsset): IAbstraction {
		return this._store.length ? this._store.pop() : new RenderPool();
	}

	public storeAbstraction(abstraction: IAbstraction): void {
		this._store.push(abstraction);
	}

	public getRenderer <T extends RendererBase>(view: View, node: INode): T {
		return <T> this.abstractions.getAbstraction<RenderPool>(view).getRenderer(node);
	}

	public static getInstance(rendererClass: IRendererClass): RenderGroup {
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