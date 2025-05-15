import { IAnimator } from './IAnimator';
import { IMaterial } from './IMaterial';
import { Style } from './Style';
import { IContainer } from '@awayjs/view';

export interface IRenderContainer extends IContainer
{
	style: Style;

	animator: IAnimator;

	material: IMaterial;

	invalidateElements(): void;
}