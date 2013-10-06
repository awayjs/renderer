var tests;
(function (tests) {
    ///<reference path="../../../build/Away3D.next.d.ts" />
    //<reference path="../../../src/Away3D.ts" />
    (function (containers) {
        var View3DTest = (function () {
            function View3DTest() {
                var _this = this;
                away.Debug.THROW_ERRORS = false;
                away.Debug.LOG_PI_ERRORS = false;

                this.meshes = new Array();
                this.light = new away.lights.PointLight();
                this.view = new away.containers.View3D();
                this.view.camera.z = 0;
                this.view.backgroundColor = 0x776655;
                this.torus = new away.primitives.TorusGeometry(150, 50, 32, 32, false);

                var l = 10;
                var radius = 1000;
                var matB = new away.materials.ColorMaterial();

                for (var c = 0; c < l; c++) {
                    var t = Math.PI * 2 * c / l;

                    var m = new away.entities.Mesh(this.torus, matB);
                    m.x = Math.cos(t) * radius;
                    m.y = 0;
                    m.z = Math.sin(t) * radius;

                    this.view.scene.addChild(m);
                    this.meshes.push(m);
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
                for (var c = 0; c < this.meshes.length; c++) {
                    this.meshes[c].rotationY += 2;
                }

                this.view.camera.rotationY += .5;
                this.view.render();
            };

            View3DTest.prototype.resize = function (e) {
                this.view.y = (window.innerHeight - this.view.height) / 2;
                this.view.x = (window.innerWidth - this.view.width) / 2;
            };
            return View3DTest;
        })();
        containers.View3DTest = View3DTest;
    })(tests.containers || (tests.containers = {}));
    var containers = tests.containers;
})(tests || (tests = {}));
//# sourceMappingURL=View3DTest.js.map
