///<reference path="../../../build/stagegl-renderer.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />
var tests;
(function (tests) {
    (function (containers) {
        var View = away.containers.View;

        var PointLight = away.entities.PointLight;
        var TriangleMaterial = away.materials.TriangleMaterial;
        var PrimitiveTorusPrefab = away.prefabs.PrimitiveTorusPrefab;
        var DefaultRenderer = away.render.DefaultRenderer;

        var View3DTest = (function () {
            function View3DTest() {
                var _this = this;
                away.Debug.THROW_ERRORS = false;
                away.Debug.LOG_PI_ERRORS = false;

                this.meshes = new Array();
                this.light = new PointLight();
                this.view = new View(new DefaultRenderer());
                this.view.camera.z = 0;
                this.view.backgroundColor = 0x776655;
                this.torus = new PrimitiveTorusPrefab(150, 50, 32, 32, false);

                var l = 10;
                var radius = 1000;
                var matB = new TriangleMaterial();

                this.torus.material = matB;

                for (var c = 0; c < l; c++) {
                    var t = Math.PI * 2 * c / l;

                    var mesh = this.torus.getNewObject();
                    mesh.x = Math.cos(t) * radius;
                    mesh.y = 0;
                    mesh.z = Math.sin(t) * radius;

                    this.view.scene.addChild(mesh);
                    this.meshes.push(mesh);
                }

                this.view.scene.addChild(this.light);

                this.raf = new away.utils.RequestAnimationFrame(this.tick, this);
                this.raf.start();
                this.resize(null);

                window.onresize = function (e) {
                    return _this.resize(null);
                };
            }
            View3DTest.prototype.tick = function (e) {
                for (var c = 0; c < this.meshes.length; c++)
                    this.meshes[c].rotationY += 2;

                this.view.camera.rotationY += .5;
                this.view.render();
            };

            View3DTest.prototype.resize = function (e) {
                this.view.y = 0;
                this.view.x = 0;

                this.view.width = window.innerWidth;
                this.view.height = window.innerHeight;
            };
            return View3DTest;
        })();
        containers.View3DTest = View3DTest;
    })(tests.containers || (tests.containers = {}));
    var containers = tests.containers;
})(tests || (tests = {}));
//# sourceMappingURL=View3DTest.js.map
