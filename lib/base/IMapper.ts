import { IAsset } from '@awayjs/core';

import { PartitionBase } from '@awayjs/view';

export interface IMapper extends IAsset
{
	autoUpdate: boolean;

	update(partition: PartitionBase): void;
}