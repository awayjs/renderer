import {Vector3D} from "@awayjs/core";

import {IEntity} from "../base/IEntity";

import {PickingCollision} from "./PickingCollision";

/**
 * Provides an interface for picking objects that can pick 3d objects from a view or scene.
 *
 * @interface away.pick.IPicker
 */
export interface IPicker
{
	/**
	 * Gets the collision object from the scene position and direction of the picking ray.
	 *
	 * @param position The position of the picking ray in scene-space.
	 * @param direction The direction of the picking ray in scene-space.
	 */
	getCollision(position:Vector3D, direction:Vector3D, shapeFlag?:boolean):PickingCollision;

	/**
	 * Determines whether the picker takes account of the mouseEnabled properties of entities. Defaults to true.
	 */
	onlyMouseEnabled:boolean; // GET / SET

	/**
	 * Disposes memory used by the IPicker object
	 */
	dispose();

	/**
	 */
	getNextTabEntity(IEntity):IEntity;
	getPrevTabEntity(IEntity):IEntity;
}