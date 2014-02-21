///<reference path="../../../build/Away3D.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />
var demos;
(function (demos) {
    (function (parsers) {
        var AWDSponza = (function () {
            function AWDSponza() {
                var _this = this;
                this.lookAtPosition = new away.geom.Vector3D();
                this._cameraIncrement = 0;
                away.Debug.LOG_PI_ERRORS = true;
                away.Debug.THROW_ERRORS = false;

                away.library.AssetLibrary.enableParser(away.parsers.AWDParser);

                this._token = away.library.AssetLibrary.load(new away.net.URLRequest('assets/awd/sponza/sponza_lights_textures_u.awd'));

                //
                this._token.addEventListener(away.events.LoaderEvent.RESOURCE_COMPLETE, away.utils.Delegate.create(this, this.onResourceComplete));
                this._token.addEventListener(away.events.AssetEvent.ASSET_COMPLETE, away.utils.Delegate.create(this, this.onAssetComplete));

                this._view = new away.containers.View(new away.render.DefaultRenderer());
                this._view.camera.projection.far = 6000;
                this._view.camera.y = 100;

                this._timer = new away.utils.RequestAnimationFrame(this.render, this);

                window.onresize = function () {
                    return _this.resize();
                };
            }
            AWDSponza.prototype.resize = function () {
                this._view.width = 720; //window.innerWidth;
                this._view.height = 480; //window.innerHeight;

                this._view.x = (window.innerWidth - this._view.width) / 2;
                this._view.y = (window.innerHeight - this._view.height) / 2;
                ;
            };

            AWDSponza.prototype.render = function (dt) {
                if (this._view.camera) {
                    this._view.camera.lookAt(this.lookAtPosition);
                    this._cameraIncrement += 0.01;
                    this._view.camera.x = Math.cos(this._cameraIncrement) * 400;
                    this._view.camera.z = Math.sin(this._cameraIncrement) * 400;
                }

                this._view.render();
            };

            AWDSponza.prototype.onAssetComplete = function (e) {
                console.log('------------------------------------------------------------------------------');
                console.log('away.events.AssetEvent.ASSET_COMPLETE', away.library.AssetLibrary.getAsset(e.asset.name));
                console.log('------------------------------------------------------------------------------');
            };

            AWDSponza.prototype.onResourceComplete = function (e) {
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
                            this._view.scene.addChild(mesh);

                            break;

                        case away.library.AssetType.LIGHT:
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
            return AWDSponza;
        })();
        parsers.AWDSponza = AWDSponza;
    })(demos.parsers || (demos.parsers = {}));
    var parsers = demos.parsers;
})(demos || (demos = {}));
//# sourceMappingURL=AWDSponza.js.map
