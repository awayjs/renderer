import { Matrix3D } from "@awayjs/core/lib/geom/Matrix3D";
import { Quaternion } from "@awayjs/core/lib/geom/Quaternion";
import { Vector3D } from "@awayjs/core/lib/geom/Vector3D";
/**
 * Contains transformation data for a skeleton joint, used for skeleton animation.
 *
 * @see away.animation.Skeleton
 * @see away.animation.SkeletonJoint
 *
 * todo: support (uniform) scale
 */
export declare class JointPose {
    /**
     * The name of the joint to which the pose is associated
     */
    name: string;
    /**
     * The rotation of the pose stored as a quaternion
     */
    orientation: Quaternion;
    /**
     * The translation of the pose
     */
    translation: Vector3D;
    constructor();
    /**
     * Converts the transformation to a Matrix3D representation.
     *
     * @param target An optional target matrix to store the transformation. If not provided, it will create a new instance.
     * @return The transformation matrix of the pose.
     */
    toMatrix3D(target?: Matrix3D): Matrix3D;
    /**
     * Copies the transformation data from a source pose object into the existing pose object.
     *
     * @param pose The source pose to copy from.
     */
    copyFrom(pose: JointPose): void;
}
