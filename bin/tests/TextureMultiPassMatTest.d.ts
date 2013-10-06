/// <reference path="../../build/Away3D.next.d.ts" />
declare module tests.materials {
    class TextureMultiPassMatTest {
        private view;
        private torus;
        private mesh;
        private light;
        private raf;
        private counter;
        private center;
        private pngLoader;
        constructor();
        private pngLoaderComplete(e);
        private init();
        private tick(e);
        public resize(e): void;
    }
}
