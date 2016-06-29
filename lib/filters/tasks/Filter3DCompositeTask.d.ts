import { Image2D } from "@awayjs/core/lib/image/Image2D";
import { Camera } from "@awayjs/display/lib/display/Camera";
import { Stage } from "@awayjs/stage/lib/base/Stage";
import { Filter3DTaskBase } from "../../filters/tasks/Filter3DTaskBase";
export declare class Filter3DCompositeTask extends Filter3DTaskBase {
    private _data;
    private _overlayTexture;
    private _overlayWidth;
    private _overlayHeight;
    private _blendMode;
    private _overlayTextureIndex;
    private _exposureIndex;
    private _scalingIndex;
    constructor(blendMode: string, exposure?: number);
    overlayTexture: Image2D;
    exposure: number;
    getFragmentCode(): string;
    activate(stage: Stage, camera3D: Camera, depthTexture: Image2D): void;
    deactivate(stage: Stage): void;
}
