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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvZGF0YS9Db2xvclNlZ21lbnRQb2ludC50cyJdLCJuYW1lcyI6WyJDb2xvclNlZ21lbnRQb2ludCIsIkNvbG9yU2VnbWVudFBvaW50LmNvbnN0cnVjdG9yIiwiQ29sb3JTZWdtZW50UG9pbnQuY29sb3IiLCJDb2xvclNlZ21lbnRQb2ludC5saWZlIl0sIm1hcHBpbmdzIjoiQUFFQSxJQUFNLGlCQUFpQjtJQUt0QkEsU0FMS0EsaUJBQWlCQSxDQUtWQSxJQUFXQSxFQUFFQSxLQUFvQkE7UUFFNUNDLEFBQ0FBLFVBRFVBO1FBQ1ZBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLElBQUlBLENBQUNBLElBQUlBLElBQUlBLElBQUlBLENBQUNBLENBQUNBO1lBQzFCQSxNQUFLQSxDQUFDQSxJQUFJQSxLQUFLQSxDQUFDQSwwQkFBMEJBLENBQUNBLENBQUNBLENBQUNBO1FBQzlDQSxJQUFJQSxDQUFDQSxLQUFLQSxHQUFHQSxJQUFJQSxDQUFDQTtRQUNsQkEsSUFBSUEsQ0FBQ0EsTUFBTUEsR0FBR0EsS0FBS0EsQ0FBQ0E7SUFDckJBLENBQUNBO0lBRURELHNCQUFXQSxvQ0FBS0E7YUFBaEJBO1lBRUNFLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBO1FBQ3BCQSxDQUFDQTs7O09BQUFGO0lBRURBLHNCQUFXQSxtQ0FBSUE7YUFBZkE7WUFFQ0csTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7UUFDbkJBLENBQUNBOzs7T0FBQUg7SUFFRkEsd0JBQUNBO0FBQURBLENBeEJBLEFBd0JDQSxJQUFBO0FBRUQsQUFBMkIsaUJBQWxCLGlCQUFpQixDQUFDIiwiZmlsZSI6ImFuaW1hdG9ycy9kYXRhL0NvbG9yU2VnbWVudFBvaW50LmpzIiwic291cmNlUm9vdCI6Ii4uLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDb2xvclRyYW5zZm9ybVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZ2VvbS9Db2xvclRyYW5zZm9ybVwiKTtcclxuXHJcbmNsYXNzIENvbG9yU2VnbWVudFBvaW50XHJcbntcclxuXHRwcml2YXRlIF9jb2xvcjpDb2xvclRyYW5zZm9ybTtcclxuXHRwcml2YXRlIF9saWZlOm51bWJlcjtcclxuXHJcblx0Y29uc3RydWN0b3IobGlmZTpudW1iZXIsIGNvbG9yOkNvbG9yVHJhbnNmb3JtKVxyXG5cdHtcclxuXHRcdC8vMDxsaWZlPDFcclxuXHRcdGlmIChsaWZlIDw9IDAgfHwgbGlmZSA+PSAxKVxyXG5cdFx0XHR0aHJvdyhuZXcgRXJyb3IoXCJsaWZlIGV4Y2VlZHMgcmFuZ2UgKDAsMSlcIikpO1xyXG5cdFx0dGhpcy5fbGlmZSA9IGxpZmU7XHJcblx0XHR0aGlzLl9jb2xvciA9IGNvbG9yO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldCBjb2xvcigpOkNvbG9yVHJhbnNmb3JtXHJcblx0e1xyXG5cdFx0cmV0dXJuIHRoaXMuX2NvbG9yO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldCBsaWZlKCk6bnVtYmVyXHJcblx0e1xyXG5cdFx0cmV0dXJuIHRoaXMuX2xpZmU7XHJcblx0fVxyXG5cclxufVxyXG5cclxuZXhwb3J0ID0gQ29sb3JTZWdtZW50UG9pbnQ7Il19