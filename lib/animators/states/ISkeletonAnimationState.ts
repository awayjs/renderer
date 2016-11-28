import {Skeleton} from "../data/Skeleton";
import {SkeletonPose} from "../data/SkeletonPose";

import {IAnimationState} from "./IAnimationState";

export interface ISkeletonAnimationState extends IAnimationState
{
	/**
	 * Returns the output skeleton pose of the animation node.
	 */
	getSkeletonPose(skeleton:Skeleton):SkeletonPose;
}