var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AssetBase = require("awayjs-core/lib/library/AssetBase");
var AbstractMethodError = require("awayjs-core/lib/errors/AbstractMethodError");
var AnimationSetError = require("awayjs-renderergl/lib/errors/AnimationSetError");
/**
 * Provides an abstract base class for data set classes that hold animation data for use in animator classes.
 *
 * @see away.animators.AnimatorBase
 */
var AnimationSetBase = (function (_super) {
    __extends(AnimationSetBase, _super);
    function AnimationSetBase() {
        _super.call(this);
        this._animations = new Array();
        this._animationNames = new Array();
        this._animationDictionary = new Object();
    }
    /**
     * Retrieves a temporary GPU register that's still free.
     *
     * @param exclude An array of non-free temporary registers.
     * @param excludeAnother An additional register that's not free.
     * @return A temporary register that can be used.
     */
    AnimationSetBase.prototype._pFindTempReg = function (exclude, excludeAnother) {
        if (excludeAnother === void 0) { excludeAnother = null; }
        var i = 0;
        var reg;
        while (true) {
            reg = "vt" + i;
            if (exclude.indexOf(reg) == -1 && excludeAnother != reg)
                return reg;
            ++i;
        }
        // can't be reached
        return null;
    };
    Object.defineProperty(AnimationSetBase.prototype, "usesCPU", {
        /**
         * Indicates whether the properties of the animation data contained within the set combined with
         * the vertex registers already in use on shading materials allows the animation data to utilise
         * GPU calls.
         */
        get: function () {
            return this._usesCPU;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Called by the material to reset the GPU indicator before testing whether register space in the shader
     * is available for running GPU-based animation code.
     *
     * @private
     */
    AnimationSetBase.prototype.resetGPUCompatibility = function () {
        this._usesCPU = false;
    };
    AnimationSetBase.prototype.cancelGPUCompatibility = function () {
        this._usesCPU = true;
    };
    /**
     * @inheritDoc
     */
    AnimationSetBase.prototype.getAGALVertexCode = function (shaderObject) {
        throw new AbstractMethodError();
    };
    /**
     * @inheritDoc
     */
    AnimationSetBase.prototype.activate = function (shaderObject, stage) {
        throw new AbstractMethodError();
    };
    /**
     * @inheritDoc
     */
    AnimationSetBase.prototype.deactivate = function (shaderObject, stage) {
        throw new AbstractMethodError();
    };
    /**
     * @inheritDoc
     */
    AnimationSetBase.prototype.getAGALFragmentCode = function (shaderObject, shadedTarget) {
        throw new AbstractMethodError();
    };
    /**
     * @inheritDoc
     */
    AnimationSetBase.prototype.getAGALUVCode = function (shaderObject) {
        throw new AbstractMethodError();
    };
    /**
     * @inheritDoc
     */
    AnimationSetBase.prototype.doneAGALCode = function (shaderObject) {
        throw new AbstractMethodError();
    };
    Object.defineProperty(AnimationSetBase.prototype, "assetType", {
        /**
         * @inheritDoc
         */
        get: function () {
            return AnimationSetBase.assetType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnimationSetBase.prototype, "animations", {
        /**
         * Returns a vector of animation state objects that make up the contents of the animation data set.
         */
        get: function () {
            return this._animations;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnimationSetBase.prototype, "animationNames", {
        /**
         * Returns a vector of animation state objects that make up the contents of the animation data set.
         */
        get: function () {
            return this._animationNames;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Check to determine whether a state is registered in the animation set under the given name.
     *
     * @param stateName The name of the animation state object to be checked.
     */
    AnimationSetBase.prototype.hasAnimation = function (name) {
        return this._animationDictionary[name] != null;
    };
    /**
     * Retrieves the animation state object registered in the animation data set under the given name.
     *
     * @param stateName The name of the animation state object to be retrieved.
     */
    AnimationSetBase.prototype.getAnimation = function (name) {
        return this._animationDictionary[name];
    };
    /**
     * Adds an animation state object to the aniamtion data set under the given name.
     *
     * @param stateName The name under which the animation state object will be stored.
     * @param animationState The animation state object to be staored in the set.
     */
    AnimationSetBase.prototype.addAnimation = function (node) {
        if (this._animationDictionary[node.name])
            throw new AnimationSetError("root node name '" + node.name + "' already exists in the set");
        this._animationDictionary[node.name] = node;
        this._animations.push(node);
        this._animationNames.push(node.name);
    };
    /**
     * Cleans up any resources used by the current object.
     */
    AnimationSetBase.prototype.dispose = function () {
    };
    AnimationSetBase.assetType = "[asset AnimationSet]";
    return AnimationSetBase;
})(AssetBase);
module.exports = AnimationSetBase;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvQW5pbWF0aW9uU2V0QmFzZS50cyJdLCJuYW1lcyI6WyJBbmltYXRpb25TZXRCYXNlIiwiQW5pbWF0aW9uU2V0QmFzZS5jb25zdHJ1Y3RvciIsIkFuaW1hdGlvblNldEJhc2UuX3BGaW5kVGVtcFJlZyIsIkFuaW1hdGlvblNldEJhc2UudXNlc0NQVSIsIkFuaW1hdGlvblNldEJhc2UucmVzZXRHUFVDb21wYXRpYmlsaXR5IiwiQW5pbWF0aW9uU2V0QmFzZS5jYW5jZWxHUFVDb21wYXRpYmlsaXR5IiwiQW5pbWF0aW9uU2V0QmFzZS5nZXRBR0FMVmVydGV4Q29kZSIsIkFuaW1hdGlvblNldEJhc2UuYWN0aXZhdGUiLCJBbmltYXRpb25TZXRCYXNlLmRlYWN0aXZhdGUiLCJBbmltYXRpb25TZXRCYXNlLmdldEFHQUxGcmFnbWVudENvZGUiLCJBbmltYXRpb25TZXRCYXNlLmdldEFHQUxVVkNvZGUiLCJBbmltYXRpb25TZXRCYXNlLmRvbmVBR0FMQ29kZSIsIkFuaW1hdGlvblNldEJhc2UuYXNzZXRUeXBlIiwiQW5pbWF0aW9uU2V0QmFzZS5hbmltYXRpb25zIiwiQW5pbWF0aW9uU2V0QmFzZS5hbmltYXRpb25OYW1lcyIsIkFuaW1hdGlvblNldEJhc2UuaGFzQW5pbWF0aW9uIiwiQW5pbWF0aW9uU2V0QmFzZS5nZXRBbmltYXRpb24iLCJBbmltYXRpb25TZXRCYXNlLmFkZEFuaW1hdGlvbiIsIkFuaW1hdGlvblNldEJhc2UuZGlzcG9zZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0EsSUFBTyxTQUFTLFdBQWUsbUNBQW1DLENBQUMsQ0FBQztBQUNwRSxJQUFPLG1CQUFtQixXQUFhLDRDQUE0QyxDQUFDLENBQUM7QUFNckYsSUFBTyxpQkFBaUIsV0FBYSxnREFBZ0QsQ0FBQyxDQUFDO0FBSXZGLEFBS0E7Ozs7R0FERztJQUNHLGdCQUFnQjtJQUFTQSxVQUF6QkEsZ0JBQWdCQSxVQUFrQkE7SUFTdkNBLFNB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b0x2QztBQUVELEFBQTBCLGlCQUFqQixnQkFBZ0IsQ0FBQyIsImZpbGUiOiJhbmltYXRvcnMvQW5pbWF0aW9uU2V0QmFzZS5qcyIsInNvdXJjZVJvb3QiOiIuLi8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgSUFzc2V0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2xpYnJhcnkvSUFzc2V0XCIpO1xuaW1wb3J0IEFzc2V0QmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvbGlicmFyeS9Bc3NldEJhc2VcIik7XG5pbXBvcnQgQWJzdHJhY3RNZXRob2RFcnJvclx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9lcnJvcnMvQWJzdHJhY3RNZXRob2RFcnJvclwiKTtcblxuaW1wb3J0IEFuaW1hdGlvbk5vZGVCYXNlXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2FuaW1hdG9ycy9ub2Rlcy9BbmltYXRpb25Ob2RlQmFzZVwiKTtcblxuaW1wb3J0IFN0YWdlXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2Jhc2UvU3RhZ2VcIik7XG5cbmltcG9ydCBBbmltYXRpb25TZXRFcnJvclx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9lcnJvcnMvQW5pbWF0aW9uU2V0RXJyb3JcIik7XG5pbXBvcnQgU2hhZGVyT2JqZWN0QmFzZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2NvbXBpbGF0aW9uL1NoYWRlck9iamVjdEJhc2VcIik7XG5pbXBvcnQgU2hhZGVyUmVnaXN0ZXJFbGVtZW50XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckVsZW1lbnRcIik7XG5cbi8qKlxuICogUHJvdmlkZXMgYW4gYWJzdHJhY3QgYmFzZSBjbGFzcyBmb3IgZGF0YSBzZXQgY2xhc3NlcyB0aGF0IGhvbGQgYW5pbWF0aW9uIGRhdGEgZm9yIHVzZSBpbiBhbmltYXRvciBjbGFzc2VzLlxuICpcbiAqIEBzZWUgYXdheS5hbmltYXRvcnMuQW5pbWF0b3JCYXNlXG4gKi9cbmNsYXNzIEFuaW1hdGlvblNldEJhc2UgZXh0ZW5kcyBBc3NldEJhc2UgaW1wbGVtZW50cyBJQXNzZXRcbntcblx0cHVibGljIHN0YXRpYyBhc3NldFR5cGU6c3RyaW5nID0gXCJbYXNzZXQgQW5pbWF0aW9uU2V0XVwiO1xuXG5cdHByaXZhdGUgX3VzZXNDUFU6Ym9vbGVhbjtcblx0cHJpdmF0ZSBfYW5pbWF0aW9uczpBcnJheTxBbmltYXRpb25Ob2RlQmFzZT4gPSBuZXcgQXJyYXk8QW5pbWF0aW9uTm9kZUJhc2U+KCk7XG5cdHByaXZhdGUgX2FuaW1hdGlvbk5hbWVzOkFycmF5PHN0cmluZz4gPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xuXHRwcml2YXRlIF9hbmltYXRpb25EaWN0aW9uYXJ5Ok9iamVjdCA9IG5ldyBPYmplY3QoKTtcblxuXHRjb25zdHJ1Y3RvcigpXG5cdHtcblx0XHRzdXBlcigpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHJpZXZlcyBhIHRlbXBvcmFyeSBHUFUgcmVnaXN0ZXIgdGhhdCdzIHN0aWxsIGZyZWUuXG5cdCAqXG5cdCAqIEBwYXJhbSBleGNsdWRlIEFuIGFycmF5IG9mIG5vbi1mcmVlIHRlbXBvcmFyeSByZWdpc3RlcnMuXG5cdCAqIEBwYXJhbSBleGNsdWRlQW5vdGhlciBBbiBhZGRpdGlvbmFsIHJlZ2lzdGVyIHRoYXQncyBub3QgZnJlZS5cblx0ICogQHJldHVybiBBIHRlbXBvcmFyeSByZWdpc3RlciB0aGF0IGNhbiBiZSB1c2VkLlxuXHQgKi9cblx0cHVibGljIF9wRmluZFRlbXBSZWcoZXhjbHVkZTpBcnJheTxzdHJpbmc+LCBleGNsdWRlQW5vdGhlcjpzdHJpbmcgPSBudWxsKTpzdHJpbmdcblx0e1xuXHRcdHZhciBpOm51bWJlciAvKnVpbnQqLyA9IDA7XG5cdFx0dmFyIHJlZzpzdHJpbmc7XG5cblx0XHR3aGlsZSAodHJ1ZSkge1xuXHRcdFx0cmVnID0gXCJ2dFwiICsgaTtcblx0XHRcdGlmIChleGNsdWRlLmluZGV4T2YocmVnKSA9PSAtMSAmJiBleGNsdWRlQW5vdGhlciAhPSByZWcpXG5cdFx0XHRcdHJldHVybiByZWc7XG5cdFx0XHQrK2k7XG5cdFx0fVxuXG5cdFx0Ly8gY2FuJ3QgYmUgcmVhY2hlZFxuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0LyoqXG5cdCAqIEluZGljYXRlcyB3aGV0aGVyIHRoZSBwcm9wZXJ0aWVzIG9mIHRoZSBhbmltYXRpb24gZGF0YSBjb250YWluZWQgd2l0aGluIHRoZSBzZXQgY29tYmluZWQgd2l0aFxuXHQgKiB0aGUgdmVydGV4IHJlZ2lzdGVycyBhbHJlYWR5IGluIHVzZSBvbiBzaGFkaW5nIG1hdGVyaWFscyBhbGxvd3MgdGhlIGFuaW1hdGlvbiBkYXRhIHRvIHV0aWxpc2Vcblx0ICogR1BVIGNhbGxzLlxuXHQgKi9cblx0cHVibGljIGdldCB1c2VzQ1BVKCk6Ym9vbGVhblxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3VzZXNDUFU7XG5cdH1cblxuXHQvKipcblx0ICogQ2FsbGVkIGJ5IHRoZSBtYXRlcmlhbCB0byByZXNldCB0aGUgR1BVIGluZGljYXRvciBiZWZvcmUgdGVzdGluZyB3aGV0aGVyIHJlZ2lzdGVyIHNwYWNlIGluIHRoZSBzaGFkZXJcblx0ICogaXMgYXZhaWxhYmxlIGZvciBydW5uaW5nIEdQVS1iYXNlZCBhbmltYXRpb24gY29kZS5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICovXG5cdHB1YmxpYyByZXNldEdQVUNvbXBhdGliaWxpdHkoKVxuXHR7XG5cdFx0dGhpcy5fdXNlc0NQVSA9IGZhbHNlO1xuXHR9XG5cblx0cHVibGljIGNhbmNlbEdQVUNvbXBhdGliaWxpdHkoKVxuXHR7XG5cdFx0dGhpcy5fdXNlc0NQVSA9IHRydWU7XG5cdH1cblxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGdldEFHQUxWZXJ0ZXhDb2RlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlKTpzdHJpbmdcblx0e1xuXHRcdHRocm93IG5ldyBBYnN0cmFjdE1ldGhvZEVycm9yKCk7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBhY3RpdmF0ZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgc3RhZ2U6U3RhZ2UpXG5cdHtcblx0XHR0aHJvdyBuZXcgQWJzdHJhY3RNZXRob2RFcnJvcigpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgZGVhY3RpdmF0ZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgc3RhZ2U6U3RhZ2UpXG5cdHtcblx0XHR0aHJvdyBuZXcgQWJzdHJhY3RNZXRob2RFcnJvcigpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgZ2V0QUdBTEZyYWdtZW50Q29kZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgc2hhZGVkVGFyZ2V0OnN0cmluZyk6c3RyaW5nXG5cdHtcblx0XHR0aHJvdyBuZXcgQWJzdHJhY3RNZXRob2RFcnJvcigpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgZ2V0QUdBTFVWQ29kZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSk6c3RyaW5nXG5cdHtcblx0XHR0aHJvdyBuZXcgQWJzdHJhY3RNZXRob2RFcnJvcigpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgZG9uZUFHQUxDb2RlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlKVxuXHR7XG5cdFx0dGhyb3cgbmV3IEFic3RyYWN0TWV0aG9kRXJyb3IoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGdldCBhc3NldFR5cGUoKTpzdHJpbmdcblx0e1xuXHRcdHJldHVybiBBbmltYXRpb25TZXRCYXNlLmFzc2V0VHlwZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIGEgdmVjdG9yIG9mIGFuaW1hdGlvbiBzdGF0ZSBvYmplY3RzIHRoYXQgbWFrZSB1cCB0aGUgY29udGVudHMgb2YgdGhlIGFuaW1hdGlvbiBkYXRhIHNldC5cblx0ICovXG5cdHB1YmxpYyBnZXQgYW5pbWF0aW9ucygpOkFycmF5PEFuaW1hdGlvbk5vZGVCYXNlPlxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX2FuaW1hdGlvbnM7XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyBhIHZlY3RvciBvZiBhbmltYXRpb24gc3RhdGUgb2JqZWN0cyB0aGF0IG1ha2UgdXAgdGhlIGNvbnRlbnRzIG9mIHRoZSBhbmltYXRpb24gZGF0YSBzZXQuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGFuaW1hdGlvbk5hbWVzKCk6QXJyYXk8c3RyaW5nPlxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX2FuaW1hdGlvbk5hbWVzO1xuXHR9XG5cblx0LyoqXG5cdCAqIENoZWNrIHRvIGRldGVybWluZSB3aGV0aGVyIGEgc3RhdGUgaXMgcmVnaXN0ZXJlZCBpbiB0aGUgYW5pbWF0aW9uIHNldCB1bmRlciB0aGUgZ2l2ZW4gbmFtZS5cblx0ICpcblx0ICogQHBhcmFtIHN0YXRlTmFtZSBUaGUgbmFtZSBvZiB0aGUgYW5pbWF0aW9uIHN0YXRlIG9iamVjdCB0byBiZSBjaGVja2VkLlxuXHQgKi9cblx0cHVibGljIGhhc0FuaW1hdGlvbihuYW1lOnN0cmluZyk6Ym9vbGVhblxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX2FuaW1hdGlvbkRpY3Rpb25hcnlbbmFtZV0gIT0gbnVsbDtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXRyaWV2ZXMgdGhlIGFuaW1hdGlvbiBzdGF0ZSBvYmplY3QgcmVnaXN0ZXJlZCBpbiB0aGUgYW5pbWF0aW9uIGRhdGEgc2V0IHVuZGVyIHRoZSBnaXZlbiBuYW1lLlxuXHQgKlxuXHQgKiBAcGFyYW0gc3RhdGVOYW1lIFRoZSBuYW1lIG9mIHRoZSBhbmltYXRpb24gc3RhdGUgb2JqZWN0IHRvIGJlIHJldHJpZXZlZC5cblx0ICovXG5cdHB1YmxpYyBnZXRBbmltYXRpb24obmFtZTpzdHJpbmcpOkFuaW1hdGlvbk5vZGVCYXNlXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fYW5pbWF0aW9uRGljdGlvbmFyeVtuYW1lXTtcblx0fVxuXG5cdC8qKlxuXHQgKiBBZGRzIGFuIGFuaW1hdGlvbiBzdGF0ZSBvYmplY3QgdG8gdGhlIGFuaWFtdGlvbiBkYXRhIHNldCB1bmRlciB0aGUgZ2l2ZW4gbmFtZS5cblx0ICpcblx0ICogQHBhcmFtIHN0YXRlTmFtZSBUaGUgbmFtZSB1bmRlciB3aGljaCB0aGUgYW5pbWF0aW9uIHN0YXRlIG9iamVjdCB3aWxsIGJlIHN0b3JlZC5cblx0ICogQHBhcmFtIGFuaW1hdGlvblN0YXRlIFRoZSBhbmltYXRpb24gc3RhdGUgb2JqZWN0IHRvIGJlIHN0YW9yZWQgaW4gdGhlIHNldC5cblx0ICovXG5cdHB1YmxpYyBhZGRBbmltYXRpb24obm9kZTpBbmltYXRpb25Ob2RlQmFzZSlcblx0e1xuXHRcdGlmICh0aGlzLl9hbmltYXRpb25EaWN0aW9uYXJ5W25vZGUubmFtZV0pXG5cdFx0XHR0aHJvdyBuZXcgQW5pbWF0aW9uU2V0RXJyb3IoXCJyb290IG5vZGUgbmFtZSAnXCIgKyBub2RlLm5hbWUgKyBcIicgYWxyZWFkeSBleGlzdHMgaW4gdGhlIHNldFwiKTtcblxuXHRcdHRoaXMuX2FuaW1hdGlvbkRpY3Rpb25hcnlbbm9kZS5uYW1lXSA9IG5vZGU7XG5cblx0XHR0aGlzLl9hbmltYXRpb25zLnB1c2gobm9kZSk7XG5cblx0XHR0aGlzLl9hbmltYXRpb25OYW1lcy5wdXNoKG5vZGUubmFtZSk7XG5cdH1cblxuXHQvKipcblx0ICogQ2xlYW5zIHVwIGFueSByZXNvdXJjZXMgdXNlZCBieSB0aGUgY3VycmVudCBvYmplY3QuXG5cdCAqL1xuXHRwdWJsaWMgZGlzcG9zZSgpXG5cdHtcblx0fVxufVxuXG5leHBvcnQgPSBBbmltYXRpb25TZXRCYXNlOyJdfQ==