import { IAsset } from '@awayjs/core';

import { ITexture } from '../base/ITexture';

import { Style } from './Style';

/**
 * ISurface provides an interface for objects that define the properties of a renderable's surface.
 *
 * @interface away.base.ISurface
 */
export interface IMaterial extends IAsset
{
	style: Style;

	alphaThreshold: number;

	bothSides: boolean;

	curves: boolean;

	imageRect: boolean;

	animateUVs: boolean;

	blendMode: string;

	useColorTransform: boolean;

	getNumTextures(): number;

	getTextureAt(i: number): ITexture;

	dispose();
}