/// <reference path="../../build/Away3D.next.d.ts" />
declare module demos.parsers {
    class AWDSponza {
        private _view;
        private _token;
        private _timer;
        private _suzane;
        private _lightPicker;
        private lookAtPosition;
        private _cameraIncrement;
        constructor();
        private resize();
        private render(dt);
        public onAssetComplete(e: away.events.AssetEvent): void;
        public onResourceComplete(e: away.events.LoaderEvent): void;
    }
}
