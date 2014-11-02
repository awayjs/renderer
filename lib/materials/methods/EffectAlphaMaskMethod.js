var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var EffectMethodBase = require("awayjs-renderergl/lib/materials/methods/EffectMethodBase");
var ShaderCompilerHelper = require("awayjs-renderergl/lib/materials/utils/ShaderCompilerHelper");
/**
 * EffectAlphaMaskMethod allows the use of an additional texture to specify the alpha value of the material. When used
 * with the secondary uv set, it allows for a tiled main texture with independently varying alpha (useful for water
 * etc).
 */
var EffectAlphaMaskMethod = (function (_super) {
    __extends(EffectAlphaMaskMethod, _super);
    /**
     * Creates a new EffectAlphaMaskMethod object.
     *
     * @param texture The texture to use as the alpha mask.
     * @param useSecondaryUV Indicated whether or not the secondary uv set for the mask. This allows mapping alpha independently.
     */
    function EffectAlphaMaskMethod(texture, useSecondaryUV) {
        if (useSecondaryUV === void 0) { useSecondaryUV = false; }
        _super.call(this);
        this._texture = texture;
        this._useSecondaryUV = useSecondaryUV;
    }
    /**
     * @inheritDoc
     */
    EffectAlphaMaskMethod.prototype.iInitVO = function (shaderObject, methodVO) {
        methodVO.needsSecondaryUV = this._useSecondaryUV;
        methodVO.needsUV = !this._useSecondaryUV;
    };
    Object.defineProperty(EffectAlphaMaskMethod.prototype, "useSecondaryUV", {
        /**
         * Indicated whether or not the secondary uv set for the mask. This allows mapping alpha independently, for
         * instance to tile the main texture and normal map while providing untiled alpha, for example to define the
         * transparency over a tiled water surface.
         */
        get: function () {
            return this._useSecondaryUV;
        },
        set: function (value) {
            if (this._useSecondaryUV == value)
                return;
            this._useSecondaryUV = value;
            this.iInvalidateShaderProgram();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EffectAlphaMaskMethod.prototype, "texture", {
        /**
         * The texture to use as the alpha mask.
         */
        get: function () {
            return this._texture;
        },
        set: function (value) {
            this._texture = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    EffectAlphaMaskMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
        stage.context.activateTexture(methodVO.texturesIndex, this._texture);
    };
    /**
     * @inheritDoc
     */
    EffectAlphaMaskMethod.prototype.iGetFragmentCode = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
        var textureReg = registerCache.getFreeTextureReg();
        var temp = registerCache.getFreeFragmentVectorTemp();
        var uvReg = this._useSecondaryUV ? sharedRegisters.secondaryUVVarying : sharedRegisters.uvVarying;
        methodVO.texturesIndex = textureReg.index;
        return ShaderCompilerHelper.getTex2DSampleCode(temp, sharedRegisters, textureReg, this._texture, shaderObject.useSmoothTextures, shaderObject.repeatTextures, shaderObject.useMipmapping, uvReg) + "mul " + targetReg + ", " + targetReg + ", " + temp + ".x\n";
    };
    return EffectAlphaMaskMethod;
})(EffectMethodBase);
module.exports = EffectAlphaMaskMethod;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvbWV0aG9kcy9lZmZlY3RhbHBoYW1hc2ttZXRob2QudHMiXSwibmFtZXMiOlsiRWZmZWN0QWxwaGFNYXNrTWV0aG9kIiwiRWZmZWN0QWxwaGFNYXNrTWV0aG9kLmNvbnN0cnVjdG9yIiwiRWZmZWN0QWxwaGFNYXNrTWV0aG9kLmlJbml0Vk8iLCJFZmZlY3RBbHBoYU1hc2tNZXRob2QudXNlU2Vjb25kYXJ5VVYiLCJFZmZlY3RBbHBoYU1hc2tNZXRob2QudGV4dHVyZSIsIkVmZmVjdEFscGhhTWFza01ldGhvZC5pQWN0aXZhdGUiLCJFZmZlY3RBbHBoYU1hc2tNZXRob2QuaUdldEZyYWdtZW50Q29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBVUEsSUFBTyxnQkFBZ0IsV0FBZSwwREFBMEQsQ0FBQyxDQUFDO0FBQ2xHLElBQU8sb0JBQW9CLFdBQWMsNERBQTRELENBQUMsQ0FBQztBQUV2RyxBQUtBOzs7O0dBREc7SUFDRyxxQkFBcUI7SUFBU0EsVUFBOUJBLHFCQUFxQkEsVUFBeUJBO0lBS25EQTs7Ozs7T0FLR0E7SUFDSEEsU0FYS0EscUJBQXFCQSxDQVdkQSxPQUFxQkEsRUFBRUEsY0FBOEJBO1FBQTlCQyw4QkFBOEJBLEdBQTlCQSxzQkFBOEJBO1FBRWhFQSxpQkFBT0EsQ0FBQ0E7UUFFUkEsSUFBSUEsQ0FBQ0EsUUFBUUEsR0FBR0EsT0FBT0EsQ0FBQ0E7UUFDeEJBLElBQUlBLENBQUNBLGVBQWVBLEdBQUdBLGNBQWNBLENBQUNBO0lBQ3ZDQSxDQUFDQTtJQUVERDs7T0FFR0E7SUFDSUEsdUNBQU9BLEdBQWRBLFVBQWVBLFlBQTZCQSxFQUFFQSxRQUFpQkE7UUFFOURFLFFBQVFBLENBQUNBLGdCQUFnQkEsR0FBR0EsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0E7UUFDakRBLFFBQVFBLENBQUNBLE9BQU9BLEdBQUdBLENBQUNBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBO0lBQzFDQSxDQUFDQTtJQU9ERixzQkFBV0EsaURBQWNBO1FBTHpCQTs7OztXQUlHQTthQUNIQTtZQUVDRyxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQTtRQUM3QkEsQ0FBQ0E7YUFFREgsVUFBMEJBLEtBQWFBO1lBRXRDRyxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxlQUFlQSxJQUFJQSxLQUFLQSxDQUFDQTtnQkFDakNBLE1BQU1BLENBQUNBO1lBQ1JBLElBQUlBLENBQUNBLGVBQWVBLEdBQUdBLEtBQUtBLENBQUNBO1lBQzdCQSxJQUFJQSxDQUFDQSx3QkFBd0JBLEVBQUVBLENBQUNBO1FBQ2pDQSxDQUFDQTs7O09BUkFIO0lBYURBLHNCQUFXQSwwQ0FBT0E7UUFIbEJBOztXQUVHQTthQUNIQTtZQUVDSSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQTtRQUN0QkEsQ0FBQ0E7YUFFREosVUFBbUJBLEtBQW1CQTtZQUVyQ0ksSUFBSUEsQ0FBQ0EsUUFBUUEsR0FBR0EsS0FBS0EsQ0FBQ0E7UUFDdkJBLENBQUNBOzs7T0FMQUo7SUFPREE7O09BRUdBO0lBQ0lBLHlDQUFTQSxHQUFoQkEsVUFBaUJBLFlBQWlDQSxFQUFFQSxRQUFpQkEsRUFBRUEsS0FBV0E7UUFFakZLLEtBQUtBLENBQUNBLE9BQU9BLENBQUNBLGVBQWVBLENBQUNBLFFBQVFBLENBQUNBLGFBQWFBLEVBQUVBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBO0lBQ3RFQSxDQUFDQTtJQUVETDs7T0FFR0E7SUFDSUEsZ0RBQWdCQSxHQUF2QkEsVUFBd0JBLFlBQTZCQSxFQUFFQSxRQUFpQkEsRUFBRUEsU0FBK0JBLEVBQUVBLGFBQWlDQSxFQUFFQSxlQUFrQ0E7UUFFL0tNLElBQUlBLFVBQVVBLEdBQXlCQSxhQUFhQSxDQUFDQSxpQkFBaUJBLEVBQUVBLENBQUNBO1FBQ3pFQSxJQUFJQSxJQUFJQSxHQUF5QkEsYUFBYUEsQ0FBQ0EseUJBQXlCQSxFQUFFQSxDQUFDQTtRQUMzRUEsSUFBSUEsS0FBS0EsR0FBeUJBLElBQUlBLENBQUNBLGVBQWVBLEdBQUVBLGVBQWVBLENBQUNBLGtCQUFrQkEsR0FBR0EsZUFBZUEsQ0FBQ0EsU0FBU0EsQ0FBQ0E7UUFDdkhBLFFBQVFBLENBQUNBLGFBQWFBLEdBQUdBLFVBQVVBLENBQUNBLEtBQUtBLENBQUNBO1FBRTFDQSxNQUFNQSxDQUFDQSxvQkFBb0JBLENBQUNBLGtCQUFrQkEsQ0FBQ0EsSUFBSUEsRUFBRUEsZUFBZUEsRUFBRUEsVUFBVUEsRUFBRUEsSUFBSUEsQ0FBQ0EsUUFBUUEsRUFBRUEsWUFBWUEsQ0FBQ0EsaUJBQWlCQSxFQUFFQSxZQUFZQSxDQUFDQSxjQUFjQSxFQUFFQSxZQUFZQSxDQUFDQSxhQUFhQSxFQUFFQSxLQUFLQSxDQUFDQSxHQUMvTEEsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsSUFBSUEsR0FBR0EsU0FBU0EsR0FBR0EsSUFBSUEsR0FBR0EsSUFBSUEsR0FBR0EsTUFBTUEsQ0FBQ0E7SUFDL0RBLENBQUNBO0lBQ0ZOLDRCQUFDQTtBQUFEQSxDQWhGQSxBQWdGQ0EsRUFoRm1DLGdCQUFnQixFQWdGbkQ7QUFFRCxBQUErQixpQkFBdEIscUJBQXFCLENBQUMiLCJmaWxlIjoibWF0ZXJpYWxzL21ldGhvZHMvRWZmZWN0QWxwaGFNYXNrTWV0aG9kLmpzIiwic291cmNlUm9vdCI6Ii4uLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBUZXh0dXJlMkRCYXNlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi90ZXh0dXJlcy9UZXh0dXJlMkRCYXNlXCIpO1xuXG5pbXBvcnQgU3RhZ2VcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9iYXNlL1N0YWdlXCIpO1xuXG5pbXBvcnQgTWV0aG9kVk9cdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvY29tcGlsYXRpb24vTWV0aG9kVk9cIik7XG5pbXBvcnQgU2hhZGVyTGlnaHRpbmdPYmplY3RcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvY29tcGlsYXRpb24vU2hhZGVyTGlnaHRpbmdPYmplY3RcIik7XG5pbXBvcnQgU2hhZGVyT2JqZWN0QmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvbWF0ZXJpYWxzL2NvbXBpbGF0aW9uL1NoYWRlck9iamVjdEJhc2VcIik7XG5pbXBvcnQgU2hhZGVyUmVnaXN0ZXJDYWNoZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL21hdGVyaWFscy9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckNhY2hlXCIpO1xuaW1wb3J0IFNoYWRlclJlZ2lzdGVyRGF0YVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL21hdGVyaWFscy9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckRhdGFcIik7XG5pbXBvcnQgU2hhZGVyUmVnaXN0ZXJFbGVtZW50XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL21hdGVyaWFscy9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckVsZW1lbnRcIik7XG5pbXBvcnQgRWZmZWN0TWV0aG9kQmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvbWF0ZXJpYWxzL21ldGhvZHMvRWZmZWN0TWV0aG9kQmFzZVwiKTtcbmltcG9ydCBTaGFkZXJDb21waWxlckhlbHBlclx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL21hdGVyaWFscy91dGlscy9TaGFkZXJDb21waWxlckhlbHBlclwiKTtcblxuLyoqXG4gKiBFZmZlY3RBbHBoYU1hc2tNZXRob2QgYWxsb3dzIHRoZSB1c2Ugb2YgYW4gYWRkaXRpb25hbCB0ZXh0dXJlIHRvIHNwZWNpZnkgdGhlIGFscGhhIHZhbHVlIG9mIHRoZSBtYXRlcmlhbC4gV2hlbiB1c2VkXG4gKiB3aXRoIHRoZSBzZWNvbmRhcnkgdXYgc2V0LCBpdCBhbGxvd3MgZm9yIGEgdGlsZWQgbWFpbiB0ZXh0dXJlIHdpdGggaW5kZXBlbmRlbnRseSB2YXJ5aW5nIGFscGhhICh1c2VmdWwgZm9yIHdhdGVyXG4gKiBldGMpLlxuICovXG5jbGFzcyBFZmZlY3RBbHBoYU1hc2tNZXRob2QgZXh0ZW5kcyBFZmZlY3RNZXRob2RCYXNlXG57XG5cdHByaXZhdGUgX3RleHR1cmU6VGV4dHVyZTJEQmFzZTtcblx0cHJpdmF0ZSBfdXNlU2Vjb25kYXJ5VVY6Ym9vbGVhbjtcblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyBFZmZlY3RBbHBoYU1hc2tNZXRob2Qgb2JqZWN0LlxuXHQgKlxuXHQgKiBAcGFyYW0gdGV4dHVyZSBUaGUgdGV4dHVyZSB0byB1c2UgYXMgdGhlIGFscGhhIG1hc2suXG5cdCAqIEBwYXJhbSB1c2VTZWNvbmRhcnlVViBJbmRpY2F0ZWQgd2hldGhlciBvciBub3QgdGhlIHNlY29uZGFyeSB1diBzZXQgZm9yIHRoZSBtYXNrLiBUaGlzIGFsbG93cyBtYXBwaW5nIGFscGhhIGluZGVwZW5kZW50bHkuXG5cdCAqL1xuXHRjb25zdHJ1Y3Rvcih0ZXh0dXJlOlRleHR1cmUyREJhc2UsIHVzZVNlY29uZGFyeVVWOmJvb2xlYW4gPSBmYWxzZSlcblx0e1xuXHRcdHN1cGVyKCk7XG5cblx0XHR0aGlzLl90ZXh0dXJlID0gdGV4dHVyZTtcblx0XHR0aGlzLl91c2VTZWNvbmRhcnlVViA9IHVzZVNlY29uZGFyeVVWO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgaUluaXRWTyhzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgbWV0aG9kVk86TWV0aG9kVk8pXG5cdHtcblx0XHRtZXRob2RWTy5uZWVkc1NlY29uZGFyeVVWID0gdGhpcy5fdXNlU2Vjb25kYXJ5VVY7XG5cdFx0bWV0aG9kVk8ubmVlZHNVViA9ICF0aGlzLl91c2VTZWNvbmRhcnlVVjtcblx0fVxuXG5cdC8qKlxuXHQgKiBJbmRpY2F0ZWQgd2hldGhlciBvciBub3QgdGhlIHNlY29uZGFyeSB1diBzZXQgZm9yIHRoZSBtYXNrLiBUaGlzIGFsbG93cyBtYXBwaW5nIGFscGhhIGluZGVwZW5kZW50bHksIGZvclxuXHQgKiBpbnN0YW5jZSB0byB0aWxlIHRoZSBtYWluIHRleHR1cmUgYW5kIG5vcm1hbCBtYXAgd2hpbGUgcHJvdmlkaW5nIHVudGlsZWQgYWxwaGEsIGZvciBleGFtcGxlIHRvIGRlZmluZSB0aGVcblx0ICogdHJhbnNwYXJlbmN5IG92ZXIgYSB0aWxlZCB3YXRlciBzdXJmYWNlLlxuXHQgKi9cblx0cHVibGljIGdldCB1c2VTZWNvbmRhcnlVVigpOmJvb2xlYW5cblx0e1xuXHRcdHJldHVybiB0aGlzLl91c2VTZWNvbmRhcnlVVjtcblx0fVxuXG5cdHB1YmxpYyBzZXQgdXNlU2Vjb25kYXJ5VVYodmFsdWU6Ym9vbGVhbilcblx0e1xuXHRcdGlmICh0aGlzLl91c2VTZWNvbmRhcnlVViA9PSB2YWx1ZSlcblx0XHRcdHJldHVybjtcblx0XHR0aGlzLl91c2VTZWNvbmRhcnlVViA9IHZhbHVlO1xuXHRcdHRoaXMuaUludmFsaWRhdGVTaGFkZXJQcm9ncmFtKCk7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIHRleHR1cmUgdG8gdXNlIGFzIHRoZSBhbHBoYSBtYXNrLlxuXHQgKi9cblx0cHVibGljIGdldCB0ZXh0dXJlKCk6VGV4dHVyZTJEQmFzZVxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3RleHR1cmU7XG5cdH1cblxuXHRwdWJsaWMgc2V0IHRleHR1cmUodmFsdWU6VGV4dHVyZTJEQmFzZSlcblx0e1xuXHRcdHRoaXMuX3RleHR1cmUgPSB2YWx1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGlBY3RpdmF0ZShzaGFkZXJPYmplY3Q6U2hhZGVyTGlnaHRpbmdPYmplY3QsIG1ldGhvZFZPOk1ldGhvZFZPLCBzdGFnZTpTdGFnZSlcblx0e1xuXHRcdHN0YWdlLmNvbnRleHQuYWN0aXZhdGVUZXh0dXJlKG1ldGhvZFZPLnRleHR1cmVzSW5kZXgsIHRoaXMuX3RleHR1cmUpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgaUdldEZyYWdtZW50Q29kZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgbWV0aG9kVk86TWV0aG9kVk8sIHRhcmdldFJlZzpTaGFkZXJSZWdpc3RlckVsZW1lbnQsIHJlZ2lzdGVyQ2FjaGU6U2hhZGVyUmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzOlNoYWRlclJlZ2lzdGVyRGF0YSk6c3RyaW5nXG5cdHtcblx0XHR2YXIgdGV4dHVyZVJlZzpTaGFkZXJSZWdpc3RlckVsZW1lbnQgPSByZWdpc3RlckNhY2hlLmdldEZyZWVUZXh0dXJlUmVnKCk7XG5cdFx0dmFyIHRlbXA6U2hhZGVyUmVnaXN0ZXJFbGVtZW50ID0gcmVnaXN0ZXJDYWNoZS5nZXRGcmVlRnJhZ21lbnRWZWN0b3JUZW1wKCk7XG5cdFx0dmFyIHV2UmVnOlNoYWRlclJlZ2lzdGVyRWxlbWVudCA9IHRoaXMuX3VzZVNlY29uZGFyeVVWPyBzaGFyZWRSZWdpc3RlcnMuc2Vjb25kYXJ5VVZWYXJ5aW5nIDogc2hhcmVkUmVnaXN0ZXJzLnV2VmFyeWluZztcblx0XHRtZXRob2RWTy50ZXh0dXJlc0luZGV4ID0gdGV4dHVyZVJlZy5pbmRleDtcblxuXHRcdHJldHVybiBTaGFkZXJDb21waWxlckhlbHBlci5nZXRUZXgyRFNhbXBsZUNvZGUodGVtcCwgc2hhcmVkUmVnaXN0ZXJzLCB0ZXh0dXJlUmVnLCB0aGlzLl90ZXh0dXJlLCBzaGFkZXJPYmplY3QudXNlU21vb3RoVGV4dHVyZXMsIHNoYWRlck9iamVjdC5yZXBlYXRUZXh0dXJlcywgc2hhZGVyT2JqZWN0LnVzZU1pcG1hcHBpbmcsIHV2UmVnKSArXG5cdFx0XHRcIm11bCBcIiArIHRhcmdldFJlZyArIFwiLCBcIiArIHRhcmdldFJlZyArIFwiLCBcIiArIHRlbXAgKyBcIi54XFxuXCI7XG5cdH1cbn1cblxuZXhwb3J0ID0gRWZmZWN0QWxwaGFNYXNrTWV0aG9kOyJdfQ==