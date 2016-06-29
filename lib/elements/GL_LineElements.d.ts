import { AssetEvent } from "@awayjs/core/lib/events/AssetEvent";
import { Matrix3D } from "@awayjs/core/lib/geom/Matrix3D";
import { Stage } from "@awayjs/stage/lib/base/Stage";
import { LineElements } from "@awayjs/display/lib/graphics/LineElements";
import { Camera } from "@awayjs/display/lib/display/Camera";
import { GL_ElementsBase } from "../elements/GL_ElementsBase";
import { IElementsClassGL } from "../elements/IElementsClassGL";
import { ShaderBase } from "../shaders/ShaderBase";
import { ShaderRegisterCache } from "../shaders/ShaderRegisterCache";
import { ShaderRegisterData } from "../shaders/ShaderRegisterData";
import { GL_RenderableBase } from "../renderables/GL_RenderableBase";
/**
 *
 * @class away.pool.GL_LineElements
 */
export declare class GL_LineElements extends GL_ElementsBase {
    static elementsType: string;
    readonly elementsType: string;
    readonly elementsClass: IElementsClassGL;
    static _iIncludeDependencies(shader: ShaderBase): void;
    static _iGetVertexCode(shader: ShaderBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    static _iGetFragmentCode(shader: ShaderBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    private _calcMatrix;
    private _thickness;
    private _lineElements;
    constructor(lineElements: LineElements, stage: Stage);
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
     * @returns {away.pool.LineSubSpriteRenderable}
     * @protected
     */
    _pGetOverflowElements(): GL_ElementsBase;
}
