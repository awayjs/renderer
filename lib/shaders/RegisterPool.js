"use strict";
var ShaderRegisterElement_1 = require("../shaders/ShaderRegisterElement");
/**
 * RegisterPool is used by the shader compilers process to keep track of which registers of a certain type are
 * currently used and should not be allowed to be written to. Either entire registers can be requested and locked,
 * or single components (x, y, z, w) of a single register.
 * It is used by ShaderRegisterCache to track usages of individual register types.
 *
 * @see away.materials.ShaderRegisterCache
 */
var RegisterPool = (function () {
    /**
     * Creates a new RegisterPool object.
     * @param regName The base name of the register type ("ft" for fragment temporaries, "vc" for vertex constants, etc)
     * @param regCount The amount of available registers of this type.
     * @param persistent Whether or not registers, once reserved, can be freed again. For example, temporaries are not persistent, but constants are.
     */
    function RegisterPool(regName, regCount, persistent) {
        if (persistent === void 0) { persistent = true; }
        this._regName = regName;
        this._regCount = regCount;
        this._persistent = persistent;
        this.initRegisters(regName, regCount);
    }
    /**
     * Retrieve an entire vector register that's still available.
     */
    RegisterPool.prototype.requestFreeVectorReg = function () {
        for (var i = 0; i < this._regCount; ++i) {
            if (!this.isRegisterUsed(i)) {
                if (this._persistent)
                    this._usedVectorCount[i]++;
                return this._vectorRegisters[i];
            }
        }
        throw new Error("Register overflow!");
    };
    /**
     * Retrieve a single vector component that's still available.
     */
    RegisterPool.prototype.requestFreeRegComponent = function () {
        for (var i = 0; i < this._regCount; ++i) {
            if (this._usedVectorCount[i] > 0)
                continue;
            for (var j = 0; j < 4; ++j) {
                if (this._usedSingleCount[j][i] == 0) {
                    if (this._persistent)
                        this._usedSingleCount[j][i]++;
                    return this._registerComponents[j][i];
                }
            }
        }
        throw new Error("Register overflow!");
    };
    /**
     * Marks a register as used, so it cannot be retrieved. The register won't be able to be used until removeUsage
     * has been called usageCount times again.
     * @param register The register to mark as used.
     * @param usageCount The amount of usages to add.
     */
    RegisterPool.prototype.addUsage = function (register, usageCount) {
        if (register._component > -1)
            this._usedSingleCount[register._component][register.index] += usageCount;
        else
            this._usedVectorCount[register.index] += usageCount;
    };
    /**
     * Removes a usage from a register. When usages reach 0, the register is freed again.
     * @param register The register for which to remove a usage.
     */
    RegisterPool.prototype.removeUsage = function (register) {
        if (register._component > -1) {
            if (--this._usedSingleCount[register._component][register.index] < 0)
                throw new Error("More usages removed than exist!");
        }
        else {
            if (--this._usedVectorCount[register.index] < 0)
                throw new Error("More usages removed than exist!");
        }
    };
    /**
     * Disposes any resources used by the current RegisterPool object.
     */
    RegisterPool.prototype.dispose = function () {
        this._vectorRegisters = null;
        this._registerComponents = null;
        this._usedSingleCount = null;
        this._usedVectorCount = null;
    };
    /**
     * Indicates whether or not any registers are in use.
     */
    RegisterPool.prototype.hasRegisteredRegs = function () {
        for (var i = 0; i < this._regCount; ++i)
            if (this.isRegisterUsed(i))
                return true;
        return false;
    };
    /**
     * Initializes all registers.
     */
    RegisterPool.prototype.initRegisters = function (regName, regCount) {
        var hash = RegisterPool._initPool(regName, regCount);
        this._vectorRegisters = RegisterPool._regPool[hash];
        this._registerComponents = RegisterPool._regCompsPool[hash];
        this._usedVectorCount = this._initArray(Array(regCount), 0);
        this._usedSingleCount = new Array(4);
        this._usedSingleCount[0] = this._initArray(new Array(regCount), 0);
        this._usedSingleCount[1] = this._initArray(new Array(regCount), 0);
        this._usedSingleCount[2] = this._initArray(new Array(regCount), 0);
        this._usedSingleCount[3] = this._initArray(new Array(regCount), 0);
    };
    RegisterPool._initPool = function (regName, regCount) {
        var hash = regName + regCount;
        if (RegisterPool._regPool[hash] != undefined)
            return hash;
        var vectorRegisters = new Array(regCount);
        RegisterPool._regPool[hash] = vectorRegisters;
        var registerComponents = [
            [],
            [],
            [],
            []
        ];
        RegisterPool._regCompsPool[hash] = registerComponents;
        for (var i = 0; i < regCount; ++i) {
            vectorRegisters[i] = new ShaderRegisterElement_1.ShaderRegisterElement(regName, i);
            for (var j = 0; j < 4; ++j)
                registerComponents[j][i] = new ShaderRegisterElement_1.ShaderRegisterElement(regName, i, j);
        }
        return hash;
    };
    /**
     * Check if the temp register is either used for single or vector use
     */
    RegisterPool.prototype.isRegisterUsed = function (index) {
        if (this._usedVectorCount[index] > 0)
            return true;
        for (var i = 0; i < 4; ++i)
            if (this._usedSingleCount[i][index] > 0)
                return true;
        return false;
    };
    RegisterPool.prototype._initArray = function (a, val) {
        var l = a.length;
        for (var c = 0; c < l; c++)
            a[c] = val;
        return a;
    };
    RegisterPool._regPool = new Object();
    RegisterPool._regCompsPool = new Object();
    return RegisterPool;
}());
exports.RegisterPool = RegisterPool;
