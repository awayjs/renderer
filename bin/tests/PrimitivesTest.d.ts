/// <reference path="../../build/Away3D.next.d.ts" />
declare module tests.primitives {
    class PrimitivesTest {
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
