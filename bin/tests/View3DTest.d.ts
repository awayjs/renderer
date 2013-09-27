/// <reference path="../../lib/Away3D.next.d.ts" />
declare module tests.containers {
    class View3DTest {
        private view;
        private torus;
        private light;
        private raf;
        private meshes;
        constructor();
        private tick(e);
        public resize(e): void;
    }
}
