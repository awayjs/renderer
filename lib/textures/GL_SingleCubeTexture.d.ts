import { AssetEvent } from "@awayjs/core/lib/events/AssetEvent";
import { SingleCubeTexture } from "@awayjs/display/lib/textures/SingleCubeTexture";
import { GL_SurfaceBase } from "../surfaces/GL_SurfaceBase";
import { GL_RenderableBase } from "../renderables/GL_RenderableBase";
import { ShaderBase } from "../shaders/ShaderBase";
import { ShaderRegisterCache } from "../shaders/ShaderRegisterCache";
import { ShaderRegisterData } from "../shaders/ShaderRegisterData";
import { ShaderRegisterElement } from "../shaders/ShaderRegisterElement";
import { GL_TextureBase } from "../textures/GL_TextureBase";
/**
 *
 * @class away.pool.TextureDataBase
 */
export declare class GL_SingleCubeTexture extends GL_TextureBase {
    private _singleCubeTexture;
    private _textureIndex;
    private _imageIndex;
    constructor(singleCubeTexture: SingleCubeTexture, shader: ShaderBase);
    onClear(event: AssetEvent): void;
    _iIncludeDependencies(includeInput?: boolean): void;
    /**
     *
     * @param shader
     * @param regCache
     * @param targetReg The register in which to store the sampled colour.
     * @param uvReg The direction vector with which to sample the cube map.
     * @returns {string}
     * @private
     */
    _iGetFragmentCode(targetReg: ShaderRegisterElement, regCache: ShaderRegisterCache, sharedReg: ShaderRegisterData, inputReg: ShaderRegisterElement): string;
    activate(render: GL_SurfaceBase): void;
    _setRenderState(renderable: GL_RenderableBase): void;
}
