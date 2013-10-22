var demos;
(function (demos) {
    ///<reference path="../../../build/Away3D.next.d.ts" />
    (function (parsers) {
        var AWDShadowTest = (function () {
            function AWDShadowTest() {
                var _this = this;
                this.lookAtPosition = new away.geom.Vector3D();
                this._cameraIncrement = 0;
                away.Debug.LOG_PI_ERRORS = true;
                away.Debug.THROW_ERRORS = false;

                away.library.AssetLibrary.enableParser(away.loaders.AWDParser);

                this._token = away.library.AssetLibrary.load(new away.net.URLRequest('assets/awd/ShadowTest.awd'));

                this._token.addEventListener(away.events.LoaderEvent.RESOURCE_COMPLETE, this.onResourceComplete, this);
                this._token.addEventListener(away.events.AssetEvent.ASSET_COMPLETE, this.onAssetComplete, this);

                this._view = new away.containers.View3D();
                this._view.camera.lens.far = 6000;
                this._view.camera.y = 100;

                this._timer = new away.utils.RequestAnimationFrame(this.render, this);

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
                    this._cameraIncrement += 0.01;
                    this._view.camera.x = Math.cos(this._cameraIncrement) * 400;
                    this._view.camera.z = Math.sin(this._cameraIncrement) * 400;
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

                    console.log(asset.assetType);
                    switch (asset.assetType) {
                        case away.library.AssetType.MESH:
                            var mesh = asset;

                            this._view.scene.addChild(mesh);

                            this.resize();

                            break;

                        case away.library.AssetType.LIGHT:
                            this._view.scene.addChild(asset);

                            break;

                        case away.library.AssetType.MATERIAL:
                            break;
                    }
                }

                /*
                switch (ev.asset.assetType) {
                
                obj = <away.lights.LightBase> ev.asset;
                break;
                case away.library.AssetType.CONTAINER:
                obj = <away.containers.ObjectContainer3D> ev.asset;
                break;
                case away.library.AssetType.MESH:
                obj = <away.entities.Mesh> ev.asset;
                break;
                //case away.library.AssetType.SKYBOX:
                //    obj = <away.entities.SkyBox> ev.asset;
                break;
                //case away.library.AssetType.TEXTURE_PROJECTOR:
                //    obj = <away.entities.TextureProjector> ev.asset;
                break;
                case away.library.AssetType.CAMERA:
                obj = <away.cameras.Camera3D> ev.asset;
                break;
                case away.library.AssetType.SEGMENT_SET:
                obj = <away.entities.SegmentSet> ev.asset;
                break;
                }
                */
                this._timer.start();
            };
            return AWDShadowTest;
        })();
        parsers.AWDShadowTest = AWDShadowTest;
    })(demos.parsers || (demos.parsers = {}));
    var parsers = demos.parsers;
})(demos || (demos = {}));
//# sourceMappingURL=AWDShadowTest.js.map
