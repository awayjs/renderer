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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvZGF0YS9Ta2VsZXRvblBvc2UudHMiXSwibmFtZXMiOlsiU2tlbGV0b25Qb3NlIiwiU2tlbGV0b25Qb3NlLmNvbnN0cnVjdG9yIiwiU2tlbGV0b25Qb3NlLm51bUpvaW50UG9zZXMiLCJTa2VsZXRvblBvc2UuYXNzZXRUeXBlIiwiU2tlbGV0b25Qb3NlLmpvaW50UG9zZUZyb21OYW1lIiwiU2tlbGV0b25Qb3NlLmpvaW50UG9zZUluZGV4RnJvbU5hbWUiLCJTa2VsZXRvblBvc2UuY2xvbmUiLCJTa2VsZXRvblBvc2UuZGlzcG9zZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsSUFBTyxTQUFTLFdBQWdCLG1DQUFtQyxDQUFDLENBQUM7QUFFckUsSUFBTyxjQUFjLFdBQWUsd0NBQXdDLENBQUMsQ0FBQztBQUU5RSxJQUFPLFNBQVMsV0FBZ0IsZ0RBQWdELENBQUMsQ0FBQztBQUdsRixBQVNBOzs7Ozs7OztHQURHO0lBQ0csWUFBWTtJQUFTQSxVQUFyQkEsWUFBWUEsVUFBdUJBO0lBaUJ4Q0E7O09BRUdBO0lBQ0hBLFNBcEJLQSxZQUFZQTtRQXNCaEJDLGlCQUFPQSxDQUFDQTtRQUVSQSxJQUFJQSxDQUFDQSxVQUFVQSxHQUFHQSxJQUFJQSxLQUFLQSxFQUFhQSxDQUFDQTtJQUMxQ0EsQ0FBQ0E7SUFiREQsc0JBQVdBLHVDQUFhQTtRQUh4QkE7O1dBRUdBO2FBQ0hBO1lBRUNFLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLE1BQU1BLENBQUNBO1FBQy9CQSxDQUFDQTs7O09BQUFGO0lBZURBLHNCQUFXQSxtQ0FBU0E7UUFIcEJBOztXQUVHQTthQUNIQTtZQUVDRyxNQUFNQSxDQUFDQSxTQUFTQSxDQUFDQSxhQUFhQSxDQUFDQTtRQUNoQ0EsQ0FBQ0E7OztPQUFBSDtJQUVEQTs7Ozs7T0FLR0E7SUFDSUEsd0NBQWlCQSxHQUF4QkEsVUFBeUJBLFNBQWdCQTtRQUV4Q0ksSUFBSUEsY0FBY0EsR0FBa0JBLElBQUlBLENBQUNBLHNCQUFzQkEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0E7UUFDM0VBLEVBQUVBLENBQUNBLENBQUNBLGNBQWNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBO1lBQ3hCQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxjQUFjQSxDQUFDQSxDQUFDQTtRQUFDQSxJQUFJQTtZQUM1Q0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7SUFDZEEsQ0FBQ0E7SUFFREo7Ozs7Ozs7T0FPR0E7SUFDSUEsNkNBQXNCQSxHQUE3QkEsVUFBOEJBLFNBQWdCQTtRQUU3Q0ssQUFNQUEsaUVBTmlFQTtRQUNqRUEsZ0VBQWdFQTtRQUNoRUEsOERBQThEQTtRQUM5REEscUZBQXFGQTtRQUNyRkEsNEZBQTRGQTtRQUM1RkEsa0VBQWtFQTtZQUM5REEsY0FBY0EsQ0FBUUEsT0FBREEsQUFBUUEsQ0FBQ0E7UUFDbENBLElBQUlBLFNBQW1CQSxDQUFDQTtRQUN4QkEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBUUEsUUFBREEsQUFBU0EsRUFBRUEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0E7WUFDN0RBLFNBQVNBLEdBQUdBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQy9CQSxFQUFFQSxDQUFDQSxDQUFDQSxTQUFTQSxDQUFDQSxJQUFJQSxJQUFJQSxTQUFTQSxDQUFDQTtnQkFDL0JBLE1BQU1BLENBQUNBLGNBQWNBLENBQUNBO1lBQ3ZCQSxjQUFjQSxFQUFFQSxDQUFDQTtRQUNsQkEsQ0FBQ0E7UUFFREEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7SUFDWEEsQ0FBQ0E7SUFFREw7Ozs7T0FJR0E7SUFDSUEsNEJBQUtBLEdBQVpBO1FBRUNNLElBQUlBLEtBQUtBLEdBQWdCQSxJQUFJQSxZQUFZQSxFQUFFQSxDQUFDQTtRQUM1Q0EsSUFBSUEsYUFBYUEsR0FBbUJBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLE1BQU1BLENBQUNBO1FBQzNEQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFtQkEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsYUFBYUEsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0E7WUFDeERBLElBQUlBLGNBQWNBLEdBQWFBLElBQUlBLFNBQVNBLEVBQUVBLENBQUNBO1lBQy9DQSxJQUFJQSxhQUFhQSxHQUFhQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNqREEsY0FBY0EsQ0FBQ0EsSUFBSUEsR0FBR0EsYUFBYUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7WUFDekNBLGNBQWNBLENBQUNBLFFBQVFBLENBQUNBLGFBQWFBLENBQUNBLENBQUNBO1lBQ3ZDQSxLQUFLQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxjQUFjQSxDQUFDQTtRQUN0Q0EsQ0FBQ0E7UUFDREEsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7SUFDZEEsQ0FBQ0E7SUFFRE47O09BRUdBO0lBQ0lBLDhCQUFPQSxHQUFkQTtRQUVDTyxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxNQUFNQSxHQUFHQSxDQUFDQSxDQUFDQTtJQUM1QkEsQ0FBQ0E7SUFDRlAsbUJBQUNBO0FBQURBLENBdkdBLEFBdUdDQSxFQXZHMEIsY0FBYyxFQXVHeEM7QUFFRCxBQUFzQixpQkFBYixZQUFZLENBQUMiLCJmaWxlIjoiYW5pbWF0b3JzL2RhdGEvU2tlbGV0b25Qb3NlLmpzIiwic291cmNlUm9vdCI6Ii4uLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBc3NldFR5cGVcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvbGlicmFyeS9Bc3NldFR5cGVcIik7XG5pbXBvcnQgSUFzc2V0XHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvbGlicmFyeS9JQXNzZXRcIik7XG5pbXBvcnQgTmFtZWRBc3NldEJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2xpYnJhcnkvTmFtZWRBc3NldEJhc2VcIik7XG5cbmltcG9ydCBKb2ludFBvc2VcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL2RhdGEvSm9pbnRQb3NlXCIpO1xuXG5cbi8qKlxuICogQSBjb2xsZWN0aW9uIG9mIHBvc2Ugb2JqZWN0cywgZGV0ZXJtaW5pbmcgdGhlIHBvc2UgZm9yIGFuIGVudGlyZSBza2VsZXRvbi5cbiAqIFRoZSA8Y29kZT5qb2ludFBvc2VzPC9jb2RlPiB2ZWN0b3Igb2JqZWN0IGNvcnJlc3BvbmRzIHRvIGEgc2tlbGV0b24ncyA8Y29kZT5qb2ludHM8L2NvZGU+IHZlY3RvciBvYmplY3QsIGhvd2V2ZXIsIHRoZXJlIGlzIG5vXG4gKiByZWZlcmVuY2UgdG8gYSBza2VsZXRvbidzIGluc3RhbmNlLCBzaW5jZSBzZXZlcmFsIHNrZWxldG9ucyBjYW4gYmUgaW5mbHVlbmNlZCBieSB0aGUgc2FtZSBwb3NlIChlZzogYW5pbWF0aW9uXG4gKiBjbGlwcyBhcmUgYWRkZWQgdG8gYW55IGFuaW1hdG9yIHdpdGggYSB2YWxpZCBza2VsZXRvbilcbiAqXG4gKiBAc2VlIGF3YXkuYW5pbWF0b3JzLlNrZWxldG9uXG4gKiBAc2VlIGF3YXkuYW5pbWF0b3JzLkpvaW50UG9zZVxuICovXG5jbGFzcyBTa2VsZXRvblBvc2UgZXh0ZW5kcyBOYW1lZEFzc2V0QmFzZSBpbXBsZW1lbnRzIElBc3NldFxue1xuXHQvKipcblx0ICogQSBmbGF0IGxpc3Qgb2YgcG9zZSBvYmplY3RzIHRoYXQgY29tcHJpc2UgdGhlIHNrZWxldG9uIHBvc2UuIFRoZSBwb3NlIGluZGljZXMgY29ycmVzcG9uZCB0byB0aGUgdGFyZ2V0IHNrZWxldG9uJ3Mgam9pbnQgaW5kaWNlcy5cblx0ICpcblx0ICogQHNlZSBhd2F5LmFuaW1hdG9ycy5Ta2VsZXRvbiNqb2ludHNcblx0ICovXG5cdHB1YmxpYyBqb2ludFBvc2VzOkFycmF5PEpvaW50UG9zZT47XG5cblx0LyoqXG5cdCAqIFRoZSB0b3RhbCBudW1iZXIgb2Ygam9pbnQgcG9zZXMgaW4gdGhlIHNrZWxldG9uIHBvc2UuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IG51bUpvaW50UG9zZXMoKTpudW1iZXIgLyp1aW50Ki9cblx0e1xuXHRcdHJldHVybiB0aGlzLmpvaW50UG9zZXMubGVuZ3RoO1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBuZXcgPGNvZGU+U2tlbGV0b25Qb3NlPC9jb2RlPiBvYmplY3QuXG5cdCAqL1xuXHRjb25zdHJ1Y3RvcigpXG5cdHtcblx0XHRzdXBlcigpO1xuXG5cdFx0dGhpcy5qb2ludFBvc2VzID0gbmV3IEFycmF5PEpvaW50UG9zZT4oKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGdldCBhc3NldFR5cGUoKTpzdHJpbmdcblx0e1xuXHRcdHJldHVybiBBc3NldFR5cGUuU0tFTEVUT05fUE9TRTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSBqb2ludCBwb3NlIG9iamVjdCB3aXRoIHRoZSBnaXZlbiBqb2ludCBuYW1lLCBvdGhlcndpc2UgcmV0dXJucyBhIG51bGwgb2JqZWN0LlxuXHQgKlxuXHQgKiBAcGFyYW0gam9pbnROYW1lIFRoZSBuYW1lIG9mIHRoZSBqb2ludCBvYmplY3Qgd2hvc2UgcG9zZSBpcyB0byBiZSBmb3VuZC5cblx0ICogQHJldHVybiBUaGUgcG9zZSBvYmplY3Qgd2l0aCB0aGUgZ2l2ZW4gam9pbnQgbmFtZS5cblx0ICovXG5cdHB1YmxpYyBqb2ludFBvc2VGcm9tTmFtZShqb2ludE5hbWU6c3RyaW5nKTpKb2ludFBvc2Vcblx0e1xuXHRcdHZhciBqb2ludFBvc2VJbmRleDpudW1iZXIgLyppbnQqLyA9IHRoaXMuam9pbnRQb3NlSW5kZXhGcm9tTmFtZShqb2ludE5hbWUpO1xuXHRcdGlmIChqb2ludFBvc2VJbmRleCAhPSAtMSlcblx0XHRcdHJldHVybiB0aGlzLmpvaW50UG9zZXNbam9pbnRQb3NlSW5kZXhdOyBlbHNlXG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSBwb3NlIGluZGV4LCBnaXZlbiB0aGUgam9pbnQgbmFtZS4gLTEgaXMgcmV0dXJuZWQgaWYgdGhlIGpvaW50IG5hbWUgaXMgbm90IGZvdW5kIGluIHRoZSBwb3NlLlxuXHQgKlxuXHQgKiBAcGFyYW0gVGhlIG5hbWUgb2YgdGhlIGpvaW50IG9iamVjdCB3aG9zZSBwb3NlIGlzIHRvIGJlIGZvdW5kLlxuXHQgKiBAcmV0dXJuIFRoZSBpbmRleCBvZiB0aGUgcG9zZSBvYmplY3QgaW4gdGhlIGpvaW50UG9zZXMgQXJyYXlcblx0ICpcblx0ICogQHNlZSAjam9pbnRQb3Nlc1xuXHQgKi9cblx0cHVibGljIGpvaW50UG9zZUluZGV4RnJvbU5hbWUoam9pbnROYW1lOnN0cmluZyk6bnVtYmVyIC8qaW50Ki9cblx0e1xuXHRcdC8vIHRoaXMgaXMgaW1wbGVtZW50ZWQgYXMgYSBsaW5lYXIgc2VhcmNoLCByYXRoZXIgdGhhbiBhIHBvc3NpYmx5XG5cdFx0Ly8gbW9yZSBvcHRpbWFsIG1ldGhvZCAoRGljdGlvbmFyeSBsb29rdXAsIGZvciBleGFtcGxlKSBiZWNhdXNlOlxuXHRcdC8vIGEpIGl0IGlzIGFzc3VtZWQgdGhhdCBpdCB3aWxsIGJlIGNhbGxlZCBvbmNlIGZvciBlYWNoIGpvaW50XG5cdFx0Ly8gYikgaXQgaXMgYXNzdW1lZCB0aGF0IGl0IHdpbGwgYmUgY2FsbGVkIG9ubHkgZHVyaW5nIGxvYWQsIGFuZCBub3QgZHVyaW5nIG1haW4gbG9vcFxuXHRcdC8vIGMpIG1haW50YWluaW5nIGEgZGljdGlvbmFyeSAoZm9yIHNhZmV0eSkgd291bGQgZGljdGF0ZSBhbiBpbnRlcmZhY2UgdG8gYWNjZXNzIEpvaW50UG9zZXMsXG5cdFx0Ly8gICAgcmF0aGVyIHRoYW4gZGlyZWN0IGFycmF5IGFjY2Vzcy4gIHRoaXMgd291bGQgYmUgc3ViLW9wdGltYWwuXG5cdFx0dmFyIGpvaW50UG9zZUluZGV4Om51bWJlciAvKmludCovO1xuXHRcdHZhciBqb2ludFBvc2U6Sm9pbnRQb3NlO1xuXHRcdGZvciAodmFyIGk6bnVtYmVyIC8qdWludCovOyBpIDwgdGhpcy5qb2ludFBvc2VzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRqb2ludFBvc2UgPSB0aGlzLmpvaW50UG9zZXNbaV07XG5cdFx0XHRpZiAoam9pbnRQb3NlLm5hbWUgPT0gam9pbnROYW1lKVxuXHRcdFx0XHRyZXR1cm4gam9pbnRQb3NlSW5kZXg7XG5cdFx0XHRqb2ludFBvc2VJbmRleCsrO1xuXHRcdH1cblxuXHRcdHJldHVybiAtMTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgY29weSBvZiB0aGUgPGNvZGU+U2tlbGV0b25Qb3NlPC9jb2RlPiBvYmplY3QsIHdpdGggYSBkdWxwaWNhdGUgb2YgaXRzIGNvbXBvbmVudCBqb2ludCBwb3Nlcy5cblx0ICpcblx0ICogQHJldHVybiBTa2VsZXRvblBvc2Vcblx0ICovXG5cdHB1YmxpYyBjbG9uZSgpOlNrZWxldG9uUG9zZVxuXHR7XG5cdFx0dmFyIGNsb25lOlNrZWxldG9uUG9zZSA9IG5ldyBTa2VsZXRvblBvc2UoKTtcblx0XHR2YXIgbnVtSm9pbnRQb3NlczpudW1iZXIgLyp1aW50Ki8gPSB0aGlzLmpvaW50UG9zZXMubGVuZ3RoO1xuXHRcdGZvciAodmFyIGk6bnVtYmVyIC8qdWludCovID0gMDsgaSA8IG51bUpvaW50UG9zZXM7IGkrKykge1xuXHRcdFx0dmFyIGNsb25lSm9pbnRQb3NlOkpvaW50UG9zZSA9IG5ldyBKb2ludFBvc2UoKTtcblx0XHRcdHZhciB0aGlzSm9pbnRQb3NlOkpvaW50UG9zZSA9IHRoaXMuam9pbnRQb3Nlc1tpXTtcblx0XHRcdGNsb25lSm9pbnRQb3NlLm5hbWUgPSB0aGlzSm9pbnRQb3NlLm5hbWU7XG5cdFx0XHRjbG9uZUpvaW50UG9zZS5jb3B5RnJvbSh0aGlzSm9pbnRQb3NlKTtcblx0XHRcdGNsb25lLmpvaW50UG9zZXNbaV0gPSBjbG9uZUpvaW50UG9zZTtcblx0XHR9XG5cdFx0cmV0dXJuIGNsb25lO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgZGlzcG9zZSgpXG5cdHtcblx0XHR0aGlzLmpvaW50UG9zZXMubGVuZ3RoID0gMDtcblx0fVxufVxuXG5leHBvcnQgPSBTa2VsZXRvblBvc2U7Il19