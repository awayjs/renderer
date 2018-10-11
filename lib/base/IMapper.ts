import {IAsset, ProjectionBase} from "@awayjs/core";

import { PartitionBase } from '../partition/PartitionBase';
import { IRenderer } from './IRenderer';

export interface IMapper extends IAsset
{
	autoUpdate:boolean;

	update(projection:ProjectionBase, rootRenderer:IRenderer):void;
}