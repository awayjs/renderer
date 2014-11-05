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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9wYXNzZXMvbWF0ZXJpYWxwYXNzZ2xiYXNlLnRzIl0sIm5hbWVzIjpbIk1hdGVyaWFsUGFzc0dMQmFzZSIsIk1hdGVyaWFsUGFzc0dMQmFzZS5jb25zdHJ1Y3RvciIsIk1hdGVyaWFsUGFzc0dMQmFzZS5wcmVzZXJ2ZUFscGhhIiwiTWF0ZXJpYWxQYXNzR0xCYXNlLmZvcmNlU2VwYXJhdGVNVlAiLCJNYXRlcmlhbFBhc3NHTEJhc2UuY3JlYXRlU2hhZGVyT2JqZWN0IiwiTWF0ZXJpYWxQYXNzR0xCYXNlLndyaXRlRGVwdGgiLCJNYXRlcmlhbFBhc3NHTEJhc2UuZGVwdGhDb21wYXJlTW9kZSIsIk1hdGVyaWFsUGFzc0dMQmFzZS5kaXNwb3NlIiwiTWF0ZXJpYWxQYXNzR0xCYXNlLl9pUmVuZGVyIiwiTWF0ZXJpYWxQYXNzR0xCYXNlLnNldFJlbmRlclN0YXRlIiwiTWF0ZXJpYWxQYXNzR0xCYXNlLnNldEJsZW5kTW9kZSIsIk1hdGVyaWFsUGFzc0dMQmFzZS5faUFjdGl2YXRlIiwiTWF0ZXJpYWxQYXNzR0xCYXNlLl9pRGVhY3RpdmF0ZSIsIk1hdGVyaWFsUGFzc0dMQmFzZS5fcEludmFsaWRhdGVQYXNzIiwiTWF0ZXJpYWxQYXNzR0xCYXNlLmxpZ2h0UGlja2VyIiwiTWF0ZXJpYWxQYXNzR0xCYXNlLm9uTGlnaHRzQ2hhbmdlIiwiTWF0ZXJpYWxQYXNzR0xCYXNlLnBVcGRhdGVMaWdodHMiLCJNYXRlcmlhbFBhc3NHTEJhc2UuX2lJbmNsdWRlRGVwZW5kZW5jaWVzIiwiTWF0ZXJpYWxQYXNzR0xCYXNlLl9pSW5pdENvbnN0YW50RGF0YSIsIk1hdGVyaWFsUGFzc0dMQmFzZS5faUdldFByZUxpZ2h0aW5nVmVydGV4Q29kZSIsIk1hdGVyaWFsUGFzc0dMQmFzZS5faUdldFByZUxpZ2h0aW5nRnJhZ21lbnRDb2RlIiwiTWF0ZXJpYWxQYXNzR0xCYXNlLl9pR2V0VmVydGV4Q29kZSIsIk1hdGVyaWFsUGFzc0dMQmFzZS5faUdldEZyYWdtZW50Q29kZSIsIk1hdGVyaWFsUGFzc0dMQmFzZS5faUdldE5vcm1hbFZlcnRleENvZGUiLCJNYXRlcmlhbFBhc3NHTEJhc2UuX2lHZXROb3JtYWxGcmFnbWVudENvZGUiLCJNYXRlcmlhbFBhc3NHTEJhc2UuX3BPdXRwdXRzTm9ybWFscyIsIk1hdGVyaWFsUGFzc0dMQmFzZS5fcE91dHB1dHNUYW5nZW50Tm9ybWFscyIsIk1hdGVyaWFsUGFzc0dMQmFzZS5fcFVzZXNUYW5nZW50U3BhY2UiLCJNYXRlcmlhbFBhc3NHTEJhc2UuX2lBZGRNYXRlcmlhbFBhc3NEYXRhIiwiTWF0ZXJpYWxQYXNzR0xCYXNlLl9pUmVtb3ZlTWF0ZXJpYWxQYXNzRGF0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBRUEsSUFBTyxjQUFjLFdBQWMsd0NBQXdDLENBQUMsQ0FBQztBQUM3RSxJQUFPLGFBQWEsV0FBYyxzQ0FBc0MsQ0FBQyxDQUFDO0FBQzFFLElBQU8sS0FBSyxXQUFnQiw4QkFBOEIsQ0FBQyxDQUFDO0FBRTVELElBQU8sU0FBUyxXQUFlLG1DQUFtQyxDQUFDLENBQUM7QUFNcEUsSUFBTyxvQkFBb0IsV0FBYSw4Q0FBOEMsQ0FBQyxDQUFDO0FBQ3hGLElBQU8sb0JBQW9CLFdBQWEsOENBQThDLENBQUMsQ0FBQztBQUt4RixJQUFPLGdCQUFnQixXQUFjLG9EQUFvRCxDQUFDLENBQUM7QUFLM0YsQUFJQTs7O0dBREc7SUFDRyxrQkFBa0I7SUFBU0EsVUFBM0JBLGtCQUFrQkEsVUFBdUJBO0lBd0Q5Q0E7O09BRUdBO0lBQ0hBLFNBM0RLQSxrQkFBa0JBO1FBQXhCQyxpQkFvWENBO1FBdlRDQSxpQkFBT0EsQ0FBQ0E7UUEzRERBLHNCQUFpQkEsR0FBMkJBLElBQUlBLEtBQUtBLEVBQW9CQSxDQUFDQTtRQUMxRUEsbUJBQWNBLEdBQVdBLElBQUlBLENBQUNBO1FBQzlCQSxzQkFBaUJBLEdBQVdBLEtBQUtBLENBQUNBO1FBRWxDQSxzQkFBaUJBLEdBQVVBLG9CQUFvQkEsQ0FBQ0EsVUFBVUEsQ0FBQ0E7UUFFM0RBLHVCQUFrQkEsR0FBVUEsb0JBQW9CQSxDQUFDQSxHQUFHQSxDQUFDQTtRQUNyREEscUJBQWdCQSxHQUFVQSxvQkFBb0JBLENBQUNBLElBQUlBLENBQUNBO1FBRXJEQSxxQkFBZ0JBLEdBQVdBLEtBQUtBLENBQUNBO1FBSWhDQSxnQkFBV0EsR0FBV0EsSUFBSUEsQ0FBQ0E7UUFnRGxDQSxJQUFJQSxDQUFDQSx1QkFBdUJBLEdBQUdBLFVBQUNBLEtBQVdBLElBQUtBLE9BQUFBLEtBQUlBLENBQUNBLGNBQWNBLENBQUNBLEtBQUtBLENBQUNBLEVBQTFCQSxDQUEwQkEsQ0FBQ0E7SUFDNUVBLENBQUNBO0lBM0NERCxzQkFBV0EsNkNBQWFBO1FBSHhCQTs7V0FFR0E7YUFDSEE7WUFFQ0UsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0E7UUFDNUJBLENBQUNBO2FBRURGLFVBQXlCQSxLQUFhQTtZQUVyQ0UsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsY0FBY0EsSUFBSUEsS0FBS0EsQ0FBQ0E7Z0JBQ2hDQSxNQUFNQSxDQUFDQTtZQUVSQSxJQUFJQSxDQUFDQSxjQUFjQSxHQUFHQSxLQUFLQSxDQUFDQTtZQUU1QkEsSUFBSUEsQ0FBQ0EsZ0JBQWdCQSxFQUFFQSxDQUFDQTtRQUN6QkEsQ0FBQ0E7OztPQVZBRjtJQWlCREEsc0JBQVdBLGdEQUFnQkE7UUFMM0JBOzs7O1dBSUdBO2FBQ0hBO1lBRUNHLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLGlCQUFpQkEsQ0FBQ0E7UUFDL0JBLENBQUNBO2FBRURILFVBQTRCQSxLQUFhQTtZQUV4Q0csRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsaUJBQWlCQSxJQUFJQSxLQUFLQSxDQUFDQTtnQkFDbkNBLE1BQU1BLENBQUNBO1lBRVJBLElBQUlBLENBQUNBLGlCQUFpQkEsR0FBR0EsS0FBS0EsQ0FBQ0E7WUFFL0JBLElBQUlBLENBQUNBLGdCQUFnQkEsRUFBRUEsQ0FBQ0E7UUFDekJBLENBQUNBOzs7T0FWQUg7SUFzQkRBOzs7O09BSUdBO0lBQ0lBLCtDQUFrQkEsR0FBekJBLFVBQTBCQSxPQUFjQTtRQUV2Q0ksTUFBTUEsQ0FBQ0EsSUFBSUEsZ0JBQWdCQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQTtJQUN0Q0EsQ0FBQ0E7SUFLREosc0JBQVdBLDBDQUFVQTtRQUhyQkE7O1dBRUdBO2FBQ0hBO1lBRUNLLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBO1FBQ3pCQSxDQUFDQTthQUVETCxVQUFzQkEsS0FBYUE7WUFFbENLLElBQUlBLENBQUNBLFdBQVdBLEdBQUdBLEtBQUtBLENBQUNBO1FBQzFCQSxDQUFDQTs7O09BTEFMO0lBWURBLHNCQUFXQSxnREFBZ0JBO1FBTDNCQTs7OztXQUlHQTthQUNIQTtZQUVDTSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxpQkFBaUJBLENBQUNBO1FBQy9CQSxDQUFDQTthQUVETixVQUE0QkEsS0FBWUE7WUFFdkNNLElBQUlBLENBQUNBLGlCQUFpQkEsR0FBR0EsS0FBS0EsQ0FBQ0E7UUFDaENBLENBQUNBOzs7T0FMQU47SUFPREE7OztPQUdHQTtJQUNJQSxvQ0FBT0EsR0FBZEE7UUFFQ08sRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsYUFBYUEsQ0FBQ0E7WUFDdEJBLElBQUlBLENBQUNBLGFBQWFBLENBQUNBLG1CQUFtQkEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsTUFBTUEsRUFBRUEsSUFBSUEsQ0FBQ0EsdUJBQXVCQSxDQUFDQSxDQUFDQTtRQUVwRkEsT0FBT0EsSUFBSUEsQ0FBQ0EsaUJBQWlCQSxDQUFDQSxNQUFNQTtZQUNuQ0EsSUFBSUEsQ0FBQ0EsaUJBQWlCQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxPQUFPQSxFQUFFQSxDQUFDQTtRQUVyQ0EsSUFBSUEsQ0FBQ0EsaUJBQWlCQSxHQUFHQSxJQUFJQSxDQUFDQTtJQUMvQkEsQ0FBQ0E7SUFFRFA7Ozs7T0FJR0E7SUFDSUEscUNBQVFBLEdBQWZBLFVBQWdCQSxJQUFxQkEsRUFBRUEsVUFBeUJBLEVBQUVBLEtBQVdBLEVBQUVBLE1BQWFBLEVBQUVBLGNBQXVCQTtRQUVwSFEsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsSUFBSUEsRUFBRUEsVUFBVUEsRUFBRUEsS0FBS0EsRUFBRUEsTUFBTUEsRUFBRUEsY0FBY0EsQ0FBQ0EsQ0FBQ0E7SUFDdEVBLENBQUNBO0lBRURSOzs7Ozs7T0FNR0E7SUFDSUEsMkNBQWNBLEdBQXJCQSxVQUFzQkEsSUFBcUJBLEVBQUVBLFVBQXlCQSxFQUFFQSxLQUFXQSxFQUFFQSxNQUFhQSxFQUFFQSxjQUF1QkE7UUFFMUhTLElBQUlBLENBQUNBLFlBQVlBLENBQUNBLGNBQWNBLENBQUNBLFVBQVVBLEVBQUVBLEtBQUtBLEVBQUVBLE1BQU1BLEVBQUVBLGNBQWNBLENBQUNBLENBQUNBO0lBQzdFQSxDQUFDQTtJQUVEVDs7Ozs7Ozs7O09BU0dBO0lBQ0lBLHlDQUFZQSxHQUFuQkEsVUFBb0JBLEtBQVlBO1FBRS9CVSxNQUFNQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUVmQSxLQUFLQSxTQUFTQSxDQUFDQSxNQUFNQTtnQkFFcEJBLElBQUlBLENBQUNBLGtCQUFrQkEsR0FBR0Esb0JBQW9CQSxDQUFDQSxHQUFHQSxDQUFDQTtnQkFDbkRBLElBQUlBLENBQUNBLGdCQUFnQkEsR0FBR0Esb0JBQW9CQSxDQUFDQSxJQUFJQSxDQUFDQTtnQkFDbERBLElBQUlBLENBQUNBLGdCQUFnQkEsR0FBR0EsS0FBS0EsQ0FBQ0E7Z0JBRTlCQSxLQUFLQSxDQUFDQTtZQUVQQSxLQUFLQSxTQUFTQSxDQUFDQSxLQUFLQTtnQkFFbkJBLElBQUlBLENBQUNBLGtCQUFrQkEsR0FBR0Esb0JBQW9CQSxDQUFDQSxZQUFZQSxDQUFDQTtnQkFDNURBLElBQUlBLENBQUNBLGdCQUFnQkEsR0FBR0Esb0JBQW9CQSxDQUFDQSxzQkFBc0JBLENBQUNBO2dCQUNwRUEsSUFBSUEsQ0FBQ0EsZ0JBQWdCQSxHQUFHQSxJQUFJQSxDQUFDQTtnQkFFN0JBLEtBQUtBLENBQUNBO1lBRVBBLEtBQUtBLFNBQVNBLENBQUNBLFFBQVFBO2dCQUV0QkEsSUFBSUEsQ0FBQ0Esa0JBQWtCQSxHQUFHQSxvQkFBb0JBLENBQUNBLElBQUlBLENBQUNBO2dCQUNwREEsSUFBSUEsQ0FBQ0EsZ0JBQWdCQSxHQUFHQSxvQkFBb0JBLENBQUNBLFlBQVlBLENBQUNBO2dCQUMxREEsSUFBSUEsQ0FBQ0EsZ0JBQWdCQSxHQUFHQSxJQUFJQSxDQUFDQTtnQkFFN0JBLEtBQUtBLENBQUNBO1lBRVBBLEtBQUtBLFNBQVNBLENBQUNBLEdBQUdBO2dCQUVqQkEsSUFBSUEsQ0FBQ0Esa0JBQWtCQSxHQUFHQSxvQkFBb0JBLENBQUNBLFlBQVlBLENBQUNBO2dCQUM1REEsSUFBSUEsQ0FBQ0EsZ0JBQWdCQSxHQUFHQSxvQkFBb0JBLENBQUNBLEdBQUdBLENBQUNBO2dCQUNqREEsSUFBSUEsQ0FBQ0EsZ0JBQWdCQSxHQUFHQSxJQUFJQSxDQUFDQTtnQkFFN0JBLEtBQUtBLENBQUNBO1lBRVBBLEtBQUtBLFNBQVNBLENBQUNBLEtBQUtBO2dCQUVuQkEsSUFBSUEsQ0FBQ0Esa0JBQWtCQSxHQUFHQSxvQkFBb0JBLENBQUNBLElBQUlBLENBQUNBO2dCQUNwREEsSUFBSUEsQ0FBQ0EsZ0JBQWdCQSxHQUFHQSxvQkFBb0JBLENBQUNBLFlBQVlBLENBQUNBO2dCQUMxREEsSUFBSUEsQ0FBQ0EsZ0JBQWdCQSxHQUFHQSxJQUFJQSxDQUFDQTtnQkFFN0JBLEtBQUtBLENBQUNBO1lBRVBBO2dCQUVDQSxNQUFNQSxJQUFJQSxhQUFhQSxDQUFDQSx5QkFBeUJBLENBQUNBLENBQUNBO1FBRXJEQSxDQUFDQTtJQUNGQSxDQUFDQTtJQUVEVjs7Ozs7O09BTUdBO0lBQ0lBLHVDQUFVQSxHQUFqQkEsVUFBa0JBLElBQXFCQSxFQUFFQSxRQUFxQkEsRUFBRUEsTUFBYUE7UUFFNUVXLFFBQVFBLENBQUNBLE9BQU9BLENBQUNBLFlBQVlBLENBQUNBLENBQUVBLElBQUlBLENBQUNBLFdBQVdBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLGdCQUFnQkEsQ0FBRUEsRUFBRUEsSUFBSUEsQ0FBQ0EsaUJBQWlCQSxDQUFDQSxDQUFDQTtRQUV0R0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsZ0JBQWdCQSxDQUFDQTtZQUN6QkEsUUFBUUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsZUFBZUEsQ0FBQ0EsSUFBSUEsQ0FBQ0Esa0JBQWtCQSxFQUFFQSxJQUFJQSxDQUFDQSxnQkFBZ0JBLENBQUNBLENBQUNBO1FBRWxGQSxRQUFRQSxDQUFDQSxvQkFBb0JBLENBQUNBLElBQUlBLEVBQUVBLE1BQU1BLENBQUNBLENBQUNBO0lBQzdDQSxDQUFDQTtJQUVEWDs7Ozs7T0FLR0E7SUFDSUEseUNBQVlBLEdBQW5CQSxVQUFvQkEsSUFBcUJBLEVBQUVBLFFBQXFCQTtRQUUvRFksUUFBUUEsQ0FBQ0Esc0JBQXNCQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtRQUV0Q0EsUUFBUUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsWUFBWUEsQ0FBQ0EsSUFBSUEsRUFBRUEsb0JBQW9CQSxDQUFDQSxVQUFVQSxDQUFDQSxFQUFFQSxvQkFBb0JBO0lBQzNGQSxDQUFDQSxHQURxRUE7SUFHdEVaOzs7O09BSUdBO0lBQ0lBLDZDQUFnQkEsR0FBdkJBO1FBRUNhLElBQUlBLEdBQUdBLEdBQVVBLElBQUlBLENBQUNBLGlCQUFpQkEsQ0FBQ0EsTUFBTUEsQ0FBQ0E7UUFDL0NBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQVVBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLEdBQUdBLEVBQUVBLENBQUNBLEVBQUVBO1lBQ2xDQSxJQUFJQSxDQUFDQSxpQkFBaUJBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLFVBQVVBLEVBQUVBLENBQUNBO1FBRXhDQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQSxJQUFJQSxLQUFLQSxDQUFDQSxLQUFLQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQTtJQUM3Q0EsQ0FBQ0E7SUFRRGIsc0JBQVdBLDJDQUFXQTtRQU50QkE7Ozs7O1dBS0dBO2FBQ0hBO1lBRUNjLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLGFBQWFBLENBQUNBO1FBQzNCQSxDQUFDQTthQUVEZCxVQUF1QkEsS0FBcUJBO1lBRTNDYyxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQTtnQkFDdEJBLElBQUlBLENBQUNBLGFBQWFBLENBQUNBLG1CQUFtQkEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsTUFBTUEsRUFBRUEsSUFBSUEsQ0FBQ0EsdUJBQXVCQSxDQUFDQSxDQUFDQTtZQUVwRkEsSUFBSUEsQ0FBQ0EsYUFBYUEsR0FBR0EsS0FBS0EsQ0FBQ0E7WUFFM0JBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLGFBQWFBLENBQUNBO2dCQUN0QkEsSUFBSUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsZ0JBQWdCQSxDQUFDQSxLQUFLQSxDQUFDQSxNQUFNQSxFQUFFQSxJQUFJQSxDQUFDQSx1QkFBdUJBLENBQUNBLENBQUNBO1lBRWpGQSxJQUFJQSxDQUFDQSxhQUFhQSxFQUFFQSxDQUFDQTtRQUN0QkEsQ0FBQ0E7OztPQWJBZDtJQWVEQTs7T0FFR0E7SUFDS0EsMkNBQWNBLEdBQXRCQSxVQUF1QkEsS0FBV0E7UUFFakNlLElBQUlBLENBQUNBLGFBQWFBLEVBQUVBLENBQUNBO0lBQ3RCQSxDQUFDQTtJQUVEZjs7T0FFR0E7SUFDSUEsMENBQWFBLEdBQXBCQTtJQUVBZ0IsQ0FBQ0E7SUFFTWhCLGtEQUFxQkEsR0FBNUJBLFVBQTZCQSxZQUE2QkE7UUFFekRpQixFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxpQkFBaUJBLENBQUNBO1lBQzFCQSxZQUFZQSxDQUFDQSxxQkFBcUJBLEVBQUVBLENBQUNBO1FBRXRDQSxZQUFZQSxDQUFDQSxjQUFjQSxHQUFHQSxJQUFJQSxDQUFDQSxnQkFBZ0JBLENBQUNBLFlBQVlBLENBQUNBLENBQUNBO1FBQ2xFQSxZQUFZQSxDQUFDQSxxQkFBcUJBLEdBQUdBLFlBQVlBLENBQUNBLGNBQWNBLElBQUlBLElBQUlBLENBQUNBLHVCQUF1QkEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsQ0FBQ0E7UUFDL0dBLFlBQVlBLENBQUNBLGdCQUFnQkEsR0FBR0EsWUFBWUEsQ0FBQ0EscUJBQXFCQSxJQUFJQSxJQUFJQSxDQUFDQSxrQkFBa0JBLENBQUNBLFlBQVlBLENBQUNBLENBQUNBO1FBRTVHQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxZQUFZQSxDQUFDQSxnQkFBZ0JBLElBQUlBLFlBQVlBLENBQUNBLG1CQUFtQkEsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFDMUVBLFlBQVlBLENBQUNBLHFCQUFxQkEsRUFBRUEsQ0FBQ0E7SUFDdkNBLENBQUNBO0lBR01qQiwrQ0FBa0JBLEdBQXpCQSxVQUEwQkEsWUFBNkJBO0lBR3ZEa0IsQ0FBQ0E7SUFFTWxCLHVEQUEwQkEsR0FBakNBLFVBQWtDQSxZQUE2QkEsRUFBRUEsYUFBaUNBLEVBQUVBLGVBQWtDQTtRQUVySW1CLE1BQU1BLENBQUNBLEVBQUVBLENBQUNBO0lBQ1hBLENBQUNBO0lBRU1uQix5REFBNEJBLEdBQW5DQSxVQUFvQ0EsWUFBNkJBLEVBQUVBLGFBQWlDQSxFQUFFQSxlQUFrQ0E7UUFFdklvQixNQUFNQSxDQUFDQSxFQUFFQSxDQUFDQTtJQUNYQSxDQUFDQTtJQUVNcEIsNENBQWVBLEdBQXRCQSxVQUF1QkEsWUFBNkJBLEVBQUVBLGFBQWlDQSxFQUFFQSxlQUFrQ0E7UUFFMUhxQixNQUFNQSxDQUFDQSxFQUFFQSxDQUFDQTtJQUNYQSxDQUFDQTtJQUVNckIsOENBQWlCQSxHQUF4QkEsVUFBeUJBLFlBQTZCQSxFQUFFQSxhQUFpQ0EsRUFBRUEsZUFBa0NBO1FBRTVIc0IsTUFBTUEsQ0FBQ0EsRUFBRUEsQ0FBQ0E7SUFDWEEsQ0FBQ0E7SUFFTXRCLGtEQUFxQkEsR0FBNUJBLFVBQTZCQSxZQUE2QkEsRUFBRUEsYUFBaUNBLEVBQUVBLGVBQWtDQTtRQUVoSXVCLE1BQU1BLENBQUNBLEVBQUVBLENBQUNBO0lBQ1hBLENBQUNBO0lBRU12QixvREFBdUJBLEdBQTlCQSxVQUErQkEsWUFBNkJBLEVBQUVBLGFBQWlDQSxFQUFFQSxlQUFrQ0E7UUFFbEl3QixNQUFNQSxDQUFDQSxFQUFFQSxDQUFDQTtJQUNYQSxDQUFDQTtJQUVEeEI7O09BRUdBO0lBQ0lBLDZDQUFnQkEsR0FBdkJBLFVBQXdCQSxZQUE2QkE7UUFFcER5QixNQUFNQSxDQUFDQSxLQUFLQSxDQUFDQTtJQUNkQSxDQUFDQTtJQUVEekI7O09BRUdBO0lBQ0lBLG9EQUF1QkEsR0FBOUJBLFVBQStCQSxZQUE2QkE7UUFFM0QwQixNQUFNQSxDQUFDQSxLQUFLQSxDQUFDQTtJQUNkQSxDQUFDQTtJQUVEMUI7OztPQUdHQTtJQUNJQSwrQ0FBa0JBLEdBQXpCQSxVQUEwQkEsWUFBNkJBO1FBRXREMkIsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7SUFDZEEsQ0FBQ0E7SUFFTTNCLGtEQUFxQkEsR0FBNUJBLFVBQTZCQSxnQkFBaUNBO1FBRTdENEIsSUFBSUEsQ0FBQ0EsaUJBQWlCQSxDQUFDQSxJQUFJQSxDQUFDQSxnQkFBZ0JBLENBQUNBLENBQUNBO1FBRTlDQSxNQUFNQSxDQUFDQSxnQkFBZ0JBLENBQUNBO0lBQ3pCQSxDQUFDQTtJQUVNNUIscURBQXdCQSxHQUEvQkEsVUFBZ0NBLGdCQUFpQ0E7UUFFaEU2QixJQUFJQSxDQUFDQSxpQkFBaUJBLENBQUNBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLGlCQUFpQkEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsZ0JBQWdCQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUVuRkEsTUFBTUEsQ0FBQ0EsZ0JBQWdCQSxDQUFDQTtJQUN6QkEsQ0FBQ0E7SUFDRjdCLHlCQUFDQTtBQUFEQSxDQXBYQSxBQW9YQ0EsRUFwWGdDLGNBQWMsRUFvWDlDO0FBRUQsQUFBNEIsaUJBQW5CLGtCQUFrQixDQUFDIiwiZmlsZSI6InBhc3Nlcy9NYXRlcmlhbFBhc3NHTEJhc2UuanMiLCJzb3VyY2VSb290IjoiLi4vIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE1hdHJpeDNEXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2dlb20vTWF0cml4M0RcIik7XG5pbXBvcnQgTWF0cml4M0RVdGlsc1x0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2dlb20vTWF0cml4M0RVdGlsc1wiKTtcbmltcG9ydCBOYW1lZEFzc2V0QmFzZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2xpYnJhcnkvTmFtZWRBc3NldEJhc2VcIik7XG5pbXBvcnQgQXJndW1lbnRFcnJvclx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2Vycm9ycy9Bcmd1bWVudEVycm9yXCIpO1xuaW1wb3J0IEV2ZW50XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2V2ZW50cy9FdmVudFwiKTtcblxuaW1wb3J0IEJsZW5kTW9kZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvYmFzZS9CbGVuZE1vZGVcIik7XG5pbXBvcnQgQ2FtZXJhXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2VudGl0aWVzL0NhbWVyYVwiKTtcbmltcG9ydCBMaWdodFBpY2tlckJhc2VcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9tYXRlcmlhbHMvbGlnaHRwaWNrZXJzL0xpZ2h0UGlja2VyQmFzZVwiKTtcbmltcG9ydCBJTWF0ZXJpYWxQYXNzXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvbWF0ZXJpYWxzL3Bhc3Nlcy9JTWF0ZXJpYWxQYXNzXCIpO1xuXG5pbXBvcnQgU3RhZ2VcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvYmFzZS9TdGFnZVwiKVxuaW1wb3J0IENvbnRleHRHTEJsZW5kRmFjdG9yXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2Jhc2UvQ29udGV4dEdMQmxlbmRGYWN0b3JcIik7XG5pbXBvcnQgQ29udGV4dEdMQ29tcGFyZU1vZGVcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvYmFzZS9Db250ZXh0R0xDb21wYXJlTW9kZVwiKTtcblxuaW1wb3J0IFJlbmRlcmVyQmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYmFzZS9SZW5kZXJlckJhc2VcIik7XG5pbXBvcnQgTWF0ZXJpYWxQYXNzRGF0YVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL3Bvb2wvTWF0ZXJpYWxQYXNzRGF0YVwiKTtcbmltcG9ydCBSZW5kZXJhYmxlQmFzZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL3Bvb2wvUmVuZGVyYWJsZUJhc2VcIik7XG5pbXBvcnQgU2hhZGVyT2JqZWN0QmFzZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2NvbXBpbGF0aW9uL1NoYWRlck9iamVjdEJhc2VcIik7XG5pbXBvcnQgU2hhZGVyUmVnaXN0ZXJDYWNoZVx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckNhY2hlXCIpO1xuaW1wb3J0IFNoYWRlclJlZ2lzdGVyRGF0YVx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckRhdGFcIik7XG5cblxuLyoqXG4gKiBNYXRlcmlhbFBhc3NHTEJhc2UgcHJvdmlkZXMgYW4gYWJzdHJhY3QgYmFzZSBjbGFzcyBmb3IgbWF0ZXJpYWwgc2hhZGVyIHBhc3Nlcy4gQSBtYXRlcmlhbCBwYXNzIGNvbnN0aXR1dGVzIGF0IGxlYXN0XG4gKiBhIHJlbmRlciBjYWxsIHBlciByZXF1aXJlZCByZW5kZXJhYmxlLlxuICovXG5jbGFzcyBNYXRlcmlhbFBhc3NHTEJhc2UgZXh0ZW5kcyBOYW1lZEFzc2V0QmFzZSBpbXBsZW1lbnRzIElNYXRlcmlhbFBhc3Ncbntcblx0cHJpdmF0ZSBfbWF0ZXJpYWxQYXNzRGF0YTpBcnJheTxNYXRlcmlhbFBhc3NEYXRhPiA9IG5ldyBBcnJheTxNYXRlcmlhbFBhc3NEYXRhPigpO1xuXHRwcml2YXRlIF9wcmVzZXJ2ZUFscGhhOmJvb2xlYW4gPSB0cnVlO1xuXHRwcml2YXRlIF9mb3JjZVNlcGFyYXRlTVZQOmJvb2xlYW4gPSBmYWxzZTtcblxuXHRwcml2YXRlIF9kZXB0aENvbXBhcmVNb2RlOnN0cmluZyA9IENvbnRleHRHTENvbXBhcmVNb2RlLkxFU1NfRVFVQUw7XG5cblx0cHJpdmF0ZSBfYmxlbmRGYWN0b3JTb3VyY2U6c3RyaW5nID0gQ29udGV4dEdMQmxlbmRGYWN0b3IuT05FO1xuXHRwcml2YXRlIF9ibGVuZEZhY3RvckRlc3Q6c3RyaW5nID0gQ29udGV4dEdMQmxlbmRGYWN0b3IuWkVSTztcblxuXHRwdWJsaWMgX3BFbmFibGVCbGVuZGluZzpib29sZWFuID0gZmFsc2U7XG5cblx0cHVibGljICBfcExpZ2h0UGlja2VyOkxpZ2h0UGlja2VyQmFzZTtcblxuXHRwcml2YXRlIF93cml0ZURlcHRoOmJvb2xlYW4gPSB0cnVlO1xuXHRwcml2YXRlIF9vbkxpZ2h0c0NoYW5nZURlbGVnYXRlOihldmVudDpFdmVudCkgPT4gdm9pZDtcblxuXHQvKipcblx0ICogSW5kaWNhdGVzIHdoZXRoZXIgdGhlIG91dHB1dCBhbHBoYSB2YWx1ZSBzaG91bGQgcmVtYWluIHVuY2hhbmdlZCBjb21wYXJlZCB0byB0aGUgbWF0ZXJpYWwncyBvcmlnaW5hbCBhbHBoYS5cblx0ICovXG5cdHB1YmxpYyBnZXQgcHJlc2VydmVBbHBoYSgpOmJvb2xlYW5cblx0e1xuXHRcdHJldHVybiB0aGlzLl9wcmVzZXJ2ZUFscGhhO1xuXHR9XG5cblx0cHVibGljIHNldCBwcmVzZXJ2ZUFscGhhKHZhbHVlOmJvb2xlYW4pXG5cdHtcblx0XHRpZiAodGhpcy5fcHJlc2VydmVBbHBoYSA9PSB2YWx1ZSlcblx0XHRcdHJldHVybjtcblxuXHRcdHRoaXMuX3ByZXNlcnZlQWxwaGEgPSB2YWx1ZTtcblxuXHRcdHRoaXMuX3BJbnZhbGlkYXRlUGFzcygpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEluZGljYXRlcyB3aGV0aGVyIHRoZSBzY3JlZW4gcHJvamVjdGlvbiBzaG91bGQgYmUgY2FsY3VsYXRlZCBieSBmb3JjaW5nIGEgc2VwYXJhdGUgc2NlbmUgbWF0cml4IGFuZFxuXHQgKiB2aWV3LXByb2plY3Rpb24gbWF0cml4LiBUaGlzIGlzIHVzZWQgdG8gcHJldmVudCByb3VuZGluZyBlcnJvcnMgd2hlbiB1c2luZyBtdWx0aXBsZSBwYXNzZXMgd2l0aCBkaWZmZXJlbnRcblx0ICogcHJvamVjdGlvbiBjb2RlLlxuXHQgKi9cblx0cHVibGljIGdldCBmb3JjZVNlcGFyYXRlTVZQKCk6Ym9vbGVhblxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX2ZvcmNlU2VwYXJhdGVNVlA7XG5cdH1cblxuXHRwdWJsaWMgc2V0IGZvcmNlU2VwYXJhdGVNVlAodmFsdWU6Ym9vbGVhbilcblx0e1xuXHRcdGlmICh0aGlzLl9mb3JjZVNlcGFyYXRlTVZQID09IHZhbHVlKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0dGhpcy5fZm9yY2VTZXBhcmF0ZU1WUCA9IHZhbHVlO1xuXG5cdFx0dGhpcy5fcEludmFsaWRhdGVQYXNzKCk7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyBNYXRlcmlhbFBhc3NHTEJhc2Ugb2JqZWN0LlxuXHQgKi9cblx0Y29uc3RydWN0b3IoKVxuXHR7XG5cdFx0c3VwZXIoKTtcblxuXHRcdHRoaXMuX29uTGlnaHRzQ2hhbmdlRGVsZWdhdGUgPSAoZXZlbnQ6RXZlbnQpID0+IHRoaXMub25MaWdodHNDaGFuZ2UoZXZlbnQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEZhY3RvcnkgbWV0aG9kIHRvIGNyZWF0ZSBhIGNvbmNyZXRlIHNoYWRlciBvYmplY3QgZm9yIHRoaXMgcGFzcy5cblx0ICpcblx0ICogQHBhcmFtIHByb2ZpbGUgVGhlIGNvbXBhdGliaWxpdHkgcHJvZmlsZSB1c2VkIGJ5IHRoZSByZW5kZXJlci5cblx0ICovXG5cdHB1YmxpYyBjcmVhdGVTaGFkZXJPYmplY3QocHJvZmlsZTpzdHJpbmcpOlNoYWRlck9iamVjdEJhc2Vcblx0e1xuXHRcdHJldHVybiBuZXcgU2hhZGVyT2JqZWN0QmFzZShwcm9maWxlKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBJbmRpY2F0ZSB3aGV0aGVyIHRoaXMgcGFzcyBzaG91bGQgd3JpdGUgdG8gdGhlIGRlcHRoIGJ1ZmZlciBvciBub3QuIElnbm9yZWQgd2hlbiBibGVuZGluZyBpcyBlbmFibGVkLlxuXHQgKi9cblx0cHVibGljIGdldCB3cml0ZURlcHRoKCk6Ym9vbGVhblxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3dyaXRlRGVwdGg7XG5cdH1cblxuXHRwdWJsaWMgc2V0IHdyaXRlRGVwdGgodmFsdWU6Ym9vbGVhbilcblx0e1xuXHRcdHRoaXMuX3dyaXRlRGVwdGggPSB2YWx1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgZGVwdGggY29tcGFyZSBtb2RlIHVzZWQgdG8gcmVuZGVyIHRoZSByZW5kZXJhYmxlcyB1c2luZyB0aGlzIG1hdGVyaWFsLlxuXHQgKlxuXHQgKiBAc2VlIGF3YXkuc3RhZ2VnbC5Db250ZXh0R0xDb21wYXJlTW9kZVxuXHQgKi9cblx0cHVibGljIGdldCBkZXB0aENvbXBhcmVNb2RlKCk6c3RyaW5nXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fZGVwdGhDb21wYXJlTW9kZTtcblx0fVxuXG5cdHB1YmxpYyBzZXQgZGVwdGhDb21wYXJlTW9kZSh2YWx1ZTpzdHJpbmcpXG5cdHtcblx0XHR0aGlzLl9kZXB0aENvbXBhcmVNb2RlID0gdmFsdWU7XG5cdH1cblxuXHQvKipcblx0ICogQ2xlYW5zIHVwIGFueSByZXNvdXJjZXMgdXNlZCBieSB0aGUgY3VycmVudCBvYmplY3QuXG5cdCAqIEBwYXJhbSBkZWVwIEluZGljYXRlcyB3aGV0aGVyIG90aGVyIHJlc291cmNlcyBzaG91bGQgYmUgY2xlYW5lZCB1cCwgdGhhdCBjb3VsZCBwb3RlbnRpYWxseSBiZSBzaGFyZWQgYWNyb3NzIGRpZmZlcmVudCBpbnN0YW5jZXMuXG5cdCAqL1xuXHRwdWJsaWMgZGlzcG9zZSgpXG5cdHtcblx0XHRpZiAodGhpcy5fcExpZ2h0UGlja2VyKVxuXHRcdFx0dGhpcy5fcExpZ2h0UGlja2VyLnJlbW92ZUV2ZW50TGlzdGVuZXIoRXZlbnQuQ0hBTkdFLCB0aGlzLl9vbkxpZ2h0c0NoYW5nZURlbGVnYXRlKTtcblxuXHRcdHdoaWxlICh0aGlzLl9tYXRlcmlhbFBhc3NEYXRhLmxlbmd0aClcblx0XHRcdHRoaXMuX21hdGVyaWFsUGFzc0RhdGFbMF0uZGlzcG9zZSgpO1xuXG5cdFx0dGhpcy5fbWF0ZXJpYWxQYXNzRGF0YSA9IG51bGw7XG5cdH1cblxuXHQvKipcblx0ICogUmVuZGVycyBhbiBvYmplY3QgdG8gdGhlIGN1cnJlbnQgcmVuZGVyIHRhcmdldC5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICovXG5cdHB1YmxpYyBfaVJlbmRlcihwYXNzOk1hdGVyaWFsUGFzc0RhdGEsIHJlbmRlcmFibGU6UmVuZGVyYWJsZUJhc2UsIHN0YWdlOlN0YWdlLCBjYW1lcmE6Q2FtZXJhLCB2aWV3UHJvamVjdGlvbjpNYXRyaXgzRClcblx0e1xuXHRcdHRoaXMuc2V0UmVuZGVyU3RhdGUocGFzcywgcmVuZGVyYWJsZSwgc3RhZ2UsIGNhbWVyYSwgdmlld1Byb2plY3Rpb24pO1xuXHR9XG5cblx0LyoqXG5cdCAqXG5cdCAqXG5cdCAqIEBwYXJhbSByZW5kZXJhYmxlXG5cdCAqIEBwYXJhbSBzdGFnZVxuXHQgKiBAcGFyYW0gY2FtZXJhXG5cdCAqL1xuXHRwdWJsaWMgc2V0UmVuZGVyU3RhdGUocGFzczpNYXRlcmlhbFBhc3NEYXRhLCByZW5kZXJhYmxlOlJlbmRlcmFibGVCYXNlLCBzdGFnZTpTdGFnZSwgY2FtZXJhOkNhbWVyYSwgdmlld1Byb2plY3Rpb246TWF0cml4M0QpXG5cdHtcblx0XHRwYXNzLnNoYWRlck9iamVjdC5zZXRSZW5kZXJTdGF0ZShyZW5kZXJhYmxlLCBzdGFnZSwgY2FtZXJhLCB2aWV3UHJvamVjdGlvbik7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIGJsZW5kIG1vZGUgdG8gdXNlIHdoZW4gZHJhd2luZyB0aGlzIHJlbmRlcmFibGUuIFRoZSBmb2xsb3dpbmcgYmxlbmQgbW9kZXMgYXJlIHN1cHBvcnRlZDpcblx0ICogPHVsPlxuXHQgKiA8bGk+QmxlbmRNb2RlLk5PUk1BTDogTm8gYmxlbmRpbmcsIHVubGVzcyB0aGUgbWF0ZXJpYWwgaW5oZXJlbnRseSBuZWVkcyBpdDwvbGk+XG5cdCAqIDxsaT5CbGVuZE1vZGUuTEFZRVI6IEZvcmNlIGJsZW5kaW5nLiBUaGlzIHdpbGwgZHJhdyB0aGUgb2JqZWN0IHRoZSBzYW1lIGFzIE5PUk1BTCwgYnV0IHdpdGhvdXQgd3JpdGluZyBkZXB0aCB3cml0ZXMuPC9saT5cblx0ICogPGxpPkJsZW5kTW9kZS5NVUxUSVBMWTwvbGk+XG5cdCAqIDxsaT5CbGVuZE1vZGUuQUREPC9saT5cblx0ICogPGxpPkJsZW5kTW9kZS5BTFBIQTwvbGk+XG5cdCAqIDwvdWw+XG5cdCAqL1xuXHRwdWJsaWMgc2V0QmxlbmRNb2RlKHZhbHVlOnN0cmluZylcblx0e1xuXHRcdHN3aXRjaCAodmFsdWUpIHtcblxuXHRcdFx0Y2FzZSBCbGVuZE1vZGUuTk9STUFMOlxuXG5cdFx0XHRcdHRoaXMuX2JsZW5kRmFjdG9yU291cmNlID0gQ29udGV4dEdMQmxlbmRGYWN0b3IuT05FO1xuXHRcdFx0XHR0aGlzLl9ibGVuZEZhY3RvckRlc3QgPSBDb250ZXh0R0xCbGVuZEZhY3Rvci5aRVJPO1xuXHRcdFx0XHR0aGlzLl9wRW5hYmxlQmxlbmRpbmcgPSBmYWxzZTtcblxuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSBCbGVuZE1vZGUuTEFZRVI6XG5cblx0XHRcdFx0dGhpcy5fYmxlbmRGYWN0b3JTb3VyY2UgPSBDb250ZXh0R0xCbGVuZEZhY3Rvci5TT1VSQ0VfQUxQSEE7XG5cdFx0XHRcdHRoaXMuX2JsZW5kRmFjdG9yRGVzdCA9IENvbnRleHRHTEJsZW5kRmFjdG9yLk9ORV9NSU5VU19TT1VSQ0VfQUxQSEE7XG5cdFx0XHRcdHRoaXMuX3BFbmFibGVCbGVuZGluZyA9IHRydWU7XG5cblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgQmxlbmRNb2RlLk1VTFRJUExZOlxuXG5cdFx0XHRcdHRoaXMuX2JsZW5kRmFjdG9yU291cmNlID0gQ29udGV4dEdMQmxlbmRGYWN0b3IuWkVSTztcblx0XHRcdFx0dGhpcy5fYmxlbmRGYWN0b3JEZXN0ID0gQ29udGV4dEdMQmxlbmRGYWN0b3IuU09VUkNFX0NPTE9SO1xuXHRcdFx0XHR0aGlzLl9wRW5hYmxlQmxlbmRpbmcgPSB0cnVlO1xuXG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIEJsZW5kTW9kZS5BREQ6XG5cblx0XHRcdFx0dGhpcy5fYmxlbmRGYWN0b3JTb3VyY2UgPSBDb250ZXh0R0xCbGVuZEZhY3Rvci5TT1VSQ0VfQUxQSEE7XG5cdFx0XHRcdHRoaXMuX2JsZW5kRmFjdG9yRGVzdCA9IENvbnRleHRHTEJsZW5kRmFjdG9yLk9ORTtcblx0XHRcdFx0dGhpcy5fcEVuYWJsZUJsZW5kaW5nID0gdHJ1ZTtcblxuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSBCbGVuZE1vZGUuQUxQSEE6XG5cblx0XHRcdFx0dGhpcy5fYmxlbmRGYWN0b3JTb3VyY2UgPSBDb250ZXh0R0xCbGVuZEZhY3Rvci5aRVJPO1xuXHRcdFx0XHR0aGlzLl9ibGVuZEZhY3RvckRlc3QgPSBDb250ZXh0R0xCbGVuZEZhY3Rvci5TT1VSQ0VfQUxQSEE7XG5cdFx0XHRcdHRoaXMuX3BFbmFibGVCbGVuZGluZyA9IHRydWU7XG5cblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGRlZmF1bHQ6XG5cblx0XHRcdFx0dGhyb3cgbmV3IEFyZ3VtZW50RXJyb3IoXCJVbnN1cHBvcnRlZCBibGVuZCBtb2RlIVwiKTtcblxuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBTZXRzIHRoZSByZW5kZXIgc3RhdGUgZm9yIHRoZSBwYXNzIHRoYXQgaXMgaW5kZXBlbmRlbnQgb2YgdGhlIHJlbmRlcmVkIG9iamVjdC4gVGhpcyBuZWVkcyB0byBiZSBjYWxsZWQgYmVmb3JlXG5cdCAqIGNhbGxpbmcgcmVuZGVyUGFzcy4gQmVmb3JlIGFjdGl2YXRpbmcgYSBwYXNzLCB0aGUgcHJldmlvdXNseSB1c2VkIHBhc3MgbmVlZHMgdG8gYmUgZGVhY3RpdmF0ZWQuXG5cdCAqIEBwYXJhbSBzdGFnZSBUaGUgU3RhZ2Ugb2JqZWN0IHdoaWNoIGlzIGN1cnJlbnRseSB1c2VkIGZvciByZW5kZXJpbmcuXG5cdCAqIEBwYXJhbSBjYW1lcmEgVGhlIGNhbWVyYSBmcm9tIHdoaWNoIHRoZSBzY2VuZSBpcyB2aWV3ZWQuXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRwdWJsaWMgX2lBY3RpdmF0ZShwYXNzOk1hdGVyaWFsUGFzc0RhdGEsIHJlbmRlcmVyOlJlbmRlcmVyQmFzZSwgY2FtZXJhOkNhbWVyYSlcblx0e1xuXHRcdHJlbmRlcmVyLmNvbnRleHQuc2V0RGVwdGhUZXN0KCggdGhpcy5fd3JpdGVEZXB0aCAmJiAhdGhpcy5fcEVuYWJsZUJsZW5kaW5nICksIHRoaXMuX2RlcHRoQ29tcGFyZU1vZGUpO1xuXG5cdFx0aWYgKHRoaXMuX3BFbmFibGVCbGVuZGluZylcblx0XHRcdHJlbmRlcmVyLmNvbnRleHQuc2V0QmxlbmRGYWN0b3JzKHRoaXMuX2JsZW5kRmFjdG9yU291cmNlLCB0aGlzLl9ibGVuZEZhY3RvckRlc3QpO1xuXG5cdFx0cmVuZGVyZXIuYWN0aXZhdGVNYXRlcmlhbFBhc3MocGFzcywgY2FtZXJhKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDbGVhcnMgdGhlIHJlbmRlciBzdGF0ZSBmb3IgdGhlIHBhc3MuIFRoaXMgbmVlZHMgdG8gYmUgY2FsbGVkIGJlZm9yZSBhY3RpdmF0aW5nIGFub3RoZXIgcGFzcy5cblx0ICogQHBhcmFtIHN0YWdlIFRoZSBTdGFnZSB1c2VkIGZvciByZW5kZXJpbmdcblx0ICpcblx0ICogQHByaXZhdGVcblx0ICovXG5cdHB1YmxpYyBfaURlYWN0aXZhdGUocGFzczpNYXRlcmlhbFBhc3NEYXRhLCByZW5kZXJlcjpSZW5kZXJlckJhc2UpXG5cdHtcblx0XHRyZW5kZXJlci5kZWFjdGl2YXRlTWF0ZXJpYWxQYXNzKHBhc3MpO1xuXG5cdFx0cmVuZGVyZXIuY29udGV4dC5zZXREZXB0aFRlc3QodHJ1ZSwgQ29udGV4dEdMQ29tcGFyZU1vZGUuTEVTU19FUVVBTCk7IC8vIFRPRE8gOiBpbWVwbGVtZW50XG5cdH1cblxuXHQvKipcblx0ICogTWFya3MgdGhlIHNoYWRlciBwcm9ncmFtIGFzIGludmFsaWQsIHNvIGl0IHdpbGwgYmUgcmVjb21waWxlZCBiZWZvcmUgdGhlIG5leHQgcmVuZGVyLlxuXHQgKlxuXHQgKiBAcGFyYW0gdXBkYXRlTWF0ZXJpYWwgSW5kaWNhdGVzIHdoZXRoZXIgdGhlIGludmFsaWRhdGlvbiBzaG91bGQgYmUgcGVyZm9ybWVkIG9uIHRoZSBlbnRpcmUgbWF0ZXJpYWwuIFNob3VsZCBhbHdheXMgcGFzcyBcInRydWVcIiB1bmxlc3MgaXQncyBjYWxsZWQgZnJvbSB0aGUgbWF0ZXJpYWwgaXRzZWxmLlxuXHQgKi9cblx0cHVibGljIF9wSW52YWxpZGF0ZVBhc3MoKVxuXHR7XG5cdFx0dmFyIGxlbjpudW1iZXIgPSB0aGlzLl9tYXRlcmlhbFBhc3NEYXRhLmxlbmd0aDtcblx0XHRmb3IgKHZhciBpOm51bWJlciA9IDA7IGkgPCBsZW47IGkrKylcblx0XHRcdHRoaXMuX21hdGVyaWFsUGFzc0RhdGFbaV0uaW52YWxpZGF0ZSgpO1xuXG5cdFx0dGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFdmVudC5DSEFOR0UpKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgbGlnaHQgcGlja2VyIHVzZWQgYnkgdGhlIG1hdGVyaWFsIHRvIHByb3ZpZGUgbGlnaHRzIHRvIHRoZSBtYXRlcmlhbCBpZiBpdCBzdXBwb3J0cyBsaWdodGluZy5cblx0ICpcblx0ICogQHNlZSBhd2F5Lm1hdGVyaWFscy5MaWdodFBpY2tlckJhc2Vcblx0ICogQHNlZSBhd2F5Lm1hdGVyaWFscy5TdGF0aWNMaWdodFBpY2tlclxuXHQgKi9cblx0cHVibGljIGdldCBsaWdodFBpY2tlcigpOkxpZ2h0UGlja2VyQmFzZVxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3BMaWdodFBpY2tlcjtcblx0fVxuXG5cdHB1YmxpYyBzZXQgbGlnaHRQaWNrZXIodmFsdWU6TGlnaHRQaWNrZXJCYXNlKVxuXHR7XG5cdFx0aWYgKHRoaXMuX3BMaWdodFBpY2tlcilcblx0XHRcdHRoaXMuX3BMaWdodFBpY2tlci5yZW1vdmVFdmVudExpc3RlbmVyKEV2ZW50LkNIQU5HRSwgdGhpcy5fb25MaWdodHNDaGFuZ2VEZWxlZ2F0ZSk7XG5cblx0XHR0aGlzLl9wTGlnaHRQaWNrZXIgPSB2YWx1ZTtcblxuXHRcdGlmICh0aGlzLl9wTGlnaHRQaWNrZXIpXG5cdFx0XHR0aGlzLl9wTGlnaHRQaWNrZXIuYWRkRXZlbnRMaXN0ZW5lcihFdmVudC5DSEFOR0UsIHRoaXMuX29uTGlnaHRzQ2hhbmdlRGVsZWdhdGUpO1xuXG5cdFx0dGhpcy5wVXBkYXRlTGlnaHRzKCk7XG5cdH1cblxuXHQvKipcblx0ICogQ2FsbGVkIHdoZW4gdGhlIGxpZ2h0IHBpY2tlcidzIGNvbmZpZ3VyYXRpb24gY2hhbmdlcy5cblx0ICovXG5cdHByaXZhdGUgb25MaWdodHNDaGFuZ2UoZXZlbnQ6RXZlbnQpXG5cdHtcblx0XHR0aGlzLnBVcGRhdGVMaWdodHMoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBJbXBsZW1lbnRlZCBieSBzdWJjbGFzc2VzIGlmIHRoZSBwYXNzIHVzZXMgbGlnaHRzIHRvIHVwZGF0ZSB0aGUgc2hhZGVyLlxuXHQgKi9cblx0cHVibGljIHBVcGRhdGVMaWdodHMoKVxuXHR7XG5cdH1cblxuXHRwdWJsaWMgX2lJbmNsdWRlRGVwZW5kZW5jaWVzKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlKVxuXHR7XG5cdFx0aWYgKHRoaXMuX2ZvcmNlU2VwYXJhdGVNVlApXG5cdFx0XHRzaGFkZXJPYmplY3QuZ2xvYmFsUG9zRGVwZW5kZW5jaWVzKys7XG5cblx0XHRzaGFkZXJPYmplY3Qub3V0cHV0c05vcm1hbHMgPSB0aGlzLl9wT3V0cHV0c05vcm1hbHMoc2hhZGVyT2JqZWN0KTtcblx0XHRzaGFkZXJPYmplY3Qub3V0cHV0c1RhbmdlbnROb3JtYWxzID0gc2hhZGVyT2JqZWN0Lm91dHB1dHNOb3JtYWxzICYmIHRoaXMuX3BPdXRwdXRzVGFuZ2VudE5vcm1hbHMoc2hhZGVyT2JqZWN0KTtcblx0XHRzaGFkZXJPYmplY3QudXNlc1RhbmdlbnRTcGFjZSA9IHNoYWRlck9iamVjdC5vdXRwdXRzVGFuZ2VudE5vcm1hbHMgJiYgdGhpcy5fcFVzZXNUYW5nZW50U3BhY2Uoc2hhZGVyT2JqZWN0KTtcblxuXHRcdGlmICghc2hhZGVyT2JqZWN0LnVzZXNUYW5nZW50U3BhY2UgJiYgc2hhZGVyT2JqZWN0LnZpZXdEaXJEZXBlbmRlbmNpZXMgPiAwKVxuXHRcdFx0c2hhZGVyT2JqZWN0Lmdsb2JhbFBvc0RlcGVuZGVuY2llcysrO1xuXHR9XG5cblxuXHRwdWJsaWMgX2lJbml0Q29uc3RhbnREYXRhKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlKVxuXHR7XG5cblx0fVxuXG5cdHB1YmxpYyBfaUdldFByZUxpZ2h0aW5nVmVydGV4Q29kZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgcmVnaXN0ZXJDYWNoZTpTaGFkZXJSZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnM6U2hhZGVyUmVnaXN0ZXJEYXRhKTpzdHJpbmdcblx0e1xuXHRcdHJldHVybiBcIlwiO1xuXHR9XG5cblx0cHVibGljIF9pR2V0UHJlTGlnaHRpbmdGcmFnbWVudENvZGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIHJlZ2lzdGVyQ2FjaGU6U2hhZGVyUmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzOlNoYWRlclJlZ2lzdGVyRGF0YSk6c3RyaW5nXG5cdHtcblx0XHRyZXR1cm4gXCJcIjtcblx0fVxuXG5cdHB1YmxpYyBfaUdldFZlcnRleENvZGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIHJlZ2lzdGVyQ2FjaGU6U2hhZGVyUmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzOlNoYWRlclJlZ2lzdGVyRGF0YSk6c3RyaW5nXG5cdHtcblx0XHRyZXR1cm4gXCJcIjtcblx0fVxuXG5cdHB1YmxpYyBfaUdldEZyYWdtZW50Q29kZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgcmVnaXN0ZXJDYWNoZTpTaGFkZXJSZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnM6U2hhZGVyUmVnaXN0ZXJEYXRhKTpzdHJpbmdcblx0e1xuXHRcdHJldHVybiBcIlwiO1xuXHR9XG5cblx0cHVibGljIF9pR2V0Tm9ybWFsVmVydGV4Q29kZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgcmVnaXN0ZXJDYWNoZTpTaGFkZXJSZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnM6U2hhZGVyUmVnaXN0ZXJEYXRhKTpzdHJpbmdcblx0e1xuXHRcdHJldHVybiBcIlwiO1xuXHR9XG5cblx0cHVibGljIF9pR2V0Tm9ybWFsRnJhZ21lbnRDb2RlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCByZWdpc3RlckNhY2hlOlNoYWRlclJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVyczpTaGFkZXJSZWdpc3RlckRhdGEpOnN0cmluZ1xuXHR7XG5cdFx0cmV0dXJuIFwiXCI7XG5cdH1cblxuXHQvKipcblx0ICogSW5kaWNhdGVzIHdoZXRoZXIgb3Igbm90IG5vcm1hbHMgYXJlIGNhbGN1bGF0ZWQgYXQgYWxsLlxuXHQgKi9cblx0cHVibGljIF9wT3V0cHV0c05vcm1hbHMoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UpOmJvb2xlYW5cblx0e1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBJbmRpY2F0ZXMgd2hldGhlciBvciBub3Qgbm9ybWFscyBhcmUgY2FsY3VsYXRlZCBpbiB0YW5nZW50IHNwYWNlLlxuXHQgKi9cblx0cHVibGljIF9wT3V0cHV0c1RhbmdlbnROb3JtYWxzKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlKTpib29sZWFuXG5cdHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHQvKipcblx0ICogSW5kaWNhdGVzIHdoZXRoZXIgb3Igbm90IG5vcm1hbHMgYXJlIGFsbG93ZWQgaW4gdGFuZ2VudCBzcGFjZS4gVGhpcyBpcyBvbmx5IHRoZSBjYXNlIGlmIG5vIG9iamVjdC1zcGFjZVxuXHQgKiBkZXBlbmRlbmNpZXMgZXhpc3QuXG5cdCAqL1xuXHRwdWJsaWMgX3BVc2VzVGFuZ2VudFNwYWNlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlKTpib29sZWFuXG5cdHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHRwdWJsaWMgX2lBZGRNYXRlcmlhbFBhc3NEYXRhKG1hdGVyaWFsUGFzc0RhdGE6TWF0ZXJpYWxQYXNzRGF0YSk6TWF0ZXJpYWxQYXNzRGF0YVxuXHR7XG5cdFx0dGhpcy5fbWF0ZXJpYWxQYXNzRGF0YS5wdXNoKG1hdGVyaWFsUGFzc0RhdGEpO1xuXG5cdFx0cmV0dXJuIG1hdGVyaWFsUGFzc0RhdGE7XG5cdH1cblxuXHRwdWJsaWMgX2lSZW1vdmVNYXRlcmlhbFBhc3NEYXRhKG1hdGVyaWFsUGFzc0RhdGE6TWF0ZXJpYWxQYXNzRGF0YSk6TWF0ZXJpYWxQYXNzRGF0YVxuXHR7XG5cdFx0dGhpcy5fbWF0ZXJpYWxQYXNzRGF0YS5zcGxpY2UodGhpcy5fbWF0ZXJpYWxQYXNzRGF0YS5pbmRleE9mKG1hdGVyaWFsUGFzc0RhdGEpLCAxKTtcblxuXHRcdHJldHVybiBtYXRlcmlhbFBhc3NEYXRhO1xuXHR9XG59XG5cbmV4cG9ydCA9IE1hdGVyaWFsUGFzc0dMQmFzZTsiXX0=