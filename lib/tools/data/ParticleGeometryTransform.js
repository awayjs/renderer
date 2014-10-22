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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRvb2xzL2RhdGEvcGFydGljbGVnZW9tZXRyeXRyYW5zZm9ybS50cyJdLCJuYW1lcyI6WyJQYXJ0aWNsZUdlb21ldHJ5VHJhbnNmb3JtIiwiUGFydGljbGVHZW9tZXRyeVRyYW5zZm9ybS5jb25zdHJ1Y3RvciIsIlBhcnRpY2xlR2VvbWV0cnlUcmFuc2Zvcm0udmVydGV4VHJhbnNmb3JtIiwiUGFydGljbGVHZW9tZXRyeVRyYW5zZm9ybS5VVlRyYW5zZm9ybSIsIlBhcnRpY2xlR2VvbWV0cnlUcmFuc2Zvcm0uaW52VmVydGV4VHJhbnNmb3JtIl0sIm1hcHBpbmdzIjoiQUFHQSxBQUdBOztHQURHO0lBQ0cseUJBQXlCO0lBQS9CQSxTQUFNQSx5QkFBeUJBO0lBaUMvQkMsQ0FBQ0E7SUEzQkFELHNCQUFXQSxzREFBZUE7YUFrQjFCQTtZQUVDRSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSx1QkFBdUJBLENBQUNBO1FBQ3JDQSxDQUFDQTthQXJCREYsVUFBMkJBLEtBQWNBO1lBRXhDRSxJQUFJQSxDQUFDQSx1QkFBdUJBLEdBQUdBLEtBQUtBLENBQUNBO1lBQ3JDQSxJQUFJQSxDQUFDQSwwQkFBMEJBLEdBQUdBLEtBQUtBLENBQUNBLEtBQUtBLEVBQUVBLENBQUNBO1lBQ2hEQSxJQUFJQSxDQUFDQSwwQkFBMEJBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBO1lBQ3pDQSxJQUFJQSxDQUFDQSwwQkFBMEJBLENBQUNBLFNBQVNBLEVBQUVBLENBQUNBO1FBQzdDQSxDQUFDQTs7O09BQUFGO0lBRURBLHNCQUFXQSxrREFBV0E7YUFLdEJBO1lBRUNHLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLG1CQUFtQkEsQ0FBQ0E7UUFDakNBLENBQUNBO2FBUkRILFVBQXVCQSxLQUFZQTtZQUVsQ0csSUFBSUEsQ0FBQ0EsbUJBQW1CQSxHQUFHQSxLQUFLQSxDQUFDQTtRQUNsQ0EsQ0FBQ0E7OztPQUFBSDtJQVlEQSxzQkFBV0EseURBQWtCQTthQUE3QkE7WUFFQ0ksTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsMEJBQTBCQSxDQUFDQTtRQUN4Q0EsQ0FBQ0E7OztPQUFBSjtJQUNGQSxnQ0FBQ0E7QUFBREEsQ0FqQ0EsQUFpQ0NBLElBQUE7QUFFRCxBQUFtQyxpQkFBMUIseUJBQXlCLENBQUMiLCJmaWxlIjoidG9vbHMvZGF0YS9QYXJ0aWNsZUdlb21ldHJ5VHJhbnNmb3JtLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9yb2JiYXRlbWFuL1dlYnN0b3JtUHJvamVjdHMvYXdheWpzLXJlbmRlcmVyZ2wvIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE1hdHJpeFx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2NvcmUvZ2VvbS9NYXRyaXhcIik7XG5pbXBvcnQgTWF0cml4M0RcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9jb3JlL2dlb20vTWF0cml4M0RcIik7XG5cbi8qKlxuICogLi4uXG4gKi9cbmNsYXNzIFBhcnRpY2xlR2VvbWV0cnlUcmFuc2Zvcm1cbntcblx0cHJpdmF0ZSBfZGVmYXVsdFZlcnRleFRyYW5zZm9ybTpNYXRyaXgzRDtcblx0cHJpdmF0ZSBfZGVmYXVsdEludlZlcnRleFRyYW5zZm9ybTpNYXRyaXgzRDtcblx0cHJpdmF0ZSBfZGVmYXVsdFVWVHJhbnNmb3JtOk1hdHJpeDtcblxuXHRwdWJsaWMgc2V0IHZlcnRleFRyYW5zZm9ybSh2YWx1ZTpNYXRyaXgzRClcblx0e1xuXHRcdHRoaXMuX2RlZmF1bHRWZXJ0ZXhUcmFuc2Zvcm0gPSB2YWx1ZTtcblx0XHR0aGlzLl9kZWZhdWx0SW52VmVydGV4VHJhbnNmb3JtID0gdmFsdWUuY2xvbmUoKTtcblx0XHR0aGlzLl9kZWZhdWx0SW52VmVydGV4VHJhbnNmb3JtLmludmVydCgpO1xuXHRcdHRoaXMuX2RlZmF1bHRJbnZWZXJ0ZXhUcmFuc2Zvcm0udHJhbnNwb3NlKCk7XG5cdH1cblxuXHRwdWJsaWMgc2V0IFVWVHJhbnNmb3JtKHZhbHVlOk1hdHJpeClcblx0e1xuXHRcdHRoaXMuX2RlZmF1bHRVVlRyYW5zZm9ybSA9IHZhbHVlO1xuXHR9XG5cblx0cHVibGljIGdldCBVVlRyYW5zZm9ybSgpOk1hdHJpeFxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX2RlZmF1bHRVVlRyYW5zZm9ybTtcblx0fVxuXG5cdHB1YmxpYyBnZXQgdmVydGV4VHJhbnNmb3JtKCk6TWF0cml4M0Rcblx0e1xuXHRcdHJldHVybiB0aGlzLl9kZWZhdWx0VmVydGV4VHJhbnNmb3JtO1xuXHR9XG5cblx0cHVibGljIGdldCBpbnZWZXJ0ZXhUcmFuc2Zvcm0oKTpNYXRyaXgzRFxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX2RlZmF1bHRJbnZWZXJ0ZXhUcmFuc2Zvcm07XG5cdH1cbn1cblxuZXhwb3J0ID0gUGFydGljbGVHZW9tZXRyeVRyYW5zZm9ybTsiXX0=