import { Matrix3D } from "@awayjs/core/lib/geom/Matrix3D";
import { Camera } from "@awayjs/display/lib/display/Camera";
import { ISurface } from "@awayjs/display/lib/base/ISurface";
import { Stage } from "@awayjs/stage/lib/base/Stage";
import { GL_RenderableBase } from "../../renderables/GL_RenderableBase";
import { GL_SurfaceBase } from "../../surfaces/GL_SurfaceBase";
import { ShaderBase } from "../../shaders/ShaderBase";
import { ShaderRegisterCache } from "../../shaders/ShaderRegisterCache";
import { ShaderRegisterData } from "../../shaders/ShaderRegisterData";
import { IElementsClassGL } from "../../elements/IElementsClassGL";
import { PassBase } from "../../surfaces/passes/PassBase";
/**
 * BasicMaterialPass forms an abstract base class for the default shaded materials provided by Stage,
 * using material methods to define their appearance.
 */
export declare class BasicMaterialPass extends PassBase {
    private _textureVO;
    private _diffuseR;
    private _diffuseG;
    private _diffuseB;
    private _diffuseA;
    private _fragmentConstantsIndex;
    constructor(render: GL_SurfaceBase, surface: ISurface, elementsClass: IElementsClassGL, stage: Stage);
    _iIncludeDependencies(shader: ShaderBase): void;
    invalidate(): void;
    dispose(): void;
    /**
     * @inheritDoc
     */
    _iGetFragmentCode(shader: ShaderBase, regCache: ShaderRegisterCache, sharedReg: ShaderRegisterData): string;
    _setRenderState(renderable: GL_RenderableBase, camera: Camera, viewProjection: Matrix3D): void;
    /**
     * @inheritDoc
     */
    _iActivate(camera: Camera): void;
}
