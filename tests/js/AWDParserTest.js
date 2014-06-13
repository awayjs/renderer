///<reference path="../../../build/stagegl-renderer.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />
var tests;
(function (tests) {
    (function (library) {
        var View = away.containers.View;

        var AssetEvent = away.events.AssetEvent;
        var LoaderEvent = away.events.LoaderEvent;
        var Vector3D = away.geom.Vector3D;
        var AssetLibrary = away.library.AssetLibrary;

        var AssetType = away.library.AssetType;

        var URLRequest = away.net.URLRequest;
        var AWDParser = away.parsers.AWDParser;
        var DefaultRenderer = away.render.DefaultRenderer;
        var RequestAnimationFrame = away.utils.RequestAnimationFrame;

        var AWDParserTest = (function () {
            function AWDParserTest() {
                var _this = this;
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
                this._timer = new RequestAnimationFrame(this.render, this);

                window.onresize = function (event) {
                    return _this.resize(event);
                };

                this._timer.start();
                this.resize();
            }
            AWDParserTest.prototype.resize = function (event) {
                if (typeof event === "undefined") { event = null; }
                this._view.y = 0;
                this._view.x = 0;
                this._view.width = window.innerWidth;
                this._view.height = window.innerHeight;
            };

            AWDParserTest.prototype.render = function (dt) {
                if (this._suzanne)
                    this._suzanne.rotationY += 1;

                this._view.render();
                this._view.camera.z = -2000;
            };

            AWDParserTest.prototype.onAssetComplete = function (event) {
                console.log('------------------------------------------------------------------------------');
                console.log('away.events.AssetEvent.ASSET_COMPLETE', AssetLibrary.getAsset(event.asset.name));
                console.log('------------------------------------------------------------------------------');
            };

            AWDParserTest.prototype.onResourceComplete = function (event) {
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
                            this._suzanne.transform.scale = new Vector3D(600, 600, 600);

                            this._view.scene.addChild(this._suzanne);

                            break;

                        case AssetType.GEOMETRY:
                            break;

                        case AssetType.MATERIAL:
                            break;
                    }
                }
            };
            return AWDParserTest;
        })();
        library.AWDParserTest = AWDParserTest;
    })(tests.library || (tests.library = {}));
    var library = tests.library;
})(tests || (tests = {}));
//# sourceMappingURL=AWDParserTest.js.map
