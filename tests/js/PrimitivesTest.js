///<reference path="../../../build/stagegl-renderer.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />
var tests;
(function (tests) {
    (function (_primitives) {
        var View = away.containers.View;

        var Vector3D = away.geom.Vector3D;
        var DirectionalLight = away.lights.DirectionalLight;
        var StaticLightPicker = away.materials.StaticLightPicker;

        var DefaultMaterialManager = away.materials.DefaultMaterialManager;

        var PrimitiveTorusPrefab = away.prefabs.PrimitiveTorusPrefab;
        var PrimitiveSpherePrefab = away.prefabs.PrimitiveSpherePrefab;
        var PrimitiveCapsulePrefab = away.prefabs.PrimitiveCapsulePrefab;
        var PrimitiveCylinderPrefab = away.prefabs.PrimitiveCylinderPrefab;
        var PrimitivePlanePrefab = away.prefabs.PrimitivePlanePrefab;
        var PrimitiveConePrefab = away.prefabs.PrimitiveConePrefab;
        var PrimitiveCubePrefab = away.prefabs.PrimitiveCubePrefab;
        var DefaultRenderer = away.render.DefaultRenderer;
        var RequestAnimationFrame = away.utils.RequestAnimationFrame;

        var PrimitivesTest = (function () {
            function PrimitivesTest() {
                var _this = this;
                this.meshes = new Array();
                this.radius = 400;
                away.Debug.LOG_PI_ERRORS = false;
                away.Debug.THROW_ERRORS = false;

                this.view = new View(new DefaultRenderer());
                this.raf = new RequestAnimationFrame(this.render, this);

                this.light = new DirectionalLight();
                this.light.color = 0xFFFFFF;
                this.light.direction = new Vector3D(1, 1, 0);
                this.light.ambient = 0;
                this.light.ambientColor = 0xFFFFFF;
                this.light.diffuse = 1;
                this.light.specular = 1;

                this.lightB = new DirectionalLight();
                this.lightB.color = 0xFF0000;
                this.lightB.direction = new Vector3D(-1, 0, 1);
                this.lightB.ambient = 0;
                this.lightB.ambientColor = 0xFFFFFF;
                this.lightB.diffuse = 1;
                this.lightB.specular = 1;

                this.staticLightPicker = new StaticLightPicker([this.light, this.lightB]);

                this.view.scene.addChild(this.light);
                this.view.scene.addChild(this.lightB);

                this.view.backgroundColor = 0x222222;

                window.onresize = function (event) {
                    return _this.onResize(event);
                };

                this.initMeshes();
                this.raf.start();
                this.onResize();
            }
            PrimitivesTest.prototype.initMeshes = function () {
                var primitives = new Array();
                var material = DefaultMaterialManager.getDefaultMaterial();
                material.lightPicker = this.staticLightPicker;

                primitives.push(new PrimitiveTorusPrefab());
                primitives.push(new PrimitiveSpherePrefab());
                primitives.push(new PrimitiveCapsulePrefab());
                primitives.push(new PrimitiveCylinderPrefab());
                primitives.push(new PrimitivePlanePrefab());
                primitives.push(new PrimitiveConePrefab());
                primitives.push(new PrimitiveCubePrefab());

                var mesh;

                for (var c = 0; c < primitives.length; c++) {
                    primitives[c].material = material;

                    var t = Math.PI * 2 * c / primitives.length;

                    mesh = primitives[c].getNewObject();
                    mesh.x = Math.cos(t) * this.radius;
                    mesh.y = Math.sin(t) * this.radius;
                    mesh.z = 0;
                    mesh.transform.scale = new Vector3D(2, 2, 2);

                    this.view.scene.addChild(mesh);
                    this.meshes.push(mesh);
                }
            };

            PrimitivesTest.prototype.render = function () {
                if (this.meshes)
                    for (var c = 0; c < this.meshes.length; c++)
                        this.meshes[c].rotationY += 1;

                this.view.render();
            };

            PrimitivesTest.prototype.onResize = function (event) {
                if (typeof event === "undefined") { event = null; }
                this.view.y = 0;
                this.view.x = 0;

                this.view.width = window.innerWidth;
                this.view.height = window.innerHeight;
            };
            return PrimitivesTest;
        })();
        _primitives.PrimitivesTest = PrimitivesTest;
    })(tests.primitives || (tests.primitives = {}));
    var primitives = tests.primitives;
})(tests || (tests = {}));
//# sourceMappingURL=PrimitivesTest.js.map
