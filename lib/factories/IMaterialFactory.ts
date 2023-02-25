import { IAsset } from '@awayjs/core';
import { IImageFactory, Image2D } from '@awayjs/stage';

import { IMaterial } from '../base/IMaterial';

export interface IMaterialFactory extends IImageFactory
{
	readonly awaySymbols: NumberMap<IAsset>;

	createMaterial(image?: Image2D, alpha?: number, symbol?: any): IMaterial;
	createMaterial(color?: number, alpha?: number, symbol?: any): IMaterial;
}