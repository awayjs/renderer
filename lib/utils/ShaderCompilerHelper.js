var ContextGLTextureFormat = require("awayjs-stagegl/lib/base/ContextGLTextureFormat");
var ShaderCompilerHelper = (function () {
    function ShaderCompilerHelper() {
    }
    /**
     * A helper method that generates standard code for sampling from a texture using the normal uv coordinates.
     * @param vo The MethodVO object linking this method with the pass currently being compiled.
     * @param sharedReg The shared register object for the shader.
     * @param inputReg The texture stream register.
     * @param texture The texture which will be assigned to the given slot.
     * @param uvReg An optional uv register if coordinates different from the primary uv coordinates are to be used.
     * @param forceWrap If true, texture wrapping is enabled regardless of the material setting.
     * @return The fragment code that performs the sampling.
     *
     * @protected
     */
    ShaderCompilerHelper.getTex2DSampleCode = function (targetReg, sharedReg, inputReg, texture, smooth, repeat, mipmaps, uvReg, forceWrap) {
        if (uvReg === void 0) { uvReg = null; }
        if (forceWrap === void 0) { forceWrap = null; }
        var wrap = forceWrap || (repeat ? "wrap" : "clamp");
        var format = ShaderCompilerHelper.getFormatStringForTexture(texture);
        var filter = (smooth) ? (mipmaps ? "linear,miplinear" : "linear") : (mipmaps ? "nearest,mipnearest" : "nearest");
        if (uvReg == null)
            uvReg = sharedReg.uvVarying;
        return "tex " + targetReg + ", " + uvReg + ", " + inputReg + " <2d," + filter + "," + format + wrap + ">\n";
    };
    /**
     * A helper method that generates standard code for sampling from a cube texture.
     * @param vo The MethodVO object linking this method with the pass currently being compiled.
     * @param targetReg The register in which to store the sampled colour.
     * @param inputReg The texture stream register.
     * @param texture The cube map which will be assigned to the given slot.
     * @param uvReg The direction vector with which to sample the cube map.
     *
     * @protected
     */
    ShaderCompilerHelper.getTexCubeSampleCode = function (targetReg, inputReg, texture, smooth, mipmaps, uvReg) {
        var filter;
        var format = ShaderCompilerHelper.getFormatStringForTexture(texture);
        var filter = (smooth) ? (mipmaps ? "linear,miplinear" : "linear") : (mipmaps ? "nearest,mipnearest" : "nearest");
        return "tex " + targetReg + ", " + uvReg + ", " + inputReg + " <cube," + format + filter + ">\n";
    };
    /**
     * Generates a texture format string for the sample instruction.
     * @param texture The texture for which to get the format string.
     * @return
     *
     * @protected
     */
    ShaderCompilerHelper.getFormatStringForTexture = function (texture) {
        switch (texture.format) {
            case ContextGLTextureFormat.COMPRESSED:
                return "dxt1,";
                break;
            case ContextGLTextureFormat.COMPRESSED_ALPHA:
                return "dxt5,";
                break;
            default:
                return "";
        }
    };
    return ShaderCompilerHelper;
})();
module.exports = ShaderCompilerHelper;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi91dGlscy9TaGFkZXJDb21waWxlckhlbHBlci50cyJdLCJuYW1lcyI6WyJTaGFkZXJDb21waWxlckhlbHBlciIsIlNoYWRlckNvbXBpbGVySGVscGVyLmNvbnN0cnVjdG9yIiwiU2hhZGVyQ29tcGlsZXJIZWxwZXIuZ2V0VGV4MkRTYW1wbGVDb2RlIiwiU2hhZGVyQ29tcGlsZXJIZWxwZXIuZ2V0VGV4Q3ViZVNhbXBsZUNvZGUiLCJTaGFkZXJDb21waWxlckhlbHBlci5nZXRGb3JtYXRTdHJpbmdGb3JUZXh0dXJlIl0sIm1hcHBpbmdzIjoiQUFFQSxJQUFPLHNCQUFzQixXQUFZLGdEQUFnRCxDQUFDLENBQUM7QUFLM0YsSUFBTSxvQkFBb0I7SUFBMUJBLFNBQU1BLG9CQUFvQkE7SUFtRTFCQyxDQUFDQTtJQWpFQUQ7Ozs7Ozs7Ozs7O09BV0dBO0lBQ1dBLHVDQUFrQkEsR0FBaENBLFVBQWlDQSxTQUErQkEsRUFBRUEsU0FBNEJBLEVBQUVBLFFBQThCQSxFQUFFQSxPQUFtQkEsRUFBRUEsTUFBY0EsRUFBRUEsTUFBY0EsRUFBRUEsT0FBZUEsRUFBRUEsS0FBa0NBLEVBQUVBLFNBQXVCQTtRQUEzREUscUJBQWtDQSxHQUFsQ0EsWUFBa0NBO1FBQUVBLHlCQUF1QkEsR0FBdkJBLGdCQUF1QkE7UUFFaFFBLElBQUlBLElBQUlBLEdBQVVBLFNBQVNBLElBQUlBLENBQUNBLE1BQU1BLEdBQUVBLE1BQU1BLEdBQUNBLE9BQU9BLENBQUNBLENBQUNBO1FBQ3hEQSxJQUFJQSxNQUFNQSxHQUFVQSxvQkFBb0JBLENBQUNBLHlCQUF5QkEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0E7UUFDNUVBLElBQUlBLE1BQU1BLEdBQVVBLENBQUNBLE1BQU1BLENBQUNBLEdBQUVBLENBQUNBLE9BQU9BLEdBQUVBLGtCQUFrQkEsR0FBR0EsUUFBUUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsT0FBT0EsR0FBRUEsb0JBQW9CQSxHQUFHQSxTQUFTQSxDQUFDQSxDQUFDQTtRQUVySEEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsS0FBS0EsSUFBSUEsSUFBSUEsQ0FBQ0E7WUFDakJBLEtBQUtBLEdBQUdBLFNBQVNBLENBQUNBLFNBQVNBLENBQUNBO1FBRTdCQSxNQUFNQSxDQUFDQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxJQUFJQSxHQUFHQSxLQUFLQSxHQUFHQSxJQUFJQSxHQUFHQSxRQUFRQSxHQUFHQSxPQUFPQSxHQUFHQSxNQUFNQSxHQUFHQSxHQUFHQSxHQUFHQSxNQUFNQSxHQUFHQSxJQUFJQSxHQUFHQSxLQUFLQSxDQUFDQTtJQUU3R0EsQ0FBQ0E7SUFHREY7Ozs7Ozs7OztPQVNHQTtJQUNXQSx5Q0FBb0JBLEdBQWxDQSxVQUFtQ0EsU0FBK0JBLEVBQUVBLFFBQThCQSxFQUFFQSxPQUFtQkEsRUFBRUEsTUFBY0EsRUFBRUEsT0FBZUEsRUFBRUEsS0FBMkJBO1FBRXBMRyxJQUFJQSxNQUFhQSxDQUFDQTtRQUNsQkEsSUFBSUEsTUFBTUEsR0FBVUEsb0JBQW9CQSxDQUFDQSx5QkFBeUJBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBO1FBQzVFQSxJQUFJQSxNQUFNQSxHQUFVQSxDQUFDQSxNQUFNQSxDQUFDQSxHQUFFQSxDQUFDQSxPQUFPQSxHQUFFQSxrQkFBa0JBLEdBQUdBLFFBQVFBLENBQUNBLEdBQUdBLENBQUNBLE9BQU9BLEdBQUVBLG9CQUFvQkEsR0FBR0EsU0FBU0EsQ0FBQ0EsQ0FBQ0E7UUFFckhBLE1BQU1BLENBQUNBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLElBQUlBLEdBQUdBLEtBQUtBLEdBQUdBLElBQUlBLEdBQUdBLFFBQVFBLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQUdBLE1BQU1BLEdBQUdBLEtBQUtBLENBQUNBO0lBQ2xHQSxDQUFDQTtJQUVESDs7Ozs7O09BTUdBO0lBQ1dBLDhDQUF5QkEsR0FBdkNBLFVBQXdDQSxPQUFtQkE7UUFFMURJLE1BQU1BLENBQUNBLENBQUNBLE9BQU9BLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBO1lBQ3hCQSxLQUFLQSxzQkFBc0JBLENBQUNBLFVBQVVBO2dCQUNyQ0EsTUFBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0E7Z0JBQ2ZBLEtBQUtBLENBQUNBO1lBQ1BBLEtBQUtBLHNCQUFzQkEsQ0FBQ0EsZ0JBQWdCQTtnQkFDM0NBLE1BQU1BLENBQUNBLE9BQU9BLENBQUNBO2dCQUNmQSxLQUFLQSxDQUFDQTtZQUNQQTtnQkFDQ0EsTUFBTUEsQ0FBQ0EsRUFBRUEsQ0FBQ0E7UUFDWkEsQ0FBQ0E7SUFDRkEsQ0FBQ0E7SUFDRkosMkJBQUNBO0FBQURBLENBbkVBLEFBbUVDQSxJQUFBO0FBRUQsQUFBOEIsaUJBQXJCLG9CQUFvQixDQUFDIiwiZmlsZSI6InV0aWxzL1NoYWRlckNvbXBpbGVySGVscGVyLmpzIiwic291cmNlUm9vdCI6Ii4uLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBUZXh0dXJlQmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvdGV4dHVyZXMvVGV4dHVyZUJhc2VcIik7XG5cbmltcG9ydCBDb250ZXh0R0xUZXh0dXJlRm9ybWF0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9iYXNlL0NvbnRleHRHTFRleHR1cmVGb3JtYXRcIik7XG5cbmltcG9ydCBTaGFkZXJSZWdpc3RlckRhdGFcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJEYXRhXCIpO1xuaW1wb3J0IFNoYWRlclJlZ2lzdGVyRWxlbWVudFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJFbGVtZW50XCIpO1xuXG5jbGFzcyBTaGFkZXJDb21waWxlckhlbHBlclxue1xuXHQvKipcblx0ICogQSBoZWxwZXIgbWV0aG9kIHRoYXQgZ2VuZXJhdGVzIHN0YW5kYXJkIGNvZGUgZm9yIHNhbXBsaW5nIGZyb20gYSB0ZXh0dXJlIHVzaW5nIHRoZSBub3JtYWwgdXYgY29vcmRpbmF0ZXMuXG5cdCAqIEBwYXJhbSB2byBUaGUgTWV0aG9kVk8gb2JqZWN0IGxpbmtpbmcgdGhpcyBtZXRob2Qgd2l0aCB0aGUgcGFzcyBjdXJyZW50bHkgYmVpbmcgY29tcGlsZWQuXG5cdCAqIEBwYXJhbSBzaGFyZWRSZWcgVGhlIHNoYXJlZCByZWdpc3RlciBvYmplY3QgZm9yIHRoZSBzaGFkZXIuXG5cdCAqIEBwYXJhbSBpbnB1dFJlZyBUaGUgdGV4dHVyZSBzdHJlYW0gcmVnaXN0ZXIuXG5cdCAqIEBwYXJhbSB0ZXh0dXJlIFRoZSB0ZXh0dXJlIHdoaWNoIHdpbGwgYmUgYXNzaWduZWQgdG8gdGhlIGdpdmVuIHNsb3QuXG5cdCAqIEBwYXJhbSB1dlJlZyBBbiBvcHRpb25hbCB1diByZWdpc3RlciBpZiBjb29yZGluYXRlcyBkaWZmZXJlbnQgZnJvbSB0aGUgcHJpbWFyeSB1diBjb29yZGluYXRlcyBhcmUgdG8gYmUgdXNlZC5cblx0ICogQHBhcmFtIGZvcmNlV3JhcCBJZiB0cnVlLCB0ZXh0dXJlIHdyYXBwaW5nIGlzIGVuYWJsZWQgcmVnYXJkbGVzcyBvZiB0aGUgbWF0ZXJpYWwgc2V0dGluZy5cblx0ICogQHJldHVybiBUaGUgZnJhZ21lbnQgY29kZSB0aGF0IHBlcmZvcm1zIHRoZSBzYW1wbGluZy5cblx0ICpcblx0ICogQHByb3RlY3RlZFxuXHQgKi9cblx0cHVibGljIHN0YXRpYyBnZXRUZXgyRFNhbXBsZUNvZGUodGFyZ2V0UmVnOlNoYWRlclJlZ2lzdGVyRWxlbWVudCwgc2hhcmVkUmVnOlNoYWRlclJlZ2lzdGVyRGF0YSwgaW5wdXRSZWc6U2hhZGVyUmVnaXN0ZXJFbGVtZW50LCB0ZXh0dXJlOlRleHR1cmVCYXNlLCBzbW9vdGg6Ym9vbGVhbiwgcmVwZWF0OmJvb2xlYW4sIG1pcG1hcHM6Ym9vbGVhbiwgdXZSZWc6U2hhZGVyUmVnaXN0ZXJFbGVtZW50ID0gbnVsbCwgZm9yY2VXcmFwOnN0cmluZyA9IG51bGwpOnN0cmluZ1xuXHR7XG5cdFx0dmFyIHdyYXA6c3RyaW5nID0gZm9yY2VXcmFwIHx8IChyZXBlYXQ/IFwid3JhcFwiOlwiY2xhbXBcIik7XG5cdFx0dmFyIGZvcm1hdDpzdHJpbmcgPSBTaGFkZXJDb21waWxlckhlbHBlci5nZXRGb3JtYXRTdHJpbmdGb3JUZXh0dXJlKHRleHR1cmUpO1xuXHRcdHZhciBmaWx0ZXI6c3RyaW5nID0gKHNtb290aCk/IChtaXBtYXBzPyBcImxpbmVhcixtaXBsaW5lYXJcIiA6IFwibGluZWFyXCIpIDogKG1pcG1hcHM/IFwibmVhcmVzdCxtaXBuZWFyZXN0XCIgOiBcIm5lYXJlc3RcIik7XG5cblx0XHRpZiAodXZSZWcgPT0gbnVsbClcblx0XHRcdHV2UmVnID0gc2hhcmVkUmVnLnV2VmFyeWluZztcblxuXHRcdHJldHVybiBcInRleCBcIiArIHRhcmdldFJlZyArIFwiLCBcIiArIHV2UmVnICsgXCIsIFwiICsgaW5wdXRSZWcgKyBcIiA8MmQsXCIgKyBmaWx0ZXIgKyBcIixcIiArIGZvcm1hdCArIHdyYXAgKyBcIj5cXG5cIjtcblxuXHR9XG5cblxuXHQvKipcblx0ICogQSBoZWxwZXIgbWV0aG9kIHRoYXQgZ2VuZXJhdGVzIHN0YW5kYXJkIGNvZGUgZm9yIHNhbXBsaW5nIGZyb20gYSBjdWJlIHRleHR1cmUuXG5cdCAqIEBwYXJhbSB2byBUaGUgTWV0aG9kVk8gb2JqZWN0IGxpbmtpbmcgdGhpcyBtZXRob2Qgd2l0aCB0aGUgcGFzcyBjdXJyZW50bHkgYmVpbmcgY29tcGlsZWQuXG5cdCAqIEBwYXJhbSB0YXJnZXRSZWcgVGhlIHJlZ2lzdGVyIGluIHdoaWNoIHRvIHN0b3JlIHRoZSBzYW1wbGVkIGNvbG91ci5cblx0ICogQHBhcmFtIGlucHV0UmVnIFRoZSB0ZXh0dXJlIHN0cmVhbSByZWdpc3Rlci5cblx0ICogQHBhcmFtIHRleHR1cmUgVGhlIGN1YmUgbWFwIHdoaWNoIHdpbGwgYmUgYXNzaWduZWQgdG8gdGhlIGdpdmVuIHNsb3QuXG5cdCAqIEBwYXJhbSB1dlJlZyBUaGUgZGlyZWN0aW9uIHZlY3RvciB3aXRoIHdoaWNoIHRvIHNhbXBsZSB0aGUgY3ViZSBtYXAuXG5cdCAqXG5cdCAqIEBwcm90ZWN0ZWRcblx0ICovXG5cdHB1YmxpYyBzdGF0aWMgZ2V0VGV4Q3ViZVNhbXBsZUNvZGUodGFyZ2V0UmVnOlNoYWRlclJlZ2lzdGVyRWxlbWVudCwgaW5wdXRSZWc6U2hhZGVyUmVnaXN0ZXJFbGVtZW50LCB0ZXh0dXJlOlRleHR1cmVCYXNlLCBzbW9vdGg6Ym9vbGVhbiwgbWlwbWFwczpib29sZWFuLCB1dlJlZzpTaGFkZXJSZWdpc3RlckVsZW1lbnQpOnN0cmluZ1xuXHR7XG5cdFx0dmFyIGZpbHRlcjpzdHJpbmc7XG5cdFx0dmFyIGZvcm1hdDpzdHJpbmcgPSBTaGFkZXJDb21waWxlckhlbHBlci5nZXRGb3JtYXRTdHJpbmdGb3JUZXh0dXJlKHRleHR1cmUpO1xuXHRcdHZhciBmaWx0ZXI6c3RyaW5nID0gKHNtb290aCk/IChtaXBtYXBzPyBcImxpbmVhcixtaXBsaW5lYXJcIiA6IFwibGluZWFyXCIpIDogKG1pcG1hcHM/IFwibmVhcmVzdCxtaXBuZWFyZXN0XCIgOiBcIm5lYXJlc3RcIik7XG5cblx0XHRyZXR1cm4gXCJ0ZXggXCIgKyB0YXJnZXRSZWcgKyBcIiwgXCIgKyB1dlJlZyArIFwiLCBcIiArIGlucHV0UmVnICsgXCIgPGN1YmUsXCIgKyBmb3JtYXQgKyBmaWx0ZXIgKyBcIj5cXG5cIjtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZW5lcmF0ZXMgYSB0ZXh0dXJlIGZvcm1hdCBzdHJpbmcgZm9yIHRoZSBzYW1wbGUgaW5zdHJ1Y3Rpb24uXG5cdCAqIEBwYXJhbSB0ZXh0dXJlIFRoZSB0ZXh0dXJlIGZvciB3aGljaCB0byBnZXQgdGhlIGZvcm1hdCBzdHJpbmcuXG5cdCAqIEByZXR1cm5cblx0ICpcblx0ICogQHByb3RlY3RlZFxuXHQgKi9cblx0cHVibGljIHN0YXRpYyBnZXRGb3JtYXRTdHJpbmdGb3JUZXh0dXJlKHRleHR1cmU6VGV4dHVyZUJhc2UpOnN0cmluZ1xuXHR7XG5cdFx0c3dpdGNoICh0ZXh0dXJlLmZvcm1hdCkge1xuXHRcdFx0Y2FzZSBDb250ZXh0R0xUZXh0dXJlRm9ybWF0LkNPTVBSRVNTRUQ6XG5cdFx0XHRcdHJldHVybiBcImR4dDEsXCI7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBDb250ZXh0R0xUZXh0dXJlRm9ybWF0LkNPTVBSRVNTRURfQUxQSEE6XG5cdFx0XHRcdHJldHVybiBcImR4dDUsXCI7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0cmV0dXJuIFwiXCI7XG5cdFx0fVxuXHR9XG59XG5cbmV4cG9ydCA9IFNoYWRlckNvbXBpbGVySGVscGVyOyJdfQ==