var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DiffuseCompositeMethod = require("awayjs-renderergl/lib/materials/methods/DiffuseCompositeMethod");
/**
 * DiffuseCelMethod provides a shading method to add diffuse cel (cartoon) shading.
 */
var DiffuseCelMethod = (function (_super) {
    __extends(DiffuseCelMethod, _super);
    /**
     * Creates a new DiffuseCelMethod object.
     * @param levels The amount of shadow gradations.
     * @param baseMethod An optional diffuse method on which the cartoon shading is based. If omitted, DiffuseBasicMethod is used.
     */
    function DiffuseCelMethod(levels, baseMethod) {
        var _this = this;
        if (levels === void 0) { levels = 3; }
        if (baseMethod === void 0) { baseMethod = null; }
        _super.call(this, null, baseMethod);
        this._smoothness = .1;
        this.baseMethod._iModulateMethod = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) { return _this.clampDiffuse(shaderObject, methodVO, targetReg, registerCache, sharedRegisters); };
        this._levels = levels;
    }
    /**
     * @inheritDoc
     */
    DiffuseCelMethod.prototype.iInitConstants = function (shaderObject, methodVO) {
        var data = shaderObject.fragmentConstantData;
        var index = methodVO.secondaryFragmentConstantsIndex;
        _super.prototype.iInitConstants.call(this, shaderObject, methodVO);
        data[index + 1] = 1;
        data[index + 2] = 0;
    };
    Object.defineProperty(DiffuseCelMethod.prototype, "levels", {
        /**
         * The amount of shadow gradations.
         */
        get: function () {
            return this._levels;
        },
        set: function (value /*uint*/) {
            this._levels = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DiffuseCelMethod.prototype, "smoothness", {
        /**
         * The smoothness of the edge between 2 shading levels.
         */
        get: function () {
            return this._smoothness;
        },
        set: function (value) {
            this._smoothness = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    DiffuseCelMethod.prototype.iCleanCompilationData = function () {
        _super.prototype.iCleanCompilationData.call(this);
        this._dataReg = null;
    };
    /**
     * @inheritDoc
     */
    DiffuseCelMethod.prototype.iGetFragmentPreLightingCode = function (shaderObject, methodVO, registerCache, sharedRegisters) {
        this._dataReg = registerCache.getFreeFragmentConstant();
        methodVO.secondaryFragmentConstantsIndex = this._dataReg.index * 4;
        return _super.prototype.iGetFragmentPreLightingCode.call(this, shaderObject, methodVO, registerCache, sharedRegisters);
    };
    /**
     * @inheritDoc
     */
    DiffuseCelMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
        _super.prototype.iActivate.call(this, shaderObject, methodVO, stage);
        var data = shaderObject.fragmentConstantData;
        var index = methodVO.secondaryFragmentConstantsIndex;
        data[index] = this._levels;
        data[index + 3] = this._smoothness;
    };
    /**
     * Snaps the diffuse shading of the wrapped method to one of the levels.
     * @param vo The MethodVO used to compile the current shader.
     * @param t The register containing the diffuse strength in the "w" component.
     * @param regCache The register cache used for the shader compilation.
     * @param sharedRegisters The shared register data for this shader.
     * @return The AGAL fragment code for the method.
     */
    DiffuseCelMethod.prototype.clampDiffuse = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
        return "mul " + targetReg + ".w, " + targetReg + ".w, " + this._dataReg + ".x\n" + "frc " + targetReg + ".z, " + targetReg + ".w\n" + "sub " + targetReg + ".y, " + targetReg + ".w, " + targetReg + ".z\n" + "mov " + targetReg + ".x, " + this._dataReg + ".x\n" + "sub " + targetReg + ".x, " + targetReg + ".x, " + this._dataReg + ".y\n" + "rcp " + targetReg + ".x," + targetReg + ".x\n" + "mul " + targetReg + ".w, " + targetReg + ".y, " + targetReg + ".x\n" + "sub " + targetReg + ".y, " + targetReg + ".w, " + targetReg + ".x\n" + "div " + targetReg + ".z, " + targetReg + ".z, " + this._dataReg + ".w\n" + "sat " + targetReg + ".z, " + targetReg + ".z\n" + "mul " + targetReg + ".w, " + targetReg + ".w, " + targetReg + ".z\n" + "sub " + targetReg + ".z, " + this._dataReg + ".y, " + targetReg + ".z\n" + "mul " + targetReg + ".y, " + targetReg + ".y, " + targetReg + ".z\n" + "add " + targetReg + ".w, " + targetReg + ".w, " + targetReg + ".y\n" + "sat " + targetReg + ".w, " + targetReg + ".w\n";
    };
    return DiffuseCelMethod;
})(DiffuseCompositeMethod);
module.exports = DiffuseCelMethod;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvbWV0aG9kcy9kaWZmdXNlY2VsbWV0aG9kLnRzIl0sIm5hbWVzIjpbIkRpZmZ1c2VDZWxNZXRob2QiLCJEaWZmdXNlQ2VsTWV0aG9kLmNvbnN0cnVjdG9yIiwiRGlmZnVzZUNlbE1ldGhvZC5pSW5pdENvbnN0YW50cyIsIkRpZmZ1c2VDZWxNZXRob2QubGV2ZWxzIiwiRGlmZnVzZUNlbE1ldGhvZC5zbW9vdGhuZXNzIiwiRGlmZnVzZUNlbE1ldGhvZC5pQ2xlYW5Db21waWxhdGlvbkRhdGEiLCJEaWZmdXNlQ2VsTWV0aG9kLmlHZXRGcmFnbWVudFByZUxpZ2h0aW5nQ29kZSIsIkRpZmZ1c2VDZWxNZXRob2QuaUFjdGl2YXRlIiwiRGlmZnVzZUNlbE1ldGhvZC5jbGFtcERpZmZ1c2UiXSwibWFwcGluZ3MiOiI7Ozs7OztBQVNBLElBQU8sc0JBQXNCLFdBQWEsZ0VBQWdFLENBQUMsQ0FBQztBQUc1RyxBQUdBOztHQURHO0lBQ0csZ0JBQWdCO0lBQVNBLFVBQXpCQSxnQkFBZ0JBLFVBQStCQTtJQU1wREE7Ozs7T0FJR0E7SUFDSEEsU0FYS0EsZ0JBQWdCQSxDQVdUQSxNQUEwQkEsRUFBRUEsVUFBb0NBO1FBWDdFQyxpQkEwSENBO1FBL0dZQSxzQkFBMEJBLEdBQTFCQSxVQUEwQkE7UUFBRUEsMEJBQW9DQSxHQUFwQ0EsaUJBQW9DQTtRQUUzRUEsa0JBQU1BLElBQUlBLEVBQUVBLFVBQVVBLENBQUNBLENBQUNBO1FBVGpCQSxnQkFBV0EsR0FBVUEsRUFBRUEsQ0FBQ0E7UUFXL0JBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLGdCQUFnQkEsR0FBR0EsVUFBQ0EsWUFBNkJBLEVBQUVBLFFBQWlCQSxFQUFFQSxTQUErQkEsRUFBRUEsYUFBaUNBLEVBQUVBLGVBQWtDQSxJQUFLQSxPQUFBQSxLQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxZQUFZQSxFQUFFQSxRQUFRQSxFQUFFQSxTQUFTQSxFQUFFQSxhQUFhQSxF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QTtRQUU1S1EsTUFBTUEsQ0FBQ0EsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FBR0EsSUFBSUEsQ0FBQ0EsUUFBUUEsR0FBR0EsTUFBTUEsR0FDL0VBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQ2hEQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUNyRUEsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FBR0EsSUFBSUEsQ0FBQ0EsUUFBUUEsR0FBR0EsTUFBTUEsR0FDcERBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQUdBLElBQUlBLENBQUNBLFFBQVFBLEdBQUdBLE1BQU1BLEdBQ3pFQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxLQUFLQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUMvQ0EsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FHckVBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBR3JFQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUFHQSxJQUFJQSxDQUFDQSxRQUFRQSxHQUFHQSxNQUFNQSxHQUN6RUEsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FFaERBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBRXJFQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUFHQSxJQUFJQSxDQUFDQSxRQUFRQSxHQUFHQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUN6RUEsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FDckVBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQ3JFQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxDQUFDQTtJQUNuREEsQ0FBQ0E7SUFDRlIsdUJBQUNBO0FBQURBLENBMUhBLEFBMEhDQSxFQTFIOEIsc0JBQXNCLEVBMEhwRDtBQUVELEFBQTBCLGlCQUFqQixnQkFBZ0IsQ0FBQyIsImZpbGUiOiJtYXRlcmlhbHMvbWV0aG9kcy9EaWZmdXNlQ2VsTWV0aG9kLmpzIiwic291cmNlUm9vdCI6Ii4uLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTdGFnZVx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2Jhc2UvU3RhZ2VcIik7XG5cbmltcG9ydCBNZXRob2RWT1x0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL21hdGVyaWFscy9jb21waWxhdGlvbi9NZXRob2RWT1wiKTtcbmltcG9ydCBTaGFkZXJMaWdodGluZ09iamVjdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL21hdGVyaWFscy9jb21waWxhdGlvbi9TaGFkZXJMaWdodGluZ09iamVjdFwiKTtcbmltcG9ydCBTaGFkZXJPYmplY3RCYXNlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvY29tcGlsYXRpb24vU2hhZGVyT2JqZWN0QmFzZVwiKTtcbmltcG9ydCBTaGFkZXJSZWdpc3RlckNhY2hlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvbWF0ZXJpYWxzL2NvbXBpbGF0aW9uL1NoYWRlclJlZ2lzdGVyQ2FjaGVcIik7XG5pbXBvcnQgU2hhZGVyUmVnaXN0ZXJEYXRhXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvbWF0ZXJpYWxzL2NvbXBpbGF0aW9uL1NoYWRlclJlZ2lzdGVyRGF0YVwiKTtcbmltcG9ydCBTaGFkZXJSZWdpc3RlckVsZW1lbnRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvbWF0ZXJpYWxzL2NvbXBpbGF0aW9uL1NoYWRlclJlZ2lzdGVyRWxlbWVudFwiKTtcbmltcG9ydCBEaWZmdXNlQmFzaWNNZXRob2RcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvbWV0aG9kcy9EaWZmdXNlQmFzaWNNZXRob2RcIik7XG5pbXBvcnQgRGlmZnVzZUNvbXBvc2l0ZU1ldGhvZFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvbWV0aG9kcy9EaWZmdXNlQ29tcG9zaXRlTWV0aG9kXCIpO1xuaW1wb3J0IFNoYWRlckNvbXBpbGVySGVscGVyXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvbWF0ZXJpYWxzL3V0aWxzL1NoYWRlckNvbXBpbGVySGVscGVyXCIpO1xuXG4vKipcbiAqIERpZmZ1c2VDZWxNZXRob2QgcHJvdmlkZXMgYSBzaGFkaW5nIG1ldGhvZCB0byBhZGQgZGlmZnVzZSBjZWwgKGNhcnRvb24pIHNoYWRpbmcuXG4gKi9cbmNsYXNzIERpZmZ1c2VDZWxNZXRob2QgZXh0ZW5kcyBEaWZmdXNlQ29tcG9zaXRlTWV0aG9kXG57XG5cdHByaXZhdGUgX2xldmVsczpudW1iZXIgLyp1aW50Ki87XG5cdHByaXZhdGUgX2RhdGFSZWc6U2hhZGVyUmVnaXN0ZXJFbGVtZW50O1xuXHRwcml2YXRlIF9zbW9vdGhuZXNzOm51bWJlciA9IC4xO1xuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IERpZmZ1c2VDZWxNZXRob2Qgb2JqZWN0LlxuXHQgKiBAcGFyYW0gbGV2ZWxzIFRoZSBhbW91bnQgb2Ygc2hhZG93IGdyYWRhdGlvbnMuXG5cdCAqIEBwYXJhbSBiYXNlTWV0aG9kIEFuIG9wdGlvbmFsIGRpZmZ1c2UgbWV0aG9kIG9uIHdoaWNoIHRoZSBjYXJ0b29uIHNoYWRpbmcgaXMgYmFzZWQuIElmIG9taXR0ZWQsIERpZmZ1c2VCYXNpY01ldGhvZCBpcyB1c2VkLlxuXHQgKi9cblx0Y29uc3RydWN0b3IobGV2ZWxzOm51bWJlciAvKnVpbnQqLyA9IDMsIGJhc2VNZXRob2Q6RGlmZnVzZUJhc2ljTWV0aG9kID0gbnVsbClcblx0e1xuXHRcdHN1cGVyKG51bGwsIGJhc2VNZXRob2QpO1xuXG5cdFx0dGhpcy5iYXNlTWV0aG9kLl9pTW9kdWxhdGVNZXRob2QgPSAoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIG1ldGhvZFZPOk1ldGhvZFZPLCB0YXJnZXRSZWc6U2hhZGVyUmVnaXN0ZXJFbGVtZW50LCByZWdpc3RlckNhY2hlOlNoYWRlclJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVyczpTaGFkZXJSZWdpc3RlckRhdGEpID0+IHRoaXMuY2xhbXBEaWZmdXNlKHNoYWRlck9iamVjdCwgbWV0aG9kVk8sIHRhcmdldFJlZywgcmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzKTtcblxuXHRcdHRoaXMuX2xldmVscyA9IGxldmVscztcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGlJbml0Q29uc3RhbnRzKHNoYWRlck9iamVjdDpTaGFkZXJMaWdodGluZ09iamVjdCwgbWV0aG9kVk86TWV0aG9kVk8pXG5cdHtcblx0XHR2YXIgZGF0YTpBcnJheTxudW1iZXI+ID0gc2hhZGVyT2JqZWN0LmZyYWdtZW50Q29uc3RhbnREYXRhO1xuXHRcdHZhciBpbmRleDpudW1iZXIgLyppbnQqLyA9IG1ldGhvZFZPLnNlY29uZGFyeUZyYWdtZW50Q29uc3RhbnRzSW5kZXg7XG5cdFx0c3VwZXIuaUluaXRDb25zdGFudHMoc2hhZGVyT2JqZWN0LCBtZXRob2RWTyk7XG5cdFx0ZGF0YVtpbmRleCArIDFdID0gMTtcblx0XHRkYXRhW2luZGV4ICsgMl0gPSAwO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBhbW91bnQgb2Ygc2hhZG93IGdyYWRhdGlvbnMuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGxldmVscygpOm51bWJlciAvKnVpbnQqL1xuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX2xldmVscztcblx0fVxuXG5cdHB1YmxpYyBzZXQgbGV2ZWxzKHZhbHVlOm51bWJlciAvKnVpbnQqLylcblx0e1xuXHRcdHRoaXMuX2xldmVscyA9IHZhbHVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBzbW9vdGhuZXNzIG9mIHRoZSBlZGdlIGJldHdlZW4gMiBzaGFkaW5nIGxldmVscy5cblx0ICovXG5cdHB1YmxpYyBnZXQgc21vb3RobmVzcygpOm51bWJlclxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3Ntb290aG5lc3M7XG5cdH1cblxuXHRwdWJsaWMgc2V0IHNtb290aG5lc3ModmFsdWU6bnVtYmVyKVxuXHR7XG5cdFx0dGhpcy5fc21vb3RobmVzcyA9IHZhbHVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgaUNsZWFuQ29tcGlsYXRpb25EYXRhKClcblx0e1xuXHRcdHN1cGVyLmlDbGVhbkNvbXBpbGF0aW9uRGF0YSgpO1xuXHRcdHRoaXMuX2RhdGFSZWcgPSBudWxsO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgaUdldEZyYWdtZW50UHJlTGlnaHRpbmdDb2RlKHNoYWRlck9iamVjdDpTaGFkZXJMaWdodGluZ09iamVjdCwgbWV0aG9kVk86TWV0aG9kVk8sIHJlZ2lzdGVyQ2FjaGU6U2hhZGVyUmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzOlNoYWRlclJlZ2lzdGVyRGF0YSk6c3RyaW5nXG5cdHtcblx0XHR0aGlzLl9kYXRhUmVnID0gcmVnaXN0ZXJDYWNoZS5nZXRGcmVlRnJhZ21lbnRDb25zdGFudCgpO1xuXHRcdG1ldGhvZFZPLnNlY29uZGFyeUZyYWdtZW50Q29uc3RhbnRzSW5kZXggPSB0aGlzLl9kYXRhUmVnLmluZGV4KjQ7XG5cblx0XHRyZXR1cm4gc3VwZXIuaUdldEZyYWdtZW50UHJlTGlnaHRpbmdDb2RlKHNoYWRlck9iamVjdCwgbWV0aG9kVk8sIHJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVycyk7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBpQWN0aXZhdGUoc2hhZGVyT2JqZWN0OlNoYWRlckxpZ2h0aW5nT2JqZWN0LCBtZXRob2RWTzpNZXRob2RWTywgc3RhZ2U6U3RhZ2UpXG5cdHtcblx0XHRzdXBlci5pQWN0aXZhdGUoc2hhZGVyT2JqZWN0LCBtZXRob2RWTywgc3RhZ2UpO1xuXHRcdHZhciBkYXRhOkFycmF5PG51bWJlcj4gPSBzaGFkZXJPYmplY3QuZnJhZ21lbnRDb25zdGFudERhdGE7XG5cdFx0dmFyIGluZGV4Om51bWJlciAvKmludCovID0gbWV0aG9kVk8uc2Vjb25kYXJ5RnJhZ21lbnRDb25zdGFudHNJbmRleDtcblx0XHRkYXRhW2luZGV4XSA9IHRoaXMuX2xldmVscztcblx0XHRkYXRhW2luZGV4ICsgM10gPSB0aGlzLl9zbW9vdGhuZXNzO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNuYXBzIHRoZSBkaWZmdXNlIHNoYWRpbmcgb2YgdGhlIHdyYXBwZWQgbWV0aG9kIHRvIG9uZSBvZiB0aGUgbGV2ZWxzLlxuXHQgKiBAcGFyYW0gdm8gVGhlIE1ldGhvZFZPIHVzZWQgdG8gY29tcGlsZSB0aGUgY3VycmVudCBzaGFkZXIuXG5cdCAqIEBwYXJhbSB0IFRoZSByZWdpc3RlciBjb250YWluaW5nIHRoZSBkaWZmdXNlIHN0cmVuZ3RoIGluIHRoZSBcIndcIiBjb21wb25lbnQuXG5cdCAqIEBwYXJhbSByZWdDYWNoZSBUaGUgcmVnaXN0ZXIgY2FjaGUgdXNlZCBmb3IgdGhlIHNoYWRlciBjb21waWxhdGlvbi5cblx0ICogQHBhcmFtIHNoYXJlZFJlZ2lzdGVycyBUaGUgc2hhcmVkIHJlZ2lzdGVyIGRhdGEgZm9yIHRoaXMgc2hhZGVyLlxuXHQgKiBAcmV0dXJuIFRoZSBBR0FMIGZyYWdtZW50IGNvZGUgZm9yIHRoZSBtZXRob2QuXG5cdCAqL1xuXHRwcml2YXRlIGNsYW1wRGlmZnVzZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgbWV0aG9kVk86TWV0aG9kVk8sIHRhcmdldFJlZzpTaGFkZXJSZWdpc3RlckVsZW1lbnQsIHJlZ2lzdGVyQ2FjaGU6U2hhZGVyUmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzOlNoYWRlclJlZ2lzdGVyRGF0YSk6c3RyaW5nXG5cdHtcblx0XHRyZXR1cm4gXCJtdWwgXCIgKyB0YXJnZXRSZWcgKyBcIi53LCBcIiArIHRhcmdldFJlZyArIFwiLncsIFwiICsgdGhpcy5fZGF0YVJlZyArIFwiLnhcXG5cIiArXG5cdFx0XHRcImZyYyBcIiArIHRhcmdldFJlZyArIFwiLnosIFwiICsgdGFyZ2V0UmVnICsgXCIud1xcblwiICtcblx0XHRcdFwic3ViIFwiICsgdGFyZ2V0UmVnICsgXCIueSwgXCIgKyB0YXJnZXRSZWcgKyBcIi53LCBcIiArIHRhcmdldFJlZyArIFwiLnpcXG5cIiArXG5cdFx0XHRcIm1vdiBcIiArIHRhcmdldFJlZyArIFwiLngsIFwiICsgdGhpcy5fZGF0YVJlZyArIFwiLnhcXG5cIiArXG5cdFx0XHRcInN1YiBcIiArIHRhcmdldFJlZyArIFwiLngsIFwiICsgdGFyZ2V0UmVnICsgXCIueCwgXCIgKyB0aGlzLl9kYXRhUmVnICsgXCIueVxcblwiICtcblx0XHRcdFwicmNwIFwiICsgdGFyZ2V0UmVnICsgXCIueCxcIiArIHRhcmdldFJlZyArIFwiLnhcXG5cIiArXG5cdFx0XHRcIm11bCBcIiArIHRhcmdldFJlZyArIFwiLncsIFwiICsgdGFyZ2V0UmVnICsgXCIueSwgXCIgKyB0YXJnZXRSZWcgKyBcIi54XFxuXCIgK1xuXG5cdFx0XHQvLyBwcmV2aW91cyBjbGFtcGVkIHN0cmVuZ3RoXG5cdFx0XHRcInN1YiBcIiArIHRhcmdldFJlZyArIFwiLnksIFwiICsgdGFyZ2V0UmVnICsgXCIudywgXCIgKyB0YXJnZXRSZWcgKyBcIi54XFxuXCIgK1xuXG5cdFx0XHQvLyBmcmFjdC9lcHNpbG9uIChzbyAwIC0gZXBzaWxvbiB3aWxsIGJlY29tZSAwIC0gMSlcblx0XHRcdFwiZGl2IFwiICsgdGFyZ2V0UmVnICsgXCIueiwgXCIgKyB0YXJnZXRSZWcgKyBcIi56LCBcIiArIHRoaXMuX2RhdGFSZWcgKyBcIi53XFxuXCIgK1xuXHRcdFx0XCJzYXQgXCIgKyB0YXJnZXRSZWcgKyBcIi56LCBcIiArIHRhcmdldFJlZyArIFwiLnpcXG5cIiArXG5cblx0XHRcdFwibXVsIFwiICsgdGFyZ2V0UmVnICsgXCIudywgXCIgKyB0YXJnZXRSZWcgKyBcIi53LCBcIiArIHRhcmdldFJlZyArIFwiLnpcXG5cIiArXG5cdFx0XHQvLyAxLXpcblx0XHRcdFwic3ViIFwiICsgdGFyZ2V0UmVnICsgXCIueiwgXCIgKyB0aGlzLl9kYXRhUmVnICsgXCIueSwgXCIgKyB0YXJnZXRSZWcgKyBcIi56XFxuXCIgK1xuXHRcdFx0XCJtdWwgXCIgKyB0YXJnZXRSZWcgKyBcIi55LCBcIiArIHRhcmdldFJlZyArIFwiLnksIFwiICsgdGFyZ2V0UmVnICsgXCIuelxcblwiICtcblx0XHRcdFwiYWRkIFwiICsgdGFyZ2V0UmVnICsgXCIudywgXCIgKyB0YXJnZXRSZWcgKyBcIi53LCBcIiArIHRhcmdldFJlZyArIFwiLnlcXG5cIiArXG5cdFx0XHRcInNhdCBcIiArIHRhcmdldFJlZyArIFwiLncsIFwiICsgdGFyZ2V0UmVnICsgXCIud1xcblwiO1xuXHR9XG59XG5cbmV4cG9ydCA9IERpZmZ1c2VDZWxNZXRob2Q7Il19