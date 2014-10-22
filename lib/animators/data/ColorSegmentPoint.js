var ColorSegmentPoint = (function () {
    function ColorSegmentPoint(life, color) {
        //0<life<1
        if (life <= 0 || life >= 1)
            throw (new Error("life exceeds range (0,1)"));
        this._life = life;
        this._color = color;
    }
    Object.defineProperty(ColorSegmentPoint.prototype, "color", {
        get: function () {
            return this._color;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColorSegmentPoint.prototype, "life", {
        get: function () {
            return this._life;
        },
        enumerable: true,
        configurable: true
    });
    return ColorSegmentPoint;
})();
module.exports = ColorSegmentPoint;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuaW1hdG9ycy9kYXRhL2NvbG9yc2VnbWVudHBvaW50LnRzIl0sIm5hbWVzIjpbIkNvbG9yU2VnbWVudFBvaW50IiwiQ29sb3JTZWdtZW50UG9pbnQuY29uc3RydWN0b3IiLCJDb2xvclNlZ21lbnRQb2ludC5jb2xvciIsIkNvbG9yU2VnbWVudFBvaW50LmxpZmUiXSwibWFwcGluZ3MiOiJBQUVBLElBQU0saUJBQWlCO0lBS3RCQSxTQUxLQSxpQkFBaUJBLENBS1ZBLElBQVdBLEVBQUVBLEtBQW9CQTtRQUU1Q0MsQUFDQUEsVUFEVUE7UUFDVkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsSUFBSUEsQ0FBQ0EsSUFBSUEsSUFBSUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFDMUJBLE1BQUtBLENBQUNBLElBQUlBLEtBQUtBLENBQUNBLDBCQUEwQkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDOUNBLElBQUlBLENBQUNBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBO1FBQ2xCQSxJQUFJQSxDQUFDQSxNQUFNQSxHQUFHQSxLQUFLQSxDQUFDQTtJQUNyQkEsQ0FBQ0E7SUFFREQsc0JBQVdBLG9DQUFLQTthQUFoQkE7WUFFQ0UsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0E7UUFDcEJBLENBQUNBOzs7T0FBQUY7SUFFREEsc0JBQVdBLG1DQUFJQTthQUFmQTtZQUVDRyxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQTtRQUNuQkEsQ0FBQ0E7OztPQUFBSDtJQUVGQSx3QkFBQ0E7QUFBREEsQ0F4QkEsQUF3QkNBLElBQUE7QUFFRCxBQUEyQixpQkFBbEIsaUJBQWlCLENBQUMiLCJmaWxlIjoiYW5pbWF0b3JzL2RhdGEvQ29sb3JTZWdtZW50UG9pbnQuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL3JvYmJhdGVtYW4vV2Vic3Rvcm1Qcm9qZWN0cy9hd2F5anMtcmVuZGVyZXJnbC8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQ29sb3JUcmFuc2Zvcm1cdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2NvcmUvZ2VvbS9Db2xvclRyYW5zZm9ybVwiKTtcblxuY2xhc3MgQ29sb3JTZWdtZW50UG9pbnRcbntcblx0cHJpdmF0ZSBfY29sb3I6Q29sb3JUcmFuc2Zvcm07XG5cdHByaXZhdGUgX2xpZmU6bnVtYmVyO1xuXG5cdGNvbnN0cnVjdG9yKGxpZmU6bnVtYmVyLCBjb2xvcjpDb2xvclRyYW5zZm9ybSlcblx0e1xuXHRcdC8vMDxsaWZlPDFcblx0XHRpZiAobGlmZSA8PSAwIHx8IGxpZmUgPj0gMSlcblx0XHRcdHRocm93KG5ldyBFcnJvcihcImxpZmUgZXhjZWVkcyByYW5nZSAoMCwxKVwiKSk7XG5cdFx0dGhpcy5fbGlmZSA9IGxpZmU7XG5cdFx0dGhpcy5fY29sb3IgPSBjb2xvcjtcblx0fVxuXG5cdHB1YmxpYyBnZXQgY29sb3IoKTpDb2xvclRyYW5zZm9ybVxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX2NvbG9yO1xuXHR9XG5cblx0cHVibGljIGdldCBsaWZlKCk6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fbGlmZTtcblx0fVxuXG59XG5cbmV4cG9ydCA9IENvbG9yU2VnbWVudFBvaW50OyJdfQ==