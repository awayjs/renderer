import { Skybox } from "@awayjs/display/lib/display/Skybox";
import { RendererBase } from "../RendererBase";
import { ShaderBase } from "../shaders/ShaderBase";
import { GL_RenderableBase } from "../renderables/GL_RenderableBase";
import { GL_SurfaceBase } from "../surfaces/GL_SurfaceBase";
import { GL_SkyboxElements } from "../elements/GL_SkyboxElements";
/**
 * @class away.pool.GL_SkyboxRenderable
 */
export declare class GL_SkyboxRenderable extends GL_RenderableBase {
    /**
     *
     */
    private static _elementsGL;
    /**
     *
     */
    private _skybox;
    /**
     * //TODO
     *
     * @param pool
     * @param skybox
     */
    constructor(skybox: Skybox, renderer: RendererBase);
    /**
     * //TODO
     *
     * @returns {away.base.TriangleElements}
     * @private
     */
    _pGetElements(): GL_SkyboxElements;
    _pGetSurface(): GL_SurfaceBase;
    static _iIncludeDependencies(shader: ShaderBase): void;
}
