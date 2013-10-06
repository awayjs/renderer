/// <reference path="../../build/Away3D.next.d.ts" />
declare module tests.events {
    class EDTest extends away.events.EventDispatcher {
        constructor();
        public onComplete(e): void;
    }
}
