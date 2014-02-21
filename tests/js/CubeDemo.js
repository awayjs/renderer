///<reference path="../../../build/Away3D.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />
var demos;
(function (demos) {
    (function (cubes) {
        var CubeDemo = (function () {
            function CubeDemo() {
                away.Debug.THROW_ERRORS = false;

                this._view = new away.containers.View(new away.render.DefaultRenderer());

                this._view.backgroundColor = 0x000000;
                this._view.camera.x = 130;
                this._view.camera.y = 0;
                this._view.camera.z = 0;
                this._cameraAxis = new away.geom.Vector3D(0, 0, 1);

                this._view.camera.projection = new away.projections.PerspectiveProjection(120);

                this._cube = new away.primitives.CubeGeometry(20.0, 20.0, 20.0);
                this._torus = new away.primitives.TorusGeometry(150, 80, 32, 16, true);

                this.loadResources();
            }
            CubeDemo.prototype.loadResources = function () {
                var urlRequest = new away.net.URLRequest("assets/130909wall_big.png");
                var urlLoader = new away.net.URLLoader();
                urlLoader.dataFormat = away.net.URLLoaderDataFormat.BLOB;
                urlLoader.addEventListener(away.events.Event.COMPLETE, away.utils.Delegate.create(this, this.imageCompleteHandler));
                urlLoader.load(urlRequest);
            };

            CubeDemo.prototype.imageCompleteHandler = function (e) {
                var _this = this;
                var imageLoader = e.target;
                this._image = away.parsers.ParserUtils.blobToImage(imageLoader.data);
                this._image.onload = function (event) {
                    return _this.onLoadComplete(event);
                };
            };

            CubeDemo.prototype.onLoadComplete = function (event) {
                var _this = this;
                var ts = new away.textures.ImageTexture(this._image, false);

                var matTx = new away.materials.TextureMaterial(ts, true, true, false);

                matTx.blendMode = away.base.BlendMode.ADD;
                matTx.bothSides = true;

                this._mesh = new away.entities.Mesh(this._torus, matTx);
                this._mesh2 = new away.entities.Mesh(this._cube, matTx);
                this._mesh2.x = 130;
                this._mesh2.z = 40;

                this._view.scene.addChild(this._mesh);
                this._view.scene.addChild(this._mesh2);

                this._raf = new away.utils.RequestAnimationFrame(this.render, this);
                this._raf.start();

                window.onresize = function () {
                    return _this.resize(null);
                };

                this.resize(null);
            };

            CubeDemo.prototype.render = function (dt) {
                if (typeof dt === "undefined") { dt = null; }
                this._view.camera.rotate(this._cameraAxis, 1);
                this._mesh.rotationY += 1;
                this._mesh2.rotationX += 0.4;
                this._mesh2.rotationY += 0.4;
                this._view.render();
            };

            CubeDemo.prototype.resize = function (e) {
                this._view.y = 0;
                this._view.x = 0;

                this._view.width = window.innerWidth;
                this._view.height = window.innerHeight;
            };
            return CubeDemo;
        })();
        cubes.CubeDemo = CubeDemo;
    })(demos.cubes || (demos.cubes = {}));
    var cubes = demos.cubes;
})(demos || (demos = {}));
//# sourceMappingURL=CubeDemo.js.map
