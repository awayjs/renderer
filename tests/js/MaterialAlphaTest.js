///<reference path="../../build/stagegl-extensions.next.d.ts" />
var tests;
(function (tests) {
    (function (materials) {
        var View = away.containers.View;

        var LoaderEvent = away.events.LoaderEvent;
        var Vector3D = away.geom.Vector3D;
        var AssetLibrary = away.library.AssetLibrary;

        var AssetType = away.library.AssetType;
        var DirectionalLight = away.entities.DirectionalLight;
        var StaticLightPicker = away.materials.StaticLightPicker;
        var TriangleMethodMaterial = away.materials.TriangleMethodMaterial;

        var URLRequest = away.net.URLRequest;
        var OBJParser = away.parsers.OBJParser;
        var PrimitiveTorusPrefab = away.prefabs.PrimitiveTorusPrefab;
        var PrimitiveCubePrefab = away.prefabs.PrimitiveCubePrefab;
        var PrimitiveCapsulePrefab = away.prefabs.PrimitiveCapsulePrefab;

        var DefaultRenderer = away.render.DefaultRenderer;

        var RequestAnimationFrame = away.utils.RequestAnimationFrame;

        var MaterialAlphaTest = (function () {
            function MaterialAlphaTest() {
                var _this = this;
                this.height = 0;
                this.meshes = new Array();
                this.aValues = Array(0, .1, .5, .8, .9, .99, 1);
                this.aValuesP = 0;
                away.Debug.LOG_PI_ERRORS = false;
                away.Debug.THROW_ERRORS = false;

                this.view = new View(new DefaultRenderer());
                this.raf = new RequestAnimationFrame(this.render, this);
                this.onResize();

                this.light = new DirectionalLight();
                this.light.color = 0xFFFFFF;
                this.light.direction = new Vector3D(1, 1, 0);
                this.light.ambient = 0;
                this.light.ambientColor = 0xFFFFFF;
                this.light.diffuse = 1;
                this.light.specular = 1;

                this.lightB = new DirectionalLight();
                this.lightB.color = 0xFF0000;
                this.lightB.direction = new Vector3D(-1, 0, 1);
                this.lightB.ambient = 0;
                this.lightB.ambientColor = 0xFFFFFF;
                this.lightB.diffuse = 1;
                this.lightB.specular = 1;

                this.view.scene.addChild(this.light);
                this.view.scene.addChild(this.lightB);

                this.view.backgroundColor = 0x222222;

                AssetLibrary.enableParser(OBJParser);

                this.token = AssetLibrary.load(new URLRequest('assets/platonic.obj'));
                this.token.addEventListener(LoaderEvent.RESOURCE_COMPLETE, function (event) {
                    return _this.onResourceComplete(event);
                });

                this.token = AssetLibrary.load(new URLRequest('assets/dots.png'));
                this.token.addEventListener(LoaderEvent.RESOURCE_COMPLETE, function (event) {
                    return _this.onResourceComplete(event);
                });

                window.onresize = function (event) {
                    return _this.onResize(event);
                };
                document.onmousedown = function (event) {
                    return _this.onMouseDown(event);
                };
            }
            MaterialAlphaTest.prototype.onMouseDown = function (event) {
                this.cubeColorMaterial.alpha = this.torusTextureMaterial.alpha = this.loadedMeshMaterial.alpha = this.aValues[this.aValuesP];

                alert('Alpha: ' + this.aValues[this.aValuesP]);

                this.aValuesP++;

                if (this.aValuesP > this.aValues.length - 1)
                    this.aValuesP = 0;
            };

            MaterialAlphaTest.prototype.render = function (dt) {
                if (this.meshes)
                    for (var c = 0; c < this.meshes.length; c++)
                        this.meshes[c].rotationY += .35;

                this.view.render();
            };

            MaterialAlphaTest.prototype.onResourceComplete = function (event) {
                var loader = event.target;
                var l = loader.baseDependency.assets.length;

                for (var c = 0; c < l; c++) {
                    var d = loader.baseDependency.assets[c];

                    console.log(d.name);

                    switch (d.assetType) {
                        case AssetType.MESH:
                            var mesh = d;

                            this.loadedMesh = mesh;

                            if (d.name == 'Mesh_g0') {
                                this.loadedMesh = mesh;
                                mesh.y = -400;
                                mesh.transform.scale = new away.geom.Vector3D(5, 5, 5);
                            } else {
                                mesh.transform.scale = new away.geom.Vector3D(3.5, 3.5, 3.5);
                            }

                            if (this.loadedMeshMaterial)
                                mesh.material = this.loadedMeshMaterial;

                            this.view.scene.addChild(mesh);
                            this.meshes.push(mesh);

                            this.raf.start();
                            break;
                        case AssetType.TEXTURE:
                            // Loaded Texture
                            var tx = d;

                            // Light Picker
                            this.staticLightPicker = new StaticLightPicker([this.light, this.lightB]);

                            // Material for loaded mesh
                            this.loadedMeshMaterial = new TriangleMethodMaterial(tx, true, true, false);
                            this.loadedMeshMaterial.lightPicker = this.staticLightPicker;
                            this.loadedMeshMaterial.alpha = 1;
                            this.loadedMeshMaterial.bothSides = true;

                            if (this.loadedMesh)
                                this.loadedMesh.material = this.loadedMeshMaterial;

                            // Torus
                            var torus = new PrimitiveTorusPrefab(150, 50, 64, 64);

                            // Torus Texture Material
                            this.torusTextureMaterial = new TriangleMethodMaterial(tx, true, true, false);
                            this.torusTextureMaterial.lightPicker = this.staticLightPicker;
                            this.torusTextureMaterial.bothSides = true;
                            this.torusTextureMaterial.alpha = .8;

                            torus.material = this.torusTextureMaterial;

                            // Torus Mesh ( left )
                            var torusMesh = torus.getNewObject();
                            torusMesh.rotationX = 90;
                            torusMesh.x = 600;
                            this.meshes.push(torusMesh);
                            this.view.scene.addChild(torusMesh);

                            var cube = new PrimitiveCubePrefab(300, 300, 300, 20, 20, 20);

                            // Torus Color Material
                            this.cubeColorMaterial = new TriangleMethodMaterial(0x0090ff);
                            this.cubeColorMaterial.lightPicker = this.staticLightPicker;
                            this.cubeColorMaterial.alpha = .8;
                            this.cubeColorMaterial.bothSides = true;

                            cube.material = this.cubeColorMaterial;

                            // Torus Mesh ( right )
                            var cubeMesh = cube.getNewObject();
                            cubeMesh.rotationX = 90;
                            cubeMesh.x = -600;
                            this.meshes.push(cubeMesh);
                            this.view.scene.addChild(cubeMesh);

                            this.capsuleColorMaterial = new TriangleMethodMaterial(0x00ffff);
                            this.capsuleColorMaterial.lightPicker = this.staticLightPicker;

                            var capsule = new PrimitiveCapsulePrefab(100, 200);

                            capsule.material = this.capsuleColorMaterial;

                            // Torus Mesh ( right )
                            var capsuleMesh = capsule.getNewObject();
                            this.meshes.push(capsuleMesh);
                            this.view.scene.addChild(capsuleMesh);

                            this.cubeColorMaterial.alpha = this.torusTextureMaterial.alpha = this.loadedMeshMaterial.alpha = 1;

                            break;
                    }
                }
            };

            MaterialAlphaTest.prototype.onResize = function (event) {
                if (typeof event === "undefined") { event = null; }
                this.view.y = 0;
                this.view.x = 0;

                this.view.width = window.innerWidth;
                this.view.height = window.innerHeight;
            };
            return MaterialAlphaTest;
        })();
        materials.MaterialAlphaTest = MaterialAlphaTest;
    })(tests.materials || (tests.materials = {}));
    var materials = tests.materials;
})(tests || (tests = {}));
//# sourceMappingURL=MaterialAlphaTest.js.map
