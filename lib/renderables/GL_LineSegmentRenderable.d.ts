import { AssetEvent } from "@awayjs/core/lib/events/AssetEvent";
import { LineSegment } from "@awayjs/display/lib/display/LineSegment";
import { RendererBase } from "../RendererBase";
import { GL_ElementsBase } from "../elements/GL_ElementsBase";
import { GL_RenderableBase } from "../renderables/GL_RenderableBase";
import { GL_SurfaceBase } from "../surfaces/GL_SurfaceBase";
/**
 * @class away.pool.GL_LineSegmentRenderable
 */
export declare class GL_LineSegmentRenderable extends GL_RenderableBase {
    private static _lineGraphics;
    /**
     *
     */
    private _lineSegment;
    /**
     * //TODO
     *
     * @param pool
     * @param graphic
     * @param level
     * @param dataOffset
     */
    constructor(lineSegment: LineSegment, renderer: RendererBase);
    onClear(event: AssetEvent): void;
    /**
     * //TODO
     *
     * @returns {base.LineElements}
     * @protected
     */
    _pGetElements(): GL_ElementsBase;
    _pGetSurface(): GL_SurfaceBase;
    /**
     * //TODO
     *
     * @param pool
     * @param renderable
     * @param level
     * @param indexOffset
     * @returns {away.pool.LineSubSpriteRenderable}
     * @private
     */
    _pGetOverflowRenderable(indexOffset: number): GL_RenderableBase;
}
