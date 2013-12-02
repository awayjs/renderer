///<reference path="../../../build/Away3D.next.d.ts" />
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
    var Camera3D = away.cameras.Camera3D;
    var Scene3D = away.containers.Scene3D;
    var View3D = away.containers.View3D;
    var HoverController = away.controllers.HoverController;
    var BitmapData = away.display.BitmapData;
    var Mesh = away.entities.Mesh;
    var LoaderEvent = away.events.LoaderEvent;
    var ColorTransform = away.geom.ColorTransform;
    var Vector3D = away.geom.Vector3D;
    var AssetLibrary = away.library.AssetLibrary;
    var PointLight = away.lights.PointLight;
    var ColorMaterial = away.materials.ColorMaterial;
    var StaticLightPicker = away.materials.StaticLightPicker;
    var PlaneGeometry = away.primitives.PlaneGeometry;
    var ParticleGeometryHelper = away.tools.ParticleGeometryHelper;
    var Cast = away.utils.Cast;
    var RequestAnimationFrame = away.utils.RequestAnimationFrame;

    var Intermediate_ParticleExplosions = (function () {
        /**
        * Constructor
        */
        function Intermediate_ParticleExplosions() {
            this.redPoints = new Array();
            this.whitePoints = new Array();
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
            this.scene = new Scene3D();

            this.camera = new Camera3D();

            this.view = new View3D();
            this.view.scene = this.scene;
            this.view.camera = this.camera;

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
            //setup the red particle material
            this.redMaterial = new ColorMaterial(0xBE0E0E);
            this.redMaterial.alphaPremultiplied = true;
            this.redMaterial.bothSides = true;
            this.redMaterial.lightPicker = this.lightPicker;

            //setup the white particle material
            this.whiteMaterial = new ColorMaterial(0xBEBEBE);
            this.whiteMaterial.alphaPremultiplied = true;
            this.whiteMaterial.bothSides = true;
            this.whiteMaterial.lightPicker = this.lightPicker;
        };

        /**
        * Initialise the particles
        */
        Intermediate_ParticleExplosions.prototype.initParticles = function () {
            var i/*int*/ ;
            var j/*int*/ ;
            var point;

            for (i = 0; i < this.playerBitmapData.width; i++) {
                for (j = 0; j < this.playerBitmapData.height; j++) {
                    point = new Vector3D(Intermediate_ParticleExplosions.PARTICLE_SIZE * (i - this.playerBitmapData.width / 2 - 100), Intermediate_ParticleExplosions.PARTICLE_SIZE * (-j + this.playerBitmapData.height / 2));
                    if (((this.playerBitmapData.getPixel(i, j) >> 8) & 0xff) <= 0xb0)
                        this.redPoints.push(point);
else
                        this.whitePoints.push(point);
                }
            }

            //define where one logo stops and another starts
            this.redSeparation = this.redPoints.length;
            this.whiteSeparation = this.whitePoints.length;

            for (i = 0; i < this.airBitmapData.width; i++) {
                for (j = 0; j < this.airBitmapData.height; j++) {
                    point = new Vector3D(Intermediate_ParticleExplosions.PARTICLE_SIZE * (i - this.airBitmapData.width / 2 + 100), Intermediate_ParticleExplosions.PARTICLE_SIZE * (-j + this.airBitmapData.height / 2));
                    if (((this.airBitmapData.getPixel(i, j) >> 8) & 0xff) <= 0xb0)
                        this.redPoints.push(point);
else
                        this.whitePoints.push(point);
                }
            }

            var numRed = this.redPoints.length;
            var numWhite = this.whitePoints.length;

            //setup the base geometry for one particle
            var plane = new PlaneGeometry(Intermediate_ParticleExplosions.PARTICLE_SIZE, Intermediate_ParticleExplosions.PARTICLE_SIZE, 1, 1, false);

            //combine them into a list
            var redGeometrySet = new Array();
            for (i = 0; i < numRed; i++)
                redGeometrySet.push(plane);

            var whiteGeometrySet = new Array();
            for (i = 0; i < numWhite; i++)
                whiteGeometrySet.push(plane);

            //generate the particle geometries
            this.redGeometry = ParticleGeometryHelper.generateGeometry(redGeometrySet);
            this.whiteGeometry = ParticleGeometryHelper.generateGeometry(whiteGeometrySet);

            //define the red particle animations and init function
            this.redAnimationSet = new ParticleAnimationSet(true);
            this.redAnimationSet.addAnimation(new ParticleBillboardNode());
            this.redAnimationSet.addAnimation(new ParticleBezierCurveNode(ParticlePropertiesMode.LOCAL_STATIC));
            this.redAnimationSet.addAnimation(new ParticlePositionNode(ParticlePropertiesMode.LOCAL_STATIC));
            this.redAnimationSet.initParticleFunc = this.initRedParticleFunc;
            this.redAnimationSet.initParticleScope = this;

            //define the white particle animations and init function
            this.whiteAnimationSet = new ParticleAnimationSet();
            this.whiteAnimationSet.addAnimation(new ParticleBillboardNode());
            this.whiteAnimationSet.addAnimation(new ParticleBezierCurveNode(ParticlePropertiesMode.LOCAL_STATIC));
            this.whiteAnimationSet.addAnimation(new ParticlePositionNode(ParticlePropertiesMode.LOCAL_STATIC));
            this.whiteAnimationSet.addAnimation(new ParticleInitialColorNode(ParticlePropertiesMode.LOCAL_STATIC, true, false, new ColorTransform(0, 1, 0, 1)));
            this.whiteAnimationSet.initParticleFunc = this.initWhiteParticleFunc;
            this.whiteAnimationSet.initParticleScope = this;
        };

        /**
        * Initialise the scene objects
        */
        Intermediate_ParticleExplosions.prototype.initObjects = function () {
            //initialise animators vectors
            this.redAnimators = new Array(Intermediate_ParticleExplosions.NUM_ANIMATORS);
            this.whiteAnimators = new Array(Intermediate_ParticleExplosions.NUM_ANIMATORS);

            //create the red particle mesh
            this.redParticleMesh = new Mesh(this.redGeometry, this.redMaterial);

            //create the white particle mesh
            this.whiteParticleMesh = new Mesh(this.whiteGeometry, this.whiteMaterial);

            var i = 0;
            for (i = 0; i < Intermediate_ParticleExplosions.NUM_ANIMATORS; i++) {
                //clone the red particle mesh
                this.redParticleMesh = this.redParticleMesh.clone();
                this.redParticleMesh.rotationY = 45 * (i - 1);
                this.scene.addChild(this.redParticleMesh);

                //clone the white particle mesh
                this.whiteParticleMesh = this.whiteParticleMesh.clone();
                this.whiteParticleMesh.rotationY = 45 * (i - 1);
                this.scene.addChild(this.whiteParticleMesh);

                //create and start the red particle animator
                this.redAnimators[i] = new ParticleAnimator(this.redAnimationSet);
                this.redParticleMesh.animator = this.redAnimators[i];
                this.scene.addChild(this.redParticleMesh);

                //create and start the white particle animator
                this.whiteAnimators[i] = new ParticleAnimator(this.whiteAnimationSet);
                this.whiteParticleMesh.animator = this.whiteAnimators[i];
                this.scene.addChild(this.whiteParticleMesh);
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

            away.library.AssetLibrary.addEventListener(away.events.LoaderEvent.RESOURCE_COMPLETE, this.onResourceComplete, this);

            //image textures
            away.library.AssetLibrary.load(new away.net.URLRequest("assets/demos/air.png"));
            away.library.AssetLibrary.load(new away.net.URLRequest("assets/demos/player.png"));
        };

        /**
        * Initialiser for red particle properties
        */
        Intermediate_ParticleExplosions.prototype.initRedParticleFunc = function (properties) {
            properties.startTime = 0;
            properties.duration = 1;
            var degree1 = Math.random() * Math.PI * 2;
            var degree2 = Math.random() * Math.PI * 2;
            var r = 500;

            if (properties.index < this.redSeparation)
                properties[ParticleBezierCurveNode.BEZIER_END_VECTOR3D] = new Vector3D(200 * Intermediate_ParticleExplosions.PARTICLE_SIZE, 0, 0);
else
                properties[ParticleBezierCurveNode.BEZIER_END_VECTOR3D] = new Vector3D(-200 * Intermediate_ParticleExplosions.PARTICLE_SIZE, 0, 0);

            properties[ParticleBezierCurveNode.BEZIER_CONTROL_VECTOR3D] = new Vector3D(r * Math.sin(degree1) * Math.cos(degree2), r * Math.cos(degree1) * Math.cos(degree2), 2 * r * Math.sin(degree2));
            properties[ParticlePositionNode.POSITION_VECTOR3D] = this.redPoints[properties.index];
        };

        /**
        * Initialiser for white particle properties
        */
        Intermediate_ParticleExplosions.prototype.initWhiteParticleFunc = function (properties) {
            properties.startTime = 0;
            properties.duration = 1;
            var degree1 = Math.random() * Math.PI * 2;
            var degree2 = Math.random() * Math.PI * 2;
            var r = 500;

            if (properties.index < this.whiteSeparation)
                properties[ParticleBezierCurveNode.BEZIER_END_VECTOR3D] = new Vector3D(200 * Intermediate_ParticleExplosions.PARTICLE_SIZE, 0, 0);
else
                properties[ParticleBezierCurveNode.BEZIER_END_VECTOR3D] = new Vector3D(-200 * Intermediate_ParticleExplosions.PARTICLE_SIZE, 0, 0);

            properties[ParticleInitialColorNode.COLOR_INITIAL_COLORTRANSFORM] = new ColorTransform(Math.random(), Math.random(), Math.random(), 1);

            properties[ParticleBezierCurveNode.BEZIER_CONTROL_VECTOR3D] = new Vector3D(r * Math.sin(degree1) * Math.cos(degree2), r * Math.cos(degree1) * Math.cos(degree2), r * Math.sin(degree2));
            properties[ParticlePositionNode.POSITION_VECTOR3D] = this.whitePoints[properties.index];
        };

        /**
        * Navigation and render loop
        */
        Intermediate_ParticleExplosions.prototype.onEnterFrame = function (dt) {
            this.time += dt;

            //update the camera position
            this.cameraController.panAngle += 0.2;

            //update the particle animator playhead positions
            var i/*uint*/ ;
            var time/*uint*/ ;

            if (this.redAnimators) {
                for (i = 0; i < this.redAnimators.length; i++) {
                    time = 1000 * (Math.sin(this.time / 5000 + Math.PI * i / 4) + 1);
                    this.redAnimators[i].update(time);
                    this.whiteAnimators[i].update(time);
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
                case "assets/demos/air.png":
                    this.airBitmapData = Cast.bitmapData(event.assets[0]);
                    break;
                case "assets/demos/player.png":
                    this.playerBitmapData = Cast.bitmapData(event.assets[0]);
                    break;
            }

            if (this.airBitmapData != null && this.playerBitmapData != null) {
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
        Intermediate_ParticleExplosions.PARTICLE_SIZE = 3;
        Intermediate_ParticleExplosions.NUM_ANIMATORS = 4;
        return Intermediate_ParticleExplosions;
    })();
    examples.Intermediate_ParticleExplosions = Intermediate_ParticleExplosions;
})(examples || (examples = {}));
//# sourceMappingURL=Intermediate_ParticleExplosions.js.map
