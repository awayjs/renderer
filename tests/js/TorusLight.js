var demos;
(function (demos) {
    ///<reference path="../../../build/Away3D.next.d.ts" />
    (function (lights) {
        var TorusLight = (function () {
            function TorusLight() {
                away.Debug.THROW_ERRORS = false;
                away.Debug.ENABLE_LOG = false;
                away.Debug.LOG_PI_ERRORS = false;

                this._view = new away.containers.View3D();
                this._view.backgroundColor = 0x014C73;
                this._view.camera.lens = new away.cameras.PerspectiveLens(60);
                this._torus = new away.primitives.TorusGeometry(120, 80, 32, 16, false);

                this.loadResources();
            }
            TorusLight.prototype.loadResources = function () {
                var urlRequest = new away.net.URLRequest("dots.png");

                var imgLoader = new away.net.IMGLoader();

                imgLoader.addEventListener(away.events.Event.COMPLETE, this.imageCompleteHandler, this);
                imgLoader.load(urlRequest);
            };

            TorusLight.prototype.imageCompleteHandler = function (e) {
                var _this = this;
                var imageLoader = e.target;
                this._image = imageLoader.image;

                this._view.camera.z = -1000;
                var ts = new away.textures.HTMLImageElementTexture(this._image, false);

                var light = new away.lights.DirectionalLight();
                light.color = 0x00ff88;
                light.direction = new away.geom.Vector3D(0, 0, 1);
                light.ambient = 0.6;
                light.diffuse = .7;
                light.specular = 60;

                this._view.scene.addChild(light);

                var lightPicker = new away.materials.StaticLightPicker([light]);

                var matTx = new away.materials.TextureMaterial(ts, true, true, false);
                matTx.lightPicker = lightPicker;

                this._mesh = new away.entities.Mesh(this._torus, matTx);

                this._view.scene.addChild(this._mesh);

                this._raf = new away.utils.RequestAnimationFrame(this.render, this);
                this._raf.start();

                window.onresize = function () {
                    return _this.resize();
                };

                this.resize();

                this.render(0);
            };

            TorusLight.prototype.render = function (dt) {
                if (typeof dt === "undefined") { dt = null; }
                this._mesh.rotationY += 1;
                this._view.render();
            };

            TorusLight.prototype.resize = function () {
                this._view.y = 0;
                this._view.x = 0;

                this._view.width = window.innerWidth;
                this._view.height = window.innerHeight;
            };
            return TorusLight;
        })();
        lights.TorusLight = TorusLight;
    })(demos.lights || (demos.lights = {}));
    var lights = demos.lights;
})(demos || (demos = {}));
//# sourceMappingURL=TorusLight.js.map
