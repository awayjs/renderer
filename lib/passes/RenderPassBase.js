var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var BlendMode = require("awayjs-core/lib/data/BlendMode");
var ArgumentError = require("awayjs-core/lib/errors/ArgumentError");
var Event = require("awayjs-core/lib/events/Event");
var EventDispatcher = require("awayjs-core/lib/events/EventDispatcher");
var ContextGLBlendFactor = require("awayjs-stagegl/lib/base/ContextGLBlendFactor");
var ContextGLCompareMode = require("awayjs-stagegl/lib/base/ContextGLCompareMode");
/**
 * RenderPassBase provides an abstract base class for material shader passes. A material pass constitutes at least
 * a render call per required renderable.
 */
var RenderPassBase = (function (_super) {
    __extends(RenderPassBase, _super);
    /**
     * Creates a new RenderPassBase object.
     */
    function RenderPassBase(renderObject, renderObjectOwner, renderableClass, stage) {
        _super.call(this);
        this._preserveAlpha = true;
        this._forceSeparateMVP = false;
        this._depthCompareMode = ContextGLCompareMode.LESS_EQUAL;
        this._blendFactorSource = ContextGLBlendFactor.ONE;
        this._blendFactorDest = ContextGLBlendFactor.ZERO;
        this._pEnableBlending = false;
        this._writeDepth = true;
        this._renderObject = renderObject;
        this._renderObjectOwner = renderObjectOwner;
        this._renderableClass = renderableClass;
        this._stage = stage;
    }
    Object.defineProperty(RenderPassBase.prototype, "shader", {
        get: function () {
            return this._shader;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RenderPassBase.prototype, "animationSet", {
        get: function () {
            return this._renderObjectOwner.animationSet;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RenderPassBase.prototype, "preserveAlpha", {
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
            this.invalidatePass();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RenderPassBase.prototype, "forceSeparateMVP", {
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
            this.invalidatePass();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RenderPassBase.prototype, "writeDepth", {
        /**
         * Indicate whether this pass should write to the depth buffer or not. Ignored when blending is enabled.
         */
        get: function () {
            return this._writeDepth;
        },
        set: function (value) {
            this._writeDepth = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RenderPassBase.prototype, "depthCompareMode", {
        /**
         * The depth compare mode used to render the renderables using this material.
         *
         * @see away.stagegl.ContextGLCompareMode
         */
        get: function () {
            return this._depthCompareMode;
        },
        set: function (value) {
            this._depthCompareMode = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Cleans up any resources used by the current object.
     * @param deep Indicates whether other resources should be cleaned up, that could potentially be shared across different instances.
     */
    RenderPassBase.prototype.dispose = function () {
        this._shader.dispose();
        this._shader = null;
    };
    /**
     * Renders the current pass. Before calling renderPass, activatePass needs to be called with the same index.
     * @param pass The pass used to render the renderable.
     * @param renderable The IRenderable object to draw.
     * @param stage The Stage object used for rendering.
     * @param entityCollector The EntityCollector object that contains the visible scene data.
     * @param viewProjection The view-projection matrix used to project to the screen. This is not the same as
     * camera.viewProjection as it includes the scaling factors when rendering to textures.
     *
     * @internal
     */
    RenderPassBase.prototype._iRender = function (renderable, camera, viewProjection) {
        this._shader._iRender(renderable, camera, viewProjection);
    };
    /**
     * The blend mode to use when drawing this renderable. The following blend modes are supported:
     * <ul>
     * <li>BlendMode.NORMAL: No blending, unless the material inherently needs it</li>
     * <li>BlendMode.LAYER: Force blending. This will draw the object the same as NORMAL, but without writing depth writes.</li>
     * <li>BlendMode.MULTIPLY</li>
     * <li>BlendMode.ADD</li>
     * <li>BlendMode.ALPHA</li>
     * </ul>
     */
    RenderPassBase.prototype.setBlendMode = function (value) {
        switch (value) {
            case BlendMode.NORMAL:
                this._blendFactorSource = ContextGLBlendFactor.ONE;
                this._blendFactorDest = ContextGLBlendFactor.ZERO;
                this._pEnableBlending = false;
                break;
            case BlendMode.LAYER:
                this._blendFactorSource = ContextGLBlendFactor.SOURCE_ALPHA;
                this._blendFactorDest = ContextGLBlendFactor.ONE_MINUS_SOURCE_ALPHA;
                this._pEnableBlending = true;
                break;
            case BlendMode.MULTIPLY:
                this._blendFactorSource = ContextGLBlendFactor.ZERO;
                this._blendFactorDest = ContextGLBlendFactor.SOURCE_COLOR;
                this._pEnableBlending = true;
                break;
            case BlendMode.ADD:
                this._blendFactorSource = ContextGLBlendFactor.SOURCE_ALPHA;
                this._blendFactorDest = ContextGLBlendFactor.ONE;
                this._pEnableBlending = true;
                break;
            case BlendMode.ALPHA:
                this._blendFactorSource = ContextGLBlendFactor.ZERO;
                this._blendFactorDest = ContextGLBlendFactor.SOURCE_ALPHA;
                this._pEnableBlending = true;
                break;
            default:
                throw new ArgumentError("Unsupported blend mode!");
        }
    };
    /**
     * Sets the render state for the pass that is independent of the rendered object. This needs to be called before
     * calling renderPass. Before activating a pass, the previously used pass needs to be deactivated.
     * @param stage The Stage object which is currently used for rendering.
     * @param camera The camera from which the scene is viewed.
     * @private
     */
    RenderPassBase.prototype._iActivate = function (camera) {
        this._stage.context.setDepthTest((this._writeDepth && !this._pEnableBlending), this._depthCompareMode);
        if (this._pEnableBlending)
            this._stage.context.setBlendFactors(this._blendFactorSource, this._blendFactorDest);
        this._shader._iActivate(camera);
    };
    /**
     * Clears the render state for the pass. This needs to be called before activating another pass.
     * @param stage The Stage used for rendering
     *
     * @private
     */
    RenderPassBase.prototype._iDeactivate = function () {
        this._shader._iDeactivate();
        //For the love of god don't remove this if you want your multi-material shadows to not flicker like shit
        this._stage.context.setDepthTest(true, ContextGLCompareMode.LESS_EQUAL);
    };
    /**
     * Marks the shader program as invalid, so it will be recompiled before the next render.
     *
     * @param updateMaterial Indicates whether the invalidation should be performed on the entire material. Should always pass "true" unless it's called from the material itself.
     */
    RenderPassBase.prototype.invalidatePass = function () {
        this._shader.invalidateShader();
        this.dispatchEvent(new Event(Event.CHANGE));
    };
    RenderPassBase.prototype._iIncludeDependencies = function (shaderObject) {
        this._renderObject._iIncludeDependencies(shaderObject);
        if (this._forceSeparateMVP)
            shaderObject.globalPosDependencies++;
    };
    RenderPassBase.prototype._iInitConstantData = function (shaderObject) {
    };
    RenderPassBase.prototype._iGetPreLightingVertexCode = function (shaderObject, registerCache, sharedRegisters) {
        return "";
    };
    RenderPassBase.prototype._iGetPreLightingFragmentCode = function (shaderObject, registerCache, sharedRegisters) {
        return "";
    };
    RenderPassBase.prototype._iGetVertexCode = function (shaderObject, registerCache, sharedRegisters) {
        return "";
    };
    RenderPassBase.prototype._iGetFragmentCode = function (shaderObject, registerCache, sharedRegisters) {
        return "";
    };
    RenderPassBase.prototype._iGetNormalVertexCode = function (shaderObject, registerCache, sharedRegisters) {
        return "";
    };
    RenderPassBase.prototype._iGetNormalFragmentCode = function (shaderObject, registerCache, sharedRegisters) {
        return "";
    };
    /**
     * Indicates whether or not normals are calculated at all.
     */
    RenderPassBase.prototype._pOutputsNormals = function (shaderObject) {
        return false;
    };
    /**
     * Indicates whether or not normals are calculated in tangent space.
     */
    RenderPassBase.prototype._pOutputsTangentNormals = function (shaderObject) {
        return false;
    };
    /**
     * Indicates whether or not normals are allowed in tangent space. This is only the case if no object-space
     * dependencies exist.
     */
    RenderPassBase.prototype._pUsesTangentSpace = function (shaderObject) {
        return false;
    };
    return RenderPassBase;
})(EventDispatcher);
module.exports = RenderPassBase;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9wYXNzZXMvUmVuZGVyUGFzc0Jhc2UudHMiXSwibmFtZXMiOlsiUmVuZGVyUGFzc0Jhc2UiLCJSZW5kZXJQYXNzQmFzZS5jb25zdHJ1Y3RvciIsIlJlbmRlclBhc3NCYXNlLnNoYWRlciIsIlJlbmRlclBhc3NCYXNlLmFuaW1hdGlvblNldCIsIlJlbmRlclBhc3NCYXNlLnByZXNlcnZlQWxwaGEiLCJSZW5kZXJQYXNzQmFzZS5mb3JjZVNlcGFyYXRlTVZQIiwiUmVuZGVyUGFzc0Jhc2Uud3JpdGVEZXB0aCIsIlJlbmRlclBhc3NCYXNlLmRlcHRoQ29tcGFyZU1vZGUiLCJSZW5kZXJQYXNzQmFzZS5kaXNwb3NlIiwiUmVuZGVyUGFzc0Jhc2UuX2lSZW5kZXIiLCJSZW5kZXJQYXNzQmFzZS5zZXRCbGVuZE1vZGUiLCJSZW5kZXJQYXNzQmFzZS5faUFjdGl2YXRlIiwiUmVuZGVyUGFzc0Jhc2UuX2lEZWFjdGl2YXRlIiwiUmVuZGVyUGFzc0Jhc2UuaW52YWxpZGF0ZVBhc3MiLCJSZW5kZXJQYXNzQmFzZS5faUluY2x1ZGVEZXBlbmRlbmNpZXMiLCJSZW5kZXJQYXNzQmFzZS5faUluaXRDb25zdGFudERhdGEiLCJSZW5kZXJQYXNzQmFzZS5faUdldFByZUxpZ2h0aW5nVmVydGV4Q29kZSIsIlJlbmRlclBhc3NCYXNlLl9pR2V0UHJlTGlnaHRpbmdGcmFnbWVudENvZGUiLCJSZW5kZXJQYXNzQmFzZS5faUdldFZlcnRleENvZGUiLCJSZW5kZXJQYXNzQmFzZS5faUdldEZyYWdtZW50Q29kZSIsIlJlbmRlclBhc3NCYXNlLl9pR2V0Tm9ybWFsVmVydGV4Q29kZSIsIlJlbmRlclBhc3NCYXNlLl9pR2V0Tm9ybWFsRnJhZ21lbnRDb2RlIiwiUmVuZGVyUGFzc0Jhc2UuX3BPdXRwdXRzTm9ybWFscyIsIlJlbmRlclBhc3NCYXNlLl9wT3V0cHV0c1RhbmdlbnROb3JtYWxzIiwiUmVuZGVyUGFzc0Jhc2UuX3BVc2VzVGFuZ2VudFNw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c0IsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7SUFDZEEsQ0FBQ0E7SUFFRHRCOztPQUVHQTtJQUNJQSxnREFBdUJBLEdBQTlCQSxVQUErQkEsWUFBNkJBO1FBRTNEdUIsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7SUFDZEEsQ0FBQ0E7SUFFRHZCOzs7T0FHR0E7SUFDSUEsMkNBQWtCQSxHQUF6QkEsVUFBMEJBLFlBQTZCQTtRQUV0RHdCLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBO0lBQ2RBLENBQUNBO0lBQ0Z4QixxQkFBQ0E7QUFBREEsQ0F4U0EsQUF3U0NBLEVBeFM0QixlQUFlLEVBd1MzQztBQUVELEFBQXdCLGlCQUFmLGNBQWMsQ0FBQyIsImZpbGUiOiJwYXNzZXMvUmVuZGVyUGFzc0Jhc2UuanMiLCJzb3VyY2VSb290IjoiLi4vIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJsZW5kTW9kZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZGF0YS9CbGVuZE1vZGVcIik7XG5pbXBvcnQgTWF0cml4M0RcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZ2VvbS9NYXRyaXgzRFwiKTtcbmltcG9ydCBNYXRyaXgzRFV0aWxzXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZ2VvbS9NYXRyaXgzRFV0aWxzXCIpO1xuaW1wb3J0IEFzc2V0QmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvbGlicmFyeS9Bc3NldEJhc2VcIik7XG5pbXBvcnQgQXJndW1lbnRFcnJvclx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2Vycm9ycy9Bcmd1bWVudEVycm9yXCIpO1xuaW1wb3J0IEV2ZW50XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2V2ZW50cy9FdmVudFwiKTtcbmltcG9ydCBFdmVudERpc3BhdGNoZXJcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9ldmVudHMvRXZlbnREaXNwYXRjaGVyXCIpO1xuXG5pbXBvcnQgQ2FtZXJhXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2VudGl0aWVzL0NhbWVyYVwiKTtcbmltcG9ydCBMaWdodFBpY2tlckJhc2VcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9tYXRlcmlhbHMvbGlnaHRwaWNrZXJzL0xpZ2h0UGlja2VyQmFzZVwiKTtcbmltcG9ydCBJUmVuZGVyT2JqZWN0T3duZXJcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvYmFzZS9JUmVuZGVyT2JqZWN0T3duZXJcIik7XG5cbmltcG9ydCBTdGFnZVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9iYXNlL1N0YWdlXCIpXG5pbXBvcnQgQ29udGV4dEdMQmxlbmRGYWN0b3JcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvYmFzZS9Db250ZXh0R0xCbGVuZEZhY3RvclwiKTtcbmltcG9ydCBDb250ZXh0R0xDb21wYXJlTW9kZVx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9iYXNlL0NvbnRleHRHTENvbXBhcmVNb2RlXCIpO1xuXG5pbXBvcnQgQW5pbWF0aW9uU2V0QmFzZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9BbmltYXRpb25TZXRCYXNlXCIpO1xuaW1wb3J0IFJlbmRlcmVyQmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYmFzZS9SZW5kZXJlckJhc2VcIik7XG5pbXBvcnQgUmVuZGVyYWJsZUJhc2VcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9wb29sL1JlbmRlcmFibGVCYXNlXCIpO1xuaW1wb3J0IFNoYWRlck9iamVjdEJhc2VcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9jb21waWxhdGlvbi9TaGFkZXJPYmplY3RCYXNlXCIpO1xuaW1wb3J0IFNoYWRlclJlZ2lzdGVyQ2FjaGVcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJDYWNoZVwiKTtcbmltcG9ydCBTaGFkZXJSZWdpc3RlckRhdGFcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJEYXRhXCIpO1xuaW1wb3J0IElSZW5kZXJhYmxlQ2xhc3NcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9wb29sL0lSZW5kZXJhYmxlQ2xhc3NcIik7XG5pbXBvcnQgSVJlbmRlclBhc3NCYXNlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvcGFzc2VzL0lSZW5kZXJQYXNzQmFzZVwiKTtcbmltcG9ydCBSZW5kZXJPYmplY3RCYXNlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvY29tcGlsYXRpb24vUmVuZGVyT2JqZWN0QmFzZVwiKTtcblxuLyoqXG4gKiBSZW5kZXJQYXNzQmFzZSBwcm92aWRlcyBhbiBhYnN0cmFjdCBiYXNlIGNsYXNzIGZvciBtYXRlcmlhbCBzaGFkZXIgcGFzc2VzLiBBIG1hdGVyaWFsIHBhc3MgY29uc3RpdHV0ZXMgYXQgbGVhc3RcbiAqIGEgcmVuZGVyIGNhbGwgcGVyIHJlcXVpcmVkIHJlbmRlcmFibGUuXG4gKi9cbmNsYXNzIFJlbmRlclBhc3NCYXNlIGV4dGVuZHMgRXZlbnREaXNwYXRjaGVyIGltcGxlbWVudHMgSVJlbmRlclBhc3NCYXNlXG57XG5cdHByaXZhdGUgX3JlbmRlck9iamVjdDpSZW5kZXJPYmplY3RCYXNlO1xuXHRwdWJsaWMgX3JlbmRlck9iamVjdE93bmVyOklSZW5kZXJPYmplY3RPd25lcjtcblx0cHVibGljIF9yZW5kZXJhYmxlQ2xhc3M6SVJlbmRlcmFibGVDbGFzcztcblx0cHVibGljIF9zdGFnZTpTdGFnZTtcblx0XG5cdHB1YmxpYyBfc2hhZGVyOlNoYWRlck9iamVjdEJhc2U7XG5cblx0cHJpdmF0ZSBfcHJlc2VydmVBbHBoYTpib29sZWFuID0gdHJ1ZTtcblx0cHJpdmF0ZSBfZm9yY2VTZXBhcmF0ZU1WUDpib29sZWFuID0gZmFsc2U7XG5cblx0cHJpdmF0ZSBfZGVwdGhDb21wYXJlTW9kZTpzdHJpbmcgPSBDb250ZXh0R0xDb21wYXJlTW9kZS5MRVNTX0VRVUFMO1xuXG5cdHByaXZhdGUgX2JsZW5kRmFjdG9yU291cmNlOnN0cmluZyA9IENvbnRleHRHTEJsZW5kRmFjdG9yLk9ORTtcblx0cHJpdmF0ZSBfYmxlbmRGYWN0b3JEZXN0OnN0cmluZyA9IENvbnRleHRHTEJsZW5kRmFjdG9yLlpFUk87XG5cblx0cHVibGljIF9wRW5hYmxlQmxlbmRpbmc6Ym9vbGVhbiA9IGZhbHNlO1xuXG5cdHByaXZhdGUgX3dyaXRlRGVwdGg6Ym9vbGVhbiA9IHRydWU7XG5cblx0cHVibGljIGdldCBzaGFkZXIoKTpTaGFkZXJPYmplY3RCYXNlXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fc2hhZGVyO1xuXHR9XG5cblx0cHVibGljIGdldCBhbmltYXRpb25TZXQoKTpBbmltYXRpb25TZXRCYXNlXG5cdHtcblx0XHRyZXR1cm4gPEFuaW1hdGlvblNldEJhc2U+IHRoaXMuX3JlbmRlck9iamVjdE93bmVyLmFuaW1hdGlvblNldDtcblx0fVxuXG5cdC8qKlxuXHQgKiBJbmRpY2F0ZXMgd2hldGhlciB0aGUgb3V0cHV0IGFscGhhIHZhbHVlIHNob3VsZCByZW1haW4gdW5jaGFuZ2VkIGNvbXBhcmVkIHRvIHRoZSBtYXRlcmlhbCdzIG9yaWdpbmFsIGFscGhhLlxuXHQgKi9cblx0cHVibGljIGdldCBwcmVzZXJ2ZUFscGhhKCk6Ym9vbGVhblxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3ByZXNlcnZlQWxwaGE7XG5cdH1cblxuXHRwdWJsaWMgc2V0IHByZXNlcnZlQWxwaGEodmFsdWU6Ym9vbGVhbilcblx0e1xuXHRcdGlmICh0aGlzLl9wcmVzZXJ2ZUFscGhhID09IHZhbHVlKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0dGhpcy5fcHJlc2VydmVBbHBoYSA9IHZhbHVlO1xuXG5cdFx0dGhpcy5pbnZhbGlkYXRlUGFzcygpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEluZGljYXRlcyB3aGV0aGVyIHRoZSBzY3JlZW4gcHJvamVjdGlvbiBzaG91bGQgYmUgY2FsY3VsYXRlZCBieSBmb3JjaW5nIGEgc2VwYXJhdGUgc2NlbmUgbWF0cml4IGFuZFxuXHQgKiB2aWV3LXByb2plY3Rpb24gbWF0cml4LiBUaGlzIGlzIHVzZWQgdG8gcHJldmVudCByb3VuZGluZyBlcnJvcnMgd2hlbiB1c2luZyBtdWx0aXBsZSBwYXNzZXMgd2l0aCBkaWZmZXJlbnRcblx0ICogcHJvamVjdGlvbiBjb2RlLlxuXHQgKi9cblx0cHVibGljIGdldCBmb3JjZVNlcGFyYXRlTVZQKCk6Ym9vbGVhblxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX2ZvcmNlU2VwYXJhdGVNVlA7XG5cdH1cblxuXHRwdWJsaWMgc2V0IGZvcmNlU2VwYXJhdGVNVlAodmFsdWU6Ym9vbGVhbilcblx0e1xuXHRcdGlmICh0aGlzLl9mb3JjZVNlcGFyYXRlTVZQID09IHZhbHVlKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0dGhpcy5fZm9yY2VTZXBhcmF0ZU1WUCA9IHZhbHVlO1xuXG5cdFx0dGhpcy5pbnZhbGlkYXRlUGFzcygpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBuZXcgUmVuZGVyUGFzc0Jhc2Ugb2JqZWN0LlxuXHQgKi9cblx0Y29uc3RydWN0b3IocmVuZGVyT2JqZWN0OlJlbmRlck9iamVjdEJhc2UsIHJlbmRlck9iamVjdE93bmVyOklSZW5kZXJPYmplY3RPd25lciwgcmVuZGVyYWJsZUNsYXNzOklSZW5kZXJhYmxlQ2xhc3MsIHN0YWdlOlN0YWdlKVxuXHR7XG5cdFx0c3VwZXIoKTtcblxuXHRcdHRoaXMuX3JlbmRlck9iamVjdCA9IHJlbmRlck9iamVjdDtcblx0XHR0aGlzLl9yZW5kZXJPYmplY3RPd25lciA9IHJlbmRlck9iamVjdE93bmVyO1xuXHRcdHRoaXMuX3JlbmRlcmFibGVDbGFzcyA9IHJlbmRlcmFibGVDbGFzcztcblx0XHR0aGlzLl9zdGFnZSA9IHN0YWdlO1xuXHR9XG5cdFxuXG5cdC8qKlxuXHQgKiBJbmRpY2F0ZSB3aGV0aGVyIHRoaXMgcGFzcyBzaG91bGQgd3JpdGUgdG8gdGhlIGRlcHRoIGJ1ZmZlciBvciBub3QuIElnbm9yZWQgd2hlbiBibGVuZGluZyBpcyBlbmFibGVkLlxuXHQgKi9cblx0cHVibGljIGdldCB3cml0ZURlcHRoKCk6Ym9vbGVhblxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3dyaXRlRGVwdGg7XG5cdH1cblxuXHRwdWJsaWMgc2V0IHdyaXRlRGVwdGgodmFsdWU6Ym9vbGVhbilcblx0e1xuXHRcdHRoaXMuX3dyaXRlRGVwdGggPSB2YWx1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgZGVwdGggY29tcGFyZSBtb2RlIHVzZWQgdG8gcmVuZGVyIHRoZSByZW5kZXJhYmxlcyB1c2luZyB0aGlzIG1hdGVyaWFsLlxuXHQgKlxuXHQgKiBAc2VlIGF3YXkuc3RhZ2VnbC5Db250ZXh0R0xDb21wYXJlTW9kZVxuXHQgKi9cblx0cHVibGljIGdldCBkZXB0aENvbXBhcmVNb2RlKCk6c3RyaW5nXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fZGVwdGhDb21wYXJlTW9kZTtcblx0fVxuXG5cdHB1YmxpYyBzZXQgZGVwdGhDb21wYXJlTW9kZSh2YWx1ZTpzdHJpbmcpXG5cdHtcblx0XHR0aGlzLl9kZXB0aENvbXBhcmVNb2RlID0gdmFsdWU7XG5cdH1cblxuXHQvKipcblx0ICogQ2xlYW5zIHVwIGFueSByZXNvdXJjZXMgdXNlZCBieSB0aGUgY3VycmVudCBvYmplY3QuXG5cdCAqIEBwYXJhbSBkZWVwIEluZGljYXRlcyB3aGV0aGVyIG90aGVyIHJlc291cmNlcyBzaG91bGQgYmUgY2xlYW5lZCB1cCwgdGhhdCBjb3VsZCBwb3RlbnRpYWxseSBiZSBzaGFyZWQgYWNyb3NzIGRpZmZlcmVudCBpbnN0YW5jZXMuXG5cdCAqL1xuXHRwdWJsaWMgZGlzcG9zZSgpXG5cdHtcblx0XHR0aGlzLl9zaGFkZXIuZGlzcG9zZSgpO1xuXG5cdFx0dGhpcy5fc2hhZGVyID0gbnVsbDtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZW5kZXJzIHRoZSBjdXJyZW50IHBhc3MuIEJlZm9yZSBjYWxsaW5nIHJlbmRlclBhc3MsIGFjdGl2YXRlUGFzcyBuZWVkcyB0byBiZSBjYWxsZWQgd2l0aCB0aGUgc2FtZSBpbmRleC5cblx0ICogQHBhcmFtIHBhc3MgVGhlIHBhc3MgdXNlZCB0byByZW5kZXIgdGhlIHJlbmRlcmFibGUuXG5cdCAqIEBwYXJhbSByZW5kZXJhYmxlIFRoZSBJUmVuZGVyYWJsZSBvYmplY3QgdG8gZHJhdy5cblx0ICogQHBhcmFtIHN0YWdlIFRoZSBTdGFnZSBvYmplY3QgdXNlZCBmb3IgcmVuZGVyaW5nLlxuXHQgKiBAcGFyYW0gZW50aXR5Q29sbGVjdG9yIFRoZSBFbnRpdHlDb2xsZWN0b3Igb2JqZWN0IHRoYXQgY29udGFpbnMgdGhlIHZpc2libGUgc2NlbmUgZGF0YS5cblx0ICogQHBhcmFtIHZpZXdQcm9qZWN0aW9uIFRoZSB2aWV3LXByb2plY3Rpb24gbWF0cml4IHVzZWQgdG8gcHJvamVjdCB0byB0aGUgc2NyZWVuLiBUaGlzIGlzIG5vdCB0aGUgc2FtZSBhc1xuXHQgKiBjYW1lcmEudmlld1Byb2plY3Rpb24gYXMgaXQgaW5jbHVkZXMgdGhlIHNjYWxpbmcgZmFjdG9ycyB3aGVuIHJlbmRlcmluZyB0byB0ZXh0dXJlcy5cblx0ICpcblx0ICogQGludGVybmFsXG5cdCAqL1xuXHRwdWJsaWMgX2lSZW5kZXIocmVuZGVyYWJsZTpSZW5kZXJhYmxlQmFzZSwgY2FtZXJhOkNhbWVyYSwgdmlld1Byb2plY3Rpb246TWF0cml4M0QpXG5cdHtcblx0XHR0aGlzLl9zaGFkZXIuX2lSZW5kZXIocmVuZGVyYWJsZSwgY2FtZXJhLCB2aWV3UHJvamVjdGlvbik7XG5cdH1cblx0LyoqXG5cdCAqIFRoZSBibGVuZCBtb2RlIHRvIHVzZSB3aGVuIGRyYXdpbmcgdGhpcyByZW5kZXJhYmxlLiBUaGUgZm9sbG93aW5nIGJsZW5kIG1vZGVzIGFyZSBzdXBwb3J0ZWQ6XG5cdCAqIDx1bD5cblx0ICogPGxpPkJsZW5kTW9kZS5OT1JNQUw6IE5vIGJsZW5kaW5nLCB1bmxlc3MgdGhlIG1hdGVyaWFsIGluaGVyZW50bHkgbmVlZHMgaXQ8L2xpPlxuXHQgKiA8bGk+QmxlbmRNb2RlLkxBWUVSOiBGb3JjZSBibGVuZGluZy4gVGhpcyB3aWxsIGRyYXcgdGhlIG9iamVjdCB0aGUgc2FtZSBhcyBOT1JNQUwsIGJ1dCB3aXRob3V0IHdyaXRpbmcgZGVwdGggd3JpdGVzLjwvbGk+XG5cdCAqIDxsaT5CbGVuZE1vZGUuTVVMVElQTFk8L2xpPlxuXHQgKiA8bGk+QmxlbmRNb2RlLkFERDwvbGk+XG5cdCAqIDxsaT5CbGVuZE1vZGUuQUxQSEE8L2xpPlxuXHQgKiA8L3VsPlxuXHQgKi9cblx0cHVibGljIHNldEJsZW5kTW9kZSh2YWx1ZTpzdHJpbmcpXG5cdHtcblx0XHRzd2l0Y2ggKHZhbHVlKSB7XG5cdFx0XHRjYXNlIEJsZW5kTW9kZS5OT1JNQUw6XG5cdFx0XHRcdHRoaXMuX2JsZW5kRmFjdG9yU291cmNlID0gQ29udGV4dEdMQmxlbmRGYWN0b3IuT05FO1xuXHRcdFx0XHR0aGlzLl9ibGVuZEZhY3RvckRlc3QgPSBDb250ZXh0R0xCbGVuZEZhY3Rvci5aRVJPO1xuXHRcdFx0XHR0aGlzLl9wRW5hYmxlQmxlbmRpbmcgPSBmYWxzZTtcblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgQmxlbmRNb2RlLkxBWUVSOlxuXHRcdFx0XHR0aGlzLl9ibGVuZEZhY3RvclNvdXJjZSA9IENvbnRleHRHTEJsZW5kRmFjdG9yLlNPVVJDRV9BTFBIQTtcblx0XHRcdFx0dGhpcy5fYmxlbmRGYWN0b3JEZXN0ID0gQ29udGV4dEdMQmxlbmRGYWN0b3IuT05FX01JTlVTX1NPVVJDRV9BTFBIQTtcblx0XHRcdFx0dGhpcy5fcEVuYWJsZUJsZW5kaW5nID0gdHJ1ZTtcblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgQmxlbmRNb2RlLk1VTFRJUExZOlxuXHRcdFx0XHR0aGlzLl9ibGVuZEZhY3RvclNvdXJjZSA9IENvbnRleHRHTEJsZW5kRmFjdG9yLlpFUk87XG5cdFx0XHRcdHRoaXMuX2JsZW5kRmFjdG9yRGVzdCA9IENvbnRleHRHTEJsZW5kRmFjdG9yLlNPVVJDRV9DT0xPUjtcblx0XHRcdFx0dGhpcy5fcEVuYWJsZUJsZW5kaW5nID0gdHJ1ZTtcblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgQmxlbmRNb2RlLkFERDpcblx0XHRcdFx0dGhpcy5fYmxlbmRGYWN0b3JTb3VyY2UgPSBDb250ZXh0R0xCbGVuZEZhY3Rvci5TT1VSQ0VfQUxQSEE7XG5cdFx0XHRcdHRoaXMuX2JsZW5kRmFjdG9yRGVzdCA9IENvbnRleHRHTEJsZW5kRmFjdG9yLk9ORTtcblx0XHRcdFx0dGhpcy5fcEVuYWJsZUJsZW5kaW5nID0gdHJ1ZTtcblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgQmxlbmRNb2RlLkFMUEhBOlxuXHRcdFx0XHR0aGlzLl9ibGVuZEZhY3RvclNvdXJjZSA9IENvbnRleHRHTEJsZW5kRmFjdG9yLlpFUk87XG5cdFx0XHRcdHRoaXMuX2JsZW5kRmFjdG9yRGVzdCA9IENvbnRleHRHTEJsZW5kRmFjdG9yLlNPVVJDRV9BTFBIQTtcblx0XHRcdFx0dGhpcy5fcEVuYWJsZUJsZW5kaW5nID0gdHJ1ZTtcblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdHRocm93IG5ldyBBcmd1bWVudEVycm9yKFwiVW5zdXBwb3J0ZWQgYmxlbmQgbW9kZSFcIik7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFNldHMgdGhlIHJlbmRlciBzdGF0ZSBmb3IgdGhlIHBhc3MgdGhhdCBpcyBpbmRlcGVuZGVudCBvZiB0aGUgcmVuZGVyZWQgb2JqZWN0LiBUaGlzIG5lZWRzIHRvIGJlIGNhbGxlZCBiZWZvcmVcblx0ICogY2FsbGluZyByZW5kZXJQYXNzLiBCZWZvcmUgYWN0aXZhdGluZyBhIHBhc3MsIHRoZSBwcmV2aW91c2x5IHVzZWQgcGFzcyBuZWVkcyB0byBiZSBkZWFjdGl2YXRlZC5cblx0ICogQHBhcmFtIHN0YWdlIFRoZSBTdGFnZSBvYmplY3Qgd2hpY2ggaXMgY3VycmVudGx5IHVzZWQgZm9yIHJlbmRlcmluZy5cblx0ICogQHBhcmFtIGNhbWVyYSBUaGUgY2FtZXJhIGZyb20gd2hpY2ggdGhlIHNjZW5lIGlzIHZpZXdlZC5cblx0ICogQHByaXZhdGVcblx0ICovXG5cdHB1YmxpYyBfaUFjdGl2YXRlKGNhbWVyYTpDYW1lcmEpXG5cdHtcblx0XHR0aGlzLl9zdGFnZS5jb250ZXh0LnNldERlcHRoVGVzdCgoIHRoaXMuX3dyaXRlRGVwdGggJiYgIXRoaXMuX3BFbmFibGVCbGVuZGluZyApLCB0aGlzLl9kZXB0aENvbXBhcmVNb2RlKTtcblxuXHRcdGlmICh0aGlzLl9wRW5hYmxlQmxlbmRpbmcpXG5cdFx0XHR0aGlzLl9zdGFnZS5jb250ZXh0LnNldEJsZW5kRmFjdG9ycyh0aGlzLl9ibGVuZEZhY3RvclNvdXJjZSwgdGhpcy5fYmxlbmRGYWN0b3JEZXN0KTtcblxuXHRcdHRoaXMuX3NoYWRlci5faUFjdGl2YXRlKGNhbWVyYSk7XG5cdH1cblxuXHQvKipcblx0ICogQ2xlYXJzIHRoZSByZW5kZXIgc3RhdGUgZm9yIHRoZSBwYXNzLiBUaGlzIG5lZWRzIHRvIGJlIGNhbGxlZCBiZWZvcmUgYWN0aXZhdGluZyBhbm90aGVyIHBhc3MuXG5cdCAqIEBwYXJhbSBzdGFnZSBUaGUgU3RhZ2UgdXNlZCBmb3IgcmVuZGVyaW5nXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRwdWJsaWMgX2lEZWFjdGl2YXRlKClcblx0e1xuXHRcdHRoaXMuX3NoYWRlci5faURlYWN0aXZhdGUoKTtcblxuXHRcdC8vRm9yIHRoZSBsb3ZlIG9mIGdvZCBkb24ndCByZW1vdmUgdGhpcyBpZiB5b3Ugd2FudCB5b3VyIG11bHRpLW1hdGVyaWFsIHNoYWRvd3MgdG8gbm90IGZsaWNrZXIgbGlrZSBzaGl0XG5cdFx0dGhpcy5fc3RhZ2UuY29udGV4dC5zZXREZXB0aFRlc3QodHJ1ZSwgQ29udGV4dEdMQ29tcGFyZU1vZGUuTEVTU19FUVVBTCk7XG5cdH1cblxuXHQvKipcblx0ICogTWFya3MgdGhlIHNoYWRlciBwcm9ncmFtIGFzIGludmFsaWQsIHNvIGl0IHdpbGwgYmUgcmVjb21waWxlZCBiZWZvcmUgdGhlIG5leHQgcmVuZGVyLlxuXHQgKlxuXHQgKiBAcGFyYW0gdXBkYXRlTWF0ZXJpYWwgSW5kaWNhdGVzIHdoZXRoZXIgdGhlIGludmFsaWRhdGlvbiBzaG91bGQgYmUgcGVyZm9ybWVkIG9uIHRoZSBlbnRpcmUgbWF0ZXJpYWwuIFNob3VsZCBhbHdheXMgcGFzcyBcInRydWVcIiB1bmxlc3MgaXQncyBjYWxsZWQgZnJvbSB0aGUgbWF0ZXJpYWwgaXRzZWxmLlxuXHQgKi9cblx0cHVibGljIGludmFsaWRhdGVQYXNzKClcblx0e1xuXHRcdHRoaXMuX3NoYWRlci5pbnZhbGlkYXRlU2hhZGVyKCk7XG5cblx0XHR0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEV2ZW50LkNIQU5HRSkpO1xuXHR9XG5cblx0cHVibGljIF9pSW5jbHVkZURlcGVuZGVuY2llcyhzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSlcblx0e1xuXHRcdHRoaXMuX3JlbmRlck9iamVjdC5faUluY2x1ZGVEZXBlbmRlbmNpZXMoc2hhZGVyT2JqZWN0KTtcblx0XHRcblx0XHRpZiAodGhpcy5fZm9yY2VTZXBhcmF0ZU1WUClcblx0XHRcdHNoYWRlck9iamVjdC5nbG9iYWxQb3NEZXBlbmRlbmNpZXMrKztcblx0fVxuXG5cblx0cHVibGljIF9pSW5pdENvbnN0YW50RGF0YShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSlcblx0e1xuXG5cdH1cblxuXHRwdWJsaWMgX2lHZXRQcmVMaWdodGluZ1ZlcnRleENvZGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIHJlZ2lzdGVyQ2FjaGU6U2hhZGVyUmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzOlNoYWRlclJlZ2lzdGVyRGF0YSk6c3RyaW5nXG5cdHtcblx0XHRyZXR1cm4gXCJcIjtcblx0fVxuXG5cdHB1YmxpYyBfaUdldFByZUxpZ2h0aW5nRnJhZ21lbnRDb2RlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCByZWdpc3RlckNhY2hlOlNoYWRlclJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVyczpTaGFkZXJSZWdpc3RlckRhdGEpOnN0cmluZ1xuXHR7XG5cdFx0cmV0dXJuIFwiXCI7XG5cdH1cblxuXHRwdWJsaWMgX2lHZXRWZXJ0ZXhDb2RlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCByZWdpc3RlckNhY2hlOlNoYWRlclJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVyczpTaGFkZXJSZWdpc3RlckRhdGEpOnN0cmluZ1xuXHR7XG5cdFx0cmV0dXJuIFwiXCI7XG5cdH1cblxuXHRwdWJsaWMgX2lHZXRGcmFnbWVudENvZGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIHJlZ2lzdGVyQ2FjaGU6U2hhZGVyUmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzOlNoYWRlclJlZ2lzdGVyRGF0YSk6c3RyaW5nXG5cdHtcblx0XHRyZXR1cm4gXCJcIjtcblx0fVxuXG5cdHB1YmxpYyBfaUdldE5vcm1hbFZlcnRleENvZGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIHJlZ2lzdGVyQ2FjaGU6U2hhZGVyUmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzOlNoYWRlclJlZ2lzdGVyRGF0YSk6c3RyaW5nXG5cdHtcblx0XHRyZXR1cm4gXCJcIjtcblx0fVxuXG5cdHB1YmxpYyBfaUdldE5vcm1hbEZyYWdtZW50Q29kZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgcmVnaXN0ZXJDYWNoZTpTaGFkZXJSZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnM6U2hhZGVyUmVnaXN0ZXJEYXRhKTpzdHJpbmdcblx0e1xuXHRcdHJldHVybiBcIlwiO1xuXHR9XG5cblx0LyoqXG5cdCAqIEluZGljYXRlcyB3aGV0aGVyIG9yIG5vdCBub3JtYWxzIGFyZSBjYWxjdWxhdGVkIGF0IGFsbC5cblx0ICovXG5cdHB1YmxpYyBfcE91dHB1dHNOb3JtYWxzKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlKTpib29sZWFuXG5cdHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHQvKipcblx0ICogSW5kaWNhdGVzIHdoZXRoZXIgb3Igbm90IG5vcm1hbHMgYXJlIGNhbGN1bGF0ZWQgaW4gdGFuZ2VudCBzcGFjZS5cblx0ICovXG5cdHB1YmxpYyBfcE91dHB1dHNUYW5nZW50Tm9ybWFscyhzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSk6Ym9vbGVhblxuXHR7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0LyoqXG5cdCAqIEluZGljYXRlcyB3aGV0aGVyIG9yIG5vdCBub3JtYWxzIGFyZSBhbGxvd2VkIGluIHRhbmdlbnQgc3BhY2UuIFRoaXMgaXMgb25seSB0aGUgY2FzZSBpZiBubyBvYmplY3Qtc3BhY2Vcblx0ICogZGVwZW5kZW5jaWVzIGV4aXN0LlxuXHQgKi9cblx0cHVibGljIF9wVXNlc1RhbmdlbnRTcGFjZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSk6Ym9vbGVhblxuXHR7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59XG5cbmV4cG9ydCA9IFJlbmRlclBhc3NCYXNlOyJdfQ==