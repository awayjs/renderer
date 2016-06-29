import { AssetEvent } from "@awayjs/core/lib/events/AssetEvent";
import { Billboard } from "@awayjs/display/lib/display/Billboard";
import { RendererBase } from "../RendererBase";
import { GL_ElementsBase } from "../elements/GL_ElementsBase";
import { GL_RenderableBase } from "../renderables/GL_RenderableBase";
import { GL_SurfaceBase } from "../surfaces/GL_SurfaceBase";
/**
 * @class away.pool.RenderableListItem
 */
export declare class GL_BillboardRenderable extends GL_RenderableBase {
    private static _samplerElements;
    /**
     *
     */
    private _billboard;
    _id: number;
    /**
     * //TODO
     *
     * @param pool
     * @param billboard
     */
    constructor(billboard: Billboard, renderer: RendererBase);
    onClear(event: AssetEvent): void;
    /**
     * //TODO
     *
     * @returns {away.base.TriangleElements}
     */
    _pGetElements(): GL_ElementsBase;
    _pGetSurface(): GL_SurfaceBase;
}
