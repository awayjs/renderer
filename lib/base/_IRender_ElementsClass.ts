import { Stage } from '@awayjs/stage';

import { _Render_ElementsBase } from './_Render_ElementsBase';
import { RendererBase } from '../RendererBase';

/**
 *
 */
export interface _IRender_ElementsClass
{
	/**
	 *
	 */
	new(renderGroup: RendererBase): _Render_ElementsBase;
}