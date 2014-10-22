var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ShaderCompilerHelper = require("awayjs-stagegl/lib/materials/utils/ShaderCompilerHelper");
var DiffuseCompositeMethod = require("awayjs-renderergl/lib/materials/methods/DiffuseCompositeMethod");
/**
 * DiffuseLightMapMethod provides a diffuse shading method that uses a light map to modulate the calculated diffuse
 * lighting. It is different from EffectLightMapMethod in that the latter modulates the entire calculated pixel color, rather
 * than only the diffuse lighting value.
 */
var DiffuseLightMapMethod = (function (_super) {
    __extends(DiffuseLightMapMethod, _super);
    /**
     * Creates a new DiffuseLightMapMethod method.
     *
     * @param lightMap The texture containing the light map.
     * @param blendMode The blend mode with which the light map should be applied to the lighting result.
     * @param useSecondaryUV Indicates whether the secondary UV set should be used to map the light map.
     * @param baseMethod The diffuse method used to calculate the regular diffuse-based lighting.
     */
    function DiffuseLightMapMethod(lightMap, blendMode, useSecondaryUV, baseMethod) {
        if (blendMode === void 0) { blendMode = "multiply"; }
        if (useSecondaryUV === void 0) { useSecondaryUV = false; }
        if (baseMethod === void 0) { baseMethod = null; }
        _super.call(this, null, baseMethod);
        this._useSecondaryUV = useSecondaryUV;
        this._lightMapTexture = lightMap;
        this.blendMode = blendMode;
    }
    /**
     * @inheritDoc
     */
    DiffuseLightMapMethod.prototype.iInitVO = function (shaderObject, methodVO) {
        methodVO.needsSecondaryUV = this._useSecondaryUV;
        methodVO.needsUV = !this._useSecondaryUV;
    };
    Object.defineProperty(DiffuseLightMapMethod.prototype, "blendMode", {
        /**
         * The blend mode with which the light map should be applied to the lighting result.
         *
         * @see DiffuseLightMapMethod.ADD
         * @see DiffuseLightMapMethod.MULTIPLY
         */
        get: function () {
            return this._blendMode;
        },
        set: function (value) {
            if (value != DiffuseLightMapMethod.ADD && value != DiffuseLightMapMethod.MULTIPLY)
                throw new Error("Unknown blendmode!");
            if (this._blendMode == value)
                return;
            this._blendMode = value;
            this.iInvalidateShaderProgram();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DiffuseLightMapMethod.prototype, "lightMapTexture", {
        /**
         * The texture containing the light map data.
         */
        get: function () {
            return this._lightMapTexture;
        },
        set: function (value) {
            this._lightMapTexture = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    DiffuseLightMapMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
        stage.context.activateTexture(methodVO.secondaryTexturesIndex, this._lightMapTexture);
        _super.prototype.iActivate.call(this, shaderObject, methodVO, stage);
    };
    /**
     * @inheritDoc
     */
    DiffuseLightMapMethod.prototype.iGetFragmentPostLightingCode = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
        var code;
        var lightMapReg = registerCache.getFreeTextureReg();
        var temp = registerCache.getFreeFragmentVectorTemp();
        methodVO.secondaryTexturesIndex = lightMapReg.index;
        code = ShaderCompilerHelper.getTex2DSampleCode(temp, sharedRegisters, lightMapReg, this._lightMapTexture, shaderObject.useSmoothTextures, shaderObject.repeatTextures, shaderObject.useMipmapping, sharedRegisters.secondaryUVVarying);
        switch (this._blendMode) {
            case DiffuseLightMapMethod.MULTIPLY:
                code += "mul " + this._pTotalLightColorReg + ", " + this._pTotalLightColorReg + ", " + temp + "\n";
                break;
            case DiffuseLightMapMethod.ADD:
                code += "add " + this._pTotalLightColorReg + ", " + this._pTotalLightColorReg + ", " + temp + "\n";
                break;
        }
        code += _super.prototype.iGetFragmentPostLightingCode.call(this, shaderObject, methodVO, targetReg, registerCache, sharedRegisters);
        return code;
    };
    /**
     * Indicates the light map should be multiplied with the calculated shading result.
     * This can be used to add pre-calculated shadows or occlusion.
     */
    DiffuseLightMapMethod.MULTIPLY = "multiply";
    /**
     * Indicates the light map should be added into the calculated shading result.
     * This can be used to add pre-calculated lighting or global illumination.
     */
    DiffuseLightMapMethod.ADD = "add";
    return DiffuseLightMapMethod;
})(DiffuseCompositeMethod);
module.exports = DiffuseLightMapMethod;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1hdGVyaWFscy9tZXRob2RzL2RpZmZ1c2VsaWdodG1hcG1ldGhvZC50cyJdLCJuYW1lcyI6WyJEaWZmdXNlTGlnaHRNYXBNZXRob2QiLCJEaWZmdXNlTGlnaHRNYXBNZXRob2QuY29uc3RydWN0b3IiLCJEaWZmdXNlTGlnaHRNYXBNZXRob2QuaUluaXRWTyIsIkRpZmZ1c2VMaWdodE1hcE1ldGhvZC5ibGVuZE1vZGUiLCJEaWZmdXNlTGlnaHRNYXBNZXRob2QubGlnaHRNYXBUZXh0dXJlIiwiRGlmZnVzZUxpZ2h0TWFwTWV0aG9kLmlBY3RpdmF0ZSIsIkRpZmZ1c2VMaWdodE1hcE1ldGhvZC5pR2V0RnJhZ21lbnRQb3N0TGlnaHRpbmdDb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFVQSxJQUFPLG9CQUFvQixXQUFjLHlEQUF5RCxDQUFDLENBQUM7QUFFcEcsSUFBTyxzQkFBc0IsV0FBYSxnRUFBZ0UsQ0FBQyxDQUFDO0FBRTVHLEFBS0E7Ozs7R0FERztJQUNHLHFCQUFxQjtJQUFTQSxVQUE5QkEscUJBQXFCQSxVQUErQkE7SUFrQnpEQTs7Ozs7OztPQU9HQTtJQUNIQSxTQTFCS0EscUJBQXFCQSxDQTBCZEEsUUFBc0JBLEVBQUVBLFNBQTZCQSxFQUFFQSxjQUE4QkEsRUFBRUEsVUFBb0NBO1FBQW5HQyx5QkFBNkJBLEdBQTdCQSxzQkFBNkJBO1FBQUVBLDhCQUE4QkEsR0FBOUJBLHNCQUE4QkE7UUFBRUEsMEJBQW9DQSxHQUFwQ0EsaUJBQW9DQTtRQUV0SUEsa0JBQU1BLElBQUlBLEVBQUVBLFVBQVVBLENBQUNBLENBQUNBO1FBRXhCQSxJQUFJQSxDQUFDQSxlQUFlQSxHQUFHQSxjQUFjQSxDQUFDQTtRQUN0Q0EsSUFBSUEsQ0FBQ0EsZ0JBQWdCQSxHQUFHQSxRQUFRQSxDQUFDQTtRQUNqQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsR0FBR0EsU0FBU0EsQ0FBQ0E7SUFDNUJBLENBQUNBO0lBRUREOztPQUVHQTtJQUNJQSx1Q0FBT0EsR0FBZEEsVUFBZUEsWUFB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QUNBO1lBQ1BBLEtBQUtBLHFCQUFxQkEsQ0FBQ0EsR0FBR0E7Z0JBQzdCQSxJQUFJQSxJQUFJQSxNQUFNQSxHQUFHQSxJQUFJQSxDQUFDQSxvQkFBb0JBLEdBQUdBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLG9CQUFvQkEsR0FBR0EsSUFBSUEsR0FBR0EsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0E7Z0JBQ25HQSxLQUFLQSxDQUFDQTtRQUNSQSxDQUFDQTtRQUVEQSxJQUFJQSxJQUFJQSxnQkFBS0EsQ0FBQ0EsNEJBQTRCQSxZQUFDQSxZQUFZQSxFQUFFQSxRQUFRQSxFQUFFQSxTQUFTQSxFQUFFQSxhQUFhQSxFQUFFQSxlQUFlQSxDQUFDQSxDQUFDQTtRQUU5R0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7SUFDYkEsQ0FBQ0E7SUFqSEROOzs7T0FHR0E7SUFDV0EsOEJBQVFBLEdBQVVBLFVBQVVBLENBQUNBO0lBRTNDQTs7O09BR0dBO0lBQ1dBLHlCQUFHQSxHQUFVQSxLQUFLQSxDQUFDQTtJQXdHbENBLDRCQUFDQTtBQUFEQSxDQXBIQSxBQW9IQ0EsRUFwSG1DLHNCQUFzQixFQW9IekQ7QUFFRCxBQUErQixpQkFBdEIscUJBQXFCLENBQUMiLCJmaWxlIjoibWF0ZXJpYWxzL21ldGhvZHMvRGlmZnVzZUxpZ2h0TWFwTWV0aG9kLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9yb2JiYXRlbWFuL1dlYnN0b3JtUHJvamVjdHMvYXdheWpzLXJlbmRlcmVyZ2wvIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFRleHR1cmUyREJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL3RleHR1cmVzL1RleHR1cmUyREJhc2VcIik7XG5cbmltcG9ydCBTdGFnZVx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2NvcmUvYmFzZS9TdGFnZVwiKTtcbmltcG9ydCBJQ29udGV4dFN0YWdlR0xcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2NvcmUvc3RhZ2VnbC9JQ29udGV4dFN0YWdlR0xcIik7XG5pbXBvcnQgTWV0aG9kVk9cdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9tYXRlcmlhbHMvY29tcGlsYXRpb24vTWV0aG9kVk9cIik7XG5pbXBvcnQgU2hhZGVyTGlnaHRpbmdPYmplY3RcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9tYXRlcmlhbHMvY29tcGlsYXRpb24vU2hhZGVyTGlnaHRpbmdPYmplY3RcIik7XG5pbXBvcnQgU2hhZGVyUmVnaXN0ZXJDYWNoZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL21hdGVyaWFscy9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckNhY2hlXCIpO1xuaW1wb3J0IFNoYWRlclJlZ2lzdGVyRGF0YVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL21hdGVyaWFscy9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckRhdGFcIik7XG5pbXBvcnQgU2hhZGVyUmVnaXN0ZXJFbGVtZW50XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL21hdGVyaWFscy9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckVsZW1lbnRcIik7XG5pbXBvcnQgRGlmZnVzZUJhc2ljTWV0aG9kXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvbWF0ZXJpYWxzL21ldGhvZHMvRGlmZnVzZUJhc2ljTWV0aG9kXCIpO1xuaW1wb3J0IFNoYWRlckNvbXBpbGVySGVscGVyXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvbWF0ZXJpYWxzL3V0aWxzL1NoYWRlckNvbXBpbGVySGVscGVyXCIpO1xuXG5pbXBvcnQgRGlmZnVzZUNvbXBvc2l0ZU1ldGhvZFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvbWV0aG9kcy9EaWZmdXNlQ29tcG9zaXRlTWV0aG9kXCIpO1xuXG4vKipcbiAqIERpZmZ1c2VMaWdodE1hcE1ldGhvZCBwcm92aWRlcyBhIGRpZmZ1c2Ugc2hhZGluZyBtZXRob2QgdGhhdCB1c2VzIGEgbGlnaHQgbWFwIHRvIG1vZHVsYXRlIHRoZSBjYWxjdWxhdGVkIGRpZmZ1c2VcbiAqIGxpZ2h0aW5nLiBJdCBpcyBkaWZmZXJlbnQgZnJvbSBFZmZlY3RMaWdodE1hcE1ldGhvZCBpbiB0aGF0IHRoZSBsYXR0ZXIgbW9kdWxhdGVzIHRoZSBlbnRpcmUgY2FsY3VsYXRlZCBwaXhlbCBjb2xvciwgcmF0aGVyXG4gKiB0aGFuIG9ubHkgdGhlIGRpZmZ1c2UgbGlnaHRpbmcgdmFsdWUuXG4gKi9cbmNsYXNzIERpZmZ1c2VMaWdodE1hcE1ldGhvZCBleHRlbmRzIERpZmZ1c2VDb21wb3NpdGVNZXRob2Rcbntcblx0LyoqXG5cdCAqIEluZGljYXRlcyB0aGUgbGlnaHQgbWFwIHNob3VsZCBiZSBtdWx0aXBsaWVkIHdpdGggdGhlIGNhbGN1bGF0ZWQgc2hhZGluZyByZXN1bHQuXG5cdCAqIFRoaXMgY2FuIGJlIHVzZWQgdG8gYWRkIHByZS1jYWxjdWxhdGVkIHNoYWRvd3Mgb3Igb2NjbHVzaW9uLlxuXHQgKi9cblx0cHVibGljIHN0YXRpYyBNVUxUSVBMWTpzdHJpbmcgPSBcIm11bHRpcGx5XCI7XG5cblx0LyoqXG5cdCAqIEluZGljYXRlcyB0aGUgbGlnaHQgbWFwIHNob3VsZCBiZSBhZGRlZCBpbnRvIHRoZSBjYWxjdWxhdGVkIHNoYWRpbmcgcmVzdWx0LlxuXHQgKiBUaGlzIGNhbiBiZSB1c2VkIHRvIGFkZCBwcmUtY2FsY3VsYXRlZCBsaWdodGluZyBvciBnbG9iYWwgaWxsdW1pbmF0aW9uLlxuXHQgKi9cblx0cHVibGljIHN0YXRpYyBBREQ6c3RyaW5nID0gXCJhZGRcIjtcblxuXHRwcml2YXRlIF9saWdodE1hcFRleHR1cmU6VGV4dHVyZTJEQmFzZTtcblx0cHJpdmF0ZSBfYmxlbmRNb2RlOnN0cmluZztcblx0cHJpdmF0ZSBfdXNlU2Vjb25kYXJ5VVY6Ym9vbGVhbjtcblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyBEaWZmdXNlTGlnaHRNYXBNZXRob2QgbWV0aG9kLlxuXHQgKlxuXHQgKiBAcGFyYW0gbGlnaHRNYXAgVGhlIHRleHR1cmUgY29udGFpbmluZyB0aGUgbGlnaHQgbWFwLlxuXHQgKiBAcGFyYW0gYmxlbmRNb2RlIFRoZSBibGVuZCBtb2RlIHdpdGggd2hpY2ggdGhlIGxpZ2h0IG1hcCBzaG91bGQgYmUgYXBwbGllZCB0byB0aGUgbGlnaHRpbmcgcmVzdWx0LlxuXHQgKiBAcGFyYW0gdXNlU2Vjb25kYXJ5VVYgSW5kaWNhdGVzIHdoZXRoZXIgdGhlIHNlY29uZGFyeSBVViBzZXQgc2hvdWxkIGJlIHVzZWQgdG8gbWFwIHRoZSBsaWdodCBtYXAuXG5cdCAqIEBwYXJhbSBiYXNlTWV0aG9kIFRoZSBkaWZmdXNlIG1ldGhvZCB1c2VkIHRvIGNhbGN1bGF0ZSB0aGUgcmVndWxhciBkaWZmdXNlLWJhc2VkIGxpZ2h0aW5nLlxuXHQgKi9cblx0Y29uc3RydWN0b3IobGlnaHRNYXA6VGV4dHVyZTJEQmFzZSwgYmxlbmRNb2RlOnN0cmluZyA9IFwibXVsdGlwbHlcIiwgdXNlU2Vjb25kYXJ5VVY6Ym9vbGVhbiA9IGZhbHNlLCBiYXNlTWV0aG9kOkRpZmZ1c2VCYXNpY01ldGhvZCA9IG51bGwpXG5cdHtcblx0XHRzdXBlcihudWxsLCBiYXNlTWV0aG9kKTtcblxuXHRcdHRoaXMuX3VzZVNlY29uZGFyeVVWID0gdXNlU2Vjb25kYXJ5VVY7XG5cdFx0dGhpcy5fbGlnaHRNYXBUZXh0dXJlID0gbGlnaHRNYXA7XG5cdFx0dGhpcy5ibGVuZE1vZGUgPSBibGVuZE1vZGU7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBpSW5pdFZPKHNoYWRlck9iamVjdDpTaGFkZXJMaWdodGluZ09iamVjdCwgbWV0aG9kVk86TWV0aG9kVk8pXG5cdHtcblx0XHRtZXRob2RWTy5uZWVkc1NlY29uZGFyeVVWID0gdGhpcy5fdXNlU2Vjb25kYXJ5VVY7XG5cdFx0bWV0aG9kVk8ubmVlZHNVViA9ICF0aGlzLl91c2VTZWNvbmRhcnlVVjtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgYmxlbmQgbW9kZSB3aXRoIHdoaWNoIHRoZSBsaWdodCBtYXAgc2hvdWxkIGJlIGFwcGxpZWQgdG8gdGhlIGxpZ2h0aW5nIHJlc3VsdC5cblx0ICpcblx0ICogQHNlZSBEaWZmdXNlTGlnaHRNYXBNZXRob2QuQUREXG5cdCAqIEBzZWUgRGlmZnVzZUxpZ2h0TWFwTWV0aG9kLk1VTFRJUExZXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGJsZW5kTW9kZSgpOnN0cmluZ1xuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX2JsZW5kTW9kZTtcblx0fVxuXG5cdHB1YmxpYyBzZXQgYmxlbmRNb2RlKHZhbHVlOnN0cmluZylcblx0e1xuXHRcdGlmICh2YWx1ZSAhPSBEaWZmdXNlTGlnaHRNYXBNZXRob2QuQUREICYmIHZhbHVlICE9IERpZmZ1c2VMaWdodE1hcE1ldGhvZC5NVUxUSVBMWSlcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIlVua25vd24gYmxlbmRtb2RlIVwiKTtcblxuXHRcdGlmICh0aGlzLl9ibGVuZE1vZGUgPT0gdmFsdWUpXG5cdFx0XHRyZXR1cm47XG5cblx0XHR0aGlzLl9ibGVuZE1vZGUgPSB2YWx1ZTtcblxuXHRcdHRoaXMuaUludmFsaWRhdGVTaGFkZXJQcm9ncmFtKCk7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIHRleHR1cmUgY29udGFpbmluZyB0aGUgbGlnaHQgbWFwIGRhdGEuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGxpZ2h0TWFwVGV4dHVyZSgpOlRleHR1cmUyREJhc2Vcblx0e1xuXHRcdHJldHVybiB0aGlzLl9saWdodE1hcFRleHR1cmU7XG5cdH1cblxuXHRwdWJsaWMgc2V0IGxpZ2h0TWFwVGV4dHVyZSh2YWx1ZTpUZXh0dXJlMkRCYXNlKVxuXHR7XG5cdFx0dGhpcy5fbGlnaHRNYXBUZXh0dXJlID0gdmFsdWU7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBpQWN0aXZhdGUoc2hhZGVyT2JqZWN0OlNoYWRlckxpZ2h0aW5nT2JqZWN0LCBtZXRob2RWTzpNZXRob2RWTywgc3RhZ2U6U3RhZ2UpXG5cdHtcblx0XHQoPElDb250ZXh0U3RhZ2VHTD4gc3RhZ2UuY29udGV4dCkuYWN0aXZhdGVUZXh0dXJlKG1ldGhvZFZPLnNlY29uZGFyeVRleHR1cmVzSW5kZXgsIHRoaXMuX2xpZ2h0TWFwVGV4dHVyZSk7XG5cblx0XHRzdXBlci5pQWN0aXZhdGUoc2hhZGVyT2JqZWN0LCBtZXRob2RWTywgc3RhZ2UpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgaUdldEZyYWdtZW50UG9zdExpZ2h0aW5nQ29kZShzaGFkZXJPYmplY3Q6U2hhZGVyTGlnaHRpbmdPYmplY3QsIG1ldGhvZFZPOk1ldGhvZFZPLCB0YXJnZXRSZWc6U2hhZGVyUmVnaXN0ZXJFbGVtZW50LCByZWdpc3RlckNhY2hlOlNoYWRlclJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVyczpTaGFkZXJSZWdpc3RlckRhdGEpOnN0cmluZ1xuXHR7XG5cdFx0dmFyIGNvZGU6c3RyaW5nO1xuXHRcdHZhciBsaWdodE1hcFJlZzpTaGFkZXJSZWdpc3RlckVsZW1lbnQgPSByZWdpc3RlckNhY2hlLmdldEZyZWVUZXh0dXJlUmVnKCk7XG5cdFx0dmFyIHRlbXA6U2hhZGVyUmVnaXN0ZXJFbGVtZW50ID0gcmVnaXN0ZXJDYWNoZS5nZXRGcmVlRnJhZ21lbnRWZWN0b3JUZW1wKCk7XG5cdFx0bWV0aG9kVk8uc2Vjb25kYXJ5VGV4dHVyZXNJbmRleCA9IGxpZ2h0TWFwUmVnLmluZGV4O1xuXG5cdFx0Y29kZSA9IFNoYWRlckNvbXBpbGVySGVscGVyLmdldFRleDJEU2FtcGxlQ29kZSh0ZW1wLCBzaGFyZWRSZWdpc3RlcnMsIGxpZ2h0TWFwUmVnLCB0aGlzLl9saWdodE1hcFRleHR1cmUsIHNoYWRlck9iamVjdC51c2VTbW9vdGhUZXh0dXJlcywgc2hhZGVyT2JqZWN0LnJlcGVhdFRleHR1cmVzLCBzaGFkZXJPYmplY3QudXNlTWlwbWFwcGluZywgc2hhcmVkUmVnaXN0ZXJzLnNlY29uZGFyeVVWVmFyeWluZyk7XG5cblx0XHRzd2l0Y2ggKHRoaXMuX2JsZW5kTW9kZSkge1xuXHRcdFx0Y2FzZSBEaWZmdXNlTGlnaHRNYXBNZXRob2QuTVVMVElQTFk6XG5cdFx0XHRcdGNvZGUgKz0gXCJtdWwgXCIgKyB0aGlzLl9wVG90YWxMaWdodENvbG9yUmVnICsgXCIsIFwiICsgdGhpcy5fcFRvdGFsTGlnaHRDb2xvclJlZyArIFwiLCBcIiArIHRlbXAgKyBcIlxcblwiO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgRGlmZnVzZUxpZ2h0TWFwTWV0aG9kLkFERDpcblx0XHRcdFx0Y29kZSArPSBcImFkZCBcIiArIHRoaXMuX3BUb3RhbExpZ2h0Q29sb3JSZWcgKyBcIiwgXCIgKyB0aGlzLl9wVG90YWxMaWdodENvbG9yUmVnICsgXCIsIFwiICsgdGVtcCArIFwiXFxuXCI7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdH1cblxuXHRcdGNvZGUgKz0gc3VwZXIuaUdldEZyYWdtZW50UG9zdExpZ2h0aW5nQ29kZShzaGFkZXJPYmplY3QsIG1ldGhvZFZPLCB0YXJnZXRSZWcsIHJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVycyk7XG5cblx0XHRyZXR1cm4gY29kZTtcblx0fVxufVxuXG5leHBvcnQgPSBEaWZmdXNlTGlnaHRNYXBNZXRob2Q7Il19