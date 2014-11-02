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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvYW5pbWF0aW9uc2V0YmFzZS50cyJdLCJuYW1lcyI6WyJBbmltYXRpb25TZXRCYXNlIiwiQW5pbWF0aW9uU2V0QmFzZS5jb25zdHJ1Y3RvciIsIkFuaW1hdGlvblNldEJhc2UuX3BGaW5kVGVtcFJlZyIsIkFuaW1hdGlvblNldEJhc2UudXNlc0NQVSIsIkFuaW1hdGlvblNldEJhc2UucmVzZXRHUFVDb21wYXRpYmlsaXR5IiwiQW5pbWF0aW9uU2V0QmFzZS5jYW5jZWxHUFVDb21wYXRpYmlsaXR5IiwiQW5pbWF0aW9uU2V0QmFzZS5nZXRBR0FMVmVydGV4Q29kZSIsIkFuaW1hdGlvblNldEJhc2UuYWN0aXZhdGUiLCJBbmltYXRpb25TZXRCYXNlLmRlYWN0aXZhdGUiLCJBbmltYXRpb25TZXRCYXNlLmdldEFHQUxGcmFnbWVudENvZGUiLCJBbmltYXRpb25TZXRCYXNlLmdldEFHQUxVVkNvZGUiLCJBbmltYXRpb25TZXRCYXNlLmRvbmVBR0FMQ29kZSIsIkFuaW1hdGlvblNldEJhc2UuYXNzZXRUeXBlIiwiQW5pbWF0aW9uU2V0QmFzZS5hbmltYXRpb25zIiwiQW5pbWF0aW9uU2V0QmFzZS5hbmltYXRpb25OYW1lcyIsIkFuaW1hdGlvblNldEJhc2UuaGFzQW5pbWF0aW9uIiwiQW5pbWF0aW9uU2V0QmFzZS5nZXRBbmltYXRpb24iLCJBbmltYXRpb25TZXRCYXNlLmFkZEFuaW1hdGlvbiIsIkFuaW1hdGlvblNldEJhc2UuZGlzcG9zZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsSUFBTyxTQUFTLFdBQWUsbUNBQW1DLENBQUMsQ0FBQztBQUVwRSxJQUFPLGNBQWMsV0FBYyx3Q0FBd0MsQ0FBQyxDQUFDO0FBQzdFLElBQU8sbUJBQW1CLFdBQWEsNENBQTRDLENBQUMsQ0FBQztBQU1yRixJQUFPLGlCQUFpQixXQUFhLGdEQUFnRCxDQUFDLENBQUM7QUFJdkYsQUFLQTs7OztHQURHO0lBQ0csZ0JBQWdC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a0w1QztBQUVELEFBQTBCLGlCQUFqQixnQkFBZ0IsQ0FBQyIsImZpbGUiOiJhbmltYXRvcnMvQW5pbWF0aW9uU2V0QmFzZS5qcyIsInNvdXJjZVJvb3QiOiIuLi8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQXNzZXRUeXBlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9saWJyYXJ5L0Fzc2V0VHlwZVwiKTtcbmltcG9ydCBJQXNzZXRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvbGlicmFyeS9JQXNzZXRcIik7XG5pbXBvcnQgTmFtZWRBc3NldEJhc2VcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9saWJyYXJ5L05hbWVkQXNzZXRCYXNlXCIpO1xuaW1wb3J0IEFic3RyYWN0TWV0aG9kRXJyb3JcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZXJyb3JzL0Fic3RyYWN0TWV0aG9kRXJyb3JcIik7XG5cbmltcG9ydCBBbmltYXRpb25Ob2RlQmFzZVx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9hbmltYXRvcnMvbm9kZXMvQW5pbWF0aW9uTm9kZUJhc2VcIik7XG5cbmltcG9ydCBTdGFnZVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9iYXNlL1N0YWdlXCIpO1xuXG5pbXBvcnQgQW5pbWF0aW9uU2V0RXJyb3JcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvZXJyb3JzL0FuaW1hdGlvblNldEVycm9yXCIpO1xuaW1wb3J0IFNoYWRlck9iamVjdEJhc2VcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvY29tcGlsYXRpb24vU2hhZGVyT2JqZWN0QmFzZVwiKTtcbmltcG9ydCBTaGFkZXJSZWdpc3RlckVsZW1lbnRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL21hdGVyaWFscy9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckVsZW1lbnRcIik7XG5cbi8qKlxuICogUHJvdmlkZXMgYW4gYWJzdHJhY3QgYmFzZSBjbGFzcyBmb3IgZGF0YSBzZXQgY2xhc3NlcyB0aGF0IGhvbGQgYW5pbWF0aW9uIGRhdGEgZm9yIHVzZSBpbiBhbmltYXRvciBjbGFzc2VzLlxuICpcbiAqIEBzZWUgYXdheS5hbmltYXRvcnMuQW5pbWF0b3JCYXNlXG4gKi9cbmNsYXNzIEFuaW1hdGlvblNldEJhc2UgZXh0ZW5kcyBOYW1lZEFzc2V0QmFzZSBpbXBsZW1lbnRzIElBc3NldFxue1xuXHRwcml2YXRlIF91c2VzQ1BVOmJvb2xlYW47XG5cdHByaXZhdGUgX2FuaW1hdGlvbnM6QXJyYXk8QW5pbWF0aW9uTm9kZUJhc2U+ID0gbmV3IEFycmF5PEFuaW1hdGlvbk5vZGVCYXNlPigpO1xuXHRwcml2YXRlIF9hbmltYXRpb25OYW1lczpBcnJheTxzdHJpbmc+ID0gbmV3IEFycmF5PHN0cmluZz4oKTtcblx0cHJpdmF0ZSBfYW5pbWF0aW9uRGljdGlvbmFyeTpPYmplY3QgPSBuZXcgT2JqZWN0KCk7XG5cblx0Y29uc3RydWN0b3IoKVxuXHR7XG5cdFx0c3VwZXIoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXRyaWV2ZXMgYSB0ZW1wb3JhcnkgR1BVIHJlZ2lzdGVyIHRoYXQncyBzdGlsbCBmcmVlLlxuXHQgKlxuXHQgKiBAcGFyYW0gZXhjbHVkZSBBbiBhcnJheSBvZiBub24tZnJlZSB0ZW1wb3JhcnkgcmVnaXN0ZXJzLlxuXHQgKiBAcGFyYW0gZXhjbHVkZUFub3RoZXIgQW4gYWRkaXRpb25hbCByZWdpc3RlciB0aGF0J3Mgbm90IGZyZWUuXG5cdCAqIEByZXR1cm4gQSB0ZW1wb3JhcnkgcmVnaXN0ZXIgdGhhdCBjYW4gYmUgdXNlZC5cblx0ICovXG5cdHB1YmxpYyBfcEZpbmRUZW1wUmVnKGV4Y2x1ZGU6QXJyYXk8c3RyaW5nPiwgZXhjbHVkZUFub3RoZXI6c3RyaW5nID0gbnVsbCk6c3RyaW5nXG5cdHtcblx0XHR2YXIgaTpudW1iZXIgLyp1aW50Ki8gPSAwO1xuXHRcdHZhciByZWc6c3RyaW5nO1xuXG5cdFx0d2hpbGUgKHRydWUpIHtcblx0XHRcdHJlZyA9IFwidnRcIiArIGk7XG5cdFx0XHRpZiAoZXhjbHVkZS5pbmRleE9mKHJlZykgPT0gLTEgJiYgZXhjbHVkZUFub3RoZXIgIT0gcmVnKVxuXHRcdFx0XHRyZXR1cm4gcmVnO1xuXHRcdFx0KytpO1xuXHRcdH1cblxuXHRcdC8vIGNhbid0IGJlIHJlYWNoZWRcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXG5cdC8qKlxuXHQgKiBJbmRpY2F0ZXMgd2hldGhlciB0aGUgcHJvcGVydGllcyBvZiB0aGUgYW5pbWF0aW9uIGRhdGEgY29udGFpbmVkIHdpdGhpbiB0aGUgc2V0IGNvbWJpbmVkIHdpdGhcblx0ICogdGhlIHZlcnRleCByZWdpc3RlcnMgYWxyZWFkeSBpbiB1c2Ugb24gc2hhZGluZyBtYXRlcmlhbHMgYWxsb3dzIHRoZSBhbmltYXRpb24gZGF0YSB0byB1dGlsaXNlXG5cdCAqIEdQVSBjYWxscy5cblx0ICovXG5cdHB1YmxpYyBnZXQgdXNlc0NQVSgpOmJvb2xlYW5cblx0e1xuXHRcdHJldHVybiB0aGlzLl91c2VzQ1BVO1xuXHR9XG5cblx0LyoqXG5cdCAqIENhbGxlZCBieSB0aGUgbWF0ZXJpYWwgdG8gcmVzZXQgdGhlIEdQVSBpbmRpY2F0b3IgYmVmb3JlIHRlc3Rpbmcgd2hldGhlciByZWdpc3RlciBzcGFjZSBpbiB0aGUgc2hhZGVyXG5cdCAqIGlzIGF2YWlsYWJsZSBmb3IgcnVubmluZyBHUFUtYmFzZWQgYW5pbWF0aW9uIGNvZGUuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRwdWJsaWMgcmVzZXRHUFVDb21wYXRpYmlsaXR5KClcblx0e1xuXHRcdHRoaXMuX3VzZXNDUFUgPSBmYWxzZTtcblx0fVxuXG5cdHB1YmxpYyBjYW5jZWxHUFVDb21wYXRpYmlsaXR5KClcblx0e1xuXHRcdHRoaXMuX3VzZXNDUFUgPSB0cnVlO1xuXHR9XG5cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBnZXRBR0FMVmVydGV4Q29kZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSk6c3RyaW5nXG5cdHtcblx0XHR0aHJvdyBuZXcgQWJzdHJhY3RNZXRob2RFcnJvcigpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgYWN0aXZhdGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIHN0YWdlOlN0YWdlKVxuXHR7XG5cdFx0dGhyb3cgbmV3IEFic3RyYWN0TWV0aG9kRXJyb3IoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGRlYWN0aXZhdGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIHN0YWdlOlN0YWdlKVxuXHR7XG5cdFx0dGhyb3cgbmV3IEFic3RyYWN0TWV0aG9kRXJyb3IoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGdldEFHQUxGcmFnbWVudENvZGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIHNoYWRlZFRhcmdldDpzdHJpbmcpOnN0cmluZ1xuXHR7XG5cdFx0dGhyb3cgbmV3IEFic3RyYWN0TWV0aG9kRXJyb3IoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGdldEFHQUxVVkNvZGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UpOnN0cmluZ1xuXHR7XG5cdFx0dGhyb3cgbmV3IEFic3RyYWN0TWV0aG9kRXJyb3IoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGRvbmVBR0FMQ29kZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSlcblx0e1xuXHRcdHRocm93IG5ldyBBYnN0cmFjdE1ldGhvZEVycm9yKCk7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBnZXQgYXNzZXRUeXBlKCk6c3RyaW5nXG5cdHtcblx0XHRyZXR1cm4gQXNzZXRUeXBlLkFOSU1BVElPTl9TRVQ7XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyBhIHZlY3RvciBvZiBhbmltYXRpb24gc3RhdGUgb2JqZWN0cyB0aGF0IG1ha2UgdXAgdGhlIGNvbnRlbnRzIG9mIHRoZSBhbmltYXRpb24gZGF0YSBzZXQuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGFuaW1hdGlvbnMoKTpBcnJheTxBbmltYXRpb25Ob2RlQmFzZT5cblx0e1xuXHRcdHJldHVybiB0aGlzLl9hbmltYXRpb25zO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgYSB2ZWN0b3Igb2YgYW5pbWF0aW9uIHN0YXRlIG9iamVjdHMgdGhhdCBtYWtlIHVwIHRoZSBjb250ZW50cyBvZiB0aGUgYW5pbWF0aW9uIGRhdGEgc2V0LlxuXHQgKi9cblx0cHVibGljIGdldCBhbmltYXRpb25OYW1lcygpOkFycmF5PHN0cmluZz5cblx0e1xuXHRcdHJldHVybiB0aGlzLl9hbmltYXRpb25OYW1lcztcblx0fVxuXG5cdC8qKlxuXHQgKiBDaGVjayB0byBkZXRlcm1pbmUgd2hldGhlciBhIHN0YXRlIGlzIHJlZ2lzdGVyZWQgaW4gdGhlIGFuaW1hdGlvbiBzZXQgdW5kZXIgdGhlIGdpdmVuIG5hbWUuXG5cdCAqXG5cdCAqIEBwYXJhbSBzdGF0ZU5hbWUgVGhlIG5hbWUgb2YgdGhlIGFuaW1hdGlvbiBzdGF0ZSBvYmplY3QgdG8gYmUgY2hlY2tlZC5cblx0ICovXG5cdHB1YmxpYyBoYXNBbmltYXRpb24obmFtZTpzdHJpbmcpOmJvb2xlYW5cblx0e1xuXHRcdHJldHVybiB0aGlzLl9hbmltYXRpb25EaWN0aW9uYXJ5W25hbWVdICE9IG51bGw7XG5cdH1cblxuXHQvKipcblx0ICogUmV0cmlldmVzIHRoZSBhbmltYXRpb24gc3RhdGUgb2JqZWN0IHJlZ2lzdGVyZWQgaW4gdGhlIGFuaW1hdGlvbiBkYXRhIHNldCB1bmRlciB0aGUgZ2l2ZW4gbmFtZS5cblx0ICpcblx0ICogQHBhcmFtIHN0YXRlTmFtZSBUaGUgbmFtZSBvZiB0aGUgYW5pbWF0aW9uIHN0YXRlIG9iamVjdCB0byBiZSByZXRyaWV2ZWQuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0QW5pbWF0aW9uKG5hbWU6c3RyaW5nKTpBbmltYXRpb25Ob2RlQmFzZVxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX2FuaW1hdGlvbkRpY3Rpb25hcnlbbmFtZV07XG5cdH1cblxuXHQvKipcblx0ICogQWRkcyBhbiBhbmltYXRpb24gc3RhdGUgb2JqZWN0IHRvIHRoZSBhbmlhbXRpb24gZGF0YSBzZXQgdW5kZXIgdGhlIGdpdmVuIG5hbWUuXG5cdCAqXG5cdCAqIEBwYXJhbSBzdGF0ZU5hbWUgVGhlIG5hbWUgdW5kZXIgd2hpY2ggdGhlIGFuaW1hdGlvbiBzdGF0ZSBvYmplY3Qgd2lsbCBiZSBzdG9yZWQuXG5cdCAqIEBwYXJhbSBhbmltYXRpb25TdGF0ZSBUaGUgYW5pbWF0aW9uIHN0YXRlIG9iamVjdCB0byBiZSBzdGFvcmVkIGluIHRoZSBzZXQuXG5cdCAqL1xuXHRwdWJsaWMgYWRkQW5pbWF0aW9uKG5vZGU6QW5pbWF0aW9uTm9kZUJhc2UpXG5cdHtcblx0XHRpZiAodGhpcy5fYW5pbWF0aW9uRGljdGlvbmFyeVtub2RlLm5hbWVdKVxuXHRcdFx0dGhyb3cgbmV3IEFuaW1hdGlvblNldEVycm9yKFwicm9vdCBub2RlIG5hbWUgJ1wiICsgbm9kZS5uYW1lICsgXCInIGFscmVhZHkgZXhpc3RzIGluIHRoZSBzZXRcIik7XG5cblx0XHR0aGlzLl9hbmltYXRpb25EaWN0aW9uYXJ5W25vZGUubmFtZV0gPSBub2RlO1xuXG5cdFx0dGhpcy5fYW5pbWF0aW9ucy5wdXNoKG5vZGUpO1xuXG5cdFx0dGhpcy5fYW5pbWF0aW9uTmFtZXMucHVzaChub2RlLm5hbWUpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENsZWFucyB1cCBhbnkgcmVzb3VyY2VzIHVzZWQgYnkgdGhlIGN1cnJlbnQgb2JqZWN0LlxuXHQgKi9cblx0cHVibGljIGRpc3Bvc2UoKVxuXHR7XG5cdH1cbn1cblxuZXhwb3J0ID0gQW5pbWF0aW9uU2V0QmFzZTsiXX0=