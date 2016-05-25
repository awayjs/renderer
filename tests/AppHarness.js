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
            this.previousBtn.onclick = function () { return _this.nagigateBy(-1); };
            this.nextBtn.onclick = function () { return _this.nagigateBy(1); };
            this.sourceBtn.onclick = function () { return _this.toggleSource(); };
            this.dropDown.onchange = function (e) { return _this.dropDownChange(e); };
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
            if (name === void 0) { name = ''; }
            this.tests.push(new TestData('-- ' + name, '', '', ''));
        };
        /**
         *
         * Start the application harness
         *
         */
        AppHarness.prototype.start = function (slideshowMode) {
            var _this = this;
            if (slideshowMode === void 0) { slideshowMode = false; }
            for (var c = 0; c < this.tests.length; c++) {
                var option = new Option(this.tests[c].name, String(c));
                this.dropDown.add(option);
            }
            if (slideshowMode) {
                setInterval(function () { return _this.nagigateBy(1); }, 15000);
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
            if (direction === void 0) { direction = 1; }
            var l = this.tests.length;
            var nextCounter = this.counter + direction;
            if (nextCounter < 0) {
                nextCounter = this.tests.length - 1;
            }
            else if (nextCounter > this.tests.length - 1) {
                nextCounter = 0;
            }
            var testData = this.tests[nextCounter];
            if (testData.name.indexOf('--') != -1) {
                this.counter = nextCounter;
                this.nagigateBy(direction);
            }
            else {
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
            }
            else {
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
            html += '   <script src="http://gist-it.appspot.com/github/awayjs/awayjs-core-ts/tree/master/tests/' + url + '?footer=no"></script>';
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
            this.counter = this.dropDown.selectedIndex;
            var dataIndex = parseInt(this.dropDown.options[this.dropDown.selectedIndex].value);
            if (!isNaN(dataIndex)) {
                this.navigateToSection(this.tests[dataIndex]);
            }
        };
        return AppHarness;
    }());
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
            script.onload = function () { return _this.jsLoaded(); };
            head.appendChild(script);
        };
        /**
         *
         * Event Handler for loaded JavaScript files
         *
         */
        AppFrame.prototype.jsLoaded = function () {
            var createPath = this.classPath.split('.'); // Split the classpath
            var obj;
            for (var c = 0; c < createPath.length; c++) {
                if (obj == null) {
                    obj = window[createPath[c]]; // reference base module ( will be a child of the window )
                }
                else {
                    obj = obj[createPath[c]]; // reference sub module / Class
                }
            }
            if (obj != null) {
                new obj(); // if Class has been found - start the test
            }
        };
        return AppFrame;
    }());
    away.AppFrame = AppFrame;
    //---------------------------------------------------
    // Common Utilities
    var Utils = (function () {
        function Utils() {
        }
        /**
         *
         * Utility function - Parse a Query formatted string
         *
         * @param qs
         * @returns {{}}
         */
        Utils.getQueryParams = function (qs) {
            qs = qs.split("+").join(" ");
            var params = {}, tokens, re = /[?&]?([^=]+)=([^&]*)/g;
            while (tokens = re.exec(qs)) {
                params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
            }
            return params;
        };
        return Utils;
    }());
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
    }());
})(away || (away = {}));

