var RegisterPool = require("awayjs-renderergl/lib/compilation/RegisterPool");
var ShaderRegisterElement = require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckNhY2hlLnRzIl0sIm5hbWVzIjpbIlNoYWRlclJlZ2lzdGVyQ2FjaGUiLCJTaGFkZXJSZWdpc3RlckNhY2hlLmNvbnN0cnVjdG9yIiwiU2hhZGVyUmVnaXN0ZXJDYWNoZS5yZXNldCIsIlNoYWRlclJlZ2lzdGVyQ2FjaGUuZGlzcG9zZSIsIlNoYWRlclJlZ2lzdGVyQ2FjaGUuYWRkRnJhZ21lbnRUZW1wVXNhZ2VzIiwiU2hhZGVyUmVnaXN0ZXJDYWNoZS5yZW1vdmVGcmFnbWVudFRlbXBVc2FnZSIsIlNoYWRlclJlZ2lzdGVyQ2FjaGUuYWRkVmVydGV4VGVtcFVzYWdlcyIsIlNoYWRlclJlZ2lzdGVyQ2FjaGUucmVtb3ZlVmVydGV4VGVtcFVzYWdlIiwiU2hhZGVyUmVnaXN0ZXJDYWNoZS5nZXRGcmVlRnJhZ21lbnRWZWN0b3JUZW1wIiwiU2hhZGVyUmVnaXN0ZXJDYWNoZS5nZXRGcmVlRnJhZ21lbnRTaW5nbGVUZW1wIiwiU2hhZGVyUmVnaXN0ZXJDYWNoZS5nZXRGcmVlVmFyeWluZyIsIlNoYWRlclJlZ2lzdGVyQ2FjaGUuZ2V0RnJlZUZyYWdtZW50Q29uc3RhbnQiLCJTaGFkZXJSZWdpc3RlckNhY2hlLmdldEZyZWVWZXJ0ZXhDb25zdGFudCIsIlNoYWRlclJlZ2lzdGVyQ2FjaGUuZ2V0RnJlZVZlcnRleFZlY3RvclRlbXAiLCJTaGFkZXJSZWdpc3RlckNhY2hlLmdldEZyZWVWZXJ0ZXhTaW5nbGVUZW1wIiwiU2hhZGVyUmVnaXN0ZXJDYWNoZS5nZXRGcmVlVmVydGV4QXR0cmlidXRlIiwiU2hhZGVyUmVnaXN0ZXJDYWNoZS5nZXRGcmVlVGV4dHVyZVJlZyIsIlNoYWRlclJlZ2lzdGVyQ2FjaGUudmVydGV4Q29uc3RhbnRPZmZzZXQiLCJTaGFkZXJSZWdpc3RlckNhY2hlLnZlcnRleEF0dHJpYnV0ZXNPZmZzZXQiLCJTaGFkZXJSZWdpc3RlckNhY2hlLnZhcnlpbmdzT2Zmc2V0IiwiU2hhZGVyUmVnaXN0ZXJDYWNoZS5mcmFnbWVudENvbnN0YW50T2Zmc2V0IiwiU2hhZGVyUmVnaXN0ZXJDYWNoZS5mcmFnbWVudE91dHB1dFJlZ2lzdGVyIiwiU2hhZGVyUmVnaXN0ZXJDYWNoZS5udW1Vc2VkVmVydGV4Q29uc3RhbnRzIiwiU2hhZGVyUmVnaXN0ZXJDYWNoZS5udW1Vc2VkRnJhZ21lbnRDb25zdGFudHMiLCJTaGFkZXJSZWdpc3RlckNhY2hlLm51bVVzZWRTdHJlYW1zIiwiU2hhZGVyUmVnaXN0ZXJDYWNoZS5udW1Vc2VkVGV4dHVyZXMiLCJTaGFkZXJSZWdpc3RlckNhY2hlLm51bVVzZWRWYXJ5aW5ncyJdLCJtYXBwaW5ncyI6IkFBQUEsSUFBTyxZQUFZLFdBQWUsZ0RBQWdELENBQUMsQ0FBQztBQUNwRixJQUFPLHFCQUFxQixXQUFZLHlEQUF5RCxDQUFDLENBQUM7QUFFbkcsQUFHQTs7R0FERztJQUNHLG1CQUFtQjtJQXVCeEJBOzs7O09BSUdBO0lBQ0hBLFNBNUJLQSxtQkFBbUJBLENBNEJaQSxPQUFjQTtRQVpsQkMsNEJBQXVCQSxHQUFVQSxDQUFDQSxDQUFDQTtRQUNuQ0EsOEJBQXlCQSxHQUFVQSxDQUFDQSxDQUFDQTtRQUNyQ0Esb0JBQWVBLEdBQVVBLENBQUNBLENBQUNBO1FBQzNCQSxxQkFBZ0JBLEdBQVVBLENBQUNBLENBQUNBO1FBQzVCQSxxQkFBZ0JBLEdBQVVBLENBQUNBLENBQUNBO1FBVW5DQSxJQUFJQSxDQUFDQSxRQUFRQSxHQUFHQSxPQUFPQSxDQUFDQTtJQUN6QkEsQ0FBQ0E7SUFFREQ7O09BRUdBO0lBQ0lBLG1DQUFLQSxHQUFaQTtRQUVDRSxJQUFJQSxDQUFDQSxrQkFBa0JBLEdBQUdBLElBQUlBLFlBQVlBLENBQUNBLElBQUlBLEVBQUVBLENBQUNBLEVBQUVBLEtBQUtBLENBQUNBLENBQUNBO1FBQzNEQSxJQUFJQSxDQUFDQSxnQkFBZ0JBLEdBQUdBLElBQUlBLFlBQVlBLENBQUNBLElBQUlBLEVBQUVBLENBQUNBLEVBQUVBLEtBQUtBLENB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VURBLHNCQUFXQSx1REFBc0JBO1FBSGpDQTs7V0FFR0E7YUFDSEE7WUFFQ3FCLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLHVCQUF1QkEsQ0FBQ0E7UUFDckNBLENBQUNBOzs7T0FBQXJCO0lBS0RBLHNCQUFXQSx1REFBc0JBO1FBSGpDQTs7V0FFR0E7YUFDSEE7WUFFQ3NCLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLHVCQUF1QkEsQ0FBQ0E7UUFDckNBLENBQUNBOzs7T0FBQXRCO0lBS0RBLHNCQUFXQSx5REFBd0JBO1FBSG5DQTs7V0FFR0E7YUFDSEE7WUFFQ3VCLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLHlCQUF5QkEsQ0FBQ0E7UUFDdkNBLENBQUNBOzs7T0FBQXZCO0lBS0RBLHNCQUFXQSwrQ0FBY0E7UUFIekJBOztXQUVHQTthQUNIQTtZQUVDd0IsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0E7UUFDN0JBLENBQUNBOzs7T0FBQXhCO0lBS0RBLHNCQUFXQSxnREFBZUE7UUFIMUJBOztXQUVHQTthQUNIQTtZQUVDeUIsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsZ0JBQWdCQSxDQUFDQTtRQUM5QkEsQ0FBQ0E7OztPQUFBekI7SUFLREEsc0JBQVdBLGdEQUFlQTtRQUgxQkE7O1dBRUdBO2FBQ0hBO1lBRUMwQixNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxnQkFBZ0JBLENBQUNBO1FBQzlCQSxDQUFDQTs7O09BQUExQjtJQUNGQSwwQkFBQ0E7QUFBREEsQ0FqVEEsQUFpVENBLElBQUE7QUFFRCxBQUE2QixpQkFBcEIsbUJBQW1CLENBQUMiLCJmaWxlIjoiY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJDYWNoZS5qcyIsInNvdXJjZVJvb3QiOiIuLi8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVnaXN0ZXJQb29sXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9jb21waWxhdGlvbi9SZWdpc3RlclBvb2xcIik7XHJcbmltcG9ydCBTaGFkZXJSZWdpc3RlckVsZW1lbnRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2NvbXBpbGF0aW9uL1NoYWRlclJlZ2lzdGVyRWxlbWVudFwiKTtcclxuXHJcbi8qKlxyXG4gKiBTaGFkZXJSZWdpc3RlciBDYWNoZSBwcm92aWRlcyB0aGUgdXNhZ2UgbWFuYWdlbWVudCBzeXN0ZW0gZm9yIGFsbCByZWdpc3RlcnMgZHVyaW5nIHNoYWRpbmcgY29tcGlsYXRpb24uXHJcbiAqL1xyXG5jbGFzcyBTaGFkZXJSZWdpc3RlckNhY2hlXHJcbntcclxuXHRwcml2YXRlIF9mcmFnbWVudFRlbXBDYWNoZTpSZWdpc3RlclBvb2w7XHJcblx0cHJpdmF0ZSBfdmVydGV4VGVtcENhY2hlOlJlZ2lzdGVyUG9vbDtcclxuXHRwcml2YXRlIF92YXJ5aW5nQ2FjaGU6UmVnaXN0ZXJQb29sO1xyXG5cdHByaXZhdGUgX2ZyYWdtZW50Q29uc3RhbnRzQ2FjaGU6UmVnaXN0ZXJQb29sO1xyXG5cdHByaXZhdGUgX3ZlcnRleENvbnN0YW50c0NhY2hlOlJlZ2lzdGVyUG9vbDtcclxuXHRwcml2YXRlIF90ZXh0dXJlQ2FjaGU6UmVnaXN0ZXJQb29sO1xyXG5cdHByaXZhdGUgX3ZlcnRleEF0dHJpYnV0ZXNDYWNoZTpSZWdpc3RlclBvb2w7XHJcblx0cHJpdmF0ZSBfdmVydGV4Q29uc3RhbnRPZmZzZXQ6bnVtYmVyOyAvL1RPRE86IGNoZWNrIGlmIHRoaXMgc2hvdWxkIGJlIGluaXRpYWxpc2VkIHRvIDBcclxuXHRwcml2YXRlIF92ZXJ0ZXhBdHRyaWJ1dGVzT2Zmc2V0Om51bWJlcjsvL1RPRE86IGNoZWNrIGlmIHRoaXMgc2hvdWxkIGJlIGluaXRpYWxpc2VkIHRvIDBcclxuXHRwcml2YXRlIF92YXJ5aW5nc09mZnNldDpudW1iZXI7Ly9UT0RPOiBjaGVjayBpZiB0aGlzIHNob3VsZCBiZSBpbml0aWFsaXNlZCB0byAwXHJcblx0cHJpdmF0ZSBfZnJhZ21lbnRDb25zdGFudE9mZnNldDpudW1iZXI7Ly9UT0RPOiBjaGVjayBpZiB0aGlzIHNob3VsZCBiZSBpbml0aWFsaXNlZCB0byAwXHJcblxyXG5cdHByaXZhdGUgX2ZyYWdtZW50T3V0cHV0UmVnaXN0ZXI6U2hhZGVyUmVnaXN0ZXJFbGVtZW50O1xyXG5cdHByaXZhdGUgX3ZlcnRleE91dHB1dFJlZ2lzdGVyOlNoYWRlclJlZ2lzdGVyRWxlbWVudDtcclxuXHRwcml2YXRlIF9udW1Vc2VkVmVydGV4Q29uc3RhbnRzOm51bWJlciA9IDA7XHJcblx0cHJpdmF0ZSBfbnVtVXNlZEZyYWdtZW50Q29uc3RhbnRzOm51bWJlciA9IDA7XHJcblx0cHJpdmF0ZSBfbnVtVXNlZFN0cmVhbXM6bnVtYmVyID0gMDtcclxuXHRwcml2YXRlIF9udW1Vc2VkVGV4dHVyZXM6bnVtYmVyID0gMDtcclxuXHRwcml2YXRlIF9udW1Vc2VkVmFyeWluZ3M6bnVtYmVyID0gMDtcclxuXHRwcml2YXRlIF9wcm9maWxlOnN0cmluZztcclxuXHJcblx0LyoqXHJcblx0ICogQ3JlYXRlIGEgbmV3IFNoYWRlclJlZ2lzdGVyQ2FjaGUgb2JqZWN0LlxyXG5cdCAqXHJcblx0ICogQHBhcmFtIHByb2ZpbGUgVGhlIGNvbXBhdGliaWxpdHkgcHJvZmlsZSB1c2VkIGJ5IHRoZSByZW5kZXJlci5cclxuXHQgKi9cclxuXHRjb25zdHJ1Y3Rvcihwcm9maWxlOnN0cmluZylcclxuXHR7XHJcblx0XHR0aGlzLl9wcm9maWxlID0gcHJvZmlsZTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFJlc2V0cyBhbGwgcmVnaXN0ZXJzLlxyXG5cdCAqL1xyXG5cdHB1YmxpYyByZXNldCgpXHJcblx0e1xyXG5cdFx0dGhpcy5fZnJhZ21lbnRUZW1wQ2FjaGUgPSBuZXcgUmVnaXN0ZXJQb29sKFwiZnRcIiwgOCwgZmFsc2UpO1xyXG5cdFx0dGhpcy5fdmVydGV4VGVtcENhY2hlID0gbmV3IFJlZ2lzdGVyUG9vbChcInZ0XCIsIDgsIGZhbHNlKTtcclxuXHRcdHRoaXMuX3ZhcnlpbmdDYWNoZSA9IG5ldyBSZWdpc3RlclBvb2woXCJ2XCIsIDgpO1xyXG5cdFx0dGhpcy5fdGV4dHVyZUNhY2hlID0gbmV3IFJlZ2lzdGVyUG9vbChcImZzXCIsIDgpO1xyXG5cdFx0dGhpcy5fdmVydGV4QXR0cmlidXRlc0NhY2hlID0gbmV3IFJlZ2lzdGVyUG9vbChcInZhXCIsIDgpO1xyXG5cdFx0dGhpcy5fZnJhZ21lbnRDb25zdGFudHNDYWNoZSA9IG5ldyBSZWdpc3RlclBvb2woXCJmY1wiLCAyOCk7XHJcblx0XHR0aGlzLl92ZXJ0ZXhDb25zdGFudHNDYWNoZSA9IG5ldyBSZWdpc3RlclBvb2woXCJ2Y1wiLCAxMjgpO1xyXG5cdFx0dGhpcy5fZnJhZ21lbnRPdXRwdXRSZWdpc3RlciA9IG5ldyBTaGFkZXJSZWdpc3RlckVsZW1lbnQoXCJvY1wiLCAtMSk7XHJcblx0XHR0aGlzLl92ZXJ0ZXhPdXRwdXRSZWdpc3RlciA9IG5ldyBTaGFkZXJSZWdpc3RlckVsZW1lbnQoXCJvcFwiLCAtMSk7XHJcblx0XHR0aGlzLl9udW1Vc2VkVmVydGV4Q29uc3RhbnRzID0gMDtcclxuXHRcdHRoaXMuX251bVVzZWRTdHJlYW1zID0gMDtcclxuXHRcdHRoaXMuX251bVVzZWRUZXh0dXJlcyA9IDA7XHJcblx0XHR0aGlzLl9udW1Vc2VkVmFyeWluZ3MgPSAwO1xyXG5cdFx0dGhpcy5fbnVtVXNlZEZyYWdtZW50Q29uc3RhbnRzID0gMDtcclxuXHJcblx0XHR2YXIgaTpudW1iZXI7XHJcblxyXG5cdFx0Zm9yIChpID0gMDsgaSA8IHRoaXMuX3ZlcnRleEF0dHJpYnV0ZXNPZmZzZXQ7ICsraSlcclxuXHRcdFx0dGhpcy5nZXRGcmVlVmVydGV4QXR0cmlidXRlKCk7XHJcblxyXG5cdFx0Zm9yIChpID0gMDsgaSA8IHRoaXMuX3ZlcnRleENvbnN0YW50T2Zmc2V0OyArK2kpXHJcblx0XHRcdHRoaXMuZ2V0RnJlZVZlcnRleENvbnN0YW50KCk7XHJcblxyXG5cdFx0Zm9yIChpID0gMDsgaSA8IHRoaXMuX3ZhcnlpbmdzT2Zmc2V0OyArK2kpXHJcblx0XHRcdHRoaXMuZ2V0RnJlZVZhcnlpbmcoKTtcclxuXHJcblx0XHRmb3IgKGkgPSAwOyBpIDwgdGhpcy5fZnJhZ21lbnRDb25zdGFudE9mZnNldDsgKytpKVxyXG5cdFx0XHR0aGlzLmdldEZyZWVGcmFnbWVudENvbnN0YW50KCk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBEaXNwb3NlcyBhbGwgcmVzb3VyY2VzIHVzZWQuXHJcblx0ICovXHJcblx0cHVibGljIGRpc3Bvc2UoKVxyXG5cdHtcclxuXHRcdHRoaXMuX2ZyYWdtZW50VGVtcENhY2hlLmRpc3Bvc2UoKTtcclxuXHRcdHRoaXMuX3ZlcnRleFRlbXBDYWNoZS5kaXNwb3NlKCk7XHJcblx0XHR0aGlzLl92YXJ5aW5nQ2FjaGUuZGlzcG9zZSgpO1xyXG5cdFx0dGhpcy5fZnJhZ21lbnRDb25zdGFudHNDYWNoZS5kaXNwb3NlKCk7XHJcblx0XHR0aGlzLl92ZXJ0ZXhBdHRyaWJ1dGVzQ2FjaGUuZGlzcG9zZSgpO1xyXG5cclxuXHRcdHRoaXMuX2ZyYWdtZW50VGVtcENhY2hlID0gbnVsbDtcclxuXHRcdHRoaXMuX3ZlcnRleFRlbXBDYWNoZSA9IG51bGw7XHJcblx0XHR0aGlzLl92YXJ5aW5nQ2FjaGUgPSBudWxsO1xyXG5cdFx0dGhpcy5fZnJhZ21lbnRDb25zdGFudHNDYWNoZSA9IG51bGw7XHJcblx0XHR0aGlzLl92ZXJ0ZXhBdHRyaWJ1dGVzQ2FjaGUgPSBudWxsO1xyXG5cdFx0dGhpcy5fZnJhZ21lbnRPdXRwdXRSZWdpc3RlciA9IG51bGw7XHJcblx0XHR0aGlzLl92ZXJ0ZXhPdXRwdXRSZWdpc3RlciA9IG51bGw7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBNYXJrcyBhIGZyYWdtZW50IHRlbXBvcmFyeSByZWdpc3RlciBhcyB1c2VkLCBzbyBpdCBjYW5ub3QgYmUgcmV0cmlldmVkLiBUaGUgcmVnaXN0ZXIgd29uJ3QgYmUgYWJsZSB0byBiZSB1c2VkIHVudGlsIHJlbW92ZVVzYWdlXHJcblx0ICogaGFzIGJlZW4gY2FsbGVkIHVzYWdlQ291bnQgdGltZXMgYWdhaW4uXHJcblx0ICogQHBhcmFtIHJlZ2lzdGVyIFRoZSByZWdpc3RlciB0byBtYXJrIGFzIHVzZWQuXHJcblx0ICogQHBhcmFtIHVzYWdlQ291bnQgVGhlIGFtb3VudCBvZiB1c2FnZXMgdG8gYWRkLlxyXG5cdCAqL1xyXG5cdHB1YmxpYyBhZGRGcmFnbWVudFRlbXBVc2FnZXMocmVnaXN0ZXI6U2hhZGVyUmVnaXN0ZXJFbGVtZW50LCB1c2FnZUNvdW50Om51bWJlcilcclxuXHR7XHJcblx0XHR0aGlzLl9mcmFnbWVudFRlbXBDYWNoZS5hZGRVc2FnZShyZWdpc3RlciwgdXNhZ2VDb3VudCk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBSZW1vdmVzIGEgdXNhZ2UgZnJvbSBhIGZyYWdtZW50IHRlbXBvcmFyeSByZWdpc3Rlci4gV2hlbiB1c2FnZXMgcmVhY2ggMCwgdGhlIHJlZ2lzdGVyIGlzIGZyZWVkIGFnYWluLlxyXG5cdCAqIEBwYXJhbSByZWdpc3RlciBUaGUgcmVnaXN0ZXIgZm9yIHdoaWNoIHRvIHJlbW92ZSBhIHVzYWdlLlxyXG5cdCAqL1xyXG5cdHB1YmxpYyByZW1vdmVGcmFnbWVudFRlbXBVc2FnZShyZWdpc3RlcjpTaGFkZXJSZWdpc3RlckVsZW1lbnQpXHJcblx0e1xyXG5cdFx0dGhpcy5fZnJhZ21lbnRUZW1wQ2FjaGUucmVtb3ZlVXNhZ2UocmVnaXN0ZXIpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogTWFya3MgYSB2ZXJ0ZXggdGVtcG9yYXJ5IHJlZ2lzdGVyIGFzIHVzZWQsIHNvIGl0IGNhbm5vdCBiZSByZXRyaWV2ZWQuIFRoZSByZWdpc3RlciB3b24ndCBiZSBhYmxlIHRvIGJlIHVzZWRcclxuXHQgKiB1bnRpbCByZW1vdmVVc2FnZSBoYXMgYmVlbiBjYWxsZWQgdXNhZ2VDb3VudCB0aW1lcyBhZ2Fpbi5cclxuXHQgKiBAcGFyYW0gcmVnaXN0ZXIgVGhlIHJlZ2lzdGVyIHRvIG1hcmsgYXMgdXNlZC5cclxuXHQgKiBAcGFyYW0gdXNhZ2VDb3VudCBUaGUgYW1vdW50IG9mIHVzYWdlcyB0byBhZGQuXHJcblx0ICovXHJcblx0cHVibGljIGFkZFZlcnRleFRlbXBVc2FnZXMocmVnaXN0ZXI6U2hhZGVyUmVnaXN0ZXJFbGVtZW50LCB1c2FnZUNvdW50Om51bWJlcilcclxuXHR7XHJcblx0XHR0aGlzLl92ZXJ0ZXhUZW1wQ2FjaGUuYWRkVXNhZ2UocmVnaXN0ZXIsIHVzYWdlQ291bnQpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogUmVtb3ZlcyBhIHVzYWdlIGZyb20gYSB2ZXJ0ZXggdGVtcG9yYXJ5IHJlZ2lzdGVyLiBXaGVuIHVzYWdlcyByZWFjaCAwLCB0aGUgcmVnaXN0ZXIgaXMgZnJlZWQgYWdhaW4uXHJcblx0ICogQHBhcmFtIHJlZ2lzdGVyIFRoZSByZWdpc3RlciBmb3Igd2hpY2ggdG8gcmVtb3ZlIGEgdXNhZ2UuXHJcblx0ICovXHJcblx0cHVibGljIHJlbW92ZVZlcnRleFRlbXBVc2FnZShyZWdpc3RlcjpTaGFkZXJSZWdpc3RlckVsZW1lbnQpXHJcblx0e1xyXG5cdFx0dGhpcy5fdmVydGV4VGVtcENhY2hlLnJlbW92ZVVzYWdlKHJlZ2lzdGVyKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFJldHJpZXZlIGFuIGVudGlyZSBmcmFnbWVudCB0ZW1wb3JhcnkgcmVnaXN0ZXIgdGhhdCdzIHN0aWxsIGF2YWlsYWJsZS4gVGhlIHJlZ2lzdGVyIHdvbid0IGJlIGFibGUgdG8gYmUgdXNlZCB1bnRpbCByZW1vdmVVc2FnZVxyXG5cdCAqIGhhcyBiZWVuIGNhbGxlZCB1c2FnZUNvdW50IHRpbWVzIGFnYWluLlxyXG5cdCAqL1xyXG5cdHB1YmxpYyBnZXRGcmVlRnJhZ21lbnRWZWN0b3JUZW1wKCk6U2hhZGVyUmVnaXN0ZXJFbGVtZW50XHJcblx0e1xyXG5cdFx0cmV0dXJuIHRoaXMuX2ZyYWdtZW50VGVtcENhY2hlLnJlcXVlc3RGcmVlVmVjdG9yUmVnKCk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBSZXRyaWV2ZSBhIHNpbmdsZSBjb21wb25lbnQgZnJvbSBhIGZyYWdtZW50IHRlbXBvcmFyeSByZWdpc3RlciB0aGF0J3Mgc3RpbGwgYXZhaWxhYmxlLlxyXG5cdCAqL1xyXG5cdHB1YmxpYyBnZXRGcmVlRnJhZ21lbnRTaW5nbGVUZW1wKCk6U2hhZGVyUmVnaXN0ZXJFbGVtZW50XHJcblx0e1xyXG5cdFx0cmV0dXJuIHRoaXMuX2ZyYWdtZW50VGVtcENhY2hlLnJlcXVlc3RGcmVlUmVnQ29tcG9uZW50KCk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBSZXRyaWV2ZSBhbiBhdmFpbGFibGUgdmFyeWluZyByZWdpc3RlclxyXG5cdCAqL1xyXG5cdHB1YmxpYyBnZXRGcmVlVmFyeWluZygpOlNoYWRlclJlZ2lzdGVyRWxlbWVudFxyXG5cdHtcclxuXHRcdCsrdGhpcy5fbnVtVXNlZFZhcnlpbmdzO1xyXG5cdFx0cmV0dXJuIHRoaXMuX3ZhcnlpbmdDYWNoZS5yZXF1ZXN0RnJlZVZlY3RvclJlZygpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogUmV0cmlldmUgYW4gYXZhaWxhYmxlIGZyYWdtZW50IGNvbnN0YW50IHJlZ2lzdGVyXHJcblx0ICovXHJcblx0cHVibGljIGdldEZyZWVGcmFnbWVudENvbnN0YW50KCk6U2hhZGVyUmVnaXN0ZXJFbGVtZW50XHJcblx0e1xyXG5cdFx0Kyt0aGlzLl9udW1Vc2VkRnJhZ21lbnRDb25zdGFudHM7XHJcblx0XHRyZXR1cm4gdGhpcy5fZnJhZ21lbnRDb25zdGFudHNDYWNoZS5yZXF1ZXN0RnJlZVZlY3RvclJlZygpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogUmV0cmlldmUgYW4gYXZhaWxhYmxlIHZlcnRleCBjb25zdGFudCByZWdpc3RlclxyXG5cdCAqL1xyXG5cdHB1YmxpYyBnZXRGcmVlVmVydGV4Q29uc3RhbnQoKTpTaGFkZXJSZWdpc3RlckVsZW1lbnRcclxuXHR7XHJcblx0XHQrK3RoaXMuX251bVVzZWRWZXJ0ZXhDb25zdGFudHM7XHJcblx0XHRyZXR1cm4gdGhpcy5fdmVydGV4Q29uc3RhbnRzQ2FjaGUucmVxdWVzdEZyZWVWZWN0b3JSZWcoKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFJldHJpZXZlIGFuIGVudGlyZSB2ZXJ0ZXggdGVtcG9yYXJ5IHJlZ2lzdGVyIHRoYXQncyBzdGlsbCBhdmFpbGFibGUuXHJcblx0ICovXHJcblx0cHVibGljIGdldEZyZWVWZXJ0ZXhWZWN0b3JUZW1wKCk6U2hhZGVyUmVnaXN0ZXJFbGVtZW50XHJcblx0e1xyXG5cdFx0cmV0dXJuIHRoaXMuX3ZlcnRleFRlbXBDYWNoZS5yZXF1ZXN0RnJlZVZlY3RvclJlZygpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogUmV0cmlldmUgYSBzaW5nbGUgY29tcG9uZW50IGZyb20gYSB2ZXJ0ZXggdGVtcG9yYXJ5IHJlZ2lzdGVyIHRoYXQncyBzdGlsbCBhdmFpbGFibGUuXHJcblx0ICovXHJcblx0cHVibGljIGdldEZyZWVWZXJ0ZXhTaW5nbGVUZW1wKCk6U2hhZGVyUmVnaXN0ZXJFbGVtZW50XHJcblx0e1xyXG5cdFx0cmV0dXJuIHRoaXMuX3ZlcnRleFRlbXBDYWNoZS5yZXF1ZXN0RnJlZVJlZ0NvbXBvbmVudCgpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogUmV0cmlldmUgYW4gYXZhaWxhYmxlIHZlcnRleCBhdHRyaWJ1dGUgcmVnaXN0ZXJcclxuXHQgKi9cclxuXHRwdWJsaWMgZ2V0RnJlZVZlcnRleEF0dHJpYnV0ZSgpOlNoYWRlclJlZ2lzdGVyRWxlbWVudFxyXG5cdHtcclxuXHRcdCsrdGhpcy5fbnVtVXNlZFN0cmVhbXM7XHJcblx0XHRyZXR1cm4gdGhpcy5fdmVydGV4QXR0cmlidXRlc0NhY2hlLnJlcXVlc3RGcmVlVmVjdG9yUmVnKCk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBSZXRyaWV2ZSBhbiBhdmFpbGFibGUgdGV4dHVyZSByZWdpc3RlclxyXG5cdCAqL1xyXG5cdHB1YmxpYyBnZXRGcmVlVGV4dHVyZVJlZygpOlNoYWRlclJlZ2lzdGVyRWxlbWVudFxyXG5cdHtcclxuXHRcdCsrdGhpcy5fbnVtVXNlZFRleHR1cmVzO1xyXG5cdFx0cmV0dXJuIHRoaXMuX3RleHR1cmVDYWNoZS5yZXF1ZXN0RnJlZVZlY3RvclJlZygpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogSW5kaWNhdGVzIHRoZSBzdGFydCBpbmRleCBmcm9tIHdoaWNoIHRvIHJldHJpZXZlIHZlcnRleCBjb25zdGFudHMuXHJcblx0ICovXHJcblx0cHVibGljIGdldCB2ZXJ0ZXhDb25zdGFudE9mZnNldCgpOm51bWJlclxyXG5cdHtcclxuXHRcdHJldHVybiB0aGlzLl92ZXJ0ZXhDb25zdGFudE9mZnNldDtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXQgdmVydGV4Q29uc3RhbnRPZmZzZXQodmVydGV4Q29uc3RhbnRPZmZzZXQ6bnVtYmVyKVxyXG5cdHtcclxuXHRcdHRoaXMuX3ZlcnRleENvbnN0YW50T2Zmc2V0ID0gdmVydGV4Q29uc3RhbnRPZmZzZXQ7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBJbmRpY2F0ZXMgdGhlIHN0YXJ0IGluZGV4IGZyb20gd2hpY2ggdG8gcmV0cmlldmUgdmVydGV4IGF0dHJpYnV0ZXMuXHJcblx0ICovXHJcblx0cHVibGljIGdldCB2ZXJ0ZXhBdHRyaWJ1dGVzT2Zmc2V0KCk6bnVtYmVyXHJcblx0e1xyXG5cdFx0cmV0dXJuIHRoaXMuX3ZlcnRleEF0dHJpYnV0ZXNPZmZzZXQ7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0IHZlcnRleEF0dHJpYnV0ZXNPZmZzZXQodmFsdWU6bnVtYmVyKVxyXG5cdHtcclxuXHRcdHRoaXMuX3ZlcnRleEF0dHJpYnV0ZXNPZmZzZXQgPSB2YWx1ZTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEluZGljYXRlcyB0aGUgc3RhcnQgaW5kZXggZnJvbSB3aGljaCB0byByZXRyaWV2ZSB2YXJ5aW5nIHJlZ2lzdGVycy5cclxuXHQgKi9cclxuXHRwdWJsaWMgZ2V0IHZhcnlpbmdzT2Zmc2V0KCk6bnVtYmVyXHJcblx0e1xyXG5cdFx0cmV0dXJuIHRoaXMuX3ZhcnlpbmdzT2Zmc2V0O1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldCB2YXJ5aW5nc09mZnNldCh2YWx1ZTpudW1iZXIpXHJcblx0e1xyXG5cdFx0dGhpcy5fdmFyeWluZ3NPZmZzZXQgPSB2YWx1ZTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEluZGljYXRlcyB0aGUgc3RhcnQgaW5kZXggZnJvbSB3aGljaCB0byByZXRyaWV2ZSBmcmFnbWVudCBjb25zdGFudHMuXHJcblx0ICovXHJcblx0cHVibGljIGdldCBmcmFnbWVudENvbnN0YW50T2Zmc2V0KCk6bnVtYmVyXHJcblx0e1xyXG5cdFx0cmV0dXJuIHRoaXMuX2ZyYWdtZW50Q29uc3RhbnRPZmZzZXQ7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0IGZyYWdtZW50Q29uc3RhbnRPZmZzZXQodmFsdWU6bnVtYmVyKVxyXG5cdHtcclxuXHRcdHRoaXMuX2ZyYWdtZW50Q29uc3RhbnRPZmZzZXQgPSB2YWx1ZTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFRoZSBmcmFnbWVudCBvdXRwdXQgcmVnaXN0ZXIuXHJcblx0ICovXHJcblx0cHVibGljIGdldCBmcmFnbWVudE91dHB1dFJlZ2lzdGVyKCk6U2hhZGVyUmVnaXN0ZXJFbGVtZW50XHJcblx0e1xyXG5cdFx0cmV0dXJuIHRoaXMuX2ZyYWdtZW50T3V0cHV0UmVnaXN0ZXI7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBUaGUgYW1vdW50IG9mIHVzZWQgdmVydGV4IGNvbnN0YW50IHJlZ2lzdGVycy5cclxuXHQgKi9cclxuXHRwdWJsaWMgZ2V0IG51bVVzZWRWZXJ0ZXhDb25zdGFudHMoKTpudW1iZXJcclxuXHR7XHJcblx0XHRyZXR1cm4gdGhpcy5fbnVtVXNlZFZlcnRleENvbnN0YW50cztcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFRoZSBhbW91bnQgb2YgdXNlZCBmcmFnbWVudCBjb25zdGFudCByZWdpc3RlcnMuXHJcblx0ICovXHJcblx0cHVibGljIGdldCBudW1Vc2VkRnJhZ21lbnRDb25zdGFudHMoKTpudW1iZXJcclxuXHR7XHJcblx0XHRyZXR1cm4gdGhpcy5fbnVtVXNlZEZyYWdtZW50Q29uc3RhbnRzO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogVGhlIGFtb3VudCBvZiB1c2VkIHZlcnRleCBzdHJlYW1zLlxyXG5cdCAqL1xyXG5cdHB1YmxpYyBnZXQgbnVtVXNlZFN0cmVhbXMoKTpudW1iZXJcclxuXHR7XHJcblx0XHRyZXR1cm4gdGhpcy5fbnVtVXNlZFN0cmVhbXM7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBUaGUgYW1vdW50IG9mIHVzZWQgdGV4dHVyZSBzbG90cy5cclxuXHQgKi9cclxuXHRwdWJsaWMgZ2V0IG51bVVzZWRUZXh0dXJlcygpOm51bWJlclxyXG5cdHtcclxuXHRcdHJldHVybiB0aGlzLl9udW1Vc2VkVGV4dHVyZXM7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBUaGUgYW1vdW50IG9mIHVzZWQgdmFyeWluZyByZWdpc3RlcnMuXHJcblx0ICovXHJcblx0cHVibGljIGdldCBudW1Vc2VkVmFyeWluZ3MoKTpudW1iZXJcclxuXHR7XHJcblx0XHRyZXR1cm4gdGhpcy5fbnVtVXNlZFZhcnlpbmdzO1xyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0ID0gU2hhZGVyUmVnaXN0ZXJDYWNoZTsiXX0=