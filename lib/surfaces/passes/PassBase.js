"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EventDispatcher_1 = require("@awayjs/core/lib/events/EventDispatcher");
var PassEvent_1 = require("../../events/PassEvent");
/**
 * PassBase provides an abstract base class for material shader passes. A material pass constitutes at least
 * a render call per required renderable.
 */
var PassBase = (function (_super) {
    __extends(PassBase, _super);
    /**
     * Creates a new PassBase object.
     */
    function PassBase(render, surface, elementsClass, stage) {
        _super.call(this);
        this._preserveAlpha = true;
        this._forceSeparateMVP = false;
        this._render = render;
        this._surface = surface;
        this._elementsClass = elementsClass;
        this._stage = stage;
    }
    Object.defineProperty(PassBase.prototype, "shader", {
        get: function () {
            return this._shader;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PassBase.prototype, "animationSet", {
        get: function () {
            return this._surface.animationSet;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PassBase.prototype, "preserveAlpha", {
        /**
         * Indicates whether the output alpha value should remain unchanged compared to the material's original alpha.
         */
        get: function () {
            return this._preserveAlpha;
        },
        set: function (value) {
            if (this._preserveAlpha == value)
                return;
            this._preserveAlpha = value;
            this.invalidate();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PassBase.prototype, "forceSeparateMVP", {
        /**
         * Indicates whether the screen projection should be calculated by forcing a separate scene matrix and
         * view-projection matrix. This is used to prevent rounding errors when using multiple passes with different
         * projection code.
         */
        get: function () {
            return this._forceSeparateMVP;
        },
        set: function (value) {
            if (this._forceSeparateMVP == value)
                return;
            this._forceSeparateMVP = value;
            this.invalidate();
        },
        enumerable: true,
        configurable: true
    });
    PassBase.prototype.getImageIndex = function (texture, index) {
        if (index === void 0) { index = 0; }
        return this._render.getImageIndex(texture, index);
    };
    /**
     * Marks the shader program as invalid, so it will be recompiled before the next render.
     */
    PassBase.prototype.invalidate = function () {
        this._shader.invalidateProgram();
        this.dispatchEvent(new PassEvent_1.PassEvent(PassEvent_1.PassEvent.INVALIDATE, this));
    };
    /**
     * Cleans up any resources used by the current object.
     * @param deep Indicates whether other resources should be cleaned up, that could potentially be shared across different instances.
     */
    PassBase.prototype.dispose = function () {
        this._render = null;
        this._surface = null;
        this._elementsClass = null;
        this._stage = null;
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
    PassBase.prototype._setRenderState = function (renderable, camera, viewProjection) {
        this._shader._setRenderState(renderable, camera, viewProjection);
    };
    /**
     * Sets the render state for the pass that is independent of the rendered object. This needs to be called before
     * calling pass. Before activating a pass, the previously used pass needs to be deactivated.
     * @param stage The Stage object which is currently used for rendering.
     * @param camera The camera from which the scene is viewed.
     * @private
     */
    PassBase.prototype._iActivate = function (camera) {
        this._shader._iActivate(camera);
    };
    /**
     * Clears the render state for the pass. This needs to be called before activating another pass.
     * @param stage The Stage used for rendering
     *
     * @private
     */
    PassBase.prototype._iDeactivate = function () {
        this._shader._iDeactivate();
    };
    PassBase.prototype._iIncludeDependencies = function (shader) {
        this._render._iIncludeDependencies(shader);
        if (this._forceSeparateMVP)
            shader.globalPosDependencies++;
    };
    PassBase.prototype._iInitConstantData = function (shader) {
    };
    PassBase.prototype._iGetPreLightingVertexCode = function (shader, registerCache, sharedRegisters) {
        return "";
    };
    PassBase.prototype._iGetPreLightingFragmentCode = function (shader, registerCache, sharedRegisters) {
        return "";
    };
    PassBase.prototype._iGetVertexCode = function (shader, registerCache, sharedRegisters) {
        return "";
    };
    PassBase.prototype._iGetFragmentCode = function (shader, registerCache, sharedRegisters) {
        return "";
    };
    PassBase.prototype._iGetNormalVertexCode = function (shader, registerCache, sharedRegisters) {
        return "";
    };
    PassBase.prototype._iGetNormalFragmentCode = function (shader, registerCache, sharedRegisters) {
        return "";
    };
    return PassBase;
}(EventDispatcher_1.EventDispatcher));
exports.PassBase = PassBase;
