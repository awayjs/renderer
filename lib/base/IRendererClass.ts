import { IAbstractionClass } from '@awayjs/core';
import { RenderGroup } from '../RenderGroup';

/**
 *
 */
export interface IRendererClass extends IAbstractionClass
{
	readonly assetType: string;
}