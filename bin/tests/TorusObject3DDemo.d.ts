/// <reference path="../../build/Away3D.next.d.ts" />
declare module demos.object3d {
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
        private pointLight;
        private lightPicker;
        private _image;
        constructor();
        private loadResources();
        private imageCompleteHandler(e);
        private tick(e);
        public resize(e): void;
        public followObject(e): void;
    }
}
