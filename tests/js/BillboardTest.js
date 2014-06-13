///<reference path="../../../build/stagegl-renderer.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />
var tests;
(function (tests) {
    (function (entities) {
        var AlignmentMode = away.base.AlignmentMode;
        var OrientationMode = away.base.OrientationMode;
        var View = away.containers.View;
        var HoverController = away.controllers.HoverController;
        var Billboard = away.entities.Billboard;
        var LoaderEvent = away.events.LoaderEvent;
        var Vector3D = away.geom.Vector3D;
        var AssetLibrary = away.library.AssetLibrary;

        var TriangleMaterial = away.materials.TriangleMaterial;

        var URLRequest = away.net.URLRequest;
        var DefaultRenderer = away.render.DefaultRenderer;

        var BillboardTest = (function () {
            /**
            * Constructor
            */
            function BillboardTest() {
                this._time = 0;
                this._move = false;
                this.init();
            }
            /**
            * Global initialise function
            */
            BillboardTest.prototype.init = function () {
                this.initEngine();
                this.initListeners();
                this.loadTexture();
            };

            /**
            * Initialise the engine
            */
            BillboardTest.prototype.initEngine = function () {
                this._view = new View(new DefaultRenderer());

                //setup the camera for optimal shadow rendering
                this._view.camera.projection.far = 2100;

                //setup controller to be used on the camera
                this._cameraController = new HoverController(this._view.camera, null, 45, 20, 1000, 10);
            };

            /**
            * Initialise the listeners
            */
            BillboardTest.prototype.initListeners = function () {
                var _this = this;
                document.onmousedown = function (event) {
                    return _this.onMouseDown(event);
                };
                document.onmouseup = function (event) {
                    return _this.onMouseUp(event);
                };
                document.onmousemove = function (event) {
                    return _this.onMouseMove(event);
                };

                window.onresize = function (event) {
                    return _this.onResize(event);
                };

                this.onResize();

                this._timer = new away.utils.RequestAnimationFrame(this.onEnterFrame, this);
                this._timer.start();
            };

            /**
            * start loading our texture
            */
            BillboardTest.prototype.loadTexture = function () {
                var _this = this;
                AssetLibrary.addEventListener(LoaderEvent.RESOURCE_COMPLETE, function (event) {
                    return _this.onResourceComplete(event);
                });
                AssetLibrary.load(new URLRequest("assets/130909wall_big.png"));
            };

            /**
            * Navigation and render loop
            */
            BillboardTest.prototype.onEnterFrame = function (dt) {
                this._time += dt;

                this._view.render();
            };

            /**
            * Listener function for resource complete event on asset library
            */
            BillboardTest.prototype.onResourceComplete = function (event) {
                var assets = event.assets;
                var length = assets.length;

                for (var c = 0; c < length; c++) {
                    var asset = assets[c];

                    switch (event.url) {
                        case "assets/130909wall_big.png":
                            var material = new TriangleMaterial();
                            material.texture = AssetLibrary.getAsset(asset.name);

                            var s;
                            s = new Billboard(material);
                            s.pivot = new Vector3D(150, 150, 0);
                            s.width = 300;
                            s.height = 300;

                            //s.rotationX = 45;
                            s.orientationMode = OrientationMode.CAMERA_PLANE;
                            s.alignmentMode = AlignmentMode.PIVOT_POINT;

                            this._view.scene.addChild(s);

                            for (var c = 0; c < 100; c++) {
                                var size = this.getRandom(5, 50);
                                s = new Billboard(material);
                                s.pivot = new Vector3D(size / 2, size / 2, 0);
                                s.width = size;
                                s.height = size;
                                s.orientationMode = away.base.OrientationMode.CAMERA_PLANE;
                                s.alignmentMode = away.base.AlignmentMode.PIVOT_POINT;
                                s.x = this.getRandom(-400, 400);
                                s.y = this.getRandom(-400, 400);
                                s.z = this.getRandom(-400, 400);
                                this._view.scene.addChild(s);
                            }

                            this._timer.start();
                            break;
                    }
                }
            };

            /**
            * Mouse down listener for navigation
            */
            BillboardTest.prototype.onMouseDown = function (event) {
                this._lastPanAngle = this._cameraController.panAngle;
                this._lastTiltAngle = this._cameraController.tiltAngle;
                this._lastMouseX = event.clientX;
                this._lastMouseY = event.clientY;
                this._move = true;
            };

            /**
            * Mouse up listener for navigation
            */
            BillboardTest.prototype.onMouseUp = function (event) {
                this._move = false;
            };
            BillboardTest.prototype.onMouseMove = function (event) {
                if (this._move) {
                    this._cameraController.panAngle = 0.3 * (event.clientX - this._lastMouseX) + this._lastPanAngle;
                    this._cameraController.tiltAngle = 0.3 * (event.clientY - this._lastMouseY) + this._lastTiltAngle;
                }
            };

            /**
            * stage listener for resize events
            */
            BillboardTest.prototype.onResize = function (event) {
                if (typeof event === "undefined") { event = null; }
                this._view.y = 0;
                this._view.x = 0;
                this._view.width = window.innerWidth;
                this._view.height = window.innerHeight;
            };

            /**
            * Util function - getRandom Number
            */
            BillboardTest.prototype.getRandom = function (min, max) {
                return Math.random() * (max - min) + min;
            };
            return BillboardTest;
        })();
        entities.BillboardTest = BillboardTest;
    })(tests.entities || (tests.entities = {}));
    var entities = tests.entities;
})(tests || (tests = {}));
//# sourceMappingURL=BillboardTest.js.map
