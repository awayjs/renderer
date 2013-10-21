/// <reference path="../../build/Away3D.next.d.ts" />
declare module examples {
    class Basic_Load3DS {
        private _view;
        private _cameraController;
        private _groundMaterial;
        private _light;
        private _lightPicker;
        private _direction;
        private _loader;
        private _ground;
        private _timer;
        private _time;
        private _move;
        private _lastPanAngle;
        private _lastTiltAngle;
        private _lastMouseX;
        private _lastMouseY;
        private dropDown;
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
        * Initialise the lights
        */
        private initLights();
        /**
        * Initialise the materials
        */
        private initMaterials();
        /**
        * Initialise the scene objects
        */
        private initObjects();
        /**
        * Initialise the listeners
        */
        private initListeners();
        /**
        * Navigation and render loop
        */
        private onEnterFrame(dt);
        /**
        * Listener function for asset complete event on loader
        */
        private onAssetComplete(event);
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
        * Test interface to swap ShadowMapMethod
        */
        private initInterface();
        private dropDownChange(e);
    }
}
