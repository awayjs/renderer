var away;
(function (away) {
    //---------------------------------------------------
    // Application Harness
    var AppHarness = (function () {
        //------------------------------------------------------------------------------
        function AppHarness() {
            var _this = this;
            //------------------------------------------------------------------------------
            this.tests = new Array();
            this.counter = 0;
            this.sourceVisible = false;
            this.loadDefault = true;
            this.initFrameSet();
            this.initInterface();

            this.previousBtn.onclick = function () {
                return _this.nagigateBy(-1);
            };
            this.nextBtn.onclick = function () {
                return _this.nagigateBy(1);
            };
            this.sourceBtn.onclick = function () {
                return _this.toggleSource();
            };
            this.dropDown.onchange = function (e) {
                return _this.dropDownChange(e);
            };
        }
        //------------------------------------------------------------------------------
        /**
        *
        * Load a test
        *
        * @param classPath - Module and Class path of test
        * @param js Path to JavaScript file
        * @param ts Path to Typescript file ( not yet used - reserved for future show source )
        */
        AppHarness.prototype.load = function (classPath, js, ts) {
            this.loadFromURL();

            if (this.loadDefault) {
                window.history.pushState(js, js, '?test=' + js);
                this.testIframe.src = 'frame.html?name=' + classPath + '&js=' + js;
                this.srcIframe.src = "data:text/html;charset=utf-8," + this.createSourceViewHTML(ts);
            }
        };

        /**
        *
        * Add a test to the AppHarness
        *
        * @param name Name of test
        * @param classPath - Module and Class path of test
        * @param js Path to JavaScript file
        * @param ts Path to Typescript file ( not yet used - reserved for future show source )
        */
        AppHarness.prototype.addTest = function (name, classpath, js, ts) {
            this.tests.push(new TestData(name, classpath, js, ts));
        };

        /**
        *
        * Add a separator to the menu
        *
        * @param name
        */
        AppHarness.prototype.addSeperator = function (name) {
            if (typeof name === "undefined") { name = ''; }
            this.tests.push(new TestData('-- ' + name, '', '', ''));
        };

        /**
        *
        * Start the application harness
        *
        */
        AppHarness.prototype.start = function () {
            for (var c = 0; c < this.tests.length; c++) {
                var option = new Option(this.tests[c].name, String(c));
                this.dropDown.add(option);
            }
        };

        //------------------------------------------------------------------------------
        AppHarness.prototype.loadFromURL = function () {
            var queryParams = Utils.getQueryParams(document.location.search);

            if (queryParams.test != null) {
                var l = this.tests.length;

                for (var c = 0; c < l; c++) {
                    if (this.tests[c].js == queryParams.test) {
                        console.log('======>>>> LOAD TEST');

                        this.navigateToSection(this.tests[c]);
                        this.loadDefault = false;
                    }
                }
            }
        };

        /**
        *
        */
        AppHarness.prototype.initInterface = function () {
            var testSelector = document.createElement('div');
            testSelector.style.cssFloat = 'none';
            testSelector.style.position = 'absolute';
            testSelector.style.bottom = '15px';
            testSelector.style.width = '600px';
            testSelector.style.left = '50%';
            testSelector.style.marginLeft = '-300px';
            testSelector.style.textAlign = 'center';

            this.dropDown = document.createElement('select');
            this.dropDown.name = "selectTestDropDown";
            this.dropDown.id = "selectTest";

            this.sourceBtn = document.createElement('button');
            this.sourceBtn.innerHTML = 'Show Source';
            this.sourceBtn.id = 'previous';

            this.previousBtn = document.createElement('button');
            this.previousBtn.innerHTML = '<<';
            this.previousBtn.id = 'previous';

            this.nextBtn = document.createElement('button');
            this.nextBtn.innerHTML = '>>';
            this.nextBtn.id = 'next';

            testSelector.appendChild(this.sourceBtn);
            testSelector.appendChild(this.previousBtn);
            testSelector.appendChild(this.dropDown);
            testSelector.appendChild(this.nextBtn);
            document.body.appendChild(testSelector);
        };

        /**
        *
        */
        AppHarness.prototype.initFrameSet = function () {
            var iframeContainer = document.createElement('div');
            iframeContainer.style.width = '100%';
            iframeContainer.style.height = '100%';

            this.testIframe = document.createElement('iframe');
            this.testIframe.id = 'testContainer';
            this.testIframe.style.backgroundColor = '#9e9e9e';
            this.testIframe.style.cssFloat = 'none';
            this.testIframe.style.position = 'absolute';
            this.testIframe.style.top = '0px';
            this.testIframe.style.left = '0px';
            this.testIframe.style.border = '0px';
            this.testIframe.style.width = '100%';
            this.testIframe.style.height = '100%';

            //bottom: 120px;
            this.srcIframe = document.createElement('iframe');
            this.srcIframe.id = 'testSourceContainer';
            this.srcIframe.style.backgroundColor = '#9e9e9e';
            this.srcIframe.style.cssFloat = 'none';
            this.srcIframe.style.position = 'absolute';
            this.srcIframe.style.right = '0px';
            this.srcIframe.style.top = '0px';
            this.srcIframe.style.bottom = '0px';
            this.srcIframe.style.border = '0px';
            this.srcIframe.style.width = '0%';
            this.srcIframe.style.height = '100%';

            iframeContainer.appendChild(this.testIframe);
            iframeContainer.appendChild(this.srcIframe);

            document.body.appendChild(iframeContainer);
        };

        /**
        *
        * Selectnext / previous menu item
        *
        * @param direction
        */
        AppHarness.prototype.nagigateBy = function (direction) {
            if (typeof direction === "undefined") { direction = 1; }
            var l = this.tests.length;
            var nextCounter = this.counter + direction;

            if (nextCounter < 0) {
                nextCounter = this.tests.length - 1;
            } else if (nextCounter > this.tests.length - 1) {
                nextCounter = 0;
            }

            var testData = this.tests[nextCounter];

            if (testData.name.indexOf('--') != -1) {
                this.counter = nextCounter;
                this.nagigateBy(direction);
            } else {
                this.navigateToSection(testData);
                this.dropDown.selectedIndex = nextCounter;
                this.counter = nextCounter;
            }
        };

        /**
        *
        * Navigate to a section
        *
        * @param testData
        */
        AppHarness.prototype.navigateToSection = function (testData) {
            window.history.pushState(testData.js, testData.js, '?test=' + testData.js);
            this.srcIframe.src = "data:text/html;charset=utf-8," + this.createSourceViewHTML(testData.src);
            this.testIframe.src = 'frame.html?name=' + testData.classpath + '&js=' + testData.js;
        };

        AppHarness.prototype.toggleSource = function () {
            if (this.sourceVisible) {
                this.testIframe.style.width = '100%';
                this.srcIframe.style.width = '0%';
                this.sourceBtn.innerHTML = 'Show Source';
            } else {
                this.testIframe.style.width = '20%';
                this.srcIframe.style.width = '80%';
                this.sourceBtn.innerHTML = 'Hide Source';
            }

            this.sourceVisible = !this.sourceVisible;
        };

        AppHarness.prototype.createSourceViewHTML = function (url) {
            var html = '';

            html += '<!DOCTYPE html>';
            html += '<html>';
            html += '   <head>';
            html += '       <title></title>';
            html += '       <style>';
            html += '           html';
            html += '           {';
            html += '               height: 100%;';
            html += '               border: 0px;';
            html += '               padding: 0px;';
            html += '          }';
            html += '       </style>';
            html += '   <script src="http://gist-it.appspot.com/github/away3d/away3d-core-ts/tree/master/tests/' + url + '?footer=no"></script>';
            html += '</head>';
            html += '<body>';
            html += '</body>';
            html += '</html>';

            return html;
        };

        //------------------------------------------------------------------------------
        // Utils
        /**
        *
        * Util function - get Element by ID
        *
        * @param id
        * @returns {HTMLElement}
        */
        AppHarness.prototype.getId = function (id) {
            return document.getElementById(id);
        };

        //------------------------------------------------------------------------------
        // Events
        /**
        *
        * Dropbox event handler
        *
        * @param e
        */
        AppHarness.prototype.dropDownChange = function (e) {
            this.dropDown.options[this.dropDown.selectedIndex].value;
            this.counter = this.dropDown.selectedIndex;
            var dataIndex = parseInt(this.dropDown.options[this.dropDown.selectedIndex].value);

            if (!isNaN(dataIndex)) {
                this.navigateToSection(this.tests[dataIndex]);
            }
        };
        return AppHarness;
    })();
    away.AppHarness = AppHarness;

    //---------------------------------------------------
    // Application Frame
    var AppFrame = (function () {
        function AppFrame() {
            this.classPath = '';
            this.jsPath = '';
            var queryParams = Utils.getQueryParams(document.location.search);

            if (queryParams.js != undefined && queryParams.name != undefined) {
                this.jsPath = queryParams.js;
                this.classPath = queryParams.name;
                this.loadJS(this.jsPath);
            }
        }
        /**
        *
        * Load a JavaScript file
        *
        * @param url - URL of JavaScript file
        */
        AppFrame.prototype.loadJS = function (url) {
            var _this = this;
            var head = document.getElementsByTagName("head")[0];
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = url;
            script.onload = function () {
                return _this.jsLoaded();
            };

            head.appendChild(script);
        };

        /**
        *
        * Event Handler for loaded JavaScript files
        *
        */
        AppFrame.prototype.jsLoaded = function () {
            var createPath = this.classPath.split('.');
            var obj;

            for (var c = 0; c < createPath.length; c++) {
                if (obj == null) {
                    obj = window[createPath[c]];
                } else {
                    obj = obj[createPath[c]];
                }
            }

            if (obj != null) {
                new obj();
            }
        };
        return AppFrame;
    })();
    away.AppFrame = AppFrame;

    //---------------------------------------------------
    // Common Utilities
    var Utils = (function () {
        function Utils() {
        }
        Utils.getQueryParams = /**
        *
        * Utility function - Parse a Query formatted string
        *
        * @param qs
        * @returns {{}}
        */
        function (qs) {
            qs = qs.split("+").join(" ");

            var params = {}, tokens, re = /[?&]?([^=]+)=([^&]*)/g;

            while (tokens = re.exec(qs)) {
                params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
            }

            return params;
        };
        return Utils;
    })();
    away.Utils = Utils;

    //---------------------------------------------------
    // Data
    var TestData = (function () {
        function TestData(name, classpath, js, src) {
            this.js = js;
            this.classpath = classpath;
            this.src = src;
            this.name = name;
        }
        return TestData;
    })();
})(away || (away = {}));
//# sourceMappingURL=AppHarness.js.map
