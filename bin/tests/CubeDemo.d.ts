/// <reference path="../../build/Away3D.next.d.ts" />
declare module demos.cubes {
    class CubeDemo {
        private _scene;
        private _view;
        private _cube;
        private _torus;
        private _mesh;
        private _mesh2;
        private _raf;
        private _image;
        private _cameraAxis;
        constructor();
        private loadResources();
        private imageCompleteHandler(e);
        public render(dt?: number): void;
        public resize(e): void;
    }
}
