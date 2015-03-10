var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AssetBase = require("awayjs-core/lib/library/AssetBase");
/**
 * A Skeleton object is a hierarchical grouping of joint objects that can be used for skeletal animation.
 *
 * @see away.animators.SkeletonJoint
 */
var Skeleton = (function (_super) {
    __extends(Skeleton, _super);
    /**
     * Creates a new <code>Skeleton</code> object
     */
    function Skeleton() {
        _super.call(this);
        // in the long run, it might be a better idea to not store Joint objects, but keep all data in Vectors, that we can upload easily?
        this.joints = new Array();
    }
    Object.defineProperty(Skeleton.prototype, "numJoints", {
        /**
         * The total number of joints in the skeleton.
         */
        get: function () {
            return this.joints.length;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns the joint object in the skeleton with the given name, otherwise returns a null object.
     *
     * @param jointName The name of the joint object to be found.
     * @return The joint object with the given name.
     *
     * @see #joints
     */
    Skeleton.prototype.jointFromName = function (jointName) {
        var jointIndex = this.jointIndexFromName(jointName);
        if (jointIndex != -1)
            return this.joints[jointIndex];
        else
            return null;
    };
    /**
     * Returns the joint index, given the joint name. -1 is returned if the joint name is not found.
     *
     * @param jointName The name of the joint object to be found.
     * @return The index of the joint object in the joints Array
     *
     * @see #joints
     */
    Skeleton.prototype.jointIndexFromName = function (jointName) {
        // this is implemented as a linear search, rather than a possibly
        // more optimal method (Dictionary lookup, for example) because:
        // a) it is assumed that it will be called once for each joint
        // b) it is assumed that it will be called only during load, and not during main loop
        // c) maintaining a dictionary (for safety) would dictate an interface to access SkeletonJoints,
        //    rather than direct array access.  this would be sub-optimal.
        var jointIndex /*int*/;
        var joint;
        for (var i /*int*/; i < this.joints.length; i++) {
            joint = this.joints[i];
            if (joint.name == jointName)
                return jointIndex;
            jointIndex++;
        }
        return -1;
    };
    /**
     * @inheritDoc
     */
    Skeleton.prototype.dispose = function () {
        this.joints.length = 0;
    };
    Object.defineProperty(Skeleton.prototype, "assetType", {
        /**
         * @inheritDoc
         */
        get: function () {
            return Skeleton.assetType;
        },
        enumerable: true,
        configurable: true
    });
    Skeleton.assetType = "[asset Skeleton]";
    return Skeleton;
})(AssetBase);
module.exports = Skeleton;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvZGF0YS9Ta2VsZXRvbi50cyJdLCJuYW1lcyI6WyJTa2VsZXRvbiIsIlNrZWxldG9uLmNvbnN0cnVjdG9yIiwiU2tlbGV0b24ubnVtSm9pbnRzIiwiU2tlbGV0b24uam9pbnRGcm9tTmFtZSIsIlNrZWxldG9uLmpvaW50SW5kZXhGcm9tTmFtZSIsIlNrZWxldG9uLmRpc3Bvc2UiLCJTa2VsZXRvbi5hc3NldFR5cGUiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUdBLElBQU8sU0FBUyxXQUFnQixtQ0FBbUMsQ0FBQyxDQUFDO0FBRXJFLEFBS0E7Ozs7R0FERztJQUNHLFFBQVE7SUFBU0EsVUFBakJBLFFBQVFBLFVBQWtCQTtJQW1CL0JBOztPQUVHQTtJQUNIQSxTQXRCS0EsUUFBUUE7UUF3QlpDLGlCQUFPQSxDQUFDQTtRQUVSQSxBQUNBQSxrSUFEa0lBO1FBQ2xJQSxJQUFJQSxDQUFDQSxNQUFNQSxHQUFHQSxJQUFJQSxLQUFLQSxFQUFpQkEsQ0FBQ0E7SUFDMUNBLENBQUNBO0lBZERELHNCQUFXQSwrQkFBU0E7UUFIcEJBOztXQUVHQTthQUNIQTtZQUVDRSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxNQUFNQSxDQUFDQTtRQUMzQkEsQ0FBQ0E7OztPQUFBRjtJQWFEQTs7Ozs7OztPQU9HQTtJQUNJQSxnQ0FBYUEsR0FBcEJBLFVBQXFCQSxTQUFnQkE7UUFFcENHLElBQUlBLFVBQVVBLEdBQWtCQSxJQUFJQSxDQUFDQSxrQkFBa0JBLENBQUNBLFNBQVNBLENBQUNBLENBQUNBO1FBQ25FQSxFQUFFQSxDQUFDQSxDQUFDQSxVQUFVQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNwQkEsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0E7UUFBQ0EsSUFBSUE7WUFDcENBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBO0lBQ2RBLENBQUNBO0lBRURIOzs7Ozs7O09BT0dBO0lBQ0lBLHFDQUFrQkEsR0FBekJBLFVBQTBCQSxTQUFnQkE7UUFFekNJLEFBTUFBLGlFQU5pRUE7UUFDakVBLGdFQUFnRUE7UUFDaEVBLDhEQUE4REE7UUFDOURBLHFGQUFxRkE7UUFDckZBLGdHQUFnR0E7UUFDaEdBLGtFQUFrRUE7WUFDOURBLFVBQVVBLENBQVFBLE9BQURBLEFBQVFBLENBQUNBO1FBQzlCQSxJQUFJQSxLQUFtQkEsQ0FBQ0E7UUFDeEJBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQVFBLE9BQURBLEFBQVFBLEVBQUVBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBO1lBQ3hEQSxLQUFLQSxHQUFHQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUN2QkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsSUFBSUEsSUFBSUEsU0FBU0EsQ0FBQ0E7Z0JBQzNCQSxNQUFNQSxDQUFDQSxVQUFVQSxDQUFDQTtZQUNuQkEsVUFBVUEsRUFBRUEsQ0FBQ0E7UUFDZEEsQ0FBQ0E7UUFFREEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7SUFDWEEsQ0FBQ0E7SUFFREo7O09BRUdBO0lBQ0lBLDBCQUFPQSxHQUFkQTtRQUVDSyxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxNQUFNQSxHQUFHQSxDQUFDQSxDQUFDQTtJQUN4QkEsQ0FBQ0E7SUFLREwsc0JBQVdBLCtCQUFTQTtRQUhwQkE7O1dBRUdBO2FBQ0hBO1lBRUNNLE1BQU1BLENBQUNBLFFBQVFBLENBQUNBLFNBQVNBLENBQUNBO1FBQzNCQSxDQUFDQTs7O09BQUFOO0lBdEZhQSxrQkFBU0EsR0FBVUEsa0JBQWtCQSxDQUFDQTtJQXVGckRBLGVBQUNBO0FBQURBLENBekZBLEFBeUZDQSxFQXpGc0IsU0FBUyxFQXlGL0I7QUFFRCxBQUFrQixpQkFBVCxRQUFRLENBQUMiLCJmaWxlIjoiYW5pbWF0b3JzL2RhdGEvU2tlbGV0b24uanMiLCJzb3VyY2VSb290IjoiLi4vIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNrZWxldG9uSm9pbnRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9kYXRhL1NrZWxldG9uSm9pbnRcIik7XG5cbmltcG9ydCBJQXNzZXRcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9saWJyYXJ5L0lBc3NldFwiKTtcbmltcG9ydCBBc3NldEJhc2VcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvbGlicmFyeS9Bc3NldEJhc2VcIik7XG5cbi8qKlxuICogQSBTa2VsZXRvbiBvYmplY3QgaXMgYSBoaWVyYXJjaGljYWwgZ3JvdXBpbmcgb2Ygam9pbnQgb2JqZWN0cyB0aGF0IGNhbiBiZSB1c2VkIGZvciBza2VsZXRhbCBhbmltYXRpb24uXG4gKlxuICogQHNlZSBhd2F5LmFuaW1hdG9ycy5Ta2VsZXRvbkpvaW50XG4gKi9cbmNsYXNzIFNrZWxldG9uIGV4dGVuZHMgQXNzZXRCYXNlIGltcGxlbWVudHMgSUFzc2V0XG57XG5cdHB1YmxpYyBzdGF0aWMgYXNzZXRUeXBlOnN0cmluZyA9IFwiW2Fzc2V0IFNrZWxldG9uXVwiO1xuXG5cdC8qKlxuXHQgKiBBIGZsYXQgbGlzdCBvZiBqb2ludCBvYmplY3RzIHRoYXQgY29tcHJpc2UgdGhlIHNrZWxldG9uLiBFdmVyeSBqb2ludCBleGNlcHQgZm9yIHRoZSByb290IGhhcyBhIHBhcmVudEluZGV4XG5cdCAqIHByb3BlcnR5IHRoYXQgaXMgYW4gaW5kZXggaW50byB0aGlzIGxpc3QuXG5cdCAqIEEgY2hpbGQgam9pbnQgc2hvdWxkIGFsd2F5cyBoYXZlIGEgaGlnaGVyIGluZGV4IHRoYW4gaXRzIHBhcmVudC5cblx0ICovXG5cdHB1YmxpYyBqb2ludHM6QXJyYXk8U2tlbGV0b25Kb2ludD47XG5cblx0LyoqXG5cdCAqIFRoZSB0b3RhbCBudW1iZXIgb2Ygam9pbnRzIGluIHRoZSBza2VsZXRvbi5cblx0ICovXG5cdHB1YmxpYyBnZXQgbnVtSm9pbnRzKCk6bnVtYmVyIC8qdWludCovXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5qb2ludHMubGVuZ3RoO1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBuZXcgPGNvZGU+U2tlbGV0b248L2NvZGU+IG9iamVjdFxuXHQgKi9cblx0Y29uc3RydWN0b3IoKVxuXHR7XG5cdFx0c3VwZXIoKTtcblxuXHRcdC8vIGluIHRoZSBsb25nIHJ1biwgaXQgbWlnaHQgYmUgYSBiZXR0ZXIgaWRlYSB0byBub3Qgc3RvcmUgSm9pbnQgb2JqZWN0cywgYnV0IGtlZXAgYWxsIGRhdGEgaW4gVmVjdG9ycywgdGhhdCB3ZSBjYW4gdXBsb2FkIGVhc2lseT9cblx0XHR0aGlzLmpvaW50cyA9IG5ldyBBcnJheTxTa2VsZXRvbkpvaW50PigpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIGpvaW50IG9iamVjdCBpbiB0aGUgc2tlbGV0b24gd2l0aCB0aGUgZ2l2ZW4gbmFtZSwgb3RoZXJ3aXNlIHJldHVybnMgYSBudWxsIG9iamVjdC5cblx0ICpcblx0ICogQHBhcmFtIGpvaW50TmFtZSBUaGUgbmFtZSBvZiB0aGUgam9pbnQgb2JqZWN0IHRvIGJlIGZvdW5kLlxuXHQgKiBAcmV0dXJuIFRoZSBqb2ludCBvYmplY3Qgd2l0aCB0aGUgZ2l2ZW4gbmFtZS5cblx0ICpcblx0ICogQHNlZSAjam9pbnRzXG5cdCAqL1xuXHRwdWJsaWMgam9pbnRGcm9tTmFtZShqb2ludE5hbWU6c3RyaW5nKTpTa2VsZXRvbkpvaW50XG5cdHtcblx0XHR2YXIgam9pbnRJbmRleDpudW1iZXIgLyppbnQqLyA9IHRoaXMuam9pbnRJbmRleEZyb21OYW1lKGpvaW50TmFtZSk7XG5cdFx0aWYgKGpvaW50SW5kZXggIT0gLTEpXG5cdFx0XHRyZXR1cm4gdGhpcy5qb2ludHNbam9pbnRJbmRleF07IGVsc2Vcblx0XHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIGpvaW50IGluZGV4LCBnaXZlbiB0aGUgam9pbnQgbmFtZS4gLTEgaXMgcmV0dXJuZWQgaWYgdGhlIGpvaW50IG5hbWUgaXMgbm90IGZvdW5kLlxuXHQgKlxuXHQgKiBAcGFyYW0gam9pbnROYW1lIFRoZSBuYW1lIG9mIHRoZSBqb2ludCBvYmplY3QgdG8gYmUgZm91bmQuXG5cdCAqIEByZXR1cm4gVGhlIGluZGV4IG9mIHRoZSBqb2ludCBvYmplY3QgaW4gdGhlIGpvaW50cyBBcnJheVxuXHQgKlxuXHQgKiBAc2VlICNqb2ludHNcblx0ICovXG5cdHB1YmxpYyBqb2ludEluZGV4RnJvbU5hbWUoam9pbnROYW1lOnN0cmluZyk6bnVtYmVyIC8qaW50Ki9cblx0e1xuXHRcdC8vIHRoaXMgaXMgaW1wbGVtZW50ZWQgYXMgYSBsaW5lYXIgc2VhcmNoLCByYXRoZXIgdGhhbiBhIHBvc3NpYmx5XG5cdFx0Ly8gbW9yZSBvcHRpbWFsIG1ldGhvZCAoRGljdGlvbmFyeSBsb29rdXAsIGZvciBleGFtcGxlKSBiZWNhdXNlOlxuXHRcdC8vIGEpIGl0IGlzIGFzc3VtZWQgdGhhdCBpdCB3aWxsIGJlIGNhbGxlZCBvbmNlIGZvciBlYWNoIGpvaW50XG5cdFx0Ly8gYikgaXQgaXMgYXNzdW1lZCB0aGF0IGl0IHdpbGwgYmUgY2FsbGVkIG9ubHkgZHVyaW5nIGxvYWQsIGFuZCBub3QgZHVyaW5nIG1haW4gbG9vcFxuXHRcdC8vIGMpIG1haW50YWluaW5nIGEgZGljdGlvbmFyeSAoZm9yIHNhZmV0eSkgd291bGQgZGljdGF0ZSBhbiBpbnRlcmZhY2UgdG8gYWNjZXNzIFNrZWxldG9uSm9pbnRzLFxuXHRcdC8vICAgIHJhdGhlciB0aGFuIGRpcmVjdCBhcnJheSBhY2Nlc3MuICB0aGlzIHdvdWxkIGJlIHN1Yi1vcHRpbWFsLlxuXHRcdHZhciBqb2ludEluZGV4Om51bWJlciAvKmludCovO1xuXHRcdHZhciBqb2ludDpTa2VsZXRvbkpvaW50O1xuXHRcdGZvciAodmFyIGk6bnVtYmVyIC8qaW50Ki87IGkgPCB0aGlzLmpvaW50cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0am9pbnQgPSB0aGlzLmpvaW50c1tpXTtcblx0XHRcdGlmIChqb2ludC5uYW1lID09IGpvaW50TmFtZSlcblx0XHRcdFx0cmV0dXJuIGpvaW50SW5kZXg7XG5cdFx0XHRqb2ludEluZGV4Kys7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIC0xO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgZGlzcG9zZSgpXG5cdHtcblx0XHR0aGlzLmpvaW50cy5sZW5ndGggPSAwO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGFzc2V0VHlwZSgpOnN0cmluZ1xuXHR7XG5cdFx0cmV0dXJuIFNrZWxldG9uLmFzc2V0VHlwZTtcblx0fVxufVxuXG5leHBvcnQgPSBTa2VsZXRvbjsiXX0=