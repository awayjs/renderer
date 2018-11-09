import {IEventDispatcher, Plane3D, Rectangle, ProjectionBase} from "@awayjs/core";

import {Viewport} from "@awayjs/stage";

import {IMapper} from "./IMapper";
import { IRenderable } from './IRenderable';

/**
 * IRenderer is an interface for classes that are used in the rendering pipeline to render the
 * contents of a partition
 *
 * @class away.render.IRenderer
 */
export interface IRenderer
{
	cullPlanes:Array<Plane3D>

	/**
	 *
	 */
	viewport:Viewport;

	/**
	 *
	 */
	dispose();

	/**
	 *
	 * @param entityCollector
	 */
	render(enableDepthAndStencil?:boolean, surfaceSelector?:number):void

	_addMapper(mapper:IMapper):void;

	_removeMapper(mapper:IMapper):void;

	applyRenderable(renderable:IRenderable):void
}