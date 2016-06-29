import { AssetEvent } from "@awayjs/core/lib/events/AssetEvent";
import { AbstractionBase } from "@awayjs/core/lib/library/AbstractionBase";
import { ISurface } from "@awayjs/display/lib/base/ISurface";
import { SurfaceEvent } from "@awayjs/display/lib/events/SurfaceEvent";
import { TextureBase } from "@awayjs/display/lib/textures/TextureBase";
import { Stage } from "@awayjs/stage/lib/base/Stage";
import { GL_ImageBase } from "@awayjs/stage/lib/image/GL_ImageBase";
import { GL_SamplerBase } from "@awayjs/stage/lib/image/GL_SamplerBase";
import { ShaderBase } from "../shaders/ShaderBase";
import { SurfacePool } from "../surfaces/SurfacePool";
import { IPass } from "../surfaces/passes/IPass";
import { IElementsClassGL } from "../elements/IElementsClassGL";
/**
 *
 * @class away.pool.Passes
 */
export declare class GL_SurfaceBase extends AbstractionBase {
    private _onInvalidateAnimationDelegate;
    private _onInvalidatePassesDelegate;
    usages: number;
    _forceSeparateMVP: boolean;
    _surface: ISurface;
    _elementsClass: IElementsClassGL;
    _stage: Stage;
    private _renderOrderId;
    private _usesAnimation;
    private _invalidAnimation;
    private _invalidRender;
    private _invalidImages;
    private _passes;
    private _imageIndices;
    private _numImages;
    _pRequiresBlending: boolean;
    private _onPassInvalidateDelegate;
    surfaceID: number;
    images: Array<GL_ImageBase>;
    samplers: Array<GL_SamplerBase>;
    /**
     * Indicates whether or not the renderable requires alpha blending during rendering.
     */
    readonly requiresBlending: boolean;
    readonly renderOrderId: number;
    readonly passes: Array<IPass>;
    readonly surface: ISurface;
    readonly numImages: number;
    constructor(surface: ISurface, elementsClass: IElementsClassGL, renderPool: SurfacePool);
    _iIncludeDependencies(shader: ShaderBase): void;
    getImageIndex(texture: TextureBase, index?: number): number;
    /**
     *
     */
    onClear(event: AssetEvent): void;
    /**
     *
     */
    onInvalidate(event: AssetEvent): void;
    /**
     *
     */
    onInvalidatePasses(event: SurfaceEvent): void;
    /**
     *
     */
    onInvalidateAnimation(event: SurfaceEvent): void;
    /**
     *
     * @param surface
     */
    private _updateAnimation();
    private _updateImages();
    /**
     * Performs any processing that needs to occur before any of its passes are used.
     *
     * @private
     */
    _pUpdateRender(): void;
    /**
     * Removes a pass from the surface.
     * @param pass The pass to be removed.
     */
    _pRemovePass(pass: IPass): void;
    /**
     * Removes all passes from the surface
     */
    _pClearPasses(): void;
    /**
     * Adds a pass to the surface
     * @param pass
     */
    _pAddPass(pass: IPass): void;
    /**
     * Listener for when a pass's shader code changes. It recalculates the render order id.
     */
    private onPassInvalidate(event);
    /**
     * test if animation will be able to run on gpu BEFORE compiling materials
     * test if the shader objects supports animating the animation set in the vertex shader
     * if any object using this material fails to support accelerated animations for any of the shader objects,
     * we should do everything on cpu (otherwise we have the cost of both gpu + cpu animations)
     */
    private _getEnabledGPUAnimation();
}
