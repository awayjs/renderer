var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AnimationNodeBase = require("awayjs-core/lib/animators/nodes/AnimationNodeBase");
var SkeletonNaryLERPState = require("awayjs-renderergl/lib/animators/states/SkeletonNaryLERPState");
/**
 * A skeleton animation node that uses an n-dimensional array of animation node inputs to blend a lineraly interpolated output of a skeleton pose.
 */
var SkeletonNaryLERPNode = (function (_super) {
    __extends(SkeletonNaryLERPNode, _super);
    /**
     * Creates a new <code>SkeletonNaryLERPNode</code> object.
     */
    function SkeletonNaryLERPNode() {
        _super.call(this);
        this._iInputs = new Array();
        this._pStateClass = SkeletonNaryLERPState;
    }
    Object.defineProperty(SkeletonNaryLERPNode.prototype, "numInputs", {
        get: function () {
            return this._numInputs;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns an integer representing the input index of the given skeleton animation node.
     *
     * @param input The skeleton animation node for with the input index is requested.
     */
    SkeletonNaryLERPNode.prototype.getInputIndex = function (input) {
        return this._iInputs.indexOf(input);
    };
    /**
     * Returns the skeleton animation node object that resides at the given input index.
     *
     * @param index The input index for which the skeleton animation node is requested.
     */
    SkeletonNaryLERPNode.prototype.getInputAt = function (index /*uint*/) {
        return this._iInputs[index];
    };
    /**
     * Adds a new skeleton animation node input to the animation node.
     */
    SkeletonNaryLERPNode.prototype.addInput = function (input) {
        this._iInputs[this._numInputs++] = input;
    };
    /**
     * @inheritDoc
     */
    SkeletonNaryLERPNode.prototype.getAnimationState = function (animator) {
        return animator.getAnimationState(this);
    };
    return SkeletonNaryLERPNode;
})(AnimationNodeBase);
module.exports = SkeletonNaryLERPNode;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuaW1hdG9ycy9ub2Rlcy9za2VsZXRvbm5hcnlsZXJwbm9kZS50cyJdLCJuYW1lcyI6WyJTa2VsZXRvbk5hcnlMRVJQTm9kZSIsIlNrZWxldG9uTmFyeUxFUlBOb2RlLmNvbnN0cnVjdG9yIiwiU2tlbGV0b25OYXJ5TEVSUE5vZGUubnVtSW5wdXRzIiwiU2tlbGV0b25OYXJ5TEVSUE5vZGUuZ2V0SW5wdXRJbmRleCIsIlNrZWxldG9uTmFyeUxFUlBOb2RlLmdldElucHV0QXQiLCJTa2VsZXRvbk5hcnlMRVJQTm9kZS5hZGRJbnB1dCIsIlNrZWxldG9uTmFyeUxFUlBOb2RlLmdldEFuaW1hdGlvblN0YXRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFPLGlCQUFpQixXQUFjLG1EQUFtRCxDQUFDLENBQUM7QUFJM0YsSUFBTyxxQkFBcUIsV0FBYSw4REFBOEQsQ0FBQyxDQUFDO0FBRXpHLEFBR0E7O0dBREc7SUFDRyxvQkFBb0I7SUFBU0EsVUFBN0JBLG9CQUFvQkEsVUFBMEJBO0lBV25EQTs7T0FFR0E7SUFDSEEsU0FkS0Esb0JBQW9CQTtRQWdCeEJDLGlCQUFPQSxDQUFDQTtRQWRGQSxhQUFRQSxHQUE0QkEsSUFBSUEsS0FBS0EsRUFBcUJBLENBQUNBO1FBZ0J6RUEsSUFBSUEsQ0FBQ0EsWUFBWUEsR0FBR0EscUJBQXFCQSxDQUFDQTtJQUMzQ0EsQ0FBQ0E7SUFiREQsc0JBQVdBLDJDQUFTQTthQUFwQkE7WUFFQ0UsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0E7UUFDeEJBLENBQUNBOzs7T0FBQUY7SUFZREE7Ozs7T0FJR0E7SUFDSUEsNENBQWFBLEdBQXBCQSxVQUFxQkEsS0FBdUJBO1FBRTNDRyxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxPQUFPQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtJQUNyQ0EsQ0FBQ0E7SUFFREg7Ozs7T0FJR0E7SUFDSUEseUNBQVVBLEdBQWpCQSxVQUFrQkEsS0FBS0EsQ0FBUUEsUUFBREEsQUFBU0E7UUFFdENJLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO0lBQzdCQSxDQUFDQTtJQUVESjs7T0FFR0E7SUFDSUEsdUNBQVFBLEdBQWZBLFVBQWdCQSxLQUF1QkE7UUFFdENLLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLElBQUlBLENBQUNBLFVBQVVBLEVBQUVBLENBQUNBLEdBQUdBLEtBQUtBLENBQUNBO0lBQzFDQSxDQUFDQTtJQUVETDs7T0FFR0E7SUFDSUEsZ0RBQWlCQSxHQUF4QkEsVUFBeUJBLFFBQXFCQTtRQUU3Q00sTUFBTUEsQ0FBeUJBLFFBQVFBLENBQUNBLGlCQUFpQkEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7SUFDakVBLENBQUNBO0lBQ0ZOLDJCQUFDQTtBQUFEQSxDQXhEQSxBQXdEQ0EsRUF4RGtDLGlCQUFpQixFQXdEbkQ7QUFFRCxBQUE2QixpQkFBcEIsb0JBQW9CLENBQUEiLCJmaWxlIjoiYW5pbWF0b3JzL25vZGVzL1NrZWxldG9uTmFyeUxFUlBOb2RlLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9yb2JiYXRlbWFuL1dlYnN0b3JtUHJvamVjdHMvYXdheWpzLXJlbmRlcmVyZ2wvIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFuaW1hdGlvbk5vZGVCYXNlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvYW5pbWF0b3JzL25vZGVzL0FuaW1hdGlvbk5vZGVCYXNlXCIpO1xuXG5pbXBvcnQgQW5pbWF0b3JCYXNlXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2FuaW1hdG9ycy9BbmltYXRvckJhc2VcIik7XG5cbmltcG9ydCBTa2VsZXRvbk5hcnlMRVJQU3RhdGVcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL3N0YXRlcy9Ta2VsZXRvbk5hcnlMRVJQU3RhdGVcIik7XG5cbi8qKlxuICogQSBza2VsZXRvbiBhbmltYXRpb24gbm9kZSB0aGF0IHVzZXMgYW4gbi1kaW1lbnNpb25hbCBhcnJheSBvZiBhbmltYXRpb24gbm9kZSBpbnB1dHMgdG8gYmxlbmQgYSBsaW5lcmFseSBpbnRlcnBvbGF0ZWQgb3V0cHV0IG9mIGEgc2tlbGV0b24gcG9zZS5cbiAqL1xuY2xhc3MgU2tlbGV0b25OYXJ5TEVSUE5vZGUgZXh0ZW5kcyBBbmltYXRpb25Ob2RlQmFzZVxue1xuXHRwdWJsaWMgX2lJbnB1dHM6QXJyYXk8QW5pbWF0aW9uTm9kZUJhc2U+ID0gbmV3IEFycmF5PEFuaW1hdGlvbk5vZGVCYXNlPigpO1xuXG5cdHByaXZhdGUgX251bUlucHV0czpudW1iZXIgLyp1aW50Ki87XG5cblx0cHVibGljIGdldCBudW1JbnB1dHMoKTpudW1iZXIgLyp1aW50Ki9cblx0e1xuXHRcdHJldHVybiB0aGlzLl9udW1JbnB1dHM7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyA8Y29kZT5Ta2VsZXRvbk5hcnlMRVJQTm9kZTwvY29kZT4gb2JqZWN0LlxuXHQgKi9cblx0Y29uc3RydWN0b3IoKVxuXHR7XG5cdFx0c3VwZXIoKTtcblxuXHRcdHRoaXMuX3BTdGF0ZUNsYXNzID0gU2tlbGV0b25OYXJ5TEVSUFN0YXRlO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgYW4gaW50ZWdlciByZXByZXNlbnRpbmcgdGhlIGlucHV0IGluZGV4IG9mIHRoZSBnaXZlbiBza2VsZXRvbiBhbmltYXRpb24gbm9kZS5cblx0ICpcblx0ICogQHBhcmFtIGlucHV0IFRoZSBza2VsZXRvbiBhbmltYXRpb24gbm9kZSBmb3Igd2l0aCB0aGUgaW5wdXQgaW5kZXggaXMgcmVxdWVzdGVkLlxuXHQgKi9cblx0cHVibGljIGdldElucHV0SW5kZXgoaW5wdXQ6QW5pbWF0aW9uTm9kZUJhc2UpOm51bWJlciAvKmludCovXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5faUlucHV0cy5pbmRleE9mKGlucHV0KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSBza2VsZXRvbiBhbmltYXRpb24gbm9kZSBvYmplY3QgdGhhdCByZXNpZGVzIGF0IHRoZSBnaXZlbiBpbnB1dCBpbmRleC5cblx0ICpcblx0ICogQHBhcmFtIGluZGV4IFRoZSBpbnB1dCBpbmRleCBmb3Igd2hpY2ggdGhlIHNrZWxldG9uIGFuaW1hdGlvbiBub2RlIGlzIHJlcXVlc3RlZC5cblx0ICovXG5cdHB1YmxpYyBnZXRJbnB1dEF0KGluZGV4Om51bWJlciAvKnVpbnQqLyk6QW5pbWF0aW9uTm9kZUJhc2Vcblx0e1xuXHRcdHJldHVybiB0aGlzLl9pSW5wdXRzW2luZGV4XTtcblx0fVxuXG5cdC8qKlxuXHQgKiBBZGRzIGEgbmV3IHNrZWxldG9uIGFuaW1hdGlvbiBub2RlIGlucHV0IHRvIHRoZSBhbmltYXRpb24gbm9kZS5cblx0ICovXG5cdHB1YmxpYyBhZGRJbnB1dChpbnB1dDpBbmltYXRpb25Ob2RlQmFzZSlcblx0e1xuXHRcdHRoaXMuX2lJbnB1dHNbdGhpcy5fbnVtSW5wdXRzKytdID0gaW5wdXQ7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBnZXRBbmltYXRpb25TdGF0ZShhbmltYXRvcjpBbmltYXRvckJhc2UpOlNrZWxldG9uTmFyeUxFUlBTdGF0ZVxuXHR7XG5cdFx0cmV0dXJuIDxTa2VsZXRvbk5hcnlMRVJQU3RhdGU+IGFuaW1hdG9yLmdldEFuaW1hdGlvblN0YXRlKHRoaXMpO1xuXHR9XG59XG5cbmV4cG9ydCA9IFNrZWxldG9uTmFyeUxFUlBOb2RlIl19