var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Vector3D = require("awayjs-core/lib/core/geom/Vector3D");
var AnimationClipNodeBase = require("awayjs-renderergl/lib/animators/nodes/AnimationClipNodeBase");
var VertexClipState = require("awayjs-renderergl/lib/animators/states/VertexClipState");
/**
 * A vertex animation node containing time-based animation data as individual geometry obejcts.
 */
var VertexClipNode = (function (_super) {
    __extends(VertexClipNode, _super);
    /**
     * Creates a new <code>VertexClipNode</code> object.
     */
    function VertexClipNode() {
        _super.call(this);
        this._frames = new Array();
        this._translations = new Array();
        this._pStateClass = VertexClipState;
    }
    Object.defineProperty(VertexClipNode.prototype, "frames", {
        /**
         * Returns a vector of geometry frames representing the vertex values of each animation frame in the clip.
         */
        get: function () {
            return this._frames;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Adds a geometry object to the internal timeline of the animation node.
     *
     * @param geometry The geometry object to add to the timeline of the node.
     * @param duration The specified duration of the frame in milliseconds.
     * @param translation The absolute translation of the frame, used in root delta calculations for mesh movement.
     */
    VertexClipNode.prototype.addFrame = function (geometry, duration /*uint*/, translation) {
        if (translation === void 0) { translation = null; }
        this._frames.push(geometry);
        this._pDurations.push(duration);
        this._translations.push(translation || new Vector3D());
        this._pNumFrames = this._pDurations.length;
        this._pStitchDirty = true;
    };
    /**
     * @inheritDoc
     */
    VertexClipNode.prototype._pUpdateStitch = function () {
        _super.prototype._pUpdateStitch.call(this);
        var i = this._pNumFrames - 1;
        var p1, p2, delta;
        while (i--) {
            this._pTotalDuration += this._pDurations[i];
            p1 = this._translations[i];
            p2 = this._translations[i + 1];
            delta = p2.subtract(p1);
            this._pTotalDelta.x += delta.x;
            this._pTotalDelta.y += delta.y;
            this._pTotalDelta.z += delta.z;
        }
        if (this._pNumFrames > 1 && (this._pStitchFinalFrame || !this._pLooping)) {
            this._pTotalDuration += this._pDurations[this._pNumFrames - 1];
            p1 = this._translations[0];
            p2 = this._translations[1];
            delta = p2.subtract(p1);
            this._pTotalDelta.x += delta.x;
            this._pTotalDelta.y += delta.y;
            this._pTotalDelta.z += delta.z;
        }
    };
    return VertexClipNode;
})(AnimationClipNodeBase);
module.exports = VertexClipNode;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuaW1hdG9ycy9ub2Rlcy92ZXJ0ZXhjbGlwbm9kZS50cyJdLCJuYW1lcyI6WyJWZXJ0ZXhDbGlwTm9kZSIsIlZlcnRleENsaXBOb2RlLmNvbnN0cnVjdG9yIiwiVmVydGV4Q2xpcE5vZGUuZnJhbWVzIiwiVmVydGV4Q2xpcE5vZGUuYWRkRnJhbWUiLCJWZXJ0ZXhDbGlwTm9kZS5fcFVwZGF0ZVN0aXRjaCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0EsSUFBTyxRQUFRLFdBQWlCLG9DQUFvQyxDQUFDLENBQUM7QUFJdEUsSUFBTyxxQkFBcUIsV0FBYSw2REFBNkQsQ0FBQyxDQUFDO0FBQ3hHLElBQU8sZUFBZSxXQUFlLHdEQUF3RCxDQUFDLENBQUM7QUFFL0YsQUFHQTs7R0FERztJQUNHLGNBQWM7SUFBU0EsVUFBdkJBLGNBQWNBLFVBQThCQTtJQWFqREE7O09BRUdBO0lBQ0hBLFNBaEJLQSxjQUFjQTtRQWtCbEJDLGlCQUFPQSxDQUFDQTtRQWhCREEsWUFBT0EsR0FBbUJBLElBQUlBLEtBQUtBLEVBQVlBLENBQUNBO1FBQ2hEQSxrQkFBYUEsR0FBbUJBLElBQUlBLEtBQUtBLEVBQVlBLENBQUNBO1FBaUI3REEsSUFBSUEsQ0FBQ0EsWUFBWUEsR0FBR0EsZUFBZUEsQ0FBQ0E7SUFDckNBLENBQUNBO0lBYkRELHNCQUFXQSxrQ0FBTUE7UUFIakJBOztXQUVHQTthQUNIQTtZQUVDRSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQTtRQUNyQkEsQ0FBQ0E7OztPQUFBRjtJQVlEQTs7Ozs7O09BTUdBO0lBQ0lBLGlDQUFRQSxHQUFmQSxVQUFnQkEsUUFBaUJBLEVBQUVBLFFBQVFBLENBQVFBLFFBQURBLEFBQVNBLEVBQUVBLFdBQTJCQTtRQUEzQkcsMkJBQTJCQSxHQUEzQkEsa0JBQTJCQTtRQUV2RkEsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0E7UUFDNUJBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBO1FBQ2hDQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQSxJQUFJQSxDQUFDQSxXQUFXQSxJQUFJQSxJQUFJQSxRQUFRQSxFQUFFQSxDQUFDQSxDQUFDQTtRQUV2REEsSUFBSUEsQ0FBQ0EsV0FBV0EsR0FBR0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsTUFBTUEsQ0FBQ0E7UUFFM0NBLElBQUlBLENBQUNBLGFBQWFBLEdBQUdBLElBQUlBLENBQUNBO0lBQzNCQSxDQUFDQTtJQUVESDs7T0FFR0E7SUFDSUEsdUNBQWNBLEdBQXJCQTtRQUVDSSxnQkFBS0EsQ0FBQ0EsY0FBY0EsV0FBRUEsQ0FBQ0E7UUFFdkJBLElBQUlBLENBQUNBLEdBQW1CQSxJQUFJQSxDQUFDQSxXQUFXQSxHQUFHQSxDQUFDQSxDQUFDQTtRQUM3Q0EsSUFBSUEsRUFBV0EsRUFBRUEsRUFBV0EsRUFBRUEsS0FBY0EsQ0FBQ0E7UUFDN0NBLE9BQU9BLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBO1lBQ1pBLElBQUlBLENBQUNBLGVBQWVBLElBQUlBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQzVDQSxFQUFFQSxHQUFHQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUMzQkEsRUFBRUEsR0FBR0EsSUFBSUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDL0JBLEtBQUtBLEdBQUdBLEVBQUVBLENBQUNBLFFBQVFBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBO1lBQ3hCQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxDQUFDQSxJQUFJQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUMvQkEsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDL0JBLElBQUlBLENBQUNBLFlBQVlBLENBQUNBLENBQUNBLElBQUlBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBO1FBQ2hDQSxDQUFDQTtRQUVEQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxXQUFXQSxHQUFHQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxrQkFBa0JBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQzFFQSxJQUFJQSxDQUFDQSxlQUFlQSxJQUFJQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxJQUFJQSxDQUFDQSxXQUFXQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUMvREEsRUFBRUEsR0FBR0EsSUFBSUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDM0JBLEVBQUVBLEdBQUdBLElBQUlBLENBQUNBLGFBQWFBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQzNCQSxLQUFLQSxHQUFHQSxFQUFFQSxDQUFDQSxRQUFRQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQTtZQUN4QkEsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDL0JBLElBQUlBLENBQUNBLFlBQVlBLENBQUNBLENBQUNBLElBQUlBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBO1lBQy9CQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxDQUFDQSxJQUFJQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUNoQ0EsQ0FBQ0E7SUFDRkEsQ0FBQ0E7SUFDRkoscUJBQUNBO0FBQURBLENBdEVBLEFBc0VDQSxFQXRFNEIscUJBQXFCLEVBc0VqRDtBQUVELEFBQXdCLGlCQUFmLGNBQWMsQ0FBQyIsImZpbGUiOiJhbmltYXRvcnMvbm9kZXMvVmVydGV4Q2xpcE5vZGUuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL3JvYmJhdGVtYW4vV2Vic3Rvcm1Qcm9qZWN0cy9hd2F5anMtcmVuZGVyZXJnbC8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgR2VvbWV0cnlcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9jb3JlL2Jhc2UvR2VvbWV0cnlcIik7XG5pbXBvcnQgVmVjdG9yM0RcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9jb3JlL2dlb20vVmVjdG9yM0RcIik7XG5cbmltcG9ydCBBbmltYXRvckJhc2VcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvYW5pbWF0b3JzL0FuaW1hdG9yQmFzZVwiKTtcblxuaW1wb3J0IEFuaW1hdGlvbkNsaXBOb2RlQmFzZVx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvbm9kZXMvQW5pbWF0aW9uQ2xpcE5vZGVCYXNlXCIpO1xuaW1wb3J0IFZlcnRleENsaXBTdGF0ZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL3N0YXRlcy9WZXJ0ZXhDbGlwU3RhdGVcIik7XG5cbi8qKlxuICogQSB2ZXJ0ZXggYW5pbWF0aW9uIG5vZGUgY29udGFpbmluZyB0aW1lLWJhc2VkIGFuaW1hdGlvbiBkYXRhIGFzIGluZGl2aWR1YWwgZ2VvbWV0cnkgb2JlamN0cy5cbiAqL1xuY2xhc3MgVmVydGV4Q2xpcE5vZGUgZXh0ZW5kcyBBbmltYXRpb25DbGlwTm9kZUJhc2Vcbntcblx0cHJpdmF0ZSBfZnJhbWVzOkFycmF5PEdlb21ldHJ5PiA9IG5ldyBBcnJheTxHZW9tZXRyeT4oKTtcblx0cHJpdmF0ZSBfdHJhbnNsYXRpb25zOkFycmF5PFZlY3RvcjNEPiA9IG5ldyBBcnJheTxWZWN0b3IzRD4oKTtcblxuXHQvKipcblx0ICogUmV0dXJucyBhIHZlY3RvciBvZiBnZW9tZXRyeSBmcmFtZXMgcmVwcmVzZW50aW5nIHRoZSB2ZXJ0ZXggdmFsdWVzIG9mIGVhY2ggYW5pbWF0aW9uIGZyYW1lIGluIHRoZSBjbGlwLlxuXHQgKi9cblx0cHVibGljIGdldCBmcmFtZXMoKTpBcnJheTxHZW9tZXRyeT5cblx0e1xuXHRcdHJldHVybiB0aGlzLl9mcmFtZXM7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyA8Y29kZT5WZXJ0ZXhDbGlwTm9kZTwvY29kZT4gb2JqZWN0LlxuXHQgKi9cblx0Y29uc3RydWN0b3IoKVxuXHR7XG5cdFx0c3VwZXIoKTtcblxuXHRcdHRoaXMuX3BTdGF0ZUNsYXNzID0gVmVydGV4Q2xpcFN0YXRlO1xuXHR9XG5cblx0LyoqXG5cdCAqIEFkZHMgYSBnZW9tZXRyeSBvYmplY3QgdG8gdGhlIGludGVybmFsIHRpbWVsaW5lIG9mIHRoZSBhbmltYXRpb24gbm9kZS5cblx0ICpcblx0ICogQHBhcmFtIGdlb21ldHJ5IFRoZSBnZW9tZXRyeSBvYmplY3QgdG8gYWRkIHRvIHRoZSB0aW1lbGluZSBvZiB0aGUgbm9kZS5cblx0ICogQHBhcmFtIGR1cmF0aW9uIFRoZSBzcGVjaWZpZWQgZHVyYXRpb24gb2YgdGhlIGZyYW1lIGluIG1pbGxpc2Vjb25kcy5cblx0ICogQHBhcmFtIHRyYW5zbGF0aW9uIFRoZSBhYnNvbHV0ZSB0cmFuc2xhdGlvbiBvZiB0aGUgZnJhbWUsIHVzZWQgaW4gcm9vdCBkZWx0YSBjYWxjdWxhdGlvbnMgZm9yIG1lc2ggbW92ZW1lbnQuXG5cdCAqL1xuXHRwdWJsaWMgYWRkRnJhbWUoZ2VvbWV0cnk6R2VvbWV0cnksIGR1cmF0aW9uOm51bWJlciAvKnVpbnQqLywgdHJhbnNsYXRpb246VmVjdG9yM0QgPSBudWxsKVxuXHR7XG5cdFx0dGhpcy5fZnJhbWVzLnB1c2goZ2VvbWV0cnkpO1xuXHRcdHRoaXMuX3BEdXJhdGlvbnMucHVzaChkdXJhdGlvbik7XG5cdFx0dGhpcy5fdHJhbnNsYXRpb25zLnB1c2godHJhbnNsYXRpb24gfHwgbmV3IFZlY3RvcjNEKCkpO1xuXG5cdFx0dGhpcy5fcE51bUZyYW1lcyA9IHRoaXMuX3BEdXJhdGlvbnMubGVuZ3RoO1xuXG5cdFx0dGhpcy5fcFN0aXRjaERpcnR5ID0gdHJ1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIF9wVXBkYXRlU3RpdGNoKClcblx0e1xuXHRcdHN1cGVyLl9wVXBkYXRlU3RpdGNoKCk7XG5cblx0XHR2YXIgaTpudW1iZXIgLyp1aW50Ki8gPSB0aGlzLl9wTnVtRnJhbWVzIC0gMTtcblx0XHR2YXIgcDE6VmVjdG9yM0QsIHAyOlZlY3RvcjNELCBkZWx0YTpWZWN0b3IzRDtcblx0XHR3aGlsZSAoaS0tKSB7XG5cdFx0XHR0aGlzLl9wVG90YWxEdXJhdGlvbiArPSB0aGlzLl9wRHVyYXRpb25zW2ldO1xuXHRcdFx0cDEgPSB0aGlzLl90cmFuc2xhdGlvbnNbaV07XG5cdFx0XHRwMiA9IHRoaXMuX3RyYW5zbGF0aW9uc1tpICsgMV07XG5cdFx0XHRkZWx0YSA9IHAyLnN1YnRyYWN0KHAxKTtcblx0XHRcdHRoaXMuX3BUb3RhbERlbHRhLnggKz0gZGVsdGEueDtcblx0XHRcdHRoaXMuX3BUb3RhbERlbHRhLnkgKz0gZGVsdGEueTtcblx0XHRcdHRoaXMuX3BUb3RhbERlbHRhLnogKz0gZGVsdGEuejtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5fcE51bUZyYW1lcyA+IDEgJiYgKHRoaXMuX3BTdGl0Y2hGaW5hbEZyYW1lIHx8ICF0aGlzLl9wTG9vcGluZykpIHtcblx0XHRcdHRoaXMuX3BUb3RhbER1cmF0aW9uICs9IHRoaXMuX3BEdXJhdGlvbnNbdGhpcy5fcE51bUZyYW1lcyAtIDFdO1xuXHRcdFx0cDEgPSB0aGlzLl90cmFuc2xhdGlvbnNbMF07XG5cdFx0XHRwMiA9IHRoaXMuX3RyYW5zbGF0aW9uc1sxXTtcblx0XHRcdGRlbHRhID0gcDIuc3VidHJhY3QocDEpO1xuXHRcdFx0dGhpcy5fcFRvdGFsRGVsdGEueCArPSBkZWx0YS54O1xuXHRcdFx0dGhpcy5fcFRvdGFsRGVsdGEueSArPSBkZWx0YS55O1xuXHRcdFx0dGhpcy5fcFRvdGFsRGVsdGEueiArPSBkZWx0YS56O1xuXHRcdH1cblx0fVxufVxuXG5leHBvcnQgPSBWZXJ0ZXhDbGlwTm9kZTsiXX0=