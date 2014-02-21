///<reference path="../../../build/Away3D.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />
/*
Globe example in Away3d
Demonstrates:
How to create a textured sphere.
How to use containers to rotate an object.
How to use the PhongBitmapMaterial.
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
    var Camera = away.entities.Camera;
    var DisplayObjectContainer = away.containers.DisplayObjectContainer;
    var Scene = away.containers.Scene;
    var View = away.containers.View;
    var HoverController = away.controllers.HoverController;
    var BitmapData = away.base.BitmapData;
    var BitmapDataChannel = away.base.BitmapDataChannel;
    var BlendMode = away.base.BlendMode;
    var OrientationMode = away.base.OrientationMode;
    var AlignmentMode = away.base.AlignmentMode;
    var Mesh = away.entities.Mesh;
    var Billboard = away.entities.Billboard;
    var Skybox = away.entities.Skybox;
    var LoaderEvent = away.events.LoaderEvent;
    var ColorTransform = away.geom.ColorTransform;
    var Vector3D = away.geom.Vector3D;
    var Point = away.geom.Point;
    var PointLight = away.lights.PointLight;
    var CompositeDiffuseMethod = away.materials.CompositeDiffuseMethod;
    var CompositeSpecularMethod = away.materials.CompositeSpecularMethod;
    var ColorMaterial = away.materials.ColorMaterial;
    var BasicDiffuseMethod = away.materials.BasicDiffuseMethod;
    var BasicSpecularMethod = away.materials.BasicSpecularMethod;
    var MethodVO = away.materials.MethodVO;
    var FresnelSpecularMethod = away.materials.FresnelSpecularMethod;
    var PhongSpecularMethod = away.materials.PhongSpecularMethod;
    var ShaderRegisterElement = away.materials.ShaderRegisterElement;
    var ShaderRegisterCache = away.materials.ShaderRegisterCache;
    var ShaderRegisterData = away.materials.ShaderRegisterData;
    var StaticLightPicker = away.materials.StaticLightPicker;
    var TextureMaterial = away.materials.TextureMaterial;
    var SphereGeometry = away.primitives.SphereGeometry;
    var DefaultRenderer = away.render.DefaultRenderer;
    var ImageCubeTexture = away.textures.ImageCubeTexture;
    var ImageTexture = away.textures.ImageTexture;
    var BitmapTexture = away.textures.BitmapTexture;
    var Cast = away.utils.Cast;
    var RequestAnimationFrame = away.utils.RequestAnimationFrame;

    var Intermediate_Globe = (function () {
        /**
        * Constructor
        */
        function Intermediate_Globe() {
            this.flares = new Array(12);
            this._time = 0;
            this.move = false;
            this.mouseLockX = 0;
            this.mouseLockY = 0;
            this.init();
        }
        /**
        * Global initialise function
        */
        Intermediate_Globe.prototype.init = function () {
            this.initEngine();
            this.initLights();

            //initLensFlare();
            this.initMaterials();
            this.initObjects();
            this.initListeners();
        };

        /**
        * Initialise the engine
        */
        Intermediate_Globe.prototype.initEngine = function () {
            this.scene = new Scene();

            //setup camera for optimal skybox rendering
            this.camera = new Camera();
            this.camera.projection.far = 100000;

            this.view = new View(new DefaultRenderer());
            this.view.scene = this.scene;
            this.view.camera = this.camera;

            //setup controller to be used on the camera
            this.cameraController = new HoverController(this.camera, null, 0, 0, 600, -90, 90);
            this.cameraController.autoUpdate = false;
            this.cameraController.yFactor = 1;
        };

        /**
        * Initialise the lights
        */
        Intermediate_Globe.prototype.initLights = function () {
            this.light = new PointLight();
            this.light.x = 10000;
            this.light.ambient = 1;
            this.light.diffuse = 2;

            this.lightPicker = new StaticLightPicker([this.light]);
        };

        /*
        private initLensFlare():void
        {
        flares.push(new FlareObject(new Flare10(),  3.2, -0.01, 147.9));
        flares.push(new FlareObject(new Flare11(),  6,    0,     30.6));
        flares.push(new FlareObject(new Flare7(),   2,    0,     25.5));
        flares.push(new FlareObject(new Flare7(),   4,    0,     17.85));
        flares.push(new FlareObject(new Flare12(),  0.4,  0.32,  22.95));
        flares.push(new FlareObject(new Flare6(),   1,    0.68,  20.4));
        flares.push(new FlareObject(new Flare2(),   1.25, 1.1,   48.45));
        flares.push(new FlareObject(new Flare3(),   1.75, 1.37,   7.65));
        flares.push(new FlareObject(new Flare4(),   2.75, 1.85,  12.75));
        flares.push(new FlareObject(new Flare8(),   0.5,  2.21,  33.15));
        flares.push(new FlareObject(new Flare6(),   4,    2.5,   10.4));
        flares.push(new FlareObject(new Flare7(),   10,   2.66,  50));
        }
        */
        /**
        * Initialise the materials
        */
        Intermediate_Globe.prototype.initMaterials = function () {
            //this.cubeTexture = new BitmapCubeTexture(Cast.bitmapData(PosX), Cast.bitmapData(NegX), Cast.bitmapData(PosY), Cast.bitmapData(NegY), Cast.bitmapData(PosZ), Cast.bitmapData(NegZ));
            //adjust specular map
            //var specBitmap:BitmapData = Cast.bitmapData(EarthSpecular);
            //specBitmap.colorTransform(specBitmap.rect, new ColorTransform(1, 1, 1, 1, 64, 64, 64));
            var specular = new FresnelSpecularMethod(true, new PhongSpecularMethod());
            specular.fresnelPower = 1;
            specular.normalReflectance = 0.1;

            this.sunMaterial = new TextureMaterial();
            this.sunMaterial.blendMode = BlendMode.ADD;

            this.groundMaterial = new TextureMaterial();
            this.groundMaterial.specularMethod = specular;
            this.groundMaterial.lightPicker = this.lightPicker;
            this.groundMaterial.gloss = 5;
            this.groundMaterial.specular = 1;
            this.groundMaterial.ambientColor = 0xFFFFFF;
            this.groundMaterial.ambient = 1;

            this.cloudMaterial = new TextureMaterial();
            this.cloudMaterial.alphaBlending = true;
            this.cloudMaterial.lightPicker = this.lightPicker;
            this.cloudMaterial.specular = 0;
            this.cloudMaterial.ambientColor = 0x1b2048;
            this.cloudMaterial.ambient = 1;

            this.atmosphereDiffuseMethod = new CompositeDiffuseMethod(this, this.modulateDiffuseMethod);
            this.atmosphereSpecularMethod = new CompositeSpecularMethod(this, this.modulateSpecularMethod, new PhongSpecularMethod());

            this.atmosphereMaterial = new ColorMaterial(0x1671cc);
            this.atmosphereMaterial.diffuseMethod = this.atmosphereDiffuseMethod;
            this.atmosphereMaterial.specularMethod = this.atmosphereSpecularMethod;
            this.atmosphereMaterial.blendMode = BlendMode.ADD;
            this.atmosphereMaterial.lightPicker = this.lightPicker;
            this.atmosphereMaterial.specular = 0.5;
            this.atmosphereMaterial.gloss = 5;
            this.atmosphereMaterial.ambientColor = 0x0;
            this.atmosphereMaterial.ambient = 1;
        };

        Intermediate_Globe.prototype.modulateDiffuseMethod = function (vo, t, regCache, sharedRegisters) {
            var viewDirFragmentReg = this.atmosphereDiffuseMethod._sharedRegisters.viewDirFragment;
            var normalFragmentReg = this.atmosphereDiffuseMethod._sharedRegisters.normalFragment;

            var code = "dp3 " + t + ".w, " + viewDirFragmentReg + ".xyz, " + normalFragmentReg + ".xyz\n" + "mul " + t + ".w, " + t + ".w, " + t + ".w\n";

            return code;
        };

        Intermediate_Globe.prototype.modulateSpecularMethod = function (vo, t, regCache, sharedRegisters) {
            var viewDirFragmentReg = this.atmosphereDiffuseMethod._sharedRegisters.viewDirFragment;
            var normalFragmentReg = this.atmosphereDiffuseMethod._sharedRegisters.normalFragment;
            var temp = regCache.getFreeFragmentSingleTemp();
            regCache.addFragmentTempUsages(temp, 1);

            var code = "dp3 " + temp + ", " + viewDirFragmentReg + ".xyz, " + normalFragmentReg + ".xyz\n" + "neg " + temp + ", " + temp + "\n" + "mul " + t + ".w, " + t + ".w, " + temp + "\n";

            regCache.removeFragmentTempUsage(temp);

            return code;
        };

        /**
        * Initialise the scene objects
        */
        Intermediate_Globe.prototype.initObjects = function () {
            this.orbitContainer = new DisplayObjectContainer();
            this.orbitContainer.addChild(this.light);
            this.scene.addChild(this.orbitContainer);

            this.sun = new Billboard(this.sunMaterial, 3000, 3000);
            this.sun.orientationMode = OrientationMode.CAMERA_PLANE;
            this.sun.alignmentMode = AlignmentMode.PIVOT_POINT;
            this.sun.x = 10000;
            this.orbitContainer.addChild(this.sun);

            this.earth = new Mesh(new SphereGeometry(200, 200, 100), this.groundMaterial);

            this.clouds = new Mesh(new SphereGeometry(202, 200, 100), this.cloudMaterial);

            this.atmosphere = new Mesh(new SphereGeometry(210, 200, 100), this.atmosphereMaterial);
            this.atmosphere.scaleX = -1;

            this.tiltContainer = new DisplayObjectContainer();
            this.tiltContainer.rotationX = -23;
            this.tiltContainer.addChild(this.earth);
            this.tiltContainer.addChild(this.clouds);
            this.tiltContainer.addChild(this.atmosphere);

            this.scene.addChild(this.tiltContainer);

            this.cameraController.lookAtObject = this.tiltContainer;
        };

        /**
        * Initialise the listeners
        */
        Intermediate_Globe.prototype.initListeners = function () {
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

            //setup the url map for textures in the cubemap file
            var assetLoaderContext = new away.net.AssetLoaderContext();
            assetLoaderContext.dependencyBaseUrl = "assets/demos/skybox/";

            //environment texture
            away.library.AssetLibrary.load(new away.net.URLRequest("assets/demos/skybox/space_texture.cube"), assetLoaderContext);

            //globe textures
            away.library.AssetLibrary.load(new away.net.URLRequest("assets/demos/globe/cloud_combined_2048.jpg"));
            away.library.AssetLibrary.load(new away.net.URLRequest("assets/demos/globe/earth_specular_2048.jpg"));
            away.library.AssetLibrary.load(new away.net.URLRequest("assets/demos/globe/EarthNormal.png"));
            away.library.AssetLibrary.load(new away.net.URLRequest("assets/demos/globe/land_lights_16384.jpg"));
            away.library.AssetLibrary.load(new away.net.URLRequest("assets/demos/globe/land_ocean_ice_2048_match.jpg"));

            //flare textures
            away.library.AssetLibrary.load(new away.net.URLRequest("assets/demos/lensflare/flare2.jpg"));
            away.library.AssetLibrary.load(new away.net.URLRequest("assets/demos/lensflare/flare3.jpg"));
            away.library.AssetLibrary.load(new away.net.URLRequest("assets/demos/lensflare/flare4.jpg"));
            away.library.AssetLibrary.load(new away.net.URLRequest("assets/demos/lensflare/flare6.jpg"));
            away.library.AssetLibrary.load(new away.net.URLRequest("assets/demos/lensflare/flare7.jpg"));
            away.library.AssetLibrary.load(new away.net.URLRequest("assets/demos/lensflare/flare8.jpg"));
            away.library.AssetLibrary.load(new away.net.URLRequest("assets/demos/lensflare/flare10.jpg"));
            away.library.AssetLibrary.load(new away.net.URLRequest("assets/demos/lensflare/flare11.jpg"));
            away.library.AssetLibrary.load(new away.net.URLRequest("assets/demos/lensflare/flare12.jpg"));
        };

        /**
        * Navigation and render loop
        */
        Intermediate_Globe.prototype.onEnterFrame = function (dt) {
            this._time += dt;

            this.earth.rotationY += 0.2;
            this.clouds.rotationY += 0.21;
            this.orbitContainer.rotationY += 0.02;

            this.cameraController.update();

            this.updateFlares();

            this.view.render();
        };

        Intermediate_Globe.prototype.updateFlares = function () {
            var flareVisibleOld = this.flareVisible;

            var sunScreenPosition = this.view.project(this.sun.scenePosition);
            var xOffset = sunScreenPosition.x - window.innerWidth / 2;
            var yOffset = sunScreenPosition.y - window.innerHeight / 2;

            var earthScreenPosition = this.view.project(this.earth.scenePosition);
            var earthRadius = 190 * window.innerHeight / earthScreenPosition.z;
            var flareObject;

            this.flareVisible = (sunScreenPosition.x > 0 && sunScreenPosition.x < window.innerWidth && sunScreenPosition.y > 0 && sunScreenPosition.y < window.innerHeight && sunScreenPosition.z > 0 && Math.sqrt(xOffset * xOffset + yOffset * yOffset) > earthRadius);

            //update flare visibility
            if (this.flareVisible != flareVisibleOld) {
                for (var i = 0; i < this.flares.length; i++) {
                    flareObject = this.flares[i];
                    if (flareObject)
                        flareObject.billboard.visible = this.flareVisible;
                }
            }

            //update flare position
            if (this.flareVisible) {
                var flareDirection = new Point(xOffset, yOffset);
                for (var i = 0; i < this.flares.length; i++) {
                    flareObject = this.flares[i];
                    if (flareObject)
                        flareObject.billboard.transform.position = this.view.unproject(sunScreenPosition.x - flareDirection.x * flareObject.position, sunScreenPosition.y - flareDirection.y * flareObject.position, 100 - i);
                }
            }
        };

        /**
        * Listener function for resource complete event on asset library
        */
        Intermediate_Globe.prototype.onResourceComplete = function (event) {
            switch (event.url) {
                case 'assets/demos/skybox/space_texture.cube':
                    this.cubeTexture = event.assets[0];

                    this.skyBox = new Skybox(this.cubeTexture);
                    this.scene.addChild(this.skyBox);
                    break;

                case "assets/demos/globe/cloud_combined_2048.jpg":
                    var cloudBitmapData = new BitmapData(2048, 1024, true, 0xFFFFFFFF);
                    cloudBitmapData.copyChannel(Cast.bitmapData(event.assets[0]), cloudBitmapData.rect, new Point(), BitmapDataChannel.RED, BitmapDataChannel.ALPHA);

                    this.cloudMaterial.texture = new BitmapTexture(cloudBitmapData, false); //TODO: fix mipmaps for bitmapdata textures
                    break;
                case "assets/demos/globe/earth_specular_2048.jpg":
                    var specBitmapData = Cast.bitmapData(event.assets[0]);
                    specBitmapData.colorTransform(specBitmapData.rect, new ColorTransform(1, 1, 1, 1, 64, 64, 64));
                    this.groundMaterial.specularMap = new BitmapTexture(specBitmapData, false); //TODO: fix mipmaps for bitmapdata textures
                    break;
                case "assets/demos/globe/EarthNormal.png":
                    this.groundMaterial.normalMap = event.assets[0];
                    break;
                case "assets/demos/globe/land_lights_16384.jpg":
                    this.groundMaterial.ambientTexture = event.assets[0];
                    break;
                case "assets/demos/globe/land_ocean_ice_2048_match.jpg":
                    this.groundMaterial.texture = event.assets[0];
                    break;

                case "assets/demos/lensflare/flare2.jpg":
                    this.flares[6] = new FlareObject(Cast.bitmapData(event.assets[0]), 1.25, 1.1, 48.45, this.scene);
                    break;
                case "assets/demos/lensflare/flare3.jpg":
                    this.flares[7] = new FlareObject(Cast.bitmapData(event.assets[0]), 1.75, 1.37, 7.65, this.scene);
                    break;
                case "assets/demos/lensflare/flare4.jpg":
                    this.flares[8] = new FlareObject(Cast.bitmapData(event.assets[0]), 2.75, 1.85, 12.75, this.scene);
                    break;
                case "assets/demos/lensflare/flare6.jpg":
                    this.flares[5] = new FlareObject(Cast.bitmapData(event.assets[0]), 1, 0.68, 20.4, this.scene);
                    this.flares[10] = new FlareObject(Cast.bitmapData(event.assets[0]), 4, 2.5, 10.4, this.scene);
                    break;
                case "assets/demos/lensflare/flare7.jpg":
                    this.flares[2] = new FlareObject(Cast.bitmapData(event.assets[0]), 2, 0, 25.5, this.scene);
                    this.flares[3] = new FlareObject(Cast.bitmapData(event.assets[0]), 4, 0, 17.85, this.scene);
                    this.flares[11] = new FlareObject(Cast.bitmapData(event.assets[0]), 10, 2.66, 50, this.scene);
                    break;
                case "assets/demos/lensflare/flare8.jpg":
                    this.flares[9] = new FlareObject(Cast.bitmapData(event.assets[0]), 0.5, 2.21, 33.15, this.scene);
                    break;
                case "assets/demos/lensflare/flare10.jpg":
                    this.sunMaterial.texture = event.assets[0];
                    this.flares[0] = new FlareObject(Cast.bitmapData(event.assets[0]), 3.2, -0.01, 100, this.scene);
                    break;
                case "assets/demos/lensflare/flare11.jpg":
                    this.flares[1] = new FlareObject(Cast.bitmapData(event.assets[0]), 6, 0, 30.6, this.scene);
                    break;
                case "assets/demos/lensflare/flare12.jpg":
                    this.flares[4] = new FlareObject(Cast.bitmapData(event.assets[0]), 0.4, 0.32, 22.95, this.scene);
                    break;
            }
        };

        /**
        * Mouse down listener for navigation
        */
        Intermediate_Globe.prototype.onMouseDown = function (event) {
            this.lastPanAngle = this.cameraController.panAngle;
            this.lastTiltAngle = this.cameraController.tiltAngle;
            this.lastMouseX = event.clientX;
            this.lastMouseY = event.clientY;
            this.move = true;
        };

        /**
        * Mouse up listener for navigation
        */
        Intermediate_Globe.prototype.onMouseUp = function (event) {
            this.move = false;
        };

        /**
        * Mouse move listener for mouseLock
        */
        Intermediate_Globe.prototype.onMouseMove = function (event) {
            //            if (stage.displayState == StageDisplayState.FULL_SCREEN) {
            //
            //                if (mouseLocked && (lastMouseX != 0 || lastMouseY != 0)) {
            //                    e.movementX += lastMouseX;
            //                    e.movementY += lastMouseY;
            //                    lastMouseX = 0;
            //                    lastMouseY = 0;
            //                }
            //
            //                mouseLockX += e.movementX;
            //                mouseLockY += e.movementY;
            //
            //                if (!stage.mouseLock) {
            //                    stage.mouseLock = true;
            //                    lastMouseX = stage.mouseX - stage.stageWidth/2;
            //                    lastMouseY = stage.mouseY - stage.stageHeight/2;
            //                } else if (!mouseLocked) {
            //                    mouseLocked = true;
            //                }
            //
            //                //ensure bounds for tiltAngle are not eceeded
            //                if (mouseLockY > cameraController.maxTiltAngle/0.3)
            //                    mouseLockY = cameraController.maxTiltAngle/0.3;
            //                else if (mouseLockY < cameraController.minTiltAngle/0.3)
            //                    mouseLockY = cameraController.minTiltAngle/0.3;
            //            }
            //            if (stage.mouseLock) {
            //                cameraController.panAngle = 0.3*mouseLockX;
            //                cameraController.tiltAngle = 0.3*mouseLockY;
            //            } else if (move) {
            //                cameraController.panAngle = 0.3*(stage.mouseX - lastMouseX) + lastPanAngle;
            //                cameraController.tiltAngle = 0.3*(stage.mouseY - lastMouseY) + lastTiltAngle;
            //            }
            if (this.move) {
                this.cameraController.panAngle = 0.3 * (event.clientX - this.lastMouseX) + this.lastPanAngle;
                this.cameraController.tiltAngle = 0.3 * (event.clientY - this.lastMouseY) + this.lastTiltAngle;
            }
        };

        /**
        * Mouse wheel listener for navigation
        */
        Intermediate_Globe.prototype.onMouseWheel = function (event) {
            if (event.wheelDelta > 0) {
                this.cameraController.distance -= 20;
            } else {
                this.cameraController.distance += 20;
            }

            if (this.cameraController.distance < 400)
                this.cameraController.distance = 400;
            else if (this.cameraController.distance > 10000)
                this.cameraController.distance = 10000;
        };

        /**
        * Key down listener for fullscreen
        */
        //        private onKeyDown(event:KeyboardEvent):void
        //        {
        //            switch (event.keyCode)
        //            {
        //                case Keyboard.SPACE:
        //                    if (stage.displayState == StageDisplayState.FULL_SCREEN) {
        //                        stage.displayState = StageDisplayState.NORMAL;
        //                    } else {
        //                        stage.displayState = StageDisplayState.FULL_SCREEN;
        //
        //                        mouseLocked = false;
        //                        mouseLockX = cameraController.panAngle/0.3;
        //                        mouseLockY = cameraController.tiltAngle/0.3;
        //                    }
        //                    break;
        //            }
        //        }
        //
        /**
        * window listener for resize events
        */
        Intermediate_Globe.prototype.onResize = function (event) {
            if (typeof event === "undefined") { event = null; }
            this.view.y = 0;
            this.view.x = 0;
            this.view.width = window.innerWidth;
            this.view.height = window.innerHeight;
        };
        return Intermediate_Globe;
    })();
    examples.Intermediate_Globe = Intermediate_Globe;
})(examples || (examples = {}));

