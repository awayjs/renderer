import { IAsset } from '@awayjs/core';

import { INode } from '@awayjs/view';

export interface IMapper extends IAsset
{
	autoUpdate: boolean;

	update(node: INode): void;
}