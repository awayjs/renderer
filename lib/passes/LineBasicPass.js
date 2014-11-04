var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var MaterialPassGLBase = require("awayjs-renderergl/lib/passes/MaterialPassGLBase");
/**
 * LineBasicPass is a material pass that draws wireframe segments.
 */
var LineBasicPass = (function (_super) {
    __extends(LineBasicPass, _super);
    /**
     * Creates a new SegmentPass object.
     *
     * @param material The material to which this pass belongs.
     */
    function LineBasicPass() {
        _super.call(this);
    }
    /**
     * @inheritDoc
     */
    LineBasicPass.prototype._iGetFragmentCode = function (shaderObject, regCache, sharedReg) {
        var targetReg = sharedReg.shadedTarget;
        return "mov " + targetReg + ", v0\n";
    };
    return LineBasicPass;
})(MaterialPassGLBase);
module.exports = LineBasicPass;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9wYXNzZXMvbGluZWJhc2ljcGFzcy50cyJdLCJuYW1lcyI6WyJMaW5lQmFzaWNQYXNzIiwiTGluZUJhc2ljUGFzcy5jb25zdHJ1Y3RvciIsIkxpbmVCYXNpY1Bhc3MuX2lHZXRGcmFnbWVudENvZGUiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUlBLElBQU8sa0JBQWtCLFdBQWEsaURBQWlELENBQUMsQ0FBQztBQUV6RixBQUdBOztHQURHO0lBQ0csYUFBYTtJQUFTQSxVQUF0QkEsYUFBYUEsVUFBMkJBO0lBRTdDQTs7OztPQUlHQTtJQUNIQSxTQVBLQSxhQUFhQTtRQVNqQkMsaUJBQU9BLENBQUNBO0lBQ1RBLENBQUNBO0lBRUREOztPQUVHQTtJQUNJQSx5Q0FBaUJBLEdBQXhCQSxVQUF5QkEsWUFBNkJBLEVBQUVBLFFBQTRCQSxFQUFFQSxTQUE0QkE7UUFFakhFLElBQUlBLFNBQVNBLEdBQXlCQSxTQUFTQSxDQUFDQSxZQUFZQSxDQUFDQTtRQUU3REEsTUFBTUEsQ0FBQ0EsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsUUFBUUEsQ0FBQ0E7SUFDdENBLENBQUNBO0lBQ0ZGLG9CQUFDQTtBQUFEQSxDQXJCQSxBQXFCQ0EsRUFyQjJCLGtCQUFrQixFQXFCN0M7QUFFRCxBQUF1QixpQkFBZCxhQUFhLENBQUMiLCJmaWxlIjoicGFzc2VzL0xpbmVCYXNpY1Bhc3MuanMiLCJzb3VyY2VSb290IjoiLi4vIiwic291cmNlc0NvbnRlbnQiOlsi77u/aW1wb3J0IFNoYWRlck9iamVjdEJhc2VcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9jb21waWxhdGlvbi9TaGFkZXJPYmplY3RCYXNlXCIpO1xuaW1wb3J0IFNoYWRlclJlZ2lzdGVyQ2FjaGVcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJDYWNoZVwiKTtcbmltcG9ydCBTaGFkZXJSZWdpc3RlckRhdGFcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJEYXRhXCIpO1xuaW1wb3J0IFNoYWRlclJlZ2lzdGVyRWxlbWVudFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJFbGVtZW50XCIpO1xuaW1wb3J0IE1hdGVyaWFsUGFzc0dMQmFzZVx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9wYXNzZXMvTWF0ZXJpYWxQYXNzR0xCYXNlXCIpO1xuXG4vKipcbiAqIExpbmVCYXNpY1Bhc3MgaXMgYSBtYXRlcmlhbCBwYXNzIHRoYXQgZHJhd3Mgd2lyZWZyYW1lIHNlZ21lbnRzLlxuICovXG5jbGFzcyBMaW5lQmFzaWNQYXNzIGV4dGVuZHMgTWF0ZXJpYWxQYXNzR0xCYXNlXG57XG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IFNlZ21lbnRQYXNzIG9iamVjdC5cblx0ICpcblx0ICogQHBhcmFtIG1hdGVyaWFsIFRoZSBtYXRlcmlhbCB0byB3aGljaCB0aGlzIHBhc3MgYmVsb25ncy5cblx0ICovXG5cdGNvbnN0cnVjdG9yKClcblx0e1xuXHRcdHN1cGVyKCk7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBfaUdldEZyYWdtZW50Q29kZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgcmVnQ2FjaGU6U2hhZGVyUmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnOlNoYWRlclJlZ2lzdGVyRGF0YSk6c3RyaW5nXG5cdHtcblx0XHR2YXIgdGFyZ2V0UmVnOlNoYWRlclJlZ2lzdGVyRWxlbWVudCA9IHNoYXJlZFJlZy5zaGFkZWRUYXJnZXQ7XG5cblx0XHRyZXR1cm4gXCJtb3YgXCIgKyB0YXJnZXRSZWcgKyBcIiwgdjBcXG5cIjtcblx0fVxufVxuXG5leHBvcnQgPSBMaW5lQmFzaWNQYXNzOyJdfQ==