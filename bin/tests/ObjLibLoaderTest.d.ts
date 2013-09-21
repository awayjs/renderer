/// <reference path="../../lib/Away3D.next.d.ts" />
declare module tests.library {
    class ObjLibLoaderTest {
        private height;
        private token;
        private view;
        private raf;
        private mesh;
        constructor();
        private render();
        public onAssetComplete(e: away.events.AssetEvent): void;
        public onResourceComplete(e: away.events.LoaderEvent): void;
        public resize(): void;
    }
}
