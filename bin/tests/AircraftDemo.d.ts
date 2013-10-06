/// <reference path="../../build/Away3D.next.d.ts" />
declare module demos.aircraft {
    class AircraftDemo {
        private _maxStates;
        private _cameraIncrement;
        private _rollIncrement;
        private _loopIncrement;
        private _state;
        private _appTime;
        private _lightPicker;
        private _view;
        private _timer;
        private _seaGeom;
        private _seaMesh;
        private _seaNormalTexture;
        private _seaInitialized;
        private _seaMaterial;
        private _f14Geom;
        private _f14Initialized;
        private _waterMethod;
        private _skyboxCubeTexture;
        private _skyboxInitialized;
        constructor();
        private loadAssets();
        private loadAsset(path);
        private initParsers();
        private initAnimation();
        private initView();
        private initializeScene();
        private initLights();
        private initF14();
        private initSea();
        public onResourceComplete(e: away.events.LoaderEvent): void;
        private render(dt);
        public resize(): void;
        private onMouseDown();
    }
}
