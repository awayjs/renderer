import { AssetEvent } from "@awayjs/core/lib/events/AssetEvent";
import { Single2DTexture } from "@awayjs/display/lib/textures/Single2DTexture";
import { GL_SurfaceBase } from "../surfaces/GL_SurfaceBase";
import { GL_RenderableBase } from "../renderables/GL_RenderableBase";
import { ShaderBase } from "../shaders/ShaderBase";
import { ShaderRegisterCache } from "../shaders/ShaderRegisterCache";
import { ShaderRegisterData } from "../shaders/ShaderRegisterData";
import { ShaderRegisterElement } from "../shaders/ShaderRegisterElement";
import { GL_TextureBase } from "../textures/GL_TextureBase";
/**
 *
 * @class away.pool.GL_Single2DTexture
 */
export declare class GL_Single2DTexture extends GL_TextureBase {
    private _single2DTexture;
    private _textureIndex;
    private _imageIndex;
    private _samplerIndex;
    constructor(single2DTexture: Single2DTexture, shader: ShaderBase);
    onClear(event: AssetEvent): void;
    /**
     *
     * @param shader
     * @param regCache
     * @param targetReg The register in which to store the sampled colour.
     * @param uvReg The uv coordinate vector with which to sample the texture map.
     * @returns {string}
     * @private
     */
    _iGetFragmentCode(targetReg: ShaderRegisterElement, regCache: ShaderRegisterCache, sharedReg: ShaderRegisterData, inputReg: ShaderRegisterElement): string;
    activate(render: GL_SurfaceBase): void;
    _setRenderState(renderable: GL_RenderableBase): void;
}
