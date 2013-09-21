/// <reference path="../../lib/Away3D.next.d.ts" />
declare module tests.base {
    class Object3DTestV2 {
        private view;
        private torus;
        private light;
        private raf;
        private meshes;
        private t;
        private tPos;
        private radius;
        private follow;
        constructor();
        private tick(e);
        public resize(e): void;
        public followObject(e): void;
    }
}
