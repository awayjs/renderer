var tests;
(function (tests) {
    ///<reference path="../../../build/Away3D.next.d.ts" />
    (function (utils) {
        var RequestAnimationFrameTest = (function () {
            function RequestAnimationFrameTest() {
                var _this = this;
                this.requestAnimationFrameTimer = new away.utils.RequestAnimationFrame(this.tick, this);
                this.requestAnimationFrameTimer.start();

                document.onmousedown = function (e) {
                    return _this.onMouseDown(e);
                };
            }
            RequestAnimationFrameTest.prototype.onMouseDown = function (e) {
                console.log('mouseDown');

                if (this.requestAnimationFrameTimer.active) {
                    this.requestAnimationFrameTimer.stop();
                } else {
                    this.requestAnimationFrameTimer.start();
                }
            };

            RequestAnimationFrameTest.prototype.tick = function (dt) {
                console.log('tick');
            };
            return RequestAnimationFrameTest;
        })();
        utils.RequestAnimationFrameTest = RequestAnimationFrameTest;
    })(tests.utils || (tests.utils = {}));
    var utils = tests.utils;
})(tests || (tests = {}));
//# sourceMappingURL=RequestAnimationFrameTest.js.map
