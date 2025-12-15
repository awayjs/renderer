
import { Stage, ShaderRegisterCache, ShaderRegisterData } from '@awayjs/stage';
import { AbstractionSet, AssetBase, IAbstractionPool, IAsset } from '@awayjs/core';
import { ShaderBase } from './ShaderBase';
import { _IRender_MaterialClass } from './_IRender_MaterialClass';
import { RendererBase } from '../RendererBase';
import { _Render_MaterialBase } from './_Render_MaterialBase';

/**
 * @class away.pool.MaterialPoolBase
 */
export class _Render_ElementsBase extends AssetBase implements IAbstractionPool {
	private _materialStore: Record<string,  _Render_MaterialBase[]>;
	private _materialClassPool: Record<string, _IRender_MaterialClass>;

	readonly abstractions: AbstractionSet;
	readonly renderer: RendererBase;
	readonly stage: Stage;

	/**
	 * //TODO
	 *
	 * @param materialClassGL
	 */
	constructor(renderer: RendererBase) {
		super();
		this.abstractions = new AbstractionSet(this);
		this.renderer = renderer;
		this.stage = renderer.view.stage;
		this._materialStore = renderer.group.materialStore;
		this._materialClassPool = renderer.group.materialClassPool;
	}

	public requestAbstraction(asset: IAsset): _Render_MaterialBase {
		const store = this._materialStore[asset.assetType];
		return store.length ? store.pop() : new this._materialClassPool[asset.assetType]();
	}

	public storeAbstraction(abstraction: _Render_MaterialBase, assetType: string): void {
		this._materialStore[assetType].push(abstraction);
	}

	public clear(): void {
		this.abstractions.forEach((pickable: _Render_MaterialBase) => pickable.onClear());
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