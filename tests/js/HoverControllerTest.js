var tests;
(function (tests) {
    ///<reference path="../../../build/Away3D.next.d.ts" />
    //<reference path="../../../src/Away3D.ts" />
    (function (controllers) {
        var HoverControllerTest = (function () {
            function HoverControllerTest() {
                var _this = this;
                this._move = false;
                this._view = new away.containers.View3D();

                this._wireframeCube = new away.primitives.WireframeCube(400, 400, 400);
                this._view.scene.addChild(this._wireframeCube);

                this._hoverControl = new away.controllers.HoverController(this._view.camera, this._wireframeCube, 150, 10);

                window.onresize = function () {
                    return _this.resize();
                };

                document.onmousedown = function (e) {
                    return _this.onMouseDownHandler(e);
                };
                document.onmouseup = function (e) {
                    return _this.onMouseUpHandler(e);
                };
                document.onmousemove = function (e) {
                    return _this.onMouseMove(e);
                };

                this.resize();

                this._timer = new away.utils.RequestAnimationFrame(this.render, this);
                this._timer.start();
            }
            HoverControllerTest.prototype.resize = function () {
                this._view.y = 0;
                this._view.x = 0;
                this._view.width = window.innerWidth;
                this._view.height = window.innerHeight;
            };

            HoverControllerTest.prototype.render = function (dt) {
                this._view.render();
            };

            HoverControllerTest.prototype.onMouseUpHandler = function (e) {
                this._move = false;
            };

            HoverControllerTest.prototype.onMouseMove = function (e) {
                if (this._move) {
                    this._hoverControl.panAngle = 0.3 * (e.clientX - this._lastMouseX) + this._lastPanAngle;
                    this._hoverControl.tiltAngle = 0.3 * (e.clientY - this._lastMouseY) + this._lastTiltAngle;
                }
            };

            HoverControllerTest.prototype.onMouseDownHandler = function (e) {
                console.log('onMouseDownHandler');
                this._lastPanAngle = this._hoverControl.panAngle;
                this._lastTiltAngle = this._hoverControl.tiltAngle;
                this._lastMouseX = e.clientX;
                this._lastMouseY = e.clientY;
                this._move = true;
            };
            return HoverControllerTest;
        })();
        controllers.HoverControllerTest = HoverControllerTest;
    })(tests.controllers || (tests.controllers = {}));
    var controllers = tests.controllers;
})(tests || (tests = {}));
//# sourceMappingURL=HoverControllerTest.js.map
