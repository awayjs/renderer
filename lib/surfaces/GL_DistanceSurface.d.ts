import { ISurface } from "@awayjs/display/lib/base/ISurface";
import { Camera } from "@awayjs/display/lib/display/Camera";
import { SurfacePool } from "../surfaces/SurfacePool";
import { GL_SurfacePassBase } from "../surfaces/GL_SurfacePassBase";
import { IElementsClassGL } from "../elements/IElementsClassGL";
import { ShaderBase } from "../shaders/ShaderBase";
import { ShaderRegisterCache } from "../shaders/ShaderRegisterCache";
import { ShaderRegisterData } from "../shaders/ShaderRegisterData";
/**
 * DistanceRender is a pass that writes distance values to a depth map as a 32-bit value exploded over the 4 texture channels.
 * This is used to render omnidirectional shadow maps.
 */
export declare class GL_DistanceSurface extends GL_SurfacePassBase {
    private _textureVO;
    private _fragmentConstantsIndex;
    /**
     * Creates a new DistanceRender object.
     *
     * @param material The material to which this pass belongs.
     */
    constructor(surface: ISurface, elementsClass: IElementsClassGL, renderPool: SurfacePool);
    invalidate(): void;
    /**
     * Initializes the unchanging constant data for this material.
     */
    _iInitConstantData(shader: ShaderBase): void;
    _iIncludeDependencies(shader: ShaderBase): void;
    /**
     * @inheritDoc
     */
    _iGetFragmentCode(shader: ShaderBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    /**
     * @inheritDoc
     */
    _iActivate(camera: Camera): void;
}
