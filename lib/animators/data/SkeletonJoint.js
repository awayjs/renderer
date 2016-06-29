"use strict";
/**
 * A value obect representing a single joint in a skeleton object.
 *
 * @see away.animators.Skeleton
 */
var SkeletonJoint = (function () {
    /**
     * Creates a new <code>SkeletonJoint</code> object
     */
    function SkeletonJoint() {
        /**
         * The index of the parent joint in the skeleton's joints vector.
         *
         * @see away.animators.Skeleton#joints
         */
        this.parentIndex = -1;
    }
    return SkeletonJoint;
}());
exports.SkeletonJoint = SkeletonJoint;
