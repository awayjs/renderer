/// <reference path="../../build/Away3D.next.d.ts" />
declare module tests.render {
    class RenderTest {
        private stage;
        private sManager;
        private sProxy;
        private dRenderer;
        constructor();
        public onContextCreated(e: away.events.Stage3DEvent): void;
        public onContextReCreated(e: away.events.Stage3DEvent): void;
        public onContextDisposed(e: away.events.Stage3DEvent): void;
    }
}
