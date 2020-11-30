
import { Stage, ShaderRegisterCache, ShaderRegisterData } from '@awayjs/stage';
import { _IRender_MaterialClass } from './_IRender_MaterialClass';
import { _Render_MaterialBase } from './_Render_MaterialBase';
import { AbstractionBase, IAbstractionClass, IAbstractionPool, IAsset } from '@awayjs/core';
import { RenderGroup } from '../RenderGroup';
import { ShaderBase } from './ShaderBase';

/**
 * @class away.pool.MaterialPoolBase
 */
export class _Render_ElementsBase implements IAbstractionPool {

	private _materialClassPool: Object;

	readonly stage: Stage;
	readonly renderGroup: RenderGroup;


	public readonly id: number;

	/**
	 * //TODO
	 *
	 * @param materialClassGL
	 */
	constructor(stage: Stage, materialClassPool: Object, renderGroup: RenderGroup) {
		this.id = AbstractionBase.ID_COUNT++;
		this.stage = stage;
		this._materialClassPool = materialClassPool;
		this.renderGroup = renderGroup;
	}
	
	public requestAbstraction(asset: IAsset): IAbstractionClass
	{
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