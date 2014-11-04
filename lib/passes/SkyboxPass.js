var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var MaterialPassGLBase = require("awayjs-renderergl/lib/passes/MaterialPassGLBase");
/**
 * SkyboxPass provides a material pass exclusively used to render sky boxes from a cube texture.
 */
var SkyboxPass = (function (_super) {
    __extends(SkyboxPass, _super);
    /**
     * Creates a new SkyboxPass object.
     *
     * @param material The material to which this pass belongs.
     */
    function SkyboxPass() {
        _super.call(this);
    }
    SkyboxPass.prototype._iIncludeDependencies = function (shaderObject) {
        shaderObject.useMipmapping = false;
    };
    return SkyboxPass;
})(MaterialPassGLBase);
module.exports = SkyboxPass;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9wYXNzZXMvc2t5Ym94cGFzcy50cyJdLCJuYW1lcyI6WyJTa3lib3hQYXNzIiwiU2t5Ym94UGFzcy5jb25zdHJ1Y3RvciIsIlNreWJveFBhc3MuX2lJbmNsdWRlRGVwZW5kZW5jaWVzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSxJQUFPLGtCQUFrQixXQUFhLGlEQUFpRCxDQUFDLENBQUM7QUFFekYsQUFHQTs7R0FERztJQUNHLFVBQVU7SUFBU0EsVUFBbkJBLFVBQVVBLFVBQTJCQTtJQUUxQ0E7Ozs7T0FJR0E7SUFDSEEsU0FQS0EsVUFBVUE7UUFTZEMsaUJBQU9BLENBQUNBO0lBQ1RBLENBQUNBO0lBR01ELDBDQUFxQkEsR0FBNUJBLFVBQTZCQSxZQUE2QkE7UUFFekRFLFlBQVlBLENBQUNBLGFBQWFBLEdBQUdBLEtBQUtBLENBQUNBO0lBQ3BDQSxDQUFDQTtJQUNGRixpQkFBQ0E7QUFBREEsQ0FqQkEsQUFpQkNBLEVBakJ3QixrQkFBa0IsRUFpQjFDO0FBRUQsQUFBb0IsaUJBQVgsVUFBVSxDQUFDIiwiZmlsZSI6InBhc3Nlcy9Ta3lib3hQYXNzLmpzIiwic291cmNlUm9vdCI6Ii4uLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTaGFkZXJPYmplY3RCYXNlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvY29tcGlsYXRpb24vU2hhZGVyT2JqZWN0QmFzZVwiKTtcbmltcG9ydCBNYXRlcmlhbFBhc3NHTEJhc2VcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvcGFzc2VzL01hdGVyaWFsUGFzc0dMQmFzZVwiKTtcblxuLyoqXG4gKiBTa3lib3hQYXNzIHByb3ZpZGVzIGEgbWF0ZXJpYWwgcGFzcyBleGNsdXNpdmVseSB1c2VkIHRvIHJlbmRlciBza3kgYm94ZXMgZnJvbSBhIGN1YmUgdGV4dHVyZS5cbiAqL1xuY2xhc3MgU2t5Ym94UGFzcyBleHRlbmRzIE1hdGVyaWFsUGFzc0dMQmFzZVxue1xuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyBTa3lib3hQYXNzIG9iamVjdC5cblx0ICpcblx0ICogQHBhcmFtIG1hdGVyaWFsIFRoZSBtYXRlcmlhbCB0byB3aGljaCB0aGlzIHBhc3MgYmVsb25ncy5cblx0ICovXG5cdGNvbnN0cnVjdG9yKClcblx0e1xuXHRcdHN1cGVyKCk7XG5cdH1cblxuXG5cdHB1YmxpYyBfaUluY2x1ZGVEZXBlbmRlbmNpZXMoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UpXG5cdHtcblx0XHRzaGFkZXJPYmplY3QudXNlTWlwbWFwcGluZyA9IGZhbHNlO1xuXHR9XG59XG5cbmV4cG9ydCA9IFNreWJveFBhc3M7Il19