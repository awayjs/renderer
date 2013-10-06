/// <reference path="../../build/Away3D.next.d.ts" />
declare module tests.managers {
    class ManagersTest {
        private stage;
        private sManager;
        private sProxy;
        private geomBase;
        private geom;
        private rttBfrA;
        private rttBfrB;
        constructor();
        public onContextCreated(e: away.events.Stage3DEvent): void;
        public onContextReCreated(e: away.events.Stage3DEvent): void;
        public onContextDisposed(e: away.events.Stage3DEvent): void;
    }
}
