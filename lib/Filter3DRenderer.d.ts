import { Image2D } from "@awayjs/core/lib/image/Image2D";
import { Camera } from "@awayjs/display/lib/display/Camera";
import { Stage } from "@awayjs/stage/lib/base/Stage";
import { Filter3DBase } from "./filters/Filter3DBase";
/**
 * @class away.render.Filter3DRenderer
 */
export declare class Filter3DRenderer {
    private _filters;
    private _tasks;
    private _filterTasksInvalid;
    private _mainInputTexture;
    private _requireDepthRender;
    private _rttManager;
    private _stage;
    private _filterSizesInvalid;
    private _onRTTResizeDelegate;
    constructor(stage: Stage);
    private onRTTResize(event);
    readonly requireDepthRender: boolean;
    getMainInputTexture(stage: Stage): Image2D;
    filters: Filter3DBase[];
    private updateFilterTasks(stage);
    render(stage: Stage, camera: Camera, depthTexture: Image2D): void;
    private updateFilterSizes();
    dispose(): void;
}
