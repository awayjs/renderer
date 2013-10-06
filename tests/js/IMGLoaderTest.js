var tests;
(function (tests) {
    ///<reference path="../../../build/Away3D.next.d.ts" />
    //<reference path="../../../src/Away3D.ts" />
    (function (loaders) {
        var IMGLoaderTest = (function () {
            function IMGLoaderTest() {
                //-----------------------------------------------------------------------------------------------
                // load a png
                //-----------------------------------------------------------------------------------------------
                var pngURLrq = new away.net.URLRequest('assets/2.png');

                this.pngLoader = new away.net.IMGLoader();
                this.pngLoader.addEventListener(away.events.Event.COMPLETE, this.pngLoaderComplete, this);
                this.pngLoader.addEventListener(away.events.IOErrorEvent.IO_ERROR, this.ioError, this);
                this.pngLoader.load(pngURLrq);

                //-----------------------------------------------------------------------------------------------
                // Load a jpg
                //-----------------------------------------------------------------------------------------------
                var jpgURLrq = new away.net.URLRequest('assets/1.jpg');

                this.jpgLoader = new away.net.IMGLoader();
                this.jpgLoader.crossOrigin = 'anonymous';
                this.jpgLoader.addEventListener(away.events.Event.COMPLETE, this.jpgLoaderComplete, this);
                this.jpgLoader.addEventListener(away.events.IOErrorEvent.IO_ERROR, this.ioError, this);
                this.jpgLoader.load(jpgURLrq);

                //-----------------------------------------------------------------------------------------------
                // Load file of wrong format
                //-----------------------------------------------------------------------------------------------
                var notURLrq = new away.net.URLRequest('assets/data.txt');

                this.noAnImageLoader = new away.net.IMGLoader();
                this.noAnImageLoader.addEventListener(away.events.Event.COMPLETE, this.noAnImageLoaderComplete, this);
                this.noAnImageLoader.addEventListener(away.events.IOErrorEvent.IO_ERROR, this.ioError, this);
                this.noAnImageLoader.load(notURLrq);

                //-----------------------------------------------------------------------------------------------
                // Load image that does not exist
                //-----------------------------------------------------------------------------------------------
                var wrongURLrq = new away.net.URLRequest('assets/iDontExist.png');

                this.wrongURLLoader = new away.net.IMGLoader();
                this.wrongURLLoader.addEventListener(away.events.Event.COMPLETE, this.wrongURLLoaderComplete, this);
                this.wrongURLLoader.addEventListener(away.events.IOErrorEvent.IO_ERROR, this.ioError, this);
                this.wrongURLLoader.load(wrongURLrq);
            }
            IMGLoaderTest.prototype.pngLoaderComplete = function (e) {
                this.logSuccessfullLoad(e);

                var imgLoader = e.target;
                document.body.appendChild(imgLoader.image);
            };

            IMGLoaderTest.prototype.jpgLoaderComplete = function (e) {
                this.logSuccessfullLoad(e);

                var imgLoader = e.target;
                document.body.appendChild(imgLoader.image);
            };

            IMGLoaderTest.prototype.noAnImageLoaderComplete = function (e) {
                this.logSuccessfullLoad(e);
            };

            IMGLoaderTest.prototype.wrongURLLoaderComplete = function (e) {
                this.logSuccessfullLoad(e);
            };

            IMGLoaderTest.prototype.logSuccessfullLoad = function (e) {
                var imgLoader = e.target;
                console.log('IMG.Event.Complete', imgLoader.request.url);
            };

            IMGLoaderTest.prototype.ioError = function (e) {
                var imgLoader = e.target;
                console.log('ioError', imgLoader.request.url);
            };

            IMGLoaderTest.prototype.abortError = function (e) {
                var imgLoader = e.target;
                console.log('abortError', imgLoader.request.url);
            };
            return IMGLoaderTest;
        })();
        loaders.IMGLoaderTest = IMGLoaderTest;
    })(tests.loaders || (tests.loaders = {}));
    var loaders = tests.loaders;
})(tests || (tests = {}));
//# sourceMappingURL=IMGLoaderTest.js.map
