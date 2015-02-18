var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AnimationSetBase = require("awayjs-renderergl/lib/animators/AnimationSetBase");
/**
 * The animation data set used by skeleton-based animators, containing skeleton animation data.
 *
 * @see away.animators.SkeletonAnimator
 */
var SkeletonAnimationSet = (function (_super) {
    __extends(SkeletonAnimationSet, _super);
    /**
     * Creates a new <code>SkeletonAnimationSet</code> object.
     *
     * @param jointsPerVertex Sets the amount of skeleton joints that can be linked to a single vertex via skinned weight values. For GPU-base animation, the maximum allowed value is 4. Defaults to 4.
     */
    function SkeletonAnimationSet(jointsPerVertex) {
        if (jointsPerVertex === void 0) { jointsPerVertex = 4; }
        _super.call(this);
        this._jointsPerVertex = jointsPerVertex;
    }
    Object.defineProperty(SkeletonAnimationSet.prototype, "jointsPerVertex", {
        /**
         * Returns the amount of skeleton joints that can be linked to a single vertex via skinned weight values. For GPU-base animation, the
         * maximum allowed value is 4.
         */
        get: function () {
            return this._jointsPerVertex;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    SkeletonAnimationSet.prototype.getAGALVertexCode = function (shaderObject) {
        var len = shaderObject.animatableAttributes.length;
        var indexOffset0 = shaderObject.numUsedVertexConstants;
        var indexOffset1 = indexOffset0 + 1;
        var indexOffset2 = indexOffset0 + 2;
        var indexStream = "va" + shaderObject.numUsedStreams;
        var weightStream = "va" + (shaderObject.numUsedStreams + 1);
        var indices = [indexStream + ".x", indexStream + ".y", indexStream + ".z", indexStream + ".w"];
        var weights = [weightStream + ".x", weightStream + ".y", weightStream + ".z", weightStream + ".w"];
        var temp1 = this._pFindTempReg(shaderObject.animationTargetRegisters);
        var temp2 = this._pFindTempReg(shaderObject.animationTargetRegisters, temp1);
        var dot = "dp4";
        var code = "";
        for (var i = 0; i < len; ++i) {
            var src = shaderObject.animatableAttributes[i];
            for (var j = 0; j < this._jointsPerVertex; ++j) {
                code += dot + " " + temp1 + ".x, " + src + ", vc[" + indices[j] + "+" + indexOffset0 + "]\n" + dot + " " + temp1 + ".y, " + src + ", vc[" + indices[j] + "+" + indexOffset1 + "]\n" + dot + " " + temp1 + ".z, " + src + ", vc[" + indices[j] + "+" + indexOffset2 + "]\n" + "mov " + temp1 + ".w, " + src + ".w\n" + "mul " + temp1 + ", " + temp1 + ", " + weights[j] + "\n"; // apply weight
                // add or mov to target. Need to write to a temp reg first, because an output can be a target
                if (j == 0)
                    code += "mov " + temp2 + ", " + temp1 + "\n";
                else
                    code += "add " + temp2 + ", " + temp2 + ", " + temp1 + "\n";
            }
            // switch to dp3 once positions have been transformed, from now on, it should only be vectors instead of points
            dot = "dp3";
            code += "mov " + shaderObject.animationTargetRegisters[i] + ", " + temp2 + "\n";
        }
        return code;
    };
    /**
     * @inheritDoc
     */
    SkeletonAnimationSet.prototype.activate = function (shaderObject, stage) {
    };
    /**
     * @inheritDoc
     */
    SkeletonAnimationSet.prototype.deactivate = function (shaderObject, stage) {
        //			var streamOffset:number /*uint*/ = pass.numUsedStreams;
        //			var context:IContextGL = <IContextGL> stage.context;
        //			context.setVertexBufferAt(streamOffset, null);
        //			context.setVertexBufferAt(streamOffset + 1, null);
    };
    /**
     * @inheritDoc
     */
    SkeletonAnimationSet.prototype.getAGALFragmentCode = function (shaderObject, shadedTarget) {
        return "";
    };
    /**
     * @inheritDoc
     */
    SkeletonAnimationSet.prototype.getAGALUVCode = function (shaderObject) {
        return "mov " + shaderObject.uvTarget + "," + shaderObject.uvSource + "\n";
    };
    /**
     * @inheritDoc
     */
    SkeletonAnimationSet.prototype.doneAGALCode = function (shaderObject) {
    };
    return SkeletonAnimationSet;
})(AnimationSetBase);
module.exports = SkeletonAnimationSet;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvU2tlbGV0b25BbmltYXRpb25TZXQudHMiXSwibmFtZXMiOlsiU2tlbGV0b25BbmltYXRpb25TZXQiLCJTa2VsZXRvbkFuaW1hdGlvblNldC5jb25zdHJ1Y3RvciIsIlNrZWxldG9uQW5pbWF0aW9uU2V0LmpvaW50c1BlclZlcnRleCIsIlNrZWxldG9uQW5pbWF0aW9uU2V0LmdldEFHQUxWZXJ0ZXhDb2RlIiwiU2tlbGV0b25BbmltYXRpb25TZXQuYWN0aXZhdGUiLCJTa2VsZXRvbkFuaW1hdGlvblNldC5kZWFjdGl2YXRlIiwiU2tlbGV0b25BbmltYXRpb25TZXQuZ2V0QUdBTEZyYWdtZW50Q29kZSIsIlNrZWxldG9uQW5pbWF0aW9uU2V0LmdldEFHQUxVVkNvZGUiLCJTa2VsZXRvbkFuaW1hdGlvblNldC5kb25lQUdBTENvZGUiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUlBLElBQU8sZ0JBQWdCLFdBQWUsa0RBQWtELENBQUMsQ0FBQztBQUcxRixBQUtBOzs7O0dBREc7SUFDRyxvQkFBb0I7SUFBU0EsVUFBN0JBLG9CQUFvQkEsVUFBeUJBO0lBYWxEQTs7OztPQUlHQTtJQUNIQSxTQWxCS0Esb0JBQW9CQSxDQWtCYkEsZUFBbUNBO1FBQW5DQywrQkFBbUNBLEdBQW5DQSxtQkFBbUNBO1FBRTlDQSxpQkFBT0EsQ0FBQ0E7UUFFUkEsSUFBSUEsQ0FBQ0EsZ0JBQWdCQSxHQUFHQSxlQUFlQSxDQUFDQTtJQUN6Q0EsQ0FBQ0E7SUFmREQsc0JBQVdBLGlEQUFlQTtRQUoxQkE7OztXQUdHQTthQUNIQTtZQUVDRSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxnQkFBZ0JBLENBQUNBO1FBQzlCQSxDQUFDQTs7O09BQUFGO0lBY0RBOztPQUVHQTtJQUNJQSxnREFBaUJBLEdBQXhCQSxVQUF5QkEsWUFBNkJBO1FBRXJERyxJQUFJQSxHQUFHQSxHQUFtQkEsWUFBWUEsQ0FBQ0Esb0JBQW9CQSxDQUFDQSxNQUFNQSxDQUFDQTtRQUVuRUEsSUFBSUEsWUFBWUEsR0FBbUJBLFlBQVlBLENBQUNBLHNCQUFzQkEsQ0FBQ0E7UUFDdkVBLElBQUlBLFlBQVlBLEdBQW1CQSxZQUFZQSxHQUFHQSxDQUFDQSxDQUFDQTtRQUNwREEsSUFBSUEsWUFBWUEsR0FBbUJBLFlBQVlBLEdBQUdBLENBQUNBLENBQUNBO1FBQ3BEQSxJQUFJQSxXQUFXQSxHQUFVQSxJQUFJQSxHQUFHQSxZQUFZQSxDQUFDQSxjQUFjQSxDQUFDQTtRQUM1REEsSUFBSUEsWUFBWUEsR0FBVUEsSUFBSUEsR0FBR0EsQ0FBQ0EsWUFBWUEsQ0FBQ0EsY0FBY0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDbkVBLElBQUlBLE9BQU9BLEdBQWlCQSxDQUFFQSxXQUFXQSxHQUFHQSxJQUFJQSxFQUFFQSxXQUFXQSxHQUFHQSxJQUFJQSxFQUFFQSxXQUFXQSxHQUFHQSxJQUFJQSxFQUFFQSxXQUFXQSxHQUFHQSxJQUFJQSxDQUFFQSxDQUFDQTtRQUMvR0EsSUFBSUEsT0FBT0EsR0FBaUJBLENBQUVBLFlBQVlBLEdBQUdBLElBQUlBLEVBQUVBLFlBQVlBLEdBQUdBLElBQUlBLEVBQUVBLFlBQVlBLEdBQUdBLElBQUlBLEVBQUVBLFlBQVlBLEdBQUdBLElBQUlBLENBQUVBLENBQUNBO1FBQ25IQSxJQUFJQSxLQUFLQSxHQUFVQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQSxZQUFZQSxDQUFDQSx3QkFBd0JBLENBQUNBLENBQUNBO1FBQzdFQSxJQUFJQSxLQUFLQSxHQUFVQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQSxZQUFZQSxDQUFDQSx3QkFBd0JBLEVBQUVBLEtBQUtBLENBQUNBLENBQUNBO1FBQ3BGQSxJQUFJQSxHQUFHQSxHQUFVQSxLQUFLQSxDQUFDQTtRQUN2QkEsSUFBSUEsSUFBSUEsR0FBVUEsRUFBRUEsQ0FBQ0E7UUFFckJBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQW1CQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxHQUFHQSxFQUFFQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQTtZQUU5Q0EsSUFBSUEsR0FBR0EsR0FBVUEsWUFBWUEsQ0FBQ0Esb0JBQW9CQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUV0REEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBbUJBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLGdCQUFnQkEsRUFBRUEsRUFBRUEsQ0FBQ0EsRUFBRUEsQ0FBQ0E7Z0JBQ2hFQSxJQUFJQSxJQUFJQSxHQUFHQSxHQUFHQSxHQUFHQSxHQUFHQSxLQUFLQSxHQUFHQSxNQUFNQSxHQUFHQSxHQUFHQSxHQUFHQSxPQUFPQSxHQUFHQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxHQUFHQSxHQUFHQSxZQUFZQSxHQUFHQSxLQUFLQSxHQUMzRkEsR0FBR0EsR0FBR0EsR0FBR0EsR0FBR0EsS0FBS0EsR0FBR0EsTUFBTUEsR0FBR0EsR0FBR0EsR0FBR0EsT0FBT0EsR0FBR0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsR0FBR0EsR0FBR0EsWUFBWUEsR0FBR0EsS0FBS0EsR0FDcEZBLEdBQUdBLEdBQUdBLEdBQUdBLEdBQUdBLEtBQUtBLEdBQUdBLE1BQU1BLEdBQUdBLEdBQUdBLEdBQUdBLE9BQU9BLEdBQUdBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLEdBQUdBLEdBQUdBLFlBQVlBLEdBQUdBLEtBQUtBLEdBQ3BGQSxNQUFNQSxHQUFHQSxLQUFLQSxHQUFHQSxNQUFNQSxHQUFHQSxHQUFHQSxHQUFHQSxNQUFNQSxHQUN0Q0EsTUFBTUEsR0FBR0EsS0FBS0EsR0FBR0EsSUFBSUEsR0FBR0EsS0FBS0EsR0FBR0EsSUFBSUEsR0FBR0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsRUFBRUEsZUFBZUE7Z0JBRTFFQSxBQUNBQSw2RkFENkZBO2dCQUM3RkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7b0JBQ1ZBLElBQUlBLElBQUlBLE1BQU1BLEdBQUdBLEtBQUtBLEdBQUdBLElBQUlBLEdBQUdBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBO2dCQUFDQSxJQUFJQTtvQkFDbERBLElBQUlBLElBQUlBLE1BQU1BLEdBQUdBLEtBQUtBLEdBQUdBLElBQUlBLEdBQUdBLEtBQUtBLEdBQUdBLElBQUlBLEdBQUdBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBO1lBQzlEQSxDQUFDQTtZQUNEQSxBQUNBQSwrR0FEK0dBO1lBQy9HQSxHQUFHQSxHQUFHQSxLQUFLQSxDQUFDQTtZQUNaQSxJQUFJQSxJQUFJQSxNQUFNQSxHQUFHQSxZQUFZQSxDQUFDQSx3QkFBd0JBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLEdBQUdBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBO1FBQ2pGQSxDQUFDQTtRQUVEQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQTtJQUNiQSxDQUFDQTtJQUVESDs7T0FFR0E7SUFDSUEsdUNBQVFBLEdBQWZBLFVBQWdCQSxZQUE2QkEsRUFBRUEsS0FBV0E7SUFFMURJLENBQUNBO0lBRURKOztPQUVHQTtJQUNJQSx5Q0FBVUEsR0FBakJBLFVBQWtCQSxZQUE2QkEsRUFBRUEsS0FBV0E7UUFFN0RLLDREQUE0REE7UUFDNURBLHlEQUF5REE7UUFDekRBLG1EQUFtREE7UUFDbkRBLHVEQUF1REE7SUFDdERBLENBQUNBO0lBRURMOztPQUVHQTtJQUNJQSxrREFBbUJBLEdBQTFCQSxVQUEyQkEsWUFBNkJBLEVBQUVBLFlBQW1CQTtRQUU1RU0sTUFBTUEsQ0FBQ0EsRUFBRUEsQ0FBQ0E7SUFDWEEsQ0FBQ0E7SUFFRE47O09BRUdBO0lBQ0lBLDRDQUFhQSxHQUFwQkEsVUFBcUJBLFlBQTZCQTtRQUVqRE8sTUFBTUEsQ0FBQ0EsTUFBTUEsR0FBR0EsWUFBWUEsQ0FBQ0EsUUFBUUEsR0FBR0EsR0FBR0EsR0FBR0EsWUFBWUEsQ0FBQ0EsUUFBUUEsR0FBR0EsSUFBSUEsQ0FBQ0E7SUFDNUVBLENBQUNBO0lBRURQOztPQUVHQTtJQUNJQSwyQ0FBWUEsR0FBbkJBLFVBQW9CQSxZQUE2QkE7SUFHakRRLENBQUNBO0lBQ0ZSLDJCQUFDQTtBQUFEQSxDQTdHQSxBQTZHQ0EsRUE3R2tDLGdCQUFnQixFQTZHbEQ7QUFFRCxBQUE4QixpQkFBckIsb0JBQW9CLENBQUMiLCJmaWxlIjoiYW5pbWF0b3JzL1NrZWxldG9uQW5pbWF0aW9uU2V0LmpzIiwic291cmNlUm9vdCI6Ii4uLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBJQW5pbWF0aW9uU2V0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9hbmltYXRvcnMvSUFuaW1hdGlvblNldFwiKTtcclxuXHJcbmltcG9ydCBTdGFnZVx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2Jhc2UvU3RhZ2VcIik7XHJcblxyXG5pbXBvcnQgQW5pbWF0aW9uU2V0QmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL0FuaW1hdGlvblNldEJhc2VcIik7XHJcbmltcG9ydCBTaGFkZXJPYmplY3RCYXNlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9jb21waWxhdGlvbi9TaGFkZXJPYmplY3RCYXNlXCIpO1xyXG5cclxuLyoqXHJcbiAqIFRoZSBhbmltYXRpb24gZGF0YSBzZXQgdXNlZCBieSBza2VsZXRvbi1iYXNlZCBhbmltYXRvcnMsIGNvbnRhaW5pbmcgc2tlbGV0b24gYW5pbWF0aW9uIGRhdGEuXHJcbiAqXHJcbiAqIEBzZWUgYXdheS5hbmltYXRvcnMuU2tlbGV0b25BbmltYXRvclxyXG4gKi9cclxuY2xhc3MgU2tlbGV0b25BbmltYXRpb25TZXQgZXh0ZW5kcyBBbmltYXRpb25TZXRCYXNlIGltcGxlbWVudHMgSUFuaW1hdGlvblNldFxyXG57XHJcblx0cHJpdmF0ZSBfam9pbnRzUGVyVmVydGV4Om51bWJlciAvKnVpbnQqLztcclxuXHJcblx0LyoqXHJcblx0ICogUmV0dXJucyB0aGUgYW1vdW50IG9mIHNrZWxldG9uIGpvaW50cyB0aGF0IGNhbiBiZSBsaW5rZWQgdG8gYSBzaW5nbGUgdmVydGV4IHZpYSBza2lubmVkIHdlaWdodCB2YWx1ZXMuIEZvciBHUFUtYmFzZSBhbmltYXRpb24sIHRoZVxyXG5cdCAqIG1heGltdW0gYWxsb3dlZCB2YWx1ZSBpcyA0LlxyXG5cdCAqL1xyXG5cdHB1YmxpYyBnZXQgam9pbnRzUGVyVmVydGV4KCk6bnVtYmVyIC8qdWludCovXHJcblx0e1xyXG5cdFx0cmV0dXJuIHRoaXMuX2pvaW50c1BlclZlcnRleDtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIENyZWF0ZXMgYSBuZXcgPGNvZGU+U2tlbGV0b25BbmltYXRpb25TZXQ8L2NvZGU+IG9iamVjdC5cclxuXHQgKlxyXG5cdCAqIEBwYXJhbSBqb2ludHNQZXJWZXJ0ZXggU2V0cyB0aGUgYW1vdW50IG9mIHNrZWxldG9uIGpvaW50cyB0aGF0IGNhbiBiZSBsaW5rZWQgdG8gYSBzaW5nbGUgdmVydGV4IHZpYSBza2lubmVkIHdlaWdodCB2YWx1ZXMuIEZvciBHUFUtYmFzZSBhbmltYXRpb24sIHRoZSBtYXhpbXVtIGFsbG93ZWQgdmFsdWUgaXMgNC4gRGVmYXVsdHMgdG8gNC5cclxuXHQgKi9cclxuXHRjb25zdHJ1Y3Rvcihqb2ludHNQZXJWZXJ0ZXg6bnVtYmVyIC8qdWludCovID0gNClcclxuXHR7XHJcblx0XHRzdXBlcigpO1xyXG5cclxuXHRcdHRoaXMuX2pvaW50c1BlclZlcnRleCA9IGpvaW50c1BlclZlcnRleDtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEBpbmhlcml0RG9jXHJcblx0ICovXHJcblx0cHVibGljIGdldEFHQUxWZXJ0ZXhDb2RlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlKTpzdHJpbmdcclxuXHR7XHJcblx0XHR2YXIgbGVuOm51bWJlciAvKnVpbnQqLyA9IHNoYWRlck9iamVjdC5hbmltYXRhYmxlQXR0cmlidXRlcy5sZW5ndGg7XHJcblxyXG5cdFx0dmFyIGluZGV4T2Zmc2V0MDpudW1iZXIgLyp1aW50Ki8gPSBzaGFkZXJPYmplY3QubnVtVXNlZFZlcnRleENvbnN0YW50cztcclxuXHRcdHZhciBpbmRleE9mZnNldDE6bnVtYmVyIC8qdWludCovID0gaW5kZXhPZmZzZXQwICsgMTtcclxuXHRcdHZhciBpbmRleE9mZnNldDI6bnVtYmVyIC8qdWludCovID0gaW5kZXhPZmZzZXQwICsgMjtcclxuXHRcdHZhciBpbmRleFN0cmVhbTpzdHJpbmcgPSBcInZhXCIgKyBzaGFkZXJPYmplY3QubnVtVXNlZFN0cmVhbXM7XHJcblx0XHR2YXIgd2VpZ2h0U3RyZWFtOnN0cmluZyA9IFwidmFcIiArIChzaGFkZXJPYmplY3QubnVtVXNlZFN0cmVhbXMgKyAxKTtcclxuXHRcdHZhciBpbmRpY2VzOkFycmF5PHN0cmluZz4gPSBbIGluZGV4U3RyZWFtICsgXCIueFwiLCBpbmRleFN0cmVhbSArIFwiLnlcIiwgaW5kZXhTdHJlYW0gKyBcIi56XCIsIGluZGV4U3RyZWFtICsgXCIud1wiIF07XHJcblx0XHR2YXIgd2VpZ2h0czpBcnJheTxzdHJpbmc+ID0gWyB3ZWlnaHRTdHJlYW0gKyBcIi54XCIsIHdlaWdodFN0cmVhbSArIFwiLnlcIiwgd2VpZ2h0U3RyZWFtICsgXCIuelwiLCB3ZWlnaHRTdHJlYW0gKyBcIi53XCIgXTtcclxuXHRcdHZhciB0ZW1wMTpzdHJpbmcgPSB0aGlzLl9wRmluZFRlbXBSZWcoc2hhZGVyT2JqZWN0LmFuaW1hdGlvblRhcmdldFJlZ2lzdGVycyk7XHJcblx0XHR2YXIgdGVtcDI6c3RyaW5nID0gdGhpcy5fcEZpbmRUZW1wUmVnKHNoYWRlck9iamVjdC5hbmltYXRpb25UYXJnZXRSZWdpc3RlcnMsIHRlbXAxKTtcclxuXHRcdHZhciBkb3Q6c3RyaW5nID0gXCJkcDRcIjtcclxuXHRcdHZhciBjb2RlOnN0cmluZyA9IFwiXCI7XHJcblxyXG5cdFx0Zm9yICh2YXIgaTpudW1iZXIgLyp1aW50Ki8gPSAwOyBpIDwgbGVuOyArK2kpIHtcclxuXHJcblx0XHRcdHZhciBzcmM6c3RyaW5nID0gc2hhZGVyT2JqZWN0LmFuaW1hdGFibGVBdHRyaWJ1dGVzW2ldO1xyXG5cclxuXHRcdFx0Zm9yICh2YXIgajpudW1iZXIgLyp1aW50Ki8gPSAwOyBqIDwgdGhpcy5fam9pbnRzUGVyVmVydGV4OyArK2opIHtcclxuXHRcdFx0XHRjb2RlICs9IGRvdCArIFwiIFwiICsgdGVtcDEgKyBcIi54LCBcIiArIHNyYyArIFwiLCB2Y1tcIiArIGluZGljZXNbal0gKyBcIitcIiArIGluZGV4T2Zmc2V0MCArIFwiXVxcblwiICtcclxuXHRcdFx0XHRcdGRvdCArIFwiIFwiICsgdGVtcDEgKyBcIi55LCBcIiArIHNyYyArIFwiLCB2Y1tcIiArIGluZGljZXNbal0gKyBcIitcIiArIGluZGV4T2Zmc2V0MSArIFwiXVxcblwiICtcclxuXHRcdFx0XHRcdGRvdCArIFwiIFwiICsgdGVtcDEgKyBcIi56LCBcIiArIHNyYyArIFwiLCB2Y1tcIiArIGluZGljZXNbal0gKyBcIitcIiArIGluZGV4T2Zmc2V0MiArIFwiXVxcblwiICtcclxuXHRcdFx0XHRcdFwibW92IFwiICsgdGVtcDEgKyBcIi53LCBcIiArIHNyYyArIFwiLndcXG5cIiArXHJcblx0XHRcdFx0XHRcIm11bCBcIiArIHRlbXAxICsgXCIsIFwiICsgdGVtcDEgKyBcIiwgXCIgKyB3ZWlnaHRzW2pdICsgXCJcXG5cIjsgLy8gYXBwbHkgd2VpZ2h0XHJcblxyXG5cdFx0XHRcdC8vIGFkZCBvciBtb3YgdG8gdGFyZ2V0LiBOZWVkIHRvIHdyaXRlIHRvIGEgdGVtcCByZWcgZmlyc3QsIGJlY2F1c2UgYW4gb3V0cHV0IGNhbiBiZSBhIHRhcmdldFxyXG5cdFx0XHRcdGlmIChqID09IDApXHJcblx0XHRcdFx0XHRjb2RlICs9IFwibW92IFwiICsgdGVtcDIgKyBcIiwgXCIgKyB0ZW1wMSArIFwiXFxuXCI7IGVsc2VcclxuXHRcdFx0XHRcdGNvZGUgKz0gXCJhZGQgXCIgKyB0ZW1wMiArIFwiLCBcIiArIHRlbXAyICsgXCIsIFwiICsgdGVtcDEgKyBcIlxcblwiO1xyXG5cdFx0XHR9XHJcblx0XHRcdC8vIHN3aXRjaCB0byBkcDMgb25jZSBwb3NpdGlvbnMgaGF2ZSBiZWVuIHRyYW5zZm9ybWVkLCBmcm9tIG5vdyBvbiwgaXQgc2hvdWxkIG9ubHkgYmUgdmVjdG9ycyBpbnN0ZWFkIG9mIHBvaW50c1xyXG5cdFx0XHRkb3QgPSBcImRwM1wiO1xyXG5cdFx0XHRjb2RlICs9IFwibW92IFwiICsgc2hhZGVyT2JqZWN0LmFuaW1hdGlvblRhcmdldFJlZ2lzdGVyc1tpXSArIFwiLCBcIiArIHRlbXAyICsgXCJcXG5cIjtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gY29kZTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEBpbmhlcml0RG9jXHJcblx0ICovXHJcblx0cHVibGljIGFjdGl2YXRlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCBzdGFnZTpTdGFnZSlcclxuXHR7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBAaW5oZXJpdERvY1xyXG5cdCAqL1xyXG5cdHB1YmxpYyBkZWFjdGl2YXRlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCBzdGFnZTpTdGFnZSlcclxuXHR7XHJcbi8vXHRcdFx0dmFyIHN0cmVhbU9mZnNldDpudW1iZXIgLyp1aW50Ki8gPSBwYXNzLm51bVVzZWRTdHJlYW1zO1xyXG4vL1x0XHRcdHZhciBjb250ZXh0OklDb250ZXh0R0wgPSA8SUNvbnRleHRHTD4gc3RhZ2UuY29udGV4dDtcclxuLy9cdFx0XHRjb250ZXh0LnNldFZlcnRleEJ1ZmZlckF0KHN0cmVhbU9mZnNldCwgbnVsbCk7XHJcbi8vXHRcdFx0Y29udGV4dC5zZXRWZXJ0ZXhCdWZmZXJBdChzdHJlYW1PZmZzZXQgKyAxLCBudWxsKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEBpbmhlcml0RG9jXHJcblx0ICovXHJcblx0cHVibGljIGdldEFHQUxGcmFnbWVudENvZGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIHNoYWRlZFRhcmdldDpzdHJpbmcpOnN0cmluZ1xyXG5cdHtcclxuXHRcdHJldHVybiBcIlwiO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQGluaGVyaXREb2NcclxuXHQgKi9cclxuXHRwdWJsaWMgZ2V0QUdBTFVWQ29kZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSk6c3RyaW5nXHJcblx0e1xyXG5cdFx0cmV0dXJuIFwibW92IFwiICsgc2hhZGVyT2JqZWN0LnV2VGFyZ2V0ICsgXCIsXCIgKyBzaGFkZXJPYmplY3QudXZTb3VyY2UgKyBcIlxcblwiO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQGluaGVyaXREb2NcclxuXHQgKi9cclxuXHRwdWJsaWMgZG9uZUFHQUxDb2RlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlKVxyXG5cdHtcclxuXHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgPSBTa2VsZXRvbkFuaW1hdGlvblNldDsiXX0=