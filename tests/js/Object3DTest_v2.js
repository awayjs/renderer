var tests;
(function (tests) {
    ///<reference path="../../../build/Away3D.next.d.ts" />
    //<reference path="../../../src/Away3D.ts" />
    (function (base) {
        var Object3DTestV2 = (function () {
            function Object3DTestV2() {
                var _this = this;
                this.t = 0;
                this.tPos = 0;
                this.radius = 1000;
                this.follow = true;
                away.Debug.THROW_ERRORS = false;
                away.Debug.LOG_PI_ERRORS = false;

                this.meshes = new Array();
                this.light = new away.lights.PointLight();
                this.view = new away.containers.View3D();

                var perspectiveLens = this.view.camera.lens;
                perspectiveLens.fieldOfView = 75;

                this.view.camera.z = 0;
                this.view.backgroundColor = 0x000000;
                this.view.backgroundAlpha = 0;
                this.torus = new away.primitives.TorusGeometry(150, 50, 32, 32, false);

                var l = 10;

                for (var c = 0; c < l; c++) {
                    var t = Math.PI * 2 * c / l;

                    var m = new away.entities.Mesh(this.torus);
                    m.x = Math.cos(t) * this.radius;
                    m.y = 0;
                    m.z = Math.sin(t) * this.radius;

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
                document.onmousedown = function (e) {
                    return _this.followObject(e);
                };
            }
            Object3DTestV2.prototype.tick = function (e) {
                this.tPos += .02;

                for (var c = 0; c < this.meshes.length; c++) {
                    var objPos = Math.PI * 2 * c / this.meshes.length;

                    this.t += .005;
                    var s = 1.2 + Math.sin(this.t + objPos);

                    this.meshes[c].rotationY += 2 * (c / this.meshes.length);
                    this.meshes[c].rotationX += 2 * (c / this.meshes.length);
                    this.meshes[c].rotationZ += 2 * (c / this.meshes.length);
                    this.meshes[c].scaleX = this.meshes[c].scaleY = this.meshes[c].scaleZ = s;
                    this.meshes[c].x = Math.cos(objPos + this.tPos) * this.radius;
                    this.meshes[c].y = Math.sin(this.t) * 500;
                    this.meshes[c].z = Math.sin(objPos + this.tPos) * this.radius;
                }

                if (this.follow) {
                    this.view.camera.lookAt(this.meshes[0].position);
                }

                this.view.camera.y = Math.sin(this.tPos) * 1500;
                this.view.render();
            };

            Object3DTestV2.prototype.resize = function (e) {
                this.view.y = (window.innerHeight - this.view.height) / 2;
                this.view.x = (window.innerWidth - this.view.width) / 2;
                this.view.render();
            };

            Object3DTestV2.prototype.followObject = function (e) {
                this.follow = !this.follow;
            };
            return Object3DTestV2;
        })();
        base.Object3DTestV2 = Object3DTestV2;
    })(tests.base || (tests.base = {}));
    var base = tests.base;
})(tests || (tests = {}));
//# sourceMappingURL=Object3DTest_v2.js.map
