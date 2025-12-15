import { IAsset } from '@awayjs/core';
import { _Render_RenderableBase } from './_Render_RenderableBase';
import { _Pick_PickableBase } from '@awayjs/view';
import { Style } from './Style';

export interface IRenderable extends IAsset
{
	style: Style;

	_renderObjects: Record<number, _Render_RenderableBase>;
}