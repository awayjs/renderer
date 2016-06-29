import { ImageBase } from "@awayjs/core/lib/image/ImageBase";
import { BitmapImage2D } from "@awayjs/core/lib/image/BitmapImage2D";
import { Rectangle } from "@awayjs/core/lib/geom/Rectangle";
import { Camera } from "@awayjs/display/lib/display/Camera";
import { IEntity } from "@awayjs/display/lib/display/IEntity";
import { Scene } from "@awayjs/display/lib/display/Scene";
import { INode } from "@awayjs/display/lib/partition/INode";
import { Stage } from "@awayjs/stage/lib/base/Stage";
import { RendererBase } from "./RendererBase";
import { Filter3DRenderer } from "./Filter3DRenderer";
import { Filter3DBase } from "./filters/Filter3DBase";
/**
 * The DefaultRenderer class provides the default rendering method. It renders the scene graph objects using the
 * materials assigned to them.
 *
 * @class away.render.DefaultRenderer
 */
export declare class DefaultRenderer extends RendererBase {
    _pRequireDepthRender: boolean;
    private _pDistanceRenderer;
    private _pDepthRenderer;
    _pFilter3DRenderer: Filter3DRenderer;
    _pDepthRender: BitmapImage2D;
    private _antiAlias;
    private _directionalLights;
    private _pointLights;
    private _lightProbes;
    antiAlias: number;
    /**
     *
     */
    depthPrepass: boolean;
    /**
     *
     * @returns {*}
     */
    filters3d: Array<Filter3DBase>;
    /**
     * Creates a new DefaultRenderer object.
     *
     * @param antiAlias The amount of anti-aliasing to use.
     * @param renderMode The render mode to use.
     */
    constructor(stage?: Stage, forceSoftware?: boolean, profile?: string, mode?: string);
    /**
     *
     */
    enterNode(node: INode): boolean;
    render(camera: Camera, scene: Scene): void;
    pExecuteRender(camera: Camera, target?: ImageBase, scissorRect?: Rectangle, surfaceSelector?: number): void;
    private updateLights(camera);
    /**
     *
     * @param entity
     */
    applyDirectionalLight(entity: IEntity): void;
    /**
     *
     * @param entity
     */
    applyLightProbe(entity: IEntity): void;
    /**
     *
     * @param entity
     */
    applyPointLight(entity: IEntity): void;
    dispose(): void;
    /**
     *
     */
    pRenderDepthPrepass(camera: Camera, scene: Scene): void;
    /**
     *
     */
    pRenderSceneDepthToTexture(camera: Camera, scene: Scene): void;
    /**
     * Updates the backbuffer dimensions.
     */
    pUpdateBackBuffer(): void;
    /**
     *
     */
    private initDepthTexture(context);
}
