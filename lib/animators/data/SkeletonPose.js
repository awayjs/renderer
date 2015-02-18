var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AssetType = require("awayjs-core/lib/library/AssetType");
var NamedAssetBase = require("awayjs-core/lib/library/NamedAssetBase");
var JointPose = require("awayjs-renderergl/lib/animators/data/JointPose");
/**
 * A collection of pose objects, determining the pose for an entire skeleton.
 * The <code>jointPoses</code> vector object corresponds to a skeleton's <code>joints</code> vector object, however, there is no
 * reference to a skeleton's instance, since several skeletons can be influenced by the same pose (eg: animation
 * clips are added to any animator with a valid skeleton)
 *
 * @see away.animators.Skeleton
 * @see away.animators.JointPose
 */
var SkeletonPose = (function (_super) {
    __extends(SkeletonPose, _super);
    /**
     * Creates a new <code>SkeletonPose</code> object.
     */
    function SkeletonPose() {
        _super.call(this);
        this.jointPoses = new Array();
    }
    Object.defineProperty(SkeletonPose.prototype, "numJointPoses", {
        /**
         * The total number of joint poses in the skeleton pose.
         */
        get: function () {
            return this.jointPoses.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SkeletonPose.prototype, "assetType", {
        /**
         * @inheritDoc
         */
        get: function () {
            return AssetType.SKELETON_POSE;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns the joint pose object with the given joint name, otherwise returns a null object.
     *
     * @param jointName The name of the joint object whose pose is to be found.
     * @return The pose object with the given joint name.
     */
    SkeletonPose.prototype.jointPoseFromName = function (jointName) {
        var jointPoseIndex = this.jointPoseIndexFromName(jointName);
        if (jointPoseIndex != -1)
            return this.jointPoses[jointPoseIndex];
        else
            return null;
    };
    /**
     * Returns the pose index, given the joint name. -1 is returned if the joint name is not found in the pose.
     *
     * @param The name of the joint object whose pose is to be found.
     * @return The index of the pose object in the jointPoses Array
     *
     * @see #jointPoses
     */
    SkeletonPose.prototype.jointPoseIndexFromName = function (jointName) {
        // this is implemented as a linear search, rather than a possibly
        // more optimal method (Dictionary lookup, for example) because:
        // a) it is assumed that it will be called once for each joint
        // b) it is assumed that it will be called only during load, and not during main loop
        // c) maintaining a dictionary (for safety) would dictate an interface to access JointPoses,
        //    rather than direct array access.  this would be sub-optimal.
        var jointPoseIndex /*int*/;
        var jointPose;
        for (var i /*uint*/; i < this.jointPoses.length; i++) {
            jointPose = this.jointPoses[i];
            if (jointPose.name == jointName)
                return jointPoseIndex;
            jointPoseIndex++;
        }
        return -1;
    };
    /**
     * Creates a copy of the <code>SkeletonPose</code> object, with a dulpicate of its component joint poses.
     *
     * @return SkeletonPose
     */
    SkeletonPose.prototype.clone = function () {
        var clone = new SkeletonPose();
        var numJointPoses = this.jointPoses.length;
        for (var i = 0; i < numJointPoses; i++) {
            var cloneJointPose = new JointPose();
            var thisJointPose = this.jointPoses[i];
            cloneJointPose.name = thisJointPose.name;
            cloneJointPose.copyFrom(thisJointPose);
            clone.jointPoses[i] = cloneJointPose;
        }
        return clone;
    };
    /**
     * @inheritDoc
     */
    SkeletonPose.prototype.dispose = function () {
        this.jointPoses.length = 0;
    };
    return SkeletonPose;
})(NamedAssetBase);
module.exports = SkeletonPose;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvZGF0YS9Ta2VsZXRvblBvc2UudHMiXSwibmFtZXMiOlsiU2tlbGV0b25Qb3NlIiwiU2tlbGV0b25Qb3NlLmNvbnN0cnVjdG9yIiwiU2tlbGV0b25Qb3NlLm51bUpvaW50UG9zZXMiLCJTa2VsZXRvblBvc2UuYXNzZXRUeXBlIiwiU2tlbGV0b25Qb3NlLmpvaW50UG9zZUZyb21OYW1lIiwiU2tlbGV0b25Qb3NlLmpvaW50UG9zZUluZGV4RnJvbU5hbWUiLCJTa2VsZXRvblBvc2UuY2xvbmUiLCJTa2VsZXRvblBvc2UuZGlzcG9zZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsSUFBTyxTQUFTLFdBQWdCLG1DQUFtQyxDQUFDLENBQUM7QUFFckUsSUFBTyxjQUFjLFdBQWUsd0NBQXdDLENBQUMsQ0FBQztBQUU5RSxJQUFPLFNBQVMsV0FBZ0IsZ0RBQWdELENBQUMsQ0FBQztBQUdsRixBQVNBOzs7Ozs7OztHQURHO0lBQ0csWUFBWTtJQUFTQSxVQUFyQkEsWUFBWUEsVUFBdUJBO0lBaUJ4Q0E7O09BRUdBO0lBQ0hBLFNBcEJLQSxZQUFZQTtRQXNCaEJDLGlCQUFPQSxDQUFDQTtRQUVSQSxJQUFJQSxDQUFDQSxVQUFVQSxHQUFHQSxJQUFJQSxLQUFLQSxFQUFhQSxDQUFDQTtJQUMxQ0EsQ0FBQ0E7SUFiREQsc0JBQVdBLHVDQUFhQTtRQUh4QkE7O1dBRUdBO2FBQ0hBO1lBRUNFLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLE1BQU1BLENBQUNBO1FBQy9CQSxDQUFDQTs7O09BQUFGO0lBZURBLHNCQUFXQSxtQ0FBU0E7UUFIcEJBOztXQUVHQTthQUNIQTtZQUVDRyxNQUFNQSxDQUFDQSxTQUFTQSxDQUFDQSxhQUFhQSxDQUFDQTtRQUNoQ0EsQ0FBQ0E7OztPQUFBSDtJQUVEQTs7Ozs7T0FLR0E7SUFDSUEsd0NBQWlCQSxHQUF4QkEsVUFBeUJBLFNBQWdCQTtRQUV4Q0ksSUFBSUEsY0FBY0EsR0FBa0JBLElBQUlBLENBQUNBLHNCQUFzQkEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0E7UUFDM0VBLEVBQUVBLENBQUNBLENBQUNBLGNBQWNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBO1lBQ3hCQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxjQUFjQSxDQUFDQSxDQUFDQTtRQUFDQSxJQUFJQTtZQUM1Q0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7SUFDZEEsQ0FBQ0E7SUFFREo7Ozs7Ozs7T0FPR0E7SUFDSUEsNkNBQXNCQSxHQUE3QkEsVUFBOEJBLFNBQWdCQTtRQUU3Q0ssQUFNQUEsaUVBTmlFQTtRQUNqRUEsZ0VBQWdFQTtRQUNoRUEsOERBQThEQTtRQUM5REEscUZBQXFGQTtRQUNyRkEsNEZBQTRGQTtRQUM1RkEsa0VBQWtFQTtZQUM5REEsY0FBY0EsQ0FBUUEsT0FBREEsQUFBUUEsQ0FBQ0E7UUFDbENBLElBQUlBLFNBQW1CQSxDQUFDQTtRQUN4QkEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBUUEsUUFBREEsQUFBU0EsRUFBRUEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0E7WUFDN0RBLFNBQVNBLEdBQUdBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQy9CQSxFQUFFQSxDQUFDQSxDQUFDQSxTQUFTQSxDQUFDQSxJQUFJQSxJQUFJQSxTQUFTQSxDQUFDQTtnQkFDL0JBLE1BQU1BLENBQUNBLGNBQWNBLENBQUNBO1lBQ3ZCQSxjQUFjQSxFQUFFQSxDQUFDQTtRQUNsQkEsQ0FBQ0E7UUFFREEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7SUFDWEEsQ0FBQ0E7SUFFREw7Ozs7T0FJR0E7SUFDSUEsNEJBQUtBLEdBQVpBO1FBRUNNLElBQUlBLEtBQUtBLEdBQWdCQSxJQUFJQSxZQUFZQSxFQUFFQSxDQUFDQTtRQUM1Q0EsSUFBSUEsYUFBYUEsR0FBbUJBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLE1BQU1BLENBQUNBO1FBQzNEQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFtQkEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsYUFBYUEsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0E7WUFDeERBLElBQUlBLGNBQWNBLEdBQWFBLElBQUlBLFNBQVNBLEVBQUVBLENBQUNBO1lBQy9DQSxJQUFJQSxhQUFhQSxHQUFhQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNqREEsY0FBY0EsQ0FBQ0EsSUFBSUEsR0FBR0EsYUFBYUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7WUFDekNBLGNBQWNBLENBQUNBLFFBQVFBLENBQUNBLGFBQWFBLENBQUNBLENBQUNBO1lBQ3ZDQSxLQUFLQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxjQUFjQSxDQUFDQTtRQUN0Q0EsQ0FBQ0E7UUFDREEsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7SUFDZEEsQ0FBQ0E7SUFFRE47O09BRUdBO0lBQ0lBLDhCQUFPQSxHQUFkQTtRQUVDTyxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxNQUFNQSxHQUFHQSxDQUFDQSxDQUFDQTtJQUM1QkEsQ0FBQ0E7SUFDRlAsbUJBQUNBO0FBQURBLENBdkdBLEFBdUdDQSxFQXZHMEIsY0FBYyxFQXVHeEM7QUFFRCxBQUFzQixpQkFBYixZQUFZLENBQUMiLCJmaWxlIjoiYW5pbWF0b3JzL2RhdGEvU2tlbGV0b25Qb3NlLmpzIiwic291cmNlUm9vdCI6Ii4uLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBc3NldFR5cGVcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvbGlicmFyeS9Bc3NldFR5cGVcIik7XHJcbmltcG9ydCBJQXNzZXRcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9saWJyYXJ5L0lBc3NldFwiKTtcclxuaW1wb3J0IE5hbWVkQXNzZXRCYXNlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9saWJyYXJ5L05hbWVkQXNzZXRCYXNlXCIpO1xyXG5cclxuaW1wb3J0IEpvaW50UG9zZVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvZGF0YS9Kb2ludFBvc2VcIik7XHJcblxyXG5cclxuLyoqXHJcbiAqIEEgY29sbGVjdGlvbiBvZiBwb3NlIG9iamVjdHMsIGRldGVybWluaW5nIHRoZSBwb3NlIGZvciBhbiBlbnRpcmUgc2tlbGV0b24uXHJcbiAqIFRoZSA8Y29kZT5qb2ludFBvc2VzPC9jb2RlPiB2ZWN0b3Igb2JqZWN0IGNvcnJlc3BvbmRzIHRvIGEgc2tlbGV0b24ncyA8Y29kZT5qb2ludHM8L2NvZGU+IHZlY3RvciBvYmplY3QsIGhvd2V2ZXIsIHRoZXJlIGlzIG5vXHJcbiAqIHJlZmVyZW5jZSB0byBhIHNrZWxldG9uJ3MgaW5zdGFuY2UsIHNpbmNlIHNldmVyYWwgc2tlbGV0b25zIGNhbiBiZSBpbmZsdWVuY2VkIGJ5IHRoZSBzYW1lIHBvc2UgKGVnOiBhbmltYXRpb25cclxuICogY2xpcHMgYXJlIGFkZGVkIHRvIGFueSBhbmltYXRvciB3aXRoIGEgdmFsaWQgc2tlbGV0b24pXHJcbiAqXHJcbiAqIEBzZWUgYXdheS5hbmltYXRvcnMuU2tlbGV0b25cclxuICogQHNlZSBhd2F5LmFuaW1hdG9ycy5Kb2ludFBvc2VcclxuICovXHJcbmNsYXNzIFNrZWxldG9uUG9zZSBleHRlbmRzIE5hbWVkQXNzZXRCYXNlIGltcGxlbWVudHMgSUFzc2V0XHJcbntcclxuXHQvKipcclxuXHQgKiBBIGZsYXQgbGlzdCBvZiBwb3NlIG9iamVjdHMgdGhhdCBjb21wcmlzZSB0aGUgc2tlbGV0b24gcG9zZS4gVGhlIHBvc2UgaW5kaWNlcyBjb3JyZXNwb25kIHRvIHRoZSB0YXJnZXQgc2tlbGV0b24ncyBqb2ludCBpbmRpY2VzLlxyXG5cdCAqXHJcblx0ICogQHNlZSBhd2F5LmFuaW1hdG9ycy5Ta2VsZXRvbiNqb2ludHNcclxuXHQgKi9cclxuXHRwdWJsaWMgam9pbnRQb3NlczpBcnJheTxKb2ludFBvc2U+O1xyXG5cclxuXHQvKipcclxuXHQgKiBUaGUgdG90YWwgbnVtYmVyIG9mIGpvaW50IHBvc2VzIGluIHRoZSBza2VsZXRvbiBwb3NlLlxyXG5cdCAqL1xyXG5cdHB1YmxpYyBnZXQgbnVtSm9pbnRQb3NlcygpOm51bWJlciAvKnVpbnQqL1xyXG5cdHtcclxuXHRcdHJldHVybiB0aGlzLmpvaW50UG9zZXMubGVuZ3RoO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQ3JlYXRlcyBhIG5ldyA8Y29kZT5Ta2VsZXRvblBvc2U8L2NvZGU+IG9iamVjdC5cclxuXHQgKi9cclxuXHRjb25zdHJ1Y3RvcigpXHJcblx0e1xyXG5cdFx0c3VwZXIoKTtcclxuXHJcblx0XHR0aGlzLmpvaW50UG9zZXMgPSBuZXcgQXJyYXk8Sm9pbnRQb3NlPigpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQGluaGVyaXREb2NcclxuXHQgKi9cclxuXHRwdWJsaWMgZ2V0IGFzc2V0VHlwZSgpOnN0cmluZ1xyXG5cdHtcclxuXHRcdHJldHVybiBBc3NldFR5cGUuU0tFTEVUT05fUE9TRTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFJldHVybnMgdGhlIGpvaW50IHBvc2Ugb2JqZWN0IHdpdGggdGhlIGdpdmVuIGpvaW50IG5hbWUsIG90aGVyd2lzZSByZXR1cm5zIGEgbnVsbCBvYmplY3QuXHJcblx0ICpcclxuXHQgKiBAcGFyYW0gam9pbnROYW1lIFRoZSBuYW1lIG9mIHRoZSBqb2ludCBvYmplY3Qgd2hvc2UgcG9zZSBpcyB0byBiZSBmb3VuZC5cclxuXHQgKiBAcmV0dXJuIFRoZSBwb3NlIG9iamVjdCB3aXRoIHRoZSBnaXZlbiBqb2ludCBuYW1lLlxyXG5cdCAqL1xyXG5cdHB1YmxpYyBqb2ludFBvc2VGcm9tTmFtZShqb2ludE5hbWU6c3RyaW5nKTpKb2ludFBvc2VcclxuXHR7XHJcblx0XHR2YXIgam9pbnRQb3NlSW5kZXg6bnVtYmVyIC8qaW50Ki8gPSB0aGlzLmpvaW50UG9zZUluZGV4RnJvbU5hbWUoam9pbnROYW1lKTtcclxuXHRcdGlmIChqb2ludFBvc2VJbmRleCAhPSAtMSlcclxuXHRcdFx0cmV0dXJuIHRoaXMuam9pbnRQb3Nlc1tqb2ludFBvc2VJbmRleF07IGVsc2VcclxuXHRcdFx0cmV0dXJuIG51bGw7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBSZXR1cm5zIHRoZSBwb3NlIGluZGV4LCBnaXZlbiB0aGUgam9pbnQgbmFtZS4gLTEgaXMgcmV0dXJuZWQgaWYgdGhlIGpvaW50IG5hbWUgaXMgbm90IGZvdW5kIGluIHRoZSBwb3NlLlxyXG5cdCAqXHJcblx0ICogQHBhcmFtIFRoZSBuYW1lIG9mIHRoZSBqb2ludCBvYmplY3Qgd2hvc2UgcG9zZSBpcyB0byBiZSBmb3VuZC5cclxuXHQgKiBAcmV0dXJuIFRoZSBpbmRleCBvZiB0aGUgcG9zZSBvYmplY3QgaW4gdGhlIGpvaW50UG9zZXMgQXJyYXlcclxuXHQgKlxyXG5cdCAqIEBzZWUgI2pvaW50UG9zZXNcclxuXHQgKi9cclxuXHRwdWJsaWMgam9pbnRQb3NlSW5kZXhGcm9tTmFtZShqb2ludE5hbWU6c3RyaW5nKTpudW1iZXIgLyppbnQqL1xyXG5cdHtcclxuXHRcdC8vIHRoaXMgaXMgaW1wbGVtZW50ZWQgYXMgYSBsaW5lYXIgc2VhcmNoLCByYXRoZXIgdGhhbiBhIHBvc3NpYmx5XHJcblx0XHQvLyBtb3JlIG9wdGltYWwgbWV0aG9kIChEaWN0aW9uYXJ5IGxvb2t1cCwgZm9yIGV4YW1wbGUpIGJlY2F1c2U6XHJcblx0XHQvLyBhKSBpdCBpcyBhc3N1bWVkIHRoYXQgaXQgd2lsbCBiZSBjYWxsZWQgb25jZSBmb3IgZWFjaCBqb2ludFxyXG5cdFx0Ly8gYikgaXQgaXMgYXNzdW1lZCB0aGF0IGl0IHdpbGwgYmUgY2FsbGVkIG9ubHkgZHVyaW5nIGxvYWQsIGFuZCBub3QgZHVyaW5nIG1haW4gbG9vcFxyXG5cdFx0Ly8gYykgbWFpbnRhaW5pbmcgYSBkaWN0aW9uYXJ5IChmb3Igc2FmZXR5KSB3b3VsZCBkaWN0YXRlIGFuIGludGVyZmFjZSB0byBhY2Nlc3MgSm9pbnRQb3NlcyxcclxuXHRcdC8vICAgIHJhdGhlciB0aGFuIGRpcmVjdCBhcnJheSBhY2Nlc3MuICB0aGlzIHdvdWxkIGJlIHN1Yi1vcHRpbWFsLlxyXG5cdFx0dmFyIGpvaW50UG9zZUluZGV4Om51bWJlciAvKmludCovO1xyXG5cdFx0dmFyIGpvaW50UG9zZTpKb2ludFBvc2U7XHJcblx0XHRmb3IgKHZhciBpOm51bWJlciAvKnVpbnQqLzsgaSA8IHRoaXMuam9pbnRQb3Nlcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRqb2ludFBvc2UgPSB0aGlzLmpvaW50UG9zZXNbaV07XHJcblx0XHRcdGlmIChqb2ludFBvc2UubmFtZSA9PSBqb2ludE5hbWUpXHJcblx0XHRcdFx0cmV0dXJuIGpvaW50UG9zZUluZGV4O1xyXG5cdFx0XHRqb2ludFBvc2VJbmRleCsrO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiAtMTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIENyZWF0ZXMgYSBjb3B5IG9mIHRoZSA8Y29kZT5Ta2VsZXRvblBvc2U8L2NvZGU+IG9iamVjdCwgd2l0aCBhIGR1bHBpY2F0ZSBvZiBpdHMgY29tcG9uZW50IGpvaW50IHBvc2VzLlxyXG5cdCAqXHJcblx0ICogQHJldHVybiBTa2VsZXRvblBvc2VcclxuXHQgKi9cclxuXHRwdWJsaWMgY2xvbmUoKTpTa2VsZXRvblBvc2VcclxuXHR7XHJcblx0XHR2YXIgY2xvbmU6U2tlbGV0b25Qb3NlID0gbmV3IFNrZWxldG9uUG9zZSgpO1xyXG5cdFx0dmFyIG51bUpvaW50UG9zZXM6bnVtYmVyIC8qdWludCovID0gdGhpcy5qb2ludFBvc2VzLmxlbmd0aDtcclxuXHRcdGZvciAodmFyIGk6bnVtYmVyIC8qdWludCovID0gMDsgaSA8IG51bUpvaW50UG9zZXM7IGkrKykge1xyXG5cdFx0XHR2YXIgY2xvbmVKb2ludFBvc2U6Sm9pbnRQb3NlID0gbmV3IEpvaW50UG9zZSgpO1xyXG5cdFx0XHR2YXIgdGhpc0pvaW50UG9zZTpKb2ludFBvc2UgPSB0aGlzLmpvaW50UG9zZXNbaV07XHJcblx0XHRcdGNsb25lSm9pbnRQb3NlLm5hbWUgPSB0aGlzSm9pbnRQb3NlLm5hbWU7XHJcblx0XHRcdGNsb25lSm9pbnRQb3NlLmNvcHlGcm9tKHRoaXNKb2ludFBvc2UpO1xyXG5cdFx0XHRjbG9uZS5qb2ludFBvc2VzW2ldID0gY2xvbmVKb2ludFBvc2U7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gY2xvbmU7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBAaW5oZXJpdERvY1xyXG5cdCAqL1xyXG5cdHB1YmxpYyBkaXNwb3NlKClcclxuXHR7XHJcblx0XHR0aGlzLmpvaW50UG9zZXMubGVuZ3RoID0gMDtcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCA9IFNrZWxldG9uUG9zZTsiXX0=