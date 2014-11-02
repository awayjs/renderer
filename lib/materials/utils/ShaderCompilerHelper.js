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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvdXRpbHMvc2hhZGVyY29tcGlsZXJoZWxwZXIudHMiXSwibmFtZXMiOlsiU2hhZGVyQ29tcGlsZXJIZWxwZXIiLCJTaGFkZXJDb21waWxlckhlbHBlci5jb25zdHJ1Y3RvciIsIlNoYWRlckNvbXBpbGVySGVscGVyLmdldFRleDJEU2FtcGxlQ29kZSIsIlNoYWRlckNvbXBpbGVySGVscGVyLmdldFRleEN1YmVTYW1wbGVDb2RlIiwiU2hhZGVyQ29tcGlsZXJIZWxwZXIuZ2V0Rm9ybWF0U3RyaW5nRm9yVGV4dHVyZSJdLCJtYXBwaW5ncyI6IkFBRUEsSUFBTyxzQkFBc0IsV0FBWSxnREFBZ0QsQ0FBQyxDQUFDO0FBSzNGLElBQU0sb0JBQW9CO0lBQTFCQSxTQUFNQSxvQkFBb0JBO0lBcUUxQkMsQ0FBQ0E7SUFuRUFEOzs7Ozs7Ozs7OztPQVdHQTtJQUNXQSx1Q0FBa0JBLEdBQWhDQSxVQUFpQ0EsU0FBK0JBLEVBQUVBLFNBQTRCQSxFQUFFQSxRQUE4QkEsRUFBRUEsT0FBd0JBLEVBQUVBLE1BQWNBLEVBQUVBLE1BQWNBLEVBQUVBLE9BQWVBLEVBQUVBLEtBQWtDQSxFQUFFQSxTQUF1QkE7UUFBM0RFLHFCQUFrQ0EsR0FBbENBLFlBQWtDQTtRQUFFQSx5QkFBdUJBLEdBQXZCQSxnQkFBdUJBO1FBRXJRQSxJQUFJQSxJQUFJQSxHQUFVQSxTQUFTQSxJQUFJQSxDQUFDQSxNQUFNQSxHQUFFQSxNQUFNQSxHQUFDQSxPQUFPQSxDQUFDQSxDQUFDQTtRQUN4REEsSUFBSUEsTUFBTUEsR0FBVUEsb0JBQW9CQSxDQUFDQSx5QkFBeUJBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBO1FBQzVFQSxJQUFJQSxhQUFhQSxHQUFXQSxPQUFPQSxJQUFJQSxPQUFPQSxDQUFDQSxVQUFVQSxDQUFDQTtRQUMxREEsSUFBSUEsTUFBTUEsR0FBVUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsR0FBRUEsQ0FBQ0EsYUFBYUEsR0FBRUEsa0JBQWtCQSxHQUFHQSxRQUFRQSxDQUFDQSxHQUFHQSxDQUFDQSxhQUFhQSxHQUFFQSxvQkFBb0JBLEdBQUdBLFNBQVNBLENBQUNBLENBQUNBO1FBRWpJQSxFQUFFQSxDQUFDQSxDQUFDQSxLQUFLQSxJQUFJQSxJQUFJQSxDQUFDQTtZQUNqQkEsS0FBS0EsR0FBR0EsU0FBU0EsQ0FBQ0EsU0FBU0EsQ0FBQ0E7UUFFN0JBLE1BQU1BLENBQUNBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLElBQUlBLEdBQUdBLEtBQUtBLEdBQUdBLElBQUlBLEdBQUdBLFFBQVFBLEdBQUdBLE9BQU9BLEdBQUdBLE1BQU1BLEdBQUdBLEdBQUdBLEdBQUdBLE1BQU1BLEdBQUdBLElBQUlBLEdBQUdBLEtBQUtBLENBQUNBO0lBRTdHQSxDQUFDQTtJQUdERjs7Ozs7Ozs7O09BU0dBO0lBQ1dBLHlDQUFvQkEsR0FBbENBLFVBQW1DQSxTQUErQkEsRUFBRUEsUUFBOEJBLEVBQUVBLE9BQXdCQSxFQUFFQSxNQUFjQSxFQUFFQSxPQUFlQSxFQUFFQSxLQUEyQkE7UUFFekxHLElBQUlBLE1BQWFBLENBQUNBO1FBQ2xCQSxJQUFJQSxNQUFNQSxHQUFVQSxvQkFBb0JBLENBQUNBLHlCQUF5QkEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0E7UUFDNUVBLElBQUlBLGFBQWFBLEdBQVdBLE9BQU9BLElBQUlBLE9BQU9BLENBQUNBLFVBQVVBLENBQUNBO1FBQzFEQSxJQUFJQSxNQUFNQSxHQUFVQSxDQUFDQSxNQUFNQSxDQUFDQSxHQUFFQSxDQUFDQSxhQUFhQSxHQUFFQSxrQkFBa0JBLEdBQUdBLFFBQVFBLENBQUNBLEdBQUdBLENBQUNBLGFBQWFBLEdBQUVBLG9CQUFvQkEsR0FBR0EsU0FBU0EsQ0FBQ0EsQ0FBQ0E7UUFFaklBLE1BQU1BLENBQUNBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLElBQUlBLEdBQUdBLEtBQUtBLEdBQUdBLElBQUlBLEdBQUdBLFFBQVFBLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQUdBLE1BQU1BLEdBQUdBLEtBQUtBLENBQUNBO0lBQ2xHQSxDQUFDQTtJQUVESDs7Ozs7O09BTUdBO0lBQ1dBLDhDQUF5QkEsR0FBdkNBLFVBQXdDQSxPQUF3QkE7UUFFL0RJLE1BQU1BLENBQUNBLENBQUNBLE9BQU9BLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBO1lBQ3hCQSxLQUFLQSxzQkFBc0JBLENBQUNBLFVBQVVBO2dCQUNyQ0EsTUFBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0E7Z0JBQ2ZBLEtBQUtBLENBQUNBO1lBQ1BBLEtBQUtBLHNCQUFzQkEsQ0FBQ0EsZ0JBQWdCQTtnQkFDM0NBLE1BQU1BLENBQUNBLE9BQU9BLENBQUNBO2dCQUNmQSxLQUFLQSxDQUFDQTtZQUNQQTtnQkFDQ0EsTUFBTUEsQ0FBQ0EsRUFBRUEsQ0FBQ0E7UUFDWkEsQ0FBQ0E7SUFDRkEsQ0FBQ0E7SUFDRkosMkJBQUNBO0FBQURBLENBckVBLEFBcUVDQSxJQUFBO0FBRUQsQUFBOEIsaUJBQXJCLG9CQUFvQixDQUFDIiwiZmlsZSI6Im1hdGVyaWFscy91dGlscy9TaGFkZXJDb21waWxlckhlbHBlci5qcyIsInNvdXJjZVJvb3QiOiIuLi8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVGV4dHVyZVByb3h5QmFzZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL3RleHR1cmVzL1RleHR1cmVQcm94eUJhc2VcIik7XG5cbmltcG9ydCBDb250ZXh0R0xUZXh0dXJlRm9ybWF0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9iYXNlL0NvbnRleHRHTFRleHR1cmVGb3JtYXRcIik7XG5cbmltcG9ydCBTaGFkZXJSZWdpc3RlckRhdGFcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvbWF0ZXJpYWxzL2NvbXBpbGF0aW9uL1NoYWRlclJlZ2lzdGVyRGF0YVwiKTtcbmltcG9ydCBTaGFkZXJSZWdpc3RlckVsZW1lbnRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL21hdGVyaWFscy9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckVsZW1lbnRcIik7XG5cbmNsYXNzIFNoYWRlckNvbXBpbGVySGVscGVyXG57XG5cdC8qKlxuXHQgKiBBIGhlbHBlciBtZXRob2QgdGhhdCBnZW5lcmF0ZXMgc3RhbmRhcmQgY29kZSBmb3Igc2FtcGxpbmcgZnJvbSBhIHRleHR1cmUgdXNpbmcgdGhlIG5vcm1hbCB1diBjb29yZGluYXRlcy5cblx0ICogQHBhcmFtIHZvIFRoZSBNZXRob2RWTyBvYmplY3QgbGlua2luZyB0aGlzIG1ldGhvZCB3aXRoIHRoZSBwYXNzIGN1cnJlbnRseSBiZWluZyBjb21waWxlZC5cblx0ICogQHBhcmFtIHNoYXJlZFJlZyBUaGUgc2hhcmVkIHJlZ2lzdGVyIG9iamVjdCBmb3IgdGhlIHNoYWRlci5cblx0ICogQHBhcmFtIGlucHV0UmVnIFRoZSB0ZXh0dXJlIHN0cmVhbSByZWdpc3Rlci5cblx0ICogQHBhcmFtIHRleHR1cmUgVGhlIHRleHR1cmUgd2hpY2ggd2lsbCBiZSBhc3NpZ25lZCB0byB0aGUgZ2l2ZW4gc2xvdC5cblx0ICogQHBhcmFtIHV2UmVnIEFuIG9wdGlvbmFsIHV2IHJlZ2lzdGVyIGlmIGNvb3JkaW5hdGVzIGRpZmZlcmVudCBmcm9tIHRoZSBwcmltYXJ5IHV2IGNvb3JkaW5hdGVzIGFyZSB0byBiZSB1c2VkLlxuXHQgKiBAcGFyYW0gZm9yY2VXcmFwIElmIHRydWUsIHRleHR1cmUgd3JhcHBpbmcgaXMgZW5hYmxlZCByZWdhcmRsZXNzIG9mIHRoZSBtYXRlcmlhbCBzZXR0aW5nLlxuXHQgKiBAcmV0dXJuIFRoZSBmcmFnbWVudCBjb2RlIHRoYXQgcGVyZm9ybXMgdGhlIHNhbXBsaW5nLlxuXHQgKlxuXHQgKiBAcHJvdGVjdGVkXG5cdCAqL1xuXHRwdWJsaWMgc3RhdGljIGdldFRleDJEU2FtcGxlQ29kZSh0YXJnZXRSZWc6U2hhZGVyUmVnaXN0ZXJFbGVtZW50LCBzaGFyZWRSZWc6U2hhZGVyUmVnaXN0ZXJEYXRhLCBpbnB1dFJlZzpTaGFkZXJSZWdpc3RlckVsZW1lbnQsIHRleHR1cmU6VGV4dHVyZVByb3h5QmFzZSwgc21vb3RoOmJvb2xlYW4sIHJlcGVhdDpib29sZWFuLCBtaXBtYXBzOmJvb2xlYW4sIHV2UmVnOlNoYWRlclJlZ2lzdGVyRWxlbWVudCA9IG51bGwsIGZvcmNlV3JhcDpzdHJpbmcgPSBudWxsKTpzdHJpbmdcblx0e1xuXHRcdHZhciB3cmFwOnN0cmluZyA9IGZvcmNlV3JhcCB8fCAocmVwZWF0PyBcIndyYXBcIjpcImNsYW1wXCIpO1xuXHRcdHZhciBmb3JtYXQ6c3RyaW5nID0gU2hhZGVyQ29tcGlsZXJIZWxwZXIuZ2V0Rm9ybWF0U3RyaW5nRm9yVGV4dHVyZSh0ZXh0dXJlKTtcblx0XHR2YXIgZW5hYmxlTWlwTWFwczpib29sZWFuID0gbWlwbWFwcyAmJiB0ZXh0dXJlLmhhc01pcG1hcHM7XG5cdFx0dmFyIGZpbHRlcjpzdHJpbmcgPSAoc21vb3RoKT8gKGVuYWJsZU1pcE1hcHM/IFwibGluZWFyLG1pcGxpbmVhclwiIDogXCJsaW5lYXJcIikgOiAoZW5hYmxlTWlwTWFwcz8gXCJuZWFyZXN0LG1pcG5lYXJlc3RcIiA6IFwibmVhcmVzdFwiKTtcblxuXHRcdGlmICh1dlJlZyA9PSBudWxsKVxuXHRcdFx0dXZSZWcgPSBzaGFyZWRSZWcudXZWYXJ5aW5nO1xuXG5cdFx0cmV0dXJuIFwidGV4IFwiICsgdGFyZ2V0UmVnICsgXCIsIFwiICsgdXZSZWcgKyBcIiwgXCIgKyBpbnB1dFJlZyArIFwiIDwyZCxcIiArIGZpbHRlciArIFwiLFwiICsgZm9ybWF0ICsgd3JhcCArIFwiPlxcblwiO1xuXG5cdH1cblxuXG5cdC8qKlxuXHQgKiBBIGhlbHBlciBtZXRob2QgdGhhdCBnZW5lcmF0ZXMgc3RhbmRhcmQgY29kZSBmb3Igc2FtcGxpbmcgZnJvbSBhIGN1YmUgdGV4dHVyZS5cblx0ICogQHBhcmFtIHZvIFRoZSBNZXRob2RWTyBvYmplY3QgbGlua2luZyB0aGlzIG1ldGhvZCB3aXRoIHRoZSBwYXNzIGN1cnJlbnRseSBiZWluZyBjb21waWxlZC5cblx0ICogQHBhcmFtIHRhcmdldFJlZyBUaGUgcmVnaXN0ZXIgaW4gd2hpY2ggdG8gc3RvcmUgdGhlIHNhbXBsZWQgY29sb3VyLlxuXHQgKiBAcGFyYW0gaW5wdXRSZWcgVGhlIHRleHR1cmUgc3RyZWFtIHJlZ2lzdGVyLlxuXHQgKiBAcGFyYW0gdGV4dHVyZSBUaGUgY3ViZSBtYXAgd2hpY2ggd2lsbCBiZSBhc3NpZ25lZCB0byB0aGUgZ2l2ZW4gc2xvdC5cblx0ICogQHBhcmFtIHV2UmVnIFRoZSBkaXJlY3Rpb24gdmVjdG9yIHdpdGggd2hpY2ggdG8gc2FtcGxlIHRoZSBjdWJlIG1hcC5cblx0ICpcblx0ICogQHByb3RlY3RlZFxuXHQgKi9cblx0cHVibGljIHN0YXRpYyBnZXRUZXhDdWJlU2FtcGxlQ29kZSh0YXJnZXRSZWc6U2hhZGVyUmVnaXN0ZXJFbGVtZW50LCBpbnB1dFJlZzpTaGFkZXJSZWdpc3RlckVsZW1lbnQsIHRleHR1cmU6VGV4dHVyZVByb3h5QmFzZSwgc21vb3RoOmJvb2xlYW4sIG1pcG1hcHM6Ym9vbGVhbiwgdXZSZWc6U2hhZGVyUmVnaXN0ZXJFbGVtZW50KTpzdHJpbmdcblx0e1xuXHRcdHZhciBmaWx0ZXI6c3RyaW5nO1xuXHRcdHZhciBmb3JtYXQ6c3RyaW5nID0gU2hhZGVyQ29tcGlsZXJIZWxwZXIuZ2V0Rm9ybWF0U3RyaW5nRm9yVGV4dHVyZSh0ZXh0dXJlKTtcblx0XHR2YXIgZW5hYmxlTWlwTWFwczpib29sZWFuID0gbWlwbWFwcyAmJiB0ZXh0dXJlLmhhc01pcG1hcHM7XG5cdFx0dmFyIGZpbHRlcjpzdHJpbmcgPSAoc21vb3RoKT8gKGVuYWJsZU1pcE1hcHM/IFwibGluZWFyLG1pcGxpbmVhclwiIDogXCJsaW5lYXJcIikgOiAoZW5hYmxlTWlwTWFwcz8gXCJuZWFyZXN0LG1pcG5lYXJlc3RcIiA6IFwibmVhcmVzdFwiKTtcblxuXHRcdHJldHVybiBcInRleCBcIiArIHRhcmdldFJlZyArIFwiLCBcIiArIHV2UmVnICsgXCIsIFwiICsgaW5wdXRSZWcgKyBcIiA8Y3ViZSxcIiArIGZvcm1hdCArIGZpbHRlciArIFwiPlxcblwiO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdlbmVyYXRlcyBhIHRleHR1cmUgZm9ybWF0IHN0cmluZyBmb3IgdGhlIHNhbXBsZSBpbnN0cnVjdGlvbi5cblx0ICogQHBhcmFtIHRleHR1cmUgVGhlIHRleHR1cmUgZm9yIHdoaWNoIHRvIGdldCB0aGUgZm9ybWF0IHN0cmluZy5cblx0ICogQHJldHVyblxuXHQgKlxuXHQgKiBAcHJvdGVjdGVkXG5cdCAqL1xuXHRwdWJsaWMgc3RhdGljIGdldEZvcm1hdFN0cmluZ0ZvclRleHR1cmUodGV4dHVyZTpUZXh0dXJlUHJveHlCYXNlKTpzdHJpbmdcblx0e1xuXHRcdHN3aXRjaCAodGV4dHVyZS5mb3JtYXQpIHtcblx0XHRcdGNhc2UgQ29udGV4dEdMVGV4dHVyZUZvcm1hdC5DT01QUkVTU0VEOlxuXHRcdFx0XHRyZXR1cm4gXCJkeHQxLFwiO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgQ29udGV4dEdMVGV4dHVyZUZvcm1hdC5DT01QUkVTU0VEX0FMUEhBOlxuXHRcdFx0XHRyZXR1cm4gXCJkeHQ1LFwiO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdHJldHVybiBcIlwiO1xuXHRcdH1cblx0fVxufVxuXG5leHBvcnQgPSBTaGFkZXJDb21waWxlckhlbHBlcjsiXX0=