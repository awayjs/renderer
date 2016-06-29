import { EventBase } from "@awayjs/core/lib/events/EventBase";
import { IPass } from "../surfaces/passes/IPass";
export declare class PassEvent extends EventBase {
    /**
     *
     */
    static INVALIDATE: string;
    private _pass;
    /**
     *
     */
    readonly pass: IPass;
    constructor(type: string, pass: IPass);
    /**
     *
     */
    clone(): PassEvent;
}
