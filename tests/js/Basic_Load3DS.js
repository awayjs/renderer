///<reference path="../../../build/Away3D.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />
/*
3ds file loading example in Away3d
Demonstrates:
How to use the Loader3D object to load an embedded internal 3ds model.
How to map an external asset reference inside a file to an internal embedded asset.
How to extract material data and use it to set custom material properties on a model.
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
    var Basic_Load3DS = (function () {
        /**
        * Constructor
        */
        function Basic_Load3DS() {
            this._time = 0;
            this._move = false;
            this.init();
        }
        /**
        * Global initialise function
        */
        Basic_Load3DS.prototype.init = function () {
            this.initEngine();
            this.initLights();
            this.initMaterials();
            this.initObjects();
            this.initListeners();
        };

        /**
        * Initialise the engine
        */
        Basic_Load3DS.prototype.initEngine = function () {
            this._view = new away.containers.View(new away.render.DefaultRenderer());

            //setup the camera for optimal shadow rendering
            this._view.camera.projection.far = 2100;

            //setup controller to be used on the camera
            this._cameraController = new away.controllers.HoverController(this._view.camera, null, 45, 20, 1000, 10);
        };

        /**
        * Initialise the lights
        */
        Basic_Load3DS.prototype.initLights = function () {
            this._light = new away.lights.DirectionalLight(-1, -1, 1);
            this._direction = new away.geom.Vector3D(-1, -1, 1);
            this._lightPicker = new away.materials.StaticLightPicker([this._light]);
            this._view.scene.addChild(this._light);
        };

        /**
        * Initialise the materials
        */
        Basic_Load3DS.prototype.initMaterials = function () {
            this._groundMaterial = new away.materials.TextureMaterial();
            this._groundMaterial.shadowMethod = new away.materials.SoftShadowMapMethod(this._light, 10, 5);
            this._groundMaterial.shadowMethod.epsilon = 0.2;
            this._groundMaterial.lightPicker = this._lightPicker;
            this._groundMaterial.specular = 0;
            this._ground = new away.entities.Mesh(new away.primitives.PlaneGeometry(1000, 1000), this._groundMaterial);
            this._ground.castsShadows = false;
            this._view.scene.addChild(this._ground);
        };

        /**
        * Initialise the scene objects
        */
        Basic_Load3DS.prototype.initObjects = function () {
            this._loader = new away.containers.Loader3D();
            this._loader.transform.scale = new away.geom.Vector3D(300, 300, 300);
            this._loader.z = -200;
            this._view.scene.addChild(this._loader);
        };

        /**
        * Initialise the listeners
        */
        Basic_Load3DS.prototype.initListeners = function () {
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

            this.onResize();

            this._timer = new away.utils.RequestAnimationFrame(this.onEnterFrame, this);
            this._timer.start();

            //setup the url map for textures in the 3ds file
            var assetLoaderContext = new away.net.AssetLoaderContext();
            assetLoaderContext.mapUrl("texture.jpg", "assets/demos/soldier_ant.jpg");

            this._loader.addEventListener(away.events.AssetEvent.ASSET_COMPLETE, away.utils.Delegate.create(this, this.onAssetComplete));
            this._loader.load(new away.net.URLRequest("assets/demos/soldier_ant.3ds"), assetLoaderContext, null, new away.parsers.Max3DSParser(false));

            away.library.AssetLibrary.addEventListener(away.events.LoaderEvent.RESOURCE_COMPLETE, away.utils.Delegate.create(this, this.onResourceComplete));
            away.library.AssetLibrary.load(new away.net.URLRequest("assets/demos/CoarseRedSand.jpg"));
        };

        /**
        * Navigation and render loop
        */
        Basic_Load3DS.prototype.onEnterFrame = function (dt) {
            this._time += dt;

            this._direction.x = -Math.sin(this._time / 4000);
            this._direction.z = -Math.cos(this._time / 4000);
            this._light.direction = this._direction;

            this._view.render();
        };

        /**
        * Listener function for asset complete event on loader
        */
        Basic_Load3DS.prototype.onAssetComplete = function (event) {
            var asset = event.asset;

            switch (asset.assetType) {
                case away.library.AssetType.MESH:
                    var mesh = event.asset;
                    mesh.castsShadows = true;
                    break;
                case away.library.AssetType.MATERIAL:
                    var material = event.asset;
                    material.shadowMethod = new away.materials.SoftShadowMapMethod(this._light, 10, 5);
                    material.shadowMethod.epsilon = 0.2;
                    material.lightPicker = this._lightPicker;
                    material.gloss = 30;
                    material.specular = 1;
                    material.ambientColor = 0x303040;
                    material.ambient = 1;

                    this.initInterface();

                    break;
            }
        };

        /**
        * Listener function for resource complete event on asset library
        */
        Basic_Load3DS.prototype.onResourceComplete = function (event) {
            var assets = event.assets;
            var length = assets.length;

            for (var c = 0; c < length; c++) {
                var asset = assets[c];

                console.log(asset.name, event.url);

                switch (event.url) {
                    case "assets/demos/CoarseRedSand.jpg":
                        this._groundMaterial.texture = away.library.AssetLibrary.getAsset(asset.name);
                        break;
                }
            }
        };

        /**
        * Mouse down listener for navigation
        */
        Basic_Load3DS.prototype.onMouseDown = function (event) {
            this._lastPanAngle = this._cameraController.panAngle;
            this._lastTiltAngle = this._cameraController.tiltAngle;
            this._lastMouseX = event.clientX;
            this._lastMouseY = event.clientY;
            this._move = true;
        };

        /**
        * Mouse up listener for navigation
        */
        Basic_Load3DS.prototype.onMouseUp = function (event) {
            this._move = false;
        };

        Basic_Load3DS.prototype.onMouseMove = function (event) {
            if (this._move) {
                this._cameraController.panAngle = 0.3 * (event.clientX - this._lastMouseX) + this._lastPanAngle;
                this._cameraController.tiltAngle = 0.3 * (event.clientY - this._lastMouseY) + this._lastTiltAngle;
            }
        };

        /**
        * stage listener for resize events
        */
        Basic_Load3DS.prototype.onResize = function (event) {
            if (typeof event === "undefined") { event = null; }
            this._view.y = 0;
            this._view.x = 0;
            this._view.width = window.innerWidth;
            this._view.height = window.innerHeight;
        };

        /**
        * Test interface to swap ShadowMapMethod
        */
        Basic_Load3DS.prototype.initInterface = function () {
            var _this = this;
            var testDiv = document.createElement('div');
            testDiv.style.cssFloat = 'none';
            testDiv.style.position = 'absolute';
            testDiv.style.top = '15px';
            testDiv.style.width = '600px';
            testDiv.style.left = '50%';
            testDiv.style.marginLeft = '-300px';
            testDiv.style.textAlign = 'center';

            this.dropDown = document.createElement('select');
            this.dropDown.name = "selectTestDropDown";
            this.dropDown.id = "selectTest";

            testDiv.appendChild(this.dropDown);

            var option = new Option('FilteredShadowMapMethod', 'FilteredShadowMapMethod');
            this.dropDown.add(option);

            option = new Option('SoftShadowMapMethod', 'SoftShadowMapMethod');
            this.dropDown.add(option);

            option = new Option('DitheredShadowMapMethod', 'DitheredShadowMapMethod');
            this.dropDown.add(option);

            document.body.appendChild(testDiv);

            this.dropDown.onchange = function (e) {
                return _this.dropDownChange(e);
            };
        };

        Basic_Load3DS.prototype.dropDownChange = function (e) {
            switch (this.dropDown.options[this.dropDown.selectedIndex].value) {
                case 'FilteredShadowMapMethod':
                    this._groundMaterial.shadowMethod = new away.materials.FilteredShadowMapMethod(this._light);
                    break;

                case 'SoftShadowMapMethod':
                    this._groundMaterial.shadowMethod = new away.materials.SoftShadowMapMethod(this._light, 10, 5);
                    break;

                case 'DitheredShadowMapMethod':
                    this._groundMaterial.shadowMethod = new away.materials.DitheredShadowMapMethod(this._light, 10, 5);
                    break;
            }
            //var dataIndex : number = parseInt( this.dropDown.options[this.dropDown.selectedIndex].value ) ;
        };
        return Basic_Load3DS;
    })();
    examples.Basic_Load3DS = Basic_Load3DS;
})(examples || (examples = {}));
//# sourceMappingURL=Basic_Load3DS.js.map
