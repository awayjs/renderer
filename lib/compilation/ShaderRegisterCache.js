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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9jb21waWxhdGlvbi9zaGFkZXJyZWdpc3RlcmNhY2hlLnRzIl0sIm5hbWVzIjpbIlNoYWRlclJlZ2lzdGVyQ2FjaGUiLCJTaGFkZXJSZWdpc3RlckNhY2hlLmNvbnN0cnVjdG9yIiwiU2hhZGVyUmVnaXN0ZXJDYWNoZS5yZXNldCIsIlNoYWRlclJlZ2lzdGVyQ2FjaGUuZGlzcG9zZSIsIlNoYWRlclJlZ2lzdGVyQ2FjaGUuYWRkRnJhZ21lbnRUZW1wVXNhZ2VzIiwiU2hhZGVyUmVnaXN0ZXJDYWNoZS5yZW1vdmVGcmFnbWVudFRlbXBVc2FnZSIsIlNoYWRlclJlZ2lzdGVyQ2FjaGUuYWRkVmVydGV4VGVtcFVzYWdlcyIsIlNoYWRlclJlZ2lzdGVyQ2FjaGUucmVtb3ZlVmVydGV4VGVtcFVzYWdlIiwiU2hhZGVyUmVnaXN0ZXJDYWNoZS5nZXRGcmVlRnJhZ21lbnRWZWN0b3JUZW1wIiwiU2hhZGVyUmVnaXN0ZXJDYWNoZS5nZXRGcmVlRnJhZ21lbnRTaW5nbGVUZW1wIiwiU2hhZGVyUmVnaXN0ZXJDYWNoZS5nZXRGcmVlVmFyeWluZyIsIlNoYWRlclJlZ2lzdGVyQ2FjaGUuZ2V0RnJlZUZyYWdtZW50Q29uc3RhbnQiLCJTaGFkZXJSZWdpc3RlckNhY2hlLmdldEZyZWVWZXJ0ZXhDb25zdGFudCIsIlNoYWRlclJlZ2lzdGVyQ2FjaGUuZ2V0RnJlZVZlcnRleFZlY3RvclRlbXAiLCJTaGFkZXJSZWdpc3RlckNhY2hlLmdldEZyZWVWZXJ0ZXhTaW5nbGVUZW1wIiwiU2hhZGVyUmVnaXN0ZXJDYWNoZS5nZXRGcmVlVmVydGV4QXR0cmlidXRlIiwiU2hhZGVyUmVnaXN0ZXJDYWNoZS5nZXRGcmVlVGV4dHVyZVJlZyIsIlNoYWRlclJlZ2lzdGVyQ2FjaGUudmVydGV4Q29uc3RhbnRPZmZzZXQiLCJTaGFkZXJSZWdpc3RlckNhY2hlLnZlcnRleEF0dHJpYnV0ZXNPZmZzZXQiLCJTaGFkZXJSZWdpc3RlckNhY2hlLnZhcnlpbmdzT2Zmc2V0IiwiU2hhZGVyUmVnaXN0ZXJDYWNoZS5mcmFnbWVudENvbnN0YW50T2Zmc2V0IiwiU2hhZGVyUmVnaXN0ZXJDYWNoZS5mcmFnbWVudE91dHB1dFJlZ2lzdGVyIiwiU2hhZGVyUmVnaXN0ZXJDYWNoZS5udW1Vc2VkVmVydGV4Q29uc3RhbnRzIiwiU2hhZGVyUmVnaXN0ZXJDYWNoZS5udW1Vc2VkRnJhZ21lbnRDb25zdGFudHMiLCJTaGFkZXJSZWdpc3RlckNhY2hlLm51bVVzZWRTdHJlYW1zIiwiU2hhZGVyUmVnaXN0ZXJDYWNoZS5udW1Vc2VkVGV4dHVyZXMiLCJTaGFkZXJSZWdpc3RlckNhY2hlLm51bVVzZWRWYXJ5aW5ncyJdLCJtYXBwaW5ncyI6IkFBQUEsSUFBTyxZQUFZLFdBQWUsZ0RBQWdELENBQUMsQ0FBQztBQUNwRixJQUFPLHFCQUFxQixXQUFZLHlEQUF5RCxDQUFDLENBQUM7QUFFbkcsQUFHQTs7R0FERztJQUNHLG1CQUFtQjtJQXVCeEJBOzs7O09BSUdBO0lBQ0hBLFNBNUJLQSxtQkFBbUJBLENBNEJaQSxPQUFjQTtRQVpsQkMsNEJBQXVCQSxHQUFVQSxDQUFDQSxDQUFDQTtRQUNuQ0EsOEJBQXlCQSxHQUFVQSxDQUFDQSxDQUFDQTtRQUNyQ0Esb0JBQWVBLEdBQVVBLENBQUNBLENBQUNBO1FBQzNCQSxxQkFBZ0JBLEdBQVVBLENBQUNBLENBQUNBO1FBQzVCQSxxQkFBZ0JBLEdBQVVBLENBQUNBLENBQUNBO1FBVW5DQSxJQUFJQSxDQUFDQSxRQUFRQSxHQUFHQSxPQUFPQSxDQUFDQTtJQUN6QkEsQ0FBQ0E7SUFFREQ7O09BRUdBO0lBQ0lBLG1DQUFLQSxHQUFaQTtRQUVDRSxJQUFJQSxDQUFDQSxrQkFBa0JBLEdBQUdBLElBQUlBLFlBQVlBLENBQUNBLElBQUlBLEVBQUVBLENBQUNBLEVBQUVBLEtBQUtBLENBQUNBLENBQUNBO1FBQzNEQSxJQUFJQSxDQUFDQSxnQkFBZ0JBLEdBQUdBLElBQUlBLFlBQVlBLENBQUNBLElBQUlBLEVBQUVBLENBQUNBLEVBQUVBLEtBQUtBLENB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VURBLHNCQUFXQSx1REFBc0JBO1FBSGpDQTs7V0FFR0E7YUFDSEE7WUFFQ3FCLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLHVCQUF1QkEsQ0FBQ0E7UUFDckNBLENBQUNBOzs7T0FBQXJCO0lBS0RBLHNCQUFXQSx1REFBc0JBO1FBSGpDQTs7V0FFR0E7YUFDSEE7WUFFQ3NCLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLHVCQUF1QkEsQ0FBQ0E7UUFDckNBLENBQUNBOzs7T0FBQXRCO0lBS0RBLHNCQUFXQSx5REFBd0JBO1FBSG5DQTs7V0FFR0E7YUFDSEE7WUFFQ3VCLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLHlCQUF5QkEsQ0FBQ0E7UUFDdkNBLENBQUNBOzs7T0FBQXZCO0lBS0RBLHNCQUFXQSwrQ0FBY0E7UUFIekJBOztXQUVHQTthQUNIQTtZQUVDd0IsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0E7UUFDN0JBLENBQUNBOzs7T0FBQXhCO0lBS0RBLHNCQUFXQSxnREFBZUE7UUFIMUJBOztXQUVHQTthQUNIQTtZQUVDeUIsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsZ0JBQWdCQSxDQUFDQTtRQUM5QkEsQ0FBQ0E7OztPQUFBekI7SUFLREEsc0JBQVdBLGdEQUFlQTtRQUgxQkE7O1dBRUdBO2FBQ0hBO1lBRUMwQixNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxnQkFBZ0JBLENBQUNBO1FBQzlCQSxDQUFDQTs7O09BQUExQjtJQUNGQSwwQkFBQ0E7QUFBREEsQ0FqVEEsQUFpVENBLElBQUE7QUFFRCxBQUE2QixpQkFBcEIsbUJBQW1CLENBQUMiLCJmaWxlIjoiY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJDYWNoZS5qcyIsInNvdXJjZVJvb3QiOiIuLi8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVnaXN0ZXJQb29sXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9jb21waWxhdGlvbi9SZWdpc3RlclBvb2xcIik7XG5pbXBvcnQgU2hhZGVyUmVnaXN0ZXJFbGVtZW50XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckVsZW1lbnRcIik7XG5cbi8qKlxuICogU2hhZGVyUmVnaXN0ZXIgQ2FjaGUgcHJvdmlkZXMgdGhlIHVzYWdlIG1hbmFnZW1lbnQgc3lzdGVtIGZvciBhbGwgcmVnaXN0ZXJzIGR1cmluZyBzaGFkaW5nIGNvbXBpbGF0aW9uLlxuICovXG5jbGFzcyBTaGFkZXJSZWdpc3RlckNhY2hlXG57XG5cdHByaXZhdGUgX2ZyYWdtZW50VGVtcENhY2hlOlJlZ2lzdGVyUG9vbDtcblx0cHJpdmF0ZSBfdmVydGV4VGVtcENhY2hlOlJlZ2lzdGVyUG9vbDtcblx0cHJpdmF0ZSBfdmFyeWluZ0NhY2hlOlJlZ2lzdGVyUG9vbDtcblx0cHJpdmF0ZSBfZnJhZ21lbnRDb25zdGFudHNDYWNoZTpSZWdpc3RlclBvb2w7XG5cdHByaXZhdGUgX3ZlcnRleENvbnN0YW50c0NhY2hlOlJlZ2lzdGVyUG9vbDtcblx0cHJpdmF0ZSBfdGV4dHVyZUNhY2hlOlJlZ2lzdGVyUG9vbDtcblx0cHJpdmF0ZSBfdmVydGV4QXR0cmlidXRlc0NhY2hlOlJlZ2lzdGVyUG9vbDtcblx0cHJpdmF0ZSBfdmVydGV4Q29uc3RhbnRPZmZzZXQ6bnVtYmVyOyAvL1RPRE86IGNoZWNrIGlmIHRoaXMgc2hvdWxkIGJlIGluaXRpYWxpc2VkIHRvIDBcblx0cHJpdmF0ZSBfdmVydGV4QXR0cmlidXRlc09mZnNldDpudW1iZXI7Ly9UT0RPOiBjaGVjayBpZiB0aGlzIHNob3VsZCBiZSBpbml0aWFsaXNlZCB0byAwXG5cdHByaXZhdGUgX3ZhcnlpbmdzT2Zmc2V0Om51bWJlcjsvL1RPRE86IGNoZWNrIGlmIHRoaXMgc2hvdWxkIGJlIGluaXRpYWxpc2VkIHRvIDBcblx0cHJpdmF0ZSBfZnJhZ21lbnRDb25zdGFudE9mZnNldDpudW1iZXI7Ly9UT0RPOiBjaGVjayBpZiB0aGlzIHNob3VsZCBiZSBpbml0aWFsaXNlZCB0byAwXG5cblx0cHJpdmF0ZSBfZnJhZ21lbnRPdXRwdXRSZWdpc3RlcjpTaGFkZXJSZWdpc3RlckVsZW1lbnQ7XG5cdHByaXZhdGUgX3ZlcnRleE91dHB1dFJlZ2lzdGVyOlNoYWRlclJlZ2lzdGVyRWxlbWVudDtcblx0cHJpdmF0ZSBfbnVtVXNlZFZlcnRleENvbnN0YW50czpudW1iZXIgPSAwO1xuXHRwcml2YXRlIF9udW1Vc2VkRnJhZ21lbnRDb25zdGFudHM6bnVtYmVyID0gMDtcblx0cHJpdmF0ZSBfbnVtVXNlZFN0cmVhbXM6bnVtYmVyID0gMDtcblx0cHJpdmF0ZSBfbnVtVXNlZFRleHR1cmVzOm51bWJlciA9IDA7XG5cdHByaXZhdGUgX251bVVzZWRWYXJ5aW5nczpudW1iZXIgPSAwO1xuXHRwcml2YXRlIF9wcm9maWxlOnN0cmluZztcblxuXHQvKipcblx0ICogQ3JlYXRlIGEgbmV3IFNoYWRlclJlZ2lzdGVyQ2FjaGUgb2JqZWN0LlxuXHQgKlxuXHQgKiBAcGFyYW0gcHJvZmlsZSBUaGUgY29tcGF0aWJpbGl0eSBwcm9maWxlIHVzZWQgYnkgdGhlIHJlbmRlcmVyLlxuXHQgKi9cblx0Y29uc3RydWN0b3IocHJvZmlsZTpzdHJpbmcpXG5cdHtcblx0XHR0aGlzLl9wcm9maWxlID0gcHJvZmlsZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXNldHMgYWxsIHJlZ2lzdGVycy5cblx0ICovXG5cdHB1YmxpYyByZXNldCgpXG5cdHtcblx0XHR0aGlzLl9mcmFnbWVudFRlbXBDYWNoZSA9IG5ldyBSZWdpc3RlclBvb2woXCJmdFwiLCA4LCBmYWxzZSk7XG5cdFx0dGhpcy5fdmVydGV4VGVtcENhY2hlID0gbmV3IFJlZ2lzdGVyUG9vbChcInZ0XCIsIDgsIGZhbHNlKTtcblx0XHR0aGlzLl92YXJ5aW5nQ2FjaGUgPSBuZXcgUmVnaXN0ZXJQb29sKFwidlwiLCA4KTtcblx0XHR0aGlzLl90ZXh0dXJlQ2FjaGUgPSBuZXcgUmVnaXN0ZXJQb29sKFwiZnNcIiwgOCk7XG5cdFx0dGhpcy5fdmVydGV4QXR0cmlidXRlc0NhY2hlID0gbmV3IFJlZ2lzdGVyUG9vbChcInZhXCIsIDgpO1xuXHRcdHRoaXMuX2ZyYWdtZW50Q29uc3RhbnRzQ2FjaGUgPSBuZXcgUmVnaXN0ZXJQb29sKFwiZmNcIiwgMjgpO1xuXHRcdHRoaXMuX3ZlcnRleENvbnN0YW50c0NhY2hlID0gbmV3IFJlZ2lzdGVyUG9vbChcInZjXCIsIDEyOCk7XG5cdFx0dGhpcy5fZnJhZ21lbnRPdXRwdXRSZWdpc3RlciA9IG5ldyBTaGFkZXJSZWdpc3RlckVsZW1lbnQoXCJvY1wiLCAtMSk7XG5cdFx0dGhpcy5fdmVydGV4T3V0cHV0UmVnaXN0ZXIgPSBuZXcgU2hhZGVyUmVnaXN0ZXJFbGVtZW50KFwib3BcIiwgLTEpO1xuXHRcdHRoaXMuX251bVVzZWRWZXJ0ZXhDb25zdGFudHMgPSAwO1xuXHRcdHRoaXMuX251bVVzZWRTdHJlYW1zID0gMDtcblx0XHR0aGlzLl9udW1Vc2VkVGV4dHVyZXMgPSAwO1xuXHRcdHRoaXMuX251bVVzZWRWYXJ5aW5ncyA9IDA7XG5cdFx0dGhpcy5fbnVtVXNlZEZyYWdtZW50Q29uc3RhbnRzID0gMDtcblxuXHRcdHZhciBpOm51bWJlcjtcblxuXHRcdGZvciAoaSA9IDA7IGkgPCB0aGlzLl92ZXJ0ZXhBdHRyaWJ1dGVzT2Zmc2V0OyArK2kpXG5cdFx0XHR0aGlzLmdldEZyZWVWZXJ0ZXhBdHRyaWJ1dGUoKTtcblxuXHRcdGZvciAoaSA9IDA7IGkgPCB0aGlzLl92ZXJ0ZXhDb25zdGFudE9mZnNldDsgKytpKVxuXHRcdFx0dGhpcy5nZXRGcmVlVmVydGV4Q29uc3RhbnQoKTtcblxuXHRcdGZvciAoaSA9IDA7IGkgPCB0aGlzLl92YXJ5aW5nc09mZnNldDsgKytpKVxuXHRcdFx0dGhpcy5nZXRGcmVlVmFyeWluZygpO1xuXG5cdFx0Zm9yIChpID0gMDsgaSA8IHRoaXMuX2ZyYWdtZW50Q29uc3RhbnRPZmZzZXQ7ICsraSlcblx0XHRcdHRoaXMuZ2V0RnJlZUZyYWdtZW50Q29uc3RhbnQoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBEaXNwb3NlcyBhbGwgcmVzb3VyY2VzIHVzZWQuXG5cdCAqL1xuXHRwdWJsaWMgZGlzcG9zZSgpXG5cdHtcblx0XHR0aGlzLl9mcmFnbWVudFRlbXBDYWNoZS5kaXNwb3NlKCk7XG5cdFx0dGhpcy5fdmVydGV4VGVtcENhY2hlLmRpc3Bvc2UoKTtcblx0XHR0aGlzLl92YXJ5aW5nQ2FjaGUuZGlzcG9zZSgpO1xuXHRcdHRoaXMuX2ZyYWdtZW50Q29uc3RhbnRzQ2FjaGUuZGlzcG9zZSgpO1xuXHRcdHRoaXMuX3ZlcnRleEF0dHJpYnV0ZXNDYWNoZS5kaXNwb3NlKCk7XG5cblx0XHR0aGlzLl9mcmFnbWVudFRlbXBDYWNoZSA9IG51bGw7XG5cdFx0dGhpcy5fdmVydGV4VGVtcENhY2hlID0gbnVsbDtcblx0XHR0aGlzLl92YXJ5aW5nQ2FjaGUgPSBudWxsO1xuXHRcdHRoaXMuX2ZyYWdtZW50Q29uc3RhbnRzQ2FjaGUgPSBudWxsO1xuXHRcdHRoaXMuX3ZlcnRleEF0dHJpYnV0ZXNDYWNoZSA9IG51bGw7XG5cdFx0dGhpcy5fZnJhZ21lbnRPdXRwdXRSZWdpc3RlciA9IG51bGw7XG5cdFx0dGhpcy5fdmVydGV4T3V0cHV0UmVnaXN0ZXIgPSBudWxsO1xuXHR9XG5cblx0LyoqXG5cdCAqIE1hcmtzIGEgZnJhZ21lbnQgdGVtcG9yYXJ5IHJlZ2lzdGVyIGFzIHVzZWQsIHNvIGl0IGNhbm5vdCBiZSByZXRyaWV2ZWQuIFRoZSByZWdpc3RlciB3b24ndCBiZSBhYmxlIHRvIGJlIHVzZWQgdW50aWwgcmVtb3ZlVXNhZ2Vcblx0ICogaGFzIGJlZW4gY2FsbGVkIHVzYWdlQ291bnQgdGltZXMgYWdhaW4uXG5cdCAqIEBwYXJhbSByZWdpc3RlciBUaGUgcmVnaXN0ZXIgdG8gbWFyayBhcyB1c2VkLlxuXHQgKiBAcGFyYW0gdXNhZ2VDb3VudCBUaGUgYW1vdW50IG9mIHVzYWdlcyB0byBhZGQuXG5cdCAqL1xuXHRwdWJsaWMgYWRkRnJhZ21lbnRUZW1wVXNhZ2VzKHJlZ2lzdGVyOlNoYWRlclJlZ2lzdGVyRWxlbWVudCwgdXNhZ2VDb3VudDpudW1iZXIpXG5cdHtcblx0XHR0aGlzLl9mcmFnbWVudFRlbXBDYWNoZS5hZGRVc2FnZShyZWdpc3RlciwgdXNhZ2VDb3VudCk7XG5cdH1cblxuXHQvKipcblx0ICogUmVtb3ZlcyBhIHVzYWdlIGZyb20gYSBmcmFnbWVudCB0ZW1wb3JhcnkgcmVnaXN0ZXIuIFdoZW4gdXNhZ2VzIHJlYWNoIDAsIHRoZSByZWdpc3RlciBpcyBmcmVlZCBhZ2Fpbi5cblx0ICogQHBhcmFtIHJlZ2lzdGVyIFRoZSByZWdpc3RlciBmb3Igd2hpY2ggdG8gcmVtb3ZlIGEgdXNhZ2UuXG5cdCAqL1xuXHRwdWJsaWMgcmVtb3ZlRnJhZ21lbnRUZW1wVXNhZ2UocmVnaXN0ZXI6U2hhZGVyUmVnaXN0ZXJFbGVtZW50KVxuXHR7XG5cdFx0dGhpcy5fZnJhZ21lbnRUZW1wQ2FjaGUucmVtb3ZlVXNhZ2UocmVnaXN0ZXIpO1xuXHR9XG5cblx0LyoqXG5cdCAqIE1hcmtzIGEgdmVydGV4IHRlbXBvcmFyeSByZWdpc3RlciBhcyB1c2VkLCBzbyBpdCBjYW5ub3QgYmUgcmV0cmlldmVkLiBUaGUgcmVnaXN0ZXIgd29uJ3QgYmUgYWJsZSB0byBiZSB1c2VkXG5cdCAqIHVudGlsIHJlbW92ZVVzYWdlIGhhcyBiZWVuIGNhbGxlZCB1c2FnZUNvdW50IHRpbWVzIGFnYWluLlxuXHQgKiBAcGFyYW0gcmVnaXN0ZXIgVGhlIHJlZ2lzdGVyIHRvIG1hcmsgYXMgdXNlZC5cblx0ICogQHBhcmFtIHVzYWdlQ291bnQgVGhlIGFtb3VudCBvZiB1c2FnZXMgdG8gYWRkLlxuXHQgKi9cblx0cHVibGljIGFkZFZlcnRleFRlbXBVc2FnZXMocmVnaXN0ZXI6U2hhZGVyUmVnaXN0ZXJFbGVtZW50LCB1c2FnZUNvdW50Om51bWJlcilcblx0e1xuXHRcdHRoaXMuX3ZlcnRleFRlbXBDYWNoZS5hZGRVc2FnZShyZWdpc3RlciwgdXNhZ2VDb3VudCk7XG5cdH1cblxuXHQvKipcblx0ICogUmVtb3ZlcyBhIHVzYWdlIGZyb20gYSB2ZXJ0ZXggdGVtcG9yYXJ5IHJlZ2lzdGVyLiBXaGVuIHVzYWdlcyByZWFjaCAwLCB0aGUgcmVnaXN0ZXIgaXMgZnJlZWQgYWdhaW4uXG5cdCAqIEBwYXJhbSByZWdpc3RlciBUaGUgcmVnaXN0ZXIgZm9yIHdoaWNoIHRvIHJlbW92ZSBhIHVzYWdlLlxuXHQgKi9cblx0cHVibGljIHJlbW92ZVZlcnRleFRlbXBVc2FnZShyZWdpc3RlcjpTaGFkZXJSZWdpc3RlckVsZW1lbnQpXG5cdHtcblx0XHR0aGlzLl92ZXJ0ZXhUZW1wQ2FjaGUucmVtb3ZlVXNhZ2UocmVnaXN0ZXIpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHJpZXZlIGFuIGVudGlyZSBmcmFnbWVudCB0ZW1wb3JhcnkgcmVnaXN0ZXIgdGhhdCdzIHN0aWxsIGF2YWlsYWJsZS4gVGhlIHJlZ2lzdGVyIHdvbid0IGJlIGFibGUgdG8gYmUgdXNlZCB1bnRpbCByZW1vdmVVc2FnZVxuXHQgKiBoYXMgYmVlbiBjYWxsZWQgdXNhZ2VDb3VudCB0aW1lcyBhZ2Fpbi5cblx0ICovXG5cdHB1YmxpYyBnZXRGcmVlRnJhZ21lbnRWZWN0b3JUZW1wKCk6U2hhZGVyUmVnaXN0ZXJFbGVtZW50XG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fZnJhZ21lbnRUZW1wQ2FjaGUucmVxdWVzdEZyZWVWZWN0b3JSZWcoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXRyaWV2ZSBhIHNpbmdsZSBjb21wb25lbnQgZnJvbSBhIGZyYWdtZW50IHRlbXBvcmFyeSByZWdpc3RlciB0aGF0J3Mgc3RpbGwgYXZhaWxhYmxlLlxuXHQgKi9cblx0cHVibGljIGdldEZyZWVGcmFnbWVudFNpbmdsZVRlbXAoKTpTaGFkZXJSZWdpc3RlckVsZW1lbnRcblx0e1xuXHRcdHJldHVybiB0aGlzLl9mcmFnbWVudFRlbXBDYWNoZS5yZXF1ZXN0RnJlZVJlZ0NvbXBvbmVudCgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHJpZXZlIGFuIGF2YWlsYWJsZSB2YXJ5aW5nIHJlZ2lzdGVyXG5cdCAqL1xuXHRwdWJsaWMgZ2V0RnJlZVZhcnlpbmcoKTpTaGFkZXJSZWdpc3RlckVsZW1lbnRcblx0e1xuXHRcdCsrdGhpcy5fbnVtVXNlZFZhcnlpbmdzO1xuXHRcdHJldHVybiB0aGlzLl92YXJ5aW5nQ2FjaGUucmVxdWVzdEZyZWVWZWN0b3JSZWcoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXRyaWV2ZSBhbiBhdmFpbGFibGUgZnJhZ21lbnQgY29uc3RhbnQgcmVnaXN0ZXJcblx0ICovXG5cdHB1YmxpYyBnZXRGcmVlRnJhZ21lbnRDb25zdGFudCgpOlNoYWRlclJlZ2lzdGVyRWxlbWVudFxuXHR7XG5cdFx0Kyt0aGlzLl9udW1Vc2VkRnJhZ21lbnRDb25zdGFudHM7XG5cdFx0cmV0dXJuIHRoaXMuX2ZyYWdtZW50Q29uc3RhbnRzQ2FjaGUucmVxdWVzdEZyZWVWZWN0b3JSZWcoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXRyaWV2ZSBhbiBhdmFpbGFibGUgdmVydGV4IGNvbnN0YW50IHJlZ2lzdGVyXG5cdCAqL1xuXHRwdWJsaWMgZ2V0RnJlZVZlcnRleENvbnN0YW50KCk6U2hhZGVyUmVnaXN0ZXJFbGVtZW50XG5cdHtcblx0XHQrK3RoaXMuX251bVVzZWRWZXJ0ZXhDb25zdGFudHM7XG5cdFx0cmV0dXJuIHRoaXMuX3ZlcnRleENvbnN0YW50c0NhY2hlLnJlcXVlc3RGcmVlVmVjdG9yUmVnKCk7XG5cdH1cblxuXHQvKipcblx0ICogUmV0cmlldmUgYW4gZW50aXJlIHZlcnRleCB0ZW1wb3JhcnkgcmVnaXN0ZXIgdGhhdCdzIHN0aWxsIGF2YWlsYWJsZS5cblx0ICovXG5cdHB1YmxpYyBnZXRGcmVlVmVydGV4VmVjdG9yVGVtcCgpOlNoYWRlclJlZ2lzdGVyRWxlbWVudFxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3ZlcnRleFRlbXBDYWNoZS5yZXF1ZXN0RnJlZVZlY3RvclJlZygpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHJpZXZlIGEgc2luZ2xlIGNvbXBvbmVudCBmcm9tIGEgdmVydGV4IHRlbXBvcmFyeSByZWdpc3RlciB0aGF0J3Mgc3RpbGwgYXZhaWxhYmxlLlxuXHQgKi9cblx0cHVibGljIGdldEZyZWVWZXJ0ZXhTaW5nbGVUZW1wKCk6U2hhZGVyUmVnaXN0ZXJFbGVtZW50XG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fdmVydGV4VGVtcENhY2hlLnJlcXVlc3RGcmVlUmVnQ29tcG9uZW50KCk7XG5cdH1cblxuXHQvKipcblx0ICogUmV0cmlldmUgYW4gYXZhaWxhYmxlIHZlcnRleCBhdHRyaWJ1dGUgcmVnaXN0ZXJcblx0ICovXG5cdHB1YmxpYyBnZXRGcmVlVmVydGV4QXR0cmlidXRlKCk6U2hhZGVyUmVnaXN0ZXJFbGVtZW50XG5cdHtcblx0XHQrK3RoaXMuX251bVVzZWRTdHJlYW1zO1xuXHRcdHJldHVybiB0aGlzLl92ZXJ0ZXhBdHRyaWJ1dGVzQ2FjaGUucmVxdWVzdEZyZWVWZWN0b3JSZWcoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXRyaWV2ZSBhbiBhdmFpbGFibGUgdGV4dHVyZSByZWdpc3RlclxuXHQgKi9cblx0cHVibGljIGdldEZyZWVUZXh0dXJlUmVnKCk6U2hhZGVyUmVnaXN0ZXJFbGVtZW50XG5cdHtcblx0XHQrK3RoaXMuX251bVVzZWRUZXh0dXJlcztcblx0XHRyZXR1cm4gdGhpcy5fdGV4dHVyZUNhY2hlLnJlcXVlc3RGcmVlVmVjdG9yUmVnKCk7XG5cdH1cblxuXHQvKipcblx0ICogSW5kaWNhdGVzIHRoZSBzdGFydCBpbmRleCBmcm9tIHdoaWNoIHRvIHJldHJpZXZlIHZlcnRleCBjb25zdGFudHMuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IHZlcnRleENvbnN0YW50T2Zmc2V0KCk6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fdmVydGV4Q29uc3RhbnRPZmZzZXQ7XG5cdH1cblxuXHRwdWJsaWMgc2V0IHZlcnRleENvbnN0YW50T2Zmc2V0KHZlcnRleENvbnN0YW50T2Zmc2V0Om51bWJlcilcblx0e1xuXHRcdHRoaXMuX3ZlcnRleENvbnN0YW50T2Zmc2V0ID0gdmVydGV4Q29uc3RhbnRPZmZzZXQ7XG5cdH1cblxuXHQvKipcblx0ICogSW5kaWNhdGVzIHRoZSBzdGFydCBpbmRleCBmcm9tIHdoaWNoIHRvIHJldHJpZXZlIHZlcnRleCBhdHRyaWJ1dGVzLlxuXHQgKi9cblx0cHVibGljIGdldCB2ZXJ0ZXhBdHRyaWJ1dGVzT2Zmc2V0KCk6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fdmVydGV4QXR0cmlidXRlc09mZnNldDtcblx0fVxuXG5cdHB1YmxpYyBzZXQgdmVydGV4QXR0cmlidXRlc09mZnNldCh2YWx1ZTpudW1iZXIpXG5cdHtcblx0XHR0aGlzLl92ZXJ0ZXhBdHRyaWJ1dGVzT2Zmc2V0ID0gdmFsdWU7XG5cdH1cblxuXHQvKipcblx0ICogSW5kaWNhdGVzIHRoZSBzdGFydCBpbmRleCBmcm9tIHdoaWNoIHRvIHJldHJpZXZlIHZhcnlpbmcgcmVnaXN0ZXJzLlxuXHQgKi9cblx0cHVibGljIGdldCB2YXJ5aW5nc09mZnNldCgpOm51bWJlclxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3ZhcnlpbmdzT2Zmc2V0O1xuXHR9XG5cblx0cHVibGljIHNldCB2YXJ5aW5nc09mZnNldCh2YWx1ZTpudW1iZXIpXG5cdHtcblx0XHR0aGlzLl92YXJ5aW5nc09mZnNldCA9IHZhbHVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIEluZGljYXRlcyB0aGUgc3RhcnQgaW5kZXggZnJvbSB3aGljaCB0byByZXRyaWV2ZSBmcmFnbWVudCBjb25zdGFudHMuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGZyYWdtZW50Q29uc3RhbnRPZmZzZXQoKTpudW1iZXJcblx0e1xuXHRcdHJldHVybiB0aGlzLl9mcmFnbWVudENvbnN0YW50T2Zmc2V0O1xuXHR9XG5cblx0cHVibGljIHNldCBmcmFnbWVudENvbnN0YW50T2Zmc2V0KHZhbHVlOm51bWJlcilcblx0e1xuXHRcdHRoaXMuX2ZyYWdtZW50Q29uc3RhbnRPZmZzZXQgPSB2YWx1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgZnJhZ21lbnQgb3V0cHV0IHJlZ2lzdGVyLlxuXHQgKi9cblx0cHVibGljIGdldCBmcmFnbWVudE91dHB1dFJlZ2lzdGVyKCk6U2hhZGVyUmVnaXN0ZXJFbGVtZW50XG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fZnJhZ21lbnRPdXRwdXRSZWdpc3Rlcjtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgYW1vdW50IG9mIHVzZWQgdmVydGV4IGNvbnN0YW50IHJlZ2lzdGVycy5cblx0ICovXG5cdHB1YmxpYyBnZXQgbnVtVXNlZFZlcnRleENvbnN0YW50cygpOm51bWJlclxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX251bVVzZWRWZXJ0ZXhDb25zdGFudHM7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIGFtb3VudCBvZiB1c2VkIGZyYWdtZW50IGNvbnN0YW50IHJlZ2lzdGVycy5cblx0ICovXG5cdHB1YmxpYyBnZXQgbnVtVXNlZEZyYWdtZW50Q29uc3RhbnRzKCk6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fbnVtVXNlZEZyYWdtZW50Q29uc3RhbnRzO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBhbW91bnQgb2YgdXNlZCB2ZXJ0ZXggc3RyZWFtcy5cblx0ICovXG5cdHB1YmxpYyBnZXQgbnVtVXNlZFN0cmVhbXMoKTpudW1iZXJcblx0e1xuXHRcdHJldHVybiB0aGlzLl9udW1Vc2VkU3RyZWFtcztcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgYW1vdW50IG9mIHVzZWQgdGV4dHVyZSBzbG90cy5cblx0ICovXG5cdHB1YmxpYyBnZXQgbnVtVXNlZFRleHR1cmVzKCk6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fbnVtVXNlZFRleHR1cmVzO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBhbW91bnQgb2YgdXNlZCB2YXJ5aW5nIHJlZ2lzdGVycy5cblx0ICovXG5cdHB1YmxpYyBnZXQgbnVtVXNlZFZhcnlpbmdzKCk6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fbnVtVXNlZFZhcnlpbmdzO1xuXHR9XG59XG5cbmV4cG9ydCA9IFNoYWRlclJlZ2lzdGVyQ2FjaGU7Il19