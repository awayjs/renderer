var tests;
(function (tests) {
    ///<reference path="../../../build/Away3D.next.d.ts" />
    //<reference path="../../../src/Away3D.ts" />
    (function (geom) {
        var MatrixTest = (function () {
            function MatrixTest() {
                this.ma = new away.geom.Matrix(10, 11, 12, 13, 14, 15);
                this.mb = new away.geom.Matrix(0, 1, 2, 3, 4, 5);
                this.ma.concat(this.mb);
                console.log(this.ma);
            }
            return MatrixTest;
        })();
        geom.MatrixTest = MatrixTest;
    })(tests.geom || (tests.geom = {}));
    var geom = tests.geom;
})(tests || (tests = {}));
//# sourceMappingURL=MatrixTest.js.map
