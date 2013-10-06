var tests;
(function (tests) {
    ///<reference path="../../../build/Away3D.next.d.ts" />
    //<reference path="../../../src/Away3D.ts" />
    (function (net) {
        var LoaderTest = (function () {
            function LoaderTest() {
                console.log('start');

                //---------------------------------------------------------------------------------------------------------------------------------------------------------
                // POST URL Variables to PHP script
                //---------------------------------------------------------------------------------------------------------------------------------------------------------
                this.urlLoaderPostURLVars = new away.net.URLLoader();
                this.urlLoaderPostURLVars.dataFormat = away.net.URLLoaderDataFormat.VARIABLES;

                var urlStr = 'fname=karim&lname=' + Math.floor(Math.random() * 100);
                var urlVars = new away.net.URLVariables(urlStr);

                var req = new away.net.URLRequest('assets/saveData.php');
                req.method = away.net.URLRequestMethod.POST;
                req.data = urlVars;

                this.urlLoaderPostURLVars.addEventListener(away.events.Event.COMPLETE, this.postURLTestComplete, this);
                this.urlLoaderPostURLVars.addEventListener(away.events.IOErrorEvent.IO_ERROR, this.ioError, this);
                this.urlLoaderPostURLVars.load(req);

                //---------------------------------------------------------------------------------------------------------------------------------------------------------
                // GET CSV File
                //---------------------------------------------------------------------------------------------------------------------------------------------------------
                var csrReq = new away.net.URLRequest('assets/airports.csv');

                this.urlLoaderGetCSV = new away.net.URLLoader();
                this.urlLoaderGetCSV.dataFormat = away.net.URLLoaderDataFormat.TEXT;
                this.urlLoaderGetCSV.addEventListener(away.events.Event.COMPLETE, this.getCsvComplete, this);
                this.urlLoaderGetCSV.addEventListener(away.events.Event.OPEN, this.getCsvOpen, this);
                this.urlLoaderGetCSV.addEventListener(away.events.IOErrorEvent.IO_ERROR, this.ioError, this);
                this.urlLoaderGetCSV.load(csrReq);

                //---------------------------------------------------------------------------------------------------------------------------------------------------------
                // ERROR test - load a non-existing object
                //---------------------------------------------------------------------------------------------------------------------------------------------------------
                var errorReq = new away.net.URLRequest('assets/generatingError');

                this.urlLoaderErrorTest = new away.net.URLLoader();
                this.urlLoaderErrorTest.dataFormat = away.net.URLLoaderDataFormat.TEXT;
                this.urlLoaderErrorTest.addEventListener(away.events.Event.COMPLETE, this.errorComplete, this);
                this.urlLoaderErrorTest.addEventListener(away.events.IOErrorEvent.IO_ERROR, this.ioError, this);
                this.urlLoaderErrorTest.addEventListener(away.events.HTTPStatusEvent.HTTP_STATUS, this.httpStatusChange, this);
                this.urlLoaderErrorTest.load(errorReq);

                //---------------------------------------------------------------------------------------------------------------------------------------------------------
                // GET URL Vars - get URL variables
                //---------------------------------------------------------------------------------------------------------------------------------------------------------
                var csrReq = new away.net.URLRequest('assets/getUrlVars.php');

                this.urlLoaderGetURLVars = new away.net.URLLoader();
                this.urlLoaderGetURLVars.dataFormat = away.net.URLLoaderDataFormat.VARIABLES;
                this.urlLoaderGetURLVars.addEventListener(away.events.IOErrorEvent.IO_ERROR, this.ioError, this);
                this.urlLoaderGetURLVars.addEventListener(away.events.Event.COMPLETE, this.getURLVarsComplete, this);
                this.urlLoaderGetURLVars.load(csrReq);

                //---------------------------------------------------------------------------------------------------------------------------------------------------------
                // LOAD Binary file
                //---------------------------------------------------------------------------------------------------------------------------------------------------------
                var binReq = new away.net.URLRequest('assets/suzanne.awd');

                this.urlLoaderBinary = new away.net.URLLoader();
                this.urlLoaderBinary.dataFormat = away.net.URLLoaderDataFormat.BINARY;
                this.urlLoaderBinary.addEventListener(away.events.IOErrorEvent.IO_ERROR, this.ioError, this);
                this.urlLoaderBinary.addEventListener(away.events.Event.COMPLETE, this.binFileLoaded, this);
                this.urlLoaderBinary.load(binReq);

                //---------------------------------------------------------------------------------------------------------------------------------------------------------
                // LOAD Blob file
                //---------------------------------------------------------------------------------------------------------------------------------------------------------
                var blobReq = new away.net.URLRequest('assets/2.png');

                this.urlLoaderBlob = new away.net.URLLoader();
                this.urlLoaderBlob.dataFormat = away.net.URLLoaderDataFormat.BLOB;
                this.urlLoaderBlob.addEventListener(away.events.Event.COMPLETE, this.blobFileLoaded, this);
                this.urlLoaderBlob.load(blobReq);

                //---------------------------------------------------------------------------------------------------------------------------------------------------------
                // ARRAY_BUFFER Test
                //---------------------------------------------------------------------------------------------------------------------------------------------------------
                var arrBReq = new away.net.URLRequest('assets/1.jpg');

                this.urlLoaderArrb = new away.net.URLLoader();
                this.urlLoaderArrb.dataFormat = away.net.URLLoaderDataFormat.ARRAY_BUFFER;
                this.urlLoaderArrb.addEventListener(away.events.Event.COMPLETE, this.arrayBufferLoaded, this);
                this.urlLoaderArrb.load(arrBReq);
            }
            LoaderTest.prototype.arrayBufferLoaded = function (event) {
                var arrayBuffer = this.urlLoaderArrb.data;
                var byteArray = new Uint8Array(arrayBuffer);

                console.log('LoaderTest.arrayBufferLoaded', byteArray[1]);

                for (var i = 0; i < byteArray.byteLength; i++) {
                    //console.log( byteArray[i] );
                }
            };

            LoaderTest.prototype.blobFileLoaded = function (event) {
                var blob = new Blob([this.urlLoaderBlob.data], { type: 'image/png' });
                var img = document.createElement('img');
                img.src = this.createObjectURL(blob);
                img.onload = function (e) {
                    window['URL']['revokeObjectURL'](img.src);
                };

                console.log('LoaderTest.blobFileLoaded', blob);

                document.body.appendChild(img);
            };

            LoaderTest.prototype.createObjectURL = function (fileBlob) {
                if (window['URL']) {
                    if (window['URL']['createObjectURL']) {
                        return window['URL']['createObjectURL'](fileBlob);
                    }
                } else {
                    if (window['webkitURL']) {
                        return window['webkitURL']['createObjectURL'](fileBlob);
                    }
                }

                return null;
            };

            LoaderTest.prototype.binFileLoaded = function (event) {
                var loader = event.target;
                console.log('LoaderTest.binFileLoaded', loader.data.length);
            };

            LoaderTest.prototype.getURLVarsComplete = function (event) {
                var loader = event.target;
                console.log('LoaderTest.getURLVarsComplete', loader.data);
            };

            LoaderTest.prototype.httpStatusChange = function (event) {
                console.log('LoaderTest.httpStatusChange', event.status);
            };

            LoaderTest.prototype.ioError = function (event) {
                var loader = event.target;
                console.log('LoaderTest.ioError', loader.request.url);
            };

            LoaderTest.prototype.errorComplete = function (event) {
                var loader = event.target;
                console.log('LoaderTest.errorComplete');
            };

            LoaderTest.prototype.postURLTestComplete = function (event) {
                var loader = event.target;
                console.log('LoaderTest.postURLTestComplete', loader.data);
            };

            LoaderTest.prototype.getCsvComplete = function (event) {
                var loader = event.target;
                console.log('LoaderTest.getCsvComplete');
            };

            LoaderTest.prototype.getCsvOpen = function (event) {
                var loader = event.target;
                console.log('LoaderTest.getCsvOpen');
            };
            return LoaderTest;
        })();
        net.LoaderTest = LoaderTest;
    })(tests.net || (tests.net = {}));
    var net = tests.net;
})(tests || (tests = {}));
//# sourceMappingURL=URLLoaderTests.js.map
