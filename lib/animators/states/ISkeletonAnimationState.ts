import IAnimationState					= require("awayjs-stagegl/lib/animators/states/IAnimationState");

import Skeleton							= require("awayjs-renderergl/lib/animators/data/Skeleton");
import SkeletonPose						= require("awayjs-renderergl/lib/animators/data/SkeletonPose");

interface ISkeletonAnimationState extends IAnimationState
{
	/**
	 * Returns the output skeleton pose of the animation node.
	 */
	getSkeletonPose(skeleton:Skeleton):SkeletonPose;
}

export = ISkeletonAnimationState;