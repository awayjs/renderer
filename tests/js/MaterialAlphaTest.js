var demos;
(function (demos) {
    ///<reference path="../../../build/Away3D.next.d.ts" />
    (function (materials) {
        var MaterialAlphaTest = (function () {
            function MaterialAlphaTest() {
                var _this = this;
                this.height = 0;
                this.meshes = new Array();
                this.aValues = [0, .1, .5, .8, .9, .99, 1];
                this.aValuesP = 0;
                this.t = 0;
                //away.Debug.LOG_PI_ERRORS    = false;
                away.Debug.THROW_ERRORS = false;

                this.view = new away.containers.View3D();
                this.raf = new away.utils.RequestAnimationFrame(this.render, this);

                this.light = new away.lights.DirectionalLight();
                this.light.color = 0xFFFFFF;
                this.light.direction = new away.geom.Vector3D(1, 1, 0);
                this.light.ambient = 0;
                this.light.ambientColor = 0xFFFFFF;
                this.light.diffuse = 1;
                this.light.specular = 1;

                this.lightB = new away.lights.DirectionalLight();
                this.lightB.color = 0xFF0000;
                this.lightB.direction = new away.geom.Vector3D(-1, 0, 1);
                this.lightB.ambient = 0;
                this.lightB.ambientColor = 0xFFFFFF;
                this.lightB.diffuse = 1;
                this.lightB.specular = 1;

                this.view.scene.addChild(this.light);
                this.view.scene.addChild(this.lightB);

                this.view.backgroundColor = 0x222222;

                away.library.AssetLibrary.enableParser(away.loaders.OBJParser);

                this.token = away.library.AssetLibrary.load(new away.net.URLRequest('assets/platonic.obj'));
                this.token.addEventListener(away.events.LoaderEvent.RESOURCE_COMPLETE, this.onResourceComplete, this);

                this.token = away.library.AssetLibrary.load(new away.net.URLRequest('assets/dots.png'));
                this.token.addEventListener(away.events.LoaderEvent.RESOURCE_COMPLETE, this.onResourceComplete, this);

                window.onresize = function () {
                    return _this.resize();
                };

                document.onmousedown = function () {
                    return _this.mouseDown();
                };
            }
            MaterialAlphaTest.prototype.mouseDown = function () {
                this.torusColorMaterial.alpha = this.torusTextureMaterial.alpha = this.loadedMeshMaterial.alpha = this.aValues[this.aValuesP];

                //this.torusColorMaterial.alpha =this.aValues[this.aValuesP];
                alert('Alpha: ' + this.aValues[this.aValuesP]);

                this.aValuesP++;

                if (this.aValuesP > this.aValues.length - 1)
                    this.aValuesP = 0;

                this.render();
            };

            MaterialAlphaTest.prototype.render = function () {
                if (this.meshes) {
                    for (var c = 0; c < this.meshes.length; c++) {
                        this.meshes[c].rotationY += .35;
                    }
                }

                this.view.render();
            };

            MaterialAlphaTest.prototype.onResourceComplete = function (e) {
                var loader = e.target;
                var l = loader.baseDependency.assets.length;

                for (var c = 0; c < l; c++) {
                    var d = loader.baseDependency.assets[c];

                    console.log(d.name);

                    switch (d.assetType) {
                        case away.library.AssetType.MESH:
                            var mesh = away.library.AssetLibrary.getAsset(d.name);

                            this.t800M = mesh;

                            if (d.name == 'Mesh_g0') {
                                this.t800M = mesh;
                                mesh.y = -400;
                                mesh.scale(5);
                            } else {
                                mesh.scale(3.5);
                            }

                            if (this.loadedMeshMaterial)
                                mesh.material = this.loadedMeshMaterial;
                            mesh.material.bothSides = true;
                            this.view.scene.addChild(mesh);
                            this.meshes.push(mesh);

                            this.raf.start();
                            break;

                        case away.library.AssetType.TEXTURE:
                            // Loaded Texture
                            var tx = away.library.AssetLibrary.getAsset(d.name);

                            // Light Picker
                            this.staticLightPicker = new away.materials.StaticLightPicker([this.light, this.lightB]);

                            // Material for loaded mesh
                            this.loadedMeshMaterial = new away.materials.TextureMaterial(tx, true, true, false);
                            this.loadedMeshMaterial.lightPicker = this.staticLightPicker;
                            this.loadedMeshMaterial.alpha = 1;
                            this.loadedMeshMaterial.bothSides = true;

                            if (this.t800M) {
                                this.t800M.material = this.loadedMeshMaterial;
                            }

                            // MultiMaterial
                            this.multiMat = new away.materials.TextureMultiPassMaterial(tx, true, true, false);
                            this.multiMat.lightPicker = this.staticLightPicker;

                            // Torus
                            var torus = new away.primitives.TorusGeometry(150, 50, 64, 64);

                            // Torus Texture Material
                            this.torusTextureMaterial = new away.materials.TextureMaterial(tx, true, true, false);
                            this.torusTextureMaterial.lightPicker = this.staticLightPicker;
                            this.torusTextureMaterial.bothSides = true;
                            this.torusTextureMaterial.alpha = .8;

                            // Torus Mesh ( left )
                            var torusMesh = new away.entities.Mesh(torus, this.torusTextureMaterial);
                            torusMesh.rotationX = 90;
                            torusMesh.x = 600;
                            this.meshes.push(torusMesh);
                            this.view.scene.addChild(torusMesh);

                            // Torus Color Material
                            this.torusColorMaterial = new away.materials.ColorMaterial(0x0090ff);
                            this.torusColorMaterial.lightPicker = this.staticLightPicker;
                            this.torusColorMaterial.alpha = .8;
                            this.torusColorMaterial.bothSides = true;

                            var cube = new away.primitives.CubeGeometry(300, 300, 300, 20, 20, 20);

                            // Torus Mesh ( right )
                            torusMesh = new away.entities.Mesh(cube, this.torusColorMaterial);
                            torusMesh.rotationX = 90;
                            torusMesh.x = -600;
                            this.meshes.push(torusMesh);
                            this.view.scene.addChild(torusMesh);

                            this.capsuleColorMAterial = new away.materials.ColorMaterial(0x00ffff);
                            this.capsuleColorMAterial.lightPicker = this.staticLightPicker;

                            var caps = new away.primitives.CapsuleGeometry(100, 200);

                            // Torus Mesh ( right )
                            torusMesh = new away.entities.Mesh(caps, this.capsuleColorMAterial);

                            //torusMesh.rotationX                               = 90;
                            //torusMesh.scale( 2 );
                            this.meshes.push(torusMesh);
                            this.view.scene.addChild(torusMesh);

                            this.torusColorMaterial.alpha = this.torusTextureMaterial.alpha = this.loadedMeshMaterial.alpha = 1;

                            break;
                    }
                }

                this.render();
                this.resize();
            };

            MaterialAlphaTest.prototype.resize = function () {
                this.view.y = 0;
                this.view.x = 0;

                this.view.width = window.innerWidth;
                this.view.height = window.innerHeight;
            };
            return MaterialAlphaTest;
        })();
        materials.MaterialAlphaTest = MaterialAlphaTest;
    })(demos.materials || (demos.materials = {}));
    var materials = demos.materials;
})(demos || (demos = {}));
//# sourceMappingURL=MaterialAlphaTest.js.map
