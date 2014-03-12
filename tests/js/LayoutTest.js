///<reference path="../../../build/Away3D.next.d.ts" />
var tests;
(function (tests) {
    (function (entities) {
        var View = away.containers.View;
        var Billboard = away.entities.Billboard;
        var Vector3D = away.geom.Vector3D;
        var AssetLibrary = away.library.AssetLibrary;
        var TextureMaterial = away.materials.TextureMaterial;
        var ImageTexture = away.textures.ImageTexture;
        var URLLoader = away.net.URLLoader;
        var URLRequest = away.net.URLRequest;
        var Delegate = away.utils.Delegate;
        var RequestAnimationFrame = away.utils.RequestAnimationFrame;

        var LayoutTest = (function () {
            function LayoutTest() {
                this._move = false;
                this._billboards = new Array();
                //load an image
                AssetLibrary.load(new URLRequest('assets/256x256.png'));

                //listen for a resource complete event
                AssetLibrary.addEventListener(away.events.LoaderEvent.RESOURCE_COMPLETE, Delegate.create(this, this.onResourceComplete));
            }
            /**
            * Listener for resource complete event
            *
            * @param event
            */
            LayoutTest.prototype.onResourceComplete = function (event) {
                var _this = this;
                //get the image texture
                this._imageTexture = event.assets[0];

                //create the view
                this._view = new away.containers.View(new away.render.DefaultRenderer());

                this._projection = this._view.camera.projection;

                this._projection.coordinateSystem = away.projections.CoordinateSystem.RIGHT_HANDED;
                this._projection.focalLength = 1000;
                this._projection.preserveFocalLength = true;
                this._projection.origin.x = 0;
                this._projection.origin.y = 0;

                //create a bitmap material
                this._bitmapMaterial = new away.materials.TextureMaterial(this._imageTexture);

                var billboard;
                var numHBillboards = 2;
                var numVBillboards = 2;
                for (var i = 0; i < numHBillboards; i++) {
                    for (var j = 0; j < numVBillboards; j++) {
                        billboard = new Billboard(this._bitmapMaterial);

                        //billboard.width = 50;
                        //billboard.height = 50;
                        //billboard.pivot = new Vector3D(billboard.billboardWidth/2, billboard.billboardHeight/2, 0);
                        billboard.x = j * 300;
                        billboard.y = i * 300;
                        billboard.z = 0;

                        //billboard.orientationMode = away.base.OrientationMode.CAMERA_PLANE;
                        //billboard.alignmentMode = away.base.AlignmentMode.PIVOT_POINT;
                        this._billboards.push(billboard);

                        //add billboard to the scene
                        this._view.scene.addChild(billboard);
                    }
                }

                this._hoverControl = new away.controllers.HoverController(this._view.camera, null, 180, 0, 1000);

                document.onmousedown = function (event) {
                    return _this.onMouseDownHandler(event);
                };
                document.onmouseup = function (event) {
                    return _this.onMouseUpHandler(event);
                };
                document.onmousemove = function (event) {
                    return _this.onMouseMove(event);
                };

                window.onresize = function (event) {
                    return _this.onResize(event);
                };

                //trigger an initial resize for the view
                this.onResize(null);

                //setup the RAF for a render listener
                this._timer = new away.utils.RequestAnimationFrame(this.render, this);
                this._timer.start();
            };

            LayoutTest.prototype.onResize = function (event) {
                this._view.x = 0;
                this._view.y = 0;
                this._view.width = window.innerWidth;
                this._view.height = window.innerHeight;
            };

            LayoutTest.prototype.render = function (dt) {
                for (var i = 0; i < this._billboards.length; i++) {
                    //this._billboards[i].rotationZ +=2;
                }

                this._view.render();
            };

            LayoutTest.prototype.onMouseUpHandler = function (event) {
                this._move = false;
            };

            LayoutTest.prototype.onMouseMove = function (event) {
                if (this._move) {
                    this._hoverControl.panAngle = 0.3 * (event.clientX - this._lastMouseX) + this._lastPanAngle;
                    this._hoverControl.tiltAngle = -0.3 * (event.clientY - this._lastMouseY) + this._lastTiltAngle;
                }
            };

            LayoutTest.prototype.onMouseDownHandler = function (event) {
                this._lastPanAngle = this._hoverControl.panAngle;
                this._lastTiltAngle = this._hoverControl.tiltAngle;
                this._lastMouseX = event.clientX;
                this._lastMouseY = event.clientY;
                this._move = true;
            };
            return LayoutTest;
        })();
        entities.LayoutTest = LayoutTest;
    })(tests.entities || (tests.entities = {}));
    var entities = tests.entities;
})(tests || (tests = {}));
//# sourceMappingURL=LayoutTest.js.map