//# sourceMappingURL=data:application/json;base64,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LENBQUM7WUFFN0IsSUFBSSxNQUFNLEdBQUcsRUFBRSxFQUFFLE1BQU0sRUFDdEIsRUFBRSxHQUFHLHVCQUF1QixDQUFDO1lBRTlCLE9BQU8sTUFBTSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztnQkFDN0IsTUFBTSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsa0JBQWtCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdkUsQ0FBQztZQUVELE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDZixDQUFDO1FBQ0YsWUFBQztJQUFELENBdEJBLEFBc0JDLElBQUE7SUF0QlksVUFBSyxRQXNCakIsQ0FBQTtJQUVFLHFEQUFxRDtJQUNyRCxPQUFPO0lBRVA7UUFPSSxrQkFBYSxJQUFhLEVBQUcsU0FBa0IsRUFBRyxFQUFXLEVBQUcsR0FBWTtZQUV4RSxJQUFJLENBQUMsRUFBRSxHQUFXLEVBQUUsQ0FBQztZQUNyQixJQUFJLENBQUMsU0FBUyxHQUFJLFNBQVMsQ0FBQztZQUM1QixJQUFJLENBQUMsR0FBRyxHQUFVLEdBQUcsQ0FBQztZQUN0QixJQUFJLENBQUMsSUFBSSxHQUFTLElBQUksQ0FBQztRQUMzQixDQUFDO1FBQ0wsZUFBQztJQUFELENBZEEsQUFjQyxJQUFBO0FBQ0wsQ0FBQyxFQW5kTSxJQUFJLEtBQUosSUFBSSxRQW1kViIsImZpbGUiOiJBcHBIYXJuZXNzLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlIGF3YXlcbntcblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gQXBwbGljYXRpb24gSGFybmVzc1xuXG4gICAgZXhwb3J0IGNsYXNzIEFwcEhhcm5lc3NcbiAgICB7XG5cbiAgICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICBwcml2YXRlIHRlc3RzICAgICAgICAgICA6IEFycmF5PFRlc3REYXRhPiA9IG5ldyBBcnJheTxUZXN0RGF0YT4oKTtcbiAgICAgICAgcHJpdmF0ZSBkcm9wRG93biAgICAgICAgOiBIVE1MU2VsZWN0RWxlbWVudDtcbiAgICAgICAgcHJpdmF0ZSBwcmV2aW91c0J0biAgICAgOiBIVE1MQnV0dG9uRWxlbWVudDtcbiAgICAgICAgcHJpdmF0ZSBuZXh0QnRuICAgICAgICAgOiBIVE1MQnV0dG9uRWxlbWVudDtcbiAgICAgICAgcHJpdmF0ZSBzb3VyY2VCdG4gICAgICAgOiBIVE1MQnV0dG9uRWxlbWVudDtcbiAgICAgICAgcHJpdmF0ZSB0ZXN0SWZyYW1lICAgICAgOiBIVE1MSUZyYW1lRWxlbWVudDtcbiAgICAgICAgcHJpdmF0ZSBzcmNJZnJhbWUgICAgICAgOiBIVE1MSUZyYW1lRWxlbWVudDtcbiAgICAgICAgcHJpdmF0ZSBjb3VudGVyICAgICAgICAgOiBudW1iZXIgPSAwO1xuICAgICAgICBwcml2YXRlIHNvdXJjZVZpc2libGUgICA6IGJvb2xlYW4gPSBmYWxzZTtcblx0ICAgIHByaXZhdGUgbG9hZERlZmF1bHQgICAgIDogYm9vbGVhbiA9IHRydWU7XG5cbiAgICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICBjb25zdHJ1Y3RvcigpXG4gICAgICAgIHtcblxuICAgICAgICAgICAgdGhpcy5pbml0RnJhbWVTZXQoKTtcbiAgICAgICAgICAgIHRoaXMuaW5pdEludGVyZmFjZSgpO1xuXG5cbiAgICAgICAgICAgIHRoaXMucHJldmlvdXNCdG4ub25jbGljayAgID0gKCkgPT4gdGhpcy5uYWdpZ2F0ZUJ5KCAtMSApO1xuICAgICAgICAgICAgdGhpcy5uZXh0QnRuLm9uY2xpY2sgICAgICAgPSAoKSA9PiB0aGlzLm5hZ2lnYXRlQnkoIDEgKTtcbiAgICAgICAgICAgIHRoaXMuc291cmNlQnRuLm9uY2xpY2sgICAgID0gKCkgPT4gdGhpcy50b2dnbGVTb3VyY2UoKTtcbiAgICAgICAgICAgIHRoaXMuZHJvcERvd24ub25jaGFuZ2UgICAgICA9ICggZSApID0+IHRoaXMuZHJvcERvd25DaGFuZ2UoIGUgKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICpcbiAgICAgICAgICogTG9hZCBhIHRlc3RcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIGNsYXNzUGF0aCAtIE1vZHVsZSBhbmQgQ2xhc3MgcGF0aCBvZiB0ZXN0XG4gICAgICAgICAqIEBwYXJhbSBqcyBQYXRoIHRvIEphdmFTY3JpcHQgZmlsZVxuICAgICAgICAgKiBAcGFyYW0gdHMgUGF0aCB0byBUeXBlc2NyaXB0IGZpbGUgKCBub3QgeWV0IHVzZWQgLSByZXNlcnZlZCBmb3IgZnV0dXJlIHNob3cgc291cmNlIClcbiAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyBsb2FkKCBjbGFzc1BhdGggOiBzdHJpbmcgLCBqcyA6IHN0cmluZyAsIHRzIDogc3RyaW5nICkgOiB2b2lkXG4gICAgICAgIHtcblxuXHQgICAgICAgIHRoaXMubG9hZEZyb21VUkwoKTtcblxuXHQgICAgICAgIGlmICggdGhpcy5sb2FkRGVmYXVsdCApXG5cdCAgICAgICAge1xuXHQgICAgICAgICAgICB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUoanMsIGpzLCAnP3Rlc3Q9JyArIGpzKTtcblx0ICAgICAgICAgICAgdGhpcy50ZXN0SWZyYW1lLnNyYyA9ICdmcmFtZS5odG1sP25hbWU9JyArIGNsYXNzUGF0aCArICcmanM9JyArIGpzO1xuICAgICAgICAgICAgICAgIHRoaXMuc3JjSWZyYW1lLnNyYyA9IFwiZGF0YTp0ZXh0L2h0bWw7Y2hhcnNldD11dGYtOCxcIiArIHRoaXMuY3JlYXRlU291cmNlVmlld0hUTUwoIHRzICk7XG5cblx0ICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICpcbiAgICAgICAgICogQWRkIGEgdGVzdCB0byB0aGUgQXBwSGFybmVzc1xuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gbmFtZSBOYW1lIG9mIHRlc3RcbiAgICAgICAgICogQHBhcmFtIGNsYXNzUGF0aCAtIE1vZHVsZSBhbmQgQ2xhc3MgcGF0aCBvZiB0ZXN0XG4gICAgICAgICAqIEBwYXJhbSBqcyBQYXRoIHRvIEphdmFTY3JpcHQgZmlsZVxuICAgICAgICAgKiBAcGFyYW0gdHMgUGF0aCB0byBUeXBlc2NyaXB0IGZpbGUgKCBub3QgeWV0IHVzZWQgLSByZXNlcnZlZCBmb3IgZnV0dXJlIHNob3cgc291cmNlIClcbiAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyBhZGRUZXN0KCBuYW1lIDogc3RyaW5nICwgY2xhc3NwYXRoIDogc3RyaW5nICwganMgOiBzdHJpbmcgLCB0cyA6IHN0cmluZyApIDogdm9pZFxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLnRlc3RzLnB1c2ggKCBuZXcgVGVzdERhdGEoIG5hbWUgLCBjbGFzc3BhdGggLCBqcyAsIHRzICkgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKlxuICAgICAgICAgKiBBZGQgYSBzZXBhcmF0b3IgdG8gdGhlIG1lbnVcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIG5hbWVcbiAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyBhZGRTZXBlcmF0b3IoIG5hbWUgOiBzdHJpbmcgPSAnJyApIDogdm9pZFxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLnRlc3RzLnB1c2ggKCBuZXcgVGVzdERhdGEoICctLSAnICsgbmFtZSAsICcnICwgJycgLCAnJykgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKlxuICAgICAgICAgKiBTdGFydCB0aGUgYXBwbGljYXRpb24gaGFybmVzc1xuICAgICAgICAgKlxuICAgICAgICAgKi9cbiAgICAgICAgcHVibGljIHN0YXJ0KCBzbGlkZXNob3dNb2RlIDogYm9vbGVhbiA9IGZhbHNlICkgOiB2b2lkXG4gICAgICAgIHtcbiAgICAgICAgICAgIGZvciAoIHZhciBjIDogbnVtYmVyID0gMCA7IGMgPCB0aGlzLnRlc3RzLmxlbmd0aCA7IGMgKysgIClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2YXIgb3B0aW9uIDogSFRNTE9wdGlvbkVsZW1lbnQgPSA8SFRNTE9wdGlvbkVsZW1lbnQ+IG5ldyBPcHRpb24oIHRoaXMudGVzdHNbY10ubmFtZSAsIFN0cmluZyggYyApICk7XG4gICAgICAgICAgICAgICAgdGhpcy5kcm9wRG93bi5hZGQoIG9wdGlvbiApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIHNsaWRlc2hvd01vZGUgKVxuICAgICAgICAgICAge1xuXG4gICAgICAgICAgICAgICAgc2V0SW50ZXJ2YWwoICgpID0+IHRoaXMubmFnaWdhdGVCeSggMSApICwgMTUwMDApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXHQgICAgcHJpdmF0ZSBsb2FkRnJvbVVSTCgpIDogdm9pZFxuXHQgICAge1xuXHRcdCAgICB2YXIgcXVlcnlQYXJhbXMgOiBhbnkgPSBVdGlscy5nZXRRdWVyeVBhcmFtcyggZG9jdW1lbnQubG9jYXRpb24uc2VhcmNoICk7XG5cblx0XHQgICAgaWYgKCBxdWVyeVBhcmFtcy50ZXN0ICE9IG51bGwgKVxuXHRcdCAgICB7XG5cdFx0XHQgICAgdmFyIGwgOiBudW1iZXIgPSAgdGhpcy50ZXN0cy5sZW5ndGg7XG5cblx0XHRcdCAgICBmb3IgKCB2YXIgYyA6IG51bWJlciA9IDAgOyBjIDwgbCA7IGMgKysgKVxuXHRcdFx0ICAgIHtcblx0XHRcdFx0ICAgIGlmICggdGhpcy50ZXN0c1tjXS5qcyA9PSBxdWVyeVBhcmFtcy50ZXN0IClcblx0XHRcdFx0ICAgIHtcblx0XHRcdFx0XHQgICAgY29uc29sZS5sb2cgKCAnPT09PT09Pj4+PiBMT0FEIFRFU1QnKTtcblxuXHRcdFx0XHRcdCAgICB0aGlzLm5hdmlnYXRlVG9TZWN0aW9uKCB0aGlzLnRlc3RzW2NdICk7XG5cdFx0XHRcdFx0ICAgIHRoaXMubG9hZERlZmF1bHQgPSBmYWxzZTtcblx0XHRcdFx0ICAgIH1cblx0XHRcdCAgICB9XG5cdFx0ICAgIH1cblx0ICAgIH1cbiAgICAgICAgLyoqXG4gICAgICAgICAqXG4gICAgICAgICAqL1xuICAgICAgICBwcml2YXRlIGluaXRJbnRlcmZhY2UoKSA6IHZvaWRcbiAgICAgICAge1xuXG4gICAgICAgICAgICB2YXIgdGVzdFNlbGVjdG9yIDogSFRNTERpdkVsZW1lbnQgICA9IDxIVE1MRGl2RWxlbWVudD4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2RpdicgKTtcbiAgICAgICAgICAgICAgICB0ZXN0U2VsZWN0b3Iuc3R5bGUuY3NzRmxvYXQgICAgID0gJ25vbmUnO1xuICAgICAgICAgICAgICAgIHRlc3RTZWxlY3Rvci5zdHlsZS5wb3NpdGlvbiAgICAgPSAnYWJzb2x1dGUnO1xuICAgICAgICAgICAgICAgIHRlc3RTZWxlY3Rvci5zdHlsZS5ib3R0b20gICAgICAgPSAnMTVweCc7XG4gICAgICAgICAgICAgICAgdGVzdFNlbGVjdG9yLnN0eWxlLndpZHRoICAgICAgICA9ICc2MDBweCc7XG4gICAgICAgICAgICAgICAgdGVzdFNlbGVjdG9yLnN0eWxlLmxlZnQgICAgICAgICA9ICc1MCUnO1xuICAgICAgICAgICAgICAgIHRlc3RTZWxlY3Rvci5zdHlsZS5tYXJnaW5MZWZ0ICAgPSAnLTMwMHB4J1xuICAgICAgICAgICAgICAgIHRlc3RTZWxlY3Rvci5zdHlsZS50ZXh0QWxpZ24gICAgPSAnY2VudGVyJztcblxuXG4gICAgICAgICAgICB0aGlzLmRyb3BEb3duICAgICAgICAgICAgICAgICAgICAgICA9IDxIVE1MU2VsZWN0RWxlbWVudD4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ3NlbGVjdCcgKTtcbiAgICAgICAgICAgIHRoaXMuZHJvcERvd24ubmFtZSAgICAgICAgICAgICAgICAgID0gXCJzZWxlY3RUZXN0RHJvcERvd25cIlxuICAgICAgICAgICAgdGhpcy5kcm9wRG93bi5pZCAgICAgICAgICAgICAgICAgICAgPSBcInNlbGVjdFRlc3RcIlxuXG4gICAgICAgICAgICB0aGlzLnNvdXJjZUJ0biAgICAgICAgICAgICAgICAgICAgICA9IDxIVE1MQnV0dG9uRWxlbWVudD4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2J1dHRvbicgKTtcbiAgICAgICAgICAgIHRoaXMuc291cmNlQnRuLmlubmVySFRNTCAgICAgICAgICAgID0gJ1Nob3cgU291cmNlJztcbiAgICAgICAgICAgIHRoaXMuc291cmNlQnRuLmlkICAgICAgICAgICAgICAgICAgID0gJ3ByZXZpb3VzJztcblxuICAgICAgICAgICAgdGhpcy5wcmV2aW91c0J0biAgICAgICAgICAgICAgICAgICAgPSA8SFRNTEJ1dHRvbkVsZW1lbnQ+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdidXR0b24nICk7XG4gICAgICAgICAgICB0aGlzLnByZXZpb3VzQnRuLmlubmVySFRNTCAgICAgICAgICA9ICc8PCc7XG4gICAgICAgICAgICB0aGlzLnByZXZpb3VzQnRuLmlkICAgICAgICAgICAgICAgICA9ICdwcmV2aW91cyc7XG5cbiAgICAgICAgICAgIHRoaXMubmV4dEJ0biAgICAgICAgICAgICAgICAgICAgICAgID0gPEhUTUxCdXR0b25FbGVtZW50PiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnYnV0dG9uJyApO1xuICAgICAgICAgICAgdGhpcy5uZXh0QnRuLmlubmVySFRNTCAgICAgICAgICAgICAgPSAnPj4nO1xuICAgICAgICAgICAgdGhpcy5uZXh0QnRuLmlkICAgICAgICAgICAgICAgICAgICAgPSAnbmV4dCc7XG5cblxuICAgICAgICAgICAgdGVzdFNlbGVjdG9yLmFwcGVuZENoaWxkKCB0aGlzLnNvdXJjZUJ0biApO1xuICAgICAgICAgICAgdGVzdFNlbGVjdG9yLmFwcGVuZENoaWxkKCB0aGlzLnByZXZpb3VzQnRuICk7XG4gICAgICAgICAgICB0ZXN0U2VsZWN0b3IuYXBwZW5kQ2hpbGQoIHRoaXMuZHJvcERvd24gKTtcbiAgICAgICAgICAgIHRlc3RTZWxlY3Rvci5hcHBlbmRDaGlsZCggdGhpcy5uZXh0QnRuICk7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKCB0ZXN0U2VsZWN0b3IgKTtcbiAgICAgICAgfVxuICAgICAgICAvKipcbiAgICAgICAgICpcbiAgICAgICAgICovXG4gICAgICAgIHByaXZhdGUgaW5pdEZyYW1lU2V0KCkgOiB2b2lkXG4gICAgICAgIHtcblxuICAgICAgICAgICAgdmFyIGlmcmFtZUNvbnRhaW5lciA6IEhUTUxEaXZFbGVtZW50ICAgID0gPEhUTUxEaXZFbGVtZW50PiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnZGl2JyApO1xuICAgICAgICAgICAgICAgIGlmcmFtZUNvbnRhaW5lci5zdHlsZS53aWR0aCAgICAgICAgID0gJzEwMCUnO1xuICAgICAgICAgICAgICAgIGlmcmFtZUNvbnRhaW5lci5zdHlsZS5oZWlnaHQgICAgICAgID0gJzEwMCUnO1xuXG4gICAgICAgICAgICB0aGlzLnRlc3RJZnJhbWUgICAgICAgICAgICAgICAgICAgICAgPSA8SFRNTElGcmFtZUVsZW1lbnQ+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdpZnJhbWUnICk7XG4gICAgICAgICAgICB0aGlzLnRlc3RJZnJhbWUuaWQgICAgICAgICAgICAgICAgICAgPSAndGVzdENvbnRhaW5lcic7XG4gICAgICAgICAgICB0aGlzLnRlc3RJZnJhbWUuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJyM5ZTllOWUnO1xuICAgICAgICAgICAgdGhpcy50ZXN0SWZyYW1lLnN0eWxlLmNzc0Zsb2F0ICAgICAgID0gJ25vbmUnO1xuICAgICAgICAgICAgdGhpcy50ZXN0SWZyYW1lLnN0eWxlLnBvc2l0aW9uICAgICAgID0gJ2Fic29sdXRlJztcbiAgICAgICAgICAgIHRoaXMudGVzdElmcmFtZS5zdHlsZS50b3AgICAgICAgICAgICA9ICcwcHgnO1xuICAgICAgICAgICAgdGhpcy50ZXN0SWZyYW1lLnN0eWxlLmxlZnQgICAgICAgICAgID0gJzBweCc7XG4gICAgICAgICAgICB0aGlzLnRlc3RJZnJhbWUuc3R5bGUuYm9yZGVyICAgICAgICAgPSAnMHB4JztcbiAgICAgICAgICAgIHRoaXMudGVzdElmcmFtZS5zdHlsZS53aWR0aCAgICAgICAgICA9ICcxMDAlJztcbiAgICAgICAgICAgIHRoaXMudGVzdElmcmFtZS5zdHlsZS5oZWlnaHQgICAgICAgICA9ICcxMDAlJztcbiAgICAgICAgICAgIC8vYm90dG9tOiAxMjBweDtcblxuICAgICAgICAgICAgdGhpcy5zcmNJZnJhbWUgICAgICAgICAgICAgICAgICAgICAgICAgID0gPEhUTUxJRnJhbWVFbGVtZW50PiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnaWZyYW1lJyApO1xuICAgICAgICAgICAgdGhpcy5zcmNJZnJhbWUuaWQgICAgICAgICAgICAgICAgICAgICAgID0gJ3Rlc3RTb3VyY2VDb250YWluZXInO1xuICAgICAgICAgICAgdGhpcy5zcmNJZnJhbWUuc3R5bGUuYmFja2dyb3VuZENvbG9yICAgID0gJyM5ZTllOWUnO1xuICAgICAgICAgICAgdGhpcy5zcmNJZnJhbWUuc3R5bGUuY3NzRmxvYXQgICAgICAgICAgID0gJ25vbmUnO1xuICAgICAgICAgICAgdGhpcy5zcmNJZnJhbWUuc3R5bGUucG9zaXRpb24gICAgICAgICAgID0gJ2Fic29sdXRlJztcbiAgICAgICAgICAgIHRoaXMuc3JjSWZyYW1lLnN0eWxlLnJpZ2h0ICAgICAgICAgICAgICA9ICcwcHgnO1xuICAgICAgICAgICAgdGhpcy5zcmNJZnJhbWUuc3R5bGUudG9wICAgICAgICAgICAgICAgID0gJzBweCc7XG4gICAgICAgICAgICB0aGlzLnNyY0lmcmFtZS5zdHlsZS5ib3R0b20gICAgICAgICAgICAgPSAnMHB4JztcbiAgICAgICAgICAgIHRoaXMuc3JjSWZyYW1lLnN0eWxlLmJvcmRlciAgICAgICAgICAgICA9ICcwcHgnO1xuICAgICAgICAgICAgdGhpcy5zcmNJZnJhbWUuc3R5bGUud2lkdGggICAgICAgICAgICAgID0gJzAlJztcbiAgICAgICAgICAgIHRoaXMuc3JjSWZyYW1lLnN0eWxlLmhlaWdodCAgICAgICAgICAgICA9ICcxMDAlJztcblxuICAgICAgICAgICAgaWZyYW1lQ29udGFpbmVyLmFwcGVuZENoaWxkKCB0aGlzLnRlc3RJZnJhbWUgKTtcbiAgICAgICAgICAgIGlmcmFtZUNvbnRhaW5lci5hcHBlbmRDaGlsZCggdGhpcy5zcmNJZnJhbWUgKTtcblxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCggaWZyYW1lQ29udGFpbmVyICk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKlxuICAgICAgICAgKiBTZWxlY3RuZXh0IC8gcHJldmlvdXMgbWVudSBpdGVtXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBkaXJlY3Rpb25cbiAgICAgICAgICovXG4gICAgICAgIHByaXZhdGUgbmFnaWdhdGVCeSggZGlyZWN0aW9uIDogbnVtYmVyID0gMSApIDogdm9pZFxuICAgICAgICB7XG5cbiAgICAgICAgICAgIHZhciBsIDogbnVtYmVyICA9IHRoaXMudGVzdHMubGVuZ3RoO1xuICAgICAgICAgICAgdmFyIG5leHRDb3VudGVyID0gdGhpcy5jb3VudGVyICsgZGlyZWN0aW9uO1xuXG4gICAgICAgICAgICBpZiAoIG5leHRDb3VudGVyIDwgMCApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmV4dENvdW50ZXIgPSB0aGlzLnRlc3RzLmxlbmd0aCAtIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICggbmV4dENvdW50ZXIgPiB0aGlzLnRlc3RzLmxlbmd0aCAtIDEgKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5leHRDb3VudGVyID0gMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHRlc3REYXRhIDogVGVzdERhdGEgPSB0aGlzLnRlc3RzW25leHRDb3VudGVyXTtcblxuICAgICAgICAgICAgaWYgKCB0ZXN0RGF0YS5uYW1lLmluZGV4T2YgKCctLScpICE9IC0xICkgLy8gc2tpcCBzZWN0aW9uIGhlYWRlcnNcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvdW50ZXIgPSBuZXh0Q291bnRlcjtcbiAgICAgICAgICAgICAgICB0aGlzLm5hZ2lnYXRlQnkoIGRpcmVjdGlvbiApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMubmF2aWdhdGVUb1NlY3Rpb24oIHRlc3REYXRhICk7XG4gICAgICAgICAgICAgICAgdGhpcy5kcm9wRG93bi5zZWxlY3RlZEluZGV4ID0gbmV4dENvdW50ZXI7XG4gICAgICAgICAgICAgICAgdGhpcy5jb3VudGVyID0gbmV4dENvdW50ZXI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKlxuICAgICAgICAgKiBOYXZpZ2F0ZSB0byBhIHNlY3Rpb25cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHRlc3REYXRhXG4gICAgICAgICAqL1xuICAgICAgICBwcml2YXRlIG5hdmlnYXRlVG9TZWN0aW9uICggdGVzdERhdGEgOiBUZXN0RGF0YSApIDogdm9pZFxuICAgICAgICB7XG5cdCAgICAgICAgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKHRlc3REYXRhLmpzLCB0ZXN0RGF0YS5qcywgJz90ZXN0PScgKyB0ZXN0RGF0YS5qcyk7XG4gICAgICAgICAgICB0aGlzLnNyY0lmcmFtZS5zcmMgPSBcImRhdGE6dGV4dC9odG1sO2NoYXJzZXQ9dXRmLTgsXCIgKyB0aGlzLmNyZWF0ZVNvdXJjZVZpZXdIVE1MKCB0ZXN0RGF0YS5zcmMgKTtcbiAgICAgICAgICAgIHRoaXMudGVzdElmcmFtZS5zcmMgPSAnZnJhbWUuaHRtbD9uYW1lPScgKyB0ZXN0RGF0YS5jbGFzc3BhdGggKyAnJmpzPScgKyB0ZXN0RGF0YS5qcztcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgdG9nZ2xlU291cmNlKCkgOiB2b2lkXG4gICAgICAgIHtcblxuICAgICAgICAgICAgaWYgKCB0aGlzLnNvdXJjZVZpc2libGUgKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMudGVzdElmcmFtZS5zdHlsZS53aWR0aCAgICAgICAgID0gJzEwMCUnO1xuICAgICAgICAgICAgICAgIHRoaXMuc3JjSWZyYW1lLnN0eWxlLndpZHRoICAgICAgICAgID0gJzAlJztcbiAgICAgICAgICAgICAgICB0aGlzLnNvdXJjZUJ0bi5pbm5lckhUTUwgICAgICAgICAgICA9ICdTaG93IFNvdXJjZSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy50ZXN0SWZyYW1lLnN0eWxlLndpZHRoICAgICAgICAgPSAnMjAlJztcbiAgICAgICAgICAgICAgICB0aGlzLnNyY0lmcmFtZS5zdHlsZS53aWR0aCAgICAgICAgICA9ICc4MCUnO1xuICAgICAgICAgICAgICAgIHRoaXMuc291cmNlQnRuLmlubmVySFRNTCAgICAgICAgICAgID0gJ0hpZGUgU291cmNlJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5zb3VyY2VWaXNpYmxlID0gIXRoaXMuc291cmNlVmlzaWJsZTtcblxuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBjcmVhdGVTb3VyY2VWaWV3SFRNTCAoIHVybCA6IHN0cmluZyApIDogc3RyaW5nXG4gICAgICAgIHtcblxuICAgICAgICAgICAgdmFyIGh0bWwgOiBzdHJpbmcgPSAnJztcblxuICAgICAgICAgICAgaHRtbCArPSAnPCFET0NUWVBFIGh0bWw+JztcbiAgICAgICAgICAgIGh0bWwgKz0gJzxodG1sPic7XG4gICAgICAgICAgICBodG1sICs9ICcgICA8aGVhZD4nO1xuICAgICAgICAgICAgaHRtbCArPSAnICAgICAgIDx0aXRsZT48L3RpdGxlPic7XG4gICAgICAgICAgICBodG1sICs9ICcgICAgICAgPHN0eWxlPic7XG4gICAgICAgICAgICBodG1sICs9ICcgICAgICAgICAgIGh0bWwnO1xuICAgICAgICAgICAgaHRtbCArPSAnICAgICAgICAgICB7JztcbiAgICAgICAgICAgIGh0bWwgKz0gJyAgICAgICAgICAgICAgIGhlaWdodDogMTAwJTsnO1xuICAgICAgICAgICAgaHRtbCArPSAnICAgICAgICAgICAgICAgYm9yZGVyOiAwcHg7JztcbiAgICAgICAgICAgIGh0bWwgKz0gJyAgICAgICAgICAgICAgIHBhZGRpbmc6IDBweDsnO1xuICAgICAgICAgICAgaHRtbCArPSAnICAgICAgICAgIH0nO1xuICAgICAgICAgICAgaHRtbCArPSAnICAgICAgIDwvc3R5bGU+Jztcblx0ICAgICAgICBodG1sICs9ICcgICA8c2NyaXB0IHNyYz1cImh0dHA6Ly9naXN0LWl0LmFwcHNwb3QuY29tL2dpdGh1Yi9hd2F5anMvYXdheWpzLWNvcmUtdHMvdHJlZS9tYXN0ZXIvdGVzdHMvJyArIHVybCArICc/Zm9vdGVyPW5vXCI+PC9zY3JpcHQ+JztcbiAgICAgICAgICAgIGh0bWwgKz0gJzwvaGVhZD4nO1xuICAgICAgICAgICAgaHRtbCArPSAnPGJvZHk+JztcbiAgICAgICAgICAgIGh0bWwgKz0gJzwvYm9keT4nO1xuICAgICAgICAgICAgaHRtbCArPSAnPC9odG1sPic7XG5cbiAgICAgICAgICAgIHJldHVybiBodG1sO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gVXRpbHNcblxuICAgICAgICAvKipcbiAgICAgICAgICpcbiAgICAgICAgICogVXRpbCBmdW5jdGlvbiAtIGdldCBFbGVtZW50IGJ5IElEXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBpZFxuICAgICAgICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnR9XG4gICAgICAgICAqL1xuICAgICAgICBwcml2YXRlIGdldElkKGlkIDogc3RyaW5nICkgOiBIVE1MRWxlbWVudFxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIGlkICk7XG4gICAgICAgIH1cblxuICAgICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBFdmVudHNcblxuICAgICAgICAvKipcbiAgICAgICAgICpcbiAgICAgICAgICogRHJvcGJveCBldmVudCBoYW5kbGVyXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBlXG4gICAgICAgICAqL1xuICAgICAgICBwcml2YXRlIGRyb3BEb3duQ2hhbmdlKCBlICkgOiB2b2lkXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuY291bnRlciA9IHRoaXMuZHJvcERvd24uc2VsZWN0ZWRJbmRleDtcbiAgICAgICAgICAgIHZhciBkYXRhSW5kZXggOiBudW1iZXIgPSBwYXJzZUludCggKDxIVE1MT3B0aW9uRWxlbWVudD4gdGhpcy5kcm9wRG93bi5vcHRpb25zW3RoaXMuZHJvcERvd24uc2VsZWN0ZWRJbmRleF0pLnZhbHVlICkgO1xuXG4gICAgICAgICAgICBpZiAoICEgaXNOYU4oIGRhdGFJbmRleCApIClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLm5hdmlnYXRlVG9TZWN0aW9uKCB0aGlzLnRlc3RzW2RhdGFJbmRleF0gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBBcHBsaWNhdGlvbiBGcmFtZVxuXG4gICAgZXhwb3J0IGNsYXNzIEFwcEZyYW1lXG4gICAge1xuXG4gICAgICAgIHByaXZhdGUgY2xhc3NQYXRoICAgOiBzdHJpbmcgPSAnJztcbiAgICAgICAgcHJpdmF0ZSBqc1BhdGggICAgICA6IHN0cmluZyA9ICcnO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCApXG4gICAgICAgIHtcblxuICAgICAgICAgICAgdmFyIHF1ZXJ5UGFyYW1zIDogYW55ID0gVXRpbHMuZ2V0UXVlcnlQYXJhbXMoIGRvY3VtZW50LmxvY2F0aW9uLnNlYXJjaCApO1xuXG4gICAgICAgICAgICBpZiAoIHF1ZXJ5UGFyYW1zLmpzICE9IHVuZGVmaW5lZCAmJiBxdWVyeVBhcmFtcy5uYW1lICE9IHVuZGVmaW5lZCApXG4gICAgICAgICAgICB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmpzUGF0aCAgICAgPSBxdWVyeVBhcmFtcy5qcztcbiAgICAgICAgICAgICAgICB0aGlzLmNsYXNzUGF0aCAgPSBxdWVyeVBhcmFtcy5uYW1lO1xuICAgICAgICAgICAgICAgIHRoaXMubG9hZEpTKCB0aGlzLmpzUGF0aCApO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKlxuICAgICAgICAgKiBMb2FkIGEgSmF2YVNjcmlwdCBmaWxlXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB1cmwgLSBVUkwgb2YgSmF2YVNjcmlwdCBmaWxlXG4gICAgICAgICAqL1xuICAgICAgICBwcml2YXRlIGxvYWRKUyh1cmwgOiBzdHJpbmcgKVxuICAgICAgICB7XG5cbiAgICAgICAgICAgIHZhciBoZWFkIDogSFRNTEVsZW1lbnQgPSA8SFRNTEVsZW1lbnQ+IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaGVhZFwiKVswXTtcbiAgICAgICAgICAgIHZhciBzY3JpcHQgOiBIVE1MU2NyaXB0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XG4gICAgICAgICAgICBzY3JpcHQudHlwZSAgICAgPSBcInRleHQvamF2YXNjcmlwdFwiO1xuICAgICAgICAgICAgc2NyaXB0LnNyYyAgICAgID0gdXJsO1xuICAgICAgICAgICAgc2NyaXB0Lm9ubG9hZCAgID0gKCkgPT4gdGhpcy5qc0xvYWRlZCgpO1xuXG4gICAgICAgICAgICBoZWFkLmFwcGVuZENoaWxkKHNjcmlwdCk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICpcbiAgICAgICAgICogRXZlbnQgSGFuZGxlciBmb3IgbG9hZGVkIEphdmFTY3JpcHQgZmlsZXNcbiAgICAgICAgICpcbiAgICAgICAgICovXG4gICAgICAgIHByaXZhdGUganNMb2FkZWQoKVxuICAgICAgICB7XG5cbiAgICAgICAgICAgIHZhciBjcmVhdGVQYXRoIDogQXJyYXk8c3RyaW5nPiA9IHRoaXMuY2xhc3NQYXRoLnNwbGl0KCcuJyk7IC8vIFNwbGl0IHRoZSBjbGFzc3BhdGhcbiAgICAgICAgICAgIHZhciBvYmogICAgICAgICA6IGFueTtcblxuICAgICAgICAgICAgZm9yICggdmFyIGMgOiBudW1iZXIgPSAwIDsgYyA8IGNyZWF0ZVBhdGgubGVuZ3RoIDsgYysrIClcbiAgICAgICAgICAgIHtcblxuICAgICAgICAgICAgICAgIGlmICggb2JqID09IG51bGwgKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgb2JqID0gd2luZG93W2NyZWF0ZVBhdGhbY11dOyAvLyByZWZlcmVuY2UgYmFzZSBtb2R1bGUgKCB3aWxsIGJlIGEgY2hpbGQgb2YgdGhlIHdpbmRvdyApXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG9iaiA9IG9ialtjcmVhdGVQYXRoW2NdXTsgLy8gcmVmZXJlbmNlIHN1YiBtb2R1bGUgLyBDbGFzc1xuICAgICAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICggb2JqICE9IG51bGwgKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5ldyBvYmooKTsgLy8gaWYgQ2xhc3MgaGFzIGJlZW4gZm91bmQgLSBzdGFydCB0aGUgdGVzdFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuXG5cbiAgICB9XG5cblx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Ly8gQ29tbW9uIFV0aWxpdGllc1xuXG5cdGV4cG9ydCBjbGFzcyBVdGlsc1xuXHR7XG5cdFx0LyoqXG5cdFx0ICpcblx0XHQgKiBVdGlsaXR5IGZ1bmN0aW9uIC0gUGFyc2UgYSBRdWVyeSBmb3JtYXR0ZWQgc3RyaW5nXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0gcXNcblx0XHQgKiBAcmV0dXJucyB7e319XG5cdFx0ICovXG5cdFx0c3RhdGljIGdldFF1ZXJ5UGFyYW1zKCBxcyApIDogT2JqZWN0IHtcblxuXHRcdFx0cXMgPSBxcy5zcGxpdChcIitcIikuam9pbihcIiBcIik7XG5cblx0XHRcdHZhciBwYXJhbXMgPSB7fSwgdG9rZW5zLFxuXHRcdFx0XHRyZSA9IC9bPyZdPyhbXj1dKyk9KFteJl0qKS9nO1xuXG5cdFx0XHR3aGlsZSAodG9rZW5zID0gcmUuZXhlYyhxcykpIHtcblx0XHRcdFx0cGFyYW1zW2RlY29kZVVSSUNvbXBvbmVudCh0b2tlbnNbMV0pXSA9IGRlY29kZVVSSUNvbXBvbmVudCh0b2tlbnNbMl0pO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gcGFyYW1zO1xuXHRcdH1cblx0fVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBEYXRhXG5cbiAgICBjbGFzcyBUZXN0RGF0YVxuICAgIHtcbiAgICAgICAgcHVibGljIGpzICAgICAgICAgICA6IHN0cmluZztcbiAgICAgICAgcHVibGljIGNsYXNzcGF0aCAgICA6IHN0cmluZztcbiAgICAgICAgcHVibGljIHNyYyAgICAgICAgICA6IHN0cmluZztcbiAgICAgICAgcHVibGljIG5hbWUgICAgICAgICA6IHN0cmluZztcblxuICAgICAgICBjb25zdHJ1Y3RvciggbmFtZSA6IHN0cmluZyAsIGNsYXNzcGF0aCA6IHN0cmluZyAsIGpzIDogc3RyaW5nICwgc3JjIDogc3RyaW5nIClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5qcyAgICAgICAgID0ganM7XG4gICAgICAgICAgICB0aGlzLmNsYXNzcGF0aCAgPSBjbGFzc3BhdGg7XG4gICAgICAgICAgICB0aGlzLnNyYyAgICAgICAgPSBzcmM7XG4gICAgICAgICAgICB0aGlzLm5hbWUgICAgICAgPSBuYW1lO1xuICAgICAgICB9XG4gICAgfVxufSJdLCJzb3VyY2VSb290IjoiLi90ZXN0cyJ9
