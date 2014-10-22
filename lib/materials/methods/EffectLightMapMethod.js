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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1hdGVyaWFscy9tZXRob2RzL2VmZmVjdGxpZ2h0bWFwbWV0aG9kLnRzIl0sIm5hbWVzIjpbIkVmZmVjdExpZ2h0TWFwTWV0aG9kIiwiRWZmZWN0TGlnaHRNYXBNZXRob2QuY29uc3RydWN0b3IiLCJFZmZlY3RMaWdodE1hcE1ldGhvZC5pSW5pdFZPIiwiRWZmZWN0TGlnaHRNYXBNZXRob2QuYmxlbmRNb2RlIiwiRWZmZWN0TGlnaHRNYXBNZXRob2QudGV4dHVyZSIsIkVmZmVjdExpZ2h0TWFwTWV0aG9kLmlBY3RpdmF0ZSIsIkVmZmVjdExpZ2h0TWFwTWV0aG9kLmlHZXRGcmFnbWVudENvZGUiXSwibWFwcGluZ3MiOiI7Ozs7OztBQVNBLElBQU8sZ0JBQWdCLFdBQWUsdURBQXVELENBQUMsQ0FBQztBQUMvRixJQUFPLG9CQUFvQixXQUFjLHlEQUF5RCxDQUFDLENBQUM7QUFFcEcsQUFLQTs7OztHQURHO0lBQ0csb0JBQW9CO0lBQVNBLFVBQTdCQSxvQkFBb0JBLFVBQXlCQTtJQWlCbERBOzs7Ozs7T0FNR0E7SUFDSEEsU0F4QktBLG9CQUFvQkEsQ0F3QmJBLE9BQXFCQSxFQUFFQSxTQUE2QkEsRUFBRUEsY0FBOEJBO1FBQTdEQyx5QkFBNkJBLEdBQTdCQSxzQkFBNkJBO1FBQUVBLDhCQUE4QkEsR0FBOUJBLHNCQUE4QkE7UUFFL0ZBLGlCQUFPQSxDQUFDQTtRQUVSQSxJQUFJQSxDQUFDQSxlQUFlQSxHQUFHQSxjQUFjQSxDQUFDQTtRQUN0Q0EsSUFBSUEsQ0FBQ0EsUUFBUUEsR0FBR0EsT0FBT0EsQ0FBQ0E7UUFDeEJBLElBQUlBLENBQUNBLFNBQVNBLEdBQUdBLFNBQVNBLENBQUNBO0lBQzVCQSxDQUFDQTtJQUVERDs7T0FFR0E7SUFDSUEsc0NBQU9BLEdBQWRBLFVBQWVBLFlBQTZCQSxFQUFFQSxRQUFpQkE7UUFFOURFLFFBQVFBLENBQUNBLE9BQU9BLEdBQUdBLENBQUNBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBO1FBQ3pDQSxRQUFRQSxDQUFDQSxn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LEdBQUdBLFNBQVNBLEdBQUdBLElBQUlBLEdBQUdBLFNBQVNBLEdBQUdBLElBQUlBLEdBQUdBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBO2dCQUNuRUEsS0FBS0EsQ0FBQ0E7WUFDUEEsS0FBS0Esb0JBQW9CQSxDQUFDQSxHQUFHQTtnQkFDNUJBLElBQUlBLElBQUlBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLElBQUlBLEdBQUdBLFNBQVNBLEdBQUdBLElBQUlBLEdBQUdBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBO2dCQUNuRUEsS0FBS0EsQ0FBQ0E7UUFDUkEsQ0FBQ0E7UUFFREEsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7SUFDYkEsQ0FBQ0E7SUEvR0ROOztPQUVHQTtJQUNXQSw2QkFBUUEsR0FBVUEsVUFBVUEsQ0FBQ0E7SUFFM0NBOztPQUVHQTtJQUNXQSx3QkFBR0EsR0FBVUEsS0FBS0EsQ0FBQ0E7SUF3R2xDQSwyQkFBQ0E7QUFBREEsQ0FsSEEsQUFrSENBLEVBbEhrQyxnQkFBZ0IsRUFrSGxEO0FBRUQsQUFBOEIsaUJBQXJCLG9CQUFvQixDQUFDIiwiZmlsZSI6Im1hdGVyaWFscy9tZXRob2RzL0VmZmVjdExpZ2h0TWFwTWV0aG9kLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9yb2JiYXRlbWFuL1dlYnN0b3JtUHJvamVjdHMvYXdheWpzLXJlbmRlcmVyZ2wvIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFRleHR1cmUyREJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL3RleHR1cmVzL1RleHR1cmUyREJhc2VcIik7XG5cbmltcG9ydCBTdGFnZVx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2NvcmUvYmFzZS9TdGFnZVwiKTtcbmltcG9ydCBJQ29udGV4dFN0YWdlR0xcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2NvcmUvc3RhZ2VnbC9JQ29udGV4dFN0YWdlR0xcIik7XG5pbXBvcnQgTWV0aG9kVk9cdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9tYXRlcmlhbHMvY29tcGlsYXRpb24vTWV0aG9kVk9cIik7XG5pbXBvcnQgU2hhZGVyT2JqZWN0QmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvbWF0ZXJpYWxzL2NvbXBpbGF0aW9uL1NoYWRlck9iamVjdEJhc2VcIik7XG5pbXBvcnQgU2hhZGVyUmVnaXN0ZXJDYWNoZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL21hdGVyaWFscy9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckNhY2hlXCIpO1xuaW1wb3J0IFNoYWRlclJlZ2lzdGVyRGF0YVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL21hdGVyaWFscy9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckRhdGFcIik7XG5pbXBvcnQgU2hhZGVyUmVnaXN0ZXJFbGVtZW50XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL21hdGVyaWFscy9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckVsZW1lbnRcIik7XG5pbXBvcnQgRWZmZWN0TWV0aG9kQmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvbWF0ZXJpYWxzL21ldGhvZHMvRWZmZWN0TWV0aG9kQmFzZVwiKTtcbmltcG9ydCBTaGFkZXJDb21waWxlckhlbHBlclx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL21hdGVyaWFscy91dGlscy9TaGFkZXJDb21waWxlckhlbHBlclwiKTtcblxuLyoqXG4gKiBFZmZlY3RMaWdodE1hcE1ldGhvZCBwcm92aWRlcyBhIG1ldGhvZCB0aGF0IGFsbG93cyBhcHBseWluZyBhIGxpZ2h0IG1hcCB0ZXh0dXJlIHRvIHRoZSBjYWxjdWxhdGVkIHBpeGVsIGNvbG91ci5cbiAqIEl0IGlzIGRpZmZlcmVudCBmcm9tIERpZmZ1c2VMaWdodE1hcE1ldGhvZCBpbiB0aGF0IHRoZSBsYXR0ZXIgb25seSBtb2R1bGF0ZXMgdGhlIGRpZmZ1c2Ugc2hhZGluZyB2YWx1ZSByYXRoZXJcbiAqIHRoYW4gdGhlIHdob2xlIHBpeGVsIGNvbG91ci5cbiAqL1xuY2xhc3MgRWZmZWN0TGlnaHRNYXBNZXRob2QgZXh0ZW5kcyBFZmZlY3RNZXRob2RCYXNlXG57XG5cdC8qKlxuXHQgKiBJbmRpY2F0ZXMgdGhlIGxpZ2h0IG1hcCBzaG91bGQgYmUgbXVsdGlwbGllZCB3aXRoIHRoZSBjYWxjdWxhdGVkIHNoYWRpbmcgcmVzdWx0LlxuXHQgKi9cblx0cHVibGljIHN0YXRpYyBNVUxUSVBMWTpzdHJpbmcgPSBcIm11bHRpcGx5XCI7XG5cblx0LyoqXG5cdCAqIEluZGljYXRlcyB0aGUgbGlnaHQgbWFwIHNob3VsZCBiZSBhZGRlZCBpbnRvIHRoZSBjYWxjdWxhdGVkIHNoYWRpbmcgcmVzdWx0LlxuXHQgKi9cblx0cHVibGljIHN0YXRpYyBBREQ6c3RyaW5nID0gXCJhZGRcIjtcblxuXHRwcml2YXRlIF90ZXh0dXJlOlRleHR1cmUyREJhc2U7XG5cblx0cHJpdmF0ZSBfYmxlbmRNb2RlOnN0cmluZztcblx0cHJpdmF0ZSBfdXNlU2Vjb25kYXJ5VVY6Ym9vbGVhbjtcblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyBFZmZlY3RMaWdodE1hcE1ldGhvZCBvYmplY3QuXG5cdCAqXG5cdCAqIEBwYXJhbSB0ZXh0dXJlIFRoZSB0ZXh0dXJlIGNvbnRhaW5pbmcgdGhlIGxpZ2h0IG1hcC5cblx0ICogQHBhcmFtIGJsZW5kTW9kZSBUaGUgYmxlbmQgbW9kZSB3aXRoIHdoaWNoIHRoZSBsaWdodCBtYXAgc2hvdWxkIGJlIGFwcGxpZWQgdG8gdGhlIGxpZ2h0aW5nIHJlc3VsdC5cblx0ICogQHBhcmFtIHVzZVNlY29uZGFyeVVWIEluZGljYXRlcyB3aGV0aGVyIHRoZSBzZWNvbmRhcnkgVVYgc2V0IHNob3VsZCBiZSB1c2VkIHRvIG1hcCB0aGUgbGlnaHQgbWFwLlxuXHQgKi9cblx0Y29uc3RydWN0b3IodGV4dHVyZTpUZXh0dXJlMkRCYXNlLCBibGVuZE1vZGU6c3RyaW5nID0gXCJtdWx0aXBseVwiLCB1c2VTZWNvbmRhcnlVVjpib29sZWFuID0gZmFsc2UpXG5cdHtcblx0XHRzdXBlcigpO1xuXG5cdFx0dGhpcy5fdXNlU2Vjb25kYXJ5VVYgPSB1c2VTZWNvbmRhcnlVVjtcblx0XHR0aGlzLl90ZXh0dXJlID0gdGV4dHVyZTtcblx0XHR0aGlzLmJsZW5kTW9kZSA9IGJsZW5kTW9kZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGlJbml0Vk8oc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIG1ldGhvZFZPOk1ldGhvZFZPKVxuXHR7XG5cdFx0bWV0aG9kVk8ubmVlZHNVViA9ICF0aGlzLl91c2VTZWNvbmRhcnlVVjtcblx0XHRtZXRob2RWTy5uZWVkc1NlY29uZGFyeVVWID0gdGhpcy5fdXNlU2Vjb25kYXJ5VVY7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIGJsZW5kIG1vZGUgd2l0aCB3aGljaCB0aGUgbGlnaHQgbWFwIHNob3VsZCBiZSBhcHBsaWVkIHRvIHRoZSBsaWdodGluZyByZXN1bHQuXG5cdCAqXG5cdCAqIEBzZWUgRWZmZWN0TGlnaHRNYXBNZXRob2QuQUREXG5cdCAqIEBzZWUgRWZmZWN0TGlnaHRNYXBNZXRob2QuTVVMVElQTFlcblx0ICovXG5cdHB1YmxpYyBnZXQgYmxlbmRNb2RlKCk6c3RyaW5nXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fYmxlbmRNb2RlO1xuXHR9XG5cblx0cHVibGljIHNldCBibGVuZE1vZGUodmFsdWU6c3RyaW5nKVxuXHR7XG5cdFx0aWYgKHZhbHVlICE9IEVmZmVjdExpZ2h0TWFwTWV0aG9kLkFERCAmJiB2YWx1ZSAhPSBFZmZlY3RMaWdodE1hcE1ldGhvZC5NVUxUSVBMWSlcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIlVua25vd24gYmxlbmRtb2RlIVwiKTtcblx0XHRpZiAodGhpcy5fYmxlbmRNb2RlID09IHZhbHVlKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0dGhpcy5fYmxlbmRNb2RlID0gdmFsdWU7XG5cblx0XHR0aGlzLmlJbnZhbGlkYXRlU2hhZGVyUHJvZ3JhbSgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSB0ZXh0dXJlIGNvbnRhaW5pbmcgdGhlIGxpZ2h0IG1hcC5cblx0ICovXG5cdHB1YmxpYyBnZXQgdGV4dHVyZSgpOlRleHR1cmUyREJhc2Vcblx0e1xuXHRcdHJldHVybiB0aGlzLl90ZXh0dXJlO1xuXHR9XG5cblx0cHVibGljIHNldCB0ZXh0dXJlKHZhbHVlOlRleHR1cmUyREJhc2UpXG5cdHtcblx0XHRpZiAodmFsdWUuaGFzTWlwbWFwcyAhPSB0aGlzLl90ZXh0dXJlLmhhc01pcG1hcHMgfHwgdmFsdWUuZm9ybWF0ICE9IHRoaXMuX3RleHR1cmUuZm9ybWF0KVxuXHRcdFx0dGhpcy5pSW52YWxpZGF0ZVNoYWRlclByb2dyYW0oKTtcblxuXHRcdHRoaXMuX3RleHR1cmUgPSB2YWx1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGlBY3RpdmF0ZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgbWV0aG9kVk86TWV0aG9kVk8sIHN0YWdlOlN0YWdlKVxuXHR7XG5cdFx0KDxJQ29udGV4dFN0YWdlR0w+IHN0YWdlLmNvbnRleHQpLmFjdGl2YXRlVGV4dHVyZShtZXRob2RWTy50ZXh0dXJlc0luZGV4LCB0aGlzLl90ZXh0dXJlKTtcblxuXHRcdHN1cGVyLmlBY3RpdmF0ZShzaGFkZXJPYmplY3QsIG1ldGhvZFZPLCBzdGFnZSk7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBpR2V0RnJhZ21lbnRDb2RlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCBtZXRob2RWTzpNZXRob2RWTywgdGFyZ2V0UmVnOlNoYWRlclJlZ2lzdGVyRWxlbWVudCwgcmVnaXN0ZXJDYWNoZTpTaGFkZXJSZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnM6U2hhZGVyUmVnaXN0ZXJEYXRhKTpzdHJpbmdcblx0e1xuXHRcdHZhciBjb2RlOnN0cmluZztcblx0XHR2YXIgbGlnaHRNYXBSZWc6U2hhZGVyUmVnaXN0ZXJFbGVtZW50ID0gcmVnaXN0ZXJDYWNoZS5nZXRGcmVlVGV4dHVyZVJlZygpO1xuXHRcdHZhciB0ZW1wOlNoYWRlclJlZ2lzdGVyRWxlbWVudCA9IHJlZ2lzdGVyQ2FjaGUuZ2V0RnJlZUZyYWdtZW50VmVjdG9yVGVtcCgpO1xuXHRcdG1ldGhvZFZPLnRleHR1cmVzSW5kZXggPSBsaWdodE1hcFJlZy5pbmRleDtcblxuXHRcdGNvZGUgPSBTaGFkZXJDb21waWxlckhlbHBlci5nZXRUZXgyRFNhbXBsZUNvZGUodGVtcCwgc2hhcmVkUmVnaXN0ZXJzLCBsaWdodE1hcFJlZywgdGhpcy5fdGV4dHVyZSwgc2hhZGVyT2JqZWN0LnVzZVNtb290aFRleHR1cmVzLCBzaGFkZXJPYmplY3QucmVwZWF0VGV4dHVyZXMsIHNoYWRlck9iamVjdC51c2VNaXBtYXBwaW5nLCB0aGlzLl91c2VTZWNvbmRhcnlVVj8gc2hhcmVkUmVnaXN0ZXJzLnNlY29uZGFyeVVWVmFyeWluZyA6IHNoYXJlZFJlZ2lzdGVycy51dlZhcnlpbmcpO1xuXG5cdFx0c3dpdGNoICh0aGlzLl9ibGVuZE1vZGUpIHtcblx0XHRcdGNhc2UgRWZmZWN0TGlnaHRNYXBNZXRob2QuTVVMVElQTFk6XG5cdFx0XHRcdGNvZGUgKz0gXCJtdWwgXCIgKyB0YXJnZXRSZWcgKyBcIiwgXCIgKyB0YXJnZXRSZWcgKyBcIiwgXCIgKyB0ZW1wICsgXCJcXG5cIjtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIEVmZmVjdExpZ2h0TWFwTWV0aG9kLkFERDpcblx0XHRcdFx0Y29kZSArPSBcImFkZCBcIiArIHRhcmdldFJlZyArIFwiLCBcIiArIHRhcmdldFJlZyArIFwiLCBcIiArIHRlbXAgKyBcIlxcblwiO1xuXHRcdFx0XHRicmVhaztcblx0XHR9XG5cblx0XHRyZXR1cm4gY29kZTtcblx0fVxufVxuXG5leHBvcnQgPSBFZmZlY3RMaWdodE1hcE1ldGhvZDsiXX0=