import { MappingMode } from '../base/MappingMode';
import { TextureBase } from './TextureBase';

/**
 *
 */
export class Texture2D extends TextureBase {
	public static assetType: string = '[texture Texture2D]';

	/**
     *
     * @returns {string}
     */
	public get assetType(): string {
		return Texture2D.assetType;
	}

	constructor(mappingMode: MappingMode = null) {
		super();

		this._mappingMode = mappingMode || MappingMode.LINEAR;
	}
}