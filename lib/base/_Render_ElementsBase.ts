
import { Stage, ShaderRegisterCache, ShaderRegisterData } from '@awayjs/stage';
import { AbstractionBase, IAbstractionClass, IAbstractionPool, IAsset } from '@awayjs/core';
import { RenderGroup } from '../RenderGroup';
import { ShaderBase } from './ShaderBase';
import { _IRender_MaterialClass } from './_IRender_MaterialClass';
import { RendererBase } from '../RendererBase';

/**
 * @class away.pool.MaterialPoolBase
 */
export class _Render_ElementsBase implements IAbstractionPool {

	private _materialClassPool: Record<string, _IRender_MaterialClass>;

	readonly stage: Stage;
	readonly renderer: RendererBase;

	public readonly id: number;

	/**
	 * //TODO
	 *
	 * @param materialClassGL
	 */
	constructor(renderer: RendererBase) {
		this.id = AbstractionBase.ID_COUNT++;
		this.renderer = renderer;
		this.stage = renderer.view.stage;
		this._materialClassPool = renderer.group.materialClassPool;
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