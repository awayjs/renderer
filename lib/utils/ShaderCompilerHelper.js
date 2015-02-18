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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi91dGlscy9TaGFkZXJDb21waWxlckhlbHBlci50cyJdLCJuYW1lcyI6WyJTaGFkZXJDb21waWxlckhlbHBlciIsIlNoYWRlckNvbXBpbGVySGVscGVyLmNvbnN0cnVjdG9yIiwiU2hhZGVyQ29tcGlsZXJIZWxwZXIuZ2V0VGV4MkRTYW1wbGVDb2RlIiwiU2hhZGVyQ29tcGlsZXJIZWxwZXIuZ2V0VGV4Q3ViZVNhbXBsZUNvZGUiLCJTaGFkZXJDb21waWxlckhlbHBlci5nZXRGb3JtYXRTdHJpbmdGb3JUZXh0dXJlIl0sIm1hcHBpbmdzIjoiQUFFQSxJQUFPLHNCQUFzQixXQUFZLGdEQUFnRCxDQUFDLENBQUM7QUFLM0YsSUFBTSxvQkFBb0I7SUFBMUJBLFNBQU1BLG9CQUFvQkE7SUFtRTFCQyxDQUFDQTtJQWpFQUQ7Ozs7Ozs7Ozs7O09BV0dBO0lBQ1dBLHVDQUFrQkEsR0FBaENBLFVBQWlDQSxTQUErQkEsRUFBRUEsU0FBNEJBLEVBQUVBLFFBQThCQSxFQUFFQSxPQUF3QkEsRUFBRUEsTUFBY0EsRUFBRUEsTUFBY0EsRUFBRUEsT0FBZUEsRUFBRUEsS0FBa0NBLEVBQUVBLFNBQXVCQTtRQUEzREUscUJBQWtDQSxHQUFsQ0EsWUFBa0NBO1FBQUVBLHlCQUF1QkEsR0FBdkJBLGdCQUF1QkE7UUFFclFBLElBQUlBLElBQUlBLEdBQVVBLFNBQVNBLElBQUlBLENBQUNBLE1BQU1BLEdBQUVBLE1BQU1BLEdBQUNBLE9BQU9BLENBQUNBLENBQUNBO1FBQ3hEQSxJQUFJQSxNQUFNQSxHQUFVQSxvQkFBb0JBLENBQUNBLHlCQUF5QkEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0E7UUFDNUVBLElBQUlBLE1BQU1BLEdBQVVBLENBQUNBLE1BQU1BLENBQUNBLEdBQUVBLENBQUNBLE9BQU9BLEdBQUVBLGtCQUFrQkEsR0FBR0EsUUFBUUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsT0FBT0EsR0FBRUEsb0JBQW9CQSxHQUFHQSxTQUFTQSxDQUFDQSxDQUFDQTtRQUVySEEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsS0FBS0EsSUFBSUEsSUFBSUEsQ0FBQ0E7WUFDakJBLEtBQUtBLEdBQUdBLFNBQVNBLENBQUNBLFNBQVNBLENBQUNBO1FBRTdCQSxNQUFNQSxDQUFDQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxJQUFJQSxHQUFHQSxLQUFLQSxHQUFHQSxJQUFJQSxHQUFHQSxRQUFRQSxHQUFHQSxPQUFPQSxHQUFHQSxNQUFNQSxHQUFHQSxHQUFHQSxHQUFHQSxNQUFNQSxHQUFHQSxJQUFJQSxHQUFHQSxLQUFLQSxDQUFDQTtJQUU3R0EsQ0FBQ0E7SUFHREY7Ozs7Ozs7OztPQVNHQTtJQUNXQSx5Q0FBb0JBLEdBQWxDQSxVQUFtQ0EsU0FBK0JBLEVBQUVBLFFBQThCQSxFQUFFQSxPQUF3QkEsRUFBRUEsTUFBY0EsRUFBRUEsT0FBZUEsRUFBRUEsS0FBMkJBO1FBRXpMRyxJQUFJQSxNQUFhQSxDQUFDQTtRQUNsQkEsSUFBSUEsTUFBTUEsR0FBVUEsb0JBQW9CQSxDQUFDQSx5QkFBeUJBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBO1FBQzVFQSxJQUFJQSxNQUFNQSxHQUFVQSxDQUFDQSxNQUFNQSxDQUFDQSxHQUFFQSxDQUFDQSxPQUFPQSxHQUFFQSxrQkFBa0JBLEdBQUdBLFFBQVFBLENBQUNBLEdBQUdBLENBQUNBLE9BQU9BLEdBQUVBLG9CQUFvQkEsR0FBR0EsU0FBU0EsQ0FBQ0EsQ0FBQ0E7UUFFckhBLE1BQU1BLENBQUNBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLElBQUlBLEdBQUdBLEtBQUtBLEdBQUdBLElBQUlBLEdBQUdBLFFBQVFBLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQUdBLE1BQU1BLEdBQUdBLEtBQUtBLENBQUNBO0lBQ2xHQSxDQUFDQTtJQUVESDs7Ozs7O09BTUdBO0lBQ1dBLDhDQUF5QkEsR0FBdkNBLFVBQXdDQSxPQUF3QkE7UUFFL0RJLE1BQU1BLENBQUNBLENBQUNBLE9BQU9BLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBO1lBQ3hCQSxLQUFLQSxzQkFBc0JBLENBQUNBLFVBQVVBO2dCQUNyQ0EsTUFBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0E7Z0JBQ2ZBLEtBQUtBLENBQUNBO1lBQ1BBLEtBQUtBLHNCQUFzQkEsQ0FBQ0EsZ0JBQWdCQTtnQkFDM0NBLE1BQU1BLENBQUNBLE9BQU9BLENBQUNBO2dCQUNmQSxLQUFLQSxDQUFDQTtZQUNQQTtnQkFDQ0EsTUFBTUEsQ0FBQ0EsRUFBRUEsQ0FBQ0E7UUFDWkEsQ0FBQ0E7SUFDRkEsQ0FBQ0E7SUFDRkosMkJBQUNBO0FBQURBLENBbkVBLEFBbUVDQSxJQUFBO0FBRUQsQUFBOEIsaUJBQXJCLG9CQUFvQixDQUFDIiwiZmlsZSI6InV0aWxzL1NoYWRlckNvbXBpbGVySGVscGVyLmpzIiwic291cmNlUm9vdCI6Ii4uLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBUZXh0dXJlUHJveHlCYXNlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvdGV4dHVyZXMvVGV4dHVyZVByb3h5QmFzZVwiKTtcclxuXHJcbmltcG9ydCBDb250ZXh0R0xUZXh0dXJlRm9ybWF0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9iYXNlL0NvbnRleHRHTFRleHR1cmVGb3JtYXRcIik7XHJcblxyXG5pbXBvcnQgU2hhZGVyUmVnaXN0ZXJEYXRhXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2NvbXBpbGF0aW9uL1NoYWRlclJlZ2lzdGVyRGF0YVwiKTtcclxuaW1wb3J0IFNoYWRlclJlZ2lzdGVyRWxlbWVudFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJFbGVtZW50XCIpO1xyXG5cclxuY2xhc3MgU2hhZGVyQ29tcGlsZXJIZWxwZXJcclxue1xyXG5cdC8qKlxyXG5cdCAqIEEgaGVscGVyIG1ldGhvZCB0aGF0IGdlbmVyYXRlcyBzdGFuZGFyZCBjb2RlIGZvciBzYW1wbGluZyBmcm9tIGEgdGV4dHVyZSB1c2luZyB0aGUgbm9ybWFsIHV2IGNvb3JkaW5hdGVzLlxyXG5cdCAqIEBwYXJhbSB2byBUaGUgTWV0aG9kVk8gb2JqZWN0IGxpbmtpbmcgdGhpcyBtZXRob2Qgd2l0aCB0aGUgcGFzcyBjdXJyZW50bHkgYmVpbmcgY29tcGlsZWQuXHJcblx0ICogQHBhcmFtIHNoYXJlZFJlZyBUaGUgc2hhcmVkIHJlZ2lzdGVyIG9iamVjdCBmb3IgdGhlIHNoYWRlci5cclxuXHQgKiBAcGFyYW0gaW5wdXRSZWcgVGhlIHRleHR1cmUgc3RyZWFtIHJlZ2lzdGVyLlxyXG5cdCAqIEBwYXJhbSB0ZXh0dXJlIFRoZSB0ZXh0dXJlIHdoaWNoIHdpbGwgYmUgYXNzaWduZWQgdG8gdGhlIGdpdmVuIHNsb3QuXHJcblx0ICogQHBhcmFtIHV2UmVnIEFuIG9wdGlvbmFsIHV2IHJlZ2lzdGVyIGlmIGNvb3JkaW5hdGVzIGRpZmZlcmVudCBmcm9tIHRoZSBwcmltYXJ5IHV2IGNvb3JkaW5hdGVzIGFyZSB0byBiZSB1c2VkLlxyXG5cdCAqIEBwYXJhbSBmb3JjZVdyYXAgSWYgdHJ1ZSwgdGV4dHVyZSB3cmFwcGluZyBpcyBlbmFibGVkIHJlZ2FyZGxlc3Mgb2YgdGhlIG1hdGVyaWFsIHNldHRpbmcuXHJcblx0ICogQHJldHVybiBUaGUgZnJhZ21lbnQgY29kZSB0aGF0IHBlcmZvcm1zIHRoZSBzYW1wbGluZy5cclxuXHQgKlxyXG5cdCAqIEBwcm90ZWN0ZWRcclxuXHQgKi9cclxuXHRwdWJsaWMgc3RhdGljIGdldFRleDJEU2FtcGxlQ29kZSh0YXJnZXRSZWc6U2hhZGVyUmVnaXN0ZXJFbGVtZW50LCBzaGFyZWRSZWc6U2hhZGVyUmVnaXN0ZXJEYXRhLCBpbnB1dFJlZzpTaGFkZXJSZWdpc3RlckVsZW1lbnQsIHRleHR1cmU6VGV4dHVyZVByb3h5QmFzZSwgc21vb3RoOmJvb2xlYW4sIHJlcGVhdDpib29sZWFuLCBtaXBtYXBzOmJvb2xlYW4sIHV2UmVnOlNoYWRlclJlZ2lzdGVyRWxlbWVudCA9IG51bGwsIGZvcmNlV3JhcDpzdHJpbmcgPSBudWxsKTpzdHJpbmdcclxuXHR7XHJcblx0XHR2YXIgd3JhcDpzdHJpbmcgPSBmb3JjZVdyYXAgfHwgKHJlcGVhdD8gXCJ3cmFwXCI6XCJjbGFtcFwiKTtcclxuXHRcdHZhciBmb3JtYXQ6c3RyaW5nID0gU2hhZGVyQ29tcGlsZXJIZWxwZXIuZ2V0Rm9ybWF0U3RyaW5nRm9yVGV4dHVyZSh0ZXh0dXJlKTtcclxuXHRcdHZhciBmaWx0ZXI6c3RyaW5nID0gKHNtb290aCk/IChtaXBtYXBzPyBcImxpbmVhcixtaXBsaW5lYXJcIiA6IFwibGluZWFyXCIpIDogKG1pcG1hcHM/IFwibmVhcmVzdCxtaXBuZWFyZXN0XCIgOiBcIm5lYXJlc3RcIik7XHJcblxyXG5cdFx0aWYgKHV2UmVnID09IG51bGwpXHJcblx0XHRcdHV2UmVnID0gc2hhcmVkUmVnLnV2VmFyeWluZztcclxuXHJcblx0XHRyZXR1cm4gXCJ0ZXggXCIgKyB0YXJnZXRSZWcgKyBcIiwgXCIgKyB1dlJlZyArIFwiLCBcIiArIGlucHV0UmVnICsgXCIgPDJkLFwiICsgZmlsdGVyICsgXCIsXCIgKyBmb3JtYXQgKyB3cmFwICsgXCI+XFxuXCI7XHJcblxyXG5cdH1cclxuXHJcblxyXG5cdC8qKlxyXG5cdCAqIEEgaGVscGVyIG1ldGhvZCB0aGF0IGdlbmVyYXRlcyBzdGFuZGFyZCBjb2RlIGZvciBzYW1wbGluZyBmcm9tIGEgY3ViZSB0ZXh0dXJlLlxyXG5cdCAqIEBwYXJhbSB2byBUaGUgTWV0aG9kVk8gb2JqZWN0IGxpbmtpbmcgdGhpcyBtZXRob2Qgd2l0aCB0aGUgcGFzcyBjdXJyZW50bHkgYmVpbmcgY29tcGlsZWQuXHJcblx0ICogQHBhcmFtIHRhcmdldFJlZyBUaGUgcmVnaXN0ZXIgaW4gd2hpY2ggdG8gc3RvcmUgdGhlIHNhbXBsZWQgY29sb3VyLlxyXG5cdCAqIEBwYXJhbSBpbnB1dFJlZyBUaGUgdGV4dHVyZSBzdHJlYW0gcmVnaXN0ZXIuXHJcblx0ICogQHBhcmFtIHRleHR1cmUgVGhlIGN1YmUgbWFwIHdoaWNoIHdpbGwgYmUgYXNzaWduZWQgdG8gdGhlIGdpdmVuIHNsb3QuXHJcblx0ICogQHBhcmFtIHV2UmVnIFRoZSBkaXJlY3Rpb24gdmVjdG9yIHdpdGggd2hpY2ggdG8gc2FtcGxlIHRoZSBjdWJlIG1hcC5cclxuXHQgKlxyXG5cdCAqIEBwcm90ZWN0ZWRcclxuXHQgKi9cclxuXHRwdWJsaWMgc3RhdGljIGdldFRleEN1YmVTYW1wbGVDb2RlKHRhcmdldFJlZzpTaGFkZXJSZWdpc3RlckVsZW1lbnQsIGlucHV0UmVnOlNoYWRlclJlZ2lzdGVyRWxlbWVudCwgdGV4dHVyZTpUZXh0dXJlUHJveHlCYXNlLCBzbW9vdGg6Ym9vbGVhbiwgbWlwbWFwczpib29sZWFuLCB1dlJlZzpTaGFkZXJSZWdpc3RlckVsZW1lbnQpOnN0cmluZ1xyXG5cdHtcclxuXHRcdHZhciBmaWx0ZXI6c3RyaW5nO1xyXG5cdFx0dmFyIGZvcm1hdDpzdHJpbmcgPSBTaGFkZXJDb21waWxlckhlbHBlci5nZXRGb3JtYXRTdHJpbmdGb3JUZXh0dXJlKHRleHR1cmUpO1xyXG5cdFx0dmFyIGZpbHRlcjpzdHJpbmcgPSAoc21vb3RoKT8gKG1pcG1hcHM/IFwibGluZWFyLG1pcGxpbmVhclwiIDogXCJsaW5lYXJcIikgOiAobWlwbWFwcz8gXCJuZWFyZXN0LG1pcG5lYXJlc3RcIiA6IFwibmVhcmVzdFwiKTtcclxuXHJcblx0XHRyZXR1cm4gXCJ0ZXggXCIgKyB0YXJnZXRSZWcgKyBcIiwgXCIgKyB1dlJlZyArIFwiLCBcIiArIGlucHV0UmVnICsgXCIgPGN1YmUsXCIgKyBmb3JtYXQgKyBmaWx0ZXIgKyBcIj5cXG5cIjtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEdlbmVyYXRlcyBhIHRleHR1cmUgZm9ybWF0IHN0cmluZyBmb3IgdGhlIHNhbXBsZSBpbnN0cnVjdGlvbi5cclxuXHQgKiBAcGFyYW0gdGV4dHVyZSBUaGUgdGV4dHVyZSBmb3Igd2hpY2ggdG8gZ2V0IHRoZSBmb3JtYXQgc3RyaW5nLlxyXG5cdCAqIEByZXR1cm5cclxuXHQgKlxyXG5cdCAqIEBwcm90ZWN0ZWRcclxuXHQgKi9cclxuXHRwdWJsaWMgc3RhdGljIGdldEZvcm1hdFN0cmluZ0ZvclRleHR1cmUodGV4dHVyZTpUZXh0dXJlUHJveHlCYXNlKTpzdHJpbmdcclxuXHR7XHJcblx0XHRzd2l0Y2ggKHRleHR1cmUuZm9ybWF0KSB7XHJcblx0XHRcdGNhc2UgQ29udGV4dEdMVGV4dHVyZUZvcm1hdC5DT01QUkVTU0VEOlxyXG5cdFx0XHRcdHJldHVybiBcImR4dDEsXCI7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgQ29udGV4dEdMVGV4dHVyZUZvcm1hdC5DT01QUkVTU0VEX0FMUEhBOlxyXG5cdFx0XHRcdHJldHVybiBcImR4dDUsXCI7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGRlZmF1bHQ6XHJcblx0XHRcdFx0cmV0dXJuIFwiXCI7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgPSBTaGFkZXJDb21waWxlckhlbHBlcjsiXX0=