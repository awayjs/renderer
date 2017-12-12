import {IEventDispatcher, Plane3D, Rectangle, ProjectionBase} from "@awayjs/core";

import {ImageBase} from "@awayjs/stage";

import {IView} from "./IView";
import {IMapper} from "./IMapper";

/**
 * IRenderer is an interface for classes that are used in the rendering pipeline to render the
 * contents of a partition
 *
 * @class away.render.IRenderer
 */
export interface IRenderer extends IEventDispatcher
{
	cullPlanes:Array<Plane3D>

	/**
	 *
	 */
	shareContext:boolean;

	/**
	 *
	 */
	x:number /*uint*/;

	/**
	 *
	 */
	y:number /*uint*/;

	/**
	 *
	 */
	width:number /*uint*/;

	/**
	 *
	 */
	height:number /*uint*/;

	/**
	 *
	 */
	viewPort:Rectangle;

	/**
	 *
	 */
	scissorRect:Rectangle;

	/**
	 *
	 */
	dispose();

	/**
	 *
	 * @param entityCollector
	 */
	render(projection:ProjectionBase, view:IView);

	/**
	 * @internal
	 */
	_iBackgroundR:number /*uint*/;

	/**
	 * @internal
	 */
	_iBackgroundG:number /*uint*/;

	/**
	 * @internal
	 */
	_iBackgroundB:number /*uint*/;

	/**
	 * @internal
	 */
	_iBackgroundAlpha:number;

	_iRender(projection:ProjectionBase, view:IView, target?:ImageBase, scissorRect?:Rectangle, surfaceSelector?:number);

	_iRenderCascades(projection:ProjectionBase, view:IView, target:ImageBase, numCascades:number, scissorRects:Array<Rectangle>, projections:Array<ProjectionBase>);

	_addMapper(mapper:IMapper):void;

	_removeMapper(mapper:IMapper):void;
}