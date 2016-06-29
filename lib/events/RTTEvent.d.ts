import { EventBase } from "@awayjs/core/lib/events/EventBase";
import { RTTBufferManager } from "../managers/RTTBufferManager";
export declare class RTTEvent extends EventBase {
    /**
     *
     */
    static RESIZE: string;
    private _rttManager;
    /**
     *
     */
    readonly rttManager: RTTBufferManager;
    constructor(type: string, rttManager: RTTBufferManager);
    /**
     *
     */
    clone(): RTTEvent;
}
