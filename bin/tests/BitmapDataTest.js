var tests;
(function (tests) {
    ///<reference path="../../../build/Away3D.next.d.ts" />
    //<reference path="../../../src/Away3D.ts" />
    (function (display) {
        var BitmapDataTest = (function () {
            function BitmapDataTest() {
                var _this = this;
                var transparent = true;
                var initcolour = 0xffffffff;

                //---------------------------------------
                // Load a PNG
                this.urlRequest = new away.net.URLRequest('assets/256x256.png');
                this.imgLoader = new away.net.IMGLoader();
                this.imgLoader.load(this.urlRequest);
                this.imgLoader.addEventListener(away.events.Event.COMPLETE, this.imgLoaded, this);
                this.imgLoader.addEventListener(away.events.IOErrorEvent.IO_ERROR, this.imgLoadedError, this);

                //---------------------------------------
                // BitmapData Object - 1
                this.bitmapData = new away.display.BitmapData(256, 256, transparent, initcolour);
                document.body.appendChild(this.bitmapData.canvas);

                //---------------------------------------
                // BitmapData Object - 2
                this.bitmapDataB = new away.display.BitmapData(256, 256, transparent, initcolour);
                this.bitmapDataB.canvas.style.position = 'absolute';
                this.bitmapDataB.canvas.style.left = '540px';
                document.body.appendChild(this.bitmapDataB.canvas);

                //---------------------------------------
                // BitmapData - setPixel test
                console['time']("bitmapdata");

                this.bitmapDataB.lock();

                for (var i = 0; i < 10000; i++) {
                    var x = Math.random() * this.bitmapDataB.width | 0;
                    var y = Math.random() * this.bitmapDataB.height | 0;
                    this.bitmapDataB.setPixel(x, y, Math.random() * 0xffFFFFFF);
                }

                this.bitmapDataB.unlock();
                console['timeEnd']("bitmapdata");

                document.onmousedown = function (e) {
                    return _this.onMouseDown(e);
                };
            }
            BitmapDataTest.prototype.onMouseDown = function (e) {
                if (this.bitmapData.width === 512) {
                    if (this.imgLoader.loaded) {
                        this.bitmapDataB.lock();

                        //---------------------------------------
                        // Resize BitmapData
                        this.bitmapData.width = 256;
                        this.bitmapData.height = 256;

                        //---------------------------------------
                        // copy loaded image to first BitmapData
                        var rect = new away.geom.Rectangle(0, 0, this.imgLoader.width, this.imgLoader.height);
                        this.bitmapData.drawImage(this.imgLoader.image, rect, rect);

                        //---------------------------------------
                        // copy image into second bitmap data ( and scale it up 2X )
                        rect.width = rect.width * 2;
                        rect.height = rect.height * 2;

                        this.bitmapDataB.copyPixels(this.bitmapData, this.bitmapData.rect, rect);

                        for (var d = 0; d < 1000; d++) {
                            var x = Math.random() * this.bitmapDataB.width | 0;
                            var y = Math.random() * this.bitmapDataB.height | 0;
                            this.bitmapDataB.setPixel(x, y, Math.random() * 0xFFFFFFFF);
                        }

                        this.bitmapDataB.unlock();
                    } else {
                        //---------------------------------------
                        // image is not loaded - fill bitmapdata with red
                        this.bitmapData.width = 256;
                        this.bitmapData.height = 256;
                        this.bitmapData.fillRect(this.bitmapData.rect, 0xffff0000);
                    }
                } else {
                    //---------------------------------------
                    // resize bitmapdata;
                    this.bitmapData.lock();

                    this.bitmapData.width = 512;
                    this.bitmapData.height = 512;
                    this.bitmapData.fillRect(this.bitmapData.rect, 0xffff0000);

                    for (var d = 0; d < 1000; d++) {
                        var x = Math.random() * this.bitmapData.width | 0;
                        var y = Math.random() * this.bitmapData.height | 0;
                        this.bitmapData.setPixel(x, y, Math.random() * 0xFFFFFFFF);
                    }

                    this.bitmapData.unlock();

                    //---------------------------------------
                    // copy bitmapdata
                    var targetRect = this.bitmapDataB.rect.clone();
                    targetRect.width = targetRect.width / 2;
                    targetRect.height = targetRect.height / 2;

                    this.bitmapDataB.copyPixels(this.bitmapData, this.bitmapDataB.rect, targetRect);
                }

                var m = new away.geom.Matrix(.5, .08, .08, .5, this.imgLoader.width / 2, this.imgLoader.height / 2);
                this.bitmapData.draw(this.bitmapData, m);

                this.bitmapData.setPixel32(0, 0, 0xccff0000);
                this.bitmapData.setPixel32(1, 0, 0xcc00ff00);
                this.bitmapData.setPixel32(2, 0, 0xcc0000ff);

                this.bitmapDataB.draw(this.bitmapData, m);

                console.log('GetPixel 0,0: ', away.utils.ColorUtils.ARGBToHexString(away.utils.ColorUtils.float32ColorToARGB(this.bitmapData.getPixel(0, 0))));
                console.log('GetPixel 1,0: ', away.utils.ColorUtils.ARGBToHexString(away.utils.ColorUtils.float32ColorToARGB(this.bitmapData.getPixel(1, 0))));
                console.log('GetPixel 2,0: ', away.utils.ColorUtils.ARGBToHexString(away.utils.ColorUtils.float32ColorToARGB(this.bitmapData.getPixel(2, 0))));
            };

            BitmapDataTest.prototype.imgLoadedError = function (e) {
                console.log('error');
            };

            BitmapDataTest.prototype.imgLoaded = function (e) {
                this.bitmapData.drawImage(this.imgLoader.image, new away.geom.Rectangle(0, 0, this.imgLoader.width, this.imgLoader.height), new away.geom.Rectangle(0, 0, this.imgLoader.width / 2, this.imgLoader.height / 2));

                var m = new away.geom.Matrix(.5, .08, .08, .5, this.imgLoader.width / 2, this.imgLoader.height / 2);
                this.bitmapData.draw(this.bitmapData, m);
            };
            return BitmapDataTest;
        })();
        display.BitmapDataTest = BitmapDataTest;
    })(tests.display || (tests.display = {}));
    var display = tests.display;
})(tests || (tests = {}));
//# sourceMappingURL=BitmapDataTest.js.map
