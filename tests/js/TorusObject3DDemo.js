///<reference path="../../../build/stagegl-renderer.next.d.ts" />
var demos;
(function (demos) {
    (function (object3d) {
        var View = away.containers.View;

        var PointLight = away.lights.PointLight;
        var URLLoader = away.net.URLLoader;
        var URLRequest = away.net.URLRequest;
        var StaticLightPicker = away.materials.StaticLightPicker;
        var TriangleMaterial = away.materials.TriangleMaterial;
        var PrimitiveTorusPrefab = away.prefabs.PrimitiveTorusPrefab;
        var DefaultRenderer = away.render.DefaultRenderer;
        var ImageTexture = away.textures.ImageTexture;
        var RequestAnimationFrame = away.utils.RequestAnimationFrame;

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
                this.view = new View(new DefaultRenderer(false, away.stagegl.ContextGLProfile.BASELINE, away.stagegl.ContextGLMode.FLASH));
                this.pointLight = new PointLight();
                this.lightPicker = new StaticLightPicker([this.pointLight]);

                this.view.scene.addChild(this.pointLight);

                var perspectiveLens = this.view.camera.projection;
                perspectiveLens.fieldOfView = 75;

                this.view.camera.z = 0;
                this.view.backgroundColor = 0x000000;
                this.view.backgroundAlpha = 1;
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
                this.onResize();

                document.onmousedown = function (event) {
                    return _this.followObject(event);
                };

                window.onresize = function (event) {
                    return _this.onResize(event);
                };

                this.loadResources();
            }
            TorusObject3DDemo.prototype.loadResources = function () {
                var _this = this;
                var urlRequest = new URLRequest("assets/custom_uv_horizontal.png");
                var urlLoader = new URLLoader();
                urlLoader.dataFormat = away.net.URLLoaderDataFormat.BLOB;
                urlLoader.addEventListener(away.events.Event.COMPLETE, function (event) {
                    return _this.imageCompleteHandler(event);
                });
                urlLoader.load(urlRequest);
            };

            TorusObject3DDemo.prototype.imageCompleteHandler = function (event) {
                var _this = this;
                var urlLoader = event.target;

                this._image = away.parsers.ParserUtils.blobToImage(urlLoader.data);
                this._image.onload = function (event) {
                    return _this.onImageLoadComplete(event);
                };
            };

            TorusObject3DDemo.prototype.onImageLoadComplete = function (event) {
                var matTx = new TriangleMaterial(new ImageTexture(this._image, false), true, true, false);
                matTx.lightPicker = this.lightPicker;

                for (var c = 0; c < this.meshes.length; c++)
                    this.meshes[c].material = matTx;
            };

            TorusObject3DDemo.prototype.tick = function (dt) {
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

            TorusObject3DDemo.prototype.onResize = function (event) {
                if (typeof event === "undefined") { event = null; }
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
