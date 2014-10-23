var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AnimationSetBase = require("awayjs-stagegl/lib/animators/AnimationSetBase");
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
        //			var context:IContextStageGL = <IContextStageGL> stage.context;
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvc2tlbGV0b25hbmltYXRpb25zZXQudHMiXSwibmFtZXMiOlsiU2tlbGV0b25BbmltYXRpb25TZXQiLCJTa2VsZXRvbkFuaW1hdGlvblNldC5jb25zdHJ1Y3RvciIsIlNrZWxldG9uQW5pbWF0aW9uU2V0LmpvaW50c1BlclZlcnRleCIsIlNrZWxldG9uQW5pbWF0aW9uU2V0LmdldEFHQUxWZXJ0ZXhDb2RlIiwiU2tlbGV0b25BbmltYXRpb25TZXQuYWN0aXZhdGUiLCJTa2VsZXRvbkFuaW1hdGlvblNldC5kZWFjdGl2YXRlIiwiU2tlbGV0b25BbmltYXRpb25TZXQuZ2V0QUdBTEZyYWdtZW50Q29kZSIsIlNrZWxldG9uQW5pbWF0aW9uU2V0LmdldEFHQUxVVkNvZGUiLCJTa2VsZXRvbkFuaW1hdGlvblNldC5kb25lQUdBTENvZGUiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUVBLElBQU8sZ0JBQWdCLFdBQWUsK0NBQStDLENBQUMsQ0FBQztBQUl2RixBQUtBOzs7O0dBREc7SUFDRyxvQkFBb0I7SUFBU0EsVUFBN0JBLG9CQUFvQkEsVUFBeUJBO0lBYWxEQTs7OztPQUlHQTtJQUNIQSxTQWxCS0Esb0JBQW9CQSxDQWtCYkEsZUFBbUNBO1FBQW5DQywrQkFBbUNBLEdBQW5DQSxtQkFBbUNBO1FBRTlDQSxpQkFBT0EsQ0FBQ0E7UUFFUkEsSUFBSUEsQ0FBQ0EsZ0JBQWdCQSxHQUFHQSxlQUFlQSxDQUFDQTtJQUN6Q0EsQ0FBQ0E7SUFmREQsc0JBQVdBLGlEQUFlQTtRQUoxQkE7OztXQUdHQTthQUNIQTtZQUVDRSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxnQkFBZ0JBLENBQUNBO1FBQzlCQSxDQUFDQTs7O09BQUFGO0lBY0RBOztPQUVHQTtJQUNJQSxnREFBaUJBLEdBQXhCQSxVQUF5QkEsWUFBNkJBO1FBRXJERyxJQUFJQSxHQUFHQSxHQUFtQkEsWUFBWUEsQ0FBQ0Esb0JBQW9CQSxDQUFDQSxNQUFNQSxD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OztPQUVHQTtJQUNJQSwyQ0FBWUEsR0FBbkJBLFVBQW9CQSxZQUE2QkE7SUFHakRRLENBQUNBO0lBQ0ZSLDJCQUFDQTtBQUFEQSxDQTdHQSxBQTZHQ0EsRUE3R2tDLGdCQUFnQixFQTZHbEQ7QUFFRCxBQUE4QixpQkFBckIsb0JBQW9CLENBQUMiLCJmaWxlIjoiYW5pbWF0b3JzL1NrZWxldG9uQW5pbWF0aW9uU2V0LmpzIiwic291cmNlUm9vdCI6Ii4uLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBJQW5pbWF0aW9uU2V0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9hbmltYXRvcnMvSUFuaW1hdGlvblNldFwiKTtcblxuaW1wb3J0IEFuaW1hdGlvblNldEJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2FuaW1hdG9ycy9BbmltYXRpb25TZXRCYXNlXCIpO1xuaW1wb3J0IFN0YWdlXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvYmFzZS9TdGFnZVwiKTtcbmltcG9ydCBTaGFkZXJPYmplY3RCYXNlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9tYXRlcmlhbHMvY29tcGlsYXRpb24vU2hhZGVyT2JqZWN0QmFzZVwiKTtcblxuLyoqXG4gKiBUaGUgYW5pbWF0aW9uIGRhdGEgc2V0IHVzZWQgYnkgc2tlbGV0b24tYmFzZWQgYW5pbWF0b3JzLCBjb250YWluaW5nIHNrZWxldG9uIGFuaW1hdGlvbiBkYXRhLlxuICpcbiAqIEBzZWUgYXdheS5hbmltYXRvcnMuU2tlbGV0b25BbmltYXRvclxuICovXG5jbGFzcyBTa2VsZXRvbkFuaW1hdGlvblNldCBleHRlbmRzIEFuaW1hdGlvblNldEJhc2UgaW1wbGVtZW50cyBJQW5pbWF0aW9uU2V0XG57XG5cdHByaXZhdGUgX2pvaW50c1BlclZlcnRleDpudW1iZXIgLyp1aW50Ki87XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIGFtb3VudCBvZiBza2VsZXRvbiBqb2ludHMgdGhhdCBjYW4gYmUgbGlua2VkIHRvIGEgc2luZ2xlIHZlcnRleCB2aWEgc2tpbm5lZCB3ZWlnaHQgdmFsdWVzLiBGb3IgR1BVLWJhc2UgYW5pbWF0aW9uLCB0aGVcblx0ICogbWF4aW11bSBhbGxvd2VkIHZhbHVlIGlzIDQuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGpvaW50c1BlclZlcnRleCgpOm51bWJlciAvKnVpbnQqL1xuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX2pvaW50c1BlclZlcnRleDtcblx0fVxuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IDxjb2RlPlNrZWxldG9uQW5pbWF0aW9uU2V0PC9jb2RlPiBvYmplY3QuXG5cdCAqXG5cdCAqIEBwYXJhbSBqb2ludHNQZXJWZXJ0ZXggU2V0cyB0aGUgYW1vdW50IG9mIHNrZWxldG9uIGpvaW50cyB0aGF0IGNhbiBiZSBsaW5rZWQgdG8gYSBzaW5nbGUgdmVydGV4IHZpYSBza2lubmVkIHdlaWdodCB2YWx1ZXMuIEZvciBHUFUtYmFzZSBhbmltYXRpb24sIHRoZSBtYXhpbXVtIGFsbG93ZWQgdmFsdWUgaXMgNC4gRGVmYXVsdHMgdG8gNC5cblx0ICovXG5cdGNvbnN0cnVjdG9yKGpvaW50c1BlclZlcnRleDpudW1iZXIgLyp1aW50Ki8gPSA0KVxuXHR7XG5cdFx0c3VwZXIoKTtcblxuXHRcdHRoaXMuX2pvaW50c1BlclZlcnRleCA9IGpvaW50c1BlclZlcnRleDtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGdldEFHQUxWZXJ0ZXhDb2RlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlKTpzdHJpbmdcblx0e1xuXHRcdHZhciBsZW46bnVtYmVyIC8qdWludCovID0gc2hhZGVyT2JqZWN0LmFuaW1hdGFibGVBdHRyaWJ1dGVzLmxlbmd0aDtcblxuXHRcdHZhciBpbmRleE9mZnNldDA6bnVtYmVyIC8qdWludCovID0gc2hhZGVyT2JqZWN0Lm51bVVzZWRWZXJ0ZXhDb25zdGFudHM7XG5cdFx0dmFyIGluZGV4T2Zmc2V0MTpudW1iZXIgLyp1aW50Ki8gPSBpbmRleE9mZnNldDAgKyAxO1xuXHRcdHZhciBpbmRleE9mZnNldDI6bnVtYmVyIC8qdWludCovID0gaW5kZXhPZmZzZXQwICsgMjtcblx0XHR2YXIgaW5kZXhTdHJlYW06c3RyaW5nID0gXCJ2YVwiICsgc2hhZGVyT2JqZWN0Lm51bVVzZWRTdHJlYW1zO1xuXHRcdHZhciB3ZWlnaHRTdHJlYW06c3RyaW5nID0gXCJ2YVwiICsgKHNoYWRlck9iamVjdC5udW1Vc2VkU3RyZWFtcyArIDEpO1xuXHRcdHZhciBpbmRpY2VzOkFycmF5PHN0cmluZz4gPSBbIGluZGV4U3RyZWFtICsgXCIueFwiLCBpbmRleFN0cmVhbSArIFwiLnlcIiwgaW5kZXhTdHJlYW0gKyBcIi56XCIsIGluZGV4U3RyZWFtICsgXCIud1wiIF07XG5cdFx0dmFyIHdlaWdodHM6QXJyYXk8c3RyaW5nPiA9IFsgd2VpZ2h0U3RyZWFtICsgXCIueFwiLCB3ZWlnaHRTdHJlYW0gKyBcIi55XCIsIHdlaWdodFN0cmVhbSArIFwiLnpcIiwgd2VpZ2h0U3RyZWFtICsgXCIud1wiIF07XG5cdFx0dmFyIHRlbXAxOnN0cmluZyA9IHRoaXMuX3BGaW5kVGVtcFJlZyhzaGFkZXJPYmplY3QuYW5pbWF0aW9uVGFyZ2V0UmVnaXN0ZXJzKTtcblx0XHR2YXIgdGVtcDI6c3RyaW5nID0gdGhpcy5fcEZpbmRUZW1wUmVnKHNoYWRlck9iamVjdC5hbmltYXRpb25UYXJnZXRSZWdpc3RlcnMsIHRlbXAxKTtcblx0XHR2YXIgZG90OnN0cmluZyA9IFwiZHA0XCI7XG5cdFx0dmFyIGNvZGU6c3RyaW5nID0gXCJcIjtcblxuXHRcdGZvciAodmFyIGk6bnVtYmVyIC8qdWludCovID0gMDsgaSA8IGxlbjsgKytpKSB7XG5cblx0XHRcdHZhciBzcmM6c3RyaW5nID0gc2hhZGVyT2JqZWN0LmFuaW1hdGFibGVBdHRyaWJ1dGVzW2ldO1xuXG5cdFx0XHRmb3IgKHZhciBqOm51bWJlciAvKnVpbnQqLyA9IDA7IGogPCB0aGlzLl9qb2ludHNQZXJWZXJ0ZXg7ICsraikge1xuXHRcdFx0XHRjb2RlICs9IGRvdCArIFwiIFwiICsgdGVtcDEgKyBcIi54LCBcIiArIHNyYyArIFwiLCB2Y1tcIiArIGluZGljZXNbal0gKyBcIitcIiArIGluZGV4T2Zmc2V0MCArIFwiXVxcblwiICtcblx0XHRcdFx0XHRkb3QgKyBcIiBcIiArIHRlbXAxICsgXCIueSwgXCIgKyBzcmMgKyBcIiwgdmNbXCIgKyBpbmRpY2VzW2pdICsgXCIrXCIgKyBpbmRleE9mZnNldDEgKyBcIl1cXG5cIiArXG5cdFx0XHRcdFx0ZG90ICsgXCIgXCIgKyB0ZW1wMSArIFwiLnosIFwiICsgc3JjICsgXCIsIHZjW1wiICsgaW5kaWNlc1tqXSArIFwiK1wiICsgaW5kZXhPZmZzZXQyICsgXCJdXFxuXCIgK1xuXHRcdFx0XHRcdFwibW92IFwiICsgdGVtcDEgKyBcIi53LCBcIiArIHNyYyArIFwiLndcXG5cIiArXG5cdFx0XHRcdFx0XCJtdWwgXCIgKyB0ZW1wMSArIFwiLCBcIiArIHRlbXAxICsgXCIsIFwiICsgd2VpZ2h0c1tqXSArIFwiXFxuXCI7IC8vIGFwcGx5IHdlaWdodFxuXG5cdFx0XHRcdC8vIGFkZCBvciBtb3YgdG8gdGFyZ2V0LiBOZWVkIHRvIHdyaXRlIHRvIGEgdGVtcCByZWcgZmlyc3QsIGJlY2F1c2UgYW4gb3V0cHV0IGNhbiBiZSBhIHRhcmdldFxuXHRcdFx0XHRpZiAoaiA9PSAwKVxuXHRcdFx0XHRcdGNvZGUgKz0gXCJtb3YgXCIgKyB0ZW1wMiArIFwiLCBcIiArIHRlbXAxICsgXCJcXG5cIjsgZWxzZVxuXHRcdFx0XHRcdGNvZGUgKz0gXCJhZGQgXCIgKyB0ZW1wMiArIFwiLCBcIiArIHRlbXAyICsgXCIsIFwiICsgdGVtcDEgKyBcIlxcblwiO1xuXHRcdFx0fVxuXHRcdFx0Ly8gc3dpdGNoIHRvIGRwMyBvbmNlIHBvc2l0aW9ucyBoYXZlIGJlZW4gdHJhbnNmb3JtZWQsIGZyb20gbm93IG9uLCBpdCBzaG91bGQgb25seSBiZSB2ZWN0b3JzIGluc3RlYWQgb2YgcG9pbnRzXG5cdFx0XHRkb3QgPSBcImRwM1wiO1xuXHRcdFx0Y29kZSArPSBcIm1vdiBcIiArIHNoYWRlck9iamVjdC5hbmltYXRpb25UYXJnZXRSZWdpc3RlcnNbaV0gKyBcIiwgXCIgKyB0ZW1wMiArIFwiXFxuXCI7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNvZGU7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBhY3RpdmF0ZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgc3RhZ2U6U3RhZ2UpXG5cdHtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGRlYWN0aXZhdGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIHN0YWdlOlN0YWdlKVxuXHR7XG4vL1x0XHRcdHZhciBzdHJlYW1PZmZzZXQ6bnVtYmVyIC8qdWludCovID0gcGFzcy5udW1Vc2VkU3RyZWFtcztcbi8vXHRcdFx0dmFyIGNvbnRleHQ6SUNvbnRleHRTdGFnZUdMID0gPElDb250ZXh0U3RhZ2VHTD4gc3RhZ2UuY29udGV4dDtcbi8vXHRcdFx0Y29udGV4dC5zZXRWZXJ0ZXhCdWZmZXJBdChzdHJlYW1PZmZzZXQsIG51bGwpO1xuLy9cdFx0XHRjb250ZXh0LnNldFZlcnRleEJ1ZmZlckF0KHN0cmVhbU9mZnNldCArIDEsIG51bGwpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgZ2V0QUdBTEZyYWdtZW50Q29kZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgc2hhZGVkVGFyZ2V0OnN0cmluZyk6c3RyaW5nXG5cdHtcblx0XHRyZXR1cm4gXCJcIjtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGdldEFHQUxVVkNvZGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UpOnN0cmluZ1xuXHR7XG5cdFx0cmV0dXJuIFwibW92IFwiICsgc2hhZGVyT2JqZWN0LnV2VGFyZ2V0ICsgXCIsXCIgKyBzaGFkZXJPYmplY3QudXZTb3VyY2UgKyBcIlxcblwiO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgZG9uZUFHQUxDb2RlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlKVxuXHR7XG5cblx0fVxufVxuXG5leHBvcnQgPSBTa2VsZXRvbkFuaW1hdGlvblNldDsiXX0=