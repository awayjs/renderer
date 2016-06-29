import { Matrix3D } from "@awayjs/core/lib/geom/Matrix3D";
/**
 *
 */
export declare class PerspectiveMatrix3D extends Matrix3D {
    constructor(v?: Float32Array);
    perspectiveFieldOfViewLH(fieldOfViewY: number, aspectRatio: number, zNear: number, zFar: number): void;
}
