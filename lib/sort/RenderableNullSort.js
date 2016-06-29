"use strict";
/**
 * @class away.sort.NullSort
 */
var RenderableNullSort = (function () {
    function RenderableNullSort() {
    }
    RenderableNullSort.prototype.sortBlendedRenderables = function (head) {
        return head;
    };
    RenderableNullSort.prototype.sortOpaqueRenderables = function (head) {
        return head;
    };
    return RenderableNullSort;
}());
exports.RenderableNullSort = RenderableNullSort;
