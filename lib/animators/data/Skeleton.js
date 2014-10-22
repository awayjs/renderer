var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AssetType = require("awayjs-core/lib/core/library/AssetType");
var NamedAssetBase = require("awayjs-core/lib/core/library/NamedAssetBase");
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuaW1hdG9ycy9kYXRhL3NrZWxldG9uLnRzIl0sIm5hbWVzIjpbIlNrZWxldG9uIiwiU2tlbGV0b24uY29uc3RydWN0b3IiLCJTa2VsZXRvbi5udW1Kb2ludHMiLCJTa2VsZXRvbi5qb2ludEZyb21OYW1lIiwiU2tlbGV0b24uam9pbnRJbmRleEZyb21OYW1lIiwiU2tlbGV0b24uZGlzcG9zZSIsIlNrZWxldG9uLmFzc2V0VHlwZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBRUEsSUFBTyxTQUFTLFdBQWdCLHdDQUF3QyxDQUFDLENBQUM7QUFFMUUsSUFBTyxjQUFjLFdBQWUsNkNBQTZDLENBQUMsQ0FBQztBQUVuRixBQUtBOzs7O0dBREc7SUFDRyxRQUFRO0lBQVNBLFVBQWpCQSxRQUFRQSxVQUF1QkE7SUFpQnBDQTs7T0FFR0E7SUFDSEEsU0FwQktBLFFBQVFBO1FBc0JaQyxpQkFBT0EsQ0FBQ0E7UUFFUkEsQUFDQUEsa0lBRGtJQTtRQUNsSUEsSUFBSUEsQ0FBQ0EsTUFBTUEsR0FBR0EsSUFBSUEsS0FBS0EsRUFBaUJBLENBQUNBO0lBQzFDQSxDQUFDQTtJQWRERCxzQkFBV0EsK0JBQVNBO1FBSHBCQTs7V0FFR0E7YUFDSEE7WUFFQ0UsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsTUFBTUEsQ0FBQ0E7UUFDM0JBLENBQUNBOzs7T0FBQUY7SUFhREE7Ozs7Ozs7T0FPR0E7SUFDSUEsZ0NBQWFBLEdBQXBCQSxVQUFxQkEsU0FBZ0JBO1FBRXBDRyxJQUFJQSxVQUFVQSxHQUFrQkEsSUFBSUEsQ0FBQ0Esa0JBQWtCQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQTtRQUNuRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsVUFBVUEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDcEJBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLFVBQVVBLENBQUNBLENBQUNBO1FBQUNBLElBQUlBO1lBQ3BDQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQTtJQUNkQSxDQUFDQTtJQUVESDs7Ozs7OztPQU9HQTtJQUNJQSxxQ0FBa0JBLEdBQXpCQSxVQUEwQkEsU0FBZ0JBO1FBRXpDSSxBQU1BQSxpRUFOaUVBO1FBQ2pFQSxnRUFBZ0VBO1FBQ2hFQSw4REFBOERBO1FBQzlEQSxxRkFBcUZBO1FBQ3JGQSxnR0FBZ0dBO1FBQ2hHQSxrRUFBa0VBO1lBQzlEQSxVQUFVQSxDQUFRQSxPQUFEQSxBQUFRQSxDQUFDQTtRQUM5QkEsSUFBSUEsS0FBbUJBLENBQUNBO1FBQ3hCQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFRQSxPQUFEQSxBQUFRQSxFQUFFQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQTtZQUN4REEsS0FBS0EsR0FBR0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDdkJBLEVBQUVBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLElBQUlBLElBQUlBLFNBQVNBLENBQUNBO2dCQUMzQkEsTUFBTUEsQ0FBQ0EsVUFBVUEsQ0FBQ0E7WUFDbkJBLFVBQVVBLEVBQUVBLENBQUNBO1FBQ2RBLENBQUNBO1FBRURBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBO0lBQ1hBLENBQUNBO0lBRURKOztPQUVHQTtJQUNJQSwwQkFBT0EsR0FBZEE7UUFFQ0ssSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsTUFBTUEsR0FBR0EsQ0FBQ0EsQ0FBQ0E7SUFDeEJBLENBQUNBO0lBS0RMLHNCQUFXQSwrQkFBU0E7UUFIcEJBOztXQUVHQTthQUNIQTtZQUVDTSxNQUFNQSxDQUFDQSxTQUFTQSxDQUFDQSxRQUFRQSxDQUFDQTtRQUMzQkEsQ0FBQ0E7OztPQUFBTjtJQUNGQSxlQUFDQTtBQUFEQSxDQXZGQSxBQXVGQ0EsRUF2RnNCLGNBQWMsRUF1RnBDO0FBRUQsQUFBa0IsaUJBQVQsUUFBUSxDQUFDIiwiZmlsZSI6ImFuaW1hdG9ycy9kYXRhL1NrZWxldG9uLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9yb2JiYXRlbWFuL1dlYnN0b3JtUHJvamVjdHMvYXdheWpzLXJlbmRlcmVyZ2wvIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNrZWxldG9uSm9pbnRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9kYXRhL1NrZWxldG9uSm9pbnRcIik7XG5cbmltcG9ydCBBc3NldFR5cGVcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvY29yZS9saWJyYXJ5L0Fzc2V0VHlwZVwiKTtcbmltcG9ydCBJQXNzZXRcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9jb3JlL2xpYnJhcnkvSUFzc2V0XCIpO1xuaW1wb3J0IE5hbWVkQXNzZXRCYXNlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9jb3JlL2xpYnJhcnkvTmFtZWRBc3NldEJhc2VcIik7XG5cbi8qKlxuICogQSBTa2VsZXRvbiBvYmplY3QgaXMgYSBoaWVyYXJjaGljYWwgZ3JvdXBpbmcgb2Ygam9pbnQgb2JqZWN0cyB0aGF0IGNhbiBiZSB1c2VkIGZvciBza2VsZXRhbCBhbmltYXRpb24uXG4gKlxuICogQHNlZSBhd2F5LmFuaW1hdG9ycy5Ta2VsZXRvbkpvaW50XG4gKi9cbmNsYXNzIFNrZWxldG9uIGV4dGVuZHMgTmFtZWRBc3NldEJhc2UgaW1wbGVtZW50cyBJQXNzZXRcbntcblx0LyoqXG5cdCAqIEEgZmxhdCBsaXN0IG9mIGpvaW50IG9iamVjdHMgdGhhdCBjb21wcmlzZSB0aGUgc2tlbGV0b24uIEV2ZXJ5IGpvaW50IGV4Y2VwdCBmb3IgdGhlIHJvb3QgaGFzIGEgcGFyZW50SW5kZXhcblx0ICogcHJvcGVydHkgdGhhdCBpcyBhbiBpbmRleCBpbnRvIHRoaXMgbGlzdC5cblx0ICogQSBjaGlsZCBqb2ludCBzaG91bGQgYWx3YXlzIGhhdmUgYSBoaWdoZXIgaW5kZXggdGhhbiBpdHMgcGFyZW50LlxuXHQgKi9cblx0cHVibGljIGpvaW50czpBcnJheTxTa2VsZXRvbkpvaW50PjtcblxuXHQvKipcblx0ICogVGhlIHRvdGFsIG51bWJlciBvZiBqb2ludHMgaW4gdGhlIHNrZWxldG9uLlxuXHQgKi9cblx0cHVibGljIGdldCBudW1Kb2ludHMoKTpudW1iZXIgLyp1aW50Ki9cblx0e1xuXHRcdHJldHVybiB0aGlzLmpvaW50cy5sZW5ndGg7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyA8Y29kZT5Ta2VsZXRvbjwvY29kZT4gb2JqZWN0XG5cdCAqL1xuXHRjb25zdHJ1Y3RvcigpXG5cdHtcblx0XHRzdXBlcigpO1xuXG5cdFx0Ly8gaW4gdGhlIGxvbmcgcnVuLCBpdCBtaWdodCBiZSBhIGJldHRlciBpZGVhIHRvIG5vdCBzdG9yZSBKb2ludCBvYmplY3RzLCBidXQga2VlcCBhbGwgZGF0YSBpbiBWZWN0b3JzLCB0aGF0IHdlIGNhbiB1cGxvYWQgZWFzaWx5P1xuXHRcdHRoaXMuam9pbnRzID0gbmV3IEFycmF5PFNrZWxldG9uSm9pbnQ+KCk7XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgam9pbnQgb2JqZWN0IGluIHRoZSBza2VsZXRvbiB3aXRoIHRoZSBnaXZlbiBuYW1lLCBvdGhlcndpc2UgcmV0dXJucyBhIG51bGwgb2JqZWN0LlxuXHQgKlxuXHQgKiBAcGFyYW0gam9pbnROYW1lIFRoZSBuYW1lIG9mIHRoZSBqb2ludCBvYmplY3QgdG8gYmUgZm91bmQuXG5cdCAqIEByZXR1cm4gVGhlIGpvaW50IG9iamVjdCB3aXRoIHRoZSBnaXZlbiBuYW1lLlxuXHQgKlxuXHQgKiBAc2VlICNqb2ludHNcblx0ICovXG5cdHB1YmxpYyBqb2ludEZyb21OYW1lKGpvaW50TmFtZTpzdHJpbmcpOlNrZWxldG9uSm9pbnRcblx0e1xuXHRcdHZhciBqb2ludEluZGV4Om51bWJlciAvKmludCovID0gdGhpcy5qb2ludEluZGV4RnJvbU5hbWUoam9pbnROYW1lKTtcblx0XHRpZiAoam9pbnRJbmRleCAhPSAtMSlcblx0XHRcdHJldHVybiB0aGlzLmpvaW50c1tqb2ludEluZGV4XTsgZWxzZVxuXHRcdFx0cmV0dXJuIG51bGw7XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgam9pbnQgaW5kZXgsIGdpdmVuIHRoZSBqb2ludCBuYW1lLiAtMSBpcyByZXR1cm5lZCBpZiB0aGUgam9pbnQgbmFtZSBpcyBub3QgZm91bmQuXG5cdCAqXG5cdCAqIEBwYXJhbSBqb2ludE5hbWUgVGhlIG5hbWUgb2YgdGhlIGpvaW50IG9iamVjdCB0byBiZSBmb3VuZC5cblx0ICogQHJldHVybiBUaGUgaW5kZXggb2YgdGhlIGpvaW50IG9iamVjdCBpbiB0aGUgam9pbnRzIEFycmF5XG5cdCAqXG5cdCAqIEBzZWUgI2pvaW50c1xuXHQgKi9cblx0cHVibGljIGpvaW50SW5kZXhGcm9tTmFtZShqb2ludE5hbWU6c3RyaW5nKTpudW1iZXIgLyppbnQqL1xuXHR7XG5cdFx0Ly8gdGhpcyBpcyBpbXBsZW1lbnRlZCBhcyBhIGxpbmVhciBzZWFyY2gsIHJhdGhlciB0aGFuIGEgcG9zc2libHlcblx0XHQvLyBtb3JlIG9wdGltYWwgbWV0aG9kIChEaWN0aW9uYXJ5IGxvb2t1cCwgZm9yIGV4YW1wbGUpIGJlY2F1c2U6XG5cdFx0Ly8gYSkgaXQgaXMgYXNzdW1lZCB0aGF0IGl0IHdpbGwgYmUgY2FsbGVkIG9uY2UgZm9yIGVhY2ggam9pbnRcblx0XHQvLyBiKSBpdCBpcyBhc3N1bWVkIHRoYXQgaXQgd2lsbCBiZSBjYWxsZWQgb25seSBkdXJpbmcgbG9hZCwgYW5kIG5vdCBkdXJpbmcgbWFpbiBsb29wXG5cdFx0Ly8gYykgbWFpbnRhaW5pbmcgYSBkaWN0aW9uYXJ5IChmb3Igc2FmZXR5KSB3b3VsZCBkaWN0YXRlIGFuIGludGVyZmFjZSB0byBhY2Nlc3MgU2tlbGV0b25Kb2ludHMsXG5cdFx0Ly8gICAgcmF0aGVyIHRoYW4gZGlyZWN0IGFycmF5IGFjY2Vzcy4gIHRoaXMgd291bGQgYmUgc3ViLW9wdGltYWwuXG5cdFx0dmFyIGpvaW50SW5kZXg6bnVtYmVyIC8qaW50Ki87XG5cdFx0dmFyIGpvaW50OlNrZWxldG9uSm9pbnQ7XG5cdFx0Zm9yICh2YXIgaTpudW1iZXIgLyppbnQqLzsgaSA8IHRoaXMuam9pbnRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRqb2ludCA9IHRoaXMuam9pbnRzW2ldO1xuXHRcdFx0aWYgKGpvaW50Lm5hbWUgPT0gam9pbnROYW1lKVxuXHRcdFx0XHRyZXR1cm4gam9pbnRJbmRleDtcblx0XHRcdGpvaW50SW5kZXgrKztcblx0XHR9XG5cblx0XHRyZXR1cm4gLTE7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBkaXNwb3NlKClcblx0e1xuXHRcdHRoaXMuam9pbnRzLmxlbmd0aCA9IDA7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBnZXQgYXNzZXRUeXBlKCk6c3RyaW5nXG5cdHtcblx0XHRyZXR1cm4gQXNzZXRUeXBlLlNLRUxFVE9OO1xuXHR9XG59XG5cbmV4cG9ydCA9IFNrZWxldG9uOyJdfQ==