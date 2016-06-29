"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PassEvent_1 = require("../events/PassEvent");
var GL_SurfaceBase_1 = require("../surfaces/GL_SurfaceBase");
/**
 * GL_SurfacePassBase provides an abstract base class for material shader passes. A material pass constitutes at least
 * a render call per required renderable.
 */
var GL_SurfacePassBase = (function (_super) {
    __extends(GL_SurfacePassBase, _super);
    function GL_SurfacePassBase() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(GL_SurfacePassBase.prototype, "shader", {
        get: function () {
            return this._shader;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GL_SurfacePassBase.prototype, "animationSet", {
        get: function () {
            return this._surface.animationSet;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Marks the shader program as invalid, so it will be recompiled before the next render.
     */
    GL_SurfacePassBase.prototype.invalidate = function () {
        this._shader.invalidateProgram();
        this.dispatchEvent(new PassEvent_1.PassEvent(PassEvent_1.PassEvent.INVALIDATE, this));
    };
    GL_SurfacePassBase.prototype.dispose = function () {
        if (this._shader) {
            this._shader.dispose();
            this._shader = null;
        }
    };
    /**
     * Renders the current pass. Before calling pass, activatePass needs to be called with the same index.
     * @param pass The pass used to render the renderable.
     * @param renderable The IRenderable object to draw.
     * @param stage The Stage object used for rendering.
     * @param entityCollector The EntityCollector object that contains the visible scene data.
     * @param viewProjection The view-projection matrix used to project to the screen. This is not the same as
     * camera.viewProjection as it includes the scaling factors when rendering to textures.
     *
     * @internal
     */
    GL_SurfacePassBase.prototype._setRenderState = function (renderable, camera, viewProjection) {
        this._shader._setRenderState(renderable, camera, viewProjection);
    };
    /**
     * Sets the render state for the pass that is independent of the rendered object. This needs to be called before
     * calling pass. Before activating a pass, the previously used pass needs to be deactivated.
     * @param stage The Stage object which is currently used for rendering.
     * @param camera The camera from which the scene is viewed.
     * @private
     */
    GL_SurfacePassBase.prototype._iActivate = function (camera) {
        this._shader._iActivate(camera);
    };
    /**
     * Clears the render state for the pass. This needs to be called before activating another pass.
     * @param stage The Stage used for rendering
     *
     * @private
     */
    GL_SurfacePassBase.prototype._iDeactivate = function () {
        this._shader._iDeactivate();
    };
    GL_SurfacePassBase.prototype._iInitConstantData = function (shader) {
    };
    GL_SurfacePassBase.prototype._iGetPreLightingVertexCode = function (shader, registerCache, sharedRegisters) {
        return "";
    };
    GL_SurfacePassBase.prototype._iGetPreLightingFragmentCode = function (shader, registerCache, sharedRegisters) {
        return "";
    };
    GL_SurfacePassBase.prototype._iGetVertexCode = function (shader, registerCache, sharedRegisters) {
        return "";
    };
    GL_SurfacePassBase.prototype._iGetFragmentCode = function (shader, registerCache, sharedRegisters) {
        return "";
    };
    GL_SurfacePassBase.prototype._iGetNormalVertexCode = function (shader, registerCache, sharedRegisters) {
        return "";
    };
    GL_SurfacePassBase.prototype._iGetNormalFragmentCode = function (shader, registerCache, sharedRegisters) {
        return "";
    };
    return GL_SurfacePassBase;
}(GL_SurfaceBase_1.GL_SurfaceBase));
exports.GL_SurfacePassBase = GL_SurfacePassBase;
