///<reference path="../../../build/Away3D.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />
var tests;
(function (tests) {
    (function (textures) {
        var CubeTextures = (function () {
            function CubeTextures() {
                var _this = this;
                this._appTime = 0;
                away.Debug.LOG_PI_ERRORS = false;
                away.Debug.THROW_ERRORS = false;

                this.initView();
                this.initLights();
                this.initAnimation();
                this.initParsers();
                this.loadAssets();

                window.onresize = function () {
                    return _this.resize();
                };
                document.onmousedown = function (event) {
                    return _this.render(0);
                };
            }
            CubeTextures.prototype.loadAssets = function () {
                this.loadAsset('assets/CubeTextureTest.cube');
            };

            CubeTextures.prototype.loadAsset = function (path) {
                var token = away.library.AssetLibrary.load(new away.net.URLRequest(path));
                token.addEventListener(away.events.LoaderEvent.RESOURCE_COMPLETE, away.utils.Delegate.create(this, this.onResourceComplete));
            };

            CubeTextures.prototype.initParsers = function () {
                away.library.AssetLibrary.enableParser(away.parsers.CubeTextureParser);
            };

            CubeTextures.prototype.initAnimation = function () {
                //this._timer = new away.utils.RequestAnimationFrame( this.render, this );
            };

            CubeTextures.prototype.initView = function () {
                this._view = new away.containers.View(new away.render.DefaultRenderer());
                this._view.camera.z = -500;
                this._view.camera.y = 250;
                this._view.camera.rotationX = 20;
                this._view.camera.projection.near = 0.5;
                this._view.camera.projection.far = 14000;
                this._view.backgroundColor = 0x2c2c32;
                this.resize();
            };

            CubeTextures.prototype.initLights = function () {
                var light = new away.lights.DirectionalLight();
                light.color = 0x974523;
                light.direction = new away.geom.Vector3D(-300, -300, -5000);
                light.ambient = 1;
                light.ambientColor = 0x7196ac;
                light.diffuse = 1.2;
                light.specular = 1.1;
                this._view.scene.addChild(light);

                this._lightPicker = new away.materials.StaticLightPicker([light]);
            };

            CubeTextures.prototype.onResourceComplete = function (e) {
                var loader = e.target;

                switch (e.url) {
                    case 'assets/CubeTextureTest.cube':
                        this._skyboxCubeTexture = loader.baseDependency.assets[0];

                        this._torus = new away.primitives.TorusGeometry();

                        this._cubeMaterial = new away.materials.SkyboxMaterial(this._skyboxCubeTexture);
                        this._torusMesh = new away.entities.Mesh(this._torus, this._cubeMaterial);

                        this._view.scene.addChild(this._torusMesh);

                        this._skybox = new away.entities.Skybox(this._skyboxCubeTexture);
                        this._view.scene.addChild(this._skybox);

                        break;
                }

                this._timer = new away.utils.RequestAnimationFrame(this.render, this);
                this._timer.start();
            };

            CubeTextures.prototype.render = function (dt) {
                this._appTime += dt;
                this._view.camera.rotationY += 0.01 * dt;
                this._view.render();
            };

            CubeTextures.prototype.resize = function () {
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
