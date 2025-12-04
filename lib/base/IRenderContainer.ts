import { IAnimator } from './IAnimator';
import { IMaterial } from './IMaterial';
import { Style } from './Style';
import { IContainer } from '@awayjs/view';
import { RenderEntity } from './RenderEntity';
import { _Render_RenderableBase } from './_Render_RenderableBase';
import { CacheRenderer } from '../CacheRenderer';

export interface IRenderContainer extends IContainer
{
	_renderObjects: Record<number, RenderEntity | CacheRenderer | _Render_RenderableBase>;

	style: Style;

	animator: IAnimator;

	material: IMaterial;

	invalidateElements(): void;
}