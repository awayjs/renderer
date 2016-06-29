import { Matrix3D } from "@awayjs/core/lib/geom/Matrix3D";
import { EventDispatcher } from "@awayjs/core/lib/events/EventDispatcher";
import { Camera } from "@awayjs/display/lib/display/Camera";
import { ISurface } from "@awayjs/display/lib/base/ISurface";
import { TextureBase } from "@awayjs/display/lib/textures/TextureBase";
import { Stage } from "@awayjs/stage/lib/base/Stage";
import { AnimationSetBase } from "../../animators/AnimationSetBase";
import { ShaderBase } from "../../shaders/ShaderBase";
import { ShaderRegisterCache } from "../../shaders/ShaderRegisterCache";
import { ShaderRegisterData } from "../../shaders/ShaderRegisterData";
import { IPass } from "../../surfaces/passes/IPass";
import { IElementsClassGL } from "../../elements/IElementsClassGL";
import { GL_RenderableBase } from "../../renderables/GL_RenderableBase";
import { GL_SurfaceBase } from "../../surfaces/GL_SurfaceBase";
/**
 * PassBase provides an abstract base class for material shader passes. A material pass constitutes at least
 * a render call per required renderable.
 */
export declare class PassBase extends EventDispatcher implements IPass {
    _render: GL_SurfaceBase;
    _surface: ISurface;
    _elementsClass: IElementsClassGL;
    _stage: Stage;
    _shader: ShaderBase;
    private _preserveAlpha;
    private _forceSeparateMVP;
    readonly shader: ShaderBase;
    readonly animationSet: AnimationSetBase;
    /**
     * Indicates whether the output alpha value should remain unchanged compared to the material's original alpha.
     */
    preserveAlpha: boolean;
    /**
     * Indicates whether the screen projection should be calculated by forcing a separate scene matrix and
     * view-projection matrix. This is used to prevent rounding errors when using multiple passes with different
     * projection code.
     */
    forceSeparateMVP: boolean;
    /**
     * Creates a new PassBase object.
     */
    constructor(render: GL_SurfaceBase, surface: ISurface, elementsClass: IElementsClassGL, stage: Stage);
    getImageIndex(texture: TextureBase, index?: number): number;
    /**
     * Marks the shader program as invalid, so it will be recompiled before the next render.
     */
    invalidate(): void;
    /**
     * Cleans up any resources used by the current object.
     * @param deep Indicates whether other resources should be cleaned up, that could potentially be shared across different instances.
     */
    dispose(): void;
    /**
     * Renders the current pass. Before calling pass, activatePass needs to be called with the same index.
     * @param pass The pass used to render the renderable.
     * @param renderable The IRenderable object to draw.
     * @param stage The Stage object used for rendering.
     * @param entityCollector The EntityCollector object that contains the visible scene data.
     * @param viewProjection The view-projection matrix used to project to the screen. This is not the same as
     * camera.viewProjection as it includes the scaling factors when rendering to textures.
     *
     * @internal
     */
    _setRenderState(renderable: GL_RenderableBase, camera: Camera, viewProjection: Matrix3D): void;
    /**
     * Sets the render state for the pass that is independent of the rendered object. This needs to be called before
     * calling pass. Before activating a pass, the previously used pass needs to be deactivated.
     * @param stage The Stage object which is currently used for rendering.
     * @param camera The camera from which the scene is viewed.
     * @private
     */
    _iActivate(camera: Camera): void;
    /**
     * Clears the render state for the pass. This needs to be called before activating another pass.
     * @param stage The Stage used for rendering
     *
     * @private
     */
    _iDeactivate(): void;
    _iIncludeDependencies(shader: ShaderBase): void;
    _iInitConstantData(shader: ShaderBase): void;
    _iGetPreLightingVertexCode(shader: ShaderBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    _iGetPreLightingFragmentCode(shader: ShaderBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    _iGetVertexCode(shader: ShaderBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    _iGetFragmentCode(shader: ShaderBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    _iGetNormalVertexCode(shader: ShaderBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    _iGetNormalFragmentCode(shader: ShaderBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
}
