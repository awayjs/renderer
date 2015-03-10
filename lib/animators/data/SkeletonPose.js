var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AssetBase = require("awayjs-core/lib/library/AssetBase");
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
            return SkeletonPose.assetType;
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
    SkeletonPose.assetType = "[asset SkeletonPose]";
    return SkeletonPose;
})(AssetBase);
module.exports = SkeletonPose;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvZGF0YS9Ta2VsZXRvblBvc2UudHMiXSwibmFtZXMiOlsiU2tlbGV0b25Qb3NlIiwiU2tlbGV0b25Qb3NlLmNvbnN0cnVjdG9yIiwiU2tlbGV0b25Qb3NlLm51bUpvaW50UG9zZXMiLCJTa2VsZXRvblBvc2UuYXNzZXRUeXBlIiwiU2tlbGV0b25Qb3NlLmpvaW50UG9zZUZyb21OYW1lIiwiU2tlbGV0b25Qb3NlLmpvaW50UG9zZUluZGV4RnJvbU5hbWUiLCJTa2VsZXRvblBvc2UuY2xvbmUiLCJTa2VsZXRvblBvc2UuZGlzcG9zZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0EsSUFBTyxTQUFTLFdBQWdCLG1DQUFtQyxDQUFDLENBQUM7QUFFckUsSUFBTyxTQUFTLFdBQWdCLGdEQUFnRCxDQUFDLENBQUM7QUFHbEYsQUFTQTs7Ozs7Ozs7R0FERztJQUNHLFlBQVk7SUFBU0EsVUFBckJBLFlBQVlBLFVBQWtCQTtJQW1CbkNBOztPQUVHQTtJQUNIQSxTQXRCS0EsWUFBWUE7UUF3QmhCQyxpQkFBT0EsQ0FBQ0E7UUFFUkEsSUFBSUEsQ0FBQ0EsVUFBVUEsR0FBR0EsSUFBSUEsS0FBS0EsRUFBYUEsQ0FBQ0E7SUFDMUNBLENBQUNBO0lBYkRELHNCQUFXQSx1Q0FBYUE7UUFIeEJBOztXQUVHQTthQUNIQTtZQUVDRSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxNQUFNQSxDQUFDQTtRQUMvQkEsQ0FBQ0E7OztPQUFBRjtJQWVEQSxzQkFBV0EsbUNBQVNBO1FBSHBCQTs7V0FFR0E7YUFDSEE7WUFFQ0csTUFBTUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsU0FBU0EsQ0FBQ0E7UUFDL0JBLENBQUNBOzs7T0FBQUg7SUFFREE7Ozs7O09BS0dBO0lBQ0lBLHdDQUFpQkEsR0FBeEJBLFVBQXlCQSxTQUFnQkE7UUFFeENJLElBQUlBLGNBQWNBLEdBQWtCQSxJQUFJQSxDQUFDQSxzQkFBc0JBLENBQUNBLFNBQVNBLENBQUNBLENBQUNBO1FBQzNFQSxFQUFFQSxDQUFDQSxDQUFDQSxjQUFjQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUN4QkEsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsQ0FBQ0E7UUFBQ0EsSUFBSUE7WUFDNUNBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBO0lBQ2RBLENBQUNBO0lBRURKOzs7Ozs7O09BT0dBO0lBQ0lBLDZDQUFzQkEsR0FBN0JBLFVBQThCQSxTQUFnQkE7UUFFN0NLLEFBTUFBLGlFQU5pRUE7UUFDakVBLGdFQUFnRUE7UUFDaEVBLDhEQUE4REE7UUFDOURBLHFGQUFxRkE7UUFDckZBLDRGQUE0RkE7UUFDNUZBLGtFQUFrRUE7WUFDOURBLGNBQWNBLENBQVFBLE9BQURBLEFBQVFBLENBQUNBO1FBQ2xDQSxJQUFJQSxTQUFtQkEsQ0FBQ0E7UUFDeEJBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQVFBLFFBQURBLEFBQVNBLEVBQUVBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBO1lBQzdEQSxTQUFTQSxHQUFHQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUMvQkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsSUFBSUEsSUFBSUEsU0FBU0EsQ0FBQ0E7Z0JBQy9CQSxNQUFNQSxDQUFDQSxjQUFjQSxDQUFDQTtZQUN2QkEsY0FBY0EsRUFBRUEsQ0FBQ0E7UUFDbEJBLENBQUNBO1FBRURBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBO0lBQ1hBLENBQUNBO0lBRURMOzs7O09BSUdBO0lBQ0lBLDRCQUFLQSxHQUFaQTtRQUVDTSxJQUFJQSxLQUFLQSxHQUFnQkEsSUFBSUEsWUFBWUEsRUFBRUEsQ0FBQ0E7UUFDNUNBLElBQUlBLGFBQWFBLEdBQW1CQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxNQUFNQSxDQUFDQTtRQUMzREEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBbUJBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLGFBQWFBLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBO1lBQ3hEQSxJQUFJQSxjQUFjQSxHQUFhQSxJQUFJQSxTQUFTQSxFQUFFQSxDQUFDQTtZQUMvQ0EsSUFBSUEsYUFBYUEsR0FBYUEsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDakRBLGNBQWNBLENBQUNBLElBQUlBLEdBQUdBLGFBQWFBLENBQUNBLElBQUlBLENBQUNBO1lBQ3pDQSxjQUFjQSxDQUFDQSxRQUFRQSxDQUFDQSxhQUFhQSxDQUFDQSxDQUFDQTtZQUN2Q0EsS0FBS0EsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsY0FBY0EsQ0FBQ0E7UUFDdENBLENBQUNBO1FBQ0RBLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBO0lBQ2RBLENBQUNBO0lBRUROOztPQUVHQTtJQUNJQSw4QkFBT0EsR0FBZEE7UUFFQ08sSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsTUFBTUEsR0FBR0EsQ0FBQ0EsQ0FBQ0E7SUFDNUJBLENBQUNBO0lBdEdhUCxzQkFBU0EsR0FBVUEsc0JBQXNCQSxDQUFDQTtJQXVHekRBLG1CQUFDQTtBQUFEQSxDQXpHQSxBQXlHQ0EsRUF6RzBCLFNBQVMsRUF5R25DO0FBRUQsQUFBc0IsaUJBQWIsWUFBWSxDQUFDIiwiZmlsZSI6ImFuaW1hdG9ycy9kYXRhL1NrZWxldG9uUG9zZS5qcyIsInNvdXJjZVJvb3QiOiIuLi8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgSUFzc2V0XHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvbGlicmFyeS9JQXNzZXRcIik7XG5pbXBvcnQgQXNzZXRCYXNlXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2xpYnJhcnkvQXNzZXRCYXNlXCIpO1xuXG5pbXBvcnQgSm9pbnRQb3NlXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9kYXRhL0pvaW50UG9zZVwiKTtcblxuXG4vKipcbiAqIEEgY29sbGVjdGlvbiBvZiBwb3NlIG9iamVjdHMsIGRldGVybWluaW5nIHRoZSBwb3NlIGZvciBhbiBlbnRpcmUgc2tlbGV0b24uXG4gKiBUaGUgPGNvZGU+am9pbnRQb3NlczwvY29kZT4gdmVjdG9yIG9iamVjdCBjb3JyZXNwb25kcyB0byBhIHNrZWxldG9uJ3MgPGNvZGU+am9pbnRzPC9jb2RlPiB2ZWN0b3Igb2JqZWN0LCBob3dldmVyLCB0aGVyZSBpcyBub1xuICogcmVmZXJlbmNlIHRvIGEgc2tlbGV0b24ncyBpbnN0YW5jZSwgc2luY2Ugc2V2ZXJhbCBza2VsZXRvbnMgY2FuIGJlIGluZmx1ZW5jZWQgYnkgdGhlIHNhbWUgcG9zZSAoZWc6IGFuaW1hdGlvblxuICogY2xpcHMgYXJlIGFkZGVkIHRvIGFueSBhbmltYXRvciB3aXRoIGEgdmFsaWQgc2tlbGV0b24pXG4gKlxuICogQHNlZSBhd2F5LmFuaW1hdG9ycy5Ta2VsZXRvblxuICogQHNlZSBhd2F5LmFuaW1hdG9ycy5Kb2ludFBvc2VcbiAqL1xuY2xhc3MgU2tlbGV0b25Qb3NlIGV4dGVuZHMgQXNzZXRCYXNlIGltcGxlbWVudHMgSUFzc2V0XG57XG5cdHB1YmxpYyBzdGF0aWMgYXNzZXRUeXBlOnN0cmluZyA9IFwiW2Fzc2V0IFNrZWxldG9uUG9zZV1cIjtcblxuXHQvKipcblx0ICogQSBmbGF0IGxpc3Qgb2YgcG9zZSBvYmplY3RzIHRoYXQgY29tcHJpc2UgdGhlIHNrZWxldG9uIHBvc2UuIFRoZSBwb3NlIGluZGljZXMgY29ycmVzcG9uZCB0byB0aGUgdGFyZ2V0IHNrZWxldG9uJ3Mgam9pbnQgaW5kaWNlcy5cblx0ICpcblx0ICogQHNlZSBhd2F5LmFuaW1hdG9ycy5Ta2VsZXRvbiNqb2ludHNcblx0ICovXG5cdHB1YmxpYyBqb2ludFBvc2VzOkFycmF5PEpvaW50UG9zZT47XG5cblx0LyoqXG5cdCAqIFRoZSB0b3RhbCBudW1iZXIgb2Ygam9pbnQgcG9zZXMgaW4gdGhlIHNrZWxldG9uIHBvc2UuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IG51bUpvaW50UG9zZXMoKTpudW1iZXIgLyp1aW50Ki9cblx0e1xuXHRcdHJldHVybiB0aGlzLmpvaW50UG9zZXMubGVuZ3RoO1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBuZXcgPGNvZGU+U2tlbGV0b25Qb3NlPC9jb2RlPiBvYmplY3QuXG5cdCAqL1xuXHRjb25zdHJ1Y3RvcigpXG5cdHtcblx0XHRzdXBlcigpO1xuXG5cdFx0dGhpcy5qb2ludFBvc2VzID0gbmV3IEFycmF5PEpvaW50UG9zZT4oKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGdldCBhc3NldFR5cGUoKTpzdHJpbmdcblx0e1xuXHRcdHJldHVybiBTa2VsZXRvblBvc2UuYXNzZXRUeXBlO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIGpvaW50IHBvc2Ugb2JqZWN0IHdpdGggdGhlIGdpdmVuIGpvaW50IG5hbWUsIG90aGVyd2lzZSByZXR1cm5zIGEgbnVsbCBvYmplY3QuXG5cdCAqXG5cdCAqIEBwYXJhbSBqb2ludE5hbWUgVGhlIG5hbWUgb2YgdGhlIGpvaW50IG9iamVjdCB3aG9zZSBwb3NlIGlzIHRvIGJlIGZvdW5kLlxuXHQgKiBAcmV0dXJuIFRoZSBwb3NlIG9iamVjdCB3aXRoIHRoZSBnaXZlbiBqb2ludCBuYW1lLlxuXHQgKi9cblx0cHVibGljIGpvaW50UG9zZUZyb21OYW1lKGpvaW50TmFtZTpzdHJpbmcpOkpvaW50UG9zZVxuXHR7XG5cdFx0dmFyIGpvaW50UG9zZUluZGV4Om51bWJlciAvKmludCovID0gdGhpcy5qb2ludFBvc2VJbmRleEZyb21OYW1lKGpvaW50TmFtZSk7XG5cdFx0aWYgKGpvaW50UG9zZUluZGV4ICE9IC0xKVxuXHRcdFx0cmV0dXJuIHRoaXMuam9pbnRQb3Nlc1tqb2ludFBvc2VJbmRleF07IGVsc2Vcblx0XHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIHBvc2UgaW5kZXgsIGdpdmVuIHRoZSBqb2ludCBuYW1lLiAtMSBpcyByZXR1cm5lZCBpZiB0aGUgam9pbnQgbmFtZSBpcyBub3QgZm91bmQgaW4gdGhlIHBvc2UuXG5cdCAqXG5cdCAqIEBwYXJhbSBUaGUgbmFtZSBvZiB0aGUgam9pbnQgb2JqZWN0IHdob3NlIHBvc2UgaXMgdG8gYmUgZm91bmQuXG5cdCAqIEByZXR1cm4gVGhlIGluZGV4IG9mIHRoZSBwb3NlIG9iamVjdCBpbiB0aGUgam9pbnRQb3NlcyBBcnJheVxuXHQgKlxuXHQgKiBAc2VlICNqb2ludFBvc2VzXG5cdCAqL1xuXHRwdWJsaWMgam9pbnRQb3NlSW5kZXhGcm9tTmFtZShqb2ludE5hbWU6c3RyaW5nKTpudW1iZXIgLyppbnQqL1xuXHR7XG5cdFx0Ly8gdGhpcyBpcyBpbXBsZW1lbnRlZCBhcyBhIGxpbmVhciBzZWFyY2gsIHJhdGhlciB0aGFuIGEgcG9zc2libHlcblx0XHQvLyBtb3JlIG9wdGltYWwgbWV0aG9kIChEaWN0aW9uYXJ5IGxvb2t1cCwgZm9yIGV4YW1wbGUpIGJlY2F1c2U6XG5cdFx0Ly8gYSkgaXQgaXMgYXNzdW1lZCB0aGF0IGl0IHdpbGwgYmUgY2FsbGVkIG9uY2UgZm9yIGVhY2ggam9pbnRcblx0XHQvLyBiKSBpdCBpcyBhc3N1bWVkIHRoYXQgaXQgd2lsbCBiZSBjYWxsZWQgb25seSBkdXJpbmcgbG9hZCwgYW5kIG5vdCBkdXJpbmcgbWFpbiBsb29wXG5cdFx0Ly8gYykgbWFpbnRhaW5pbmcgYSBkaWN0aW9uYXJ5IChmb3Igc2FmZXR5KSB3b3VsZCBkaWN0YXRlIGFuIGludGVyZmFjZSB0byBhY2Nlc3MgSm9pbnRQb3Nlcyxcblx0XHQvLyAgICByYXRoZXIgdGhhbiBkaXJlY3QgYXJyYXkgYWNjZXNzLiAgdGhpcyB3b3VsZCBiZSBzdWItb3B0aW1hbC5cblx0XHR2YXIgam9pbnRQb3NlSW5kZXg6bnVtYmVyIC8qaW50Ki87XG5cdFx0dmFyIGpvaW50UG9zZTpKb2ludFBvc2U7XG5cdFx0Zm9yICh2YXIgaTpudW1iZXIgLyp1aW50Ki87IGkgPCB0aGlzLmpvaW50UG9zZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGpvaW50UG9zZSA9IHRoaXMuam9pbnRQb3Nlc1tpXTtcblx0XHRcdGlmIChqb2ludFBvc2UubmFtZSA9PSBqb2ludE5hbWUpXG5cdFx0XHRcdHJldHVybiBqb2ludFBvc2VJbmRleDtcblx0XHRcdGpvaW50UG9zZUluZGV4Kys7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIC0xO1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBjb3B5IG9mIHRoZSA8Y29kZT5Ta2VsZXRvblBvc2U8L2NvZGU+IG9iamVjdCwgd2l0aCBhIGR1bHBpY2F0ZSBvZiBpdHMgY29tcG9uZW50IGpvaW50IHBvc2VzLlxuXHQgKlxuXHQgKiBAcmV0dXJuIFNrZWxldG9uUG9zZVxuXHQgKi9cblx0cHVibGljIGNsb25lKCk6U2tlbGV0b25Qb3NlXG5cdHtcblx0XHR2YXIgY2xvbmU6U2tlbGV0b25Qb3NlID0gbmV3IFNrZWxldG9uUG9zZSgpO1xuXHRcdHZhciBudW1Kb2ludFBvc2VzOm51bWJlciAvKnVpbnQqLyA9IHRoaXMuam9pbnRQb3Nlcy5sZW5ndGg7XG5cdFx0Zm9yICh2YXIgaTpudW1iZXIgLyp1aW50Ki8gPSAwOyBpIDwgbnVtSm9pbnRQb3NlczsgaSsrKSB7XG5cdFx0XHR2YXIgY2xvbmVKb2ludFBvc2U6Sm9pbnRQb3NlID0gbmV3IEpvaW50UG9zZSgpO1xuXHRcdFx0dmFyIHRoaXNKb2ludFBvc2U6Sm9pbnRQb3NlID0gdGhpcy5qb2ludFBvc2VzW2ldO1xuXHRcdFx0Y2xvbmVKb2ludFBvc2UubmFtZSA9IHRoaXNKb2ludFBvc2UubmFtZTtcblx0XHRcdGNsb25lSm9pbnRQb3NlLmNvcHlGcm9tKHRoaXNKb2ludFBvc2UpO1xuXHRcdFx0Y2xvbmUuam9pbnRQb3Nlc1tpXSA9IGNsb25lSm9pbnRQb3NlO1xuXHRcdH1cblx0XHRyZXR1cm4gY2xvbmU7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBkaXNwb3NlKClcblx0e1xuXHRcdHRoaXMuam9pbnRQb3Nlcy5sZW5ndGggPSAwO1xuXHR9XG59XG5cbmV4cG9ydCA9IFNrZWxldG9uUG9zZTsiXX0=