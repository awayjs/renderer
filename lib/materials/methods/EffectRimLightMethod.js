var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var EffectMethodBase = require("awayjs-renderergl/lib/materials/methods/EffectMethodBase");
/**
 * EffectRimLightMethod provides a method to add rim lighting to a material. This adds a glow-like effect to edges of objects.
 */
var EffectRimLightMethod = (function (_super) {
    __extends(EffectRimLightMethod, _super);
    /**
     * Creates a new <code>EffectRimLightMethod</code> object.
     *
     * @param color The colour of the rim light.
     * @param strength The strength of the rim light.
     * @param power The power of the rim light. Higher values will result in a higher edge fall-off.
     * @param blend The blend mode with which to add the light to the object.
     */
    function EffectRimLightMethod(color, strength, power, blend) {
        if (color === void 0) { color = 0xffffff; }
        if (strength === void 0) { strength = .4; }
        if (power === void 0) { power = 2; }
        if (blend === void 0) { blend = "mix"; }
        _super.call(this);
        this._blendMode = blend;
        this._strength = strength;
        this._power = power;
        this.color = color;
    }
    /**
     * @inheritDoc
     */
    EffectRimLightMethod.prototype.iInitConstants = function (shaderObject, methodVO) {
        shaderObject.fragmentConstantData[methodVO.fragmentConstantsIndex + 3] = 1;
    };
    /**
     * @inheritDoc
     */
    EffectRimLightMethod.prototype.iInitVO = function (shaderObject, methodVO) {
        methodVO.needsNormals = true;
        methodVO.needsView = true;
    };
    Object.defineProperty(EffectRimLightMethod.prototype, "blendMode", {
        /**
         * The blend mode with which to add the light to the object.
         *
         * EffectRimLightMethod.MULTIPLY multiplies the rim light with the material's colour.
         * EffectRimLightMethod.ADD adds the rim light with the material's colour.
         * EffectRimLightMethod.MIX provides normal alpha blending.
         */
        get: function () {
            return this._blendMode;
        },
        set: function (value) {
            if (this._blendMode == value)
                return;
            this._blendMode = value;
            this.iInvalidateShaderProgram();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EffectRimLightMethod.prototype, "color", {
        /**
         * The color of the rim light.
         */
        get: function () {
            return this._color;
        },
        set: function (value /*uint*/) {
            this._color = value;
            this._colorR = ((value >> 16) & 0xff) / 0xff;
            this._colorG = ((value >> 8) & 0xff) / 0xff;
            this._colorB = (value & 0xff) / 0xff;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EffectRimLightMethod.prototype, "strength", {
        /**
         * The strength of the rim light.
         */
        get: function () {
            return this._strength;
        },
        set: function (value) {
            this._strength = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EffectRimLightMethod.prototype, "power", {
        /**
         * The power of the rim light. Higher values will result in a higher edge fall-off.
         */
        get: function () {
            return this._power;
        },
        set: function (value) {
            this._power = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    EffectRimLightMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
        var index = methodVO.fragmentConstantsIndex;
        var data = shaderObject.fragmentConstantData;
        data[index] = this._colorR;
        data[index + 1] = this._colorG;
        data[index + 2] = this._colorB;
        data[index + 4] = this._strength;
        data[index + 5] = this._power;
    };
    /**
     * @inheritDoc
     */
    EffectRimLightMethod.prototype.iGetFragmentCode = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
        var dataRegister = registerCache.getFreeFragmentConstant();
        var dataRegister2 = registerCache.getFreeFragmentConstant();
        var temp = registerCache.getFreeFragmentVectorTemp();
        var code = "";
        methodVO.fragmentConstantsIndex = dataRegister.index * 4;
        code += "dp3 " + temp + ".x, " + sharedRegisters.viewDirFragment + ".xyz, " + sharedRegisters.normalFragment + ".xyz\n" + "sat " + temp + ".x, " + temp + ".x\n" + "sub " + temp + ".x, " + dataRegister + ".w, " + temp + ".x\n" + "pow " + temp + ".x, " + temp + ".x, " + dataRegister2 + ".y\n" + "mul " + temp + ".x, " + temp + ".x, " + dataRegister2 + ".x\n" + "sub " + temp + ".x, " + dataRegister + ".w, " + temp + ".x\n" + "mul " + targetReg + ".xyz, " + targetReg + ".xyz, " + temp + ".x\n" + "sub " + temp + ".w, " + dataRegister + ".w, " + temp + ".x\n";
        if (this._blendMode == EffectRimLightMethod.ADD) {
            code += "mul " + temp + ".xyz, " + temp + ".w, " + dataRegister + ".xyz\n" + "add " + targetReg + ".xyz, " + targetReg + ".xyz, " + temp + ".xyz\n";
        }
        else if (this._blendMode == EffectRimLightMethod.MULTIPLY) {
            code += "mul " + temp + ".xyz, " + temp + ".w, " + dataRegister + ".xyz\n" + "mul " + targetReg + ".xyz, " + targetReg + ".xyz, " + temp + ".xyz\n";
        }
        else {
            code += "sub " + temp + ".xyz, " + dataRegister + ".xyz, " + targetReg + ".xyz\n" + "mul " + temp + ".xyz, " + temp + ".xyz, " + temp + ".w\n" + "add " + targetReg + ".xyz, " + targetReg + ".xyz, " + temp + ".xyz\n";
        }
        return code;
    };
    EffectRimLightMethod.ADD = "add";
    EffectRimLightMethod.MULTIPLY = "multiply";
    EffectRimLightMethod.MIX = "mix";
    return EffectRimLightMethod;
})(EffectMethodBase);
module.exports = EffectRimLightMethod;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvbWV0aG9kcy9lZmZlY3RyaW1saWdodG1ldGhvZC50cyJdLCJuYW1lcyI6WyJFZmZlY3RSaW1MaWdodE1ldGhvZCIsIkVmZmVjdFJpbUxpZ2h0TWV0aG9kLmNvbnN0cnVjdG9yIiwiRWZmZWN0UmltTGlnaHRNZXRob2QuaUluaXRDb25zdGFudHMiLCJFZmZlY3RSaW1MaWdodE1ldGhvZC5pSW5pdFZPIiwiRWZmZWN0UmltTGlnaHRNZXRob2QuYmxlbmRNb2RlIiwiRWZmZWN0UmltTGlnaHRNZXRob2QuY29sb3IiLCJFZmZlY3RSaW1MaWdodE1ldGhvZC5zdHJlbmd0aCIsIkVmZmVjdFJpbUxpZ2h0TWV0aG9kLnBvd2VyIiwiRWZmZWN0UmltTGlnaHRNZXRob2QuaUFjdGl2YXRlIiwiRWZmZWN0UmltTGlnaHRNZXRob2QuaUdldEZyYWdtZW50Q29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBT0EsSUFBTyxnQkFBZ0IsV0FBZSwwREFBMEQsQ0FBQyxDQUFDO0FBRWxHLEFBR0E7O0dBREc7SUFDRyxvQkFBb0I7SUFBU0EsVUFBN0JBLG9CQUFvQkEsVUFBeUJBO0lBY2xEQTs7Ozs7OztPQU9HQTtJQUNIQSxTQXRCS0Esb0JBQW9CQSxDQXNCYkEsS0FBZ0NBLEVBQUVBLFFBQW9CQSxFQUFFQSxLQUFnQkEsRUFBRUEsS0FBb0JBO1FBQTlGQyxxQkFBZ0NBLEdBQWhDQSxnQkFBZ0NBO1FBQUVBLHdCQUFvQkEsR0FBcEJBLGFBQW9CQTtRQUFFQSxxQkFBZ0JBLEdBQWhCQSxTQUFnQkE7UUFBRUEscUJBQW9CQSxHQUFwQkEsYUFBb0JBO1FBRXpHQSxpQkFBT0EsQ0FBQ0E7UUFFUkEsSUFBSUEsQ0FBQ0EsVUFBVUEsR0FBR0EsS0FBS0EsQ0FBQ0E7UUFDeEJBLElBQUlBLENBQUNBLFNBQVNBLEdBQUdBLFFBQVFBLENBQUNBO1FBQzFCQSxJQUFJQSxDQUFDQSxNQUFNQSxHQUFHQSxLQUFLQSxDQUFDQTtRQUVwQkEs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QSxNQUFNQSxHQUFHQSxJQUFJQSxHQUFHQSxNQUFNQSxHQUFHQSxJQUFJQSxHQUFHQSxNQUFNQSxHQUFHQSxhQUFhQSxHQUFHQSxNQUFNQSxHQUMvREEsTUFBTUEsR0FBR0EsSUFBSUEsR0FBR0EsTUFBTUEsR0FBR0EsSUFBSUEsR0FBR0EsTUFBTUEsR0FBR0EsYUFBYUEsR0FBR0EsTUFBTUEsR0FDL0RBLE1BQU1BLEdBQUdBLElBQUlBLEdBQUdBLE1BQU1BLEdBQUdBLFlBQVlBLEdBQUdBLE1BQU1BLEdBQUdBLElBQUlBLEdBQUdBLE1BQU1BLEdBQzlEQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxRQUFRQSxHQUFHQSxTQUFTQSxHQUFHQSxRQUFRQSxHQUFHQSxJQUFJQSxHQUFHQSxNQUFNQSxHQUNwRUEsTUFBTUEsR0FBR0EsSUFBSUEsR0FBR0EsTUFBTUEsR0FBR0EsWUFBWUEsR0FBR0EsTUFBTUEsR0FBR0EsSUFBSUEsR0FBR0EsTUFBTUEsQ0FBQ0E7UUFFaEVBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFVBQVVBLElBQUlBLG9CQUFvQkEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDakRBLElBQUlBLElBQUlBLE1BQU1BLEdBQUdBLElBQUlBLEdBQUdBLFFBQVFBLEdBQUdBLElBQUlBLEdBQUdBLE1BQU1BLEdBQUdBLFlBQVlBLEdBQUdBLFFBQVFBLEdBQ3pFQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxRQUFRQSxHQUFHQSxTQUFTQSxHQUFHQSxRQUFRQSxHQUFHQSxJQUFJQSxHQUFHQSxRQUFRQSxDQUFDQTtRQUN6RUEsQ0FBQ0E7UUFBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsVUFBVUEsSUFBSUEsb0JBQW9CQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUM3REEsSUFBSUEsSUFBSUEsTUFBTUEsR0FBR0EsSUFBSUEsR0FBR0EsUUFBUUEsR0FBR0EsSUFBSUEsR0FBR0EsTUFBTUEsR0FBR0EsWUFBWUEsR0FBR0EsUUFBUUEsR0FDekVBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLFFBQVFBLEdBQUdBLFNBQVNBLEdBQUdBLFFBQVFBLEdBQUdBLElBQUlBLEdBQUdBLFFBQVFBLENBQUNBO1FBQ3pFQSxDQUFDQTtRQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtZQUNQQSxJQUFJQSxJQUFJQSxNQUFNQSxHQUFHQSxJQUFJQSxHQUFHQSxRQUFRQSxHQUFHQSxZQUFZQSxHQUFHQSxRQUFRQSxHQUFHQSxTQUFTQSxHQUFHQSxRQUFRQSxHQUNoRkEsTUFBTUEsR0FBR0EsSUFBSUEsR0FBR0EsUUFBUUEsR0FBR0EsSUFBSUEsR0FBR0EsUUFBUUEsR0FBR0EsSUFBSUEsR0FBR0EsTUFBTUEsR0FDMURBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLFFBQVFBLEdBQUdBLFNBQVNBLEdBQUdBLFFBQVFBLEdBQUdBLElBQUlBLEdBQUdBLFFBQVFBLENBQUNBO1FBQ3pFQSxDQUFDQTtRQUVEQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQTtJQUNiQSxDQUFDQTtJQWpLYVQsd0JBQUdBLEdBQVVBLEtBQUtBLENBQUNBO0lBQ25CQSw2QkFBUUEsR0FBVUEsVUFBVUEsQ0FBQ0E7SUFDN0JBLHdCQUFHQSxHQUFVQSxLQUFLQSxDQUFDQTtJQWdLbENBLDJCQUFDQTtBQUFEQSxDQXBLQSxBQW9LQ0EsRUFwS2tDLGdCQUFnQixFQW9LbEQ7QUFFRCxBQUE4QixpQkFBckIsb0JBQW9CLENBQUMiLCJmaWxlIjoibWF0ZXJpYWxzL21ldGhvZHMvRWZmZWN0UmltTGlnaHRNZXRob2QuanMiLCJzb3VyY2VSb290IjoiLi4vIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFN0YWdlXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvYmFzZS9TdGFnZVwiKTtcblxuaW1wb3J0IE1ldGhvZFZPXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvbWF0ZXJpYWxzL2NvbXBpbGF0aW9uL01ldGhvZFZPXCIpO1xuaW1wb3J0IFNoYWRlck9iamVjdEJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL21hdGVyaWFscy9jb21waWxhdGlvbi9TaGFkZXJPYmplY3RCYXNlXCIpO1xuaW1wb3J0IFNoYWRlclJlZ2lzdGVyQ2FjaGVcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJDYWNoZVwiKTtcbmltcG9ydCBTaGFkZXJSZWdpc3RlckRhdGFcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJEYXRhXCIpO1xuaW1wb3J0IFNoYWRlclJlZ2lzdGVyRWxlbWVudFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJFbGVtZW50XCIpO1xuaW1wb3J0IEVmZmVjdE1ldGhvZEJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL21hdGVyaWFscy9tZXRob2RzL0VmZmVjdE1ldGhvZEJhc2VcIik7XG5cbi8qKlxuICogRWZmZWN0UmltTGlnaHRNZXRob2QgcHJvdmlkZXMgYSBtZXRob2QgdG8gYWRkIHJpbSBsaWdodGluZyB0byBhIG1hdGVyaWFsLiBUaGlzIGFkZHMgYSBnbG93LWxpa2UgZWZmZWN0IHRvIGVkZ2VzIG9mIG9iamVjdHMuXG4gKi9cbmNsYXNzIEVmZmVjdFJpbUxpZ2h0TWV0aG9kIGV4dGVuZHMgRWZmZWN0TWV0aG9kQmFzZVxue1xuXHRwdWJsaWMgc3RhdGljIEFERDpzdHJpbmcgPSBcImFkZFwiO1xuXHRwdWJsaWMgc3RhdGljIE1VTFRJUExZOnN0cmluZyA9IFwibXVsdGlwbHlcIjtcblx0cHVibGljIHN0YXRpYyBNSVg6c3RyaW5nID0gXCJtaXhcIjtcblxuXHRwcml2YXRlIF9jb2xvcjpudW1iZXIgLyp1aW50Ki87XG5cdHByaXZhdGUgX2JsZW5kTW9kZTpzdHJpbmc7XG5cdHByaXZhdGUgX2NvbG9yUjpudW1iZXI7XG5cdHByaXZhdGUgX2NvbG9yRzpudW1iZXI7XG5cdHByaXZhdGUgX2NvbG9yQjpudW1iZXI7XG5cdHByaXZhdGUgX3N0cmVuZ3RoOm51bWJlcjtcblx0cHJpdmF0ZSBfcG93ZXI6bnVtYmVyO1xuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IDxjb2RlPkVmZmVjdFJpbUxpZ2h0TWV0aG9kPC9jb2RlPiBvYmplY3QuXG5cdCAqXG5cdCAqIEBwYXJhbSBjb2xvciBUaGUgY29sb3VyIG9mIHRoZSByaW0gbGlnaHQuXG5cdCAqIEBwYXJhbSBzdHJlbmd0aCBUaGUgc3RyZW5ndGggb2YgdGhlIHJpbSBsaWdodC5cblx0ICogQHBhcmFtIHBvd2VyIFRoZSBwb3dlciBvZiB0aGUgcmltIGxpZ2h0LiBIaWdoZXIgdmFsdWVzIHdpbGwgcmVzdWx0IGluIGEgaGlnaGVyIGVkZ2UgZmFsbC1vZmYuXG5cdCAqIEBwYXJhbSBibGVuZCBUaGUgYmxlbmQgbW9kZSB3aXRoIHdoaWNoIHRvIGFkZCB0aGUgbGlnaHQgdG8gdGhlIG9iamVjdC5cblx0ICovXG5cdGNvbnN0cnVjdG9yKGNvbG9yOm51bWJlciAvKnVpbnQqLyA9IDB4ZmZmZmZmLCBzdHJlbmd0aDpudW1iZXIgPSAuNCwgcG93ZXI6bnVtYmVyID0gMiwgYmxlbmQ6c3RyaW5nID0gXCJtaXhcIilcblx0e1xuXHRcdHN1cGVyKCk7XG5cblx0XHR0aGlzLl9ibGVuZE1vZGUgPSBibGVuZDtcblx0XHR0aGlzLl9zdHJlbmd0aCA9IHN0cmVuZ3RoO1xuXHRcdHRoaXMuX3Bvd2VyID0gcG93ZXI7XG5cblx0XHR0aGlzLmNvbG9yID0gY29sb3I7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBpSW5pdENvbnN0YW50cyhzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgbWV0aG9kVk86TWV0aG9kVk8pXG5cdHtcblx0XHRzaGFkZXJPYmplY3QuZnJhZ21lbnRDb25zdGFudERhdGFbbWV0aG9kVk8uZnJhZ21lbnRDb25zdGFudHNJbmRleCArIDNdID0gMTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGlJbml0Vk8oc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIG1ldGhvZFZPOk1ldGhvZFZPKVxuXHR7XG5cdFx0bWV0aG9kVk8ubmVlZHNOb3JtYWxzID0gdHJ1ZTtcblx0XHRtZXRob2RWTy5uZWVkc1ZpZXcgPSB0cnVlO1xuXHR9XG5cblxuXHQvKipcblx0ICogVGhlIGJsZW5kIG1vZGUgd2l0aCB3aGljaCB0byBhZGQgdGhlIGxpZ2h0IHRvIHRoZSBvYmplY3QuXG5cdCAqXG5cdCAqIEVmZmVjdFJpbUxpZ2h0TWV0aG9kLk1VTFRJUExZIG11bHRpcGxpZXMgdGhlIHJpbSBsaWdodCB3aXRoIHRoZSBtYXRlcmlhbCdzIGNvbG91ci5cblx0ICogRWZmZWN0UmltTGlnaHRNZXRob2QuQUREIGFkZHMgdGhlIHJpbSBsaWdodCB3aXRoIHRoZSBtYXRlcmlhbCdzIGNvbG91ci5cblx0ICogRWZmZWN0UmltTGlnaHRNZXRob2QuTUlYIHByb3ZpZGVzIG5vcm1hbCBhbHBoYSBibGVuZGluZy5cblx0ICovXG5cdHB1YmxpYyBnZXQgYmxlbmRNb2RlKCk6c3RyaW5nXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fYmxlbmRNb2RlO1xuXHR9XG5cblx0cHVibGljIHNldCBibGVuZE1vZGUodmFsdWU6c3RyaW5nKVxuXHR7XG5cdFx0aWYgKHRoaXMuX2JsZW5kTW9kZSA9PSB2YWx1ZSlcblx0XHRcdHJldHVybjtcblxuXHRcdHRoaXMuX2JsZW5kTW9kZSA9IHZhbHVlO1xuXG5cdFx0dGhpcy5pSW52YWxpZGF0ZVNoYWRlclByb2dyYW0oKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgY29sb3Igb2YgdGhlIHJpbSBsaWdodC5cblx0ICovXG5cdHB1YmxpYyBnZXQgY29sb3IoKTpudW1iZXIgLyp1aW50Ki9cblx0e1xuXHRcdHJldHVybiB0aGlzLl9jb2xvcjtcblx0fVxuXG5cdHB1YmxpYyBzZXQgY29sb3IodmFsdWU6bnVtYmVyIC8qdWludCovKVxuXHR7XG5cdFx0dGhpcy5fY29sb3IgPSB2YWx1ZTtcblx0XHR0aGlzLl9jb2xvclIgPSAoKHZhbHVlID4+IDE2KSAmIDB4ZmYpLzB4ZmY7XG5cdFx0dGhpcy5fY29sb3JHID0gKCh2YWx1ZSA+PiA4KSAmIDB4ZmYpLzB4ZmY7XG5cdFx0dGhpcy5fY29sb3JCID0gKHZhbHVlICYgMHhmZikvMHhmZjtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgc3RyZW5ndGggb2YgdGhlIHJpbSBsaWdodC5cblx0ICovXG5cdHB1YmxpYyBnZXQgc3RyZW5ndGgoKTpudW1iZXJcblx0e1xuXHRcdHJldHVybiB0aGlzLl9zdHJlbmd0aDtcblx0fVxuXG5cdHB1YmxpYyBzZXQgc3RyZW5ndGgodmFsdWU6bnVtYmVyKVxuXHR7XG5cdFx0dGhpcy5fc3RyZW5ndGggPSB2YWx1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgcG93ZXIgb2YgdGhlIHJpbSBsaWdodC4gSGlnaGVyIHZhbHVlcyB3aWxsIHJlc3VsdCBpbiBhIGhpZ2hlciBlZGdlIGZhbGwtb2ZmLlxuXHQgKi9cblx0cHVibGljIGdldCBwb3dlcigpOm51bWJlclxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3Bvd2VyO1xuXHR9XG5cblx0cHVibGljIHNldCBwb3dlcih2YWx1ZTpudW1iZXIpXG5cdHtcblx0XHR0aGlzLl9wb3dlciA9IHZhbHVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgaUFjdGl2YXRlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCBtZXRob2RWTzpNZXRob2RWTywgc3RhZ2U6U3RhZ2UpXG5cdHtcblx0XHR2YXIgaW5kZXg6bnVtYmVyIC8qaW50Ki8gPSBtZXRob2RWTy5mcmFnbWVudENvbnN0YW50c0luZGV4O1xuXHRcdHZhciBkYXRhOkFycmF5PG51bWJlcj4gPSBzaGFkZXJPYmplY3QuZnJhZ21lbnRDb25zdGFudERhdGE7XG5cdFx0ZGF0YVtpbmRleF0gPSB0aGlzLl9jb2xvclI7XG5cdFx0ZGF0YVtpbmRleCArIDFdID0gdGhpcy5fY29sb3JHO1xuXHRcdGRhdGFbaW5kZXggKyAyXSA9IHRoaXMuX2NvbG9yQjtcblx0XHRkYXRhW2luZGV4ICsgNF0gPSB0aGlzLl9zdHJlbmd0aDtcblx0XHRkYXRhW2luZGV4ICsgNV0gPSB0aGlzLl9wb3dlcjtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGlHZXRGcmFnbWVudENvZGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIG1ldGhvZFZPOk1ldGhvZFZPLCB0YXJnZXRSZWc6U2hhZGVyUmVnaXN0ZXJFbGVtZW50LCByZWdpc3RlckNhY2hlOlNoYWRlclJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVyczpTaGFkZXJSZWdpc3RlckRhdGEpOnN0cmluZ1xuXHR7XG5cdFx0dmFyIGRhdGFSZWdpc3RlcjpTaGFkZXJSZWdpc3RlckVsZW1lbnQgPSByZWdpc3RlckNhY2hlLmdldEZyZWVGcmFnbWVudENvbnN0YW50KCk7XG5cdFx0dmFyIGRhdGFSZWdpc3RlcjI6U2hhZGVyUmVnaXN0ZXJFbGVtZW50ID0gcmVnaXN0ZXJDYWNoZS5nZXRGcmVlRnJhZ21lbnRDb25zdGFudCgpO1xuXHRcdHZhciB0ZW1wOlNoYWRlclJlZ2lzdGVyRWxlbWVudCA9IHJlZ2lzdGVyQ2FjaGUuZ2V0RnJlZUZyYWdtZW50VmVjdG9yVGVtcCgpO1xuXHRcdHZhciBjb2RlOnN0cmluZyA9IFwiXCI7XG5cblx0XHRtZXRob2RWTy5mcmFnbWVudENvbnN0YW50c0luZGV4ID0gZGF0YVJlZ2lzdGVyLmluZGV4KjQ7XG5cblx0XHRjb2RlICs9IFwiZHAzIFwiICsgdGVtcCArIFwiLngsIFwiICsgc2hhcmVkUmVnaXN0ZXJzLnZpZXdEaXJGcmFnbWVudCArIFwiLnh5eiwgXCIgKyBzaGFyZWRSZWdpc3RlcnMubm9ybWFsRnJhZ21lbnQgKyBcIi54eXpcXG5cIiArXG5cdFx0XHRcInNhdCBcIiArIHRlbXAgKyBcIi54LCBcIiArIHRlbXAgKyBcIi54XFxuXCIgK1xuXHRcdFx0XCJzdWIgXCIgKyB0ZW1wICsgXCIueCwgXCIgKyBkYXRhUmVnaXN0ZXIgKyBcIi53LCBcIiArIHRlbXAgKyBcIi54XFxuXCIgK1xuXHRcdFx0XCJwb3cgXCIgKyB0ZW1wICsgXCIueCwgXCIgKyB0ZW1wICsgXCIueCwgXCIgKyBkYXRhUmVnaXN0ZXIyICsgXCIueVxcblwiICtcblx0XHRcdFwibXVsIFwiICsgdGVtcCArIFwiLngsIFwiICsgdGVtcCArIFwiLngsIFwiICsgZGF0YVJlZ2lzdGVyMiArIFwiLnhcXG5cIiArXG5cdFx0XHRcInN1YiBcIiArIHRlbXAgKyBcIi54LCBcIiArIGRhdGFSZWdpc3RlciArIFwiLncsIFwiICsgdGVtcCArIFwiLnhcXG5cIiArXG5cdFx0XHRcIm11bCBcIiArIHRhcmdldFJlZyArIFwiLnh5eiwgXCIgKyB0YXJnZXRSZWcgKyBcIi54eXosIFwiICsgdGVtcCArIFwiLnhcXG5cIiArXG5cdFx0XHRcInN1YiBcIiArIHRlbXAgKyBcIi53LCBcIiArIGRhdGFSZWdpc3RlciArIFwiLncsIFwiICsgdGVtcCArIFwiLnhcXG5cIjtcblxuXHRcdGlmICh0aGlzLl9ibGVuZE1vZGUgPT0gRWZmZWN0UmltTGlnaHRNZXRob2QuQUREKSB7XG5cdFx0XHRjb2RlICs9IFwibXVsIFwiICsgdGVtcCArIFwiLnh5eiwgXCIgKyB0ZW1wICsgXCIudywgXCIgKyBkYXRhUmVnaXN0ZXIgKyBcIi54eXpcXG5cIiArXG5cdFx0XHRcdFwiYWRkIFwiICsgdGFyZ2V0UmVnICsgXCIueHl6LCBcIiArIHRhcmdldFJlZyArIFwiLnh5eiwgXCIgKyB0ZW1wICsgXCIueHl6XFxuXCI7XG5cdFx0fSBlbHNlIGlmICh0aGlzLl9ibGVuZE1vZGUgPT0gRWZmZWN0UmltTGlnaHRNZXRob2QuTVVMVElQTFkpIHtcblx0XHRcdGNvZGUgKz0gXCJtdWwgXCIgKyB0ZW1wICsgXCIueHl6LCBcIiArIHRlbXAgKyBcIi53LCBcIiArIGRhdGFSZWdpc3RlciArIFwiLnh5elxcblwiICtcblx0XHRcdFx0XCJtdWwgXCIgKyB0YXJnZXRSZWcgKyBcIi54eXosIFwiICsgdGFyZ2V0UmVnICsgXCIueHl6LCBcIiArIHRlbXAgKyBcIi54eXpcXG5cIjtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29kZSArPSBcInN1YiBcIiArIHRlbXAgKyBcIi54eXosIFwiICsgZGF0YVJlZ2lzdGVyICsgXCIueHl6LCBcIiArIHRhcmdldFJlZyArIFwiLnh5elxcblwiICtcblx0XHRcdFx0XCJtdWwgXCIgKyB0ZW1wICsgXCIueHl6LCBcIiArIHRlbXAgKyBcIi54eXosIFwiICsgdGVtcCArIFwiLndcXG5cIiArXG5cdFx0XHRcdFwiYWRkIFwiICsgdGFyZ2V0UmVnICsgXCIueHl6LCBcIiArIHRhcmdldFJlZyArIFwiLnh5eiwgXCIgKyB0ZW1wICsgXCIueHl6XFxuXCI7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNvZGU7XG5cdH1cbn1cblxuZXhwb3J0ID0gRWZmZWN0UmltTGlnaHRNZXRob2Q7Il19