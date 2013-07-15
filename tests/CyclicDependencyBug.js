var ZeBug;
(function (ZeBug) {
    var Base = (function () {
        function Base() {
        }
        Base.prototype.sayBase = function () {
            console.log('sayBase');
        };
        return Base;
    })();
    ZeBug.Base = Base;
})(ZeBug || (ZeBug = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
///<reference path="FooA.ts" />
var ZeBug;
(function (ZeBug) {
    var FooC = (function (_super) {
        __extends(FooC, _super);
        function FooC() {
            _super.call(this);
        }
        FooC.prototype.sayFooC = function () {
            console.log('say fooC');
        };
        return FooC;
    })(ZeBug.FooA);
    ZeBug.FooC = FooC;
})(ZeBug || (ZeBug = {}));
///<reference path="Base.ts" />
///<reference path="FooC.ts" />
var ZeBug;
(function (ZeBug) {
    var FooA = (function (_super) {
        __extends(FooA, _super);
        function FooA() {
            _super.call(this);
            this.fooc = new ZeBug.FooC();
            console.log('FooA');
        }
        FooA.prototype.sayFooA = function () {
            console.log('say fooA');
        };
        return FooA;
    })(ZeBug.Base);
    ZeBug.FooA = FooA;
})(ZeBug || (ZeBug = {}));
///<reference path="ts/FooA.ts" />
///<reference path="ts/FooC.ts" />
// --sourcemap $ProjectFileDir$/tests/CyclicDependencyBug.ts --target ES5 --comments --out $ProjectFileDir$/tests/CyclicDependencyBug.js
var TestCDB = (function () {
    function TestCDB() {
        this.fooA = new ZeBug.FooA();
        this.fooA.sayBase();

        this.fooC = new ZeBug.FooC();
        this.fooC.sayFooA();
    }
    return TestCDB;
})();

var test;

window.onload = function () {
    test = new TestCDB();
};
//@ sourceMappingURL=CyclicDependencyBug.js.map
