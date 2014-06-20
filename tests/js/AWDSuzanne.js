///<reference path="../../../build/stagegl-renderer.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />
var demos;
(function (demos) {
    (function (parsers) {
        var View = away.containers.View;

        var AssetEvent = away.events.AssetEvent;
        var LoaderEvent = away.events.LoaderEvent;
        var Vector3D = away.geom.Vector3D;
        var AssetLibrary = away.library.AssetLibrary;

        var AssetType = away.library.AssetType;

        var DirectionalLight = away.entities.DirectionalLight;

        var StaticLightPicker = away.materials.StaticLightPicker;
        var URLRequest = away.net.URLRequest;
        var AWDParser = away.parsers.AWDParser;
        var DefaultRenderer = away.render.DefaultRenderer;
        var RequestAnimationFrame = away.utils.RequestAnimationFrame;

        var AWDSuzanne = (function () {
            function AWDSuzanne() {
                var _this = this;
                this.lookAtPosition = new Vector3D();
                this._cameraIncrement = 0;
                away.Debug.LOG_PI_ERRORS = true;
                away.Debug.THROW_ERRORS = false;

                AssetLibrary.enableParser(AWDParser);

                this._token = AssetLibrary.load(new URLRequest('assets/suzanne.awd'));
                this._token.addEventListener(LoaderEvent.RESOURCE_COMPLETE, function (event) {
                    return _this.onResourceComplete(event);
                });
                this._token.addEventListener(AssetEvent.ASSET_COMPLETE, function (event) {
                    return _this.onAssetComplete(event);
                });

                this._view = new View(new DefaultRenderer());
                this._view.camera.projection.far = 6000;
                this._timer = new RequestAnimationFrame(this.render, this);

                this._light = new DirectionalLight();
                this._light.color = 0x683019; //683019;
                this._light.direction = new Vector3D(1, 0, 0);
                this._light.ambient = 0.1; //0.05;//.4;
                this._light.ambientColor = 0x85b2cd; //4F6877;//313D51;
                this._light.diffuse = 2.8;
                this._light.specular = 1.8;
                this._view.scene.addChild(this._light);

                this._lightPicker = new StaticLightPicker([this._light]);

                window.onresize = function (event) {
                    return _this.resize(event);
                };

                this._timer.start();
                this.resize();
            }
            AWDSuzanne.prototype.resize = function (event) {
                if (typeof event === "undefined") { event = null; }
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

            AWDSuzanne.prototype.onAssetComplete = function (event) {
                console.log('------------------------------------------------------------------------------');
                console.log('away.events.AssetEvent.ASSET_COMPLETE', AssetLibrary.getAsset(event.asset.name));
                console.log('------------------------------------------------------------------------------');
            };

            AWDSuzanne.prototype.onResourceComplete = function (event) {
                console.log('------------------------------------------------------------------------------');
                console.log('away.events.LoaderEvent.RESOURCE_COMPLETE', event);
                console.log('------------------------------------------------------------------------------');

                var loader = event.target;
                var numAssets = loader.baseDependency.assets.length;

                for (var i = 0; i < numAssets; ++i) {
                    var asset = loader.baseDependency.assets[i];

                    switch (asset.assetType) {
                        case AssetType.MESH:
                            this._suzanne = asset;

                            this._suzanne.material.lightPicker = this._lightPicker;
                            this._suzanne.y = -100;

                            for (var c = 0; c < 80; c++) {
                                var scale = this.getRandom(50, 200);
                                var clone = this._suzanne.clone();
                                clone.x = this.getRandom(-2000, 2000);
                                clone.y = this.getRandom(-2000, 2000);
                                clone.z = this.getRandom(-2000, 2000);
                                clone.transform.scale = new Vector3D(scale, scale, scale);
                                clone.rotationY = this.getRandom(0, 360);
                                this._view.scene.addChild(clone);
                            }

                            this._suzanne.transform.scale = new Vector3D(500, 500, 500);

                            this._view.scene.addChild(this._suzanne);

                            break;

                        case AssetType.GEOMETRY:
                            break;

                        case AssetType.MATERIAL:
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
