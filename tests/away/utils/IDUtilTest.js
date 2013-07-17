var away;
(function (away) {
    (function (library) {
        var IDUtil = (function () {
            function IDUtil() {
            }
            IDUtil.createUID = /**
            *  Generates a UID (unique identifier) based on ActionScript's
            *  pseudo-random number generator and the current time.
            *
            *  <p>The UID has the form
            *  <code>"XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"</code>
            *  where X is a hexadecimal digit (0-9, A-F).</p>
            *
            *  <p>This UID will not be truly globally unique; but it is the best
            *  we can do without player support for UID generation.</p>
            *
            *  @return The newly-generated UID.
            *
            *  @langversion 3.0
            *  @playerversion Flash 9
            *  @playerversion AIR 1.1
            *  @productversion Flex 3
            */
            function () {
                var uid = new Array(36);
                var index = 0;

                var i;
                var j;

                for (i = 0; i < 8; i++)
                    uid[index++] = IDUtil.ALPHA_CHAR_CODES[Math.floor(Math.random() * 16)];

                for (i = 0; i < 3; i++) {
                    uid[index++] = 45;

                    for (j = 0; j < 4; j++)
                        uid[index++] = IDUtil.ALPHA_CHAR_CODES[Math.floor(Math.random() * 16)];
                }

                uid[index++] = 45;

                var time = new Date().getTime();

                // Note: time is the number of milliseconds since 1970,
                // which is currently more than one trillion.
                // We use the low 8 hex digits of this number in the UID.
                // Just in case the system clock has been reset to
                // Jan 1-4, 1970 (in which case this number could have only
                // 1-7 hex digits), we pad on the left with 7 zeros
                // before taking the low digits.
                var timeString = ("0000000" + time.toString(16).toUpperCase()).substr(-8);

                for (i = 0; i < 8; i++)
                    uid[index++] = timeString.charCodeAt(i);

                for (i = 0; i < 4; i++)
                    uid[index++] = IDUtil.ALPHA_CHAR_CODES[Math.floor(Math.random() * 16)];

                return String.fromCharCode.apply(null, uid);
            };
            IDUtil.ALPHA_CHAR_CODES = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 68, 69, 70];
            return IDUtil;
        })();
        library.IDUtil = IDUtil;
    })(away.library || (away.library = {}));
    var library = away.library;
})(away || (away = {}));
///<reference path="../src/away/library/utils/IDUtil.ts" />
//------------------------------------------------------------------------------------------------
// Web / PHP Storm arguments string
//------------------------------------------------------------------------------------------------
// --sourcemap $ProjectFileDir$/tests/IDUtilTest.ts --target ES5 --comments --out $ProjectFileDir$/tests/IDUtilTest.js
//------------------------------------------------------------------------------------------------
var IDUtilTest = (function () {
    function IDUtilTest() {
        console.log(away.library.IDUtil.createUID());
    }
    return IDUtilTest;
})();

var test;
window.onload = function () {
    test = new IDUtilTest();
};
//@ sourceMappingURL=IDUtilTest.js.map
