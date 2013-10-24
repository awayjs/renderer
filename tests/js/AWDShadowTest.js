var demos;
(function (demos) {
    ///<reference path="../../../build/Away3D.next.d.ts" />
    (function (parsers) {
        var AWDShadowTest = (function () {
            function AWDShadowTest() {
                var _this = this;
                this.lookAtPosition = new away.geom.Vector3D();
                this._move = false;
                away.Debug.LOG_PI_ERRORS = true;
                away.Debug.THROW_ERRORS = false;

                away.library.AssetLibrary.enableParser(away.loaders.AWDParser);

                this._token = away.library.AssetLibrary.load(new away.net.URLRequest('assets/awd/ShadowTest.awd'));

                this._token.addEventListener(away.events.LoaderEvent.RESOURCE_COMPLETE, this.onResourceComplete, this);
                this._token.addEventListener(away.events.AssetEvent.ASSET_COMPLETE, this.onAssetComplete, this);

                this._view = new away.containers.View3D();
                this._view.camera.lens.far = 5000;
                this._view.camera.y = 100;

                this._timer = new away.utils.RequestAnimationFrame(this.render, this);

                this._cameraController = new away.controllers.HoverController(this._view.camera, null, 45, 20, 2000, 5);

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
                window.onresize = function () {
                    return _this.resize();
                };
            }
            AWDShadowTest.prototype.resize = function () {
                this._view.y = 0;
                this._view.x = 0;
                this._view.width = window.innerWidth;
                this._view.height = window.innerHeight;
            };

            AWDShadowTest.prototype.render = function (dt) {
                if (this._view.camera) {
                    this._view.camera.lookAt(this.lookAtPosition);
                }

                if (this._awdMesh) {
                    this._awdMesh.rotationY += 0.2;
                }
                this._view.render();
            };

            AWDShadowTest.prototype.onAssetComplete = function (e) {
                console.log('------------------------------------------------------------------------------');
                console.log('away.events.AssetEvent.ASSET_COMPLETE', away.library.AssetLibrary.getAsset(e.asset.name));
                console.log('------------------------------------------------------------------------------');
            };

            AWDShadowTest.prototype.onResourceComplete = function (e) {
                console.log('------------------------------------------------------------------------------');
                console.log('away.events.LoaderEvent.RESOURCE_COMPLETE', e);
                console.log('------------------------------------------------------------------------------');

                var loader = e.target;
                var numAssets = loader.baseDependency.assets.length;

                for (var i = 0; i < numAssets; ++i) {
                    var asset = loader.baseDependency.assets[i];

                    switch (asset.assetType) {
                        case away.library.AssetType.MESH:
                            this._awdMesh = asset;
                            this._view.scene.addChild(this._awdMesh);
                            this.resize();

                            break;

                        case away.library.AssetType.LIGHT:
                            this._view.scene.addChild(asset);

                            break;

                        case away.library.AssetType.MATERIAL:
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
