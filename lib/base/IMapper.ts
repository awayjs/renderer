import {IAsset} from "@awayjs/core";

import { RenderGroup } from '../RenderGroup';
import { PartitionBase } from '@awayjs/view';

export interface IMapper extends IAsset
{
	autoUpdate:boolean;

	update(partition:PartitionBase, renderGroup:RenderGroup):void;
}