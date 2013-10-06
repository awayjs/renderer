var tests;
(function (tests) {
    ///<reference path="../../../build/Away3D.next.d.ts" />
    //<reference path="../../../src/Away3D.ts" />
    (function (library) {
        var AWDParserTest = (function () {
            function AWDParserTest() {
                var _this = this;
                away.Debug.LOG_PI_ERRORS = true;
                away.Debug.THROW_ERRORS = false;

                away.library.AssetLibrary.enableParser(away.loaders.AWDParser);

                this.token = away.library.AssetLibrary.load(new away.net.URLRequest('assets/suzanne.awd'));
                this.token.addEventListener(away.events.LoaderEvent.RESOURCE_COMPLETE, this.onResourceComplete, this);
                this.token.addEventListener(away.events.AssetEvent.ASSET_COMPLETE, this.onAssetComplete, this);

                this._view = new away.containers.View3D();
                this._timer = new away.utils.RequestAnimationFrame(this.render, this);

                window.onresize = function () {
                    return _this.resize();
                };
            }
            AWDParserTest.prototype.resize = function () {
                this._view.y = 0;
                this._view.x = 0;
                this._view.width = window.innerWidth;
                this._view.height = window.innerHeight;
            };

            AWDParserTest.prototype.render = function (dt) {
                if (this._suzane) {
                    this._suzane.rotationY += 1;
                }

                this._view.render();
                this._view.camera.z = -2000;
            };

            AWDParserTest.prototype.onAssetComplete = function (e) {
                console.log('------------------------------------------------------------------------------');
                console.log('away.events.AssetEvent.ASSET_COMPLETE', away.library.AssetLibrary.getAsset(e.asset.name));
                console.log('------------------------------------------------------------------------------');
            };

            AWDParserTest.prototype.onResourceComplete = function (e) {
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

                            mesh.scale(600);

                            this._suzane = mesh;

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
            return AWDParserTest;
        })();
        library.AWDParserTest = AWDParserTest;
    })(tests.library || (tests.library = {}));
    var library = tests.library;
})(tests || (tests = {}));
//# sourceMappingURL=AWDParserTest.js.map
