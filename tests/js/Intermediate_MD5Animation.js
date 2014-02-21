///<reference path="../../../build/Away3D.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />
/*
MD5 animation loading and interaction example in Away3d
Demonstrates:
How to load MD5 mesh and anim files with bones animation from embedded resources.
How to map animation data after loading in order to playback an animation sequence.
How to control the movement of a game character using keys.
Code by Rob Bateman & David Lenaerts
rob@infiniteturtles.co.uk
http://www.infiniteturtles.co.uk
david.lenaerts@gmail.com
http://www.derschmale.com
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
    var CrossfadeTransition = away.animators.CrossfadeTransition;
    var Skeleton = away.animators.Skeleton;
    var SkeletonAnimationSet = away.animators.SkeletonAnimationSet;
    var SkeletonAnimator = away.animators.SkeletonAnimator;
    var SkeletonClipNode = away.animators.SkeletonClipNode;
    var DisplayObjectContainer = away.containers.DisplayObjectContainer;
    var Scene = away.containers.Scene;
    var View = away.containers.View;
    var LookAtController = away.controllers.LookAtController;
    var Billboard = away.entities.Billboard;
    var Camera = away.entities.Camera;
    var Mesh = away.entities.Mesh;
    var Skybox = away.entities.Skybox;
    var AnimationStateEvent = away.events.AnimationStateEvent;
    var AssetEvent = away.events.AssetEvent;
    var LoaderEvent = away.events.LoaderEvent;
    var AssetLibrary = away.library.AssetLibrary;
    var AssetType = away.library.AssetType;
    var PointLight = away.lights.PointLight;
    var DirectionalLight = away.lights.DirectionalLight;
    var NearDirectionalShadowMapper = away.lights.NearDirectionalShadowMapper;
    var MD5AnimParser = away.parsers.MD5AnimParser;
    var MD5MeshParser = away.parsers.MD5MeshParser;
    var PlaneGeometry = away.primitives.PlaneGeometry;
    var FogMethod = away.materials.FogMethod;
    var StaticLightPicker = away.materials.StaticLightPicker;
    var TextureMaterial = away.materials.TextureMaterial;
    var SoftShadowMapMethod = away.materials.SoftShadowMapMethod;
    var NearShadowMapMethod = away.materials.NearShadowMapMethod;
    var URLRequest = away.net.URLRequest;
    var DefaultRenderer = away.render.DefaultRenderer;
    var ImageCubeTexture = away.textures.ImageCubeTexture;
    var ImageTexture = away.textures.ImageTexture;
    var Keyboard = away.ui.Keyboard;
    var Cast = away.utils.Cast;
    var RequestAnimationFrame = away.utils.RequestAnimationFrame;

    var Intermediate_MD5Animation = (function () {
        /**
        * Constructor
        */
        function Intermediate_MD5Animation() {
            this.stateTransition = new CrossfadeTransition(0.5);
            this.currentRotationInc = 0;
            this.count = 0;
            this._time = 0;
            this.init();
        }
        /**
        * Global initialise function
        */
        Intermediate_MD5Animation.prototype.init = function () {
            this.initEngine();

            //this.initText();
            this.initLights();
            this.initMaterials();
            this.initObjects();
            this.initListeners();
        };

        /**
        * Initialise the engine
        */
        Intermediate_MD5Animation.prototype.initEngine = function () {
            this.view = new View(new DefaultRenderer());
            this.scene = this.view.scene;
            this.camera = this.view.camera;

            this.camera.projection.far = 5000;
            this.camera.z = -200;
            this.camera.y = 160;

            //setup controller to be used on the camera
            this.placeHolder = new DisplayObjectContainer();
            this.placeHolder.y = 50;
            this.cameraController = new LookAtController(this.camera, this.placeHolder);
        };

        /**
        * Create an instructions overlay
        */
        //		private initText():void
        //		{
        //			text = new TextField();
        //			text.defaultTextFormat = new TextFormat("Verdana", 11, 0xFFFFFF);
        //			text.width = 240;
        //			text.height = 100;
        //			text.selectable = false;
        //			text.mouseEnabled = false;
        //			text.text = "Cursor keys / WSAD - move\n";
        //			text.appendText("SHIFT - hold down to run\n");
        //			text.appendText("numbers 1-9 - Attack\n");
        //			text.filters = [new DropShadowFilter(1, 45, 0x0, 1, 0, 0)];
        //
        //			addChild(text);
        //		}
        /**
        * Initialise the lights
        */
        Intermediate_MD5Animation.prototype.initLights = function () {
            //create a light for shadows that mimics the sun's position in the skybox
            this.redLight = new PointLight();
            this.redLight.x = -1000;
            this.redLight.y = 200;
            this.redLight.z = -1400;
            this.redLight.color = 0xff1111;
            this.scene.addChild(this.redLight);

            this.blueLight = new PointLight();
            this.blueLight.x = 1000;
            this.blueLight.y = 200;
            this.blueLight.z = 1400;
            this.blueLight.color = 0x1111ff;
            this.scene.addChild(this.blueLight);

            this.whiteLight = new DirectionalLight(-50, -20, 10);
            this.whiteLight.color = 0xffffee;
            this.whiteLight.castsShadows = true;
            this.whiteLight.ambient = 1;
            this.whiteLight.ambientColor = 0x303040;
            this.whiteLight.shadowMapper = new NearDirectionalShadowMapper(.2);
            this.scene.addChild(this.whiteLight);

            this.lightPicker = new StaticLightPicker([this.redLight, this.blueLight, this.whiteLight]);

            //create a global shadow method
            this.shadowMapMethod = new NearShadowMapMethod(new SoftShadowMapMethod(this.whiteLight, 15, 8));
            this.shadowMapMethod.epsilon = .1;

            //create a global fog method
            this.fogMethod = new FogMethod(0, this.camera.projection.far * 0.5, 0x000000);
        };

        /**
        * Initialise the materials
        */
        Intermediate_MD5Animation.prototype.initMaterials = function () {
            //red light material
            this.redLightMaterial = new TextureMaterial();
            this.redLightMaterial.alphaBlending = true;
            this.redLightMaterial.addMethod(this.fogMethod);

            //blue light material
            this.blueLightMaterial = new TextureMaterial();
            this.blueLightMaterial.alphaBlending = true;
            this.blueLightMaterial.addMethod(this.fogMethod);

            //ground material
            this.groundMaterial = new TextureMaterial();
            this.groundMaterial.smooth = true;
            this.groundMaterial.repeat = true;
            this.groundMaterial.lightPicker = this.lightPicker;
            this.groundMaterial.shadowMethod = this.shadowMapMethod;
            this.groundMaterial.addMethod(this.fogMethod);

            //body material
            this.bodyMaterial = new TextureMaterial();
            this.bodyMaterial.gloss = 20;
            this.bodyMaterial.specular = 1.5;
            this.bodyMaterial.addMethod(this.fogMethod);
            this.bodyMaterial.lightPicker = this.lightPicker;
            this.bodyMaterial.shadowMethod = this.shadowMapMethod;

            //gob material
            this.gobMaterial = new TextureMaterial();
            this.gobMaterial.alphaBlending = true;
            this.gobMaterial.smooth = true;
            this.gobMaterial.repeat = true;
            this.gobMaterial.animateUVs = true;
            this.gobMaterial.addMethod(this.fogMethod);
            this.gobMaterial.lightPicker = this.lightPicker;
            this.gobMaterial.shadowMethod = this.shadowMapMethod;
        };

        /**
        * Initialise the scene objects
        */
        Intermediate_MD5Animation.prototype.initObjects = function () {
            //create light billboards
            var redSprite = new Billboard(this.redLightMaterial, 200, 200);
            redSprite.castsShadows = false;
            var blueSprite = new Billboard(this.blueLightMaterial, 200, 200);
            blueSprite.castsShadows = false;
            this.redLight.addChild(redSprite);
            this.blueLight.addChild(blueSprite);

            AssetLibrary.enableParser(MD5MeshParser);
            AssetLibrary.enableParser(MD5AnimParser);

            //create a rocky ground plane
            this.ground = new Mesh(new PlaneGeometry(50000, 50000, 1, 1), this.groundMaterial);
            this.ground.geometry.scaleUV(200, 200);
            this.ground.castsShadows = false;
            this.scene.addChild(this.ground);
        };

        /**
        * Initialise the listeners
        */
        Intermediate_MD5Animation.prototype.initListeners = function () {
            var _this = this;
            window.onresize = function (event) {
                return _this.onResize(event);
            };
            document.onkeydown = function (event) {
                return _this.onKeyDown(event);
            };
            document.onkeyup = function (event) {
                return _this.onKeyUp(event);
            };

            this.onResize();

            this._timer = new away.utils.RequestAnimationFrame(this.onEnterFrame, this);
            this._timer.start();

            //setup the url map for textures in the cubemap file
            var assetLoaderContext = new away.net.AssetLoaderContext();
            assetLoaderContext.dependencyBaseUrl = "assets/demos/skybox/";

            //load hellknight mesh
            AssetLibrary.addEventListener(AssetEvent.ASSET_COMPLETE, away.utils.Delegate.create(this, this.onAssetComplete));
            AssetLibrary.addEventListener(away.events.LoaderEvent.RESOURCE_COMPLETE, away.utils.Delegate.create(this, this.onResourceComplete));
            AssetLibrary.load(new URLRequest("assets/demos/hellknight/hellknight.md5mesh"), null, null, new MD5MeshParser());

            //load environment texture
            AssetLibrary.load(new URLRequest("assets/demos/skybox/grimnight_texture.cube"), assetLoaderContext);

            //load light textures
            AssetLibrary.load(new URLRequest("assets/demos/redlight.png"));
            AssetLibrary.load(new URLRequest("assets/demos/bluelight.png"));

            //load floor textures
            AssetLibrary.load(new URLRequest("assets/demos/rockbase_diffuse.jpg"));
            AssetLibrary.load(new URLRequest("assets/demos/rockbase_normals.png"));
            AssetLibrary.load(new URLRequest("assets/demos/rockbase_specular.png"));

            //load hellknight textures
            AssetLibrary.load(new URLRequest("assets/demos/hellknight/hellknight_diffuse.jpg"));
            AssetLibrary.load(new URLRequest("assets/demos/hellknight/hellknight_normals.png"));
            AssetLibrary.load(new URLRequest("assets/demos/hellknight/hellknight_specular.png"));
            AssetLibrary.load(new URLRequest("assets/demos/hellknight/gob.png"));
        };

        /**
        * Navigation and render loop
        */
        Intermediate_MD5Animation.prototype.onEnterFrame = function (dt) {
            this._time += dt;

            this.cameraController.update();

            //update character animation
            if (this.mesh) {
                this.mesh.subMeshes[1].uvTransform.offsetV = this.mesh.subMeshes[2].uvTransform.offsetV = this.mesh.subMeshes[3].uvTransform.offsetV = (-this._time / 2000 % 1);
                this.mesh.rotationY += this.currentRotationInc;
            }

            this.count += 0.01;

            this.redLight.x = Math.sin(this.count) * 1500;
            this.redLight.y = 250 + Math.sin(this.count * 0.54) * 200;
            this.redLight.z = Math.cos(this.count * 0.7) * 1500;
            this.blueLight.x = -Math.sin(this.count * 0.8) * 1500;
            this.blueLight.y = 250 - Math.sin(this.count * .65) * 200;
            this.blueLight.z = -Math.cos(this.count * 0.9) * 1500;

            this.view.render();
        };

        /**
        * Listener for asset complete event on loader
        */
        Intermediate_MD5Animation.prototype.onAssetComplete = function (event) {
            if (event.asset.assetType == AssetType.ANIMATION_NODE) {
                var node = event.asset;
                var name = event.asset.assetNamespace;

                node.name = name;
                this.animationSet.addAnimation(node);

                if (name == Intermediate_MD5Animation.IDLE_NAME || name == Intermediate_MD5Animation.WALK_NAME) {
                    node.looping = true;
                } else {
                    node.looping = false;
                    node.addEventListener(AnimationStateEvent.PLAYBACK_COMPLETE, away.utils.Delegate.create(this, this.onPlaybackComplete));
                }

                if (name == Intermediate_MD5Animation.IDLE_NAME)
                    this.stop();
            } else if (event.asset.assetType == AssetType.ANIMATION_SET) {
                this.animationSet = event.asset;
                this.animator = new SkeletonAnimator(this.animationSet, this.skeleton);
                for (var i = 0; i < Intermediate_MD5Animation.ANIM_NAMES.length; ++i)
                    AssetLibrary.load(new URLRequest("assets/demos/hellknight/" + Intermediate_MD5Animation.ANIM_NAMES[i] + ".md5anim"), null, Intermediate_MD5Animation.ANIM_NAMES[i], new MD5AnimParser());

                this.mesh.animator = this.animator;
            } else if (event.asset.assetType == AssetType.SKELETON) {
                this.skeleton = event.asset;
            } else if (event.asset.assetType == AssetType.MESH) {
                //grab mesh object and assign our material object
                this.mesh = event.asset;
                this.mesh.subMeshes[0].material = this.bodyMaterial;
                this.mesh.subMeshes[1].material = this.mesh.subMeshes[2].material = this.mesh.subMeshes[3].material = this.gobMaterial;
                this.mesh.castsShadows = true;
                this.mesh.rotationY = 180;
                this.scene.addChild(this.mesh);

                //add our lookat object to the mesh
                this.mesh.addChild(this.placeHolder);
            }
        };

        /**
        * Listener function for resource complete event on asset library
        */
        Intermediate_MD5Animation.prototype.onResourceComplete = function (event) {
            switch (event.url) {
                case 'assets/demos/skybox/grimnight_texture.cube':
                    this.cubeTexture = event.assets[0];

                    this.skyBox = new Skybox(this.cubeTexture);
                    this.scene.addChild(this.skyBox);
                    break;

                case "assets/demos/redlight.png":
                    this.redLightMaterial.texture = event.assets[0];
                    break;
                case "assets/demos/bluelight.png":
                    this.blueLightMaterial.texture = event.assets[0];
                    break;

                case "assets/demos/rockbase_diffuse.jpg":
                    this.groundMaterial.texture = event.assets[0];
                    break;
                case "assets/demos/rockbase_normals.png":
                    this.groundMaterial.normalMap = event.assets[0];
                    break;
                case "assets/demos/rockbase_specular.png":
                    this.groundMaterial.specularMap = event.assets[0];
                    break;

                case "assets/demos/hellknight/hellknight_diffuse.jpg":
                    this.bodyMaterial.texture = event.assets[0];
                    break;
                case "assets/demos/hellknight/hellknight_normals.png":
                    this.bodyMaterial.normalMap = event.assets[0];
                    break;
                case "assets/demos/hellknight/hellknight_specular.png":
                    this.bodyMaterial.specularMap = event.assets[0];
                    break;
                case "assets/demos/hellknight/gob.png":
                    this.bodyMaterial.specularMap = this.gobMaterial.texture = event.assets[0];
                    break;
            }
        };

        Intermediate_MD5Animation.prototype.onPlaybackComplete = function (event) {
            if (this.animator.activeState != event.animationState)
                return;

            this.onceAnim = null;

            this.animator.play(this.currentAnim, this.stateTransition);
            this.animator.playbackSpeed = this.isMoving ? this.movementDirection * (this.isRunning ? Intermediate_MD5Animation.RUN_SPEED : Intermediate_MD5Animation.WALK_SPEED) : Intermediate_MD5Animation.IDLE_SPEED;
        };

        Intermediate_MD5Animation.prototype.playAction = function (val /*uint*/ ) {
            this.onceAnim = Intermediate_MD5Animation.ANIM_NAMES[val + 2];
            this.animator.playbackSpeed = Intermediate_MD5Animation.ACTION_SPEED;
            this.animator.play(this.onceAnim, this.stateTransition, 0);
        };

        /**
        * Key up listener
        */
        Intermediate_MD5Animation.prototype.onKeyDown = function (event) {
            switch (event.keyCode) {
                case Keyboard.SHIFT:
                    this.isRunning = true;
                    if (this.isMoving)
                        this.updateMovement(this.movementDirection);
                    break;
                case Keyboard.UP:
                case Keyboard.W:
                case Keyboard.Z:
                    this.updateMovement(this.movementDirection = 1);
                    break;
                case Keyboard.DOWN:
                case Keyboard.S:
                    this.updateMovement(this.movementDirection = -1);
                    break;
                case Keyboard.LEFT:
                case Keyboard.A:
                case Keyboard.Q:
                    this.currentRotationInc = -Intermediate_MD5Animation.ROTATION_SPEED;
                    break;
                case Keyboard.RIGHT:
                case Keyboard.D:
                    this.currentRotationInc = Intermediate_MD5Animation.ROTATION_SPEED;
                    break;
            }
        };

        /**
        * Key down listener for animation
        */
        Intermediate_MD5Animation.prototype.onKeyUp = function (event) {
            switch (event.keyCode) {
                case Keyboard.SHIFT:
                    this.isRunning = false;
                    if (this.isMoving)
                        this.updateMovement(this.movementDirection);
                    break;
                case Keyboard.UP:
                case Keyboard.W:
                case Keyboard.Z:
                case Keyboard.DOWN:
                case Keyboard.S:
                    this.stop();
                    break;
                case Keyboard.LEFT:
                case Keyboard.A:
                case Keyboard.Q:
                case Keyboard.RIGHT:
                case Keyboard.D:
                    this.currentRotationInc = 0;
                    break;
                case Keyboard.NUMBER_1:
                    this.playAction(1);
                    break;
                case Keyboard.NUMBER_2:
                    this.playAction(2);
                    break;
                case Keyboard.NUMBER_3:
                    this.playAction(3);
                    break;
                case Keyboard.NUMBER_4:
                    this.playAction(4);
                    break;
                case Keyboard.NUMBER_5:
                    this.playAction(5);
                    break;
                case Keyboard.NUMBER_6:
                    this.playAction(6);
                    break;
                case Keyboard.NUMBER_7:
                    this.playAction(7);
                    break;
                case Keyboard.NUMBER_8:
                    this.playAction(8);
                    break;
                case Keyboard.NUMBER_9:
                    this.playAction(9);
                    break;
            }
        };

        Intermediate_MD5Animation.prototype.updateMovement = function (dir) {
            this.isMoving = true;
            this.animator.playbackSpeed = dir * (this.isRunning ? Intermediate_MD5Animation.RUN_SPEED : Intermediate_MD5Animation.WALK_SPEED);

            if (this.currentAnim == Intermediate_MD5Animation.WALK_NAME)
                return;

            this.currentAnim = Intermediate_MD5Animation.WALK_NAME;

            if (this.onceAnim)
                return;

            //update animator
            this.animator.play(this.currentAnim, this.stateTransition);
        };

        Intermediate_MD5Animation.prototype.stop = function () {
            this.isMoving = false;

            if (this.currentAnim == Intermediate_MD5Animation.IDLE_NAME)
                return;

            this.currentAnim = Intermediate_MD5Animation.IDLE_NAME;

            if (this.onceAnim)
                return;

            //update animator
            this.animator.playbackSpeed = Intermediate_MD5Animation.IDLE_SPEED;
            this.animator.play(this.currentAnim, this.stateTransition);
        };

        /**
        * stage listener for resize events
        */
        Intermediate_MD5Animation.prototype.onResize = function (event) {
            if (typeof event === "undefined") { event = null; }
            this.view.width = window.innerWidth;
            this.view.height = window.innerHeight;
        };
        Intermediate_MD5Animation.IDLE_NAME = "idle2";
        Intermediate_MD5Animation.WALK_NAME = "walk7";
        Intermediate_MD5Animation.ANIM_NAMES = new Array(Intermediate_MD5Animation.IDLE_NAME, Intermediate_MD5Animation.WALK_NAME, "attack3", "turret_attack", "attack2", "chest", "roar1", "leftslash", "headpain", "pain1", "pain_luparm", "range_attack2");
        Intermediate_MD5Animation.ROTATION_SPEED = 3;
        Intermediate_MD5Animation.RUN_SPEED = 2;
        Intermediate_MD5Animation.WALK_SPEED = 1;
        Intermediate_MD5Animation.IDLE_SPEED = 1;
        Intermediate_MD5Animation.ACTION_SPEED = 1;
        return Intermediate_MD5Animation;
    })();
    examples.Intermediate_MD5Animation = Intermediate_MD5Animation;
})(examples || (examples = {}));
//# sourceMappingURL=Intermediate_MD5Animation.js.map
