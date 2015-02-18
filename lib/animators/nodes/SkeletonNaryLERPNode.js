var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AnimationNodeBase = require("awayjs-display/lib/animators/nodes/AnimationNodeBase");
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvbm9kZXMvU2tlbGV0b25OYXJ5TEVSUE5vZGUudHMiXSwibmFtZXMiOlsiU2tlbGV0b25OYXJ5TEVSUE5vZGUiLCJTa2VsZXRvbk5hcnlMRVJQTm9kZS5jb25zdHJ1Y3RvciIsIlNrZWxldG9uTmFyeUxFUlBOb2RlLm51bUlucHV0cyIsIlNrZWxldG9uTmFyeUxFUlBOb2RlLmdldElucHV0SW5kZXgiLCJTa2VsZXRvbk5hcnlMRVJQTm9kZS5nZXRJbnB1dEF0IiwiU2tlbGV0b25OYXJ5TEVSUE5vZGUuYWRkSW5wdXQiLCJTa2VsZXRvbk5hcnlMRVJQTm9kZS5nZXRBbmltYXRpb25TdGF0ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsSUFBTyxpQkFBaUIsV0FBYyxzREFBc0QsQ0FBQyxDQUFDO0FBSTlGLElBQU8scUJBQXFCLFdBQWEsOERBQThELENBQUMsQ0FBQztBQUV6RyxBQUdBOztHQURHO0lBQ0csb0JBQW9CO0lBQVNBLFVBQTdCQSxvQkFBb0JBLFVBQTBCQTtJQVduREE7O09BRUdBO0lBQ0hBLFNBZEtBLG9CQUFvQkE7UUFnQnhCQyxpQkFBT0EsQ0FBQ0E7UUFkRkEsYUFBUUEsR0FBNEJBLElBQUlBLEtBQUtBLEVBQXFCQSxDQUFDQTtRQWdCekVBLElBQUlBLENBQUNBLFlBQVlBLEdBQUdBLHFCQUFxQkEsQ0FBQ0E7SUFDM0NBLENBQUNBO0lBYkRELHNCQUFXQSwyQ0FBU0E7YUFBcEJBO1lBRUNFLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBO1FBQ3hCQSxDQUFDQTs7O09BQUFGO0lBWURBOzs7O09BSUdBO0lBQ0lBLDRDQUFhQSxHQUFwQkEsVUFBcUJBLEtBQXVCQTtRQUUzQ0csTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7SUFDckNBLENBQUNBO0lBRURIOzs7O09BSUdBO0lBQ0lBLHlDQUFVQSxHQUFqQkEsVUFBa0JBLEtBQUtBLENBQVFBLFFBQURBLEFBQVNBO1FBRXRDSSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtJQUM3QkEsQ0FBQ0E7SUFFREo7O09BRUdBO0lBQ0lBLHVDQUFRQSxHQUFmQSxVQUFnQkEsS0FBdUJBO1FBRXRDSyxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFVQSxFQUFFQSxDQUFDQSxHQUFHQSxLQUFLQSxDQUFDQTtJQUMxQ0EsQ0FBQ0E7SUFFREw7O09BRUdBO0lBQ0lBLGdEQUFpQkEsR0FBeEJBLFVBQXlCQSxRQUFxQkE7UUFFN0NNLE1BQU1BLENBQXlCQSxRQUFRQSxDQUFDQSxpQkFBaUJBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO0lBQ2pFQSxDQUFDQTtJQUNGTiwyQkFBQ0E7QUFBREEsQ0F4REEsQUF3RENBLEVBeERrQyxpQkFBaUIsRUF3RG5EO0FBRUQsQUFBNkIsaUJBQXBCLG9CQUFvQixDQUFBIiwiZmlsZSI6ImFuaW1hdG9ycy9ub2Rlcy9Ta2VsZXRvbk5hcnlMRVJQTm9kZS5qcyIsInNvdXJjZVJvb3QiOiIuLi8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQW5pbWF0aW9uTm9kZUJhc2VcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9hbmltYXRvcnMvbm9kZXMvQW5pbWF0aW9uTm9kZUJhc2VcIik7XHJcblxyXG5pbXBvcnQgQW5pbWF0b3JCYXNlXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9BbmltYXRvckJhc2VcIik7XHJcblxyXG5pbXBvcnQgU2tlbGV0b25OYXJ5TEVSUFN0YXRlXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9zdGF0ZXMvU2tlbGV0b25OYXJ5TEVSUFN0YXRlXCIpO1xyXG5cclxuLyoqXHJcbiAqIEEgc2tlbGV0b24gYW5pbWF0aW9uIG5vZGUgdGhhdCB1c2VzIGFuIG4tZGltZW5zaW9uYWwgYXJyYXkgb2YgYW5pbWF0aW9uIG5vZGUgaW5wdXRzIHRvIGJsZW5kIGEgbGluZXJhbHkgaW50ZXJwb2xhdGVkIG91dHB1dCBvZiBhIHNrZWxldG9uIHBvc2UuXHJcbiAqL1xyXG5jbGFzcyBTa2VsZXRvbk5hcnlMRVJQTm9kZSBleHRlbmRzIEFuaW1hdGlvbk5vZGVCYXNlXHJcbntcclxuXHRwdWJsaWMgX2lJbnB1dHM6QXJyYXk8QW5pbWF0aW9uTm9kZUJhc2U+ID0gbmV3IEFycmF5PEFuaW1hdGlvbk5vZGVCYXNlPigpO1xyXG5cclxuXHRwcml2YXRlIF9udW1JbnB1dHM6bnVtYmVyIC8qdWludCovO1xyXG5cclxuXHRwdWJsaWMgZ2V0IG51bUlucHV0cygpOm51bWJlciAvKnVpbnQqL1xyXG5cdHtcclxuXHRcdHJldHVybiB0aGlzLl9udW1JbnB1dHM7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBDcmVhdGVzIGEgbmV3IDxjb2RlPlNrZWxldG9uTmFyeUxFUlBOb2RlPC9jb2RlPiBvYmplY3QuXHJcblx0ICovXHJcblx0Y29uc3RydWN0b3IoKVxyXG5cdHtcclxuXHRcdHN1cGVyKCk7XHJcblxyXG5cdFx0dGhpcy5fcFN0YXRlQ2xhc3MgPSBTa2VsZXRvbk5hcnlMRVJQU3RhdGU7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBSZXR1cm5zIGFuIGludGVnZXIgcmVwcmVzZW50aW5nIHRoZSBpbnB1dCBpbmRleCBvZiB0aGUgZ2l2ZW4gc2tlbGV0b24gYW5pbWF0aW9uIG5vZGUuXHJcblx0ICpcclxuXHQgKiBAcGFyYW0gaW5wdXQgVGhlIHNrZWxldG9uIGFuaW1hdGlvbiBub2RlIGZvciB3aXRoIHRoZSBpbnB1dCBpbmRleCBpcyByZXF1ZXN0ZWQuXHJcblx0ICovXHJcblx0cHVibGljIGdldElucHV0SW5kZXgoaW5wdXQ6QW5pbWF0aW9uTm9kZUJhc2UpOm51bWJlciAvKmludCovXHJcblx0e1xyXG5cdFx0cmV0dXJuIHRoaXMuX2lJbnB1dHMuaW5kZXhPZihpbnB1dCk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBSZXR1cm5zIHRoZSBza2VsZXRvbiBhbmltYXRpb24gbm9kZSBvYmplY3QgdGhhdCByZXNpZGVzIGF0IHRoZSBnaXZlbiBpbnB1dCBpbmRleC5cclxuXHQgKlxyXG5cdCAqIEBwYXJhbSBpbmRleCBUaGUgaW5wdXQgaW5kZXggZm9yIHdoaWNoIHRoZSBza2VsZXRvbiBhbmltYXRpb24gbm9kZSBpcyByZXF1ZXN0ZWQuXHJcblx0ICovXHJcblx0cHVibGljIGdldElucHV0QXQoaW5kZXg6bnVtYmVyIC8qdWludCovKTpBbmltYXRpb25Ob2RlQmFzZVxyXG5cdHtcclxuXHRcdHJldHVybiB0aGlzLl9pSW5wdXRzW2luZGV4XTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEFkZHMgYSBuZXcgc2tlbGV0b24gYW5pbWF0aW9uIG5vZGUgaW5wdXQgdG8gdGhlIGFuaW1hdGlvbiBub2RlLlxyXG5cdCAqL1xyXG5cdHB1YmxpYyBhZGRJbnB1dChpbnB1dDpBbmltYXRpb25Ob2RlQmFzZSlcclxuXHR7XHJcblx0XHR0aGlzLl9pSW5wdXRzW3RoaXMuX251bUlucHV0cysrXSA9IGlucHV0O1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQGluaGVyaXREb2NcclxuXHQgKi9cclxuXHRwdWJsaWMgZ2V0QW5pbWF0aW9uU3RhdGUoYW5pbWF0b3I6QW5pbWF0b3JCYXNlKTpTa2VsZXRvbk5hcnlMRVJQU3RhdGVcclxuXHR7XHJcblx0XHRyZXR1cm4gPFNrZWxldG9uTmFyeUxFUlBTdGF0ZT4gYW5pbWF0b3IuZ2V0QW5pbWF0aW9uU3RhdGUodGhpcyk7XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgPSBTa2VsZXRvbk5hcnlMRVJQTm9kZSJdfQ==