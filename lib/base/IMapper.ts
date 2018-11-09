import {IAsset, ProjectionBase} from "@awayjs/core";

import { RendererBase } from '../RendererBase';

export interface IMapper extends IAsset
{
	autoUpdate:boolean;

	update(projection:ProjectionBase, rootRenderer:RendererBase):void;
}