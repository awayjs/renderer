///<reference path="../../../build/stagegl-renderer.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />
var tests;
(function (tests) {
    (function (textures) {
        var View = away.containers.View;

        var Skybox = away.entities.Skybox;
        var LoaderEvent = away.events.LoaderEvent;

        var AssetLibrary = away.library.AssetLibrary;

        var SkyboxMaterial = away.materials.SkyboxMaterial;

        var URLRequest = away.net.URLRequest;
        var PrimitiveTorusPrefab = away.prefabs.PrimitiveTorusPrefab;
        var DefaultRenderer = away.render.DefaultRenderer;

        var CubeTextures = (function () {
            function CubeTextures() {
                var _this = this;
                away.Debug.LOG_PI_ERRORS = false;
                away.Debug.THROW_ERRORS = false;

                this._view = new View(new DefaultRenderer());
                this._view.camera.z = -500;
                this._view.camera.y = 250;
                this._view.camera.rotationX = 20;
                this._view.camera.projection.near = 0.5;
                this._view.camera.projection.far = 14000;
                this._view.backgroundColor = 0x2c2c32;

                var token = AssetLibrary.load(new URLRequest('assets/CubeTextureTest.cube'));
                token.addEventListener(LoaderEvent.RESOURCE_COMPLETE, function (event) {
                    return _this.onResourceComplete(event);
                });

                window.onresize = function (event) {
                    return _this.onResize(event);
                };

                this.onResize();

                this._timer = new away.utils.RequestAnimationFrame(this.render, this);
                this._timer.start();
            }
            CubeTextures.prototype.onResourceComplete = function (event) {
                var loader = event.target;

                switch (event.url) {
                    case 'assets/CubeTextureTest.cube':
                        this._skyboxCubeTexture = loader.baseDependency.assets[0];
                        this._skyboxMaterial = new SkyboxMaterial(this._skyboxCubeTexture);

                        this._torus = new PrimitiveTorusPrefab();
                        this._torus.material = this._skyboxMaterial;

                        this._torusMesh = this._torus.getNewObject();
                        this._view.scene.addChild(this._torusMesh);

                        this._skybox = new Skybox(this._skyboxMaterial);
                        this._view.scene.addChild(this._skybox);

                        break;
                }
            };

            CubeTextures.prototype.render = function (dt) {
                this._view.camera.rotationY += 0.01 * dt;
                this._view.render();
            };

            CubeTextures.prototype.onResize = function (event) {
                if (typeof event === "undefined") { event = null; }
                this._view.y = 0;
                this._view.x = 0;
                this._view.width = window.innerWidth;
                this._view.height = window.innerHeight;
            };
            return CubeTextures;
        })();
        textures.CubeTextures = CubeTextures;
    })(tests.textures || (tests.textures = {}));
    var textures = tests.textures;
})(tests || (tests = {}));
//# sourceMappingURL=CubeTextures.js.map
