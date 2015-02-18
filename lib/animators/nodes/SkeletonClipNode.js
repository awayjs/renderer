var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AnimationClipNodeBase = require("awayjs-renderergl/lib/animators/nodes/AnimationClipNodeBase");
var SkeletonClipState = require("awayjs-renderergl/lib/animators/states/SkeletonClipState");
/**
 * A skeleton animation node containing time-based animation data as individual skeleton poses.
 */
var SkeletonClipNode = (function (_super) {
    __extends(SkeletonClipNode, _super);
    /**
     * Creates a new <code>SkeletonClipNode</code> object.
     */
    function SkeletonClipNode() {
        _super.call(this);
        this._frames = new Array();
        /**
         * Determines whether to use SLERP equations (true) or LERP equations (false) in the calculation
         * of the output skeleton pose. Defaults to false.
         */
        this.highQuality = false;
        this._pStateClass = SkeletonClipState;
    }
    Object.defineProperty(SkeletonClipNode.prototype, "frames", {
        /**
         * Returns a vector of skeleton poses representing the pose of each animation frame in the clip.
         */
        get: function () {
            return this._frames;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Adds a skeleton pose frame to the internal timeline of the animation node.
     *
     * @param skeletonPose The skeleton pose object to add to the timeline of the node.
     * @param duration The specified duration of the frame in milliseconds.
     */
    SkeletonClipNode.prototype.addFrame = function (skeletonPose, duration /*number /*uint*/) {
        this._frames.push(skeletonPose);
        this._pDurations.push(duration);
        this._pNumFrames = this._pDurations.length;
        this._pStitchDirty = true;
    };
    /**
     * @inheritDoc
     */
    SkeletonClipNode.prototype.getAnimationState = function (animator) {
        return animator.getAnimationState(this);
    };
    /**
     * @inheritDoc
     */
    SkeletonClipNode.prototype._pUpdateStitch = function () {
        _super.prototype._pUpdateStitch.call(this);
        var i = this._pNumFrames - 1;
        var p1, p2, delta;
        while (i--) {
            this._pTotalDuration += this._pDurations[i];
            p1 = this._frames[i].jointPoses[0].translation;
            p2 = this._frames[i + 1].jointPoses[0].translation;
            delta = p2.subtract(p1);
            this._pTotalDelta.x += delta.x;
            this._pTotalDelta.y += delta.y;
            this._pTotalDelta.z += delta.z;
        }
        if (this._pStitchFinalFrame || !this._pLooping) {
            this._pTotalDuration += this._pDurations[this._pNumFrames - 1];
            p1 = this._frames[0].jointPoses[0].translation;
            p2 = this._frames[1].jointPoses[0].translation;
            delta = p2.subtract(p1);
            this._pTotalDelta.x += delta.x;
            this._pTotalDelta.y += delta.y;
            this._pTotalDelta.z += delta.z;
        }
    };
    return SkeletonClipNode;
})(AnimationClipNodeBase);
module.exports = SkeletonClipNode;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvbm9kZXMvU2tlbGV0b25DbGlwTm9kZS50cyJdLCJuYW1lcyI6WyJTa2VsZXRvbkNsaXBOb2RlIiwiU2tlbGV0b25DbGlwTm9kZS5jb25zdHJ1Y3RvciIsIlNrZWxldG9uQ2xpcE5vZGUuZnJhbWVzIiwiU2tlbGV0b25DbGlwTm9kZS5hZGRGcmFtZSIsIlNrZWxldG9uQ2xpcE5vZGUuZ2V0QW5pbWF0aW9uU3RhdGUiLCJTa2VsZXRvbkNsaXBOb2RlLl9wVXBkYXRlU3RpdGNoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFLQSxJQUFPLHFCQUFxQixXQUFhLDZEQUE2RCxDQUFDLENBQUM7QUFDeEcsSUFBTyxpQkFBaUIsV0FBYywwREFBMEQsQ0FBQyxDQUFDO0FBRWxHLEFBR0E7O0dBREc7SUFDRyxnQkFBZ0I7SUFBU0EsVUFBekJBLGdCQUFnQkEsVUFBOEJBO0lBa0JuREE7O09BRUdBO0lBQ0hBLFNBckJLQSxnQkFBZ0JBO1FBdUJwQkMsaUJBQU9BLENBQUNBO1FBckJEQSxZQUFPQSxHQUF1QkEsSUFBSUEsS0FBS0EsRUFBZ0JBLENBQUNBO1FBRWhFQTs7O1dBR0dBO1FBQ0lBLGdCQUFXQSxHQUFXQSxLQUFLQSxDQUFDQTtRQWlCbENBLElBQUlBLENBQUNBLFlBQVlBLEdBQUdBLGlCQUFpQkEsQ0FBQ0E7SUFDdkNBLENBQUNBO0lBYkRELHNCQUFXQSxvQ0FBTUE7UUFIakJBOztXQUVHQTthQUNIQTtZQUVDRSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQTtRQUNyQkEsQ0FBQ0E7OztPQUFBRjtJQVlEQTs7Ozs7T0FLR0E7SUFDSUEsbUNBQVFBLEdBQWZBLFVBQWdCQSxZQUF5QkEsRUFBRUEsUUFBUUEsQ0FBUUEsaUJBQURBLEFBQWtCQTtRQUUzRUcsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsQ0FBQ0E7UUFDaENBLElBQUlBLENBQUNBLFdBQVdB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bkQ7QUFFRCxBQUEwQixpQkFBakIsZ0JBQWdCLENBQUMiLCJmaWxlIjoiYW5pbWF0b3JzL25vZGVzL1NrZWxldG9uQ2xpcE5vZGUuanMiLCJzb3VyY2VSb290IjoiLi4vIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFZlY3RvcjNEXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZ2VvbS9WZWN0b3IzRFwiKTtcclxuXHJcbmltcG9ydCBBbmltYXRvckJhc2VcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL0FuaW1hdG9yQmFzZVwiKTtcclxuXHJcbmltcG9ydCBTa2VsZXRvblBvc2VcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL2RhdGEvU2tlbGV0b25Qb3NlXCIpO1xyXG5pbXBvcnQgQW5pbWF0aW9uQ2xpcE5vZGVCYXNlXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9ub2Rlcy9BbmltYXRpb25DbGlwTm9kZUJhc2VcIik7XHJcbmltcG9ydCBTa2VsZXRvbkNsaXBTdGF0ZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9zdGF0ZXMvU2tlbGV0b25DbGlwU3RhdGVcIik7XHJcblxyXG4vKipcclxuICogQSBza2VsZXRvbiBhbmltYXRpb24gbm9kZSBjb250YWluaW5nIHRpbWUtYmFzZWQgYW5pbWF0aW9uIGRhdGEgYXMgaW5kaXZpZHVhbCBza2VsZXRvbiBwb3Nlcy5cclxuICovXHJcbmNsYXNzIFNrZWxldG9uQ2xpcE5vZGUgZXh0ZW5kcyBBbmltYXRpb25DbGlwTm9kZUJhc2Vcclxue1xyXG5cdHByaXZhdGUgX2ZyYW1lczpBcnJheTxTa2VsZXRvblBvc2U+ID0gbmV3IEFycmF5PFNrZWxldG9uUG9zZT4oKTtcclxuXHJcblx0LyoqXHJcblx0ICogRGV0ZXJtaW5lcyB3aGV0aGVyIHRvIHVzZSBTTEVSUCBlcXVhdGlvbnMgKHRydWUpIG9yIExFUlAgZXF1YXRpb25zIChmYWxzZSkgaW4gdGhlIGNhbGN1bGF0aW9uXHJcblx0ICogb2YgdGhlIG91dHB1dCBza2VsZXRvbiBwb3NlLiBEZWZhdWx0cyB0byBmYWxzZS5cclxuXHQgKi9cclxuXHRwdWJsaWMgaGlnaFF1YWxpdHk6Ym9vbGVhbiA9IGZhbHNlO1xyXG5cclxuXHQvKipcclxuXHQgKiBSZXR1cm5zIGEgdmVjdG9yIG9mIHNrZWxldG9uIHBvc2VzIHJlcHJlc2VudGluZyB0aGUgcG9zZSBvZiBlYWNoIGFuaW1hdGlvbiBmcmFtZSBpbiB0aGUgY2xpcC5cclxuXHQgKi9cclxuXHRwdWJsaWMgZ2V0IGZyYW1lcygpOkFycmF5PFNrZWxldG9uUG9zZT5cclxuXHR7XHJcblx0XHRyZXR1cm4gdGhpcy5fZnJhbWVzO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQ3JlYXRlcyBhIG5ldyA8Y29kZT5Ta2VsZXRvbkNsaXBOb2RlPC9jb2RlPiBvYmplY3QuXHJcblx0ICovXHJcblx0Y29uc3RydWN0b3IoKVxyXG5cdHtcclxuXHRcdHN1cGVyKCk7XHJcblxyXG5cdFx0dGhpcy5fcFN0YXRlQ2xhc3MgPSBTa2VsZXRvbkNsaXBTdGF0ZTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEFkZHMgYSBza2VsZXRvbiBwb3NlIGZyYW1lIHRvIHRoZSBpbnRlcm5hbCB0aW1lbGluZSBvZiB0aGUgYW5pbWF0aW9uIG5vZGUuXHJcblx0ICpcclxuXHQgKiBAcGFyYW0gc2tlbGV0b25Qb3NlIFRoZSBza2VsZXRvbiBwb3NlIG9iamVjdCB0byBhZGQgdG8gdGhlIHRpbWVsaW5lIG9mIHRoZSBub2RlLlxyXG5cdCAqIEBwYXJhbSBkdXJhdGlvbiBUaGUgc3BlY2lmaWVkIGR1cmF0aW9uIG9mIHRoZSBmcmFtZSBpbiBtaWxsaXNlY29uZHMuXHJcblx0ICovXHJcblx0cHVibGljIGFkZEZyYW1lKHNrZWxldG9uUG9zZTpTa2VsZXRvblBvc2UsIGR1cmF0aW9uOm51bWJlciAvKm51bWJlciAvKnVpbnQqLylcclxuXHR7XHJcblx0XHR0aGlzLl9mcmFtZXMucHVzaChza2VsZXRvblBvc2UpO1xyXG5cdFx0dGhpcy5fcER1cmF0aW9ucy5wdXNoKGR1cmF0aW9uKTtcclxuXHJcblx0XHR0aGlzLl9wTnVtRnJhbWVzID0gdGhpcy5fcER1cmF0aW9ucy5sZW5ndGg7XHJcblxyXG5cdFx0dGhpcy5fcFN0aXRjaERpcnR5ID0gdHJ1ZTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEBpbmhlcml0RG9jXHJcblx0ICovXHJcblx0cHVibGljIGdldEFuaW1hdGlvblN0YXRlKGFuaW1hdG9yOkFuaW1hdG9yQmFzZSk6U2tlbGV0b25DbGlwU3RhdGVcclxuXHR7XHJcblx0XHRyZXR1cm4gPFNrZWxldG9uQ2xpcFN0YXRlPiBhbmltYXRvci5nZXRBbmltYXRpb25TdGF0ZSh0aGlzKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEBpbmhlcml0RG9jXHJcblx0ICovXHJcblx0cHVibGljIF9wVXBkYXRlU3RpdGNoKClcclxuXHR7XHJcblx0XHRzdXBlci5fcFVwZGF0ZVN0aXRjaCgpO1xyXG5cclxuXHRcdHZhciBpOm51bWJlciAvKnVpbnQqLyA9IHRoaXMuX3BOdW1GcmFtZXMgLSAxO1xyXG5cdFx0dmFyIHAxOlZlY3RvcjNELCBwMjpWZWN0b3IzRCwgZGVsdGE6VmVjdG9yM0Q7XHJcblx0XHR3aGlsZSAoaS0tKSB7XHJcblx0XHRcdHRoaXMuX3BUb3RhbER1cmF0aW9uICs9IHRoaXMuX3BEdXJhdGlvbnNbaV07XHJcblx0XHRcdHAxID0gdGhpcy5fZnJhbWVzW2ldLmpvaW50UG9zZXNbMF0udHJhbnNsYXRpb247XHJcblx0XHRcdHAyID0gdGhpcy5fZnJhbWVzW2kgKyAxXS5qb2ludFBvc2VzWzBdLnRyYW5zbGF0aW9uO1xyXG5cdFx0XHRkZWx0YSA9IHAyLnN1YnRyYWN0KHAxKTtcclxuXHRcdFx0dGhpcy5fcFRvdGFsRGVsdGEueCArPSBkZWx0YS54O1xyXG5cdFx0XHR0aGlzLl9wVG90YWxEZWx0YS55ICs9IGRlbHRhLnk7XHJcblx0XHRcdHRoaXMuX3BUb3RhbERlbHRhLnogKz0gZGVsdGEuejtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGhpcy5fcFN0aXRjaEZpbmFsRnJhbWUgfHwgIXRoaXMuX3BMb29waW5nKSB7XHJcblx0XHRcdHRoaXMuX3BUb3RhbER1cmF0aW9uICs9IHRoaXMuX3BEdXJhdGlvbnNbdGhpcy5fcE51bUZyYW1lcyAtIDFdO1xyXG5cdFx0XHRwMSA9IHRoaXMuX2ZyYW1lc1swXS5qb2ludFBvc2VzWzBdLnRyYW5zbGF0aW9uO1xyXG5cdFx0XHRwMiA9IHRoaXMuX2ZyYW1lc1sxXS5qb2ludFBvc2VzWzBdLnRyYW5zbGF0aW9uO1xyXG5cdFx0XHRkZWx0YSA9IHAyLnN1YnRyYWN0KHAxKTtcclxuXHRcdFx0dGhpcy5fcFRvdGFsRGVsdGEueCArPSBkZWx0YS54O1xyXG5cdFx0XHR0aGlzLl9wVG90YWxEZWx0YS55ICs9IGRlbHRhLnk7XHJcblx0XHRcdHRoaXMuX3BUb3RhbERlbHRhLnogKz0gZGVsdGEuejtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCA9IFNrZWxldG9uQ2xpcE5vZGU7Il19