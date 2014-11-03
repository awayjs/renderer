var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var NormalBasicMethod = require("awayjs-renderergl/lib/materials/methods/NormalBasicMethod");
var ShaderCompilerHelper = require("awayjs-renderergl/lib/materials/utils/ShaderCompilerHelper");
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
            stage.activateTexture(methodVO.texturesIndex + 1, this._texture2);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvbWV0aG9kcy9ub3JtYWxzaW1wbGV3YXRlcm1ldGhvZC50cyJdLCJuYW1lcyI6WyJOb3JtYWxTaW1wbGVXYXRlck1ldGhvZCIsIk5vcm1hbFNpbXBsZVdhdGVyTWV0aG9kLmNvbnN0cnVjdG9yIiwiTm9ybWFsU2ltcGxlV2F0ZXJNZXRob2QuaUluaXRDb25zdGFudHMiLCJOb3JtYWxTaW1wbGVXYXRlck1ldGhvZC5pSW5pdFZPIiwiTm9ybWFsU2ltcGxlV2F0ZXJNZXRob2Qud2F0ZXIxT2Zmc2V0WCIsIk5vcm1hbFNpbXBsZVdhdGVyTWV0aG9kLndhdGVyMU9mZnNldFkiLCJOb3JtYWxTaW1wbGVXYXRlck1ldGhvZC53YXRlcjJPZmZzZXRYIiwiTm9ybWFsU2ltcGxlV2F0ZXJNZXRob2Qud2F0ZXIyT2Zmc2V0WSIsIk5vcm1hbFNpbXBsZVdhdGVyTWV0aG9kLnNlY29uZGFyeU5vcm1hbE1hcCIsIk5vcm1hbFNpbXBsZVdhdGVyTWV0aG9kLmlDbGVhbkNvbXBpbGF0aW9uRGF0YSIsIk5vcm1hbFNpbXBsZVdhdGVyTWV0aG9kLmRpc3Bvc2UiLCJOb3JtYWxTaW1wbGVXYXRlck1ldGhvZC5pQWN0aXZhdGUiLCJOb3JtYWxTaW1wbGVXYXRlck1ldGhvZC5pR2V0RnJhZ21lbnRDb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFTQSxJQUFPLGlCQUFpQixXQUFjLDJEQUEyRCxDQUFDLENBQUM7QUFDbkcsSUFBTyxvQkFBb0IsV0FBYyw0REFBNEQsQ0FBQyxDQUFDO0FBRXZHLEFBR0E7O0dBREc7SUFDRyx1QkFBdUI7SUFBU0EsVUFBaENBLHVCQUF1QkEsVUFBMEJBO0lBVXREQTs7OztPQUlHQTtJQUNIQSxTQWZLQSx1QkFBdUJBLENBZWhCQSxRQUFzQkEsRUFBRUEsUUFBc0JBO1FBRXpEQyxpQkFBT0EsQ0FBQ0E7UUFiREEsd0JBQW1CQSxHQUFXQSxLQUFLQSxDQUFDQTtRQUNwQ0EsbUJBQWNBLEdBQVVBLENB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R0FDaE5BLE1BQU1BLEdBQUdBLElBQUlBLEdBQUdBLElBQUlBLEdBQUdBLGVBQWVBLENBQUNBLFNBQVNBLEdBQUdBLElBQUlBLEdBQUdBLFFBQVFBLEdBQUdBLFNBQVNBLEdBQzlFQSxvQkFBb0JBLENBQUNBLGtCQUFrQkEsQ0FBQ0EsSUFBSUEsRUFBRUEsZUFBZUEsRUFBRUEsSUFBSUEsQ0FBQ0EsdUJBQXVCQSxFQUFFQSxJQUFJQSxDQUFDQSxTQUFTQSxFQUFFQSxZQUFZQSxDQUFDQSxpQkFBaUJBLEVBQUVBLFlBQVlBLENBQUNBLGNBQWNBLEVBQUVBLFlBQVlBLENBQUNBLGFBQWFBLEVBQUVBLElBQUlBLENBQUNBLEdBQzNNQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxJQUFJQSxHQUFHQSxTQUFTQSxHQUFHQSxJQUFJQSxHQUFHQSxJQUFJQSxHQUFHQSxNQUFNQSxHQUM1REEsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsSUFBSUEsR0FBR0EsU0FBU0EsR0FBR0EsSUFBSUEsR0FBR0EsT0FBT0EsR0FBR0EsT0FBT0EsR0FDaEVBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLFFBQVFBLEdBQUdBLFNBQVNBLEdBQUdBLFFBQVFBLEdBQUdBLGVBQWVBLENBQUNBLE9BQU9BLEdBQUdBLFNBQVNBLEdBQzFGQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxRQUFRQSxHQUFHQSxTQUFTQSxHQUFHQSxlQUFlQSxDQUFDQTtJQUM5REEsQ0FBQ0E7SUFDRlosOEJBQUNBO0FBQURBLENBM0tBLEFBMktDQSxFQTNLcUMsaUJBQWlCLEVBMkt0RDtBQUVELEFBQWlDLGlCQUF4Qix1QkFBdUIsQ0FBQyIsImZpbGUiOiJtYXRlcmlhbHMvbWV0aG9kcy9Ob3JtYWxTaW1wbGVXYXRlck1ldGhvZC5qcyIsInNvdXJjZVJvb3QiOiIuLi8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVGV4dHVyZTJEQmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvdGV4dHVyZXMvVGV4dHVyZTJEQmFzZVwiKTtcblxuaW1wb3J0IFN0YWdlXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvYmFzZS9TdGFnZVwiKTtcblxuaW1wb3J0IE1ldGhvZFZPXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvbWF0ZXJpYWxzL2NvbXBpbGF0aW9uL01ldGhvZFZPXCIpO1xuaW1wb3J0IFNoYWRlck9iamVjdEJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL21hdGVyaWFscy9jb21waWxhdGlvbi9TaGFkZXJPYmplY3RCYXNlXCIpO1xuaW1wb3J0IFNoYWRlclJlZ2lzdGVyQ2FjaGVcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJDYWNoZVwiKTtcbmltcG9ydCBTaGFkZXJSZWdpc3RlckRhdGFcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJEYXRhXCIpO1xuaW1wb3J0IFNoYWRlclJlZ2lzdGVyRWxlbWVudFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJFbGVtZW50XCIpO1xuaW1wb3J0IE5vcm1hbEJhc2ljTWV0aG9kXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvbWF0ZXJpYWxzL21ldGhvZHMvTm9ybWFsQmFzaWNNZXRob2RcIik7XG5pbXBvcnQgU2hhZGVyQ29tcGlsZXJIZWxwZXJcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvdXRpbHMvU2hhZGVyQ29tcGlsZXJIZWxwZXJcIik7XG5cbi8qKlxuICogTm9ybWFsU2ltcGxlV2F0ZXJNZXRob2QgcHJvdmlkZXMgYSBiYXNpYyBub3JtYWwgbWFwIG1ldGhvZCB0byBjcmVhdGUgd2F0ZXIgcmlwcGxlcyBieSB0cmFuc2xhdGluZyB0d28gd2F2ZSBub3JtYWwgbWFwcy5cbiAqL1xuY2xhc3MgTm9ybWFsU2ltcGxlV2F0ZXJNZXRob2QgZXh0ZW5kcyBOb3JtYWxCYXNpY01ldGhvZFxue1xuXHRwcml2YXRlIF90ZXh0dXJlMjpUZXh0dXJlMkRCYXNlO1xuXHRwcml2YXRlIF9ub3JtYWxUZXh0dXJlUmVnaXN0ZXIyOlNoYWRlclJlZ2lzdGVyRWxlbWVudDtcblx0cHJpdmF0ZSBfdXNlU2Vjb25kTm9ybWFsTWFwOmJvb2xlYW4gPSBmYWxzZTtcblx0cHJpdmF0ZSBfd2F0ZXIxT2Zmc2V0WDpudW1iZXIgPSAwO1xuXHRwcml2YXRlIF93YXRlcjFPZmZzZXRZOm51bWJlciA9IDA7XG5cdHByaXZhdGUgX3dhdGVyMk9mZnNldFg6bnVtYmVyID0gMDtcblx0cHJpdmF0ZSBfd2F0ZXIyT2Zmc2V0WTpudW1iZXIgPSAwO1xuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IE5vcm1hbFNpbXBsZVdhdGVyTWV0aG9kIG9iamVjdC5cblx0ICogQHBhcmFtIHdhdmVNYXAxIEEgbm9ybWFsIG1hcCBjb250YWluaW5nIG9uZSBsYXllciBvZiBhIHdhdmUgc3RydWN0dXJlLlxuXHQgKiBAcGFyYW0gd2F2ZU1hcDIgQSBub3JtYWwgbWFwIGNvbnRhaW5pbmcgYSBzZWNvbmQgbGF5ZXIgb2YgYSB3YXZlIHN0cnVjdHVyZS5cblx0ICovXG5cdGNvbnN0cnVjdG9yKHdhdmVNYXAxOlRleHR1cmUyREJhc2UsIHdhdmVNYXAyOlRleHR1cmUyREJhc2UpXG5cdHtcblx0XHRzdXBlcigpO1xuXHRcdHRoaXMubm9ybWFsTWFwID0gd2F2ZU1hcDE7XG5cdFx0dGhpcy5zZWNvbmRhcnlOb3JtYWxNYXAgPSB3YXZlTWFwMjtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGlJbml0Q29uc3RhbnRzKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCBtZXRob2RWTzpNZXRob2RWTylcblx0e1xuXHRcdHZhciBpbmRleDpudW1iZXIgPSBtZXRob2RWTy5mcmFnbWVudENvbnN0YW50c0luZGV4O1xuXHRcdHZhciBkYXRhOkFycmF5PG51bWJlcj4gPSBzaGFkZXJPYmplY3QuZnJhZ21lbnRDb25zdGFudERhdGE7XG5cdFx0ZGF0YVtpbmRleF0gPSAuNTtcblx0XHRkYXRhW2luZGV4ICsgMV0gPSAwO1xuXHRcdGRhdGFbaW5kZXggKyAyXSA9IDA7XG5cdFx0ZGF0YVtpbmRleCArIDNdID0gMTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGlJbml0Vk8oc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIG1ldGhvZFZPOk1ldGhvZFZPKVxuXHR7XG5cdFx0c3VwZXIuaUluaXRWTyhzaGFkZXJPYmplY3QsIG1ldGhvZFZPKTtcblxuXHRcdHRoaXMuX3VzZVNlY29uZE5vcm1hbE1hcCA9IHRoaXMubm9ybWFsTWFwICE9IHRoaXMuc2Vjb25kYXJ5Tm9ybWFsTWFwO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSB0cmFuc2xhdGlvbiBvZiB0aGUgZmlyc3Qgd2F2ZSBsYXllciBhbG9uZyB0aGUgWC1heGlzLlxuXHQgKi9cblx0cHVibGljIGdldCB3YXRlcjFPZmZzZXRYKCk6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fd2F0ZXIxT2Zmc2V0WDtcblx0fVxuXG5cdHB1YmxpYyBzZXQgd2F0ZXIxT2Zmc2V0WCh2YWx1ZTpudW1iZXIpXG5cdHtcblx0XHR0aGlzLl93YXRlcjFPZmZzZXRYID0gdmFsdWU7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIHRyYW5zbGF0aW9uIG9mIHRoZSBmaXJzdCB3YXZlIGxheWVyIGFsb25nIHRoZSBZLWF4aXMuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IHdhdGVyMU9mZnNldFkoKTpudW1iZXJcblx0e1xuXHRcdHJldHVybiB0aGlzLl93YXRlcjFPZmZzZXRZO1xuXHR9XG5cblx0cHVibGljIHNldCB3YXRlcjFPZmZzZXRZKHZhbHVlOm51bWJlcilcblx0e1xuXHRcdHRoaXMuX3dhdGVyMU9mZnNldFkgPSB2YWx1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgdHJhbnNsYXRpb24gb2YgdGhlIHNlY29uZCB3YXZlIGxheWVyIGFsb25nIHRoZSBYLWF4aXMuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IHdhdGVyMk9mZnNldFgoKTpudW1iZXJcblx0e1xuXHRcdHJldHVybiB0aGlzLl93YXRlcjJPZmZzZXRYO1xuXHR9XG5cblx0cHVibGljIHNldCB3YXRlcjJPZmZzZXRYKHZhbHVlOm51bWJlcilcblx0e1xuXHRcdHRoaXMuX3dhdGVyMk9mZnNldFggPSB2YWx1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgdHJhbnNsYXRpb24gb2YgdGhlIHNlY29uZCB3YXZlIGxheWVyIGFsb25nIHRoZSBZLWF4aXMuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IHdhdGVyMk9mZnNldFkoKTpudW1iZXJcblx0e1xuXHRcdHJldHVybiB0aGlzLl93YXRlcjJPZmZzZXRZO1xuXHR9XG5cblx0cHVibGljIHNldCB3YXRlcjJPZmZzZXRZKHZhbHVlOm51bWJlcilcblx0e1xuXHRcdHRoaXMuX3dhdGVyMk9mZnNldFkgPSB2YWx1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBBIHNlY29uZCBub3JtYWwgbWFwIHRoYXQgd2lsbCBiZSBjb21iaW5lZCB3aXRoIHRoZSBmaXJzdCB0byBjcmVhdGUgYSB3YXZlLWxpa2UgYW5pbWF0aW9uIHBhdHRlcm4uXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IHNlY29uZGFyeU5vcm1hbE1hcCgpOlRleHR1cmUyREJhc2Vcblx0e1xuXHRcdHJldHVybiB0aGlzLl90ZXh0dXJlMjtcblx0fVxuXG5cdHB1YmxpYyBzZXQgc2Vjb25kYXJ5Tm9ybWFsTWFwKHZhbHVlOlRleHR1cmUyREJhc2UpXG5cdHtcblx0XHR0aGlzLl90ZXh0dXJlMiA9IHZhbHVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgaUNsZWFuQ29tcGlsYXRpb25EYXRhKClcblx0e1xuXHRcdHN1cGVyLmlDbGVhbkNvbXBpbGF0aW9uRGF0YSgpO1xuXHRcdHRoaXMuX25vcm1hbFRleHR1cmVSZWdpc3RlcjIgPSBudWxsO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgZGlzcG9zZSgpXG5cdHtcblx0XHRzdXBlci5kaXNwb3NlKCk7XG5cdFx0dGhpcy5fdGV4dHVyZTIgPSBudWxsO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgaUFjdGl2YXRlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCBtZXRob2RWTzpNZXRob2RWTywgc3RhZ2U6U3RhZ2UpXG5cdHtcblx0XHRzdXBlci5pQWN0aXZhdGUoc2hhZGVyT2JqZWN0LCBtZXRob2RWTywgc3RhZ2UpO1xuXG5cdFx0dmFyIGRhdGE6QXJyYXk8bnVtYmVyPiA9IHNoYWRlck9iamVjdC5mcmFnbWVudENvbnN0YW50RGF0YTtcblx0XHR2YXIgaW5kZXg6bnVtYmVyID0gbWV0aG9kVk8uZnJhZ21lbnRDb25zdGFudHNJbmRleDtcblxuXHRcdGRhdGFbaW5kZXggKyA0XSA9IHRoaXMuX3dhdGVyMU9mZnNldFg7XG5cdFx0ZGF0YVtpbmRleCArIDVdID0gdGhpcy5fd2F0ZXIxT2Zmc2V0WTtcblx0XHRkYXRhW2luZGV4ICsgNl0gPSB0aGlzLl93YXRlcjJPZmZzZXRYO1xuXHRcdGRhdGFbaW5kZXggKyA3XSA9IHRoaXMuX3dhdGVyMk9mZnNldFk7XG5cblx0XHQvL2lmICh0aGlzLl91c2VTZWNvbmROb3JtYWxNYXAgPj0gMClcblx0XHRpZiAodGhpcy5fdXNlU2Vjb25kTm9ybWFsTWFwKVxuXHRcdFx0c3RhZ2UuYWN0aXZhdGVUZXh0dXJlKG1ldGhvZFZPLnRleHR1cmVzSW5kZXggKyAxLCB0aGlzLl90ZXh0dXJlMik7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBpR2V0RnJhZ21lbnRDb2RlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCBtZXRob2RWTzpNZXRob2RWTywgdGFyZ2V0UmVnOlNoYWRlclJlZ2lzdGVyRWxlbWVudCwgcmVnaXN0ZXJDYWNoZTpTaGFkZXJSZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnM6U2hhZGVyUmVnaXN0ZXJEYXRhKTpzdHJpbmdcblx0e1xuXHRcdHZhciB0ZW1wOlNoYWRlclJlZ2lzdGVyRWxlbWVudCA9IHJlZ2lzdGVyQ2FjaGUuZ2V0RnJlZUZyYWdtZW50VmVjdG9yVGVtcCgpO1xuXHRcdHZhciBkYXRhUmVnOlNoYWRlclJlZ2lzdGVyRWxlbWVudCA9IHJlZ2lzdGVyQ2FjaGUuZ2V0RnJlZUZyYWdtZW50Q29uc3RhbnQoKTtcblx0XHR2YXIgZGF0YVJlZzI6U2hhZGVyUmVnaXN0ZXJFbGVtZW50ID0gcmVnaXN0ZXJDYWNoZS5nZXRGcmVlRnJhZ21lbnRDb25zdGFudCgpO1xuXHRcdHRoaXMuX3BOb3JtYWxUZXh0dXJlUmVnaXN0ZXIgPSByZWdpc3RlckNhY2hlLmdldEZyZWVUZXh0dXJlUmVnKCk7XG5cdFx0dGhpcy5fbm9ybWFsVGV4dHVyZVJlZ2lzdGVyMiA9IHRoaXMuX3VzZVNlY29uZE5vcm1hbE1hcD8gcmVnaXN0ZXJDYWNoZS5nZXRGcmVlVGV4dHVyZVJlZygpOnRoaXMuX3BOb3JtYWxUZXh0dXJlUmVnaXN0ZXI7XG5cdFx0bWV0aG9kVk8udGV4dHVyZXNJbmRleCA9IHRoaXMuX3BOb3JtYWxUZXh0dXJlUmVnaXN0ZXIuaW5kZXg7XG5cblx0XHRtZXRob2RWTy5mcmFnbWVudENvbnN0YW50c0luZGV4ID0gZGF0YVJlZy5pbmRleCo0O1xuXG5cdFx0cmV0dXJuIFwiYWRkIFwiICsgdGVtcCArIFwiLCBcIiArIHNoYXJlZFJlZ2lzdGVycy51dlZhcnlpbmcgKyBcIiwgXCIgKyBkYXRhUmVnMiArIFwiLnh5eHlcXG5cIiArXG5cdFx0XHRTaGFkZXJDb21waWxlckhlbHBlci5nZXRUZXgyRFNhbXBsZUNvZGUodGFyZ2V0UmVnLCBzaGFyZWRSZWdpc3RlcnMsIHRoaXMuX3BOb3JtYWxUZXh0dXJlUmVnaXN0ZXIsIHRoaXMubm9ybWFsTWFwLCBzaGFkZXJPYmplY3QudXNlU21vb3RoVGV4dHVyZXMsIHNoYWRlck9iamVjdC5yZXBlYXRUZXh0dXJlcywgc2hhZGVyT2JqZWN0LnVzZU1pcG1hcHBpbmcsIHRlbXApICtcblx0XHRcdFwiYWRkIFwiICsgdGVtcCArIFwiLCBcIiArIHNoYXJlZFJlZ2lzdGVycy51dlZhcnlpbmcgKyBcIiwgXCIgKyBkYXRhUmVnMiArIFwiLnp3endcXG5cIiArXG5cdFx0XHRTaGFkZXJDb21waWxlckhlbHBlci5nZXRUZXgyRFNhbXBsZUNvZGUodGVtcCwgc2hhcmVkUmVnaXN0ZXJzLCB0aGlzLl9ub3JtYWxUZXh0dXJlUmVnaXN0ZXIyLCB0aGlzLl90ZXh0dXJlMiwgc2hhZGVyT2JqZWN0LnVzZVNtb290aFRleHR1cmVzLCBzaGFkZXJPYmplY3QucmVwZWF0VGV4dHVyZXMsIHNoYWRlck9iamVjdC51c2VNaXBtYXBwaW5nLCB0ZW1wKSArXG5cdFx0XHRcImFkZCBcIiArIHRhcmdldFJlZyArIFwiLCBcIiArIHRhcmdldFJlZyArIFwiLCBcIiArIHRlbXAgKyBcIlx0XHRcXG5cIiArXG5cdFx0XHRcIm11bCBcIiArIHRhcmdldFJlZyArIFwiLCBcIiArIHRhcmdldFJlZyArIFwiLCBcIiArIGRhdGFSZWcgKyBcIi54XHRcXG5cIiArXG5cdFx0XHRcInN1YiBcIiArIHRhcmdldFJlZyArIFwiLnh5eiwgXCIgKyB0YXJnZXRSZWcgKyBcIi54eXosIFwiICsgc2hhcmVkUmVnaXN0ZXJzLmNvbW1vbnMgKyBcIi54eHhcdFxcblwiICtcblx0XHRcdFwibnJtIFwiICsgdGFyZ2V0UmVnICsgXCIueHl6LCBcIiArIHRhcmdldFJlZyArIFwiLnh5elx0XHRcdFx0XHRcdFx0XFxuXCI7XG5cdH1cbn1cblxuZXhwb3J0ID0gTm9ybWFsU2ltcGxlV2F0ZXJNZXRob2Q7Il19