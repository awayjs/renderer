import { Matrix3D } from "@awayjs/core/lib/geom/Matrix3D";
import { Camera } from "@awayjs/display/lib/display/Camera";
import { ShaderBase } from "../shaders/ShaderBase";
import { ShaderRegisterCache } from "../shaders/ShaderRegisterCache";
import { GL_TriangleElements } from "../elements/GL_TriangleElements";
import { IElementsClassGL } from "../elements/IElementsClassGL";
import { GL_RenderableBase } from "../renderables/GL_RenderableBase";
import { ShaderRegisterData } from "../shaders/ShaderRegisterData";
/**
 *
 * @class away.pool.GL_SkyboxElements
 */
export declare class GL_SkyboxElements extends GL_TriangleElements {
    private _skyboxProjection;
    static elementsType: string;
    readonly elementsType: string;
    readonly elementsClass: IElementsClassGL;
    static _iIncludeDependencies(shader: ShaderBase): void;
    /**
     * @inheritDoc
     */
    static _iGetVertexCode(shader: ShaderBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    static _iGetFragmentCode(shader: ShaderBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    draw(renderable: GL_RenderableBase, shader: ShaderBase, camera: Camera, viewProjection: Matrix3D, count: number, offset: number): void;
}
