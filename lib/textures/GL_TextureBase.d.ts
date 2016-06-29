import { AssetEvent } from "@awayjs/core/lib/events/AssetEvent";
import { ImageBase } from "@awayjs/core/lib/image/ImageBase";
import { AbstractionBase } from "@awayjs/core/lib/library/AbstractionBase";
import { Stage } from "@awayjs/stage/lib/base/Stage";
import { TextureBase } from "@awayjs/display/lib/textures/TextureBase";
import { GL_SurfaceBase } from "../surfaces/GL_SurfaceBase";
import { GL_RenderableBase } from "../renderables/GL_RenderableBase";
import { ShaderBase } from "../shaders/ShaderBase";
import { ShaderRegisterCache } from "../shaders/ShaderRegisterCache";
import { ShaderRegisterData } from "../shaders/ShaderRegisterData";
import { ShaderRegisterElement } from "../shaders/ShaderRegisterElement";
/**
 *
 * @class away.pool.GL_TextureBaseBase
 */
export declare class GL_TextureBase extends AbstractionBase {
    private _texture;
    _shader: ShaderBase;
    _stage: Stage;
    constructor(texture: TextureBase, shader: ShaderBase);
    /**
     *
     */
    onClear(event: AssetEvent): void;
    _iGetFragmentCode(targetReg: ShaderRegisterElement, regCache: ShaderRegisterCache, sharedReg: ShaderRegisterData, inputReg?: ShaderRegisterElement): string;
    _setRenderState(renderable: GL_RenderableBase): void;
    activate(render: GL_SurfaceBase): void;
    getTextureReg(imageIndex: number, regCache: ShaderRegisterCache, sharedReg: ShaderRegisterData): ShaderRegisterElement;
    getFormatString(image: ImageBase): string;
}
