var LoaderEvent = require("awayjs-core/lib/events/LoaderEvent");
var Vector3D = require("awayjs-core/lib/geom/Vector3D");
var AssetLibrary = require("awayjs-core/lib/library/AssetLibrary");
var AssetType = require("awayjs-core/lib/library/AssetType");
var URLRequest = require("awayjs-core/lib/net/URLRequest");
var Debug = require("awayjs-core/lib/utils/Debug");
var RequestAnimationFrame = require("awayjs-core/lib/utils/RequestAnimationFrame");
var View = require("awayjs-display/lib/containers/View");
var DirectionalLight = require("awayjs-display/lib/entities/DirectionalLight");
var StaticLightPicker = require("awayjs-display/lib/materials/lightpickers/StaticLightPicker");
var PrimitiveTorusPrefab = require("awayjs-display/lib/prefabs/PrimitiveTorusPrefab");
var PrimitiveCubePrefab = require("awayjs-display/lib/prefabs/PrimitiveCubePrefab");
var PrimitiveCapsulePrefab = require("awayjs-display/lib/prefabs/PrimitiveCapsulePrefab");
var DefaultRenderer = require("awayjs-stagegl/lib/render/DefaultRenderer");
var TriangleMethodMaterial = require("awayjs-stagegl/lib/materials/TriangleMethodMaterial");
var OBJParser = require("awayjs-renderergl/lib/parsers/OBJParser");
var MaterialAlphaTest = (function () {
    function MaterialAlphaTest() {
        var _this = this;
        this.height = 0;
        this.meshes = new Array();
        this.aValues = Array(0, .1, .5, .8, .9, .99, 1);
        this.aValuesP = 0;
        Debug.LOG_PI_ERRORS = false;
        Debug.THROW_ERRORS = false;
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
        this.token.addEventListener(LoaderEvent.RESOURCE_COMPLETE, function (event) { return _this.onResourceComplete(event); });
        this.token = AssetLibrary.load(new URLRequest('assets/dots.png'));
        this.token.addEventListener(LoaderEvent.RESOURCE_COMPLETE, function (event) { return _this.onResourceComplete(event); });
        window.onresize = function (event) { return _this.onResize(event); };
        document.onmousedown = function (event) { return _this.onMouseDown(event); };
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
                        mesh.transform.scale = new Vector3D(5, 5, 5);
                    }
                    else {
                        mesh.transform.scale = new Vector3D(3.5, 3.5, 3.5);
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
        if (event === void 0) { event = null; }
        this.view.y = 0;
        this.view.x = 0;
        this.view.width = window.innerWidth;
        this.view.height = window.innerHeight;
    };
    return MaterialAlphaTest;
})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1hdGVyaWFscy9tYXRlcmlhbGFscGhhdGVzdC50cyJdLCJuYW1lcyI6WyJNYXRlcmlhbEFscGhhVGVzdCIsIk1hdGVyaWFsQWxwaGFUZXN0LmNvbnN0cnVjdG9yIiwiTWF0ZXJpYWxBbHBoYVRlc3Qub25Nb3VzZURvd24iLCJNYXRlcmlhbEFscGhhVGVzdC5yZW5kZXIiLCJNYXRlcmlhbEFscGhhVGVzdC5vblJlc291cmNlQ29tcGxldGUiLCJNYXRlcmlhbEFscGhhVGVzdC5vblJlc2l6ZSJdLCJtYXBwaW5ncyI6IkFBQUEsSUFBTyxXQUFXLFdBQWUsb0NBQW9DLENBQUMsQ0FBQztBQUN2RSxJQUFPLFFBQVEsV0FBZ0IsK0JBQStCLENBQUMsQ0FBQztBQUNoRSxJQUFPLFlBQVksV0FBZSxzQ0FBc0MsQ0FBQyxDQUFDO0FBRzFFLElBQU8sU0FBUyxXQUFlLG1DQUFtQyxDQUFDLENBQUM7QUFJcEUsSUFBTyxVQUFVLFdBQWUsZ0NBQWdDLENBQUMsQ0FBQztBQUdsRSxJQUFPLEtBQUssV0FBZ0IsNkJBQTZCLENBQUMsQ0FBQztBQUMzRCxJQUFPLHFCQUFxQixXQUFZLDZDQUE2QyxDQUFDLENBQUM7QUFHdkYsSUFBTyxJQUFJLFdBQWlCLG9DQUFvQyxDQUFDLENBQUM7QUFFbEUsSUFBTyxnQkFBZ0IsV0FBYyw4Q0FBOEMsQ0FBQyxDQUFDO0FBRXJGLElBQU8saUJBQWlCLFdBQWEsNkRBQTZELENBQUMsQ0FBQztBQUNwRyxJQUFPLG9CQUFvQixXQUFhLGlEQUFpRCxDQUFDLENBQUM7QUFDM0YsSUFBTyxtQkFBbUIsV0FBYSxnREFBZ0QsQ0FBQyxDQUFDO0FBQ3pGLElBQU8sc0JBQXNCLFdBQVksbURBQW1ELENBQUMsQ0FBQztBQUU5RixJQUFPLGVBQWUsV0FBYywyQ0FBMkMsQ0FBQyxDQUFDO0FBQ2pGLElBQU8sc0JBQXNCLFdBQVkscURBQXFELENBQUMsQ0FBQztBQUVoRyxJQUFPLFNBQVMsV0FBZSx5Q0FBeUMsQ0FBQyxDQUFDO0FBRTFFLElBQU0saUJBQWlCO0lBc0J0QkEsU0F0QktBLGlCQUFpQkE7UUFBdkJDLGlCQW9NQ0E7UUFqTVFBLFdBQU1BLEdBQVlBLENBQUNBLENBQUNBO1FBS3BCQSxXQUFNQSxHQUFrQkEsSUFBSUEsS0FBS0EsRUFBUUEsQ0FBQ0E7UUFNMUNBLFlBQU9BLEdBQWlCQSxLQUFLQSxDQUFTQSxDQUFDQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUNqRUEsYUFBUUEsR0FBVUEsQ0FBQ0EsQ0FBQ0E7UUFTM0JBLEtBQUtBLENBQUNBLGFBQWFBLEdBQUdBLEtBQUtBLENBQUNBO1FBQzVCQSxLQUFLQSxDQUFDQSxZQUFZQSxHQUFHQSxLQUFLQSxDQUFDQTtRQUUzQkEsSUFBSUEsQ0FBQ0EsSUFBSUEsR0FBR0EsSUFBSUEsSUFBSUEsQ0FBQ0EsSUFBSUEsZUFBZUEsRUFBRUEsQ0FBQ0EsQ0FBQ0E7UUFDNUNBLElBQUlBLENBQUNBLEdBQUdBLEdBQUdBLElBQUlBLHFCQUFxQkEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7UUFDeERBLElBQUlBLENBQUNBLFFBQVFBLEVBQUVBLENBQUNBO1FBRWhCQSxJQUFJQSxDQUFDQSxLQUFLQSxHQUFHQSxJQUFJQSxnQkFBZ0JBLEVBQUVBLENBQUNBO1FBQ3BDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxLQUFLQSxHQUFHQSxRQUFRQSxDQUFDQTtRQUM1QkEsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsU0FBU0EsR0FBR0EsSUFBSUEsUUFBUUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDN0NBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLE9BQU9BLEdBQUdBLENBQUNBLENBQUNBO1FBQ3ZCQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxZQUFZQSxHQUFHQSxRQUFRQSxDQUFDQTtRQUNuQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsT0FBT0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7UUFDdkJBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLFFBQVFBLEdBQUdBLENBQUNBLENBQUNBO1FBRXhCQSxJQUFJQSxDQUFDQSxNQUFNQSxHQUFHQSxJQUFJQSxnQkFBZ0JBLEVBQUVBLENBQUNBO1FBQ3JDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxLQUFLQSxHQUFFQSxRQUFRQSxDQUFDQTtRQUM1QkEsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsU0FBU0EsR0FBR0EsSUFBSUEsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDL0NBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLE9BQU9BLEdBQUdBLENBQUNBLENBQUNBO1FBQ3hCQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxZQUFZQSxHQUFHQSxRQUFRQSxDQUFDQTtRQUNwQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsT0FBT0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7UUFDeEJBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLFFBQVFBLEdBQUdBLENBQUNBLENBQUNBO1FBRXpCQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxRQUFRQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtRQUNyQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7UUFFdENBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLGVBQWVBLEdBQUdBLFFBQVFBLENBQUNBO1FBRXJDQSxZQUFZQSxDQUFDQSxZQUFZQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQTtRQUVyQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsR0FBR0EsWUFBWUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsVUFBVUEsQ0FBQ0EscUJBQXFCQSxDQUFDQSxD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QSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQTtvQkFDOUJBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLFFBQVFBLENBQUNBLFdBQVdBLENBQUNBLENBQUNBO29CQUV0Q0EsSUFBSUEsQ0FBQ0EsaUJBQWlCQSxDQUFDQSxLQUFLQSxHQUFHQSxJQUFJQSxDQUFDQSxvQkFBb0JBLENBQUNBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBLGtCQUFrQkEsQ0FBQ0EsS0FBS0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7b0JBRW5HQSxLQUFLQSxDQUFDQTtZQUNSQSxDQUFDQTtRQUNGQSxDQUFDQTtJQUNGQSxDQUFDQTtJQUVNSixvQ0FBUUEsR0FBZkEsVUFBZ0JBLEtBQW9CQTtRQUFwQksscUJBQW9CQSxHQUFwQkEsWUFBb0JBO1FBRW5DQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtRQUNoQkEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7UUFFaEJBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLEdBQUdBLE1BQU1BLENBQUNBLFVBQVVBLENBQUNBO1FBQ3BDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxHQUFHQSxNQUFNQSxDQUFDQSxXQUFXQSxDQUFDQTtJQUN2Q0EsQ0FBQ0E7SUFDRkwsd0JBQUNBO0FBQURBLENBcE1BLEFBb01DQSxJQUFBIiwiZmlsZSI6Im1hdGVyaWFscy9NYXRlcmlhbEFscGhhVGVzdC5qcyIsInNvdXJjZVJvb3QiOiIuL3Rlc3RzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IExvYWRlckV2ZW50XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9ldmVudHMvTG9hZGVyRXZlbnRcIik7XG5pbXBvcnQgVmVjdG9yM0RcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZ2VvbS9WZWN0b3IzRFwiKTtcbmltcG9ydCBBc3NldExpYnJhcnlcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2xpYnJhcnkvQXNzZXRMaWJyYXJ5XCIpO1xuaW1wb3J0IEFzc2V0TG9hZGVyXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9saWJyYXJ5L0Fzc2V0TG9hZGVyXCIpO1xuaW1wb3J0IEFzc2V0TG9hZGVyVG9rZW5cdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9saWJyYXJ5L0Fzc2V0TG9hZGVyVG9rZW5cIik7XG5pbXBvcnQgQXNzZXRUeXBlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9saWJyYXJ5L0Fzc2V0VHlwZVwiKTtcbmltcG9ydCBJQXNzZXRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvbGlicmFyeS9JQXNzZXRcIik7XG5pbXBvcnQgVVJMTG9hZGVyXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9uZXQvVVJMTG9hZGVyXCIpO1xuaW1wb3J0IFVSTExvYWRlckRhdGFGb3JtYXRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvbmV0L1VSTExvYWRlckRhdGFGb3JtYXRcIik7XG5pbXBvcnQgVVJMUmVxdWVzdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvbmV0L1VSTFJlcXVlc3RcIik7XG5pbXBvcnQgUGVyc3BlY3RpdmVQcm9qZWN0aW9uXHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9wcm9qZWN0aW9ucy9QZXJzcGVjdGl2ZVByb2plY3Rpb25cIik7XG5pbXBvcnQgSW1hZ2VUZXh0dXJlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi90ZXh0dXJlcy9JbWFnZVRleHR1cmVcIik7XG5pbXBvcnQgRGVidWdcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvdXRpbHMvRGVidWdcIik7XG5pbXBvcnQgUmVxdWVzdEFuaW1hdGlvbkZyYW1lXHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi91dGlscy9SZXF1ZXN0QW5pbWF0aW9uRnJhbWVcIik7XG5cbmltcG9ydCBTY2VuZVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9jb250YWluZXJzL1NjZW5lXCIpO1xuaW1wb3J0IFZpZXdcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9jb250YWluZXJzL1ZpZXdcIik7XG5pbXBvcnQgQmxlbmRNb2RlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9iYXNlL0JsZW5kTW9kZVwiKTtcbmltcG9ydCBEaXJlY3Rpb25hbExpZ2h0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvZW50aXRpZXMvRGlyZWN0aW9uYWxMaWdodFwiKTtcbmltcG9ydCBNZXNoXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvZW50aXRpZXMvTWVzaFwiKTtcbmltcG9ydCBTdGF0aWNMaWdodFBpY2tlclx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9tYXRlcmlhbHMvbGlnaHRwaWNrZXJzL1N0YXRpY0xpZ2h0UGlja2VyXCIpO1xuaW1wb3J0IFByaW1pdGl2ZVRvcnVzUHJlZmFiXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL3ByZWZhYnMvUHJpbWl0aXZlVG9ydXNQcmVmYWJcIik7XG5pbXBvcnQgUHJpbWl0aXZlQ3ViZVByZWZhYlx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9wcmVmYWJzL1ByaW1pdGl2ZUN1YmVQcmVmYWJcIik7XG5pbXBvcnQgUHJpbWl0aXZlQ2Fwc3VsZVByZWZhYlx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvcHJlZmFicy9QcmltaXRpdmVDYXBzdWxlUHJlZmFiXCIpO1xuXG5pbXBvcnQgRGVmYXVsdFJlbmRlcmVyXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvcmVuZGVyL0RlZmF1bHRSZW5kZXJlclwiKTtcbmltcG9ydCBUcmlhbmdsZU1ldGhvZE1hdGVyaWFsXHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9tYXRlcmlhbHMvVHJpYW5nbGVNZXRob2RNYXRlcmlhbFwiKTtcblxuaW1wb3J0IE9CSlBhcnNlclx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvcGFyc2Vycy9PQkpQYXJzZXJcIik7XG5cbmNsYXNzIE1hdGVyaWFsQWxwaGFUZXN0XG57XG5cblx0cHJpdmF0ZSBoZWlnaHQgOiBudW1iZXIgPSAwO1xuXG5cdHByaXZhdGUgdG9rZW46QXNzZXRMb2FkZXJUb2tlbjtcblx0cHJpdmF0ZSB2aWV3OlZpZXc7XG5cdHByaXZhdGUgcmFmOlJlcXVlc3RBbmltYXRpb25GcmFtZTtcblx0cHJpdmF0ZSBtZXNoZXMgIDogQXJyYXk8TWVzaD4gPSBuZXcgQXJyYXk8TWVzaD4oKTtcblx0cHJpdmF0ZSBsb2FkZWRNZXNoTWF0ZXJpYWw6VHJpYW5nbGVNZXRob2RNYXRlcmlhbDtcblx0cHJpdmF0ZSBsaWdodDpEaXJlY3Rpb25hbExpZ2h0O1xuXHRwcml2YXRlIGxpZ2h0QjpEaXJlY3Rpb25hbExpZ2h0O1xuXHRwcml2YXRlIGxvYWRlZE1lc2g6TWVzaDtcblxuXHRwcml2YXRlIGFWYWx1ZXM6QXJyYXk8bnVtYmVyPiA9IEFycmF5PG51bWJlcj4oMCwgLjEsIC41LCAuOCwgLjksIC45OSwgMSk7XG5cdHByaXZhdGUgYVZhbHVlc1A6bnVtYmVyID0gMDtcblxuXHRwcml2YXRlIHRvcnVzVGV4dHVyZU1hdGVyaWFsOlRyaWFuZ2xlTWV0aG9kTWF0ZXJpYWw7XG5cdHByaXZhdGUgY3ViZUNvbG9yTWF0ZXJpYWw6VHJpYW5nbGVNZXRob2RNYXRlcmlhbDtcblx0cHJpdmF0ZSBjYXBzdWxlQ29sb3JNYXRlcmlhbDpUcmlhbmdsZU1ldGhvZE1hdGVyaWFsO1xuXHRwcml2YXRlIHN0YXRpY0xpZ2h0UGlja2VyOlN0YXRpY0xpZ2h0UGlja2VyO1xuXG5cdGNvbnN0cnVjdG9yKClcblx0e1xuXHRcdERlYnVnLkxPR19QSV9FUlJPUlMgPSBmYWxzZTtcblx0XHREZWJ1Zy5USFJPV19FUlJPUlMgPSBmYWxzZTtcblxuXHRcdHRoaXMudmlldyA9IG5ldyBWaWV3KG5ldyBEZWZhdWx0UmVuZGVyZXIoKSk7XG5cdFx0dGhpcy5yYWYgPSBuZXcgUmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMucmVuZGVyLCB0aGlzKTtcblx0XHR0aGlzLm9uUmVzaXplKCk7XG5cblx0XHR0aGlzLmxpZ2h0ID0gbmV3IERpcmVjdGlvbmFsTGlnaHQoKTtcblx0XHR0aGlzLmxpZ2h0LmNvbG9yID0gMHhGRkZGRkY7XG5cdFx0dGhpcy5saWdodC5kaXJlY3Rpb24gPSBuZXcgVmVjdG9yM0QoMSwgMSwgMCk7XG5cdFx0dGhpcy5saWdodC5hbWJpZW50ID0gMDtcblx0XHR0aGlzLmxpZ2h0LmFtYmllbnRDb2xvciA9IDB4RkZGRkZGO1xuXHRcdHRoaXMubGlnaHQuZGlmZnVzZSA9IDE7XG5cdFx0dGhpcy5saWdodC5zcGVjdWxhciA9IDE7XG5cblx0XHR0aGlzLmxpZ2h0QiA9IG5ldyBEaXJlY3Rpb25hbExpZ2h0KCk7XG5cdFx0dGhpcy5saWdodEIuY29sb3I9IDB4RkYwMDAwO1xuXHRcdHRoaXMubGlnaHRCLmRpcmVjdGlvbiA9IG5ldyBWZWN0b3IzRCgtMSwgMCwgMSk7XG5cdFx0dGhpcy5saWdodEIuYW1iaWVudCA9IDA7XG5cdFx0dGhpcy5saWdodEIuYW1iaWVudENvbG9yID0gMHhGRkZGRkY7XG5cdFx0dGhpcy5saWdodEIuZGlmZnVzZSA9IDE7XG5cdFx0dGhpcy5saWdodEIuc3BlY3VsYXIgPSAxO1xuXG5cdFx0dGhpcy52aWV3LnNjZW5lLmFkZENoaWxkKHRoaXMubGlnaHQpO1xuXHRcdHRoaXMudmlldy5zY2VuZS5hZGRDaGlsZCh0aGlzLmxpZ2h0Qik7XG5cblx0XHR0aGlzLnZpZXcuYmFja2dyb3VuZENvbG9yID0gMHgyMjIyMjI7XG5cblx0XHRBc3NldExpYnJhcnkuZW5hYmxlUGFyc2VyKE9CSlBhcnNlcik7XG5cblx0XHR0aGlzLnRva2VuID0gQXNzZXRMaWJyYXJ5LmxvYWQobmV3IFVSTFJlcXVlc3QoJ2Fzc2V0cy9wbGF0b25pYy5vYmonKSk7XG5cdFx0dGhpcy50b2tlbi5hZGRFdmVudExpc3RlbmVyKExvYWRlckV2ZW50LlJFU09VUkNFX0NPTVBMRVRFICwgKGV2ZW50OkxvYWRlckV2ZW50KSA9PiB0aGlzLm9uUmVzb3VyY2VDb21wbGV0ZShldmVudCkpO1xuXG5cdFx0dGhpcy50b2tlbiA9IEFzc2V0TGlicmFyeS5sb2FkKG5ldyBVUkxSZXF1ZXN0KCdhc3NldHMvZG90cy5wbmcnKSApO1xuXHRcdHRoaXMudG9rZW4uYWRkRXZlbnRMaXN0ZW5lcihMb2FkZXJFdmVudC5SRVNPVVJDRV9DT01QTEVURSwgKGV2ZW50OkxvYWRlckV2ZW50KSA9PiB0aGlzLm9uUmVzb3VyY2VDb21wbGV0ZShldmVudCkpO1xuXG5cdFx0d2luZG93Lm9ucmVzaXplID0gKGV2ZW50OlVJRXZlbnQpID0+IHRoaXMub25SZXNpemUoZXZlbnQpO1xuXHRcdGRvY3VtZW50Lm9ubW91c2Vkb3duID0gKGV2ZW50Ok1vdXNlRXZlbnQpID0+IHRoaXMub25Nb3VzZURvd24oZXZlbnQpO1xuXHR9XG5cblx0cHJpdmF0ZSBvbk1vdXNlRG93bihldmVudDpNb3VzZUV2ZW50KVxuXHR7XG5cdFx0dGhpcy5jdWJlQ29sb3JNYXRlcmlhbC5hbHBoYSA9IHRoaXMudG9ydXNUZXh0dXJlTWF0ZXJpYWwuYWxwaGEgPSB0aGlzLmxvYWRlZE1lc2hNYXRlcmlhbC5hbHBoYSA9IHRoaXMuYVZhbHVlc1t0aGlzLmFWYWx1ZXNQXTtcblxuXHRcdGFsZXJ0KCAnQWxwaGE6ICcgKyB0aGlzLmFWYWx1ZXNbdGhpcy5hVmFsdWVzUF0pO1xuXG5cdFx0dGhpcy5hVmFsdWVzUCsrO1xuXG5cdFx0aWYgKHRoaXMuYVZhbHVlc1AgPiB0aGlzLmFWYWx1ZXMubGVuZ3RoIC0xKVxuXHRcdFx0dGhpcy5hVmFsdWVzUCAgPSAwO1xuXHR9XG5cblx0cHJpdmF0ZSByZW5kZXIoZHQ6bnVtYmVyKVxuXHR7XG5cdFx0aWYgKHRoaXMubWVzaGVzKVxuXHRcdFx0Zm9yICh2YXIgYzpudW1iZXIgPSAwOyBjIDwgdGhpcy5tZXNoZXMubGVuZ3RoOyBjKyspXG5cdFx0XHRcdHRoaXMubWVzaGVzW2NdLnJvdGF0aW9uWSArPSAuMzU7XG5cblx0XHR0aGlzLnZpZXcucmVuZGVyKCk7XG5cdH1cblxuXHRwdWJsaWMgb25SZXNvdXJjZUNvbXBsZXRlKGV2ZW50OkxvYWRlckV2ZW50KVxuXHR7XG5cdFx0dmFyIGxvYWRlcjpBc3NldExvYWRlciA9IDxBc3NldExvYWRlcj4gZXZlbnQudGFyZ2V0O1xuXHRcdHZhciBsOm51bWJlciA9IGxvYWRlci5iYXNlRGVwZW5kZW5jeS5hc3NldHMubGVuZ3RoXG5cblx0XHRmb3IgKHZhciBjOm51bWJlciA9IDA7IGMgPCBsOyBjICsrKSB7XG5cblx0XHRcdHZhciBkOklBc3NldCA9IGxvYWRlci5iYXNlRGVwZW5kZW5jeS5hc3NldHNbY107XG5cblx0XHRcdGNvbnNvbGUubG9nKCBkLm5hbWUpO1xuXG5cdFx0XHRzd2l0Y2ggKGQuYXNzZXRUeXBlKSB7XG5cdFx0XHRcdGNhc2UgQXNzZXRUeXBlLk1FU0g6XG5cdFx0XHRcdFx0dmFyIG1lc2g6TWVzaCA9IDxNZXNoPiBkO1xuXG5cdFx0XHRcdFx0dGhpcy5sb2FkZWRNZXNoID0gbWVzaDtcblxuXHRcdFx0XHRcdGlmIChkLm5hbWUgPT0gJ01lc2hfZzAnKSB7XG5cdFx0XHRcdFx0XHR0aGlzLmxvYWRlZE1lc2ggPSBtZXNoO1xuXHRcdFx0XHRcdFx0bWVzaC55ID0gLTQwMDtcblx0XHRcdFx0XHRcdG1lc2gudHJhbnNmb3JtLnNjYWxlID0gbmV3IFZlY3RvcjNEKDUsIDUsIDUpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRtZXNoLnRyYW5zZm9ybS5zY2FsZSA9IG5ldyBWZWN0b3IzRCgzLjUsIDMuNSwgMy41KTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAodGhpcy5sb2FkZWRNZXNoTWF0ZXJpYWwpXG5cdFx0XHRcdFx0XHRtZXNoLm1hdGVyaWFsID0gdGhpcy5sb2FkZWRNZXNoTWF0ZXJpYWw7XG5cblx0XHRcdFx0XHR0aGlzLnZpZXcuc2NlbmUuYWRkQ2hpbGQobWVzaCk7XG5cdFx0XHRcdFx0dGhpcy5tZXNoZXMucHVzaChtZXNoKTtcblxuXHRcdFx0XHRcdHRoaXMucmFmLnN0YXJ0KCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgQXNzZXRUeXBlLlRFWFRVUkU6XG5cdFx0XHRcdFx0Ly8gTG9hZGVkIFRleHR1cmVcblx0XHRcdFx0XHR2YXIgdHg6SW1hZ2VUZXh0dXJlID0gPEltYWdlVGV4dHVyZT4gZDtcblxuXHRcdFx0XHRcdC8vIExpZ2h0IFBpY2tlclxuXHRcdFx0XHRcdHRoaXMuc3RhdGljTGlnaHRQaWNrZXIgPSBuZXcgU3RhdGljTGlnaHRQaWNrZXIoIFt0aGlzLmxpZ2h0ICwgdGhpcy5saWdodEIgXSApO1xuXG5cdFx0XHRcdFx0Ly8gTWF0ZXJpYWwgZm9yIGxvYWRlZCBtZXNoXG5cdFx0XHRcdFx0dGhpcy5sb2FkZWRNZXNoTWF0ZXJpYWwgPSBuZXcgVHJpYW5nbGVNZXRob2RNYXRlcmlhbCggdHgsIHRydWUsIHRydWUsIGZhbHNlICk7XG5cdFx0XHRcdFx0dGhpcy5sb2FkZWRNZXNoTWF0ZXJpYWwubGlnaHRQaWNrZXIgPSB0aGlzLnN0YXRpY0xpZ2h0UGlja2VyO1xuXHRcdFx0XHRcdHRoaXMubG9hZGVkTWVzaE1hdGVyaWFsLmFscGhhID0gMTtcblx0XHRcdFx0XHR0aGlzLmxvYWRlZE1lc2hNYXRlcmlhbC5ib3RoU2lkZXMgPSB0cnVlO1xuXG5cdFx0XHRcdFx0aWYgKHRoaXMubG9hZGVkTWVzaClcblx0XHRcdFx0XHRcdHRoaXMubG9hZGVkTWVzaC5tYXRlcmlhbCA9IHRoaXMubG9hZGVkTWVzaE1hdGVyaWFsO1xuXG5cdFx0XHRcdFx0Ly8gVG9ydXNcblx0XHRcdFx0XHR2YXIgdG9ydXM6UHJpbWl0aXZlVG9ydXNQcmVmYWIgPSBuZXcgUHJpbWl0aXZlVG9ydXNQcmVmYWIoMTUwICwgNTAgLCA2NCAsIDY0KTtcblxuXHRcdFx0XHRcdC8vIFRvcnVzIFRleHR1cmUgTWF0ZXJpYWxcblx0XHRcdFx0XHR0aGlzLnRvcnVzVGV4dHVyZU1hdGVyaWFsID0gbmV3IFRyaWFuZ2xlTWV0aG9kTWF0ZXJpYWwodHgsIHRydWUsIHRydWUsIGZhbHNlKTtcblx0XHRcdFx0XHR0aGlzLnRvcnVzVGV4dHVyZU1hdGVyaWFsLmxpZ2h0UGlja2VyID0gdGhpcy5zdGF0aWNMaWdodFBpY2tlciA7XG5cdFx0XHRcdFx0dGhpcy50b3J1c1RleHR1cmVNYXRlcmlhbC5ib3RoU2lkZXMgPSB0cnVlO1xuXHRcdFx0XHRcdHRoaXMudG9ydXNUZXh0dXJlTWF0ZXJpYWwuYWxwaGEgPSAuODtcblxuXHRcdFx0XHRcdHRvcnVzLm1hdGVyaWFsID0gdGhpcy50b3J1c1RleHR1cmVNYXRlcmlhbDtcblxuXHRcdFx0XHRcdC8vIFRvcnVzIE1lc2ggKCBsZWZ0IClcblx0XHRcdFx0XHR2YXIgdG9ydXNNZXNoOk1lc2ggPSA8TWVzaD4gdG9ydXMuZ2V0TmV3T2JqZWN0KCk7XG5cdFx0XHRcdFx0dG9ydXNNZXNoLnJvdGF0aW9uWCA9IDkwO1xuXHRcdFx0XHRcdHRvcnVzTWVzaC54ID0gNjAwO1xuXHRcdFx0XHRcdHRoaXMubWVzaGVzLnB1c2godG9ydXNNZXNoKTtcblx0XHRcdFx0XHR0aGlzLnZpZXcuc2NlbmUuYWRkQ2hpbGQodG9ydXNNZXNoKTtcblxuXHRcdFx0XHRcdHZhciBjdWJlOlByaW1pdGl2ZUN1YmVQcmVmYWIgPSBuZXcgUHJpbWl0aXZlQ3ViZVByZWZhYigzMDAsIDMwMCwgMzAwLCAyMCwgMjAsIDIwKTtcblxuXHRcdFx0XHRcdC8vIFRvcnVzIENvbG9yIE1hdGVyaWFsXG5cdFx0XHRcdFx0dGhpcy5jdWJlQ29sb3JNYXRlcmlhbCA9IG5ldyBUcmlhbmdsZU1ldGhvZE1hdGVyaWFsKDB4MDA5MGZmKTtcblx0XHRcdFx0XHR0aGlzLmN1YmVDb2xvck1hdGVyaWFsLmxpZ2h0UGlja2VyID0gdGhpcy5zdGF0aWNMaWdodFBpY2tlciA7XG5cdFx0XHRcdFx0dGhpcy5jdWJlQ29sb3JNYXRlcmlhbC5hbHBoYSA9IC44O1xuXHRcdFx0XHRcdHRoaXMuY3ViZUNvbG9yTWF0ZXJpYWwuYm90aFNpZGVzID0gdHJ1ZTtcblxuXHRcdFx0XHRcdGN1YmUubWF0ZXJpYWwgPSB0aGlzLmN1YmVDb2xvck1hdGVyaWFsO1xuXG5cdFx0XHRcdFx0Ly8gVG9ydXMgTWVzaCAoIHJpZ2h0IClcblx0XHRcdFx0XHR2YXIgY3ViZU1lc2g6TWVzaCA9IDxNZXNoPiBjdWJlLmdldE5ld09iamVjdCgpO1xuXHRcdFx0XHRcdGN1YmVNZXNoLnJvdGF0aW9uWCA9IDkwO1xuXHRcdFx0XHRcdGN1YmVNZXNoLnggPSAtNjAwO1xuXHRcdFx0XHRcdHRoaXMubWVzaGVzLnB1c2goY3ViZU1lc2gpO1xuXHRcdFx0XHRcdHRoaXMudmlldy5zY2VuZS5hZGRDaGlsZChjdWJlTWVzaCk7XG5cblx0XHRcdFx0XHR0aGlzLmNhcHN1bGVDb2xvck1hdGVyaWFsID0gbmV3IFRyaWFuZ2xlTWV0aG9kTWF0ZXJpYWwoMHgwMGZmZmYpO1xuXHRcdFx0XHRcdHRoaXMuY2Fwc3VsZUNvbG9yTWF0ZXJpYWwubGlnaHRQaWNrZXIgPSB0aGlzLnN0YXRpY0xpZ2h0UGlja2VyO1xuXG5cdFx0XHRcdFx0dmFyIGNhcHN1bGU6UHJpbWl0aXZlQ2Fwc3VsZVByZWZhYiA9IG5ldyBQcmltaXRpdmVDYXBzdWxlUHJlZmFiKDEwMCwgMjAwKTtcblxuXHRcdFx0XHRcdGNhcHN1bGUubWF0ZXJpYWwgPSB0aGlzLmNhcHN1bGVDb2xvck1hdGVyaWFsO1xuXG5cdFx0XHRcdFx0Ly8gVG9ydXMgTWVzaCAoIHJpZ2h0IClcblx0XHRcdFx0XHR2YXIgY2Fwc3VsZU1lc2g6TWVzaCA9IDxNZXNoPiBjYXBzdWxlLmdldE5ld09iamVjdCgpO1xuXHRcdFx0XHRcdHRoaXMubWVzaGVzLnB1c2goY2Fwc3VsZU1lc2gpO1xuXHRcdFx0XHRcdHRoaXMudmlldy5zY2VuZS5hZGRDaGlsZChjYXBzdWxlTWVzaCk7XG5cblx0XHRcdFx0XHR0aGlzLmN1YmVDb2xvck1hdGVyaWFsLmFscGhhID0gdGhpcy50b3J1c1RleHR1cmVNYXRlcmlhbC5hbHBoYSA9IHRoaXMubG9hZGVkTWVzaE1hdGVyaWFsLmFscGhhID0gMTtcblxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHB1YmxpYyBvblJlc2l6ZShldmVudDpVSUV2ZW50ID0gbnVsbClcblx0e1xuXHRcdHRoaXMudmlldy55ID0gMDtcblx0XHR0aGlzLnZpZXcueCA9IDA7XG5cblx0XHR0aGlzLnZpZXcud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcblx0XHR0aGlzLnZpZXcuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuXHR9XG59Il19