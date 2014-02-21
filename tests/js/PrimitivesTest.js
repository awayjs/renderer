///<reference path="../../../build/Away3D.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />
var tests;
(function (tests) {
    (function (primitives) {
        var PrimitivesTest = (function () {
            function PrimitivesTest() {
                var _this = this;
                this.meshes = new Array();
                //private t                   : number = 0;
                this.radius = 400;
                away.Debug.LOG_PI_ERRORS = false;
                away.Debug.THROW_ERRORS = false;

                this.view = new away.containers.View(new away.render.DefaultRenderer());
                this.raf = new away.utils.RequestAnimationFrame(this.render, this);

                this.light = new away.lights.DirectionalLight();
                this.light.color = 0xFFFFFF;
                this.light.direction = new away.geom.Vector3D(1, 1, 0);
                this.light.ambient = 0; //0.05;//.4;
                this.light.ambientColor = 0xFFFFFF;
                this.light.diffuse = 1;
                this.light.specular = 1;

                this.lightB = new away.lights.DirectionalLight();
                this.lightB.color = 0xFF0000;
                this.lightB.direction = new away.geom.Vector3D(-1, 0, 1);
                this.lightB.ambient = 0; //0.05;//.4;
                this.lightB.ambientColor = 0xFFFFFF;
                this.lightB.diffuse = 1;
                this.lightB.specular = 1;

                this.staticLightPicker = new away.materials.StaticLightPicker([this.light, this.lightB]);

                this.view.scene.addChild(this.light);
                this.view.scene.addChild(this.lightB);

                this.view.backgroundColor = 0x222222;

                window.onresize = function () {
                    return _this.resize();
                };

                this.initMeshes();
                this.raf.start();
                this.resize();
            }
            PrimitivesTest.prototype.initMeshes = function () {
                var primitives = new Array();
                primitives.push(new away.primitives.TorusGeometry());
                primitives.push(new away.primitives.SphereGeometry());
                primitives.push(new away.primitives.CapsuleGeometry());
                primitives.push(new away.primitives.CylinderGeometry());
                primitives.push(new away.primitives.PlaneGeometry());
                primitives.push(new away.primitives.ConeGeometry());
                primitives.push(new away.primitives.CubeGeometry());

                var mesh;

                for (var c = 0; c < primitives.length; c++) {
                    var t = Math.PI * 2 * c / primitives.length;

                    mesh = new away.entities.Mesh(primitives[c]);
                    mesh.x = Math.cos(t) * this.radius;
                    mesh.y = Math.sin(t) * this.radius;
                    mesh.z = 0;
                    mesh.transform.scale = new away.geom.Vector3D(2, 2, 2);
                    mesh.material.lightPicker = this.staticLightPicker;

                    this.view.scene.addChild(mesh);
                    this.meshes.push(mesh);
                }
            };

            PrimitivesTest.prototype.render = function () {
                if (this.meshes) {
                    for (var c = 0; c < this.meshes.length; c++) {
                        this.meshes[c].rotationY += 1;
                    }
                }

                this.view.render();
            };

            PrimitivesTest.prototype.resize = function () {
                this.view.y = 0;
                this.view.x = 0;

                this.view.width = window.innerWidth;
                this.view.height = window.innerHeight;
            };
            return PrimitivesTest;
        })();
        primitives.PrimitivesTest = PrimitivesTest;
    })(tests.primitives || (tests.primitives = {}));
    var primitives = tests.primitives;
})(tests || (tests = {}));
//# sourceMappingURL=PrimitivesTest.js.map
