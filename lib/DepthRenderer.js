"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var RendererBase_1 = require("./RendererBase");
var GL_DepthSurface_1 = require("./surfaces/GL_DepthSurface");
/**
 * The DepthRenderer class renders 32-bit depth information encoded as RGBA
 *
 * @class away.render.DepthRenderer
 */
var DepthRenderer = (function (_super) {
    __extends(DepthRenderer, _super);
    /**
     * Creates a new DepthRenderer object.
     * @param renderBlended Indicates whether semi-transparent objects should be rendered.
     * @param distanceBased Indicates whether the written depth value is distance-based or projected depth-based
     */
    function DepthRenderer(stage) {
        if (stage === void 0) { stage = null; }
        _super.call(this, stage, GL_DepthSurface_1.GL_DepthSurface);
        this._iBackgroundR = 1;
        this._iBackgroundG = 1;
        this._iBackgroundB = 1;
    }
    /**
     *
     */
    DepthRenderer.prototype.enterNode = function (node) {
        var enter = node._iCollectionMark != RendererBase_1.RendererBase._iCollectionMark && node.isCastingShadow();
        if (!enter) {
            node._iCollectionMark = RendererBase_1.RendererBase._iCollectionMark;
            return false;
        }
        return _super.prototype.enterNode.call(this, node);
    };
    return DepthRenderer;
}(RendererBase_1.RendererBase));
exports.DepthRenderer = DepthRenderer;
