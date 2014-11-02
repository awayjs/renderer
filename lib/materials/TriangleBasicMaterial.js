var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Texture2DBase = require("awayjs-core/lib/textures/Texture2DBase");
var BlendMode = require("awayjs-display/lib/base/BlendMode");
var ContextGLCompareMode = require("awayjs-stagegl/lib/base/ContextGLCompareMode");
var TriangleMaterialBase = require("awayjs-renderergl/lib/materials/TriangleMaterialBase");
var TriangleBasicPass = require("awayjs-renderergl/lib/materials/passes/TriangleBasicPass");
/**
 * TriangleMaterial forms an abstract base class for the default shaded materials provided by Stage,
 * using material methods to define their appearance.
 */
var TriangleBasicMaterial = (function (_super) {
    __extends(TriangleBasicMaterial, _super);
    function TriangleBasicMaterial(textureColor, smoothAlpha, repeat, mipmap) {
        if (textureColor === void 0) { textureColor = null; }
        if (smoothAlpha === void 0) { smoothAlpha = null; }
        if (repeat === void 0) { repeat = false; }
        if (mipmap === void 0) { mipmap = false; }
        _super.call(this);
        this._alphaBlending = false;
        this._alpha = 1;
        this._depthCompareMode = ContextGLCompareMode.LESS_EQUAL;
        this._screenPass = new TriangleBasicPass();
        if (textureColor instanceof Texture2DBase) {
            this.texture = textureColor;
            this.smooth = (smoothAlpha == null) ? true : false;
            this.repeat = repeat;
            this.mipmap = mipmap;
        }
        else {
            this.color = textureColor ? Number(textureColor) : 0xCCCCCC;
            this.alpha = (smoothAlpha == null) ? 1 : Number(smoothAlpha);
        }
    }
    Object.defineProperty(TriangleBasicMaterial.prototype, "depthCompareMode", {
        /**
         * The depth compare mode used to render the renderables using this material.
         *
         * @see away.stagegl.ContextGLCompareMode
         */
        get: function () {
            return this._depthCompareMode;
        },
        set: function (value) {
            if (this._depthCompareMode == value)
                return;
            this._depthCompareMode = value;
            this._pInvalidatePasses();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TriangleBasicMaterial.prototype, "alpha", {
        /**
         * The alpha of the surface.
         */
        get: function () {
            return this._alpha;
        },
        set: function (value) {
            if (value > 1)
                value = 1;
            else if (value < 0)
                value = 0;
            if (this._alpha == value)
                return;
            this._alpha = value;
            this._pInvalidatePasses();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TriangleBasicMaterial.prototype, "alphaBlending", {
        /**
         * Indicates whether or not the material has transparency. If binary transparency is sufficient, for
         * example when using textures of foliage, consider using alphaThreshold instead.
         */
        get: function () {
            return this._alphaBlending;
        },
        set: function (value) {
            if (this._alphaBlending == value)
                return;
            this._alphaBlending = value;
            this._pInvalidatePasses();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    TriangleBasicMaterial.prototype.iUpdateMaterial = function () {
        var passesInvalid;
        if (this._pScreenPassesInvalid) {
            this.pUpdateScreenPasses();
            passesInvalid = true;
        }
        if (passesInvalid) {
            this._pClearScreenPasses();
            this._pAddScreenPass(this._screenPass);
        }
    };
    /**
     * Updates screen passes when they were found to be invalid.
     */
    TriangleBasicMaterial.prototype.pUpdateScreenPasses = function () {
        this.initPasses();
        this.setBlendAndCompareModes();
        this._pScreenPassesInvalid = false;
    };
    /**
     * Initializes all the passes and their dependent passes.
     */
    TriangleBasicMaterial.prototype.initPasses = function () {
        //
    };
    /**
     * Sets up the various blending modes for all screen passes, based on whether or not there are previous passes.
     */
    TriangleBasicMaterial.prototype.setBlendAndCompareModes = function () {
        this._pRequiresBlending = (this._pBlendMode != BlendMode.NORMAL || this._alphaBlending || this._alpha < 1);
        this._screenPass.depthCompareMode = this._depthCompareMode;
        this._screenPass.preserveAlpha = this._pRequiresBlending;
        this._screenPass.setBlendMode((this._pBlendMode == BlendMode.NORMAL && this._pRequiresBlending) ? BlendMode.LAYER : this._pBlendMode);
        this._screenPass.forceSeparateMVP = false;
    };
    return TriangleBasicMaterial;
})(TriangleMaterialBase);
module.exports = TriangleBasicMaterial;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvdHJpYW5nbGViYXNpY21hdGVyaWFsLnRzIl0sIm5hbWVzIjpbIlRyaWFuZ2xlQmFzaWNNYXRlcmlhbCIsIlRyaWFuZ2xlQmFzaWNNYXRlcmlhbC5jb25zdHJ1Y3RvciIsIlRyaWFuZ2xlQmFzaWNNYXRlcmlhbC5kZXB0aENvbXBhcmVNb2RlIiwiVHJpYW5nbGVCYXNpY01hdGVyaWFsLmFscGhhIiwiVHJpYW5nbGVCYXNpY01hdGVyaWFsLmFscGhhQmxlbmRpbmciLCJUcmlhbmdsZUJhc2ljTWF0ZXJpYWwuaVVwZGF0ZU1hdGVyaWFsIiwiVHJpYW5nbGVCYXNpY01hdGVyaWFsLnBVcGRhdGVTY3JlZW5QYXNzZXMiLCJUcmlhbmdsZUJhc2ljTWF0ZXJpYWwuaW5pdFBhc3NlcyIsIlRyaWFuZ2xlQmFzaWNNYXRlcmlhbC5zZXRCbGVuZEFuZENvbXBhcmVNb2RlcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsSUFBTyxhQUFhLFdBQWMsd0NBQXdDLENBQUMsQ0FBQztBQUU1RSxJQUFPLFNBQVMsV0FBZSxtQ0FBbUMsQ0FBQyxDQUFDO0FBRXBFLElBQU8sb0JBQW9CLFdBQWEsOENBQThDLENBQUMsQ0FBQztBQUV4RixJQUFPLG9CQUFvQixXQUFhLHNEQUFzRCxDQUFDLENBQUM7QUFDaEcsSUFBTyxpQkFBaUIsV0FBYSwwREFBMEQsQ0FBQyxDQUFDO0FBRWpHLEFBSUE7OztHQURHO0lBQ0cscUJBQXFCO0lBQVNBLFVBQTlCQSxxQkFBcUJBLFVBQTZCQTtJQW1CdkRBLFNBbkJLQSxxQkFBcUJBLENBbUJkQSxZQUF1QkEsRUFBRUEsV0FBc0JBLEVBQUVBLE1BQXNCQSxFQUFFQSxNQUFzQkE7UUFBL0ZDLDRCQUF1QkEsR0FBdkJBLG1CQUF1QkE7UUFBRUEsMkJBQXNCQSxHQUF0QkEsa0JBQXNCQTtRQUFFQSxzQkFBc0JBLEdBQXRCQSxjQUFzQkE7UUFBRUEsc0JBQXNCQSxHQUF0QkEsY0FBc0JBO1FBRTFHQSxp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Q0Esa0JBQWtCQSxDQUFDQTtRQUN6REEsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsWUFBWUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsV0FBV0EsSUFBSUEsU0FBU0EsQ0FBQ0EsTUFBTUEsSUFBSUEsSUFBSUEsQ0FBQ0Esa0JBQWtCQSxDQUFDQSxHQUFFQSxTQUFTQSxDQUFDQSxLQUFLQSxHQUFHQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQTtRQUNySUEsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsZ0JBQWdCQSxHQUFHQSxLQUFLQSxDQUFDQTtJQUMzQ0EsQ0FBQ0E7SUFDRlIsNEJBQUNBO0FBQURBLENBdEpBLEFBc0pDQSxFQXRKbUMsb0JBQW9CLEVBc0p2RDtBQUVELEFBQStCLGlCQUF0QixxQkFBcUIsQ0FBQyIsImZpbGUiOiJtYXRlcmlhbHMvVHJpYW5nbGVCYXNpY01hdGVyaWFsLmpzIiwic291cmNlUm9vdCI6Ii4uLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBUZXh0dXJlMkRCYXNlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvdGV4dHVyZXMvVGV4dHVyZTJEQmFzZVwiKTtcblxuaW1wb3J0IEJsZW5kTW9kZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvYmFzZS9CbGVuZE1vZGVcIik7XG5cbmltcG9ydCBDb250ZXh0R0xDb21wYXJlTW9kZVx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9iYXNlL0NvbnRleHRHTENvbXBhcmVNb2RlXCIpO1xuXG5pbXBvcnQgVHJpYW5nbGVNYXRlcmlhbEJhc2VcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvbWF0ZXJpYWxzL1RyaWFuZ2xlTWF0ZXJpYWxCYXNlXCIpO1xuaW1wb3J0IFRyaWFuZ2xlQmFzaWNQYXNzXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL21hdGVyaWFscy9wYXNzZXMvVHJpYW5nbGVCYXNpY1Bhc3NcIik7XG5cbi8qKlxuICogVHJpYW5nbGVNYXRlcmlhbCBmb3JtcyBhbiBhYnN0cmFjdCBiYXNlIGNsYXNzIGZvciB0aGUgZGVmYXVsdCBzaGFkZWQgbWF0ZXJpYWxzIHByb3ZpZGVkIGJ5IFN0YWdlLFxuICogdXNpbmcgbWF0ZXJpYWwgbWV0aG9kcyB0byBkZWZpbmUgdGhlaXIgYXBwZWFyYW5jZS5cbiAqL1xuY2xhc3MgVHJpYW5nbGVCYXNpY01hdGVyaWFsIGV4dGVuZHMgVHJpYW5nbGVNYXRlcmlhbEJhc2Vcbntcblx0cHJpdmF0ZSBfc2NyZWVuUGFzczpUcmlhbmdsZUJhc2ljUGFzcztcblxuXHRwcml2YXRlIF9hbHBoYUJsZW5kaW5nOmJvb2xlYW4gPSBmYWxzZTtcblx0cHJpdmF0ZSBfYWxwaGE6bnVtYmVyID0gMTtcblxuXHRwcml2YXRlIF9kZXB0aENvbXBhcmVNb2RlOnN0cmluZyA9IENvbnRleHRHTENvbXBhcmVNb2RlLkxFU1NfRVFVQUw7XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBuZXcgVHJpYW5nbGVNYXRlcmlhbCBvYmplY3QuXG5cdCAqXG5cdCAqIEBwYXJhbSB0ZXh0dXJlIFRoZSB0ZXh0dXJlIHVzZWQgZm9yIHRoZSBtYXRlcmlhbCdzIGFsYmVkbyBjb2xvci5cblx0ICogQHBhcmFtIHNtb290aCBJbmRpY2F0ZXMgd2hldGhlciB0aGUgdGV4dHVyZSBzaG91bGQgYmUgZmlsdGVyZWQgd2hlbiBzYW1wbGVkLiBEZWZhdWx0cyB0byB0cnVlLlxuXHQgKiBAcGFyYW0gcmVwZWF0IEluZGljYXRlcyB3aGV0aGVyIHRoZSB0ZXh0dXJlIHNob3VsZCBiZSB0aWxlZCB3aGVuIHNhbXBsZWQuIERlZmF1bHRzIHRvIGZhbHNlLlxuXHQgKiBAcGFyYW0gbWlwbWFwIEluZGljYXRlcyB3aGV0aGVyIG9yIG5vdCBhbnkgdXNlZCB0ZXh0dXJlcyBzaG91bGQgdXNlIG1pcG1hcHBpbmcuIERlZmF1bHRzIHRvIGZhbHNlLlxuXHQgKi9cblx0Y29uc3RydWN0b3IodGV4dHVyZT86VGV4dHVyZTJEQmFzZSwgc21vb3RoPzpib29sZWFuLCByZXBlYXQ/OmJvb2xlYW4sIG1pcG1hcD86Ym9vbGVhbik7XG5cdGNvbnN0cnVjdG9yKGNvbG9yPzpudW1iZXIsIGFscGhhPzpudW1iZXIpO1xuXHRjb25zdHJ1Y3Rvcih0ZXh0dXJlQ29sb3I6YW55ID0gbnVsbCwgc21vb3RoQWxwaGE6YW55ID0gbnVsbCwgcmVwZWF0OmJvb2xlYW4gPSBmYWxzZSwgbWlwbWFwOmJvb2xlYW4gPSBmYWxzZSlcblx0e1xuXHRcdHN1cGVyKCk7XG5cblx0XHR0aGlzLl9zY3JlZW5QYXNzID0gbmV3IFRyaWFuZ2xlQmFzaWNQYXNzKCk7XG5cblx0XHRpZiAodGV4dHVyZUNvbG9yIGluc3RhbmNlb2YgVGV4dHVyZTJEQmFzZSkge1xuXHRcdFx0dGhpcy50ZXh0dXJlID0gPFRleHR1cmUyREJhc2U+IHRleHR1cmVDb2xvcjtcblxuXHRcdFx0dGhpcy5zbW9vdGggPSAoc21vb3RoQWxwaGEgPT0gbnVsbCk/IHRydWUgOiBmYWxzZTtcblx0XHRcdHRoaXMucmVwZWF0ID0gcmVwZWF0O1xuXHRcdFx0dGhpcy5taXBtYXAgPSBtaXBtYXA7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuY29sb3IgPSB0ZXh0dXJlQ29sb3I/IE51bWJlcih0ZXh0dXJlQ29sb3IpIDogMHhDQ0NDQ0M7XG5cdFx0XHR0aGlzLmFscGhhID0gKHNtb290aEFscGhhID09IG51bGwpPyAxIDogTnVtYmVyKHNtb290aEFscGhhKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogVGhlIGRlcHRoIGNvbXBhcmUgbW9kZSB1c2VkIHRvIHJlbmRlciB0aGUgcmVuZGVyYWJsZXMgdXNpbmcgdGhpcyBtYXRlcmlhbC5cblx0ICpcblx0ICogQHNlZSBhd2F5LnN0YWdlZ2wuQ29udGV4dEdMQ29tcGFyZU1vZGVcblx0ICovXG5cblx0cHVibGljIGdldCBkZXB0aENvbXBhcmVNb2RlKCk6c3RyaW5nXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fZGVwdGhDb21wYXJlTW9kZTtcblx0fVxuXG5cdHB1YmxpYyBzZXQgZGVwdGhDb21wYXJlTW9kZSh2YWx1ZTpzdHJpbmcpXG5cdHtcblx0XHRpZiAodGhpcy5fZGVwdGhDb21wYXJlTW9kZSA9PSB2YWx1ZSlcblx0XHRcdHJldHVybjtcblxuXHRcdHRoaXMuX2RlcHRoQ29tcGFyZU1vZGUgPSB2YWx1ZTtcblxuXHRcdHRoaXMuX3BJbnZhbGlkYXRlUGFzc2VzKCk7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIGFscGhhIG9mIHRoZSBzdXJmYWNlLlxuXHQgKi9cblx0cHVibGljIGdldCBhbHBoYSgpOm51bWJlclxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX2FscGhhO1xuXHR9XG5cblx0cHVibGljIHNldCBhbHBoYSh2YWx1ZTpudW1iZXIpXG5cdHtcblx0XHRpZiAodmFsdWUgPiAxKVxuXHRcdFx0dmFsdWUgPSAxO1xuXHRcdGVsc2UgaWYgKHZhbHVlIDwgMClcblx0XHRcdHZhbHVlID0gMDtcblxuXHRcdGlmICh0aGlzLl9hbHBoYSA9PSB2YWx1ZSlcblx0XHRcdHJldHVybjtcblxuXHRcdHRoaXMuX2FscGhhID0gdmFsdWU7XG5cblx0XHR0aGlzLl9wSW52YWxpZGF0ZVBhc3NlcygpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEluZGljYXRlcyB3aGV0aGVyIG9yIG5vdCB0aGUgbWF0ZXJpYWwgaGFzIHRyYW5zcGFyZW5jeS4gSWYgYmluYXJ5IHRyYW5zcGFyZW5jeSBpcyBzdWZmaWNpZW50LCBmb3Jcblx0ICogZXhhbXBsZSB3aGVuIHVzaW5nIHRleHR1cmVzIG9mIGZvbGlhZ2UsIGNvbnNpZGVyIHVzaW5nIGFscGhhVGhyZXNob2xkIGluc3RlYWQuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGFscGhhQmxlbmRpbmcoKTpib29sZWFuXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fYWxwaGFCbGVuZGluZztcblx0fVxuXG5cdHB1YmxpYyBzZXQgYWxwaGFCbGVuZGluZyh2YWx1ZTpib29sZWFuKVxuXHR7XG5cdFx0aWYgKHRoaXMuX2FscGhhQmxlbmRpbmcgPT0gdmFsdWUpXG5cdFx0XHRyZXR1cm47XG5cblx0XHR0aGlzLl9hbHBoYUJsZW5kaW5nID0gdmFsdWU7XG5cblx0XHR0aGlzLl9wSW52YWxpZGF0ZVBhc3NlcygpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgaVVwZGF0ZU1hdGVyaWFsKClcblx0e1xuXHRcdHZhciBwYXNzZXNJbnZhbGlkOmJvb2xlYW47XG5cblx0XHRpZiAodGhpcy5fcFNjcmVlblBhc3Nlc0ludmFsaWQpIHtcblx0XHRcdHRoaXMucFVwZGF0ZVNjcmVlblBhc3NlcygpO1xuXHRcdFx0cGFzc2VzSW52YWxpZCA9IHRydWU7XG5cdFx0fVxuXG5cdFx0aWYgKHBhc3Nlc0ludmFsaWQpIHtcblx0XHRcdHRoaXMuX3BDbGVhclNjcmVlblBhc3NlcygpO1xuXG5cdFx0XHR0aGlzLl9wQWRkU2NyZWVuUGFzcyh0aGlzLl9zY3JlZW5QYXNzKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogVXBkYXRlcyBzY3JlZW4gcGFzc2VzIHdoZW4gdGhleSB3ZXJlIGZvdW5kIHRvIGJlIGludmFsaWQuXG5cdCAqL1xuXHRwdWJsaWMgcFVwZGF0ZVNjcmVlblBhc3NlcygpXG5cdHtcblx0XHR0aGlzLmluaXRQYXNzZXMoKTtcblxuXHRcdHRoaXMuc2V0QmxlbmRBbmRDb21wYXJlTW9kZXMoKTtcblxuXHRcdHRoaXMuX3BTY3JlZW5QYXNzZXNJbnZhbGlkID0gZmFsc2U7XG5cdH1cblxuXHQvKipcblx0ICogSW5pdGlhbGl6ZXMgYWxsIHRoZSBwYXNzZXMgYW5kIHRoZWlyIGRlcGVuZGVudCBwYXNzZXMuXG5cdCAqL1xuXHRwcml2YXRlIGluaXRQYXNzZXMoKVxuXHR7XG5cdFx0Ly9cblx0fVxuXG5cdC8qKlxuXHQgKiBTZXRzIHVwIHRoZSB2YXJpb3VzIGJsZW5kaW5nIG1vZGVzIGZvciBhbGwgc2NyZWVuIHBhc3NlcywgYmFzZWQgb24gd2hldGhlciBvciBub3QgdGhlcmUgYXJlIHByZXZpb3VzIHBhc3Nlcy5cblx0ICovXG5cdHByaXZhdGUgc2V0QmxlbmRBbmRDb21wYXJlTW9kZXMoKVxuXHR7XG5cdFx0dGhpcy5fcFJlcXVpcmVzQmxlbmRpbmcgPSAodGhpcy5fcEJsZW5kTW9kZSAhPSBCbGVuZE1vZGUuTk9STUFMIHx8IHRoaXMuX2FscGhhQmxlbmRpbmcgfHwgdGhpcy5fYWxwaGEgPCAxKTtcblx0XHR0aGlzLl9zY3JlZW5QYXNzLmRlcHRoQ29tcGFyZU1vZGUgPSB0aGlzLl9kZXB0aENvbXBhcmVNb2RlO1xuXHRcdHRoaXMuX3NjcmVlblBhc3MucHJlc2VydmVBbHBoYSA9IHRoaXMuX3BSZXF1aXJlc0JsZW5kaW5nO1xuXHRcdHRoaXMuX3NjcmVlblBhc3Muc2V0QmxlbmRNb2RlKCh0aGlzLl9wQmxlbmRNb2RlID09IEJsZW5kTW9kZS5OT1JNQUwgJiYgdGhpcy5fcFJlcXVpcmVzQmxlbmRpbmcpPyBCbGVuZE1vZGUuTEFZRVIgOiB0aGlzLl9wQmxlbmRNb2RlKTtcblx0XHR0aGlzLl9zY3JlZW5QYXNzLmZvcmNlU2VwYXJhdGVNVlAgPSBmYWxzZTtcblx0fVxufVxuXG5leHBvcnQgPSBUcmlhbmdsZUJhc2ljTWF0ZXJpYWw7Il19