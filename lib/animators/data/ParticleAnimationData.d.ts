import { ParticleData } from "@awayjs/display/lib/animators/data/ParticleData";
/**
 * ...
 */
export declare class ParticleAnimationData {
    index: number;
    startTime: number;
    totalTime: number;
    duration: number;
    delay: number;
    startVertexIndex: number;
    numVertices: number;
    constructor(index: number, startTime: number, duration: number, delay: number, particle: ParticleData);
}
