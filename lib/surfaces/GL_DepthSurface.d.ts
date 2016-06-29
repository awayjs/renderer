import { ISurface } from "@awayjs/display/lib/base/ISurface";
import { Camera } from "@awayjs/display/lib/display/Camera";
import { IElementsClassGL } from "../elements/IElementsClassGL";
import { GL_SurfacePassBase } from "../surfaces/GL_SurfacePassBase";
import { SurfacePool } from "../surfaces/SurfacePool";
import { ShaderBase } from "../shaders/ShaderBase";
import { ShaderRegisterCache } from "../shaders/ShaderRegisterCache";
import { ShaderRegisterData } from "../shaders/ShaderRegisterData";
/**
 * GL_DepthSurface forms an abstract base class for the default shaded materials provided by Stage,
 * using material methods to define their appearance.
 */
export declare class GL_DepthSurface extends GL_SurfacePassBase {
    private _fragmentConstantsIndex;
    private _textureVO;
    /**
     *
     * @param pool
     * @param surface
     * @param elementsClass
     * @param stage
     */
    constructor(surface: ISurface, elementsClass: IElementsClassGL, renderPool: SurfacePool);
    invalidate(): void;
    _iIncludeDependencies(shader: ShaderBase): void;
    _iInitConstantData(shader: ShaderBase): void;
    /**
     * @inheritDoc
     */
    _iGetFragmentCode(shader: ShaderBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    /**
     * @inheritDoc
     */
    _iActivate(camera: Camera): void;
}
