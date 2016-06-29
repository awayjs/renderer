import { AttributesView } from "@awayjs/core/lib/attributes/AttributesView";
import { AbstractionBase } from "@awayjs/core/lib/library/AbstractionBase";
import { AssetEvent } from "@awayjs/core/lib/events/AssetEvent";
import { Matrix3D } from "@awayjs/core/lib/geom/Matrix3D";
import { Stage } from "@awayjs/stage/lib/base/Stage";
import { GL_AttributesBuffer } from "@awayjs/stage/lib/attributes/GL_AttributesBuffer";
import { Camera } from "@awayjs/display/lib/display/Camera";
import { ElementsBase } from "@awayjs/display/lib/graphics/ElementsBase";
import { ElementsEvent } from "@awayjs/display/lib/events/ElementsEvent";
import { IElementsClassGL } from "../elements/IElementsClassGL";
import { ShaderBase } from "../shaders/ShaderBase";
import { GL_RenderableBase } from "../renderables/GL_RenderableBase";
/**
 *
 * @class away.pool.GL_ElementsBaseBase
 */
export declare class GL_ElementsBase extends AbstractionBase {
    usages: number;
    private _elements;
    _stage: Stage;
    private _onInvalidateIndicesDelegate;
    private _onClearIndicesDelegate;
    private _onInvalidateVerticesDelegate;
    private _onClearVerticesDelegate;
    private _overflow;
    _indices: GL_AttributesBuffer;
    private _indicesUpdated;
    private _vertices;
    private _verticesUpdated;
    _indexMappings: Array<number>;
    private _numIndices;
    private _numVertices;
    readonly elementsType: string;
    readonly elementsClass: IElementsClassGL;
    readonly elements: ElementsBase;
    /**
     *
     */
    readonly numIndices: number;
    /**
     *
     */
    readonly numVertices: number;
    constructor(elements: ElementsBase, stage: Stage);
    /**
     *
     */
    getIndexMappings(): Array<number>;
    /**
     *
     */
    getIndexBufferGL(): GL_AttributesBuffer;
    /**
     *
     */
    getVertexBufferGL(attributesView: AttributesView): GL_AttributesBuffer;
    /**
     *
     */
    activateVertexBufferVO(index: number, attributesView: AttributesView, dimensions?: number, offset?: number): void;
    /**
     *
     */
    onClear(event: AssetEvent): void;
    _setRenderState(renderable: GL_RenderableBase, shader: ShaderBase, camera: Camera, viewProjection: Matrix3D): void;
    draw(renderable: GL_RenderableBase, shader: ShaderBase, camera: Camera, viewProjection: Matrix3D, count: number, offset: number): void;
    /**
     * //TODO
     *
     * @private
     */
    _updateIndices(indexOffset?: number): void;
    /**
     * //TODO
     *
     * @param attributesView
     * @private
     */
    private _updateVertices(attributesView);
    /**
     * //TODO
     *
     * @param event
     * @private
     */
    _onInvalidateIndices(event: ElementsEvent): void;
    /**
     * //TODO
     *
     * @param event
     * @private
     */
    _onClearIndices(event: ElementsEvent): void;
    /**
     * //TODO
     *
     * @param event
     * @private
     */
    _onInvalidateVertices(event: ElementsEvent): void;
    /**
     * //TODO
     *
     * @param event
     * @private
     */
    _onClearVertices(event: ElementsEvent): void;
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
