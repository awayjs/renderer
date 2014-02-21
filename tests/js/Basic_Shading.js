///<reference path="../../../build/Away3D.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />
/*
Shading example in Away3d
Demonstrates:
How to create multiple lightsources in a scene.
How to apply specular maps, normals maps and diffuse texture maps to a material.
Code by Rob Bateman
rob@infiniteturtles.co.uk
http://www.infiniteturtles.co.uk
This code is distributed under the MIT License
Copyright (c) The Away Foundation http://www.theawayfoundation.org
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the “Software”), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
var examples;
(function (examples) {
    var Basic_Shading = (function () {
        /**
        * Constructor
        */
        function Basic_Shading() {
            this._time = 0;
            this._move = false;
            this.init();
        }
        /**
        * Global initialise function
        */
        Basic_Shading.prototype.init = function () {
            this.initEngine();
            this.initLights();
            this.initMaterials();
            this.initObjects();
            this.initListeners();
        };

        /**
        * Initialise the engine
        */
        Basic_Shading.prototype.initEngine = function () {
            this._scene = new away.containers.Scene();

            this._camera = new away.entities.Camera();

            this._view = new away.containers.View(new away.render.DefaultRenderer());

            //this._view.antiAlias = 4;
            this._view.scene = this._scene;
            this._view.camera = this._camera;

            //setup controller to be used on the camera
            this._cameraController = new away.controllers.HoverController(this._camera);
            this._cameraController.distance = 1000;
            this._cameraController.minTiltAngle = 0;
            this._cameraController.maxTiltAngle = 90;
            this._cameraController.panAngle = 45;
            this._cameraController.tiltAngle = 20;
        };

        /**
        * Initialise the lights
        */
        Basic_Shading.prototype.initLights = function () {
            this._light1 = new away.lights.DirectionalLight();
            this._light1.direction = new away.geom.Vector3D(0, -1, 0);
            this._light1.ambient = 0.1;
            this._light1.diffuse = 0.7;

            this._scene.addChild(this._light1);

            this._light2 = new away.lights.DirectionalLight();
            this._light2.direction = new away.geom.Vector3D(0, -1, 0);
            this._light2.color = 0x00FFFF;
            this._light2.ambient = 0.1;
            this._light2.diffuse = 0.7;

            this._scene.addChild(this._light2);

            this._lightPicker = new away.materials.StaticLightPicker([this._light1, this._light2]);
        };

        /**
        * Initialise the materials
        */
        Basic_Shading.prototype.initMaterials = function () {
            this._planeMaterial = new away.materials.TextureMaterial(away.materials.DefaultMaterialManager.getDefaultTexture());
            this._planeMaterial.lightPicker = this._lightPicker;
            this._planeMaterial.repeat = true;
            this._planeMaterial.mipmap = false;

            this._sphereMaterial = new away.materials.TextureMaterial(away.materials.DefaultMaterialManager.getDefaultTexture());
            this._sphereMaterial.lightPicker = this._lightPicker;

            this._cubeMaterial = new away.materials.TextureMaterial(away.materials.DefaultMaterialManager.getDefaultTexture());
            this._cubeMaterial.lightPicker = this._lightPicker;
            this._cubeMaterial.mipmap = false;

            this._torusMaterial = new away.materials.TextureMaterial(away.materials.DefaultMaterialManager.getDefaultTexture());
            this._torusMaterial.lightPicker = this._lightPicker;
            this._torusMaterial.repeat = true;
        };

        /**
        * Initialise the scene objects
        */
        Basic_Shading.prototype.initObjects = function () {
            this._plane = new away.entities.Mesh(new away.primitives.PlaneGeometry(1000, 1000), this._planeMaterial);
            this._plane.geometry.scaleUV(2, 2);
            this._plane.y = -20;

            this._scene.addChild(this._plane);

            this._sphere = new away.entities.Mesh(new away.primitives.SphereGeometry(150, 40, 20), this._sphereMaterial);
            this._sphere.x = 300;
            this._sphere.y = 160;
            this._sphere.z = 300;

            this._scene.addChild(this._sphere);

            this._cube = new away.entities.Mesh(new away.primitives.CubeGeometry(200, 200, 200, 1, 1, 1, false), this._cubeMaterial);
            this._cube.x = 300;
            this._cube.y = 160;
            this._cube.z = -250;

            this._scene.addChild(this._cube);

            this._torus = new away.entities.Mesh(new away.primitives.TorusGeometry(150, 60, 40, 20), this._torusMaterial);
            this._torus.geometry.scaleUV(10, 5);
            this._torus.x = -250;
            this._torus.y = 160;
            this._torus.z = -250;

            this._scene.addChild(this._torus);
        };

        /**
        * Initialise the listeners
        */
        Basic_Shading.prototype.initListeners = function () {
            var _this = this;
            window.onresize = function (event) {
                return _this.onResize(event);
            };

            document.onmousedown = function (event) {
                return _this.onMouseDown(event);
            };
            document.onmouseup = function (event) {
                return _this.onMouseUp(event);
            };
            document.onmousemove = function (event) {
                return _this.onMouseMove(event);
            };
            document.onmousewheel = function (event) {
                return _this.onMouseWheel(event);
            };

            this.onResize();

            this._timer = new away.utils.RequestAnimationFrame(this.onEnterFrame, this);
            this._timer.start();

            away.library.AssetLibrary.addEventListener(away.events.LoaderEvent.RESOURCE_COMPLETE, away.utils.Delegate.create(this, this.onResourceComplete));

            //plane textures
            away.library.AssetLibrary.load(new away.net.URLRequest("assets/demos/floor_diffuse.jpg"));
            away.library.AssetLibrary.load(new away.net.URLRequest("assets/demos/floor_normal.jpg"));
            away.library.AssetLibrary.load(new away.net.URLRequest("assets/demos/floor_specular.jpg"));

            //sphere textures
            away.library.AssetLibrary.load(new away.net.URLRequest("assets/demos/beachball_diffuse.jpg"));
            away.library.AssetLibrary.load(new away.net.URLRequest("assets/demos/beachball_specular.jpg"));

            //cube textures
            away.library.AssetLibrary.load(new away.net.URLRequest("assets/demos/trinket_diffuse.jpg"));
            away.library.AssetLibrary.load(new away.net.URLRequest("assets/demos/trinket_normal.jpg"));
            away.library.AssetLibrary.load(new away.net.URLRequest("assets/demos/trinket_specular.jpg"));

            //torus textures
            away.library.AssetLibrary.load(new away.net.URLRequest("assets/demos/weave_diffuse.jpg"));
            away.library.AssetLibrary.load(new away.net.URLRequest("assets/demos/weave_normal.jpg"));
        };

        /**
        * Navigation and render loop
        */
        Basic_Shading.prototype.onEnterFrame = function (dt) {
            this._time += dt;

            this._light1.direction = new away.geom.Vector3D(Math.sin(this._time / 10000) * 150000, -1000, Math.cos(this._time / 10000) * 150000);

            this._view.render();
        };

        /**
        * Listener function for resource complete event on asset library
        */
        Basic_Shading.prototype.onResourceComplete = function (event) {
            var assets = event.assets;
            var length = assets.length;

            for (var c = 0; c < length; c++) {
                var asset = assets[c];

                console.log(asset.name, event.url);

                switch (event.url) {
                    case "assets/demos/floor_diffuse.jpg":
                        this._planeMaterial.texture = away.library.AssetLibrary.getAsset(asset.name);
                        break;
                    case "assets/demos/floor_normal.jpg":
                        this._planeMaterial.normalMap = away.library.AssetLibrary.getAsset(asset.name);
                        break;
                    case "assets/demos/floor_specular.jpg":
                        this._planeMaterial.specularMap = away.library.AssetLibrary.getAsset(asset.name);
                        break;

                    case "assets/demos/beachball_diffuse.jpg":
                        this._sphereMaterial.texture = away.library.AssetLibrary.getAsset(asset.name);
                        break;
                    case "assets/demos/beachball_specular.jpg":
                        this._sphereMaterial.specularMap = away.library.AssetLibrary.getAsset(asset.name);
                        break;

                    case "assets/demos/trinket_diffuse.jpg":
                        this._cubeMaterial.texture = away.library.AssetLibrary.getAsset(asset.name);
                        break;
                    case "assets/demos/trinket_normal.jpg":
                        this._cubeMaterial.normalMap = away.library.AssetLibrary.getAsset(asset.name);
                        break;
                    case "assets/demos/trinket_specular.jpg":
                        this._cubeMaterial.specularMap = away.library.AssetLibrary.getAsset(asset.name);
                        break;

                    case "assets/demos/weave_diffuse.jpg":
                        this._torusMaterial.texture = away.library.AssetLibrary.getAsset(asset.name);
                        break;
                    case "assets/demos/weave_normal.jpg":
                        this._torusMaterial.normalMap = this._torusMaterial.specularMap = away.library.AssetLibrary.getAsset(asset.name);
                        break;
                }
            }
        };

        /**
        * Mouse down listener for navigation
        */
        Basic_Shading.prototype.onMouseDown = function (event) {
            this._lastPanAngle = this._cameraController.panAngle;
            this._lastTiltAngle = this._cameraController.tiltAngle;
            this._lastMouseX = event.clientX;
            this._lastMouseY = event.clientY;
            this._move = true;
        };

        /**
        * Mouse up listener for navigation
        */
        Basic_Shading.prototype.onMouseUp = function (event) {
            this._move = false;
        };

        /**
        * Mouse move listener for navigation
        */
        Basic_Shading.prototype.onMouseMove = function (event) {
            if (this._move) {
                this._cameraController.panAngle = 0.3 * (event.clientX - this._lastMouseX) + this._lastPanAngle;
                this._cameraController.tiltAngle = 0.3 * (event.clientY - this._lastMouseY) + this._lastTiltAngle;
            }
        };

        /**
        * Mouse wheel listener for navigation
        */
        Basic_Shading.prototype.onMouseWheel = function (event) {
            if (event.wheelDelta > 0) {
                this._cameraController.distance += 20;
            } else {
                this._cameraController.distance -= 20;
            }
        };

        /**
        * window listener for resize events
        */
        Basic_Shading.prototype.onResize = function (event) {
            if (typeof event === "undefined") { event = null; }
            this._view.y = 0;
            this._view.x = 0;
            this._view.width = window.innerWidth;
            this._view.height = window.innerHeight;
        };
        return Basic_Shading;
    })();
    examples.Basic_Shading = Basic_Shading;
})(examples || (examples = {}));
//# sourceMappingURL=Basic_Shading.js.map
