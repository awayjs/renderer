var tests;
(function (tests) {
    ///<reference path="../../../build/Away3D.next.d.ts" />
    //<reference path="../../../src/Away3D.ts" />
    (function (render) {
        var RenderTest = (function () {
            function RenderTest() {
                away.Debug.THROW_ERRORS = false;

                this.stage = new away.display.Stage();
                this.sManager = away.managers.Stage3DManager.getInstance(this.stage);
                this.sProxy = this.sManager.getStage3DProxy(0);

                console.log('away.display.Stage', this.stage);
                console.log('away.managers.Stage3DManager', this.sManager);
                console.log('away.managers.Stage3DProxy', this.sProxy);

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
