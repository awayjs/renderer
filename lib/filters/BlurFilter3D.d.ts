import { Image2D } from "@awayjs/core/lib/image/Image2D";
import { Stage } from "@awayjs/stage/lib/base/Stage";
import { Filter3DBase } from "../filters/Filter3DBase";
export declare class BlurFilter3D extends Filter3DBase {
    private _hBlurTask;
    private _vBlurTask;
    /**
     * Creates a new BlurFilter3D object
     * @param blurX The amount of horizontal blur to apply
     * @param blurY The amount of vertical blur to apply
     * @param stepSize The distance between samples. Set to -1 to autodetect with acceptable quality.
     */
    constructor(blurX?: number, blurY?: number, stepSize?: number);
    blurX: number;
    blurY: number;
    /**
     * The distance between two blur samples. Set to -1 to autodetect with acceptable quality (default value).
     * Higher values provide better performance at the cost of reduces quality.
     */
    stepSize: number;
    setRenderTargets(mainTarget: Image2D, stage: Stage): void;
}
