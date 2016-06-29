import { AssetEvent } from "@awayjs/core/lib/events/AssetEvent";
import { BasicMaterial } from "@awayjs/display/lib/materials/BasicMaterial";
import { IElementsClassGL } from "../elements/IElementsClassGL";
import { GL_SurfaceBase } from "../surfaces/GL_SurfaceBase";
import { SurfacePool } from "../surfaces/SurfacePool";
/**
 * RenderMaterialObject forms an abstract base class for the default shaded materials provided by Stage,
 * using material methods to define their appearance.
 */
export declare class GL_BasicMaterialSurface extends GL_SurfaceBase {
    private _material;
    private _pass;
    constructor(material: BasicMaterial, elementsClass: IElementsClassGL, renderPool: SurfacePool);
    onClear(event: AssetEvent): void;
    /**
     * @inheritDoc
     */
    _pUpdateRender(): void;
}
