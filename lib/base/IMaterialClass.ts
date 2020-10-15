import { IAssetClass } from '@awayjs/core';

import { ImageBase } from '@awayjs/stage';

import { IMaterial } from './IMaterial';

/**
 *
 */
export interface IMaterialClass extends IAssetClass
{
	/**
     *
     */
	new(image?: ImageBase, alpha?: number): IMaterial;
	new(color?: number, alpha?: number): IMaterial;
}