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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi90b29scy9kYXRhL1BhcnRpY2xlR2VvbWV0cnlUcmFuc2Zvcm0udHMiXSwibmFtZXMiOlsiUGFydGljbGVHZW9tZXRyeVRyYW5zZm9ybSIsIlBhcnRpY2xlR2VvbWV0cnlUcmFuc2Zvcm0uY29uc3RydWN0b3IiLCJQYXJ0aWNsZUdlb21ldHJ5VHJhbnNmb3JtLnZlcnRleFRyYW5zZm9ybSIsIlBhcnRpY2xlR2VvbWV0cnlUcmFuc2Zvcm0uVVZUcmFuc2Zvcm0iLCJQYXJ0aWNsZUdlb21ldHJ5VHJhbnNmb3JtLmludlZlcnRleFRyYW5zZm9ybSJdLCJtYXBwaW5ncyI6IkFBR0EsQUFHQTs7R0FERztJQUNHLHlCQUF5QjtJQUEvQkEsU0FBTUEseUJBQXlCQTtJQWlDL0JDLENBQUNBO0lBM0JBRCxzQkFBV0Esc0RBQWVBO2FBa0IxQkE7WUFFQ0UsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsdUJBQXVCQSxDQUFDQTtRQUNyQ0EsQ0FBQ0E7YUFyQkRGLFVBQTJCQSxLQUFjQTtZQUV4Q0UsSUFBSUEsQ0FBQ0EsdUJBQXVCQSxHQUFHQSxLQUFLQSxDQUFDQTtZQUNyQ0EsSUFBSUEsQ0FBQ0EsMEJBQTBCQSxHQUFHQSxLQUFLQSxDQUFDQSxLQUFLQSxFQUFFQSxDQUFDQTtZQUNoREEsSUFBSUEsQ0FBQ0EsMEJBQTBCQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQTtZQUN6Q0EsSUFBSUEsQ0FBQ0EsMEJBQTBCQSxDQUFDQSxTQUFTQSxFQUFFQSxDQUFDQTtRQUM3Q0EsQ0FBQ0E7OztPQUFBRjtJQUVEQSxzQkFBV0Esa0RBQVdBO2FBS3RCQTtZQUVDRyxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxtQkFBbUJBLENBQUNBO1FBQ2pDQSxDQUFDQTthQVJESCxVQUF1QkEsS0FBWUE7WUFFbENHLElBQUlBLENBQUNBLG1CQUFtQkEsR0FBR0EsS0FBS0EsQ0FBQ0E7UUFDbENBLENBQUNBOzs7T0FBQUg7SUFZREEsc0JBQVdBLHlEQUFrQkE7YUFBN0JBO1lBRUNJLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLDBCQUEwQkEsQ0FBQ0E7UUFDeENBLENBQUNBOzs7T0FBQUo7SUFDRkEsZ0NBQUNBO0FBQURBLENBakNBLEFBaUNDQSxJQUFBO0FBRUQsQUFBbUMsaUJBQTFCLHlCQUF5QixDQUFDIiwiZmlsZSI6InRvb2xzL2RhdGEvUGFydGljbGVHZW9tZXRyeVRyYW5zZm9ybS5qcyIsInNvdXJjZVJvb3QiOiIuLi8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTWF0cml4XHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZ2VvbS9NYXRyaXhcIik7XHJcbmltcG9ydCBNYXRyaXgzRFx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2dlb20vTWF0cml4M0RcIik7XHJcblxyXG4vKipcclxuICogLi4uXHJcbiAqL1xyXG5jbGFzcyBQYXJ0aWNsZUdlb21ldHJ5VHJhbnNmb3JtXHJcbntcclxuXHRwcml2YXRlIF9kZWZhdWx0VmVydGV4VHJhbnNmb3JtOk1hdHJpeDNEO1xyXG5cdHByaXZhdGUgX2RlZmF1bHRJbnZWZXJ0ZXhUcmFuc2Zvcm06TWF0cml4M0Q7XHJcblx0cHJpdmF0ZSBfZGVmYXVsdFVWVHJhbnNmb3JtOk1hdHJpeDtcclxuXHJcblx0cHVibGljIHNldCB2ZXJ0ZXhUcmFuc2Zvcm0odmFsdWU6TWF0cml4M0QpXHJcblx0e1xyXG5cdFx0dGhpcy5fZGVmYXVsdFZlcnRleFRyYW5zZm9ybSA9IHZhbHVlO1xyXG5cdFx0dGhpcy5fZGVmYXVsdEludlZlcnRleFRyYW5zZm9ybSA9IHZhbHVlLmNsb25lKCk7XHJcblx0XHR0aGlzLl9kZWZhdWx0SW52VmVydGV4VHJhbnNmb3JtLmludmVydCgpO1xyXG5cdFx0dGhpcy5fZGVmYXVsdEludlZlcnRleFRyYW5zZm9ybS50cmFuc3Bvc2UoKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXQgVVZUcmFuc2Zvcm0odmFsdWU6TWF0cml4KVxyXG5cdHtcclxuXHRcdHRoaXMuX2RlZmF1bHRVVlRyYW5zZm9ybSA9IHZhbHVlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldCBVVlRyYW5zZm9ybSgpOk1hdHJpeFxyXG5cdHtcclxuXHRcdHJldHVybiB0aGlzLl9kZWZhdWx0VVZUcmFuc2Zvcm07XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0IHZlcnRleFRyYW5zZm9ybSgpOk1hdHJpeDNEXHJcblx0e1xyXG5cdFx0cmV0dXJuIHRoaXMuX2RlZmF1bHRWZXJ0ZXhUcmFuc2Zvcm07XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0IGludlZlcnRleFRyYW5zZm9ybSgpOk1hdHJpeDNEXHJcblx0e1xyXG5cdFx0cmV0dXJuIHRoaXMuX2RlZmF1bHRJbnZWZXJ0ZXhUcmFuc2Zvcm07XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgPSBQYXJ0aWNsZUdlb21ldHJ5VHJhbnNmb3JtOyJdfQ==