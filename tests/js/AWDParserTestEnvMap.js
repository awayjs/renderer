///<reference path="../../../build/stagegl-renderer.next.d.ts" />
var tests;
(function (tests) {
    (function (library) {
        var View = away.containers.View;

        var AssetEvent = away.events.AssetEvent;
        var LoaderEvent = away.events.LoaderEvent;

        var AssetLibrary = away.library.AssetLibrary;

        var AssetType = away.library.AssetType;

        var URLRequest = away.net.URLRequest;
        var AWDParser = away.parsers.AWDParser;
        var DefaultRenderer = away.render.DefaultRenderer;
        var RequestAnimationFrame = away.utils.RequestAnimationFrame;

        var AWDParserTestEnvMap = (function () {
            function AWDParserTestEnvMap() {
                var _this = this;
                away.Debug.LOG_PI_ERRORS = true;
                away.Debug.THROW_ERRORS = false;

                AssetLibrary.enableParser(AWDParser);

                this._token = AssetLibrary.load(new URLRequest('assets/awd/EnvMapTest.awd'));
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
            AWDParserTestEnvMap.prototype.resize = function (event) {
                if (typeof event === "undefined") { event = null; }
                this._view.y = 0;
                this._view.x = 0;
                this._view.width = window.innerWidth;
                this._view.height = window.innerHeight;
            };

            AWDParserTestEnvMap.prototype.render = function (dt) {
                if (this._torus)
                    this._torus.rotationY += 1;

                this._view.render();
                this._view.camera.z = -2000;
            };

            AWDParserTestEnvMap.prototype.onAssetComplete = function (event) {
                console.log('------------------------------------------------------------------------------');
                console.log('away.events.AssetEvent.ASSET_COMPLETE', AssetLibrary.getAsset(event.asset.name));
                console.log('------------------------------------------------------------------------------');
            };

            AWDParserTestEnvMap.prototype.onResourceComplete = function (event) {
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
            return AWDParserTestEnvMap;
        })();
        library.AWDParserTestEnvMap = AWDParserTestEnvMap;
    })(tests.library || (tests.library = {}));
    var library = tests.library;
})(tests || (tests = {}));
//# sourceMappingURL=AWDParserTestEnvMap.js.map
