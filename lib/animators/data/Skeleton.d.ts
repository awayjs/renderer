import { SkeletonJoint } from "../../animators/data/SkeletonJoint";
import { IAsset } from "@awayjs/core/lib/library/IAsset";
import { AssetBase } from "@awayjs/core/lib/library/AssetBase";
/**
 * A Skeleton object is a hierarchical grouping of joint objects that can be used for skeletal animation.
 *
 * @see away.animators.SkeletonJoint
 */
export declare class Skeleton extends AssetBase implements IAsset {
    static assetType: string;
    /**
     * A flat list of joint objects that comprise the skeleton. Every joint except for the root has a parentIndex
     * property that is an index into this list.
     * A child joint should always have a higher index than its parent.
     */
    joints: Array<SkeletonJoint>;
    /**
     * The total number of joints in the skeleton.
     */
    readonly numJoints: number;
    /**
     * Creates a new <code>Skeleton</code> object
     */
    constructor();
    /**
     * Returns the joint object in the skeleton with the given name, otherwise returns a null object.
     *
     * @param jointName The name of the joint object to be found.
     * @return The joint object with the given name.
     *
     * @see #joints
     */
    jointFromName(jointName: string): SkeletonJoint;
    /**
     * Returns the joint index, given the joint name. -1 is returned if the joint name is not found.
     *
     * @param jointName The name of the joint object to be found.
     * @return The index of the joint object in the joints Array
     *
     * @see #joints
     */
    jointIndexFromName(jointName: string): number;
    /**
     * @inheritDoc
     */
    dispose(): void;
    /**
     * @inheritDoc
     */
    readonly assetType: string;
}
