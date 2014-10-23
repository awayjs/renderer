/**
 * ...
 */
var ParticleGeometryTransform = (function () {
    function ParticleGeometryTransform() {
    }
    Object.defineProperty(ParticleGeometryTransform.prototype, "vertexTransform", {
        get: function () {
            return this._defaultVertexTransform;
        },
        set: function (value) {
            this._defaultVertexTransform = value;
            this._defaultInvVertexTransform = value.clone();
            this._defaultInvVertexTransform.invert();
            this._defaultInvVertexTransform.transpose();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParticleGeometryTransform.prototype, "UVTransform", {
        get: function () {
            return this._defaultUVTransform;
        },
        set: function (value) {
            this._defaultUVTransform = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParticleGeometryTransform.prototype, "invVertexTransform", {
        get: function () {
            return this._defaultInvVertexTransform;
        },
        enumerable: true,
        configurable: true
    });
    return ParticleGeometryTransform;
})();
module.exports = ParticleGeometryTransform;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi90b29scy9kYXRhL3BhcnRpY2xlZ2VvbWV0cnl0cmFuc2Zvcm0udHMiXSwibmFtZXMiOlsiUGFydGljbGVHZW9tZXRyeVRyYW5zZm9ybSIsIlBhcnRpY2xlR2VvbWV0cnlUcmFuc2Zvcm0uY29uc3RydWN0b3IiLCJQYXJ0aWNsZUdlb21ldHJ5VHJhbnNmb3JtLnZlcnRleFRyYW5zZm9ybSIsIlBhcnRpY2xlR2VvbWV0cnlUcmFuc2Zvcm0uVVZUcmFuc2Zvcm0iLCJQYXJ0aWNsZUdlb21ldHJ5VHJhbnNmb3JtLmludlZlcnRleFRyYW5zZm9ybSJdLCJtYXBwaW5ncyI6IkFBR0EsQUFHQTs7R0FERztJQUNHLHlCQUF5QjtJQUEvQkEsU0FBTUEseUJBQXlCQTtJQWlDL0JDLENBQUNBO0lBM0JBRCxzQkFBV0Esc0RBQWVBO2FBa0IxQkE7WUFFQ0UsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsdUJBQXVCQSxDQUFDQTtRQUNyQ0EsQ0FBQ0E7YUFyQkRGLFVBQTJCQSxLQUFjQTtZQUV4Q0UsSUFBSUEsQ0FBQ0EsdUJBQXVCQSxHQUFHQSxLQUFLQSxDQUFDQTtZQUNyQ0EsSUFBSUEsQ0FBQ0EsMEJBQTBCQSxHQUFHQSxLQUFLQSxDQUFDQSxLQUFLQSxFQUFFQSxDQUFDQTtZQUNoREEsSUFBSUEsQ0FBQ0EsMEJBQTBCQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQTtZQUN6Q0EsSUFBSUEsQ0FBQ0EsMEJBQTBCQSxDQUFDQSxTQUFTQSxFQUFFQSxDQUFDQTtRQUM3Q0EsQ0FBQ0E7OztPQUFBRjtJQUVEQSxzQkFBV0Esa0RBQVdBO2FBS3RCQTtZQUVDRyxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxtQkFBbUJBLENBQUNBO1FBQ2pDQSxDQUFDQTthQVJESCxVQUF1QkEsS0FBWUE7WUFFbENHLElBQUlBLENBQUNBLG1CQUFtQkEsR0FBR0EsS0FBS0EsQ0FBQ0E7UUFDbENBLENBQUNBOzs7T0FBQUg7SUFZREEsc0JBQVdBLHlEQUFrQkE7YUFBN0JBO1lBRUNJLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLDBCQUEwQkEsQ0FBQ0E7UUFDeENBLENBQUNBOzs7T0FBQUo7SUFDRkEsZ0NBQUNBO0FBQURBLENBakNBLEFBaUNDQSxJQUFBO0FBRUQsQUFBbUMsaUJBQTFCLHlCQUF5QixDQUFDIiwiZmlsZSI6InRvb2xzL2RhdGEvUGFydGljbGVHZW9tZXRyeVRyYW5zZm9ybS5qcyIsInNvdXJjZVJvb3QiOiIuLi8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTWF0cml4XHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZ2VvbS9NYXRyaXhcIik7XG5pbXBvcnQgTWF0cml4M0RcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9nZW9tL01hdHJpeDNEXCIpO1xuXG4vKipcbiAqIC4uLlxuICovXG5jbGFzcyBQYXJ0aWNsZUdlb21ldHJ5VHJhbnNmb3JtXG57XG5cdHByaXZhdGUgX2RlZmF1bHRWZXJ0ZXhUcmFuc2Zvcm06TWF0cml4M0Q7XG5cdHByaXZhdGUgX2RlZmF1bHRJbnZWZXJ0ZXhUcmFuc2Zvcm06TWF0cml4M0Q7XG5cdHByaXZhdGUgX2RlZmF1bHRVVlRyYW5zZm9ybTpNYXRyaXg7XG5cblx0cHVibGljIHNldCB2ZXJ0ZXhUcmFuc2Zvcm0odmFsdWU6TWF0cml4M0QpXG5cdHtcblx0XHR0aGlzLl9kZWZhdWx0VmVydGV4VHJhbnNmb3JtID0gdmFsdWU7XG5cdFx0dGhpcy5fZGVmYXVsdEludlZlcnRleFRyYW5zZm9ybSA9IHZhbHVlLmNsb25lKCk7XG5cdFx0dGhpcy5fZGVmYXVsdEludlZlcnRleFRyYW5zZm9ybS5pbnZlcnQoKTtcblx0XHR0aGlzLl9kZWZhdWx0SW52VmVydGV4VHJhbnNmb3JtLnRyYW5zcG9zZSgpO1xuXHR9XG5cblx0cHVibGljIHNldCBVVlRyYW5zZm9ybSh2YWx1ZTpNYXRyaXgpXG5cdHtcblx0XHR0aGlzLl9kZWZhdWx0VVZUcmFuc2Zvcm0gPSB2YWx1ZTtcblx0fVxuXG5cdHB1YmxpYyBnZXQgVVZUcmFuc2Zvcm0oKTpNYXRyaXhcblx0e1xuXHRcdHJldHVybiB0aGlzLl9kZWZhdWx0VVZUcmFuc2Zvcm07XG5cdH1cblxuXHRwdWJsaWMgZ2V0IHZlcnRleFRyYW5zZm9ybSgpOk1hdHJpeDNEXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fZGVmYXVsdFZlcnRleFRyYW5zZm9ybTtcblx0fVxuXG5cdHB1YmxpYyBnZXQgaW52VmVydGV4VHJhbnNmb3JtKCk6TWF0cml4M0Rcblx0e1xuXHRcdHJldHVybiB0aGlzLl9kZWZhdWx0SW52VmVydGV4VHJhbnNmb3JtO1xuXHR9XG59XG5cbmV4cG9ydCA9IFBhcnRpY2xlR2VvbWV0cnlUcmFuc2Zvcm07Il19