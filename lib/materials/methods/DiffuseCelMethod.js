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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvbWV0aG9kcy9kaWZmdXNlY2VsbWV0aG9kLnRzIl0sIm5hbWVzIjpbIkRpZmZ1c2VDZWxNZXRob2QiLCJEaWZmdXNlQ2VsTWV0aG9kLmNvbnN0cnVjdG9yIiwiRGlmZnVzZUNlbE1ldGhvZC5pSW5pdENvbnN0YW50cyIsIkRpZmZ1c2VDZWxNZXRob2QubGV2ZWxzIiwiRGlmZnVzZUNlbE1ldGhvZC5zbW9vdGhuZXNzIiwiRGlmZnVzZUNlbE1ldGhvZC5pQ2xlYW5Db21waWxhdGlvbkRhdGEiLCJEaWZmdXNlQ2VsTWV0aG9kLmlHZXRGcmFnbWVudFByZUxpZ2h0aW5nQ29kZSIsIkRpZmZ1c2VDZWxNZXRob2QuaUFjdGl2YXRlIiwiRGlmZnVzZUNlbE1ldGhvZC5jbGFtcERpZmZ1c2UiXSwibWFwcGluZ3MiOiI7Ozs7OztBQVdBLElBQU8sc0JBQXNCLFdBQWEsZ0VBQWdFLENBQUMsQ0FBQztBQUU1RyxBQUdBOztHQURHO0lBQ0csZ0JBQWdCO0lBQVNBLFVBQXpCQSxnQkFBZ0JBLFVBQStCQTtJQU1wREE7Ozs7T0FJR0E7SUFDSEEsU0FYS0EsZ0JBQWdCQSxDQVdUQSxNQUEwQkEsRUFBRUEsVUFBb0NBO1FBWDdFQyxpQkEwSENBO1FBL0dZQSxzQkFBMEJBLEdBQTFCQSxVQUEwQkE7UUFBRUEsMEJBQW9DQSxHQUFwQ0EsaUJBQW9DQTtRQUUzRUEsa0JBQU1BLElBQUlBLEVBQUVBLFVBQVVBLENBQUNBLENBQUNBO1FBVGpCQSxnQkFBV0EsR0FBVUEsRUFBRUEsQ0FBQ0E7UUFXL0JBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLGdCQUFnQkEsR0FBR0EsVUFBQ0EsWUFBNkJBLEVBQUVBLFFBQWlCQSxFQUFFQSxTQUErQkEsRUFBRUEsYUFBaUNBLEVBQUVBLGVBQWtDQSxJQUFLQSxPQUFBQSxLQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxZQUFZQSxFQUFFQSxRQUFRQSxFQUFFQSxTQUFTQSxFQUFFQSxhQUFhQSxF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QTtRQUU1S1EsTUFBTUEsQ0FBQ0EsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FBR0EsSUFBSUEsQ0FBQ0EsUUFBUUEsR0FBR0EsTUFBTUEsR0FDL0VBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQ2hEQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUNyRUEsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FBR0EsSUFBSUEsQ0FBQ0EsUUFBUUEsR0FBR0EsTUFBTUEsR0FDcERBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQUdBLElBQUlBLENBQUNBLFFBQVFBLEdBQUdBLE1BQU1BLEdBQ3pFQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxLQUFLQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUMvQ0EsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FHckVBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBR3JFQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUFHQSxJQUFJQSxDQUFDQSxRQUFRQSxHQUFHQSxNQUFNQSxHQUN6RUEsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FFaERBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBRXJFQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUFHQSxJQUFJQSxDQUFDQSxRQUFRQSxHQUFHQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUN6RUEsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FDckVBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQ3JFQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxDQUFDQTtJQUNuREEsQ0FBQ0E7SUFDRlIsdUJBQUNBO0FBQURBLENBMUhBLEFBMEhDQSxFQTFIOEIsc0JBQXNCLEVBMEhwRDtBQUVELEFBQTBCLGlCQUFqQixnQkFBZ0IsQ0FBQyIsImZpbGUiOiJtYXRlcmlhbHMvbWV0aG9kcy9EaWZmdXNlQ2VsTWV0aG9kLmpzIiwic291cmNlUm9vdCI6Ii4uLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTdGFnZVx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2Jhc2UvU3RhZ2VcIik7XG5pbXBvcnQgSUNvbnRleHRTdGFnZUdMXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9iYXNlL0lDb250ZXh0U3RhZ2VHTFwiKTtcbmltcG9ydCBNZXRob2RWT1x0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL21hdGVyaWFscy9jb21waWxhdGlvbi9NZXRob2RWT1wiKTtcbmltcG9ydCBTaGFkZXJMaWdodGluZ09iamVjdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL21hdGVyaWFscy9jb21waWxhdGlvbi9TaGFkZXJMaWdodGluZ09iamVjdFwiKTtcbmltcG9ydCBTaGFkZXJPYmplY3RCYXNlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9tYXRlcmlhbHMvY29tcGlsYXRpb24vU2hhZGVyT2JqZWN0QmFzZVwiKTtcbmltcG9ydCBTaGFkZXJSZWdpc3RlckNhY2hlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvbWF0ZXJpYWxzL2NvbXBpbGF0aW9uL1NoYWRlclJlZ2lzdGVyQ2FjaGVcIik7XG5pbXBvcnQgU2hhZGVyUmVnaXN0ZXJEYXRhXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvbWF0ZXJpYWxzL2NvbXBpbGF0aW9uL1NoYWRlclJlZ2lzdGVyRGF0YVwiKTtcbmltcG9ydCBTaGFkZXJSZWdpc3RlckVsZW1lbnRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvbWF0ZXJpYWxzL2NvbXBpbGF0aW9uL1NoYWRlclJlZ2lzdGVyRWxlbWVudFwiKTtcbmltcG9ydCBEaWZmdXNlQmFzaWNNZXRob2RcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9tYXRlcmlhbHMvbWV0aG9kcy9EaWZmdXNlQmFzaWNNZXRob2RcIik7XG5pbXBvcnQgU2hhZGVyQ29tcGlsZXJIZWxwZXJcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9tYXRlcmlhbHMvdXRpbHMvU2hhZGVyQ29tcGlsZXJIZWxwZXJcIik7XG5cbmltcG9ydCBEaWZmdXNlQ29tcG9zaXRlTWV0aG9kXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL21hdGVyaWFscy9tZXRob2RzL0RpZmZ1c2VDb21wb3NpdGVNZXRob2RcIik7XG5cbi8qKlxuICogRGlmZnVzZUNlbE1ldGhvZCBwcm92aWRlcyBhIHNoYWRpbmcgbWV0aG9kIHRvIGFkZCBkaWZmdXNlIGNlbCAoY2FydG9vbikgc2hhZGluZy5cbiAqL1xuY2xhc3MgRGlmZnVzZUNlbE1ldGhvZCBleHRlbmRzIERpZmZ1c2VDb21wb3NpdGVNZXRob2Rcbntcblx0cHJpdmF0ZSBfbGV2ZWxzOm51bWJlciAvKnVpbnQqLztcblx0cHJpdmF0ZSBfZGF0YVJlZzpTaGFkZXJSZWdpc3RlckVsZW1lbnQ7XG5cdHByaXZhdGUgX3Ntb290aG5lc3M6bnVtYmVyID0gLjE7XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBuZXcgRGlmZnVzZUNlbE1ldGhvZCBvYmplY3QuXG5cdCAqIEBwYXJhbSBsZXZlbHMgVGhlIGFtb3VudCBvZiBzaGFkb3cgZ3JhZGF0aW9ucy5cblx0ICogQHBhcmFtIGJhc2VNZXRob2QgQW4gb3B0aW9uYWwgZGlmZnVzZSBtZXRob2Qgb24gd2hpY2ggdGhlIGNhcnRvb24gc2hhZGluZyBpcyBiYXNlZC4gSWYgb21pdHRlZCwgRGlmZnVzZUJhc2ljTWV0aG9kIGlzIHVzZWQuXG5cdCAqL1xuXHRjb25zdHJ1Y3RvcihsZXZlbHM6bnVtYmVyIC8qdWludCovID0gMywgYmFzZU1ldGhvZDpEaWZmdXNlQmFzaWNNZXRob2QgPSBudWxsKVxuXHR7XG5cdFx0c3VwZXIobnVsbCwgYmFzZU1ldGhvZCk7XG5cblx0XHR0aGlzLmJhc2VNZXRob2QuX2lNb2R1bGF0ZU1ldGhvZCA9IChzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgbWV0aG9kVk86TWV0aG9kVk8sIHRhcmdldFJlZzpTaGFkZXJSZWdpc3RlckVsZW1lbnQsIHJlZ2lzdGVyQ2FjaGU6U2hhZGVyUmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzOlNoYWRlclJlZ2lzdGVyRGF0YSkgPT4gdGhpcy5jbGFtcERpZmZ1c2Uoc2hhZGVyT2JqZWN0LCBtZXRob2RWTywgdGFyZ2V0UmVnLCByZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnMpO1xuXG5cdFx0dGhpcy5fbGV2ZWxzID0gbGV2ZWxzO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgaUluaXRDb25zdGFudHMoc2hhZGVyT2JqZWN0OlNoYWRlckxpZ2h0aW5nT2JqZWN0LCBtZXRob2RWTzpNZXRob2RWTylcblx0e1xuXHRcdHZhciBkYXRhOkFycmF5PG51bWJlcj4gPSBzaGFkZXJPYmplY3QuZnJhZ21lbnRDb25zdGFudERhdGE7XG5cdFx0dmFyIGluZGV4Om51bWJlciAvKmludCovID0gbWV0aG9kVk8uc2Vjb25kYXJ5RnJhZ21lbnRDb25zdGFudHNJbmRleDtcblx0XHRzdXBlci5pSW5pdENvbnN0YW50cyhzaGFkZXJPYmplY3QsIG1ldGhvZFZPKTtcblx0XHRkYXRhW2luZGV4ICsgMV0gPSAxO1xuXHRcdGRhdGFbaW5kZXggKyAyXSA9IDA7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIGFtb3VudCBvZiBzaGFkb3cgZ3JhZGF0aW9ucy5cblx0ICovXG5cdHB1YmxpYyBnZXQgbGV2ZWxzKCk6bnVtYmVyIC8qdWludCovXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fbGV2ZWxzO1xuXHR9XG5cblx0cHVibGljIHNldCBsZXZlbHModmFsdWU6bnVtYmVyIC8qdWludCovKVxuXHR7XG5cdFx0dGhpcy5fbGV2ZWxzID0gdmFsdWU7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIHNtb290aG5lc3Mgb2YgdGhlIGVkZ2UgYmV0d2VlbiAyIHNoYWRpbmcgbGV2ZWxzLlxuXHQgKi9cblx0cHVibGljIGdldCBzbW9vdGhuZXNzKCk6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fc21vb3RobmVzcztcblx0fVxuXG5cdHB1YmxpYyBzZXQgc21vb3RobmVzcyh2YWx1ZTpudW1iZXIpXG5cdHtcblx0XHR0aGlzLl9zbW9vdGhuZXNzID0gdmFsdWU7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBpQ2xlYW5Db21waWxhdGlvbkRhdGEoKVxuXHR7XG5cdFx0c3VwZXIuaUNsZWFuQ29tcGlsYXRpb25EYXRhKCk7XG5cdFx0dGhpcy5fZGF0YVJlZyA9IG51bGw7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBpR2V0RnJhZ21lbnRQcmVMaWdodGluZ0NvZGUoc2hhZGVyT2JqZWN0OlNoYWRlckxpZ2h0aW5nT2JqZWN0LCBtZXRob2RWTzpNZXRob2RWTywgcmVnaXN0ZXJDYWNoZTpTaGFkZXJSZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnM6U2hhZGVyUmVnaXN0ZXJEYXRhKTpzdHJpbmdcblx0e1xuXHRcdHRoaXMuX2RhdGFSZWcgPSByZWdpc3RlckNhY2hlLmdldEZyZWVGcmFnbWVudENvbnN0YW50KCk7XG5cdFx0bWV0aG9kVk8uc2Vjb25kYXJ5RnJhZ21lbnRDb25zdGFudHNJbmRleCA9IHRoaXMuX2RhdGFSZWcuaW5kZXgqNDtcblxuXHRcdHJldHVybiBzdXBlci5pR2V0RnJhZ21lbnRQcmVMaWdodGluZ0NvZGUoc2hhZGVyT2JqZWN0LCBtZXRob2RWTywgcmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGlBY3RpdmF0ZShzaGFkZXJPYmplY3Q6U2hhZGVyTGlnaHRpbmdPYmplY3QsIG1ldGhvZFZPOk1ldGhvZFZPLCBzdGFnZTpTdGFnZSlcblx0e1xuXHRcdHN1cGVyLmlBY3RpdmF0ZShzaGFkZXJPYmplY3QsIG1ldGhvZFZPLCBzdGFnZSk7XG5cdFx0dmFyIGRhdGE6QXJyYXk8bnVtYmVyPiA9IHNoYWRlck9iamVjdC5mcmFnbWVudENvbnN0YW50RGF0YTtcblx0XHR2YXIgaW5kZXg6bnVtYmVyIC8qaW50Ki8gPSBtZXRob2RWTy5zZWNvbmRhcnlGcmFnbWVudENvbnN0YW50c0luZGV4O1xuXHRcdGRhdGFbaW5kZXhdID0gdGhpcy5fbGV2ZWxzO1xuXHRcdGRhdGFbaW5kZXggKyAzXSA9IHRoaXMuX3Ntb290aG5lc3M7XG5cdH1cblxuXHQvKipcblx0ICogU25hcHMgdGhlIGRpZmZ1c2Ugc2hhZGluZyBvZiB0aGUgd3JhcHBlZCBtZXRob2QgdG8gb25lIG9mIHRoZSBsZXZlbHMuXG5cdCAqIEBwYXJhbSB2byBUaGUgTWV0aG9kVk8gdXNlZCB0byBjb21waWxlIHRoZSBjdXJyZW50IHNoYWRlci5cblx0ICogQHBhcmFtIHQgVGhlIHJlZ2lzdGVyIGNvbnRhaW5pbmcgdGhlIGRpZmZ1c2Ugc3RyZW5ndGggaW4gdGhlIFwid1wiIGNvbXBvbmVudC5cblx0ICogQHBhcmFtIHJlZ0NhY2hlIFRoZSByZWdpc3RlciBjYWNoZSB1c2VkIGZvciB0aGUgc2hhZGVyIGNvbXBpbGF0aW9uLlxuXHQgKiBAcGFyYW0gc2hhcmVkUmVnaXN0ZXJzIFRoZSBzaGFyZWQgcmVnaXN0ZXIgZGF0YSBmb3IgdGhpcyBzaGFkZXIuXG5cdCAqIEByZXR1cm4gVGhlIEFHQUwgZnJhZ21lbnQgY29kZSBmb3IgdGhlIG1ldGhvZC5cblx0ICovXG5cdHByaXZhdGUgY2xhbXBEaWZmdXNlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCBtZXRob2RWTzpNZXRob2RWTywgdGFyZ2V0UmVnOlNoYWRlclJlZ2lzdGVyRWxlbWVudCwgcmVnaXN0ZXJDYWNoZTpTaGFkZXJSZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnM6U2hhZGVyUmVnaXN0ZXJEYXRhKTpzdHJpbmdcblx0e1xuXHRcdHJldHVybiBcIm11bCBcIiArIHRhcmdldFJlZyArIFwiLncsIFwiICsgdGFyZ2V0UmVnICsgXCIudywgXCIgKyB0aGlzLl9kYXRhUmVnICsgXCIueFxcblwiICtcblx0XHRcdFwiZnJjIFwiICsgdGFyZ2V0UmVnICsgXCIueiwgXCIgKyB0YXJnZXRSZWcgKyBcIi53XFxuXCIgK1xuXHRcdFx0XCJzdWIgXCIgKyB0YXJnZXRSZWcgKyBcIi55LCBcIiArIHRhcmdldFJlZyArIFwiLncsIFwiICsgdGFyZ2V0UmVnICsgXCIuelxcblwiICtcblx0XHRcdFwibW92IFwiICsgdGFyZ2V0UmVnICsgXCIueCwgXCIgKyB0aGlzLl9kYXRhUmVnICsgXCIueFxcblwiICtcblx0XHRcdFwic3ViIFwiICsgdGFyZ2V0UmVnICsgXCIueCwgXCIgKyB0YXJnZXRSZWcgKyBcIi54LCBcIiArIHRoaXMuX2RhdGFSZWcgKyBcIi55XFxuXCIgK1xuXHRcdFx0XCJyY3AgXCIgKyB0YXJnZXRSZWcgKyBcIi54LFwiICsgdGFyZ2V0UmVnICsgXCIueFxcblwiICtcblx0XHRcdFwibXVsIFwiICsgdGFyZ2V0UmVnICsgXCIudywgXCIgKyB0YXJnZXRSZWcgKyBcIi55LCBcIiArIHRhcmdldFJlZyArIFwiLnhcXG5cIiArXG5cblx0XHRcdC8vIHByZXZpb3VzIGNsYW1wZWQgc3RyZW5ndGhcblx0XHRcdFwic3ViIFwiICsgdGFyZ2V0UmVnICsgXCIueSwgXCIgKyB0YXJnZXRSZWcgKyBcIi53LCBcIiArIHRhcmdldFJlZyArIFwiLnhcXG5cIiArXG5cblx0XHRcdC8vIGZyYWN0L2Vwc2lsb24gKHNvIDAgLSBlcHNpbG9uIHdpbGwgYmVjb21lIDAgLSAxKVxuXHRcdFx0XCJkaXYgXCIgKyB0YXJnZXRSZWcgKyBcIi56LCBcIiArIHRhcmdldFJlZyArIFwiLnosIFwiICsgdGhpcy5fZGF0YVJlZyArIFwiLndcXG5cIiArXG5cdFx0XHRcInNhdCBcIiArIHRhcmdldFJlZyArIFwiLnosIFwiICsgdGFyZ2V0UmVnICsgXCIuelxcblwiICtcblxuXHRcdFx0XCJtdWwgXCIgKyB0YXJnZXRSZWcgKyBcIi53LCBcIiArIHRhcmdldFJlZyArIFwiLncsIFwiICsgdGFyZ2V0UmVnICsgXCIuelxcblwiICtcblx0XHRcdC8vIDEtelxuXHRcdFx0XCJzdWIgXCIgKyB0YXJnZXRSZWcgKyBcIi56LCBcIiArIHRoaXMuX2RhdGFSZWcgKyBcIi55LCBcIiArIHRhcmdldFJlZyArIFwiLnpcXG5cIiArXG5cdFx0XHRcIm11bCBcIiArIHRhcmdldFJlZyArIFwiLnksIFwiICsgdGFyZ2V0UmVnICsgXCIueSwgXCIgKyB0YXJnZXRSZWcgKyBcIi56XFxuXCIgK1xuXHRcdFx0XCJhZGQgXCIgKyB0YXJnZXRSZWcgKyBcIi53LCBcIiArIHRhcmdldFJlZyArIFwiLncsIFwiICsgdGFyZ2V0UmVnICsgXCIueVxcblwiICtcblx0XHRcdFwic2F0IFwiICsgdGFyZ2V0UmVnICsgXCIudywgXCIgKyB0YXJnZXRSZWcgKyBcIi53XFxuXCI7XG5cdH1cbn1cblxuZXhwb3J0ID0gRGlmZnVzZUNlbE1ldGhvZDsiXX0=