var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var JointPose = require("awayjs-renderergl/lib/animators/data/JointPose");
var AssetType = require("awayjs-core/lib/core/library/AssetType");
var NamedAssetBase = require("awayjs-core/lib/core/library/NamedAssetBase");
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuaW1hdG9ycy9kYXRhL3NrZWxldG9ucG9zZS50cyJdLCJuYW1lcyI6WyJTa2VsZXRvblBvc2UiLCJTa2VsZXRvblBvc2UuY29uc3RydWN0b3IiLCJTa2VsZXRvblBvc2UubnVtSm9pbnRQb3NlcyIsIlNrZWxldG9uUG9zZS5hc3NldFR5cGUiLCJTa2VsZXRvblBvc2Uuam9pbnRQb3NlRnJvbU5hbWUiLCJTa2VsZXRvblBvc2Uuam9pbnRQb3NlSW5kZXhGcm9tTmFtZSIsIlNrZWxldG9uUG9zZS5jbG9uZSIsIlNrZWxldG9uUG9zZS5kaXNwb3NlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFPLFNBQVMsV0FBZ0IsZ0RBQWdELENBQUMsQ0FBQztBQUVsRixJQUFPLFNBQVMsV0FBZ0Isd0NBQXdDLENBQUMsQ0FBQztBQUUxRSxJQUFPLGNBQWMsV0FBZSw2Q0FBNkMsQ0FBQyxDQUFDO0FBRW5GLEFBU0E7Ozs7Ozs7O0dBREc7SUFDRyxZQUFZO0lBQVNBLFVBQXJCQSxZQUFZQSxVQUF1QkE7SUFpQnhDQTs7T0FFR0E7SUFDSEEsU0FwQktBLFlBQVlBO1FBc0JoQkMsaUJBQU9BLENBQUNBO1FBRVJBLElBQUlBLENBQUNBLFVBQVVBLEdBQUdBLElBQUlBLEtBQUtBLEVBQWFBLENBQUNBO0lBQzFDQSxDQUFDQTtJQWJERCxzQkFBV0EsdUNBQWFBO1FBSHhCQTs7V0FFR0E7YUFDSEE7WUFFQ0UsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsTUFBTUEsQ0FBQ0E7UUFDL0JBLENBQUNBOzs7T0FBQUY7SUFlREEsc0JBQVdBLG1DQUFTQTtRQUhwQkE7O1dBRUdBO2FBQ0hBO1lBRUNHLE1BQU1BLENBQUNBLFNBQVNBLENBQUNBLGFBQWFBLENBQUNBO1FBQ2hDQSxDQUFDQTs7O09BQUFIO0lBRURBOzs7OztPQUtHQTtJQUNJQSx3Q0FBaUJBLEdBQXhCQSxVQUF5QkEsU0FBZ0JBO1FBRXhDSSxJQUFJQSxjQUFjQSxHQUFrQkEsSUFBSUEsQ0FBQ0Esc0JBQXNCQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQTtRQUMzRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsY0FBY0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDeEJBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLGNBQWNBLENBQUNBLENBQUNBO1FBQUNBLElBQUlBO1lBQzVDQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQTtJQUNkQSxDQUFDQTtJQUVESjs7Ozs7OztPQU9HQTtJQUNJQSw2Q0FBc0JBLEdBQTdCQSxVQUE4QkEsU0FBZ0JBO1FBRTdDSyxBQU1BQSxpRUFOaUVBO1FBQ2pFQSxnRUFBZ0VBO1FBQ2hFQSw4REFBOERBO1FBQzlEQSxxRkFBcUZBO1FBQ3JGQSw0RkFBNEZBO1FBQzVGQSxrRUFBa0VBO1lBQzlEQSxjQUFjQSxDQUFRQSxPQUFEQSxBQUFRQSxDQUFDQTtRQUNsQ0EsSUFBSUEsU0FBbUJBLENBQUNBO1FBQ3hCQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFRQSxRQUFEQSxBQUFTQSxFQUFFQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQTtZQUM3REEsU0FBU0EsR0FBR0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDL0JBLEVBQUVBLENBQUNBLENBQUNBLFNBQVNBLENBQUNBLElBQUlBLElBQUlBLFNBQVNBLENBQUNBO2dCQUMvQkEsTUFBTUEsQ0FBQ0EsY0FBY0EsQ0FBQ0E7WUFDdkJBLGNBQWNBLEVBQUVBLENBQUNBO1FBQ2xCQSxDQUFDQTtRQUVEQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtJQUNYQSxDQUFDQTtJQUVETDs7OztPQUlHQTtJQUNJQSw0QkFBS0EsR0FBWkE7UUFFQ00sSUFBSUEsS0FBS0EsR0FBZ0JBLElBQUlBLFlBQVlBLEVBQUVBLENBQUNBO1FBQzVDQSxJQUFJQSxhQUFhQSxHQUFtQkEsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsTUFBTUEsQ0FBQ0E7UUFDM0RBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQW1CQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxhQUFhQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQTtZQUN4REEsSUFBSUEsY0FBY0EsR0FBYUEsSUFBSUEsU0FBU0EsRUFBRUEsQ0FBQ0E7WUFDL0NBLElBQUlBLGFBQWFBLEdBQWFBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ2pEQSxjQUFjQSxDQUFDQSxJQUFJQSxHQUFHQSxhQUFhQSxDQUFDQSxJQUFJQSxDQUFDQTtZQUN6Q0EsY0FBY0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsQ0FBQ0E7WUFDdkNBLEtBQUtBLENBQUNBLFVBQVVBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLGNBQWNBLENBQUNBO1FBQ3RDQSxDQUFDQTtRQUNEQSxNQUFNQSxDQUFDQSxLQUFLQSxDQUFDQTtJQUNkQSxDQUFDQTtJQUVETjs7T0FFR0E7SUFDSUEsOEJBQU9BLEdBQWRBO1FBRUNPLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLE1BQU1BLEdBQUdBLENBQUNBLENBQUNBO0lBQzVCQSxDQUFDQTtJQUNGUCxtQkFBQ0E7QUFBREEsQ0F2R0EsQUF1R0NBLEVBdkcwQixjQUFjLEVBdUd4QztBQUVELEFBQXNCLGlCQUFiLFlBQVksQ0FBQyIsImZpbGUiOiJhbmltYXRvcnMvZGF0YS9Ta2VsZXRvblBvc2UuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL3JvYmJhdGVtYW4vV2Vic3Rvcm1Qcm9qZWN0cy9hd2F5anMtcmVuZGVyZXJnbC8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgSm9pbnRQb3NlXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9kYXRhL0pvaW50UG9zZVwiKTtcblxuaW1wb3J0IEFzc2V0VHlwZVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9jb3JlL2xpYnJhcnkvQXNzZXRUeXBlXCIpO1xuaW1wb3J0IElBc3NldFx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2NvcmUvbGlicmFyeS9JQXNzZXRcIik7XG5pbXBvcnQgTmFtZWRBc3NldEJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2NvcmUvbGlicmFyeS9OYW1lZEFzc2V0QmFzZVwiKTtcblxuLyoqXG4gKiBBIGNvbGxlY3Rpb24gb2YgcG9zZSBvYmplY3RzLCBkZXRlcm1pbmluZyB0aGUgcG9zZSBmb3IgYW4gZW50aXJlIHNrZWxldG9uLlxuICogVGhlIDxjb2RlPmpvaW50UG9zZXM8L2NvZGU+IHZlY3RvciBvYmplY3QgY29ycmVzcG9uZHMgdG8gYSBza2VsZXRvbidzIDxjb2RlPmpvaW50czwvY29kZT4gdmVjdG9yIG9iamVjdCwgaG93ZXZlciwgdGhlcmUgaXMgbm9cbiAqIHJlZmVyZW5jZSB0byBhIHNrZWxldG9uJ3MgaW5zdGFuY2UsIHNpbmNlIHNldmVyYWwgc2tlbGV0b25zIGNhbiBiZSBpbmZsdWVuY2VkIGJ5IHRoZSBzYW1lIHBvc2UgKGVnOiBhbmltYXRpb25cbiAqIGNsaXBzIGFyZSBhZGRlZCB0byBhbnkgYW5pbWF0b3Igd2l0aCBhIHZhbGlkIHNrZWxldG9uKVxuICpcbiAqIEBzZWUgYXdheS5hbmltYXRvcnMuU2tlbGV0b25cbiAqIEBzZWUgYXdheS5hbmltYXRvcnMuSm9pbnRQb3NlXG4gKi9cbmNsYXNzIFNrZWxldG9uUG9zZSBleHRlbmRzIE5hbWVkQXNzZXRCYXNlIGltcGxlbWVudHMgSUFzc2V0XG57XG5cdC8qKlxuXHQgKiBBIGZsYXQgbGlzdCBvZiBwb3NlIG9iamVjdHMgdGhhdCBjb21wcmlzZSB0aGUgc2tlbGV0b24gcG9zZS4gVGhlIHBvc2UgaW5kaWNlcyBjb3JyZXNwb25kIHRvIHRoZSB0YXJnZXQgc2tlbGV0b24ncyBqb2ludCBpbmRpY2VzLlxuXHQgKlxuXHQgKiBAc2VlIGF3YXkuYW5pbWF0b3JzLlNrZWxldG9uI2pvaW50c1xuXHQgKi9cblx0cHVibGljIGpvaW50UG9zZXM6QXJyYXk8Sm9pbnRQb3NlPjtcblxuXHQvKipcblx0ICogVGhlIHRvdGFsIG51bWJlciBvZiBqb2ludCBwb3NlcyBpbiB0aGUgc2tlbGV0b24gcG9zZS5cblx0ICovXG5cdHB1YmxpYyBnZXQgbnVtSm9pbnRQb3NlcygpOm51bWJlciAvKnVpbnQqL1xuXHR7XG5cdFx0cmV0dXJuIHRoaXMuam9pbnRQb3Nlcy5sZW5ndGg7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyA8Y29kZT5Ta2VsZXRvblBvc2U8L2NvZGU+IG9iamVjdC5cblx0ICovXG5cdGNvbnN0cnVjdG9yKClcblx0e1xuXHRcdHN1cGVyKCk7XG5cblx0XHR0aGlzLmpvaW50UG9zZXMgPSBuZXcgQXJyYXk8Sm9pbnRQb3NlPigpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGFzc2V0VHlwZSgpOnN0cmluZ1xuXHR7XG5cdFx0cmV0dXJuIEFzc2V0VHlwZS5TS0VMRVRPTl9QT1NFO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIGpvaW50IHBvc2Ugb2JqZWN0IHdpdGggdGhlIGdpdmVuIGpvaW50IG5hbWUsIG90aGVyd2lzZSByZXR1cm5zIGEgbnVsbCBvYmplY3QuXG5cdCAqXG5cdCAqIEBwYXJhbSBqb2ludE5hbWUgVGhlIG5hbWUgb2YgdGhlIGpvaW50IG9iamVjdCB3aG9zZSBwb3NlIGlzIHRvIGJlIGZvdW5kLlxuXHQgKiBAcmV0dXJuIFRoZSBwb3NlIG9iamVjdCB3aXRoIHRoZSBnaXZlbiBqb2ludCBuYW1lLlxuXHQgKi9cblx0cHVibGljIGpvaW50UG9zZUZyb21OYW1lKGpvaW50TmFtZTpzdHJpbmcpOkpvaW50UG9zZVxuXHR7XG5cdFx0dmFyIGpvaW50UG9zZUluZGV4Om51bWJlciAvKmludCovID0gdGhpcy5qb2ludFBvc2VJbmRleEZyb21OYW1lKGpvaW50TmFtZSk7XG5cdFx0aWYgKGpvaW50UG9zZUluZGV4ICE9IC0xKVxuXHRcdFx0cmV0dXJuIHRoaXMuam9pbnRQb3Nlc1tqb2ludFBvc2VJbmRleF07IGVsc2Vcblx0XHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIHBvc2UgaW5kZXgsIGdpdmVuIHRoZSBqb2ludCBuYW1lLiAtMSBpcyByZXR1cm5lZCBpZiB0aGUgam9pbnQgbmFtZSBpcyBub3QgZm91bmQgaW4gdGhlIHBvc2UuXG5cdCAqXG5cdCAqIEBwYXJhbSBUaGUgbmFtZSBvZiB0aGUgam9pbnQgb2JqZWN0IHdob3NlIHBvc2UgaXMgdG8gYmUgZm91bmQuXG5cdCAqIEByZXR1cm4gVGhlIGluZGV4IG9mIHRoZSBwb3NlIG9iamVjdCBpbiB0aGUgam9pbnRQb3NlcyBBcnJheVxuXHQgKlxuXHQgKiBAc2VlICNqb2ludFBvc2VzXG5cdCAqL1xuXHRwdWJsaWMgam9pbnRQb3NlSW5kZXhGcm9tTmFtZShqb2ludE5hbWU6c3RyaW5nKTpudW1iZXIgLyppbnQqL1xuXHR7XG5cdFx0Ly8gdGhpcyBpcyBpbXBsZW1lbnRlZCBhcyBhIGxpbmVhciBzZWFyY2gsIHJhdGhlciB0aGFuIGEgcG9zc2libHlcblx0XHQvLyBtb3JlIG9wdGltYWwgbWV0aG9kIChEaWN0aW9uYXJ5IGxvb2t1cCwgZm9yIGV4YW1wbGUpIGJlY2F1c2U6XG5cdFx0Ly8gYSkgaXQgaXMgYXNzdW1lZCB0aGF0IGl0IHdpbGwgYmUgY2FsbGVkIG9uY2UgZm9yIGVhY2ggam9pbnRcblx0XHQvLyBiKSBpdCBpcyBhc3N1bWVkIHRoYXQgaXQgd2lsbCBiZSBjYWxsZWQgb25seSBkdXJpbmcgbG9hZCwgYW5kIG5vdCBkdXJpbmcgbWFpbiBsb29wXG5cdFx0Ly8gYykgbWFpbnRhaW5pbmcgYSBkaWN0aW9uYXJ5IChmb3Igc2FmZXR5KSB3b3VsZCBkaWN0YXRlIGFuIGludGVyZmFjZSB0byBhY2Nlc3MgSm9pbnRQb3Nlcyxcblx0XHQvLyAgICByYXRoZXIgdGhhbiBkaXJlY3QgYXJyYXkgYWNjZXNzLiAgdGhpcyB3b3VsZCBiZSBzdWItb3B0aW1hbC5cblx0XHR2YXIgam9pbnRQb3NlSW5kZXg6bnVtYmVyIC8qaW50Ki87XG5cdFx0dmFyIGpvaW50UG9zZTpKb2ludFBvc2U7XG5cdFx0Zm9yICh2YXIgaTpudW1iZXIgLyp1aW50Ki87IGkgPCB0aGlzLmpvaW50UG9zZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGpvaW50UG9zZSA9IHRoaXMuam9pbnRQb3Nlc1tpXTtcblx0XHRcdGlmIChqb2ludFBvc2UubmFtZSA9PSBqb2ludE5hbWUpXG5cdFx0XHRcdHJldHVybiBqb2ludFBvc2VJbmRleDtcblx0XHRcdGpvaW50UG9zZUluZGV4Kys7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIC0xO1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBjb3B5IG9mIHRoZSA8Y29kZT5Ta2VsZXRvblBvc2U8L2NvZGU+IG9iamVjdCwgd2l0aCBhIGR1bHBpY2F0ZSBvZiBpdHMgY29tcG9uZW50IGpvaW50IHBvc2VzLlxuXHQgKlxuXHQgKiBAcmV0dXJuIFNrZWxldG9uUG9zZVxuXHQgKi9cblx0cHVibGljIGNsb25lKCk6U2tlbGV0b25Qb3NlXG5cdHtcblx0XHR2YXIgY2xvbmU6U2tlbGV0b25Qb3NlID0gbmV3IFNrZWxldG9uUG9zZSgpO1xuXHRcdHZhciBudW1Kb2ludFBvc2VzOm51bWJlciAvKnVpbnQqLyA9IHRoaXMuam9pbnRQb3Nlcy5sZW5ndGg7XG5cdFx0Zm9yICh2YXIgaTpudW1iZXIgLyp1aW50Ki8gPSAwOyBpIDwgbnVtSm9pbnRQb3NlczsgaSsrKSB7XG5cdFx0XHR2YXIgY2xvbmVKb2ludFBvc2U6Sm9pbnRQb3NlID0gbmV3IEpvaW50UG9zZSgpO1xuXHRcdFx0dmFyIHRoaXNKb2ludFBvc2U6Sm9pbnRQb3NlID0gdGhpcy5qb2ludFBvc2VzW2ldO1xuXHRcdFx0Y2xvbmVKb2ludFBvc2UubmFtZSA9IHRoaXNKb2ludFBvc2UubmFtZTtcblx0XHRcdGNsb25lSm9pbnRQb3NlLmNvcHlGcm9tKHRoaXNKb2ludFBvc2UpO1xuXHRcdFx0Y2xvbmUuam9pbnRQb3Nlc1tpXSA9IGNsb25lSm9pbnRQb3NlO1xuXHRcdH1cblx0XHRyZXR1cm4gY2xvbmU7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBkaXNwb3NlKClcblx0e1xuXHRcdHRoaXMuam9pbnRQb3Nlcy5sZW5ndGggPSAwO1xuXHR9XG59XG5cbmV4cG9ydCA9IFNrZWxldG9uUG9zZTsiXX0=