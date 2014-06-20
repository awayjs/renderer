///<reference path="../../../build/stagegl-renderer.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />
var demos;
(function (demos) {
    (function (lights) {
        var View = away.containers.View;
        var DirectionalLight = away.entities.DirectionalLight;

        var Vector3D = away.geom.Vector3D;

        var StaticLightPicker = away.materials.StaticLightPicker;
        var TriangleMaterial = away.materials.TriangleMaterial;
        var URLLoader = away.net.URLLoader;
        var URLLoaderDataFormat = away.net.URLLoaderDataFormat;
        var URLRequest = away.net.URLRequest;
        var ParserUtils = away.parsers.ParserUtils;
        var PrimitiveTorusPrefab = away.prefabs.PrimitiveTorusPrefab;
        var PerspectiveProjection = away.projections.PerspectiveProjection;
        var DefaultRenderer = away.render.DefaultRenderer;
        var ImageTexture = away.textures.ImageTexture;
        var RequestAnimationFrame = away.utils.RequestAnimationFrame;

        var TorusLight = (function () {
            function TorusLight() {
                away.Debug.THROW_ERRORS = false;
                away.Debug.ENABLE_LOG = false;
                away.Debug.LOG_PI_ERRORS = false;

                this._view = new View(new DefaultRenderer());
                this._view.backgroundColor = 0x014C73;
                this._view.camera.projection = new PerspectiveProjection(60);
                this._torus = new PrimitiveTorusPrefab(120, 80, 32, 16, false);

                this.loadResources();
            }
            TorusLight.prototype.loadResources = function () {
                var _this = this;
                var urlRequest = new URLRequest("dots.png");

                var urlLoader = new URLLoader();
                urlLoader.dataFormat = URLLoaderDataFormat.BLOB;
                urlLoader.addEventListener(away.events.Event.COMPLETE, function (event) {
                    return _this.imageCompleteHandler(event);
                });
                urlLoader.load(urlRequest);
            };

            TorusLight.prototype.imageCompleteHandler = function (event) {
                var _this = this;
                var imageLoader = event.target;

                this._image = ParserUtils.blobToImage(imageLoader.data);
                this._image.onload = function (event) {
                    return _this.onLoadComplete(event);
                };
            };

            TorusLight.prototype.onLoadComplete = function (event) {
                var _this = this;
                this._view.camera.z = -1000;
                var ts = new ImageTexture(this._image, false);

                var light = new DirectionalLight();
                light.color = 0x00ff88;
                light.direction = new Vector3D(0, 0, 1);
                light.ambient = 0.6;
                light.diffuse = .7;
                light.specular = 60;

                this._view.scene.addChild(light);

                var lightPicker = new StaticLightPicker([light]);

                var matTx = new TriangleMaterial(ts, true, true, false);
                matTx.lightPicker = lightPicker;

                this._torus.material = matTx;

                this._mesh = this._torus.getNewObject();

                this._view.scene.addChild(this._mesh);

                this._raf = new RequestAnimationFrame(this.render, this);
                this._raf.start();

                window.onresize = function (event) {
                    return _this.resize(event);
                };

                this.resize();
            };

            TorusLight.prototype.render = function (dt) {
                if (typeof dt === "undefined") { dt = null; }
                this._mesh.rotationY += 1;
                this._view.render();
            };

            TorusLight.prototype.resize = function (event) {
                if (typeof event === "undefined") { event = null; }
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
