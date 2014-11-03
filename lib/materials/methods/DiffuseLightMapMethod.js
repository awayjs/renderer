var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DiffuseCompositeMethod = require("awayjs-renderergl/lib/materials/methods/DiffuseCompositeMethod");
var ShaderCompilerHelper = require("awayjs-renderergl/lib/materials/utils/ShaderCompilerHelper");
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
        stage.activateTexture(methodVO.secondaryTexturesIndex, this._lightMapTexture);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvbWV0aG9kcy9kaWZmdXNlbGlnaHRtYXBtZXRob2QudHMiXSwibmFtZXMiOlsiRGlmZnVzZUxpZ2h0TWFwTWV0aG9kIiwiRGlmZnVzZUxpZ2h0TWFwTWV0aG9kLmNvbnN0cnVjdG9yIiwiRGlmZnVzZUxpZ2h0TWFwTWV0aG9kLmlJbml0Vk8iLCJEaWZmdXNlTGlnaHRNYXBNZXRob2QuYmxlbmRNb2RlIiwiRGlmZnVzZUxpZ2h0TWFwTWV0aG9kLmxpZ2h0TWFwVGV4dHVyZSIsIkRpZmZ1c2VMaWdodE1hcE1ldGhvZC5pQWN0aXZhdGUiLCJEaWZmdXNlTGlnaHRNYXBNZXRob2QuaUdldEZyYWdtZW50UG9zdExpZ2h0aW5nQ29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBVUEsSUFBTyxzQkFBc0IsV0FBYSxnRUFBZ0UsQ0FBQyxDQUFDO0FBQzVHLElBQU8sb0JBQW9CLFdBQWMsNERBQTRELENBQUMsQ0FBQztBQUV2RyxBQUtBOzs7O0dBREc7SUFDRyxxQkFBcUI7SUFBU0EsVUFBOUJBLHFCQUFxQkEsVUFBK0JBO0lBa0J6REE7Ozs7Ozs7T0FPR0E7SUFDSEEsU0ExQktBLHFCQUFxQkEsQ0EwQmRBLFFBQXNCQSxFQUFFQSxTQUE2QkEsRUFBRUEsY0FBOEJBLEVBQUVBLFVBQW9DQTtRQUFuR0MseUJBQTZCQSxHQUE3QkEsc0JBQTZCQTtRQUFFQSw4QkFBOEJBLEdBQTlCQSxzQkFBOEJBO1FBQUVBLDBCQUFvQ0EsR0FBcENBLGlCQUFvQ0E7UUFFdElBLGtCQUFNQSxJQUFJQSxFQUFFQSxVQUFVQSxDQUFDQSxDQUFDQTtRQUV4QkEsSUFBSUEsQ0FBQ0EsZUFBZUEsR0FBR0EsY0FBY0EsQ0FBQ0E7UUFDdENBLElBQUlBLENBQUNBLGdCQUFnQkEsR0FBR0EsUUFBUUEsQ0FBQ0E7UUFDakNBLElBQUlBLENBQUNBLFNBQVNBLEdBQUdBLFNBQVNBLENBQUNBO0lBQzVCQSxDQUFDQTtJQUVERDs7T0FFR0E7SUFDSUEsdUNBQU9BLEdBQWRBLFVBQWVBLFlBQWlDQSxFQUFFQSxRQUFpQkE7UUFFbEVFLFFBQVFBLENBQUNBLGdCQUFnQkEsR0FBR0EsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0E7UUFDakRBLFFBQVFBLENBQUNBLE9BQU9BLEdBQUdBLENBQUNBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBO0lBQzFDQSxDQUFDQTtJQVFERixzQkFBV0EsNENBQVNBO1FBTnBCQTs7Ozs7V0FLR0E7YUFDSEE7WUFFQ0csTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0E7UUFDeEJBLENBQUNBO2FBRURILFVBQXFCQSxLQUFZQTtZQUVoQ0csRUFBRUEsQ0FBQ0EsQ0FBQ0EsS0FBS0EsSUFBSUEscUJBQXFCQSxDQUFDQSxHQUFHQSxJQUFJQSxLQUFLQSxJQUFJQSxxQkFBcUJBLENBQUNBLFFBQVFBLENBQUNBO2dCQUNqRkEsTUFBTUEsSUFBSUEsS0FBS0EsQ0FBQ0Esb0JBQW9CQSxDQUFDQSxDQUFDQTtZQUV2Q0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsVUFBVUEsSUFBSUEsS0FBS0EsQ0FBQ0E7Z0JBQzVCQSxNQUFNQSxDQUFDQTtZQUVSQSxJQUFJQSxDQUFDQSxVQUFVQSxHQUFHQSxLQUFLQSxDQUFDQTtZQUV4QkEsSUFBSUEsQ0FBQ0Esd0JBQXdCQSxFQUFFQSxDQUFDQTtRQUNqQ0EsQ0FBQ0E7OztPQWJBSDtJQWtCREEsc0JBQVdBLGtEQUFlQTtRQUgxQkE7O1dBRUdBO2FBQ0hBO1lBRUNJLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLGdCQUFnQkEsQ0FBQ0E7UUFDOUJBLENBQUNBO2FBRURKLFVBQTJCQSxLQUFtQkE7WUFFN0NJLElBQUlBLENBQUNBLGdCQUFnQkEsR0FBR0EsS0FBS0EsQ0FBQ0E7UUFDL0JBLENBQUNBOzs7T0FMQUo7SUFPREE7O09BRUdBO0lBQ0lBLHlDQUFTQSxHQUFoQkEsVUFBaUJBLFlBQWlDQSxFQUFFQSxRQUFpQkEsRUFBRUEsS0FBV0E7UUFFakZLLEtBQUtBLENBQUNBLGVBQWVBLENBQUNBLFFBQVFBLENBQUNBLHNCQUFzQkEsRUFBRUEsSUFBSUEsQ0FBQ0EsZ0JBQWdCQSxDQUFDQSxDQUFDQTtRQUU5RUEsZ0JBQUtBLENBQUNBLFNBQVNBLFlBQUNBLFlBQVlBLEVBQUVBLFFBQVFBLEVBQUVBLEtBQUtBLENBQUNBLENBQUNBO0lBQ2hEQSxDQUFDQTtJQUVETDs7T0FFR0E7SUFDSUEsNERBQTRCQSxHQUFuQ0EsVUFBb0NBLFlBQWlDQSxFQUFFQSxRQUFpQkEsRUFBRUEsU0FBK0JBLEVBQUVBLGFBQWlDQSxFQUFFQSxlQUFrQ0E7UUFFL0xNLElBQUlBLElBQVdBLENBQUNBO1FBQ2hCQSxJQUFJQSxXQUFXQSxHQUF5QkEsYUFBYUEsQ0FBQ0EsaUJBQWlCQSxFQUFFQSxDQUFDQTtRQUMxRUEsSUFBSUEsSUFBSUEsR0FBeUJBLGFBQWFBLENBQUNBLHlCQUF5QkEsRUFBRUEsQ0FBQ0E7UUFDM0VBLFFBQVFBLENBQUNBLHNCQUFzQkEsR0FBR0EsV0FBV0EsQ0FBQ0EsS0FBS0EsQ0FBQ0E7UUFFcERBLElBQUlBLEdBQUdBLG9CQUFvQkEsQ0FBQ0Esa0JBQWtCQSxDQUFDQSxJQUFJQSxFQUFFQSxlQUFlQSxFQUFFQSxXQUFXQSxFQUFFQSxJQUFJQSxDQUFDQSxnQkFBZ0JBLEVBQUVBLFlBQVlBLENBQUNBLGlCQUFpQkEsRUFBRUEsWUFBWUEsQ0FBQ0EsY0FBY0EsRUFBRUEsWUFBWUEsQ0FBQ0EsYUFBYUEsRUFBRUEsZUFBZUEsQ0FBQ0Esa0JBQWtCQSxDQUFDQSxDQUFDQTtRQUV2T0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDekJBLEtBQUtBLHFCQUFxQkEsQ0FBQ0EsUUFBUUE7Z0JBQ2xDQSxJQUFJQSxJQUFJQSxNQUFNQSxHQUFHQSxJQUFJQSxDQUFDQSxvQkFBb0JBLEdBQUdBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLG9CQUFvQkEsR0FBR0EsSUFBSUEsR0FBR0EsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0E7Z0JBQ25HQSxLQUFLQSxDQUFDQTtZQUNQQSxLQUFLQSxxQkFBcUJBLENBQUNBLEdBQUdBO2dCQUM3QkEsSUFBSUEsSUFBSUEsTUFBTUEsR0FBR0EsSUFBSUEsQ0FBQ0Esb0JBQW9CQSxHQUFHQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQSxvQkFBb0JBLEdBQUdBLElBQUlBLEdBQUdBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBO2dCQUNuR0EsS0FBS0EsQ0FBQ0E7UUFDUkEsQ0FBQ0E7UUFFREEsSUFBSUEsSUFBSUEsZ0JBQUtBLENBQUNBLDRCQUE0QkEsWUFBQ0EsWUFBWUEsRUFBRUEsUUFBUUEsRUFBRUEsU0FBU0EsRUFBRUEsYUFBYUEsRUFBRUEsZUFBZUEsQ0FBQ0EsQ0FBQ0E7UUFFOUdBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBO0lBQ2JBLENBQUNBO0lBakhETjs7O09BR0dBO0lBQ1dBLDhCQUFRQSxHQUFVQSxVQUFVQSxDQUFDQTtJQUUzQ0E7OztPQUdHQTtJQUNXQSx5QkFBR0EsR0FBVUEsS0FBS0EsQ0FBQ0E7SUF3R2xDQSw0QkFBQ0E7QUFBREEsQ0FwSEEsQUFvSENBLEVBcEhtQyxzQkFBc0IsRUFvSHpEO0FBRUQsQUFBK0IsaUJBQXRCLHFCQUFxQixDQUFDIiwiZmlsZSI6Im1hdGVyaWFscy9tZXRob2RzL0RpZmZ1c2VMaWdodE1hcE1ldGhvZC5qcyIsInNvdXJjZVJvb3QiOiIuLi8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVGV4dHVyZTJEQmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvdGV4dHVyZXMvVGV4dHVyZTJEQmFzZVwiKTtcblxuaW1wb3J0IFN0YWdlXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvYmFzZS9TdGFnZVwiKTtcblxuaW1wb3J0IE1ldGhvZFZPXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvbWF0ZXJpYWxzL2NvbXBpbGF0aW9uL01ldGhvZFZPXCIpO1xuaW1wb3J0IFNoYWRlckxpZ2h0aW5nT2JqZWN0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvbWF0ZXJpYWxzL2NvbXBpbGF0aW9uL1NoYWRlckxpZ2h0aW5nT2JqZWN0XCIpO1xuaW1wb3J0IFNoYWRlclJlZ2lzdGVyQ2FjaGVcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJDYWNoZVwiKTtcbmltcG9ydCBTaGFkZXJSZWdpc3RlckRhdGFcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJEYXRhXCIpO1xuaW1wb3J0IFNoYWRlclJlZ2lzdGVyRWxlbWVudFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJFbGVtZW50XCIpO1xuaW1wb3J0IERpZmZ1c2VCYXNpY01ldGhvZFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL21hdGVyaWFscy9tZXRob2RzL0RpZmZ1c2VCYXNpY01ldGhvZFwiKTtcbmltcG9ydCBEaWZmdXNlQ29tcG9zaXRlTWV0aG9kXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL21hdGVyaWFscy9tZXRob2RzL0RpZmZ1c2VDb21wb3NpdGVNZXRob2RcIik7XG5pbXBvcnQgU2hhZGVyQ29tcGlsZXJIZWxwZXJcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvdXRpbHMvU2hhZGVyQ29tcGlsZXJIZWxwZXJcIik7XG5cbi8qKlxuICogRGlmZnVzZUxpZ2h0TWFwTWV0aG9kIHByb3ZpZGVzIGEgZGlmZnVzZSBzaGFkaW5nIG1ldGhvZCB0aGF0IHVzZXMgYSBsaWdodCBtYXAgdG8gbW9kdWxhdGUgdGhlIGNhbGN1bGF0ZWQgZGlmZnVzZVxuICogbGlnaHRpbmcuIEl0IGlzIGRpZmZlcmVudCBmcm9tIEVmZmVjdExpZ2h0TWFwTWV0aG9kIGluIHRoYXQgdGhlIGxhdHRlciBtb2R1bGF0ZXMgdGhlIGVudGlyZSBjYWxjdWxhdGVkIHBpeGVsIGNvbG9yLCByYXRoZXJcbiAqIHRoYW4gb25seSB0aGUgZGlmZnVzZSBsaWdodGluZyB2YWx1ZS5cbiAqL1xuY2xhc3MgRGlmZnVzZUxpZ2h0TWFwTWV0aG9kIGV4dGVuZHMgRGlmZnVzZUNvbXBvc2l0ZU1ldGhvZFxue1xuXHQvKipcblx0ICogSW5kaWNhdGVzIHRoZSBsaWdodCBtYXAgc2hvdWxkIGJlIG11bHRpcGxpZWQgd2l0aCB0aGUgY2FsY3VsYXRlZCBzaGFkaW5nIHJlc3VsdC5cblx0ICogVGhpcyBjYW4gYmUgdXNlZCB0byBhZGQgcHJlLWNhbGN1bGF0ZWQgc2hhZG93cyBvciBvY2NsdXNpb24uXG5cdCAqL1xuXHRwdWJsaWMgc3RhdGljIE1VTFRJUExZOnN0cmluZyA9IFwibXVsdGlwbHlcIjtcblxuXHQvKipcblx0ICogSW5kaWNhdGVzIHRoZSBsaWdodCBtYXAgc2hvdWxkIGJlIGFkZGVkIGludG8gdGhlIGNhbGN1bGF0ZWQgc2hhZGluZyByZXN1bHQuXG5cdCAqIFRoaXMgY2FuIGJlIHVzZWQgdG8gYWRkIHByZS1jYWxjdWxhdGVkIGxpZ2h0aW5nIG9yIGdsb2JhbCBpbGx1bWluYXRpb24uXG5cdCAqL1xuXHRwdWJsaWMgc3RhdGljIEFERDpzdHJpbmcgPSBcImFkZFwiO1xuXG5cdHByaXZhdGUgX2xpZ2h0TWFwVGV4dHVyZTpUZXh0dXJlMkRCYXNlO1xuXHRwcml2YXRlIF9ibGVuZE1vZGU6c3RyaW5nO1xuXHRwcml2YXRlIF91c2VTZWNvbmRhcnlVVjpib29sZWFuO1xuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IERpZmZ1c2VMaWdodE1hcE1ldGhvZCBtZXRob2QuXG5cdCAqXG5cdCAqIEBwYXJhbSBsaWdodE1hcCBUaGUgdGV4dHVyZSBjb250YWluaW5nIHRoZSBsaWdodCBtYXAuXG5cdCAqIEBwYXJhbSBibGVuZE1vZGUgVGhlIGJsZW5kIG1vZGUgd2l0aCB3aGljaCB0aGUgbGlnaHQgbWFwIHNob3VsZCBiZSBhcHBsaWVkIHRvIHRoZSBsaWdodGluZyByZXN1bHQuXG5cdCAqIEBwYXJhbSB1c2VTZWNvbmRhcnlVViBJbmRpY2F0ZXMgd2hldGhlciB0aGUgc2Vjb25kYXJ5IFVWIHNldCBzaG91bGQgYmUgdXNlZCB0byBtYXAgdGhlIGxpZ2h0IG1hcC5cblx0ICogQHBhcmFtIGJhc2VNZXRob2QgVGhlIGRpZmZ1c2UgbWV0aG9kIHVzZWQgdG8gY2FsY3VsYXRlIHRoZSByZWd1bGFyIGRpZmZ1c2UtYmFzZWQgbGlnaHRpbmcuXG5cdCAqL1xuXHRjb25zdHJ1Y3RvcihsaWdodE1hcDpUZXh0dXJlMkRCYXNlLCBibGVuZE1vZGU6c3RyaW5nID0gXCJtdWx0aXBseVwiLCB1c2VTZWNvbmRhcnlVVjpib29sZWFuID0gZmFsc2UsIGJhc2VNZXRob2Q6RGlmZnVzZUJhc2ljTWV0aG9kID0gbnVsbClcblx0e1xuXHRcdHN1cGVyKG51bGwsIGJhc2VNZXRob2QpO1xuXG5cdFx0dGhpcy5fdXNlU2Vjb25kYXJ5VVYgPSB1c2VTZWNvbmRhcnlVVjtcblx0XHR0aGlzLl9saWdodE1hcFRleHR1cmUgPSBsaWdodE1hcDtcblx0XHR0aGlzLmJsZW5kTW9kZSA9IGJsZW5kTW9kZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGlJbml0Vk8oc2hhZGVyT2JqZWN0OlNoYWRlckxpZ2h0aW5nT2JqZWN0LCBtZXRob2RWTzpNZXRob2RWTylcblx0e1xuXHRcdG1ldGhvZFZPLm5lZWRzU2Vjb25kYXJ5VVYgPSB0aGlzLl91c2VTZWNvbmRhcnlVVjtcblx0XHRtZXRob2RWTy5uZWVkc1VWID0gIXRoaXMuX3VzZVNlY29uZGFyeVVWO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBibGVuZCBtb2RlIHdpdGggd2hpY2ggdGhlIGxpZ2h0IG1hcCBzaG91bGQgYmUgYXBwbGllZCB0byB0aGUgbGlnaHRpbmcgcmVzdWx0LlxuXHQgKlxuXHQgKiBAc2VlIERpZmZ1c2VMaWdodE1hcE1ldGhvZC5BRERcblx0ICogQHNlZSBEaWZmdXNlTGlnaHRNYXBNZXRob2QuTVVMVElQTFlcblx0ICovXG5cdHB1YmxpYyBnZXQgYmxlbmRNb2RlKCk6c3RyaW5nXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fYmxlbmRNb2RlO1xuXHR9XG5cblx0cHVibGljIHNldCBibGVuZE1vZGUodmFsdWU6c3RyaW5nKVxuXHR7XG5cdFx0aWYgKHZhbHVlICE9IERpZmZ1c2VMaWdodE1hcE1ldGhvZC5BREQgJiYgdmFsdWUgIT0gRGlmZnVzZUxpZ2h0TWFwTWV0aG9kLk1VTFRJUExZKVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiVW5rbm93biBibGVuZG1vZGUhXCIpO1xuXG5cdFx0aWYgKHRoaXMuX2JsZW5kTW9kZSA9PSB2YWx1ZSlcblx0XHRcdHJldHVybjtcblxuXHRcdHRoaXMuX2JsZW5kTW9kZSA9IHZhbHVlO1xuXG5cdFx0dGhpcy5pSW52YWxpZGF0ZVNoYWRlclByb2dyYW0oKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgdGV4dHVyZSBjb250YWluaW5nIHRoZSBsaWdodCBtYXAgZGF0YS5cblx0ICovXG5cdHB1YmxpYyBnZXQgbGlnaHRNYXBUZXh0dXJlKCk6VGV4dHVyZTJEQmFzZVxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX2xpZ2h0TWFwVGV4dHVyZTtcblx0fVxuXG5cdHB1YmxpYyBzZXQgbGlnaHRNYXBUZXh0dXJlKHZhbHVlOlRleHR1cmUyREJhc2UpXG5cdHtcblx0XHR0aGlzLl9saWdodE1hcFRleHR1cmUgPSB2YWx1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGlBY3RpdmF0ZShzaGFkZXJPYmplY3Q6U2hhZGVyTGlnaHRpbmdPYmplY3QsIG1ldGhvZFZPOk1ldGhvZFZPLCBzdGFnZTpTdGFnZSlcblx0e1xuXHRcdHN0YWdlLmFjdGl2YXRlVGV4dHVyZShtZXRob2RWTy5zZWNvbmRhcnlUZXh0dXJlc0luZGV4LCB0aGlzLl9saWdodE1hcFRleHR1cmUpO1xuXG5cdFx0c3VwZXIuaUFjdGl2YXRlKHNoYWRlck9iamVjdCwgbWV0aG9kVk8sIHN0YWdlKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGlHZXRGcmFnbWVudFBvc3RMaWdodGluZ0NvZGUoc2hhZGVyT2JqZWN0OlNoYWRlckxpZ2h0aW5nT2JqZWN0LCBtZXRob2RWTzpNZXRob2RWTywgdGFyZ2V0UmVnOlNoYWRlclJlZ2lzdGVyRWxlbWVudCwgcmVnaXN0ZXJDYWNoZTpTaGFkZXJSZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnM6U2hhZGVyUmVnaXN0ZXJEYXRhKTpzdHJpbmdcblx0e1xuXHRcdHZhciBjb2RlOnN0cmluZztcblx0XHR2YXIgbGlnaHRNYXBSZWc6U2hhZGVyUmVnaXN0ZXJFbGVtZW50ID0gcmVnaXN0ZXJDYWNoZS5nZXRGcmVlVGV4dHVyZVJlZygpO1xuXHRcdHZhciB0ZW1wOlNoYWRlclJlZ2lzdGVyRWxlbWVudCA9IHJlZ2lzdGVyQ2FjaGUuZ2V0RnJlZUZyYWdtZW50VmVjdG9yVGVtcCgpO1xuXHRcdG1ldGhvZFZPLnNlY29uZGFyeVRleHR1cmVzSW5kZXggPSBsaWdodE1hcFJlZy5pbmRleDtcblxuXHRcdGNvZGUgPSBTaGFkZXJDb21waWxlckhlbHBlci5nZXRUZXgyRFNhbXBsZUNvZGUodGVtcCwgc2hhcmVkUmVnaXN0ZXJzLCBsaWdodE1hcFJlZywgdGhpcy5fbGlnaHRNYXBUZXh0dXJlLCBzaGFkZXJPYmplY3QudXNlU21vb3RoVGV4dHVyZXMsIHNoYWRlck9iamVjdC5yZXBlYXRUZXh0dXJlcywgc2hhZGVyT2JqZWN0LnVzZU1pcG1hcHBpbmcsIHNoYXJlZFJlZ2lzdGVycy5zZWNvbmRhcnlVVlZhcnlpbmcpO1xuXG5cdFx0c3dpdGNoICh0aGlzLl9ibGVuZE1vZGUpIHtcblx0XHRcdGNhc2UgRGlmZnVzZUxpZ2h0TWFwTWV0aG9kLk1VTFRJUExZOlxuXHRcdFx0XHRjb2RlICs9IFwibXVsIFwiICsgdGhpcy5fcFRvdGFsTGlnaHRDb2xvclJlZyArIFwiLCBcIiArIHRoaXMuX3BUb3RhbExpZ2h0Q29sb3JSZWcgKyBcIiwgXCIgKyB0ZW1wICsgXCJcXG5cIjtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIERpZmZ1c2VMaWdodE1hcE1ldGhvZC5BREQ6XG5cdFx0XHRcdGNvZGUgKz0gXCJhZGQgXCIgKyB0aGlzLl9wVG90YWxMaWdodENvbG9yUmVnICsgXCIsIFwiICsgdGhpcy5fcFRvdGFsTGlnaHRDb2xvclJlZyArIFwiLCBcIiArIHRlbXAgKyBcIlxcblwiO1xuXHRcdFx0XHRicmVhaztcblx0XHR9XG5cblx0XHRjb2RlICs9IHN1cGVyLmlHZXRGcmFnbWVudFBvc3RMaWdodGluZ0NvZGUoc2hhZGVyT2JqZWN0LCBtZXRob2RWTywgdGFyZ2V0UmVnLCByZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnMpO1xuXG5cdFx0cmV0dXJuIGNvZGU7XG5cdH1cbn1cblxuZXhwb3J0ID0gRGlmZnVzZUxpZ2h0TWFwTWV0aG9kOyJdfQ==