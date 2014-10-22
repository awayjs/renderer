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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1hdGVyaWFscy9tZXRob2RzL2RpZmZ1c2VjZWxtZXRob2QudHMiXSwibmFtZXMiOlsiRGlmZnVzZUNlbE1ldGhvZCIsIkRpZmZ1c2VDZWxNZXRob2QuY29uc3RydWN0b3IiLCJEaWZmdXNlQ2VsTWV0aG9kLmlJbml0Q29uc3RhbnRzIiwiRGlmZnVzZUNlbE1ldGhvZC5sZXZlbHMiLCJEaWZmdXNlQ2VsTWV0aG9kLnNtb290aG5lc3MiLCJEaWZmdXNlQ2VsTWV0aG9kLmlDbGVhbkNvbXBpbGF0aW9uRGF0YSIsIkRpZmZ1c2VDZWxNZXRob2QuaUdldEZyYWdtZW50UHJlTGlnaHRpbmdDb2RlIiwiRGlmZnVzZUNlbE1ldGhvZC5pQWN0aXZhdGUiLCJEaWZmdXNlQ2VsTWV0aG9kLmNsYW1wRGlmZnVzZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBV0EsSUFBTyxzQkFBc0IsV0FBYSxnRUFBZ0UsQ0FBQyxDQUFDO0FBRTVHLEFBR0E7O0dBREc7SUFDRyxnQkFBZ0I7SUFBU0EsVUFBekJBLGdCQUFnQkEsVUFBK0JBO0lBTXBEQTs7OztPQUlHQTtJQUNIQSxTQVhLQSxnQkFBZ0JBLENBV1RBLE1BQTBCQSxFQUFFQSxVQUFvQ0E7UUFYN0VDLGlCQTBIQ0E7UUEvR1lBLHNCQUEwQkEsR0FBMUJBLFVBQTBCQTtRQUFFQSwwQkFBb0NBLEdBQXBDQSxpQkFBb0NBO1FBRTNFQSxrQkFBTUEsSUFBSUEsRUFBRUEsVUFBVUEsQ0FBQ0EsQ0FBQ0E7UUFUakJBLGdCQUFXQSxHQUFVQSxFQUFFQSxDQUFDQTtRQVcvQkEsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsZ0JBQWdCQSxHQUFHQSxVQUFDQSxZQUE2QkEsRUFBRUEsUUFBaUJBLEVBQUVBLFNBQStCQSxFQUFFQSxhQUFpQ0EsRUFBRUEsZUFBa0NBLElBQUtBLE9BQUFBLEtBQUlBLENBQUNBLFlBQVlBLENBQUNBLFlBQVlBLEVBQUVBLFFBQVFBLEVBQUVBLFNBQVNBLEVBQUVBLGFBQWFBLEVBQUVBLGVBQWVBLENBQUNBLEVBQXBGQSxDQUFvRkEsQ0FBQ0E7UUFFdFJBLElBQUlBLENBQUNBLE9BQU9BLEdBQUdBLE1BQU1BLENBQUNBO0lBQ3ZCQSxDQUFDQTtJQUVERDs7T0FFR0E7SUFDSUEseUNBQWNBLEdBQXJCQSxVQUFzQkEsWUFBaUNBLEVBQUVBLFFBQWlCQTtRQUV6RUUsSUFBSUEsSUFBSUEsR0FBaUJBLFlBQVlBLENBQUNBLG9CQUFvQkEsQ0FBQ0E7UUFDM0RBLElBQUlBLEtBQUtBLEdBQWtCQSxRQUFRQSxDQUFDQSwrQkFBK0JBLENBQUNBO1FBQ3BFQSxnQkFBS0EsQ0FBQ0EsY0FBY0EsWUFBQ0EsWUFBWUEsRUFBRUEsUUFBUUEsQ0FBQ0EsQ0FBQ0E7UUFDN0NBLElBQUlBLENBQUNBLEtBQUtBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1FBQ3BCQSxJQUFJQSxDQUFDQSxLQUFLQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtJQUNyQkEsQ0FBQ0E7SUFLREYsc0JBQVdBLG9DQUFNQTtRQUhqQkE7O1dBRUdBO2FBQ0hBO1lBRUNHLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBO1FBQ3JCQSxDQUFDQTthQUVESCxVQUFrQkEsS0FBS0EsQ0FBUUEsUUFBREEsQUFBU0E7WUFFdENHLElBQUlBLENBQUNBLE9BQU9BLEdBQUdBLEtBQUtBLENBQUNBO1FBQ3RCQSxDQUFDQTs7O09BTEFIO0lBVURBLHNCQUFXQSx3Q0FBVUE7UUFIckJBOztXQUVHQTthQUNIQTtZQUVDSSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQTtRQUN6QkEsQ0FBQ0E7YUFFREosVUFBc0JBLEtBQVlBO1lBRWpDSSxJQUFJQSxDQUFDQSxXQUFXQSxHQUFHQSxLQUFLQSxDQUFDQTtRQUMxQkEsQ0FBQ0E7OztPQUxBSjtJQU9EQTs7T0FFR0E7SUFDSUEsZ0RBQXFCQSxHQUE1QkE7UUFFQ0ssZ0JBQUtBLENBQUNBLHFCQUFxQkEsV0FBRUEsQ0FBQ0E7UUFDOUJBLElBQUlBLENBQUNBLFFBQVFBLEdBQUdBLElBQUlBLENBQUNBO0lBQ3RCQSxDQUFDQTtJQUVETDs7T0FFR0E7SUFDSUEsc0RBQTJCQSxHQUFsQ0EsVUFBbUNBLFlBQWlDQSxFQUFFQSxRQUFpQkEsRUFBRUEsYUFBaUNBLEVBQUVBLGVBQWtDQTtRQUU3Sk0sSUFBSUEsQ0FBQ0EsUUFBUUEsR0FBR0EsYUFBYUEsQ0FBQ0EsdUJBQXVCQSxFQUFFQSxDQUFDQTtRQUN4REEsUUFBUUEsQ0FBQ0EsK0JBQStCQSxHQUFHQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxLQUFLQSxHQUFDQSxDQUFDQSxDQUFDQTtRQUVqRUEsTUFBTUEsQ0FBQ0EsZ0JBQUtBLENBQUNBLDJCQUEyQkEsWUFBQ0EsWUFBWUEsRUFBRUEsUUFBUUEsRUFBRUEsYUFBYUEsRUFBRUEsZUFBZUEsQ0FBQ0EsQ0FBQ0E7SUFDbEdBLENBQUNBO0lBRUROOztPQUVHQTtJQUNJQSxvQ0FBU0EsR0FBaEJBLFVBQWlCQSxZQUFpQ0EsRUFBRUEsUUFBaUJBLEVBQUVBLEtBQVdBO1FBRWpGTyxnQkFBS0EsQ0FBQ0EsU0FBU0EsWUFBQ0EsWUFBWUEsRUFBRUEsUUFBUUEsRUFBRUEsS0FBS0EsQ0FBQ0EsQ0FBQ0E7UUFDL0NBLElBQUlBLElBQUlBLEdBQWlCQSxZQUFZQSxDQUFDQSxvQkFBb0JBLENBQUNBO1FBQzNEQSxJQUFJQSxLQUFLQSxHQUFrQkEsUUFBUUEsQ0FBQ0EsK0JBQStCQSxDQUFDQTtRQUNwRUEsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0E7UUFDM0JBLElBQUlBLENBQUNBLEtBQUtBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBO0lBQ3BDQSxDQUFDQTtJQUVEUDs7Ozs7OztPQU9HQTtJQUNLQSx1Q0FBWUEsR0FBcEJBLFVBQXFCQSxZQUE2QkEsRUFBRUEsUUFBaUJBLEVBQUVBLFNBQStCQSxFQUFFQSxhQUFpQ0EsRUFBRUEsZUFBa0NBO1FBRTVLUSxNQUFNQSxDQUFDQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUFHQSxJQUFJQSxDQUFDQSxRQUFRQSxHQUFHQSxNQUFNQSxHQUMvRUEsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FDaERBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQ3JFQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUFHQSxJQUFJQSxDQUFDQSxRQUFRQSxHQUFHQSxNQUFNQSxHQUNwREEsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FBR0EsSUFBSUEsQ0FBQ0EsUUFBUUEsR0FBR0EsTUFBTUEsR0FDekVBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLEtBQUtBLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQy9DQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUdyRUEsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FHckVBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQUdBLElBQUlBLENBQUNBLFFBQVFBLEdBQUdBLE1BQU1BLEdBQ3pFQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUVoREEsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FFckVBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQUdBLElBQUlBLENBQUNBLFFBQVFBLEdBQUdBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQ3pFQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUNyRUEsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FDckVBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLENBQUNBO0lBQ25EQSxDQUFDQTtJQUNGUix1QkFBQ0E7QUFBREEsQ0ExSEEsQUEwSENBLEVBMUg4QixzQkFBc0IsRUEwSHBEO0FBRUQsQUFBMEIsaUJBQWpCLGdCQUFnQixDQUFDIiwiZmlsZSI6Im1hdGVyaWFscy9tZXRob2RzL0RpZmZ1c2VDZWxNZXRob2QuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL3JvYmJhdGVtYW4vV2Vic3Rvcm1Qcm9qZWN0cy9hd2F5anMtcmVuZGVyZXJnbC8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU3RhZ2VcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9jb3JlL2Jhc2UvU3RhZ2VcIik7XG5pbXBvcnQgSUNvbnRleHRTdGFnZUdMXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9jb3JlL3N0YWdlZ2wvSUNvbnRleHRTdGFnZUdMXCIpO1xuaW1wb3J0IE1ldGhvZFZPXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvbWF0ZXJpYWxzL2NvbXBpbGF0aW9uL01ldGhvZFZPXCIpO1xuaW1wb3J0IFNoYWRlckxpZ2h0aW5nT2JqZWN0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvbWF0ZXJpYWxzL2NvbXBpbGF0aW9uL1NoYWRlckxpZ2h0aW5nT2JqZWN0XCIpO1xuaW1wb3J0IFNoYWRlck9iamVjdEJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL21hdGVyaWFscy9jb21waWxhdGlvbi9TaGFkZXJPYmplY3RCYXNlXCIpO1xuaW1wb3J0IFNoYWRlclJlZ2lzdGVyQ2FjaGVcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9tYXRlcmlhbHMvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJDYWNoZVwiKTtcbmltcG9ydCBTaGFkZXJSZWdpc3RlckRhdGFcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9tYXRlcmlhbHMvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJEYXRhXCIpO1xuaW1wb3J0IFNoYWRlclJlZ2lzdGVyRWxlbWVudFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9tYXRlcmlhbHMvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJFbGVtZW50XCIpO1xuaW1wb3J0IERpZmZ1c2VCYXNpY01ldGhvZFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL21hdGVyaWFscy9tZXRob2RzL0RpZmZ1c2VCYXNpY01ldGhvZFwiKTtcbmltcG9ydCBTaGFkZXJDb21waWxlckhlbHBlclx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL21hdGVyaWFscy91dGlscy9TaGFkZXJDb21waWxlckhlbHBlclwiKTtcblxuaW1wb3J0IERpZmZ1c2VDb21wb3NpdGVNZXRob2RcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvbWF0ZXJpYWxzL21ldGhvZHMvRGlmZnVzZUNvbXBvc2l0ZU1ldGhvZFwiKTtcblxuLyoqXG4gKiBEaWZmdXNlQ2VsTWV0aG9kIHByb3ZpZGVzIGEgc2hhZGluZyBtZXRob2QgdG8gYWRkIGRpZmZ1c2UgY2VsIChjYXJ0b29uKSBzaGFkaW5nLlxuICovXG5jbGFzcyBEaWZmdXNlQ2VsTWV0aG9kIGV4dGVuZHMgRGlmZnVzZUNvbXBvc2l0ZU1ldGhvZFxue1xuXHRwcml2YXRlIF9sZXZlbHM6bnVtYmVyIC8qdWludCovO1xuXHRwcml2YXRlIF9kYXRhUmVnOlNoYWRlclJlZ2lzdGVyRWxlbWVudDtcblx0cHJpdmF0ZSBfc21vb3RobmVzczpudW1iZXIgPSAuMTtcblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyBEaWZmdXNlQ2VsTWV0aG9kIG9iamVjdC5cblx0ICogQHBhcmFtIGxldmVscyBUaGUgYW1vdW50IG9mIHNoYWRvdyBncmFkYXRpb25zLlxuXHQgKiBAcGFyYW0gYmFzZU1ldGhvZCBBbiBvcHRpb25hbCBkaWZmdXNlIG1ldGhvZCBvbiB3aGljaCB0aGUgY2FydG9vbiBzaGFkaW5nIGlzIGJhc2VkLiBJZiBvbWl0dGVkLCBEaWZmdXNlQmFzaWNNZXRob2QgaXMgdXNlZC5cblx0ICovXG5cdGNvbnN0cnVjdG9yKGxldmVsczpudW1iZXIgLyp1aW50Ki8gPSAzLCBiYXNlTWV0aG9kOkRpZmZ1c2VCYXNpY01ldGhvZCA9IG51bGwpXG5cdHtcblx0XHRzdXBlcihudWxsLCBiYXNlTWV0aG9kKTtcblxuXHRcdHRoaXMuYmFzZU1ldGhvZC5faU1vZHVsYXRlTWV0aG9kID0gKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCBtZXRob2RWTzpNZXRob2RWTywgdGFyZ2V0UmVnOlNoYWRlclJlZ2lzdGVyRWxlbWVudCwgcmVnaXN0ZXJDYWNoZTpTaGFkZXJSZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnM6U2hhZGVyUmVnaXN0ZXJEYXRhKSA9PiB0aGlzLmNsYW1wRGlmZnVzZShzaGFkZXJPYmplY3QsIG1ldGhvZFZPLCB0YXJnZXRSZWcsIHJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVycyk7XG5cblx0XHR0aGlzLl9sZXZlbHMgPSBsZXZlbHM7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBpSW5pdENvbnN0YW50cyhzaGFkZXJPYmplY3Q6U2hhZGVyTGlnaHRpbmdPYmplY3QsIG1ldGhvZFZPOk1ldGhvZFZPKVxuXHR7XG5cdFx0dmFyIGRhdGE6QXJyYXk8bnVtYmVyPiA9IHNoYWRlck9iamVjdC5mcmFnbWVudENvbnN0YW50RGF0YTtcblx0XHR2YXIgaW5kZXg6bnVtYmVyIC8qaW50Ki8gPSBtZXRob2RWTy5zZWNvbmRhcnlGcmFnbWVudENvbnN0YW50c0luZGV4O1xuXHRcdHN1cGVyLmlJbml0Q29uc3RhbnRzKHNoYWRlck9iamVjdCwgbWV0aG9kVk8pO1xuXHRcdGRhdGFbaW5kZXggKyAxXSA9IDE7XG5cdFx0ZGF0YVtpbmRleCArIDJdID0gMDtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgYW1vdW50IG9mIHNoYWRvdyBncmFkYXRpb25zLlxuXHQgKi9cblx0cHVibGljIGdldCBsZXZlbHMoKTpudW1iZXIgLyp1aW50Ki9cblx0e1xuXHRcdHJldHVybiB0aGlzLl9sZXZlbHM7XG5cdH1cblxuXHRwdWJsaWMgc2V0IGxldmVscyh2YWx1ZTpudW1iZXIgLyp1aW50Ki8pXG5cdHtcblx0XHR0aGlzLl9sZXZlbHMgPSB2YWx1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgc21vb3RobmVzcyBvZiB0aGUgZWRnZSBiZXR3ZWVuIDIgc2hhZGluZyBsZXZlbHMuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IHNtb290aG5lc3MoKTpudW1iZXJcblx0e1xuXHRcdHJldHVybiB0aGlzLl9zbW9vdGhuZXNzO1xuXHR9XG5cblx0cHVibGljIHNldCBzbW9vdGhuZXNzKHZhbHVlOm51bWJlcilcblx0e1xuXHRcdHRoaXMuX3Ntb290aG5lc3MgPSB2YWx1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGlDbGVhbkNvbXBpbGF0aW9uRGF0YSgpXG5cdHtcblx0XHRzdXBlci5pQ2xlYW5Db21waWxhdGlvbkRhdGEoKTtcblx0XHR0aGlzLl9kYXRhUmVnID0gbnVsbDtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGlHZXRGcmFnbWVudFByZUxpZ2h0aW5nQ29kZShzaGFkZXJPYmplY3Q6U2hhZGVyTGlnaHRpbmdPYmplY3QsIG1ldGhvZFZPOk1ldGhvZFZPLCByZWdpc3RlckNhY2hlOlNoYWRlclJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVyczpTaGFkZXJSZWdpc3RlckRhdGEpOnN0cmluZ1xuXHR7XG5cdFx0dGhpcy5fZGF0YVJlZyA9IHJlZ2lzdGVyQ2FjaGUuZ2V0RnJlZUZyYWdtZW50Q29uc3RhbnQoKTtcblx0XHRtZXRob2RWTy5zZWNvbmRhcnlGcmFnbWVudENvbnN0YW50c0luZGV4ID0gdGhpcy5fZGF0YVJlZy5pbmRleCo0O1xuXG5cdFx0cmV0dXJuIHN1cGVyLmlHZXRGcmFnbWVudFByZUxpZ2h0aW5nQ29kZShzaGFkZXJPYmplY3QsIG1ldGhvZFZPLCByZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnMpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgaUFjdGl2YXRlKHNoYWRlck9iamVjdDpTaGFkZXJMaWdodGluZ09iamVjdCwgbWV0aG9kVk86TWV0aG9kVk8sIHN0YWdlOlN0YWdlKVxuXHR7XG5cdFx0c3VwZXIuaUFjdGl2YXRlKHNoYWRlck9iamVjdCwgbWV0aG9kVk8sIHN0YWdlKTtcblx0XHR2YXIgZGF0YTpBcnJheTxudW1iZXI+ID0gc2hhZGVyT2JqZWN0LmZyYWdtZW50Q29uc3RhbnREYXRhO1xuXHRcdHZhciBpbmRleDpudW1iZXIgLyppbnQqLyA9IG1ldGhvZFZPLnNlY29uZGFyeUZyYWdtZW50Q29uc3RhbnRzSW5kZXg7XG5cdFx0ZGF0YVtpbmRleF0gPSB0aGlzLl9sZXZlbHM7XG5cdFx0ZGF0YVtpbmRleCArIDNdID0gdGhpcy5fc21vb3RobmVzcztcblx0fVxuXG5cdC8qKlxuXHQgKiBTbmFwcyB0aGUgZGlmZnVzZSBzaGFkaW5nIG9mIHRoZSB3cmFwcGVkIG1ldGhvZCB0byBvbmUgb2YgdGhlIGxldmVscy5cblx0ICogQHBhcmFtIHZvIFRoZSBNZXRob2RWTyB1c2VkIHRvIGNvbXBpbGUgdGhlIGN1cnJlbnQgc2hhZGVyLlxuXHQgKiBAcGFyYW0gdCBUaGUgcmVnaXN0ZXIgY29udGFpbmluZyB0aGUgZGlmZnVzZSBzdHJlbmd0aCBpbiB0aGUgXCJ3XCIgY29tcG9uZW50LlxuXHQgKiBAcGFyYW0gcmVnQ2FjaGUgVGhlIHJlZ2lzdGVyIGNhY2hlIHVzZWQgZm9yIHRoZSBzaGFkZXIgY29tcGlsYXRpb24uXG5cdCAqIEBwYXJhbSBzaGFyZWRSZWdpc3RlcnMgVGhlIHNoYXJlZCByZWdpc3RlciBkYXRhIGZvciB0aGlzIHNoYWRlci5cblx0ICogQHJldHVybiBUaGUgQUdBTCBmcmFnbWVudCBjb2RlIGZvciB0aGUgbWV0aG9kLlxuXHQgKi9cblx0cHJpdmF0ZSBjbGFtcERpZmZ1c2Uoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIG1ldGhvZFZPOk1ldGhvZFZPLCB0YXJnZXRSZWc6U2hhZGVyUmVnaXN0ZXJFbGVtZW50LCByZWdpc3RlckNhY2hlOlNoYWRlclJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVyczpTaGFkZXJSZWdpc3RlckRhdGEpOnN0cmluZ1xuXHR7XG5cdFx0cmV0dXJuIFwibXVsIFwiICsgdGFyZ2V0UmVnICsgXCIudywgXCIgKyB0YXJnZXRSZWcgKyBcIi53LCBcIiArIHRoaXMuX2RhdGFSZWcgKyBcIi54XFxuXCIgK1xuXHRcdFx0XCJmcmMgXCIgKyB0YXJnZXRSZWcgKyBcIi56LCBcIiArIHRhcmdldFJlZyArIFwiLndcXG5cIiArXG5cdFx0XHRcInN1YiBcIiArIHRhcmdldFJlZyArIFwiLnksIFwiICsgdGFyZ2V0UmVnICsgXCIudywgXCIgKyB0YXJnZXRSZWcgKyBcIi56XFxuXCIgK1xuXHRcdFx0XCJtb3YgXCIgKyB0YXJnZXRSZWcgKyBcIi54LCBcIiArIHRoaXMuX2RhdGFSZWcgKyBcIi54XFxuXCIgK1xuXHRcdFx0XCJzdWIgXCIgKyB0YXJnZXRSZWcgKyBcIi54LCBcIiArIHRhcmdldFJlZyArIFwiLngsIFwiICsgdGhpcy5fZGF0YVJlZyArIFwiLnlcXG5cIiArXG5cdFx0XHRcInJjcCBcIiArIHRhcmdldFJlZyArIFwiLngsXCIgKyB0YXJnZXRSZWcgKyBcIi54XFxuXCIgK1xuXHRcdFx0XCJtdWwgXCIgKyB0YXJnZXRSZWcgKyBcIi53LCBcIiArIHRhcmdldFJlZyArIFwiLnksIFwiICsgdGFyZ2V0UmVnICsgXCIueFxcblwiICtcblxuXHRcdFx0Ly8gcHJldmlvdXMgY2xhbXBlZCBzdHJlbmd0aFxuXHRcdFx0XCJzdWIgXCIgKyB0YXJnZXRSZWcgKyBcIi55LCBcIiArIHRhcmdldFJlZyArIFwiLncsIFwiICsgdGFyZ2V0UmVnICsgXCIueFxcblwiICtcblxuXHRcdFx0Ly8gZnJhY3QvZXBzaWxvbiAoc28gMCAtIGVwc2lsb24gd2lsbCBiZWNvbWUgMCAtIDEpXG5cdFx0XHRcImRpdiBcIiArIHRhcmdldFJlZyArIFwiLnosIFwiICsgdGFyZ2V0UmVnICsgXCIueiwgXCIgKyB0aGlzLl9kYXRhUmVnICsgXCIud1xcblwiICtcblx0XHRcdFwic2F0IFwiICsgdGFyZ2V0UmVnICsgXCIueiwgXCIgKyB0YXJnZXRSZWcgKyBcIi56XFxuXCIgK1xuXG5cdFx0XHRcIm11bCBcIiArIHRhcmdldFJlZyArIFwiLncsIFwiICsgdGFyZ2V0UmVnICsgXCIudywgXCIgKyB0YXJnZXRSZWcgKyBcIi56XFxuXCIgK1xuXHRcdFx0Ly8gMS16XG5cdFx0XHRcInN1YiBcIiArIHRhcmdldFJlZyArIFwiLnosIFwiICsgdGhpcy5fZGF0YVJlZyArIFwiLnksIFwiICsgdGFyZ2V0UmVnICsgXCIuelxcblwiICtcblx0XHRcdFwibXVsIFwiICsgdGFyZ2V0UmVnICsgXCIueSwgXCIgKyB0YXJnZXRSZWcgKyBcIi55LCBcIiArIHRhcmdldFJlZyArIFwiLnpcXG5cIiArXG5cdFx0XHRcImFkZCBcIiArIHRhcmdldFJlZyArIFwiLncsIFwiICsgdGFyZ2V0UmVnICsgXCIudywgXCIgKyB0YXJnZXRSZWcgKyBcIi55XFxuXCIgK1xuXHRcdFx0XCJzYXQgXCIgKyB0YXJnZXRSZWcgKyBcIi53LCBcIiArIHRhcmdldFJlZyArIFwiLndcXG5cIjtcblx0fVxufVxuXG5leHBvcnQgPSBEaWZmdXNlQ2VsTWV0aG9kOyJdfQ==