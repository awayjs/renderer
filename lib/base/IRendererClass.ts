import { AbstractionBase, IAbstractionClass } from '@awayjs/core';

import { RenderGroup } from '../RenderGroup';
import { _IRender_MaterialClass } from './_IRender_MaterialClass';

/**
 *
 */
export interface IRendererClass extends IAbstractionClass
{
	readonly materialClassPool: Record<string, _IRender_MaterialClass>;

	readonly renderGroupPool: Record<string, RenderGroup>;

	readonly defaultBackground: number;
}