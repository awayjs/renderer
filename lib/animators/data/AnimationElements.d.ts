import { Stage } from "@awayjs/stage/lib/base/Stage";
import { IContextGL } from "@awayjs/stage/lib/base/IContextGL";
import { IVertexBuffer } from "@awayjs/stage/lib/base/IVertexBuffer";
import { ParticleAnimationData } from "../../animators/data/ParticleAnimationData";
/**
 * ...
 */
export declare class AnimationElements {
    static SUBGEOM_ID_COUNT: number;
    _pVertexData: Array<number>;
    _pVertexBuffer: Array<IVertexBuffer>;
    _pBufferContext: Array<IContextGL>;
    _pBufferDirty: Array<boolean>;
    private _numVertices;
    private _totalLenOfOneVertex;
    numProcessedVertices: number;
    previousTime: number;
    animationParticles: Array<ParticleAnimationData>;
    /**
     * An id for this animation subgeometry, used to identify animation subgeometries when using animation sets.
     *
     * @private
     */
    _iUniqueId: number;
    constructor();
    createVertexData(numVertices: number, totalLenOfOneVertex: number): void;
    activateVertexBuffer(index: number, bufferOffset: number, stage: Stage, format: number): void;
    dispose(): void;
    invalidateBuffer(): void;
    readonly vertexData: Array<number>;
    readonly numVertices: number;
    readonly totalLenOfOneVertex: number;
}
