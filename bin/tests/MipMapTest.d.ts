/// <reference path="../../lib/Away3D.next.d.ts" />
declare module tests.utils {
    class MipMapTest {
        private mipLoader;
        private sourceBitmap;
        private mipMap;
        private _rect;
        private _matrix;
        private w;
        private h;
        constructor();
        private mipImgLoaded(e);
        private onMouseDown(e);
        public generateMipMap(source: away.display.BitmapData, mipmap?: away.display.BitmapData, alpha?: boolean, side?: number): void;
    }
}
