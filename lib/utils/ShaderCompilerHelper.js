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
        var enableMipMaps = mipmaps && texture.hasMipmaps;
        var filter = (smooth) ? (enableMipMaps ? "linear,miplinear" : "linear") : (enableMipMaps ? "nearest,mipnearest" : "nearest");
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
        var enableMipMaps = mipmaps && texture.hasMipmaps;
        var filter = (smooth) ? (enableMipMaps ? "linear,miplinear" : "linear") : (enableMipMaps ? "nearest,mipnearest" : "nearest");
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi91dGlscy9zaGFkZXJjb21waWxlcmhlbHBlci50cyJdLCJuYW1lcyI6WyJTaGFkZXJDb21waWxlckhlbHBlciIsIlNoYWRlckNvbXBpbGVySGVscGVyLmNvbnN0cnVjdG9yIiwiU2hhZGVyQ29tcGlsZXJIZWxwZXIuZ2V0VGV4MkRTYW1wbGVDb2RlIiwiU2hhZGVyQ29tcGlsZXJIZWxwZXIuZ2V0VGV4Q3ViZVNhbXBsZUNvZGUiLCJTaGFkZXJDb21waWxlckhlbHBlci5nZXRGb3JtYXRTdHJpbmdGb3JUZXh0dXJlIl0sIm1hcHBpbmdzIjoiQUFFQSxJQUFPLHNCQUFzQixXQUFZLGdEQUFnRCxDQUFDLENBQUM7QUFLM0YsSUFBTSxvQkFBb0I7SUFBMUJBLFNBQU1BLG9CQUFvQkE7SUFxRTFCQyxDQUFDQTtJQW5FQUQ7Ozs7Ozs7Ozs7O09BV0dBO0lBQ1dBLHVDQUFrQkEsR0FBaENBLFVBQWlDQSxTQUErQkEsRUFBRUEsU0FBNEJBLEVBQUVBLFFBQThCQSxFQUFFQSxPQUF3QkEsRUFBRUEsTUFBY0EsRUFBRUEsTUFBY0EsRUFBRUEsT0FBZUEsRUFBRUEsS0FBa0NBLEVBQUVBLFNBQXVCQTtRQUEzREUscUJBQWtDQSxHQUFsQ0EsWUFBa0NBO1FBQUVBLHlCQUF1QkEsR0FBdkJBLGdCQUF1QkE7UUFFclFBLElBQUlBLElBQUlBLEdBQVVBLFNBQVNBLElBQUlBLENBQUNBLE1BQU1BLEdBQUVBLE1BQU1BLEdBQUNBLE9BQU9BLENBQUNBLENBQUNBO1FBQ3hEQSxJQUFJQSxNQUFNQSxHQUFVQSxvQkFBb0JBLENBQUNBLHlCQUF5QkEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0E7UUFDNUVBLElBQUlBLGFBQWFBLEdBQVdBLE9BQU9BLElBQUlBLE9BQU9BLENBQUNBLFVBQVVBLENBQUNBO1FBQzFEQSxJQUFJQSxNQUFNQSxHQUFVQSxDQUFDQSxNQUFNQSxDQUFDQSxHQUFFQSxDQUFDQSxhQUFhQSxHQUFFQSxrQkFBa0JBLEdBQUdBLFFBQVFBLENBQUNBLEdBQUdBLENBQUNBLGFBQWFBLEdBQUVBLG9CQUFvQkEsR0FBR0EsU0FBU0EsQ0FBQ0EsQ0FBQ0E7UUFFaklBLEVBQUVBLENBQUNBLENBQUNBLEtBQUtBLElBQUlBLElBQUlBLENBQUNBO1lBQ2pCQSxLQUFLQSxHQUFHQSxTQUFTQSxDQUFDQSxTQUFTQSxDQUFDQTtRQUU3QkEsTUFBTUEsQ0FBQ0EsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsSUFBSUEsR0FBR0EsS0FBS0EsR0FBR0EsSUFBSUEsR0FBR0EsUUFBUUEsR0FBR0EsT0FBT0EsR0FBR0EsTUFBTUEsR0FBR0EsR0FBR0EsR0FBR0EsTUFBTUEsR0FBR0EsSUFBSUEsR0FBR0EsS0FBS0EsQ0FBQ0E7SUFFN0dBLENBQUNBO0lBR0RGOzs7Ozs7Ozs7T0FTR0E7SUFDV0EseUNBQW9CQSxHQUFsQ0EsVUFBbUNBLFNBQStCQSxFQUFFQSxRQUE4QkEsRUFBRUEsT0FBd0JBLEVBQUVBLE1BQWNBLEVBQUVBLE9BQWVBLEVBQUVBLEtBQTJCQTtRQUV6TEcsSUFBSUEsTUFBYUEsQ0FBQ0E7UUFDbEJBLElBQUlBLE1BQU1BLEdBQVVBLG9CQUFvQkEsQ0FBQ0EseUJBQXlCQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQTtRQUM1RUEsSUFBSUEsYUFBYUEsR0FBV0EsT0FBT0EsSUFBSUEsT0FBT0EsQ0FBQ0EsVUFBVUEsQ0FBQ0E7UUFDMURBLElBQUlBLE1BQU1BLEdBQVVBLENBQUNBLE1BQU1BLENBQUNBLEdBQUVBLENBQUNBLGFBQWFBLEdBQUVBLGtCQUFrQkEsR0FBR0EsUUFBUUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsYUFBYUEsR0FBRUEsb0JBQW9CQSxHQUFHQSxTQUFTQSxDQUFDQSxDQUFDQTtRQUVqSUEsTUFBTUEsQ0FBQ0EsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsSUFBSUEsR0FBR0EsS0FBS0EsR0FBR0EsSUFBSUEsR0FBR0EsUUFBUUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FBR0EsTUFBTUEsR0FBR0EsS0FBS0EsQ0FBQ0E7SUFDbEdBLENBQUNBO0lBRURIOzs7Ozs7T0FNR0E7SUFDV0EsOENBQXlCQSxHQUF2Q0EsVUFBd0NBLE9BQXdCQTtRQUUvREksTUFBTUEsQ0FBQ0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDeEJBLEtBQUtBLHNCQUFzQkEsQ0FBQ0EsVUFBVUE7Z0JBQ3JDQSxNQUFNQSxDQUFDQSxPQUFPQSxDQUFDQTtnQkFDZkEsS0FBS0EsQ0FBQ0E7WUFDUEEsS0FBS0Esc0JBQXNCQSxDQUFDQSxnQkFBZ0JBO2dCQUMzQ0EsTUFBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0E7Z0JBQ2ZBLEtBQUtBLENBQUNBO1lBQ1BBO2dCQUNDQSxNQUFNQSxDQUFDQSxFQUFFQSxDQUFDQTtRQUNaQSxDQUFDQTtJQUNGQSxDQUFDQTtJQUNGSiwyQkFBQ0E7QUFBREEsQ0FyRUEsQUFxRUNBLElBQUE7QUFFRCxBQUE4QixpQkFBckIsb0JBQW9CLENBQUMiLCJmaWxlIjoidXRpbHMvU2hhZGVyQ29tcGlsZXJIZWxwZXIuanMiLCJzb3VyY2VSb290IjoiLi4vIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFRleHR1cmVQcm94eUJhc2VcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi90ZXh0dXJlcy9UZXh0dXJlUHJveHlCYXNlXCIpO1xuXG5pbXBvcnQgQ29udGV4dEdMVGV4dHVyZUZvcm1hdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvYmFzZS9Db250ZXh0R0xUZXh0dXJlRm9ybWF0XCIpO1xuXG5pbXBvcnQgU2hhZGVyUmVnaXN0ZXJEYXRhXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2NvbXBpbGF0aW9uL1NoYWRlclJlZ2lzdGVyRGF0YVwiKTtcbmltcG9ydCBTaGFkZXJSZWdpc3RlckVsZW1lbnRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2NvbXBpbGF0aW9uL1NoYWRlclJlZ2lzdGVyRWxlbWVudFwiKTtcblxuY2xhc3MgU2hhZGVyQ29tcGlsZXJIZWxwZXJcbntcblx0LyoqXG5cdCAqIEEgaGVscGVyIG1ldGhvZCB0aGF0IGdlbmVyYXRlcyBzdGFuZGFyZCBjb2RlIGZvciBzYW1wbGluZyBmcm9tIGEgdGV4dHVyZSB1c2luZyB0aGUgbm9ybWFsIHV2IGNvb3JkaW5hdGVzLlxuXHQgKiBAcGFyYW0gdm8gVGhlIE1ldGhvZFZPIG9iamVjdCBsaW5raW5nIHRoaXMgbWV0aG9kIHdpdGggdGhlIHBhc3MgY3VycmVudGx5IGJlaW5nIGNvbXBpbGVkLlxuXHQgKiBAcGFyYW0gc2hhcmVkUmVnIFRoZSBzaGFyZWQgcmVnaXN0ZXIgb2JqZWN0IGZvciB0aGUgc2hhZGVyLlxuXHQgKiBAcGFyYW0gaW5wdXRSZWcgVGhlIHRleHR1cmUgc3RyZWFtIHJlZ2lzdGVyLlxuXHQgKiBAcGFyYW0gdGV4dHVyZSBUaGUgdGV4dHVyZSB3aGljaCB3aWxsIGJlIGFzc2lnbmVkIHRvIHRoZSBnaXZlbiBzbG90LlxuXHQgKiBAcGFyYW0gdXZSZWcgQW4gb3B0aW9uYWwgdXYgcmVnaXN0ZXIgaWYgY29vcmRpbmF0ZXMgZGlmZmVyZW50IGZyb20gdGhlIHByaW1hcnkgdXYgY29vcmRpbmF0ZXMgYXJlIHRvIGJlIHVzZWQuXG5cdCAqIEBwYXJhbSBmb3JjZVdyYXAgSWYgdHJ1ZSwgdGV4dHVyZSB3cmFwcGluZyBpcyBlbmFibGVkIHJlZ2FyZGxlc3Mgb2YgdGhlIG1hdGVyaWFsIHNldHRpbmcuXG5cdCAqIEByZXR1cm4gVGhlIGZyYWdtZW50IGNvZGUgdGhhdCBwZXJmb3JtcyB0aGUgc2FtcGxpbmcuXG5cdCAqXG5cdCAqIEBwcm90ZWN0ZWRcblx0ICovXG5cdHB1YmxpYyBzdGF0aWMgZ2V0VGV4MkRTYW1wbGVDb2RlKHRhcmdldFJlZzpTaGFkZXJSZWdpc3RlckVsZW1lbnQsIHNoYXJlZFJlZzpTaGFkZXJSZWdpc3RlckRhdGEsIGlucHV0UmVnOlNoYWRlclJlZ2lzdGVyRWxlbWVudCwgdGV4dHVyZTpUZXh0dXJlUHJveHlCYXNlLCBzbW9vdGg6Ym9vbGVhbiwgcmVwZWF0OmJvb2xlYW4sIG1pcG1hcHM6Ym9vbGVhbiwgdXZSZWc6U2hhZGVyUmVnaXN0ZXJFbGVtZW50ID0gbnVsbCwgZm9yY2VXcmFwOnN0cmluZyA9IG51bGwpOnN0cmluZ1xuXHR7XG5cdFx0dmFyIHdyYXA6c3RyaW5nID0gZm9yY2VXcmFwIHx8IChyZXBlYXQ/IFwid3JhcFwiOlwiY2xhbXBcIik7XG5cdFx0dmFyIGZvcm1hdDpzdHJpbmcgPSBTaGFkZXJDb21waWxlckhlbHBlci5nZXRGb3JtYXRTdHJpbmdGb3JUZXh0dXJlKHRleHR1cmUpO1xuXHRcdHZhciBlbmFibGVNaXBNYXBzOmJvb2xlYW4gPSBtaXBtYXBzICYmIHRleHR1cmUuaGFzTWlwbWFwcztcblx0XHR2YXIgZmlsdGVyOnN0cmluZyA9IChzbW9vdGgpPyAoZW5hYmxlTWlwTWFwcz8gXCJsaW5lYXIsbWlwbGluZWFyXCIgOiBcImxpbmVhclwiKSA6IChlbmFibGVNaXBNYXBzPyBcIm5lYXJlc3QsbWlwbmVhcmVzdFwiIDogXCJuZWFyZXN0XCIpO1xuXG5cdFx0aWYgKHV2UmVnID09IG51bGwpXG5cdFx0XHR1dlJlZyA9IHNoYXJlZFJlZy51dlZhcnlpbmc7XG5cblx0XHRyZXR1cm4gXCJ0ZXggXCIgKyB0YXJnZXRSZWcgKyBcIiwgXCIgKyB1dlJlZyArIFwiLCBcIiArIGlucHV0UmVnICsgXCIgPDJkLFwiICsgZmlsdGVyICsgXCIsXCIgKyBmb3JtYXQgKyB3cmFwICsgXCI+XFxuXCI7XG5cblx0fVxuXG5cblx0LyoqXG5cdCAqIEEgaGVscGVyIG1ldGhvZCB0aGF0IGdlbmVyYXRlcyBzdGFuZGFyZCBjb2RlIGZvciBzYW1wbGluZyBmcm9tIGEgY3ViZSB0ZXh0dXJlLlxuXHQgKiBAcGFyYW0gdm8gVGhlIE1ldGhvZFZPIG9iamVjdCBsaW5raW5nIHRoaXMgbWV0aG9kIHdpdGggdGhlIHBhc3MgY3VycmVudGx5IGJlaW5nIGNvbXBpbGVkLlxuXHQgKiBAcGFyYW0gdGFyZ2V0UmVnIFRoZSByZWdpc3RlciBpbiB3aGljaCB0byBzdG9yZSB0aGUgc2FtcGxlZCBjb2xvdXIuXG5cdCAqIEBwYXJhbSBpbnB1dFJlZyBUaGUgdGV4dHVyZSBzdHJlYW0gcmVnaXN0ZXIuXG5cdCAqIEBwYXJhbSB0ZXh0dXJlIFRoZSBjdWJlIG1hcCB3aGljaCB3aWxsIGJlIGFzc2lnbmVkIHRvIHRoZSBnaXZlbiBzbG90LlxuXHQgKiBAcGFyYW0gdXZSZWcgVGhlIGRpcmVjdGlvbiB2ZWN0b3Igd2l0aCB3aGljaCB0byBzYW1wbGUgdGhlIGN1YmUgbWFwLlxuXHQgKlxuXHQgKiBAcHJvdGVjdGVkXG5cdCAqL1xuXHRwdWJsaWMgc3RhdGljIGdldFRleEN1YmVTYW1wbGVDb2RlKHRhcmdldFJlZzpTaGFkZXJSZWdpc3RlckVsZW1lbnQsIGlucHV0UmVnOlNoYWRlclJlZ2lzdGVyRWxlbWVudCwgdGV4dHVyZTpUZXh0dXJlUHJveHlCYXNlLCBzbW9vdGg6Ym9vbGVhbiwgbWlwbWFwczpib29sZWFuLCB1dlJlZzpTaGFkZXJSZWdpc3RlckVsZW1lbnQpOnN0cmluZ1xuXHR7XG5cdFx0dmFyIGZpbHRlcjpzdHJpbmc7XG5cdFx0dmFyIGZvcm1hdDpzdHJpbmcgPSBTaGFkZXJDb21waWxlckhlbHBlci5nZXRGb3JtYXRTdHJpbmdGb3JUZXh0dXJlKHRleHR1cmUpO1xuXHRcdHZhciBlbmFibGVNaXBNYXBzOmJvb2xlYW4gPSBtaXBtYXBzICYmIHRleHR1cmUuaGFzTWlwbWFwcztcblx0XHR2YXIgZmlsdGVyOnN0cmluZyA9IChzbW9vdGgpPyAoZW5hYmxlTWlwTWFwcz8gXCJsaW5lYXIsbWlwbGluZWFyXCIgOiBcImxpbmVhclwiKSA6IChlbmFibGVNaXBNYXBzPyBcIm5lYXJlc3QsbWlwbmVhcmVzdFwiIDogXCJuZWFyZXN0XCIpO1xuXG5cdFx0cmV0dXJuIFwidGV4IFwiICsgdGFyZ2V0UmVnICsgXCIsIFwiICsgdXZSZWcgKyBcIiwgXCIgKyBpbnB1dFJlZyArIFwiIDxjdWJlLFwiICsgZm9ybWF0ICsgZmlsdGVyICsgXCI+XFxuXCI7XG5cdH1cblxuXHQvKipcblx0ICogR2VuZXJhdGVzIGEgdGV4dHVyZSBmb3JtYXQgc3RyaW5nIGZvciB0aGUgc2FtcGxlIGluc3RydWN0aW9uLlxuXHQgKiBAcGFyYW0gdGV4dHVyZSBUaGUgdGV4dHVyZSBmb3Igd2hpY2ggdG8gZ2V0IHRoZSBmb3JtYXQgc3RyaW5nLlxuXHQgKiBAcmV0dXJuXG5cdCAqXG5cdCAqIEBwcm90ZWN0ZWRcblx0ICovXG5cdHB1YmxpYyBzdGF0aWMgZ2V0Rm9ybWF0U3RyaW5nRm9yVGV4dHVyZSh0ZXh0dXJlOlRleHR1cmVQcm94eUJhc2UpOnN0cmluZ1xuXHR7XG5cdFx0c3dpdGNoICh0ZXh0dXJlLmZvcm1hdCkge1xuXHRcdFx0Y2FzZSBDb250ZXh0R0xUZXh0dXJlRm9ybWF0LkNPTVBSRVNTRUQ6XG5cdFx0XHRcdHJldHVybiBcImR4dDEsXCI7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBDb250ZXh0R0xUZXh0dXJlRm9ybWF0LkNPTVBSRVNTRURfQUxQSEE6XG5cdFx0XHRcdHJldHVybiBcImR4dDUsXCI7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0cmV0dXJuIFwiXCI7XG5cdFx0fVxuXHR9XG59XG5cbmV4cG9ydCA9IFNoYWRlckNvbXBpbGVySGVscGVyOyJdfQ==