var Scene3D = away.containers.Scene;
var BitmapData = away.base.BitmapData;
var BitmapDataChannel = away.base.BitmapDataChannel;
var BlendMode = away.base.BlendMode;
var OrientationMode = away.base.OrientationMode;
var AlignmentMode = away.base.AlignmentMode;
var Billboard = away.entities.Billboard;
var Point = away.geom.Point;
var TextureMaterial = away.materials.TextureMaterial;
var BitmapTexture = away.textures.BitmapTexture;
var Cast = away.utils.Cast;

var FlareObject = (function () {
    /**
    * Constructor
    */
    function FlareObject(bitmapData, size, position, opacity, scene) {
        this.flareSize = 14.4;
        var bd = new BitmapData(bitmapData.width, bitmapData.height, true, 0xFFFFFFFF);
        bd.copyChannel(bitmapData, bitmapData.rect, new Point(), BitmapDataChannel.RED, BitmapDataChannel.ALPHA);

        var billboardMaterial = new TextureMaterial(new BitmapTexture(bd, false));
        billboardMaterial.alpha = opacity / 100;
        billboardMaterial.alphaBlending = true;

        //billboardMaterial.blendMode = BlendMode.LAYER;
        this.billboard = new Billboard(billboardMaterial, size * this.flareSize, size * this.flareSize);
        this.billboard.orientationMode = OrientationMode.CAMERA_PLANE;
        this.billboard.alignmentMode = AlignmentMode.PIVOT_POINT;
        this.billboard.visible = false;
        this.size = size;
        this.position = position;
        this.opacity = opacity;

        scene.addChild(this.billboard);
    }
    return FlareObject;
})();
//# sourceMappingURL=Intermediate_Globe.js.map
