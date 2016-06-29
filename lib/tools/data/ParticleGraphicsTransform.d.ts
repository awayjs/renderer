import { Matrix } from "@awayjs/core/lib/geom/Matrix";
import { Matrix3D } from "@awayjs/core/lib/geom/Matrix3D";
/**
 * ...
 */
export declare class ParticleGraphicsTransform {
    private _defaultVertexTransform;
    private _defaultInvVertexTransform;
    private _defaultUVTransform;
    vertexTransform: Matrix3D;
    UVTransform: Matrix;
    readonly invVertexTransform: Matrix3D;
}
