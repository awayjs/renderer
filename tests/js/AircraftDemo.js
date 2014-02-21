///<reference path="../../../build/Away3D.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />
var demos;
(function (demos) {
    (function (aircraft) {
        var AircraftDemo = (function () {
            //}
            function AircraftDemo() {
                var _this = this;
                //{ state
                this._maxStates = 2;
                this._cameraIncrement = 0;
                this._rollIncrement = 0;
                this._loopIncrement = 0;
                this._state = 0;
                this._appTime = 0;
                this._seaInitialized = false;
                this._f14Initialized = false;
                this._skyboxInitialized = false;
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
            }
            AircraftDemo.prototype.loadAssets = function () {
                this.loadAsset('assets/sea_normals.jpg');
                this.loadAsset('assets/f14d.obj');
                this.loadAsset('assets/CubeTextureTest.cube');
            };

            AircraftDemo.prototype.loadAsset = function (path) {
                var token = away.library.AssetLibrary.load(new away.net.URLRequest(path));
                token.addEventListener(away.events.LoaderEvent.RESOURCE_COMPLETE, away.utils.Delegate.create(this, this.onResourceComplete));
            };

            AircraftDemo.prototype.initParsers = function () {
                away.library.AssetLibrary.enableParser(away.parsers.OBJParser);
                away.library.AssetLibrary.enableParser(away.parsers.CubeTextureParser);
            };

            AircraftDemo.prototype.initAnimation = function () {
                this._timer = new away.utils.RequestAnimationFrame(this.render, this);
            };

            AircraftDemo.prototype.initView = function () {
                this._view = new away.containers.View(new away.render.DefaultRenderer());
                this._view.camera.z = -500;
                this._view.camera.y = 250;
                this._view.camera.rotationX = 20;
                this._view.camera.projection.near = 0.5;
                this._view.camera.projection.far = 14000;
                this._view.backgroundColor = 0x2c2c32;
                this.resize();
            };

            AircraftDemo.prototype.initializeScene = function () {
                if (this._skyboxCubeTexture && this._f14Geom && this._seaNormalTexture) {
                    this.initF14();
                    this.initSea();
                    this._timer.start();
                }
            };

            AircraftDemo.prototype.initLights = function () {
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

            AircraftDemo.prototype.initF14 = function () {
                var _this = this;
                this._f14Initialized = true;

                var f14Material = new away.materials.TextureMaterial(this._seaNormalTexture, true, true, false);
                f14Material.lightPicker = this._lightPicker;

                this._view.scene.addChild(this._f14Geom);
                this._f14Geom.transform.scale = new away.geom.Vector3D(20, 20, 20);
                this._f14Geom.rotationX = 90;
                this._f14Geom.y = 200;
                this._view.camera.lookAt(this._f14Geom.transform.position);

                document.onmousedown = function () {
                    return _this.onMouseDown();
                };
            };

            AircraftDemo.prototype.initSea = function () {
                this._seaMaterial = new away.materials.TextureMaterial(this._seaNormalTexture, true, true, false); // will be the cubemap
                this._waterMethod = new away.materials.SimpleWaterNormalMethod(this._seaNormalTexture, this._seaNormalTexture);
                var fresnelMethod = new away.materials.FresnelSpecularMethod();
                fresnelMethod.normalReflectance = .3;

                this._seaMaterial.alphaBlending = true;
                this._seaMaterial.lightPicker = this._lightPicker;
                this._seaMaterial.repeat = true;
                this._seaMaterial.animateUVs = true;
                this._seaMaterial.normalMethod = this._waterMethod;
                this._seaMaterial.addMethod(new away.materials.EnvMapMethod(this._skyboxCubeTexture));
                this._seaMaterial.specularMethod = fresnelMethod;
                this._seaMaterial.gloss = 100;
                this._seaMaterial.specular = 1;

                this._seaGeom = new away.primitives.PlaneGeometry(50000, 50000, 1, 1, true, false);
                this._seaGeom.scaleUV(100, 100);
                this._seaMesh = new away.entities.Mesh(this._seaGeom, this._seaMaterial);

                //this._view.scene.addChild( new away.primitives.SkyBox( this._skyboxCubeTexture ));
                this._view.scene.addChild(this._seaMesh);
            };

            AircraftDemo.prototype.onResourceComplete = function (e) {
                var loader = e.target;
                var numAssets = loader.baseDependency.assets.length;
                var i = 0;

                switch (e.url) {
                    case "assets/sea_normals.jpg":
                        this._seaNormalTexture = loader.baseDependency.assets[0];
                        break;
                    case 'assets/f14d.obj':
                        this._f14Geom = new away.containers.DisplayObjectContainer();
                        for (i = 0; i < numAssets; ++i) {
                            var asset = loader.baseDependency.assets[i];
                            switch (asset.assetType) {
                                case away.library.AssetType.MESH:
                                    var mesh = asset;
                                    this._f14Geom.addChild(mesh);
                                    break;
                                case away.library.AssetType.GEOMETRY:
                                    break;
                                case away.library.AssetType.MATERIAL:
                                    break;
                            }
                        }
                        break;
                    case 'assets/CubeTextureTest.cube':
                        this._skyboxCubeTexture = loader.baseDependency.assets[0];
                        break;
                }
                this.initializeScene();
            };

            AircraftDemo.prototype.render = function (dt) {
                if (this._f14Geom) {
                    this._rollIncrement += 0.02;

                    switch (this._state) {
                        case 0:
                            this._f14Geom.rotationZ = Math.sin(this._rollIncrement) * 25;
                            break;
                        case 1:
                            this._loopIncrement += 0.05;
                            this._f14Geom.z += Math.cos(this._loopIncrement) * 20;
                            this._f14Geom.y += Math.sin(this._loopIncrement) * 20;
                            this._f14Geom.rotationX += -1 * ((Math.PI / 180) * Math.atan2(this._f14Geom.z, this._f14Geom.y)); //* 20;
                            this._f14Geom.rotationZ = Math.sin(this._rollIncrement) * 25;

                            if (this._loopIncrement > (Math.PI * 2)) {
                                this._loopIncrement = 0;
                                this._state = 0;
                            }
                            break;
                    }
                }

                if (this._f14Geom) {
                    this._view.camera.lookAt(this._f14Geom.transform.position);
                }

                if (this._view.camera) {
                    this._cameraIncrement += 0.01;
                    this._view.camera.x = Math.cos(this._cameraIncrement) * 400;
                    this._view.camera.z = Math.sin(this._cameraIncrement) * 400;
                }

                if (this._f14Geom) {
                    this._view.camera.lookAt(this._f14Geom.transform.position);
                }

                if (this._seaMaterial) {
                    this._seaMesh.subMeshes[0].uvTransform.offsetV -= 0.04;
                    /*
                    this.waterMethod.water1OffsetX += .001;
                    this.waterMethod.water1OffsetY += .1;
                    this.waterMethod.water2OffsetX += .0007;
                    this.waterMethod.water2OffsetY += .6;
                    //*/
                }

                this._appTime += dt;
                this._view.render();
            };

            AircraftDemo.prototype.resize = function () {
                this._view.y = 0;
                this._view.x = 0;
                this._view.width = window.innerWidth;
                this._view.height = window.innerHeight;
            };

            AircraftDemo.prototype.onMouseDown = function () {
                this._state++;
                if (this._state >= this._maxStates) {
                    this._state = 0;
                }
            };
            return AircraftDemo;
        })();
        aircraft.AircraftDemo = AircraftDemo;
    })(demos.aircraft || (demos.aircraft = {}));
    var aircraft = demos.aircraft;
})(demos || (demos = {}));
//# sourceMappingURL=AircraftDemo.js.map
