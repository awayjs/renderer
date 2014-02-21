///<reference path="../../../build/Away3D.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />
var demos;
(function (demos) {
    (function (parsers) {
        var ObjChiefTestDay = (function () {
            function ObjChiefTestDay() {
                var _this = this;
                this.height = 0;
                this.meshes = new Array();
                this.spartan = new away.containers.DisplayObjectContainer();
                this.t = 0;
                this.spartanFlag = false;
                this.terrainObjFlag = false;
                away.Debug.LOG_PI_ERRORS = false;
                away.Debug.THROW_ERRORS = false;

                this.view = new away.containers.View(new away.render.DefaultRenderer());
                this.view.camera.z = -50;
                this.view.camera.y = 20;
                this.view.camera.projection.near = 0.1;
                this.view.backgroundColor = 0xCEC8C6;

                //this.view.backgroundColor   = 0xFF0000;
                this.raf = new away.utils.RequestAnimationFrame(this.render, this);

                this.light = new away.lights.DirectionalLight();
                this.light.color = 0xc1582d; //683019;
                this.light.direction = new away.geom.Vector3D(1, 0, 0);
                this.light.ambient = 0.4; //0.05;//.4;
                this.light.ambientColor = 0x85b2cd; //4F6877;//313D51;
                this.light.diffuse = 2.8;
                this.light.specular = 1.8;

                //this.light.x                = 800;
                //this.light.y                = 800;
                this.spartan.transform.scale = new away.geom.Vector3D(.25, .25, .25);
                this.spartan.y = 0;

                this.view.scene.addChild(this.light);

                away.library.AssetLibrary.enableParser(away.parsers.OBJParser);

                this.token = away.library.AssetLibrary.load(new away.net.URLRequest('assets/Halo_3_SPARTAN4.obj'));
                this.token.addEventListener(away.events.LoaderEvent.RESOURCE_COMPLETE, away.utils.Delegate.create(this, this.onResourceComplete));
                this.token.addEventListener(away.events.AssetEvent.ASSET_COMPLETE, away.utils.Delegate.create(this, this.onAssetComplete));

                this.token = away.library.AssetLibrary.load(new away.net.URLRequest('assets/terrain.obj'));
                this.token.addEventListener(away.events.LoaderEvent.RESOURCE_COMPLETE, away.utils.Delegate.create(this, this.onResourceComplete));
                this.token.addEventListener(away.events.AssetEvent.ASSET_COMPLETE, away.utils.Delegate.create(this, this.onAssetComplete));

                //*
                this.token = away.library.AssetLibrary.load(new away.net.URLRequest('assets/masterchief_base.png'));
                this.token.addEventListener(away.events.LoaderEvent.RESOURCE_COMPLETE, away.utils.Delegate.create(this, this.onResourceComplete));
                this.token.addEventListener(away.events.AssetEvent.ASSET_COMPLETE, away.utils.Delegate.create(this, this.onAssetComplete));

                this.token = away.library.AssetLibrary.load(new away.net.URLRequest('assets/stone_tx.jpg'));
                this.token.addEventListener(away.events.LoaderEvent.RESOURCE_COMPLETE, away.utils.Delegate.create(this, this.onResourceComplete));
                this.token.addEventListener(away.events.AssetEvent.ASSET_COMPLETE, away.utils.Delegate.create(this, this.onAssetComplete));

                // */
                window.onresize = function () {
                    return _this.resize();
                };
            }
            ObjChiefTestDay.prototype.render = function () {
                if (this.terrain)
                    this.terrain.rotationY += 0.4;

                this.spartan.rotationY += 0.4;
                this.view.render();
            };

            ObjChiefTestDay.prototype.onAssetComplete = function (e) {
            };

            ObjChiefTestDay.prototype.onResourceComplete = function (e) {
                var loader = e.target;
                var l = loader.baseDependency.assets.length;

                console.log('------------------------------------------------------------------------------');
                console.log('away.events.LoaderEvent.RESOURCE_COMPLETE', e, l, loader);
                console.log('------------------------------------------------------------------------------');

                //*
                var loader = e.target;
                var l = loader.baseDependency.assets.length;

                for (var c = 0; c < l; c++) {
                    var d = loader.baseDependency.assets[c];

                    console.log(d.name, e.url);

                    switch (d.assetType) {
                        case away.library.AssetType.MESH:
                            if (e.url == 'assets/Halo_3_SPARTAN4.obj') {
                                var mesh = away.library.AssetLibrary.getAsset(d.name);

                                this.spartan.addChild(mesh);
                                this.raf.start();
                                this.spartanFlag = true;

                                this.meshes.push(mesh);
                            }

                            if (e.url == 'assets/terrain.obj') {
                                this.terrainObjFlag = true;
                                this.terrain = away.library.AssetLibrary.getAsset(d.name);
                                this.terrain.y = 98;
                                this.view.scene.addChild(this.terrain);
                            }

                            break;

                        case away.library.AssetType.TEXTURE:
                            if (e.url == 'assets/masterchief_base.png') {
                                var lightPicker = new away.materials.StaticLightPicker([this.light]);
                                var tx = away.library.AssetLibrary.getAsset(d.name);

                                this.mat = new away.materials.TextureMaterial(tx, true, true, false);
                                this.mat.lightPicker = lightPicker;
                            }

                            if (e.url == 'assets/stone_tx.jpg') {
                                var lp = new away.materials.StaticLightPicker([this.light]);
                                var txT = away.library.AssetLibrary.getAsset(d.name);

                                this.terrainMaterial = new away.materials.TextureMaterial(txT, true, true, false);
                                this.terrainMaterial.lightPicker = lp;
                            }

                            break;
                    }
                }

                if (this.terrainObjFlag && this.terrainMaterial) {
                    this.terrain.material = this.terrainMaterial;
                    this.terrain.geometry.scaleUV(20, 20);
                }

                if (this.mat && this.spartanFlag) {
                    for (var c = 0; c < this.meshes.length; c++) {
                        this.meshes[c].material = this.mat;
                    }
                }

                this.view.scene.addChild(this.spartan);
                this.resize();
            };

            ObjChiefTestDay.prototype.resize = function () {
                this.view.y = 0;
                this.view.x = 0;

                this.view.width = window.innerWidth;
                this.view.height = window.innerHeight;
            };
            return ObjChiefTestDay;
        })();
        parsers.ObjChiefTestDay = ObjChiefTestDay;
    })(demos.parsers || (demos.parsers = {}));
    var parsers = demos.parsers;
})(demos || (demos = {}));
//# sourceMappingURL=ObjChiefTestDay.js.map
