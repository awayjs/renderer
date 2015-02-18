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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvZGF0YS9Ta2VsZXRvbi50cyJdLCJuYW1lcyI6WyJTa2VsZXRvbiIsIlNrZWxldG9uLmNvbnN0cnVjdG9yIiwiU2tlbGV0b24ubnVtSm9pbnRzIiwiU2tlbGV0b24uam9pbnRGcm9tTmFtZSIsIlNrZWxldG9uLmpvaW50SW5kZXhGcm9tTmFtZSIsIlNrZWxldG9uLmRpc3Bvc2UiLCJTa2VsZXRvbi5hc3NldFR5cGUiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUVBLElBQU8sU0FBUyxXQUFnQixtQ0FBbUMsQ0FBQyxDQUFDO0FBRXJFLElBQU8sY0FBYyxXQUFlLHdDQUF3QyxDQUFDLENBQUM7QUFFOUUsQUFLQTs7OztHQURHO0lBQ0csUUFBUTtJQUFTQSxVQUFqQkEsUUFBUUEsVUFBdUJBO0lBaUJwQ0E7O09BRUdBO0lBQ0hBLFNBcEJLQSxRQUFRQTtRQXNCWkMsaUJBQU9BLENBQUNBO1FBRVJBLEFBQ0FBLGtJQURrSUE7UUFDbElBLElBQUlBLENBQUNBLE1BQU1BLEdBQUdBLElBQUlBLEtBQUtBLEVBQWlCQSxDQUFDQTtJQUMxQ0EsQ0FBQ0E7SUFkREQsc0JBQVdBLCtCQUFTQTtRQUhwQkE7O1dBRUdBO2FBQ0hBO1lBRUNFLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLE1BQU1BLENBQUNBO1FBQzNCQSxDQUFDQTs7O09BQUFGO0lBYURBOzs7Ozs7O09BT0dBO0lBQ0lBLGdDQUFhQSxHQUFwQkEsVUFBcUJBLFNBQWdCQTtRQUVwQ0csSUFBSUEsVUFBVUEsR0FBa0JBLElBQUlBLENBQUNBLGtCQUFrQkEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0E7UUFDbkVBLEVBQUVBLENBQUNBLENBQUNBLFVBQVVBLElBQUlBLENBQUNBLENBQUNBLENBQUNBO1lBQ3BCQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQTtRQUFDQSxJQUFJQTtZQUNwQ0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7SUFDZEEsQ0FBQ0E7SUFFREg7Ozs7Ozs7T0FPR0E7SUFDSUEscUNBQWtCQSxHQUF6QkEsVUFBMEJBLFNBQWdCQTtRQUV6Q0ksQUFNQUEsaUVBTmlFQTtRQUNqRUEsZ0VBQWdFQTtRQUNoRUEsOERBQThEQTtRQUM5REEscUZBQXFGQTtRQUNyRkEsZ0dBQWdHQTtRQUNoR0Esa0VBQWtFQTtZQUM5REEsVUFBVUEsQ0FBUUEsT0FBREEsQUFBUUEsQ0FBQ0E7UUFDOUJBLElBQUlBLEtBQW1CQSxDQUFDQTtRQUN4QkEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBUUEsT0FBREEsQUFBUUEsRUFBRUEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0E7WUFDeERBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ3ZCQSxFQUFFQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSxJQUFJQSxJQUFJQSxTQUFTQSxDQUFDQTtnQkFDM0JBLE1BQU1BLENBQUNBLFVBQVVBLENBQUNBO1lBQ25CQSxVQUFVQSxFQUFFQSxDQUFDQTtRQUNkQSxDQUFDQTtRQUVEQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtJQUNYQSxDQUFDQTtJQUVESjs7T0FFR0E7SUFDSUEsMEJBQU9BLEdBQWRBO1FBRUNLLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLE1BQU1BLEdBQUdBLENBQUNBLENBQUNBO0lBQ3hCQSxDQUFDQTtJQUtETCxzQkFBV0EsK0JBQVNBO1FBSHBCQTs7V0FFR0E7YUFDSEE7WUFFQ00sTUFBTUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsUUFBUUEsQ0FBQ0E7UUFDM0JBLENBQUNBOzs7T0FBQU47SUFDRkEsZUFBQ0E7QUFBREEsQ0F2RkEsQUF1RkNBLEVBdkZzQixjQUFjLEVBdUZwQztBQUVELEFBQWtCLGlCQUFULFFBQVEsQ0FBQyIsImZpbGUiOiJhbmltYXRvcnMvZGF0YS9Ta2VsZXRvbi5qcyIsInNvdXJjZVJvb3QiOiIuLi8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2tlbGV0b25Kb2ludFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL2RhdGEvU2tlbGV0b25Kb2ludFwiKTtcclxuXHJcbmltcG9ydCBBc3NldFR5cGVcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvbGlicmFyeS9Bc3NldFR5cGVcIik7XHJcbmltcG9ydCBJQXNzZXRcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9saWJyYXJ5L0lBc3NldFwiKTtcclxuaW1wb3J0IE5hbWVkQXNzZXRCYXNlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9saWJyYXJ5L05hbWVkQXNzZXRCYXNlXCIpO1xyXG5cclxuLyoqXHJcbiAqIEEgU2tlbGV0b24gb2JqZWN0IGlzIGEgaGllcmFyY2hpY2FsIGdyb3VwaW5nIG9mIGpvaW50IG9iamVjdHMgdGhhdCBjYW4gYmUgdXNlZCBmb3Igc2tlbGV0YWwgYW5pbWF0aW9uLlxyXG4gKlxyXG4gKiBAc2VlIGF3YXkuYW5pbWF0b3JzLlNrZWxldG9uSm9pbnRcclxuICovXHJcbmNsYXNzIFNrZWxldG9uIGV4dGVuZHMgTmFtZWRBc3NldEJhc2UgaW1wbGVtZW50cyBJQXNzZXRcclxue1xyXG5cdC8qKlxyXG5cdCAqIEEgZmxhdCBsaXN0IG9mIGpvaW50IG9iamVjdHMgdGhhdCBjb21wcmlzZSB0aGUgc2tlbGV0b24uIEV2ZXJ5IGpvaW50IGV4Y2VwdCBmb3IgdGhlIHJvb3QgaGFzIGEgcGFyZW50SW5kZXhcclxuXHQgKiBwcm9wZXJ0eSB0aGF0IGlzIGFuIGluZGV4IGludG8gdGhpcyBsaXN0LlxyXG5cdCAqIEEgY2hpbGQgam9pbnQgc2hvdWxkIGFsd2F5cyBoYXZlIGEgaGlnaGVyIGluZGV4IHRoYW4gaXRzIHBhcmVudC5cclxuXHQgKi9cclxuXHRwdWJsaWMgam9pbnRzOkFycmF5PFNrZWxldG9uSm9pbnQ+O1xyXG5cclxuXHQvKipcclxuXHQgKiBUaGUgdG90YWwgbnVtYmVyIG9mIGpvaW50cyBpbiB0aGUgc2tlbGV0b24uXHJcblx0ICovXHJcblx0cHVibGljIGdldCBudW1Kb2ludHMoKTpudW1iZXIgLyp1aW50Ki9cclxuXHR7XHJcblx0XHRyZXR1cm4gdGhpcy5qb2ludHMubGVuZ3RoO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQ3JlYXRlcyBhIG5ldyA8Y29kZT5Ta2VsZXRvbjwvY29kZT4gb2JqZWN0XHJcblx0ICovXHJcblx0Y29uc3RydWN0b3IoKVxyXG5cdHtcclxuXHRcdHN1cGVyKCk7XHJcblxyXG5cdFx0Ly8gaW4gdGhlIGxvbmcgcnVuLCBpdCBtaWdodCBiZSBhIGJldHRlciBpZGVhIHRvIG5vdCBzdG9yZSBKb2ludCBvYmplY3RzLCBidXQga2VlcCBhbGwgZGF0YSBpbiBWZWN0b3JzLCB0aGF0IHdlIGNhbiB1cGxvYWQgZWFzaWx5P1xyXG5cdFx0dGhpcy5qb2ludHMgPSBuZXcgQXJyYXk8U2tlbGV0b25Kb2ludD4oKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFJldHVybnMgdGhlIGpvaW50IG9iamVjdCBpbiB0aGUgc2tlbGV0b24gd2l0aCB0aGUgZ2l2ZW4gbmFtZSwgb3RoZXJ3aXNlIHJldHVybnMgYSBudWxsIG9iamVjdC5cclxuXHQgKlxyXG5cdCAqIEBwYXJhbSBqb2ludE5hbWUgVGhlIG5hbWUgb2YgdGhlIGpvaW50IG9iamVjdCB0byBiZSBmb3VuZC5cclxuXHQgKiBAcmV0dXJuIFRoZSBqb2ludCBvYmplY3Qgd2l0aCB0aGUgZ2l2ZW4gbmFtZS5cclxuXHQgKlxyXG5cdCAqIEBzZWUgI2pvaW50c1xyXG5cdCAqL1xyXG5cdHB1YmxpYyBqb2ludEZyb21OYW1lKGpvaW50TmFtZTpzdHJpbmcpOlNrZWxldG9uSm9pbnRcclxuXHR7XHJcblx0XHR2YXIgam9pbnRJbmRleDpudW1iZXIgLyppbnQqLyA9IHRoaXMuam9pbnRJbmRleEZyb21OYW1lKGpvaW50TmFtZSk7XHJcblx0XHRpZiAoam9pbnRJbmRleCAhPSAtMSlcclxuXHRcdFx0cmV0dXJuIHRoaXMuam9pbnRzW2pvaW50SW5kZXhdOyBlbHNlXHJcblx0XHRcdHJldHVybiBudWxsO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogUmV0dXJucyB0aGUgam9pbnQgaW5kZXgsIGdpdmVuIHRoZSBqb2ludCBuYW1lLiAtMSBpcyByZXR1cm5lZCBpZiB0aGUgam9pbnQgbmFtZSBpcyBub3QgZm91bmQuXHJcblx0ICpcclxuXHQgKiBAcGFyYW0gam9pbnROYW1lIFRoZSBuYW1lIG9mIHRoZSBqb2ludCBvYmplY3QgdG8gYmUgZm91bmQuXHJcblx0ICogQHJldHVybiBUaGUgaW5kZXggb2YgdGhlIGpvaW50IG9iamVjdCBpbiB0aGUgam9pbnRzIEFycmF5XHJcblx0ICpcclxuXHQgKiBAc2VlICNqb2ludHNcclxuXHQgKi9cclxuXHRwdWJsaWMgam9pbnRJbmRleEZyb21OYW1lKGpvaW50TmFtZTpzdHJpbmcpOm51bWJlciAvKmludCovXHJcblx0e1xyXG5cdFx0Ly8gdGhpcyBpcyBpbXBsZW1lbnRlZCBhcyBhIGxpbmVhciBzZWFyY2gsIHJhdGhlciB0aGFuIGEgcG9zc2libHlcclxuXHRcdC8vIG1vcmUgb3B0aW1hbCBtZXRob2QgKERpY3Rpb25hcnkgbG9va3VwLCBmb3IgZXhhbXBsZSkgYmVjYXVzZTpcclxuXHRcdC8vIGEpIGl0IGlzIGFzc3VtZWQgdGhhdCBpdCB3aWxsIGJlIGNhbGxlZCBvbmNlIGZvciBlYWNoIGpvaW50XHJcblx0XHQvLyBiKSBpdCBpcyBhc3N1bWVkIHRoYXQgaXQgd2lsbCBiZSBjYWxsZWQgb25seSBkdXJpbmcgbG9hZCwgYW5kIG5vdCBkdXJpbmcgbWFpbiBsb29wXHJcblx0XHQvLyBjKSBtYWludGFpbmluZyBhIGRpY3Rpb25hcnkgKGZvciBzYWZldHkpIHdvdWxkIGRpY3RhdGUgYW4gaW50ZXJmYWNlIHRvIGFjY2VzcyBTa2VsZXRvbkpvaW50cyxcclxuXHRcdC8vICAgIHJhdGhlciB0aGFuIGRpcmVjdCBhcnJheSBhY2Nlc3MuICB0aGlzIHdvdWxkIGJlIHN1Yi1vcHRpbWFsLlxyXG5cdFx0dmFyIGpvaW50SW5kZXg6bnVtYmVyIC8qaW50Ki87XHJcblx0XHR2YXIgam9pbnQ6U2tlbGV0b25Kb2ludDtcclxuXHRcdGZvciAodmFyIGk6bnVtYmVyIC8qaW50Ki87IGkgPCB0aGlzLmpvaW50cy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRqb2ludCA9IHRoaXMuam9pbnRzW2ldO1xyXG5cdFx0XHRpZiAoam9pbnQubmFtZSA9PSBqb2ludE5hbWUpXHJcblx0XHRcdFx0cmV0dXJuIGpvaW50SW5kZXg7XHJcblx0XHRcdGpvaW50SW5kZXgrKztcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gLTE7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBAaW5oZXJpdERvY1xyXG5cdCAqL1xyXG5cdHB1YmxpYyBkaXNwb3NlKClcclxuXHR7XHJcblx0XHR0aGlzLmpvaW50cy5sZW5ndGggPSAwO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQGluaGVyaXREb2NcclxuXHQgKi9cclxuXHRwdWJsaWMgZ2V0IGFzc2V0VHlwZSgpOnN0cmluZ1xyXG5cdHtcclxuXHRcdHJldHVybiBBc3NldFR5cGUuU0tFTEVUT047XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgPSBTa2VsZXRvbjsiXX0=