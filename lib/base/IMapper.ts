import {IAsset, ProjectionBase} from "@awayjs/core";

import {IRenderer} from "./IRenderer";
import {IView} from "./IView";

export interface IMapper extends IAsset
{
	autoUpdate:boolean;

	update(projection:ProjectionBase, view:IView, rootRenderer:IRenderer):void;
}