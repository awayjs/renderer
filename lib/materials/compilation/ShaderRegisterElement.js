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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvY29tcGlsYXRpb24vc2hhZGVycmVnaXN0ZXJlbGVtZW50LnRzIl0sIm5hbWVzIjpbIlNoYWRlclJlZ2lzdGVyRWxlbWVudCIsIlNoYWRlclJlZ2lzdGVyRWxlbWVudC5jb25zdHJ1Y3RvciIsIlNoYWRlclJlZ2lzdGVyRWxlbWVudC50b1N0cmluZyIsIlNoYWRlclJlZ2lzdGVyRWxlbWVudC5yZWdOYW1lIiwiU2hhZGVyUmVnaXN0ZXJFbGVtZW50LmluZGV4Il0sIm1hcHBpbmdzIjoiQUFBQSxBQUdBOztHQURHO0lBQ0cscUJBQXFCO0lBVTFCQTs7Ozs7O09BTUdBO0lBQ0hBLFNBakJLQSxxQkFBcUJBLENBaUJkQSxPQUFjQSxFQUFFQSxLQUFZQSxFQUFFQSxTQUFxQkE7UUFBckJDLHlCQUFxQkEsR0FBckJBLGFBQW9CQSxDQUFDQTtRQUU5REEsSUFBSUEsQ0FBQ0EsVUFBVUEsR0FBR0EsU0FBU0EsQ0FBQ0E7UUFDNUJBLElBQUlBLENBQUNBLFFBQVFBLEdBQUdBLE9BQU9BLENBQUNBO1FBQ3hCQSxJQUFJQSxDQUFDQSxNQUFNQSxHQUFHQSxLQUFLQSxDQUFDQTtRQUVwQkEsSUFBSUEsQ0FBQ0EsTUFBTUEsR0FBR0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0E7UUFFNUJBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLElBQUlBLENBQUNBLENBQUNBO1lBQ3BCQSxJQUFJQSxDQUFDQSxNQUFNQSxJQUFJQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQTtRQUU1QkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsU0FBU0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDbEJBLElBQUlBLENBQUNBLE1BQU1BLElBQUlBLEdBQUdBLEdBQUdBLHFCQUFxQkEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0E7SUFDbkVBLENBQUNBO0lBRUREOztPQUVHQTtJQUNJQSx3Q0FBUUEsR0FBZkE7UUFFQ0UsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0E7SUFDcEJBLENBQUNBO0lBS0RGLHNCQUFXQSwwQ0FBT0E7UUFIbEJBOztXQUVHQTthQUNIQTtZQUVDRyxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQTtRQUN0QkEsQ0FBQ0E7OztPQUFBSDtJQUtEQSxzQkFBV0Esd0NBQUtBO1FBSGhCQTs7V0FFR0E7YUFDSEE7WUFFQ0ksTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0E7UUFDcEJBLENBQUNBOzs7T0FBQUo7SUFoRGNBLGdDQUFVQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxHQUFHQSxFQUFFQSxHQUFHQSxFQUFFQSxHQUFHQSxDQUFDQSxDQUFDQTtJQWlEbERBLDRCQUFDQTtBQUFEQSxDQXZEQSxBQXVEQ0EsSUFBQTtBQUVELEFBQStCLGlCQUF0QixxQkFBcUIsQ0FBQyIsImZpbGUiOiJtYXRlcmlhbHMvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJFbGVtZW50LmpzIiwic291cmNlUm9vdCI6Ii4uLyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQSBzaW5nbGUgcmVnaXN0ZXIgZWxlbWVudCAoYW4gZW50aXJlIHJlZ2lzdGVyIG9yIGEgc2luZ2xlIHJlZ2lzdGVyJ3MgY29tcG9uZW50KSB1c2VkIGJ5IHRoZSBSZWdpc3RlclBvb2wuXG4gKi9cbmNsYXNzIFNoYWRlclJlZ2lzdGVyRWxlbWVudFxue1xuXHRwcml2YXRlIF9yZWdOYW1lOnN0cmluZztcblx0cHJpdmF0ZSBfaW5kZXg6bnVtYmVyO1xuXHRwcml2YXRlIF90b1N0cjpzdHJpbmc7XG5cblx0cHJpdmF0ZSBzdGF0aWMgQ09NUE9ORU5UUyA9IFtcInhcIiwgXCJ5XCIsIFwielwiLCBcIndcIl07XG5cblx0cHVibGljIF9jb21wb25lbnQ6bnVtYmVyO1xuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IFNoYWRlclJlZ2lzdGVyRWxlbWVudCBvYmplY3QuXG5cdCAqXG5cdCAqIEBwYXJhbSByZWdOYW1lIFRoZSBuYW1lIG9mIHRoZSByZWdpc3Rlci5cblx0ICogQHBhcmFtIGluZGV4IFRoZSBpbmRleCBvZiB0aGUgcmVnaXN0ZXIuXG5cdCAqIEBwYXJhbSBjb21wb25lbnQgVGhlIHJlZ2lzdGVyJ3MgY29tcG9uZW50LCBpZiBub3QgdGhlIGVudGlyZSByZWdpc3RlciBpcyByZXByZXNlbnRlZC5cblx0ICovXG5cdGNvbnN0cnVjdG9yKHJlZ05hbWU6c3RyaW5nLCBpbmRleDpudW1iZXIsIGNvbXBvbmVudDpudW1iZXIgPSAtMSlcblx0e1xuXHRcdHRoaXMuX2NvbXBvbmVudCA9IGNvbXBvbmVudDtcblx0XHR0aGlzLl9yZWdOYW1lID0gcmVnTmFtZTtcblx0XHR0aGlzLl9pbmRleCA9IGluZGV4O1xuXG5cdFx0dGhpcy5fdG9TdHIgPSB0aGlzLl9yZWdOYW1lO1xuXG5cdFx0aWYgKHRoaXMuX2luZGV4ID49IDApXG5cdFx0XHR0aGlzLl90b1N0ciArPSB0aGlzLl9pbmRleDtcblxuXHRcdGlmIChjb21wb25lbnQgPiAtMSlcblx0XHRcdHRoaXMuX3RvU3RyICs9IFwiLlwiICsgU2hhZGVyUmVnaXN0ZXJFbGVtZW50LkNPTVBPTkVOVFNbY29tcG9uZW50XTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDb252ZXJ0cyB0aGUgcmVnaXN0ZXIgb3IgdGhlIGNvbXBvbmVudHMgQUdBTCBzdHJpbmcgcmVwcmVzZW50YXRpb24uXG5cdCAqL1xuXHRwdWJsaWMgdG9TdHJpbmcoKTpzdHJpbmdcblx0e1xuXHRcdHJldHVybiB0aGlzLl90b1N0cjtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgcmVnaXN0ZXIncyBuYW1lLlxuXHQgKi9cblx0cHVibGljIGdldCByZWdOYW1lKCk6c3RyaW5nXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fcmVnTmFtZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgcmVnaXN0ZXIncyBpbmRleC5cblx0ICovXG5cdHB1YmxpYyBnZXQgaW5kZXgoKTpudW1iZXJcblx0e1xuXHRcdHJldHVybiB0aGlzLl9pbmRleDtcblx0fVxufVxuXG5leHBvcnQgPSBTaGFkZXJSZWdpc3RlckVsZW1lbnQ7Il19