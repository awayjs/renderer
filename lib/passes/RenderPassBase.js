var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var BlendMode = require("awayjs-core/lib/base/BlendMode");
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9wYXNzZXMvUmVuZGVyUGFzc0Jhc2UudHMiXSwibmFtZXMiOlsiUmVuZGVyUGFzc0Jhc2UiLCJSZW5kZXJQYXNzQmFzZS5jb25zdHJ1Y3RvciIsIlJlbmRlclBhc3NCYXNlLnNoYWRlciIsIlJlbmRlclBhc3NCYXNlLmFuaW1hdGlvblNldCIsIlJlbmRlclBhc3NCYXNlLnByZXNlcnZlQWxwaGEiLCJSZW5kZXJQYXNzQmFzZS5mb3JjZVNlcGFyYXRlTVZQIiwiUmVuZGVyUGFzc0Jhc2Uud3JpdGVEZXB0aCIsIlJlbmRlclBhc3NCYXNlLmRlcHRoQ29tcGFyZU1vZGUiLCJSZW5kZXJQYXNzQmFzZS5kaXNwb3NlIiwiUmVuZGVyUGFzc0Jhc2UuX2lSZW5kZXIiLCJSZW5kZXJQYXNzQmFzZS5zZXRCbGVuZE1vZGUiLCJSZW5kZXJQYXNzQmFzZS5faUFjdGl2YXRlIiwiUmVuZGVyUGFzc0Jhc2UuX2lEZWFjdGl2YXRlIiwiUmVuZGVyUGFzc0Jhc2UuaW52YWxpZGF0ZVBhc3MiLCJSZW5kZXJQYXNzQmFzZS5faUluY2x1ZGVEZXBlbmRlbmNpZXMiLCJSZW5kZXJQYXNzQmFzZS5faUluaXRDb25zdGFudERhdGEiLCJSZW5kZXJQYXNzQmFzZS5faUdldFByZUxpZ2h0aW5nVmVydGV4Q29kZSIsIlJlbmRlclBhc3NCYXNlLl9pR2V0UHJlTGlnaHRpbmdGcmFnbWVudENvZGUiLCJSZW5kZXJQYXNzQmFzZS5faUdldFZlcnRleENvZGUiLCJSZW5kZXJQYXNzQmFzZS5faUdldEZyYWdtZW50Q29kZSIsIlJlbmRlclBhc3NCYXNlLl9pR2V0Tm9ybWFsVmVydGV4Q29kZSIsIlJlbmRlclBhc3NCYXNlLl9pR2V0Tm9ybWFsRnJhZ21lbnRDb2RlIiwiUmVuZGVyUGFzc0Jhc2UuX3BPdXRwdXRzTm9ybWFscyIsIlJlbmRlclBhc3NCYXNlLl9wT3V0cHV0c1RhbmdlbnROb3JtYWxzIiwiUmVuZGVyUGFzc0Jhc2UuX3BVc2VzVGFuZ2VudFNw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c0IsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7SUFDZEEsQ0FBQ0E7SUFFRHRCOztPQUVHQTtJQUNJQSxnREFBdUJBLEdBQTlCQSxVQUErQkEsWUFBNkJBO1FBRTNEdUIsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7SUFDZEEsQ0FBQ0E7SUFFRHZCOzs7T0FHR0E7SUFDSUEsMkNBQWtCQSxHQUF6QkEsVUFBMEJBLFlBQTZCQTtRQUV0RHdCLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBO0lBQ2RBLENBQUNBO0lBQ0Z4QixxQkFBQ0E7QUFBREEsQ0F4U0EsQUF3U0NBLEVBeFM0QixlQUFlLEVBd1MzQztBQUVELEFBQXdCLGlCQUFmLGNBQWMsQ0FBQyIsImZpbGUiOiJwYXNzZXMvUmVuZGVyUGFzc0Jhc2UuanMiLCJzb3VyY2VSb290IjoiLi4vIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJsZW5kTW9kZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvYmFzZS9CbGVuZE1vZGVcIik7XHJcbmltcG9ydCBNYXRyaXgzRFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9nZW9tL01hdHJpeDNEXCIpO1xyXG5pbXBvcnQgTWF0cml4M0RVdGlsc1x0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2dlb20vTWF0cml4M0RVdGlsc1wiKTtcclxuaW1wb3J0IE5hbWVkQXNzZXRCYXNlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvbGlicmFyeS9OYW1lZEFzc2V0QmFzZVwiKTtcclxuaW1wb3J0IEFyZ3VtZW50RXJyb3JcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9lcnJvcnMvQXJndW1lbnRFcnJvclwiKTtcclxuaW1wb3J0IEV2ZW50XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2V2ZW50cy9FdmVudFwiKTtcclxuaW1wb3J0IEV2ZW50RGlzcGF0Y2hlclx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2V2ZW50cy9FdmVudERpc3BhdGNoZXJcIik7XHJcblxyXG5pbXBvcnQgQ2FtZXJhXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2VudGl0aWVzL0NhbWVyYVwiKTtcclxuaW1wb3J0IExpZ2h0UGlja2VyQmFzZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL21hdGVyaWFscy9saWdodHBpY2tlcnMvTGlnaHRQaWNrZXJCYXNlXCIpO1xyXG5pbXBvcnQgSVJlbmRlck9iamVjdE93bmVyXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2Jhc2UvSVJlbmRlck9iamVjdE93bmVyXCIpO1xyXG5cclxuaW1wb3J0IFN0YWdlXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2Jhc2UvU3RhZ2VcIilcclxuaW1wb3J0IENvbnRleHRHTEJsZW5kRmFjdG9yXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2Jhc2UvQ29udGV4dEdMQmxlbmRGYWN0b3JcIik7XHJcbmltcG9ydCBDb250ZXh0R0xDb21wYXJlTW9kZVx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9iYXNlL0NvbnRleHRHTENvbXBhcmVNb2RlXCIpO1xyXG5cclxuaW1wb3J0IEFuaW1hdGlvblNldEJhc2VcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvQW5pbWF0aW9uU2V0QmFzZVwiKTtcclxuaW1wb3J0IFJlbmRlcmVyQmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYmFzZS9SZW5kZXJlckJhc2VcIik7XHJcbmltcG9ydCBSZW5kZXJhYmxlQmFzZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL3Bvb2wvUmVuZGVyYWJsZUJhc2VcIik7XHJcbmltcG9ydCBTaGFkZXJPYmplY3RCYXNlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvY29tcGlsYXRpb24vU2hhZGVyT2JqZWN0QmFzZVwiKTtcclxuaW1wb3J0IFNoYWRlclJlZ2lzdGVyQ2FjaGVcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJDYWNoZVwiKTtcclxuaW1wb3J0IFNoYWRlclJlZ2lzdGVyRGF0YVx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckRhdGFcIik7XHJcbmltcG9ydCBJUmVuZGVyYWJsZUNsYXNzXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvcG9vbC9JUmVuZGVyYWJsZUNsYXNzXCIpO1xyXG5pbXBvcnQgSVJlbmRlclBhc3NCYXNlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvcGFzc2VzL0lSZW5kZXJQYXNzQmFzZVwiKTtcclxuaW1wb3J0IFJlbmRlck9iamVjdEJhc2VcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9jb21waWxhdGlvbi9SZW5kZXJPYmplY3RCYXNlXCIpO1xyXG5cclxuLyoqXHJcbiAqIFJlbmRlclBhc3NCYXNlIHByb3ZpZGVzIGFuIGFic3RyYWN0IGJhc2UgY2xhc3MgZm9yIG1hdGVyaWFsIHNoYWRlciBwYXNzZXMuIEEgbWF0ZXJpYWwgcGFzcyBjb25zdGl0dXRlcyBhdCBsZWFzdFxyXG4gKiBhIHJlbmRlciBjYWxsIHBlciByZXF1aXJlZCByZW5kZXJhYmxlLlxyXG4gKi9cclxuY2xhc3MgUmVuZGVyUGFzc0Jhc2UgZXh0ZW5kcyBFdmVudERpc3BhdGNoZXIgaW1wbGVtZW50cyBJUmVuZGVyUGFzc0Jhc2Vcclxue1xyXG5cdHByaXZhdGUgX3JlbmRlck9iamVjdDpSZW5kZXJPYmplY3RCYXNlO1xyXG5cdHB1YmxpYyBfcmVuZGVyT2JqZWN0T3duZXI6SVJlbmRlck9iamVjdE93bmVyO1xyXG5cdHB1YmxpYyBfcmVuZGVyYWJsZUNsYXNzOklSZW5kZXJhYmxlQ2xhc3M7XHJcblx0cHVibGljIF9zdGFnZTpTdGFnZTtcclxuXHRcclxuXHRwdWJsaWMgX3NoYWRlcjpTaGFkZXJPYmplY3RCYXNlO1xyXG5cclxuXHRwcml2YXRlIF9wcmVzZXJ2ZUFscGhhOmJvb2xlYW4gPSB0cnVlO1xyXG5cdHByaXZhdGUgX2ZvcmNlU2VwYXJhdGVNVlA6Ym9vbGVhbiA9IGZhbHNlO1xyXG5cclxuXHRwcml2YXRlIF9kZXB0aENvbXBhcmVNb2RlOnN0cmluZyA9IENvbnRleHRHTENvbXBhcmVNb2RlLkxFU1NfRVFVQUw7XHJcblxyXG5cdHByaXZhdGUgX2JsZW5kRmFjdG9yU291cmNlOnN0cmluZyA9IENvbnRleHRHTEJsZW5kRmFjdG9yLk9ORTtcclxuXHRwcml2YXRlIF9ibGVuZEZhY3RvckRlc3Q6c3RyaW5nID0gQ29udGV4dEdMQmxlbmRGYWN0b3IuWkVSTztcclxuXHJcblx0cHVibGljIF9wRW5hYmxlQmxlbmRpbmc6Ym9vbGVhbiA9IGZhbHNlO1xyXG5cclxuXHRwcml2YXRlIF93cml0ZURlcHRoOmJvb2xlYW4gPSB0cnVlO1xyXG5cclxuXHRwdWJsaWMgZ2V0IHNoYWRlcigpOlNoYWRlck9iamVjdEJhc2VcclxuXHR7XHJcblx0XHRyZXR1cm4gdGhpcy5fc2hhZGVyO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldCBhbmltYXRpb25TZXQoKTpBbmltYXRpb25TZXRCYXNlXHJcblx0e1xyXG5cdFx0cmV0dXJuIDxBbmltYXRpb25TZXRCYXNlPiB0aGlzLl9yZW5kZXJPYmplY3RPd25lci5hbmltYXRpb25TZXQ7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBJbmRpY2F0ZXMgd2hldGhlciB0aGUgb3V0cHV0IGFscGhhIHZhbHVlIHNob3VsZCByZW1haW4gdW5jaGFuZ2VkIGNvbXBhcmVkIHRvIHRoZSBtYXRlcmlhbCdzIG9yaWdpbmFsIGFscGhhLlxyXG5cdCAqL1xyXG5cdHB1YmxpYyBnZXQgcHJlc2VydmVBbHBoYSgpOmJvb2xlYW5cclxuXHR7XHJcblx0XHRyZXR1cm4gdGhpcy5fcHJlc2VydmVBbHBoYTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXQgcHJlc2VydmVBbHBoYSh2YWx1ZTpib29sZWFuKVxyXG5cdHtcclxuXHRcdGlmICh0aGlzLl9wcmVzZXJ2ZUFscGhhID09IHZhbHVlKVxyXG5cdFx0XHRyZXR1cm47XHJcblxyXG5cdFx0dGhpcy5fcHJlc2VydmVBbHBoYSA9IHZhbHVlO1xyXG5cclxuXHRcdHRoaXMuaW52YWxpZGF0ZVBhc3MoKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEluZGljYXRlcyB3aGV0aGVyIHRoZSBzY3JlZW4gcHJvamVjdGlvbiBzaG91bGQgYmUgY2FsY3VsYXRlZCBieSBmb3JjaW5nIGEgc2VwYXJhdGUgc2NlbmUgbWF0cml4IGFuZFxyXG5cdCAqIHZpZXctcHJvamVjdGlvbiBtYXRyaXguIFRoaXMgaXMgdXNlZCB0byBwcmV2ZW50IHJvdW5kaW5nIGVycm9ycyB3aGVuIHVzaW5nIG11bHRpcGxlIHBhc3NlcyB3aXRoIGRpZmZlcmVudFxyXG5cdCAqIHByb2plY3Rpb24gY29kZS5cclxuXHQgKi9cclxuXHRwdWJsaWMgZ2V0IGZvcmNlU2VwYXJhdGVNVlAoKTpib29sZWFuXHJcblx0e1xyXG5cdFx0cmV0dXJuIHRoaXMuX2ZvcmNlU2VwYXJhdGVNVlA7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0IGZvcmNlU2VwYXJhdGVNVlAodmFsdWU6Ym9vbGVhbilcclxuXHR7XHJcblx0XHRpZiAodGhpcy5fZm9yY2VTZXBhcmF0ZU1WUCA9PSB2YWx1ZSlcclxuXHRcdFx0cmV0dXJuO1xyXG5cclxuXHRcdHRoaXMuX2ZvcmNlU2VwYXJhdGVNVlAgPSB2YWx1ZTtcclxuXHJcblx0XHR0aGlzLmludmFsaWRhdGVQYXNzKCk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBDcmVhdGVzIGEgbmV3IFJlbmRlclBhc3NCYXNlIG9iamVjdC5cclxuXHQgKi9cclxuXHRjb25zdHJ1Y3RvcihyZW5kZXJPYmplY3Q6UmVuZGVyT2JqZWN0QmFzZSwgcmVuZGVyT2JqZWN0T3duZXI6SVJlbmRlck9iamVjdE93bmVyLCByZW5kZXJhYmxlQ2xhc3M6SVJlbmRlcmFibGVDbGFzcywgc3RhZ2U6U3RhZ2UpXHJcblx0e1xyXG5cdFx0c3VwZXIoKTtcclxuXHJcblx0XHR0aGlzLl9yZW5kZXJPYmplY3QgPSByZW5kZXJPYmplY3Q7XHJcblx0XHR0aGlzLl9yZW5kZXJPYmplY3RPd25lciA9IHJlbmRlck9iamVjdE93bmVyO1xyXG5cdFx0dGhpcy5fcmVuZGVyYWJsZUNsYXNzID0gcmVuZGVyYWJsZUNsYXNzO1xyXG5cdFx0dGhpcy5fc3RhZ2UgPSBzdGFnZTtcclxuXHR9XHJcblx0XHJcblxyXG5cdC8qKlxyXG5cdCAqIEluZGljYXRlIHdoZXRoZXIgdGhpcyBwYXNzIHNob3VsZCB3cml0ZSB0byB0aGUgZGVwdGggYnVmZmVyIG9yIG5vdC4gSWdub3JlZCB3aGVuIGJsZW5kaW5nIGlzIGVuYWJsZWQuXHJcblx0ICovXHJcblx0cHVibGljIGdldCB3cml0ZURlcHRoKCk6Ym9vbGVhblxyXG5cdHtcclxuXHRcdHJldHVybiB0aGlzLl93cml0ZURlcHRoO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldCB3cml0ZURlcHRoKHZhbHVlOmJvb2xlYW4pXHJcblx0e1xyXG5cdFx0dGhpcy5fd3JpdGVEZXB0aCA9IHZhbHVlO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogVGhlIGRlcHRoIGNvbXBhcmUgbW9kZSB1c2VkIHRvIHJlbmRlciB0aGUgcmVuZGVyYWJsZXMgdXNpbmcgdGhpcyBtYXRlcmlhbC5cclxuXHQgKlxyXG5cdCAqIEBzZWUgYXdheS5zdGFnZWdsLkNvbnRleHRHTENvbXBhcmVNb2RlXHJcblx0ICovXHJcblx0cHVibGljIGdldCBkZXB0aENvbXBhcmVNb2RlKCk6c3RyaW5nXHJcblx0e1xyXG5cdFx0cmV0dXJuIHRoaXMuX2RlcHRoQ29tcGFyZU1vZGU7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0IGRlcHRoQ29tcGFyZU1vZGUodmFsdWU6c3RyaW5nKVxyXG5cdHtcclxuXHRcdHRoaXMuX2RlcHRoQ29tcGFyZU1vZGUgPSB2YWx1ZTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIENsZWFucyB1cCBhbnkgcmVzb3VyY2VzIHVzZWQgYnkgdGhlIGN1cnJlbnQgb2JqZWN0LlxyXG5cdCAqIEBwYXJhbSBkZWVwIEluZGljYXRlcyB3aGV0aGVyIG90aGVyIHJlc291cmNlcyBzaG91bGQgYmUgY2xlYW5lZCB1cCwgdGhhdCBjb3VsZCBwb3RlbnRpYWxseSBiZSBzaGFyZWQgYWNyb3NzIGRpZmZlcmVudCBpbnN0YW5jZXMuXHJcblx0ICovXHJcblx0cHVibGljIGRpc3Bvc2UoKVxyXG5cdHtcclxuXHRcdHRoaXMuX3NoYWRlci5kaXNwb3NlKCk7XHJcblxyXG5cdFx0dGhpcy5fc2hhZGVyID0gbnVsbDtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFJlbmRlcnMgdGhlIGN1cnJlbnQgcGFzcy4gQmVmb3JlIGNhbGxpbmcgcmVuZGVyUGFzcywgYWN0aXZhdGVQYXNzIG5lZWRzIHRvIGJlIGNhbGxlZCB3aXRoIHRoZSBzYW1lIGluZGV4LlxyXG5cdCAqIEBwYXJhbSBwYXNzIFRoZSBwYXNzIHVzZWQgdG8gcmVuZGVyIHRoZSByZW5kZXJhYmxlLlxyXG5cdCAqIEBwYXJhbSByZW5kZXJhYmxlIFRoZSBJUmVuZGVyYWJsZSBvYmplY3QgdG8gZHJhdy5cclxuXHQgKiBAcGFyYW0gc3RhZ2UgVGhlIFN0YWdlIG9iamVjdCB1c2VkIGZvciByZW5kZXJpbmcuXHJcblx0ICogQHBhcmFtIGVudGl0eUNvbGxlY3RvciBUaGUgRW50aXR5Q29sbGVjdG9yIG9iamVjdCB0aGF0IGNvbnRhaW5zIHRoZSB2aXNpYmxlIHNjZW5lIGRhdGEuXHJcblx0ICogQHBhcmFtIHZpZXdQcm9qZWN0aW9uIFRoZSB2aWV3LXByb2plY3Rpb24gbWF0cml4IHVzZWQgdG8gcHJvamVjdCB0byB0aGUgc2NyZWVuLiBUaGlzIGlzIG5vdCB0aGUgc2FtZSBhc1xyXG5cdCAqIGNhbWVyYS52aWV3UHJvamVjdGlvbiBhcyBpdCBpbmNsdWRlcyB0aGUgc2NhbGluZyBmYWN0b3JzIHdoZW4gcmVuZGVyaW5nIHRvIHRleHR1cmVzLlxyXG5cdCAqXHJcblx0ICogQGludGVybmFsXHJcblx0ICovXHJcblx0cHVibGljIF9pUmVuZGVyKHJlbmRlcmFibGU6UmVuZGVyYWJsZUJhc2UsIGNhbWVyYTpDYW1lcmEsIHZpZXdQcm9qZWN0aW9uOk1hdHJpeDNEKVxyXG5cdHtcclxuXHRcdHRoaXMuX3NoYWRlci5faVJlbmRlcihyZW5kZXJhYmxlLCBjYW1lcmEsIHZpZXdQcm9qZWN0aW9uKTtcclxuXHR9XHJcblx0LyoqXHJcblx0ICogVGhlIGJsZW5kIG1vZGUgdG8gdXNlIHdoZW4gZHJhd2luZyB0aGlzIHJlbmRlcmFibGUuIFRoZSBmb2xsb3dpbmcgYmxlbmQgbW9kZXMgYXJlIHN1cHBvcnRlZDpcclxuXHQgKiA8dWw+XHJcblx0ICogPGxpPkJsZW5kTW9kZS5OT1JNQUw6IE5vIGJsZW5kaW5nLCB1bmxlc3MgdGhlIG1hdGVyaWFsIGluaGVyZW50bHkgbmVlZHMgaXQ8L2xpPlxyXG5cdCAqIDxsaT5CbGVuZE1vZGUuTEFZRVI6IEZvcmNlIGJsZW5kaW5nLiBUaGlzIHdpbGwgZHJhdyB0aGUgb2JqZWN0IHRoZSBzYW1lIGFzIE5PUk1BTCwgYnV0IHdpdGhvdXQgd3JpdGluZyBkZXB0aCB3cml0ZXMuPC9saT5cclxuXHQgKiA8bGk+QmxlbmRNb2RlLk1VTFRJUExZPC9saT5cclxuXHQgKiA8bGk+QmxlbmRNb2RlLkFERDwvbGk+XHJcblx0ICogPGxpPkJsZW5kTW9kZS5BTFBIQTwvbGk+XHJcblx0ICogPC91bD5cclxuXHQgKi9cclxuXHRwdWJsaWMgc2V0QmxlbmRNb2RlKHZhbHVlOnN0cmluZylcclxuXHR7XHJcblx0XHRzd2l0Y2ggKHZhbHVlKSB7XHJcblx0XHRcdGNhc2UgQmxlbmRNb2RlLk5PUk1BTDpcclxuXHRcdFx0XHR0aGlzLl9ibGVuZEZhY3RvclNvdXJjZSA9IENvbnRleHRHTEJsZW5kRmFjdG9yLk9ORTtcclxuXHRcdFx0XHR0aGlzLl9ibGVuZEZhY3RvckRlc3QgPSBDb250ZXh0R0xCbGVuZEZhY3Rvci5aRVJPO1xyXG5cdFx0XHRcdHRoaXMuX3BFbmFibGVCbGVuZGluZyA9IGZhbHNlO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0Y2FzZSBCbGVuZE1vZGUuTEFZRVI6XHJcblx0XHRcdFx0dGhpcy5fYmxlbmRGYWN0b3JTb3VyY2UgPSBDb250ZXh0R0xCbGVuZEZhY3Rvci5TT1VSQ0VfQUxQSEE7XHJcblx0XHRcdFx0dGhpcy5fYmxlbmRGYWN0b3JEZXN0ID0gQ29udGV4dEdMQmxlbmRGYWN0b3IuT05FX01JTlVTX1NPVVJDRV9BTFBIQTtcclxuXHRcdFx0XHR0aGlzLl9wRW5hYmxlQmxlbmRpbmcgPSB0cnVlO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0Y2FzZSBCbGVuZE1vZGUuTVVMVElQTFk6XHJcblx0XHRcdFx0dGhpcy5fYmxlbmRGYWN0b3JTb3VyY2UgPSBDb250ZXh0R0xCbGVuZEZhY3Rvci5aRVJPO1xyXG5cdFx0XHRcdHRoaXMuX2JsZW5kRmFjdG9yRGVzdCA9IENvbnRleHRHTEJsZW5kRmFjdG9yLlNPVVJDRV9DT0xPUjtcclxuXHRcdFx0XHR0aGlzLl9wRW5hYmxlQmxlbmRpbmcgPSB0cnVlO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0Y2FzZSBCbGVuZE1vZGUuQUREOlxyXG5cdFx0XHRcdHRoaXMuX2JsZW5kRmFjdG9yU291cmNlID0gQ29udGV4dEdMQmxlbmRGYWN0b3IuU09VUkNFX0FMUEhBO1xyXG5cdFx0XHRcdHRoaXMuX2JsZW5kRmFjdG9yRGVzdCA9IENvbnRleHRHTEJsZW5kRmFjdG9yLk9ORTtcclxuXHRcdFx0XHR0aGlzLl9wRW5hYmxlQmxlbmRpbmcgPSB0cnVlO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0Y2FzZSBCbGVuZE1vZGUuQUxQSEE6XHJcblx0XHRcdFx0dGhpcy5fYmxlbmRGYWN0b3JTb3VyY2UgPSBDb250ZXh0R0xCbGVuZEZhY3Rvci5aRVJPO1xyXG5cdFx0XHRcdHRoaXMuX2JsZW5kRmFjdG9yRGVzdCA9IENvbnRleHRHTEJsZW5kRmFjdG9yLlNPVVJDRV9BTFBIQTtcclxuXHRcdFx0XHR0aGlzLl9wRW5hYmxlQmxlbmRpbmcgPSB0cnVlO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0ZGVmYXVsdDpcclxuXHRcdFx0XHR0aHJvdyBuZXcgQXJndW1lbnRFcnJvcihcIlVuc3VwcG9ydGVkIGJsZW5kIG1vZGUhXCIpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogU2V0cyB0aGUgcmVuZGVyIHN0YXRlIGZvciB0aGUgcGFzcyB0aGF0IGlzIGluZGVwZW5kZW50IG9mIHRoZSByZW5kZXJlZCBvYmplY3QuIFRoaXMgbmVlZHMgdG8gYmUgY2FsbGVkIGJlZm9yZVxyXG5cdCAqIGNhbGxpbmcgcmVuZGVyUGFzcy4gQmVmb3JlIGFjdGl2YXRpbmcgYSBwYXNzLCB0aGUgcHJldmlvdXNseSB1c2VkIHBhc3MgbmVlZHMgdG8gYmUgZGVhY3RpdmF0ZWQuXHJcblx0ICogQHBhcmFtIHN0YWdlIFRoZSBTdGFnZSBvYmplY3Qgd2hpY2ggaXMgY3VycmVudGx5IHVzZWQgZm9yIHJlbmRlcmluZy5cclxuXHQgKiBAcGFyYW0gY2FtZXJhIFRoZSBjYW1lcmEgZnJvbSB3aGljaCB0aGUgc2NlbmUgaXMgdmlld2VkLlxyXG5cdCAqIEBwcml2YXRlXHJcblx0ICovXHJcblx0cHVibGljIF9pQWN0aXZhdGUoY2FtZXJhOkNhbWVyYSlcclxuXHR7XHJcblx0XHR0aGlzLl9zdGFnZS5jb250ZXh0LnNldERlcHRoVGVzdCgoIHRoaXMuX3dyaXRlRGVwdGggJiYgIXRoaXMuX3BFbmFibGVCbGVuZGluZyApLCB0aGlzLl9kZXB0aENvbXBhcmVNb2RlKTtcclxuXHJcblx0XHRpZiAodGhpcy5fcEVuYWJsZUJsZW5kaW5nKVxyXG5cdFx0XHR0aGlzLl9zdGFnZS5jb250ZXh0LnNldEJsZW5kRmFjdG9ycyh0aGlzLl9ibGVuZEZhY3RvclNvdXJjZSwgdGhpcy5fYmxlbmRGYWN0b3JEZXN0KTtcclxuXHJcblx0XHR0aGlzLl9zaGFkZXIuX2lBY3RpdmF0ZShjYW1lcmEpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQ2xlYXJzIHRoZSByZW5kZXIgc3RhdGUgZm9yIHRoZSBwYXNzLiBUaGlzIG5lZWRzIHRvIGJlIGNhbGxlZCBiZWZvcmUgYWN0aXZhdGluZyBhbm90aGVyIHBhc3MuXHJcblx0ICogQHBhcmFtIHN0YWdlIFRoZSBTdGFnZSB1c2VkIGZvciByZW5kZXJpbmdcclxuXHQgKlxyXG5cdCAqIEBwcml2YXRlXHJcblx0ICovXHJcblx0cHVibGljIF9pRGVhY3RpdmF0ZSgpXHJcblx0e1xyXG5cdFx0dGhpcy5fc2hhZGVyLl9pRGVhY3RpdmF0ZSgpO1xyXG5cclxuXHRcdC8vRm9yIHRoZSBsb3ZlIG9mIGdvZCBkb24ndCByZW1vdmUgdGhpcyBpZiB5b3Ugd2FudCB5b3VyIG11bHRpLW1hdGVyaWFsIHNoYWRvd3MgdG8gbm90IGZsaWNrZXIgbGlrZSBzaGl0XHJcblx0XHR0aGlzLl9zdGFnZS5jb250ZXh0LnNldERlcHRoVGVzdCh0cnVlLCBDb250ZXh0R0xDb21wYXJlTW9kZS5MRVNTX0VRVUFMKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIE1hcmtzIHRoZSBzaGFkZXIgcHJvZ3JhbSBhcyBpbnZhbGlkLCBzbyBpdCB3aWxsIGJlIHJlY29tcGlsZWQgYmVmb3JlIHRoZSBuZXh0IHJlbmRlci5cclxuXHQgKlxyXG5cdCAqIEBwYXJhbSB1cGRhdGVNYXRlcmlhbCBJbmRpY2F0ZXMgd2hldGhlciB0aGUgaW52YWxpZGF0aW9uIHNob3VsZCBiZSBwZXJmb3JtZWQgb24gdGhlIGVudGlyZSBtYXRlcmlhbC4gU2hvdWxkIGFsd2F5cyBwYXNzIFwidHJ1ZVwiIHVubGVzcyBpdCdzIGNhbGxlZCBmcm9tIHRoZSBtYXRlcmlhbCBpdHNlbGYuXHJcblx0ICovXHJcblx0cHVibGljIGludmFsaWRhdGVQYXNzKClcclxuXHR7XHJcblx0XHR0aGlzLl9zaGFkZXIuaW52YWxpZGF0ZVNoYWRlcigpO1xyXG5cclxuXHRcdHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRXZlbnQuQ0hBTkdFKSk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgX2lJbmNsdWRlRGVwZW5kZW5jaWVzKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlKVxyXG5cdHtcclxuXHRcdHRoaXMuX3JlbmRlck9iamVjdC5faUluY2x1ZGVEZXBlbmRlbmNpZXMoc2hhZGVyT2JqZWN0KTtcclxuXHRcdFxyXG5cdFx0aWYgKHRoaXMuX2ZvcmNlU2VwYXJhdGVNVlApXHJcblx0XHRcdHNoYWRlck9iamVjdC5nbG9iYWxQb3NEZXBlbmRlbmNpZXMrKztcclxuXHR9XHJcblxyXG5cclxuXHRwdWJsaWMgX2lJbml0Q29uc3RhbnREYXRhKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlKVxyXG5cdHtcclxuXHJcblx0fVxyXG5cclxuXHRwdWJsaWMgX2lHZXRQcmVMaWdodGluZ1ZlcnRleENvZGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIHJlZ2lzdGVyQ2FjaGU6U2hhZGVyUmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzOlNoYWRlclJlZ2lzdGVyRGF0YSk6c3RyaW5nXHJcblx0e1xyXG5cdFx0cmV0dXJuIFwiXCI7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgX2lHZXRQcmVMaWdodGluZ0ZyYWdtZW50Q29kZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgcmVnaXN0ZXJDYWNoZTpTaGFkZXJSZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnM6U2hhZGVyUmVnaXN0ZXJEYXRhKTpzdHJpbmdcclxuXHR7XHJcblx0XHRyZXR1cm4gXCJcIjtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBfaUdldFZlcnRleENvZGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIHJlZ2lzdGVyQ2FjaGU6U2hhZGVyUmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzOlNoYWRlclJlZ2lzdGVyRGF0YSk6c3RyaW5nXHJcblx0e1xyXG5cdFx0cmV0dXJuIFwiXCI7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgX2lHZXRGcmFnbWVudENvZGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIHJlZ2lzdGVyQ2FjaGU6U2hhZGVyUmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzOlNoYWRlclJlZ2lzdGVyRGF0YSk6c3RyaW5nXHJcblx0e1xyXG5cdFx0cmV0dXJuIFwiXCI7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgX2lHZXROb3JtYWxWZXJ0ZXhDb2RlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCByZWdpc3RlckNhY2hlOlNoYWRlclJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVyczpTaGFkZXJSZWdpc3RlckRhdGEpOnN0cmluZ1xyXG5cdHtcclxuXHRcdHJldHVybiBcIlwiO1xyXG5cdH1cclxuXHJcblx0cHVibGljIF9pR2V0Tm9ybWFsRnJhZ21lbnRDb2RlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCByZWdpc3RlckNhY2hlOlNoYWRlclJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVyczpTaGFkZXJSZWdpc3RlckRhdGEpOnN0cmluZ1xyXG5cdHtcclxuXHRcdHJldHVybiBcIlwiO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogSW5kaWNhdGVzIHdoZXRoZXIgb3Igbm90IG5vcm1hbHMgYXJlIGNhbGN1bGF0ZWQgYXQgYWxsLlxyXG5cdCAqL1xyXG5cdHB1YmxpYyBfcE91dHB1dHNOb3JtYWxzKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlKTpib29sZWFuXHJcblx0e1xyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogSW5kaWNhdGVzIHdoZXRoZXIgb3Igbm90IG5vcm1hbHMgYXJlIGNhbGN1bGF0ZWQgaW4gdGFuZ2VudCBzcGFjZS5cclxuXHQgKi9cclxuXHRwdWJsaWMgX3BPdXRwdXRzVGFuZ2VudE5vcm1hbHMoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UpOmJvb2xlYW5cclxuXHR7XHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBJbmRpY2F0ZXMgd2hldGhlciBvciBub3Qgbm9ybWFscyBhcmUgYWxsb3dlZCBpbiB0YW5nZW50IHNwYWNlLiBUaGlzIGlzIG9ubHkgdGhlIGNhc2UgaWYgbm8gb2JqZWN0LXNwYWNlXHJcblx0ICogZGVwZW5kZW5jaWVzIGV4aXN0LlxyXG5cdCAqL1xyXG5cdHB1YmxpYyBfcFVzZXNUYW5nZW50U3BhY2Uoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UpOmJvb2xlYW5cclxuXHR7XHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgPSBSZW5kZXJQYXNzQmFzZTsiXX0=