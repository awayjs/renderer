/// <reference path="../../lib/Away3D.next.d.ts" />
declare module tests.primitives {
    class WireframePrimitiveTest {
        private view;
        private raf;
        private meshes;
        private light;
        private lightB;
        private staticLightPicker;
        private radius;
        constructor();
        private initMeshes();
        private render();
        public resize(): void;
    }
}
