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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvU2tlbGV0b25BbmltYXRpb25TZXQudHMiXSwibmFtZXMiOlsiU2tlbGV0b25BbmltYXRpb25TZXQiLCJTa2VsZXRvbkFuaW1hdGlvblNldC5jb25zdHJ1Y3RvciIsIlNrZWxldG9uQW5pbWF0aW9uU2V0LmpvaW50c1BlclZlcnRleCIsIlNrZWxldG9uQW5pbWF0aW9uU2V0LmdldEFHQUxWZXJ0ZXhDb2RlIiwiU2tlbGV0b25BbmltYXRpb25TZXQuYWN0aXZhdGUiLCJTa2VsZXRvbkFuaW1hdGlvblNldC5kZWFjdGl2YXRlIiwiU2tlbGV0b25BbmltYXRpb25TZXQuZ2V0QUdBTEZyYWdtZW50Q29kZSIsIlNrZWxldG9uQW5pbWF0aW9uU2V0LmdldEFHQUxVVkNvZGUiLCJTa2VsZXRvbkFuaW1hdGlvblNldC5kb25lQUdBTENvZGUiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUlBLElBQU8sZ0JBQWdCLFdBQWUsa0RBQWtELENBQUMsQ0FBQztBQUcxRixBQUtBOzs7O0dBREc7SUFDRyxvQkFBb0I7SUFBU0EsVUFBN0JBLG9CQUFvQkEsVUFBeUJBO0lBYWxEQTs7OztPQUlHQTtJQUNIQSxTQWxCS0Esb0JBQW9CQSxDQWtCYkEsZUFBbUNBO1FBQW5DQywrQkFBbUNBLEdBQW5DQSxtQkFBbUNBO1FBRTlDQSxpQkFBT0EsQ0FBQ0E7UUFFUkEsSUFBSUEsQ0FBQ0EsZ0JBQWdCQSxHQUFHQSxlQUFlQSxDQUFDQTtJQUN6Q0EsQ0FBQ0E7SUFmREQsc0JBQVdBLGlEQUFlQTtRQUoxQkE7OztXQUdHQTthQUNIQTtZQUVDRSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxnQkFBZ0JBLENBQUNBO1FBQzlCQSxDQUFDQTs7O09BQUFGO0lBY0RBOztPQUVHQTtJQUNJQSxnREFBaUJBLEdBQXhCQSxVQUF5QkEsWUFBNkJBO1FBRXJERyxJQUFJQSxHQUFHQSxHQUFtQkEsWUFBWUEsQ0FBQ0Esb0JBQW9CQSxDQUFDQSxNQUFNQSxD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OztPQUVHQTtJQUNJQSwyQ0FBWUEsR0FBbkJBLFVBQW9CQSxZQUE2QkE7SUFHakRRLENBQUNBO0lBQ0ZSLDJCQUFDQTtBQUFEQSxDQTdHQSxBQTZHQ0EsRUE3R2tDLGdCQUFnQixFQTZHbEQ7QUFFRCxBQUE4QixpQkFBckIsb0JBQW9CLENBQUMiLCJmaWxlIjoiYW5pbWF0b3JzL1NrZWxldG9uQW5pbWF0aW9uU2V0LmpzIiwic291cmNlUm9vdCI6Ii4uLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBJQW5pbWF0aW9uU2V0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9hbmltYXRvcnMvSUFuaW1hdGlvblNldFwiKTtcblxuaW1wb3J0IFN0YWdlXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvYmFzZS9TdGFnZVwiKTtcblxuaW1wb3J0IEFuaW1hdGlvblNldEJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9BbmltYXRpb25TZXRCYXNlXCIpO1xuaW1wb3J0IFNoYWRlck9iamVjdEJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2NvbXBpbGF0aW9uL1NoYWRlck9iamVjdEJhc2VcIik7XG5cbi8qKlxuICogVGhlIGFuaW1hdGlvbiBkYXRhIHNldCB1c2VkIGJ5IHNrZWxldG9uLWJhc2VkIGFuaW1hdG9ycywgY29udGFpbmluZyBza2VsZXRvbiBhbmltYXRpb24gZGF0YS5cbiAqXG4gKiBAc2VlIGF3YXkuYW5pbWF0b3JzLlNrZWxldG9uQW5pbWF0b3JcbiAqL1xuY2xhc3MgU2tlbGV0b25BbmltYXRpb25TZXQgZXh0ZW5kcyBBbmltYXRpb25TZXRCYXNlIGltcGxlbWVudHMgSUFuaW1hdGlvblNldFxue1xuXHRwcml2YXRlIF9qb2ludHNQZXJWZXJ0ZXg6bnVtYmVyIC8qdWludCovO1xuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSBhbW91bnQgb2Ygc2tlbGV0b24gam9pbnRzIHRoYXQgY2FuIGJlIGxpbmtlZCB0byBhIHNpbmdsZSB2ZXJ0ZXggdmlhIHNraW5uZWQgd2VpZ2h0IHZhbHVlcy4gRm9yIEdQVS1iYXNlIGFuaW1hdGlvbiwgdGhlXG5cdCAqIG1heGltdW0gYWxsb3dlZCB2YWx1ZSBpcyA0LlxuXHQgKi9cblx0cHVibGljIGdldCBqb2ludHNQZXJWZXJ0ZXgoKTpudW1iZXIgLyp1aW50Ki9cblx0e1xuXHRcdHJldHVybiB0aGlzLl9qb2ludHNQZXJWZXJ0ZXg7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyA8Y29kZT5Ta2VsZXRvbkFuaW1hdGlvblNldDwvY29kZT4gb2JqZWN0LlxuXHQgKlxuXHQgKiBAcGFyYW0gam9pbnRzUGVyVmVydGV4IFNldHMgdGhlIGFtb3VudCBvZiBza2VsZXRvbiBqb2ludHMgdGhhdCBjYW4gYmUgbGlua2VkIHRvIGEgc2luZ2xlIHZlcnRleCB2aWEgc2tpbm5lZCB3ZWlnaHQgdmFsdWVzLiBGb3IgR1BVLWJhc2UgYW5pbWF0aW9uLCB0aGUgbWF4aW11bSBhbGxvd2VkIHZhbHVlIGlzIDQuIERlZmF1bHRzIHRvIDQuXG5cdCAqL1xuXHRjb25zdHJ1Y3Rvcihqb2ludHNQZXJWZXJ0ZXg6bnVtYmVyIC8qdWludCovID0gNClcblx0e1xuXHRcdHN1cGVyKCk7XG5cblx0XHR0aGlzLl9qb2ludHNQZXJWZXJ0ZXggPSBqb2ludHNQZXJWZXJ0ZXg7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBnZXRBR0FMVmVydGV4Q29kZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSk6c3RyaW5nXG5cdHtcblx0XHR2YXIgbGVuOm51bWJlciAvKnVpbnQqLyA9IHNoYWRlck9iamVjdC5hbmltYXRhYmxlQXR0cmlidXRlcy5sZW5ndGg7XG5cblx0XHR2YXIgaW5kZXhPZmZzZXQwOm51bWJlciAvKnVpbnQqLyA9IHNoYWRlck9iamVjdC5udW1Vc2VkVmVydGV4Q29uc3RhbnRzO1xuXHRcdHZhciBpbmRleE9mZnNldDE6bnVtYmVyIC8qdWludCovID0gaW5kZXhPZmZzZXQwICsgMTtcblx0XHR2YXIgaW5kZXhPZmZzZXQyOm51bWJlciAvKnVpbnQqLyA9IGluZGV4T2Zmc2V0MCArIDI7XG5cdFx0dmFyIGluZGV4U3RyZWFtOnN0cmluZyA9IFwidmFcIiArIHNoYWRlck9iamVjdC5udW1Vc2VkU3RyZWFtcztcblx0XHR2YXIgd2VpZ2h0U3RyZWFtOnN0cmluZyA9IFwidmFcIiArIChzaGFkZXJPYmplY3QubnVtVXNlZFN0cmVhbXMgKyAxKTtcblx0XHR2YXIgaW5kaWNlczpBcnJheTxzdHJpbmc+ID0gWyBpbmRleFN0cmVhbSArIFwiLnhcIiwgaW5kZXhTdHJlYW0gKyBcIi55XCIsIGluZGV4U3RyZWFtICsgXCIuelwiLCBpbmRleFN0cmVhbSArIFwiLndcIiBdO1xuXHRcdHZhciB3ZWlnaHRzOkFycmF5PHN0cmluZz4gPSBbIHdlaWdodFN0cmVhbSArIFwiLnhcIiwgd2VpZ2h0U3RyZWFtICsgXCIueVwiLCB3ZWlnaHRTdHJlYW0gKyBcIi56XCIsIHdlaWdodFN0cmVhbSArIFwiLndcIiBdO1xuXHRcdHZhciB0ZW1wMTpzdHJpbmcgPSB0aGlzLl9wRmluZFRlbXBSZWcoc2hhZGVyT2JqZWN0LmFuaW1hdGlvblRhcmdldFJlZ2lzdGVycyk7XG5cdFx0dmFyIHRlbXAyOnN0cmluZyA9IHRoaXMuX3BGaW5kVGVtcFJlZyhzaGFkZXJPYmplY3QuYW5pbWF0aW9uVGFyZ2V0UmVnaXN0ZXJzLCB0ZW1wMSk7XG5cdFx0dmFyIGRvdDpzdHJpbmcgPSBcImRwNFwiO1xuXHRcdHZhciBjb2RlOnN0cmluZyA9IFwiXCI7XG5cblx0XHRmb3IgKHZhciBpOm51bWJlciAvKnVpbnQqLyA9IDA7IGkgPCBsZW47ICsraSkge1xuXG5cdFx0XHR2YXIgc3JjOnN0cmluZyA9IHNoYWRlck9iamVjdC5hbmltYXRhYmxlQXR0cmlidXRlc1tpXTtcblxuXHRcdFx0Zm9yICh2YXIgajpudW1iZXIgLyp1aW50Ki8gPSAwOyBqIDwgdGhpcy5fam9pbnRzUGVyVmVydGV4OyArK2opIHtcblx0XHRcdFx0Y29kZSArPSBkb3QgKyBcIiBcIiArIHRlbXAxICsgXCIueCwgXCIgKyBzcmMgKyBcIiwgdmNbXCIgKyBpbmRpY2VzW2pdICsgXCIrXCIgKyBpbmRleE9mZnNldDAgKyBcIl1cXG5cIiArXG5cdFx0XHRcdFx0ZG90ICsgXCIgXCIgKyB0ZW1wMSArIFwiLnksIFwiICsgc3JjICsgXCIsIHZjW1wiICsgaW5kaWNlc1tqXSArIFwiK1wiICsgaW5kZXhPZmZzZXQxICsgXCJdXFxuXCIgK1xuXHRcdFx0XHRcdGRvdCArIFwiIFwiICsgdGVtcDEgKyBcIi56LCBcIiArIHNyYyArIFwiLCB2Y1tcIiArIGluZGljZXNbal0gKyBcIitcIiArIGluZGV4T2Zmc2V0MiArIFwiXVxcblwiICtcblx0XHRcdFx0XHRcIm1vdiBcIiArIHRlbXAxICsgXCIudywgXCIgKyBzcmMgKyBcIi53XFxuXCIgK1xuXHRcdFx0XHRcdFwibXVsIFwiICsgdGVtcDEgKyBcIiwgXCIgKyB0ZW1wMSArIFwiLCBcIiArIHdlaWdodHNbal0gKyBcIlxcblwiOyAvLyBhcHBseSB3ZWlnaHRcblxuXHRcdFx0XHQvLyBhZGQgb3IgbW92IHRvIHRhcmdldC4gTmVlZCB0byB3cml0ZSB0byBhIHRlbXAgcmVnIGZpcnN0LCBiZWNhdXNlIGFuIG91dHB1dCBjYW4gYmUgYSB0YXJnZXRcblx0XHRcdFx0aWYgKGogPT0gMClcblx0XHRcdFx0XHRjb2RlICs9IFwibW92IFwiICsgdGVtcDIgKyBcIiwgXCIgKyB0ZW1wMSArIFwiXFxuXCI7IGVsc2Vcblx0XHRcdFx0XHRjb2RlICs9IFwiYWRkIFwiICsgdGVtcDIgKyBcIiwgXCIgKyB0ZW1wMiArIFwiLCBcIiArIHRlbXAxICsgXCJcXG5cIjtcblx0XHRcdH1cblx0XHRcdC8vIHN3aXRjaCB0byBkcDMgb25jZSBwb3NpdGlvbnMgaGF2ZSBiZWVuIHRyYW5zZm9ybWVkLCBmcm9tIG5vdyBvbiwgaXQgc2hvdWxkIG9ubHkgYmUgdmVjdG9ycyBpbnN0ZWFkIG9mIHBvaW50c1xuXHRcdFx0ZG90ID0gXCJkcDNcIjtcblx0XHRcdGNvZGUgKz0gXCJtb3YgXCIgKyBzaGFkZXJPYmplY3QuYW5pbWF0aW9uVGFyZ2V0UmVnaXN0ZXJzW2ldICsgXCIsIFwiICsgdGVtcDIgKyBcIlxcblwiO1xuXHRcdH1cblxuXHRcdHJldHVybiBjb2RlO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgYWN0aXZhdGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIHN0YWdlOlN0YWdlKVxuXHR7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBkZWFjdGl2YXRlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCBzdGFnZTpTdGFnZSlcblx0e1xuLy9cdFx0XHR2YXIgc3RyZWFtT2Zmc2V0Om51bWJlciAvKnVpbnQqLyA9IHBhc3MubnVtVXNlZFN0cmVhbXM7XG4vL1x0XHRcdHZhciBjb250ZXh0OklDb250ZXh0R0wgPSA8SUNvbnRleHRHTD4gc3RhZ2UuY29udGV4dDtcbi8vXHRcdFx0Y29udGV4dC5zZXRWZXJ0ZXhCdWZmZXJBdChzdHJlYW1PZmZzZXQsIG51bGwpO1xuLy9cdFx0XHRjb250ZXh0LnNldFZlcnRleEJ1ZmZlckF0KHN0cmVhbU9mZnNldCArIDEsIG51bGwpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgZ2V0QUdBTEZyYWdtZW50Q29kZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgc2hhZGVkVGFyZ2V0OnN0cmluZyk6c3RyaW5nXG5cdHtcblx0XHRyZXR1cm4gXCJcIjtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGdldEFHQUxVVkNvZGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UpOnN0cmluZ1xuXHR7XG5cdFx0cmV0dXJuIFwibW92IFwiICsgc2hhZGVyT2JqZWN0LnV2VGFyZ2V0ICsgXCIsXCIgKyBzaGFkZXJPYmplY3QudXZTb3VyY2UgKyBcIlxcblwiO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgZG9uZUFHQUxDb2RlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlKVxuXHR7XG5cblx0fVxufVxuXG5leHBvcnQgPSBTa2VsZXRvbkFuaW1hdGlvblNldDsiXX0=