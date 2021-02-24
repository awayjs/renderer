import { IAnimator } from './IAnimator';
import { IMaterial } from './IMaterial';
import { Style } from './Style';
import { IPartitionEntity } from '@awayjs/view';

export interface IRenderEntity extends IPartitionEntity
{
	style: Style;

	animator: IAnimator;

	material: IMaterial;

	/**
	 *
	 */
	zOffset: number;

	invalidateElements(): void;
}