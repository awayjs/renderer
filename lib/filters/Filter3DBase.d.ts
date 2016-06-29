import { Image2D } from "@awayjs/core/lib/image/Image2D";
import { Camera } from "@awayjs/display/lib/display/Camera";
import { Stage } from "@awayjs/stage/lib/base/Stage";
import { Filter3DTaskBase } from "../filters/tasks/Filter3DTaskBase";
import { RTTBufferManager } from "../managers/RTTBufferManager";
export declare class Filter3DBase {
    private _tasks;
    private _requireDepthRender;
    private _rttManager;
    private _textureWidth;
    private _textureHeight;
    constructor();
    readonly requireDepthRender: boolean;
    addTask(filter: Filter3DTaskBase): void;
    readonly tasks: Filter3DTaskBase[];
    getMainInputTexture(stage: Stage): Image2D;
    textureWidth: number;
    rttManager: RTTBufferManager;
    textureHeight: number;
    setRenderTargets(mainTarget: Image2D, stage: Stage): void;
    dispose(): void;
    update(stage: Stage, camera: Camera): void;
}
