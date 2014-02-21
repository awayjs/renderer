///<reference path="../../../build/Away3D.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />
var tests;
(function (tests) {
    (function (materials) {
        var ColorMultiPassMatTest = (function () {
            function ColorMultiPassMatTest() {
                this.counter = 0;
                this.center = new away.geom.Vector3D();
                this.init();
            }
            ColorMultiPassMatTest.prototype.init = function () {
                var _this = this;
                away.Debug.THROW_ERRORS = false;
                away.Debug.LOG_PI_ERRORS = false;

                this.light = new away.lights.PointLight();
                this.view = new away.containers.View(new away.render.DefaultRenderer());
                this.view.camera.z = -1000;
                this.view.backgroundColor = 0x000000;
                this.torus = new away.primitives.TorusGeometry(50, 10, 32, 32, false);

                var l = 20;
                var radius = 500;

                var mat = new away.materials.ColorMultiPassMaterial(0xff0000);
                mat.lightPicker = new away.materials.StaticLightPicker([this.light]);

                for (var c = 0; c < l; c++) {
                    var t = Math.PI * 2 * c / l;
                    var m = new away.entities.Mesh(this.torus, mat);
                    m.x = Math.cos(t) * radius;
                    m.y = 0;
                    m.z = Math.sin(t) * radius;

                    this.view.scene.addChild(m);
                }

                this.view.scene.addChild(this.light);

                this.view.y = this.view.x = 0;
                this.view.width = window.innerWidth;
                this.view.height = window.innerHeight;

                console.log('renderer ', this.view.renderer);
                console.log('scene ', this.view.scene);
                console.log('view ', this.view);

                this.view.render();

                window.onresize = function () {
                    return _this.resize(null);
                };

                this.raf = new away.utils.RequestAnimationFrame(this.tick, this);
                this.raf.start();
            };

            ColorMultiPassMatTest.prototype.tick = function (e) {
                this.counter += 0.005;
                this.view.camera.lookAt(this.center);
                this.view.camera.x = Math.cos(this.counter) * 800;
                this.view.camera.z = Math.sin(this.counter) * 800;

                this.view.render();
            };

            ColorMultiPassMatTest.prototype.resize = function (e) {
                this.view.y = this.view.x = 0;
                this.view.width = window.innerWidth;
                this.view.height = window.innerHeight;
                this.view.render();
            };
            return ColorMultiPassMatTest;
        })();
        materials.ColorMultiPassMatTest = ColorMultiPassMatTest;
    })(tests.materials || (tests.materials = {}));
    var materials = tests.materials;
})(tests || (tests = {}));
//# sourceMappingURL=ColorMultiPassMatTest.js.map
