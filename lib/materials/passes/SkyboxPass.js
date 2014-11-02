var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var MaterialPassBase = require("awayjs-renderergl/lib/materials/passes/MaterialPassBase");
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
})(MaterialPassBase);
module.exports = SkyboxPass;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvcGFzc2VzL3NreWJveHBhc3MudHMiXSwibmFtZXMiOlsiU2t5Ym94UGFzcyIsIlNreWJveFBhc3MuY29uc3RydWN0b3IiLCJTa3lib3hQYXNzLl9pSW5jbHVkZURlcGVuZGVuY2llcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0EsSUFBTyxnQkFBZ0IsV0FBYyx5REFBeUQsQ0FBQyxDQUFDO0FBRWhHLEFBR0E7O0dBREc7SUFDRyxVQUFVO0lBQVNBLFVBQW5CQSxVQUFVQSxVQUF5QkE7SUFFeENBOzs7O09BSUdBO0lBQ0hBLFNBUEtBLFVBQVVBO1FBU2RDLGlCQUFPQSxDQUFDQTtJQUNUQSxDQUFDQTtJQUdNRCwwQ0FBcUJBLEdBQTVCQSxVQUE2QkEsWUFBaUNBO1FBRTdERSxZQUFZQSxDQUFDQSxhQUFhQSxHQUFHQSxLQUFLQSxDQUFDQTtJQUNwQ0EsQ0FBQ0E7SUFDRkYsaUJBQUNBO0FBQURBLENBakJBLEFBaUJDQSxFQWpCd0IsZ0JBQWdCLEVBaUJ4QztBQUVELEFBQW9CLGlCQUFYLFVBQVUsQ0FBQyIsImZpbGUiOiJtYXRlcmlhbHMvcGFzc2VzL1NreWJveFBhc3MuanMiLCJzb3VyY2VSb290IjoiLi4vIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNoYWRlckxpZ2h0aW5nT2JqZWN0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL21hdGVyaWFscy9jb21waWxhdGlvbi9TaGFkZXJMaWdodGluZ09iamVjdFwiKTtcbmltcG9ydCBNYXRlcmlhbFBhc3NCYXNlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvbWF0ZXJpYWxzL3Bhc3Nlcy9NYXRlcmlhbFBhc3NCYXNlXCIpO1xuXG4vKipcbiAqIFNreWJveFBhc3MgcHJvdmlkZXMgYSBtYXRlcmlhbCBwYXNzIGV4Y2x1c2l2ZWx5IHVzZWQgdG8gcmVuZGVyIHNreSBib3hlcyBmcm9tIGEgY3ViZSB0ZXh0dXJlLlxuICovXG5jbGFzcyBTa3lib3hQYXNzIGV4dGVuZHMgTWF0ZXJpYWxQYXNzQmFzZVxue1xuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyBTa3lib3hQYXNzIG9iamVjdC5cblx0ICpcblx0ICogQHBhcmFtIG1hdGVyaWFsIFRoZSBtYXRlcmlhbCB0byB3aGljaCB0aGlzIHBhc3MgYmVsb25ncy5cblx0ICovXG5cdGNvbnN0cnVjdG9yKClcblx0e1xuXHRcdHN1cGVyKCk7XG5cdH1cblxuXG5cdHB1YmxpYyBfaUluY2x1ZGVEZXBlbmRlbmNpZXMoc2hhZGVyT2JqZWN0OlNoYWRlckxpZ2h0aW5nT2JqZWN0KVxuXHR7XG5cdFx0c2hhZGVyT2JqZWN0LnVzZU1pcG1hcHBpbmcgPSBmYWxzZTtcblx0fVxufVxuXG5leHBvcnQgPSBTa3lib3hQYXNzOyJdfQ==