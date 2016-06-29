/**
 * A single register element (an entire register or a single register's component) used by the RegisterPool.
 */
export declare class ShaderRegisterElement {
    private _regName;
    private _index;
    private _toStr;
    private static COMPONENTS;
    _component: number;
    /**
     * Creates a new ShaderRegisterElement object.
     *
     * @param regName The name of the register.
     * @param index The index of the register.
     * @param component The register's component, if not the entire register is represented.
     */
    constructor(regName: string, index: number, component?: number);
    /**
     * Converts the register or the components AGAL string representation.
     */
    toString(): string;
    /**
     * The register's name.
     */
    readonly regName: string;
    /**
     * The register's index.
     */
    readonly index: number;
}
