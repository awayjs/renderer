import { Vector3D } from "@awayjs/core/lib/geom/Vector3D";
export interface IAnimationState {
    positionDelta: Vector3D;
    offset(startTime: number): any;
    update(time: number): any;
    /**
     * Sets the animation phase of the node.
     *
     * @param value The phase value to use. 0 represents the beginning of an animation clip, 1 represents the end.
     */
    phase(value: number): any;
}
