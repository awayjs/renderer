/// <reference path="../../build/Away3D.next.d.ts" />
declare module tests.entities {
    class Sprite3DTest {
        private _view;
        private _cameraController;
        private _timer;
        private _time;
        private _move;
        private _lastPanAngle;
        private _lastTiltAngle;
        private _lastMouseX;
        private _lastMouseY;
        /**
        * Constructor
        */
        constructor();
        /**
        * Global initialise function
        */
        private init();
        /**
        * Initialise the engine
        */
        private initEngine();
        /**
        * Initialise the listeners
        */
        private initListeners();
        /**
        * start loading our texture
        */
        private loadTexture();
        /**
        * Navigation and render loop
        */
        private onEnterFrame(dt);
        /**
        * Listener function for resource complete event on asset library
        */
        private onResourceComplete(event);
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
        * stage listener for resize events
        */
        private onResize(event?);
        /**
        * Util function - getRandom Number
        */
        private getRandom(min, max);
    }
}
