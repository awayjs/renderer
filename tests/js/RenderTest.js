///<reference path="../../../build/Away3D.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />
var tests;
(function (tests) {
    (function (render) {
        var RenderTest = (function () {
            function RenderTest() {
                away.Debug.THROW_ERRORS = false;

                this.scene = new away.containers.Scene();
                this.sManager = away.managers.StageGLManager.getInstance();
                this.stageGL = this.sManager.getFreeStageGL();

                console.log('away.display.Stage', this.scene);
                console.log('away.managers.StageGLManager', this.sManager);
                console.log('away.managers.StageGLProxy', this.stageGL);

                this.dRenderer = new away.render.DefaultRenderer();

                console.log('away.render.DefaultRenderer', this.dRenderer);
            }
            RenderTest.prototype.onContextCreated = function (e) {
                away.Debug.log('onContextCreated', e);
            };

            RenderTest.prototype.onContextReCreated = function (e) {
                away.Debug.log('onContextReCreated', e);
            };

            RenderTest.prototype.onContextDisposed = function (e) {
                away.Debug.log('onContextDisposed', e);
            };
            return RenderTest;
        })();
        render.RenderTest = RenderTest;
    })(tests.render || (tests.render = {}));
    var render = tests.render;
})(tests || (tests = {}));
//# sourceMappingURL=RenderTest.js.map
