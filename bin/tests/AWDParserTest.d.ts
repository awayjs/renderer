/// <reference path="../../lib/Away3D.next.d.ts" />
declare module tests.library {
    class AWDParserTest {
        private _view;
        private token;
        private _timer;
        private _suzane;
        constructor();
        private resize();
        private render(dt);
        public onAssetComplete(e: away.events.AssetEvent): void;
        public onResourceComplete(e: away.events.LoaderEvent): void;
    }
}
