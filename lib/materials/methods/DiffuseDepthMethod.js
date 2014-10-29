var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DiffuseBasicMethod = require("awayjs-stagegl/lib/materials/methods/DiffuseBasicMethod");
var ShaderCompilerHelper = require("awayjs-stagegl/lib/materials/utils/ShaderCompilerHelper");
/**
 * DiffuseDepthMethod provides a debug method to visualise depth maps
 */
var DiffuseDepthMethod = (function (_super) {
    __extends(DiffuseDepthMethod, _super);
    /**
     * Creates a new DiffuseBasicMethod object.
     */
    function DiffuseDepthMethod() {
        _super.call(this);
    }
    /**
     * @inheritDoc
     */
    DiffuseDepthMethod.prototype.iInitConstants = function (shaderObject, methodVO) {
        var data = shaderObject.fragmentConstantData;
        var index = methodVO.fragmentConstantsIndex;
        data[index] = 1.0;
        data[index + 1] = 1 / 255.0;
        data[index + 2] = 1 / 65025.0;
        data[index + 3] = 1 / 16581375.0;
    };
    /**
     * @inheritDoc
     */
    DiffuseDepthMethod.prototype.iGetFragmentPostLightingCode = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
        var code = "";
        var temp;
        var decReg;
        if (!this._pUseTexture)
            throw new Error("DiffuseDepthMethod requires texture!");
        // incorporate input from ambient
        if (shaderObject.numLights > 0) {
            if (sharedRegisters.shadowTarget)
                code += "mul " + this._pTotalLightColorReg + ".xyz, " + this._pTotalLightColorReg + ".xyz, " + sharedRegisters.shadowTarget + ".w\n";
            code += "add " + targetReg + ".xyz, " + this._pTotalLightColorReg + ".xyz, " + targetReg + ".xyz\n" + "sat " + targetReg + ".xyz, " + targetReg + ".xyz\n";
            registerCache.removeFragmentTempUsage(this._pTotalLightColorReg);
        }
        temp = shaderObject.numLights > 0 ? registerCache.getFreeFragmentVectorTemp() : targetReg;
        this._pDiffuseInputRegister = registerCache.getFreeTextureReg();
        methodVO.texturesIndex = this._pDiffuseInputRegister.index;
        decReg = registerCache.getFreeFragmentConstant();
        methodVO.fragmentConstantsIndex = decReg.index * 4;
        code += ShaderCompilerHelper.getTex2DSampleCode(temp, sharedRegisters, this._pDiffuseInputRegister, this.texture, shaderObject.useSmoothTextures, shaderObject.repeatTextures, shaderObject.useMipmapping) + "dp4 " + temp + ".x, " + temp + ", " + decReg + "\n" + "mov " + temp + ".yz, " + temp + ".xx			\n" + "mov " + temp + ".w, " + decReg + ".x\n" + "sub " + temp + ".xyz, " + decReg + ".xxx, " + temp + ".xyz\n";
        if (shaderObject.numLights == 0)
            return code;
        code += "mul " + targetReg + ".xyz, " + temp + ".xyz, " + targetReg + ".xyz\n" + "mov " + targetReg + ".w, " + temp + ".w\n";
        return code;
    };
    return DiffuseDepthMethod;
})(DiffuseBasicMethod);
module.exports = DiffuseDepthMethod;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvbWV0aG9kcy9kaWZmdXNlZGVwdGhtZXRob2QudHMiXSwibmFtZXMiOlsiRGlmZnVzZURlcHRoTWV0aG9kIiwiRGlmZnVzZURlcHRoTWV0aG9kLmNvbnN0cnVjdG9yIiwiRGlmZnVzZURlcHRoTWV0aG9kLmlJbml0Q29uc3RhbnRzIiwiRGlmZnVzZURlcHRoTWV0aG9kLmlHZXRGcmFnbWVudFBvc3RMaWdodGluZ0NvZGUiXSwibWFwcGluZ3MiOiI7Ozs7OztBQU1BLElBQU8sa0JBQWtCLFdBQWMseURBQXlELENBQUMsQ0FBQztBQUNsRyxJQUFPLG9CQUFvQixXQUFjLHlEQUF5RCxDQUFDLENBQUM7QUFFcEcsQUFHQTs7R0FERztJQUNHLGtCQUFrQjtJQUFTQSxVQUEzQkEsa0JBQWtCQSxVQUEyQkE7SUFFbERBOztPQUVHQTtJQUNIQSxTQUxLQSxrQkFBa0JBO1FBT3RCQyxpQkFBT0EsQ0FBQ0E7SUFDVEEsQ0FBQ0E7SUFFREQ7O09BRUdBO0lBQ0lBLDJDQUFjQSxHQUFyQkEsVUFBc0JBLFlBQTZCQSxFQUFFQSxRQUFpQkE7UUFFckVFLElBQUlBLElBQUlBLEdBQWlCQSxZQUFZQSxDQUFDQSxvQkFBb0JBLENBQUNBO1FBQzNEQSxJQUFJQSxLQUFLQSxHQUFrQkEsUUFBUUEsQ0FBQ0Esc0JBQXNCQSxDQUFDQTtRQUMzREEsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsR0FBR0EsR0FBR0EsQ0FBQ0E7UUFDbEJBLElBQUlBLENBQUNBLEtBQUtBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEdBQUNBLEtBQUtBLENBQUNBO1FBQzFCQSxJQUFJQSxDQUFDQSxLQUFLQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFDQSxPQUFPQSxDQUFDQTtRQUM1QkEsSUFBSUEsQ0FBQ0EsS0FBS0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBQ0EsVUFBVUEsQ0FBQ0E7SUFDaENBLENB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TUEsR0FBR0EsU0FBU0EsR0FBR0EsUUFBUUEsR0FBR0EsSUFBSUEsR0FBR0EsUUFBUUEsR0FBR0EsU0FBU0EsR0FBR0EsUUFBUUEsR0FDN0VBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQUdBLElBQUlBLEdBQUdBLE1BQU1BLENBQUNBO1FBRTdDQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQTtJQUNiQSxDQUFDQTtJQUNGSCx5QkFBQ0E7QUFBREEsQ0FoRUEsQUFnRUNBLEVBaEVnQyxrQkFBa0IsRUFnRWxEO0FBRUQsQUFBNEIsaUJBQW5CLGtCQUFrQixDQUFDIiwiZmlsZSI6Im1hdGVyaWFscy9tZXRob2RzL0RpZmZ1c2VEZXB0aE1ldGhvZC5qcyIsInNvdXJjZVJvb3QiOiIuLi8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTWV0aG9kVk9cdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9tYXRlcmlhbHMvY29tcGlsYXRpb24vTWV0aG9kVk9cIik7XG5pbXBvcnQgU2hhZGVyTGlnaHRpbmdPYmplY3RcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9tYXRlcmlhbHMvY29tcGlsYXRpb24vU2hhZGVyTGlnaHRpbmdPYmplY3RcIik7XG5pbXBvcnQgU2hhZGVyT2JqZWN0QmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvbWF0ZXJpYWxzL2NvbXBpbGF0aW9uL1NoYWRlck9iamVjdEJhc2VcIik7XG5pbXBvcnQgU2hhZGVyUmVnaXN0ZXJDYWNoZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL21hdGVyaWFscy9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckNhY2hlXCIpO1xuaW1wb3J0IFNoYWRlclJlZ2lzdGVyRGF0YVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL21hdGVyaWFscy9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckRhdGFcIik7XG5pbXBvcnQgU2hhZGVyUmVnaXN0ZXJFbGVtZW50XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL21hdGVyaWFscy9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckVsZW1lbnRcIik7XG5pbXBvcnQgRGlmZnVzZUJhc2ljTWV0aG9kXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvbWF0ZXJpYWxzL21ldGhvZHMvRGlmZnVzZUJhc2ljTWV0aG9kXCIpO1xuaW1wb3J0IFNoYWRlckNvbXBpbGVySGVscGVyXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvbWF0ZXJpYWxzL3V0aWxzL1NoYWRlckNvbXBpbGVySGVscGVyXCIpO1xuXG4vKipcbiAqIERpZmZ1c2VEZXB0aE1ldGhvZCBwcm92aWRlcyBhIGRlYnVnIG1ldGhvZCB0byB2aXN1YWxpc2UgZGVwdGggbWFwc1xuICovXG5jbGFzcyBEaWZmdXNlRGVwdGhNZXRob2QgZXh0ZW5kcyBEaWZmdXNlQmFzaWNNZXRob2Rcbntcblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBuZXcgRGlmZnVzZUJhc2ljTWV0aG9kIG9iamVjdC5cblx0ICovXG5cdGNvbnN0cnVjdG9yKClcblx0e1xuXHRcdHN1cGVyKCk7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBpSW5pdENvbnN0YW50cyhzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgbWV0aG9kVk86TWV0aG9kVk8pXG5cdHtcblx0XHR2YXIgZGF0YTpBcnJheTxudW1iZXI+ID0gc2hhZGVyT2JqZWN0LmZyYWdtZW50Q29uc3RhbnREYXRhO1xuXHRcdHZhciBpbmRleDpudW1iZXIgLyppbnQqLyA9IG1ldGhvZFZPLmZyYWdtZW50Q29uc3RhbnRzSW5kZXg7XG5cdFx0ZGF0YVtpbmRleF0gPSAxLjA7XG5cdFx0ZGF0YVtpbmRleCArIDFdID0gMS8yNTUuMDtcblx0XHRkYXRhW2luZGV4ICsgMl0gPSAxLzY1MDI1LjA7XG5cdFx0ZGF0YVtpbmRleCArIDNdID0gMS8xNjU4MTM3NS4wO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgaUdldEZyYWdtZW50UG9zdExpZ2h0aW5nQ29kZShzaGFkZXJPYmplY3Q6U2hhZGVyTGlnaHRpbmdPYmplY3QsIG1ldGhvZFZPOk1ldGhvZFZPLCB0YXJnZXRSZWc6U2hhZGVyUmVnaXN0ZXJFbGVtZW50LCByZWdpc3RlckNhY2hlOlNoYWRlclJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVyczpTaGFkZXJSZWdpc3RlckRhdGEpOnN0cmluZ1xuXHR7XG5cdFx0dmFyIGNvZGU6c3RyaW5nID0gXCJcIjtcblx0XHR2YXIgdGVtcDpTaGFkZXJSZWdpc3RlckVsZW1lbnQ7XG5cdFx0dmFyIGRlY1JlZzpTaGFkZXJSZWdpc3RlckVsZW1lbnQ7XG5cblx0XHRpZiAoIXRoaXMuX3BVc2VUZXh0dXJlKVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiRGlmZnVzZURlcHRoTWV0aG9kIHJlcXVpcmVzIHRleHR1cmUhXCIpO1xuXG5cdFx0Ly8gaW5jb3Jwb3JhdGUgaW5wdXQgZnJvbSBhbWJpZW50XG5cdFx0aWYgKHNoYWRlck9iamVjdC5udW1MaWdodHMgPiAwKSB7XG5cdFx0XHRpZiAoc2hhcmVkUmVnaXN0ZXJzLnNoYWRvd1RhcmdldClcblx0XHRcdFx0Y29kZSArPSBcIm11bCBcIiArIHRoaXMuX3BUb3RhbExpZ2h0Q29sb3JSZWcgKyBcIi54eXosIFwiICsgdGhpcy5fcFRvdGFsTGlnaHRDb2xvclJlZyArIFwiLnh5eiwgXCIgKyBzaGFyZWRSZWdpc3RlcnMuc2hhZG93VGFyZ2V0ICsgXCIud1xcblwiO1xuXHRcdFx0Y29kZSArPSBcImFkZCBcIiArIHRhcmdldFJlZyArIFwiLnh5eiwgXCIgKyB0aGlzLl9wVG90YWxMaWdodENvbG9yUmVnICsgXCIueHl6LCBcIiArIHRhcmdldFJlZyArIFwiLnh5elxcblwiICtcblx0XHRcdFx0XCJzYXQgXCIgKyB0YXJnZXRSZWcgKyBcIi54eXosIFwiICsgdGFyZ2V0UmVnICsgXCIueHl6XFxuXCI7XG5cdFx0XHRyZWdpc3RlckNhY2hlLnJlbW92ZUZyYWdtZW50VGVtcFVzYWdlKHRoaXMuX3BUb3RhbExpZ2h0Q29sb3JSZWcpO1xuXHRcdH1cblxuXHRcdHRlbXAgPSBzaGFkZXJPYmplY3QubnVtTGlnaHRzID4gMD8gcmVnaXN0ZXJDYWNoZS5nZXRGcmVlRnJhZ21lbnRWZWN0b3JUZW1wKCk6dGFyZ2V0UmVnO1xuXG5cdFx0dGhpcy5fcERpZmZ1c2VJbnB1dFJlZ2lzdGVyID0gcmVnaXN0ZXJDYWNoZS5nZXRGcmVlVGV4dHVyZVJlZygpO1xuXHRcdG1ldGhvZFZPLnRleHR1cmVzSW5kZXggPSB0aGlzLl9wRGlmZnVzZUlucHV0UmVnaXN0ZXIuaW5kZXg7XG5cdFx0ZGVjUmVnID0gcmVnaXN0ZXJDYWNoZS5nZXRGcmVlRnJhZ21lbnRDb25zdGFudCgpO1xuXHRcdG1ldGhvZFZPLmZyYWdtZW50Q29uc3RhbnRzSW5kZXggPSBkZWNSZWcuaW5kZXgqNDtcblx0XHRjb2RlICs9IFNoYWRlckNvbXBpbGVySGVscGVyLmdldFRleDJEU2FtcGxlQ29kZSh0ZW1wLCBzaGFyZWRSZWdpc3RlcnMsIHRoaXMuX3BEaWZmdXNlSW5wdXRSZWdpc3RlciwgdGhpcy50ZXh0dXJlLCBzaGFkZXJPYmplY3QudXNlU21vb3RoVGV4dHVyZXMsIHNoYWRlck9iamVjdC5yZXBlYXRUZXh0dXJlcywgc2hhZGVyT2JqZWN0LnVzZU1pcG1hcHBpbmcpICtcblx0XHRcdFwiZHA0IFwiICsgdGVtcCArIFwiLngsIFwiICsgdGVtcCArIFwiLCBcIiArIGRlY1JlZyArIFwiXFxuXCIgK1xuXHRcdFx0XCJtb3YgXCIgKyB0ZW1wICsgXCIueXosIFwiICsgdGVtcCArIFwiLnh4XHRcdFx0XFxuXCIgK1xuXHRcdFx0XCJtb3YgXCIgKyB0ZW1wICsgXCIudywgXCIgKyBkZWNSZWcgKyBcIi54XFxuXCIgK1xuXHRcdFx0XCJzdWIgXCIgKyB0ZW1wICsgXCIueHl6LCBcIiArIGRlY1JlZyArIFwiLnh4eCwgXCIgKyB0ZW1wICsgXCIueHl6XFxuXCI7XG5cblx0XHRpZiAoc2hhZGVyT2JqZWN0Lm51bUxpZ2h0cyA9PSAwKVxuXHRcdFx0cmV0dXJuIGNvZGU7XG5cblx0XHRjb2RlICs9IFwibXVsIFwiICsgdGFyZ2V0UmVnICsgXCIueHl6LCBcIiArIHRlbXAgKyBcIi54eXosIFwiICsgdGFyZ2V0UmVnICsgXCIueHl6XFxuXCIgK1xuXHRcdFx0XCJtb3YgXCIgKyB0YXJnZXRSZWcgKyBcIi53LCBcIiArIHRlbXAgKyBcIi53XFxuXCI7XG5cblx0XHRyZXR1cm4gY29kZTtcblx0fVxufVxuXG5leHBvcnQgPSBEaWZmdXNlRGVwdGhNZXRob2Q7Il19