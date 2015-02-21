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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvQW5pbWF0aW9uU2V0QmFzZS50cyJdLCJuYW1lcyI6WyJBbmltYXRpb25TZXRCYXNlIiwiQW5pbWF0aW9uU2V0QmFzZS5jb25zdHJ1Y3RvciIsIkFuaW1hdGlvblNldEJhc2UuX3BGaW5kVGVtcFJlZyIsIkFuaW1hdGlvblNldEJhc2UudXNlc0NQVSIsIkFuaW1hdGlvblNldEJhc2UucmVzZXRHUFVDb21wYXRpYmlsaXR5IiwiQW5pbWF0aW9uU2V0QmFzZS5jYW5jZWxHUFVDb21wYXRpYmlsaXR5IiwiQW5pbWF0aW9uU2V0QmFzZS5nZXRBR0FMVmVydGV4Q29kZSIsIkFuaW1hdGlvblNldEJhc2UuYWN0aXZhdGUiLCJBbmltYXRpb25TZXRCYXNlLmRlYWN0aXZhdGUiLCJBbmltYXRpb25TZXRCYXNlLmdldEFHQUxGcmFnbWVudENvZGUiLCJBbmltYXRpb25TZXRCYXNlLmdldEFHQUxVVkNvZGUiLCJBbmltYXRpb25TZXRCYXNlLmRvbmVBR0FMQ29kZSIsIkFuaW1hdGlvblNldEJhc2UuYXNzZXRUeXBlIiwiQW5pbWF0aW9uU2V0QmFzZS5hbmltYXRpb25zIiwiQW5pbWF0aW9uU2V0QmFzZS5hbmltYXRpb25OYW1lcyIsIkFuaW1hdGlvblNldEJhc2UuaGFzQW5pbWF0aW9uIiwiQW5pbWF0aW9uU2V0QmFzZS5nZXRBbmltYXRpb24iLCJBbmltYXRpb25TZXRCYXNlLmFkZEFuaW1hdGlvbiIsIkFuaW1hdGlvblNldEJhc2UuZGlzcG9zZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsSUFBTyxTQUFTLFdBQWUsbUNBQW1DLENBQUMsQ0FBQztBQUVwRSxJQUFPLGNBQWMsV0FBYyx3Q0FBd0MsQ0FBQyxDQUFDO0FBQzdFLElBQU8sbUJBQW1CLFdBQWEsNENBQTRDLENBQUMsQ0FBQztBQU1yRixJQUFPLGlCQUFpQixXQUFhLGdEQUFnRCxDQUFDLENBQUM7QUFJdkYsQUFLQTs7OztHQURHO0lBQ0csZ0JBQWdC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a0w1QztBQUVELEFBQTBCLGlCQUFqQixnQkFBZ0IsQ0FBQyIsImZpbGUiOiJhbmltYXRvcnMvQW5pbWF0aW9uU2V0QmFzZS5qcyIsInNvdXJjZVJvb3QiOiIuLi8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQXNzZXRUeXBlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9saWJyYXJ5L0Fzc2V0VHlwZVwiKTtcbmltcG9ydCBJQXNzZXRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvbGlicmFyeS9JQXNzZXRcIik7XG5pbXBvcnQgTmFtZWRBc3NldEJhc2VcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9saWJyYXJ5L05hbWVkQXNzZXRCYXNlXCIpO1xuaW1wb3J0IEFic3RyYWN0TWV0aG9kRXJyb3JcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZXJyb3JzL0Fic3RyYWN0TWV0aG9kRXJyb3JcIik7XG5cbmltcG9ydCBBbmltYXRpb25Ob2RlQmFzZVx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9hbmltYXRvcnMvbm9kZXMvQW5pbWF0aW9uTm9kZUJhc2VcIik7XG5cbmltcG9ydCBTdGFnZVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9iYXNlL1N0YWdlXCIpO1xuXG5pbXBvcnQgQW5pbWF0aW9uU2V0RXJyb3JcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvZXJyb3JzL0FuaW1hdGlvblNldEVycm9yXCIpO1xuaW1wb3J0IFNoYWRlck9iamVjdEJhc2VcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9jb21waWxhdGlvbi9TaGFkZXJPYmplY3RCYXNlXCIpO1xuaW1wb3J0IFNoYWRlclJlZ2lzdGVyRWxlbWVudFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJFbGVtZW50XCIpO1xuXG4vKipcbiAqIFByb3ZpZGVzIGFuIGFic3RyYWN0IGJhc2UgY2xhc3MgZm9yIGRhdGEgc2V0IGNsYXNzZXMgdGhhdCBob2xkIGFuaW1hdGlvbiBkYXRhIGZvciB1c2UgaW4gYW5pbWF0b3IgY2xhc3Nlcy5cbiAqXG4gKiBAc2VlIGF3YXkuYW5pbWF0b3JzLkFuaW1hdG9yQmFzZVxuICovXG5jbGFzcyBBbmltYXRpb25TZXRCYXNlIGV4dGVuZHMgTmFtZWRBc3NldEJhc2UgaW1wbGVtZW50cyBJQXNzZXRcbntcblx0cHJpdmF0ZSBfdXNlc0NQVTpib29sZWFuO1xuXHRwcml2YXRlIF9hbmltYXRpb25zOkFycmF5PEFuaW1hdGlvbk5vZGVCYXNlPiA9IG5ldyBBcnJheTxBbmltYXRpb25Ob2RlQmFzZT4oKTtcblx0cHJpdmF0ZSBfYW5pbWF0aW9uTmFtZXM6QXJyYXk8c3RyaW5nPiA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XG5cdHByaXZhdGUgX2FuaW1hdGlvbkRpY3Rpb25hcnk6T2JqZWN0ID0gbmV3IE9iamVjdCgpO1xuXG5cdGNvbnN0cnVjdG9yKClcblx0e1xuXHRcdHN1cGVyKCk7XG5cdH1cblxuXHQvKipcblx0ICogUmV0cmlldmVzIGEgdGVtcG9yYXJ5IEdQVSByZWdpc3RlciB0aGF0J3Mgc3RpbGwgZnJlZS5cblx0ICpcblx0ICogQHBhcmFtIGV4Y2x1ZGUgQW4gYXJyYXkgb2Ygbm9uLWZyZWUgdGVtcG9yYXJ5IHJlZ2lzdGVycy5cblx0ICogQHBhcmFtIGV4Y2x1ZGVBbm90aGVyIEFuIGFkZGl0aW9uYWwgcmVnaXN0ZXIgdGhhdCdzIG5vdCBmcmVlLlxuXHQgKiBAcmV0dXJuIEEgdGVtcG9yYXJ5IHJlZ2lzdGVyIHRoYXQgY2FuIGJlIHVzZWQuXG5cdCAqL1xuXHRwdWJsaWMgX3BGaW5kVGVtcFJlZyhleGNsdWRlOkFycmF5PHN0cmluZz4sIGV4Y2x1ZGVBbm90aGVyOnN0cmluZyA9IG51bGwpOnN0cmluZ1xuXHR7XG5cdFx0dmFyIGk6bnVtYmVyIC8qdWludCovID0gMDtcblx0XHR2YXIgcmVnOnN0cmluZztcblxuXHRcdHdoaWxlICh0cnVlKSB7XG5cdFx0XHRyZWcgPSBcInZ0XCIgKyBpO1xuXHRcdFx0aWYgKGV4Y2x1ZGUuaW5kZXhPZihyZWcpID09IC0xICYmIGV4Y2x1ZGVBbm90aGVyICE9IHJlZylcblx0XHRcdFx0cmV0dXJuIHJlZztcblx0XHRcdCsraTtcblx0XHR9XG5cblx0XHQvLyBjYW4ndCBiZSByZWFjaGVkXG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblxuXHQvKipcblx0ICogSW5kaWNhdGVzIHdoZXRoZXIgdGhlIHByb3BlcnRpZXMgb2YgdGhlIGFuaW1hdGlvbiBkYXRhIGNvbnRhaW5lZCB3aXRoaW4gdGhlIHNldCBjb21iaW5lZCB3aXRoXG5cdCAqIHRoZSB2ZXJ0ZXggcmVnaXN0ZXJzIGFscmVhZHkgaW4gdXNlIG9uIHNoYWRpbmcgbWF0ZXJpYWxzIGFsbG93cyB0aGUgYW5pbWF0aW9uIGRhdGEgdG8gdXRpbGlzZVxuXHQgKiBHUFUgY2FsbHMuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IHVzZXNDUFUoKTpib29sZWFuXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fdXNlc0NQVTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDYWxsZWQgYnkgdGhlIG1hdGVyaWFsIHRvIHJlc2V0IHRoZSBHUFUgaW5kaWNhdG9yIGJlZm9yZSB0ZXN0aW5nIHdoZXRoZXIgcmVnaXN0ZXIgc3BhY2UgaW4gdGhlIHNoYWRlclxuXHQgKiBpcyBhdmFpbGFibGUgZm9yIHJ1bm5pbmcgR1BVLWJhc2VkIGFuaW1hdGlvbiBjb2RlLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0cHVibGljIHJlc2V0R1BVQ29tcGF0aWJpbGl0eSgpXG5cdHtcblx0XHR0aGlzLl91c2VzQ1BVID0gZmFsc2U7XG5cdH1cblxuXHRwdWJsaWMgY2FuY2VsR1BVQ29tcGF0aWJpbGl0eSgpXG5cdHtcblx0XHR0aGlzLl91c2VzQ1BVID0gdHJ1ZTtcblx0fVxuXG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgZ2V0QUdBTFZlcnRleENvZGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UpOnN0cmluZ1xuXHR7XG5cdFx0dGhyb3cgbmV3IEFic3RyYWN0TWV0aG9kRXJyb3IoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGFjdGl2YXRlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCBzdGFnZTpTdGFnZSlcblx0e1xuXHRcdHRocm93IG5ldyBBYnN0cmFjdE1ldGhvZEVycm9yKCk7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBkZWFjdGl2YXRlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCBzdGFnZTpTdGFnZSlcblx0e1xuXHRcdHRocm93IG5ldyBBYnN0cmFjdE1ldGhvZEVycm9yKCk7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBnZXRBR0FMRnJhZ21lbnRDb2RlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCBzaGFkZWRUYXJnZXQ6c3RyaW5nKTpzdHJpbmdcblx0e1xuXHRcdHRocm93IG5ldyBBYnN0cmFjdE1ldGhvZEVycm9yKCk7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBnZXRBR0FMVVZDb2RlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlKTpzdHJpbmdcblx0e1xuXHRcdHRocm93IG5ldyBBYnN0cmFjdE1ldGhvZEVycm9yKCk7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBkb25lQUdBTENvZGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UpXG5cdHtcblx0XHR0aHJvdyBuZXcgQWJzdHJhY3RNZXRob2RFcnJvcigpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGFzc2V0VHlwZSgpOnN0cmluZ1xuXHR7XG5cdFx0cmV0dXJuIEFzc2V0VHlwZS5BTklNQVRJT05fU0VUO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgYSB2ZWN0b3Igb2YgYW5pbWF0aW9uIHN0YXRlIG9iamVjdHMgdGhhdCBtYWtlIHVwIHRoZSBjb250ZW50cyBvZiB0aGUgYW5pbWF0aW9uIGRhdGEgc2V0LlxuXHQgKi9cblx0cHVibGljIGdldCBhbmltYXRpb25zKCk6QXJyYXk8QW5pbWF0aW9uTm9kZUJhc2U+XG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fYW5pbWF0aW9ucztcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIGEgdmVjdG9yIG9mIGFuaW1hdGlvbiBzdGF0ZSBvYmplY3RzIHRoYXQgbWFrZSB1cCB0aGUgY29udGVudHMgb2YgdGhlIGFuaW1hdGlvbiBkYXRhIHNldC5cblx0ICovXG5cdHB1YmxpYyBnZXQgYW5pbWF0aW9uTmFtZXMoKTpBcnJheTxzdHJpbmc+XG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fYW5pbWF0aW9uTmFtZXM7XG5cdH1cblxuXHQvKipcblx0ICogQ2hlY2sgdG8gZGV0ZXJtaW5lIHdoZXRoZXIgYSBzdGF0ZSBpcyByZWdpc3RlcmVkIGluIHRoZSBhbmltYXRpb24gc2V0IHVuZGVyIHRoZSBnaXZlbiBuYW1lLlxuXHQgKlxuXHQgKiBAcGFyYW0gc3RhdGVOYW1lIFRoZSBuYW1lIG9mIHRoZSBhbmltYXRpb24gc3RhdGUgb2JqZWN0IHRvIGJlIGNoZWNrZWQuXG5cdCAqL1xuXHRwdWJsaWMgaGFzQW5pbWF0aW9uKG5hbWU6c3RyaW5nKTpib29sZWFuXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fYW5pbWF0aW9uRGljdGlvbmFyeVtuYW1lXSAhPSBudWxsO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHJpZXZlcyB0aGUgYW5pbWF0aW9uIHN0YXRlIG9iamVjdCByZWdpc3RlcmVkIGluIHRoZSBhbmltYXRpb24gZGF0YSBzZXQgdW5kZXIgdGhlIGdpdmVuIG5hbWUuXG5cdCAqXG5cdCAqIEBwYXJhbSBzdGF0ZU5hbWUgVGhlIG5hbWUgb2YgdGhlIGFuaW1hdGlvbiBzdGF0ZSBvYmplY3QgdG8gYmUgcmV0cmlldmVkLlxuXHQgKi9cblx0cHVibGljIGdldEFuaW1hdGlvbihuYW1lOnN0cmluZyk6QW5pbWF0aW9uTm9kZUJhc2Vcblx0e1xuXHRcdHJldHVybiB0aGlzLl9hbmltYXRpb25EaWN0aW9uYXJ5W25hbWVdO1xuXHR9XG5cblx0LyoqXG5cdCAqIEFkZHMgYW4gYW5pbWF0aW9uIHN0YXRlIG9iamVjdCB0byB0aGUgYW5pYW10aW9uIGRhdGEgc2V0IHVuZGVyIHRoZSBnaXZlbiBuYW1lLlxuXHQgKlxuXHQgKiBAcGFyYW0gc3RhdGVOYW1lIFRoZSBuYW1lIHVuZGVyIHdoaWNoIHRoZSBhbmltYXRpb24gc3RhdGUgb2JqZWN0IHdpbGwgYmUgc3RvcmVkLlxuXHQgKiBAcGFyYW0gYW5pbWF0aW9uU3RhdGUgVGhlIGFuaW1hdGlvbiBzdGF0ZSBvYmplY3QgdG8gYmUgc3Rhb3JlZCBpbiB0aGUgc2V0LlxuXHQgKi9cblx0cHVibGljIGFkZEFuaW1hdGlvbihub2RlOkFuaW1hdGlvbk5vZGVCYXNlKVxuXHR7XG5cdFx0aWYgKHRoaXMuX2FuaW1hdGlvbkRpY3Rpb25hcnlbbm9kZS5uYW1lXSlcblx0XHRcdHRocm93IG5ldyBBbmltYXRpb25TZXRFcnJvcihcInJvb3Qgbm9kZSBuYW1lICdcIiArIG5vZGUubmFtZSArIFwiJyBhbHJlYWR5IGV4aXN0cyBpbiB0aGUgc2V0XCIpO1xuXG5cdFx0dGhpcy5fYW5pbWF0aW9uRGljdGlvbmFyeVtub2RlLm5hbWVdID0gbm9kZTtcblxuXHRcdHRoaXMuX2FuaW1hdGlvbnMucHVzaChub2RlKTtcblxuXHRcdHRoaXMuX2FuaW1hdGlvbk5hbWVzLnB1c2gobm9kZS5uYW1lKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDbGVhbnMgdXAgYW55IHJlc291cmNlcyB1c2VkIGJ5IHRoZSBjdXJyZW50IG9iamVjdC5cblx0ICovXG5cdHB1YmxpYyBkaXNwb3NlKClcblx0e1xuXHR9XG59XG5cbmV4cG9ydCA9IEFuaW1hdGlvblNldEJhc2U7Il19