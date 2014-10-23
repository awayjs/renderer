var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var EffectMethodBase = require("awayjs-stagegl/lib/materials/methods/EffectMethodBase");
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvbWV0aG9kcy9lZmZlY3RyaW1saWdodG1ldGhvZC50cyJdLCJuYW1lcyI6WyJFZmZlY3RSaW1MaWdodE1ldGhvZCIsIkVmZmVjdFJpbUxpZ2h0TWV0aG9kLmNvbnN0cnVjdG9yIiwiRWZmZWN0UmltTGlnaHRNZXRob2QuaUluaXRDb25zdGFudHMiLCJFZmZlY3RSaW1MaWdodE1ldGhvZC5pSW5pdFZPIiwiRWZmZWN0UmltTGlnaHRNZXRob2QuYmxlbmRNb2RlIiwiRWZmZWN0UmltTGlnaHRNZXRob2QuY29sb3IiLCJFZmZlY3RSaW1MaWdodE1ldGhvZC5zdHJlbmd0aCIsIkVmZmVjdFJpbUxpZ2h0TWV0aG9kLnBvd2VyIiwiRWZmZWN0UmltTGlnaHRNZXRob2QuaUFjdGl2YXRlIiwiRWZmZWN0UmltTGlnaHRNZXRob2QuaUdldEZyYWdtZW50Q29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBTUEsSUFBTyxnQkFBZ0IsV0FBZSx1REFBdUQsQ0FBQyxDQUFDO0FBRS9GLEFBR0E7O0dBREc7SUFDRyxvQkFBb0I7SUFBU0EsVUFBN0JBLG9CQUFvQkEsVUFBeUJBO0lBY2xEQTs7Ozs7OztPQU9HQTtJQUNIQSxTQXRCS0Esb0JBQW9CQSxDQXNCYkEsS0FBZ0NBLEVBQUVBLFFBQW9CQSxFQUFFQSxLQUFnQkEsRUFBRUEsS0FBb0JBO1FBQTlGQyxxQkFBZ0NBLEdBQWhDQSxnQkFBZ0NBO1FBQUVBLHdCQUFvQkEsR0FBcEJBLGFBQW9CQTtRQUFFQSxxQkFBZ0JBLEdBQWhCQSxTQUFnQkE7UUFBRUEscUJBQW9CQSxHQUFwQkEsYUFBb0JBO1FBRXpHQSxpQkFBT0EsQ0FBQ0E7UUFFUkEsSUFBSUEsQ0FBQ0EsVUFBVUEsR0FBR0EsS0FBS0EsQ0FBQ0E7UUFDeEJBLElBQUlBLENBQUNBLFNBQVNBLEdBQUdBLFFBQVFBLENBQUNBO1FBQzFCQSxJQUFJQSxDQUFDQSxNQUFNQSxHQUFHQSxLQUFLQSxDQUFDQTtRQUVwQkEs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QSxNQUFNQSxHQUFHQSxJQUFJQSxHQUFHQSxNQUFNQSxHQUFHQSxJQUFJQSxHQUFHQSxNQUFNQSxHQUFHQSxhQUFhQSxHQUFHQSxNQUFNQSxHQUMvREEsTUFBTUEsR0FBR0EsSUFBSUEsR0FBR0EsTUFBTUEsR0FBR0EsSUFBSUEsR0FBR0EsTUFBTUEsR0FBR0EsYUFBYUEsR0FBR0EsTUFBTUEsR0FDL0RBLE1BQU1BLEdBQUdBLElBQUlBLEdBQUdBLE1BQU1BLEdBQUdBLFlBQVlBLEdBQUdBLE1BQU1BLEdBQUdBLElBQUlBLEdBQUdBLE1BQU1BLEdBQzlEQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxRQUFRQSxHQUFHQSxTQUFTQSxHQUFHQSxRQUFRQSxHQUFHQSxJQUFJQSxHQUFHQSxNQUFNQSxHQUNwRUEsTUFBTUEsR0FBR0EsSUFBSUEsR0FBR0EsTUFBTUEsR0FBR0EsWUFBWUEsR0FBR0EsTUFBTUEsR0FBR0EsSUFBSUEsR0FBR0EsTUFBTUEsQ0FBQ0E7UUFFaEVBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFVBQVVBLElBQUlBLG9CQUFvQkEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDakRBLElBQUlBLElBQUlBLE1BQU1BLEdBQUdBLElBQUlBLEdBQUdBLFFBQVFBLEdBQUdBLElBQUlBLEdBQUdBLE1BQU1BLEdBQUdBLFlBQVlBLEdBQUdBLFFBQVFBLEdBQ3pFQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxRQUFRQSxHQUFHQSxTQUFTQSxHQUFHQSxRQUFRQSxHQUFHQSxJQUFJQSxHQUFHQSxRQUFRQSxDQUFDQTtRQUN6RUEsQ0FBQ0E7UUFBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsVUFBVUEsSUFBSUEsb0JBQW9CQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUM3REEsSUFBSUEsSUFBSUEsTUFBTUEsR0FBR0EsSUFBSUEsR0FBR0EsUUFBUUEsR0FBR0EsSUFBSUEsR0FBR0EsTUFBTUEsR0FBR0EsWUFBWUEsR0FBR0EsUUFBUUEsR0FDekVBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLFFBQVFBLEdBQUdBLFNBQVNBLEdBQUdBLFFBQVFBLEdBQUdBLElBQUlBLEdBQUdBLFFBQVFBLENBQUNBO1FBQ3pFQSxDQUFDQTtRQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtZQUNQQSxJQUFJQSxJQUFJQSxNQUFNQSxHQUFHQSxJQUFJQSxHQUFHQSxRQUFRQSxHQUFHQSxZQUFZQSxHQUFHQSxRQUFRQSxHQUFHQSxTQUFTQSxHQUFHQSxRQUFRQSxHQUNoRkEsTUFBTUEsR0FBR0EsSUFBSUEsR0FBR0EsUUFBUUEsR0FBR0EsSUFBSUEsR0FBR0EsUUFBUUEsR0FBR0EsSUFBSUEsR0FBR0EsTUFBTUEsR0FDMURBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLFFBQVFBLEdBQUdBLFNBQVNBLEdBQUdBLFFBQVFBLEdBQUdBLElBQUlBLEdBQUdBLFFBQVFBLENBQUNBO1FBQ3pFQSxDQUFDQTtRQUVEQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQTtJQUNiQSxDQUFDQTtJQWpLYVQsd0JBQUdBLEdBQVVBLEtBQUtBLENBQUNBO0lBQ25CQSw2QkFBUUEsR0FBVUEsVUFBVUEsQ0FBQ0E7SUFDN0JBLHdCQUFHQSxHQUFVQSxLQUFLQSxDQUFDQTtJQWdLbENBLDJCQUFDQTtBQUFEQSxDQXBLQSxBQW9LQ0EsRUFwS2tDLGdCQUFnQixFQW9LbEQ7QUFFRCxBQUE4QixpQkFBckIsb0JBQW9CLENBQUMiLCJmaWxlIjoibWF0ZXJpYWxzL21ldGhvZHMvRWZmZWN0UmltTGlnaHRNZXRob2QuanMiLCJzb3VyY2VSb290IjoiLi4vIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFN0YWdlXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvYmFzZS9TdGFnZVwiKTtcbmltcG9ydCBNZXRob2RWT1x0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL21hdGVyaWFscy9jb21waWxhdGlvbi9NZXRob2RWT1wiKTtcbmltcG9ydCBTaGFkZXJPYmplY3RCYXNlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9tYXRlcmlhbHMvY29tcGlsYXRpb24vU2hhZGVyT2JqZWN0QmFzZVwiKTtcbmltcG9ydCBTaGFkZXJSZWdpc3RlckNhY2hlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvbWF0ZXJpYWxzL2NvbXBpbGF0aW9uL1NoYWRlclJlZ2lzdGVyQ2FjaGVcIik7XG5pbXBvcnQgU2hhZGVyUmVnaXN0ZXJEYXRhXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvbWF0ZXJpYWxzL2NvbXBpbGF0aW9uL1NoYWRlclJlZ2lzdGVyRGF0YVwiKTtcbmltcG9ydCBTaGFkZXJSZWdpc3RlckVsZW1lbnRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvbWF0ZXJpYWxzL2NvbXBpbGF0aW9uL1NoYWRlclJlZ2lzdGVyRWxlbWVudFwiKTtcbmltcG9ydCBFZmZlY3RNZXRob2RCYXNlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9tYXRlcmlhbHMvbWV0aG9kcy9FZmZlY3RNZXRob2RCYXNlXCIpO1xuXG4vKipcbiAqIEVmZmVjdFJpbUxpZ2h0TWV0aG9kIHByb3ZpZGVzIGEgbWV0aG9kIHRvIGFkZCByaW0gbGlnaHRpbmcgdG8gYSBtYXRlcmlhbC4gVGhpcyBhZGRzIGEgZ2xvdy1saWtlIGVmZmVjdCB0byBlZGdlcyBvZiBvYmplY3RzLlxuICovXG5jbGFzcyBFZmZlY3RSaW1MaWdodE1ldGhvZCBleHRlbmRzIEVmZmVjdE1ldGhvZEJhc2Vcbntcblx0cHVibGljIHN0YXRpYyBBREQ6c3RyaW5nID0gXCJhZGRcIjtcblx0cHVibGljIHN0YXRpYyBNVUxUSVBMWTpzdHJpbmcgPSBcIm11bHRpcGx5XCI7XG5cdHB1YmxpYyBzdGF0aWMgTUlYOnN0cmluZyA9IFwibWl4XCI7XG5cblx0cHJpdmF0ZSBfY29sb3I6bnVtYmVyIC8qdWludCovO1xuXHRwcml2YXRlIF9ibGVuZE1vZGU6c3RyaW5nO1xuXHRwcml2YXRlIF9jb2xvclI6bnVtYmVyO1xuXHRwcml2YXRlIF9jb2xvckc6bnVtYmVyO1xuXHRwcml2YXRlIF9jb2xvckI6bnVtYmVyO1xuXHRwcml2YXRlIF9zdHJlbmd0aDpudW1iZXI7XG5cdHByaXZhdGUgX3Bvd2VyOm51bWJlcjtcblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyA8Y29kZT5FZmZlY3RSaW1MaWdodE1ldGhvZDwvY29kZT4gb2JqZWN0LlxuXHQgKlxuXHQgKiBAcGFyYW0gY29sb3IgVGhlIGNvbG91ciBvZiB0aGUgcmltIGxpZ2h0LlxuXHQgKiBAcGFyYW0gc3RyZW5ndGggVGhlIHN0cmVuZ3RoIG9mIHRoZSByaW0gbGlnaHQuXG5cdCAqIEBwYXJhbSBwb3dlciBUaGUgcG93ZXIgb2YgdGhlIHJpbSBsaWdodC4gSGlnaGVyIHZhbHVlcyB3aWxsIHJlc3VsdCBpbiBhIGhpZ2hlciBlZGdlIGZhbGwtb2ZmLlxuXHQgKiBAcGFyYW0gYmxlbmQgVGhlIGJsZW5kIG1vZGUgd2l0aCB3aGljaCB0byBhZGQgdGhlIGxpZ2h0IHRvIHRoZSBvYmplY3QuXG5cdCAqL1xuXHRjb25zdHJ1Y3Rvcihjb2xvcjpudW1iZXIgLyp1aW50Ki8gPSAweGZmZmZmZiwgc3RyZW5ndGg6bnVtYmVyID0gLjQsIHBvd2VyOm51bWJlciA9IDIsIGJsZW5kOnN0cmluZyA9IFwibWl4XCIpXG5cdHtcblx0XHRzdXBlcigpO1xuXG5cdFx0dGhpcy5fYmxlbmRNb2RlID0gYmxlbmQ7XG5cdFx0dGhpcy5fc3RyZW5ndGggPSBzdHJlbmd0aDtcblx0XHR0aGlzLl9wb3dlciA9IHBvd2VyO1xuXG5cdFx0dGhpcy5jb2xvciA9IGNvbG9yO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgaUluaXRDb25zdGFudHMoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIG1ldGhvZFZPOk1ldGhvZFZPKVxuXHR7XG5cdFx0c2hhZGVyT2JqZWN0LmZyYWdtZW50Q29uc3RhbnREYXRhW21ldGhvZFZPLmZyYWdtZW50Q29uc3RhbnRzSW5kZXggKyAzXSA9IDE7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBpSW5pdFZPKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCBtZXRob2RWTzpNZXRob2RWTylcblx0e1xuXHRcdG1ldGhvZFZPLm5lZWRzTm9ybWFscyA9IHRydWU7XG5cdFx0bWV0aG9kVk8ubmVlZHNWaWV3ID0gdHJ1ZTtcblx0fVxuXG5cblx0LyoqXG5cdCAqIFRoZSBibGVuZCBtb2RlIHdpdGggd2hpY2ggdG8gYWRkIHRoZSBsaWdodCB0byB0aGUgb2JqZWN0LlxuXHQgKlxuXHQgKiBFZmZlY3RSaW1MaWdodE1ldGhvZC5NVUxUSVBMWSBtdWx0aXBsaWVzIHRoZSByaW0gbGlnaHQgd2l0aCB0aGUgbWF0ZXJpYWwncyBjb2xvdXIuXG5cdCAqIEVmZmVjdFJpbUxpZ2h0TWV0aG9kLkFERCBhZGRzIHRoZSByaW0gbGlnaHQgd2l0aCB0aGUgbWF0ZXJpYWwncyBjb2xvdXIuXG5cdCAqIEVmZmVjdFJpbUxpZ2h0TWV0aG9kLk1JWCBwcm92aWRlcyBub3JtYWwgYWxwaGEgYmxlbmRpbmcuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGJsZW5kTW9kZSgpOnN0cmluZ1xuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX2JsZW5kTW9kZTtcblx0fVxuXG5cdHB1YmxpYyBzZXQgYmxlbmRNb2RlKHZhbHVlOnN0cmluZylcblx0e1xuXHRcdGlmICh0aGlzLl9ibGVuZE1vZGUgPT0gdmFsdWUpXG5cdFx0XHRyZXR1cm47XG5cblx0XHR0aGlzLl9ibGVuZE1vZGUgPSB2YWx1ZTtcblxuXHRcdHRoaXMuaUludmFsaWRhdGVTaGFkZXJQcm9ncmFtKCk7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIGNvbG9yIG9mIHRoZSByaW0gbGlnaHQuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGNvbG9yKCk6bnVtYmVyIC8qdWludCovXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fY29sb3I7XG5cdH1cblxuXHRwdWJsaWMgc2V0IGNvbG9yKHZhbHVlOm51bWJlciAvKnVpbnQqLylcblx0e1xuXHRcdHRoaXMuX2NvbG9yID0gdmFsdWU7XG5cdFx0dGhpcy5fY29sb3JSID0gKCh2YWx1ZSA+PiAxNikgJiAweGZmKS8weGZmO1xuXHRcdHRoaXMuX2NvbG9yRyA9ICgodmFsdWUgPj4gOCkgJiAweGZmKS8weGZmO1xuXHRcdHRoaXMuX2NvbG9yQiA9ICh2YWx1ZSAmIDB4ZmYpLzB4ZmY7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIHN0cmVuZ3RoIG9mIHRoZSByaW0gbGlnaHQuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IHN0cmVuZ3RoKCk6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fc3RyZW5ndGg7XG5cdH1cblxuXHRwdWJsaWMgc2V0IHN0cmVuZ3RoKHZhbHVlOm51bWJlcilcblx0e1xuXHRcdHRoaXMuX3N0cmVuZ3RoID0gdmFsdWU7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIHBvd2VyIG9mIHRoZSByaW0gbGlnaHQuIEhpZ2hlciB2YWx1ZXMgd2lsbCByZXN1bHQgaW4gYSBoaWdoZXIgZWRnZSBmYWxsLW9mZi5cblx0ICovXG5cdHB1YmxpYyBnZXQgcG93ZXIoKTpudW1iZXJcblx0e1xuXHRcdHJldHVybiB0aGlzLl9wb3dlcjtcblx0fVxuXG5cdHB1YmxpYyBzZXQgcG93ZXIodmFsdWU6bnVtYmVyKVxuXHR7XG5cdFx0dGhpcy5fcG93ZXIgPSB2YWx1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGlBY3RpdmF0ZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgbWV0aG9kVk86TWV0aG9kVk8sIHN0YWdlOlN0YWdlKVxuXHR7XG5cdFx0dmFyIGluZGV4Om51bWJlciAvKmludCovID0gbWV0aG9kVk8uZnJhZ21lbnRDb25zdGFudHNJbmRleDtcblx0XHR2YXIgZGF0YTpBcnJheTxudW1iZXI+ID0gc2hhZGVyT2JqZWN0LmZyYWdtZW50Q29uc3RhbnREYXRhO1xuXHRcdGRhdGFbaW5kZXhdID0gdGhpcy5fY29sb3JSO1xuXHRcdGRhdGFbaW5kZXggKyAxXSA9IHRoaXMuX2NvbG9yRztcblx0XHRkYXRhW2luZGV4ICsgMl0gPSB0aGlzLl9jb2xvckI7XG5cdFx0ZGF0YVtpbmRleCArIDRdID0gdGhpcy5fc3RyZW5ndGg7XG5cdFx0ZGF0YVtpbmRleCArIDVdID0gdGhpcy5fcG93ZXI7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBpR2V0RnJhZ21lbnRDb2RlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCBtZXRob2RWTzpNZXRob2RWTywgdGFyZ2V0UmVnOlNoYWRlclJlZ2lzdGVyRWxlbWVudCwgcmVnaXN0ZXJDYWNoZTpTaGFkZXJSZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnM6U2hhZGVyUmVnaXN0ZXJEYXRhKTpzdHJpbmdcblx0e1xuXHRcdHZhciBkYXRhUmVnaXN0ZXI6U2hhZGVyUmVnaXN0ZXJFbGVtZW50ID0gcmVnaXN0ZXJDYWNoZS5nZXRGcmVlRnJhZ21lbnRDb25zdGFudCgpO1xuXHRcdHZhciBkYXRhUmVnaXN0ZXIyOlNoYWRlclJlZ2lzdGVyRWxlbWVudCA9IHJlZ2lzdGVyQ2FjaGUuZ2V0RnJlZUZyYWdtZW50Q29uc3RhbnQoKTtcblx0XHR2YXIgdGVtcDpTaGFkZXJSZWdpc3RlckVsZW1lbnQgPSByZWdpc3RlckNhY2hlLmdldEZyZWVGcmFnbWVudFZlY3RvclRlbXAoKTtcblx0XHR2YXIgY29kZTpzdHJpbmcgPSBcIlwiO1xuXG5cdFx0bWV0aG9kVk8uZnJhZ21lbnRDb25zdGFudHNJbmRleCA9IGRhdGFSZWdpc3Rlci5pbmRleCo0O1xuXG5cdFx0Y29kZSArPSBcImRwMyBcIiArIHRlbXAgKyBcIi54LCBcIiArIHNoYXJlZFJlZ2lzdGVycy52aWV3RGlyRnJhZ21lbnQgKyBcIi54eXosIFwiICsgc2hhcmVkUmVnaXN0ZXJzLm5vcm1hbEZyYWdtZW50ICsgXCIueHl6XFxuXCIgK1xuXHRcdFx0XCJzYXQgXCIgKyB0ZW1wICsgXCIueCwgXCIgKyB0ZW1wICsgXCIueFxcblwiICtcblx0XHRcdFwic3ViIFwiICsgdGVtcCArIFwiLngsIFwiICsgZGF0YVJlZ2lzdGVyICsgXCIudywgXCIgKyB0ZW1wICsgXCIueFxcblwiICtcblx0XHRcdFwicG93IFwiICsgdGVtcCArIFwiLngsIFwiICsgdGVtcCArIFwiLngsIFwiICsgZGF0YVJlZ2lzdGVyMiArIFwiLnlcXG5cIiArXG5cdFx0XHRcIm11bCBcIiArIHRlbXAgKyBcIi54LCBcIiArIHRlbXAgKyBcIi54LCBcIiArIGRhdGFSZWdpc3RlcjIgKyBcIi54XFxuXCIgK1xuXHRcdFx0XCJzdWIgXCIgKyB0ZW1wICsgXCIueCwgXCIgKyBkYXRhUmVnaXN0ZXIgKyBcIi53LCBcIiArIHRlbXAgKyBcIi54XFxuXCIgK1xuXHRcdFx0XCJtdWwgXCIgKyB0YXJnZXRSZWcgKyBcIi54eXosIFwiICsgdGFyZ2V0UmVnICsgXCIueHl6LCBcIiArIHRlbXAgKyBcIi54XFxuXCIgK1xuXHRcdFx0XCJzdWIgXCIgKyB0ZW1wICsgXCIudywgXCIgKyBkYXRhUmVnaXN0ZXIgKyBcIi53LCBcIiArIHRlbXAgKyBcIi54XFxuXCI7XG5cblx0XHRpZiAodGhpcy5fYmxlbmRNb2RlID09IEVmZmVjdFJpbUxpZ2h0TWV0aG9kLkFERCkge1xuXHRcdFx0Y29kZSArPSBcIm11bCBcIiArIHRlbXAgKyBcIi54eXosIFwiICsgdGVtcCArIFwiLncsIFwiICsgZGF0YVJlZ2lzdGVyICsgXCIueHl6XFxuXCIgK1xuXHRcdFx0XHRcImFkZCBcIiArIHRhcmdldFJlZyArIFwiLnh5eiwgXCIgKyB0YXJnZXRSZWcgKyBcIi54eXosIFwiICsgdGVtcCArIFwiLnh5elxcblwiO1xuXHRcdH0gZWxzZSBpZiAodGhpcy5fYmxlbmRNb2RlID09IEVmZmVjdFJpbUxpZ2h0TWV0aG9kLk1VTFRJUExZKSB7XG5cdFx0XHRjb2RlICs9IFwibXVsIFwiICsgdGVtcCArIFwiLnh5eiwgXCIgKyB0ZW1wICsgXCIudywgXCIgKyBkYXRhUmVnaXN0ZXIgKyBcIi54eXpcXG5cIiArXG5cdFx0XHRcdFwibXVsIFwiICsgdGFyZ2V0UmVnICsgXCIueHl6LCBcIiArIHRhcmdldFJlZyArIFwiLnh5eiwgXCIgKyB0ZW1wICsgXCIueHl6XFxuXCI7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvZGUgKz0gXCJzdWIgXCIgKyB0ZW1wICsgXCIueHl6LCBcIiArIGRhdGFSZWdpc3RlciArIFwiLnh5eiwgXCIgKyB0YXJnZXRSZWcgKyBcIi54eXpcXG5cIiArXG5cdFx0XHRcdFwibXVsIFwiICsgdGVtcCArIFwiLnh5eiwgXCIgKyB0ZW1wICsgXCIueHl6LCBcIiArIHRlbXAgKyBcIi53XFxuXCIgK1xuXHRcdFx0XHRcImFkZCBcIiArIHRhcmdldFJlZyArIFwiLnh5eiwgXCIgKyB0YXJnZXRSZWcgKyBcIi54eXosIFwiICsgdGVtcCArIFwiLnh5elxcblwiO1xuXHRcdH1cblxuXHRcdHJldHVybiBjb2RlO1xuXHR9XG59XG5cbmV4cG9ydCA9IEVmZmVjdFJpbUxpZ2h0TWV0aG9kOyJdfQ==