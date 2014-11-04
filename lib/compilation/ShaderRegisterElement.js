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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9jb21waWxhdGlvbi9zaGFkZXJyZWdpc3RlcmVsZW1lbnQudHMiXSwibmFtZXMiOlsiU2hhZGVyUmVnaXN0ZXJFbGVtZW50IiwiU2hhZGVyUmVnaXN0ZXJFbGVtZW50LmNvbnN0cnVjdG9yIiwiU2hhZGVyUmVnaXN0ZXJFbGVtZW50LnRvU3RyaW5nIiwiU2hhZGVyUmVnaXN0ZXJFbGVtZW50LnJlZ05hbWUiLCJTaGFkZXJSZWdpc3RlckVsZW1lbnQuaW5kZXgiXSwibWFwcGluZ3MiOiJBQUFBLEFBR0E7O0dBREc7SUFDRyxxQkFBcUI7SUFVMUJBOzs7Ozs7T0FNR0E7SUFDSEEsU0FqQktBLHFCQUFxQkEsQ0FpQmRBLE9BQWNBLEVBQUVBLEtBQVlBLEVBQUVBLFNBQXFCQTtRQUFyQkMseUJBQXFCQSxHQUFyQkEsYUFBb0JBLENBQUNBO1FBRTlEQSxJQUFJQSxDQUFDQSxVQUFVQSxHQUFHQSxTQUFTQSxDQUFDQTtRQUM1QkEsSUFBSUEsQ0FBQ0EsUUFBUUEsR0FBR0EsT0FBT0EsQ0FBQ0E7UUFDeEJBLElBQUlBLENBQUNBLE1BQU1BLEdBQUdBLEtBQUtBLENBQUNBO1FBRXBCQSxJQUFJQSxDQUFDQSxNQUFNQSxHQUFHQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQTtRQUU1QkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFDcEJBLElBQUlBLENBQUNBLE1BQU1BLElBQUlBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBO1FBRTVCQSxFQUFFQSxDQUFDQSxDQUFDQSxTQUFTQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNsQkEsSUFBSUEsQ0FBQ0EsTUFBTUEsSUFBSUEsR0FBR0EsR0FBR0EscUJBQXFCQSxDQUFDQSxVQUFVQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQTtJQUNuRUEsQ0FBQ0E7SUFFREQ7O09BRUdBO0lBQ0lBLHdDQUFRQSxHQUFmQTtRQUVDRSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQTtJQUNwQkEsQ0FBQ0E7SUFLREYsc0JBQVdBLDBDQUFPQTtRQUhsQkE7O1dBRUdBO2FBQ0hBO1lBRUNHLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBO1FBQ3RCQSxDQUFDQTs7O09BQUFIO0lBS0RBLHNCQUFXQSx3Q0FBS0E7UUFIaEJBOztXQUVHQTthQUNIQTtZQUVDSSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQTtRQUNwQkEsQ0FBQ0E7OztPQUFBSjtJQWhEY0EsZ0NBQVVBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLEdBQUdBLEVBQUVBLEdBQUdBLEVBQUVBLEdBQUdBLENBQUNBLENBQUNBO0lBaURsREEsNEJBQUNBO0FBQURBLENBdkRBLEFBdURDQSxJQUFBO0FBRUQsQUFBK0IsaUJBQXRCLHFCQUFxQixDQUFDIiwiZmlsZSI6ImNvbXBpbGF0aW9uL1NoYWRlclJlZ2lzdGVyRWxlbWVudC5qcyIsInNvdXJjZVJvb3QiOiIuLi8iLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEEgc2luZ2xlIHJlZ2lzdGVyIGVsZW1lbnQgKGFuIGVudGlyZSByZWdpc3RlciBvciBhIHNpbmdsZSByZWdpc3RlcidzIGNvbXBvbmVudCkgdXNlZCBieSB0aGUgUmVnaXN0ZXJQb29sLlxuICovXG5jbGFzcyBTaGFkZXJSZWdpc3RlckVsZW1lbnRcbntcblx0cHJpdmF0ZSBfcmVnTmFtZTpzdHJpbmc7XG5cdHByaXZhdGUgX2luZGV4Om51bWJlcjtcblx0cHJpdmF0ZSBfdG9TdHI6c3RyaW5nO1xuXG5cdHByaXZhdGUgc3RhdGljIENPTVBPTkVOVFMgPSBbXCJ4XCIsIFwieVwiLCBcInpcIiwgXCJ3XCJdO1xuXG5cdHB1YmxpYyBfY29tcG9uZW50Om51bWJlcjtcblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyBTaGFkZXJSZWdpc3RlckVsZW1lbnQgb2JqZWN0LlxuXHQgKlxuXHQgKiBAcGFyYW0gcmVnTmFtZSBUaGUgbmFtZSBvZiB0aGUgcmVnaXN0ZXIuXG5cdCAqIEBwYXJhbSBpbmRleCBUaGUgaW5kZXggb2YgdGhlIHJlZ2lzdGVyLlxuXHQgKiBAcGFyYW0gY29tcG9uZW50IFRoZSByZWdpc3RlcidzIGNvbXBvbmVudCwgaWYgbm90IHRoZSBlbnRpcmUgcmVnaXN0ZXIgaXMgcmVwcmVzZW50ZWQuXG5cdCAqL1xuXHRjb25zdHJ1Y3RvcihyZWdOYW1lOnN0cmluZywgaW5kZXg6bnVtYmVyLCBjb21wb25lbnQ6bnVtYmVyID0gLTEpXG5cdHtcblx0XHR0aGlzLl9jb21wb25lbnQgPSBjb21wb25lbnQ7XG5cdFx0dGhpcy5fcmVnTmFtZSA9IHJlZ05hbWU7XG5cdFx0dGhpcy5faW5kZXggPSBpbmRleDtcblxuXHRcdHRoaXMuX3RvU3RyID0gdGhpcy5fcmVnTmFtZTtcblxuXHRcdGlmICh0aGlzLl9pbmRleCA+PSAwKVxuXHRcdFx0dGhpcy5fdG9TdHIgKz0gdGhpcy5faW5kZXg7XG5cblx0XHRpZiAoY29tcG9uZW50ID4gLTEpXG5cdFx0XHR0aGlzLl90b1N0ciArPSBcIi5cIiArIFNoYWRlclJlZ2lzdGVyRWxlbWVudC5DT01QT05FTlRTW2NvbXBvbmVudF07XG5cdH1cblxuXHQvKipcblx0ICogQ29udmVydHMgdGhlIHJlZ2lzdGVyIG9yIHRoZSBjb21wb25lbnRzIEFHQUwgc3RyaW5nIHJlcHJlc2VudGF0aW9uLlxuXHQgKi9cblx0cHVibGljIHRvU3RyaW5nKCk6c3RyaW5nXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fdG9TdHI7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIHJlZ2lzdGVyJ3MgbmFtZS5cblx0ICovXG5cdHB1YmxpYyBnZXQgcmVnTmFtZSgpOnN0cmluZ1xuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3JlZ05hbWU7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIHJlZ2lzdGVyJ3MgaW5kZXguXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGluZGV4KCk6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5faW5kZXg7XG5cdH1cbn1cblxuZXhwb3J0ID0gU2hhZGVyUmVnaXN0ZXJFbGVtZW50OyJdfQ==