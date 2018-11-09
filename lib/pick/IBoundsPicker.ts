import { Box, Vector3D, Sphere, IEventDispatcher } from '@awayjs/core';
import { IEntity } from '../base/IEntity';

/**
 * Provides an interface for picking objects that can pick 3d objects from a view or scene.
 *
 * @interface away.pick.IBoundsPicker
 */
export interface IBoundsPicker extends IEventDispatcher
{
	entity:IEntity;

	_hitTestPointInternal(rootEntity:IEntity, x:number, y:number, shapeFlag?:boolean, maskFlag?:boolean):boolean

	_getBoxBoundsInternal(parentCoordinateSpace?:IEntity, strokeFlag?:boolean, fastFlag?:boolean, cache?:Box, target?:Box):Box

	_getSphereBoundsInternal(center?:Vector3D, parentCoordinateSpace?:IEntity, strokeFlag?:boolean, fastFlag?:boolean, cache?:Sphere, target?:Sphere):Sphere

}