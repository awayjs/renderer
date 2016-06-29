import { IAsset } from "@awayjs/core/lib/library/IAsset";
import { AssetBase } from "@awayjs/core/lib/library/AssetBase";
import { JointPose } from "../../animators/data/JointPose";
/**
 * A collection of pose objects, determining the pose for an entire skeleton.
 * The <code>jointPoses</code> vector object corresponds to a skeleton's <code>joints</code> vector object, however, there is no
 * reference to a skeleton's instance, since several skeletons can be influenced by the same pose (eg: animation
 * clips are added to any animator with a valid skeleton)
 *
 * @see away.animators.Skeleton
 * @see away.animators.JointPose
 */
export declare class SkeletonPose extends AssetBase implements IAsset {
    static assetType: string;
    /**
     * A flat list of pose objects that comprise the skeleton pose. The pose indices correspond to the target skeleton's joint indices.
     *
     * @see away.animators.Skeleton#joints
     */
    jointPoses: Array<JointPose>;
    /**
     * The total number of joint poses in the skeleton pose.
     */
    readonly numJointPoses: number;
    /**
     * Creates a new <code>SkeletonPose</code> object.
     */
    constructor();
    /**
     * @inheritDoc
     */
    readonly assetType: string;
    /**
     * Returns the joint pose object with the given joint name, otherwise returns a null object.
     *
     * @param jointName The name of the joint object whose pose is to be found.
     * @return The pose object with the given joint name.
     */
    jointPoseFromName(jointName: string): JointPose;
    /**
     * Returns the pose index, given the joint name. -1 is returned if the joint name is not found in the pose.
     *
     * @param The name of the joint object whose pose is to be found.
     * @return The index of the pose object in the jointPoses Array
     *
     * @see #jointPoses
     */
    jointPoseIndexFromName(jointName: string): number;
    /**
     * Creates a copy of the <code>SkeletonPose</code> object, with a dulpicate of its component joint poses.
     *
     * @return SkeletonPose
     */
    clone(): SkeletonPose;
    /**
     * @inheritDoc
     */
    dispose(): void;
}
