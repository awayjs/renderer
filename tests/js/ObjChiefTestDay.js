///<reference path="../../build/stagegl-extensions.next.d.ts" />
var tests;
(function (tests) {
    (function (parsers) {
        var DisplayObjectContainer = away.containers.DisplayObjectContainer;

        var View = away.containers.View;

        var LoaderEvent = away.events.LoaderEvent;
        var Vector3D = away.geom.Vector3D;
        var AssetLibrary = away.library.AssetLibrary;

        var AssetType = away.library.AssetType;

        var DirectionalLight = away.entities.DirectionalLight;
        var TriangleMethodMaterial = away.materials.TriangleMethodMaterial;
        var StaticLightPicker = away.materials.StaticLightPicker;
        var URLRequest = away.net.URLRequest;
        var OBJParser = away.parsers.OBJParser;
        var DefaultRenderer = away.render.DefaultRenderer;

        var RequestAnimationFrame = away.utils.RequestAnimationFrame;

        var ObjChiefTestDay = (function () {
            function ObjChiefTestDay() {
                var _this = this;
                this.meshes = new Array();
                this.spartan = new DisplayObjectContainer();
                this.spartanFlag = false;
                this.terrainObjFlag = false;
                away.Debug.LOG_PI_ERRORS = false;
                away.Debug.THROW_ERRORS = false;

                this.view = new View(new DefaultRenderer());
                this.view.camera.z = -50;
                this.view.camera.y = 20;
                this.view.camera.projection.near = 0.1;
                this.view.backgroundColor = 0xCEC8C6;

                this.raf = new RequestAnimationFrame(this.render, this);

                this.light = new DirectionalLight();
                this.light.color = 0xc1582d;
                this.light.direction = new Vector3D(1, 0, 0);
                this.light.ambient = 0.4;
                this.light.ambientColor = 0x85b2cd;
                this.light.diffuse = 2.8;
                this.light.specular = 1.8;

                this.spartan.transform.scale = new Vector3D(.25, .25, .25);
                this.spartan.y = 0;

                this.view.scene.addChild(this.light);

                AssetLibrary.enableParser(OBJParser);

                this.token = AssetLibrary.load(new away.net.URLRequest('assets/Halo_3_SPARTAN4.obj'));
                this.token.addEventListener(LoaderEvent.RESOURCE_COMPLETE, function (event) {
                    return _this.onResourceComplete(event);
                });

                this.token = AssetLibrary.load(new URLRequest('assets/terrain.obj'));
                this.token.addEventListener(LoaderEvent.RESOURCE_COMPLETE, function (event) {
                    return _this.onResourceComplete(event);
                });

                this.token = AssetLibrary.load(new URLRequest('assets/masterchief_base.png'));
                this.token.addEventListener(LoaderEvent.RESOURCE_COMPLETE, function (event) {
                    return _this.onResourceComplete(event);
                });

                this.token = AssetLibrary.load(new away.net.URLRequest('assets/stone_tx.jpg'));
                this.token.addEventListener(LoaderEvent.RESOURCE_COMPLETE, function (event) {
                    return _this.onResourceComplete(event);
                });

                window.onresize = function (event) {
                    return _this.onResize();
                };

                this.raf.start();
            }
            ObjChiefTestDay.prototype.render = function () {
                if (this.terrain)
                    this.terrain.rotationY += 0.4;

                this.spartan.rotationY += 0.4;
                this.view.render();
            };

            ObjChiefTestDay.prototype.onResourceComplete = function (event) {
                var loader = event.target;
                var l = loader.baseDependency.assets.length;

                console.log('------------------------------------------------------------------------------');
                console.log('away.events.LoaderEvent.RESOURCE_COMPLETE', event, l, loader);
                console.log('------------------------------------------------------------------------------');

                var loader = event.target;
                var l = loader.baseDependency.assets.length;

                for (var c = 0; c < l; c++) {
                    var d = loader.baseDependency.assets[c];

                    console.log(d.name, event.url);

                    switch (d.assetType) {
                        case AssetType.MESH:
                            if (event.url == 'assets/Halo_3_SPARTAN4.obj') {
                                var mesh = d;

                                this.spartan.addChild(mesh);
                                this.spartanFlag = true;
                                this.meshes.push(mesh);
                            } else if (event.url == 'assets/terrain.obj') {
                                this.terrainObjFlag = true;
                                this.terrain = d;
                                this.terrain.y = 98;
                                this.view.scene.addChild(this.terrain);
                            }

                            break;
                        case AssetType.TEXTURE:
                            if (event.url == 'assets/masterchief_base.png') {
                                this.mat = new TriangleMethodMaterial(d, true, true, false);
                                this.mat.lightPicker = new StaticLightPicker([this.light]);
                            } else if (event.url == 'assets/stone_tx.jpg') {
                                this.terrainMaterial = new TriangleMethodMaterial(d, true, true, false);
                                this.terrainMaterial.lightPicker = new StaticLightPicker([this.light]);
                            }

                            break;
                    }
                }

                if (this.terrainObjFlag && this.terrainMaterial) {
                    this.terrain.material = this.terrainMaterial;
                    this.terrain.geometry.scaleUV(20, 20);
                }

                if (this.mat && this.spartanFlag)
                    for (var c = 0; c < this.meshes.length; c++)
                        this.meshes[c].material = this.mat;

                this.view.scene.addChild(this.spartan);
                this.onResize();
            };

            ObjChiefTestDay.prototype.onResize = function (event) {
                if (typeof event === "undefined") { event = null; }
                this.view.y = 0;
                this.view.x = 0;

                this.view.width = window.innerWidth;
                this.view.height = window.innerHeight;
            };
            return ObjChiefTestDay;
        })();
        parsers.ObjChiefTestDay = ObjChiefTestDay;
    })(tests.parsers || (tests.parsers = {}));
    var parsers = tests.parsers;
})(tests || (tests = {}));
//# sourceMappingURL=ObjChiefTestDay.js.map
