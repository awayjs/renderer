var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var tests;
(function (tests) {
    ///<reference path="../../../build/Away3D.next.d.ts" />
    //<reference path="../../../src/Away3D.ts" />
    (function (events) {
        var EDTest = (function (_super) {
            __extends(EDTest, _super);
            function EDTest() {
                _super.call(this);

                console.log('Before addEventListener: ', this.hasEventListener(away.events.Event.COMPLETE));
                this.addEventListener(away.events.Event.COMPLETE, this.onComplete, this);
                console.log('After addEventListener: ', this.hasEventListener(away.events.Event.COMPLETE));
                this.removeEventListener(away.events.Event.COMPLETE, this.onComplete, this);
                console.log('After removeEventListener: ', this.hasEventListener(away.events.Event.COMPLETE));
            }
            EDTest.prototype.onComplete = function (e) {
            };
            return EDTest;
        })(away.events.EventDispatcher);
        events.EDTest = EDTest;
    })(tests.events || (tests.events = {}));
    var events = tests.events;
})(tests || (tests = {}));
//# sourceMappingURL=EDTest.js.map
