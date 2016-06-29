import { Graphics } from "@awayjs/display/lib/graphics/Graphics";
import { ParticleGraphicsTransform } from "../tools/data/ParticleGraphicsTransform";
/**
 * ...
 */
export declare class ParticleGraphicsHelper {
    static MAX_VERTEX: number;
    static generateGraphics(output: Graphics, graphicsArray: Array<Graphics>, transforms?: Array<ParticleGraphicsTransform>): void;
}
