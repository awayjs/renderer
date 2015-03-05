var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AssetType = require("awayjs-core/lib/library/AssetType");
var NamedAssetBase = require("awayjs-core/lib/library/NamedAssetBase");
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
            return AssetType.SKELETON;
        },
        enumerable: true,
        configurable: true
    });
    return Skeleton;
})(NamedAssetBase);
module.exports = Skeleton;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvZGF0YS9Ta2VsZXRvbi50cyJdLCJuYW1lcyI6WyJTa2VsZXRvbiIsIlNrZWxldG9uLmNvbnN0cnVjdG9yIiwiU2tlbGV0b24ubnVtSm9pbnRzIiwiU2tlbGV0b24uam9pbnRGcm9tTmFtZSIsIlNrZWxldG9uLmpvaW50SW5kZXhGcm9tTmFtZSIsIlNrZWxldG9uLmRpc3Bvc2UiLCJTa2VsZXRvbi5hc3NldFR5cGUiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUVBLElBQU8sU0FBUyxXQUFnQixtQ0FBbUMsQ0FBQyxDQUFDO0FBRXJFLElBQU8sY0FBYyxXQUFlLHdDQUF3QyxDQUFDLENBQUM7QUFFOUUsQUFLQTs7OztHQURHO0lBQ0csUUFBUTtJQUFTQSxVQUFqQkEsUUFBUUEsVUFBdUJBO0lBaUJwQ0E7O09BRUdBO0lBQ0hBLFNBcEJLQSxRQUFRQTtRQXNCWkMsaUJBQU9BLENBQUNBO1FBRVJBLEFBQ0FBLGtJQURrSUE7UUFDbElBLElBQUlBLENBQUNBLE1BQU1BLEdBQUdBLElBQUlBLEtBQUtBLEVBQWlCQSxDQUFDQTtJQUMxQ0EsQ0FBQ0E7SUFkREQsc0JBQVdBLCtCQUFTQTtRQUhwQkE7O1dBRUdBO2FBQ0hBO1lBRUNFLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLE1BQU1BLENBQUNBO1FBQzNCQSxDQUFDQTs7O09BQUFGO0lBYURBOzs7Ozs7O09BT0dBO0lBQ0lBLGdDQUFhQSxHQUFwQkEsVUFBcUJBLFNBQWdCQTtRQUVwQ0csSUFBSUEsVUFBVUEsR0FBa0JBLElBQUlBLENBQUNBLGtCQUFrQkEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0E7UUFDbkVBLEVBQUVBLENBQUNBLENBQUNBLFVBQVVBLElBQUlBLENBQUNBLENBQUNBLENBQUNBO1lBQ3BCQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQTtRQUFDQSxJQUFJQTtZQUNwQ0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7SUFDZEEsQ0FBQ0E7SUFFREg7Ozs7Ozs7T0FPR0E7SUFDSUEscUNBQWtCQSxHQUF6QkEsVUFBMEJBLFNBQWdCQTtRQUV6Q0ksQUFNQUEsaUVBTmlFQTtRQUNqRUEsZ0VBQWdFQTtRQUNoRUEsOERBQThEQTtRQUM5REEscUZBQXFGQTtRQUNyRkEsZ0dBQWdHQTtRQUNoR0Esa0VBQWtFQTtZQUM5REEsVUFBVUEsQ0FBUUEsT0FBREEsQUFBUUEsQ0FBQ0E7UUFDOUJBLElBQUlBLEtBQW1CQSxDQUFDQTtRQUN4QkEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBUUEsT0FBREEsQUFBUUEsRUFBRUEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0E7WUFDeERBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ3ZCQSxFQUFFQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSxJQUFJQSxJQUFJQSxTQUFTQSxDQUFDQTtnQkFDM0JBLE1BQU1BLENBQUNBLFVBQVVBLENBQUNBO1lBQ25CQSxVQUFVQSxFQUFFQSxDQUFDQTtRQUNkQSxDQUFDQTtRQUVEQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtJQUNYQSxDQUFDQTtJQUVESjs7T0FFR0E7SUFDSUEsMEJBQU9BLEdBQWRBO1FBRUNLLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLE1BQU1BLEdBQUdBLENBQUNBLENBQUNBO0lBQ3hCQSxDQUFDQTtJQUtETCxzQkFBV0EsK0JBQVNBO1FBSHBCQTs7V0FFR0E7YUFDSEE7WUFFQ00sTUFBTUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsUUFBUUEsQ0FBQ0E7UUFDM0JBLENBQUNBOzs7T0FBQU47SUFDRkEsZUFBQ0E7QUFBREEsQ0F2RkEsQUF1RkNBLEVBdkZzQixjQUFjLEVBdUZwQztBQUVELEFBQWtCLGlCQUFULFFBQVEsQ0FBQyIsImZpbGUiOiJhbmltYXRvcnMvZGF0YS9Ta2VsZXRvbi5qcyIsInNvdXJjZVJvb3QiOiIuLi8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2tlbGV0b25Kb2ludFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL2RhdGEvU2tlbGV0b25Kb2ludFwiKTtcblxuaW1wb3J0IEFzc2V0VHlwZVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9saWJyYXJ5L0Fzc2V0VHlwZVwiKTtcbmltcG9ydCBJQXNzZXRcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9saWJyYXJ5L0lBc3NldFwiKTtcbmltcG9ydCBOYW1lZEFzc2V0QmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvbGlicmFyeS9OYW1lZEFzc2V0QmFzZVwiKTtcblxuLyoqXG4gKiBBIFNrZWxldG9uIG9iamVjdCBpcyBhIGhpZXJhcmNoaWNhbCBncm91cGluZyBvZiBqb2ludCBvYmplY3RzIHRoYXQgY2FuIGJlIHVzZWQgZm9yIHNrZWxldGFsIGFuaW1hdGlvbi5cbiAqXG4gKiBAc2VlIGF3YXkuYW5pbWF0b3JzLlNrZWxldG9uSm9pbnRcbiAqL1xuY2xhc3MgU2tlbGV0b24gZXh0ZW5kcyBOYW1lZEFzc2V0QmFzZSBpbXBsZW1lbnRzIElBc3NldFxue1xuXHQvKipcblx0ICogQSBmbGF0IGxpc3Qgb2Ygam9pbnQgb2JqZWN0cyB0aGF0IGNvbXByaXNlIHRoZSBza2VsZXRvbi4gRXZlcnkgam9pbnQgZXhjZXB0IGZvciB0aGUgcm9vdCBoYXMgYSBwYXJlbnRJbmRleFxuXHQgKiBwcm9wZXJ0eSB0aGF0IGlzIGFuIGluZGV4IGludG8gdGhpcyBsaXN0LlxuXHQgKiBBIGNoaWxkIGpvaW50IHNob3VsZCBhbHdheXMgaGF2ZSBhIGhpZ2hlciBpbmRleCB0aGFuIGl0cyBwYXJlbnQuXG5cdCAqL1xuXHRwdWJsaWMgam9pbnRzOkFycmF5PFNrZWxldG9uSm9pbnQ+O1xuXG5cdC8qKlxuXHQgKiBUaGUgdG90YWwgbnVtYmVyIG9mIGpvaW50cyBpbiB0aGUgc2tlbGV0b24uXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IG51bUpvaW50cygpOm51bWJlciAvKnVpbnQqL1xuXHR7XG5cdFx0cmV0dXJuIHRoaXMuam9pbnRzLmxlbmd0aDtcblx0fVxuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IDxjb2RlPlNrZWxldG9uPC9jb2RlPiBvYmplY3Rcblx0ICovXG5cdGNvbnN0cnVjdG9yKClcblx0e1xuXHRcdHN1cGVyKCk7XG5cblx0XHQvLyBpbiB0aGUgbG9uZyBydW4sIGl0IG1pZ2h0IGJlIGEgYmV0dGVyIGlkZWEgdG8gbm90IHN0b3JlIEpvaW50IG9iamVjdHMsIGJ1dCBrZWVwIGFsbCBkYXRhIGluIFZlY3RvcnMsIHRoYXQgd2UgY2FuIHVwbG9hZCBlYXNpbHk/XG5cdFx0dGhpcy5qb2ludHMgPSBuZXcgQXJyYXk8U2tlbGV0b25Kb2ludD4oKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSBqb2ludCBvYmplY3QgaW4gdGhlIHNrZWxldG9uIHdpdGggdGhlIGdpdmVuIG5hbWUsIG90aGVyd2lzZSByZXR1cm5zIGEgbnVsbCBvYmplY3QuXG5cdCAqXG5cdCAqIEBwYXJhbSBqb2ludE5hbWUgVGhlIG5hbWUgb2YgdGhlIGpvaW50IG9iamVjdCB0byBiZSBmb3VuZC5cblx0ICogQHJldHVybiBUaGUgam9pbnQgb2JqZWN0IHdpdGggdGhlIGdpdmVuIG5hbWUuXG5cdCAqXG5cdCAqIEBzZWUgI2pvaW50c1xuXHQgKi9cblx0cHVibGljIGpvaW50RnJvbU5hbWUoam9pbnROYW1lOnN0cmluZyk6U2tlbGV0b25Kb2ludFxuXHR7XG5cdFx0dmFyIGpvaW50SW5kZXg6bnVtYmVyIC8qaW50Ki8gPSB0aGlzLmpvaW50SW5kZXhGcm9tTmFtZShqb2ludE5hbWUpO1xuXHRcdGlmIChqb2ludEluZGV4ICE9IC0xKVxuXHRcdFx0cmV0dXJuIHRoaXMuam9pbnRzW2pvaW50SW5kZXhdOyBlbHNlXG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSBqb2ludCBpbmRleCwgZ2l2ZW4gdGhlIGpvaW50IG5hbWUuIC0xIGlzIHJldHVybmVkIGlmIHRoZSBqb2ludCBuYW1lIGlzIG5vdCBmb3VuZC5cblx0ICpcblx0ICogQHBhcmFtIGpvaW50TmFtZSBUaGUgbmFtZSBvZiB0aGUgam9pbnQgb2JqZWN0IHRvIGJlIGZvdW5kLlxuXHQgKiBAcmV0dXJuIFRoZSBpbmRleCBvZiB0aGUgam9pbnQgb2JqZWN0IGluIHRoZSBqb2ludHMgQXJyYXlcblx0ICpcblx0ICogQHNlZSAjam9pbnRzXG5cdCAqL1xuXHRwdWJsaWMgam9pbnRJbmRleEZyb21OYW1lKGpvaW50TmFtZTpzdHJpbmcpOm51bWJlciAvKmludCovXG5cdHtcblx0XHQvLyB0aGlzIGlzIGltcGxlbWVudGVkIGFzIGEgbGluZWFyIHNlYXJjaCwgcmF0aGVyIHRoYW4gYSBwb3NzaWJseVxuXHRcdC8vIG1vcmUgb3B0aW1hbCBtZXRob2QgKERpY3Rpb25hcnkgbG9va3VwLCBmb3IgZXhhbXBsZSkgYmVjYXVzZTpcblx0XHQvLyBhKSBpdCBpcyBhc3N1bWVkIHRoYXQgaXQgd2lsbCBiZSBjYWxsZWQgb25jZSBmb3IgZWFjaCBqb2ludFxuXHRcdC8vIGIpIGl0IGlzIGFzc3VtZWQgdGhhdCBpdCB3aWxsIGJlIGNhbGxlZCBvbmx5IGR1cmluZyBsb2FkLCBhbmQgbm90IGR1cmluZyBtYWluIGxvb3Bcblx0XHQvLyBjKSBtYWludGFpbmluZyBhIGRpY3Rpb25hcnkgKGZvciBzYWZldHkpIHdvdWxkIGRpY3RhdGUgYW4gaW50ZXJmYWNlIHRvIGFjY2VzcyBTa2VsZXRvbkpvaW50cyxcblx0XHQvLyAgICByYXRoZXIgdGhhbiBkaXJlY3QgYXJyYXkgYWNjZXNzLiAgdGhpcyB3b3VsZCBiZSBzdWItb3B0aW1hbC5cblx0XHR2YXIgam9pbnRJbmRleDpudW1iZXIgLyppbnQqLztcblx0XHR2YXIgam9pbnQ6U2tlbGV0b25Kb2ludDtcblx0XHRmb3IgKHZhciBpOm51bWJlciAvKmludCovOyBpIDwgdGhpcy5qb2ludHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGpvaW50ID0gdGhpcy5qb2ludHNbaV07XG5cdFx0XHRpZiAoam9pbnQubmFtZSA9PSBqb2ludE5hbWUpXG5cdFx0XHRcdHJldHVybiBqb2ludEluZGV4O1xuXHRcdFx0am9pbnRJbmRleCsrO1xuXHRcdH1cblxuXHRcdHJldHVybiAtMTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGRpc3Bvc2UoKVxuXHR7XG5cdFx0dGhpcy5qb2ludHMubGVuZ3RoID0gMDtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGdldCBhc3NldFR5cGUoKTpzdHJpbmdcblx0e1xuXHRcdHJldHVybiBBc3NldFR5cGUuU0tFTEVUT047XG5cdH1cbn1cblxuZXhwb3J0ID0gU2tlbGV0b247Il19