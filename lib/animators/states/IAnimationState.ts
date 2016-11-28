import {Vector3D} from "@awayjs/core";

export interface IAnimationState
{
	positionDelta:Vector3D; // GET

	offset(startTime:number);

	update(time:number);

	/**
	 * Sets the animation phase of the node.
	 *
	 * @param value The phase value to use. 0 represents the beginning of an animation clip, 1 represents the end.
	 */
	phase(value:number);
}