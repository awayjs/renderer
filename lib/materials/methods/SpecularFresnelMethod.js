var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SpecularCompositeMethod = require("awayjs-renderergl/lib/materials/methods/SpecularCompositeMethod");
/**
 * SpecularFresnelMethod provides a specular shading method that causes stronger highlights on grazing view angles.
 */
var SpecularFresnelMethod = (function (_super) {
    __extends(SpecularFresnelMethod, _super);
    /**
     * Creates a new SpecularFresnelMethod object.
     * @param basedOnSurface Defines whether the fresnel effect should be based on the view angle on the surface (if true), or on the angle between the light and the view.
     * @param baseMethod The specular method to which the fresnel equation. Defaults to SpecularBasicMethod.
     */
    function SpecularFresnelMethod(basedOnSurface, baseMethod) {
        var _this = this;
        if (basedOnSurface === void 0) { basedOnSurface = true; }
        if (baseMethod === void 0) { baseMethod = null; }
        // may want to offer diff speculars
        _super.call(this, null, baseMethod);
        this._fresnelPower = 5;
        this._normalReflectance = .028; // default value for skin
        this.baseMethod._iModulateMethod = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) { return _this.modulateSpecular(shaderObject, methodVO, targetReg, registerCache, sharedRegisters); };
        this._incidentLight = !basedOnSurface;
    }
    /**
     * @inheritDoc
     */
    SpecularFresnelMethod.prototype.iInitConstants = function (shaderObject, methodVO) {
        var index = methodVO.secondaryFragmentConstantsIndex;
        shaderObject.fragmentConstantData[index + 2] = 1;
        shaderObject.fragmentConstantData[index + 3] = 0;
    };
    Object.defineProperty(SpecularFresnelMethod.prototype, "basedOnSurface", {
        /**
         * Defines whether the fresnel effect should be based on the view angle on the surface (if true), or on the angle between the light and the view.
         */
        get: function () {
            return !this._incidentLight;
        },
        set: function (value) {
            if (this._incidentLight != value)
                return;
            this._incidentLight = !value;
            this.iInvalidateShaderProgram();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpecularFresnelMethod.prototype, "fresnelPower", {
        /**
         * The power used in the Fresnel equation. Higher values make the fresnel effect more pronounced. Defaults to 5.
         */
        get: function () {
            return this._fresnelPower;
        },
        set: function (value) {
            this._fresnelPower = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    SpecularFresnelMethod.prototype.iCleanCompilationData = function () {
        _super.prototype.iCleanCompilationData.call(this);
        this._dataReg = null;
    };
    Object.defineProperty(SpecularFresnelMethod.prototype, "normalReflectance", {
        /**
         * The minimum amount of reflectance, ie the reflectance when the view direction is normal to the surface or light direction.
         */
        get: function () {
            return this._normalReflectance;
        },
        set: function (value) {
            this._normalReflectance = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    SpecularFresnelMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
        _super.prototype.iActivate.call(this, shaderObject, methodVO, stage);
        var fragmentData = shaderObject.fragmentConstantData;
        var index = methodVO.secondaryFragmentConstantsIndex;
        fragmentData[index] = this._normalReflectance;
        fragmentData[index + 1] = this._fresnelPower;
    };
    /**
     * @inheritDoc
     */
    SpecularFresnelMethod.prototype.iGetFragmentPreLightingCode = function (shaderObject, methodVO, registerCache, sharedRegisters) {
        this._dataReg = registerCache.getFreeFragmentConstant();
        console.log('SpecularFresnelMethod', 'iGetFragmentPreLightingCode', this._dataReg);
        methodVO.secondaryFragmentConstantsIndex = this._dataReg.index * 4;
        return _super.prototype.iGetFragmentPreLightingCode.call(this, shaderObject, methodVO, registerCache, sharedRegisters);
    };
    /**
     * Applies the fresnel effect to the specular strength.
     *
     * @param vo The MethodVO object containing the method data for the currently compiled material pass.
     * @param target The register containing the specular strength in the "w" component, and the half-vector/reflection vector in "xyz".
     * @param regCache The register cache used for the shader compilation.
     * @param sharedRegisters The shared registers created by the compiler.
     * @return The AGAL fragment code for the method.
     */
    SpecularFresnelMethod.prototype.modulateSpecular = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
        var code;
        code = "dp3 " + targetReg + ".y, " + sharedRegisters.viewDirFragment + ".xyz, " + (this._incidentLight ? targetReg : sharedRegisters.normalFragment) + ".xyz\n" + "sub " + targetReg + ".y, " + this._dataReg + ".z, " + targetReg + ".y\n" + "pow " + targetReg + ".x, " + targetReg + ".y, " + this._dataReg + ".y\n" + "sub " + targetReg + ".y, " + this._dataReg + ".z, " + targetReg + ".y\n" + "mul " + targetReg + ".y, " + this._dataReg + ".x, " + targetReg + ".y\n" + "add " + targetReg + ".y, " + targetReg + ".x, " + targetReg + ".y\n" + "mul " + targetReg + ".w, " + targetReg + ".w, " + targetReg + ".y\n";
        console.log('SpecularFresnelMethod', 'modulateSpecular', code);
        return code;
    };
    return SpecularFresnelMethod;
})(SpecularCompositeMethod);
module.exports = SpecularFresnelMethod;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1hdGVyaWFscy9tZXRob2RzL3NwZWN1bGFyZnJlc25lbG1ldGhvZC50cyJdLCJuYW1lcyI6WyJTcGVjdWxhckZyZXNuZWxNZXRob2QiLCJTcGVjdWxhckZyZXNuZWxNZXRob2QuY29uc3RydWN0b3IiLCJTcGVjdWxhckZyZXNuZWxNZXRob2QuaUluaXRDb25zdGFudHMiLCJTcGVjdWxhckZyZXNuZWxNZXRob2QuYmFzZWRPblN1cmZhY2UiLCJTcGVjdWxhckZyZXNuZWxNZXRob2QuZnJlc25lbFBvd2VyIiwiU3BlY3VsYXJGcmVzbmVsTWV0aG9kLmlDbGVhbkNvbXBpbGF0aW9uRGF0YSIsIlNwZWN1bGFyRnJlc25lbE1ldGhvZC5ub3JtYWxSZWZsZWN0YW5jZSIsIlNwZWN1bGFyRnJlc25lbE1ldGhvZC5pQWN0aXZhdGUiLCJTcGVjdWxhckZyZXNuZWxNZXRob2QuaUdldEZyYWdtZW50UHJlTGlnaHRpbmdDb2RlIiwiU3BlY3VsYXJGcmVzbmVsTWV0aG9kLm1vZHVsYXRlU3BlY3VsYXIiXSwibWFwcGluZ3MiOiI7Ozs7OztBQVdBLElBQU8sdUJBQXVCLFdBQWEsaUVBQWlFLENBQUMsQ0FBQztBQUU5RyxBQUdBOztHQURHO0lBQ0cscUJBQXFCO0lBQVNBLFVBQTlCQSxxQkFBcUJBLFVBQWdDQTtJQU8xREE7Ozs7T0FJR0E7SUFDSEEsU0FaS0EscUJBQXFCQSxDQVlkQSxjQUE2QkEsRUFBRUEsVUFBcUNBO1FBWmpGQyxpQkE2SUNBO1FBaklZQSw4QkFBNkJBLEdBQTdCQSxxQkFBNkJBO1FBQUVBLDBCQUFxQ0EsR0FBckNBLGlCQUFxQ0E7UUFFL0VBLEFBQ0FBLG1DQURtQ0E7UUFDbkNBLGtCQUFNQSxJQUFJQSxFQUFFQSxVQUFVQSxDQUFDQSxDQUFDQTtRQVhqQkEsa0JBQWFBLEdBQVVBLENBQUNBLENBQUNBO1FBQ3pCQSx1QkFBa0JBLEdBQVVBLElBQUlBLENBQUNBLENBQUNBLHlCQUF5QkE7UUFZbEVBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLGdCQUFn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LENBQUNBLFFBQVFBLEdBQUdBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQ3pFQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUFHQSxJQUFJQSxDQUFDQSxRQUFRQSxHQUFHQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUN6RUEsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FDckVBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLENBQUNBO1FBR3ZFQSxPQUFPQSxDQUFDQSxHQUFHQSxDQUFDQSx1QkFBdUJBLEVBQUVBLGtCQUFrQkEsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7UUFFL0RBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBO0lBQ2JBLENBQUNBO0lBRUZULDRCQUFDQTtBQUFEQSxDQTdJQSxBQTZJQ0EsRUE3SW1DLHVCQUF1QixFQTZJMUQ7QUFFRCxBQUErQixpQkFBdEIscUJBQXFCLENBQUMiLCJmaWxlIjoibWF0ZXJpYWxzL21ldGhvZHMvU3BlY3VsYXJGcmVzbmVsTWV0aG9kLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9yb2JiYXRlbWFuL1dlYnN0b3JtUHJvamVjdHMvYXdheWpzLXJlbmRlcmVyZ2wvIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENhbWVyYVx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2VudGl0aWVzL0NhbWVyYVwiKTtcblxuaW1wb3J0IFN0YWdlXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvY29yZS9iYXNlL1N0YWdlXCIpO1xuaW1wb3J0IE1ldGhvZFZPXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvbWF0ZXJpYWxzL2NvbXBpbGF0aW9uL01ldGhvZFZPXCIpO1xuaW1wb3J0IFNoYWRlckxpZ2h0aW5nT2JqZWN0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvbWF0ZXJpYWxzL2NvbXBpbGF0aW9uL1NoYWRlckxpZ2h0aW5nT2JqZWN0XCIpO1xuaW1wb3J0IFNoYWRlck9iamVjdEJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL21hdGVyaWFscy9jb21waWxhdGlvbi9TaGFkZXJPYmplY3RCYXNlXCIpO1xuaW1wb3J0IFNoYWRlclJlZ2lzdGVyQ2FjaGVcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9tYXRlcmlhbHMvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJDYWNoZVwiKTtcbmltcG9ydCBTaGFkZXJSZWdpc3RlckRhdGFcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9tYXRlcmlhbHMvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJEYXRhXCIpO1xuaW1wb3J0IFNoYWRlclJlZ2lzdGVyRWxlbWVudFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9tYXRlcmlhbHMvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJFbGVtZW50XCIpO1xuaW1wb3J0IFNwZWN1bGFyQmFzaWNNZXRob2RcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9tYXRlcmlhbHMvbWV0aG9kcy9TcGVjdWxhckJhc2ljTWV0aG9kXCIpO1xuXG5pbXBvcnQgU3BlY3VsYXJDb21wb3NpdGVNZXRob2RcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvbWF0ZXJpYWxzL21ldGhvZHMvU3BlY3VsYXJDb21wb3NpdGVNZXRob2RcIik7XG5cbi8qKlxuICogU3BlY3VsYXJGcmVzbmVsTWV0aG9kIHByb3ZpZGVzIGEgc3BlY3VsYXIgc2hhZGluZyBtZXRob2QgdGhhdCBjYXVzZXMgc3Ryb25nZXIgaGlnaGxpZ2h0cyBvbiBncmF6aW5nIHZpZXcgYW5nbGVzLlxuICovXG5jbGFzcyBTcGVjdWxhckZyZXNuZWxNZXRob2QgZXh0ZW5kcyBTcGVjdWxhckNvbXBvc2l0ZU1ldGhvZFxue1xuXHRwcml2YXRlIF9kYXRhUmVnOlNoYWRlclJlZ2lzdGVyRWxlbWVudDtcblx0cHJpdmF0ZSBfaW5jaWRlbnRMaWdodDpib29sZWFuO1xuXHRwcml2YXRlIF9mcmVzbmVsUG93ZXI6bnVtYmVyID0gNTtcblx0cHJpdmF0ZSBfbm9ybWFsUmVmbGVjdGFuY2U6bnVtYmVyID0gLjAyODsgLy8gZGVmYXVsdCB2YWx1ZSBmb3Igc2tpblxuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IFNwZWN1bGFyRnJlc25lbE1ldGhvZCBvYmplY3QuXG5cdCAqIEBwYXJhbSBiYXNlZE9uU3VyZmFjZSBEZWZpbmVzIHdoZXRoZXIgdGhlIGZyZXNuZWwgZWZmZWN0IHNob3VsZCBiZSBiYXNlZCBvbiB0aGUgdmlldyBhbmdsZSBvbiB0aGUgc3VyZmFjZSAoaWYgdHJ1ZSksIG9yIG9uIHRoZSBhbmdsZSBiZXR3ZWVuIHRoZSBsaWdodCBhbmQgdGhlIHZpZXcuXG5cdCAqIEBwYXJhbSBiYXNlTWV0aG9kIFRoZSBzcGVjdWxhciBtZXRob2QgdG8gd2hpY2ggdGhlIGZyZXNuZWwgZXF1YXRpb24uIERlZmF1bHRzIHRvIFNwZWN1bGFyQmFzaWNNZXRob2QuXG5cdCAqL1xuXHRjb25zdHJ1Y3RvcihiYXNlZE9uU3VyZmFjZTpib29sZWFuID0gdHJ1ZSwgYmFzZU1ldGhvZDpTcGVjdWxhckJhc2ljTWV0aG9kID0gbnVsbClcblx0e1xuXHRcdC8vIG1heSB3YW50IHRvIG9mZmVyIGRpZmYgc3BlY3VsYXJzXG5cdFx0c3VwZXIobnVsbCwgYmFzZU1ldGhvZCk7XG5cblx0XHR0aGlzLmJhc2VNZXRob2QuX2lNb2R1bGF0ZU1ldGhvZCA9IChzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgbWV0aG9kVk86TWV0aG9kVk8sIHRhcmdldFJlZzpTaGFkZXJSZWdpc3RlckVsZW1lbnQsIHJlZ2lzdGVyQ2FjaGU6U2hhZGVyUmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzOlNoYWRlclJlZ2lzdGVyRGF0YSkgPT4gdGhpcy5tb2R1bGF0ZVNwZWN1bGFyKHNoYWRlck9iamVjdCwgbWV0aG9kVk8sIHRhcmdldFJlZywgcmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzKTtcblxuXHRcdHRoaXMuX2luY2lkZW50TGlnaHQgPSAhYmFzZWRPblN1cmZhY2U7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBpSW5pdENvbnN0YW50cyhzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgbWV0aG9kVk86TWV0aG9kVk8pXG5cdHtcblxuXHRcdHZhciBpbmRleDpudW1iZXIgPSBtZXRob2RWTy5zZWNvbmRhcnlGcmFnbWVudENvbnN0YW50c0luZGV4O1xuXHRcdHNoYWRlck9iamVjdC5mcmFnbWVudENvbnN0YW50RGF0YVtpbmRleCArIDJdID0gMTtcblx0XHRzaGFkZXJPYmplY3QuZnJhZ21lbnRDb25zdGFudERhdGFbaW5kZXggKyAzXSA9IDA7XG5cdH1cblxuXHQvKipcblx0ICogRGVmaW5lcyB3aGV0aGVyIHRoZSBmcmVzbmVsIGVmZmVjdCBzaG91bGQgYmUgYmFzZWQgb24gdGhlIHZpZXcgYW5nbGUgb24gdGhlIHN1cmZhY2UgKGlmIHRydWUpLCBvciBvbiB0aGUgYW5nbGUgYmV0d2VlbiB0aGUgbGlnaHQgYW5kIHRoZSB2aWV3LlxuXHQgKi9cblx0cHVibGljIGdldCBiYXNlZE9uU3VyZmFjZSgpOmJvb2xlYW5cblx0e1xuXHRcdHJldHVybiAhdGhpcy5faW5jaWRlbnRMaWdodDtcblx0fVxuXG5cdHB1YmxpYyBzZXQgYmFzZWRPblN1cmZhY2UodmFsdWU6Ym9vbGVhbilcblx0e1xuXHRcdGlmICh0aGlzLl9pbmNpZGVudExpZ2h0ICE9IHZhbHVlKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0dGhpcy5faW5jaWRlbnRMaWdodCA9ICF2YWx1ZTtcblxuXHRcdHRoaXMuaUludmFsaWRhdGVTaGFkZXJQcm9ncmFtKCk7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIHBvd2VyIHVzZWQgaW4gdGhlIEZyZXNuZWwgZXF1YXRpb24uIEhpZ2hlciB2YWx1ZXMgbWFrZSB0aGUgZnJlc25lbCBlZmZlY3QgbW9yZSBwcm9ub3VuY2VkLiBEZWZhdWx0cyB0byA1LlxuXHQgKi9cblx0cHVibGljIGdldCBmcmVzbmVsUG93ZXIoKTpudW1iZXJcblx0e1xuXHRcdHJldHVybiB0aGlzLl9mcmVzbmVsUG93ZXI7XG5cdH1cblxuXHRwdWJsaWMgc2V0IGZyZXNuZWxQb3dlcih2YWx1ZTpudW1iZXIpXG5cdHtcblx0XHR0aGlzLl9mcmVzbmVsUG93ZXIgPSB2YWx1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGlDbGVhbkNvbXBpbGF0aW9uRGF0YSgpXG5cdHtcblx0XHRzdXBlci5pQ2xlYW5Db21waWxhdGlvbkRhdGEoKTtcblx0XHR0aGlzLl9kYXRhUmVnID0gbnVsbDtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgbWluaW11bSBhbW91bnQgb2YgcmVmbGVjdGFuY2UsIGllIHRoZSByZWZsZWN0YW5jZSB3aGVuIHRoZSB2aWV3IGRpcmVjdGlvbiBpcyBub3JtYWwgdG8gdGhlIHN1cmZhY2Ugb3IgbGlnaHQgZGlyZWN0aW9uLlxuXHQgKi9cblx0cHVibGljIGdldCBub3JtYWxSZWZsZWN0YW5jZSgpOm51bWJlclxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX25vcm1hbFJlZmxlY3RhbmNlO1xuXHR9XG5cblx0cHVibGljIHNldCBub3JtYWxSZWZsZWN0YW5jZSh2YWx1ZTpudW1iZXIpXG5cdHtcblx0XHR0aGlzLl9ub3JtYWxSZWZsZWN0YW5jZSA9IHZhbHVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgaUFjdGl2YXRlKHNoYWRlck9iamVjdDpTaGFkZXJMaWdodGluZ09iamVjdCwgbWV0aG9kVk86TWV0aG9kVk8sIHN0YWdlOlN0YWdlKVxuXHR7XG5cdFx0c3VwZXIuaUFjdGl2YXRlKHNoYWRlck9iamVjdCwgbWV0aG9kVk8sIHN0YWdlKTtcblxuXHRcdHZhciBmcmFnbWVudERhdGE6QXJyYXk8bnVtYmVyPiA9IHNoYWRlck9iamVjdC5mcmFnbWVudENvbnN0YW50RGF0YTtcblxuXHRcdHZhciBpbmRleDpudW1iZXIgPSBtZXRob2RWTy5zZWNvbmRhcnlGcmFnbWVudENvbnN0YW50c0luZGV4O1xuXHRcdGZyYWdtZW50RGF0YVtpbmRleF0gPSB0aGlzLl9ub3JtYWxSZWZsZWN0YW5jZTtcblx0XHRmcmFnbWVudERhdGFbaW5kZXggKyAxXSA9IHRoaXMuX2ZyZXNuZWxQb3dlcjtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGlHZXRGcmFnbWVudFByZUxpZ2h0aW5nQ29kZShzaGFkZXJPYmplY3Q6U2hhZGVyTGlnaHRpbmdPYmplY3QsIG1ldGhvZFZPOk1ldGhvZFZPLCByZWdpc3RlckNhY2hlOlNoYWRlclJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVyczpTaGFkZXJSZWdpc3RlckRhdGEpOnN0cmluZ1xuXHR7XG5cdFx0dGhpcy5fZGF0YVJlZyA9IHJlZ2lzdGVyQ2FjaGUuZ2V0RnJlZUZyYWdtZW50Q29uc3RhbnQoKTtcblxuXHRcdGNvbnNvbGUubG9nKCdTcGVjdWxhckZyZXNuZWxNZXRob2QnLCAnaUdldEZyYWdtZW50UHJlTGlnaHRpbmdDb2RlJywgdGhpcy5fZGF0YVJlZyk7XG5cblx0XHRtZXRob2RWTy5zZWNvbmRhcnlGcmFnbWVudENvbnN0YW50c0luZGV4ID0gdGhpcy5fZGF0YVJlZy5pbmRleCo0O1xuXG5cdFx0cmV0dXJuIHN1cGVyLmlHZXRGcmFnbWVudFByZUxpZ2h0aW5nQ29kZShzaGFkZXJPYmplY3QsIG1ldGhvZFZPLCByZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnMpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEFwcGxpZXMgdGhlIGZyZXNuZWwgZWZmZWN0IHRvIHRoZSBzcGVjdWxhciBzdHJlbmd0aC5cblx0ICpcblx0ICogQHBhcmFtIHZvIFRoZSBNZXRob2RWTyBvYmplY3QgY29udGFpbmluZyB0aGUgbWV0aG9kIGRhdGEgZm9yIHRoZSBjdXJyZW50bHkgY29tcGlsZWQgbWF0ZXJpYWwgcGFzcy5cblx0ICogQHBhcmFtIHRhcmdldCBUaGUgcmVnaXN0ZXIgY29udGFpbmluZyB0aGUgc3BlY3VsYXIgc3RyZW5ndGggaW4gdGhlIFwid1wiIGNvbXBvbmVudCwgYW5kIHRoZSBoYWxmLXZlY3Rvci9yZWZsZWN0aW9uIHZlY3RvciBpbiBcInh5elwiLlxuXHQgKiBAcGFyYW0gcmVnQ2FjaGUgVGhlIHJlZ2lzdGVyIGNhY2hlIHVzZWQgZm9yIHRoZSBzaGFkZXIgY29tcGlsYXRpb24uXG5cdCAqIEBwYXJhbSBzaGFyZWRSZWdpc3RlcnMgVGhlIHNoYXJlZCByZWdpc3RlcnMgY3JlYXRlZCBieSB0aGUgY29tcGlsZXIuXG5cdCAqIEByZXR1cm4gVGhlIEFHQUwgZnJhZ21lbnQgY29kZSBmb3IgdGhlIG1ldGhvZC5cblx0ICovXG5cdHByaXZhdGUgbW9kdWxhdGVTcGVjdWxhcihzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgbWV0aG9kVk86TWV0aG9kVk8sIHRhcmdldFJlZzpTaGFkZXJSZWdpc3RlckVsZW1lbnQsIHJlZ2lzdGVyQ2FjaGU6U2hhZGVyUmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzOlNoYWRlclJlZ2lzdGVyRGF0YSk6c3RyaW5nXG5cdHtcblx0XHR2YXIgY29kZTpzdHJpbmc7XG5cblx0XHRjb2RlID0gXCJkcDMgXCIgKyB0YXJnZXRSZWcgKyBcIi55LCBcIiArIHNoYXJlZFJlZ2lzdGVycy52aWV3RGlyRnJhZ21lbnQgKyBcIi54eXosIFwiICsgKHRoaXMuX2luY2lkZW50TGlnaHQ/IHRhcmdldFJlZyA6IHNoYXJlZFJlZ2lzdGVycy5ub3JtYWxGcmFnbWVudCkgKyBcIi54eXpcXG5cIiArICAgLy8gZG90KFYsIEgpXG5cdFx0XHRcInN1YiBcIiArIHRhcmdldFJlZyArIFwiLnksIFwiICsgdGhpcy5fZGF0YVJlZyArIFwiLnosIFwiICsgdGFyZ2V0UmVnICsgXCIueVxcblwiICsgICAgICAgICAgICAgLy8gYmFzZSA9IDEtZG90KFYsIEgpXG5cdFx0XHRcInBvdyBcIiArIHRhcmdldFJlZyArIFwiLngsIFwiICsgdGFyZ2V0UmVnICsgXCIueSwgXCIgKyB0aGlzLl9kYXRhUmVnICsgXCIueVxcblwiICsgICAgICAgICAgICAgLy8gZXhwID0gcG93KGJhc2UsIDUpXG5cdFx0XHRcInN1YiBcIiArIHRhcmdldFJlZyArIFwiLnksIFwiICsgdGhpcy5fZGF0YVJlZyArIFwiLnosIFwiICsgdGFyZ2V0UmVnICsgXCIueVxcblwiICsgICAgICAgICAgICAgLy8gMSAtIGV4cFxuXHRcdFx0XCJtdWwgXCIgKyB0YXJnZXRSZWcgKyBcIi55LCBcIiArIHRoaXMuX2RhdGFSZWcgKyBcIi54LCBcIiArIHRhcmdldFJlZyArIFwiLnlcXG5cIiArICAgICAgICAgICAgIC8vIGYwKigxIC0gZXhwKVxuXHRcdFx0XCJhZGQgXCIgKyB0YXJnZXRSZWcgKyBcIi55LCBcIiArIHRhcmdldFJlZyArIFwiLngsIFwiICsgdGFyZ2V0UmVnICsgXCIueVxcblwiICsgICAgICAgICAgLy8gZXhwICsgZjAqKDEgLSBleHApXG5cdFx0XHRcIm11bCBcIiArIHRhcmdldFJlZyArIFwiLncsIFwiICsgdGFyZ2V0UmVnICsgXCIudywgXCIgKyB0YXJnZXRSZWcgKyBcIi55XFxuXCI7XG5cblxuXHRcdGNvbnNvbGUubG9nKCdTcGVjdWxhckZyZXNuZWxNZXRob2QnLCAnbW9kdWxhdGVTcGVjdWxhcicsIGNvZGUpO1xuXG5cdFx0cmV0dXJuIGNvZGU7XG5cdH1cblxufVxuXG5leHBvcnQgPSBTcGVjdWxhckZyZXNuZWxNZXRob2Q7Il19