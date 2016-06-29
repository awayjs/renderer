import { Matrix3D } from "@awayjs/core/lib/geom/Matrix3D";
import { Camera } from "@awayjs/display/lib/display/Camera";
import { AnimationSetBase } from "../animators/AnimationSetBase";
import { ShaderBase } from "../shaders/ShaderBase";
import { ShaderRegisterCache } from "../shaders/ShaderRegisterCache";
import { ShaderRegisterData } from "../shaders/ShaderRegisterData";
import { IPass } from "../surfaces/passes/IPass";
import { GL_RenderableBase } from "../renderables/GL_RenderableBase";
import { GL_SurfaceBase } from "../surfaces/GL_SurfaceBase";
/**
 * GL_SurfacePassBase provides an abstract base class for material shader passes. A material pass constitutes at least
 * a render call per required renderable.
 */
export declare class GL_SurfacePassBase extends GL_SurfaceBase implements IPass {
    _shader: ShaderBase;
    readonly shader: ShaderBase;
    readonly animationSet: AnimationSetBase;
    /**
     * Marks the shader program as invalid, so it will be recompiled before the next render.
     */
    invalidate(): void;
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
    _iInitConstantData(shader: ShaderBase): void;
    _iGetPreLightingVertexCode(shader: ShaderBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    _iGetPreLightingFragmentCode(shader: ShaderBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    _iGetVertexCode(shader: ShaderBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    _iGetFragmentCode(shader: ShaderBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    _iGetNormalVertexCode(shader: ShaderBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    _iGetNormalFragmentCode(shader: ShaderBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
}
