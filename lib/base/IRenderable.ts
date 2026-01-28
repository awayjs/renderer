import { IAsset } from '@awayjs/core';
import { _Render_RenderableBase } from './_Render_RenderableBase';
import { _Pick_PickableBase } from '@awayjs/view';
import { Style } from './Style';
import { RenderEntity } from './RenderEntity';
import { CacheRenderer } from '../CacheRenderer';

export interface IRenderable extends IAsset
{
	style: Style;

	_renderObjects: Record<number, RenderEntity | _Render_RenderableBase | CacheRenderer>;
}