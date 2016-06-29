import { EventBase } from "@awayjs/core/lib/events/EventBase";
export declare class ShadingMethodEvent extends EventBase {
    static SHADER_INVALIDATED: string;
    constructor(type: string);
}
