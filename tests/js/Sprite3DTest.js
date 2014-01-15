///<reference path="../../../build/Away3D.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />
var tests;
(function (tests) {
    (function (entities) {
        var Sprite3DTest = (function () {
            /**
            * Constructor
            */
            function Sprite3DTest() {
                this._time = 0;
                this._move = false;
                this.init();
            }
            /**
            * Global initialise function
            */
            Sprite3DTest.prototype.init = function () {
                this.initEngine();
                this.initListeners();
                this.loadTexture();
            };

            /**
            * Initialise the engine
            */
            Sprite3DTest.prototype.initEngine = function () {
                this._view = new away.containers.View3D();

                //setup the camera for optimal shadow rendering
                this._view.camera.lens.far = 2100;

                //setup controller to be used on the camera
                this._cameraController = new away.controllers.HoverController(this._view.camera, null, 45, 20, 1000, 10);
            };

            /**
            * Initialise the listeners
            */
            Sprite3DTest.prototype.initListeners = function () {
                var _this = this;
                window.onresize = function (event) {
                    return _this.onResize(event);
                };
                document.onmousedown = function (event) {
                    return _this.onMouseDown(event);
                };
                document.onmouseup = function (event) {
                    return _this.onMouseUp(event);
                };
                document.onmousemove = function (event) {
                    return _this.onMouseMove(event);
                };

                this.onResize();

                this._timer = new away.utils.RequestAnimationFrame(this.onEnterFrame, this);
                this._timer.start();
            };

            /**
            * start loading our texture
            */
            Sprite3DTest.prototype.loadTexture = function () {
                away.library.AssetLibrary.addEventListener(away.events.LoaderEvent.RESOURCE_COMPLETE, away.utils.Delegate.create(this, this.onResourceComplete));
                away.library.AssetLibrary.load(new away.net.URLRequest("assets/130909wall_big.png"));
            };

            /**
            * Navigation and render loop
            */
            Sprite3DTest.prototype.onEnterFrame = function (dt) {
                this._time += dt;

                this._view.render();
            };

            /**
            * Listener function for resource complete event on asset library
            */
            Sprite3DTest.prototype.onResourceComplete = function (event) {
                var assets = event.assets;
                var length = assets.length;

                for (var c = 0; c < length; c++) {
                    var asset = assets[c];
                    switch (event.url) {
                        case "assets/130909wall_big.png":
                            var material = new away.materials.TextureMaterial();
                            material.texture = away.library.AssetLibrary.getAsset(asset.name);

                            var s;
                            s = new away.entities.Sprite3D(material, 300, 300);
                            s.rotationX = 45;

                            this._view.scene.addChild(s);

                            for (var c = 0; c < 100; c++) {
                                var size = this.getRandom(5, 50);
                                s = new away.entities.Sprite3D(material, size, size);
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
            Sprite3DTest.prototype.onMouseDown = function (event) {
                this._lastPanAngle = this._cameraController.panAngle;
                this._lastTiltAngle = this._cameraController.tiltAngle;
                this._lastMouseX = event.clientX;
                this._lastMouseY = event.clientY;
                this._move = true;
            };

            /**
            * Mouse up listener for navigation
            */
            Sprite3DTest.prototype.onMouseUp = function (event) {
                this._move = false;
            };
            Sprite3DTest.prototype.onMouseMove = function (event) {
                if (this._move) {
                    this._cameraController.panAngle = 0.3 * (event.clientX - this._lastMouseX) + this._lastPanAngle;
                    this._cameraController.tiltAngle = 0.3 * (event.clientY - this._lastMouseY) + this._lastTiltAngle;
                }
            };

            /**
            * stage listener for resize events
            */
            Sprite3DTest.prototype.onResize = function (event) {
                if (typeof event === "undefined") { event = null; }
                this._view.y = 0;
                this._view.x = 0;
                this._view.width = window.innerWidth;
                this._view.height = window.innerHeight;
            };

            /**
            * Util function - getRandom Number
            */
            Sprite3DTest.prototype.getRandom = function (min, max) {
                return Math.random() * (max - min) + min;
            };
            return Sprite3DTest;
        })();
        entities.Sprite3DTest = Sprite3DTest;
    })(tests.entities || (tests.entities = {}));
    var entities = tests.entities;
})(tests || (tests = {}));
//# sourceMappingURL=Sprite3DTest.js.map
