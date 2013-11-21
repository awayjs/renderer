///<reference path="../../_definitions.ts"/>

module away.animators
{

	/**
	 * A value obect representing a single joint in a skeleton object.
	 *
	 * @see away.animators.Skeleton
	 */
	export class SkeletonJoint
	{
		/**
		 * The index of the parent joint in the skeleton's joints vector.
		 *
		 * @see away.animators.Skeleton#joints
		 */
		public parentIndex:number /*int*/ = -1;

		/**
		 * The name of the joint
		 */
		public name:string; // intention is that this should be used only at load time, not in the main loop

		/**
		 * The inverse bind pose matrix, as raw data, used to transform vertices to bind joint space in preparation for transformation using the joint matrix.
		 */
		public inverseBindPose:Array<number>;

		/**
		 * Creates a new <code>SkeletonJoint</code> object
		 */
			constructor()
		{
		}
	}
}
