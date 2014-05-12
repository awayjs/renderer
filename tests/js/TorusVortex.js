///<reference path="../../../build/stagegl-renderer.next.d.ts" />
var demos;
(function (demos) {
    (function (object3d) {
        var BlendMode = away.base.BlendMode;

        var View = away.containers.View;

        var Vector3D = away.geom.Vector3D;
        var TextureMaterial = away.materials.TextureMaterial;
        var URLLoader = away.net.URLLoader;
        var URLLoaderDataFormat = away.net.URLLoaderDataFormat;
        var URLRequest = away.net.URLRequest;
        var ParserUtils = away.parsers.ParserUtils;
        var PrimitiveTorusPrefab = away.prefabs.PrimitiveTorusPrefab;
        var PrimitiveCubePrefab = away.prefabs.PrimitiveCubePrefab;
        var PerspectiveProjection = away.projections.PerspectiveProjection;
        var DefaultRenderer = away.render.DefaultRenderer;
        var ImageTexture = away.textures.ImageTexture;
        var RequestAnimationFrame = away.utils.RequestAnimationFrame;

        var TorusVortex = (function () {
            function TorusVortex() {
                away.Debug.THROW_ERRORS = false;

                this._view = new View(new DefaultRenderer(false, away.stagegl.ContextGLProfile.BASELINE, away.stagegl.ContextGLMode.FLASH));

                this._view.backgroundColor = 0x000000;
                this._view.camera.x = 130;
                this._view.camera.y = 0;
                this._view.camera.z = 0;
                this._cameraAxis = new Vector3D(0, 0, 1);

                this._view.camera.projection = new PerspectiveProjection(120);
                this._view.camera.projection.near = 0.1;

                this._cube = new PrimitiveCubePrefab(20.0, 20.0, 20.0);
                this._torus = new PrimitiveTorusPrefab(150, 80, 32, 16, true);

                this.loadResources();
            }
            TorusVortex.prototype.loadResources = function () {
                var _this = this;
                var urlRequest = new URLRequest("assets/130909wall_big.png");
                var urlLoader = new URLLoader();
                urlLoader.dataFormat = URLLoaderDataFormat.BLOB;
                urlLoader.addEventListener(away.events.Event.COMPLETE, function (event) {
                    return _this.imageCompleteHandler(event);
                });
                urlLoader.load(urlRequest);
            };

            TorusVortex.prototype.imageCompleteHandler = function (event) {
                var _this = this;
                var imageLoader = event.target;
                this._image = ParserUtils.blobToImage(imageLoader.data);
                this._image.onload = function (event) {
                    return _this.onLoadComplete(event);
                };
            };

            TorusVortex.prototype.onLoadComplete = function (event) {
                var _this = this;
                var matTx = new TextureMaterial(new ImageTexture(this._image, false), true, true, false);

                matTx.blendMode = BlendMode.ADD;
                matTx.bothSides = true;

                this._torus.material = matTx;
                this._cube.material = matTx;

                this._mesh = this._torus.getNewObject();
                this._mesh2 = this._cube.getNewObject();
                this._mesh2.x = 130;
                this._mesh2.z = 40;

                this._view.scene.addChild(this._mesh);
                this._view.scene.addChild(this._mesh2);

                this._raf = new RequestAnimationFrame(this.render, this);
                this._raf.start();

                window.onresize = function (event) {
                    return _this.onResize(event);
                };

                this.onResize();
            };

            TorusVortex.prototype.render = function (dt) {
                if (typeof dt === "undefined") { dt = null; }
                this._view.camera.rotate(this._cameraAxis, 1);
                this._mesh.rotationY += 1;
                this._mesh2.rotationX += 0.4;
                this._mesh2.rotationY += 0.4;
                this._view.render();
            };

            TorusVortex.prototype.onResize = function (event) {
                if (typeof event === "undefined") { event = null; }
                this._view.y = 0;
                this._view.x = 0;

                this._view.width = window.innerWidth;
                this._view.height = window.innerHeight;
            };
            return TorusVortex;
        })();
        object3d.TorusVortex = TorusVortex;
    })(demos.object3d || (demos.object3d = {}));
    var object3d = demos.object3d;
})(demos || (demos = {}));
//# sourceMappingURL=TorusVortex.js.map
