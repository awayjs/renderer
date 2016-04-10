import IAnimationState					from "../../animators/states/IAnimationState";

import Skeleton							from "../../animators/data/Skeleton";
import SkeletonPose						from "../../animators/data/SkeletonPose";

interface ISkeletonAnimationState extends IAnimationState
{
	/**
	 * Returns the output skeleton pose of the animation node.
	 */
	getSkeletonPose(skeleton:Skeleton):SkeletonPose;
}

export default ISkeletonAnimationState;