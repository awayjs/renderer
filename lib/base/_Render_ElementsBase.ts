
import { Stage, ShaderRegisterCache, ShaderRegisterData } from '@awayjs/stage';
import { AssetBase, AssetEvent, IAbstractionClass, IAbstractionPool, IAsset } from '@awayjs/core';
import { ShaderBase } from './ShaderBase';
import { _IRender_MaterialClass } from './_IRender_MaterialClass';
import { RendererBase } from '../RendererBase';

/**
 * @class away.pool.MaterialPoolBase
 */
export class _Render_ElementsBase extends AssetBase implements IAbstractionPool {

	private _materialClassPool: Record<string, _IRender_MaterialClass>;

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
		this._materialClassPool = renderer.group.materialClassPool;
	}

	public clear(): void {
		this.dispatchEvent(new AssetEvent(AssetEvent.CLEAR, this));
	}

	public requestAbstraction(asset: IAsset): IAbstractionClass {
		return this._materialClassPool[asset.assetType];
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