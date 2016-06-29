import { Image2D } from "@awayjs/core/lib/image/Image2D";
import { Filter3DBase } from "../filters/Filter3DBase";
export declare class CompositeFilter3D extends Filter3DBase {
    private _compositeTask;
    /**
     * Creates a new CompositeFilter3D object
     * @param blurX The amount of horizontal blur to apply
     * @param blurY The amount of vertical blur to apply
     * @param stepSize The distance between samples. Set to -1 to autodetect with acceptable quality.
     */
    constructor(blendMode: string, exposure?: number);
    exposure: number;
    overlayTexture: Image2D;
}
