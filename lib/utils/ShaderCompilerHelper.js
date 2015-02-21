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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi91dGlscy9TaGFkZXJDb21waWxlckhlbHBlci50cyJdLCJuYW1lcyI6WyJTaGFkZXJDb21waWxlckhlbHBlciIsIlNoYWRlckNvbXBpbGVySGVscGVyLmNvbnN0cnVjdG9yIiwiU2hhZGVyQ29tcGlsZXJIZWxwZXIuZ2V0VGV4MkRTYW1wbGVDb2RlIiwiU2hhZGVyQ29tcGlsZXJIZWxwZXIuZ2V0VGV4Q3ViZVNhbXBsZUNvZGUiLCJTaGFkZXJDb21waWxlckhlbHBlci5nZXRGb3JtYXRTdHJpbmdGb3JUZXh0dXJlIl0sIm1hcHBpbmdzIjoiQUFFQSxJQUFPLHNCQUFzQixXQUFZLGdEQUFnRCxDQUFDLENBQUM7QUFLM0YsSUFBTSxvQkFBb0I7SUFBMUJBLFNBQU1BLG9CQUFvQkE7SUFtRTFCQyxDQUFDQTtJQWpFQUQ7Ozs7Ozs7Ozs7O09BV0dBO0lBQ1dBLHVDQUFrQkEsR0FBaENBLFVBQWlDQSxTQUErQkEsRUFBRUEsU0FBNEJBLEVBQUVBLFFBQThCQSxFQUFFQSxPQUF3QkEsRUFBRUEsTUFBY0EsRUFBRUEsTUFBY0EsRUFBRUEsT0FBZUEsRUFBRUEsS0FBa0NBLEVBQUVBLFNBQXVCQTtRQUEzREUscUJBQWtDQSxHQUFsQ0EsWUFBa0NBO1FBQUVBLHlCQUF1QkEsR0FBdkJBLGdCQUF1QkE7UUFFclFBLElBQUlBLElBQUlBLEdBQVVBLFNBQVNBLElBQUlBLENBQUNBLE1BQU1BLEdBQUVBLE1BQU1BLEdBQUNBLE9BQU9BLENBQUNBLENBQUNBO1FBQ3hEQSxJQUFJQSxNQUFNQSxHQUFVQSxvQkFBb0JBLENBQUNBLHlCQUF5QkEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0E7UUFDNUVBLElBQUlBLE1BQU1BLEdBQVVBLENBQUNBLE1BQU1BLENBQUNBLEdBQUVBLENBQUNBLE9BQU9BLEdBQUVBLGtCQUFrQkEsR0FBR0EsUUFBUUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsT0FBT0EsR0FBRUEsb0JBQW9CQSxHQUFHQSxTQUFTQSxDQUFDQSxDQUFDQTtRQUVySEEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsS0FBS0EsSUFBSUEsSUFBSUEsQ0FBQ0E7WUFDakJBLEtBQUtBLEdBQUdBLFNBQVNBLENBQUNBLFNBQVNBLENBQUNBO1FBRTdCQSxNQUFNQSxDQUFDQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxJQUFJQSxHQUFHQSxLQUFLQSxHQUFHQSxJQUFJQSxHQUFHQSxRQUFRQSxHQUFHQSxPQUFPQSxHQUFHQSxNQUFNQSxHQUFHQSxHQUFHQSxHQUFHQSxNQUFNQSxHQUFHQSxJQUFJQSxHQUFHQSxLQUFLQSxDQUFDQTtJQUU3R0EsQ0FBQ0E7SUFHREY7Ozs7Ozs7OztPQVNHQTtJQUNXQSx5Q0FBb0JBLEdBQWxDQSxVQUFtQ0EsU0FBK0JBLEVBQUVBLFFBQThCQSxFQUFFQSxPQUF3QkEsRUFBRUEsTUFBY0EsRUFBRUEsT0FBZUEsRUFBRUEsS0FBMkJBO1FBRXpMRyxJQUFJQSxNQUFhQSxDQUFDQTtRQUNsQkEsSUFBSUEsTUFBTUEsR0FBVUEsb0JBQW9CQSxDQUFDQSx5QkFBeUJBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBO1FBQzVFQSxJQUFJQSxNQUFNQSxHQUFVQSxDQUFDQSxNQUFNQSxDQUFDQSxHQUFFQSxDQUFDQSxPQUFPQSxHQUFFQSxrQkFBa0JBLEdBQUdBLFFBQVFBLENBQUNBLEdBQUdBLENBQUNBLE9BQU9BLEdBQUVBLG9CQUFvQkEsR0FBR0EsU0FBU0EsQ0FBQ0EsQ0FBQ0E7UUFFckhBLE1BQU1BLENBQUNBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLElBQUlBLEdBQUdBLEtBQUtBLEdBQUdBLElBQUlBLEdBQUdBLFFBQVFBLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQUdBLE1BQU1BLEdBQUdBLEtBQUtBLENBQUNBO0lBQ2xHQSxDQUFDQTtJQUVESDs7Ozs7O09BTUdBO0lBQ1dBLDhDQUF5QkEsR0FBdkNBLFVBQXdDQSxPQUF3QkE7UUFFL0RJLE1BQU1BLENBQUNBLENBQUNBLE9BQU9BLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBO1lBQ3hCQSxLQUFLQSxzQkFBc0JBLENBQUNBLFVBQVVBO2dCQUNyQ0EsTUFBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0E7Z0JBQ2ZBLEtBQUtBLENBQUNBO1lBQ1BBLEtBQUtBLHNCQUFzQkEsQ0FBQ0EsZ0JBQWdCQTtnQkFDM0NBLE1BQU1BLENBQUNBLE9BQU9BLENBQUNBO2dCQUNmQSxLQUFLQSxDQUFDQTtZQUNQQTtnQkFDQ0EsTUFBTUEsQ0FBQ0EsRUFBRUEsQ0FBQ0E7UUFDWkEsQ0FBQ0E7SUFDRkEsQ0FBQ0E7SUFDRkosMkJBQUNBO0FBQURBLENBbkVBLEFBbUVDQSxJQUFBO0FBRUQsQUFBOEIsaUJBQXJCLG9CQUFvQixDQUFDIiwiZmlsZSI6InV0aWxzL1NoYWRlckNvbXBpbGVySGVscGVyLmpzIiwic291cmNlUm9vdCI6Ii4uLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBUZXh0dXJlUHJveHlCYXNlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvdGV4dHVyZXMvVGV4dHVyZVByb3h5QmFzZVwiKTtcblxuaW1wb3J0IENvbnRleHRHTFRleHR1cmVGb3JtYXRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2Jhc2UvQ29udGV4dEdMVGV4dHVyZUZvcm1hdFwiKTtcblxuaW1wb3J0IFNoYWRlclJlZ2lzdGVyRGF0YVx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckRhdGFcIik7XG5pbXBvcnQgU2hhZGVyUmVnaXN0ZXJFbGVtZW50XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckVsZW1lbnRcIik7XG5cbmNsYXNzIFNoYWRlckNvbXBpbGVySGVscGVyXG57XG5cdC8qKlxuXHQgKiBBIGhlbHBlciBtZXRob2QgdGhhdCBnZW5lcmF0ZXMgc3RhbmRhcmQgY29kZSBmb3Igc2FtcGxpbmcgZnJvbSBhIHRleHR1cmUgdXNpbmcgdGhlIG5vcm1hbCB1diBjb29yZGluYXRlcy5cblx0ICogQHBhcmFtIHZvIFRoZSBNZXRob2RWTyBvYmplY3QgbGlua2luZyB0aGlzIG1ldGhvZCB3aXRoIHRoZSBwYXNzIGN1cnJlbnRseSBiZWluZyBjb21waWxlZC5cblx0ICogQHBhcmFtIHNoYXJlZFJlZyBUaGUgc2hhcmVkIHJlZ2lzdGVyIG9iamVjdCBmb3IgdGhlIHNoYWRlci5cblx0ICogQHBhcmFtIGlucHV0UmVnIFRoZSB0ZXh0dXJlIHN0cmVhbSByZWdpc3Rlci5cblx0ICogQHBhcmFtIHRleHR1cmUgVGhlIHRleHR1cmUgd2hpY2ggd2lsbCBiZSBhc3NpZ25lZCB0byB0aGUgZ2l2ZW4gc2xvdC5cblx0ICogQHBhcmFtIHV2UmVnIEFuIG9wdGlvbmFsIHV2IHJlZ2lzdGVyIGlmIGNvb3JkaW5hdGVzIGRpZmZlcmVudCBmcm9tIHRoZSBwcmltYXJ5IHV2IGNvb3JkaW5hdGVzIGFyZSB0byBiZSB1c2VkLlxuXHQgKiBAcGFyYW0gZm9yY2VXcmFwIElmIHRydWUsIHRleHR1cmUgd3JhcHBpbmcgaXMgZW5hYmxlZCByZWdhcmRsZXNzIG9mIHRoZSBtYXRlcmlhbCBzZXR0aW5nLlxuXHQgKiBAcmV0dXJuIFRoZSBmcmFnbWVudCBjb2RlIHRoYXQgcGVyZm9ybXMgdGhlIHNhbXBsaW5nLlxuXHQgKlxuXHQgKiBAcHJvdGVjdGVkXG5cdCAqL1xuXHRwdWJsaWMgc3RhdGljIGdldFRleDJEU2FtcGxlQ29kZSh0YXJnZXRSZWc6U2hhZGVyUmVnaXN0ZXJFbGVtZW50LCBzaGFyZWRSZWc6U2hhZGVyUmVnaXN0ZXJEYXRhLCBpbnB1dFJlZzpTaGFkZXJSZWdpc3RlckVsZW1lbnQsIHRleHR1cmU6VGV4dHVyZVByb3h5QmFzZSwgc21vb3RoOmJvb2xlYW4sIHJlcGVhdDpib29sZWFuLCBtaXBtYXBzOmJvb2xlYW4sIHV2UmVnOlNoYWRlclJlZ2lzdGVyRWxlbWVudCA9IG51bGwsIGZvcmNlV3JhcDpzdHJpbmcgPSBudWxsKTpzdHJpbmdcblx0e1xuXHRcdHZhciB3cmFwOnN0cmluZyA9IGZvcmNlV3JhcCB8fCAocmVwZWF0PyBcIndyYXBcIjpcImNsYW1wXCIpO1xuXHRcdHZhciBmb3JtYXQ6c3RyaW5nID0gU2hhZGVyQ29tcGlsZXJIZWxwZXIuZ2V0Rm9ybWF0U3RyaW5nRm9yVGV4dHVyZSh0ZXh0dXJlKTtcblx0XHR2YXIgZmlsdGVyOnN0cmluZyA9IChzbW9vdGgpPyAobWlwbWFwcz8gXCJsaW5lYXIsbWlwbGluZWFyXCIgOiBcImxpbmVhclwiKSA6IChtaXBtYXBzPyBcIm5lYXJlc3QsbWlwbmVhcmVzdFwiIDogXCJuZWFyZXN0XCIpO1xuXG5cdFx0aWYgKHV2UmVnID09IG51bGwpXG5cdFx0XHR1dlJlZyA9IHNoYXJlZFJlZy51dlZhcnlpbmc7XG5cblx0XHRyZXR1cm4gXCJ0ZXggXCIgKyB0YXJnZXRSZWcgKyBcIiwgXCIgKyB1dlJlZyArIFwiLCBcIiArIGlucHV0UmVnICsgXCIgPDJkLFwiICsgZmlsdGVyICsgXCIsXCIgKyBmb3JtYXQgKyB3cmFwICsgXCI+XFxuXCI7XG5cblx0fVxuXG5cblx0LyoqXG5cdCAqIEEgaGVscGVyIG1ldGhvZCB0aGF0IGdlbmVyYXRlcyBzdGFuZGFyZCBjb2RlIGZvciBzYW1wbGluZyBmcm9tIGEgY3ViZSB0ZXh0dXJlLlxuXHQgKiBAcGFyYW0gdm8gVGhlIE1ldGhvZFZPIG9iamVjdCBsaW5raW5nIHRoaXMgbWV0aG9kIHdpdGggdGhlIHBhc3MgY3VycmVudGx5IGJlaW5nIGNvbXBpbGVkLlxuXHQgKiBAcGFyYW0gdGFyZ2V0UmVnIFRoZSByZWdpc3RlciBpbiB3aGljaCB0byBzdG9yZSB0aGUgc2FtcGxlZCBjb2xvdXIuXG5cdCAqIEBwYXJhbSBpbnB1dFJlZyBUaGUgdGV4dHVyZSBzdHJlYW0gcmVnaXN0ZXIuXG5cdCAqIEBwYXJhbSB0ZXh0dXJlIFRoZSBjdWJlIG1hcCB3aGljaCB3aWxsIGJlIGFzc2lnbmVkIHRvIHRoZSBnaXZlbiBzbG90LlxuXHQgKiBAcGFyYW0gdXZSZWcgVGhlIGRpcmVjdGlvbiB2ZWN0b3Igd2l0aCB3aGljaCB0byBzYW1wbGUgdGhlIGN1YmUgbWFwLlxuXHQgKlxuXHQgKiBAcHJvdGVjdGVkXG5cdCAqL1xuXHRwdWJsaWMgc3RhdGljIGdldFRleEN1YmVTYW1wbGVDb2RlKHRhcmdldFJlZzpTaGFkZXJSZWdpc3RlckVsZW1lbnQsIGlucHV0UmVnOlNoYWRlclJlZ2lzdGVyRWxlbWVudCwgdGV4dHVyZTpUZXh0dXJlUHJveHlCYXNlLCBzbW9vdGg6Ym9vbGVhbiwgbWlwbWFwczpib29sZWFuLCB1dlJlZzpTaGFkZXJSZWdpc3RlckVsZW1lbnQpOnN0cmluZ1xuXHR7XG5cdFx0dmFyIGZpbHRlcjpzdHJpbmc7XG5cdFx0dmFyIGZvcm1hdDpzdHJpbmcgPSBTaGFkZXJDb21waWxlckhlbHBlci5nZXRGb3JtYXRTdHJpbmdGb3JUZXh0dXJlKHRleHR1cmUpO1xuXHRcdHZhciBmaWx0ZXI6c3RyaW5nID0gKHNtb290aCk/IChtaXBtYXBzPyBcImxpbmVhcixtaXBsaW5lYXJcIiA6IFwibGluZWFyXCIpIDogKG1pcG1hcHM/IFwibmVhcmVzdCxtaXBuZWFyZXN0XCIgOiBcIm5lYXJlc3RcIik7XG5cblx0XHRyZXR1cm4gXCJ0ZXggXCIgKyB0YXJnZXRSZWcgKyBcIiwgXCIgKyB1dlJlZyArIFwiLCBcIiArIGlucHV0UmVnICsgXCIgPGN1YmUsXCIgKyBmb3JtYXQgKyBmaWx0ZXIgKyBcIj5cXG5cIjtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZW5lcmF0ZXMgYSB0ZXh0dXJlIGZvcm1hdCBzdHJpbmcgZm9yIHRoZSBzYW1wbGUgaW5zdHJ1Y3Rpb24uXG5cdCAqIEBwYXJhbSB0ZXh0dXJlIFRoZSB0ZXh0dXJlIGZvciB3aGljaCB0byBnZXQgdGhlIGZvcm1hdCBzdHJpbmcuXG5cdCAqIEByZXR1cm5cblx0ICpcblx0ICogQHByb3RlY3RlZFxuXHQgKi9cblx0cHVibGljIHN0YXRpYyBnZXRGb3JtYXRTdHJpbmdGb3JUZXh0dXJlKHRleHR1cmU6VGV4dHVyZVByb3h5QmFzZSk6c3RyaW5nXG5cdHtcblx0XHRzd2l0Y2ggKHRleHR1cmUuZm9ybWF0KSB7XG5cdFx0XHRjYXNlIENvbnRleHRHTFRleHR1cmVGb3JtYXQuQ09NUFJFU1NFRDpcblx0XHRcdFx0cmV0dXJuIFwiZHh0MSxcIjtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIENvbnRleHRHTFRleHR1cmVGb3JtYXQuQ09NUFJFU1NFRF9BTFBIQTpcblx0XHRcdFx0cmV0dXJuIFwiZHh0NSxcIjtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRyZXR1cm4gXCJcIjtcblx0XHR9XG5cdH1cbn1cblxuZXhwb3J0ID0gU2hhZGVyQ29tcGlsZXJIZWxwZXI7Il19