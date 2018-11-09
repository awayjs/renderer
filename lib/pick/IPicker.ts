import { IPickable } from '../base/IPickable';

/**
 * Provides an interface for picking objects that can pick 3d objects from a view or scene.
 *
 * @interface away.pick.IPicker
 */
export interface IPicker
{
	applyPickable(pickable:IPickable):void
}