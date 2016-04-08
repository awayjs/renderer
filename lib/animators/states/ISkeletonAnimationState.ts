import IAnimationState					from "awayjs-renderergl/lib/animators/states/IAnimationState";

import Skeleton							from "awayjs-renderergl/lib/animators/data/Skeleton";
import SkeletonPose						from "awayjs-renderergl/lib/animators/data/SkeletonPose";

interface ISkeletonAnimationState extends IAnimationState
{
	/**
	 * Returns the output skeleton pose of the animation node.
	 */
	getSkeletonPose(skeleton:Skeleton):SkeletonPose;
}

export default ISkeletonAnimationState;