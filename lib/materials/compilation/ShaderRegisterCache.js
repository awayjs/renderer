var RegisterPool = require("awayjs-renderergl/lib/materials/compilation/RegisterPool");
var ShaderRegisterElement = require("awayjs-renderergl/lib/materials/compilation/ShaderRegisterElement");
/**
 * ShaderRegister Cache provides the usage management system for all registers during shading compilation.
 */
var ShaderRegisterCache = (function () {
    /**
     * Create a new ShaderRegisterCache object.
     *
     * @param profile The compatibility profile used by the renderer.
     */
    function ShaderRegisterCache(profile) {
        this._numUsedVertexConstants = 0;
        this._numUsedFragmentConstants = 0;
        this._numUsedStreams = 0;
        this._numUsedTextures = 0;
        this._numUsedVaryings = 0;
        this._profile = profile;
    }
    /**
     * Resets all registers.
     */
    ShaderRegisterCache.prototype.reset = function () {
        this._fragmentTempCache = new RegisterPool("ft", 8, false);
        this._vertexTempCache = new RegisterPool("vt", 8, false);
        this._varyingCache = new RegisterPool("v", 8);
        this._textureCache = new RegisterPool("fs", 8);
        this._vertexAttributesCache = new RegisterPool("va", 8);
        this._fragmentConstantsCache = new RegisterPool("fc", 28);
        this._vertexConstantsCache = new RegisterPool("vc", 128);
        this._fragmentOutputRegister = new ShaderRegisterElement("oc", -1);
        this._vertexOutputRegister = new ShaderRegisterElement("op", -1);
        this._numUsedVertexConstants = 0;
        this._numUsedStreams = 0;
        this._numUsedTextures = 0;
        this._numUsedVaryings = 0;
        this._numUsedFragmentConstants = 0;
        var i;
        for (i = 0; i < this._vertexAttributesOffset; ++i)
            this.getFreeVertexAttribute();
        for (i = 0; i < this._vertexConstantOffset; ++i)
            this.getFreeVertexConstant();
        for (i = 0; i < this._varyingsOffset; ++i)
            this.getFreeVarying();
        for (i = 0; i < this._fragmentConstantOffset; ++i)
            this.getFreeFragmentConstant();
    };
    /**
     * Disposes all resources used.
     */
    ShaderRegisterCache.prototype.dispose = function () {
        this._fragmentTempCache.dispose();
        this._vertexTempCache.dispose();
        this._varyingCache.dispose();
        this._fragmentConstantsCache.dispose();
        this._vertexAttributesCache.dispose();
        this._fragmentTempCache = null;
        this._vertexTempCache = null;
        this._varyingCache = null;
        this._fragmentConstantsCache = null;
        this._vertexAttributesCache = null;
        this._fragmentOutputRegister = null;
        this._vertexOutputRegister = null;
    };
    /**
     * Marks a fragment temporary register as used, so it cannot be retrieved. The register won't be able to be used until removeUsage
     * has been called usageCount times again.
     * @param register The register to mark as used.
     * @param usageCount The amount of usages to add.
     */
    ShaderRegisterCache.prototype.addFragmentTempUsages = function (register, usageCount) {
        this._fragmentTempCache.addUsage(register, usageCount);
    };
    /**
     * Removes a usage from a fragment temporary register. When usages reach 0, the register is freed again.
     * @param register The register for which to remove a usage.
     */
    ShaderRegisterCache.prototype.removeFragmentTempUsage = function (register) {
        this._fragmentTempCache.removeUsage(register);
    };
    /**
     * Marks a vertex temporary register as used, so it cannot be retrieved. The register won't be able to be used
     * until removeUsage has been called usageCount times again.
     * @param register The register to mark as used.
     * @param usageCount The amount of usages to add.
     */
    ShaderRegisterCache.prototype.addVertexTempUsages = function (register, usageCount) {
        this._vertexTempCache.addUsage(register, usageCount);
    };
    /**
     * Removes a usage from a vertex temporary register. When usages reach 0, the register is freed again.
     * @param register The register for which to remove a usage.
     */
    ShaderRegisterCache.prototype.removeVertexTempUsage = function (register) {
        this._vertexTempCache.removeUsage(register);
    };
    /**
     * Retrieve an entire fragment temporary register that's still available. The register won't be able to be used until removeUsage
     * has been called usageCount times again.
     */
    ShaderRegisterCache.prototype.getFreeFragmentVectorTemp = function () {
        return this._fragmentTempCache.requestFreeVectorReg();
    };
    /**
     * Retrieve a single component from a fragment temporary register that's still available.
     */
    ShaderRegisterCache.prototype.getFreeFragmentSingleTemp = function () {
        return this._fragmentTempCache.requestFreeRegComponent();
    };
    /**
     * Retrieve an available varying register
     */
    ShaderRegisterCache.prototype.getFreeVarying = function () {
        ++this._numUsedVaryings;
        return this._varyingCache.requestFreeVectorReg();
    };
    /**
     * Retrieve an available fragment constant register
     */
    ShaderRegisterCache.prototype.getFreeFragmentConstant = function () {
        ++this._numUsedFragmentConstants;
        return this._fragmentConstantsCache.requestFreeVectorReg();
    };
    /**
     * Retrieve an available vertex constant register
     */
    ShaderRegisterCache.prototype.getFreeVertexConstant = function () {
        ++this._numUsedVertexConstants;
        return this._vertexConstantsCache.requestFreeVectorReg();
    };
    /**
     * Retrieve an entire vertex temporary register that's still available.
     */
    ShaderRegisterCache.prototype.getFreeVertexVectorTemp = function () {
        return this._vertexTempCache.requestFreeVectorReg();
    };
    /**
     * Retrieve a single component from a vertex temporary register that's still available.
     */
    ShaderRegisterCache.prototype.getFreeVertexSingleTemp = function () {
        return this._vertexTempCache.requestFreeRegComponent();
    };
    /**
     * Retrieve an available vertex attribute register
     */
    ShaderRegisterCache.prototype.getFreeVertexAttribute = function () {
        ++this._numUsedStreams;
        return this._vertexAttributesCache.requestFreeVectorReg();
    };
    /**
     * Retrieve an available texture register
     */
    ShaderRegisterCache.prototype.getFreeTextureReg = function () {
        ++this._numUsedTextures;
        return this._textureCache.requestFreeVectorReg();
    };
    Object.defineProperty(ShaderRegisterCache.prototype, "vertexConstantOffset", {
        /**
         * Indicates the start index from which to retrieve vertex constants.
         */
        get: function () {
            return this._vertexConstantOffset;
        },
        set: function (vertexConstantOffset) {
            this._vertexConstantOffset = vertexConstantOffset;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShaderRegisterCache.prototype, "vertexAttributesOffset", {
        /**
         * Indicates the start index from which to retrieve vertex attributes.
         */
        get: function () {
            return this._vertexAttributesOffset;
        },
        set: function (value) {
            this._vertexAttributesOffset = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShaderRegisterCache.prototype, "varyingsOffset", {
        /**
         * Indicates the start index from which to retrieve varying registers.
         */
        get: function () {
            return this._varyingsOffset;
        },
        set: function (value) {
            this._varyingsOffset = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShaderRegisterCache.prototype, "fragmentConstantOffset", {
        /**
         * Indicates the start index from which to retrieve fragment constants.
         */
        get: function () {
            return this._fragmentConstantOffset;
        },
        set: function (value) {
            this._fragmentConstantOffset = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShaderRegisterCache.prototype, "fragmentOutputRegister", {
        /**
         * The fragment output register.
         */
        get: function () {
            return this._fragmentOutputRegister;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShaderRegisterCache.prototype, "numUsedVertexConstants", {
        /**
         * The amount of used vertex constant registers.
         */
        get: function () {
            return this._numUsedVertexConstants;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShaderRegisterCache.prototype, "numUsedFragmentConstants", {
        /**
         * The amount of used fragment constant registers.
         */
        get: function () {
            return this._numUsedFragmentConstants;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShaderRegisterCache.prototype, "numUsedStreams", {
        /**
         * The amount of used vertex streams.
         */
        get: function () {
            return this._numUsedStreams;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShaderRegisterCache.prototype, "numUsedTextures", {
        /**
         * The amount of used texture slots.
         */
        get: function () {
            return this._numUsedTextures;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShaderRegisterCache.prototype, "numUsedVaryings", {
        /**
         * The amount of used varying registers.
         */
        get: function () {
            return this._numUsedVaryings;
        },
        enumerable: true,
        configurable: true
    });
    return ShaderRegisterCache;
})();
module.exports = ShaderRegisterCache;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvY29tcGlsYXRpb24vc2hhZGVycmVnaXN0ZXJjYWNoZS50cyJdLCJuYW1lcyI6WyJTaGFkZXJSZWdpc3RlckNhY2hlIiwiU2hhZGVyUmVnaXN0ZXJDYWNoZS5jb25zdHJ1Y3RvciIsIlNoYWRlclJlZ2lzdGVyQ2FjaGUucmVzZXQiLCJTaGFkZXJSZWdpc3RlckNhY2hlLmRpc3Bvc2UiLCJTaGFkZXJSZWdpc3RlckNhY2hlLmFkZEZyYWdtZW50VGVtcFVzYWdlcyIsIlNoYWRlclJlZ2lzdGVyQ2FjaGUucmVtb3ZlRnJhZ21lbnRUZW1wVXNhZ2UiLCJTaGFkZXJSZWdpc3RlckNhY2hlLmFkZFZlcnRleFRlbXBVc2FnZXMiLCJTaGFkZXJSZWdpc3RlckNhY2hlLnJlbW92ZVZlcnRleFRlbXBVc2FnZSIsIlNoYWRlclJlZ2lzdGVyQ2FjaGUuZ2V0RnJlZUZyYWdtZW50VmVjdG9yVGVtcCIsIlNoYWRlclJlZ2lzdGVyQ2FjaGUuZ2V0RnJlZUZyYWdtZW50U2luZ2xlVGVtcCIsIlNoYWRlclJlZ2lzdGVyQ2FjaGUuZ2V0RnJlZVZhcnlpbmciLCJTaGFkZXJSZWdpc3RlckNhY2hlLmdldEZyZWVGcmFnbWVudENvbnN0YW50IiwiU2hhZGVyUmVnaXN0ZXJDYWNoZS5nZXRGcmVlVmVydGV4Q29uc3RhbnQiLCJTaGFkZXJSZWdpc3RlckNhY2hlLmdldEZyZWVWZXJ0ZXhWZWN0b3JUZW1wIiwiU2hhZGVyUmVnaXN0ZXJDYWNoZS5nZXRGcmVlVmVydGV4U2luZ2xlVGVtcCIsIlNoYWRlclJlZ2lzdGVyQ2FjaGUuZ2V0RnJlZVZlcnRleEF0dHJpYnV0ZSIsIlNoYWRlclJlZ2lzdGVyQ2FjaGUuZ2V0RnJlZVRleHR1cmVSZWciLCJTaGFkZXJSZWdpc3RlckNhY2hlLnZlcnRleENvbnN0YW50T2Zmc2V0IiwiU2hhZGVyUmVnaXN0ZXJDYWNoZS52ZXJ0ZXhBdHRyaWJ1dGVzT2Zmc2V0IiwiU2hhZGVyUmVnaXN0ZXJDYWNoZS52YXJ5aW5nc09mZnNldCIsIlNoYWRlclJlZ2lzdGVyQ2FjaGUuZnJhZ21lbnRDb25zdGFudE9mZnNldCIsIlNoYWRlclJlZ2lzdGVyQ2FjaGUuZnJhZ21lbnRPdXRwdXRSZWdpc3RlciIsIlNoYWRlclJlZ2lzdGVyQ2FjaGUubnVtVXNlZFZlcnRleENvbnN0YW50cyIsIlNoYWRlclJlZ2lzdGVyQ2FjaGUubnVtVXNlZEZyYWdtZW50Q29uc3RhbnRzIiwiU2hhZGVyUmVnaXN0ZXJDYWNoZS5udW1Vc2VkU3RyZWFtcyIsIlNoYWRlclJlZ2lzdGVyQ2FjaGUubnVtVXNlZFRleHR1cmVzIiwiU2hhZGVyUmVnaXN0ZXJDYWNoZS5udW1Vc2VkVmFyeWluZ3MiXSwibWFwcGluZ3MiOiJBQUFBLElBQU8sWUFBWSxXQUFlLDBEQUEwRCxDQUFDLENBQUM7QUFDOUYsSUFBTyxxQkFBcUIsV0FBWSxtRUFBbUUsQ0FBQyxDQUFDO0FBRTdHLEFBR0E7O0dBREc7SUFDRyxtQkFBbUI7SUF1QnhCQTs7OztPQUlHQTtJQUNIQSxTQTVCS0EsbUJBQW1CQSxDQTRCWkEsT0FBY0E7UUFabEJDLDRCQUF1QkEsR0FBVUEsQ0FBQ0EsQ0FBQ0E7UUFDbkNBLDhCQUF5QkEsR0FBVUEsQ0FBQ0EsQ0FBQ0E7UUFDckNBLG9CQUFlQSxHQUFVQSxDQUFDQSxDQUFDQTtRQUMzQkEscUJBQWdCQSxHQUFVQSxDQUFDQSxDQUFDQTtRQUM1QkEscUJBQWdCQSxHQUFVQSxDQUFDQSxDQUFDQTtRQVVuQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsR0FBR0EsT0FBT0EsQ0FBQ0E7SUFDekJBLENBQUNBO0lBRUREOztPQUVHQTtJQUNJQSxtQ0FBS0EsR0FBWkE7UUFFQ0UsSUFBSUEsQ0FBQ0Esa0JBQWtCQSxHQUFHQSxJQUFJQSxZQUFZQSxDQUFDQSxJQUFJQSxFQUFFQSxDQUFDQSxFQUFFQSxLQUFLQSxDQUFDQSxDQUFDQTtRQUMzREEsSUFBSUEsQ0FBQ0EsZ0JBQWdCQSxHQUFHQSxJQUFJQSxZQUFZQSxDQUFDQSxJQUFJQSxFQUFFQSxDQUFDQSxFQUFF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O09BTEFwQjtJQVVEQSxzQkFBV0EsdURBQXNCQTtRQUhqQ0E7O1dBRUdBO2FBQ0hBO1lBRUNxQixNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSx1QkFBdUJBLENBQUNBO1FBQ3JDQSxDQUFDQTs7O09BQUFyQjtJQUtEQSxzQkFBV0EsdURBQXNCQTtRQUhqQ0E7O1dBRUdBO2FBQ0hBO1lBRUNzQixNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSx1QkFBdUJBLENBQUNBO1FBQ3JDQSxDQUFDQTs7O09BQUF0QjtJQUtEQSxzQkFBV0EseURBQXdCQTtRQUhuQ0E7O1dBRUdBO2FBQ0hBO1lBRUN1QixNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSx5QkFBeUJBLENBQUNBO1FBQ3ZDQSxDQUFDQTs7O09BQUF2QjtJQUtEQSxzQkFBV0EsK0NBQWNBO1FBSHpCQTs7V0FFR0E7YUFDSEE7WUFFQ3dCLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBO1FBQzdCQSxDQUFDQTs7O09BQUF4QjtJQUtEQSxzQkFBV0EsZ0RBQWVBO1FBSDFCQTs7V0FFR0E7YUFDSEE7WUFFQ3lCLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLGdCQUFnQkEsQ0FBQ0E7UUFDOUJBLENBQUNBOzs7T0FBQXpCO0lBS0RBLHNCQUFXQSxnREFBZUE7UUFIMUJBOztXQUVHQTthQUNIQTtZQUVDMEIsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsZ0JBQWdCQSxDQUFDQTtRQUM5QkEsQ0FBQ0E7OztPQUFBMUI7SUFDRkEsMEJBQUNBO0FBQURBLENBalRBLEFBaVRDQSxJQUFBO0FBRUQsQUFBNkIsaUJBQXBCLG1CQUFtQixDQUFDIiwiZmlsZSI6Im1hdGVyaWFscy9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckNhY2hlLmpzIiwic291cmNlUm9vdCI6Ii4uLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWdpc3RlclBvb2xcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL21hdGVyaWFscy9jb21waWxhdGlvbi9SZWdpc3RlclBvb2xcIik7XG5pbXBvcnQgU2hhZGVyUmVnaXN0ZXJFbGVtZW50XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJFbGVtZW50XCIpO1xuXG4vKipcbiAqIFNoYWRlclJlZ2lzdGVyIENhY2hlIHByb3ZpZGVzIHRoZSB1c2FnZSBtYW5hZ2VtZW50IHN5c3RlbSBmb3IgYWxsIHJlZ2lzdGVycyBkdXJpbmcgc2hhZGluZyBjb21waWxhdGlvbi5cbiAqL1xuY2xhc3MgU2hhZGVyUmVnaXN0ZXJDYWNoZVxue1xuXHRwcml2YXRlIF9mcmFnbWVudFRlbXBDYWNoZTpSZWdpc3RlclBvb2w7XG5cdHByaXZhdGUgX3ZlcnRleFRlbXBDYWNoZTpSZWdpc3RlclBvb2w7XG5cdHByaXZhdGUgX3ZhcnlpbmdDYWNoZTpSZWdpc3RlclBvb2w7XG5cdHByaXZhdGUgX2ZyYWdtZW50Q29uc3RhbnRzQ2FjaGU6UmVnaXN0ZXJQb29sO1xuXHRwcml2YXRlIF92ZXJ0ZXhDb25zdGFudHNDYWNoZTpSZWdpc3RlclBvb2w7XG5cdHByaXZhdGUgX3RleHR1cmVDYWNoZTpSZWdpc3RlclBvb2w7XG5cdHByaXZhdGUgX3ZlcnRleEF0dHJpYnV0ZXNDYWNoZTpSZWdpc3RlclBvb2w7XG5cdHByaXZhdGUgX3ZlcnRleENvbnN0YW50T2Zmc2V0Om51bWJlcjsgLy9UT0RPOiBjaGVjayBpZiB0aGlzIHNob3VsZCBiZSBpbml0aWFsaXNlZCB0byAwXG5cdHByaXZhdGUgX3ZlcnRleEF0dHJpYnV0ZXNPZmZzZXQ6bnVtYmVyOy8vVE9ETzogY2hlY2sgaWYgdGhpcyBzaG91bGQgYmUgaW5pdGlhbGlzZWQgdG8gMFxuXHRwcml2YXRlIF92YXJ5aW5nc09mZnNldDpudW1iZXI7Ly9UT0RPOiBjaGVjayBpZiB0aGlzIHNob3VsZCBiZSBpbml0aWFsaXNlZCB0byAwXG5cdHByaXZhdGUgX2ZyYWdtZW50Q29uc3RhbnRPZmZzZXQ6bnVtYmVyOy8vVE9ETzogY2hlY2sgaWYgdGhpcyBzaG91bGQgYmUgaW5pdGlhbGlzZWQgdG8gMFxuXG5cdHByaXZhdGUgX2ZyYWdtZW50T3V0cHV0UmVnaXN0ZXI6U2hhZGVyUmVnaXN0ZXJFbGVtZW50O1xuXHRwcml2YXRlIF92ZXJ0ZXhPdXRwdXRSZWdpc3RlcjpTaGFkZXJSZWdpc3RlckVsZW1lbnQ7XG5cdHByaXZhdGUgX251bVVzZWRWZXJ0ZXhDb25zdGFudHM6bnVtYmVyID0gMDtcblx0cHJpdmF0ZSBfbnVtVXNlZEZyYWdtZW50Q29uc3RhbnRzOm51bWJlciA9IDA7XG5cdHByaXZhdGUgX251bVVzZWRTdHJlYW1zOm51bWJlciA9IDA7XG5cdHByaXZhdGUgX251bVVzZWRUZXh0dXJlczpudW1iZXIgPSAwO1xuXHRwcml2YXRlIF9udW1Vc2VkVmFyeWluZ3M6bnVtYmVyID0gMDtcblx0cHJpdmF0ZSBfcHJvZmlsZTpzdHJpbmc7XG5cblx0LyoqXG5cdCAqIENyZWF0ZSBhIG5ldyBTaGFkZXJSZWdpc3RlckNhY2hlIG9iamVjdC5cblx0ICpcblx0ICogQHBhcmFtIHByb2ZpbGUgVGhlIGNvbXBhdGliaWxpdHkgcHJvZmlsZSB1c2VkIGJ5IHRoZSByZW5kZXJlci5cblx0ICovXG5cdGNvbnN0cnVjdG9yKHByb2ZpbGU6c3RyaW5nKVxuXHR7XG5cdFx0dGhpcy5fcHJvZmlsZSA9IHByb2ZpbGU7XG5cdH1cblxuXHQvKipcblx0ICogUmVzZXRzIGFsbCByZWdpc3RlcnMuXG5cdCAqL1xuXHRwdWJsaWMgcmVzZXQoKVxuXHR7XG5cdFx0dGhpcy5fZnJhZ21lbnRUZW1wQ2FjaGUgPSBuZXcgUmVnaXN0ZXJQb29sKFwiZnRcIiwgOCwgZmFsc2UpO1xuXHRcdHRoaXMuX3ZlcnRleFRlbXBDYWNoZSA9IG5ldyBSZWdpc3RlclBvb2woXCJ2dFwiLCA4LCBmYWxzZSk7XG5cdFx0dGhpcy5fdmFyeWluZ0NhY2hlID0gbmV3IFJlZ2lzdGVyUG9vbChcInZcIiwgOCk7XG5cdFx0dGhpcy5fdGV4dHVyZUNhY2hlID0gbmV3IFJlZ2lzdGVyUG9vbChcImZzXCIsIDgpO1xuXHRcdHRoaXMuX3ZlcnRleEF0dHJpYnV0ZXNDYWNoZSA9IG5ldyBSZWdpc3RlclBvb2woXCJ2YVwiLCA4KTtcblx0XHR0aGlzLl9mcmFnbWVudENvbnN0YW50c0NhY2hlID0gbmV3IFJlZ2lzdGVyUG9vbChcImZjXCIsIDI4KTtcblx0XHR0aGlzLl92ZXJ0ZXhDb25zdGFudHNDYWNoZSA9IG5ldyBSZWdpc3RlclBvb2woXCJ2Y1wiLCAxMjgpO1xuXHRcdHRoaXMuX2ZyYWdtZW50T3V0cHV0UmVnaXN0ZXIgPSBuZXcgU2hhZGVyUmVnaXN0ZXJFbGVtZW50KFwib2NcIiwgLTEpO1xuXHRcdHRoaXMuX3ZlcnRleE91dHB1dFJlZ2lzdGVyID0gbmV3IFNoYWRlclJlZ2lzdGVyRWxlbWVudChcIm9wXCIsIC0xKTtcblx0XHR0aGlzLl9udW1Vc2VkVmVydGV4Q29uc3RhbnRzID0gMDtcblx0XHR0aGlzLl9udW1Vc2VkU3RyZWFtcyA9IDA7XG5cdFx0dGhpcy5fbnVtVXNlZFRleHR1cmVzID0gMDtcblx0XHR0aGlzLl9udW1Vc2VkVmFyeWluZ3MgPSAwO1xuXHRcdHRoaXMuX251bVVzZWRGcmFnbWVudENvbnN0YW50cyA9IDA7XG5cblx0XHR2YXIgaTpudW1iZXI7XG5cblx0XHRmb3IgKGkgPSAwOyBpIDwgdGhpcy5fdmVydGV4QXR0cmlidXRlc09mZnNldDsgKytpKVxuXHRcdFx0dGhpcy5nZXRGcmVlVmVydGV4QXR0cmlidXRlKCk7XG5cblx0XHRmb3IgKGkgPSAwOyBpIDwgdGhpcy5fdmVydGV4Q29uc3RhbnRPZmZzZXQ7ICsraSlcblx0XHRcdHRoaXMuZ2V0RnJlZVZlcnRleENvbnN0YW50KCk7XG5cblx0XHRmb3IgKGkgPSAwOyBpIDwgdGhpcy5fdmFyeWluZ3NPZmZzZXQ7ICsraSlcblx0XHRcdHRoaXMuZ2V0RnJlZVZhcnlpbmcoKTtcblxuXHRcdGZvciAoaSA9IDA7IGkgPCB0aGlzLl9mcmFnbWVudENvbnN0YW50T2Zmc2V0OyArK2kpXG5cdFx0XHR0aGlzLmdldEZyZWVGcmFnbWVudENvbnN0YW50KCk7XG5cdH1cblxuXHQvKipcblx0ICogRGlzcG9zZXMgYWxsIHJlc291cmNlcyB1c2VkLlxuXHQgKi9cblx0cHVibGljIGRpc3Bvc2UoKVxuXHR7XG5cdFx0dGhpcy5fZnJhZ21lbnRUZW1wQ2FjaGUuZGlzcG9zZSgpO1xuXHRcdHRoaXMuX3ZlcnRleFRlbXBDYWNoZS5kaXNwb3NlKCk7XG5cdFx0dGhpcy5fdmFyeWluZ0NhY2hlLmRpc3Bvc2UoKTtcblx0XHR0aGlzLl9mcmFnbWVudENvbnN0YW50c0NhY2hlLmRpc3Bvc2UoKTtcblx0XHR0aGlzLl92ZXJ0ZXhBdHRyaWJ1dGVzQ2FjaGUuZGlzcG9zZSgpO1xuXG5cdFx0dGhpcy5fZnJhZ21lbnRUZW1wQ2FjaGUgPSBudWxsO1xuXHRcdHRoaXMuX3ZlcnRleFRlbXBDYWNoZSA9IG51bGw7XG5cdFx0dGhpcy5fdmFyeWluZ0NhY2hlID0gbnVsbDtcblx0XHR0aGlzLl9mcmFnbWVudENvbnN0YW50c0NhY2hlID0gbnVsbDtcblx0XHR0aGlzLl92ZXJ0ZXhBdHRyaWJ1dGVzQ2FjaGUgPSBudWxsO1xuXHRcdHRoaXMuX2ZyYWdtZW50T3V0cHV0UmVnaXN0ZXIgPSBudWxsO1xuXHRcdHRoaXMuX3ZlcnRleE91dHB1dFJlZ2lzdGVyID0gbnVsbDtcblx0fVxuXG5cdC8qKlxuXHQgKiBNYXJrcyBhIGZyYWdtZW50IHRlbXBvcmFyeSByZWdpc3RlciBhcyB1c2VkLCBzbyBpdCBjYW5ub3QgYmUgcmV0cmlldmVkLiBUaGUgcmVnaXN0ZXIgd29uJ3QgYmUgYWJsZSB0byBiZSB1c2VkIHVudGlsIHJlbW92ZVVzYWdlXG5cdCAqIGhhcyBiZWVuIGNhbGxlZCB1c2FnZUNvdW50IHRpbWVzIGFnYWluLlxuXHQgKiBAcGFyYW0gcmVnaXN0ZXIgVGhlIHJlZ2lzdGVyIHRvIG1hcmsgYXMgdXNlZC5cblx0ICogQHBhcmFtIHVzYWdlQ291bnQgVGhlIGFtb3VudCBvZiB1c2FnZXMgdG8gYWRkLlxuXHQgKi9cblx0cHVibGljIGFkZEZyYWdtZW50VGVtcFVzYWdlcyhyZWdpc3RlcjpTaGFkZXJSZWdpc3RlckVsZW1lbnQsIHVzYWdlQ291bnQ6bnVtYmVyKVxuXHR7XG5cdFx0dGhpcy5fZnJhZ21lbnRUZW1wQ2FjaGUuYWRkVXNhZ2UocmVnaXN0ZXIsIHVzYWdlQ291bnQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJlbW92ZXMgYSB1c2FnZSBmcm9tIGEgZnJhZ21lbnQgdGVtcG9yYXJ5IHJlZ2lzdGVyLiBXaGVuIHVzYWdlcyByZWFjaCAwLCB0aGUgcmVnaXN0ZXIgaXMgZnJlZWQgYWdhaW4uXG5cdCAqIEBwYXJhbSByZWdpc3RlciBUaGUgcmVnaXN0ZXIgZm9yIHdoaWNoIHRvIHJlbW92ZSBhIHVzYWdlLlxuXHQgKi9cblx0cHVibGljIHJlbW92ZUZyYWdtZW50VGVtcFVzYWdlKHJlZ2lzdGVyOlNoYWRlclJlZ2lzdGVyRWxlbWVudClcblx0e1xuXHRcdHRoaXMuX2ZyYWdtZW50VGVtcENhY2hlLnJlbW92ZVVzYWdlKHJlZ2lzdGVyKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBNYXJrcyBhIHZlcnRleCB0ZW1wb3JhcnkgcmVnaXN0ZXIgYXMgdXNlZCwgc28gaXQgY2Fubm90IGJlIHJldHJpZXZlZC4gVGhlIHJlZ2lzdGVyIHdvbid0IGJlIGFibGUgdG8gYmUgdXNlZFxuXHQgKiB1bnRpbCByZW1vdmVVc2FnZSBoYXMgYmVlbiBjYWxsZWQgdXNhZ2VDb3VudCB0aW1lcyBhZ2Fpbi5cblx0ICogQHBhcmFtIHJlZ2lzdGVyIFRoZSByZWdpc3RlciB0byBtYXJrIGFzIHVzZWQuXG5cdCAqIEBwYXJhbSB1c2FnZUNvdW50IFRoZSBhbW91bnQgb2YgdXNhZ2VzIHRvIGFkZC5cblx0ICovXG5cdHB1YmxpYyBhZGRWZXJ0ZXhUZW1wVXNhZ2VzKHJlZ2lzdGVyOlNoYWRlclJlZ2lzdGVyRWxlbWVudCwgdXNhZ2VDb3VudDpudW1iZXIpXG5cdHtcblx0XHR0aGlzLl92ZXJ0ZXhUZW1wQ2FjaGUuYWRkVXNhZ2UocmVnaXN0ZXIsIHVzYWdlQ291bnQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJlbW92ZXMgYSB1c2FnZSBmcm9tIGEgdmVydGV4IHRlbXBvcmFyeSByZWdpc3Rlci4gV2hlbiB1c2FnZXMgcmVhY2ggMCwgdGhlIHJlZ2lzdGVyIGlzIGZyZWVkIGFnYWluLlxuXHQgKiBAcGFyYW0gcmVnaXN0ZXIgVGhlIHJlZ2lzdGVyIGZvciB3aGljaCB0byByZW1vdmUgYSB1c2FnZS5cblx0ICovXG5cdHB1YmxpYyByZW1vdmVWZXJ0ZXhUZW1wVXNhZ2UocmVnaXN0ZXI6U2hhZGVyUmVnaXN0ZXJFbGVtZW50KVxuXHR7XG5cdFx0dGhpcy5fdmVydGV4VGVtcENhY2hlLnJlbW92ZVVzYWdlKHJlZ2lzdGVyKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXRyaWV2ZSBhbiBlbnRpcmUgZnJhZ21lbnQgdGVtcG9yYXJ5IHJlZ2lzdGVyIHRoYXQncyBzdGlsbCBhdmFpbGFibGUuIFRoZSByZWdpc3RlciB3b24ndCBiZSBhYmxlIHRvIGJlIHVzZWQgdW50aWwgcmVtb3ZlVXNhZ2Vcblx0ICogaGFzIGJlZW4gY2FsbGVkIHVzYWdlQ291bnQgdGltZXMgYWdhaW4uXG5cdCAqL1xuXHRwdWJsaWMgZ2V0RnJlZUZyYWdtZW50VmVjdG9yVGVtcCgpOlNoYWRlclJlZ2lzdGVyRWxlbWVudFxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX2ZyYWdtZW50VGVtcENhY2hlLnJlcXVlc3RGcmVlVmVjdG9yUmVnKCk7XG5cdH1cblxuXHQvKipcblx0ICogUmV0cmlldmUgYSBzaW5nbGUgY29tcG9uZW50IGZyb20gYSBmcmFnbWVudCB0ZW1wb3JhcnkgcmVnaXN0ZXIgdGhhdCdzIHN0aWxsIGF2YWlsYWJsZS5cblx0ICovXG5cdHB1YmxpYyBnZXRGcmVlRnJhZ21lbnRTaW5nbGVUZW1wKCk6U2hhZGVyUmVnaXN0ZXJFbGVtZW50XG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fZnJhZ21lbnRUZW1wQ2FjaGUucmVxdWVzdEZyZWVSZWdDb21wb25lbnQoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXRyaWV2ZSBhbiBhdmFpbGFibGUgdmFyeWluZyByZWdpc3RlclxuXHQgKi9cblx0cHVibGljIGdldEZyZWVWYXJ5aW5nKCk6U2hhZGVyUmVnaXN0ZXJFbGVtZW50XG5cdHtcblx0XHQrK3RoaXMuX251bVVzZWRWYXJ5aW5ncztcblx0XHRyZXR1cm4gdGhpcy5fdmFyeWluZ0NhY2hlLnJlcXVlc3RGcmVlVmVjdG9yUmVnKCk7XG5cdH1cblxuXHQvKipcblx0ICogUmV0cmlldmUgYW4gYXZhaWxhYmxlIGZyYWdtZW50IGNvbnN0YW50IHJlZ2lzdGVyXG5cdCAqL1xuXHRwdWJsaWMgZ2V0RnJlZUZyYWdtZW50Q29uc3RhbnQoKTpTaGFkZXJSZWdpc3RlckVsZW1lbnRcblx0e1xuXHRcdCsrdGhpcy5fbnVtVXNlZEZyYWdtZW50Q29uc3RhbnRzO1xuXHRcdHJldHVybiB0aGlzLl9mcmFnbWVudENvbnN0YW50c0NhY2hlLnJlcXVlc3RGcmVlVmVjdG9yUmVnKCk7XG5cdH1cblxuXHQvKipcblx0ICogUmV0cmlldmUgYW4gYXZhaWxhYmxlIHZlcnRleCBjb25zdGFudCByZWdpc3RlclxuXHQgKi9cblx0cHVibGljIGdldEZyZWVWZXJ0ZXhDb25zdGFudCgpOlNoYWRlclJlZ2lzdGVyRWxlbWVudFxuXHR7XG5cdFx0Kyt0aGlzLl9udW1Vc2VkVmVydGV4Q29uc3RhbnRzO1xuXHRcdHJldHVybiB0aGlzLl92ZXJ0ZXhDb25zdGFudHNDYWNoZS5yZXF1ZXN0RnJlZVZlY3RvclJlZygpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHJpZXZlIGFuIGVudGlyZSB2ZXJ0ZXggdGVtcG9yYXJ5IHJlZ2lzdGVyIHRoYXQncyBzdGlsbCBhdmFpbGFibGUuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0RnJlZVZlcnRleFZlY3RvclRlbXAoKTpTaGFkZXJSZWdpc3RlckVsZW1lbnRcblx0e1xuXHRcdHJldHVybiB0aGlzLl92ZXJ0ZXhUZW1wQ2FjaGUucmVxdWVzdEZyZWVWZWN0b3JSZWcoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXRyaWV2ZSBhIHNpbmdsZSBjb21wb25lbnQgZnJvbSBhIHZlcnRleCB0ZW1wb3JhcnkgcmVnaXN0ZXIgdGhhdCdzIHN0aWxsIGF2YWlsYWJsZS5cblx0ICovXG5cdHB1YmxpYyBnZXRGcmVlVmVydGV4U2luZ2xlVGVtcCgpOlNoYWRlclJlZ2lzdGVyRWxlbWVudFxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3ZlcnRleFRlbXBDYWNoZS5yZXF1ZXN0RnJlZVJlZ0NvbXBvbmVudCgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHJpZXZlIGFuIGF2YWlsYWJsZSB2ZXJ0ZXggYXR0cmlidXRlIHJlZ2lzdGVyXG5cdCAqL1xuXHRwdWJsaWMgZ2V0RnJlZVZlcnRleEF0dHJpYnV0ZSgpOlNoYWRlclJlZ2lzdGVyRWxlbWVudFxuXHR7XG5cdFx0Kyt0aGlzLl9udW1Vc2VkU3RyZWFtcztcblx0XHRyZXR1cm4gdGhpcy5fdmVydGV4QXR0cmlidXRlc0NhY2hlLnJlcXVlc3RGcmVlVmVjdG9yUmVnKCk7XG5cdH1cblxuXHQvKipcblx0ICogUmV0cmlldmUgYW4gYXZhaWxhYmxlIHRleHR1cmUgcmVnaXN0ZXJcblx0ICovXG5cdHB1YmxpYyBnZXRGcmVlVGV4dHVyZVJlZygpOlNoYWRlclJlZ2lzdGVyRWxlbWVudFxuXHR7XG5cdFx0Kyt0aGlzLl9udW1Vc2VkVGV4dHVyZXM7XG5cdFx0cmV0dXJuIHRoaXMuX3RleHR1cmVDYWNoZS5yZXF1ZXN0RnJlZVZlY3RvclJlZygpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEluZGljYXRlcyB0aGUgc3RhcnQgaW5kZXggZnJvbSB3aGljaCB0byByZXRyaWV2ZSB2ZXJ0ZXggY29uc3RhbnRzLlxuXHQgKi9cblx0cHVibGljIGdldCB2ZXJ0ZXhDb25zdGFudE9mZnNldCgpOm51bWJlclxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3ZlcnRleENvbnN0YW50T2Zmc2V0O1xuXHR9XG5cblx0cHVibGljIHNldCB2ZXJ0ZXhDb25zdGFudE9mZnNldCh2ZXJ0ZXhDb25zdGFudE9mZnNldDpudW1iZXIpXG5cdHtcblx0XHR0aGlzLl92ZXJ0ZXhDb25zdGFudE9mZnNldCA9IHZlcnRleENvbnN0YW50T2Zmc2V0O1xuXHR9XG5cblx0LyoqXG5cdCAqIEluZGljYXRlcyB0aGUgc3RhcnQgaW5kZXggZnJvbSB3aGljaCB0byByZXRyaWV2ZSB2ZXJ0ZXggYXR0cmlidXRlcy5cblx0ICovXG5cdHB1YmxpYyBnZXQgdmVydGV4QXR0cmlidXRlc09mZnNldCgpOm51bWJlclxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3ZlcnRleEF0dHJpYnV0ZXNPZmZzZXQ7XG5cdH1cblxuXHRwdWJsaWMgc2V0IHZlcnRleEF0dHJpYnV0ZXNPZmZzZXQodmFsdWU6bnVtYmVyKVxuXHR7XG5cdFx0dGhpcy5fdmVydGV4QXR0cmlidXRlc09mZnNldCA9IHZhbHVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIEluZGljYXRlcyB0aGUgc3RhcnQgaW5kZXggZnJvbSB3aGljaCB0byByZXRyaWV2ZSB2YXJ5aW5nIHJlZ2lzdGVycy5cblx0ICovXG5cdHB1YmxpYyBnZXQgdmFyeWluZ3NPZmZzZXQoKTpudW1iZXJcblx0e1xuXHRcdHJldHVybiB0aGlzLl92YXJ5aW5nc09mZnNldDtcblx0fVxuXG5cdHB1YmxpYyBzZXQgdmFyeWluZ3NPZmZzZXQodmFsdWU6bnVtYmVyKVxuXHR7XG5cdFx0dGhpcy5fdmFyeWluZ3NPZmZzZXQgPSB2YWx1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBJbmRpY2F0ZXMgdGhlIHN0YXJ0IGluZGV4IGZyb20gd2hpY2ggdG8gcmV0cmlldmUgZnJhZ21lbnQgY29uc3RhbnRzLlxuXHQgKi9cblx0cHVibGljIGdldCBmcmFnbWVudENvbnN0YW50T2Zmc2V0KCk6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fZnJhZ21lbnRDb25zdGFudE9mZnNldDtcblx0fVxuXG5cdHB1YmxpYyBzZXQgZnJhZ21lbnRDb25zdGFudE9mZnNldCh2YWx1ZTpudW1iZXIpXG5cdHtcblx0XHR0aGlzLl9mcmFnbWVudENvbnN0YW50T2Zmc2V0ID0gdmFsdWU7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIGZyYWdtZW50IG91dHB1dCByZWdpc3Rlci5cblx0ICovXG5cdHB1YmxpYyBnZXQgZnJhZ21lbnRPdXRwdXRSZWdpc3RlcigpOlNoYWRlclJlZ2lzdGVyRWxlbWVudFxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX2ZyYWdtZW50T3V0cHV0UmVnaXN0ZXI7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIGFtb3VudCBvZiB1c2VkIHZlcnRleCBjb25zdGFudCByZWdpc3RlcnMuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IG51bVVzZWRWZXJ0ZXhDb25zdGFudHMoKTpudW1iZXJcblx0e1xuXHRcdHJldHVybiB0aGlzLl9udW1Vc2VkVmVydGV4Q29uc3RhbnRzO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBhbW91bnQgb2YgdXNlZCBmcmFnbWVudCBjb25zdGFudCByZWdpc3RlcnMuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IG51bVVzZWRGcmFnbWVudENvbnN0YW50cygpOm51bWJlclxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX251bVVzZWRGcmFnbWVudENvbnN0YW50cztcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgYW1vdW50IG9mIHVzZWQgdmVydGV4IHN0cmVhbXMuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IG51bVVzZWRTdHJlYW1zKCk6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fbnVtVXNlZFN0cmVhbXM7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIGFtb3VudCBvZiB1c2VkIHRleHR1cmUgc2xvdHMuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IG51bVVzZWRUZXh0dXJlcygpOm51bWJlclxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX251bVVzZWRUZXh0dXJlcztcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgYW1vdW50IG9mIHVzZWQgdmFyeWluZyByZWdpc3RlcnMuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IG51bVVzZWRWYXJ5aW5ncygpOm51bWJlclxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX251bVVzZWRWYXJ5aW5ncztcblx0fVxufVxuXG5leHBvcnQgPSBTaGFkZXJSZWdpc3RlckNhY2hlOyJdfQ==