import { IAnimator } from './IAnimator';
import { IMaterial } from './IMaterial';
import { Style } from './Style';
import { IPartitionContainer, IPartitionEntity } from '@awayjs/view';

export interface IRenderContainer extends IPartitionContainer
{
	style: Style;

	animator: IAnimator;

	material: IMaterial;

	invalidateElements(): void;
}