var demos;
(function (demos) {
    ///<reference path="../../../build/Away3D.next.d.ts" />
    (function (cubes) {
        var CubeDemoTest = (function () {
            function CubeDemoTest() {
                var _this = this;
                away.Debug.THROW_ERRORS = false;

                this._view = new away.containers.View3D();
                this._cube = new away.primitives.CubeGeometry(400.0, 400.0, 400.0);
                this._mesh = new away.entities.Mesh(this._cube);

                this._view.scene.addChild(this._mesh);

                this.raf = new away.utils.RequestAnimationFrame(this.render, this);
                this.raf.start();

                window.onresize = function () {
                    return _this.resize(null);
                };

                this.resize(null);
            }
            CubeDemoTest.prototype.render = function (dt) {
                if (typeof dt === "undefined") { dt = null; }
                this._mesh.rotationY -= 2;
                this._view.render();
            };

            CubeDemoTest.prototype.resize = function (e) {
                this._view.y = 0;
                this._view.x = 0;

                this._view.width = window.innerWidth;
                this._view.height = window.innerHeight;
            };
            return CubeDemoTest;
        })();
        cubes.CubeDemoTest = CubeDemoTest;
    })(demos.cubes || (demos.cubes = {}));
    var cubes = demos.cubes;
})(demos || (demos = {}));
//# sourceMappingURL=CubeDemoTest.js.map
