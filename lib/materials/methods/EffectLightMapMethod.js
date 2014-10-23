var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var EffectMethodBase = require("awayjs-stagegl/lib/materials/methods/EffectMethodBase");
var ShaderCompilerHelper = require("awayjs-stagegl/lib/materials/utils/ShaderCompilerHelper");
/**
 * EffectLightMapMethod provides a method that allows applying a light map texture to the calculated pixel colour.
 * It is different from DiffuseLightMapMethod in that the latter only modulates the diffuse shading value rather
 * than the whole pixel colour.
 */
var EffectLightMapMethod = (function (_super) {
    __extends(EffectLightMapMethod, _super);
    /**
     * Creates a new EffectLightMapMethod object.
     *
     * @param texture The texture containing the light map.
     * @param blendMode The blend mode with which the light map should be applied to the lighting result.
     * @param useSecondaryUV Indicates whether the secondary UV set should be used to map the light map.
     */
    function EffectLightMapMethod(texture, blendMode, useSecondaryUV) {
        if (blendMode === void 0) { blendMode = "multiply"; }
        if (useSecondaryUV === void 0) { useSecondaryUV = false; }
        _super.call(this);
        this._useSecondaryUV = useSecondaryUV;
        this._texture = texture;
        this.blendMode = blendMode;
    }
    /**
     * @inheritDoc
     */
    EffectLightMapMethod.prototype.iInitVO = function (shaderObject, methodVO) {
        methodVO.needsUV = !this._useSecondaryUV;
        methodVO.needsSecondaryUV = this._useSecondaryUV;
    };
    Object.defineProperty(EffectLightMapMethod.prototype, "blendMode", {
        /**
         * The blend mode with which the light map should be applied to the lighting result.
         *
         * @see EffectLightMapMethod.ADD
         * @see EffectLightMapMethod.MULTIPLY
         */
        get: function () {
            return this._blendMode;
        },
        set: function (value) {
            if (value != EffectLightMapMethod.ADD && value != EffectLightMapMethod.MULTIPLY)
                throw new Error("Unknown blendmode!");
            if (this._blendMode == value)
                return;
            this._blendMode = value;
            this.iInvalidateShaderProgram();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EffectLightMapMethod.prototype, "texture", {
        /**
         * The texture containing the light map.
         */
        get: function () {
            return this._texture;
        },
        set: function (value) {
            if (value.hasMipmaps != this._texture.hasMipmaps || value.format != this._texture.format)
                this.iInvalidateShaderProgram();
            this._texture = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    EffectLightMapMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
        stage.context.activateTexture(methodVO.texturesIndex, this._texture);
        _super.prototype.iActivate.call(this, shaderObject, methodVO, stage);
    };
    /**
     * @inheritDoc
     */
    EffectLightMapMethod.prototype.iGetFragmentCode = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
        var code;
        var lightMapReg = registerCache.getFreeTextureReg();
        var temp = registerCache.getFreeFragmentVectorTemp();
        methodVO.texturesIndex = lightMapReg.index;
        code = ShaderCompilerHelper.getTex2DSampleCode(temp, sharedRegisters, lightMapReg, this._texture, shaderObject.useSmoothTextures, shaderObject.repeatTextures, shaderObject.useMipmapping, this._useSecondaryUV ? sharedRegisters.secondaryUVVarying : sharedRegisters.uvVarying);
        switch (this._blendMode) {
            case EffectLightMapMethod.MULTIPLY:
                code += "mul " + targetReg + ", " + targetReg + ", " + temp + "\n";
                break;
            case EffectLightMapMethod.ADD:
                code += "add " + targetReg + ", " + targetReg + ", " + temp + "\n";
                break;
        }
        return code;
    };
    /**
     * Indicates the light map should be multiplied with the calculated shading result.
     */
    EffectLightMapMethod.MULTIPLY = "multiply";
    /**
     * Indicates the light map should be added into the calculated shading result.
     */
    EffectLightMapMethod.ADD = "add";
    return EffectLightMapMethod;
})(EffectMethodBase);
module.exports = EffectLightMapMethod;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvbWV0aG9kcy9lZmZlY3RsaWdodG1hcG1ldGhvZC50cyJdLCJuYW1lcyI6WyJFZmZlY3RMaWdodE1hcE1ldGhvZCIsIkVmZmVjdExpZ2h0TWFwTWV0aG9kLmNvbnN0cnVjdG9yIiwiRWZmZWN0TGlnaHRNYXBNZXRob2QuaUluaXRWTyIsIkVmZmVjdExpZ2h0TWFwTWV0aG9kLmJsZW5kTW9kZSIsIkVmZmVjdExpZ2h0TWFwTWV0aG9kLnRleHR1cmUiLCJFZmZlY3RMaWdodE1hcE1ldGhvZC5pQWN0aXZhdGUiLCJFZmZlY3RMaWdodE1hcE1ldGhvZC5pR2V0RnJhZ21lbnRDb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFTQSxJQUFPLGdCQUFnQixXQUFlLHVEQUF1RCxDQUFDLENBQUM7QUFDL0YsSUFBTyxvQkFBb0IsV0FBYyx5REFBeUQsQ0FBQyxDQUFDO0FBRXBHLEFBS0E7Ozs7R0FERztJQUNHLG9CQUFvQjtJQUFTQSxVQUE3QkEsb0JBQW9CQSxVQUF5QkE7SUFpQmxEQTs7Ozs7O09BTUdBO0lBQ0hBLFNBeEJLQSxvQkFBb0JBLENBd0JiQSxPQUFxQkEsRUFBRUEsU0FBNkJBLEVBQUVBLGNBQThCQTtRQUE3REMseUJBQTZCQSxHQUE3QkEsc0JBQTZCQTtRQUFFQSw4QkFBOEJBLEdBQTlCQSxzQkFBOEJBO1FBRS9GQSxpQkFBT0EsQ0FBQ0E7UUFFUkEsSUFBSUEsQ0FBQ0EsZUFBZUEsR0FBR0EsY0FBY0EsQ0FBQ0E7UUFDdENBLElBQUlBLENBQUNBLFFBQVFBLEdBQUdBLE9BQU9BLENBQUNBO1FBQ3hCQSxJQUFJQSxDQUFDQSxTQUFTQSxHQUFHQSxTQUFTQSxDQUFDQTtJQUM1QkEsQ0FBQ0E7SUFFREQ7O09BRUdBO0lBQ0lBLHNDQUFPQSxHQUFkQSxVQUFlQSxZQUE2QkEsRUFBRUEsUUFBaUJBO1FBRTlERSxRQUFRQSxDQUFDQSxPQUFPQSxHQUFHQSxDQUFDQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFD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Q2pDQSxJQUFJQSxJQUFJQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxJQUFJQSxHQUFHQSxTQUFTQSxHQUFHQSxJQUFJQSxHQUFHQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQTtnQkFDbkVBLEtBQUtBLENBQUNBO1lBQ1BBLEtBQUtBLG9CQUFvQkEsQ0FBQ0EsR0FBR0E7Z0JBQzVCQSxJQUFJQSxJQUFJQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxJQUFJQSxHQUFHQSxTQUFTQSxHQUFHQSxJQUFJQSxHQUFHQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQTtnQkFDbkVBLEtBQUtBLENBQUNBO1FBQ1JBLENBQUNBO1FBRURBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBO0lBQ2JBLENBQUNBO0lBL0dETjs7T0FFR0E7SUFDV0EsNkJBQVFBLEdBQVVBLFVBQVVBLENBQUNBO0lBRTNDQTs7T0FFR0E7SUFDV0Esd0JBQUdBLEdBQVVBLEtBQUtBLENBQUNBO0lBd0dsQ0EsMkJBQUNBO0FBQURBLENBbEhBLEFBa0hDQSxFQWxIa0MsZ0JBQWdCLEVBa0hsRDtBQUVELEFBQThCLGlCQUFyQixvQkFBb0IsQ0FBQyIsImZpbGUiOiJtYXRlcmlhbHMvbWV0aG9kcy9FZmZlY3RMaWdodE1hcE1ldGhvZC5qcyIsInNvdXJjZVJvb3QiOiIuLi8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVGV4dHVyZTJEQmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvdGV4dHVyZXMvVGV4dHVyZTJEQmFzZVwiKTtcblxuaW1wb3J0IFN0YWdlXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvYmFzZS9TdGFnZVwiKTtcbmltcG9ydCBJQ29udGV4dFN0YWdlR0xcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2Jhc2UvSUNvbnRleHRTdGFnZUdMXCIpO1xuaW1wb3J0IE1ldGhvZFZPXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvbWF0ZXJpYWxzL2NvbXBpbGF0aW9uL01ldGhvZFZPXCIpO1xuaW1wb3J0IFNoYWRlck9iamVjdEJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL21hdGVyaWFscy9jb21waWxhdGlvbi9TaGFkZXJPYmplY3RCYXNlXCIpO1xuaW1wb3J0IFNoYWRlclJlZ2lzdGVyQ2FjaGVcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9tYXRlcmlhbHMvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJDYWNoZVwiKTtcbmltcG9ydCBTaGFkZXJSZWdpc3RlckRhdGFcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9tYXRlcmlhbHMvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJEYXRhXCIpO1xuaW1wb3J0IFNoYWRlclJlZ2lzdGVyRWxlbWVudFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9tYXRlcmlhbHMvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJFbGVtZW50XCIpO1xuaW1wb3J0IEVmZmVjdE1ldGhvZEJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL21hdGVyaWFscy9tZXRob2RzL0VmZmVjdE1ldGhvZEJhc2VcIik7XG5pbXBvcnQgU2hhZGVyQ29tcGlsZXJIZWxwZXJcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9tYXRlcmlhbHMvdXRpbHMvU2hhZGVyQ29tcGlsZXJIZWxwZXJcIik7XG5cbi8qKlxuICogRWZmZWN0TGlnaHRNYXBNZXRob2QgcHJvdmlkZXMgYSBtZXRob2QgdGhhdCBhbGxvd3MgYXBwbHlpbmcgYSBsaWdodCBtYXAgdGV4dHVyZSB0byB0aGUgY2FsY3VsYXRlZCBwaXhlbCBjb2xvdXIuXG4gKiBJdCBpcyBkaWZmZXJlbnQgZnJvbSBEaWZmdXNlTGlnaHRNYXBNZXRob2QgaW4gdGhhdCB0aGUgbGF0dGVyIG9ubHkgbW9kdWxhdGVzIHRoZSBkaWZmdXNlIHNoYWRpbmcgdmFsdWUgcmF0aGVyXG4gKiB0aGFuIHRoZSB3aG9sZSBwaXhlbCBjb2xvdXIuXG4gKi9cbmNsYXNzIEVmZmVjdExpZ2h0TWFwTWV0aG9kIGV4dGVuZHMgRWZmZWN0TWV0aG9kQmFzZVxue1xuXHQvKipcblx0ICogSW5kaWNhdGVzIHRoZSBsaWdodCBtYXAgc2hvdWxkIGJlIG11bHRpcGxpZWQgd2l0aCB0aGUgY2FsY3VsYXRlZCBzaGFkaW5nIHJlc3VsdC5cblx0ICovXG5cdHB1YmxpYyBzdGF0aWMgTVVMVElQTFk6c3RyaW5nID0gXCJtdWx0aXBseVwiO1xuXG5cdC8qKlxuXHQgKiBJbmRpY2F0ZXMgdGhlIGxpZ2h0IG1hcCBzaG91bGQgYmUgYWRkZWQgaW50byB0aGUgY2FsY3VsYXRlZCBzaGFkaW5nIHJlc3VsdC5cblx0ICovXG5cdHB1YmxpYyBzdGF0aWMgQUREOnN0cmluZyA9IFwiYWRkXCI7XG5cblx0cHJpdmF0ZSBfdGV4dHVyZTpUZXh0dXJlMkRCYXNlO1xuXG5cdHByaXZhdGUgX2JsZW5kTW9kZTpzdHJpbmc7XG5cdHByaXZhdGUgX3VzZVNlY29uZGFyeVVWOmJvb2xlYW47XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBuZXcgRWZmZWN0TGlnaHRNYXBNZXRob2Qgb2JqZWN0LlxuXHQgKlxuXHQgKiBAcGFyYW0gdGV4dHVyZSBUaGUgdGV4dHVyZSBjb250YWluaW5nIHRoZSBsaWdodCBtYXAuXG5cdCAqIEBwYXJhbSBibGVuZE1vZGUgVGhlIGJsZW5kIG1vZGUgd2l0aCB3aGljaCB0aGUgbGlnaHQgbWFwIHNob3VsZCBiZSBhcHBsaWVkIHRvIHRoZSBsaWdodGluZyByZXN1bHQuXG5cdCAqIEBwYXJhbSB1c2VTZWNvbmRhcnlVViBJbmRpY2F0ZXMgd2hldGhlciB0aGUgc2Vjb25kYXJ5IFVWIHNldCBzaG91bGQgYmUgdXNlZCB0byBtYXAgdGhlIGxpZ2h0IG1hcC5cblx0ICovXG5cdGNvbnN0cnVjdG9yKHRleHR1cmU6VGV4dHVyZTJEQmFzZSwgYmxlbmRNb2RlOnN0cmluZyA9IFwibXVsdGlwbHlcIiwgdXNlU2Vjb25kYXJ5VVY6Ym9vbGVhbiA9IGZhbHNlKVxuXHR7XG5cdFx0c3VwZXIoKTtcblxuXHRcdHRoaXMuX3VzZVNlY29uZGFyeVVWID0gdXNlU2Vjb25kYXJ5VVY7XG5cdFx0dGhpcy5fdGV4dHVyZSA9IHRleHR1cmU7XG5cdFx0dGhpcy5ibGVuZE1vZGUgPSBibGVuZE1vZGU7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBpSW5pdFZPKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCBtZXRob2RWTzpNZXRob2RWTylcblx0e1xuXHRcdG1ldGhvZFZPLm5lZWRzVVYgPSAhdGhpcy5fdXNlU2Vjb25kYXJ5VVY7XG5cdFx0bWV0aG9kVk8ubmVlZHNTZWNvbmRhcnlVViA9IHRoaXMuX3VzZVNlY29uZGFyeVVWO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBibGVuZCBtb2RlIHdpdGggd2hpY2ggdGhlIGxpZ2h0IG1hcCBzaG91bGQgYmUgYXBwbGllZCB0byB0aGUgbGlnaHRpbmcgcmVzdWx0LlxuXHQgKlxuXHQgKiBAc2VlIEVmZmVjdExpZ2h0TWFwTWV0aG9kLkFERFxuXHQgKiBAc2VlIEVmZmVjdExpZ2h0TWFwTWV0aG9kLk1VTFRJUExZXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGJsZW5kTW9kZSgpOnN0cmluZ1xuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX2JsZW5kTW9kZTtcblx0fVxuXG5cdHB1YmxpYyBzZXQgYmxlbmRNb2RlKHZhbHVlOnN0cmluZylcblx0e1xuXHRcdGlmICh2YWx1ZSAhPSBFZmZlY3RMaWdodE1hcE1ldGhvZC5BREQgJiYgdmFsdWUgIT0gRWZmZWN0TGlnaHRNYXBNZXRob2QuTVVMVElQTFkpXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duIGJsZW5kbW9kZSFcIik7XG5cdFx0aWYgKHRoaXMuX2JsZW5kTW9kZSA9PSB2YWx1ZSlcblx0XHRcdHJldHVybjtcblxuXHRcdHRoaXMuX2JsZW5kTW9kZSA9IHZhbHVlO1xuXG5cdFx0dGhpcy5pSW52YWxpZGF0ZVNoYWRlclByb2dyYW0oKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgdGV4dHVyZSBjb250YWluaW5nIHRoZSBsaWdodCBtYXAuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IHRleHR1cmUoKTpUZXh0dXJlMkRCYXNlXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fdGV4dHVyZTtcblx0fVxuXG5cdHB1YmxpYyBzZXQgdGV4dHVyZSh2YWx1ZTpUZXh0dXJlMkRCYXNlKVxuXHR7XG5cdFx0aWYgKHZhbHVlLmhhc01pcG1hcHMgIT0gdGhpcy5fdGV4dHVyZS5oYXNNaXBtYXBzIHx8IHZhbHVlLmZvcm1hdCAhPSB0aGlzLl90ZXh0dXJlLmZvcm1hdClcblx0XHRcdHRoaXMuaUludmFsaWRhdGVTaGFkZXJQcm9ncmFtKCk7XG5cblx0XHR0aGlzLl90ZXh0dXJlID0gdmFsdWU7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBpQWN0aXZhdGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIG1ldGhvZFZPOk1ldGhvZFZPLCBzdGFnZTpTdGFnZSlcblx0e1xuXHRcdCg8SUNvbnRleHRTdGFnZUdMPiBzdGFnZS5jb250ZXh0KS5hY3RpdmF0ZVRleHR1cmUobWV0aG9kVk8udGV4dHVyZXNJbmRleCwgdGhpcy5fdGV4dHVyZSk7XG5cblx0XHRzdXBlci5pQWN0aXZhdGUoc2hhZGVyT2JqZWN0LCBtZXRob2RWTywgc3RhZ2UpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgaUdldEZyYWdtZW50Q29kZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgbWV0aG9kVk86TWV0aG9kVk8sIHRhcmdldFJlZzpTaGFkZXJSZWdpc3RlckVsZW1lbnQsIHJlZ2lzdGVyQ2FjaGU6U2hhZGVyUmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzOlNoYWRlclJlZ2lzdGVyRGF0YSk6c3RyaW5nXG5cdHtcblx0XHR2YXIgY29kZTpzdHJpbmc7XG5cdFx0dmFyIGxpZ2h0TWFwUmVnOlNoYWRlclJlZ2lzdGVyRWxlbWVudCA9IHJlZ2lzdGVyQ2FjaGUuZ2V0RnJlZVRleHR1cmVSZWcoKTtcblx0XHR2YXIgdGVtcDpTaGFkZXJSZWdpc3RlckVsZW1lbnQgPSByZWdpc3RlckNhY2hlLmdldEZyZWVGcmFnbWVudFZlY3RvclRlbXAoKTtcblx0XHRtZXRob2RWTy50ZXh0dXJlc0luZGV4ID0gbGlnaHRNYXBSZWcuaW5kZXg7XG5cblx0XHRjb2RlID0gU2hhZGVyQ29tcGlsZXJIZWxwZXIuZ2V0VGV4MkRTYW1wbGVDb2RlKHRlbXAsIHNoYXJlZFJlZ2lzdGVycywgbGlnaHRNYXBSZWcsIHRoaXMuX3RleHR1cmUsIHNoYWRlck9iamVjdC51c2VTbW9vdGhUZXh0dXJlcywgc2hhZGVyT2JqZWN0LnJlcGVhdFRleHR1cmVzLCBzaGFkZXJPYmplY3QudXNlTWlwbWFwcGluZywgdGhpcy5fdXNlU2Vjb25kYXJ5VVY/IHNoYXJlZFJlZ2lzdGVycy5zZWNvbmRhcnlVVlZhcnlpbmcgOiBzaGFyZWRSZWdpc3RlcnMudXZWYXJ5aW5nKTtcblxuXHRcdHN3aXRjaCAodGhpcy5fYmxlbmRNb2RlKSB7XG5cdFx0XHRjYXNlIEVmZmVjdExpZ2h0TWFwTWV0aG9kLk1VTFRJUExZOlxuXHRcdFx0XHRjb2RlICs9IFwibXVsIFwiICsgdGFyZ2V0UmVnICsgXCIsIFwiICsgdGFyZ2V0UmVnICsgXCIsIFwiICsgdGVtcCArIFwiXFxuXCI7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBFZmZlY3RMaWdodE1hcE1ldGhvZC5BREQ6XG5cdFx0XHRcdGNvZGUgKz0gXCJhZGQgXCIgKyB0YXJnZXRSZWcgKyBcIiwgXCIgKyB0YXJnZXRSZWcgKyBcIiwgXCIgKyB0ZW1wICsgXCJcXG5cIjtcblx0XHRcdFx0YnJlYWs7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNvZGU7XG5cdH1cbn1cblxuZXhwb3J0ID0gRWZmZWN0TGlnaHRNYXBNZXRob2Q7Il19