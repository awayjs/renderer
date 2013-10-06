var tests;
(function (tests) {
    ///<reference path="../../../build/Away3D.next.d.ts" />
    (function (utils) {
        var ByteArrayTest = (function () {
            function ByteArrayTest() {
                var b1 = new away.utils.ByteArray();
                b1.writeByte(0xFF);
                b1.writeByte(0xEE);
                b1.writeByte(0xDD);
                b1.writeByte(0xCC);
                b1.writeByte(0xBB);
                b1.writeByte(0xAA);

                var b2 = new away.utils.ByteArray();
                b2.writeByte(0x00);
                b2.writeByte(0x00);
                b2.writeByte(0x00);
                b2.writeByte(0x00);
                b2.writeByte(0x00);
                b2.writeByte(0x00);

                b2.position = 0;
                b1.position = 0;

                b1.readBytes(b2, 2, 2);

                console.log('b1.position', b1.position);
                console.log('b2.length', b2.length, 'b2.position', b2.position);

                while (b2.getBytesAvailable()) {
                    console.log(b2.readByte().toString(16));
                }
            }
            return ByteArrayTest;
        })();
        utils.ByteArrayTest = ByteArrayTest;
    })(tests.utils || (tests.utils = {}));
    var utils = tests.utils;
})(tests || (tests = {}));
//# sourceMappingURL=ByteArrayTest.js.map
