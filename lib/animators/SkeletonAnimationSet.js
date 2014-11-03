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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvc2tlbGV0b25hbmltYXRpb25zZXQudHMiXSwibmFtZXMiOlsiU2tlbGV0b25BbmltYXRpb25TZXQiLCJTa2VsZXRvbkFuaW1hdGlvblNldC5jb25zdHJ1Y3RvciIsIlNrZWxldG9uQW5pbWF0aW9uU2V0LmpvaW50c1BlclZlcnRleCIsIlNrZWxldG9uQW5pbWF0aW9uU2V0LmdldEFHQUxWZXJ0ZXhDb2RlIiwiU2tlbGV0b25BbmltYXRpb25TZXQuYWN0aXZhdGUiLCJTa2VsZXRvbkFuaW1hdGlvblNldC5kZWFjdGl2YXRlIiwiU2tlbGV0b25BbmltYXRpb25TZXQuZ2V0QUdBTEZyYWdtZW50Q29kZSIsIlNrZWxldG9uQW5pbWF0aW9uU2V0LmdldEFHQUxVVkNvZGUiLCJTa2VsZXRvbkFuaW1hdGlvblNldC5kb25lQUdBTENvZGUiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUlBLElBQU8sZ0JBQWdCLFdBQWUsa0RBQWtELENBQUMsQ0FBQztBQUcxRixBQUtBOzs7O0dBREc7SUFDRyxvQkFBb0I7SUFBU0EsVUFBN0JBLG9CQUFvQkEsVUFBeUJBO0lBYWxEQTs7OztPQUlHQTtJQUNIQSxTQWxCS0Esb0JBQW9CQSxDQWtCYkEsZUFBbUNBO1FBQW5DQywrQkFBbUNBLEdBQW5DQSxtQkFBbUNBO1FBRTlDQSxpQkFBT0EsQ0FBQ0E7UUFFUkEsSUFBSUEsQ0FBQ0EsZ0JBQWdCQSxHQUFHQSxlQUFlQSxDQUFDQTtJQUN6Q0EsQ0FBQ0E7SUFmREQsc0JBQVdBLGlEQUFlQTtRQUoxQkE7OztXQUdHQTthQUNIQTtZQUVDRSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxnQkFBZ0JBLENBQUNBO1FBQzlCQSxDQUFDQTs7O09BQUFGO0lBY0RBOztPQUVHQTtJQUNJQSxnREFBaUJBLEdBQXhCQSxVQUF5QkEsWUFBNkJBO1FBRXJERyxJQUFJQSxHQUFHQSxHQUFtQkEsWUFBWUEsQ0FBQ0Esb0JBQW9CQSxDQUFDQSxNQUFNQSxD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OztPQUVHQTtJQUNJQSwyQ0FBWUEsR0FBbkJBLFVBQW9CQSxZQUE2QkE7SUFHakRRLENBQUNBO0lBQ0ZSLDJCQUFDQTtBQUFEQSxDQTdHQSxBQTZHQ0EsRUE3R2tDLGdCQUFnQixFQTZHbEQ7QUFFRCxBQUE4QixpQkFBckIsb0JBQW9CLENBQUMiLCJmaWxlIjoiYW5pbWF0b3JzL1NrZWxldG9uQW5pbWF0aW9uU2V0LmpzIiwic291cmNlUm9vdCI6Ii4uLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBJQW5pbWF0aW9uU2V0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9hbmltYXRvcnMvSUFuaW1hdGlvblNldFwiKTtcblxuaW1wb3J0IFN0YWdlXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvYmFzZS9TdGFnZVwiKTtcblxuaW1wb3J0IEFuaW1hdGlvblNldEJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9BbmltYXRpb25TZXRCYXNlXCIpO1xuaW1wb3J0IFNoYWRlck9iamVjdEJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL21hdGVyaWFscy9jb21waWxhdGlvbi9TaGFkZXJPYmplY3RCYXNlXCIpO1xuXG4vKipcbiAqIFRoZSBhbmltYXRpb24gZGF0YSBzZXQgdXNlZCBieSBza2VsZXRvbi1iYXNlZCBhbmltYXRvcnMsIGNvbnRhaW5pbmcgc2tlbGV0b24gYW5pbWF0aW9uIGRhdGEuXG4gKlxuICogQHNlZSBhd2F5LmFuaW1hdG9ycy5Ta2VsZXRvbkFuaW1hdG9yXG4gKi9cbmNsYXNzIFNrZWxldG9uQW5pbWF0aW9uU2V0IGV4dGVuZHMgQW5pbWF0aW9uU2V0QmFzZSBpbXBsZW1lbnRzIElBbmltYXRpb25TZXRcbntcblx0cHJpdmF0ZSBfam9pbnRzUGVyVmVydGV4Om51bWJlciAvKnVpbnQqLztcblxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgYW1vdW50IG9mIHNrZWxldG9uIGpvaW50cyB0aGF0IGNhbiBiZSBsaW5rZWQgdG8gYSBzaW5nbGUgdmVydGV4IHZpYSBza2lubmVkIHdlaWdodCB2YWx1ZXMuIEZvciBHUFUtYmFzZSBhbmltYXRpb24sIHRoZVxuXHQgKiBtYXhpbXVtIGFsbG93ZWQgdmFsdWUgaXMgNC5cblx0ICovXG5cdHB1YmxpYyBnZXQgam9pbnRzUGVyVmVydGV4KCk6bnVtYmVyIC8qdWludCovXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fam9pbnRzUGVyVmVydGV4O1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBuZXcgPGNvZGU+U2tlbGV0b25BbmltYXRpb25TZXQ8L2NvZGU+IG9iamVjdC5cblx0ICpcblx0ICogQHBhcmFtIGpvaW50c1BlclZlcnRleCBTZXRzIHRoZSBhbW91bnQgb2Ygc2tlbGV0b24gam9pbnRzIHRoYXQgY2FuIGJlIGxpbmtlZCB0byBhIHNpbmdsZSB2ZXJ0ZXggdmlhIHNraW5uZWQgd2VpZ2h0IHZhbHVlcy4gRm9yIEdQVS1iYXNlIGFuaW1hdGlvbiwgdGhlIG1heGltdW0gYWxsb3dlZCB2YWx1ZSBpcyA0LiBEZWZhdWx0cyB0byA0LlxuXHQgKi9cblx0Y29uc3RydWN0b3Ioam9pbnRzUGVyVmVydGV4Om51bWJlciAvKnVpbnQqLyA9IDQpXG5cdHtcblx0XHRzdXBlcigpO1xuXG5cdFx0dGhpcy5fam9pbnRzUGVyVmVydGV4ID0gam9pbnRzUGVyVmVydGV4O1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgZ2V0QUdBTFZlcnRleENvZGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UpOnN0cmluZ1xuXHR7XG5cdFx0dmFyIGxlbjpudW1iZXIgLyp1aW50Ki8gPSBzaGFkZXJPYmplY3QuYW5pbWF0YWJsZUF0dHJpYnV0ZXMubGVuZ3RoO1xuXG5cdFx0dmFyIGluZGV4T2Zmc2V0MDpudW1iZXIgLyp1aW50Ki8gPSBzaGFkZXJPYmplY3QubnVtVXNlZFZlcnRleENvbnN0YW50cztcblx0XHR2YXIgaW5kZXhPZmZzZXQxOm51bWJlciAvKnVpbnQqLyA9IGluZGV4T2Zmc2V0MCArIDE7XG5cdFx0dmFyIGluZGV4T2Zmc2V0MjpudW1iZXIgLyp1aW50Ki8gPSBpbmRleE9mZnNldDAgKyAyO1xuXHRcdHZhciBpbmRleFN0cmVhbTpzdHJpbmcgPSBcInZhXCIgKyBzaGFkZXJPYmplY3QubnVtVXNlZFN0cmVhbXM7XG5cdFx0dmFyIHdlaWdodFN0cmVhbTpzdHJpbmcgPSBcInZhXCIgKyAoc2hhZGVyT2JqZWN0Lm51bVVzZWRTdHJlYW1zICsgMSk7XG5cdFx0dmFyIGluZGljZXM6QXJyYXk8c3RyaW5nPiA9IFsgaW5kZXhTdHJlYW0gKyBcIi54XCIsIGluZGV4U3RyZWFtICsgXCIueVwiLCBpbmRleFN0cmVhbSArIFwiLnpcIiwgaW5kZXhTdHJlYW0gKyBcIi53XCIgXTtcblx0XHR2YXIgd2VpZ2h0czpBcnJheTxzdHJpbmc+ID0gWyB3ZWlnaHRTdHJlYW0gKyBcIi54XCIsIHdlaWdodFN0cmVhbSArIFwiLnlcIiwgd2VpZ2h0U3RyZWFtICsgXCIuelwiLCB3ZWlnaHRTdHJlYW0gKyBcIi53XCIgXTtcblx0XHR2YXIgdGVtcDE6c3RyaW5nID0gdGhpcy5fcEZpbmRUZW1wUmVnKHNoYWRlck9iamVjdC5hbmltYXRpb25UYXJnZXRSZWdpc3RlcnMpO1xuXHRcdHZhciB0ZW1wMjpzdHJpbmcgPSB0aGlzLl9wRmluZFRlbXBSZWcoc2hhZGVyT2JqZWN0LmFuaW1hdGlvblRhcmdldFJlZ2lzdGVycywgdGVtcDEpO1xuXHRcdHZhciBkb3Q6c3RyaW5nID0gXCJkcDRcIjtcblx0XHR2YXIgY29kZTpzdHJpbmcgPSBcIlwiO1xuXG5cdFx0Zm9yICh2YXIgaTpudW1iZXIgLyp1aW50Ki8gPSAwOyBpIDwgbGVuOyArK2kpIHtcblxuXHRcdFx0dmFyIHNyYzpzdHJpbmcgPSBzaGFkZXJPYmplY3QuYW5pbWF0YWJsZUF0dHJpYnV0ZXNbaV07XG5cblx0XHRcdGZvciAodmFyIGo6bnVtYmVyIC8qdWludCovID0gMDsgaiA8IHRoaXMuX2pvaW50c1BlclZlcnRleDsgKytqKSB7XG5cdFx0XHRcdGNvZGUgKz0gZG90ICsgXCIgXCIgKyB0ZW1wMSArIFwiLngsIFwiICsgc3JjICsgXCIsIHZjW1wiICsgaW5kaWNlc1tqXSArIFwiK1wiICsgaW5kZXhPZmZzZXQwICsgXCJdXFxuXCIgK1xuXHRcdFx0XHRcdGRvdCArIFwiIFwiICsgdGVtcDEgKyBcIi55LCBcIiArIHNyYyArIFwiLCB2Y1tcIiArIGluZGljZXNbal0gKyBcIitcIiArIGluZGV4T2Zmc2V0MSArIFwiXVxcblwiICtcblx0XHRcdFx0XHRkb3QgKyBcIiBcIiArIHRlbXAxICsgXCIueiwgXCIgKyBzcmMgKyBcIiwgdmNbXCIgKyBpbmRpY2VzW2pdICsgXCIrXCIgKyBpbmRleE9mZnNldDIgKyBcIl1cXG5cIiArXG5cdFx0XHRcdFx0XCJtb3YgXCIgKyB0ZW1wMSArIFwiLncsIFwiICsgc3JjICsgXCIud1xcblwiICtcblx0XHRcdFx0XHRcIm11bCBcIiArIHRlbXAxICsgXCIsIFwiICsgdGVtcDEgKyBcIiwgXCIgKyB3ZWlnaHRzW2pdICsgXCJcXG5cIjsgLy8gYXBwbHkgd2VpZ2h0XG5cblx0XHRcdFx0Ly8gYWRkIG9yIG1vdiB0byB0YXJnZXQuIE5lZWQgdG8gd3JpdGUgdG8gYSB0ZW1wIHJlZyBmaXJzdCwgYmVjYXVzZSBhbiBvdXRwdXQgY2FuIGJlIGEgdGFyZ2V0XG5cdFx0XHRcdGlmIChqID09IDApXG5cdFx0XHRcdFx0Y29kZSArPSBcIm1vdiBcIiArIHRlbXAyICsgXCIsIFwiICsgdGVtcDEgKyBcIlxcblwiOyBlbHNlXG5cdFx0XHRcdFx0Y29kZSArPSBcImFkZCBcIiArIHRlbXAyICsgXCIsIFwiICsgdGVtcDIgKyBcIiwgXCIgKyB0ZW1wMSArIFwiXFxuXCI7XG5cdFx0XHR9XG5cdFx0XHQvLyBzd2l0Y2ggdG8gZHAzIG9uY2UgcG9zaXRpb25zIGhhdmUgYmVlbiB0cmFuc2Zvcm1lZCwgZnJvbSBub3cgb24sIGl0IHNob3VsZCBvbmx5IGJlIHZlY3RvcnMgaW5zdGVhZCBvZiBwb2ludHNcblx0XHRcdGRvdCA9IFwiZHAzXCI7XG5cdFx0XHRjb2RlICs9IFwibW92IFwiICsgc2hhZGVyT2JqZWN0LmFuaW1hdGlvblRhcmdldFJlZ2lzdGVyc1tpXSArIFwiLCBcIiArIHRlbXAyICsgXCJcXG5cIjtcblx0XHR9XG5cblx0XHRyZXR1cm4gY29kZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGFjdGl2YXRlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCBzdGFnZTpTdGFnZSlcblx0e1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgZGVhY3RpdmF0ZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgc3RhZ2U6U3RhZ2UpXG5cdHtcbi8vXHRcdFx0dmFyIHN0cmVhbU9mZnNldDpudW1iZXIgLyp1aW50Ki8gPSBwYXNzLm51bVVzZWRTdHJlYW1zO1xuLy9cdFx0XHR2YXIgY29udGV4dDpJQ29udGV4dEdMID0gPElDb250ZXh0R0w+IHN0YWdlLmNvbnRleHQ7XG4vL1x0XHRcdGNvbnRleHQuc2V0VmVydGV4QnVmZmVyQXQoc3RyZWFtT2Zmc2V0LCBudWxsKTtcbi8vXHRcdFx0Y29udGV4dC5zZXRWZXJ0ZXhCdWZmZXJBdChzdHJlYW1PZmZzZXQgKyAxLCBudWxsKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGdldEFHQUxGcmFnbWVudENvZGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIHNoYWRlZFRhcmdldDpzdHJpbmcpOnN0cmluZ1xuXHR7XG5cdFx0cmV0dXJuIFwiXCI7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBnZXRBR0FMVVZDb2RlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlKTpzdHJpbmdcblx0e1xuXHRcdHJldHVybiBcIm1vdiBcIiArIHNoYWRlck9iamVjdC51dlRhcmdldCArIFwiLFwiICsgc2hhZGVyT2JqZWN0LnV2U291cmNlICsgXCJcXG5cIjtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGRvbmVBR0FMQ29kZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSlcblx0e1xuXG5cdH1cbn1cblxuZXhwb3J0ID0gU2tlbGV0b25BbmltYXRpb25TZXQ7Il19