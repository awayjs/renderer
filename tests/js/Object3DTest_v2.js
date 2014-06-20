///<reference path="../../../build/stagegl-renderer.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />
var tests;
(function (tests) {
    (function (base) {
        var View = away.containers.View;

        var PointLight = away.entities.PointLight;
        var PrimitiveTorusPrefab = away.prefabs.PrimitiveTorusPrefab;

        var DefaultRenderer = away.render.DefaultRenderer;
        var RequestAnimationFrame = away.utils.RequestAnimationFrame;

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
                this.light = new PointLight();
                this.view = new View(new DefaultRenderer());

                var perspectiveProjection = this.view.camera.projection;
                perspectiveProjection.fieldOfView = 75;

                this.view.camera.z = 0;
                this.view.backgroundColor = 0x000000;
                this.view.backgroundAlpha = 0;
                this.torus = new PrimitiveTorusPrefab(150, 50, 32, 32, false);

                var l = 10;

                for (var c = 0; c < l; c++) {
                    var t = Math.PI * 2 * c / l;

                    var mesh = this.torus.getNewObject();
                    mesh.x = Math.cos(t) * this.radius;
                    mesh.y = 0;
                    mesh.z = Math.sin(t) * this.radius;

                    this.view.scene.addChild(mesh);
                    this.meshes.push(mesh);
                }

                this.view.scene.addChild(this.light);

                this.raf = new RequestAnimationFrame(this.tick, this);
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

                //this.view.camera.y = Math.sin( this.tPos ) * 1500;
                if (this.follow)
                    this.view.camera.lookAt(this.meshes[0].transform.position);

                this.view.camera.y = Math.sin(this.tPos) * 1500;
                this.view.render();
            };

            Object3DTestV2.prototype.resize = function (e) {
                this.view.y = 0;
                this.view.x = 0;

                this.view.width = window.innerWidth;
                this.view.height = window.innerHeight;
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
