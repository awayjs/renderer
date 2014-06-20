///<reference path="../../../build/stagegl-renderer.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />
var tests;
(function (tests) {
    (function (_primitives) {
        var View = away.containers.View;
        var ContextMode = away.display.ContextMode;

        var Vector3D = away.geom.Vector3D;
        var DirectionalLight = away.entities.DirectionalLight;
        var StaticLightPicker = away.materials.StaticLightPicker;

        var PrimitivePolygonPrefab = away.prefabs.PrimitivePolygonPrefab;
        var PrimitiveSpherePrefab = away.prefabs.PrimitiveSpherePrefab;

        var PrimitiveCylinderPrefab = away.prefabs.PrimitiveCylinderPrefab;
        var PrimitivePlanePrefab = away.prefabs.PrimitivePlanePrefab;
        var PrimitiveConePrefab = away.prefabs.PrimitiveConePrefab;
        var PrimitiveCubePrefab = away.prefabs.PrimitiveCubePrefab;
        var DefaultRenderer = away.render.DefaultRenderer;
        var ContextGLProfile = away.stagegl.ContextGLProfile;
        var RequestAnimationFrame = away.utils.RequestAnimationFrame;

        var WireframePrimitiveTest = (function () {
            function WireframePrimitiveTest() {
                var _this = this;
                this.meshes = new Array();
                this.radius = 400;
                away.Debug.LOG_PI_ERRORS = false;
                away.Debug.THROW_ERRORS = false;

                this.view = new View(new DefaultRenderer(false, ContextGLProfile.BASELINE, ContextMode.FLASH));
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
            WireframePrimitiveTest.prototype.initMeshes = function () {
                var primitives = new Array();
                primitives.push(new PrimitivePolygonPrefab());
                primitives.push(new PrimitiveSpherePrefab());
                primitives.push(new PrimitiveSpherePrefab());
                primitives.push(new PrimitiveCylinderPrefab());
                primitives.push(new PrimitivePlanePrefab());
                primitives.push(new PrimitiveConePrefab());
                primitives.push(new PrimitiveCubePrefab());

                var mesh;

                for (var c = 0; c < primitives.length; c++) {
                    primitives[c].geometryType = "lineSubGeometry";

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

            WireframePrimitiveTest.prototype.render = function () {
                if (this.meshes)
                    for (var c = 0; c < this.meshes.length; c++)
                        this.meshes[c].rotationY += 1;

                this.view.render();
            };

            WireframePrimitiveTest.prototype.onResize = function (event) {
                if (typeof event === "undefined") { event = null; }
                this.view.y = 0;
                this.view.x = 0;

                this.view.width = window.innerWidth;
                this.view.height = window.innerHeight;
            };
            return WireframePrimitiveTest;
        })();
        _primitives.WireframePrimitiveTest = WireframePrimitiveTest;
    })(tests.primitives || (tests.primitives = {}));
    var primitives = tests.primitives;
})(tests || (tests = {}));
//# sourceMappingURL=WireframePrimitive.js.map
