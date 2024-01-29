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
	new(renderer: RendererBase): _Render_ElementsBase;
}