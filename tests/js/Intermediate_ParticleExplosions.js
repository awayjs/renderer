///<reference path="../../../build/Away3D.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />
/*
Particle explosions in Away3D using the Adobe AIR and Adobe Flash Player logos
Demonstrates:
How to split images into particles.
How to share particle geometries and animation sets between meshes and animators.
How to manually update the playhead of a particle animator using the update() function.
Code by Rob Bateman & Liao Cheng
rob@infiniteturtles.co.uk
http://www.infiniteturtles.co.uk
liaocheng210@126.com
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
    var ParticleAnimationSet = away.animators.ParticleAnimationSet;
    var ParticleAnimator = away.animators.ParticleAnimator;
    var ParticleBezierCurveNode = away.animators.ParticleBezierCurveNode;
    var ParticleBillboardNode = away.animators.ParticleBillboardNode;
    var ParticleInitialColorNode = away.animators.ParticleInitialColorNode;
    var ParticlePositionNode = away.animators.ParticlePositionNode;
    var ParticleProperties = away.animators.ParticleProperties;
    var ParticlePropertiesMode = away.animators.ParticlePropertiesMode;
    var Geometry = away.base.Geometry;
    var ParticleGeometry = away.base.ParticleGeometry;
    var Scene = away.containers.Scene;
    var View = away.containers.View;
    var HoverController = away.controllers.HoverController;
    var BitmapData = away.base.BitmapData;
    var Camera = away.entities.Camera;
    var Mesh = away.entities.Mesh;
    var LoaderEvent = away.events.LoaderEvent;
    var ColorTransform = away.geom.ColorTransform;
    var Vector3D = away.geom.Vector3D;
    var AssetLibrary = away.library.AssetLibrary;
    var PointLight = away.lights.PointLight;
    var ColorMaterial = away.materials.ColorMaterial;
    var StaticLightPicker = away.materials.StaticLightPicker;
    var PlaneGeometry = away.primitives.PlaneGeometry;
    var DefaultRenderer = away.render.DefaultRenderer;
    var ParticleGeometryHelper = away.tools.ParticleGeometryHelper;
    var Cast = away.utils.Cast;
    var RequestAnimationFrame = away.utils.RequestAnimationFrame;

    var Intermediate_ParticleExplosions = (function () {
        /**
        * Constructor
        */
        function Intermediate_ParticleExplosions() {
            this.colorValues = new Array();
            this.colorPoints = new Array();
            this.time = 0;
            this.angle = 0;
            this.move = false;
            this.init();
        }
        /**
        * Global initialise function
        */
        Intermediate_ParticleExplosions.prototype.init = function () {
            this.initEngine();
            this.initLights();
            this.initMaterials();
            this.initListeners();
        };

        /**
        * Initialise the engine
        */
        Intermediate_ParticleExplosions.prototype.initEngine = function () {
            this.scene = new Scene();

            this.camera = new Camera();

            this.view = new View(new DefaultRenderer(), this.scene, this.camera);

            //setup controller to be used on the camera
            this.cameraController = new HoverController(this.camera, null, 225, 10, 1000);
        };

        /**
        * Initialise the lights
        */
        Intermediate_ParticleExplosions.prototype.initLights = function () {
            //create a green point light
            this.greenLight = new PointLight();
            this.greenLight.color = 0x00FF00;
            this.greenLight.ambient = 1;
            this.greenLight.fallOff = 600;
            this.greenLight.radius = 100;
            this.greenLight.specular = 2;
            this.scene.addChild(this.greenLight);

            //create a red pointlight
            this.blueLight = new PointLight();
            this.blueLight.color = 0x0000FF;
            this.blueLight.fallOff = 600;
            this.blueLight.radius = 100;
            this.blueLight.specular = 2;
            this.scene.addChild(this.blueLight);

            //create a lightpicker for the green and red light
            this.lightPicker = new StaticLightPicker([this.greenLight, this.blueLight]);
        };

        /**
        * Initialise the materials
        */
        Intermediate_ParticleExplosions.prototype.initMaterials = function () {
            //setup the particle material
            this.colorMaterial = new ColorMaterial(0xFFFFFF);
            this.colorMaterial.bothSides = true;
            this.colorMaterial.lightPicker = this.lightPicker;
        };

        /**
        * Initialise the particles
        */
        Intermediate_ParticleExplosions.prototype.initParticles = function () {
            var i;
            var j;
            var point;
            var rgb;
            var color;

            for (i = 0; i < this.chromeBitmapData.width; i++) {
                for (j = 0; j < this.chromeBitmapData.height; j++) {
                    point = new Vector3D(Intermediate_ParticleExplosions.PARTICLE_SIZE * (i - this.chromeBitmapData.width / 2 - 100), Intermediate_ParticleExplosions.PARTICLE_SIZE * (-j + this.chromeBitmapData.height / 2));
                    color = this.chromeBitmapData.getPixel(i, j);
                    if (((color >> 24) & 0xff) > 0xb0) {
                        this.colorValues.push(new Vector3D(((color & 0xff0000) >> 16) / 255, ((color & 0xff00) >> 8) / 255, (color & 0xff) / 255));
                        this.colorPoints.push(point);
                    }
                }
            }

            //define where one logo stops and another starts
            this.colorChromeSeparation = this.colorPoints.length;

            for (i = 0; i < this.firefoxBitmapData.width; i++) {
                for (j = 0; j < this.firefoxBitmapData.height; j++) {
                    point = new Vector3D(Intermediate_ParticleExplosions.PARTICLE_SIZE * (i - this.firefoxBitmapData.width / 2 + 100), Intermediate_ParticleExplosions.PARTICLE_SIZE * (-j + this.firefoxBitmapData.height / 2));
                    color = this.firefoxBitmapData.getPixel(i, j);
                    if (((color >> 24) & 0xff) > 0xb0) {
                        this.colorValues.push(new Vector3D(((color & 0xff0000) >> 16) / 255, ((color & 0xff00) >> 8) / 255, (color & 0xff) / 255));
                        this.colorPoints.push(point);
                    }
                }
            }

            //define where one logo stops and another starts
            this.colorFirefoxSeparation = this.colorPoints.length;

            for (i = 0; i < this.safariBitmapData.width; i++) {
                for (j = 0; j < this.safariBitmapData.height; j++) {
                    point = new Vector3D(Intermediate_ParticleExplosions.PARTICLE_SIZE * (i - this.safariBitmapData.width / 2), Intermediate_ParticleExplosions.PARTICLE_SIZE * (-j + this.safariBitmapData.height / 2), -Intermediate_ParticleExplosions.PARTICLE_SIZE * 100);
                    color = this.safariBitmapData.getPixel(i, j);
                    if (((color >> 24) & 0xff) > 0xb0) {
                        this.colorValues.push(new Vector3D(((color & 0xff0000) >> 16) / 255, ((color & 0xff00) >> 8) / 255, (color & 0xff) / 255));
                        this.colorPoints.push(point);
                    }
                }
            }

            //define where one logo stops and another starts
            this.colorSafariSeparation = this.colorPoints.length;

            for (i = 0; i < this.ieBitmapData.width; i++) {
                for (j = 0; j < this.ieBitmapData.height; j++) {
                    point = new Vector3D(Intermediate_ParticleExplosions.PARTICLE_SIZE * (i - this.ieBitmapData.width / 2), Intermediate_ParticleExplosions.PARTICLE_SIZE * (-j + this.ieBitmapData.height / 2), Intermediate_ParticleExplosions.PARTICLE_SIZE * 100);
                    color = this.ieBitmapData.getPixel(i, j);
                    if (((color >> 24) & 0xff) > 0xb0) {
                        this.colorValues.push(new Vector3D(((color & 0xff0000) >> 16) / 255, ((color & 0xff00) >> 8) / 255, (color & 0xff) / 255));
                        this.colorPoints.push(point);
                    }
                }
            }

            var num = this.colorPoints.length;

            //setup the base geometry for one particle
            var plane = new PlaneGeometry(Intermediate_ParticleExplosions.PARTICLE_SIZE, Intermediate_ParticleExplosions.PARTICLE_SIZE, 1, 1, false);

            //combine them into a list
            var colorGeometrySet = new Array();
            for (i = 0; i < num; i++)
                colorGeometrySet.push(plane);

            //generate the particle geometries
            this.colorGeometry = ParticleGeometryHelper.generateGeometry(colorGeometrySet);

            //define the particle animations and init function
            this.colorAnimationSet = new ParticleAnimationSet();
            this.colorAnimationSet.addAnimation(new ParticleBillboardNode());
            this.colorAnimationSet.addAnimation(new ParticleBezierCurveNode(ParticlePropertiesMode.LOCAL_STATIC));
            this.colorAnimationSet.addAnimation(new ParticlePositionNode(ParticlePropertiesMode.LOCAL_STATIC));
            this.colorAnimationSet.addAnimation(new ParticleInitialColorNode(ParticlePropertiesMode.LOCAL_STATIC, true, false, new ColorTransform(0, 1, 0, 1)));
            this.colorAnimationSet.initParticleFunc = this.iniColorParticleFunc;
            this.colorAnimationSet.initParticleScope = this;
        };

        /**
        * Initialise the scene objects
        */
        Intermediate_ParticleExplosions.prototype.initObjects = function () {
            //initialise animators vectors
            this.colorAnimators = new Array(Intermediate_ParticleExplosions.NUM_ANIMATORS);

            //create the particle mesh
            this.colorParticleMesh = new Mesh(this.colorGeometry, this.colorMaterial);

            var i = 0;
            for (i = 0; i < Intermediate_ParticleExplosions.NUM_ANIMATORS; i++) {
                //clone the particle mesh
                this.colorParticleMesh = this.colorParticleMesh.clone();
                this.colorParticleMesh.rotationY = 45 * (i - 1);
                this.scene.addChild(this.colorParticleMesh);

                //create and start the particle animator
                this.colorAnimators[i] = new ParticleAnimator(this.colorAnimationSet);
                this.colorParticleMesh.animator = this.colorAnimators[i];
                this.scene.addChild(this.colorParticleMesh);
            }
        };

        /**
        * Initialise the listeners
        */
        Intermediate_ParticleExplosions.prototype.initListeners = function () {
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

            this.timer = new away.utils.RequestAnimationFrame(this.onEnterFrame, this);
            this.timer.start();

            away.library.AssetLibrary.addEventListener(away.events.LoaderEvent.RESOURCE_COMPLETE, away.utils.Delegate.create(this, this.onResourceComplete));

            //image textures
            away.library.AssetLibrary.load(new away.net.URLRequest("assets/demos/firefox.png"));
            away.library.AssetLibrary.load(new away.net.URLRequest("assets/demos/chrome.png"));
            away.library.AssetLibrary.load(new away.net.URLRequest("assets/demos/safari.png"));
            away.library.AssetLibrary.load(new away.net.URLRequest("assets/demos/ie.png"));
        };

        /**
        * Initialiser for particle properties
        */
        Intermediate_ParticleExplosions.prototype.iniColorParticleFunc = function (properties) {
            properties.startTime = 0;
            properties.duration = 1;
            var degree1 = Math.random() * Math.PI * 2;
            var degree2 = Math.random() * Math.PI * 2;
            var r = 500;

            if (properties.index < this.colorChromeSeparation)
                properties[ParticleBezierCurveNode.BEZIER_END_VECTOR3D] = new Vector3D(300 * Intermediate_ParticleExplosions.PARTICLE_SIZE, 0, 0);
            else if (properties.index < this.colorFirefoxSeparation)
                properties[ParticleBezierCurveNode.BEZIER_END_VECTOR3D] = new Vector3D(-300 * Intermediate_ParticleExplosions.PARTICLE_SIZE, 0, 0);
            else if (properties.index < this.colorSafariSeparation)
                properties[ParticleBezierCurveNode.BEZIER_END_VECTOR3D] = new Vector3D(0, 0, 300 * Intermediate_ParticleExplosions.PARTICLE_SIZE);
            else
                properties[ParticleBezierCurveNode.BEZIER_END_VECTOR3D] = new Vector3D(0, 0, -300 * Intermediate_ParticleExplosions.PARTICLE_SIZE);

            var rgb = this.colorValues[properties.index];
            properties[ParticleInitialColorNode.COLOR_INITIAL_COLORTRANSFORM] = new ColorTransform(rgb.x, rgb.y, rgb.z, 1);

            properties[ParticleBezierCurveNode.BEZIER_CONTROL_VECTOR3D] = new Vector3D(r * Math.sin(degree1) * Math.cos(degree2), r * Math.cos(degree1) * Math.cos(degree2), r * Math.sin(degree2));
            properties[ParticlePositionNode.POSITION_VECTOR3D] = this.colorPoints[properties.index];
        };

        /**
        * Navigation and render loop
        */
        Intermediate_ParticleExplosions.prototype.onEnterFrame = function (dt) {
            this.time += dt;

            //update the camera position
            this.cameraController.panAngle += 0.2;

            //update the particle animator playhead positions
            var i;
            var time;

            if (this.colorAnimators) {
                for (i = 0; i < this.colorAnimators.length; i++) {
                    time = 1000 * (Math.sin(this.time / 5000 + Math.PI * i / 4) + 1);
                    this.colorAnimators[i].update(time);
                }
            }

            //update the light positions
            this.angle += Math.PI / 180;
            this.greenLight.x = Math.sin(this.angle) * 600;
            this.greenLight.z = Math.cos(this.angle) * 600;
            this.blueLight.x = Math.sin(this.angle + Math.PI) * 600;
            this.blueLight.z = Math.cos(this.angle + Math.PI) * 600;

            this.view.render();
        };

        /**
        * Listener function for resource complete event on asset library
        */
        Intermediate_ParticleExplosions.prototype.onResourceComplete = function (event) {
            switch (event.url) {
                case "assets/demos/firefox.png":
                    this.firefoxBitmapData = Cast.bitmapData(event.assets[0]);
                    break;
                case "assets/demos/chrome.png":
                    this.chromeBitmapData = Cast.bitmapData(event.assets[0]);
                    break;
                case "assets/demos/ie.png":
                    this.ieBitmapData = Cast.bitmapData(event.assets[0]);
                    break;
                case "assets/demos/safari.png":
                    this.safariBitmapData = Cast.bitmapData(event.assets[0]);
                    break;
            }

            if (this.firefoxBitmapData != null && this.chromeBitmapData != null && this.safariBitmapData != null && this.ieBitmapData != null) {
                this.initParticles();
                this.initObjects();
            }
        };

        /**
        * Mouse down listener for navigation
        */
        Intermediate_ParticleExplosions.prototype.onMouseDown = function (event) {
            this.lastPanAngle = this.cameraController.panAngle;
            this.lastTiltAngle = this.cameraController.tiltAngle;
            this.lastMouseX = event.clientX;
            this.lastMouseY = event.clientY;
            this.move = true;
        };

        /**
        * Mouse up listener for navigation
        */
        Intermediate_ParticleExplosions.prototype.onMouseUp = function (event) {
            this.move = false;
        };

        /**
        * Mouse move listener for mouseLock
        */
        Intermediate_ParticleExplosions.prototype.onMouseMove = function (event) {
            if (this.move) {
                this.cameraController.panAngle = 0.3 * (event.clientX - this.lastMouseX) + this.lastPanAngle;
                this.cameraController.tiltAngle = 0.3 * (event.clientY - this.lastMouseY) + this.lastTiltAngle;
            }
        };

        /**
        * window listener for resize events
        */
        Intermediate_ParticleExplosions.prototype.onResize = function (event) {
            if (typeof event === "undefined") { event = null; }
            this.view.y = 0;
            this.view.x = 0;
            this.view.width = window.innerWidth;
            this.view.height = window.innerHeight;
        };
        Intermediate_ParticleExplosions.PARTICLE_SIZE = 1;
        Intermediate_ParticleExplosions.NUM_ANIMATORS = 4;
        return Intermediate_ParticleExplosions;
    })();
    examples.Intermediate_ParticleExplosions = Intermediate_ParticleExplosions;
})(examples || (examples = {}));
//# sourceMappingURL=Intermediate_ParticleExplosions.js.map
