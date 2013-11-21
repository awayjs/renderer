///<reference path="../../_definitions.ts"/>

module away.animators
{
	import AssetType = away.library.AssetType;

	/**
	 * A Skeleton object is a hierarchical grouping of joint objects that can be used for skeletal animation.
	 *
	 * @see away.animators.SkeletonJoint
	 */
	export class Skeleton extends away.library.NamedAssetBase implements away.library.IAsset
	{
		/**
		 * A flat list of joint objects that comprise the skeleton. Every joint except for the root has a parentIndex
		 * property that is an index into this list.
		 * A child joint should always have a higher index than its parent.
		 */
		public joints:Array<SkeletonJoint>;

		/**
		 * The total number of joints in the skeleton.
		 */
		public get numJoints():number /*uint*/
		{
			return this.joints.length;
		}

		/**
		 * Creates a new <code>Skeleton</code> object
		 */
			constructor()
		{
			super();

			// in the long run, it might be a better idea to not store Joint objects, but keep all data in Vectors, that we can upload easily?
			this.joints = new Array<SkeletonJoint>();
		}

		/**
		 * Returns the joint object in the skeleton with the given name, otherwise returns a null object.
		 *
		 * @param jointName The name of the joint object to be found.
		 * @return The joint object with the given name.
		 *
		 * @see #joints
		 */
		public jointFromName(jointName:string):SkeletonJoint
		{
			var jointIndex:number /*int*/ = this.jointIndexFromName(jointName);
			if (jointIndex != -1)
				return this.joints[jointIndex]; else
				return null;
		}

		/**
		 * Returns the joint index, given the joint name. -1 is returned if the joint name is not found.
		 *
		 * @param jointName The name of the joint object to be found.
		 * @return The index of the joint object in the joints Array
		 *
		 * @see #joints
		 */
		public jointIndexFromName(jointName:string):number /*int*/
		{
			// this is implemented as a linear search, rather than a possibly
			// more optimal method (Dictionary lookup, for example) because:
			// a) it is assumed that it will be called once for each joint
			// b) it is assumed that it will be called only during load, and not during main loop
			// c) maintaining a dictionary (for safety) would dictate an interface to access SkeletonJoints,
			//    rather than direct array access.  this would be sub-optimal.
			var jointIndex:number /*int*/;
			var joint:SkeletonJoint;
			for (var i:number /*int*/; i < this.joints.length; i++) {
				joint = this.joints[i];
				if (joint.name == jointName)
					return jointIndex;
				jointIndex++;
			}

			return -1;
		}

		/**
		 * @inheritDoc
		 */
		public dispose()
		{
			this.joints.length = 0;
		}

		/**
		 * @inheritDoc
		 */
		public get assetType():string
		{
			return AssetType.SKELETON;
		}
	}
}
