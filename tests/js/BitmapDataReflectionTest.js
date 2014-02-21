///<reference path="../../../build/Away3D.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />
var tests;
(function (tests) {
    (function (display) {
        var BitmapDataReflectionTest = (function () {
            function BitmapDataReflectionTest() {
                var _this = this;
                this.view = new away.containers.View(new away.render.DefaultRenderer());
                this.raf = new away.utils.RequestAnimationFrame(this.render, this);

                away.library.AssetLibrary.enableParser(away.parsers.BitmapParser);

                var token = away.library.AssetLibrary.load(new away.net.URLRequest('assets/dots.png'));
                token.addEventListener(away.events.LoaderEvent.RESOURCE_COMPLETE, away.utils.Delegate.create(this, this.onResourceComplete));

                window.onresize = function () {
                    return _this.resize();
                };
            }
            BitmapDataReflectionTest.prototype.onResourceComplete = function (e) {
                //var loader : AssetLoader = e.target as AssetLoader;
                var loader = e.target;
                var l = loader.baseDependency.assets.length;

                for (var c = 0; c < l; c++) {
                    var asset = loader.baseDependency.assets[c];

                    switch (asset.assetType) {
                        case away.library.AssetType.TEXTURE:
                            var geom = new away.primitives.PlaneGeometry(500, 500, 1, 1, false);
                            var tx = asset;
                            var bitmap = new away.base.BitmapData(1024, 1024, true, 0x00000000);

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

                            var bitmapClone = new away.base.BitmapData(1024, 1024, true, 0x00000000);
                            bitmapClone.copyPixels(bitmap, bitmapClone.rect, bitmapClone.rect);

                            /*
                            bitmap.context.save();
                            */
                            document.body.appendChild(bitmap.canvas);

                            var bmpTX = new away.textures.BitmapTexture(bitmapClone, false);

                            var material = new away.materials.TextureMaterial(bmpTX);
                            material.bothSides = true;
                            material.alphaBlending = true;

                            var material2 = new away.materials.TextureMaterial(tx);
                            material2.bothSides = true;
                            material2.alphaBlending = true;

                            this.fullmesh = new away.entities.Mesh(geom, material2);
                            this.fullmesh.rotationY = 90;
                            this.reflectionMesh = new away.entities.Mesh(geom, material);
                            this.view.scene.addChild(this.reflectionMesh);
                            this.view.scene.addChild(this.fullmesh);

                            break;
                    }
                }

                this.raf.start();
                this.resize();
            };

            BitmapDataReflectionTest.prototype.resize = function () {
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
