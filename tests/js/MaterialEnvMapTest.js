///<reference path="../../build/stagegl-extensions.next.d.ts" />
var tests;
(function (tests) {
    (function (materials) {
        var View = away.containers.View;

        var AssetEvent = away.events.AssetEvent;
        var LoaderEvent = away.events.LoaderEvent;

        var AssetLibrary = away.library.AssetLibrary;

        var AssetType = away.library.AssetType;

        var URLRequest = away.net.URLRequest;
        var AWDParser = away.parsers.AWDParser;
        var DefaultRenderer = away.render.DefaultRenderer;
        var RequestAnimationFrame = away.utils.RequestAnimationFrame;

        var MaterialEnvMapTest = (function () {
            function MaterialEnvMapTest() {
                var _this = this;
                away.Debug.LOG_PI_ERRORS = true;
                away.Debug.THROW_ERRORS = false;

                AssetLibrary.enableParser(AWDParser);

                this._token = AssetLibrary.load(new URLRequest('assets/EnvMapTest.awd'));
                this._token.addEventListener(LoaderEvent.RESOURCE_COMPLETE, function (event) {
                    return _this.onResourceComplete(event);
                });
                this._token.addEventListener(AssetEvent.ASSET_COMPLETE, function (event) {
                    return _this.onAssetComplete(event);
                });

                this._view = new View(new DefaultRenderer());
                this._timer = new RequestAnimationFrame(this.render, this);

                window.onresize = function () {
                    return _this.resize();
                };

                this._timer.start();
                this.resize();
            }
            MaterialEnvMapTest.prototype.resize = function (event) {
                if (typeof event === "undefined") { event = null; }
                this._view.y = 0;
                this._view.x = 0;
                this._view.width = window.innerWidth;
                this._view.height = window.innerHeight;
            };

            MaterialEnvMapTest.prototype.render = function (dt) {
                if (this._torus)
                    this._torus.rotationY += 1;

                this._view.render();
                this._view.camera.z = -2000;
            };

            MaterialEnvMapTest.prototype.onAssetComplete = function (event) {
                console.log('------------------------------------------------------------------------------');
                console.log('away.events.AssetEvent.ASSET_COMPLETE', AssetLibrary.getAsset(event.asset.name));
                console.log('------------------------------------------------------------------------------');
            };

            MaterialEnvMapTest.prototype.onResourceComplete = function (event) {
                console.log('------------------------------------------------------------------------------');
                console.log('away.events.LoaderEvent.RESOURCE_COMPLETE', event);
                console.log('------------------------------------------------------------------------------');

                var loader = event.target;
                var numAssets = loader.baseDependency.assets.length;

                for (var i = 0; i < numAssets; ++i) {
                    var asset = loader.baseDependency.assets[i];

                    console.log(asset.assetType);

                    switch (asset.assetType) {
                        case AssetType.SKYBOX:
                            var skybox = asset;
                            this._view.scene.addChild(skybox);
                            break;

                        case AssetType.MESH:
                            this._torus = asset;
                            this._view.scene.addChild(this._torus);

                            break;

                        case AssetType.GEOMETRY:
                            break;

                        case AssetType.MATERIAL:
                            break;
                    }
                }
            };
            return MaterialEnvMapTest;
        })();
        materials.MaterialEnvMapTest = MaterialEnvMapTest;
    })(tests.materials || (tests.materials = {}));
    var materials = tests.materials;
})(tests || (tests = {}));
//# sourceMappingURL=MaterialEnvMapTest.js.map
