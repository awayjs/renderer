import { Stage } from '@awayjs/stage';

import { _Render_ElementsBase } from './_Render_ElementsBase';
import { RenderGroup } from '../RenderGroup';
import { RendererBase } from '../RendererBase';

/**
 *
 */
export interface _IRender_ElementsClass
{
	/**
	 *
	 */
	new(renderer: RendererBase): _Render_ElementsBase;
}