import { Filter3DBase } from "../filters/Filter3DBase";
export declare class FXAAFilter3D extends Filter3DBase {
    private _fxaaTask;
    /**
     * Creates a new FXAAFilter3D object
     * @param amount
     * @param stepSize The distance between samples. Set to -1 to autodetect with acceptable quality.
     */
    constructor(amount: number, stepSize?: number);
    amount: number;
    stepSize: number;
}
