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
            this.dropDown = this.getId('selectTest');

            this.previous = this.getId('previous');
            this.next = this.getId('next');

            this.previous.onclick = function () {
                return _this.nagigateBy(-1);
            };
            this.next.onclick = function () {
                return _this.nagigateBy(1);
            };

            this.dropDown.onchange = function (e) {
                return _this.dropDownChange(e);
            };

            this.contentIFrame = this.getId('testContainer');
            this.srcIFrame = this.getId('testSourceContainer');
        }
        //------------------------------------------------------------------------------
        /*
        */
        AppHarness.prototype.load = function (classPath, js, ts) {
            this.contentIFrame.src = 'frame.html?name=' + classPath + '&js=' + js;
            this.srcIFrame.src = ts;
        };

        /*
        */
        AppHarness.prototype.addTest = function (name, classpath, js, ts) {
            this.tests.push(new TestData(name, classpath, js, ts));
        };

        /*
        */
        AppHarness.prototype.addSeperator = function (name) {
            if (typeof name === "undefined") { name = ''; }
            this.tests.push(new TestData('-- ' + name, '', '', ''));
        };

        /*
        */
        AppHarness.prototype.start = function () {
            for (var c = 0; c < this.tests.length; c++) {
                var option = new Option(this.tests[c].name, String(c));
                this.dropDown.add(option);
            }
        };

        //------------------------------------------------------------------------------
        /*
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

        /*
        */
        AppHarness.prototype.navigateToSection = function (testData) {
            this.srcIFrame.src = testData.src;
            this.contentIFrame.src = 'frame.html?name=' + testData.classpath + '&js=' + testData.js;
        };

        //------------------------------------------------------------------------------
        // Utils
        /*
        */
        AppHarness.prototype.getId = function (id) {
            return document.getElementById(id);
        };

        //------------------------------------------------------------------------------
        // Events
        /*
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
            var queryParams = AppFrame.getQueryParams(document.location.search);

            if (queryParams.js != undefined && queryParams.name != undefined) {
                this.jsPath = queryParams.js;
                this.classPath = queryParams.name;
                this.loadJS(this.jsPath);
            }
        }
        /*
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

        /*
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

        AppFrame.getQueryParams = /*
        */
        function (qs) {
            qs = qs.split("+").join(" ");

            var params = {}, tokens, re = /[?&]?([^=]+)=([^&]*)/g;

            while (tokens = re.exec(qs)) {
                params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
            }

            return params;
        };
        return AppFrame;
    })();
    away.AppFrame = AppFrame;

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
