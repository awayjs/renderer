var tests;
(function (tests) {
    ///<reference path="../../../build/Away3D.next.d.ts" />
    (function (textures) {
        var BitmapTextureTest = (function () {
            function BitmapTextureTest() {
                //---------------------------------------
                // Load a PNG
                var mipUrlRequest = new away.net.URLRequest('assets/1024x1024.png');
                this.mipLoader = new away.net.IMGLoader();
                this.mipLoader.load(mipUrlRequest);
                this.mipLoader.addEventListener(away.events.Event.COMPLETE, this.mipImgLoaded, this);
            }
            BitmapTextureTest.prototype.mipImgLoaded = function (e) {
                var loader = e.target;
                var rect = new away.geom.Rectangle(0, 0, this.mipLoader.width, this.mipLoader.height);

                console.log('away.events.Event.COMPLETE', loader);

                this.bitmapData = new away.display.BitmapData(loader.width, loader.height);
                this.bitmapData.drawImage(this.mipLoader.image, rect, rect);

                this.target = new away.textures.BitmapTexture(this.bitmapData, true);

                away.Debug.log('away.display.BitmapData', this.bitmapData);
                away.Debug.log('away.textures.BitmapTexture', this.target);
            };
            return BitmapTextureTest;
        })();
        textures.BitmapTextureTest = BitmapTextureTest;
    })(tests.textures || (tests.textures = {}));
    var textures = tests.textures;
})(tests || (tests = {}));
//# sourceMappingURL=BitmapTextureTest.js.map
