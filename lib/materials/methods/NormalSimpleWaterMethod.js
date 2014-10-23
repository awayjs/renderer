var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var NormalBasicMethod = require("awayjs-stagegl/lib/materials/methods/NormalBasicMethod");
var ShaderCompilerHelper = require("awayjs-stagegl/lib/materials/utils/ShaderCompilerHelper");
/**
 * NormalSimpleWaterMethod provides a basic normal map method to create water ripples by translating two wave normal maps.
 */
var NormalSimpleWaterMethod = (function (_super) {
    __extends(NormalSimpleWaterMethod, _super);
    /**
     * Creates a new NormalSimpleWaterMethod object.
     * @param waveMap1 A normal map containing one layer of a wave structure.
     * @param waveMap2 A normal map containing a second layer of a wave structure.
     */
    function NormalSimpleWaterMethod(waveMap1, waveMap2) {
        _super.call(this);
        this._useSecondNormalMap = false;
        this._water1OffsetX = 0;
        this._water1OffsetY = 0;
        this._water2OffsetX = 0;
        this._water2OffsetY = 0;
        this.normalMap = waveMap1;
        this.secondaryNormalMap = waveMap2;
    }
    /**
     * @inheritDoc
     */
    NormalSimpleWaterMethod.prototype.iInitConstants = function (shaderObject, methodVO) {
        var index = methodVO.fragmentConstantsIndex;
        var data = shaderObject.fragmentConstantData;
        data[index] = .5;
        data[index + 1] = 0;
        data[index + 2] = 0;
        data[index + 3] = 1;
    };
    /**
     * @inheritDoc
     */
    NormalSimpleWaterMethod.prototype.iInitVO = function (shaderObject, methodVO) {
        _super.prototype.iInitVO.call(this, shaderObject, methodVO);
        this._useSecondNormalMap = this.normalMap != this.secondaryNormalMap;
    };
    Object.defineProperty(NormalSimpleWaterMethod.prototype, "water1OffsetX", {
        /**
         * The translation of the first wave layer along the X-axis.
         */
        get: function () {
            return this._water1OffsetX;
        },
        set: function (value) {
            this._water1OffsetX = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NormalSimpleWaterMethod.prototype, "water1OffsetY", {
        /**
         * The translation of the first wave layer along the Y-axis.
         */
        get: function () {
            return this._water1OffsetY;
        },
        set: function (value) {
            this._water1OffsetY = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NormalSimpleWaterMethod.prototype, "water2OffsetX", {
        /**
         * The translation of the second wave layer along the X-axis.
         */
        get: function () {
            return this._water2OffsetX;
        },
        set: function (value) {
            this._water2OffsetX = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NormalSimpleWaterMethod.prototype, "water2OffsetY", {
        /**
         * The translation of the second wave layer along the Y-axis.
         */
        get: function () {
            return this._water2OffsetY;
        },
        set: function (value) {
            this._water2OffsetY = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NormalSimpleWaterMethod.prototype, "secondaryNormalMap", {
        /**
         * A second normal map that will be combined with the first to create a wave-like animation pattern.
         */
        get: function () {
            return this._texture2;
        },
        set: function (value) {
            this._texture2 = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    NormalSimpleWaterMethod.prototype.iCleanCompilationData = function () {
        _super.prototype.iCleanCompilationData.call(this);
        this._normalTextureRegister2 = null;
    };
    /**
     * @inheritDoc
     */
    NormalSimpleWaterMethod.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this._texture2 = null;
    };
    /**
     * @inheritDoc
     */
    NormalSimpleWaterMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
        _super.prototype.iActivate.call(this, shaderObject, methodVO, stage);
        var data = shaderObject.fragmentConstantData;
        var index = methodVO.fragmentConstantsIndex;
        data[index + 4] = this._water1OffsetX;
        data[index + 5] = this._water1OffsetY;
        data[index + 6] = this._water2OffsetX;
        data[index + 7] = this._water2OffsetY;
        //if (this._useSecondNormalMap >= 0)
        if (this._useSecondNormalMap)
            stage.context.activateTexture(methodVO.texturesIndex + 1, this._texture2);
    };
    /**
     * @inheritDoc
     */
    NormalSimpleWaterMethod.prototype.iGetFragmentCode = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
        var temp = registerCache.getFreeFragmentVectorTemp();
        var dataReg = registerCache.getFreeFragmentConstant();
        var dataReg2 = registerCache.getFreeFragmentConstant();
        this._pNormalTextureRegister = registerCache.getFreeTextureReg();
        this._normalTextureRegister2 = this._useSecondNormalMap ? registerCache.getFreeTextureReg() : this._pNormalTextureRegister;
        methodVO.texturesIndex = this._pNormalTextureRegister.index;
        methodVO.fragmentConstantsIndex = dataReg.index * 4;
        return "add " + temp + ", " + sharedRegisters.uvVarying + ", " + dataReg2 + ".xyxy\n" + ShaderCompilerHelper.getTex2DSampleCode(targetReg, sharedRegisters, this._pNormalTextureRegister, this.normalMap, shaderObject.useSmoothTextures, shaderObject.repeatTextures, shaderObject.useMipmapping, temp) + "add " + temp + ", " + sharedRegisters.uvVarying + ", " + dataReg2 + ".zwzw\n" + ShaderCompilerHelper.getTex2DSampleCode(temp, sharedRegisters, this._normalTextureRegister2, this._texture2, shaderObject.useSmoothTextures, shaderObject.repeatTextures, shaderObject.useMipmapping, temp) + "add " + targetReg + ", " + targetReg + ", " + temp + "		\n" + "mul " + targetReg + ", " + targetReg + ", " + dataReg + ".x	\n" + "sub " + targetReg + ".xyz, " + targetReg + ".xyz, " + sharedRegisters.commons + ".xxx	\n" + "nrm " + targetReg + ".xyz, " + targetReg + ".xyz							\n";
    };
    return NormalSimpleWaterMethod;
})(NormalBasicMethod);
module.exports = NormalSimpleWaterMethod;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvbWV0aG9kcy9ub3JtYWxzaW1wbGV3YXRlcm1ldGhvZC50cyJdLCJuYW1lcyI6WyJOb3JtYWxTaW1wbGVXYXRlck1ldGhvZCIsIk5vcm1hbFNpbXBsZVdhdGVyTWV0aG9kLmNvbnN0cnVjdG9yIiwiTm9ybWFsU2ltcGxlV2F0ZXJNZXRob2QuaUluaXRDb25zdGFudHMiLCJOb3JtYWxTaW1wbGVXYXRlck1ldGhvZC5pSW5pdFZPIiwiTm9ybWFsU2ltcGxlV2F0ZXJNZXRob2Qud2F0ZXIxT2Zmc2V0WCIsIk5vcm1hbFNpbXBsZVdhdGVyTWV0aG9kLndhdGVyMU9mZnNldFkiLCJOb3JtYWxTaW1wbGVXYXRlck1ldGhvZC53YXRlcjJPZmZzZXRYIiwiTm9ybWFsU2ltcGxlV2F0ZXJNZXRob2Qud2F0ZXIyT2Zmc2V0WSIsIk5vcm1hbFNpbXBsZVdhdGVyTWV0aG9kLnNlY29uZGFyeU5vcm1hbE1hcCIsIk5vcm1hbFNpbXBsZVdhdGVyTWV0aG9kLmlDbGVhbkNvbXBpbGF0aW9uRGF0YSIsIk5vcm1hbFNpbXBsZVdhdGVyTWV0aG9kLmRpc3Bvc2UiLCJOb3JtYWxTaW1wbGVXYXRlck1ldGhvZC5pQWN0aXZhdGUiLCJOb3JtYWxTaW1wbGVXYXRlck1ldGhvZC5pR2V0RnJhZ21lbnRDb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFTQSxJQUFPLGlCQUFpQixXQUFjLHdEQUF3RCxDQUFDLENBQUM7QUFDaEcsSUFBTyxvQkFBb0IsV0FBYyx5REFBeUQsQ0FBQyxDQUFDO0FBRXBHLEFBR0E7O0dBREc7SUFDRyx1QkFBdUI7SUFBU0EsVUFBaENBLHVCQUF1QkEsVUFBMEJBO0lBVXREQTs7OztPQUlHQTtJQUNIQSxTQWZLQSx1QkFBdUJBLENBZWhCQSxRQUFzQkEsRUFBRUEsUUFBc0JBO1FBRXpEQyxpQkFBT0EsQ0FBQ0E7UUFiREEsd0JBQW1CQSxHQUFXQSxLQUFLQSxDQUFDQTtRQUNwQ0EsbUJBQWNBLEdBQVVBLENB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QUFJQSxDQUFDQSxHQUNoTkEsTUFBTUEsR0FBR0EsSUFBSUEsR0FBR0EsSUFBSUEsR0FBR0EsZUFBZUEsQ0FBQ0EsU0FBU0EsR0FBR0EsSUFBSUEsR0FBR0EsUUFBUUEsR0FBR0EsU0FBU0EsR0FDOUVBLG9CQUFvQkEsQ0FBQ0Esa0JBQWtCQSxDQUFDQSxJQUFJQSxFQUFFQSxlQUFlQSxFQUFFQSxJQUFJQSxDQUFDQSx1QkFBdUJBLEVBQUVBLElBQUlBLENBQUNBLFNBQVNBLEVBQUVBLFlBQVlBLENBQUNBLGlCQUFpQkEsRUFBRUEsWUFBWUEsQ0FBQ0EsY0FBY0EsRUFBRUEsWUFBWUEsQ0FBQ0EsYUFBYUEsRUFBRUEsSUFBSUEsQ0FBQ0EsR0FDM01BLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLElBQUlBLEdBQUdBLFNBQVNBLEdBQUdBLElBQUlBLEdBQUdBLElBQUlBLEdBQUdBLE1BQU1BLEdBQzVEQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxJQUFJQSxHQUFHQSxTQUFTQSxHQUFHQSxJQUFJQSxHQUFHQSxPQUFPQSxHQUFHQSxPQUFPQSxHQUNoRUEsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsUUFBUUEsR0FBR0EsU0FBU0EsR0FBR0EsUUFBUUEsR0FBR0EsZUFBZUEsQ0FBQ0EsT0FBT0EsR0FBR0EsU0FBU0EsR0FDMUZBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLFFBQVFBLEdBQUdBLFNBQVNBLEdBQUdBLGVBQWVBLENBQUNBO0lBQzlEQSxDQUFDQTtJQUNGWiw4QkFBQ0E7QUFBREEsQ0EzS0EsQUEyS0NBLEVBM0txQyxpQkFBaUIsRUEyS3REO0FBRUQsQUFBaUMsaUJBQXhCLHVCQUF1QixDQUFDIiwiZmlsZSI6Im1hdGVyaWFscy9tZXRob2RzL05vcm1hbFNpbXBsZVdhdGVyTWV0aG9kLmpzIiwic291cmNlUm9vdCI6Ii4uLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBUZXh0dXJlMkRCYXNlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi90ZXh0dXJlcy9UZXh0dXJlMkRCYXNlXCIpO1xuXG5pbXBvcnQgU3RhZ2VcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9iYXNlL1N0YWdlXCIpO1xuaW1wb3J0IElDb250ZXh0U3RhZ2VHTFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvYmFzZS9JQ29udGV4dFN0YWdlR0xcIik7XG5pbXBvcnQgTWV0aG9kVk9cdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9tYXRlcmlhbHMvY29tcGlsYXRpb24vTWV0aG9kVk9cIik7XG5pbXBvcnQgU2hhZGVyT2JqZWN0QmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvbWF0ZXJpYWxzL2NvbXBpbGF0aW9uL1NoYWRlck9iamVjdEJhc2VcIik7XG5pbXBvcnQgU2hhZGVyUmVnaXN0ZXJDYWNoZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL21hdGVyaWFscy9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckNhY2hlXCIpO1xuaW1wb3J0IFNoYWRlclJlZ2lzdGVyRGF0YVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL21hdGVyaWFscy9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckRhdGFcIik7XG5pbXBvcnQgU2hhZGVyUmVnaXN0ZXJFbGVtZW50XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL21hdGVyaWFscy9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckVsZW1lbnRcIik7XG5pbXBvcnQgTm9ybWFsQmFzaWNNZXRob2RcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9tYXRlcmlhbHMvbWV0aG9kcy9Ob3JtYWxCYXNpY01ldGhvZFwiKTtcbmltcG9ydCBTaGFkZXJDb21waWxlckhlbHBlclx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL21hdGVyaWFscy91dGlscy9TaGFkZXJDb21waWxlckhlbHBlclwiKTtcblxuLyoqXG4gKiBOb3JtYWxTaW1wbGVXYXRlck1ldGhvZCBwcm92aWRlcyBhIGJhc2ljIG5vcm1hbCBtYXAgbWV0aG9kIHRvIGNyZWF0ZSB3YXRlciByaXBwbGVzIGJ5IHRyYW5zbGF0aW5nIHR3byB3YXZlIG5vcm1hbCBtYXBzLlxuICovXG5jbGFzcyBOb3JtYWxTaW1wbGVXYXRlck1ldGhvZCBleHRlbmRzIE5vcm1hbEJhc2ljTWV0aG9kXG57XG5cdHByaXZhdGUgX3RleHR1cmUyOlRleHR1cmUyREJhc2U7XG5cdHByaXZhdGUgX25vcm1hbFRleHR1cmVSZWdpc3RlcjI6U2hhZGVyUmVnaXN0ZXJFbGVtZW50O1xuXHRwcml2YXRlIF91c2VTZWNvbmROb3JtYWxNYXA6Ym9vbGVhbiA9IGZhbHNlO1xuXHRwcml2YXRlIF93YXRlcjFPZmZzZXRYOm51bWJlciA9IDA7XG5cdHByaXZhdGUgX3dhdGVyMU9mZnNldFk6bnVtYmVyID0gMDtcblx0cHJpdmF0ZSBfd2F0ZXIyT2Zmc2V0WDpudW1iZXIgPSAwO1xuXHRwcml2YXRlIF93YXRlcjJPZmZzZXRZOm51bWJlciA9IDA7XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBuZXcgTm9ybWFsU2ltcGxlV2F0ZXJNZXRob2Qgb2JqZWN0LlxuXHQgKiBAcGFyYW0gd2F2ZU1hcDEgQSBub3JtYWwgbWFwIGNvbnRhaW5pbmcgb25lIGxheWVyIG9mIGEgd2F2ZSBzdHJ1Y3R1cmUuXG5cdCAqIEBwYXJhbSB3YXZlTWFwMiBBIG5vcm1hbCBtYXAgY29udGFpbmluZyBhIHNlY29uZCBsYXllciBvZiBhIHdhdmUgc3RydWN0dXJlLlxuXHQgKi9cblx0Y29uc3RydWN0b3Iod2F2ZU1hcDE6VGV4dHVyZTJEQmFzZSwgd2F2ZU1hcDI6VGV4dHVyZTJEQmFzZSlcblx0e1xuXHRcdHN1cGVyKCk7XG5cdFx0dGhpcy5ub3JtYWxNYXAgPSB3YXZlTWFwMTtcblx0XHR0aGlzLnNlY29uZGFyeU5vcm1hbE1hcCA9IHdhdmVNYXAyO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgaUluaXRDb25zdGFudHMoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIG1ldGhvZFZPOk1ldGhvZFZPKVxuXHR7XG5cdFx0dmFyIGluZGV4Om51bWJlciA9IG1ldGhvZFZPLmZyYWdtZW50Q29uc3RhbnRzSW5kZXg7XG5cdFx0dmFyIGRhdGE6QXJyYXk8bnVtYmVyPiA9IHNoYWRlck9iamVjdC5mcmFnbWVudENvbnN0YW50RGF0YTtcblx0XHRkYXRhW2luZGV4XSA9IC41O1xuXHRcdGRhdGFbaW5kZXggKyAxXSA9IDA7XG5cdFx0ZGF0YVtpbmRleCArIDJdID0gMDtcblx0XHRkYXRhW2luZGV4ICsgM10gPSAxO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgaUluaXRWTyhzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgbWV0aG9kVk86TWV0aG9kVk8pXG5cdHtcblx0XHRzdXBlci5pSW5pdFZPKHNoYWRlck9iamVjdCwgbWV0aG9kVk8pO1xuXG5cdFx0dGhpcy5fdXNlU2Vjb25kTm9ybWFsTWFwID0gdGhpcy5ub3JtYWxNYXAgIT0gdGhpcy5zZWNvbmRhcnlOb3JtYWxNYXA7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIHRyYW5zbGF0aW9uIG9mIHRoZSBmaXJzdCB3YXZlIGxheWVyIGFsb25nIHRoZSBYLWF4aXMuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IHdhdGVyMU9mZnNldFgoKTpudW1iZXJcblx0e1xuXHRcdHJldHVybiB0aGlzLl93YXRlcjFPZmZzZXRYO1xuXHR9XG5cblx0cHVibGljIHNldCB3YXRlcjFPZmZzZXRYKHZhbHVlOm51bWJlcilcblx0e1xuXHRcdHRoaXMuX3dhdGVyMU9mZnNldFggPSB2YWx1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgdHJhbnNsYXRpb24gb2YgdGhlIGZpcnN0IHdhdmUgbGF5ZXIgYWxvbmcgdGhlIFktYXhpcy5cblx0ICovXG5cdHB1YmxpYyBnZXQgd2F0ZXIxT2Zmc2V0WSgpOm51bWJlclxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3dhdGVyMU9mZnNldFk7XG5cdH1cblxuXHRwdWJsaWMgc2V0IHdhdGVyMU9mZnNldFkodmFsdWU6bnVtYmVyKVxuXHR7XG5cdFx0dGhpcy5fd2F0ZXIxT2Zmc2V0WSA9IHZhbHVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSB0cmFuc2xhdGlvbiBvZiB0aGUgc2Vjb25kIHdhdmUgbGF5ZXIgYWxvbmcgdGhlIFgtYXhpcy5cblx0ICovXG5cdHB1YmxpYyBnZXQgd2F0ZXIyT2Zmc2V0WCgpOm51bWJlclxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3dhdGVyMk9mZnNldFg7XG5cdH1cblxuXHRwdWJsaWMgc2V0IHdhdGVyMk9mZnNldFgodmFsdWU6bnVtYmVyKVxuXHR7XG5cdFx0dGhpcy5fd2F0ZXIyT2Zmc2V0WCA9IHZhbHVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSB0cmFuc2xhdGlvbiBvZiB0aGUgc2Vjb25kIHdhdmUgbGF5ZXIgYWxvbmcgdGhlIFktYXhpcy5cblx0ICovXG5cdHB1YmxpYyBnZXQgd2F0ZXIyT2Zmc2V0WSgpOm51bWJlclxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3dhdGVyMk9mZnNldFk7XG5cdH1cblxuXHRwdWJsaWMgc2V0IHdhdGVyMk9mZnNldFkodmFsdWU6bnVtYmVyKVxuXHR7XG5cdFx0dGhpcy5fd2F0ZXIyT2Zmc2V0WSA9IHZhbHVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIEEgc2Vjb25kIG5vcm1hbCBtYXAgdGhhdCB3aWxsIGJlIGNvbWJpbmVkIHdpdGggdGhlIGZpcnN0IHRvIGNyZWF0ZSBhIHdhdmUtbGlrZSBhbmltYXRpb24gcGF0dGVybi5cblx0ICovXG5cdHB1YmxpYyBnZXQgc2Vjb25kYXJ5Tm9ybWFsTWFwKCk6VGV4dHVyZTJEQmFzZVxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3RleHR1cmUyO1xuXHR9XG5cblx0cHVibGljIHNldCBzZWNvbmRhcnlOb3JtYWxNYXAodmFsdWU6VGV4dHVyZTJEQmFzZSlcblx0e1xuXHRcdHRoaXMuX3RleHR1cmUyID0gdmFsdWU7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBpQ2xlYW5Db21waWxhdGlvbkRhdGEoKVxuXHR7XG5cdFx0c3VwZXIuaUNsZWFuQ29tcGlsYXRpb25EYXRhKCk7XG5cdFx0dGhpcy5fbm9ybWFsVGV4dHVyZVJlZ2lzdGVyMiA9IG51bGw7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBkaXNwb3NlKClcblx0e1xuXHRcdHN1cGVyLmRpc3Bvc2UoKTtcblx0XHR0aGlzLl90ZXh0dXJlMiA9IG51bGw7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBpQWN0aXZhdGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIG1ldGhvZFZPOk1ldGhvZFZPLCBzdGFnZTpTdGFnZSlcblx0e1xuXHRcdHN1cGVyLmlBY3RpdmF0ZShzaGFkZXJPYmplY3QsIG1ldGhvZFZPLCBzdGFnZSk7XG5cblx0XHR2YXIgZGF0YTpBcnJheTxudW1iZXI+ID0gc2hhZGVyT2JqZWN0LmZyYWdtZW50Q29uc3RhbnREYXRhO1xuXHRcdHZhciBpbmRleDpudW1iZXIgPSBtZXRob2RWTy5mcmFnbWVudENvbnN0YW50c0luZGV4O1xuXG5cdFx0ZGF0YVtpbmRleCArIDRdID0gdGhpcy5fd2F0ZXIxT2Zmc2V0WDtcblx0XHRkYXRhW2luZGV4ICsgNV0gPSB0aGlzLl93YXRlcjFPZmZzZXRZO1xuXHRcdGRhdGFbaW5kZXggKyA2XSA9IHRoaXMuX3dhdGVyMk9mZnNldFg7XG5cdFx0ZGF0YVtpbmRleCArIDddID0gdGhpcy5fd2F0ZXIyT2Zmc2V0WTtcblxuXHRcdC8vaWYgKHRoaXMuX3VzZVNlY29uZE5vcm1hbE1hcCA+PSAwKVxuXHRcdGlmICh0aGlzLl91c2VTZWNvbmROb3JtYWxNYXApXG5cdFx0XHQoPElDb250ZXh0U3RhZ2VHTD4gc3RhZ2UuY29udGV4dCkuYWN0aXZhdGVUZXh0dXJlKG1ldGhvZFZPLnRleHR1cmVzSW5kZXggKyAxLCB0aGlzLl90ZXh0dXJlMik7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBpR2V0RnJhZ21lbnRDb2RlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCBtZXRob2RWTzpNZXRob2RWTywgdGFyZ2V0UmVnOlNoYWRlclJlZ2lzdGVyRWxlbWVudCwgcmVnaXN0ZXJDYWNoZTpTaGFkZXJSZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnM6U2hhZGVyUmVnaXN0ZXJEYXRhKTpzdHJpbmdcblx0e1xuXHRcdHZhciB0ZW1wOlNoYWRlclJlZ2lzdGVyRWxlbWVudCA9IHJlZ2lzdGVyQ2FjaGUuZ2V0RnJlZUZyYWdtZW50VmVjdG9yVGVtcCgpO1xuXHRcdHZhciBkYXRhUmVnOlNoYWRlclJlZ2lzdGVyRWxlbWVudCA9IHJlZ2lzdGVyQ2FjaGUuZ2V0RnJlZUZyYWdtZW50Q29uc3RhbnQoKTtcblx0XHR2YXIgZGF0YVJlZzI6U2hhZGVyUmVnaXN0ZXJFbGVtZW50ID0gcmVnaXN0ZXJDYWNoZS5nZXRGcmVlRnJhZ21lbnRDb25zdGFudCgpO1xuXHRcdHRoaXMuX3BOb3JtYWxUZXh0dXJlUmVnaXN0ZXIgPSByZWdpc3RlckNhY2hlLmdldEZyZWVUZXh0dXJlUmVnKCk7XG5cdFx0dGhpcy5fbm9ybWFsVGV4dHVyZVJlZ2lzdGVyMiA9IHRoaXMuX3VzZVNlY29uZE5vcm1hbE1hcD8gcmVnaXN0ZXJDYWNoZS5nZXRGcmVlVGV4dHVyZVJlZygpOnRoaXMuX3BOb3JtYWxUZXh0dXJlUmVnaXN0ZXI7XG5cdFx0bWV0aG9kVk8udGV4dHVyZXNJbmRleCA9IHRoaXMuX3BOb3JtYWxUZXh0dXJlUmVnaXN0ZXIuaW5kZXg7XG5cblx0XHRtZXRob2RWTy5mcmFnbWVudENvbnN0YW50c0luZGV4ID0gZGF0YVJlZy5pbmRleCo0O1xuXG5cdFx0cmV0dXJuIFwiYWRkIFwiICsgdGVtcCArIFwiLCBcIiArIHNoYXJlZFJlZ2lzdGVycy51dlZhcnlpbmcgKyBcIiwgXCIgKyBkYXRhUmVnMiArIFwiLnh5eHlcXG5cIiArXG5cdFx0XHRTaGFkZXJDb21waWxlckhlbHBlci5nZXRUZXgyRFNhbXBsZUNvZGUodGFyZ2V0UmVnLCBzaGFyZWRSZWdpc3RlcnMsIHRoaXMuX3BOb3JtYWxUZXh0dXJlUmVnaXN0ZXIsIHRoaXMubm9ybWFsTWFwLCBzaGFkZXJPYmplY3QudXNlU21vb3RoVGV4dHVyZXMsIHNoYWRlck9iamVjdC5yZXBlYXRUZXh0dXJlcywgc2hhZGVyT2JqZWN0LnVzZU1pcG1hcHBpbmcsIHRlbXApICtcblx0XHRcdFwiYWRkIFwiICsgdGVtcCArIFwiLCBcIiArIHNoYXJlZFJlZ2lzdGVycy51dlZhcnlpbmcgKyBcIiwgXCIgKyBkYXRhUmVnMiArIFwiLnp3endcXG5cIiArXG5cdFx0XHRTaGFkZXJDb21waWxlckhlbHBlci5nZXRUZXgyRFNhbXBsZUNvZGUodGVtcCwgc2hhcmVkUmVnaXN0ZXJzLCB0aGlzLl9ub3JtYWxUZXh0dXJlUmVnaXN0ZXIyLCB0aGlzLl90ZXh0dXJlMiwgc2hhZGVyT2JqZWN0LnVzZVNtb290aFRleHR1cmVzLCBzaGFkZXJPYmplY3QucmVwZWF0VGV4dHVyZXMsIHNoYWRlck9iamVjdC51c2VNaXBtYXBwaW5nLCB0ZW1wKSArXG5cdFx0XHRcImFkZCBcIiArIHRhcmdldFJlZyArIFwiLCBcIiArIHRhcmdldFJlZyArIFwiLCBcIiArIHRlbXAgKyBcIlx0XHRcXG5cIiArXG5cdFx0XHRcIm11bCBcIiArIHRhcmdldFJlZyArIFwiLCBcIiArIHRhcmdldFJlZyArIFwiLCBcIiArIGRhdGFSZWcgKyBcIi54XHRcXG5cIiArXG5cdFx0XHRcInN1YiBcIiArIHRhcmdldFJlZyArIFwiLnh5eiwgXCIgKyB0YXJnZXRSZWcgKyBcIi54eXosIFwiICsgc2hhcmVkUmVnaXN0ZXJzLmNvbW1vbnMgKyBcIi54eHhcdFxcblwiICtcblx0XHRcdFwibnJtIFwiICsgdGFyZ2V0UmVnICsgXCIueHl6LCBcIiArIHRhcmdldFJlZyArIFwiLnh5elx0XHRcdFx0XHRcdFx0XFxuXCI7XG5cdH1cbn1cblxuZXhwb3J0ID0gTm9ybWFsU2ltcGxlV2F0ZXJNZXRob2Q7Il19