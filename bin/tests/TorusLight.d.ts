/// <reference path="../../build/Away3D.next.d.ts" />
declare module demos.lights {
    class TorusLight {
        private _scene;
        private _view;
        private _torus;
        private _mesh;
        private _raf;
        private _image;
        private _light;
        constructor();
        private loadResources();
        private imageCompleteHandler(e);
        public render(dt?: number): void;
        public resize(): void;
    }
}
