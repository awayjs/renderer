/**
 * A value obect representing a single joint in a skeleton object.
 *
 * @see away.animators.Skeleton
 */
export declare class SkeletonJoint {
    /**
     * The index of the parent joint in the skeleton's joints vector.
     *
     * @see away.animators.Skeleton#joints
     */
    parentIndex: number;
    /**
     * The name of the joint
     */
    name: string;
    /**
     * The inverse bind pose matrix, as raw data, used to transform vertices to bind joint space in preparation for transformation using the joint matrix.
     */
    inverseBindPose: Float32Array;
    /**
     * Creates a new <code>SkeletonJoint</code> object
     */
    constructor();
}
