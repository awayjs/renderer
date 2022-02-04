import { AbstractionBase, IAbstractionClass } from '@awayjs/core';

import { RenderGroup } from '../RenderGroup';
import { _IRender_MaterialClass } from './_IRender_MaterialClass';

/**
 *
 */
export interface IRendererClass extends IAbstractionClass
{
	readonly assetType: string;
}