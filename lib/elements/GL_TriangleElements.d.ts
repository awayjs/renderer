import { AssetEvent } from "@awayjs/core/lib/events/AssetEvent";
import { Matrix3D } from "@awayjs/core/lib/geom/Matrix3D";
import { Stage } from "@awayjs/stage/lib/base/Stage";
import { Camera } from "@awayjs/display/lib/display/Camera";
import { TriangleElements } from "@awayjs/display/lib/graphics/TriangleElements";
import { GL_ElementsBase } from "../elements/GL_ElementsBase";
import { IElementsClassGL } from "../elements/IElementsClassGL";
import { GL_RenderableBase } from "../renderables/GL_RenderableBase";
import { ShaderBase } from "../shaders/ShaderBase";
import { ShaderRegisterCache } from "../shaders/ShaderRegisterCache";
import { ShaderRegisterData } from "../shaders/ShaderRegisterData";
/**
 *
 * @class away.pool.GL_TriangleElements
 */
export declare class GL_TriangleElements extends GL_ElementsBase {
    static elementsType: string;
    readonly elementsType: string;
    readonly elementsClass: IElementsClassGL;
    static _iIncludeDependencies(shader: ShaderBase): void;
    static _iGetVertexCode(shader: ShaderBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    static _iGetFragmentCode(shader: ShaderBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    private _triangleElements;
    constructor(triangleElements: TriangleElements, stage: Stage);
    onClear(event: AssetEvent): void;
    _setRenderState(renderable: GL_RenderableBase, shader: ShaderBase, camera: Camera, viewProjection: Matrix3D): void;
    draw(renderable: GL_RenderableBase, shader: ShaderBase, camera: Camera, viewProjection: Matrix3D, count: number, offset: number): void;
    /**
     * //TODO
     *
     * @param pool
     * @param renderable
     * @param level
     * @param indexOffset
     * @returns {away.pool.GL_GraphicRenderable}
     * @protected
     */
    _pGetOverflowElements(): GL_ElementsBase;
}
