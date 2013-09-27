/// <reference path="../../lib/Away3D.next.d.ts" />
declare module tests.loaders {
    class IMGLoaderTest {
        private pngLoader;
        private jpgLoader;
        private noAnImageLoader;
        private wrongURLLoader;
        constructor();
        private pngLoaderComplete(e);
        private jpgLoaderComplete(e);
        private noAnImageLoaderComplete(e);
        private wrongURLLoaderComplete(e);
        private logSuccessfullLoad(e);
        private ioError(e);
        private abortError(e);
    }
}
