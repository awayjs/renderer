/// <reference path="../../build/Away3D.next.d.ts" />
declare module demos.parsers {
    class AWDShadowTest {
        private _view;
        private _token;
        private _timer;
        private lookAtPosition;
        private _awdMesh;
        private _cameraController;
        private _move;
        private _lastPanAngle;
        private _lastTiltAngle;
        private _lastMouseX;
        private _lastMouseY;
        constructor();
        private resize();
        private render(dt);
        public onAssetComplete(e: away.events.AssetEvent): void;
        public onResourceComplete(e: away.events.LoaderEvent): void;
        /**
        * Mouse down listener for navigation
        */
        private onMouseDown(event);
        /**
        * Mouse up listener for navigation
        */
        private onMouseUp(event);
        private onMouseMove(event);
        /**
        * Mouse wheel listener for navigation
        */
        private onMouseWheel(event);
    }
}
