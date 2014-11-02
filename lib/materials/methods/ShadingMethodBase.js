var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var NamedAssetBase = require("awayjs-core/lib/library/NamedAssetBase");
var ShadingMethodEvent = require("awayjs-renderergl/lib/events/ShadingMethodEvent");
/**
 * ShadingMethodBase provides an abstract base method for shading methods, used by compiled passes to compile
 * the final shading program.
 */
var ShadingMethodBase = (function (_super) {
    __extends(ShadingMethodBase, _super);
    /**
     * Create a new ShadingMethodBase object.
     */
    function ShadingMethodBase() {
        _super.call(this);
    }
    ShadingMethodBase.prototype.iIsUsed = function (shaderObject) {
        return true;
    };
    /**
     * Initializes the properties for a MethodVO, including register and texture indices.
     *
     * @param methodVO The MethodVO object linking this method with the pass currently being compiled.
     *
     * @internal
     */
    ShadingMethodBase.prototype.iInitVO = function (shaderObject, methodVO) {
    };
    /**
     * Initializes unchanging shader constants using the data from a MethodVO.
     *
     * @param methodVO The MethodVO object linking this method with the pass currently being compiled.
     *
     * @internal
     */
    ShadingMethodBase.prototype.iInitConstants = function (shaderObject, methodVO) {
    };
    /**
     * Indicates whether or not this method expects normals in tangent space. Override for object-space normals.
     */
    ShadingMethodBase.prototype.iUsesTangentSpace = function () {
        return true;
    };
    Object.defineProperty(ShadingMethodBase.prototype, "passes", {
        /**
         * Any passes required that render to a texture used by this method.
         */
        get: function () {
            return this._passes;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Cleans up any resources used by the current object.
     */
    ShadingMethodBase.prototype.dispose = function () {
    };
    /**
     * Resets the compilation state of the method.
     *
     * @internal
     */
    ShadingMethodBase.prototype.iReset = function () {
        this.iCleanCompilationData();
    };
    /**
     * Resets the method's state for compilation.
     *
     * @internal
     */
    ShadingMethodBase.prototype.iCleanCompilationData = function () {
    };
    /**
     * Get the vertex shader code for this method.
     * @param vo The MethodVO object linking this method with the pass currently being compiled.
     * @param regCache The register cache used during the compilation.
     *
     * @internal
     */
    ShadingMethodBase.prototype.iGetVertexCode = function (shaderObject, methodVO, registerCache, sharedRegisters) {
        return "";
    };
    /**
     * @inheritDoc
     */
    ShadingMethodBase.prototype.iGetFragmentCode = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
        return null;
    };
    /**
     * Sets the render state for this method.
     *
     * @param methodVO The MethodVO object linking this method with the pass currently being compiled.
     * @param stage The Stage object currently used for rendering.
     *
     * @internal
     */
    ShadingMethodBase.prototype.iActivate = function (shaderObject, methodVO, stage) {
    };
    /**
     * Sets the render state for a single renderable.
     *
     * @param vo The MethodVO object linking this method with the pass currently being compiled.
     * @param renderable The renderable currently being rendered.
     * @param stage The Stage object currently used for rendering.
     * @param camera The camera from which the scene is currently rendered.
     *
     * @internal
     */
    ShadingMethodBase.prototype.iSetRenderState = function (shaderObject, methodVO, renderable, stage, camera) {
    };
    /**
     * Clears the render state for this method.
     * @param vo The MethodVO object linking this method with the pass currently being compiled.
     * @param stage The Stage object currently used for rendering.
     *
     * @internal
     */
    ShadingMethodBase.prototype.iDeactivate = function (shaderObject, methodVO, stage) {
    };
    /**
     * Marks the shader program as invalid, so it will be recompiled before the next render.
     *
     * @internal
     */
    ShadingMethodBase.prototype.iInvalidateShaderProgram = function () {
        this.dispatchEvent(new ShadingMethodEvent(ShadingMethodEvent.SHADER_INVALIDATED));
    };
    /**
     * Copies the state from a ShadingMethodBase object into the current object.
     */
    ShadingMethodBase.prototype.copyFrom = function (method) {
    };
    return ShadingMethodBase;
})(NamedAssetBase);
module.exports = ShadingMethodBase;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvbWV0aG9kcy9zaGFkaW5nbWV0aG9kYmFzZS50cyJdLCJuYW1lcyI6WyJTaGFkaW5nTWV0aG9kQmFzZSIsIlNoYWRpbmdNZXRob2RCYXNlLmNvbnN0cnVjdG9yIiwiU2hhZGluZ01ldGhvZEJhc2UuaUlzVXNlZCIsIlNoYWRpbmdNZXRob2RCYXNlLmlJbml0Vk8iLCJTaGFkaW5nTWV0aG9kQmFzZS5pSW5pdENvbnN0YW50cyIsIlNoYWRpbmdNZXRob2RCYXNlLmlVc2VzVGFuZ2VudFNwYWNlIiwiU2hhZGluZ01ldGhvZEJhc2UucGFzc2VzIiwiU2hhZGluZ01ldGhvZEJhc2UuZGlzcG9zZSIsIlNoYWRpbmdNZXRob2RCYXNlLmlSZXNldCIsIlNoYWRpbmdNZXRob2RCYXNlLmlDbGVhbkNvbXBpbGF0aW9uRGF0YSIsIlNoYWRpbmdNZXRob2RCYXNlLmlHZXRWZXJ0ZXhDb2RlIiwiU2hhZGluZ01ldGhvZEJhc2UuaUdldEZyYWdtZW50Q29kZSIsIlNoYWRpbmdNZXRob2RCYXNlLmlBY3RpdmF0ZSIsIlNoYWRpbmdNZXRob2RCYXNlLmlTZXRSZW5kZXJTdGF0ZSIsIlNoYWRpbmdNZXRob2RCYXNlLmlEZWFjdGl2YXRlIiwiU2hhZGluZ01ldGhvZEJhc2UuaUludmFsaWRhdGVTaGFkZXJQcm9ncmFtIiwiU2hhZGluZ01ldGhvZEJhc2UuY29weUZyb20iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQU8sY0FBYyxXQUFjLHdDQUF3QyxDQUFDLENBQUM7QUFPN0UsSUFBTyxrQkFBa0IsV0FBYSxpREFBaUQsQ0FBQyxDQUFDO0FBU3pGLEFBSUE7OztHQURHO0lBQ0csaUJBQWlCO0lBQVNBLFVBQTFCQSxpQkFBaUJBLFVBQXVCQTtJQUk3Q0E7O09BRUdBO0lBQ0hBLFNBUEtBLGlCQUFpQkE7UUFTckJDLGlCQUFPQSxDQUFDQTtJQUNUQSxDQUFDQTtJQUVNRCxtQ0FBT0EsR0FBZEEsVUFBZUEsWUFBNkJBO1FBRTNDRSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQTtJQUNiQSxDQUFDQTtJQUVERjs7Ozs7O09BTUdBO0lBQ0lBLG1DQUFPQSxHQUFkQSxVQUFlQSxZQUE2QkEsRUFBRUEsUUFBaUJBO0lBRy9ERyxDQUFDQTtJQUVESDs7Ozs7O09BTUdBO0lBQ0lBLDBDQUFjQSxHQUFyQkEsVUFBc0JBLFlBQTZCQSxFQUFFQSxRQUFpQkE7SUFJdEVJLENBQUNBO0lBRURKOztPQUVHQTtJQUNJQSw2Q0FBaUJBLEdBQXhCQTtRQUVDSyxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQTtJQUNiQSxDQUFDQTtJQUtETCxzQkFBV0EscUNBQU1BO1FBSGpCQTs7V0FFR0E7YUFDSEE7WUFFQ00sTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0E7UUFDckJBLENBQUNBOzs7T0FBQU47SUFFREE7O09BRUdBO0lBQ0lBLG1DQUFPQSxHQUFkQTtJQUdBTyxDQUFDQTtJQUVEUDs7OztPQUlHQTtJQUNJQSxrQ0FBTUEsR0FBYkE7UUFFQ1EsSUFBSUEsQ0FBQ0EscUJBQXFCQSxFQUFFQSxDQUFDQTtJQUM5QkEsQ0FBQ0E7SUFFRFI7Ozs7T0FJR0E7SUFDSUEsaURBQXFCQSxHQUE1QkE7SUFFQVMsQ0FBQ0E7SUFFRFQ7Ozs7OztPQU1HQTtJQUNJQSwwQ0FBY0EsR0FBckJBLFVBQXNCQSxZQUE2QkEsRUFBRUEsUUFBaUJBLEVBQUVBLGFBQWlDQSxFQUFFQSxlQUFrQ0E7UUFFNUlVLE1BQU1BLENBQUNBLEVBQUVBLENBQUNBO0lBQ1hBLENBQUNBO0lBRURWOztPQUVHQTtJQUNJQSw0Q0FBZ0JBLEdBQXZCQSxVQUF3QkEsWUFBNkJBLEVBQUVBLFFBQWlCQSxFQUFFQSxTQUErQkEsRUFBRUEsYUFBaUNBLEVBQUVBLGVBQWtDQTtRQUUvS1csTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7SUFDYkEsQ0FBQ0E7SUFFRFg7Ozs7Ozs7T0FPR0E7SUFDSUEscUNBQVNBLEdBQWhCQSxVQUFpQkEsWUFBNkJBLEVBQUVBLFFBQWlCQSxFQUFFQSxLQUFXQTtJQUc5RVksQ0FBQ0E7SUFFRFo7Ozs7Ozs7OztPQVNHQTtJQUNJQSwyQ0FBZUEsR0FBdEJBLFVBQXVCQSxZQUE2QkEsRUFBRUEsUUFBaUJBLEVBQUVBLFVBQXlCQSxFQUFFQSxLQUFXQSxFQUFFQSxNQUFhQTtJQUc5SGEsQ0FBQ0E7SUFFRGI7Ozs7OztPQU1HQTtJQUNJQSx1Q0FBV0EsR0FBbEJBLFVBQW1CQSxZQUE2QkEsRUFBRUEsUUFBaUJBLEVBQUVBLEtBQVdBO0lBR2hGYyxDQUFDQTtJQUVEZDs7OztPQUlHQTtJQUNJQSxvREFBd0JBLEdBQS9CQTtRQUVDZSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQSxJQUFJQSxrQkFBa0JBLENBQUNBLGtCQUFrQkEsQ0FBQ0Esa0JBQWtCQSxDQUFDQSxDQUFDQSxDQUFDQTtJQUNuRkEsQ0FBQ0E7SUFFRGY7O09BRUdBO0lBQ0lBLG9DQUFRQSxHQUFmQSxVQUFnQkEsTUFBd0JBO0lBRXhDZ0IsQ0FBQ0E7SUFDRmhCLHdCQUFDQTtBQUFEQSxDQWpLQSxBQWlLQ0EsRUFqSytCLGNBQWMsRUFpSzdDO0FBRUQsQUFBMkIsaUJBQWxCLGlCQUFpQixDQUFDIiwiZmlsZSI6Im1hdGVyaWFscy9tZXRob2RzL1NoYWRpbmdNZXRob2RCYXNlLmpzIiwic291cmNlUm9vdCI6Ii4uLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBOYW1lZEFzc2V0QmFzZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2xpYnJhcnkvTmFtZWRBc3NldEJhc2VcIik7XG5cbmltcG9ydCBDYW1lcmFcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvZW50aXRpZXMvQ2FtZXJhXCIpO1xuXG5pbXBvcnQgU3RhZ2VcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvYmFzZS9TdGFnZVwiKTtcblxuaW1wb3J0IFJlbmRlcmFibGVCYXNlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvcG9vbC9SZW5kZXJhYmxlQmFzZVwiKTtcbmltcG9ydCBTaGFkaW5nTWV0aG9kRXZlbnRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvZXZlbnRzL1NoYWRpbmdNZXRob2RFdmVudFwiKTtcbmltcG9ydCBNZXRob2RWT1x0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvY29tcGlsYXRpb24vTWV0aG9kVk9cIik7XG5pbXBvcnQgU2hhZGVyT2JqZWN0QmFzZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL21hdGVyaWFscy9jb21waWxhdGlvbi9TaGFkZXJPYmplY3RCYXNlXCIpO1xuaW1wb3J0IFNoYWRlclJlZ2lzdGVyQ2FjaGVcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvbWF0ZXJpYWxzL2NvbXBpbGF0aW9uL1NoYWRlclJlZ2lzdGVyQ2FjaGVcIik7XG5pbXBvcnQgU2hhZGVyUmVnaXN0ZXJEYXRhXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL21hdGVyaWFscy9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckRhdGFcIik7XG5pbXBvcnQgU2hhZGVyUmVnaXN0ZXJFbGVtZW50XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJFbGVtZW50XCIpO1xuaW1wb3J0IE1hdGVyaWFsUGFzc0Jhc2VcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvcGFzc2VzL01hdGVyaWFsUGFzc0Jhc2VcIik7XG5cblxuLyoqXG4gKiBTaGFkaW5nTWV0aG9kQmFzZSBwcm92aWRlcyBhbiBhYnN0cmFjdCBiYXNlIG1ldGhvZCBmb3Igc2hhZGluZyBtZXRob2RzLCB1c2VkIGJ5IGNvbXBpbGVkIHBhc3NlcyB0byBjb21waWxlXG4gKiB0aGUgZmluYWwgc2hhZGluZyBwcm9ncmFtLlxuICovXG5jbGFzcyBTaGFkaW5nTWV0aG9kQmFzZSBleHRlbmRzIE5hbWVkQXNzZXRCYXNlXG57XG5cdHB1YmxpYyBfcGFzc2VzOkFycmF5PE1hdGVyaWFsUGFzc0Jhc2U+OyAvLyBzaG91bGQgYmUgcHJvdGVjdGVkXG5cblx0LyoqXG5cdCAqIENyZWF0ZSBhIG5ldyBTaGFkaW5nTWV0aG9kQmFzZSBvYmplY3QuXG5cdCAqL1xuXHRjb25zdHJ1Y3RvcigpXG5cdHtcblx0XHRzdXBlcigpO1xuXHR9XG5cblx0cHVibGljIGlJc1VzZWQoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UpOmJvb2xlYW5cblx0e1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIEluaXRpYWxpemVzIHRoZSBwcm9wZXJ0aWVzIGZvciBhIE1ldGhvZFZPLCBpbmNsdWRpbmcgcmVnaXN0ZXIgYW5kIHRleHR1cmUgaW5kaWNlcy5cblx0ICpcblx0ICogQHBhcmFtIG1ldGhvZFZPIFRoZSBNZXRob2RWTyBvYmplY3QgbGlua2luZyB0aGlzIG1ldGhvZCB3aXRoIHRoZSBwYXNzIGN1cnJlbnRseSBiZWluZyBjb21waWxlZC5cblx0ICpcblx0ICogQGludGVybmFsXG5cdCAqL1xuXHRwdWJsaWMgaUluaXRWTyhzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgbWV0aG9kVk86TWV0aG9kVk8pXG5cdHtcblxuXHR9XG5cblx0LyoqXG5cdCAqIEluaXRpYWxpemVzIHVuY2hhbmdpbmcgc2hhZGVyIGNvbnN0YW50cyB1c2luZyB0aGUgZGF0YSBmcm9tIGEgTWV0aG9kVk8uXG5cdCAqXG5cdCAqIEBwYXJhbSBtZXRob2RWTyBUaGUgTWV0aG9kVk8gb2JqZWN0IGxpbmtpbmcgdGhpcyBtZXRob2Qgd2l0aCB0aGUgcGFzcyBjdXJyZW50bHkgYmVpbmcgY29tcGlsZWQuXG5cdCAqXG5cdCAqIEBpbnRlcm5hbFxuXHQgKi9cblx0cHVibGljIGlJbml0Q29uc3RhbnRzKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCBtZXRob2RWTzpNZXRob2RWTylcblx0e1xuXG5cblx0fVxuXG5cdC8qKlxuXHQgKiBJbmRpY2F0ZXMgd2hldGhlciBvciBub3QgdGhpcyBtZXRob2QgZXhwZWN0cyBub3JtYWxzIGluIHRhbmdlbnQgc3BhY2UuIE92ZXJyaWRlIGZvciBvYmplY3Qtc3BhY2Ugbm9ybWFscy5cblx0ICovXG5cdHB1YmxpYyBpVXNlc1RhbmdlbnRTcGFjZSgpOmJvb2xlYW5cblx0e1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIEFueSBwYXNzZXMgcmVxdWlyZWQgdGhhdCByZW5kZXIgdG8gYSB0ZXh0dXJlIHVzZWQgYnkgdGhpcyBtZXRob2QuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IHBhc3NlcygpOkFycmF5PE1hdGVyaWFsUGFzc0Jhc2U+XG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fcGFzc2VzO1xuXHR9XG5cblx0LyoqXG5cdCAqIENsZWFucyB1cCBhbnkgcmVzb3VyY2VzIHVzZWQgYnkgdGhlIGN1cnJlbnQgb2JqZWN0LlxuXHQgKi9cblx0cHVibGljIGRpc3Bvc2UoKVxuXHR7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBSZXNldHMgdGhlIGNvbXBpbGF0aW9uIHN0YXRlIG9mIHRoZSBtZXRob2QuXG5cdCAqXG5cdCAqIEBpbnRlcm5hbFxuXHQgKi9cblx0cHVibGljIGlSZXNldCgpXG5cdHtcblx0XHR0aGlzLmlDbGVhbkNvbXBpbGF0aW9uRGF0YSgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJlc2V0cyB0aGUgbWV0aG9kJ3Mgc3RhdGUgZm9yIGNvbXBpbGF0aW9uLlxuXHQgKlxuXHQgKiBAaW50ZXJuYWxcblx0ICovXG5cdHB1YmxpYyBpQ2xlYW5Db21waWxhdGlvbkRhdGEoKVxuXHR7XG5cdH1cblxuXHQvKipcblx0ICogR2V0IHRoZSB2ZXJ0ZXggc2hhZGVyIGNvZGUgZm9yIHRoaXMgbWV0aG9kLlxuXHQgKiBAcGFyYW0gdm8gVGhlIE1ldGhvZFZPIG9iamVjdCBsaW5raW5nIHRoaXMgbWV0aG9kIHdpdGggdGhlIHBhc3MgY3VycmVudGx5IGJlaW5nIGNvbXBpbGVkLlxuXHQgKiBAcGFyYW0gcmVnQ2FjaGUgVGhlIHJlZ2lzdGVyIGNhY2hlIHVzZWQgZHVyaW5nIHRoZSBjb21waWxhdGlvbi5cblx0ICpcblx0ICogQGludGVybmFsXG5cdCAqL1xuXHRwdWJsaWMgaUdldFZlcnRleENvZGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIG1ldGhvZFZPOk1ldGhvZFZPLCByZWdpc3RlckNhY2hlOlNoYWRlclJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVyczpTaGFkZXJSZWdpc3RlckRhdGEpOnN0cmluZ1xuXHR7XG5cdFx0cmV0dXJuIFwiXCI7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBpR2V0RnJhZ21lbnRDb2RlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCBtZXRob2RWTzpNZXRob2RWTywgdGFyZ2V0UmVnOlNoYWRlclJlZ2lzdGVyRWxlbWVudCwgcmVnaXN0ZXJDYWNoZTpTaGFkZXJSZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnM6U2hhZGVyUmVnaXN0ZXJEYXRhKTpzdHJpbmdcblx0e1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNldHMgdGhlIHJlbmRlciBzdGF0ZSBmb3IgdGhpcyBtZXRob2QuXG5cdCAqXG5cdCAqIEBwYXJhbSBtZXRob2RWTyBUaGUgTWV0aG9kVk8gb2JqZWN0IGxpbmtpbmcgdGhpcyBtZXRob2Qgd2l0aCB0aGUgcGFzcyBjdXJyZW50bHkgYmVpbmcgY29tcGlsZWQuXG5cdCAqIEBwYXJhbSBzdGFnZSBUaGUgU3RhZ2Ugb2JqZWN0IGN1cnJlbnRseSB1c2VkIGZvciByZW5kZXJpbmcuXG5cdCAqXG5cdCAqIEBpbnRlcm5hbFxuXHQgKi9cblx0cHVibGljIGlBY3RpdmF0ZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgbWV0aG9kVk86TWV0aG9kVk8sIHN0YWdlOlN0YWdlKVxuXHR7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBTZXRzIHRoZSByZW5kZXIgc3RhdGUgZm9yIGEgc2luZ2xlIHJlbmRlcmFibGUuXG5cdCAqXG5cdCAqIEBwYXJhbSB2byBUaGUgTWV0aG9kVk8gb2JqZWN0IGxpbmtpbmcgdGhpcyBtZXRob2Qgd2l0aCB0aGUgcGFzcyBjdXJyZW50bHkgYmVpbmcgY29tcGlsZWQuXG5cdCAqIEBwYXJhbSByZW5kZXJhYmxlIFRoZSByZW5kZXJhYmxlIGN1cnJlbnRseSBiZWluZyByZW5kZXJlZC5cblx0ICogQHBhcmFtIHN0YWdlIFRoZSBTdGFnZSBvYmplY3QgY3VycmVudGx5IHVzZWQgZm9yIHJlbmRlcmluZy5cblx0ICogQHBhcmFtIGNhbWVyYSBUaGUgY2FtZXJhIGZyb20gd2hpY2ggdGhlIHNjZW5lIGlzIGN1cnJlbnRseSByZW5kZXJlZC5cblx0ICpcblx0ICogQGludGVybmFsXG5cdCAqL1xuXHRwdWJsaWMgaVNldFJlbmRlclN0YXRlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCBtZXRob2RWTzpNZXRob2RWTywgcmVuZGVyYWJsZTpSZW5kZXJhYmxlQmFzZSwgc3RhZ2U6U3RhZ2UsIGNhbWVyYTpDYW1lcmEpXG5cdHtcblxuXHR9XG5cblx0LyoqXG5cdCAqIENsZWFycyB0aGUgcmVuZGVyIHN0YXRlIGZvciB0aGlzIG1ldGhvZC5cblx0ICogQHBhcmFtIHZvIFRoZSBNZXRob2RWTyBvYmplY3QgbGlua2luZyB0aGlzIG1ldGhvZCB3aXRoIHRoZSBwYXNzIGN1cnJlbnRseSBiZWluZyBjb21waWxlZC5cblx0ICogQHBhcmFtIHN0YWdlIFRoZSBTdGFnZSBvYmplY3QgY3VycmVudGx5IHVzZWQgZm9yIHJlbmRlcmluZy5cblx0ICpcblx0ICogQGludGVybmFsXG5cdCAqL1xuXHRwdWJsaWMgaURlYWN0aXZhdGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIG1ldGhvZFZPOk1ldGhvZFZPLCBzdGFnZTpTdGFnZSlcblx0e1xuXG5cdH1cblxuXHQvKipcblx0ICogTWFya3MgdGhlIHNoYWRlciBwcm9ncmFtIGFzIGludmFsaWQsIHNvIGl0IHdpbGwgYmUgcmVjb21waWxlZCBiZWZvcmUgdGhlIG5leHQgcmVuZGVyLlxuXHQgKlxuXHQgKiBAaW50ZXJuYWxcblx0ICovXG5cdHB1YmxpYyBpSW52YWxpZGF0ZVNoYWRlclByb2dyYW0oKVxuXHR7XG5cdFx0dGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBTaGFkaW5nTWV0aG9kRXZlbnQoU2hhZGluZ01ldGhvZEV2ZW50LlNIQURFUl9JTlZBTElEQVRFRCkpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENvcGllcyB0aGUgc3RhdGUgZnJvbSBhIFNoYWRpbmdNZXRob2RCYXNlIG9iamVjdCBpbnRvIHRoZSBjdXJyZW50IG9iamVjdC5cblx0ICovXG5cdHB1YmxpYyBjb3B5RnJvbShtZXRob2Q6U2hhZGluZ01ldGhvZEJhc2UpXG5cdHtcblx0fVxufVxuXG5leHBvcnQgPSBTaGFkaW5nTWV0aG9kQmFzZTsiXX0=