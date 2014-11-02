var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var LineSubGeometry = require("awayjs-display/lib/base/LineSubGeometry");
var RenderableBase = require("awayjs-renderergl/lib/pool/RenderableBase");
/**
 * @class away.pool.LineSubMeshRenderable
 */
var LineSubMeshRenderable = (function (_super) {
    __extends(LineSubMeshRenderable, _super);
    /**
     * //TODO
     *
     * @param pool
     * @param subMesh
     * @param level
     * @param dataOffset
     */
    function LineSubMeshRenderable(pool, subMesh, level, indexOffset) {
        if (level === void 0) { level = 0; }
        if (indexOffset === void 0) { indexOffset = 0; }
        _super.call(this, pool, subMesh.parentMesh, subMesh, level, indexOffset);
        this.subMesh = subMesh;
    }
    /**
     * //TODO
     *
     * @returns {base.LineSubGeometry}
     * @protected
     */
    LineSubMeshRenderable.prototype._pGetSubGeometry = function () {
        var subGeometry = this.subMesh.subGeometry;
        this._pVertexDataDirty[LineSubGeometry.START_POSITION_DATA] = true;
        this._pVertexDataDirty[LineSubGeometry.END_POSITION_DATA] = true;
        if (subGeometry.thickness)
            this._pVertexDataDirty[LineSubGeometry.THICKNESS_DATA] = true;
        if (subGeometry.startColors)
            this._pVertexDataDirty[LineSubGeometry.COLOR_DATA] = true;
        return subGeometry;
    };
    /**
     * //TODO
     *
     * @param pool
     * @param materialOwner
     * @param level
     * @param indexOffset
     * @returns {away.pool.LineSubMeshRenderable}
     * @private
     */
    LineSubMeshRenderable.prototype._pGetOverflowRenderable = function (pool, materialOwner, level, indexOffset) {
        return new LineSubMeshRenderable(pool, materialOwner, level, indexOffset);
    };
    /**
     *
     */
    LineSubMeshRenderable.id = "linesubmesh";
    return LineSubMeshRenderable;
})(RenderableBase);
module.exports = LineSubMeshRenderable;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9wb29sL2xpbmVzdWJtZXNocmVuZGVyYWJsZS50cyJdLCJuYW1lcyI6WyJMaW5lU3ViTWVzaFJlbmRlcmFibGUiLCJMaW5lU3ViTWVzaFJlbmRlcmFibGUuY29uc3RydWN0b3IiLCJMaW5lU3ViTWVzaFJlbmRlcmFibGUuX3BHZXRTdWJHZW9tZXRyeSIsIkxpbmVTdWJNZXNoUmVuZGVyYWJsZS5fcEdldE92ZXJmbG93UmVuZGVyYWJsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBRUEsSUFBTyxlQUFlLFdBQWMseUNBQXlDLENBQUMsQ0FBQztBQUkvRSxJQUFPLGNBQWMsV0FBYywyQ0FBMkMsQ0FBQyxDQUFDO0FBRWhGLEFBR0E7O0dBREc7SUFDRyxxQkFBcUI7SUFBU0EsVUFBOUJBLHFCQUFxQkEsVUFBdUJBO0lBWWpEQTs7Ozs7OztPQU9HQTtJQUNIQSxTQXBCS0EscUJBQXFCQSxDQW9CZEEsSUFBbUJBLEVBQUVBLE9BQW1CQSxFQUFFQSxLQUFnQkEsRUFBRUEsV0FBc0JBO1FBQXhDQyxxQkFBZ0JBLEdBQWhCQSxTQUFnQkE7UUFBRUEsMkJBQXNCQSxHQUF0QkEsZUFBc0JBO1FBRTdGQSxrQkFBTUEsSUFBSUEsRUFBRUEsT0FBT0EsQ0FBQ0EsVUFBVUEsRUFBRUEsT0FBT0EsRUFBRUEsS0FBS0EsRUFBRUEsV0FBV0EsQ0FBQ0EsQ0FBQ0E7UUFFN0RBLElBQUlBLENBQUNBLE9BQU9BLEdBQUdBLE9BQU9BLENBQUNBO0lBQ3hCQSxDQUFDQTtJQUVERDs7Ozs7T0FLR0E7SUFDSUEsZ0RBQWdCQSxHQUF2QkE7UUFFQ0UsSUFBSUEsV0FBV0EsR0FBbUJBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLFdBQVdBLENBQUNBO1FBRTNEQSxJQUFJQSxDQUFDQSxpQkFBaUJBLENBQUNBLGVBQWVBLENBQUNBLG1CQUFtQkEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0E7UUFDbkVBLElBQUlBLENBQUNBLGlCQUFpQkEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsaUJBQWlCQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQTtRQUVqRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsV0FBV0EsQ0FBQ0EsU0FBU0EsQ0FBQ0E7WUFDekJBLElBQUlBLENBQUNBLGlCQUFpQkEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0E7UUFFL0RBLEVBQUVBLENBQUNBLENBQUNBLFdBQVdBLENBQUNBLFdBQVdBLENBQUNBO1lBQzNCQSxJQUFJQSxDQUFDQSxpQkFBaUJBLENBQUNBLGVBQWVBLENBQUNBLFVBQVVBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBO1FBRTNEQSxNQUFNQSxDQUFDQSxXQUFXQSxDQUFDQTtJQUNwQkEsQ0FBQ0E7SUFFREY7Ozs7Ozs7OztPQVNHQTtJQUNJQSx1REFBdUJBLEdBQTlCQSxVQUErQkEsSUFBbUJBLEVBQUVBLGFBQTRCQSxFQUFFQSxLQUFZQSxFQUFFQSxXQUFrQkE7UUFFakhHLE1BQU1BLENBQUNBLElBQUlBLHFCQUFxQkEsQ0FBQ0EsSUFBSUEsRUFBZ0JBLGFBQWFBLEVBQUVBLEtBQUtBLEVBQUVBLFdBQVdBLENBQUNBLENBQUNBO0lBQ3pGQSxDQUFDQTtJQTVEREg7O09BRUdBO0lBQ1dBLHdCQUFFQSxHQUFVQSxhQUFhQSxDQUFDQTtJQTBEekNBLDRCQUFDQTtBQUFEQSxDQS9EQSxBQStEQ0EsRUEvRG1DLGNBQWMsRUErRGpEO0FBRUQsQUFBK0IsaUJBQXRCLHFCQUFxQixDQUFDIiwiZmlsZSI6InBvb2wvTGluZVN1Yk1lc2hSZW5kZXJhYmxlLmpzIiwic291cmNlUm9vdCI6Ii4uLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBJTWF0ZXJpYWxPd25lclx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2Jhc2UvSU1hdGVyaWFsT3duZXJcIik7XG5pbXBvcnQgTGluZVN1Yk1lc2hcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2Jhc2UvTGluZVN1Yk1lc2hcIik7XG5pbXBvcnQgTGluZVN1Ykdlb21ldHJ5XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvYmFzZS9MaW5lU3ViR2VvbWV0cnlcIik7XG5pbXBvcnQgUmVuZGVyYWJsZVBvb2xcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9wb29sL1JlbmRlcmFibGVQb29sXCIpO1xuaW1wb3J0IFN1Ykdlb21ldHJ5RXZlbnRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9ldmVudHMvU3ViR2VvbWV0cnlFdmVudFwiKTtcblxuaW1wb3J0IFJlbmRlcmFibGVCYXNlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvcG9vbC9SZW5kZXJhYmxlQmFzZVwiKTtcblxuLyoqXG4gKiBAY2xhc3MgYXdheS5wb29sLkxpbmVTdWJNZXNoUmVuZGVyYWJsZVxuICovXG5jbGFzcyBMaW5lU3ViTWVzaFJlbmRlcmFibGUgZXh0ZW5kcyBSZW5kZXJhYmxlQmFzZVxue1xuXHQvKipcblx0ICpcblx0ICovXG5cdHB1YmxpYyBzdGF0aWMgaWQ6c3RyaW5nID0gXCJsaW5lc3VibWVzaFwiO1xuXG5cdC8qKlxuXHQgKlxuXHQgKi9cblx0cHVibGljIHN1Yk1lc2g6TGluZVN1Yk1lc2g7XG5cblx0LyoqXG5cdCAqIC8vVE9ET1xuXHQgKlxuXHQgKiBAcGFyYW0gcG9vbFxuXHQgKiBAcGFyYW0gc3ViTWVzaFxuXHQgKiBAcGFyYW0gbGV2ZWxcblx0ICogQHBhcmFtIGRhdGFPZmZzZXRcblx0ICovXG5cdGNvbnN0cnVjdG9yKHBvb2w6UmVuZGVyYWJsZVBvb2wsIHN1Yk1lc2g6TGluZVN1Yk1lc2gsIGxldmVsOm51bWJlciA9IDAsIGluZGV4T2Zmc2V0Om51bWJlciA9IDApXG5cdHtcblx0XHRzdXBlcihwb29sLCBzdWJNZXNoLnBhcmVudE1lc2gsIHN1Yk1lc2gsIGxldmVsLCBpbmRleE9mZnNldCk7XG5cblx0XHR0aGlzLnN1Yk1lc2ggPSBzdWJNZXNoO1xuXHR9XG5cblx0LyoqXG5cdCAqIC8vVE9ET1xuXHQgKlxuXHQgKiBAcmV0dXJucyB7YmFzZS5MaW5lU3ViR2VvbWV0cnl9XG5cdCAqIEBwcm90ZWN0ZWRcblx0ICovXG5cdHB1YmxpYyBfcEdldFN1Ykdlb21ldHJ5KCk6TGluZVN1Ykdlb21ldHJ5XG5cdHtcblx0XHR2YXIgc3ViR2VvbWV0cnk6TGluZVN1Ykdlb21ldHJ5ID0gdGhpcy5zdWJNZXNoLnN1Ykdlb21ldHJ5O1xuXG5cdFx0dGhpcy5fcFZlcnRleERhdGFEaXJ0eVtMaW5lU3ViR2VvbWV0cnkuU1RBUlRfUE9TSVRJT05fREFUQV0gPSB0cnVlO1xuXHRcdHRoaXMuX3BWZXJ0ZXhEYXRhRGlydHlbTGluZVN1Ykdlb21ldHJ5LkVORF9QT1NJVElPTl9EQVRBXSA9IHRydWU7XG5cblx0XHRpZiAoc3ViR2VvbWV0cnkudGhpY2tuZXNzKVxuXHRcdFx0dGhpcy5fcFZlcnRleERhdGFEaXJ0eVtMaW5lU3ViR2VvbWV0cnkuVEhJQ0tORVNTX0RBVEFdID0gdHJ1ZTtcblxuXHRcdGlmIChzdWJHZW9tZXRyeS5zdGFydENvbG9ycylcblx0XHRcdHRoaXMuX3BWZXJ0ZXhEYXRhRGlydHlbTGluZVN1Ykdlb21ldHJ5LkNPTE9SX0RBVEFdID0gdHJ1ZTtcblxuXHRcdHJldHVybiBzdWJHZW9tZXRyeTtcblx0fVxuXG5cdC8qKlxuXHQgKiAvL1RPRE9cblx0ICpcblx0ICogQHBhcmFtIHBvb2xcblx0ICogQHBhcmFtIG1hdGVyaWFsT3duZXJcblx0ICogQHBhcmFtIGxldmVsXG5cdCAqIEBwYXJhbSBpbmRleE9mZnNldFxuXHQgKiBAcmV0dXJucyB7YXdheS5wb29sLkxpbmVTdWJNZXNoUmVuZGVyYWJsZX1cblx0ICogQHByaXZhdGVcblx0ICovXG5cdHB1YmxpYyBfcEdldE92ZXJmbG93UmVuZGVyYWJsZShwb29sOlJlbmRlcmFibGVQb29sLCBtYXRlcmlhbE93bmVyOklNYXRlcmlhbE93bmVyLCBsZXZlbDpudW1iZXIsIGluZGV4T2Zmc2V0Om51bWJlcik6UmVuZGVyYWJsZUJhc2Vcblx0e1xuXHRcdHJldHVybiBuZXcgTGluZVN1Yk1lc2hSZW5kZXJhYmxlKHBvb2wsIDxMaW5lU3ViTWVzaD4gbWF0ZXJpYWxPd25lciwgbGV2ZWwsIGluZGV4T2Zmc2V0KTtcblx0fVxufVxuXG5leHBvcnQgPSBMaW5lU3ViTWVzaFJlbmRlcmFibGU7Il19