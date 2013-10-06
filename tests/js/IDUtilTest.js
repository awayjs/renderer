var tests;
(function (tests) {
    ///<reference path="../../../build/Away3D.next.d.ts" />
    (function (utils) {
        var IDUtilTest = (function () {
            function IDUtilTest() {
                console.log(away.library.IDUtil.createUID());
            }
            return IDUtilTest;
        })();
        utils.IDUtilTest = IDUtilTest;
    })(tests.utils || (tests.utils = {}));
    var utils = tests.utils;
})(tests || (tests = {}));
//# sourceMappingURL=IDUtilTest.js.map
