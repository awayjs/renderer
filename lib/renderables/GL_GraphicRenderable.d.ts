import { AssetEvent } from "@awayjs/core/lib/events/AssetEvent";
import { Graphic } from "@awayjs/display/lib/graphics/Graphic";
import { RendererBase } from "../RendererBase";
import { GL_ElementsBase } from "../elements/GL_ElementsBase";
import { GL_RenderableBase } from "../renderables/GL_RenderableBase";
import { GL_SurfaceBase } from "../surfaces/GL_SurfaceBase";
/**
 * @class away.pool.GL_GraphicRenderable
 */
export declare class GL_GraphicRenderable extends GL_RenderableBase {
    /**
     *
     */
    graphic: Graphic;
    /**
     * //TODO
     *
     * @param pool
     * @param graphic
     * @param level
     * @param indexOffset
     */
    constructor(graphic: Graphic, renderer: RendererBase);
    onClear(event: AssetEvent): void;
    /**
     *
     * @returns {ElementsBase}
     * @protected
     */
    _pGetElements(): GL_ElementsBase;
    _pGetSurface(): GL_SurfaceBase;
}
