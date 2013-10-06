/// <reference path="../../build/Away3D.next.d.ts" />
declare module tests.controllers {
    class HoverControllerTest {
        private _view;
        private _timer;
        private _light;
        private _lightPicker;
        private _hoverControl;
        private _move;
        private _lastPanAngle;
        private _lastTiltAngle;
        private _lastMouseX;
        private _lastMouseY;
        private _wireframeCube;
        constructor();
        private resize();
        private render(dt);
        private onMouseUpHandler(e);
        private onMouseMove(e);
        private onMouseDownHandler(e);
    }
}
