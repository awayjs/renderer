///<reference path="../../build/stagegl-renderer.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />
var tests;
(function (tests) {
    (function (parsers) {
        var View = away.containers.View;

        var AssetEvent = away.events.AssetEvent;
        var LoaderEvent = away.events.LoaderEvent;
        var Vector3D = away.geom.Vector3D;
        var AssetLibrary = away.library.AssetLibrary;

        var URLRequest = away.net.URLRequest;
        var OBJParser = away.parsers.OBJParser;
        var DefaultRenderer = away.render.DefaultRenderer;
        var RequestAnimationFrame = away.utils.RequestAnimationFrame;

        var ObjParserTest = (function () {
            function ObjParserTest() {
                var _this = this;
                away.Debug.LOG_PI_ERRORS = true;
                away.Debug.THROW_ERRORS = false;

                AssetLibrary.enableParser(OBJParser);

                this._token = AssetLibrary.load(new URLRequest('assets/t800.obj'));
                this._token.addEventListener(LoaderEvent.RESOURCE_COMPLETE, function (event) {
                    return _this.onResourceComplete(event);
                });
                this._token.addEventListener(AssetEvent.ASSET_COMPLETE, function (event) {
                    return _this.onAssetComplete(event);
                });

                this._view = new View(new DefaultRenderer());
                this._timer = new RequestAnimationFrame(this.render, this);

                window.onresize = function (event) {
                    return _this.resize(event);
                };

                this._timer.start();
                this.resize();
            }
            ObjParserTest.prototype.resize = function (event) {
                if (typeof event === "undefined") { event = null; }
                this._view.y = 0;
                this._view.x = 0;
                this._view.width = window.innerWidth;
                this._view.height = window.innerHeight;
            };

            ObjParserTest.prototype.render = function (dt) {
                if (this._t800)
                    this._t800.rotationY += 1;

                this._view.render();
            };

            ObjParserTest.prototype.onAssetComplete = function (event) {
                console.log('------------------------------------------------------------------------------');
                console.log('away.events.AssetEvent.ASSET_COMPLETE', AssetLibrary.getAsset(event.asset.name));
                console.log('------------------------------------------------------------------------------');
            };

            ObjParserTest.prototype.onResourceComplete = function (event) {
                console.log('------------------------------------------------------------------------------');
                console.log('away.events.LoaderEvent.RESOURCE_COMPLETE', event);
                console.log('------------------------------------------------------------------------------');

                console.log(AssetLibrary.getAsset('Mesh_g0'));

                this._t800 = AssetLibrary.getAsset('Mesh_g0');
                this._t800.y = -200;
                this._t800.transform.scale = new Vector3D(4, 4, 4);

                this._view.scene.addChild(this._t800);
            };
            return ObjParserTest;
        })();
        parsers.ObjParserTest = ObjParserTest;
    })(tests.parsers || (tests.parsers = {}));
    var parsers = tests.parsers;
})(tests || (tests = {}));
//# sourceMappingURL=ObjParserTest.js.map
