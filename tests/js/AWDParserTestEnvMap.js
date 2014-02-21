///<reference path="../../../build/Away3D.next.d.ts" />
var tests;
(function (tests) {
    (function (library) {
        var AWDParserTestEnvMap = (function () {
            function AWDParserTestEnvMap() {
                var _this = this;
                away.Debug.LOG_PI_ERRORS = true;
                away.Debug.THROW_ERRORS = false;

                away.library.AssetLibrary.enableParser(away.parsers.AWDParser);

                this.token = away.library.AssetLibrary.load(new away.net.URLRequest('assets/awd/EnvMapTest.awd'));
                this.token.addEventListener(away.events.LoaderEvent.RESOURCE_COMPLETE, away.utils.Delegate.create(this, this.onResourceComplete));
                this.token.addEventListener(away.events.AssetEvent.ASSET_COMPLETE, away.utils.Delegate.create(this, this.onAssetComplete));

                this._view = new away.containers.View(new away.render.DefaultRenderer());
                this._timer = new away.utils.RequestAnimationFrame(this.render, this);

                window.onresize = function () {
                    return _this.resize();
                };
            }
            AWDParserTestEnvMap.prototype.resize = function () {
                this._view.y = 0;
                this._view.x = 0;
                this._view.width = window.innerWidth;
                this._view.height = window.innerHeight;
            };

            AWDParserTestEnvMap.prototype.render = function (dt) {
                if (this._torus) {
                    this._torus.rotationY += 1;
                }

                this._view.render();
                this._view.camera.z = -2000;
            };

            AWDParserTestEnvMap.prototype.onAssetComplete = function (e) {
                console.log('------------------------------------------------------------------------------');
                console.log('away.events.AssetEvent.ASSET_COMPLETE', away.library.AssetLibrary.getAsset(e.asset.name));
                console.log('------------------------------------------------------------------------------');
            };

            AWDParserTestEnvMap.prototype.onResourceComplete = function (e) {
                console.log('------------------------------------------------------------------------------');
                console.log('away.events.LoaderEvent.RESOURCE_COMPLETE', e);
                console.log('------------------------------------------------------------------------------');

                var loader = e.target;
                var numAssets = loader.baseDependency.assets.length;

                for (var i = 0; i < numAssets; ++i) {
                    var asset = loader.baseDependency.assets[i];

                    console.log(asset.assetType);

                    switch (asset.assetType) {
                        case away.library.AssetType.SKYBOX:
                            var skybox = asset;
                            this._view.scene.addChild(skybox);
                            break;

                        case away.library.AssetType.MESH:
                            var mesh = this._torus = asset;
                            this._view.scene.addChild(mesh);

                            break;

                        case away.library.AssetType.GEOMETRY:
                            break;

                        case away.library.AssetType.MATERIAL:
                            break;
                    }
                }

                this._timer.start();
                this.resize();
            };
            return AWDParserTestEnvMap;
        })();
        library.AWDParserTestEnvMap = AWDParserTestEnvMap;
    })(tests.library || (tests.library = {}));
    var library = tests.library;
})(tests || (tests = {}));
//# sourceMappingURL=AWDParserTestEnvMap.js.map
