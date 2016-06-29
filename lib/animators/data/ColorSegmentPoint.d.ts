import { ColorTransform } from "@awayjs/core/lib/geom/ColorTransform";
export declare class ColorSegmentPoint {
    private _color;
    private _life;
    constructor(life: number, color: ColorTransform);
    readonly color: ColorTransform;
    readonly life: number;
}
