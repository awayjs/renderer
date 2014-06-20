///<reference path="../../../build/stagegl-renderer.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />
var demos;
(function (demos) {
    (function (parsers) {
        var View = away.containers.View;
        var HoverController = away.controllers.HoverController;

        var AssetEvent = away.events.AssetEvent;
        var LoaderEvent = away.events.LoaderEvent;
        var Vector3D = away.geom.Vector3D;
        var AssetLibrary = away.library.AssetLibrary;

        var AssetType = away.library.AssetType;

        var URLRequest = away.net.URLRequest;
        var AWDParser = away.parsers.AWDParser;
        var DefaultRenderer = away.render.DefaultRenderer;
        var RequestAnimationFrame = away.utils.RequestAnimationFrame;

        var AWDShadowTest = (function () {
            function AWDShadowTest() {
                var _this = this;
                this.lookAtPosition = new Vector3D();
                this._move = false;
                away.Debug.LOG_PI_ERRORS = true;
                away.Debug.THROW_ERRORS = false;

                AssetLibrary.enableParser(AWDParser);

                this._token = AssetLibrary.load(new URLRequest('assets/awd/ShadowTest.awd'));

                this._token.addEventListener(LoaderEvent.RESOURCE_COMPLETE, function (event) {
                    return _this.onResourceComplete(event);
                });
                this._token.addEventListener(AssetEvent.ASSET_COMPLETE, function (event) {
                    return _this.onAssetComplete(event);
                });

                this._view = new View(new DefaultRenderer());
                this._view.camera.projection.far = 5000;
                this._view.camera.y = 100;

                this._timer = new RequestAnimationFrame(this.render, this);

                this._cameraController = new HoverController(this._view.camera, null, 45, 20, 2000, 5);

                document.onmousedown = function (event) {
                    return _this.onMouseDown(event);
                };
                document.onmouseup = function (event) {
                    return _this.onMouseUp(event);
                };
                document.onmousemove = function (event) {
                    return _this.onMouseMove(event);
                };
                document.onmousewheel = function (event) {
                    return _this.onMouseWheel(event);
                };

                window.onresize = function (event) {
                    return _this.resize(event);
                };
            }
            AWDShadowTest.prototype.resize = function (event) {
                if (typeof event === "undefined") { event = null; }
                this._view.y = 0;
                this._view.x = 0;
                this._view.width = window.innerWidth;
                this._view.height = window.innerHeight;
            };

            AWDShadowTest.prototype.render = function (dt) {
                if (this._view.camera)
                    this._view.camera.lookAt(this.lookAtPosition);

                if (this._awdMesh)
                    this._awdMesh.rotationY += 0.2;

                this._view.render();
            };

            AWDShadowTest.prototype.onAssetComplete = function (event) {
                console.log('------------------------------------------------------------------------------');
                console.log('AssetEvent.ASSET_COMPLETE', AssetLibrary.getAsset(event.asset.name));
                console.log('------------------------------------------------------------------------------');
            };

            AWDShadowTest.prototype.onResourceComplete = function (event) {
                console.log('------------------------------------------------------------------------------');
                console.log('LoaderEvent.RESOURCE_COMPLETE', event);
                console.log('------------------------------------------------------------------------------');

                var loader = event.target;
                var numAssets = loader.baseDependency.assets.length;

                for (var i = 0; i < numAssets; ++i) {
                    var asset = loader.baseDependency.assets[i];

                    switch (asset.assetType) {
                        case AssetType.MESH:
                            this._awdMesh = asset;
                            this._view.scene.addChild(this._awdMesh);
                            this.resize();
                            break;

                        case AssetType.LIGHT:
                            this._view.scene.addChild(asset);
                            break;

                        case AssetType.MATERIAL:
                            break;
                    }
                }

                this._timer.start();
            };

            /**
            * Mouse down listener for navigation
            */
            AWDShadowTest.prototype.onMouseDown = function (event) {
                this._lastPanAngle = this._cameraController.panAngle;
                this._lastTiltAngle = this._cameraController.tiltAngle;
                this._lastMouseX = event.clientX;
                this._lastMouseY = event.clientY;
                this._move = true;
            };

            /**
            * Mouse up listener for navigation
            */
            AWDShadowTest.prototype.onMouseUp = function (event) {
                this._move = false;
            };

            AWDShadowTest.prototype.onMouseMove = function (event) {
                if (this._move) {
                    this._cameraController.panAngle = 0.3 * (event.clientX - this._lastMouseX) + this._lastPanAngle;
                    this._cameraController.tiltAngle = 0.3 * (event.clientY - this._lastMouseY) + this._lastTiltAngle;
                }
            };

            /**
            * Mouse wheel listener for navigation
            */
            AWDShadowTest.prototype.onMouseWheel = function (event) {
                this._cameraController.distance -= event.wheelDelta * 2;

                if (this._cameraController.distance < 100)
                    this._cameraController.distance = 100;
                else if (this._cameraController.distance > 2000)
                    this._cameraController.distance = 2000;
            };
            return AWDShadowTest;
        })();
        parsers.AWDShadowTest = AWDShadowTest;
    })(demos.parsers || (demos.parsers = {}));
    var parsers = demos.parsers;
})(demos || (demos = {}));
//# sourceMappingURL=AWDShadowTest.js.map
