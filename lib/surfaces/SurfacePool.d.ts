import { IAssetClass } from "@awayjs/core/lib/library/IAssetClass";
import { IAbstractionPool } from "@awayjs/core/lib/library/IAbstractionPool";
import { Stage } from "@awayjs/stage/lib/base/Stage";
import { ISurface } from "@awayjs/display/lib/base/ISurface";
import { IElementsClassGL } from "../elements/IElementsClassGL";
import { ISurfaceClassGL } from "../surfaces/ISurfaceClassGL";
import { GL_SurfaceBase } from "../surfaces/GL_SurfaceBase";
/**
 * @class away.pool.SurfacePool
 */
export declare class SurfacePool implements IAbstractionPool {
    private static _abstractionClassPool;
    private _abstractionPool;
    private _elementsClass;
    private _stage;
    private _surfaceClassGL;
    readonly stage: Stage;
    /**
     * //TODO
     *
     * @param surfaceClassGL
     */
    constructor(elementsClass: IElementsClassGL, stage: Stage, surfaceClassGL?: ISurfaceClassGL);
    /**
     * //TODO
     *
     * @param elementsOwner
     * @returns IElements
     */
    getAbstraction(surface: ISurface): GL_SurfaceBase;
    /**
     * //TODO
     *
     * @param elementsOwner
     */
    clearAbstraction(surface: ISurface): void;
    /**
     *
     * @param imageObjectClass
     */
    static registerAbstraction(surfaceClassGL: ISurfaceClassGL, assetClass: IAssetClass): void;
}
