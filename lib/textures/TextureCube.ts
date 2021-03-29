import { TextureBase } from './TextureBase';

/**
 *
 */
export class TextureCube extends TextureBase {
	public static assetType: string = '[texture TextureCube]';

	/**
     *
     * @returns {string}
     */
	public get assetType(): string {
		return TextureCube.assetType;
	}
}