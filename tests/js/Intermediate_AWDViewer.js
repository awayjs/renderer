///<reference path="../../../build/Away3D.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />
/*
AWD file loading example in Away3d
Demonstrates:
How to use the Loader3D object to load an embedded internal awd model.
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
    var SkeletonAnimator = away.animators.SkeletonAnimator;
    var SkeletonClipNode = away.animators.SkeletonClipNode;
    var CrossfadeTransition = away.animators.CrossfadeTransition;
    var PerspectiveProjection = away.projections.PerspectiveProjection;
    var View3D = away.containers.View;
    var HoverController = away.controllers.HoverController;
    var AnimationStateEvent = away.events.AnimationStateEvent;
    var AssetEvent = away.events.AssetEvent;
    var Vector3D = away.geom.Vector3D;
    var AssetLibrary = away.library.AssetLibrary;
    var AssetType = away.library.AssetType;
    var Loader3D = away.containers.Loader3D;
    var AWD2Parser = away.parsers.AWDParser;
    var URLRequest = away.net.URLRequest;
    var DefaultRenderer = away.render.DefaultRenderer;
    var Keyboard = away.ui.Keyboard;
    var RequestAnimationFrame = away.utils.RequestAnimationFrame;

    var Intermediate_AWDViewer = (function () {
        /**
        * Constructor
        */
        function Intermediate_AWDViewer() {
            this._time = 0;
            this._stateTransition = new CrossfadeTransition(0.5);
            this.init();
        }
        /**
        * Global initialise function
        */
        Intermediate_AWDViewer.prototype.init = function () {
            this.initEngine();
            this.initObjects();
            this.initListeners();
        };

        /**
        * Initialise the engine
        */
        Intermediate_AWDViewer.prototype.initEngine = function () {
            //create the view
            this._view = new View3D(new DefaultRenderer());
            this._view.backgroundColor = 0x333338;

            //create custom lens
            this._view.camera.projection = new PerspectiveProjection(70);
            this._view.camera.projection.far = 5000;
            this._view.camera.projection.near = 1;

            //setup controller to be used on the camera
            this._cameraController = new HoverController(this._view.camera, null, 0, 0, 150, 10, 90);
            this._cameraController.lookAtPosition = new Vector3D(0, 60, 0);
            this._cameraController.tiltAngle = 0;
            this._cameraController.panAngle = 0;
            this._cameraController.minTiltAngle = 5;
            this._cameraController.maxTiltAngle = 60;
            this._cameraController.autoUpdate = false;
        };

        /**
        * Initialise the scene objects
        */
        Intermediate_AWDViewer.prototype.initObjects = function () {
            AssetLibrary.enableParser(AWD2Parser);

            //kickoff asset loading
            var loader = new Loader3D();
            loader.addEventListener(AssetEvent.ASSET_COMPLETE, away.utils.Delegate.create(this, this.onAssetComplete));

            loader.load(new URLRequest("assets/shambler.awd"));

            this._view.scene.addChild(loader);
        };

        /**
        * Initialise the listeners
        */
        Intermediate_AWDViewer.prototype.initListeners = function () {
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
            document.onkeydown = function (event) {
                return _this.onKeyDown(event);
            };

            this.onResize();

            this._timer = new away.utils.RequestAnimationFrame(this.onEnterFrame, this);
            this._timer.start();
        };

        /**
        * loader listener for asset complete events
        */
        Intermediate_AWDViewer.prototype.onAssetComplete = function (event) {
            if (event.asset.assetType == AssetType.ANIMATOR) {
                this._animator = event.asset;
                this._animator.play(Intermediate_AWDViewer.IDLE_NAME);
            } else if (event.asset.assetType == AssetType.ANIMATION_NODE) {
                console.log(event.asset.name);
                var node = event.asset;

                if (node.name == Intermediate_AWDViewer.IDLE_NAME) {
                    node.looping = true;
                } else {
                    node.looping = false;
                    node.addEventListener(AnimationStateEvent.PLAYBACK_COMPLETE, away.utils.Delegate.create(this, this.onPlaybackComplete));
                }
            }
        };

        /**
        * Key down listener for animation
        */
        Intermediate_AWDViewer.prototype.onKeyDown = function (event) {
            switch (event.keyCode) {
                case Keyboard.NUMBER_1:
                    this.playAction("attack01");
                    break;
                case Keyboard.NUMBER_2:
                    this.playAction("attack02");
                    break;
                case Keyboard.NUMBER_3:
                    this.playAction("attack03");
                    break;
                case Keyboard.NUMBER_4:
                    this.playAction("attack04");
                    break;
                case Keyboard.NUMBER_5:
                    this.playAction("attack05");
            }
        };

        Intermediate_AWDViewer.prototype.playAction = function (name) {
            this._animator.play(name, this._stateTransition, 0);
        };

        Intermediate_AWDViewer.prototype.onPlaybackComplete = function (event) {
            if (this._animator.activeState != event.animationState)
                return;

            this._animator.play(Intermediate_AWDViewer.IDLE_NAME, this._stateTransition);
        };

        /**
        * Render loop
        */
        Intermediate_AWDViewer.prototype.onEnterFrame = function (dt) {
            this._time += dt;

            //update camera controler
            this._cameraController.update();

            //update view
            this._view.render();
        };

        /**
        * Mouse down listener for navigation
        */
        Intermediate_AWDViewer.prototype.onMouseDown = function (event) {
            this._lastPanAngle = this._cameraController.panAngle;
            this._lastTiltAngle = this._cameraController.tiltAngle;
            this._lastMouseX = event.clientX;
            this._lastMouseY = event.clientY;
            this._move = true;
        };

        /**
        * Mouse up listener for navigation
        */
        Intermediate_AWDViewer.prototype.onMouseUp = function (event) {
            this._move = false;
        };

        Intermediate_AWDViewer.prototype.onMouseMove = function (event) {
            if (this._move) {
                this._cameraController.panAngle = 0.3 * (event.clientX - this._lastMouseX) + this._lastPanAngle;
                this._cameraController.tiltAngle = 0.3 * (event.clientY - this._lastMouseY) + this._lastTiltAngle;
            }
        };

        /**
        * Mouse wheel listener for navigation
        */
        Intermediate_AWDViewer.prototype.onMouseWheel = function (event) {
            this._cameraController.distance -= event.wheelDelta * 5;

            if (this._cameraController.distance < 100)
                this._cameraController.distance = 100;
            else if (this._cameraController.distance > 2000)
                this._cameraController.distance = 2000;
        };

        /**
        * window listener for resize events
        */
        Intermediate_AWDViewer.prototype.onResize = function (event) {
            if (typeof event === "undefined") { event = null; }
            this._view.y = 0;
            this._view.x = 0;
            this._view.width = window.innerWidth;
            this._view.height = window.innerHeight;
        };
        Intermediate_AWDViewer.IDLE_NAME = "idle";
        return Intermediate_AWDViewer;
    })();
    examples.Intermediate_AWDViewer = Intermediate_AWDViewer;
})(examples || (examples = {}));
//# sourceMappingURL=Intermediate_AWDViewer.js.map
