var demos;
(function (demos) {
    ///<reference path="../../../build/Away3D.next.d.ts" />
    (function (parsers) {
        var AWDSuzanne = (function () {
            function AWDSuzanne() {
                var _this = this;
                this.lookAtPosition = new away.geom.Vector3D();
                this._cameraIncrement = 0;
                away.Debug.LOG_PI_ERRORS = true;
                away.Debug.THROW_ERRORS = false;

                away.library.AssetLibrary.enableParser(away.loaders.AWDParser);

                this._token = away.library.AssetLibrary.load(new away.net.URLRequest('assets/suzanne.awd'));
                this._token.addEventListener(away.events.LoaderEvent.RESOURCE_COMPLETE, this.onResourceComplete, this);
                this._token.addEventListener(away.events.AssetEvent.ASSET_COMPLETE, this.onAssetComplete, this);

                this._view = new away.containers.View3D();
                this._view.camera.lens.far = 6000;
                this._timer = new away.utils.RequestAnimationFrame(this.render, this);

                this._light = new away.lights.DirectionalLight();
                this._light.color = 0x683019;
                this._light.direction = new away.geom.Vector3D(1, 0, 0);
                this._light.ambient = 0.1;
                this._light.ambientColor = 0x85b2cd;
                this._light.diffuse = 2.8;
                this._light.specular = 1.8;
                this._view.scene.addChild(this._light);

                this._lightPicker = new away.materials.StaticLightPicker([this._light]);

                window.onresize = function () {
                    return _this.resize();
                };
            }
            AWDSuzanne.prototype.resize = function () {
                this._view.y = 0;
                this._view.x = 0;
                this._view.width = window.innerWidth;
                this._view.height = window.innerHeight;
            };

            AWDSuzanne.prototype.render = function (dt) {
                if (this._view.camera) {
                    this._view.camera.lookAt(this.lookAtPosition);
                    this._cameraIncrement += 0.01;
                    this._view.camera.x = Math.cos(this._cameraIncrement) * 1400;
                    this._view.camera.z = Math.sin(this._cameraIncrement) * 1400;

                    this._light.x = Math.cos(this._cameraIncrement) * 1400;
                    this._light.y = Math.sin(this._cameraIncrement) * 1400;
                }

                this._view.render();
            };

            AWDSuzanne.prototype.onAssetComplete = function (e) {
                console.log('------------------------------------------------------------------------------');
                console.log('away.events.AssetEvent.ASSET_COMPLETE', away.library.AssetLibrary.getAsset(e.asset.name));
                console.log('------------------------------------------------------------------------------');
            };

            AWDSuzanne.prototype.onResourceComplete = function (e) {
                console.log('------------------------------------------------------------------------------');
                console.log('away.events.LoaderEvent.RESOURCE_COMPLETE', e);
                console.log('------------------------------------------------------------------------------');

                var loader = e.target;
                var numAssets = loader.baseDependency.assets.length;

                for (var i = 0; i < numAssets; ++i) {
                    var asset = loader.baseDependency.assets[i];

                    switch (asset.assetType) {
                        case away.library.AssetType.MESH:
                            var mesh = asset;

                            this._suzane = mesh;
                            this._suzane.material.lightPicker = this._lightPicker;
                            this._suzane.y = -100;

                            for (var c = 0; c < 80; c++) {
                                var clone = mesh.clone();
                                clone.x = this.getRandom(-2000, 2000);
                                clone.y = this.getRandom(-2000, 2000);
                                clone.z = this.getRandom(-2000, 2000);
                                clone.scale(this.getRandom(50, 200));
                                clone.rotationY = this.getRandom(0, 360);
                                this._view.scene.addChild(clone);
                            }

                            mesh.scale(500);

                            this._view.scene.addChild(mesh);

                            this._timer.start();

                            this.resize();

                            break;

                        case away.library.AssetType.GEOMETRY:
                            break;

                        case away.library.AssetType.MATERIAL:
                            break;
                    }
                }
            };

            AWDSuzanne.prototype.getRandom = function (min, max) {
                return Math.random() * (max - min) + min;
            };
            return AWDSuzanne;
        })();
        parsers.AWDSuzanne = AWDSuzanne;
    })(demos.parsers || (demos.parsers = {}));
    var parsers = demos.parsers;
})(demos || (demos = {}));
//# sourceMappingURL=AWDSuzanne.js.map
