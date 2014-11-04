var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var NamedAssetBase = require("awayjs-core/lib/library/NamedAssetBase");
var ArgumentError = require("awayjs-core/lib/errors/ArgumentError");
var Event = require("awayjs-core/lib/events/Event");
var BlendMode = require("awayjs-display/lib/base/BlendMode");
var ContextGLBlendFactor = require("awayjs-stagegl/lib/base/ContextGLBlendFactor");
var ContextGLCompareMode = require("awayjs-stagegl/lib/base/ContextGLCompareMode");
var ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
/**
 * MaterialPassGLBase provides an abstract base class for material shader passes. A material pass constitutes at least
 * a render call per required renderable.
 */
var MaterialPassGLBase = (function (_super) {
    __extends(MaterialPassGLBase, _super);
    /**
     * Creates a new MaterialPassGLBase object.
     */
    function MaterialPassGLBase() {
        var _this = this;
        _super.call(this);
        this._materialPassData = new Array();
        this._preserveAlpha = true;
        this._forceSeparateMVP = false;
        this._depthCompareMode = ContextGLCompareMode.LESS_EQUAL;
        this._blendFactorSource = ContextGLBlendFactor.ONE;
        this._blendFactorDest = ContextGLBlendFactor.ZERO;
        this._pEnableBlending = false;
        this._writeDepth = true;
        this._onLightsChangeDelegate = function (event) { return _this.onLightsChange(event); };
    }
    Object.defineProperty(MaterialPassGLBase.prototype, "preserveAlpha", {
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
            this._pInvalidatePass();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MaterialPassGLBase.prototype, "forceSeparateMVP", {
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
            this._pInvalidatePass();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Factory method to create a concrete shader object for this pass.
     *
     * @param profile The compatibility profile used by the renderer.
     */
    MaterialPassGLBase.prototype.createShaderObject = function (profile) {
        return new ShaderObjectBase(profile);
    };
    Object.defineProperty(MaterialPassGLBase.prototype, "writeDepth", {
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
    Object.defineProperty(MaterialPassGLBase.prototype, "depthCompareMode", {
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
    MaterialPassGLBase.prototype.dispose = function () {
        if (this._pLightPicker)
            this._pLightPicker.removeEventListener(Event.CHANGE, this._onLightsChangeDelegate);
        while (this._materialPassData.length)
            this._materialPassData[0].dispose();
        this._materialPassData = null;
    };
    /**
     * Renders an object to the current render target.
     *
     * @private
     */
    MaterialPassGLBase.prototype._iRender = function (pass, renderable, stage, camera, viewProjection) {
        this.setRenderState(pass, renderable, stage, camera, viewProjection);
    };
    /**
     *
     *
     * @param renderable
     * @param stage
     * @param camera
     */
    MaterialPassGLBase.prototype.setRenderState = function (pass, renderable, stage, camera, viewProjection) {
        pass.shaderObject.setRenderState(renderable, stage, camera, viewProjection);
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
    MaterialPassGLBase.prototype.setBlendMode = function (value) {
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
    MaterialPassGLBase.prototype._iActivate = function (pass, renderer, camera) {
        renderer.context.setDepthTest((this._writeDepth && !this._pEnableBlending), this._depthCompareMode);
        if (this._pEnableBlending)
            renderer.context.setBlendFactors(this._blendFactorSource, this._blendFactorDest);
        renderer.activateMaterialPass(pass, camera);
    };
    /**
     * Clears the render state for the pass. This needs to be called before activating another pass.
     * @param stage The Stage used for rendering
     *
     * @private
     */
    MaterialPassGLBase.prototype._iDeactivate = function (pass, renderer) {
        renderer.deactivateMaterialPass(pass);
        renderer.context.setDepthTest(true, ContextGLCompareMode.LESS_EQUAL); // TODO : imeplement
    };
    /**
     * Marks the shader program as invalid, so it will be recompiled before the next render.
     *
     * @param updateMaterial Indicates whether the invalidation should be performed on the entire material. Should always pass "true" unless it's called from the material itself.
     */
    MaterialPassGLBase.prototype._pInvalidatePass = function () {
        var len = this._materialPassData.length;
        for (var i = 0; i < len; i++)
            this._materialPassData[i].invalidate();
        this.dispatchEvent(new Event(Event.CHANGE));
    };
    Object.defineProperty(MaterialPassGLBase.prototype, "lightPicker", {
        /**
         * The light picker used by the material to provide lights to the material if it supports lighting.
         *
         * @see away.materials.LightPickerBase
         * @see away.materials.StaticLightPicker
         */
        get: function () {
            return this._pLightPicker;
        },
        set: function (value) {
            if (this._pLightPicker)
                this._pLightPicker.removeEventListener(Event.CHANGE, this._onLightsChangeDelegate);
            this._pLightPicker = value;
            if (this._pLightPicker)
                this._pLightPicker.addEventListener(Event.CHANGE, this._onLightsChangeDelegate);
            this.pUpdateLights();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Called when the light picker's configuration changes.
     */
    MaterialPassGLBase.prototype.onLightsChange = function (event) {
        this.pUpdateLights();
    };
    /**
     * Implemented by subclasses if the pass uses lights to update the shader.
     */
    MaterialPassGLBase.prototype.pUpdateLights = function () {
    };
    MaterialPassGLBase.prototype._iIncludeDependencies = function (shaderObject) {
        if (this._forceSeparateMVP)
            shaderObject.globalPosDependencies++;
        shaderObject.outputsNormals = this._pOutputsNormals(shaderObject);
        shaderObject.outputsTangentNormals = shaderObject.outputsNormals && this._pOutputsTangentNormals(shaderObject);
        shaderObject.usesTangentSpace = shaderObject.outputsTangentNormals && this._pUsesTangentSpace(shaderObject);
        if (!shaderObject.usesTangentSpace && shaderObject.viewDirDependencies > 0)
            shaderObject.globalPosDependencies++;
    };
    MaterialPassGLBase.prototype._iInitConstantData = function (shaderObject) {
    };
    MaterialPassGLBase.prototype._iGetPreLightingVertexCode = function (shaderObject, registerCache, sharedRegisters) {
        return "";
    };
    MaterialPassGLBase.prototype._iGetPreLightingFragmentCode = function (shaderObject, registerCache, sharedRegisters) {
        return "";
    };
    MaterialPassGLBase.prototype._iGetVertexCode = function (shaderObject, registerCache, sharedRegisters) {
        return "";
    };
    MaterialPassGLBase.prototype._iGetFragmentCode = function (shaderObject, registerCache, sharedRegisters) {
        return "";
    };
    MaterialPassGLBase.prototype._iGetNormalVertexCode = function (shaderObject, registerCache, sharedRegisters) {
        return "";
    };
    MaterialPassGLBase.prototype._iGetNormalFragmentCode = function (shaderObject, registerCache, sharedRegisters) {
        return "";
    };
    /**
     * Indicates whether or not normals are calculated at all.
     */
    MaterialPassGLBase.prototype._pOutputsNormals = function (shaderObject) {
        return false;
    };
    /**
     * Indicates whether or not normals are calculated in tangent space.
     */
    MaterialPassGLBase.prototype._pOutputsTangentNormals = function (shaderObject) {
        return false;
    };
    /**
     * Indicates whether or not normals are allowed in tangent space. This is only the case if no object-space
     * dependencies exist.
     */
    MaterialPassGLBase.prototype._pUsesTangentSpace = function (shaderObject) {
        return false;
    };
    MaterialPassGLBase.prototype._iAddMaterialPassData = function (materialPassData) {
        this._materialPassData.push(materialPassData);
        return materialPassData;
    };
    MaterialPassGLBase.prototype._iRemoveMaterialPassData = function (materialPassData) {
        this._materialPassData.splice(this._materialPassData.indexOf(materialPassData), 1);
        return materialPassData;
    };
    return MaterialPassGLBase;
})(NamedAssetBase);
module.exports = MaterialPassGLBase;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9wYXNzZXMvbWF0ZXJpYWxwYXNzZ2xiYXNlLnRzIl0sIm5hbWVzIjpbIk1hdGVyaWFsUGFzc0dMQmFzZSIsIk1hdGVyaWFsUGFzc0dMQmFzZS5jb25zdHJ1Y3RvciIsIk1hdGVyaWFsUGFzc0dMQmFzZS5wcmVzZXJ2ZUFscGhhIiwiTWF0ZXJpYWxQYXNzR0xCYXNlLmZvcmNlU2VwYXJhdGVNVlAiLCJNYXRlcmlhbFBhc3NHTEJhc2UuY3JlYXRlU2hhZGVyT2JqZWN0IiwiTWF0ZXJpYWxQYXNzR0xCYXNlLndyaXRlRGVwdGgiLCJNYXRlcmlhbFBhc3NHTEJhc2UuZGVwdGhDb21wYXJlTW9kZSIsIk1hdGVyaWFsUGFzc0dMQmFzZS5kaXNwb3NlIiwiTWF0ZXJpYWxQYXNzR0xCYXNlLl9pUmVuZGVyIiwiTWF0ZXJpYWxQYXNzR0xCYXNlLnNldFJlbmRlclN0YXRlIiwiTWF0ZXJpYWxQYXNzR0xCYXNlLnNldEJsZW5kTW9kZSIsIk1hdGVyaWFsUGFzc0dMQmFzZS5faUFjdGl2YXRlIiwiTWF0ZXJpYWxQYXNzR0xCYXNlLl9pRGVhY3RpdmF0ZSIsIk1hdGVyaWFsUGFzc0dMQmFzZS5fcEludmFsaWRhdGVQYXNzIiwiTWF0ZXJpYWxQYXNzR0xCYXNlLmxpZ2h0UGlja2VyIiwiTWF0ZXJpYWxQYXNzR0xCYXNlLm9uTGlnaHRzQ2hhbmdlIiwiTWF0ZXJpYWxQYXNzR0xCYXNlLnBVcGRhdGVMaWdodHMiLCJNYXRlcmlhbFBhc3NHTEJhc2UuX2lJbmNsdWRlRGVwZW5kZW5jaWVzIiwiTWF0ZXJpYWxQYXNzR0xCYXNlLl9pSW5pdENvbnN0YW50RGF0YSIsIk1hdGVyaWFsUGFzc0dMQmFzZS5faUdldFByZUxpZ2h0aW5nVmVydGV4Q29kZSIsIk1hdGVyaWFsUGFzc0dMQmFzZS5faUdldFByZUxpZ2h0aW5nRnJhZ21lbnRDb2RlIiwiTWF0ZXJpYWxQYXNzR0xCYXNlLl9pR2V0VmVydGV4Q29kZSIsIk1hdGVyaWFsUGFzc0dMQmFzZS5faUdldEZyYWdtZW50Q29kZSIsIk1hdGVyaWFsUGFzc0dMQmFzZS5faUdldE5vcm1hbFZlcnRleENvZGUiLCJNYXRlcmlhbFBhc3NHTEJhc2UuX2lHZXROb3JtYWxGcmFnbWVudENvZGUiLCJNYXRlcmlhbFBhc3NHTEJhc2UuX3BPdXRwdXRzTm9ybWFscyIsIk1hdGVyaWFsUGFzc0dMQmFzZS5fcE91dHB1dHNUYW5nZW50Tm9ybWFscyIsIk1hdGVyaWFsUGFzc0dMQmFzZS5fcFVzZXNUYW5nZW50U3BhY2UiLCJNYXRlcmlhbFBhc3NHTEJhc2UuX2lBZGRNYXRlcmlhbFBhc3NEYXRhIiwiTWF0ZXJpYWxQYXNzR0xCYXNlLl9pUmVtb3ZlTWF0ZXJpYWxQYXNzRGF0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBRUEsSUFBTyxjQUFjLFdBQWMsd0NBQXdDLENBQUMsQ0FBQztBQUM3RSxJQUFPLGFBQWEsV0FBYyxzQ0FBc0MsQ0FBQyxDQUFDO0FBQzFFLElBQU8sS0FBSyxXQUFnQiw4QkFBOEIsQ0FBQyxDQUFDO0FBRTVELElBQU8sU0FBUyxXQUFlLG1DQUFtQyxDQUFDLENBQUM7QUFNcEUsSUFBTyxvQkFBb0IsV0FBYSw4Q0FBOEMsQ0FBQyxDQUFDO0FBQ3hGLElBQU8sb0JBQW9CLFdBQWEsOENBQThDLENBQUMsQ0FBQztBQUl4RixJQUFPLGdCQUFnQixXQUFjLG9EQUFvRCxDQUFDLENBQUM7QUFNM0YsQUFJQTs7O0dBREc7SUFDRyxrQkFBa0I7SUFBU0EsVUFBM0JBLGtCQUFrQkEsVUFBdUJBO0lBd0Q5Q0E7O09BRUdBO0lBQ0hBLFNBM0RLQSxrQkFBa0JBO1FBQXhCQyxpQkFvWENBO1FBdlRDQSxpQkFBT0EsQ0FBQ0E7UUEzRERBLHNCQUFpQkEsR0FBMkJBLElBQUlBLEtBQUtBLEVBQW9CQSxDQUFDQTtRQUMxRUEsbUJBQWNBLEdBQVdBLElBQUlBLENBQUNBO1FBQzlCQSxzQkFBaUJBLEdBQVdBLEtBQUtBLENBQUNBO1FBRWxDQSxzQkFBaUJBLEdBQVVBLG9CQUFvQkEsQ0FBQ0EsVUFBVUEsQ0FBQ0E7UUFF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QUFrQ0E7UUFFbEl3QixNQUFNQSxDQUFDQSxFQUFFQSxDQUFDQTtJQUNYQSxDQUFDQTtJQUVEeEI7O09BRUdBO0lBQ0lBLDZDQUFnQkEsR0FBdkJBLFVBQXdCQSxZQUE2QkE7UUFFcER5QixNQUFNQSxDQUFDQSxLQUFLQSxDQUFDQTtJQUNkQSxDQUFDQTtJQUVEekI7O09BRUdBO0lBQ0lBLG9EQUF1QkEsR0FBOUJBLFVBQStCQSxZQUE2QkE7UUFFM0QwQixNQUFNQSxDQUFDQSxLQUFLQSxDQUFDQTtJQUNkQSxDQUFDQTtJQUVEMUI7OztPQUdHQTtJQUNJQSwrQ0FBa0JBLEdBQXpCQSxVQUEwQkEsWUFBNkJBO1FBRXREMkIsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7SUFDZEEsQ0FBQ0E7SUFFTTNCLGtEQUFxQkEsR0FBNUJBLFVBQTZCQSxnQkFBaUNBO1FBRTdENEIsSUFBSUEsQ0FBQ0EsaUJBQWlCQSxDQUFDQSxJQUFJQSxDQUFDQSxnQkFBZ0JBLENBQUNBLENBQUNBO1FBRTlDQSxNQUFNQSxDQUFDQSxnQkFBZ0JBLENBQUNBO0lBQ3pCQSxDQUFDQTtJQUVNNUIscURBQXdCQSxHQUEvQkEsVUFBZ0NBLGdCQUFpQ0E7UUFFaEU2QixJQUFJQSxDQUFDQSxpQkFBaUJBLENBQUNBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLGlCQUFpQkEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsZ0JBQWdCQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUVuRkEsTUFBTUEsQ0FBQ0EsZ0JBQWdCQSxDQUFDQTtJQUN6QkEsQ0FBQ0E7SUFDRjdCLHlCQUFDQTtBQUFEQSxDQXBYQSxBQW9YQ0EsRUFwWGdDLGNBQWMsRUFvWDlDO0FBRUQsQUFBNEIsaUJBQW5CLGtCQUFrQixDQUFDIiwiZmlsZSI6InBhc3Nlcy9NYXRlcmlhbFBhc3NHTEJhc2UuanMiLCJzb3VyY2VSb290IjoiLi4vIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE1hdHJpeDNEXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2dlb20vTWF0cml4M0RcIik7XG5pbXBvcnQgTWF0cml4M0RVdGlsc1x0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2dlb20vTWF0cml4M0RVdGlsc1wiKTtcbmltcG9ydCBOYW1lZEFzc2V0QmFzZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2xpYnJhcnkvTmFtZWRBc3NldEJhc2VcIik7XG5pbXBvcnQgQXJndW1lbnRFcnJvclx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2Vycm9ycy9Bcmd1bWVudEVycm9yXCIpO1xuaW1wb3J0IEV2ZW50XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2V2ZW50cy9FdmVudFwiKTtcblxuaW1wb3J0IEJsZW5kTW9kZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvYmFzZS9CbGVuZE1vZGVcIik7XG5pbXBvcnQgQ2FtZXJhXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2VudGl0aWVzL0NhbWVyYVwiKTtcbmltcG9ydCBMaWdodFBpY2tlckJhc2VcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9tYXRlcmlhbHMvbGlnaHRwaWNrZXJzL0xpZ2h0UGlja2VyQmFzZVwiKTtcbmltcG9ydCBJTWF0ZXJpYWxQYXNzXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvbWF0ZXJpYWxzL3Bhc3Nlcy9JTWF0ZXJpYWxQYXNzXCIpO1xuXG5pbXBvcnQgU3RhZ2VcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvYmFzZS9TdGFnZVwiKVxuaW1wb3J0IENvbnRleHRHTEJsZW5kRmFjdG9yXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2Jhc2UvQ29udGV4dEdMQmxlbmRGYWN0b3JcIik7XG5pbXBvcnQgQ29udGV4dEdMQ29tcGFyZU1vZGVcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvYmFzZS9Db250ZXh0R0xDb21wYXJlTW9kZVwiKTtcblxuaW1wb3J0IE1hdGVyaWFsUGFzc0RhdGFcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9wb29sL01hdGVyaWFsUGFzc0RhdGFcIik7XG5pbXBvcnQgUmVuZGVyYWJsZUJhc2VcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9wb29sL1JlbmRlcmFibGVCYXNlXCIpO1xuaW1wb3J0IFNoYWRlck9iamVjdEJhc2VcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9jb21waWxhdGlvbi9TaGFkZXJPYmplY3RCYXNlXCIpO1xuaW1wb3J0IFNoYWRlclJlZ2lzdGVyQ2FjaGVcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJDYWNoZVwiKTtcbmltcG9ydCBTaGFkZXJSZWdpc3RlckRhdGFcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJEYXRhXCIpO1xuaW1wb3J0IFJlbmRlcmVyQmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvcmVuZGVyL1JlbmRlcmVyQmFzZVwiKTtcblxuXG4vKipcbiAqIE1hdGVyaWFsUGFzc0dMQmFzZSBwcm92aWRlcyBhbiBhYnN0cmFjdCBiYXNlIGNsYXNzIGZvciBtYXRlcmlhbCBzaGFkZXIgcGFzc2VzLiBBIG1hdGVyaWFsIHBhc3MgY29uc3RpdHV0ZXMgYXQgbGVhc3RcbiAqIGEgcmVuZGVyIGNhbGwgcGVyIHJlcXVpcmVkIHJlbmRlcmFibGUuXG4gKi9cbmNsYXNzIE1hdGVyaWFsUGFzc0dMQmFzZSBleHRlbmRzIE5hbWVkQXNzZXRCYXNlIGltcGxlbWVudHMgSU1hdGVyaWFsUGFzc1xue1xuXHRwcml2YXRlIF9tYXRlcmlhbFBhc3NEYXRhOkFycmF5PE1hdGVyaWFsUGFzc0RhdGE+ID0gbmV3IEFycmF5PE1hdGVyaWFsUGFzc0RhdGE+KCk7XG5cdHByaXZhdGUgX3ByZXNlcnZlQWxwaGE6Ym9vbGVhbiA9IHRydWU7XG5cdHByaXZhdGUgX2ZvcmNlU2VwYXJhdGVNVlA6Ym9vbGVhbiA9IGZhbHNlO1xuXG5cdHByaXZhdGUgX2RlcHRoQ29tcGFyZU1vZGU6c3RyaW5nID0gQ29udGV4dEdMQ29tcGFyZU1vZGUuTEVTU19FUVVBTDtcblxuXHRwcml2YXRlIF9ibGVuZEZhY3RvclNvdXJjZTpzdHJpbmcgPSBDb250ZXh0R0xCbGVuZEZhY3Rvci5PTkU7XG5cdHByaXZhdGUgX2JsZW5kRmFjdG9yRGVzdDpzdHJpbmcgPSBDb250ZXh0R0xCbGVuZEZhY3Rvci5aRVJPO1xuXG5cdHB1YmxpYyBfcEVuYWJsZUJsZW5kaW5nOmJvb2xlYW4gPSBmYWxzZTtcblxuXHRwdWJsaWMgIF9wTGlnaHRQaWNrZXI6TGlnaHRQaWNrZXJCYXNlO1xuXG5cdHByaXZhdGUgX3dyaXRlRGVwdGg6Ym9vbGVhbiA9IHRydWU7XG5cdHByaXZhdGUgX29uTGlnaHRzQ2hhbmdlRGVsZWdhdGU6KGV2ZW50OkV2ZW50KSA9PiB2b2lkO1xuXG5cdC8qKlxuXHQgKiBJbmRpY2F0ZXMgd2hldGhlciB0aGUgb3V0cHV0IGFscGhhIHZhbHVlIHNob3VsZCByZW1haW4gdW5jaGFuZ2VkIGNvbXBhcmVkIHRvIHRoZSBtYXRlcmlhbCdzIG9yaWdpbmFsIGFscGhhLlxuXHQgKi9cblx0cHVibGljIGdldCBwcmVzZXJ2ZUFscGhhKCk6Ym9vbGVhblxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3ByZXNlcnZlQWxwaGE7XG5cdH1cblxuXHRwdWJsaWMgc2V0IHByZXNlcnZlQWxwaGEodmFsdWU6Ym9vbGVhbilcblx0e1xuXHRcdGlmICh0aGlzLl9wcmVzZXJ2ZUFscGhhID09IHZhbHVlKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0dGhpcy5fcHJlc2VydmVBbHBoYSA9IHZhbHVlO1xuXG5cdFx0dGhpcy5fcEludmFsaWRhdGVQYXNzKCk7XG5cdH1cblxuXHQvKipcblx0ICogSW5kaWNhdGVzIHdoZXRoZXIgdGhlIHNjcmVlbiBwcm9qZWN0aW9uIHNob3VsZCBiZSBjYWxjdWxhdGVkIGJ5IGZvcmNpbmcgYSBzZXBhcmF0ZSBzY2VuZSBtYXRyaXggYW5kXG5cdCAqIHZpZXctcHJvamVjdGlvbiBtYXRyaXguIFRoaXMgaXMgdXNlZCB0byBwcmV2ZW50IHJvdW5kaW5nIGVycm9ycyB3aGVuIHVzaW5nIG11bHRpcGxlIHBhc3NlcyB3aXRoIGRpZmZlcmVudFxuXHQgKiBwcm9qZWN0aW9uIGNvZGUuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGZvcmNlU2VwYXJhdGVNVlAoKTpib29sZWFuXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fZm9yY2VTZXBhcmF0ZU1WUDtcblx0fVxuXG5cdHB1YmxpYyBzZXQgZm9yY2VTZXBhcmF0ZU1WUCh2YWx1ZTpib29sZWFuKVxuXHR7XG5cdFx0aWYgKHRoaXMuX2ZvcmNlU2VwYXJhdGVNVlAgPT0gdmFsdWUpXG5cdFx0XHRyZXR1cm47XG5cblx0XHR0aGlzLl9mb3JjZVNlcGFyYXRlTVZQID0gdmFsdWU7XG5cblx0XHR0aGlzLl9wSW52YWxpZGF0ZVBhc3MoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IE1hdGVyaWFsUGFzc0dMQmFzZSBvYmplY3QuXG5cdCAqL1xuXHRjb25zdHJ1Y3RvcigpXG5cdHtcblx0XHRzdXBlcigpO1xuXG5cdFx0dGhpcy5fb25MaWdodHNDaGFuZ2VEZWxlZ2F0ZSA9IChldmVudDpFdmVudCkgPT4gdGhpcy5vbkxpZ2h0c0NoYW5nZShldmVudCk7XG5cdH1cblxuXHQvKipcblx0ICogRmFjdG9yeSBtZXRob2QgdG8gY3JlYXRlIGEgY29uY3JldGUgc2hhZGVyIG9iamVjdCBmb3IgdGhpcyBwYXNzLlxuXHQgKlxuXHQgKiBAcGFyYW0gcHJvZmlsZSBUaGUgY29tcGF0aWJpbGl0eSBwcm9maWxlIHVzZWQgYnkgdGhlIHJlbmRlcmVyLlxuXHQgKi9cblx0cHVibGljIGNyZWF0ZVNoYWRlck9iamVjdChwcm9maWxlOnN0cmluZyk6U2hhZGVyT2JqZWN0QmFzZVxuXHR7XG5cdFx0cmV0dXJuIG5ldyBTaGFkZXJPYmplY3RCYXNlKHByb2ZpbGUpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEluZGljYXRlIHdoZXRoZXIgdGhpcyBwYXNzIHNob3VsZCB3cml0ZSB0byB0aGUgZGVwdGggYnVmZmVyIG9yIG5vdC4gSWdub3JlZCB3aGVuIGJsZW5kaW5nIGlzIGVuYWJsZWQuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IHdyaXRlRGVwdGgoKTpib29sZWFuXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fd3JpdGVEZXB0aDtcblx0fVxuXG5cdHB1YmxpYyBzZXQgd3JpdGVEZXB0aCh2YWx1ZTpib29sZWFuKVxuXHR7XG5cdFx0dGhpcy5fd3JpdGVEZXB0aCA9IHZhbHVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBkZXB0aCBjb21wYXJlIG1vZGUgdXNlZCB0byByZW5kZXIgdGhlIHJlbmRlcmFibGVzIHVzaW5nIHRoaXMgbWF0ZXJpYWwuXG5cdCAqXG5cdCAqIEBzZWUgYXdheS5zdGFnZWdsLkNvbnRleHRHTENvbXBhcmVNb2RlXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGRlcHRoQ29tcGFyZU1vZGUoKTpzdHJpbmdcblx0e1xuXHRcdHJldHVybiB0aGlzLl9kZXB0aENvbXBhcmVNb2RlO1xuXHR9XG5cblx0cHVibGljIHNldCBkZXB0aENvbXBhcmVNb2RlKHZhbHVlOnN0cmluZylcblx0e1xuXHRcdHRoaXMuX2RlcHRoQ29tcGFyZU1vZGUgPSB2YWx1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDbGVhbnMgdXAgYW55IHJlc291cmNlcyB1c2VkIGJ5IHRoZSBjdXJyZW50IG9iamVjdC5cblx0ICogQHBhcmFtIGRlZXAgSW5kaWNhdGVzIHdoZXRoZXIgb3RoZXIgcmVzb3VyY2VzIHNob3VsZCBiZSBjbGVhbmVkIHVwLCB0aGF0IGNvdWxkIHBvdGVudGlhbGx5IGJlIHNoYXJlZCBhY3Jvc3MgZGlmZmVyZW50IGluc3RhbmNlcy5cblx0ICovXG5cdHB1YmxpYyBkaXNwb3NlKClcblx0e1xuXHRcdGlmICh0aGlzLl9wTGlnaHRQaWNrZXIpXG5cdFx0XHR0aGlzLl9wTGlnaHRQaWNrZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcihFdmVudC5DSEFOR0UsIHRoaXMuX29uTGlnaHRzQ2hhbmdlRGVsZWdhdGUpO1xuXG5cdFx0d2hpbGUgKHRoaXMuX21hdGVyaWFsUGFzc0RhdGEubGVuZ3RoKVxuXHRcdFx0dGhpcy5fbWF0ZXJpYWxQYXNzRGF0YVswXS5kaXNwb3NlKCk7XG5cblx0XHR0aGlzLl9tYXRlcmlhbFBhc3NEYXRhID0gbnVsbDtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZW5kZXJzIGFuIG9iamVjdCB0byB0aGUgY3VycmVudCByZW5kZXIgdGFyZ2V0LlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0cHVibGljIF9pUmVuZGVyKHBhc3M6TWF0ZXJpYWxQYXNzRGF0YSwgcmVuZGVyYWJsZTpSZW5kZXJhYmxlQmFzZSwgc3RhZ2U6U3RhZ2UsIGNhbWVyYTpDYW1lcmEsIHZpZXdQcm9qZWN0aW9uOk1hdHJpeDNEKVxuXHR7XG5cdFx0dGhpcy5zZXRSZW5kZXJTdGF0ZShwYXNzLCByZW5kZXJhYmxlLCBzdGFnZSwgY2FtZXJhLCB2aWV3UHJvamVjdGlvbik7XG5cdH1cblxuXHQvKipcblx0ICpcblx0ICpcblx0ICogQHBhcmFtIHJlbmRlcmFibGVcblx0ICogQHBhcmFtIHN0YWdlXG5cdCAqIEBwYXJhbSBjYW1lcmFcblx0ICovXG5cdHB1YmxpYyBzZXRSZW5kZXJTdGF0ZShwYXNzOk1hdGVyaWFsUGFzc0RhdGEsIHJlbmRlcmFibGU6UmVuZGVyYWJsZUJhc2UsIHN0YWdlOlN0YWdlLCBjYW1lcmE6Q2FtZXJhLCB2aWV3UHJvamVjdGlvbjpNYXRyaXgzRClcblx0e1xuXHRcdHBhc3Muc2hhZGVyT2JqZWN0LnNldFJlbmRlclN0YXRlKHJlbmRlcmFibGUsIHN0YWdlLCBjYW1lcmEsIHZpZXdQcm9qZWN0aW9uKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgYmxlbmQgbW9kZSB0byB1c2Ugd2hlbiBkcmF3aW5nIHRoaXMgcmVuZGVyYWJsZS4gVGhlIGZvbGxvd2luZyBibGVuZCBtb2RlcyBhcmUgc3VwcG9ydGVkOlxuXHQgKiA8dWw+XG5cdCAqIDxsaT5CbGVuZE1vZGUuTk9STUFMOiBObyBibGVuZGluZywgdW5sZXNzIHRoZSBtYXRlcmlhbCBpbmhlcmVudGx5IG5lZWRzIGl0PC9saT5cblx0ICogPGxpPkJsZW5kTW9kZS5MQVlFUjogRm9yY2UgYmxlbmRpbmcuIFRoaXMgd2lsbCBkcmF3IHRoZSBvYmplY3QgdGhlIHNhbWUgYXMgTk9STUFMLCBidXQgd2l0aG91dCB3cml0aW5nIGRlcHRoIHdyaXRlcy48L2xpPlxuXHQgKiA8bGk+QmxlbmRNb2RlLk1VTFRJUExZPC9saT5cblx0ICogPGxpPkJsZW5kTW9kZS5BREQ8L2xpPlxuXHQgKiA8bGk+QmxlbmRNb2RlLkFMUEhBPC9saT5cblx0ICogPC91bD5cblx0ICovXG5cdHB1YmxpYyBzZXRCbGVuZE1vZGUodmFsdWU6c3RyaW5nKVxuXHR7XG5cdFx0c3dpdGNoICh2YWx1ZSkge1xuXG5cdFx0XHRjYXNlIEJsZW5kTW9kZS5OT1JNQUw6XG5cblx0XHRcdFx0dGhpcy5fYmxlbmRGYWN0b3JTb3VyY2UgPSBDb250ZXh0R0xCbGVuZEZhY3Rvci5PTkU7XG5cdFx0XHRcdHRoaXMuX2JsZW5kRmFjdG9yRGVzdCA9IENvbnRleHRHTEJsZW5kRmFjdG9yLlpFUk87XG5cdFx0XHRcdHRoaXMuX3BFbmFibGVCbGVuZGluZyA9IGZhbHNlO1xuXG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIEJsZW5kTW9kZS5MQVlFUjpcblxuXHRcdFx0XHR0aGlzLl9ibGVuZEZhY3RvclNvdXJjZSA9IENvbnRleHRHTEJsZW5kRmFjdG9yLlNPVVJDRV9BTFBIQTtcblx0XHRcdFx0dGhpcy5fYmxlbmRGYWN0b3JEZXN0ID0gQ29udGV4dEdMQmxlbmRGYWN0b3IuT05FX01JTlVTX1NPVVJDRV9BTFBIQTtcblx0XHRcdFx0dGhpcy5fcEVuYWJsZUJsZW5kaW5nID0gdHJ1ZTtcblxuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSBCbGVuZE1vZGUuTVVMVElQTFk6XG5cblx0XHRcdFx0dGhpcy5fYmxlbmRGYWN0b3JTb3VyY2UgPSBDb250ZXh0R0xCbGVuZEZhY3Rvci5aRVJPO1xuXHRcdFx0XHR0aGlzLl9ibGVuZEZhY3RvckRlc3QgPSBDb250ZXh0R0xCbGVuZEZhY3Rvci5TT1VSQ0VfQ09MT1I7XG5cdFx0XHRcdHRoaXMuX3BFbmFibGVCbGVuZGluZyA9IHRydWU7XG5cblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgQmxlbmRNb2RlLkFERDpcblxuXHRcdFx0XHR0aGlzLl9ibGVuZEZhY3RvclNvdXJjZSA9IENvbnRleHRHTEJsZW5kRmFjdG9yLlNPVVJDRV9BTFBIQTtcblx0XHRcdFx0dGhpcy5fYmxlbmRGYWN0b3JEZXN0ID0gQ29udGV4dEdMQmxlbmRGYWN0b3IuT05FO1xuXHRcdFx0XHR0aGlzLl9wRW5hYmxlQmxlbmRpbmcgPSB0cnVlO1xuXG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIEJsZW5kTW9kZS5BTFBIQTpcblxuXHRcdFx0XHR0aGlzLl9ibGVuZEZhY3RvclNvdXJjZSA9IENvbnRleHRHTEJsZW5kRmFjdG9yLlpFUk87XG5cdFx0XHRcdHRoaXMuX2JsZW5kRmFjdG9yRGVzdCA9IENvbnRleHRHTEJsZW5kRmFjdG9yLlNPVVJDRV9BTFBIQTtcblx0XHRcdFx0dGhpcy5fcEVuYWJsZUJsZW5kaW5nID0gdHJ1ZTtcblxuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0ZGVmYXVsdDpcblxuXHRcdFx0XHR0aHJvdyBuZXcgQXJndW1lbnRFcnJvcihcIlVuc3VwcG9ydGVkIGJsZW5kIG1vZGUhXCIpO1xuXG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFNldHMgdGhlIHJlbmRlciBzdGF0ZSBmb3IgdGhlIHBhc3MgdGhhdCBpcyBpbmRlcGVuZGVudCBvZiB0aGUgcmVuZGVyZWQgb2JqZWN0LiBUaGlzIG5lZWRzIHRvIGJlIGNhbGxlZCBiZWZvcmVcblx0ICogY2FsbGluZyByZW5kZXJQYXNzLiBCZWZvcmUgYWN0aXZhdGluZyBhIHBhc3MsIHRoZSBwcmV2aW91c2x5IHVzZWQgcGFzcyBuZWVkcyB0byBiZSBkZWFjdGl2YXRlZC5cblx0ICogQHBhcmFtIHN0YWdlIFRoZSBTdGFnZSBvYmplY3Qgd2hpY2ggaXMgY3VycmVudGx5IHVzZWQgZm9yIHJlbmRlcmluZy5cblx0ICogQHBhcmFtIGNhbWVyYSBUaGUgY2FtZXJhIGZyb20gd2hpY2ggdGhlIHNjZW5lIGlzIHZpZXdlZC5cblx0ICogQHByaXZhdGVcblx0ICovXG5cdHB1YmxpYyBfaUFjdGl2YXRlKHBhc3M6TWF0ZXJpYWxQYXNzRGF0YSwgcmVuZGVyZXI6UmVuZGVyZXJCYXNlLCBjYW1lcmE6Q2FtZXJhKVxuXHR7XG5cdFx0cmVuZGVyZXIuY29udGV4dC5zZXREZXB0aFRlc3QoKCB0aGlzLl93cml0ZURlcHRoICYmICF0aGlzLl9wRW5hYmxlQmxlbmRpbmcgKSwgdGhpcy5fZGVwdGhDb21wYXJlTW9kZSk7XG5cblx0XHRpZiAodGhpcy5fcEVuYWJsZUJsZW5kaW5nKVxuXHRcdFx0cmVuZGVyZXIuY29udGV4dC5zZXRCbGVuZEZhY3RvcnModGhpcy5fYmxlbmRGYWN0b3JTb3VyY2UsIHRoaXMuX2JsZW5kRmFjdG9yRGVzdCk7XG5cblx0XHRyZW5kZXJlci5hY3RpdmF0ZU1hdGVyaWFsUGFzcyhwYXNzLCBjYW1lcmEpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENsZWFycyB0aGUgcmVuZGVyIHN0YXRlIGZvciB0aGUgcGFzcy4gVGhpcyBuZWVkcyB0byBiZSBjYWxsZWQgYmVmb3JlIGFjdGl2YXRpbmcgYW5vdGhlciBwYXNzLlxuXHQgKiBAcGFyYW0gc3RhZ2UgVGhlIFN0YWdlIHVzZWQgZm9yIHJlbmRlcmluZ1xuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0cHVibGljIF9pRGVhY3RpdmF0ZShwYXNzOk1hdGVyaWFsUGFzc0RhdGEsIHJlbmRlcmVyOlJlbmRlcmVyQmFzZSlcblx0e1xuXHRcdHJlbmRlcmVyLmRlYWN0aXZhdGVNYXRlcmlhbFBhc3MocGFzcyk7XG5cblx0XHRyZW5kZXJlci5jb250ZXh0LnNldERlcHRoVGVzdCh0cnVlLCBDb250ZXh0R0xDb21wYXJlTW9kZS5MRVNTX0VRVUFMKTsgLy8gVE9ETyA6IGltZXBsZW1lbnRcblx0fVxuXG5cdC8qKlxuXHQgKiBNYXJrcyB0aGUgc2hhZGVyIHByb2dyYW0gYXMgaW52YWxpZCwgc28gaXQgd2lsbCBiZSByZWNvbXBpbGVkIGJlZm9yZSB0aGUgbmV4dCByZW5kZXIuXG5cdCAqXG5cdCAqIEBwYXJhbSB1cGRhdGVNYXRlcmlhbCBJbmRpY2F0ZXMgd2hldGhlciB0aGUgaW52YWxpZGF0aW9uIHNob3VsZCBiZSBwZXJmb3JtZWQgb24gdGhlIGVudGlyZSBtYXRlcmlhbC4gU2hvdWxkIGFsd2F5cyBwYXNzIFwidHJ1ZVwiIHVubGVzcyBpdCdzIGNhbGxlZCBmcm9tIHRoZSBtYXRlcmlhbCBpdHNlbGYuXG5cdCAqL1xuXHRwdWJsaWMgX3BJbnZhbGlkYXRlUGFzcygpXG5cdHtcblx0XHR2YXIgbGVuOm51bWJlciA9IHRoaXMuX21hdGVyaWFsUGFzc0RhdGEubGVuZ3RoO1xuXHRcdGZvciAodmFyIGk6bnVtYmVyID0gMDsgaSA8IGxlbjsgaSsrKVxuXHRcdFx0dGhpcy5fbWF0ZXJpYWxQYXNzRGF0YVtpXS5pbnZhbGlkYXRlKCk7XG5cblx0XHR0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEV2ZW50LkNIQU5HRSkpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBsaWdodCBwaWNrZXIgdXNlZCBieSB0aGUgbWF0ZXJpYWwgdG8gcHJvdmlkZSBsaWdodHMgdG8gdGhlIG1hdGVyaWFsIGlmIGl0IHN1cHBvcnRzIGxpZ2h0aW5nLlxuXHQgKlxuXHQgKiBAc2VlIGF3YXkubWF0ZXJpYWxzLkxpZ2h0UGlja2VyQmFzZVxuXHQgKiBAc2VlIGF3YXkubWF0ZXJpYWxzLlN0YXRpY0xpZ2h0UGlja2VyXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGxpZ2h0UGlja2VyKCk6TGlnaHRQaWNrZXJCYXNlXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fcExpZ2h0UGlja2VyO1xuXHR9XG5cblx0cHVibGljIHNldCBsaWdodFBpY2tlcih2YWx1ZTpMaWdodFBpY2tlckJhc2UpXG5cdHtcblx0XHRpZiAodGhpcy5fcExpZ2h0UGlja2VyKVxuXHRcdFx0dGhpcy5fcExpZ2h0UGlja2VyLnJlbW92ZUV2ZW50TGlzdGVuZXIoRXZlbnQuQ0hBTkdFLCB0aGlzLl9vbkxpZ2h0c0NoYW5nZURlbGVnYXRlKTtcblxuXHRcdHRoaXMuX3BMaWdodFBpY2tlciA9IHZhbHVlO1xuXG5cdFx0aWYgKHRoaXMuX3BMaWdodFBpY2tlcilcblx0XHRcdHRoaXMuX3BMaWdodFBpY2tlci5hZGRFdmVudExpc3RlbmVyKEV2ZW50LkNIQU5HRSwgdGhpcy5fb25MaWdodHNDaGFuZ2VEZWxlZ2F0ZSk7XG5cblx0XHR0aGlzLnBVcGRhdGVMaWdodHMoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDYWxsZWQgd2hlbiB0aGUgbGlnaHQgcGlja2VyJ3MgY29uZmlndXJhdGlvbiBjaGFuZ2VzLlxuXHQgKi9cblx0cHJpdmF0ZSBvbkxpZ2h0c0NoYW5nZShldmVudDpFdmVudClcblx0e1xuXHRcdHRoaXMucFVwZGF0ZUxpZ2h0cygpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEltcGxlbWVudGVkIGJ5IHN1YmNsYXNzZXMgaWYgdGhlIHBhc3MgdXNlcyBsaWdodHMgdG8gdXBkYXRlIHRoZSBzaGFkZXIuXG5cdCAqL1xuXHRwdWJsaWMgcFVwZGF0ZUxpZ2h0cygpXG5cdHtcblx0fVxuXG5cdHB1YmxpYyBfaUluY2x1ZGVEZXBlbmRlbmNpZXMoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UpXG5cdHtcblx0XHRpZiAodGhpcy5fZm9yY2VTZXBhcmF0ZU1WUClcblx0XHRcdHNoYWRlck9iamVjdC5nbG9iYWxQb3NEZXBlbmRlbmNpZXMrKztcblxuXHRcdHNoYWRlck9iamVjdC5vdXRwdXRzTm9ybWFscyA9IHRoaXMuX3BPdXRwdXRzTm9ybWFscyhzaGFkZXJPYmplY3QpO1xuXHRcdHNoYWRlck9iamVjdC5vdXRwdXRzVGFuZ2VudE5vcm1hbHMgPSBzaGFkZXJPYmplY3Qub3V0cHV0c05vcm1hbHMgJiYgdGhpcy5fcE91dHB1dHNUYW5nZW50Tm9ybWFscyhzaGFkZXJPYmplY3QpO1xuXHRcdHNoYWRlck9iamVjdC51c2VzVGFuZ2VudFNwYWNlID0gc2hhZGVyT2JqZWN0Lm91dHB1dHNUYW5nZW50Tm9ybWFscyAmJiB0aGlzLl9wVXNlc1RhbmdlbnRTcGFjZShzaGFkZXJPYmplY3QpO1xuXG5cdFx0aWYgKCFzaGFkZXJPYmplY3QudXNlc1RhbmdlbnRTcGFjZSAmJiBzaGFkZXJPYmplY3Qudmlld0RpckRlcGVuZGVuY2llcyA+IDApXG5cdFx0XHRzaGFkZXJPYmplY3QuZ2xvYmFsUG9zRGVwZW5kZW5jaWVzKys7XG5cdH1cblxuXG5cdHB1YmxpYyBfaUluaXRDb25zdGFudERhdGEoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UpXG5cdHtcblxuXHR9XG5cblx0cHVibGljIF9pR2V0UHJlTGlnaHRpbmdWZXJ0ZXhDb2RlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCByZWdpc3RlckNhY2hlOlNoYWRlclJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVyczpTaGFkZXJSZWdpc3RlckRhdGEpOnN0cmluZ1xuXHR7XG5cdFx0cmV0dXJuIFwiXCI7XG5cdH1cblxuXHRwdWJsaWMgX2lHZXRQcmVMaWdodGluZ0ZyYWdtZW50Q29kZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgcmVnaXN0ZXJDYWNoZTpTaGFkZXJSZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnM6U2hhZGVyUmVnaXN0ZXJEYXRhKTpzdHJpbmdcblx0e1xuXHRcdHJldHVybiBcIlwiO1xuXHR9XG5cblx0cHVibGljIF9pR2V0VmVydGV4Q29kZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgcmVnaXN0ZXJDYWNoZTpTaGFkZXJSZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnM6U2hhZGVyUmVnaXN0ZXJEYXRhKTpzdHJpbmdcblx0e1xuXHRcdHJldHVybiBcIlwiO1xuXHR9XG5cblx0cHVibGljIF9pR2V0RnJhZ21lbnRDb2RlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCByZWdpc3RlckNhY2hlOlNoYWRlclJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVyczpTaGFkZXJSZWdpc3RlckRhdGEpOnN0cmluZ1xuXHR7XG5cdFx0cmV0dXJuIFwiXCI7XG5cdH1cblxuXHRwdWJsaWMgX2lHZXROb3JtYWxWZXJ0ZXhDb2RlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCByZWdpc3RlckNhY2hlOlNoYWRlclJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVyczpTaGFkZXJSZWdpc3RlckRhdGEpOnN0cmluZ1xuXHR7XG5cdFx0cmV0dXJuIFwiXCI7XG5cdH1cblxuXHRwdWJsaWMgX2lHZXROb3JtYWxGcmFnbWVudENvZGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIHJlZ2lzdGVyQ2FjaGU6U2hhZGVyUmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzOlNoYWRlclJlZ2lzdGVyRGF0YSk6c3RyaW5nXG5cdHtcblx0XHRyZXR1cm4gXCJcIjtcblx0fVxuXG5cdC8qKlxuXHQgKiBJbmRpY2F0ZXMgd2hldGhlciBvciBub3Qgbm9ybWFscyBhcmUgY2FsY3VsYXRlZCBhdCBhbGwuXG5cdCAqL1xuXHRwdWJsaWMgX3BPdXRwdXRzTm9ybWFscyhzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSk6Ym9vbGVhblxuXHR7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0LyoqXG5cdCAqIEluZGljYXRlcyB3aGV0aGVyIG9yIG5vdCBub3JtYWxzIGFyZSBjYWxjdWxhdGVkIGluIHRhbmdlbnQgc3BhY2UuXG5cdCAqL1xuXHRwdWJsaWMgX3BPdXRwdXRzVGFuZ2VudE5vcm1hbHMoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UpOmJvb2xlYW5cblx0e1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBJbmRpY2F0ZXMgd2hldGhlciBvciBub3Qgbm9ybWFscyBhcmUgYWxsb3dlZCBpbiB0YW5nZW50IHNwYWNlLiBUaGlzIGlzIG9ubHkgdGhlIGNhc2UgaWYgbm8gb2JqZWN0LXNwYWNlXG5cdCAqIGRlcGVuZGVuY2llcyBleGlzdC5cblx0ICovXG5cdHB1YmxpYyBfcFVzZXNUYW5nZW50U3BhY2Uoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UpOmJvb2xlYW5cblx0e1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdHB1YmxpYyBfaUFkZE1hdGVyaWFsUGFzc0RhdGEobWF0ZXJpYWxQYXNzRGF0YTpNYXRlcmlhbFBhc3NEYXRhKTpNYXRlcmlhbFBhc3NEYXRhXG5cdHtcblx0XHR0aGlzLl9tYXRlcmlhbFBhc3NEYXRhLnB1c2gobWF0ZXJpYWxQYXNzRGF0YSk7XG5cblx0XHRyZXR1cm4gbWF0ZXJpYWxQYXNzRGF0YTtcblx0fVxuXG5cdHB1YmxpYyBfaVJlbW92ZU1hdGVyaWFsUGFzc0RhdGEobWF0ZXJpYWxQYXNzRGF0YTpNYXRlcmlhbFBhc3NEYXRhKTpNYXRlcmlhbFBhc3NEYXRhXG5cdHtcblx0XHR0aGlzLl9tYXRlcmlhbFBhc3NEYXRhLnNwbGljZSh0aGlzLl9tYXRlcmlhbFBhc3NEYXRhLmluZGV4T2YobWF0ZXJpYWxQYXNzRGF0YSksIDEpO1xuXG5cdFx0cmV0dXJuIG1hdGVyaWFsUGFzc0RhdGE7XG5cdH1cbn1cblxuZXhwb3J0ID0gTWF0ZXJpYWxQYXNzR0xCYXNlOyJdfQ==