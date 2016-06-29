import { Image2D } from "@awayjs/core/lib/image/Image2D";
import { Camera } from "@awayjs/display/lib/display/Camera";
import { Stage } from "@awayjs/stage/lib/base/Stage";
import { Filter3DTaskBase } from "../../filters/tasks/Filter3DTaskBase";
export declare class Filter3DFXAATask extends Filter3DTaskBase {
    private _data;
    private static MAX_AUTO_SAMPLES;
    private _amount;
    private _stepSize;
    private _realStepSize;
    /**
     *
     * @param amount
     * @param stepSize The distance between samples. Set to -1 to autodetect with acceptable quality.
     */
    constructor(amount?: number, stepSize?: number);
    amount: number;
    stepSize: number;
    getFragmentCode(): string;
    activate(stage: Stage, camera3D: Camera, depthTexture: Image2D): void;
    updateTextures(stage: Stage): void;
    private updateBlurData();
    private calculateStepSize();
}
