var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AssetType = require("awayjs-core/lib/library/AssetType");
var NamedAssetBase = require("awayjs-core/lib/library/NamedAssetBase");
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
            return AssetType.ANIMATION_SET;
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
    return AnimationSetBase;
})(NamedAssetBase);
module.exports = AnimationSetBase;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvQW5pbWF0aW9uU2V0QmFzZS50cyJdLCJuYW1lcyI6WyJBbmltYXRpb25TZXRCYXNlIiwiQW5pbWF0aW9uU2V0QmFzZS5jb25zdHJ1Y3RvciIsIkFuaW1hdGlvblNldEJhc2UuX3BGaW5kVGVtcFJlZyIsIkFuaW1hdGlvblNldEJhc2UudXNlc0NQVSIsIkFuaW1hdGlvblNldEJhc2UucmVzZXRHUFVDb21wYXRpYmlsaXR5IiwiQW5pbWF0aW9uU2V0QmFzZS5jYW5jZWxHUFVDb21wYXRpYmlsaXR5IiwiQW5pbWF0aW9uU2V0QmFzZS5nZXRBR0FMVmVydGV4Q29kZSIsIkFuaW1hdGlvblNldEJhc2UuYWN0aXZhdGUiLCJBbmltYXRpb25TZXRCYXNlLmRlYWN0aXZhdGUiLCJBbmltYXRpb25TZXRCYXNlLmdldEFHQUxGcmFnbWVudENvZGUiLCJBbmltYXRpb25TZXRCYXNlLmdldEFHQUxVVkNvZGUiLCJBbmltYXRpb25TZXRCYXNlLmRvbmVBR0FMQ29kZSIsIkFuaW1hdGlvblNldEJhc2UuYXNzZXRUeXBlIiwiQW5pbWF0aW9uU2V0QmFzZS5hbmltYXRpb25zIiwiQW5pbWF0aW9uU2V0QmFzZS5hbmltYXRpb25OYW1lcyIsIkFuaW1hdGlvblNldEJhc2UuaGFzQW5pbWF0aW9uIiwiQW5pbWF0aW9uU2V0QmFzZS5nZXRBbmltYXRpb24iLCJBbmltYXRpb25TZXRCYXNlLmFkZEFuaW1hdGlvbiIsIkFuaW1hdGlvblNldEJhc2UuZGlzcG9zZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsSUFBTyxTQUFTLFdBQWUsbUNBQW1DLENBQUMsQ0FBQztBQUVwRSxJQUFPLGNBQWMsV0FBYyx3Q0FBd0MsQ0FBQyxDQUFDO0FBQzdFLElBQU8sbUJBQW1CLFdBQWEsNENBQTRDLENBQUMsQ0FBQztBQU1yRixJQUFPLGlCQUFpQixXQUFhLGdEQUFnRCxDQUFDLENBQUM7QUFJdkYsQUFLQTs7OztHQURHO0lBQ0csZ0JBQWdC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a0w1QztBQUVELEFBQTBCLGlCQUFqQixnQkFBZ0IsQ0FBQyIsImZpbGUiOiJhbmltYXRvcnMvQW5pbWF0aW9uU2V0QmFzZS5qcyIsInNvdXJjZVJvb3QiOiIuLi8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQXNzZXRUeXBlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9saWJyYXJ5L0Fzc2V0VHlwZVwiKTtcclxuaW1wb3J0IElBc3NldFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9saWJyYXJ5L0lBc3NldFwiKTtcclxuaW1wb3J0IE5hbWVkQXNzZXRCYXNlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvbGlicmFyeS9OYW1lZEFzc2V0QmFzZVwiKTtcclxuaW1wb3J0IEFic3RyYWN0TWV0aG9kRXJyb3JcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZXJyb3JzL0Fic3RyYWN0TWV0aG9kRXJyb3JcIik7XHJcblxyXG5pbXBvcnQgQW5pbWF0aW9uTm9kZUJhc2VcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvYW5pbWF0b3JzL25vZGVzL0FuaW1hdGlvbk5vZGVCYXNlXCIpO1xyXG5cclxuaW1wb3J0IFN0YWdlXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2Jhc2UvU3RhZ2VcIik7XHJcblxyXG5pbXBvcnQgQW5pbWF0aW9uU2V0RXJyb3JcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvZXJyb3JzL0FuaW1hdGlvblNldEVycm9yXCIpO1xyXG5pbXBvcnQgU2hhZGVyT2JqZWN0QmFzZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2NvbXBpbGF0aW9uL1NoYWRlck9iamVjdEJhc2VcIik7XHJcbmltcG9ydCBTaGFkZXJSZWdpc3RlckVsZW1lbnRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2NvbXBpbGF0aW9uL1NoYWRlclJlZ2lzdGVyRWxlbWVudFwiKTtcclxuXHJcbi8qKlxyXG4gKiBQcm92aWRlcyBhbiBhYnN0cmFjdCBiYXNlIGNsYXNzIGZvciBkYXRhIHNldCBjbGFzc2VzIHRoYXQgaG9sZCBhbmltYXRpb24gZGF0YSBmb3IgdXNlIGluIGFuaW1hdG9yIGNsYXNzZXMuXHJcbiAqXHJcbiAqIEBzZWUgYXdheS5hbmltYXRvcnMuQW5pbWF0b3JCYXNlXHJcbiAqL1xyXG5jbGFzcyBBbmltYXRpb25TZXRCYXNlIGV4dGVuZHMgTmFtZWRBc3NldEJhc2UgaW1wbGVtZW50cyBJQXNzZXRcclxue1xyXG5cdHByaXZhdGUgX3VzZXNDUFU6Ym9vbGVhbjtcclxuXHRwcml2YXRlIF9hbmltYXRpb25zOkFycmF5PEFuaW1hdGlvbk5vZGVCYXNlPiA9IG5ldyBBcnJheTxBbmltYXRpb25Ob2RlQmFzZT4oKTtcclxuXHRwcml2YXRlIF9hbmltYXRpb25OYW1lczpBcnJheTxzdHJpbmc+ID0gbmV3IEFycmF5PHN0cmluZz4oKTtcclxuXHRwcml2YXRlIF9hbmltYXRpb25EaWN0aW9uYXJ5Ok9iamVjdCA9IG5ldyBPYmplY3QoKTtcclxuXHJcblx0Y29uc3RydWN0b3IoKVxyXG5cdHtcclxuXHRcdHN1cGVyKCk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBSZXRyaWV2ZXMgYSB0ZW1wb3JhcnkgR1BVIHJlZ2lzdGVyIHRoYXQncyBzdGlsbCBmcmVlLlxyXG5cdCAqXHJcblx0ICogQHBhcmFtIGV4Y2x1ZGUgQW4gYXJyYXkgb2Ygbm9uLWZyZWUgdGVtcG9yYXJ5IHJlZ2lzdGVycy5cclxuXHQgKiBAcGFyYW0gZXhjbHVkZUFub3RoZXIgQW4gYWRkaXRpb25hbCByZWdpc3RlciB0aGF0J3Mgbm90IGZyZWUuXHJcblx0ICogQHJldHVybiBBIHRlbXBvcmFyeSByZWdpc3RlciB0aGF0IGNhbiBiZSB1c2VkLlxyXG5cdCAqL1xyXG5cdHB1YmxpYyBfcEZpbmRUZW1wUmVnKGV4Y2x1ZGU6QXJyYXk8c3RyaW5nPiwgZXhjbHVkZUFub3RoZXI6c3RyaW5nID0gbnVsbCk6c3RyaW5nXHJcblx0e1xyXG5cdFx0dmFyIGk6bnVtYmVyIC8qdWludCovID0gMDtcclxuXHRcdHZhciByZWc6c3RyaW5nO1xyXG5cclxuXHRcdHdoaWxlICh0cnVlKSB7XHJcblx0XHRcdHJlZyA9IFwidnRcIiArIGk7XHJcblx0XHRcdGlmIChleGNsdWRlLmluZGV4T2YocmVnKSA9PSAtMSAmJiBleGNsdWRlQW5vdGhlciAhPSByZWcpXHJcblx0XHRcdFx0cmV0dXJuIHJlZztcclxuXHRcdFx0KytpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGNhbid0IGJlIHJlYWNoZWRcclxuXHRcdHJldHVybiBudWxsO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogSW5kaWNhdGVzIHdoZXRoZXIgdGhlIHByb3BlcnRpZXMgb2YgdGhlIGFuaW1hdGlvbiBkYXRhIGNvbnRhaW5lZCB3aXRoaW4gdGhlIHNldCBjb21iaW5lZCB3aXRoXHJcblx0ICogdGhlIHZlcnRleCByZWdpc3RlcnMgYWxyZWFkeSBpbiB1c2Ugb24gc2hhZGluZyBtYXRlcmlhbHMgYWxsb3dzIHRoZSBhbmltYXRpb24gZGF0YSB0byB1dGlsaXNlXHJcblx0ICogR1BVIGNhbGxzLlxyXG5cdCAqL1xyXG5cdHB1YmxpYyBnZXQgdXNlc0NQVSgpOmJvb2xlYW5cclxuXHR7XHJcblx0XHRyZXR1cm4gdGhpcy5fdXNlc0NQVTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIENhbGxlZCBieSB0aGUgbWF0ZXJpYWwgdG8gcmVzZXQgdGhlIEdQVSBpbmRpY2F0b3IgYmVmb3JlIHRlc3Rpbmcgd2hldGhlciByZWdpc3RlciBzcGFjZSBpbiB0aGUgc2hhZGVyXHJcblx0ICogaXMgYXZhaWxhYmxlIGZvciBydW5uaW5nIEdQVS1iYXNlZCBhbmltYXRpb24gY29kZS5cclxuXHQgKlxyXG5cdCAqIEBwcml2YXRlXHJcblx0ICovXHJcblx0cHVibGljIHJlc2V0R1BVQ29tcGF0aWJpbGl0eSgpXHJcblx0e1xyXG5cdFx0dGhpcy5fdXNlc0NQVSA9IGZhbHNlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGNhbmNlbEdQVUNvbXBhdGliaWxpdHkoKVxyXG5cdHtcclxuXHRcdHRoaXMuX3VzZXNDUFUgPSB0cnVlO1xyXG5cdH1cclxuXHJcblxyXG5cdC8qKlxyXG5cdCAqIEBpbmhlcml0RG9jXHJcblx0ICovXHJcblx0cHVibGljIGdldEFHQUxWZXJ0ZXhDb2RlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlKTpzdHJpbmdcclxuXHR7XHJcblx0XHR0aHJvdyBuZXcgQWJzdHJhY3RNZXRob2RFcnJvcigpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQGluaGVyaXREb2NcclxuXHQgKi9cclxuXHRwdWJsaWMgYWN0aXZhdGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIHN0YWdlOlN0YWdlKVxyXG5cdHtcclxuXHRcdHRocm93IG5ldyBBYnN0cmFjdE1ldGhvZEVycm9yKCk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBAaW5oZXJpdERvY1xyXG5cdCAqL1xyXG5cdHB1YmxpYyBkZWFjdGl2YXRlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCBzdGFnZTpTdGFnZSlcclxuXHR7XHJcblx0XHR0aHJvdyBuZXcgQWJzdHJhY3RNZXRob2RFcnJvcigpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQGluaGVyaXREb2NcclxuXHQgKi9cclxuXHRwdWJsaWMgZ2V0QUdBTEZyYWdtZW50Q29kZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgc2hhZGVkVGFyZ2V0OnN0cmluZyk6c3RyaW5nXHJcblx0e1xyXG5cdFx0dGhyb3cgbmV3IEFic3RyYWN0TWV0aG9kRXJyb3IoKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEBpbmhlcml0RG9jXHJcblx0ICovXHJcblx0cHVibGljIGdldEFHQUxVVkNvZGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UpOnN0cmluZ1xyXG5cdHtcclxuXHRcdHRocm93IG5ldyBBYnN0cmFjdE1ldGhvZEVycm9yKCk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBAaW5oZXJpdERvY1xyXG5cdCAqL1xyXG5cdHB1YmxpYyBkb25lQUdBTENvZGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UpXHJcblx0e1xyXG5cdFx0dGhyb3cgbmV3IEFic3RyYWN0TWV0aG9kRXJyb3IoKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEBpbmhlcml0RG9jXHJcblx0ICovXHJcblx0cHVibGljIGdldCBhc3NldFR5cGUoKTpzdHJpbmdcclxuXHR7XHJcblx0XHRyZXR1cm4gQXNzZXRUeXBlLkFOSU1BVElPTl9TRVQ7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBSZXR1cm5zIGEgdmVjdG9yIG9mIGFuaW1hdGlvbiBzdGF0ZSBvYmplY3RzIHRoYXQgbWFrZSB1cCB0aGUgY29udGVudHMgb2YgdGhlIGFuaW1hdGlvbiBkYXRhIHNldC5cclxuXHQgKi9cclxuXHRwdWJsaWMgZ2V0IGFuaW1hdGlvbnMoKTpBcnJheTxBbmltYXRpb25Ob2RlQmFzZT5cclxuXHR7XHJcblx0XHRyZXR1cm4gdGhpcy5fYW5pbWF0aW9ucztcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFJldHVybnMgYSB2ZWN0b3Igb2YgYW5pbWF0aW9uIHN0YXRlIG9iamVjdHMgdGhhdCBtYWtlIHVwIHRoZSBjb250ZW50cyBvZiB0aGUgYW5pbWF0aW9uIGRhdGEgc2V0LlxyXG5cdCAqL1xyXG5cdHB1YmxpYyBnZXQgYW5pbWF0aW9uTmFtZXMoKTpBcnJheTxzdHJpbmc+XHJcblx0e1xyXG5cdFx0cmV0dXJuIHRoaXMuX2FuaW1hdGlvbk5hbWVzO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQ2hlY2sgdG8gZGV0ZXJtaW5lIHdoZXRoZXIgYSBzdGF0ZSBpcyByZWdpc3RlcmVkIGluIHRoZSBhbmltYXRpb24gc2V0IHVuZGVyIHRoZSBnaXZlbiBuYW1lLlxyXG5cdCAqXHJcblx0ICogQHBhcmFtIHN0YXRlTmFtZSBUaGUgbmFtZSBvZiB0aGUgYW5pbWF0aW9uIHN0YXRlIG9iamVjdCB0byBiZSBjaGVja2VkLlxyXG5cdCAqL1xyXG5cdHB1YmxpYyBoYXNBbmltYXRpb24obmFtZTpzdHJpbmcpOmJvb2xlYW5cclxuXHR7XHJcblx0XHRyZXR1cm4gdGhpcy5fYW5pbWF0aW9uRGljdGlvbmFyeVtuYW1lXSAhPSBudWxsO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogUmV0cmlldmVzIHRoZSBhbmltYXRpb24gc3RhdGUgb2JqZWN0IHJlZ2lzdGVyZWQgaW4gdGhlIGFuaW1hdGlvbiBkYXRhIHNldCB1bmRlciB0aGUgZ2l2ZW4gbmFtZS5cclxuXHQgKlxyXG5cdCAqIEBwYXJhbSBzdGF0ZU5hbWUgVGhlIG5hbWUgb2YgdGhlIGFuaW1hdGlvbiBzdGF0ZSBvYmplY3QgdG8gYmUgcmV0cmlldmVkLlxyXG5cdCAqL1xyXG5cdHB1YmxpYyBnZXRBbmltYXRpb24obmFtZTpzdHJpbmcpOkFuaW1hdGlvbk5vZGVCYXNlXHJcblx0e1xyXG5cdFx0cmV0dXJuIHRoaXMuX2FuaW1hdGlvbkRpY3Rpb25hcnlbbmFtZV07XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBBZGRzIGFuIGFuaW1hdGlvbiBzdGF0ZSBvYmplY3QgdG8gdGhlIGFuaWFtdGlvbiBkYXRhIHNldCB1bmRlciB0aGUgZ2l2ZW4gbmFtZS5cclxuXHQgKlxyXG5cdCAqIEBwYXJhbSBzdGF0ZU5hbWUgVGhlIG5hbWUgdW5kZXIgd2hpY2ggdGhlIGFuaW1hdGlvbiBzdGF0ZSBvYmplY3Qgd2lsbCBiZSBzdG9yZWQuXHJcblx0ICogQHBhcmFtIGFuaW1hdGlvblN0YXRlIFRoZSBhbmltYXRpb24gc3RhdGUgb2JqZWN0IHRvIGJlIHN0YW9yZWQgaW4gdGhlIHNldC5cclxuXHQgKi9cclxuXHRwdWJsaWMgYWRkQW5pbWF0aW9uKG5vZGU6QW5pbWF0aW9uTm9kZUJhc2UpXHJcblx0e1xyXG5cdFx0aWYgKHRoaXMuX2FuaW1hdGlvbkRpY3Rpb25hcnlbbm9kZS5uYW1lXSlcclxuXHRcdFx0dGhyb3cgbmV3IEFuaW1hdGlvblNldEVycm9yKFwicm9vdCBub2RlIG5hbWUgJ1wiICsgbm9kZS5uYW1lICsgXCInIGFscmVhZHkgZXhpc3RzIGluIHRoZSBzZXRcIik7XHJcblxyXG5cdFx0dGhpcy5fYW5pbWF0aW9uRGljdGlvbmFyeVtub2RlLm5hbWVdID0gbm9kZTtcclxuXHJcblx0XHR0aGlzLl9hbmltYXRpb25zLnB1c2gobm9kZSk7XHJcblxyXG5cdFx0dGhpcy5fYW5pbWF0aW9uTmFtZXMucHVzaChub2RlLm5hbWUpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQ2xlYW5zIHVwIGFueSByZXNvdXJjZXMgdXNlZCBieSB0aGUgY3VycmVudCBvYmplY3QuXHJcblx0ICovXHJcblx0cHVibGljIGRpc3Bvc2UoKVxyXG5cdHtcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCA9IEFuaW1hdGlvblNldEJhc2U7Il19