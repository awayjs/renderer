///<reference path="../../_definitions.ts"/>

module away.animators
{
	export interface ISkeletonAnimationState extends IAnimationState
	{
		/**
		 * Returns the output skeleton pose of the animation node.
		 */
		getSkeletonPose(skeleton:Skeleton):SkeletonPose;
	}
}
