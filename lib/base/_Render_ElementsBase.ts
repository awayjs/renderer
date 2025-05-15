
import { Stage, ShaderRegisterCache, ShaderRegisterData } from '@awayjs/stage';
import { AssetBase, IAbstraction, IAbstractionPool, IAsset, WeakAssetSet } from '@awayjs/core';
import { ShaderBase } from './ShaderBase';
import { _IRender_MaterialClass } from './_IRender_MaterialClass';
import { RendererBase } from '../RendererBase';
import { _Render_MaterialBase } from './_Render_MaterialBase';

/**
 * @class away.pool.MaterialPoolBase
 */
export class _Render_ElementsBase extends AssetBase implements IAbstractionPool {
	private _materialStore: Record<string,  IAbstraction[]>;
	private _materialClassPool: Record<string, _IRender_MaterialClass>;

	private _materials: WeakAssetSet = new WeakAssetSet("_Render_MaterialBase");

	readonly stage: Stage;
	readonly renderer: RendererBase;

	/**
	 * //TODO
	 *
	 * @param materialClassGL
	 */
	constructor(renderer: RendererBase) {
		super();
		this.renderer = renderer;
		this.stage = renderer.view.stage;
		this._materialStore = renderer.group.materialStore;
		this._materialClassPool = renderer.group.materialClassPool;
	}

	public requestAbstraction(asset: IAsset): IAbstraction {
		const store = this._materialStore[asset.assetType];
		return store.length ? store.pop() : new this._materialClassPool[asset.assetType]();
	}

	public storeAbstraction(abstraction: IAbstraction): void {
		this._materialStore[abstraction.asset.assetType].push(abstraction);
	}

	public addMaterial(material: _Render_MaterialBase): void {
		this._materials.add(material);
	}

	public removeMaterial(material: _Render_MaterialBase): void {
		this._materials.remove(material);
	}

	public clear(): void {
		this._materials.forEach((asset: _Render_MaterialBase) => asset.onClear(null));
	}

	public _includeDependencies(shader: ShaderBase): void {
	}

	public _getVertexCode(
		shader: ShaderBase,
		registerCache: ShaderRegisterCache,
		sharedRegisters: ShaderRegisterData): string {
		return '';
	}

	public _getFragmentCode(
		shader: ShaderBase,
		registerCache: ShaderRegisterCache,
		sharedRegisters: ShaderRegisterData): string {
		return '';
	}
}