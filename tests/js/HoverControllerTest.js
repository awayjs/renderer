///<reference path="../../../build/stagegl-renderer.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />
var tests;
(function (tests) {
    (function (controllers) {
        var View = away.containers.View;
        var HoverController = away.controllers.HoverController;

        var PrimitiveCubePrefab = away.prefabs.PrimitiveCubePrefab;
        var DefaultRenderer = away.render.DefaultRenderer;
        var RequestAnimationFrame = away.utils.RequestAnimationFrame;

        var HoverControllerTest = (function () {
            function HoverControllerTest() {
                var _this = this;
                this._move = false;
                this._view = new View(new DefaultRenderer());

                this._cube = new PrimitiveCubePrefab(400, 400, 400);
                this._cube.geometryType = "lineSubGeometry";
                this._mesh = this._cube.getNewObject();
                this._view.scene.addChild(this._mesh);

                this._hoverControl = new HoverController(this._view.camera, this._mesh, 150, 10);

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

                this._timer = new RequestAnimationFrame(this.render, this);
                this._timer.start();
            }
            HoverControllerTest.prototype.onResize = function (event) {
                if (typeof event === "undefined") { event = null; }
                this._view.y = 0;
                this._view.x = 0;
                this._view.width = window.innerWidth;
                this._view.height = window.innerHeight;
            };

            HoverControllerTest.prototype.render = function (dt) {
                this._view.render();
            };

            HoverControllerTest.prototype.onMouseUp = function (event) {
                this._move = false;
            };

            HoverControllerTest.prototype.onMouseMove = function (event) {
                if (this._move) {
                    this._hoverControl.panAngle = 0.3 * (event.clientX - this._lastMouseX) + this._lastPanAngle;
                    this._hoverControl.tiltAngle = 0.3 * (event.clientY - this._lastMouseY) + this._lastTiltAngle;
                }
            };

            HoverControllerTest.prototype.onMouseDown = function (event) {
                this._lastPanAngle = this._hoverControl.panAngle;
                this._lastTiltAngle = this._hoverControl.tiltAngle;
                this._lastMouseX = event.clientX;
                this._lastMouseY = event.clientY;
                this._move = true;
            };
            return HoverControllerTest;
        })();
        controllers.HoverControllerTest = HoverControllerTest;
    })(tests.controllers || (tests.controllers = {}));
    var controllers = tests.controllers;
})(tests || (tests = {}));
//# sourceMappingURL=HoverControllerTest.js.map
