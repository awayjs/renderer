///<reference path="../../../build/Away3D.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />
/*
Vertex animation example in Away3d using the MD2 format
Demonstrates:
How to use the AssetLibrary class to load an embedded internal md2 model.
How to clone an asset from the AssetLibrary and apply different mateirals.
How to load animations into an animation set and apply to individual meshes.
Code by Rob Bateman
rob@infiniteturtles.co.uk
http://www.infiniteturtles.co.uk
Perelith Knight, by James Green (no email given)
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
    var Intermediate_PerelithKnight = (function () {
        /**
        * Constructor
        */
        function Intermediate_PerelithKnight() {
            var _this = this;
            this._meshInitialised = false;
            this._animationSetInitialised = false;
            this._sceneInitialised = false;
            //array of materials for random sampling
            this._pKnightTextures = new Array("assets/demos/pknight1.png", "assets/demos/pknight2.png", "assets/demos/pknight3.png", "assets/demos/pknight4.png");
            this._pKnightMaterials = new Array();
            this._time = 0;
            this._move = false;
            this._lookAtPosition = new away.geom.Vector3D();
            //setup the view
            this._view = new away.containers.View(new away.render.DefaultRenderer());

            //setup the camera for optimal rendering
            this._view.camera.projection.far = 5000;

            //setup controller to be used on the camera
            this._cameraController = new away.controllers.HoverController(this._view.camera, null, 45, 20, 2000, 5);

            //setup the help text
            /*
            var text:TextField = new TextField();
            text.defaultTextFormat = new TextFormat("Verdana", 11, 0xFFFFFF);
            text.embedFonts = true;
            text.antiAliasType = AntiAliasType.ADVANCED;
            text.gridFitType = GridFitType.PIXEL;
            text.width = 240;
            text.height = 100;
            text.selectable = false;
            text.mouseEnabled = false;
            text.text = "Click and drag - rotate\n" +
            "Cursor keys / WSAD / ZSQD - move\n" +
            "Scroll wheel - zoom";
            
            text.filters = [new DropShadowFilter(1, 45, 0x0, 1, 0, 0)];
            
            addChild(text);
            */
            //setup the lights for the scene
            this._light = new away.lights.DirectionalLight(-0.5, -1, -1);
            this._light.ambient = 0.4;
            this._lightPicker = new away.materials.StaticLightPicker([this._light]);
            this._view.scene.addChild(this._light);

            //setup listeners on AssetLibrary
            away.library.AssetLibrary.addEventListener(away.events.AssetEvent.ASSET_COMPLETE, away.utils.Delegate.create(this, this.onAssetComplete));
            away.library.AssetLibrary.addEventListener(away.events.LoaderEvent.RESOURCE_COMPLETE, away.utils.Delegate.create(this, this.onResourceComplete));

            //load perilith knight textures
            away.library.AssetLibrary.load(new away.net.URLRequest("assets/demos/pknight1.png"));
            away.library.AssetLibrary.load(new away.net.URLRequest("assets/demos/pknight2.png"));
            away.library.AssetLibrary.load(new away.net.URLRequest("assets/demos/pknight3.png"));
            away.library.AssetLibrary.load(new away.net.URLRequest("assets/demos/pknight4.png"));

            //load floor texture
            away.library.AssetLibrary.load(new away.net.URLRequest("assets/demos/floor_diffuse.jpg"));

            //load perelith knight data
            away.library.AssetLibrary.load(new away.net.URLRequest("assets/demos/pknight.md2"), null, null, new away.parsers.MD2Parser());

            //create a global shadow map method
            this._shadowMapMethod = new away.materials.FilteredShadowMapMethod(this._light);
            this._shadowMapMethod.epsilon = 0.2;

            //setup floor material
            this._floorMaterial = new away.materials.TextureMaterial();
            this._floorMaterial.lightPicker = this._lightPicker;
            this._floorMaterial.specular = 0;
            this._floorMaterial.ambient = 1;
            this._floorMaterial.shadowMethod = this._shadowMapMethod;
            this._floorMaterial.repeat = true;

            for (var i = 0; i < this._pKnightTextures.length; i++) {
                var knightMaterial = new away.materials.TextureMaterial();

                //knightMaterial.normalMap = Cast.bitmapTexture(BitmapFilterEffects.normalMap(bitmapData));
                //knightMaterial.specularMap = Cast.bitmapTexture(BitmapFilterEffects.outline(bitmapData));
                knightMaterial.lightPicker = this._lightPicker;
                knightMaterial.gloss = 30;
                knightMaterial.specular = 1;
                knightMaterial.ambient = 1;
                knightMaterial.shadowMethod = this._shadowMapMethod;
                this._pKnightMaterials.push(knightMaterial);
            }

            //setup the floor
            this._floor = new away.entities.Mesh(new away.primitives.PlaneGeometry(5000, 5000), this._floorMaterial);
            this._floor.geometry.scaleUV(5, 5);

            //setup the scene
            this._view.scene.addChild(this._floor);

            //add stats panel
            //addChild(_stats = new AwayStats(_view));
            //add listeners
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
            document.onkeydown = function (event) {
                return _this.onKeyDown(event);
            };
            document.onkeyup = function (event) {
                return _this.onKeyUp(event);
            };
            this.onResize();

            this._timer = new away.utils.RequestAnimationFrame(this.onEnterFrame, this);
            this._timer.start();
        }
        /**
        * Navigation and render loop
        */
        Intermediate_PerelithKnight.prototype.onEnterFrame = function (dt) {
            this._time += dt;

            if (this._keyUp)
                this._lookAtPosition.x -= 10;
            if (this._keyDown)
                this._lookAtPosition.x += 10;
            if (this._keyLeft)
                this._lookAtPosition.z -= 10;
            if (this._keyRight)
                this._lookAtPosition.z += 10;

            this._cameraController.lookAtPosition = this._lookAtPosition;

            this._view.render();
        };

        /**
        * Listener for asset complete event on loader
        */
        Intermediate_PerelithKnight.prototype.onAssetComplete = function (event) {
            var asset = event.asset;

            switch (asset.assetType) {
                case away.library.AssetType.MESH:
                    this._mesh = event.asset;

                    //adjust the mesh
                    this._mesh.y = 120;
                    this._mesh.transform.scale = new away.geom.Vector3D(5, 5, 5);

                    this._meshInitialised = true;

                    break;
                case away.library.AssetType.ANIMATION_SET:
                    this._animationSet = event.asset;
                    this._animationSetInitialised = true;
                    break;
            }

            if (this._animationSetInitialised && this._meshInitialised && !this._sceneInitialised) {
                this._sceneInitialised = true;

                //create 20 x 20 different clones of the knight
                var numWide = 20;
                var numDeep = 20;
                var k = 0;
                for (var i = 0; i < numWide; i++) {
                    for (var j = 0; j < numDeep; j++) {
                        //clone mesh
                        var clone = this._mesh.clone();
                        clone.x = (i - (numWide - 1) / 2) * 5000 / numWide;
                        clone.z = (j - (numDeep - 1) / 2) * 5000 / numDeep;
                        clone.castsShadows = true;
                        clone.material = this._pKnightMaterials[Math.floor(Math.random() * this._pKnightMaterials.length)];
                        this._view.scene.addChild(clone);

                        //create animator
                        var vertexAnimator = new away.animators.VertexAnimator(this._animationSet);

                        //play specified state
                        vertexAnimator.play(this._animationSet.animationNames[Math.floor(Math.random() * this._animationSet.animationNames.length)], null, Math.random() * 1000);
                        clone.animator = vertexAnimator;
                        k++;
                    }
                }
            }
        };

        /**
        * Listener function for resource complete event on asset library
        */
        Intermediate_PerelithKnight.prototype.onResourceComplete = function (event) {
            var assets = event.assets;
            var length = assets.length;

            for (var c = 0; c < length; c++) {
                var asset = assets[c];

                console.log(asset.name, event.url);

                switch (event.url) {
                    case "assets/demos/floor_diffuse.jpg":
                        this._floorMaterial.texture = asset;
                        break;

                    case "assets/demos/pknight1.png":
                    case "assets/demos/pknight2.png":
                    case "assets/demos/pknight3.png":
                    case "assets/demos/pknight4.png":
                        this._pKnightMaterials[this._pKnightTextures.indexOf(event.url)].texture = asset;
                        break;

                    case "assets/demos/pknight.md2":
                        break;
                }
            }
        };

        /**
        * Key down listener for animation
        */
        Intermediate_PerelithKnight.prototype.onKeyDown = function (event) {
            switch (event.keyCode) {
                case 38:
                case 87:
                case 90:
                    this._keyUp = true;
                    break;
                case 40:
                case 83:
                    this._keyDown = true;
                    break;
                case 37:
                case 65:
                case 81:
                    this._keyLeft = true;
                    break;
                case 39:
                case 68:
                    this._keyRight = true;
                    break;
            }
        };

        /**
        * Key up listener
        */
        Intermediate_PerelithKnight.prototype.onKeyUp = function (event) {
            switch (event.keyCode) {
                case 38:
                case 87:
                case 90:
                    this._keyUp = false;
                    break;
                case 40:
                case 83:
                    this._keyDown = false;
                    break;
                case 37:
                case 65:
                case 81:
                    this._keyLeft = false;
                    break;
                case 39:
                case 68:
                    this._keyRight = false;
                    break;
            }
        };

        /**
        * Mouse down listener for navigation
        */
        Intermediate_PerelithKnight.prototype.onMouseDown = function (event) {
            this._lastPanAngle = this._cameraController.panAngle;
            this._lastTiltAngle = this._cameraController.tiltAngle;
            this._lastMouseX = event.clientX;
            this._lastMouseY = event.clientY;
            this._move = true;
        };

        /**
        * Mouse up listener for navigation
        */
        Intermediate_PerelithKnight.prototype.onMouseUp = function (event) {
            this._move = false;
        };

        Intermediate_PerelithKnight.prototype.onMouseMove = function (event) {
            if (this._move) {
                this._cameraController.panAngle = 0.3 * (event.clientX - this._lastMouseX) + this._lastPanAngle;
                this._cameraController.tiltAngle = 0.3 * (event.clientY - this._lastMouseY) + this._lastTiltAngle;
            }
        };

        /**
        * Mouse wheel listener for navigation
        */
        Intermediate_PerelithKnight.prototype.onMouseWheel = function (event) {
            this._cameraController.distance -= event.wheelDelta * 5;

            if (this._cameraController.distance < 100)
                this._cameraController.distance = 100;
            else if (this._cameraController.distance > 2000)
                this._cameraController.distance = 2000;
        };

        /**
        * Stage listener for resize events
        */
        Intermediate_PerelithKnight.prototype.onResize = function (event) {
            if (typeof event === "undefined") { event = null; }
            this._view.y = 0;
            this._view.x = 0;
            this._view.width = window.innerWidth;
            this._view.height = window.innerHeight;
        };
        return Intermediate_PerelithKnight;
    })();
    examples.Intermediate_PerelithKnight = Intermediate_PerelithKnight;
})(examples || (examples = {}));
//# sourceMappingURL=Intermediate_PerelithKnight.js.map
