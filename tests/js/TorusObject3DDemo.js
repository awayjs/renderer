var demos;
(function (demos) {
    ///<reference path="../../../build/Away3D.next.d.ts" />
    (function (object3d) {
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
                this.light = new away.lights.PointLight();
                this.view = new away.containers.View3D();

                this.pointLight = new away.lights.PointLight();
                this.lightPicker = new away.materials.StaticLightPicker([this.pointLight]);

                this.view.scene.addChild(this.pointLight);

                var perspectiveLens = this.view.camera.lens;
                perspectiveLens.fieldOfView = 75;

                this.view.camera.z = 0;
                this.view.backgroundColor = 0x000000;
                this.view.backgroundAlpha = 1;
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

                document.onmousedown = function (e) {
                    return _this.followObject(e);
                };

                this.loadResources();
            }
            TorusObject3DDemo.prototype.loadResources = function () {
                var urlRequest = new away.net.URLRequest("assets/custom_uv_horizontal.png");
                var imgLoader = new away.net.IMGLoader();
                imgLoader.addEventListener(away.events.Event.COMPLETE, this.imageCompleteHandler, this);
                imgLoader.load(urlRequest);
            };

            TorusObject3DDemo.prototype.imageCompleteHandler = function (e) {
                var imageLoader = e.target;
                this._image = imageLoader.image;

                var ts = new away.textures.HTMLImageElementTexture(this._image, false);

                var matTx = new away.materials.TextureMaterial(ts, true, true, false);
                matTx.lightPicker = this.lightPicker;

                for (var c = 0; c < this.meshes.length; c++) {
                    this.meshes[c].material = matTx;
                }
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

                if (this.follow) {
                    this.view.camera.lookAt(this.meshes[0].position);
                }

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
