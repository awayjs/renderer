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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvbm9kZXMvc2tlbGV0b25uYXJ5bGVycG5vZGUudHMiXSwibmFtZXMiOlsiU2tlbGV0b25OYXJ5TEVSUE5vZGUiLCJTa2VsZXRvbk5hcnlMRVJQTm9kZS5jb25zdHJ1Y3RvciIsIlNrZWxldG9uTmFyeUxFUlBOb2RlLm51bUlucHV0cyIsIlNrZWxldG9uTmFyeUxFUlBOb2RlLmdldElucHV0SW5kZXgiLCJTa2VsZXRvbk5hcnlMRVJQTm9kZS5nZXRJbnB1dEF0IiwiU2tlbGV0b25OYXJ5TEVSUE5vZGUuYWRkSW5wdXQiLCJTa2VsZXRvbk5hcnlMRVJQTm9kZS5nZXRBbmltYXRpb25TdGF0ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsSUFBTyxpQkFBaUIsV0FBYyxzREFBc0QsQ0FBQyxDQUFDO0FBSTlGLElBQU8scUJBQXFCLFdBQWEsOERBQThELENBQUMsQ0FBQztBQUV6RyxBQUdBOztHQURHO0lBQ0csb0JBQW9CO0lBQVNBLFVBQTdCQSxvQkFBb0JBLFVBQTBCQTtJQVduREE7O09BRUdBO0lBQ0hBLFNBZEtBLG9CQUFvQkE7UUFnQnhCQyxpQkFBT0EsQ0FBQ0E7UUFkRkEsYUFBUUEsR0FBNEJBLElBQUlBLEtBQUtBLEVBQXFCQSxDQUFDQTtRQWdCekVBLElBQUlBLENBQUNBLFlBQVlBLEdBQUdBLHFCQUFxQkEsQ0FBQ0E7SUFDM0NBLENBQUNBO0lBYkRELHNCQUFXQSwyQ0FBU0E7YUFBcEJBO1lBRUNFLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBO1FBQ3hCQSxDQUFDQTs7O09BQUFGO0lBWURBOzs7O09BSUdBO0lBQ0lBLDRDQUFhQSxHQUFwQkEsVUFBcUJBLEtBQXVCQTtRQUUzQ0csTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7SUFDckNBLENBQUNBO0lBRURIOzs7O09BSUdBO0lBQ0lBLHlDQUFVQSxHQUFqQkEsVUFBa0JBLEtBQUtBLENBQVFBLFFBQURBLEFBQVNBO1FBRXRDSSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtJQUM3QkEsQ0FBQ0E7SUFFREo7O09BRUdBO0lBQ0lBLHVDQUFRQSxHQUFmQSxVQUFnQkEsS0FBdUJBO1FBRXRDSyxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFVQSxFQUFFQSxDQUFDQSxHQUFHQSxLQUFLQSxDQUFDQTtJQUMxQ0EsQ0FBQ0E7SUFFREw7O09BRUdBO0lBQ0lBLGdEQUFpQkEsR0FBeEJBLFVBQXlCQSxRQUFxQkE7UUFFN0NNLE1BQU1BLENBQXlCQSxRQUFRQSxDQUFDQSxpQkFBaUJBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO0lBQ2pFQSxDQUFDQTtJQUNGTiwyQkFBQ0E7QUFBREEsQ0F4REEsQUF3RENBLEVBeERrQyxpQkFBaUIsRUF3RG5EO0FBRUQsQUFBNkIsaUJBQXBCLG9CQUFvQixDQUFBIiwiZmlsZSI6ImFuaW1hdG9ycy9ub2Rlcy9Ta2VsZXRvbk5hcnlMRVJQTm9kZS5qcyIsInNvdXJjZVJvb3QiOiIuLi8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQW5pbWF0aW9uTm9kZUJhc2VcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9hbmltYXRvcnMvbm9kZXMvQW5pbWF0aW9uTm9kZUJhc2VcIik7XG5cbmltcG9ydCBBbmltYXRvckJhc2VcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvYW5pbWF0b3JzL0FuaW1hdG9yQmFzZVwiKTtcblxuaW1wb3J0IFNrZWxldG9uTmFyeUxFUlBTdGF0ZVx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvc3RhdGVzL1NrZWxldG9uTmFyeUxFUlBTdGF0ZVwiKTtcblxuLyoqXG4gKiBBIHNrZWxldG9uIGFuaW1hdGlvbiBub2RlIHRoYXQgdXNlcyBhbiBuLWRpbWVuc2lvbmFsIGFycmF5IG9mIGFuaW1hdGlvbiBub2RlIGlucHV0cyB0byBibGVuZCBhIGxpbmVyYWx5IGludGVycG9sYXRlZCBvdXRwdXQgb2YgYSBza2VsZXRvbiBwb3NlLlxuICovXG5jbGFzcyBTa2VsZXRvbk5hcnlMRVJQTm9kZSBleHRlbmRzIEFuaW1hdGlvbk5vZGVCYXNlXG57XG5cdHB1YmxpYyBfaUlucHV0czpBcnJheTxBbmltYXRpb25Ob2RlQmFzZT4gPSBuZXcgQXJyYXk8QW5pbWF0aW9uTm9kZUJhc2U+KCk7XG5cblx0cHJpdmF0ZSBfbnVtSW5wdXRzOm51bWJlciAvKnVpbnQqLztcblxuXHRwdWJsaWMgZ2V0IG51bUlucHV0cygpOm51bWJlciAvKnVpbnQqL1xuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX251bUlucHV0cztcblx0fVxuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IDxjb2RlPlNrZWxldG9uTmFyeUxFUlBOb2RlPC9jb2RlPiBvYmplY3QuXG5cdCAqL1xuXHRjb25zdHJ1Y3RvcigpXG5cdHtcblx0XHRzdXBlcigpO1xuXG5cdFx0dGhpcy5fcFN0YXRlQ2xhc3MgPSBTa2VsZXRvbk5hcnlMRVJQU3RhdGU7XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyBhbiBpbnRlZ2VyIHJlcHJlc2VudGluZyB0aGUgaW5wdXQgaW5kZXggb2YgdGhlIGdpdmVuIHNrZWxldG9uIGFuaW1hdGlvbiBub2RlLlxuXHQgKlxuXHQgKiBAcGFyYW0gaW5wdXQgVGhlIHNrZWxldG9uIGFuaW1hdGlvbiBub2RlIGZvciB3aXRoIHRoZSBpbnB1dCBpbmRleCBpcyByZXF1ZXN0ZWQuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0SW5wdXRJbmRleChpbnB1dDpBbmltYXRpb25Ob2RlQmFzZSk6bnVtYmVyIC8qaW50Ki9cblx0e1xuXHRcdHJldHVybiB0aGlzLl9pSW5wdXRzLmluZGV4T2YoaW5wdXQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIHNrZWxldG9uIGFuaW1hdGlvbiBub2RlIG9iamVjdCB0aGF0IHJlc2lkZXMgYXQgdGhlIGdpdmVuIGlucHV0IGluZGV4LlxuXHQgKlxuXHQgKiBAcGFyYW0gaW5kZXggVGhlIGlucHV0IGluZGV4IGZvciB3aGljaCB0aGUgc2tlbGV0b24gYW5pbWF0aW9uIG5vZGUgaXMgcmVxdWVzdGVkLlxuXHQgKi9cblx0cHVibGljIGdldElucHV0QXQoaW5kZXg6bnVtYmVyIC8qdWludCovKTpBbmltYXRpb25Ob2RlQmFzZVxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX2lJbnB1dHNbaW5kZXhdO1xuXHR9XG5cblx0LyoqXG5cdCAqIEFkZHMgYSBuZXcgc2tlbGV0b24gYW5pbWF0aW9uIG5vZGUgaW5wdXQgdG8gdGhlIGFuaW1hdGlvbiBub2RlLlxuXHQgKi9cblx0cHVibGljIGFkZElucHV0KGlucHV0OkFuaW1hdGlvbk5vZGVCYXNlKVxuXHR7XG5cdFx0dGhpcy5faUlucHV0c1t0aGlzLl9udW1JbnB1dHMrK10gPSBpbnB1dDtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGdldEFuaW1hdGlvblN0YXRlKGFuaW1hdG9yOkFuaW1hdG9yQmFzZSk6U2tlbGV0b25OYXJ5TEVSUFN0YXRlXG5cdHtcblx0XHRyZXR1cm4gPFNrZWxldG9uTmFyeUxFUlBTdGF0ZT4gYW5pbWF0b3IuZ2V0QW5pbWF0aW9uU3RhdGUodGhpcyk7XG5cdH1cbn1cblxuZXhwb3J0ID0gU2tlbGV0b25OYXJ5TEVSUE5vZGUiXX0=