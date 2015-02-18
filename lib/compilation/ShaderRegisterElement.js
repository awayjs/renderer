/**
 * A single register element (an entire register or a single register's component) used by the RegisterPool.
 */
var ShaderRegisterElement = (function () {
    /**
     * Creates a new ShaderRegisterElement object.
     *
     * @param regName The name of the register.
     * @param index The index of the register.
     * @param component The register's component, if not the entire register is represented.
     */
    function ShaderRegisterElement(regName, index, component) {
        if (component === void 0) { component = -1; }
        this._component = component;
        this._regName = regName;
        this._index = index;
        this._toStr = this._regName;
        if (this._index >= 0)
            this._toStr += this._index;
        if (component > -1)
            this._toStr += "." + ShaderRegisterElement.COMPONENTS[component];
    }
    /**
     * Converts the register or the components AGAL string representation.
     */
    ShaderRegisterElement.prototype.toString = function () {
        return this._toStr;
    };
    Object.defineProperty(ShaderRegisterElement.prototype, "regName", {
        /**
         * The register's name.
         */
        get: function () {
            return this._regName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShaderRegisterElement.prototype, "index", {
        /**
         * The register's index.
         */
        get: function () {
            return this._index;
        },
        enumerable: true,
        configurable: true
    });
    ShaderRegisterElement.COMPONENTS = ["x", "y", "z", "w"];
    return ShaderRegisterElement;
})();
module.exports = ShaderRegisterElement;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckVsZW1lbnQudHMiXSwibmFtZXMiOlsiU2hhZGVyUmVnaXN0ZXJFbGVtZW50IiwiU2hhZGVyUmVnaXN0ZXJFbGVtZW50LmNvbnN0cnVjdG9yIiwiU2hhZGVyUmVnaXN0ZXJFbGVtZW50LnRvU3RyaW5nIiwiU2hhZGVyUmVnaXN0ZXJFbGVtZW50LnJlZ05hbWUiLCJTaGFkZXJSZWdpc3RlckVsZW1lbnQuaW5kZXgiXSwibWFwcGluZ3MiOiJBQUFBLEFBR0E7O0dBREc7SUFDRyxxQkFBcUI7SUFVMUJBOzs7Ozs7T0FNR0E7SUFDSEEsU0FqQktBLHFCQUFxQkEsQ0FpQmRBLE9BQWNBLEVBQUVBLEtBQVlBLEVBQUVBLFNBQXFCQTtRQUFyQkMseUJBQXFCQSxHQUFyQkEsYUFBb0JBLENBQUNBO1FBRTlEQSxJQUFJQSxDQUFDQSxVQUFVQSxHQUFHQSxTQUFTQSxDQUFDQTtRQUM1QkEsSUFBSUEsQ0FBQ0EsUUFBUUEsR0FBR0EsT0FBT0EsQ0FBQ0E7UUFDeEJBLElBQUlBLENBQUNBLE1BQU1BLEdBQUdBLEtBQUtBLENBQUNBO1FBRXBCQSxJQUFJQSxDQUFDQSxNQUFNQSxHQUFHQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQTtRQUU1QkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFDcEJBLElBQUlBLENBQUNBLE1BQU1BLElBQUlBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBO1FBRTVCQSxFQUFFQSxDQUFDQSxDQUFDQSxTQUFTQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNsQkEsSUFBSUEsQ0FBQ0EsTUFBTUEsSUFBSUEsR0FBR0EsR0FBR0EscUJBQXFCQSxDQUFDQSxVQUFVQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQTtJQUNuRUEsQ0FBQ0E7SUFFREQ7O09BRUdBO0lBQ0lBLHdDQUFRQSxHQUFmQTtRQUVDRSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQTtJQUNwQkEsQ0FBQ0E7SUFLREYsc0JBQVdBLDBDQUFPQTtRQUhsQkE7O1dBRUdBO2FBQ0hBO1lBRUNHLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBO1FBQ3RCQSxDQUFDQTs7O09BQUFIO0lBS0RBLHNCQUFXQSx3Q0FBS0E7UUFIaEJBOztXQUVHQTthQUNIQTtZQUVDSSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQTtRQUNwQkEsQ0FBQ0E7OztPQUFBSjtJQWhEY0EsZ0NBQVVBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLEdBQUdBLEVBQUVBLEdBQUdBLEVBQUVBLEdBQUdBLENBQUNBLENBQUNBO0lBaURsREEsNEJBQUNBO0FBQURBLENBdkRBLEFBdURDQSxJQUFBO0FBRUQsQUFBK0IsaUJBQXRCLHFCQUFxQixDQUFDIiwiZmlsZSI6ImNvbXBpbGF0aW9uL1NoYWRlclJlZ2lzdGVyRWxlbWVudC5qcyIsInNvdXJjZVJvb3QiOiIuLi8iLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQSBzaW5nbGUgcmVnaXN0ZXIgZWxlbWVudCAoYW4gZW50aXJlIHJlZ2lzdGVyIG9yIGEgc2luZ2xlIHJlZ2lzdGVyJ3MgY29tcG9uZW50KSB1c2VkIGJ5IHRoZSBSZWdpc3RlclBvb2wuXHJcbiAqL1xyXG5jbGFzcyBTaGFkZXJSZWdpc3RlckVsZW1lbnRcclxue1xyXG5cdHByaXZhdGUgX3JlZ05hbWU6c3RyaW5nO1xyXG5cdHByaXZhdGUgX2luZGV4Om51bWJlcjtcclxuXHRwcml2YXRlIF90b1N0cjpzdHJpbmc7XHJcblxyXG5cdHByaXZhdGUgc3RhdGljIENPTVBPTkVOVFMgPSBbXCJ4XCIsIFwieVwiLCBcInpcIiwgXCJ3XCJdO1xyXG5cclxuXHRwdWJsaWMgX2NvbXBvbmVudDpudW1iZXI7XHJcblxyXG5cdC8qKlxyXG5cdCAqIENyZWF0ZXMgYSBuZXcgU2hhZGVyUmVnaXN0ZXJFbGVtZW50IG9iamVjdC5cclxuXHQgKlxyXG5cdCAqIEBwYXJhbSByZWdOYW1lIFRoZSBuYW1lIG9mIHRoZSByZWdpc3Rlci5cclxuXHQgKiBAcGFyYW0gaW5kZXggVGhlIGluZGV4IG9mIHRoZSByZWdpc3Rlci5cclxuXHQgKiBAcGFyYW0gY29tcG9uZW50IFRoZSByZWdpc3RlcidzIGNvbXBvbmVudCwgaWYgbm90IHRoZSBlbnRpcmUgcmVnaXN0ZXIgaXMgcmVwcmVzZW50ZWQuXHJcblx0ICovXHJcblx0Y29uc3RydWN0b3IocmVnTmFtZTpzdHJpbmcsIGluZGV4Om51bWJlciwgY29tcG9uZW50Om51bWJlciA9IC0xKVxyXG5cdHtcclxuXHRcdHRoaXMuX2NvbXBvbmVudCA9IGNvbXBvbmVudDtcclxuXHRcdHRoaXMuX3JlZ05hbWUgPSByZWdOYW1lO1xyXG5cdFx0dGhpcy5faW5kZXggPSBpbmRleDtcclxuXHJcblx0XHR0aGlzLl90b1N0ciA9IHRoaXMuX3JlZ05hbWU7XHJcblxyXG5cdFx0aWYgKHRoaXMuX2luZGV4ID49IDApXHJcblx0XHRcdHRoaXMuX3RvU3RyICs9IHRoaXMuX2luZGV4O1xyXG5cclxuXHRcdGlmIChjb21wb25lbnQgPiAtMSlcclxuXHRcdFx0dGhpcy5fdG9TdHIgKz0gXCIuXCIgKyBTaGFkZXJSZWdpc3RlckVsZW1lbnQuQ09NUE9ORU5UU1tjb21wb25lbnRdO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQ29udmVydHMgdGhlIHJlZ2lzdGVyIG9yIHRoZSBjb21wb25lbnRzIEFHQUwgc3RyaW5nIHJlcHJlc2VudGF0aW9uLlxyXG5cdCAqL1xyXG5cdHB1YmxpYyB0b1N0cmluZygpOnN0cmluZ1xyXG5cdHtcclxuXHRcdHJldHVybiB0aGlzLl90b1N0cjtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFRoZSByZWdpc3RlcidzIG5hbWUuXHJcblx0ICovXHJcblx0cHVibGljIGdldCByZWdOYW1lKCk6c3RyaW5nXHJcblx0e1xyXG5cdFx0cmV0dXJuIHRoaXMuX3JlZ05hbWU7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBUaGUgcmVnaXN0ZXIncyBpbmRleC5cclxuXHQgKi9cclxuXHRwdWJsaWMgZ2V0IGluZGV4KCk6bnVtYmVyXHJcblx0e1xyXG5cdFx0cmV0dXJuIHRoaXMuX2luZGV4O1xyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0ID0gU2hhZGVyUmVnaXN0ZXJFbGVtZW50OyJdfQ==