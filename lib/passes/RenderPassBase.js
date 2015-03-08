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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9wYXNzZXMvUmVuZGVyUGFzc0Jhc2UudHMiXSwibmFtZXMiOlsiUmVuZGVyUGFzc0Jhc2UiLCJSZW5kZXJQYXNzQmFzZS5jb25zdHJ1Y3RvciIsIlJlbmRlclBhc3NCYXNlLnNoYWRlciIsIlJlbmRlclBhc3NCYXNlLmFuaW1hdGlvblNldCIsIlJlbmRlclBhc3NCYXNlLnByZXNlcnZlQWxwaGEiLCJSZW5kZXJQYXNzQmFzZS5mb3JjZVNlcGFyYXRlTVZQIiwiUmVuZGVyUGFzc0Jhc2Uud3JpdGVEZXB0aCIsIlJlbmRlclBhc3NCYXNlLmRlcHRoQ29tcGFyZU1vZGUiLCJSZW5kZXJQYXNzQmFzZS5kaXNwb3NlIiwiUmVuZGVyUGFzc0Jhc2UuX2lSZW5kZXIiLCJSZW5kZXJQYXNzQmFzZS5zZXRCbGVuZE1vZGUiLCJSZW5kZXJQYXNzQmFzZS5faUFjdGl2YXRlIiwiUmVuZGVyUGFzc0Jhc2UuX2lEZWFjdGl2YXRlIiwiUmVuZGVyUGFzc0Jhc2UuaW52YWxpZGF0ZVBhc3MiLCJSZW5kZXJQYXNzQmFzZS5faUluY2x1ZGVEZXBlbmRlbmNpZXMiLCJSZW5kZXJQYXNzQmFzZS5faUluaXRDb25zdGFudERhdGEiLCJSZW5kZXJQYXNzQmFzZS5faUdldFByZUxpZ2h0aW5nVmVydGV4Q29kZSIsIlJlbmRlclBhc3NCYXNlLl9pR2V0UHJlTGlnaHRpbmdGcmFnbWVudENvZGUiLCJSZW5kZXJQYXNzQmFzZS5faUdldFZlcnRleENvZGUiLCJSZW5kZXJQYXNzQmFzZS5faUdldEZyYWdtZW50Q29kZSIsIlJlbmRlclBhc3NCYXNlLl9pR2V0Tm9ybWFsVmVydGV4Q29kZSIsIlJlbmRlclBhc3NCYXNlLl9pR2V0Tm9ybWFsRnJhZ21lbnRDb2RlIiwiUmVuZGVyUGFzc0Jhc2UuX3BPdXRwdXRzTm9ybWFscyIsIlJlbmRlclBhc3NCYXNlLl9wT3V0cHV0c1RhbmdlbnROb3JtYWxzIiwiUmVuZGVyUGFzc0Jhc2UuX3BVc2VzVGFuZ2VudFNw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c0IsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7SUFDZEEsQ0FBQ0E7SUFFRHRCOztPQUVHQTtJQUNJQSxnREFBdUJBLEdBQTlCQSxVQUErQkEsWUFBNkJBO1FBRTNEdUIsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7SUFDZEEsQ0FBQ0E7SUFFRHZCOzs7T0FHR0E7SUFDSUEsMkNBQWtCQSxHQUF6QkEsVUFBMEJBLFlBQTZCQTtRQUV0RHdCLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBO0lBQ2RBLENBQUNBO0lBQ0Z4QixxQkFBQ0E7QUFBREEsQ0F4U0EsQUF3U0NBLEVBeFM0QixlQUFlLEVBd1MzQztBQUVELEFBQXdCLGlCQUFmLGNBQWMsQ0FBQyIsImZpbGUiOiJwYXNzZXMvUmVuZGVyUGFzc0Jhc2UuanMiLCJzb3VyY2VSb290IjoiLi4vIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJsZW5kTW9kZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZGF0YS9CbGVuZE1vZGVcIik7XG5pbXBvcnQgTWF0cml4M0RcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZ2VvbS9NYXRyaXgzRFwiKTtcbmltcG9ydCBNYXRyaXgzRFV0aWxzXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZ2VvbS9NYXRyaXgzRFV0aWxzXCIpO1xuaW1wb3J0IE5hbWVkQXNzZXRCYXNlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvbGlicmFyeS9OYW1lZEFzc2V0QmFzZVwiKTtcbmltcG9ydCBBcmd1bWVudEVycm9yXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZXJyb3JzL0FyZ3VtZW50RXJyb3JcIik7XG5pbXBvcnQgRXZlbnRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZXZlbnRzL0V2ZW50XCIpO1xuaW1wb3J0IEV2ZW50RGlzcGF0Y2hlclx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2V2ZW50cy9FdmVudERpc3BhdGNoZXJcIik7XG5cbmltcG9ydCBDYW1lcmFcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvZW50aXRpZXMvQ2FtZXJhXCIpO1xuaW1wb3J0IExpZ2h0UGlja2VyQmFzZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL21hdGVyaWFscy9saWdodHBpY2tlcnMvTGlnaHRQaWNrZXJCYXNlXCIpO1xuaW1wb3J0IElSZW5kZXJPYmplY3RPd25lclx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9iYXNlL0lSZW5kZXJPYmplY3RPd25lclwiKTtcblxuaW1wb3J0IFN0YWdlXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2Jhc2UvU3RhZ2VcIilcbmltcG9ydCBDb250ZXh0R0xCbGVuZEZhY3Rvclx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9iYXNlL0NvbnRleHRHTEJsZW5kRmFjdG9yXCIpO1xuaW1wb3J0IENvbnRleHRHTENvbXBhcmVNb2RlXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2Jhc2UvQ29udGV4dEdMQ29tcGFyZU1vZGVcIik7XG5cbmltcG9ydCBBbmltYXRpb25TZXRCYXNlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL0FuaW1hdGlvblNldEJhc2VcIik7XG5pbXBvcnQgUmVuZGVyZXJCYXNlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9iYXNlL1JlbmRlcmVyQmFzZVwiKTtcbmltcG9ydCBSZW5kZXJhYmxlQmFzZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL3Bvb2wvUmVuZGVyYWJsZUJhc2VcIik7XG5pbXBvcnQgU2hhZGVyT2JqZWN0QmFzZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2NvbXBpbGF0aW9uL1NoYWRlck9iamVjdEJhc2VcIik7XG5pbXBvcnQgU2hhZGVyUmVnaXN0ZXJDYWNoZVx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckNhY2hlXCIpO1xuaW1wb3J0IFNoYWRlclJlZ2lzdGVyRGF0YVx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckRhdGFcIik7XG5pbXBvcnQgSVJlbmRlcmFibGVDbGFzc1x0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL3Bvb2wvSVJlbmRlcmFibGVDbGFzc1wiKTtcbmltcG9ydCBJUmVuZGVyUGFzc0Jhc2VcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9wYXNzZXMvSVJlbmRlclBhc3NCYXNlXCIpO1xuaW1wb3J0IFJlbmRlck9iamVjdEJhc2VcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9jb21waWxhdGlvbi9SZW5kZXJPYmplY3RCYXNlXCIpO1xuXG4vKipcbiAqIFJlbmRlclBhc3NCYXNlIHByb3ZpZGVzIGFuIGFic3RyYWN0IGJhc2UgY2xhc3MgZm9yIG1hdGVyaWFsIHNoYWRlciBwYXNzZXMuIEEgbWF0ZXJpYWwgcGFzcyBjb25zdGl0dXRlcyBhdCBsZWFzdFxuICogYSByZW5kZXIgY2FsbCBwZXIgcmVxdWlyZWQgcmVuZGVyYWJsZS5cbiAqL1xuY2xhc3MgUmVuZGVyUGFzc0Jhc2UgZXh0ZW5kcyBFdmVudERpc3BhdGNoZXIgaW1wbGVtZW50cyBJUmVuZGVyUGFzc0Jhc2Vcbntcblx0cHJpdmF0ZSBfcmVuZGVyT2JqZWN0OlJlbmRlck9iamVjdEJhc2U7XG5cdHB1YmxpYyBfcmVuZGVyT2JqZWN0T3duZXI6SVJlbmRlck9iamVjdE93bmVyO1xuXHRwdWJsaWMgX3JlbmRlcmFibGVDbGFzczpJUmVuZGVyYWJsZUNsYXNzO1xuXHRwdWJsaWMgX3N0YWdlOlN0YWdlO1xuXHRcblx0cHVibGljIF9zaGFkZXI6U2hhZGVyT2JqZWN0QmFzZTtcblxuXHRwcml2YXRlIF9wcmVzZXJ2ZUFscGhhOmJvb2xlYW4gPSB0cnVlO1xuXHRwcml2YXRlIF9mb3JjZVNlcGFyYXRlTVZQOmJvb2xlYW4gPSBmYWxzZTtcblxuXHRwcml2YXRlIF9kZXB0aENvbXBhcmVNb2RlOnN0cmluZyA9IENvbnRleHRHTENvbXBhcmVNb2RlLkxFU1NfRVFVQUw7XG5cblx0cHJpdmF0ZSBfYmxlbmRGYWN0b3JTb3VyY2U6c3RyaW5nID0gQ29udGV4dEdMQmxlbmRGYWN0b3IuT05FO1xuXHRwcml2YXRlIF9ibGVuZEZhY3RvckRlc3Q6c3RyaW5nID0gQ29udGV4dEdMQmxlbmRGYWN0b3IuWkVSTztcblxuXHRwdWJsaWMgX3BFbmFibGVCbGVuZGluZzpib29sZWFuID0gZmFsc2U7XG5cblx0cHJpdmF0ZSBfd3JpdGVEZXB0aDpib29sZWFuID0gdHJ1ZTtcblxuXHRwdWJsaWMgZ2V0IHNoYWRlcigpOlNoYWRlck9iamVjdEJhc2Vcblx0e1xuXHRcdHJldHVybiB0aGlzLl9zaGFkZXI7XG5cdH1cblxuXHRwdWJsaWMgZ2V0IGFuaW1hdGlvblNldCgpOkFuaW1hdGlvblNldEJhc2Vcblx0e1xuXHRcdHJldHVybiA8QW5pbWF0aW9uU2V0QmFzZT4gdGhpcy5fcmVuZGVyT2JqZWN0T3duZXIuYW5pbWF0aW9uU2V0O1xuXHR9XG5cblx0LyoqXG5cdCAqIEluZGljYXRlcyB3aGV0aGVyIHRoZSBvdXRwdXQgYWxwaGEgdmFsdWUgc2hvdWxkIHJlbWFpbiB1bmNoYW5nZWQgY29tcGFyZWQgdG8gdGhlIG1hdGVyaWFsJ3Mgb3JpZ2luYWwgYWxwaGEuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IHByZXNlcnZlQWxwaGEoKTpib29sZWFuXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fcHJlc2VydmVBbHBoYTtcblx0fVxuXG5cdHB1YmxpYyBzZXQgcHJlc2VydmVBbHBoYSh2YWx1ZTpib29sZWFuKVxuXHR7XG5cdFx0aWYgKHRoaXMuX3ByZXNlcnZlQWxwaGEgPT0gdmFsdWUpXG5cdFx0XHRyZXR1cm47XG5cblx0XHR0aGlzLl9wcmVzZXJ2ZUFscGhhID0gdmFsdWU7XG5cblx0XHR0aGlzLmludmFsaWRhdGVQYXNzKCk7XG5cdH1cblxuXHQvKipcblx0ICogSW5kaWNhdGVzIHdoZXRoZXIgdGhlIHNjcmVlbiBwcm9qZWN0aW9uIHNob3VsZCBiZSBjYWxjdWxhdGVkIGJ5IGZvcmNpbmcgYSBzZXBhcmF0ZSBzY2VuZSBtYXRyaXggYW5kXG5cdCAqIHZpZXctcHJvamVjdGlvbiBtYXRyaXguIFRoaXMgaXMgdXNlZCB0byBwcmV2ZW50IHJvdW5kaW5nIGVycm9ycyB3aGVuIHVzaW5nIG11bHRpcGxlIHBhc3NlcyB3aXRoIGRpZmZlcmVudFxuXHQgKiBwcm9qZWN0aW9uIGNvZGUuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGZvcmNlU2VwYXJhdGVNVlAoKTpib29sZWFuXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fZm9yY2VTZXBhcmF0ZU1WUDtcblx0fVxuXG5cdHB1YmxpYyBzZXQgZm9yY2VTZXBhcmF0ZU1WUCh2YWx1ZTpib29sZWFuKVxuXHR7XG5cdFx0aWYgKHRoaXMuX2ZvcmNlU2VwYXJhdGVNVlAgPT0gdmFsdWUpXG5cdFx0XHRyZXR1cm47XG5cblx0XHR0aGlzLl9mb3JjZVNlcGFyYXRlTVZQID0gdmFsdWU7XG5cblx0XHR0aGlzLmludmFsaWRhdGVQYXNzKCk7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyBSZW5kZXJQYXNzQmFzZSBvYmplY3QuXG5cdCAqL1xuXHRjb25zdHJ1Y3RvcihyZW5kZXJPYmplY3Q6UmVuZGVyT2JqZWN0QmFzZSwgcmVuZGVyT2JqZWN0T3duZXI6SVJlbmRlck9iamVjdE93bmVyLCByZW5kZXJhYmxlQ2xhc3M6SVJlbmRlcmFibGVDbGFzcywgc3RhZ2U6U3RhZ2UpXG5cdHtcblx0XHRzdXBlcigpO1xuXG5cdFx0dGhpcy5fcmVuZGVyT2JqZWN0ID0gcmVuZGVyT2JqZWN0O1xuXHRcdHRoaXMuX3JlbmRlck9iamVjdE93bmVyID0gcmVuZGVyT2JqZWN0T3duZXI7XG5cdFx0dGhpcy5fcmVuZGVyYWJsZUNsYXNzID0gcmVuZGVyYWJsZUNsYXNzO1xuXHRcdHRoaXMuX3N0YWdlID0gc3RhZ2U7XG5cdH1cblx0XG5cblx0LyoqXG5cdCAqIEluZGljYXRlIHdoZXRoZXIgdGhpcyBwYXNzIHNob3VsZCB3cml0ZSB0byB0aGUgZGVwdGggYnVmZmVyIG9yIG5vdC4gSWdub3JlZCB3aGVuIGJsZW5kaW5nIGlzIGVuYWJsZWQuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IHdyaXRlRGVwdGgoKTpib29sZWFuXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fd3JpdGVEZXB0aDtcblx0fVxuXG5cdHB1YmxpYyBzZXQgd3JpdGVEZXB0aCh2YWx1ZTpib29sZWFuKVxuXHR7XG5cdFx0dGhpcy5fd3JpdGVEZXB0aCA9IHZhbHVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBkZXB0aCBjb21wYXJlIG1vZGUgdXNlZCB0byByZW5kZXIgdGhlIHJlbmRlcmFibGVzIHVzaW5nIHRoaXMgbWF0ZXJpYWwuXG5cdCAqXG5cdCAqIEBzZWUgYXdheS5zdGFnZWdsLkNvbnRleHRHTENvbXBhcmVNb2RlXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGRlcHRoQ29tcGFyZU1vZGUoKTpzdHJpbmdcblx0e1xuXHRcdHJldHVybiB0aGlzLl9kZXB0aENvbXBhcmVNb2RlO1xuXHR9XG5cblx0cHVibGljIHNldCBkZXB0aENvbXBhcmVNb2RlKHZhbHVlOnN0cmluZylcblx0e1xuXHRcdHRoaXMuX2RlcHRoQ29tcGFyZU1vZGUgPSB2YWx1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDbGVhbnMgdXAgYW55IHJlc291cmNlcyB1c2VkIGJ5IHRoZSBjdXJyZW50IG9iamVjdC5cblx0ICogQHBhcmFtIGRlZXAgSW5kaWNhdGVzIHdoZXRoZXIgb3RoZXIgcmVzb3VyY2VzIHNob3VsZCBiZSBjbGVhbmVkIHVwLCB0aGF0IGNvdWxkIHBvdGVudGlhbGx5IGJlIHNoYXJlZCBhY3Jvc3MgZGlmZmVyZW50IGluc3RhbmNlcy5cblx0ICovXG5cdHB1YmxpYyBkaXNwb3NlKClcblx0e1xuXHRcdHRoaXMuX3NoYWRlci5kaXNwb3NlKCk7XG5cblx0XHR0aGlzLl9zaGFkZXIgPSBudWxsO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJlbmRlcnMgdGhlIGN1cnJlbnQgcGFzcy4gQmVmb3JlIGNhbGxpbmcgcmVuZGVyUGFzcywgYWN0aXZhdGVQYXNzIG5lZWRzIHRvIGJlIGNhbGxlZCB3aXRoIHRoZSBzYW1lIGluZGV4LlxuXHQgKiBAcGFyYW0gcGFzcyBUaGUgcGFzcyB1c2VkIHRvIHJlbmRlciB0aGUgcmVuZGVyYWJsZS5cblx0ICogQHBhcmFtIHJlbmRlcmFibGUgVGhlIElSZW5kZXJhYmxlIG9iamVjdCB0byBkcmF3LlxuXHQgKiBAcGFyYW0gc3RhZ2UgVGhlIFN0YWdlIG9iamVjdCB1c2VkIGZvciByZW5kZXJpbmcuXG5cdCAqIEBwYXJhbSBlbnRpdHlDb2xsZWN0b3IgVGhlIEVudGl0eUNvbGxlY3RvciBvYmplY3QgdGhhdCBjb250YWlucyB0aGUgdmlzaWJsZSBzY2VuZSBkYXRhLlxuXHQgKiBAcGFyYW0gdmlld1Byb2plY3Rpb24gVGhlIHZpZXctcHJvamVjdGlvbiBtYXRyaXggdXNlZCB0byBwcm9qZWN0IHRvIHRoZSBzY3JlZW4uIFRoaXMgaXMgbm90IHRoZSBzYW1lIGFzXG5cdCAqIGNhbWVyYS52aWV3UHJvamVjdGlvbiBhcyBpdCBpbmNsdWRlcyB0aGUgc2NhbGluZyBmYWN0b3JzIHdoZW4gcmVuZGVyaW5nIHRvIHRleHR1cmVzLlxuXHQgKlxuXHQgKiBAaW50ZXJuYWxcblx0ICovXG5cdHB1YmxpYyBfaVJlbmRlcihyZW5kZXJhYmxlOlJlbmRlcmFibGVCYXNlLCBjYW1lcmE6Q2FtZXJhLCB2aWV3UHJvamVjdGlvbjpNYXRyaXgzRClcblx0e1xuXHRcdHRoaXMuX3NoYWRlci5faVJlbmRlcihyZW5kZXJhYmxlLCBjYW1lcmEsIHZpZXdQcm9qZWN0aW9uKTtcblx0fVxuXHQvKipcblx0ICogVGhlIGJsZW5kIG1vZGUgdG8gdXNlIHdoZW4gZHJhd2luZyB0aGlzIHJlbmRlcmFibGUuIFRoZSBmb2xsb3dpbmcgYmxlbmQgbW9kZXMgYXJlIHN1cHBvcnRlZDpcblx0ICogPHVsPlxuXHQgKiA8bGk+QmxlbmRNb2RlLk5PUk1BTDogTm8gYmxlbmRpbmcsIHVubGVzcyB0aGUgbWF0ZXJpYWwgaW5oZXJlbnRseSBuZWVkcyBpdDwvbGk+XG5cdCAqIDxsaT5CbGVuZE1vZGUuTEFZRVI6IEZvcmNlIGJsZW5kaW5nLiBUaGlzIHdpbGwgZHJhdyB0aGUgb2JqZWN0IHRoZSBzYW1lIGFzIE5PUk1BTCwgYnV0IHdpdGhvdXQgd3JpdGluZyBkZXB0aCB3cml0ZXMuPC9saT5cblx0ICogPGxpPkJsZW5kTW9kZS5NVUxUSVBMWTwvbGk+XG5cdCAqIDxsaT5CbGVuZE1vZGUuQUREPC9saT5cblx0ICogPGxpPkJsZW5kTW9kZS5BTFBIQTwvbGk+XG5cdCAqIDwvdWw+XG5cdCAqL1xuXHRwdWJsaWMgc2V0QmxlbmRNb2RlKHZhbHVlOnN0cmluZylcblx0e1xuXHRcdHN3aXRjaCAodmFsdWUpIHtcblx0XHRcdGNhc2UgQmxlbmRNb2RlLk5PUk1BTDpcblx0XHRcdFx0dGhpcy5fYmxlbmRGYWN0b3JTb3VyY2UgPSBDb250ZXh0R0xCbGVuZEZhY3Rvci5PTkU7XG5cdFx0XHRcdHRoaXMuX2JsZW5kRmFjdG9yRGVzdCA9IENvbnRleHRHTEJsZW5kRmFjdG9yLlpFUk87XG5cdFx0XHRcdHRoaXMuX3BFbmFibGVCbGVuZGluZyA9IGZhbHNlO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSBCbGVuZE1vZGUuTEFZRVI6XG5cdFx0XHRcdHRoaXMuX2JsZW5kRmFjdG9yU291cmNlID0gQ29udGV4dEdMQmxlbmRGYWN0b3IuU09VUkNFX0FMUEhBO1xuXHRcdFx0XHR0aGlzLl9ibGVuZEZhY3RvckRlc3QgPSBDb250ZXh0R0xCbGVuZEZhY3Rvci5PTkVfTUlOVVNfU09VUkNFX0FMUEhBO1xuXHRcdFx0XHR0aGlzLl9wRW5hYmxlQmxlbmRpbmcgPSB0cnVlO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSBCbGVuZE1vZGUuTVVMVElQTFk6XG5cdFx0XHRcdHRoaXMuX2JsZW5kRmFjdG9yU291cmNlID0gQ29udGV4dEdMQmxlbmRGYWN0b3IuWkVSTztcblx0XHRcdFx0dGhpcy5fYmxlbmRGYWN0b3JEZXN0ID0gQ29udGV4dEdMQmxlbmRGYWN0b3IuU09VUkNFX0NPTE9SO1xuXHRcdFx0XHR0aGlzLl9wRW5hYmxlQmxlbmRpbmcgPSB0cnVlO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSBCbGVuZE1vZGUuQUREOlxuXHRcdFx0XHR0aGlzLl9ibGVuZEZhY3RvclNvdXJjZSA9IENvbnRleHRHTEJsZW5kRmFjdG9yLlNPVVJDRV9BTFBIQTtcblx0XHRcdFx0dGhpcy5fYmxlbmRGYWN0b3JEZXN0ID0gQ29udGV4dEdMQmxlbmRGYWN0b3IuT05FO1xuXHRcdFx0XHR0aGlzLl9wRW5hYmxlQmxlbmRpbmcgPSB0cnVlO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSBCbGVuZE1vZGUuQUxQSEE6XG5cdFx0XHRcdHRoaXMuX2JsZW5kRmFjdG9yU291cmNlID0gQ29udGV4dEdMQmxlbmRGYWN0b3IuWkVSTztcblx0XHRcdFx0dGhpcy5fYmxlbmRGYWN0b3JEZXN0ID0gQ29udGV4dEdMQmxlbmRGYWN0b3IuU09VUkNFX0FMUEhBO1xuXHRcdFx0XHR0aGlzLl9wRW5hYmxlQmxlbmRpbmcgPSB0cnVlO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0dGhyb3cgbmV3IEFyZ3VtZW50RXJyb3IoXCJVbnN1cHBvcnRlZCBibGVuZCBtb2RlIVwiKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogU2V0cyB0aGUgcmVuZGVyIHN0YXRlIGZvciB0aGUgcGFzcyB0aGF0IGlzIGluZGVwZW5kZW50IG9mIHRoZSByZW5kZXJlZCBvYmplY3QuIFRoaXMgbmVlZHMgdG8gYmUgY2FsbGVkIGJlZm9yZVxuXHQgKiBjYWxsaW5nIHJlbmRlclBhc3MuIEJlZm9yZSBhY3RpdmF0aW5nIGEgcGFzcywgdGhlIHByZXZpb3VzbHkgdXNlZCBwYXNzIG5lZWRzIHRvIGJlIGRlYWN0aXZhdGVkLlxuXHQgKiBAcGFyYW0gc3RhZ2UgVGhlIFN0YWdlIG9iamVjdCB3aGljaCBpcyBjdXJyZW50bHkgdXNlZCBmb3IgcmVuZGVyaW5nLlxuXHQgKiBAcGFyYW0gY2FtZXJhIFRoZSBjYW1lcmEgZnJvbSB3aGljaCB0aGUgc2NlbmUgaXMgdmlld2VkLlxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0cHVibGljIF9pQWN0aXZhdGUoY2FtZXJhOkNhbWVyYSlcblx0e1xuXHRcdHRoaXMuX3N0YWdlLmNvbnRleHQuc2V0RGVwdGhUZXN0KCggdGhpcy5fd3JpdGVEZXB0aCAmJiAhdGhpcy5fcEVuYWJsZUJsZW5kaW5nICksIHRoaXMuX2RlcHRoQ29tcGFyZU1vZGUpO1xuXG5cdFx0aWYgKHRoaXMuX3BFbmFibGVCbGVuZGluZylcblx0XHRcdHRoaXMuX3N0YWdlLmNvbnRleHQuc2V0QmxlbmRGYWN0b3JzKHRoaXMuX2JsZW5kRmFjdG9yU291cmNlLCB0aGlzLl9ibGVuZEZhY3RvckRlc3QpO1xuXG5cdFx0dGhpcy5fc2hhZGVyLl9pQWN0aXZhdGUoY2FtZXJhKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDbGVhcnMgdGhlIHJlbmRlciBzdGF0ZSBmb3IgdGhlIHBhc3MuIFRoaXMgbmVlZHMgdG8gYmUgY2FsbGVkIGJlZm9yZSBhY3RpdmF0aW5nIGFub3RoZXIgcGFzcy5cblx0ICogQHBhcmFtIHN0YWdlIFRoZSBTdGFnZSB1c2VkIGZvciByZW5kZXJpbmdcblx0ICpcblx0ICogQHByaXZhdGVcblx0ICovXG5cdHB1YmxpYyBfaURlYWN0aXZhdGUoKVxuXHR7XG5cdFx0dGhpcy5fc2hhZGVyLl9pRGVhY3RpdmF0ZSgpO1xuXG5cdFx0Ly9Gb3IgdGhlIGxvdmUgb2YgZ29kIGRvbid0IHJlbW92ZSB0aGlzIGlmIHlvdSB3YW50IHlvdXIgbXVsdGktbWF0ZXJpYWwgc2hhZG93cyB0byBub3QgZmxpY2tlciBsaWtlIHNoaXRcblx0XHR0aGlzLl9zdGFnZS5jb250ZXh0LnNldERlcHRoVGVzdCh0cnVlLCBDb250ZXh0R0xDb21wYXJlTW9kZS5MRVNTX0VRVUFMKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBNYXJrcyB0aGUgc2hhZGVyIHByb2dyYW0gYXMgaW52YWxpZCwgc28gaXQgd2lsbCBiZSByZWNvbXBpbGVkIGJlZm9yZSB0aGUgbmV4dCByZW5kZXIuXG5cdCAqXG5cdCAqIEBwYXJhbSB1cGRhdGVNYXRlcmlhbCBJbmRpY2F0ZXMgd2hldGhlciB0aGUgaW52YWxpZGF0aW9uIHNob3VsZCBiZSBwZXJmb3JtZWQgb24gdGhlIGVudGlyZSBtYXRlcmlhbC4gU2hvdWxkIGFsd2F5cyBwYXNzIFwidHJ1ZVwiIHVubGVzcyBpdCdzIGNhbGxlZCBmcm9tIHRoZSBtYXRlcmlhbCBpdHNlbGYuXG5cdCAqL1xuXHRwdWJsaWMgaW52YWxpZGF0ZVBhc3MoKVxuXHR7XG5cdFx0dGhpcy5fc2hhZGVyLmludmFsaWRhdGVTaGFkZXIoKTtcblxuXHRcdHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRXZlbnQuQ0hBTkdFKSk7XG5cdH1cblxuXHRwdWJsaWMgX2lJbmNsdWRlRGVwZW5kZW5jaWVzKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlKVxuXHR7XG5cdFx0dGhpcy5fcmVuZGVyT2JqZWN0Ll9pSW5jbHVkZURlcGVuZGVuY2llcyhzaGFkZXJPYmplY3QpO1xuXHRcdFxuXHRcdGlmICh0aGlzLl9mb3JjZVNlcGFyYXRlTVZQKVxuXHRcdFx0c2hhZGVyT2JqZWN0Lmdsb2JhbFBvc0RlcGVuZGVuY2llcysrO1xuXHR9XG5cblxuXHRwdWJsaWMgX2lJbml0Q29uc3RhbnREYXRhKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlKVxuXHR7XG5cblx0fVxuXG5cdHB1YmxpYyBfaUdldFByZUxpZ2h0aW5nVmVydGV4Q29kZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgcmVnaXN0ZXJDYWNoZTpTaGFkZXJSZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnM6U2hhZGVyUmVnaXN0ZXJEYXRhKTpzdHJpbmdcblx0e1xuXHRcdHJldHVybiBcIlwiO1xuXHR9XG5cblx0cHVibGljIF9pR2V0UHJlTGlnaHRpbmdGcmFnbWVudENvZGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIHJlZ2lzdGVyQ2FjaGU6U2hhZGVyUmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzOlNoYWRlclJlZ2lzdGVyRGF0YSk6c3RyaW5nXG5cdHtcblx0XHRyZXR1cm4gXCJcIjtcblx0fVxuXG5cdHB1YmxpYyBfaUdldFZlcnRleENvZGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIHJlZ2lzdGVyQ2FjaGU6U2hhZGVyUmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzOlNoYWRlclJlZ2lzdGVyRGF0YSk6c3RyaW5nXG5cdHtcblx0XHRyZXR1cm4gXCJcIjtcblx0fVxuXG5cdHB1YmxpYyBfaUdldEZyYWdtZW50Q29kZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgcmVnaXN0ZXJDYWNoZTpTaGFkZXJSZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnM6U2hhZGVyUmVnaXN0ZXJEYXRhKTpzdHJpbmdcblx0e1xuXHRcdHJldHVybiBcIlwiO1xuXHR9XG5cblx0cHVibGljIF9pR2V0Tm9ybWFsVmVydGV4Q29kZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgcmVnaXN0ZXJDYWNoZTpTaGFkZXJSZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnM6U2hhZGVyUmVnaXN0ZXJEYXRhKTpzdHJpbmdcblx0e1xuXHRcdHJldHVybiBcIlwiO1xuXHR9XG5cblx0cHVibGljIF9pR2V0Tm9ybWFsRnJhZ21lbnRDb2RlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCByZWdpc3RlckNhY2hlOlNoYWRlclJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVyczpTaGFkZXJSZWdpc3RlckRhdGEpOnN0cmluZ1xuXHR7XG5cdFx0cmV0dXJuIFwiXCI7XG5cdH1cblxuXHQvKipcblx0ICogSW5kaWNhdGVzIHdoZXRoZXIgb3Igbm90IG5vcm1hbHMgYXJlIGNhbGN1bGF0ZWQgYXQgYWxsLlxuXHQgKi9cblx0cHVibGljIF9wT3V0cHV0c05vcm1hbHMoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UpOmJvb2xlYW5cblx0e1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBJbmRpY2F0ZXMgd2hldGhlciBvciBub3Qgbm9ybWFscyBhcmUgY2FsY3VsYXRlZCBpbiB0YW5nZW50IHNwYWNlLlxuXHQgKi9cblx0cHVibGljIF9wT3V0cHV0c1RhbmdlbnROb3JtYWxzKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlKTpib29sZWFuXG5cdHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHQvKipcblx0ICogSW5kaWNhdGVzIHdoZXRoZXIgb3Igbm90IG5vcm1hbHMgYXJlIGFsbG93ZWQgaW4gdGFuZ2VudCBzcGFjZS4gVGhpcyBpcyBvbmx5IHRoZSBjYXNlIGlmIG5vIG9iamVjdC1zcGFjZVxuXHQgKiBkZXBlbmRlbmNpZXMgZXhpc3QuXG5cdCAqL1xuXHRwdWJsaWMgX3BVc2VzVGFuZ2VudFNwYWNlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlKTpib29sZWFuXG5cdHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn1cblxuZXhwb3J0ID0gUmVuZGVyUGFzc0Jhc2U7Il19