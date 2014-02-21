///<reference path="../../../build/Away3D.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />
var demos;
(function (demos) {
    (function (object3d) {
        var Event = away.events.Event;
        var URLLoader = away.net.URLLoader;
        var URLRequest = away.net.URLRequest;
        var RequestAnimationFrame = away.utils.RequestAnimationFrame;
        var Delegate = away.utils.Delegate;

        var PerspectiveProjection = away.projections.PerspectiveProjection;
        var View = away.containers.View;
        var Mesh = away.entities.Mesh;
        var PointLight = away.lights.PointLight;
        var StaticLightPicker = away.materials.StaticLightPicker;
        var TextureMaterial = away.materials.TextureMaterial;
        var TorusGeometry = away.primitives.TorusGeometry;
        var DefaultRenderer = away.render.DefaultRenderer;
        var ImageTexture = away.textures.ImageTexture;

        var TorusObject3DDemo = (function () {
            function TorusObject3DDemo() {
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
                this.pointLight = new PointLight();
                this.lightPicker = new StaticLightPicker([this.pointLight]);

                this.view.scene.addChild(this.pointLight);

                var perspectiveLens = this.view.camera.projection;
                perspectiveLens.fieldOfView = 75;

                this.view.camera.z = 0;
                this.view.backgroundColor = 0x000000;
                this.view.backgroundAlpha = 1;
                this.torus = new TorusGeometry(150, 50, 32, 32, false);

                var l = 10;

                for (var c = 0; c < l; c++) {
                    var t = Math.PI * 2 * c / l;

                    var m = new Mesh(this.torus);
                    m.x = Math.cos(t) * this.radius;
                    m.y = 0;
                    m.z = Math.sin(t) * this.radius;

                    this.view.scene.addChild(m);
                    this.meshes.push(m);
                }

                this.view.scene.addChild(this.light);

                this.raf = new RequestAnimationFrame(this.tick, this);
                this.raf.start();
                this.resize(null);

                document.onmousedown = function (e) {
                    return _this.followObject(e);
                };

                this.loadResources();
            }
            TorusObject3DDemo.prototype.loadResources = function () {
                var urlRequest = new URLRequest("assets/custom_uv_horizontal.png");
                var urlLoader = new URLLoader();
                urlLoader.dataFormat = away.net.URLLoaderDataFormat.BLOB;
                urlLoader.addEventListener(Event.COMPLETE, Delegate.create(this, this.imageCompleteHandler));
                urlLoader.load(urlRequest);
            };

            TorusObject3DDemo.prototype.imageCompleteHandler = function (e) {
                var _this = this;
                var urlLoader = e.target;

                this._image = away.parsers.ParserUtils.blobToImage(urlLoader.data);
                this._image.onload = function (event) {
                    return _this.onImageLoadComplete(event);
                };
            };

            TorusObject3DDemo.prototype.onImageLoadComplete = function (event) {
                var ts = new ImageTexture(this._image, false);

                var matTx = new TextureMaterial(ts, true, true, false);
                matTx.lightPicker = this.lightPicker;

                for (var c = 0; c < this.meshes.length; c++)
                    this.meshes[c].material = matTx;
            };

            TorusObject3DDemo.prototype.tick = function (e) {
                var _this = this;
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

                window.onresize = function () {
                    return _this.resize(null);
                };
                this.resize(null);
            };

            TorusObject3DDemo.prototype.resize = function (e) {
                this.view.y = 0;
                this.view.x = 0;

                this.view.width = window.innerWidth;
                this.view.height = window.innerHeight;
            };

            TorusObject3DDemo.prototype.followObject = function (e) {
                this.follow = !this.follow;
            };
            return TorusObject3DDemo;
        })();
        object3d.TorusObject3DDemo = TorusObject3DDemo;
    })(demos.object3d || (demos.object3d = {}));
    var object3d = demos.object3d;
})(demos || (demos = {}));
//# sourceMappingURL=TorusObject3DDemo.js.map
