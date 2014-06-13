///<reference path="../../../build/stagegl-renderer.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />
var tests;
(function (tests) {
    (function (display) {
        var BitmapData = away.base.BitmapData;
        var View = away.containers.View;

        var LoaderEvent = away.events.LoaderEvent;
        var AssetLibrary = away.library.AssetLibrary;
        var AssetType = away.library.AssetType;

        var TriangleMaterial = away.materials.TriangleMaterial;

        var PrimitivePlanePrefab = away.prefabs.PrimitivePlanePrefab;
        var DefaultRenderer = away.render.DefaultRenderer;
        var BitmapTexture = away.textures.BitmapTexture;

        var RequestAnimationFrame = away.utils.RequestAnimationFrame;

        var BitmapDataReflectionTest = (function () {
            function BitmapDataReflectionTest() {
                var _this = this;
                this.view = new View(new DefaultRenderer());
                this.raf = new RequestAnimationFrame(this.render, this);

                var token = AssetLibrary.load(new away.net.URLRequest('assets/dots.png'));
                token.addEventListener(LoaderEvent.RESOURCE_COMPLETE, function (event) {
                    return _this.onResourceComplete(event);
                });

                window.onresize = function (event) {
                    return _this.onResize(event);
                };
            }
            BitmapDataReflectionTest.prototype.onResourceComplete = function (e) {
                var loader = e.target;
                var l = loader.baseDependency.assets.length;

                for (var c = 0; c < l; c++) {
                    var asset = loader.baseDependency.assets[c];

                    switch (asset.assetType) {
                        case AssetType.TEXTURE:
                            var prefab = new PrimitivePlanePrefab(500, 500, 1, 1, false);
                            var tx = asset;
                            var bitmap = new BitmapData(1024, 1024, true, 0x00000000);

                            bitmap.context.translate(0, 1024);
                            bitmap.context.scale(1, -1);
                            bitmap.context.drawImage(tx.htmlImageElement, 0, 0, 1024, 1024);

                            var gradient = bitmap.context.createLinearGradient(0, 0, 0, 1024);
                            gradient.addColorStop(0.8, "rgba(255, 255, 255, 1.0)");
                            gradient.addColorStop(1, "rgba(255, 255, 255, 0.5)");

                            bitmap.context.fillStyle = gradient;
                            bitmap.context.rect(0, 0, 1024, 1024);
                            bitmap.context.globalCompositeOperation = "destination-out";
                            bitmap.context.fill();

                            var bitmapClone = new BitmapData(1024, 1024, true, 0x00000000);
                            bitmapClone.copyPixels(bitmap, bitmapClone.rect, bitmapClone.rect);

                            /*
                            bitmap.context.save();
                            */
                            document.body.appendChild(bitmap.canvas);

                            var bmpTX = new BitmapTexture(bitmapClone, false);

                            var material = new TriangleMaterial(bmpTX);
                            material.bothSides = true;
                            material.alphaBlending = true;

                            var material2 = new TriangleMaterial(tx);
                            material2.bothSides = true;
                            material2.alphaBlending = true;

                            this.reflectionMesh = prefab.getNewObject();
                            this.reflectionMesh.material = material;
                            this.view.scene.addChild(this.reflectionMesh);

                            this.fullmesh = prefab.getNewObject();
                            this.fullmesh.material = material2;
                            this.fullmesh.rotationY = 90;
                            this.view.scene.addChild(this.fullmesh);

                            break;
                    }
                }

                this.raf.start();
                this.onResize();
            };

            BitmapDataReflectionTest.prototype.onResize = function (event) {
                if (typeof event === "undefined") { event = null; }
                this.view.x = window.innerWidth / 2;
                this.view.width = window.innerWidth / 2;
                this.view.height = window.innerHeight;
            };

            BitmapDataReflectionTest.prototype.render = function () {
                this.fullmesh.rotationY += .5;
                this.reflectionMesh.rotationY += .5;

                this.view.render();
            };
            return BitmapDataReflectionTest;
        })();
        display.BitmapDataReflectionTest = BitmapDataReflectionTest;
    })(tests.display || (tests.display = {}));
    var display = tests.display;
})(tests || (tests = {}));
//# sourceMappingURL=BitmapDataReflectionTest.js.map
