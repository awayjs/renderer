import { AssetEvent } from "@awayjs/core/lib/events/AssetEvent";
import { Matrix } from "@awayjs/core/lib/geom/Matrix";
import { Matrix3D } from "@awayjs/core/lib/geom/Matrix3D";
import { AbstractionBase } from "@awayjs/core/lib/library/AbstractionBase";
import { IRenderable } from "@awayjs/display/lib/base/IRenderable";
import { IEntity } from "@awayjs/display/lib/display/IEntity";
import { Camera } from "@awayjs/display/lib/display/Camera";
import { RenderableEvent } from "@awayjs/display/lib/events/RenderableEvent";
import { Stage } from "@awayjs/stage/lib/base/Stage";
import { GL_ImageBase } from "@awayjs/stage/lib/image/GL_ImageBase";
import { GL_SamplerBase } from "@awayjs/stage/lib/image/GL_SamplerBase";
import { RendererBase } from "../RendererBase";
import { GL_SurfaceBase } from "../surfaces/GL_SurfaceBase";
import { IPass } from "../surfaces/passes/IPass";
import { GL_ElementsBase } from "../elements/GL_ElementsBase";
/**
 * @class RenderableListItem
 */
export declare class GL_RenderableBase extends AbstractionBase {
    private _onInvalidateSurfaceDelegate;
    private _onInvalidateElementsDelegate;
    _count: number;
    _offset: number;
    private _elementsGL;
    private _surfaceGL;
    private _elementsDirty;
    private _surfaceDirty;
    JOINT_INDEX_FORMAT: string;
    JOINT_WEIGHT_FORMAT: string;
    /**
     *
     */
    _renderer: RendererBase;
    _stage: Stage;
    /**
     *
     */
    next: GL_RenderableBase;
    id: number;
    /**
     *
     */
    surfaceID: number;
    /**
     *
     */
    renderOrderId: number;
    /**
     *
     */
    zIndex: number;
    /**
     *
     */
    maskId: number;
    /**
     *
     */
    masksConfig: Array<Array<number>>;
    /**
     *
     */
    cascaded: boolean;
    /**
     *
     */
    renderSceneTransform: Matrix3D;
    /**
     *
     */
    sourceEntity: IEntity;
    /**
     *
     */
    renderable: IRenderable;
    uvMatrix: Matrix;
    images: Array<GL_ImageBase>;
    samplers: Array<GL_SamplerBase>;
    readonly elementsGL: GL_ElementsBase;
    readonly surfaceGL: GL_SurfaceBase;
    /**
     *
     * @param renderable
     * @param sourceEntity
     * @param surface
     * @param renderer
     */
    constructor(renderable: IRenderable, renderer: RendererBase);
    onClear(event: AssetEvent): void;
    onInvalidateElements(event: RenderableEvent): void;
    private _onInvalidateSurface(event);
    _pGetElements(): GL_ElementsBase;
    _pGetSurface(): GL_SurfaceBase;
    /**
     * Renders an object to the current render target.
     *
     * @private
     */
    _iRender(pass: IPass, camera: Camera, viewProjection: Matrix3D): void;
    _setRenderState(pass: IPass, camera: Camera, viewProjection: Matrix3D): void;
    /**
     * //TODO
     *
     * @private
     */
    private _updateElements();
    private _updateSurface();
}
