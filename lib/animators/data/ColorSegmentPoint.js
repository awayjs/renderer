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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvZGF0YS9Db2xvclNlZ21lbnRQb2ludC50cyJdLCJuYW1lcyI6WyJDb2xvclNlZ21lbnRQb2ludCIsIkNvbG9yU2VnbWVudFBvaW50LmNvbnN0cnVjdG9yIiwiQ29sb3JTZWdtZW50UG9pbnQuY29sb3IiLCJDb2xvclNlZ21lbnRQb2ludC5saWZlIl0sIm1hcHBpbmdzIjoiQUFFQSxJQUFNLGlCQUFpQjtJQUt0QkEsU0FMS0EsaUJBQWlCQSxDQUtWQSxJQUFXQSxFQUFFQSxLQUFvQkE7UUFFNUNDLEFBQ0FBLFVBRFVBO1FBQ1ZBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLElBQUlBLENBQUNBLElBQUlBLElBQUlBLElBQUlBLENBQUNBLENBQUNBO1lBQzFCQSxNQUFLQSxDQUFDQSxJQUFJQSxLQUFLQSxDQUFDQSwwQkFBMEJBLENBQUNBLENBQUNBLENBQUNBO1FBQzlDQSxJQUFJQSxDQUFDQSxLQUFLQSxHQUFHQSxJQUFJQSxDQUFDQTtRQUNsQkEsSUFBSUEsQ0FBQ0EsTUFBTUEsR0FBR0EsS0FBS0EsQ0FBQ0E7SUFDckJBLENBQUNBO0lBRURELHNCQUFXQSxvQ0FBS0E7YUFBaEJBO1lBRUNFLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBO1FBQ3BCQSxDQUFDQTs7O09BQUFGO0lBRURBLHNCQUFXQSxtQ0FBSUE7YUFBZkE7WUFFQ0csTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7UUFDbkJBLENBQUNBOzs7T0FBQUg7SUFFRkEsd0JBQUNBO0FBQURBLENBeEJBLEFBd0JDQSxJQUFBO0FBRUQsQUFBMkIsaUJBQWxCLGlCQUFpQixDQUFDIiwiZmlsZSI6ImFuaW1hdG9ycy9kYXRhL0NvbG9yU2VnbWVudFBvaW50LmpzIiwic291cmNlUm9vdCI6Ii4uLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDb2xvclRyYW5zZm9ybVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZ2VvbS9Db2xvclRyYW5zZm9ybVwiKTtcblxuY2xhc3MgQ29sb3JTZWdtZW50UG9pbnRcbntcblx0cHJpdmF0ZSBfY29sb3I6Q29sb3JUcmFuc2Zvcm07XG5cdHByaXZhdGUgX2xpZmU6bnVtYmVyO1xuXG5cdGNvbnN0cnVjdG9yKGxpZmU6bnVtYmVyLCBjb2xvcjpDb2xvclRyYW5zZm9ybSlcblx0e1xuXHRcdC8vMDxsaWZlPDFcblx0XHRpZiAobGlmZSA8PSAwIHx8IGxpZmUgPj0gMSlcblx0XHRcdHRocm93KG5ldyBFcnJvcihcImxpZmUgZXhjZWVkcyByYW5nZSAoMCwxKVwiKSk7XG5cdFx0dGhpcy5fbGlmZSA9IGxpZmU7XG5cdFx0dGhpcy5fY29sb3IgPSBjb2xvcjtcblx0fVxuXG5cdHB1YmxpYyBnZXQgY29sb3IoKTpDb2xvclRyYW5zZm9ybVxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX2NvbG9yO1xuXHR9XG5cblx0cHVibGljIGdldCBsaWZlKCk6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fbGlmZTtcblx0fVxuXG59XG5cbmV4cG9ydCA9IENvbG9yU2VnbWVudFBvaW50OyJdfQ==