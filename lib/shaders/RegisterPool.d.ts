import { ShaderRegisterElement } from "../shaders/ShaderRegisterElement";
/**
 * RegisterPool is used by the shader compilers process to keep track of which registers of a certain type are
 * currently used and should not be allowed to be written to. Either entire registers can be requested and locked,
 * or single components (x, y, z, w) of a single register.
 * It is used by ShaderRegisterCache to track usages of individual register types.
 *
 * @see away.materials.ShaderRegisterCache
 */
export declare class RegisterPool {
    private static _regPool;
    private static _regCompsPool;
    private _vectorRegisters;
    private _registerComponents;
    private _regName;
    private _usedSingleCount;
    private _usedVectorCount;
    private _regCount;
    private _persistent;
    /**
     * Creates a new RegisterPool object.
     * @param regName The base name of the register type ("ft" for fragment temporaries, "vc" for vertex constants, etc)
     * @param regCount The amount of available registers of this type.
     * @param persistent Whether or not registers, once reserved, can be freed again. For example, temporaries are not persistent, but constants are.
     */
    constructor(regName: string, regCount: number, persistent?: boolean);
    /**
     * Retrieve an entire vector register that's still available.
     */
    requestFreeVectorReg(): ShaderRegisterElement;
    /**
     * Retrieve a single vector component that's still available.
     */
    requestFreeRegComponent(): ShaderRegisterElement;
    /**
     * Marks a register as used, so it cannot be retrieved. The register won't be able to be used until removeUsage
     * has been called usageCount times again.
     * @param register The register to mark as used.
     * @param usageCount The amount of usages to add.
     */
    addUsage(register: ShaderRegisterElement, usageCount: number): void;
    /**
     * Removes a usage from a register. When usages reach 0, the register is freed again.
     * @param register The register for which to remove a usage.
     */
    removeUsage(register: ShaderRegisterElement): void;
    /**
     * Disposes any resources used by the current RegisterPool object.
     */
    dispose(): void;
    /**
     * Indicates whether or not any registers are in use.
     */
    hasRegisteredRegs(): boolean;
    /**
     * Initializes all registers.
     */
    private initRegisters(regName, regCount);
    private static _initPool(regName, regCount);
    /**
     * Check if the temp register is either used for single or vector use
     */
    private isRegisterUsed(index);
    private _initArray(a, val);
}
