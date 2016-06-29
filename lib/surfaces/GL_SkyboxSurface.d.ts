import { AssetEvent } from "@awayjs/core/lib/events/AssetEvent";
import { Matrix3D } from "@awayjs/core/lib/geom/Matrix3D";
import { Camera } from "@awayjs/display/lib/display/Camera";
import { Skybox } from "@awayjs/display/lib/display/Skybox";
import { GL_RenderableBase } from "../renderables/GL_RenderableBase";
import { IElementsClassGL } from "../elements/IElementsClassGL";
import { GL_SurfacePassBase } from "../surfaces/GL_SurfacePassBase";
import { SurfacePool } from "../surfaces/SurfacePool";
import { ShaderBase } from "../shaders/ShaderBase";
import { ShaderRegisterCache } from "../shaders/ShaderRegisterCache";
import { ShaderRegisterData } from "../shaders/ShaderRegisterData";
import { GL_TextureBase } from "../textures/GL_TextureBase";
/**
 * GL_SkyboxSurface forms an abstract base class for the default shaded materials provided by Stage,
 * using material methods to define their appearance.
 */
export declare class GL_SkyboxSurface extends GL_SurfacePassBase {
    _skybox: Skybox;
    _texture: GL_TextureBase;
    constructor(skybox: Skybox, elementsClass: IElementsClassGL, renderPool: SurfacePool);
    onClear(event: AssetEvent): void;
    /**
     * @inheritDoc
     */
    _pUpdateRender(): void;
    _iIncludeDependencies(shader: ShaderBase): void;
    /**
     * @inheritDoc
     */
    _iGetFragmentCode(shader: ShaderBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    _setRenderState(renderable: GL_RenderableBase, camera: Camera, viewProjection: Matrix3D): void;
    /**
     * @inheritDoc
     */
    _iActivate(camera: Camera): void;
}
