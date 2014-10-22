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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1hdGVyaWFscy9tZXRob2RzL25vcm1hbHNpbXBsZXdhdGVybWV0aG9kLnRzIl0sIm5hbWVzIjpbIk5vcm1hbFNpbXBsZVdhdGVyTWV0aG9kIiwiTm9ybWFsU2ltcGxlV2F0ZXJNZXRob2QuY29uc3RydWN0b3IiLCJOb3JtYWxTaW1wbGVXYXRlck1ldGhvZC5pSW5pdENvbnN0YW50cyIsIk5vcm1hbFNpbXBsZVdhdGVyTWV0aG9kLmlJbml0Vk8iLCJOb3JtYWxTaW1wbGVXYXRlck1ldGhvZC53YXRlcjFPZmZzZXRYIiwiTm9ybWFsU2ltcGxlV2F0ZXJNZXRob2Qud2F0ZXIxT2Zmc2V0WSIsIk5vcm1hbFNpbXBsZVdhdGVyTWV0aG9kLndhdGVyMk9mZnNldFgiLCJOb3JtYWxTaW1wbGVXYXRlck1ldGhvZC53YXRlcjJPZmZzZXRZIiwiTm9ybWFsU2ltcGxlV2F0ZXJNZXRob2Quc2Vjb25kYXJ5Tm9ybWFsTWFwIiwiTm9ybWFsU2ltcGxlV2F0ZXJNZXRob2QuaUNsZWFuQ29tcGlsYXRpb25EYXRhIiwiTm9ybWFsU2ltcGxlV2F0ZXJNZXRob2QuZGlzcG9zZSIsIk5vcm1hbFNpbXBsZVdhdGVyTWV0aG9kLmlBY3RpdmF0ZSIsIk5vcm1hbFNpbXBsZVdhdGVyTWV0aG9kLmlHZXRGcmFnbWVudENvZGUiXSwibWFwcGluZ3MiOiI7Ozs7OztBQVNBLElBQU8saUJBQWlCLFdBQWMsd0RBQXdELENBQUMsQ0FBQztBQUNoRyxJQUFPLG9CQUFvQixXQUFjLHlEQUF5RCxDQUFDLENBQUM7QUFFcEcsQUFHQTs7R0FERztJQUNHLHVCQUF1QjtJQUFTQSxVQUFoQ0EsdUJBQXVCQSxVQUEwQkE7SUFVdERBOzs7O09BSUdBO0lBQ0hBLFNBZktBLHVCQUF1QkEsQ0FlaEJBLFFBQXNCQSxFQUFFQSxRQUFzQkE7UUFFekRDLGlCQUFPQSxDQUFDQTtRQWJEQSx3QkFBbUJBLEdBQVdBLEtBQUtBLENBQUNBO1FBQ3BDQSxtQkFBY0EsR0FBVUEsQ0FBQ0EsQ0FBQ0E7UUFDMUJBLG1CQUFj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QSxHQUFHQSxJQUFJQSxHQUFHQSxJQUFJQSxHQUFHQSxlQUFlQSxDQUFDQSxTQUFTQSxHQUFHQSxJQUFJQSxHQUFHQSxRQUFRQSxHQUFHQSxTQUFTQSxHQUM5RUEsb0JBQW9CQSxDQUFDQSxrQkFBa0JBLENBQUNBLElBQUlBLEVBQUVBLGVBQWVBLEVBQUVBLElBQUlBLENBQUNBLHVCQUF1QkEsRUFBRUEsSUFBSUEsQ0FBQ0EsU0FBU0EsRUFBRUEsWUFBWUEsQ0FBQ0EsaUJBQWlCQSxFQUFFQSxZQUFZQSxDQUFDQSxjQUFjQSxFQUFFQSxZQUFZQSxDQUFDQSxhQUFhQSxFQUFFQSxJQUFJQSxDQUFDQSxHQUMzTUEsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsSUFBSUEsR0FBR0EsU0FBU0EsR0FBR0EsSUFBSUEsR0FBR0EsSUFBSUEsR0FBR0EsTUFBTUEsR0FDNURBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLElBQUlBLEdBQUdBLFNBQVNBLEdBQUdBLElBQUlBLEdBQUdBLE9BQU9BLEdBQUdBLE9BQU9BLEdBQ2hFQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxRQUFRQSxHQUFHQSxTQUFTQSxHQUFHQSxRQUFRQSxHQUFHQSxlQUFlQSxDQUFDQSxPQUFPQSxHQUFHQSxTQUFTQSxHQUMxRkEsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsUUFBUUEsR0FBR0EsU0FBU0EsR0FBR0EsZUFBZUEsQ0FBQ0E7SUFDOURBLENBQUNBO0lBQ0ZaLDhCQUFDQTtBQUFEQSxDQTNLQSxBQTJLQ0EsRUEzS3FDLGlCQUFpQixFQTJLdEQ7QUFFRCxBQUFpQyxpQkFBeEIsdUJBQXVCLENBQUMiLCJmaWxlIjoibWF0ZXJpYWxzL21ldGhvZHMvTm9ybWFsU2ltcGxlV2F0ZXJNZXRob2QuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL3JvYmJhdGVtYW4vV2Vic3Rvcm1Qcm9qZWN0cy9hd2F5anMtcmVuZGVyZXJnbC8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVGV4dHVyZTJEQmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvdGV4dHVyZXMvVGV4dHVyZTJEQmFzZVwiKTtcblxuaW1wb3J0IFN0YWdlXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvY29yZS9iYXNlL1N0YWdlXCIpO1xuaW1wb3J0IElDb250ZXh0U3RhZ2VHTFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvY29yZS9zdGFnZWdsL0lDb250ZXh0U3RhZ2VHTFwiKTtcbmltcG9ydCBNZXRob2RWT1x0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL21hdGVyaWFscy9jb21waWxhdGlvbi9NZXRob2RWT1wiKTtcbmltcG9ydCBTaGFkZXJPYmplY3RCYXNlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9tYXRlcmlhbHMvY29tcGlsYXRpb24vU2hhZGVyT2JqZWN0QmFzZVwiKTtcbmltcG9ydCBTaGFkZXJSZWdpc3RlckNhY2hlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvbWF0ZXJpYWxzL2NvbXBpbGF0aW9uL1NoYWRlclJlZ2lzdGVyQ2FjaGVcIik7XG5pbXBvcnQgU2hhZGVyUmVnaXN0ZXJEYXRhXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvbWF0ZXJpYWxzL2NvbXBpbGF0aW9uL1NoYWRlclJlZ2lzdGVyRGF0YVwiKTtcbmltcG9ydCBTaGFkZXJSZWdpc3RlckVsZW1lbnRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvbWF0ZXJpYWxzL2NvbXBpbGF0aW9uL1NoYWRlclJlZ2lzdGVyRWxlbWVudFwiKTtcbmltcG9ydCBOb3JtYWxCYXNpY01ldGhvZFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL21hdGVyaWFscy9tZXRob2RzL05vcm1hbEJhc2ljTWV0aG9kXCIpO1xuaW1wb3J0IFNoYWRlckNvbXBpbGVySGVscGVyXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvbWF0ZXJpYWxzL3V0aWxzL1NoYWRlckNvbXBpbGVySGVscGVyXCIpO1xuXG4vKipcbiAqIE5vcm1hbFNpbXBsZVdhdGVyTWV0aG9kIHByb3ZpZGVzIGEgYmFzaWMgbm9ybWFsIG1hcCBtZXRob2QgdG8gY3JlYXRlIHdhdGVyIHJpcHBsZXMgYnkgdHJhbnNsYXRpbmcgdHdvIHdhdmUgbm9ybWFsIG1hcHMuXG4gKi9cbmNsYXNzIE5vcm1hbFNpbXBsZVdhdGVyTWV0aG9kIGV4dGVuZHMgTm9ybWFsQmFzaWNNZXRob2Rcbntcblx0cHJpdmF0ZSBfdGV4dHVyZTI6VGV4dHVyZTJEQmFzZTtcblx0cHJpdmF0ZSBfbm9ybWFsVGV4dHVyZVJlZ2lzdGVyMjpTaGFkZXJSZWdpc3RlckVsZW1lbnQ7XG5cdHByaXZhdGUgX3VzZVNlY29uZE5vcm1hbE1hcDpib29sZWFuID0gZmFsc2U7XG5cdHByaXZhdGUgX3dhdGVyMU9mZnNldFg6bnVtYmVyID0gMDtcblx0cHJpdmF0ZSBfd2F0ZXIxT2Zmc2V0WTpudW1iZXIgPSAwO1xuXHRwcml2YXRlIF93YXRlcjJPZmZzZXRYOm51bWJlciA9IDA7XG5cdHByaXZhdGUgX3dhdGVyMk9mZnNldFk6bnVtYmVyID0gMDtcblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyBOb3JtYWxTaW1wbGVXYXRlck1ldGhvZCBvYmplY3QuXG5cdCAqIEBwYXJhbSB3YXZlTWFwMSBBIG5vcm1hbCBtYXAgY29udGFpbmluZyBvbmUgbGF5ZXIgb2YgYSB3YXZlIHN0cnVjdHVyZS5cblx0ICogQHBhcmFtIHdhdmVNYXAyIEEgbm9ybWFsIG1hcCBjb250YWluaW5nIGEgc2Vjb25kIGxheWVyIG9mIGEgd2F2ZSBzdHJ1Y3R1cmUuXG5cdCAqL1xuXHRjb25zdHJ1Y3Rvcih3YXZlTWFwMTpUZXh0dXJlMkRCYXNlLCB3YXZlTWFwMjpUZXh0dXJlMkRCYXNlKVxuXHR7XG5cdFx0c3VwZXIoKTtcblx0XHR0aGlzLm5vcm1hbE1hcCA9IHdhdmVNYXAxO1xuXHRcdHRoaXMuc2Vjb25kYXJ5Tm9ybWFsTWFwID0gd2F2ZU1hcDI7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBpSW5pdENvbnN0YW50cyhzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgbWV0aG9kVk86TWV0aG9kVk8pXG5cdHtcblx0XHR2YXIgaW5kZXg6bnVtYmVyID0gbWV0aG9kVk8uZnJhZ21lbnRDb25zdGFudHNJbmRleDtcblx0XHR2YXIgZGF0YTpBcnJheTxudW1iZXI+ID0gc2hhZGVyT2JqZWN0LmZyYWdtZW50Q29uc3RhbnREYXRhO1xuXHRcdGRhdGFbaW5kZXhdID0gLjU7XG5cdFx0ZGF0YVtpbmRleCArIDFdID0gMDtcblx0XHRkYXRhW2luZGV4ICsgMl0gPSAwO1xuXHRcdGRhdGFbaW5kZXggKyAzXSA9IDE7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBpSW5pdFZPKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCBtZXRob2RWTzpNZXRob2RWTylcblx0e1xuXHRcdHN1cGVyLmlJbml0Vk8oc2hhZGVyT2JqZWN0LCBtZXRob2RWTyk7XG5cblx0XHR0aGlzLl91c2VTZWNvbmROb3JtYWxNYXAgPSB0aGlzLm5vcm1hbE1hcCAhPSB0aGlzLnNlY29uZGFyeU5vcm1hbE1hcDtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgdHJhbnNsYXRpb24gb2YgdGhlIGZpcnN0IHdhdmUgbGF5ZXIgYWxvbmcgdGhlIFgtYXhpcy5cblx0ICovXG5cdHB1YmxpYyBnZXQgd2F0ZXIxT2Zmc2V0WCgpOm51bWJlclxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3dhdGVyMU9mZnNldFg7XG5cdH1cblxuXHRwdWJsaWMgc2V0IHdhdGVyMU9mZnNldFgodmFsdWU6bnVtYmVyKVxuXHR7XG5cdFx0dGhpcy5fd2F0ZXIxT2Zmc2V0WCA9IHZhbHVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSB0cmFuc2xhdGlvbiBvZiB0aGUgZmlyc3Qgd2F2ZSBsYXllciBhbG9uZyB0aGUgWS1heGlzLlxuXHQgKi9cblx0cHVibGljIGdldCB3YXRlcjFPZmZzZXRZKCk6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fd2F0ZXIxT2Zmc2V0WTtcblx0fVxuXG5cdHB1YmxpYyBzZXQgd2F0ZXIxT2Zmc2V0WSh2YWx1ZTpudW1iZXIpXG5cdHtcblx0XHR0aGlzLl93YXRlcjFPZmZzZXRZID0gdmFsdWU7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIHRyYW5zbGF0aW9uIG9mIHRoZSBzZWNvbmQgd2F2ZSBsYXllciBhbG9uZyB0aGUgWC1heGlzLlxuXHQgKi9cblx0cHVibGljIGdldCB3YXRlcjJPZmZzZXRYKCk6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fd2F0ZXIyT2Zmc2V0WDtcblx0fVxuXG5cdHB1YmxpYyBzZXQgd2F0ZXIyT2Zmc2V0WCh2YWx1ZTpudW1iZXIpXG5cdHtcblx0XHR0aGlzLl93YXRlcjJPZmZzZXRYID0gdmFsdWU7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIHRyYW5zbGF0aW9uIG9mIHRoZSBzZWNvbmQgd2F2ZSBsYXllciBhbG9uZyB0aGUgWS1heGlzLlxuXHQgKi9cblx0cHVibGljIGdldCB3YXRlcjJPZmZzZXRZKCk6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fd2F0ZXIyT2Zmc2V0WTtcblx0fVxuXG5cdHB1YmxpYyBzZXQgd2F0ZXIyT2Zmc2V0WSh2YWx1ZTpudW1iZXIpXG5cdHtcblx0XHR0aGlzLl93YXRlcjJPZmZzZXRZID0gdmFsdWU7XG5cdH1cblxuXHQvKipcblx0ICogQSBzZWNvbmQgbm9ybWFsIG1hcCB0aGF0IHdpbGwgYmUgY29tYmluZWQgd2l0aCB0aGUgZmlyc3QgdG8gY3JlYXRlIGEgd2F2ZS1saWtlIGFuaW1hdGlvbiBwYXR0ZXJuLlxuXHQgKi9cblx0cHVibGljIGdldCBzZWNvbmRhcnlOb3JtYWxNYXAoKTpUZXh0dXJlMkRCYXNlXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fdGV4dHVyZTI7XG5cdH1cblxuXHRwdWJsaWMgc2V0IHNlY29uZGFyeU5vcm1hbE1hcCh2YWx1ZTpUZXh0dXJlMkRCYXNlKVxuXHR7XG5cdFx0dGhpcy5fdGV4dHVyZTIgPSB2YWx1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGlDbGVhbkNvbXBpbGF0aW9uRGF0YSgpXG5cdHtcblx0XHRzdXBlci5pQ2xlYW5Db21waWxhdGlvbkRhdGEoKTtcblx0XHR0aGlzLl9ub3JtYWxUZXh0dXJlUmVnaXN0ZXIyID0gbnVsbDtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGRpc3Bvc2UoKVxuXHR7XG5cdFx0c3VwZXIuZGlzcG9zZSgpO1xuXHRcdHRoaXMuX3RleHR1cmUyID0gbnVsbDtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGlBY3RpdmF0ZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgbWV0aG9kVk86TWV0aG9kVk8sIHN0YWdlOlN0YWdlKVxuXHR7XG5cdFx0c3VwZXIuaUFjdGl2YXRlKHNoYWRlck9iamVjdCwgbWV0aG9kVk8sIHN0YWdlKTtcblxuXHRcdHZhciBkYXRhOkFycmF5PG51bWJlcj4gPSBzaGFkZXJPYmplY3QuZnJhZ21lbnRDb25zdGFudERhdGE7XG5cdFx0dmFyIGluZGV4Om51bWJlciA9IG1ldGhvZFZPLmZyYWdtZW50Q29uc3RhbnRzSW5kZXg7XG5cblx0XHRkYXRhW2luZGV4ICsgNF0gPSB0aGlzLl93YXRlcjFPZmZzZXRYO1xuXHRcdGRhdGFbaW5kZXggKyA1XSA9IHRoaXMuX3dhdGVyMU9mZnNldFk7XG5cdFx0ZGF0YVtpbmRleCArIDZdID0gdGhpcy5fd2F0ZXIyT2Zmc2V0WDtcblx0XHRkYXRhW2luZGV4ICsgN10gPSB0aGlzLl93YXRlcjJPZmZzZXRZO1xuXG5cdFx0Ly9pZiAodGhpcy5fdXNlU2Vjb25kTm9ybWFsTWFwID49IDApXG5cdFx0aWYgKHRoaXMuX3VzZVNlY29uZE5vcm1hbE1hcClcblx0XHRcdCg8SUNvbnRleHRTdGFnZUdMPiBzdGFnZS5jb250ZXh0KS5hY3RpdmF0ZVRleHR1cmUobWV0aG9kVk8udGV4dHVyZXNJbmRleCArIDEsIHRoaXMuX3RleHR1cmUyKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGlHZXRGcmFnbWVudENvZGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIG1ldGhvZFZPOk1ldGhvZFZPLCB0YXJnZXRSZWc6U2hhZGVyUmVnaXN0ZXJFbGVtZW50LCByZWdpc3RlckNhY2hlOlNoYWRlclJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVyczpTaGFkZXJSZWdpc3RlckRhdGEpOnN0cmluZ1xuXHR7XG5cdFx0dmFyIHRlbXA6U2hhZGVyUmVnaXN0ZXJFbGVtZW50ID0gcmVnaXN0ZXJDYWNoZS5nZXRGcmVlRnJhZ21lbnRWZWN0b3JUZW1wKCk7XG5cdFx0dmFyIGRhdGFSZWc6U2hhZGVyUmVnaXN0ZXJFbGVtZW50ID0gcmVnaXN0ZXJDYWNoZS5nZXRGcmVlRnJhZ21lbnRDb25zdGFudCgpO1xuXHRcdHZhciBkYXRhUmVnMjpTaGFkZXJSZWdpc3RlckVsZW1lbnQgPSByZWdpc3RlckNhY2hlLmdldEZyZWVGcmFnbWVudENvbnN0YW50KCk7XG5cdFx0dGhpcy5fcE5vcm1hbFRleHR1cmVSZWdpc3RlciA9IHJlZ2lzdGVyQ2FjaGUuZ2V0RnJlZVRleHR1cmVSZWcoKTtcblx0XHR0aGlzLl9ub3JtYWxUZXh0dXJlUmVnaXN0ZXIyID0gdGhpcy5fdXNlU2Vjb25kTm9ybWFsTWFwPyByZWdpc3RlckNhY2hlLmdldEZyZWVUZXh0dXJlUmVnKCk6dGhpcy5fcE5vcm1hbFRleHR1cmVSZWdpc3Rlcjtcblx0XHRtZXRob2RWTy50ZXh0dXJlc0luZGV4ID0gdGhpcy5fcE5vcm1hbFRleHR1cmVSZWdpc3Rlci5pbmRleDtcblxuXHRcdG1ldGhvZFZPLmZyYWdtZW50Q29uc3RhbnRzSW5kZXggPSBkYXRhUmVnLmluZGV4KjQ7XG5cblx0XHRyZXR1cm4gXCJhZGQgXCIgKyB0ZW1wICsgXCIsIFwiICsgc2hhcmVkUmVnaXN0ZXJzLnV2VmFyeWluZyArIFwiLCBcIiArIGRhdGFSZWcyICsgXCIueHl4eVxcblwiICtcblx0XHRcdFNoYWRlckNvbXBpbGVySGVscGVyLmdldFRleDJEU2FtcGxlQ29kZSh0YXJnZXRSZWcsIHNoYXJlZFJlZ2lzdGVycywgdGhpcy5fcE5vcm1hbFRleHR1cmVSZWdpc3RlciwgdGhpcy5ub3JtYWxNYXAsIHNoYWRlck9iamVjdC51c2VTbW9vdGhUZXh0dXJlcywgc2hhZGVyT2JqZWN0LnJlcGVhdFRleHR1cmVzLCBzaGFkZXJPYmplY3QudXNlTWlwbWFwcGluZywgdGVtcCkgK1xuXHRcdFx0XCJhZGQgXCIgKyB0ZW1wICsgXCIsIFwiICsgc2hhcmVkUmVnaXN0ZXJzLnV2VmFyeWluZyArIFwiLCBcIiArIGRhdGFSZWcyICsgXCIuend6d1xcblwiICtcblx0XHRcdFNoYWRlckNvbXBpbGVySGVscGVyLmdldFRleDJEU2FtcGxlQ29kZSh0ZW1wLCBzaGFyZWRSZWdpc3RlcnMsIHRoaXMuX25vcm1hbFRleHR1cmVSZWdpc3RlcjIsIHRoaXMuX3RleHR1cmUyLCBzaGFkZXJPYmplY3QudXNlU21vb3RoVGV4dHVyZXMsIHNoYWRlck9iamVjdC5yZXBlYXRUZXh0dXJlcywgc2hhZGVyT2JqZWN0LnVzZU1pcG1hcHBpbmcsIHRlbXApICtcblx0XHRcdFwiYWRkIFwiICsgdGFyZ2V0UmVnICsgXCIsIFwiICsgdGFyZ2V0UmVnICsgXCIsIFwiICsgdGVtcCArIFwiXHRcdFxcblwiICtcblx0XHRcdFwibXVsIFwiICsgdGFyZ2V0UmVnICsgXCIsIFwiICsgdGFyZ2V0UmVnICsgXCIsIFwiICsgZGF0YVJlZyArIFwiLnhcdFxcblwiICtcblx0XHRcdFwic3ViIFwiICsgdGFyZ2V0UmVnICsgXCIueHl6LCBcIiArIHRhcmdldFJlZyArIFwiLnh5eiwgXCIgKyBzaGFyZWRSZWdpc3RlcnMuY29tbW9ucyArIFwiLnh4eFx0XFxuXCIgK1xuXHRcdFx0XCJucm0gXCIgKyB0YXJnZXRSZWcgKyBcIi54eXosIFwiICsgdGFyZ2V0UmVnICsgXCIueHl6XHRcdFx0XHRcdFx0XHRcXG5cIjtcblx0fVxufVxuXG5leHBvcnQgPSBOb3JtYWxTaW1wbGVXYXRlck1ldGhvZDsiXX0=