import { IAsset } from '@awayjs/core';

import { INode, View } from '@awayjs/view';

export interface IMapper extends IAsset
{
	autoUpdate: boolean;

	update(view: View, node: INode): void;
}